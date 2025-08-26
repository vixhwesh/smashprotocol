import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { RewardedVideo, ADSENSE_CONFIG } from '../config/adsense';
import toast from 'react-hot-toast';

const RewardedAds = ({ onAdComplete, onClose }) => {
  const { userData } = useWeb3();
  const [adState, setAdState] = useState('ready'); // ready, loading, playing, completed, error
  const [adProgress, setAdProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [adDuration] = useState(ADSENSE_CONFIG.MIN_AD_DURATION);
  const [dailyAdsWatched, setDailyAdsWatched] = useState(userData?.dailyAdsWatched || 0);
  const [rewardedVideo] = useState(() => new RewardedVideo());

  useEffect(() => {
    if (adState === 'playing') {
      const interval = setInterval(() => {
        setAdProgress(prev => {
          const newProgress = prev + (100 / adDuration);
          if (newProgress >= 100) {
            setAdState('completed');
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 1000);

      const timeInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timeInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(timeInterval);
      };
    }
  }, [adState, adDuration]);

  // Cleanup AdSense instance on unmount
  useEffect(() => {
    return () => {
      rewardedVideo.destroy();
    };
  }, [rewardedVideo]);

  const startAd = async () => {
    if (dailyAdsWatched >= ADSENSE_CONFIG.MAX_DAILY_ADS) {
      toast.error('Daily ad limit reached');
      return;
    }

    setAdState('loading');
    
    try {
      // Initialize AdSense if needed
      await rewardedVideo.initialize();
      
      // Load the rewarded ad
      const adUnitId = ADSENSE_CONFIG.REWARDED_AD_UNITS.SMASH_REWARD_25;
      await rewardedVideo.loadRewardedAd(adUnitId, {
        keywords: ADSENSE_CONFIG.AD_CATEGORIES,
        contentUrl: window.location.href
      });
      
      // Set up event listeners
      rewardedVideo.addEventListener('adLoaded', () => {
        setAdState('playing');
        setTimeRemaining(adDuration);
        setAdProgress(0);
      });
      
      rewardedVideo.addEventListener('adFailedToLoad', (error) => {
        console.error('Ad failed to load:', error);
        setAdState('error');
      });
      
      rewardedVideo.addEventListener('userEarnedReward', (reward) => {
        handleAdComplete();
      });
      
      rewardedVideo.addEventListener('adClosed', () => {
        if (adState === 'playing') {
          // User closed ad before completion
          toast.error('Ad must be watched completely to earn reward');
          setAdState('ready');
        }
      });
      
    } catch (error) {
      console.error('Failed to start ad:', error);
      setAdState('error');
    }
  };

  const handleAdComplete = () => {
    setAdState('completed');
    
    // Calculate reward with user tier multiplier
    const baseReward = 25;
    const userReferrals = userData?.totalReferrals || 0;
    const reward = rewardedVideo.calculateReward(baseReward, userReferrals);
    
    toast.success(`Ad completed! +${reward} SMASH earned`);
    
    // Update daily count
    const newCount = dailyAdsWatched + 1;
    setDailyAdsWatched(newCount);
    
    // Call parent callback
    if (onAdComplete) {
      onAdComplete(reward, newCount);
    }
  };

  const handleSkip = () => {
    if (adState === 'playing') {
      toast.error('Cannot skip rewarded ads');
      return;
    }
    onClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAdContent = () => {
    switch (adState) {
      case 'ready':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-smash-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-smash-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Watch Rewarded Ad</h3>
            <p className="text-gray-600 mb-4">
              Watch a 30-second ad to earn <span className="font-semibold text-smash-primary">25 SMASH</span>
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                Daily Progress: <span className="font-semibold">{dailyAdsWatched}/{ADSENSE_CONFIG.MAX_DAILY_ADS}</span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-smash-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(dailyAdsWatched / ADSENSE_CONFIG.MAX_DAILY_ADS) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={startAd}
              disabled={dailyAdsWatched >= ADSENSE_CONFIG.MAX_DAILY_ADS}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                dailyAdsWatched >= ADSENSE_CONFIG.MAX_DAILY_ADS
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-smash-primary hover:bg-smash-secondary text-white hover:scale-105'
              }`}
            >
              {dailyAdsWatched >= ADSENSE_CONFIG.MAX_DAILY_ADS ? 'Daily Limit Reached' : 'Start Watching'}
            </button>
          </div>
        );

      case 'loading':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-smash-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-smash-primary"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Ad...</h3>
            <p className="text-gray-600">Please wait while we prepare your rewarded video</p>
          </div>
        );

      case 'playing':
        return (
          <div className="text-center">
            <div className="relative mb-6">
              {/* Mock Video Player */}
              <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-semibold">Rewarded Video Ad</p>
                  <p className="text-white/80 text-sm">Sponsored Content</p>
                </div>
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div 
                    className="h-full bg-smash-primary transition-all duration-1000"
                    style={{ width: `${adProgress}%` }}
                  />
                </div>
              </div>
              
              {/* Time Remaining */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-mono">
                {formatTime(timeRemaining)}
              </div>
              
              {/* Mute Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Time remaining: {formatTime(timeRemaining)}</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Important:</span> Keep this tab active and don't close the ad to receive your reward.
                </p>
              </div>
            </div>
          </div>
        );

      case 'completed':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-smash-success/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10 text-smash-success" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ad Completed!</h3>
            <p className="text-gray-600 mb-4">
              You've earned <span className="font-semibold text-smash-success">25 SMASH</span> for watching the ad
            </p>
            <div className="bg-smash-success/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-smash-success">
                Daily Progress: <span className="font-semibold">{dailyAdsWatched}/{ADSENSE_CONFIG.MAX_DAILY_ADS}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-smash-success hover:bg-smash-success/80 text-white rounded-xl font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-smash-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-smash-danger" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ad Failed to Load</h3>
            <p className="text-gray-600 mb-6">
              We couldn't load the rewarded ad. Please try again later.
            </p>
            <div className="space-y-3">
              <button
                onClick={startAd}
                className="w-full py-3 px-6 bg-smash-primary hover:bg-smash-secondary text-white rounded-xl font-semibold transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
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
      onClick={(e) => e.target === e.currentTarget && handleSkip()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Rewarded Ads</h2>
          <button
            onClick={handleSkip}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={adState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {getAdContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RewardedAds;
