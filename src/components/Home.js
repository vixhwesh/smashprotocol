import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Users, 
  TrendingUp, 
  Play,
  BookOpen,
  ArrowRight,
  Star,
  Target,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PROTOCOL_CONFIG } from '../config/web3';
import RewardedAds from './RewardedAds';
import DailyQuiz from './DailyQuiz';

const Home = () => {
  const { userData, wallet, network } = useWeb3();
  const navigate = useNavigate();
  const [showRewardedAds, setShowRewardedAds] = useState(false);
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);

  const quickActions = [
    {
      title: 'Start Mining',
      description: 'Begin your daily mining cycle',
      icon: Zap,
      path: '/command-center',
      color: 'smash-primary',
      disabled: !userData?.isActivated || !wallet || network !== 'irys-testnet'
    },
    {
      title: 'Watch Ads',
      description: 'Earn SMASH through rewarded videos',
      icon: Play,
      action: () => setShowRewardedAds(true),
      color: 'smash-secondary',
      disabled: !userData?.isActivated
    },
    {
      title: 'Daily Quiz',
      description: 'Test your knowledge for rewards',
      icon: BookOpen,
      action: () => setShowDailyQuiz(true),
      color: 'smash-accent',
      disabled: !userData?.isActivated || (userData?.lastQuiz ? new Date().toDateString() === new Date(userData?.lastQuiz?.toDate ? userData.lastQuiz.toDate() : userData.lastQuiz).toDateString() : false)
    },
    {
      title: 'View Rankings',
      description: 'See where you stand globally',
      icon: TrendingUp,
      path: '/rankings',
      color: 'smash-success',
      disabled: false
    }
  ];

  const protocolStats = [
    {
      label: 'Total Users',
      value: '12,847',
      icon: Users,
      color: 'smash-primary'
    },
    {
      label: 'SMASH Distributed',
      value: '2.4M',
      icon: Award,
      color: 'smash-success'
    },
    {
      label: 'Active Miners',
      value: '8,923',
      icon: Zap,
      color: 'smash-secondary'
    },
    {
      label: 'Referral Networks',
      value: '156',
      icon: Target,
      color: 'smash-accent'
    }
  ];



  const getWelcomeMessage = () => {
    if (!userData?.isActivated) {
      return {
        title: 'Welcome to Smash Protocol',
        subtitle: 'Enter a referral code to join the ecosystem',
        action: 'Get Started'
      };
    }
    
    if (!wallet) {
      return {
        title: `Welcome back, ${userData.username || 'User'}!`,
        subtitle: 'Connect your wallet to start earning',
        action: 'Connect Wallet'
      };
    }
    
    if (network !== 'irys-testnet') {
      return {
        title: 'Switch to IRYS Testnet',
        subtitle: 'Your wallet is connected to the wrong network',
        action: 'Switch Network'
      };
    }
    
    return {
      title: `Ready to mine, ${userData.username || 'User'}?`,
      subtitle: 'Complete your daily activities to earn SMASH',
      action: 'Start Mining'
    };
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-smash-primary via-smash-secondary to-smash-accent p-8 text-white">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-3">{welcome.title}</h1>
            <p className="text-lg text-white/90 mb-6">{welcome.subtitle}</p>
            
            <button
              onClick={() => navigate('/command-center')}
              className="bg-white text-smash-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <span>{welcome.action}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !action.disabled && (action.action ? action.action() : navigate(action.path))}
              className={`card cursor-pointer transition-all duration-200 ${
                action.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg hover:scale-105'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-${action.color}/10 rounded-xl flex items-center justify-center`}>
                  <action.icon className={`w-6 h-6 text-${action.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Protocol Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Protocol Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {protocolStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card text-center"
            >
              <div className={`w-10 h-10 bg-${stat.color}/10 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Status */}
      {userData && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-smash-primary">
                {userData.smashBalance || 0}
              </div>
              <div className="text-sm text-gray-600">SMASH Balance</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-smash-secondary">
                {userData.miningStreak || 0}
              </div>
              <div className="text-sm text-gray-600">Mining Streak</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-smash-accent">
                {userData.totalReferrals || 0}
              </div>
              <div className="text-sm text-gray-600">Total Referrals</div>
            </div>
          </div>
        </div>
      )}

      {/* Features Overview */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Smash Protocol?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-smash-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-smash-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Self-Sustaining Economy</h3>
              <p className="text-sm text-gray-600">
                Built on IRYS Testnet with real blockchain integration and sustainable tokenomics
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-smash-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-smash-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Referral Network</h3>
              <p className="text-sm text-gray-600">
                Multi-tier referral system with direct and indirect rewards
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-smash-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-smash-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Daily Mining</h3>
              <p className="text-sm text-gray-600">
                24-hour mining cycles with streak bonuses and multipliers
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-smash-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 text-smash-success" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Achievement System</h3>
              <p className="text-sm text-gray-600">
                Unlock rewards through mining streaks, knowledge, and network growth
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {!userData?.isActivated && (
        <div className="card text-center bg-gradient-to-r from-smash-primary/5 to-smash-secondary/5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to join?</h3>
          <p className="text-gray-600 mb-4">
            Enter referral code <span className="text-smash-primary font-mono font-semibold">{PROTOCOL_CONFIG.MASTER_CODE}</span> to get started
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="btn-primary"
          >
            Activate Account
          </button>
        </div>
      )}

      {/* Rewarded Ads Modal */}
      {showRewardedAds && (
        <RewardedAds
          onAdComplete={(reward, newCount) => {
            // Update local state if needed
            setShowRewardedAds(false);
          }}
          onClose={() => setShowRewardedAds(false)}
        />
      )}

      {/* Daily Quiz Modal */}
      {showDailyQuiz && (
        <DailyQuiz
          onQuizComplete={(reward, newStreak, score) => {
            // Update local state if needed
            setShowDailyQuiz(false);
          }}
          onClose={() => setShowDailyQuiz(false)}
        />
      )}
    </div>
  );
};

export default Home;
