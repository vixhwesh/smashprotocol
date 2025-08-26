// Google AdSense Configuration for Smash Protocol
// This file contains the configuration for integrating real Google AdSense rewarded video ads

export const ADSENSE_CONFIG = {
  // AdSense Publisher ID (replace with your actual ID)
  PUBLISHER_ID: process.env.REACT_APP_ADSENSE_PUBLISHER_ID || 'ca-pub-XXXXXXXXXXXXXXXX',
  
  // AdSense Application ID for rewarded ads
  APP_ID: process.env.REACT_APP_ADSENSE_APP_ID || 'ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY',
  
  // Rewarded Ad Unit IDs
  REWARDED_AD_UNITS: {
    SMASH_REWARD_25: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ', // 25 SMASH reward
    SMASH_REWARD_50: 'ca-app-pub-XXXXXXXXXXXXXXXX/AAAAAAAAAA', // 50 SMASH reward (bonus)
    SMASH_REWARD_100: 'ca-app-pub-XXXXXXXXXXXXXXXX/BBBBBBBBBB', // 100 SMASH reward (streak bonus)
  },
  
  // Ad Loading Timeout (in milliseconds)
  LOAD_TIMEOUT: 10000,
  
  // Minimum Ad Duration (in seconds)
  MIN_AD_DURATION: 30,
  
  // Maximum Daily Ad Views per User
  MAX_DAILY_ADS: 5,
  
  // Reward Multipliers based on user tier
  REWARD_MULTIPLIERS: {
    NOVICE: 1.0,      // 0-9 referrals
    COMMON: 1.1,      // 10-24 referrals
    UNCOMMON: 1.2,    // 25-49 referrals
    RARE: 1.3,        // 50-99 referrals
    EPIC: 1.5,        // 100-249 referrals
    MYTHIC: 1.8,      // 250-499 referrals
    LEGENDARY: 2.0,   // 500+ referrals
  },
  
  // Ad Categories (for content filtering)
  AD_CATEGORIES: [
    'technology',
    'finance',
    'gaming',
    'education',
    'lifestyle'
  ],
  
  // User Experience Settings
  UX_SETTINGS: {
    SHOW_PROGRESS_BAR: true,
    ALLOW_MUTE: true,
    SHOW_TIME_REMAINING: true,
    PREVENT_SKIP: true,
    REQUIRE_TAB_ACTIVE: true,
  }
};

// AdSense Rewarded Video Implementation
export class AdSenseRewardedVideo {
  constructor() {
    this.isInitialized = false;
    this.currentAd = null;
    this.adListeners = new Map();
  }

  // Initialize AdSense
  async initialize() {
    try {
      // Check if AdSense is available
      if (typeof window !== 'undefined' && window.google && window.google.ads) {
        await window.google.ads.initialize();
        this.isInitialized = true;
        console.log('AdSense initialized successfully');
        return true;
      } else {
        console.warn('AdSense not available, using fallback implementation');
        return false;
      }
    } catch (error) {
      console.error('Failed to initialize AdSense:', error);
      return false;
    }
  }

  // Load a rewarded video ad
  async loadRewardedAd(adUnitId, options = {}) {
    if (!this.isInitialized) {
      throw new Error('AdSense not initialized');
    }

    try {
      const adRequest = {
        adUnitId,
        requestNonPersonalizedAds: options.requestNonPersonalizedAds || false,
        keywords: options.keywords || [],
        contentUrl: options.contentUrl || window.location.href,
        ...options
      };

      // Create rewarded ad instance
      this.currentAd = await window.google.ads.createRewardedAd(adRequest);
      
      // Set up event listeners
      this.setupAdListeners();
      
      // Load the ad
      await this.currentAd.load();
      
      return true;
    } catch (error) {
      console.error('Failed to load rewarded ad:', error);
      throw error;
    }
  }

  // Set up ad event listeners
  setupAdListeners() {
    if (!this.currentAd) return;

    // Ad loaded successfully
    this.currentAd.addEventListener('adLoaded', () => {
      console.log('Rewarded ad loaded successfully');
      this.notifyListeners('adLoaded');
    });

    // Ad failed to load
    this.currentAd.addEventListener('adFailedToLoad', (error) => {
      console.error('Rewarded ad failed to load:', error);
      this.notifyListeners('adFailedToLoad', error);
    });

    // User earned reward
    this.currentAd.addEventListener('userEarnedReward', (reward) => {
      console.log('User earned reward:', reward);
      this.notifyListeners('userEarnedReward', reward);
    });

    // Ad opened
    this.currentAd.addEventListener('adOpened', () => {
      console.log('Rewarded ad opened');
      this.notifyListeners('adOpened');
    });

    // Ad closed
    this.currentAd.addEventListener('adClosed', () => {
      console.log('Rewarded ad closed');
      this.notifyListeners('adClosed');
    });

    // Ad clicked
    this.currentAd.addEventListener('adClicked', () => {
      console.log('Rewarded ad clicked');
      this.notifyListeners('adClicked');
    });
  }

  // Show the loaded ad
  async showAd() {
    if (!this.currentAd) {
      throw new Error('No ad loaded');
    }

    try {
      await this.currentAd.show();
      return true;
    } catch (error) {
      console.error('Failed to show ad:', error);
      throw error;
    }
  }

  // Add event listener
  addEventListener(event, callback) {
    if (!this.adListeners.has(event)) {
      this.adListeners.set(event, []);
    }
    this.adListeners.get(event).push(callback);
  }

  // Remove event listener
  removeEventListener(event, callback) {
    if (this.adListeners.has(event)) {
      const listeners = this.adListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Notify all listeners for an event
  notifyListeners(event, data) {
    if (this.adListeners.has(event)) {
      this.adListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in ad event listener:', error);
        }
      });
    }
  }

  // Get user's reward multiplier based on referral tier
  getUserRewardMultiplier(userReferrals) {
    if (userReferrals >= 500) return ADSENSE_CONFIG.REWARD_MULTIPLIERS.LEGENDARY;
    if (userReferrals >= 250) return ADSENSE_CONFIG.REWARD_MULTIPLIERS.MYTHIC;
    if (userReferrals >= 100) return ADSENSE_CONFIG.REWARD_MULTIPLIERS.EPIC;
    if (userReferrals >= 50) return ADSENSE_CONFIG.REWARD_MULTIPLIERS.RARE;
    if (userReferrals >= 25) return ADSENSE_CONFIG.REWARD_MULTIPLIERS.UNCOMMON;
    if (userReferrals >= 10) return ADSENSE_CONFIG.REWARD_MULTIPLIERS.COMMON;
    return ADSENSE_CONFIG.REWARD_MULTIPLIERS.NOVICE;
  }

  // Calculate reward amount with multiplier
  calculateReward(baseReward, userReferrals) {
    const multiplier = this.getUserRewardMultiplier(userReferrals);
    return Math.floor(baseReward * multiplier);
  }

  // Clean up current ad
  destroy() {
    if (this.currentAd) {
      this.currentAd.destroy();
      this.currentAd = null;
    }
    this.adListeners.clear();
  }
}

// Fallback implementation for when AdSense is not available
export class FallbackRewardedVideo {
  constructor() {
    this.isInitialized = true;
  }

  async initialize() {
    return true;
  }

  async loadRewardedAd(adUnitId, options = {}) {
    // Simulate ad loading delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  }

  async showAd() {
    // Simulate ad showing
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  addEventListener(event, callback) {
    // Store callback for simulation
    if (!this.adListeners) this.adListeners = new Map();
    if (!this.adListeners.has(event)) {
      this.adListeners.set(event, []);
    }
    this.adListeners.get(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (this.adListeners && this.adListeners.has(event)) {
      const listeners = this.adListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  destroy() {
    this.adListeners?.clear();
  }
}

// Export the appropriate implementation
export const RewardedVideo = typeof window !== 'undefined' && 
  window.google && 
  window.google.ads ? 
  AdSenseRewardedVideo : 
  FallbackRewardedVideo;
