import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Trophy, 
  BarChart3, 
  User,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
      color: 'smash-primary'
    },
    {
      path: '/command-center',
      icon: Zap,
      label: 'Command Center',
      color: 'smash-primary'
    },
    {
      path: '/achievements',
      icon: Trophy,
      label: 'Achievements',
      color: 'smash-secondary'
    },
    {
      path: '/rankings',
      icon: BarChart3,
      label: 'Rankings',
      color: 'smash-accent'
    },
    {
      path: '/profile',
      icon: User,
      label: 'Profile',
      color: 'smash-primary'
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                active ? 'text-smash-primary' : 'text-gray-500'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`relative ${active ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
                <Icon 
                  size={24} 
                  className={active ? 'text-smash-primary' : 'text-gray-500'} 
                />
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-smash-primary rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${
                active ? 'text-smash-primary' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </div>
  );
};

export default BottomNavigation;
