import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import Home from './components/Home';
import CommandCenter from './components/CommandCenter';
import AchievementVault from './components/AchievementVault';
import GlobalRankings from './components/GlobalRankings';
import ProtocolProfile from './components/ProtocolProfile';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-smash-light">
          <Header />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/command-center" element={<CommandCenter />} />
              <Route path="/achievements" element={<AchievementVault />} />
              <Route path="/rankings" element={<GlobalRankings />} />
              <Route path="/profile" element={<ProtocolProfile />} />
            </Routes>
          </main>
          
          <BottomNavigation />
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
