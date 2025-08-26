import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  Wallet, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Users,
  Star,
  X,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PROTOCOL_CONFIG } from '../config/web3';
import toast from 'react-hot-toast';

const Auth = ({ onClose }) => {
  const { connectAndSwitch, activateUser } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState('connect'); // connect, referral, complete

  const handleReferralCodeChange = (e) => {
    setReferralCode(e.target.value.toUpperCase());
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const validateReferralCode = () => {
    if (!referralCode) return false;
    if (referralCode.length !== 5) return false;
    return /^[A-Z0-9]+$/.test(referralCode);
  };

  const validateUsername = () => {
    if (!username) return false;
    if (username.length < 3) return false;
    return /^[a-zA-Z0-9_]+$/.test(username);
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectAndSwitch();
      setStep('referral');
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleActivateAccount = async () => {
    if (!validateReferralCode()) {
      toast.error('Please enter a valid 5-character referral code');
      return;
    }

    if (!validateUsername()) {
      toast.error('Username must be at least 3 characters and contain only letters, numbers, and underscores');
      return;
    }

    try {
      const success = await activateUser(referralCode);
      if (success) {
        setStep('complete');
        toast.success('Account activated successfully! Welcome to Smash Protocol!');
      } else {
        toast.error('Invalid referral code. Please try again.');
      }
    } catch (error) {
      console.error('Activation error:', error);
      toast.error('Failed to activate account. Please try again.');
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 'connect':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-smash-primary to-smash-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-6">
              Connect your Web3 wallet to join the Smash Protocol ecosystem
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-smash-success" />
                <span className="text-sm text-gray-700">Secure wallet connection</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Zap className="w-5 h-5 text-smash-primary" />
                <span className="text-sm text-gray-700">Access to mining and rewards</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-smash-secondary" />
                <span className="text-sm text-gray-700">Join referral networks</span>
              </div>
            </div>
            
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                isConnecting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-smash-primary hover:bg-smash-secondary text-white hover:scale-105'
              }`}
            >
              {isConnecting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Connect Wallet</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              We'll automatically switch your wallet to IRYS Testnet
            </p>
          </div>
        );

      case 'referral':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-smash-success to-smash-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Join the Ecosystem</h3>
            <p className="text-gray-600 mb-6">
              Enter a referral code to activate your account and start earning SMASH
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Referral Code
                </label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={referralCode}
                    onChange={handleReferralCodeChange}
                    className="input-field pl-10 text-center text-lg font-mono tracking-widest"
                    placeholder="HIRYS"
                    maxLength={5}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 5-character referral code (e.g., {PROTOCOL_CONFIG.MASTER_CODE})
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Choose Username
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    className="input-field pl-10"
                    placeholder="Enter your username"
                    maxLength={20}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be your identity in the Smash Protocol ecosystem
                </p>
              </div>
            </div>
            
            <button
              onClick={handleActivateAccount}
              disabled={!validateReferralCode() || !validateUsername()}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                !validateReferralCode() || !validateUsername()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-smash-success hover:bg-smash-success/80 text-white hover:scale-105'
              }`}
            >
              Activate Account
            </button>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">Need a referral code?</p>
                  <p className="text-xs text-blue-700">
                    Use the master code <span className="font-mono font-semibold">{PROTOCOL_CONFIG.MASTER_CODE}</span> to join directly
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-smash-success to-smash-accent rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Star className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Smash Protocol!</h3>
            <p className="text-gray-600 mb-6">
              Your account has been activated successfully. You're now part of the ecosystem!
            </p>
            
            <div className="bg-gradient-to-r from-smash-primary/10 to-smash-secondary/10 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Username</p>
                  <p className="font-semibold text-gray-900">{username}</p>
                </div>
                <div>
                  <p className="text-gray-600">Referral Code</p>
                  <p className="font-mono font-semibold text-smash-primary">{referralCode}</p>
                </div>
                <div>
                  <p className="text-gray-600">Activation Bonus</p>
                  <p className="font-semibold text-smash-success">+200 SMASH</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-semibold text-smash-success">Active</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-smash-primary hover:bg-smash-secondary text-white rounded-xl font-semibold transition-colors"
            >
              Start Earning SMASH
            </button>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                You can now start mining, watch rewarded ads, and participate in daily quizzes to earn SMASH tokens.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 'connect' ? 'Connect Wallet' : 
             step === 'referral' ? 'Join Ecosystem' : 'Welcome!'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* AnimatePresence is not imported, so this will cause an error.
              Assuming it's meant to be removed or replaced with a different animation library.
              For now, I'll remove it as it's not part of the provided code. */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getStepContent()}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
