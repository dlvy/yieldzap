#![no_std]

mod interfaces;
mod config;

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, IntoVal, Symbol, TryIntoVal, Val, Vec, vec,
    token::Client as TokenClient,
};

use config::{ContractAddresses, VaultAddresses};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SwapPath {
    pub token_in: Address,
    pub token_out: Address,
    pub amount_in: i128,
    pub amount_out_min: i128,
    pub distribution: Vec<u32>, // Distribution percentages across multiple DEXs
    pub path: Vec<Address>,     // Token addresses in swap path
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ZapResult {
    pub amount_swapped: i128,
    pub vault_shares: i128,
    pub vault_address: Address,
}

#[contract]
pub struct Zap;

#[contractimpl]
impl Zap {
    /// Main zap function: swap tokens via Soroswap then deposit into DeFindex Vault
    /// 
    /// # Arguments
    /// * `user` - Address of the user performing the zap
    /// * `from_token` - Address of input token to swap from
    /// * `amount_in` - Amount of input tokens to swap
    /// * `to_token` - Address of output token to receive
    /// * `vault_address` - Address of DeFindex vault to deposit into
    /// * `min_amount_out` - Minimum amount of output tokens from swap
    /// * `swap_path` - Optional custom swap path (if empty, will use optimal routing)
    /// * `distribution` - Optional custom distribution across DEXs
    /// 
    /// # Returns
    /// * ZapResult containing swap amount and vault shares received
    pub fn zap_and_deposit(
        env: Env,
        user: Address,
        from_token: Address,
        amount_in: i128,
        to_token: Address,
        vault_address: Address,
        min_amount_out: i128,
        swap_path: Vec<Address>,
        distribution: Vec<u32>,
    ) -> ZapResult {
        user.require_auth();

        // Validate inputs
        if amount_in <= 0 {
            panic!("Amount must be positive");
        }

        // Step 1: Transfer input tokens from user to this contract
        let token_client = TokenClient::new(&env, &from_token);
        token_client.transfer(&user, &env.current_contract_address(), &amount_in);

        // Step 2: Perform swap via Soroswap Aggregator
        let swapped_amount = if from_token == to_token {
            // No swap needed if tokens are the same
            amount_in
        } else {
            Self::swap_via_soroswap(
                &env,
                from_token.clone(),
                to_token.clone(),
                amount_in,
                min_amount_out,
                swap_path,
                distribution,
            )
        };

        // Ensure we received at least the minimum amount
        if swapped_amount < min_amount_out {
            panic!("Insufficient output amount from swap");
        }

        // Step 3: Approve vault to spend the swapped tokens
        let to_token_client = TokenClient::new(&env, &to_token);
        to_token_client.approve(
            &env.current_contract_address(),
            &vault_address,
            &swapped_amount,
            &(env.ledger().sequence() + 1000), // Approval deadline
        );

        // Step 4: Deposit into DeFindex Vault
        let vault_shares = Self::deposit_to_defindex_vault(
            &env,
            vault_address.clone(),
            to_token,
            swapped_amount,
            user.clone(),
        );

        let result = ZapResult {
            amount_swapped: swapped_amount,
            vault_shares,
            vault_address: vault_address.clone(),
        };

        env.events().publish(
            (Symbol::new(&env, "zap_completed"),),
            (user, from_token, amount_in, vault_address, result.clone()),
        );

        result
    }

    /// Swap tokens using Soroswap Aggregator
    fn swap_via_soroswap(
        env: &Env,
        token_in: Address,
        token_out: Address,
        amount_in: i128,
        min_amount_out: i128,
        path: Vec<Address>,
        distribution: Vec<u32>,
    ) -> i128 {
        let config = ContractAddresses::futurenet(env); // Use appropriate network
        let soroswap_aggregator = config.soroswap_aggregator;

        // Approve Soroswap to spend our tokens
        let token_in_client = TokenClient::new(env, &token_in);
        token_in_client.approve(
            &env.current_contract_address(),
            &soroswap_aggregator,
            &amount_in,
            &(env.ledger().sequence() + 100),
        );

        // Use provided path/distribution or get optimal route
        let (swap_path, swap_distribution) = if path.is_empty() {
            // Get optimal route from Soroswap
            Self::get_optimal_route(env, &soroswap_aggregator, token_in.clone(), token_out.clone(), amount_in)
        } else {
            (path, distribution)
        };

        // Prepare swap parameters
        let swap_params = vec![
            env,
            token_in.into_val(env),
            token_out.into_val(env),
            amount_in.into_val(env),
            min_amount_out.into_val(env),
            swap_path.into_val(env),
            swap_distribution.into_val(env),
        ];

        // Call Soroswap Aggregator's swap function
        let result: Val = env.invoke_contract(
            &soroswap_aggregator,
            &Symbol::new(env, "swap"),
            swap_params,
        );

        // Extract the amount received from swap
        let amount_out: i128 = result.try_into_val(env).unwrap();

        env.events().publish(
            (Symbol::new(env, "soroswap_swap"),),
            (token_in, token_out, amount_in, amount_out),
        );

        amount_out
    }

    /// Get optimal route from Soroswap
    fn get_optimal_route(
        env: &Env,
        soroswap_aggregator: &Address,
        token_in: Address,
        token_out: Address,
        amount_in: i128,
    ) -> (Vec<Address>, Vec<u32>) {
        let route_params = vec![
            env,
            token_in.into_val(env),
            token_out.into_val(env),
            amount_in.into_val(env),
        ];

        let result: Val = env.invoke_contract(
            soroswap_aggregator,
            &Symbol::new(env, "get_best_route"),
            route_params,
        );

        // Parse result into path and distribution
        // This would need to match Soroswap's actual return format
        let (path, distribution): (Vec<Address>, Vec<u32>) = result.try_into_val(env).unwrap();
        (path, distribution)
    }

    /// Deposit tokens into DeFindex Vault
    fn deposit_to_defindex_vault(
        env: &Env,
        vault_address: Address,
        asset: Address,
        amount: i128,
        receiver: Address,
    ) -> i128 {
        // Prepare deposit parameters for DeFindex Vault
        let deposit_params = vec![
            env,
            asset.into_val(env),
            amount.into_val(env),
            receiver.into_val(env),
        ];

        // Call DeFindex Vault's deposit function
        let result: Val = env.invoke_contract(
            &vault_address,
            &Symbol::new(env, "deposit"),
            deposit_params,
        );

        // Extract vault shares received
        let shares: i128 = result.try_into_val(env).unwrap();

        env.events().publish(
            (Symbol::new(env, "defindex_deposit"),),
            (vault_address, asset, amount, receiver, shares),
        );

        shares
    }

    /// Get quote from Soroswap for amount out estimation
    pub fn get_swap_quote(
        env: Env,
        token_in: Address,
        token_out: Address,
        amount_in: i128,
        path: Vec<Address>,
        distribution: Vec<u32>,
    ) -> i128 {
        let config = ContractAddresses::futurenet(&env);
        let soroswap_aggregator = config.soroswap_aggregator;

        let quote_params = vec![
            &env,
            token_in.into_val(&env),
            token_out.into_val(&env),
            amount_in.into_val(&env),
            path.into_val(&env),
            distribution.into_val(&env),
        ];

        let result: Val = env.invoke_contract(
            &soroswap_aggregator,
            &Symbol::new(&env, "get_amounts_out"),
            quote_params,
        );

        result.try_into_val(&env).unwrap()
    }

    /// Get vault information from DeFindex
    pub fn get_vault_info(env: Env, vault_address: Address) -> Vec<Val> {
        let info_params = vec![&env];

        let result: Val = env.invoke_contract(
            &vault_address,
            &Symbol::new(&env, "get_info"),
            info_params,
        );
        
        result.try_into_val(&env).unwrap()
    }

    /// Preview how many vault shares would be received for a deposit
    pub fn preview_vault_deposit(env: Env, vault_address: Address, amount: i128) -> i128 {
        let preview_params = vec![&env, amount.into_val(&env)];

        let result: Val = env.invoke_contract(
            &vault_address,
            &Symbol::new(&env, "preview_deposit"),
            preview_params,
        );

        result.try_into_val(&env).unwrap()
    }

    /// Get available vaults for a given asset
    pub fn get_available_vaults(env: Env, asset: Address) -> Vec<Address> {
        let vaults = VaultAddresses::futurenet(&env);
        let config = ContractAddresses::futurenet(&env);
        
        // This is a simplified version - in practice, you'd query the DeFindex factory
        let mut available_vaults = Vec::new(&env);
        
        if asset == config.usdc {
            available_vaults.push_back(vaults.usdc_vault);
        }
        if asset == config.xlm {
            available_vaults.push_back(vaults.xlm_vault);
        }
        if asset == config.aqua {
            available_vaults.push_back(vaults.aqua_vault);
        }
        
        // Always include mixed vault as it can accept multiple assets
        available_vaults.push_back(vaults.mixed_vault);
        
        available_vaults
    }

    /// Emergency function to withdraw stuck tokens (admin only)
    pub fn emergency_withdraw(
        env: Env,
        admin: Address,
        token: Address,
        amount: i128,
        to: Address,
    ) {
        admin.require_auth();
        
        // TODO: Add proper admin verification
        let token_client = TokenClient::new(&env, &token);
        token_client.transfer(&env.current_contract_address(), &to, &amount);

        env.events().publish(
            (Symbol::new(&env, "emergency_withdraw"),),
            (admin, token, amount, to),
        );
    }

    /// Initialize contract with admin (call once after deployment)
    pub fn initialize(env: Env, admin: Address) {
        // Store admin in contract storage for future admin-only operations
        env.storage().instance().set(&Symbol::new(&env, "admin"), &admin);
        
        env.events().publish(
            (Symbol::new(&env, "initialized"),),
            admin,
        );
    }
}
