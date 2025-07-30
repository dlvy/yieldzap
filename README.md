# 🚀 YieldZap: One-Click Yield Farming on Stellar 🌠

Welcome to **YieldZap** — the most based way to zap your bags into yield 
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
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/installation)
- Node.js + `pnpm`
- Git brain

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
- 🚀 **Soroban CLI** - Contract deployment and testing
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



## TODO

    ✅ Write the real Soroswap Aggregator + DeFindex Vault calls
    🖼 Start Frontend: Build the UI for users to call zap_and_deposit
    🔁 Set up local Soroban devnet so you can test locally
    🤖 Build the backend bot (rebalancer or AI strategy engine)