#!/bin/bash
set -e

echo "🌟 Setting up Local Soroban Devnet for YieldZap"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on supported OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="linux"
    ARCH=$(uname -m)
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
    ARCH=$(uname -m)
else
    print_error "Unsupported OS: $OSTYPE"
    exit 1
fi

print_status "Detected platform: $PLATFORM ($ARCH)"

# Step 1: Install Rust if not present
print_status "Checking Rust installation..."
if ! command -v rustc &> /dev/null; then
    print_warning "Rust not found. Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
    print_success "Rust installed successfully"
else
    print_success "Rust is already installed: $(rustc --version)"
fi

# Step 2: Add wasm32 target
print_status "Adding wasm32-unknown-unknown target..."
rustup target add wasm32-unknown-unknown

# Step 3: Install Soroban CLI
print_status "Installing Soroban CLI..."
cargo install --locked soroban-cli@21.0.0

# Verify installation
if command -v soroban &> /dev/null; then
    print_success "Soroban CLI installed: $(soroban --version)"
else
    print_error "Failed to install Soroban CLI"
    exit 1
fi

# Step 4: Set up Soroban configuration
print_status "Setting up Soroban configuration..."

# Create network configurations
soroban network add \
  --global local \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017"

soroban network add \
  --global futurenet \
  --rpc-url https://rpc-futurenet.stellar.org \
  --network-passphrase "Test SDF Future Network ; October 2022"

print_success "Network configurations added"

# Step 5: Create and fund test identities
print_status "Creating test identities..."

# Create admin identity
soroban keys generate --global admin --network local
ADMIN_ADDRESS=$(soroban keys address admin)
print_success "Admin identity created: $ADMIN_ADDRESS"

# Create user identity for testing
soroban keys generate --global user --network local
USER_ADDRESS=$(soroban keys address user)
print_success "User identity created: $USER_ADDRESS"

# Step 6: Create local devnet start script
cat > start-local-devnet.sh << EOF
#!/bin/bash
set -e

echo "🚀 Starting Local Soroban Devnet..."

# Check if stellar-core and soroban-rpc are available
if ! command -v stellar-core &> /dev/null; then
    echo "Installing stellar-core..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # For Ubuntu/Debian
        sudo apt-get update
        sudo apt-get install -y stellar-core
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # For macOS
        brew install stellar/tap/stellar-core
    fi
fi

# Start the local network using soroban-cli
echo "Starting local network..."
soroban network start local &
LOCAL_NETWORK_PID=\$!

echo "Local Soroban devnet started with PID: \$LOCAL_NETWORK_PID"
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
echo "Admin Address: $ADMIN_ADDRESS"
echo "User Address: $USER_ADDRESS"
EOF

chmod +x start-local-devnet.sh

# Step 7: Create deployment script for local devnet
cat > deploy-local.sh << EOF
#!/bin/bash
set -e

echo "🚀 Deploying YieldZap to Local Devnet"
echo "====================================="

NETWORK="local"
CONTRACT_DIR="../contracts/zap"

# Build the contract
echo "📦 Building contract..."
cd \$CONTRACT_DIR
cargo build --target wasm32-unknown-unknown --release

# Deploy the contract
echo "🚀 Deploying contract..."
CONTRACT_ID=\$(soroban contract deploy \\
  --wasm target/wasm32-unknown-unknown/release/zap.wasm \\
  --source admin \\
  --network \$NETWORK)

echo "✅ Contract deployed!"
echo "Contract ID: \$CONTRACT_ID"

# Initialize the contract
echo "🔧 Initializing contract..."
ADMIN_ADDRESS=\$(soroban keys address admin)

soroban contract invoke \\
  --id \$CONTRACT_ID \\
  --source admin \\
  --network \$NETWORK \\
  -- initialize \\
  --admin \$ADMIN_ADDRESS

echo "🎉 YieldZap contract is ready on local devnet!"
echo ""
echo "📝 Contract Details:"
echo "Contract ID: \$CONTRACT_ID"
echo "Network: \$NETWORK"
echo "Admin: \$ADMIN_ADDRESS"
echo ""
echo "💡 Next steps:"
echo "1. Update frontend config with contract ID"
echo "2. Test contract functions"
echo "3. Deploy mock Soroswap/DeFindex contracts for full testing"

# Save contract ID for easy access
echo \$CONTRACT_ID > ../../CONTRACT_ID_LOCAL.txt
echo "Contract ID saved to CONTRACT_ID_LOCAL.txt"
EOF

chmod +x deploy-local.sh

# Step 8: Create test script
cat > test-local.sh << EOF
#!/bin/bash
set -e

echo "🧪 Testing YieldZap on Local Devnet"
echo "==================================="

if [ ! -f "CONTRACT_ID_LOCAL.txt" ]; then
    echo "❌ CONTRACT_ID_LOCAL.txt not found. Run deploy-local.sh first."
    exit 1
fi

CONTRACT_ID=\$(cat CONTRACT_ID_LOCAL.txt)
echo "Testing contract: \$CONTRACT_ID"

# Test contract info
echo "📋 Getting contract info..."
soroban contract invoke \\
  --id \$CONTRACT_ID \\
  --source admin \\
  --network local \\
  -- get_admin

echo "✅ Local testing setup complete!"
EOF

chmod +x test-local.sh

# Step 9: Create stop script
cat > stop-local-devnet.sh << EOF
#!/bin/bash
echo "🛑 Stopping Local Soroban Devnet..."
soroban network stop local
echo "✅ Local devnet stopped"
EOF

chmod +x stop-local-devnet.sh

print_success "Local devnet setup completed!"
echo ""
echo "📋 Created scripts:"
echo "  - start-local-devnet.sh   : Start the local Soroban network"
echo "  - deploy-local.sh         : Deploy YieldZap to local network"
echo "  - test-local.sh          : Test deployed contract"
echo "  - stop-local-devnet.sh   : Stop the local network"
echo ""
echo "🚀 Quick start:"
echo "1. ./start-local-devnet.sh    # Start local devnet"
echo "2. ./deploy-local.sh          # Deploy contract"
echo "3. ./test-local.sh           # Test contract"
echo ""
echo "📝 Network Configuration:"
echo "RPC URL: http://localhost:8000/soroban/rpc"
echo "Network Passphrase: Standalone Network ; February 2017"
echo "Admin Address: $ADMIN_ADDRESS"
echo "User Address: $USER_ADDRESS"
