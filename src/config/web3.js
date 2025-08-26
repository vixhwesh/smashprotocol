import { ethers } from 'ethers';

// IRYS Testnet Configuration
export const IRYS_CONFIG = {
  NETWORK: 'Irys Testnet v1',
  RPC_ENDPOINT: 'https://testnet-rpc.irys.xyz/v1/execution-rpc',
  CHAIN_ID: 1270,
  EXPLORER: 'https://testnet-explorer.irys.xyz',
  NATIVE_CURRENCY: 'IRYS',
  TREASURY_ADDRESS: '0xA13351981c18D8A459f8CDCcC9Fd34966f5FF215',
  MINING_FEE: '0.001', // IRYS fee for mining
  BLOCK_TIME: 2, // seconds
};

// Protocol Configuration
export const PROTOCOL_CONFIG = {
  MASTER_CODE: 'HIRYS',
  REFERRAL_CODE_LENGTH: 5,
  MINING_CYCLE_HOURS: 24,
  ACTIVATION_BONUS: 200, // SMASH
  DIRECT_REFERRAL_REWARD: 0.10, // 10%
  INDIRECT_REFERRAL_REWARD: 0.05, // 5%
  MAX_DAILY_ADS: 5,
  QUIZ_REWARD: 50, // SMASH per correct answer
};

// Streak Milestones
export const STREAK_MILESTONES = {
  MINING: [3, 7, 14, 30, 50, 60],
  KNOWLEDGE: [7, 15, 30],
  NETWORK: [1, 3, 5, 10, 25, 50, 100, 250, 500]
};

// Initialize Web3 Provider
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(IRYS_CONFIG.RPC_ENDPOINT);
};

// Connect Wallet
export const connectWallet = async () => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        const provider = getProvider();
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        
        return {
          address,
          balance: ethers.formatEther(balance),
          provider,
          signer
        };
      }
    }
    throw new Error('No wallet found');
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Switch to IRYS Testnet
export const switchToIrysTestnet = async () => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${IRYS_CONFIG.CHAIN_ID.toString(16)}` }],
      });
    }
  } catch (error) {
    if (error.code === 4902) {
      // Chain not added, add it
      await addIrysTestnet();
    }
    throw error;
  }
};

// Add IRYS Testnet to wallet
export const addIrysTestnet = async () => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${IRYS_CONFIG.CHAIN_ID.toString(16)}`,
          chainName: IRYS_CONFIG.NETWORK,
          nativeCurrency: {
            name: IRYS_CONFIG.NATIVE_CURRENCY,
            symbol: IRYS_CONFIG.NATIVE_CURRENCY,
            decimals: 18
          },
          rpcUrls: [IRYS_CONFIG.RPC_ENDPOINT],
          blockExplorerUrls: [IRYS_CONFIG.EXPLORER]
        }]
      });
    }
  } catch (error) {
    console.error('Error adding IRYS testnet:', error);
    throw error;
  }
};

// Send mining fee
export const sendMiningFee = async (signer) => {
  try {
    const feeWei = ethers.parseEther(IRYS_CONFIG.MINING_FEE);
    const tx = await signer.sendTransaction({
      to: IRYS_CONFIG.TREASURY_ADDRESS,
      value: feeWei
    });
    
    return await tx.wait();
  } catch (error) {
    console.error('Error sending mining fee:', error);
    throw error;
  }
};
