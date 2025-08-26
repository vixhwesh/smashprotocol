import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  User, 
  Wallet, 
  Users, 
  TrendingUp, 
  Copy,
  Edit3,
  Check,
  ExternalLink,
  QrCode,
  Share2,
  BarChart3,
  Award,
  Target,
  Zap
} from 'lucide-react';

import toast from 'react-hot-toast';

const ProtocolProfile = () => {
  const { userData, wallet, network } = useWeb3();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(userData?.username || '');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const updateUsername = async () => {
    if (!newUsername.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    
    if (newUsername.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    
    // In real app, this would update Firebase
    toast.success('Username updated successfully!');
    setIsEditingUsername(false);
  };

  const getRankingTier = (referrals) => {
    if (referrals >= 500) return { tier: 'Legendary', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (referrals >= 250) return { tier: 'Mythic', color: 'text-red-600', bg: 'bg-red-100' };
    if (referrals >= 100) return { tier: 'Epic', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (referrals >= 50) return { tier: 'Rare', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (referrals >= 25) return { tier: 'Uncommon', color: 'text-green-600', bg: 'bg-green-100' };
    if (referrals >= 10) return { tier: 'Common', color: 'text-gray-600', bg: 'bg-gray-100' };
    return { tier: 'Novice', color: 'text-gray-500', bg: 'bg-gray-50' };
  };

  const getMiningTier = (streak) => {
    if (streak >= 60) return { tier: 'Diamond Miner', color: 'text-cyan-600', bg: 'bg-cyan-100' };
    if (streak >= 50) return { tier: 'Platinum Miner', color: 'text-gray-600', bg: 'bg-gray-100' };
    if (streak >= 30) return { tier: 'Gold Miner', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (streak >= 14) return { tier: 'Silver Miner', color: 'text-gray-500', bg: 'bg-gray-100' };
    if (streak >= 7) return { tier: 'Bronze Miner', color: 'text-amber-700', bg: 'bg-amber-100' };
    if (streak >= 3) return { tier: 'Iron Miner', color: 'text-gray-600', bg: 'bg-gray-100' };
    return { tier: 'Stone Miner', color: 'text-gray-500', bg: 'bg-gray-50' };
  };

  const rankingTier = getRankingTier(userData?.totalReferrals || 0);
  const miningTier = getMiningTier(userData?.miningStreak || 0);

  const referralStats = [
    {
      label: 'Total Referrals',
      value: userData?.totalReferrals || 0,
      icon: Users,
      color: 'smash-primary'
    },
    {
      label: 'Direct Referrals',
      value: userData?.directReferrals || 0,
      icon: TrendingUp,
      color: 'smash-success'
    },
    {
      label: 'Indirect Referrals',
      value: userData?.indirectReferrals || 0,
      icon: BarChart3,
      color: 'smash-secondary'
    }
  ];

  const earningsStats = [
    {
      label: 'SMASH Balance',
      value: userData?.smashBalance || 0,
      icon: Zap,
      color: 'smash-primary'
    },
    {
      label: 'Total Earned',
      value: userData?.totalEarned || 0,
      icon: Award,
      color: 'smash-success'
    },
    {
      label: 'Referral Earnings',
      value: Math.floor((userData?.totalReferrals || 0) * 25), // Mock calculation
      icon: Target,
      color: 'smash-secondary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Protocol Profile</h2>
        <p className="text-gray-600">Your identity and progress in the Smash Protocol ecosystem</p>
      </div>

      {/* Profile Overview */}
      <div className="card">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-smash-primary to-smash-secondary rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {isEditingUsername ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="input-field text-lg font-bold"
                    placeholder="Enter username"
                    maxLength={20}
                  />
                  <button
                    onClick={updateUsername}
                    className="p-2 bg-smash-success text-white rounded-lg hover:bg-smash-success/80"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingUsername(false);
                      setNewUsername(userData?.username || '');
                    }}
                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900">
                    {userData?.username || 'Unnamed User'}
                  </h3>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            
            <p className="text-gray-600 mb-3">
              {userData?.email || 'No email verified'}
            </p>

            {/* Tiers */}
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${rankingTier.bg} ${rankingTier.color}`}>
                {rankingTier.tier}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${miningTier.bg} ${miningTier.color}`}>
                {miningTier.tier}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Wallet className="w-5 h-5" />
          <span>Wallet Connection</span>
        </h3>
        
        {wallet ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Wallet Address</p>
                <p className="font-mono text-sm text-gray-900">{wallet.address}</p>
              </div>
              <button
                onClick={() => copyToClipboard(wallet.address)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">IRYS Balance</p>
                <p className="font-semibold text-gray-900">
                  {parseFloat(wallet.balance).toFixed(4)} IRYS
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Network</p>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    network === 'irys-testnet' ? 'bg-smash-success' : 'bg-smash-warning'
                  }`} />
                  <span className="text-sm font-medium">
                    {network === 'irys-testnet' ? 'IRYS Testnet' : 'Wrong Network'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No wallet connected</p>
            <p className="text-sm text-gray-500">Connect your wallet to view details</p>
          </div>
        )}
      </div>

      {/* Referral Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Referral Network</span>
        </h3>
        
        {userData?.isActivated ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-smash-primary/10 to-smash-secondary/10 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Your Referral Code</p>
                <p className="font-mono text-lg font-bold text-smash-primary">
                  {userData.referralCode}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(userData.referralCode)}
                className="p-2 bg-smash-primary text-white rounded-lg hover:bg-smash-primary/80"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {referralStats.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 bg-${stat.color}/10 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {userData.referredBy && userData.referredBy !== 'MASTER' && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Referred by</p>
                <p className="font-medium text-gray-900">{userData.referredBy}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Account not activated</p>
            <p className="text-sm text-gray-500">Enter a referral code to join the ecosystem</p>
          </div>
        )}
      </div>

      {/* Earnings Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>Earnings Overview</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {earningsStats.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 bg-${stat.color}/10 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <QrCode className="w-6 h-6 text-smash-primary" />
            <span className="text-sm font-medium">QR Code</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Share2 className="w-6 h-6 text-smash-secondary" />
            <span className="text-sm font-medium">Share Profile</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <BarChart3 className="w-6 h-6 text-smash-accent" />
            <span className="text-sm font-medium">Analytics</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <ExternalLink className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-medium">Export Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtocolProfile;
