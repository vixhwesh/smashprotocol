import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  Trophy, 
  Zap, 
  BookOpen, 
  Users, 
  Star,
  Lock,
  CheckCircle,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { STREAK_MILESTONES } from '../config/web3';

const AchievementVault = () => {
  const { userData } = useWeb3();

  const achievements = [
    {
      id: 'mining-streak',
      title: 'Mining Streaks',
      description: 'Consecutive daily mining cycles',
      icon: Zap,
      milestones: STREAK_MILESTONES.MINING,
      current: userData?.miningStreak || 0,
      rewards: [50, 100, 250, 500, 1000, 2000],
      color: 'smash-primary'
    },
    {
      id: 'knowledge-streak',
      title: 'Knowledge Streaks',
      description: 'Consecutive daily quiz completions',
      icon: BookOpen,
      milestones: STREAK_MILESTONES.KNOWLEDGE,
      current: userData?.knowledgeStreak || 0,
      rewards: [100, 250, 500],
      color: 'smash-secondary'
    },
    {
      id: 'network-growth',
      title: 'Network Growth',
      description: 'Total referrals in your network',
      icon: Users,
      milestones: STREAK_MILESTONES.NETWORK,
      current: userData?.totalReferrals || 0,
      rewards: [200, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000],
      color: 'smash-accent'
    }
  ];

  const getProgressPercentage = (current, milestone) => {
    if (current >= milestone) return 100;
    if (current === 0) return 0;
    
    // Find the next milestone
    const nextMilestone = milestone;
    const prevMilestone = achievements.find(a => 
      a.milestones.includes(milestone)
    )?.milestones.find(m => m < milestone) || 0;
    
    const range = nextMilestone - prevMilestone;
    const progress = current - prevMilestone;
    
    return Math.min((progress / range) * 100, 100);
  };

  const getAchievementStatus = (current, milestone) => {
    if (current >= milestone) return 'completed';
    if (current > 0 && current < milestone) return 'in-progress';
    return 'locked';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Target;
      default: return Lock;
    }
  };

  const getStatusColor = (status, baseColor) => {
    switch (status) {
      case 'completed': return 'text-smash-success';
      case 'in-progress': return `text-${baseColor}`;
      default: return 'text-gray-400';
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievement Vault</h2>
        <p className="text-gray-600">Track your progress and unlock ecosystem privileges</p>
      </div>

      {/* Overall Progress */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-smash-primary to-smash-secondary rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <p className="text-sm text-gray-600">
              {userData?.achievements?.length || 0} achievements unlocked
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-smash-primary">
              {userData?.miningStreak || 0}
            </div>
            <div className="text-sm text-gray-600">Mining Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-smash-secondary">
              {userData?.knowledgeStreak || 0}
            </div>
            <div className="text-sm text-gray-600">Knowledge Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-smash-accent">
              {userData?.totalReferrals || 0}
            </div>
            <div className="text-sm text-gray-600">Total Referrals</div>
          </div>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="space-y-8">
        {achievements.map((category) => (
          <div key={category.id} className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-10 h-10 bg-${category.color}/10 rounded-xl flex items-center justify-center`}>
                <category.icon className={`w-5 h-5 text-${category.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.milestones.map((milestone, index) => {
                const status = getAchievementStatus(category.current, milestone);
                const StatusIcon = getStatusIcon(status);
                const progress = getProgressPercentage(category.current, milestone);
                const reward = category.rewards[index];
                
                return (
                  <motion.div
                    key={milestone}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      status === 'completed' 
                        ? 'border-smash-success bg-smash-success/5' 
                        : status === 'in-progress'
                        ? `border-${category.color} bg-${category.color}/5`
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <StatusIcon 
                          className={`w-5 h-5 ${getStatusColor(status, category.color)}`} 
                        />
                        <span className={`font-semibold ${
                          status === 'completed' ? 'text-smash-success' : 'text-gray-900'
                        }`}>
                          {milestone}
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === 'completed' 
                          ? 'bg-smash-success/10 text-smash-success'
                          : status === 'in-progress'
                          ? `bg-${category.color}/10 text-${category.color}`
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        +{reward} SMASH
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          status === 'completed' 
                            ? 'bg-smash-success' 
                            : status === 'in-progress'
                            ? `bg-${category.color}`
                            : 'bg-gray-300'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="text-sm text-gray-600">
                      {status === 'completed' ? (
                        <span className="text-smash-success font-medium">✓ Unlocked</span>
                      ) : status === 'in-progress' ? (
                        <span>{category.current}/{milestone} completed</span>
                      ) : (
                        <span>Locked</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Special Achievements */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <Star className="w-6 h-6 text-yellow-500" />
            <div>
              <div className="font-medium text-gray-900">First Mining</div>
              <div className="text-sm text-gray-600">Complete your first mining cycle</div>
            </div>
            {userData?.lastMining ? (
              <CheckCircle className="w-5 h-5 text-smash-success" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <Users className="w-6 h-6 text-purple-500" />
            <div>
              <div className="font-medium text-gray-900">Network Pioneer</div>
              <div className="text-sm text-gray-600">Refer your first user</div>
            </div>
            {userData?.directReferrals > 0 ? (
              <CheckCircle className="w-5 h-5 text-smash-success" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementVault;
