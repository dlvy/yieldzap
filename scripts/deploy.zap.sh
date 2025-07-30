#!/bin/bash
set -e

CONTRACT_DIR="contracts/zap"
NETWORK="futurenet"  # or 'localnet' depending on your setup

echo "🔥 Building and Deploying YieldZap Contract..."
echo "Network: $NETWORK"
echo "Contract directory: $CONTRACT_DIR"

# Build the contract
echo "📦 Compiling the contract..."
cd $CONTRACT_DIR
cargo build --target wasm32-unknown-unknown --release

# Optimize the WASM (optional but recommended)
echo "⚡ Optimizing WASM..."
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/zap.wasm

# Deploy the contract
echo "🚀 Deploying contract to Soroban $NETWORK..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/zap.wasm \
  --network $NETWORK)

echo "✅ Contract deployed successfully!"
echo "📋 Contract ID: $CONTRACT_ID"

# Initialize the contract (replace with actual admin address)
echo "🔧 Initializing contract..."
ADMIN_ADDRESS="GDIY6AQQ75WMD4W46EYB7O6UYMHOCGQHLAQGQTKHDX4J2DYQCHVCR4W4"  # Replace with actual admin

soroban contract invoke \
  --id $CONTRACT_ID \
  --network $NETWORK \
  -- initialize \
  --admin $ADMIN_ADDRESS

echo "🎉 YieldZap contract is ready!"
echo ""
echo "📝 Integration details:"
echo "Contract ID: $CONTRACT_ID"
echo "Network: $NETWORK"
echo "Admin: $ADMIN_ADDRESS"
echo ""
echo "Next steps:"
echo "1. Update frontend with contract ID"
echo "2. Update config.rs with real Soroswap/DeFindex addresses"
echo "3. Test with small amounts first"

# Save contract ID to file for easy reference
echo $CONTRACT_ID > ../CONTRACT_ID.txt
echo "💾 Contract ID saved to CONTRACT_ID.txt"
