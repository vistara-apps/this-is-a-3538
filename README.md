# ShipChain - Decentralized Delivery Platform

**Tagline:** Decentralized Delivery, On-Demand.

ShipChain is a marketplace connecting shippers with reliable, on-chain verified couriers for urgent and niche deliveries. Built on Base blockchain with smart contract escrow and tokenized incentives.

## 🚀 Features

### Core Features
- **On-Demand Delivery Matching**: Smart contract-based matching between shippers and verified couriers
- **Courier Reputation & Verification**: On-chain reputation system with transparent ratings
- **Smart Contract Escrow & Payout**: Automated payment release upon delivery confirmation
- **Tokenized Incentives**: $SHIP token rewards for couriers and platform participants

### Technical Features
- **Web3 Integration**: Built with Wagmi, Viem, and RainbowKit for seamless wallet connectivity
- **IPFS Storage**: Decentralized storage for delivery proofs via Pinata
- **Real-time Updates**: Live delivery tracking and status updates
- **Mobile Responsive**: Optimized for mobile courier workflows

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **Web3**: Wagmi v2, Viem v2, RainbowKit
- **Blockchain**: Base (Ethereum L2)
- **Storage**: IPFS via Pinata
- **Authentication**: Privy (optional)
- **State Management**: React Context + useReducer

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Git
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/this-is-a-3538.git
cd this-is-a-3538
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Required for basic functionality
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_BASE_RPC_URL=https://mainnet.base.org

# Required for IPFS storage
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key

# Optional: Enhanced authentication
VITE_PRIVY_APP_ID=your_privy_app_id

# Optional: Backend API
VITE_API_BASE_URL=http://localhost:3001/api
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see the application.

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── AppShell.tsx    # Main app layout
│   ├── Dashboard.tsx   # User dashboard
│   ├── CreateDelivery.tsx
│   └── CourierView.tsx
├── context/            # React context providers
│   ├── ShipChainContext.tsx  # Main app state
│   └── DeliveryContext.jsx   # Legacy delivery context
├── services/           # External service integrations
│   ├── api.ts         # REST API client
│   ├── blockchain.ts  # Smart contract interactions
│   └── ipfs.ts        # IPFS/Pinata integration
├── contracts/          # Smart contract ABIs and addresses
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── hooks/             # Custom React hooks
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `VITE_BASE_RPC_URL` | Base blockchain RPC endpoint | Yes |
| `VITE_PINATA_API_KEY` | Pinata API key for IPFS | Yes |
| `VITE_PINATA_SECRET_KEY` | Pinata secret key | Yes |
| `VITE_PRIVY_APP_ID` | Privy authentication app ID | No |
| `VITE_API_BASE_URL` | Backend API base URL | No |

### Smart Contracts

The application interacts with the following smart contracts on Base:

- **Escrow Contract**: Handles payment escrow and release
- **SHIP Token**: Platform utility token for rewards
- **USDC**: Primary payment token

Contract addresses are configured in `src/contracts/index.ts`.

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload `dist/` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Docker Deployment
```bash
# Build Docker image
docker build -t shipchain .

# Run container
docker run -p 3000:80 shipchain
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📱 User Flows

### Shipper Flow
1. Connect wallet via RainbowKit
2. Create delivery request with pickup/dropoff details
3. Set payment amount in USDC or SHIP tokens
4. Review and accept matched courier
5. Track delivery progress
6. Confirm delivery completion

### Courier Flow
1. Connect wallet and set availability status
2. Browse available delivery requests
3. Accept delivery and navigate to pickup
4. Confirm pickup and transport package
5. Upload delivery proof (photo/signature)
6. Receive automatic payment release

## 🔐 Security

- **Smart Contract Escrow**: Payments held securely until delivery confirmation
- **IPFS Proof Storage**: Immutable delivery evidence
- **Wallet-based Authentication**: No passwords or centralized accounts
- **On-chain Reputation**: Transparent courier ratings and history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord for discussions

## 🗺 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Multi-chain support (Polygon, Arbitrum)
- [ ] AI-powered route optimization
- [ ] Insurance integration
- [ ] Corporate delivery accounts
- [ ] API for third-party integrations

## 🏆 Acknowledgments

- Built for the Base ecosystem
- Powered by IPFS and Pinata
- UI inspired by modern Web3 applications
- Community-driven development

---

**ShipChain** - Revolutionizing delivery through decentralization 🚚⛓️
