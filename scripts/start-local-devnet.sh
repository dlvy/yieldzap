#!/bin/bash
set -e

echo "🚀 Starting Local Soroban Devnet..."

# Check if stellar-core and soroban-rpc are available
if ! command -v stellar-core &> /dev/null; then
    echo "Installing stellar-core..."
    if [[ "linux-gnu" == "linux-gnu"* ]]; then
        # For Ubuntu/Debian
        sudo apt-get update
        sudo apt-get install -y stellar-core
    elif [[ "linux-gnu" == "darwin"* ]]; then
        # For macOS
        brew install stellar/tap/stellar-core
    fi
fi

# Start the local network using soroban-cli
echo "Starting local network..."
soroban network start local &
LOCAL_NETWORK_PID=$!

echo "Local Soroban devnet started with PID: $LOCAL_NETWORK_PID"
echo "RPC URL: http://localhost:8000/soroban/rpc"
echo "Horizon URL: http://localhost:8000"

# Wait a bit for the network to start
sleep 5

# Fund test accounts
echo "Funding test accounts..."
soroban keys fund admin --network local
soroban keys fund user --network local

echo "✅ Local devnet is ready!"
echo "Use 'soroban network stop local' to stop the network"
echo "Admin Address: GDVKDWZZOBHU6SDBJSZXBIT4KM2Y6S4SH2UTVFB2QKDJZ6WTC6BK2QXB"
echo "User Address: GA457LYPTLQUVYLCKNISHGGDV43BZTR75727LO6LANATAYGUS4NH5LDJ"
