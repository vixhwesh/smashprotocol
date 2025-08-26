import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  Zap, 
  Play, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Coins,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import { sendMiningFee, PROTOCOL_CONFIG } from '../config/web3';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';
import RewardedAds from './RewardedAds';
import DailyQuiz from './DailyQuiz';

const CommandCenter = () => {
  const { wallet, userData, network } = useWeb3();
  const [miningStatus, setMiningStatus] = useState('idle');
  const [nextMiningTime, setNextMiningTime] = useState(null);
  const [dailyAdsWatched, setDailyAdsWatched] = useState(userData?.dailyAdsWatched || 0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showRewardedAds, setShowRewardedAds] = useState(false);
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);

  // Check if user can mine
  const canMine = () => {
    if (!userData?.isActivated || !wallet || network !== 'irys-testnet') return false;
    
    if (!userData.lastMining) return true;
    
    const lastMining = userData.lastMining?.toDate ? new Date(userData.lastMining.toDate()) : new Date(userData.lastMining);
    const now = new Date();
    const hoursSinceLastMining = (now - lastMining) / (1000 * 60 * 60);
    
    return hoursSinceLastMining >= PROTOCOL_CONFIG.MINING_CYCLE_HOURS;
  };

  // Get next mining time
  const getNextMiningTime = useCallback(() => {
    if (!userData?.lastMining) return new Date();
    
    const lastMining = userData.lastMining?.toDate ? new Date(userData.lastMining.toDate()) : new Date(userData.lastMining);
    const nextTime = new Date(lastMining.getTime() + (PROTOCOL_CONFIG.MINING_CYCLE_HOURS * 60 * 60 * 1000));
    return nextTime;
  }, [userData?.lastMining]);

  // Start mining
  const startMining = async () => {
    if (!canMine()) return;
    
    try {
      setMiningStatus('mining');
      
      // Send mining fee
      const tx = await sendMiningFee(wallet.signer);
      
      if (tx.status === 1) {
        // Update user data directly in Firebase (no Cloud Functions needed)
        const userRef = doc(db, 'users', userData.uid);
        await updateDoc(userRef, {
          smashBalance: increment(150),
          totalEarned: increment(150),
          lastMining: new Date(),
          miningStreak: increment(1),
          updatedAt: new Date()
        });
        
        // Handle referral rewards locally
        if (userData.referredBy && userData.referredBy !== 'MASTER') {
          await handleReferralRewards(userData.referredBy, 150);
        }
        
        setMiningStatus('completed');
        toast.success('Mining completed! +150 SMASH earned');
        
        // Set next mining time
        setNextMiningTime(getNextMiningTime());
      }
    } catch (error) {
      console.error('Mining error:', error);
      setMiningStatus('error');
      toast.error('Mining failed. Please try again.');
    }
  };

  // Watch rewarded ad
  const watchAd = () => {
    if (dailyAdsWatched >= PROTOCOL_CONFIG.MAX_DAILY_ADS) {
      toast.error('Daily ad limit reached');
      return;
    }
    
    setShowRewardedAds(true);
  };

  // Handle ad completion
  const handleAdComplete = async (reward, newCount) => {
    try {
      // Update user data directly in Firebase
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
        smashBalance: increment(reward),
        totalEarned: increment(reward),
        dailyAdsWatched: newCount,
        lastAdReset: new Date(),
        updatedAt: new Date()
      });
      
      // Handle referral rewards locally
      if (userData.referredBy && userData.referredBy !== 'MASTER') {
        await handleReferralRewards(userData.referredBy, reward);
      }
      
      setDailyAdsWatched(newCount);
      toast.success(`Ad completed! +${reward} SMASH earned`);
    } catch (error) {
      console.error('Error updating ad data:', error);
      toast.error('Failed to update ad data');
    }
  };

  // Complete daily quiz
  const completeQuiz = () => {
    if (quizCompleted) {
      toast.error('Daily quiz already completed');
      return;
    }
    
    setShowDailyQuiz(true);
  };

  // Handle quiz completion
  const handleQuizComplete = async (reward, newStreak, score) => {
    try {
      // Update user data directly in Firebase
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
        smashBalance: increment(reward),
        totalEarned: increment(reward),
        knowledgeStreak: newStreak,
        lastQuiz: new Date(),
        updatedAt: new Date()
      });
      
      // Handle referral rewards locally
      if (userData.referredBy && userData.referredBy !== 'MASTER') {
        await handleReferralRewards(userData.referredBy, reward);
      }
      
      setQuizCompleted(true);
      toast.success(`Quiz completed! +${reward} SMASH earned`);
    } catch (error) {
      console.error('Error updating quiz data:', error);
      toast.error('Failed to update quiz data');
    }
  };

  // Handle referral rewards locally (no Cloud Functions needed)
  const handleReferralRewards = async (referrerUid, amount) => {
    try {
      if (!referrerUid || referrerUid === 'MASTER') return;
      
      const referrerRef = doc(db, 'users', referrerUid);
      
      // Update referrer's direct referral earnings
      await updateDoc(referrerRef, {
        directReferralEarnings: increment(amount * PROTOCOL_CONFIG.DIRECT_REFERRAL_REWARD),
        totalEarned: increment(amount * PROTOCOL_CONFIG.DIRECT_REFERRAL_REWARD),
        updatedAt: new Date()
      });
      
      // Find indirect referrer (referrer's referrer)
      const referrerDoc = await getDoc(referrerRef);
      if (referrerDoc.exists() && referrerDoc.data().referredBy && referrerDoc.data().referredBy !== 'MASTER') {
        const indirectRef = doc(db, 'users', referrerDoc.data().referredBy);
        await updateDoc(indirectRef, {
          indirectReferralEarnings: increment(amount * PROTOCOL_CONFIG.INDIRECT_REFERRAL_REWARD),
          totalEarned: increment(amount * PROTOCOL_CONFIG.INDIRECT_REFERRAL_REWARD),
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error handling referral rewards:', error);
    }
  };

  // Get mining countdown
  const MiningCountdown = ({ date }) => {
    if (!date) return null;
    
    return (
      <Countdown
        date={date}
        renderer={({ hours, minutes, seconds, completed }) => {
          if (completed) {
            return <span className="text-smash-success font-semibold">Ready to mine!</span>;
          }
          return (
            <span className="text-smash-warning">
              {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          );
        }}
      />
    );
  };

  useEffect(() => {
    if (userData?.lastMining) {
      setNextMiningTime(getNextMiningTime());
    }
  }, [userData, getNextMiningTime]);

  const activities = [
    {
      id: 'mining',
      title: 'Daily Mining',
      description: 'Complete 24-hour mining cycle',
      icon: Zap,
      action: startMining,
      status: miningStatus,
      reward: '150 SMASH',
      disabled: !canMine(),
      countdown: nextMiningTime
    },
    {
      id: 'ads',
      title: 'Rewarded Ads',
      description: `Watch ads to earn SMASH (${dailyAdsWatched}/${PROTOCOL_CONFIG.MAX_DAILY_ADS})`,
      icon: Play,
      action: watchAd,
      status: dailyAdsWatched >= PROTOCOL_CONFIG.MAX_DAILY_ADS ? 'completed' : 'available',
      reward: '25 SMASH',
      disabled: dailyAdsWatched >= PROTOCOL_CONFIG.MAX_DAILY_ADS
    },
    {
      id: 'quiz',
      title: 'Daily Quiz',
      description: 'Complete knowledge quiz',
      icon: BookOpen,
      action: completeQuiz,
      status: quizCompleted ? 'completed' : 'available',
      reward: '50 SMASH',
      disabled: quizCompleted
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-smash-success';
      case 'mining': return 'text-smash-warning';
      case 'error': return 'text-smash-danger';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'mining': return Clock;
      case 'error': return AlertCircle;
      default: return Target;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Command Center</h2>
        <p className="text-gray-600">Complete daily activities to earn SMASH</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-smash-primary/10 rounded-xl mx-auto mb-3">
            <Coins className="w-6 h-6 text-smash-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {userData?.smashBalance || 0}
          </h3>
          <p className="text-sm text-gray-600">SMASH Balance</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-smash-success/10 rounded-xl mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-smash-success" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {userData?.miningStreak || 0}
          </h3>
          <p className="text-sm text-gray-600">Mining Streak</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-smash-secondary/10 rounded-xl mx-auto mb-3">
            <Users className="w-6 h-6 text-smash-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {userData?.totalReferrals || 0}
          </h3>
          <p className="text-sm text-gray-600">Total Referrals</p>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => {
          const StatusIcon = getStatusIcon(activity.status);
          
          return (
            <motion.div
              key={activity.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="card hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.status === 'completed' ? 'bg-smash-success/10' : 'bg-smash-primary/10'
                  }`}>
                    <activity.icon className={`w-5 h-5 ${
                      activity.status === 'completed' ? 'text-smash-success' : 'text-smash-primary'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
                <StatusIcon className={`w-5 h-5 ${getStatusColor(activity.status)}`} />
              </div>

              {/* Countdown for mining */}
              {activity.id === 'mining' && activity.countdown && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Next mining in:</p>
                  <MiningCountdown date={activity.countdown} />
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-smash-primary">
                  {activity.reward}
                </span>
                <button
                  onClick={activity.action}
                  disabled={activity.disabled}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activity.disabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-smash-primary hover:bg-smash-secondary text-white hover:scale-105'
                  }`}
                >
                  {activity.status === 'mining' ? 'Mining...' : 
                   activity.status === 'completed' ? 'Completed' : 'Start'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Network Status */}
      {wallet && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Network Status</h3>
              <p className="text-sm text-gray-600">
                {network === 'irys-testnet' ? 'Connected to IRYS Testnet' : 'Wrong Network'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              network === 'irys-testnet' 
                ? 'bg-smash-success/10 text-smash-success' 
                : 'bg-smash-warning/10 text-smash-warning'
            }`}>
              {network === 'irys-testnet' ? 'Connected' : 'Wrong Network'}
            </div>
          </div>
        </div>
      )}

      {/* Rewarded Ads Modal */}
      {showRewardedAds && (
        <RewardedAds
          onAdComplete={handleAdComplete}
          onClose={() => setShowRewardedAds(false)}
        />
      )}

      {/* Daily Quiz Modal */}
      {showDailyQuiz && (
        <DailyQuiz
          onQuizComplete={handleQuizComplete}
          onClose={() => setShowDailyQuiz(false)}
        />
      )}
    </div>
  );
};

export default CommandCenter;
