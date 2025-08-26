import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../config/firebase';
import { 
  connectWallet, 
  switchToIrysTestnet, 
  IRYS_CONFIG,
  PROTOCOL_CONFIG
} from '../config/web3';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  increment
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [network, setNetwork] = useState(null);
  const [userData, setUserData] = useState(null);

  // Check if wallet is connected to IRYS testnet
  const checkNetwork = useCallback(async () => {
    try {
      if (wallet?.provider) {
        const network = await wallet.provider.getNetwork();
        // eslint-disable-next-line no-undef
        const isIrysTestnet = network.chainId === BigInt(IRYS_CONFIG.CHAIN_ID);
        setNetwork(isIrysTestnet ? 'irys-testnet' : 'wrong-network');
        return isIrysTestnet;
      }
      return false;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  }, [wallet?.provider]);

  // Connect wallet and switch to IRYS testnet
  const connectAndSwitch = async () => {
    try {
      setLoading(true);
      const walletData = await connectWallet();
      setWallet(walletData);
      
      // Switch to IRYS testnet
      await switchToIrysTestnet();
      await checkNetwork();
      
      // Save wallet connection to user profile
      if (user) {
        await updateUserWallet(walletData.address);
      }
      
      return walletData;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet(null);
    setNetwork(null);
    if (user) {
      updateUserWallet(null);
    }
  };

  // Update user's wallet address in Firebase
  const updateUserWallet = async (address) => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          walletAddress: address,
          lastWalletUpdate: new Date()
        });
      } catch (error) {
        console.error('Error updating user wallet:', error);
      }
    }
  };

  // Get or create user data
  const getUserData = useCallback(async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        // Create new user profile
        const newUserData = {
          uid,
          username: null,
          email: user.email,
          walletAddress: null,
          referralCode: null,
          referredBy: null,
          smashBalance: 0,
          totalEarned: 0,
          miningStreak: 0,
          knowledgeStreak: 0,
          totalReferrals: 0,
          directReferrals: 0,
          indirectReferrals: 0,
          lastMining: null,
          lastQuiz: null,
          dailyAdsWatched: 0,
          lastAdReset: null,
          achievements: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(userRef, newUserData);
        return newUserData;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }, [user?.email]);

  // Generate unique referral code
  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Activate user with referral code
  const activateUser = async (referralCode) => {
    if (!user || !wallet) return false;
    
    try {
      // Check if referral code is valid
      if (referralCode === PROTOCOL_CONFIG.MASTER_CODE) {
        // Master code activation
        await activateWithMasterCode();
        return true;
      }
      
      // Regular referral code activation
      const isValid = await validateReferralCode(referralCode);
      if (isValid) {
        await activateWithReferralCode(referralCode);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error activating user:', error);
      return false;
    }
  };

  // Activate with master code
  const activateWithMasterCode = async () => {
    const userRef = doc(db, 'users', user.uid);
    const referralCode = generateReferralCode();
    
    await updateDoc(userRef, {
      isActivated: true,
      referralCode,
      referredBy: 'MASTER',
      smashBalance: PROTOCOL_CONFIG.ACTIVATION_BONUS,
      totalEarned: PROTOCOL_CONFIG.ACTIVATION_BONUS,
      activatedAt: new Date(),
      updatedAt: new Date()
    });
    
    setUserData(prev => ({
      ...prev,
      isActivated: true,
      referralCode,
      referredBy: 'MASTER',
      smashBalance: PROTOCOL_CONFIG.ACTIVATION_BONUS,
      totalEarned: PROTOCOL_CONFIG.ACTIVATION_BONUS
    }));
  };

  // Activate with referral code
  const activateWithReferralCode = async (referralCode) => {
    // Find referrer
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralCode', '==', referralCode));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return false;
    
    const referrer = querySnapshot.docs[0].data();
    const userRef = doc(db, 'users', user.uid);
    const newReferralCode = generateReferralCode();
    
    // Update user
    await updateDoc(userRef, {
      isActivated: true,
      referralCode: newReferralCode,
      referredBy: referrer.uid,
      smashBalance: PROTOCOL_CONFIG.ACTIVATION_BONUS,
      totalEarned: PROTOCOL_CONFIG.ACTIVATION_BONUS,
      activatedAt: new Date(),
      updatedAt: new Date()
    });
    
    // Update referrer
    const referrerRef = doc(db, 'users', referrer.uid);
    await updateDoc(referrerRef, {
      totalReferrals: referrer.totalReferrals + 1,
      directReferrals: referrer.directReferrals + 1,
      updatedAt: new Date()
    });
    
    setUserData(prev => ({
      ...prev,
      isActivated: true,
      referralCode: newReferralCode,
      referredBy: referrer.uid,
      smashBalance: PROTOCOL_CONFIG.ACTIVATION_BONUS,
      totalEarned: PROTOCOL_CONFIG.ACTIVATION_BONUS
    }));
    
    return true;
  };

  // Validate referral code
  const validateReferralCode = async (code) => {
    if (code.length !== 5) return false;
    
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralCode', '==', code));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  };

  // Handle referral rewards locally (no Cloud Functions needed)
  const handleReferralRewards = async (referrerUid, amount) => {
    try {
      if (!referrerUid || referrerUid === 'MASTER') return;
      
      const referrerRef = doc(db, 'users', referrerUid);
      
      // Update referrer's direct referral earnings
      await updateDoc(referrerRef, {
        directReferralEarnings: increment(amount * PROTOCOL_CONFIG.DIRECT_REFERRAL_REWARD),
        totalEarned: increment(amount * PROTOCOL_CONFIG.DIRECT_REFERRAL_REWARD)
      });
      
      // Find indirect referrer (referrer's referrer)
      const referrerDoc = await getDoc(referrerRef);
      if (referrerDoc.exists() && referrerDoc.data().referredBy && referrerDoc.data().referredBy !== 'MASTER') {
        const indirectRef = doc(db, 'users', referrerDoc.data().referredBy);
        await updateDoc(indirectRef, {
          indirectReferralEarnings: increment(amount * PROTOCOL_CONFIG.INDIRECT_REFERRAL_REWARD),
          totalEarned: increment(amount * PROTOCOL_CONFIG.INDIRECT_REFERRAL_REWARD)
        });
      }
    } catch (error) {
      console.error('Error handling referral rewards:', error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
        setWallet(null);
        setNetwork(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [getUserData]);

  // Check network when wallet changes
  useEffect(() => {
    if (wallet) {
      checkNetwork();
    }
  }, [wallet, checkNetwork]);

  const value = {
    wallet,
    user,
    userData,
    loading,
    network,
    connectAndSwitch,
    disconnectWallet,
    activateUser,
    checkNetwork,
    updateUserWallet,
    handleReferralRewards
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
