#!/bin/bash
set -e

echo "🧪 Testing YieldZap on Local Devnet"
echo "==================================="

if [ ! -f "CONTRACT_ID_LOCAL.txt" ]; then
    echo "❌ CONTRACT_ID_LOCAL.txt not found. Run deploy-local.sh first."
    exit 1
fi

CONTRACT_ID=$(cat CONTRACT_ID_LOCAL.txt)
echo "Testing contract: $CONTRACT_ID"

# Test contract info
echo "📋 Getting contract info..."
soroban contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network local \
  -- get_admin

echo "✅ Local testing setup complete!"
