use soroban_sdk::{contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ContractAddresses {
    pub soroswap_aggregator: Address,
    pub defindex_factory: Address,
    pub usdc: Address,
    pub xlm: Address,
    pub aqua: Address,
}

impl ContractAddresses {
    /// Get contract addresses for Futurenet
    pub fn futurenet(env: &Env) -> Self {
        Self {
            // Replace these with actual Soroswap Aggregator address on Futurenet
            soroswap_aggregator: Address::from_string(&String::from_str(
                env,
                "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQADUHHZX252", // Placeholder
            )),
            // Replace with actual DeFindex Factory address  
            defindex_factory: Address::from_string(&String::from_str(
                env,
                "CA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUIGZ", // Placeholder
            )),
            // USDC token address on Futurenet
            usdc: Address::from_string(&String::from_str(
                env,
                "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA", // Placeholder
            )),
            // Native XLM address
            xlm: Address::from_string(&String::from_str(
                env,
                "CDMLFMKMMD7MWZP3FKUBZPVHTUEDLSX4BYGYKH4GCESXYHS3IHQ4EIG4", // Native XLM
            )),
            // AQUA token address
            aqua: Address::from_string(&String::from_str(
                env,
                "CCKDJ67DZSKSYLWVW5VPYMTVUXM6ZFXE7AQLNWRQJGLTC44MLJMB3S3Y", // Placeholder
            )),
        }
    }

    /// Get contract addresses for Mainnet
    pub fn mainnet(env: &Env) -> Self {
        Self {
            // Replace these with actual Soroswap Aggregator address on Mainnet
            soroswap_aggregator: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
            // Replace with actual DeFindex Factory address on Mainnet
            defindex_factory: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
            // USDC token address on Mainnet
            usdc: Address::from_string(&String::from_str(
                env,
                "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75", // USDC on Mainnet
            )),
            // Native XLM address (same across networks)
            xlm: Address::from_string(&String::from_str(
                env,
                "CDMLFMKMMD7MWZP3FKUBZPVHTUEDLSX4BYGYKH4GCESXYHS3IHQ4EIG4", // Native XLM
            )),
            // AQUA token address on Mainnet
            aqua: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
        }
    }

    /// Get contract addresses for local testing
    pub fn localnet(env: &Env) -> Self {
        Self {
            soroswap_aggregator: Address::from_string(&String::from_str(
                env,
                "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2", // Local test address
            )),
            defindex_factory: Address::from_string(&String::from_str(
                env,
                "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE2", // Local test address
            )),
            usdc: Address::from_string(&String::from_str(
                env,
                "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF2", // Local test address
            )),
            xlm: Address::from_string(&String::from_str(
                env,
                "CDMLFMKMMD7MWZP3FKUBZPVHTUEDLSX4BYGYKH4GCESXYHS3IHQ4EIG4", // Native XLM
            )),
            aqua: Address::from_string(&String::from_str(
                env,
                "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG2", // Local test address
            )),
        }
    }
}

/// Common vault addresses on different networks
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VaultAddresses {
    pub usdc_vault: Address,
    pub xlm_vault: Address,
    pub aqua_vault: Address,
    pub mixed_vault: Address, // Multi-asset vault
}

impl VaultAddresses {
    pub fn futurenet(env: &Env) -> Self {
        Self {
            usdc_vault: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
            xlm_vault: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
            aqua_vault: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
            mixed_vault: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
        }
    }

    pub fn mainnet(env: &Env) -> Self {
        Self {
            usdc_vault: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
            xlm_vault: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
            aqua_vault: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
            mixed_vault: Address::from_string(&String::from_str(
                env,
                "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // To be updated
            )),
        }
    }

    pub fn localnet(env: &Env) -> Self {
        Self {
            usdc_vault: Address::from_string(&String::from_str(
                env,
                "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH2", // Local test address
            )),
            xlm_vault: Address::from_string(&String::from_str(
                env,
                "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI2", // Local test address
            )),
            aqua_vault: Address::from_string(&String::from_str(
                env,
                "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ2", // Local test address
            )),
            mixed_vault: Address::from_string(&String::from_str(
                env,
                "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK2", // Local test address
            )),
        }
    }
}
