#!/bin/bash
set -e

echo "🧪 Creating Mock Contracts for Local Testing"
echo "==========================================="

NETWORK="local"

# Create mock token contract
create_mock_token() {
    local token_name=$1
    local token_symbol=$2
    
    echo "Creating mock $token_name token..."
    
    # This is a simplified mock - in a real setup you'd deploy actual token contracts
    echo "Mock $token_name ($token_symbol) would be deployed here"
    
    # For now, return a placeholder address
    echo "C$(openssl rand -hex 28 | tr '[:lower:]' '[:upper:]')"
}

# Create mock Soroswap aggregator
create_mock_soroswap() {
    echo "Creating mock Soroswap aggregator..."
    # In a real setup, deploy a simplified version that accepts swaps and returns tokens
    echo "Mock Soroswap aggregator would be deployed here"
    echo "C$(openssl rand -hex 28 | tr '[:lower:]' '[:upper:]')"
}

# Create mock DeFindex vault
create_mock_defindex() {
    echo "Creating mock DeFindex vault..."
    # In a real setup, deploy a simplified vault contract
    echo "Mock DeFindex vault would be deployed here"
    echo "C$(openssl rand -hex 28 | tr '[:lower:]' '[:upper:]')"
}

echo "📦 Deploying mock contracts..."

USDC_ADDRESS=$(create_mock_token "USD Coin" "USDC")
XLM_ADDRESS=$(create_mock_token "Stellar Lumens" "XLM")
AQUA_ADDRESS=$(create_mock_token "Aqua Token" "AQUA")

SOROSWAP_ADDRESS=$(create_mock_soroswap)
DEFINDEX_ADDRESS=$(create_mock_defindex)

echo ""
echo "✅ Mock contracts created:"
echo "USDC Token: $USDC_ADDRESS"
echo "XLM Token: $XLM_ADDRESS"
echo "AQUA Token: $AQUA_ADDRESS"
echo "Soroswap Aggregator: $SOROSWAP_ADDRESS"
echo "DeFindex Factory: $DEFINDEX_ADDRESS"
echo ""
echo "💡 Note: These are placeholder addresses for testing."
echo "For full functionality, deploy actual mock contracts."

# Save addresses to env file
cat >> local-env.sh << EOF

# Mock contract addresses (generated $(date))
export USDC_TOKEN_ADDRESS="$USDC_ADDRESS"
export XLM_TOKEN_ADDRESS="$XLM_ADDRESS"
export AQUA_TOKEN_ADDRESS="$AQUA_ADDRESS"
export MOCK_SOROSWAP_ADDRESS="$SOROSWAP_ADDRESS"
export MOCK_DEFINDEX_ADDRESS="$DEFINDEX_ADDRESS"
EOF

echo "Addresses saved to local-env.sh"
