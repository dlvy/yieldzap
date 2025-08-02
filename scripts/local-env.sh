#!/bin/bash
# Local Soroban Devnet Configuration
# Source this file to set environment variables

export SOROBAN_NETWORK="local"
export SOROBAN_RPC_URL="http://localhost:8000/soroban/rpc"
export SOROBAN_NETWORK_PASSPHRASE="Standalone Network ; February 2017"

# Contract addresses (will be populated after deployment)
export YIELDZAP_CONTRACT_ID=""
export MOCK_SOROSWAP_ADDRESS=""
export MOCK_DEFINDEX_ADDRESS=""

# Test token addresses (will be deployed for testing)
export USDC_TOKEN_ADDRESS=""
export XLM_TOKEN_ADDRESS=""
export AQUA_TOKEN_ADDRESS=""

# Test accounts
export ADMIN_SECRET_KEY=""
export USER_SECRET_KEY=""

echo "Local Soroban devnet environment configured"
echo "Network: $SOROBAN_NETWORK"
echo "RPC URL: $SOROBAN_RPC_URL"
