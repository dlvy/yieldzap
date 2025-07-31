import { NetworkConfig } from './types';

// Network configurations
export const NETWORKS: Record<string, NetworkConfig> = {
  futurenet: {
    networkUrl: 'https://rpc-futurenet.stellar.org:443',
    networkPassphrase: 'Test SDF Future Network ; October 2022',
    zapContractId: process.env.NEXT_PUBLIC_ZAP_CONTRACT_ID || '',
    soroswapAggregatorId: process.env.NEXT_PUBLIC_SOROSWAP_AGGREGATOR_ID || '',
    defindexFactoryId: process.env.NEXT_PUBLIC_DEFINDEX_FACTORY_ID || '',
  },
  testnet: {
    networkUrl: 'https://soroban-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    zapContractId: process.env.NEXT_PUBLIC_ZAP_CONTRACT_ID_TESTNET || '',
    soroswapAggregatorId: process.env.NEXT_PUBLIC_SOROSWAP_AGGREGATOR_ID_TESTNET || '',
    defindexFactoryId: process.env.NEXT_PUBLIC_DEFINDEX_FACTORY_ID_TESTNET || '',
  },
  mainnet: {
    networkUrl: 'https://soroban-mainnet.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    zapContractId: process.env.NEXT_PUBLIC_ZAP_CONTRACT_ID_MAINNET || '',
    soroswapAggregatorId: process.env.NEXT_PUBLIC_SOROSWAP_AGGREGATOR_ID_MAINNET || '',
    defindexFactoryId: process.env.NEXT_PUBLIC_DEFINDEX_FACTORY_ID_MAINNET || '',
  },
};

export const getCurrentNetwork = (): NetworkConfig => {
  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'futurenet';
  return NETWORKS[network];
};

// Common token addresses (placeholder - update with real addresses)
export const COMMON_TOKENS = {
  futurenet: {
    USDC: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
    XLM: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAUHKENNOSN',
    EURC: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
  },
  testnet: {
    USDC: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
    XLM: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAUHKENNOSN',
    EURC: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
  },
  mainnet: {
    USDC: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
    XLM: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAUHKENNOSN',
    EURC: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
  },
};

export const getTokensForNetwork = () => {
  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'futurenet';
  return COMMON_TOKENS[network as keyof typeof COMMON_TOKENS];
};

// Utility functions
export const formatTokenAmount = (amount: string, decimals: number = 7): string => {
  const num = parseFloat(amount) / Math.pow(10, decimals);
  return num.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 6 
  });
};

export const parseTokenAmount = (amount: string, decimals: number = 7): string => {
  const num = parseFloat(amount) * Math.pow(10, decimals);
  return Math.floor(num).toString();
};

export const truncateAddress = (address: string, chars: number = 8): string => {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const calculateSlippage = (amount: string, slippagePercent: number): string => {
  const num = parseFloat(amount);
  const slippageAmount = num * (slippagePercent / 100);
  return (num - slippageAmount).toString();
};
