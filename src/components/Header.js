import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Bell, Wallet, ChevronDown, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import Auth from './Auth';

const Header = () => {
  const { wallet, network, userData, connectAndSwitch, disconnectWallet } = useWeb3();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'success',
      message: 'Mining cycle completed! +150 SMASH earned',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'New achievement unlocked: 7-day mining streak',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Referral bonus! +20 SMASH from new user',
      time: '3 hours ago'
    }
  ];

  const getNetworkStatus = () => {
    if (!wallet) return { status: 'disconnected', color: 'text-gray-500' };
    if (network === 'irys-testnet') return { status: 'Connected to IRYS', color: 'text-smash-success' };
    return { status: 'Wrong Network', color: 'text-smash-warning' };
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const networkStatus = getNetworkStatus();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-smash-primary to-smash-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Smash Protocol</h1>
              <p className="text-xs text-gray-500">Self-Sustaining Web3 Ecosystem</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-smash-primary transition-colors"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-smash-danger text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-50 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          {notification.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-smash-success mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-smash-warning mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Wallet Connection */}
            <div className="relative">
              {wallet ? (
                <button
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="flex items-center space-x-2 bg-smash-primary text-white px-4 py-2 rounded-xl hover:bg-smash-secondary transition-colors"
                >
                  <Wallet size={16} />
                  <span className="text-sm font-medium">{formatAddress(wallet.address)}</span>
                  <ChevronDown size={16} />
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAuth(true)}
                    className="flex items-center space-x-2 bg-smash-secondary text-white px-4 py-2 rounded-xl hover:bg-smash-secondary/80 transition-colors"
                  >
                    <LogIn size={16} />
                    <span className="text-sm font-medium">Sign In</span>
                  </button>
                  <button
                    onClick={connectAndSwitch}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Wallet size={16} />
                    <span className="text-sm font-medium">Connect Wallet</span>
                  </button>
                </div>
              )}

              {/* Wallet Menu */}
              {showWalletMenu && wallet && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                >
                  <div className="p-4">
                    <div className="space-y-3">
                      {/* Network Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Network:</span>
                        <span className={`text-sm font-medium ${networkStatus.color}`}>
                          {networkStatus.status}
                        </span>
                      </div>

                      {/* Balance */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Balance:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {parseFloat(wallet.balance).toFixed(4)} IRYS
                        </span>
                      </div>

                      {/* SMASH Balance */}
                      {userData && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">SMASH:</span>
                          <span className="text-sm font-medium text-smash-primary">
                            {userData.smashBalance || 0}
                          </span>
                        </div>
                      )}

                      <div className="border-t border-gray-100 pt-3">
                        <button
                          onClick={() => {
                            disconnectWallet();
                            setShowWalletMenu(false);
                          }}
                          className="w-full text-left text-sm text-red-600 hover:text-red-700 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Disconnect Wallet
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showWalletMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowWalletMenu(false);
          }}
        />
      )}

      {/* Auth Modal */}
      {showAuth && (
        <Auth onClose={() => setShowAuth(false)} />
      )}
    </header>
  );
};

export default Header;
