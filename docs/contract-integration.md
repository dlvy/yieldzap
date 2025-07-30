# YieldZap Contract Integration Guide

This document provides detailed information about integrating with the real Soroswap Aggregator and DeFindex Vault contracts in the YieldZap protocol.

## Overview

The YieldZap contract performs two main operations:
1. **Token Swap**: Uses Soroswap Aggregator to swap input tokens to vault-compatible assets
2. **Vault Deposit**: Deposits swapped tokens into DeFindex vaults for yield generation

## Contract Addresses

### Futurenet (Testnet)
```
Zap Contract: [To be deployed]
Soroswap Aggregator: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQADUHHZX252 (placeholder)
DeFindex Factory: CA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUIGZ (placeholder)
```

### Mainnet
```
[Addresses to be updated when deployed to mainnet]
```

## Core Functions

### 1. `zap_and_deposit`

Main function that performs the complete zap operation.

```rust
pub fn zap_and_deposit(
    env: Env,
    user: Address,              // User performing the zap
    from_token: Address,        // Input token to swap from
    amount_in: i128,           // Amount of input tokens
    to_token: Address,         // Output token (vault asset)
    vault_address: Address,    // Target DeFindex vault
    min_amount_out: i128,      // Minimum output from swap
    swap_path: Vec<Address>,   // Custom swap path (empty for optimal)
    distribution: Vec<u32>,    // DEX distribution (empty for optimal)
) -> ZapResult
```

**Returns**: `ZapResult` containing:
- `amount_swapped`: Amount received from swap
- `vault_shares`: Vault shares received
- `vault_address`: Address of the vault

### 2. `get_swap_quote`

Get estimated output amount for a swap.

```rust
pub fn get_swap_quote(
    env: Env,
    token_in: Address,
    token_out: Address,
    amount_in: i128,
    path: Vec<Address>,
    distribution: Vec<u32>,
) -> i128
```

### 3. `get_available_vaults`

Get available vaults for a given asset.

```rust
pub fn get_available_vaults(env: Env, asset: Address) -> Vec<Address>
```

## Soroswap Aggregator Integration

The contract integrates with Soroswap Aggregator using the following functions:

### Swap Function
```rust
fn swap(
    env: Env,
    token_in: Address,
    token_out: Address,
    amount_in: i128,
    amount_out_min: i128,
    path: Vec<Address>,
    distribution: Vec<u32>,
) -> i128
```

### Get Quote Function
```rust
fn get_amounts_out(
    env: Env,
    token_in: Address,
    token_out: Address,
    amount_in: i128,
    path: Vec<Address>,
    distribution: Vec<u32>,
) -> i128
```

### Optimal Routing
```rust
fn get_best_route(
    env: Env,
    token_in: Address,
    token_out: Address,
    amount_in: i128,
) -> (Vec<Address>, Vec<u32>)
```

## DeFindex Vault Integration

The contract integrates with DeFindex vaults using the following functions:

### Deposit Function
```rust
fn deposit(
    env: Env,
    asset: Address,
    amount: i128,
    receiver: Address,
) -> i128  // Returns vault shares
```

### Vault Information
```rust
fn get_info(env: Env) -> VaultInfo
```

### Preview Deposit
```rust
fn preview_deposit(env: Env, assets: i128) -> i128  // Returns expected shares
```

## Usage Examples

### Basic Zap Operation

```rust
use soroban_sdk::{Address, Env, Vec};

// Setup
let user = Address::from_string(&String::from_str(&env, "GUSER..."));
let usdc = Address::from_string(&String::from_str(&env, "CUSDC..."));
let xlm = Address::from_string(&String::from_str(&env, "CXLM..."));
let vault = Address::from_string(&String::from_str(&env, "CVAULT..."));

// Empty vectors for optimal routing
let empty_path = Vec::new(&env);
let empty_distribution = Vec::new(&env);

// Perform zap: USDC -> XLM -> Vault
let result = zap_client.zap_and_deposit(
    &user,
    &usdc,           // From USDC
    &1000_0000000,   // 1000 USDC (7 decimals)
    &xlm,            // To XLM
    &vault,          // Target vault
    &95_0000000,     // Min 95 XLM out
    &empty_path,     // Use optimal path
    &empty_distribution, // Use optimal distribution
);

println!("Swapped: {} XLM", result.amount_swapped);
println!("Vault shares: {}", result.vault_shares);
```

### Get Quote Before Zapping

```rust
// Get quote first
let quote = zap_client.get_swap_quote(
    &usdc,
    &xlm,
    &1000_0000000,
    &empty_path,
    &empty_distribution,
);

println!("Expected XLM output: {}", quote);

// Use quote to set reasonable slippage
let min_out = (quote * 98) / 100; // 2% slippage tolerance
```

### Custom Routing

```rust
// Define custom swap path: USDC -> AQUA -> XLM
let mut custom_path = Vec::new(&env);
custom_path.push_back(usdc.clone());
custom_path.push_back(aqua.clone());
custom_path.push_back(xlm.clone());

// Define distribution: 60% through DEX1, 40% through DEX2
let mut custom_distribution = Vec::new(&env);
custom_distribution.push_back(60u32);
custom_distribution.push_back(40u32);

let result = zap_client.zap_and_deposit(
    &user,
    &usdc,
    &1000_0000000,
    &xlm,
    &vault,
    &95_0000000,
    &custom_path,
    &custom_distribution,
);
```

## Error Handling

The contract includes several validation checks:

- **Amount Validation**: Input amount must be positive
- **Slippage Protection**: Output must meet minimum amount requirement
- **Authorization**: User must authorize the transaction
- **Token Approvals**: Proper token approvals are handled automatically

Common error scenarios:
```rust
// Will panic: "Amount must be positive"
zap_client.zap_and_deposit(&user, &token, &-100, ...);

// Will panic: "Insufficient output amount from swap"
// If swap output < min_amount_out
```

## Gas Optimization

To optimize gas usage:

1. **Use Optimal Routing**: Pass empty path/distribution vectors to use Soroswap's optimal routing
2. **Batch Operations**: The contract combines swap + deposit in a single transaction
3. **Efficient Approvals**: Token approvals are scoped to specific amounts and deadlines

## Security Features

1. **Authorization Required**: All operations require user authorization
2. **No Token Custody**: Contract doesn't hold user tokens long-term
3. **Emergency Withdrawal**: Admin can recover stuck tokens if needed
4. **Event Logging**: All operations emit events for transparency

## Integration with Frontend

Frontend applications should:

1. **Get Quote First**: Always call `get_swap_quote` to show expected output
2. **Set Reasonable Slippage**: Typically 1-5% depending on market conditions
3. **Handle Errors Gracefully**: Catch and display meaningful error messages
4. **Monitor Events**: Listen for `zap_completed` events to confirm success

## Testing

Run the contract tests:

```bash
cd contracts/zap
cargo test
```

Deploy to Futurenet for testing:

```bash
cd scripts
./deploy.zap.sh
```

## Real Contract Addresses

**Note**: The placeholder addresses in the code need to be updated with real deployed contract addresses:

1. **Soroswap Aggregator**: Update in `config.rs`
2. **DeFindex Vaults**: Update vault addresses in `config.rs`  
3. **Token Addresses**: Update USDC, XLM, AQUA addresses

Contact the Soroswap and DeFindex teams for the latest contract addresses on each network.
