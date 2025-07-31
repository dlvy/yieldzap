# YieldZap Frontend

A modern Next.js application for one-click yield farming on Stellar.

## Features

- 🌀 **Zap Interface**: Swap any token and deposit into yield vaults in one transaction
- 🔗 **Wallet Integration**: Connect with Freighter wallet
- 🎨 **Modern UI**: Built with Tailwind CSS and responsive design
- ⚡ **Optimized**: Fast performance with Next.js
- 🔐 **Secure**: Client-side transaction signing

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Freighter Wallet browser extension

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Update contract addresses in .env.local
# NEXT_PUBLIC_ZAP_CONTRACT_ID=YOUR_DEPLOYED_CONTRACT_ID
```

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STELLAR_NETWORK` | Target Stellar network | `futurenet` |
| `NEXT_PUBLIC_ZAP_CONTRACT_ID` | YieldZap contract address | `CAAAA...` |
| `NEXT_PUBLIC_SOROSWAP_AGGREGATOR_ID` | Soroswap aggregator address | `CBBBB...` |
| `NEXT_PUBLIC_DEFINDEX_FACTORY_ID` | DeFindex factory address | `CCCCC...` |

## Project Structure

```
src/
├── components/          # React components
│   ├── ZapComponent.tsx # Main zap interface
│   └── WalletButton.tsx # Wallet connection
├── hooks/              # Custom React hooks
│   └── useWallet.ts    # Wallet integration hook
├── lib/                # Utility libraries
│   ├── types.ts        # TypeScript types
│   ├── config.ts       # Network configuration
│   └── utils.ts        # Helper functions
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # HTML document
│   └── index.tsx       # Home page
└── styles/             # CSS styles
    └── globals.css     # Global styles
```

## Architecture

The frontend integrates with:

- **Freighter Wallet**: For transaction signing
- **YieldZap Contract**: Core smart contract on Stellar
- **Soroswap Aggregator**: For optimal token swapping
- **DeFindex Vaults**: For yield farming

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Wallet**: Freighter API
- **Blockchain**: Stellar SDK

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve Freighter connection
2. **Select Tokens**: Choose from token to swap and to token for deposit
3. **Choose Vault**: Select target yield vault from available options
4. **Set Amount**: Enter amount to zap
5. **Review Quote**: Check expected output and slippage
6. **Execute Zap**: Sign transaction to complete swap + deposit

## Smart Contract Integration

The frontend calls the `zap_and_deposit` function with these parameters:

```typescript
interface ZapParams {
  user: string;           // User's Stellar address
  from_token: string;     // Input token address
  amount_in: string;      // Amount to swap (in stroops)
  to_token: string;       // Output token address
  vault_address: string;  // Target vault address
  min_amount_out: string; // Minimum output (slippage protection)
  swap_path: string[];    // Optional custom swap path
  distribution: number[]; // Optional DEX distribution
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
