use soroban_sdk::{contracttype, Address, Vec};

/// Soroswap Aggregator Interface - Documentation Only
/// 
/// The actual contract calls are made using env.invoke_contract()
/// These types document the expected function signatures

/// DeFindex Vault Interface - Documentation Only
/// 
/// The actual contract calls are made using env.invoke_contract()
/// These types document the expected function signatures

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VaultInfo {
    pub asset: Address,           // Underlying asset address
    pub total_assets: i128,       // Total assets under management
    pub total_shares: i128,       // Total vault shares outstanding
    pub name: soroban_sdk::String, // Vault name
    pub symbol: soroban_sdk::String, // Vault symbol
    pub decimals: u32,            // Vault share decimals (changed from u8 to u32)
    pub fee: u32,                 // Management fee (basis points)
    pub strategy: Address,        // Active strategy address
}

/// Router information for multi-hop swaps
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SwapRoute {
    pub path: Vec<Address>,       // Token addresses in swap path
    pub pools: Vec<Address>,      // DEX pool addresses
    pub distribution: Vec<u32>,   // Distribution percentages
    pub expected_amount: i128,    // Expected output amount
    pub minimum_amount: i128,     // Minimum acceptable output
    pub price_impact: u32,        // Price impact in basis points
}
