# 🚀 YieldZap: One-Click Yield Farming on Stellar 🌠

Welcome to **YieldZap** — the ## 🚀 Building and Deploying the Zap Contract

### 🏗️ Build the Contract

```bash
cd contracts/zap
cargo build --target wasm32-unknown-unknown --release
```

### 🌐 Setup Local Development Network

```bash
# Start local Stellar devnet
docker run --rm -it -p 8000:8000 \
  --name stellar-local \
  stellar/quickstart:latest \
  --local \
  --enable-soroban-rpc

# In another terminal, configure the network
stellar network add local \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017"

# Create and fund admin account
stellar keys generate admin
stellar keys fund admin --network local
```

### 🚀 Deploy the Contract

```bash
cd contracts/zap

# Deploy to local network
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/zap.wasm \
  --source admin \
  --network local

# Deploy to testnet (when ready)
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/zap.wasm \
  --source admin \
  --network testnet
```

The deployment will return a contract address like:
```
CB5EPRHAAN2STQXOR7AS7MEGOJYNU5P5X5MBBMB24RQR47LF26RMCFKB
```

Save this address - it's your deployed YieldZap contract!way to zap your bags into yield 
generating vaults on Stellar. Built using 🔮 **Soroswap** and 💰 **DeFindex**, 
this dApp turns basic DeFi flows into a single click.

No more managing LPs, routing trades, or reading whitepapers. 
Just zap. Sit back. Watch the yield.

---

## 🧩 What It Do

1. 🌀 **Swaps** any token to a vault-compatible asset via **Soroswap Aggregator**.
2. 🏦 **Deposits** the swapped funds into a **DeFindex Vault** for yield.
3. 🧠 Optional: Monitors yield performance and notifies if it's time to rebalance.
4. 🧙‍♂️ Optional AI: Suggests which vaults are vibing the hardest.

All powered by fully composable contracts, built natively on Stellar + Soroban.

---

## 🏗️ Project Architecture

```
+------------+       +-----------------+       +---------------+
|  Frontend  | <---> |  Zap Contract   | <---> |   Soroswap    |
|  (Next.js) |       |  (Soroban Rust) |       | Aggregator API|
+------------+       +-----------------+       +---------------+
       |                         |
       |                         v
       |              +-----------------+
       |              |   DeFindex      |
       +------------> |    Vault        |
                      +-----------------+
```

---

## 🔧 How to Run It Locally (Devnet Vibes Only)

### 📦 Prereqs

- [Rust + Cargo](https://rustup.rs/)
- [Stellar CLI](https://github.com/stellar/stellar-cli) (v23.0.0+)
- Node.js + `pnpm`
- Git brain

### 🛠️ Installing Stellar CLI

```bash
# Install required system dependencies (Ubuntu/Debian)
sudo apt update
sudo apt install -y pkg-config libudev-dev libssl-dev

# Install Stellar CLI from source
cargo install --locked stellar-cli --features opt

# Verify installation
stellar --version
```

### 📁 Folder Structure

```
yieldzap/
├── contracts/         # Soroban smart contract
│   └── zap/           # Core logic (zap and deposit)
├── frontend/          # Next.js app
├── backend/           # Rebalancer bot, strategy engine
├── scripts/           # Deploy and testing scripts
└── docs/              # Architecture notes
```

### ⚙️ Setup

```bash
git clone https://github.com/dlvy/yieldzap.git
cd yieldzap
pnpm install --frozen-lockfile
```

---

## 🚀 Deploying the Zap Contract

```bash
cd scripts
./deploy.zap.sh
```

This compiles the Rust Soroban contract, and deploys it to Futurenet or Localnet
(depending on config).

You’ll get a contract ID in return. Treasure it. It’s your yield god.

---

## 🖼 Frontend (Coming Soon)

```bash
cd frontend/yieldzap-app
pnpm dev
```

- 🔗 Connect your Stellar wallet
- 💸 Pick an input token
- 🧠 Hit **Zap** to auto-swap and auto-invest
- 🔍 View your position, yield, and vault stats

---

## 🧠 Strategy Engine (Optional)

WIP bot that uses Stellar market data to:
- Rank best vaults
- Rebalance based on APY
- Alert via Telegram if vaults underperform

Stay tuned. Or PR it yourself, legend. 👑

---

## 🌉 Tech Stack

### 🔗 Blockchain Layer
- 🦀 **Soroban + Rust** - Core zap contract with direct integrations
- 🔮 **Soroswap Aggregator** - Optimal DEX routing and token swaps
- 🏦 **DeFindex Vaults** - Yield-generating strategy vaults
- ⭐ **Stellar Network** - Fast, low-cost transaction settlement

### 🖥️ Application Layer  
- ⚛️ **Next.js + TypeScript** - React-based frontend
- 🔗 **Stellar SDK** - Blockchain interaction and wallet integration
- 🎨 **Tailwind CSS** - Modern, responsive UI components

### 🤖 Backend Services
- 💬 **Telegram Bot + Node.js** - Yield monitoring and alerts
- 📊 **Strategy Engine** - APY tracking and rebalancing logic
- � **Notification System** - Real-time yield performance alerts

### 🔧 Development Tools
- 🚀 **Stellar CLI** - Contract deployment and testing
- 📦 **pnpm** - Package management and workspace coordination
- 🧪 **Cargo** - Rust compilation and contract optimization

---

## 📲 Endpoints

### 🔮 Soroswap Integration

YieldZap integrates directly with the **Soroswap Aggregator** smart contract for optimal token swapping:

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `swap` | Execute token swap with optimal routing | `token_in`, `token_out`, `amount_in`, `amount_out_min`, `path`, `distribution` | Amount of tokens received |
| `get_amounts_out` | Get estimated output for swap | `token_in`, `token_out`, `amount_in`, `path`, `distribution` | Estimated output amount |
| `get_best_route` | Find optimal swap path | `token_in`, `token_out`, `amount_in` | Optimal path and DEX distribution |

**Example Integration:**
```rust
// Get quote before swapping
let quote = env.invoke_contract(
    &soroswap_aggregator,
    &Symbol::new(env, "get_amounts_out"),
    vec![env, token_in, token_out, amount_in, path, distribution]
);

// Execute swap with slippage protection
let result = env.invoke_contract(
    &soroswap_aggregator,
    &Symbol::new(env, "swap"),
    vec![env, token_in, token_out, amount_in, min_out, path, distribution]
);
```

### 🏦 DeFindex Integration

YieldZap connects to **DeFindex Vaults** for automated yield generation:

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `deposit` | Deposit assets into vault | `asset`, `amount`, `receiver` | Vault shares minted |
| `get_info` | Get vault metadata | None | Vault info (assets, shares, fees, etc.) |
| `preview_deposit` | Preview shares for deposit | `assets` | Expected shares without executing |
| `balance_of` | Get user's vault balance | `user` | User's share balance |

**Example Integration:**
```rust
// Preview how many shares user will receive
let expected_shares = env.invoke_contract(
    &vault_address,
    &Symbol::new(env, "preview_deposit"),
    vec![env, deposit_amount]
);

// Execute deposit into vault
let shares_received = env.invoke_contract(
    &vault_address,
    &Symbol::new(env, "deposit"),
    vec![env, asset_address, amount, user_address]
);
```

### 🌀 YieldZap Contract Endpoints

The main contract exposes these functions for frontend integration:

| Function | Purpose | Use Case |
|----------|---------|----------|
| `zap_and_deposit` | Complete swap + vault deposit | Main zap functionality |
| `get_swap_quote` | Preview swap output | Show users expected results |
| `get_available_vaults` | List vaults for asset | Vault discovery |
| `get_vault_info` | Get vault details | Display vault stats |
| `preview_vault_deposit` | Preview vault shares | Show expected shares |

**Complete Zap Flow:**
```rust
// 1. Get quote first (optional)
let quote = zap_contract.get_swap_quote(
    token_in, token_out, amount, path, distribution
);

// 2. Execute complete zap
let result = zap_contract.zap_and_deposit(
    user,           // User address
    usdc_token,     // Input token
    1000_0000000,   // 1000 USDC
    xlm_token,      // Output token
    xlm_vault,      // Target vault
    950_0000000,    // Min 950 XLM (5% slippage)
    empty_path,     // Use optimal routing
    empty_dist      // Use optimal distribution
);
```

### 🔗 Network Endpoints

| Network | Soroswap Aggregator | DeFindex Factory | Status |
|---------|-------------------|-----------------|---------|
| **Futurenet** | `CDLZFC3SYJ...` (placeholder) | `CA7QYNF7SO...` (placeholder) | 🧪 Testing |
| **Mainnet** | TBD | TBD | 🚀 Coming Soon |
| **Localnet** | `CAAAAAAA...D2` | `CAAAAAAA...E2` | 🔧 Development |

> **Note**: Contract addresses in `config.rs` need to be updated with real deployed addresses.

---

## � Technical Implementation

### 🌀 Smart Contract Architecture

YieldZap uses **direct contract invocations** to interact with Soroswap and DeFindex:

```rust
// Direct Soroswap integration
let result: Val = env.invoke_contract(
    &soroswap_aggregator,
    &Symbol::new(env, "swap"),
    swap_parameters
);

// Direct DeFindex integration  
let shares: Val = env.invoke_contract(
    &vault_address,
    &Symbol::new(env, "deposit"),
    deposit_parameters
);
```

### 🔐 Security Features

- **Authorization Required**: All operations require user signature
- **Slippage Protection**: Minimum output validation prevents MEV
- **No Custody**: Contract doesn't hold user funds between operations
- **Emergency Recovery**: Admin can rescue stuck tokens if needed

### 📊 Gas Optimization

- **Batched Operations**: Swap + Deposit in single transaction
- **Optimal Routing**: Uses Soroswap's best paths automatically  
- **Efficient Approvals**: Scoped token approvals with deadlines
- **Event Logging**: Minimal gas overhead for transparency

### 🔄 Transaction Flow

```
1. User approves YieldZap to spend input tokens
2. YieldZap transfers tokens from user
3. YieldZap calls Soroswap for optimal swap
4. YieldZap approves vault to spend swapped tokens
5. YieldZap deposits into DeFindex vault
6. Vault shares are minted to user
7. Events emitted for frontend tracking
```

---

## �📜 License

MIT — Make it. Break it. Fork it. Shill it.

---

## 🌈 Final Word

> **Don’t just farm. Zap.**

Stay composable, stay based 🧙‍♂️



## 🧪 Local Development Setup ✅

### 🔧 Setting Up Local Stellar Devnet ✅

For local testing and development:

```bash
# Start local Stellar Core with Soroban RPC
docker run --rm -it -p 8000:8000 \
  --name stellar-local \
  stellar/quickstart:latest \
  --local \
  --enable-soroban-rpc

# Configure network in Stellar CLI
stellar network add local \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017"

# Create and fund accounts
stellar keys generate admin
stellar keys generate user
stellar keys fund admin --network local
stellar keys fund user --network local
```

### 📋 Local Devnet Status

| Component | Status | Details |
|-----------|--------|---------|
| **Stellar CLI** | ✅ Installed | v23.0.0+ with local network support |
| **Local Network** | ✅ Running | Available via Docker quickstart |
| **Test Accounts** | ✅ Created | Admin & User identities funded |
| **Network Config** | ✅ Complete | RPC: `http://localhost:8000/soroban/rpc` |
| **Contract Deployment** | ✅ Working | Soroban SDK 22.0.0 compatibility |

### 🚀 Quick Start Commands

```bash
# 1. Start local devnet
docker run --rm -it -p 8000:8000 --name stellar-local \
  stellar/quickstart:latest --local --enable-soroban-rpc

# 2. Setup accounts (in another terminal)
stellar network add local --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017"
stellar keys generate admin && stellar keys fund admin --network local

# 3. Build and deploy contract
cd contracts/zap
cargo build --target wasm32-unknown-unknown --release
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/zap.wasm \
  --source admin --network local
```

### 🔧 Available Scripts ✅

Development helper scripts for easy contract management:

| Operation | Command | Purpose |
|-----------|---------|---------|
| **Build Contract** | `cd contracts/zap && cargo build --target wasm32-unknown-unknown --release` | Compile optimized WASM |
| **Deploy Local** | `stellar contract deploy --wasm [...] --source admin --network local` | Deploy to local devnet |
| **Deploy Testnet** | `stellar contract deploy --wasm [...] --source admin --network testnet` | Deploy to testnet |
| **Fund Account** | `stellar keys fund <account> --network local` | Add XLM to account |
| **Check Balance** | `stellar keys fund <account> --network local` | View account balance |

### 📝 Contract Configuration

Make sure your `contracts/zap/Cargo.toml` has optimized settings:

```toml
[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false
panic = "abort"
codegen-units = 1
lto = true
```

### ⚠️ Migration Notes

**✅ Successfully Migrated from Soroban CLI to Stellar CLI**

The project has been updated to use the new **Stellar CLI v23.0.0** (formerly Soroban CLI). Key changes:

- **CLI Command**: `soroban` → `stellar`
- **Installation**: Now requires system dependencies and cargo install
- **Networks**: Updated network configuration format
- **Compatibility**: Using Soroban SDK v22.0.0 with Stellar Core v22.3.0

All deployment commands in this README use the new Stellar CLI syntax.

### 🐛 Troubleshooting ✅

**Network Issues**:
```bash
# Stop any existing containers
docker rm -f stellar-local

# Start fresh
docker run --rm -it -p 8000:8000 --name stellar-local \
  stellar/quickstart:latest --local --enable-soroban-rpc
```

**Reset Network Configuration**:
```bash
# Remove local network config
stellar network rm local

# Re-add with correct settings
stellar network add local \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017"
```

**Contract Deployment Issues**:
```bash
# Verify WASM compilation
cd contracts/zap
cargo build --target wasm32-unknown-unknown --release
ls -la target/wasm32-unknown-unknown/release/zap.wasm

# Check account has funds
stellar keys fund admin --network local

# Verify network connectivity
curl http://localhost:8000/soroban/rpc -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

---

## TODO

    ✅ Write the real Soroswap Aggregator + DeFindex Vault calls
    ✅ Start Frontend: Build the UI for users to call zap_and_deposit
    ✅ Set up local Stellar devnet and migrate to Stellar CLI v23.0.0
    ✅ Deploy YieldZap contract successfully to local devnet
    🤖 Build the backend bot (rebalancer or AI strategy engine)
    🌐 Deploy to Stellar testnet and mainnet
    🔗 Integrate with real Soroswap and DeFindex contract addresses