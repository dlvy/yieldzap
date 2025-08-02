#!/bin/bash
set -e

echo "🚀 Deploying YieldZap to Local Devnet"
echo "====================================="

NETWORK="local"
CONTRACT_DIR="../contracts/zap"

# Build the contract
echo "📦 Building contract..."
cd $CONTRACT_DIR
cargo build --target wasm32-unknown-unknown --release

# Deploy the contract
echo "🚀 Deploying contract..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/zap.wasm \
  --source admin \
  --network $NETWORK)

echo "✅ Contract deployed!"
echo "Contract ID: $CONTRACT_ID"

# Initialize the contract
echo "🔧 Initializing contract..."
ADMIN_ADDRESS=$(soroban keys address admin)

soroban contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network $NETWORK \
  -- initialize \
  --admin $ADMIN_ADDRESS

echo "🎉 YieldZap contract is ready on local devnet!"
echo ""
echo "📝 Contract Details:"
echo "Contract ID: $CONTRACT_ID"
echo "Network: $NETWORK"
echo "Admin: $ADMIN_ADDRESS"
echo ""
echo "💡 Next steps:"
echo "1. Update frontend config with contract ID"
echo "2. Test contract functions"
echo "3. Deploy mock Soroswap/DeFindex contracts for full testing"

# Save contract ID for easy access
echo $CONTRACT_ID > ../../CONTRACT_ID_LOCAL.txt
echo "Contract ID saved to CONTRACT_ID_LOCAL.txt"
