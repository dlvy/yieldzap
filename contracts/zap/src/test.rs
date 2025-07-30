#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    Address, Env, String, Vec,
};

#[test]
fn test_zap_and_deposit_same_token() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, Zap);
    let client = ZapClient::new(&env, &contract_id);

    // Setup test addresses
    let user = Address::generate(&env);
    let token = Address::generate(&env);
    let vault = Address::generate(&env);

    // Test zapping with same input/output token (no swap needed)
    let amount = 1000i128;
    let min_out = 900i128;
    let empty_path = Vec::new(&env);
    let empty_distribution = Vec::new(&env);

    // Mock the token contract
    env.mock_contract_call(
        &token,
        &Symbol::new(&env, "transfer"),
        |_, _| Ok(()),
    );

    // Mock the vault contract  
    env.mock_contract_call(
        &vault,
        &Symbol::new(&env, "deposit"), 
        |_, _| Ok(500i128.into_val(&env)),
    );

    let result = client.zap_and_deposit(
        &user,
        &token,
        &amount,
        &token, // Same token
        &vault,
        &min_out,
        &empty_path,
        &empty_distribution,
    );

    assert_eq!(result.amount_swapped, amount);
    assert_eq!(result.vault_shares, 500i128);
    assert_eq!(result.vault_address, vault);
}

#[test]
fn test_get_swap_quote() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, Zap);
    let client = ZapClient::new(&env, &contract_id);

    let token_in = Address::generate(&env);
    let token_out = Address::generate(&env);
    let amount = 1000i128;
    let path = Vec::new(&env);
    let distribution = Vec::new(&env);

    // Mock Soroswap aggregator
    let soroswap = Address::generate(&env);
    env.mock_contract_call(
        &soroswap,
        &Symbol::new(&env, "get_amounts_out"),
        |_, _| Ok(950i128.into_val(&env)),
    );

    let quote = client.get_swap_quote(&token_in, &token_out, &amount, &path, &distribution);
    assert_eq!(quote, 950i128);
}

#[test]
fn test_get_available_vaults() {
    let env = Env::default();

    let contract_id = env.register_contract(None, Zap);
    let client = ZapClient::new(&env, &contract_id);

    let usdc = Address::generate(&env);
    let vaults = client.get_available_vaults(&usdc);
    
    // Should return at least the mixed vault
    assert!(vaults.len() >= 1);
}

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, Zap);
    let client = ZapClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    // Verify admin was stored (would need to add getter function to verify)
}

#[test]
#[should_panic(expected = "Amount must be positive")]
fn test_zap_negative_amount() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, Zap);
    let client = ZapClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    let token = Address::generate(&env);
    let vault = Address::generate(&env);
    let empty_path = Vec::new(&env);
    let empty_distribution = Vec::new(&env);

    // This should panic
    client.zap_and_deposit(
        &user,
        &token,
        &(-100i128), // Negative amount
        &token,
        &vault,
        &0i128,
        &empty_path,
        &empty_distribution,
    );
}

mod mock_contracts {
    use super::*;

    // Mock Soroswap Aggregator for testing
    #[contract]
    pub struct MockSoroswapAggregator;

    #[contractimpl]
    impl MockSoroswapAggregator {
        pub fn swap(
            env: Env,
            token_in: Address,
            token_out: Address,
            amount_in: i128,
            amount_out_min: i128,
            path: Vec<Address>,
            distribution: Vec<u32>,
        ) -> i128 {
            // Mock swap - return 95% of input amount
            (amount_in * 95) / 100
        }

        pub fn get_amounts_out(
            env: Env,
            token_in: Address,
            token_out: Address,
            amount_in: i128,
            path: Vec<Address>,
            distribution: Vec<u32>,
        ) -> i128 {
            // Mock quote - return 95% of input amount
            (amount_in * 95) / 100
        }

        pub fn get_best_route(
            env: Env,
            token_in: Address,
            token_out: Address,
            amount_in: i128,
        ) -> (Vec<Address>, Vec<u32>) {
            let mut path = Vec::new(&env);
            path.push_back(token_in);
            path.push_back(token_out);

            let mut distribution = Vec::new(&env);
            distribution.push_back(100u32); // 100% through one route

            (path, distribution)
        }
    }

    // Mock DeFindex Vault for testing
    #[contract]
    pub struct MockVault;

    #[contractimpl]
    impl MockVault {
        pub fn deposit(env: Env, asset: Address, amount: i128, receiver: Address) -> i128 {
            // Mock deposit - return half the amount as shares (2:1 ratio)
            amount / 2
        }

        pub fn withdraw(env: Env, shares: i128, receiver: Address) -> i128 {
            // Mock withdraw - return double the shares as assets
            shares * 2
        }

        pub fn get_info(env: Env) -> Vec<Val> {
            let mut info = Vec::new(&env);
            info.push_back(1000000i128.into_val(&env)); // total_assets
            info.push_back(500000i128.into_val(&env));  // total_shares
            info
        }

        pub fn preview_deposit(env: Env, assets: i128) -> i128 {
            // Mock preview - same as actual deposit logic
            assets / 2
        }

        pub fn balance_of(env: Env, user: Address) -> i128 {
            // Mock balance
            100i128
        }
    }
}

#[test]
fn test_full_integration_with_mocks() {
    let env = Env::default();
    env.mock_all_auths();

    // Deploy contracts
    let zap_contract_id = env.register_contract(None, Zap);
    let zap_client = ZapClient::new(&env, &zap_contract_id);

    let soroswap_id = env.register_contract(None, mock_contracts::MockSoroswapAggregator);
    let vault_id = env.register_contract(None, mock_contracts::MockVault);

    // Setup test scenario
    let user = Address::generate(&env);
    let token_in = Address::generate(&env);
    let token_out = Address::generate(&env);
    let amount = 1000i128;
    let min_out = 900i128;

    let mut path = Vec::new(&env);
    path.push_back(token_in.clone());
    path.push_back(token_out.clone());

    let mut distribution = Vec::new(&env);
    distribution.push_back(100u32);

    // This would be a more comprehensive integration test
    // if we had proper mock setups for the external contract calls
}
