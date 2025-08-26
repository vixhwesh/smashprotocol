# Smash Protocol - Self-Sustaining Web3 Ecosystem

A revolutionary mobile-first Web3 ecosystem built on IRYS Testnet that creates a self-sustaining economy through mining activities, educational engagement, and community-driven referral networks.

## 🚀 Features

### Core Architecture
- **Ecosystem Entry & Activation**: Referral-gated activation with master protocol code 'HIRYS'
- **Web3 Integration**: Full EVM wallet support for IRYS Testnet participation
- **Identity Creation**: Unique username system within the Smash Protocol ecosystem

### SMASH Economy
- **24-hour Mining Cycles**: Real-time countdown with blockchain fee integration
- **Educational Mining**: Daily knowledge quizzes rewarding SMASH
- **AdSense Integration**: Rewarded video viewing as free alternative to mining fees

### Protocol Milestones
- **Mining Streaks**: 3, 7, 14, 30, 50, 60 consecutive days with increasing multipliers
- **Knowledge Streaks**: 7, 15, 30 consecutive quiz completions
- **Network Growth Tiers**: 1, 3, 5, 10, 25, 50, 100, 250, 500 referrals

### Referral Network
- **Direct Rewards**: 10% of SMASH earned by direct referrals
- **Indirect Rewards**: 5% of SMASH from second-tier referrals
- **Activation Bonus**: 200 SMASH when direct referral completes first mining cycle

## 🛠️ Technical Stack

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom design system
- **Web3**: Ethers.js for blockchain integration
- **Backend**: Firebase (Firestore, Auth, Functions)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📱 Mobile-First Design

- **Icon-Only Bottom Navigation**: Clean, intuitive mobile experience
- **Responsive Layout**: Optimized for all screen sizes
- **Touch-Friendly**: Optimized interactions for mobile devices

## 🔗 Blockchain Integration

### IRYS Testnet Specifications
- **Network**: Irys Testnet v1
- **RPC Endpoint**: testnet-rpc.irys.xyz/v1/execution-rpc
- **Native Currency**: IRYS
- **Chain ID**: 1270
- **Explorer**: testnet-explorer.irys.xyz
- **Protocol Treasury**: 0xA13351981c18D8A459f8CDCcC9Fd34966f5FF215

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MetaMask or other Web3 wallet
- IRYS Testnet tokens for mining fees

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smash-protocol
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Firestore, Authentication, and Functions
   - Update `src/config/firebase.js` with your configuration

4. **Start development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Enable Cloud Functions
5. Update the configuration in `src/config/firebase.js`

### Web3 Configuration
The app automatically handles:
- Wallet connection
- Network switching to IRYS Testnet
- Transaction signing for mining fees

## 📱 App Structure

### Pages
- **Home**: Landing page with protocol overview
- **Command Center**: Daily SMASH earning activities
- **Achievement Vault**: Milestone tracking and progression
- **Global Rankings**: Protocol-wide leaderboards
- **Protocol Profile**: User identity and analytics

### Components
- **Header**: Branding, notifications, wallet connection
- **Bottom Navigation**: Mobile-first icon navigation
- **Web3 Context**: Global state management
- **Toast Notifications**: User feedback system

## 🎯 Key Features

### Mining System
- 24-hour mining cycles
- Real-time countdown timers
- Blockchain fee integration (0.001 IRYS)
- Streak-based multipliers

### Referral System
- 5-character unique referral codes
- Multi-tier reward structure
- Network growth tracking
- Achievement unlocks

### Achievement System
- Mining streak milestones
- Knowledge quiz streaks
- Network growth tiers
- Special achievements

## 🔒 Security Features

- **Wallet Validation**: Ensures proper network connection
- **Referral Code Validation**: Prevents duplicate codes
- **Transaction Verification**: Confirms mining fee payments
- **User Authentication**: Firebase-based user management

## 📊 Analytics & Monitoring

- **User Behavior Tracking**: Firebase Analytics integration
- **Ecosystem Health Monitoring**: Real-time protocol metrics
- **Performance Metrics**: User engagement and retention

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy
The built files can be deployed to:
- Vercel
- Netlify
- Firebase Hosting
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Roadmap

- **Mainnet Migration**: Move from IRYS Testnet to mainnet
- **Mobile App**: Native iOS and Android applications
- **Advanced Analytics**: Enhanced user insights and reporting
- **DeFi Integration**: Yield farming and liquidity pools
- **NFT Marketplace**: Digital collectibles and achievements

---

**Smash Protocol** - Building the future of self-sustaining Web3 ecosystems! 🚀
