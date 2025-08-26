import React, { useState } from 'react';
import { 
  Medal, 
  TrendingUp, 
  Users, 
  Zap,
  Crown,
  Award
} from 'lucide-react';

const GlobalRankings = () => {
  const [activeTab, setActiveTab] = useState('mining');
  const [timeframe, setTimeframe] = useState('weekly');

  // Mock data - in real app this would come from Firebase
  const mockData = {
    mining: {
      weekly: [
        { rank: 1, username: 'CryptoMiner', address: '0x1234...5678', score: 1250, streak: 45, avatar: '🚀' },
        { rank: 2, username: 'BlockMaster', address: '0x8765...4321', score: 1180, streak: 38, avatar: '⚡' },
        { rank: 3, username: 'HashHunter', address: '0x9999...8888', score: 1120, streak: 42, avatar: '🔨' },
        { rank: 4, username: 'MiningPro', address: '0x7777...6666', score: 1050, streak: 35, avatar: '⛏️' },
        { rank: 5, username: 'CryptoKing', address: '0x5555...4444', score: 980, streak: 28, avatar: '👑' },
        { rank: 6, username: 'BlockChain', address: '0x3333...2222', score: 920, streak: 31, avatar: '🔗' },
        { rank: 7, username: 'HashQueen', address: '0x1111...0000', score: 880, streak: 25, avatar: '👸' },
        { rank: 8, username: 'MiningElite', address: '0xaaaa...bbbb', score: 840, streak: 22, avatar: '💎' },
        { rank: 9, username: 'CryptoPro', address: '0xcccc...dddd', score: 800, streak: 19, avatar: '🚀' },
        { rank: 10, username: 'BlockElite', address: '0xeeee...ffff', score: 760, streak: 18, avatar: '⭐' }
      ],
      monthly: [
        { rank: 1, username: 'CryptoMiner', address: '0x1234...5678', score: 4850, streak: 45, avatar: '🚀' },
        { rank: 2, username: 'BlockMaster', address: '0x8765...4321', score: 4520, streak: 38, avatar: '⚡' },
        { rank: 3, username: 'HashHunter', address: '0x9999...8888', score: 4180, streak: 42, avatar: '🔨' }
      ],
      allTime: [
        { rank: 1, username: 'CryptoMiner', address: '0x1234...5678', score: 15850, streak: 45, avatar: '🚀' },
        { rank: 2, username: 'BlockMaster', address: '0x8765...4321', score: 14520, streak: 38, avatar: '⚡' },
        { rank: 3, username: 'HashHunter', address: '0x9999...8888', score: 13180, streak: 42, avatar: '🔨' }
      ]
    },
    network: {
      weekly: [
        { rank: 1, username: 'NetworkKing', address: '0xaaaa...bbbb', referrals: 45, direct: 38, indirect: 7, avatar: '👑' },
        { rank: 2, username: 'ReferralPro', address: '0xcccc...dddd', referrals: 38, direct: 32, indirect: 6, avatar: '🌟' },
        { rank: 3, username: 'GrowthMaster', address: '0xeeee...ffff', referrals: 32, direct: 28, indirect: 4, avatar: '📈' },
        { rank: 4, username: 'NetworkElite', address: '0x1111...2222', referrals: 28, direct: 25, indirect: 3, avatar: '💎' },
        { rank: 5, username: 'ReferralKing', address: '0x3333...4444', referrals: 25, direct: 22, indirect: 3, avatar: '🎯' }
      ],
      monthly: [
        { rank: 1, username: 'NetworkKing', address: '0xaaaa...bbbb', referrals: 156, direct: 128, indirect: 28, avatar: '👑' },
        { rank: 2, username: 'ReferralPro', address: '0xcccc...dddd', referrals: 134, direct: 112, indirect: 22, avatar: '🌟' },
        { rank: 3, username: 'GrowthMaster', address: '0xeeee...ffff', referrals: 118, direct: 98, indirect: 20, avatar: '📈' }
      ],
      allTime: [
        { rank: 1, username: 'NetworkKing', address: '0xaaaa...bbbb', referrals: 456, direct: 378, indirect: 78, avatar: '👑' },
        { rank: 2, username: 'ReferralPro', address: '0xcccc...dddd', referrals: 398, direct: 332, indirect: 66, avatar: '🌟' },
        { rank: 3, username: 'GrowthMaster', address: '0xeeee...ffff', referrals: 345, direct: 298, indirect: 47, avatar: '📈' }
      ]
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3: return 'bg-gradient-to-r from-amber-500 to-amber-700';
      default: return 'bg-white';
    }
  };

  const getRankBorder = (rank) => {
    switch (rank) {
      case 1: return 'border-2 border-yellow-400';
      case 2: return 'border-2 border-gray-300';
      case 3: return 'border-2 border-amber-500';
      default: return 'border border-gray-200';
    }
  };

  const currentData = mockData[activeTab][timeframe];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Global Rankings</h2>
        <p className="text-gray-600">Top performers in the Smash Protocol ecosystem</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('mining')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'mining'
                ? 'bg-white text-smash-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Mining Leaders</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'network'
                ? 'bg-white text-smash-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Network Builders</span>
            </div>
          </button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-1">
          {['weekly', 'monthly', 'allTime'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeframe === tf
                  ? 'bg-smash-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tf === 'weekly' ? 'This Week' : tf === 'monthly' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                {activeTab === 'mining' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SMASH Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Streak
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Referrals
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Direct
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Indirect
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((user, index) => (
                <motion.tr
                  key={user.address}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index < 3 ? 'bg-gradient-to-r from-gray-50 to-white' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{user.avatar}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          {user.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  {activeTab === 'mining' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-smash-primary">
                          {user.score.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-smash-success" />
                          <span className="text-sm text-gray-900">{user.streak} days</span>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-smash-secondary">
                          {user.referrals}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.direct}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.indirect}</div>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 3 Podium */}
      {currentData.length >= 3 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Top 3 Podium</h3>
          <div className="flex items-end justify-center space-x-4">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className={`w-20 h-20 ${getRankColor(2)} ${getRankBorder(2)} rounded-full flex items-center justify-center mb-3`}>
                <span className="text-2xl">{currentData[1].avatar}</span>
              </div>
              <div className="text-sm font-medium text-gray-900">{currentData[1].username}</div>
              <div className="text-xs text-gray-500">2nd Place</div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className={`w-24 h-24 ${getRankColor(1)} ${getRankBorder(1)} rounded-full flex items-center justify-center mb-3 shadow-glow`}>
                <span className="text-3xl">{currentData[0].avatar}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{currentData[0].username}</div>
              <div className="text-sm text-yellow-600 font-medium">🏆 Champion</div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className={`w-20 h-20 ${getRankColor(3)} ${getRankBorder(3)} rounded-full flex items-center justify-center mb-3`}>
                <span className="text-2xl">{currentData[2].avatar}</span>
              </div>
              <div className="text-sm font-medium text-gray-900">{currentData[2].username}</div>
              <div className="text-xs text-gray-500">3rd Place</div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalRankings;
