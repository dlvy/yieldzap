import { Address } from '@stellar/stellar-sdk';

export interface SwapPath {
  token_in: string;
  token_out: string;
  amount_in: string;
  amount_out_min: string;
  distribution: number[];
  path: string[];
}

export interface ZapResult {
  amount_swapped: string;
  vault_shares: string;
  vault_address: string;
}

export interface VaultInfo {
  address: string;
  name: string;
  symbol: string;
  asset: string;
  total_assets: string;
  total_shares: string;
  fee_rate: number;
  apy: number;
  description?: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  icon?: string;
}

export interface ZapParams {
  user: string;
  from_token: string;
  amount_in: string;
  to_token: string;
  vault_address: string;
  min_amount_out: string;
  swap_path: string[];
  distribution: number[];
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balances: Record<string, string>;
  isLoading: boolean;
}

export interface TransactionState {
  isLoading: boolean;
  hash: string | null;
  error: string | null;
  success: boolean;
}

// Network configuration
export interface NetworkConfig {
  networkUrl: string;
  networkPassphrase: string;
  zapContractId: string;
  soroswapAggregatorId: string;
  defindexFactoryId: string;
}

// UI state types
export interface ZapFormData {
  fromToken: string;
  toToken: string;
  amount: string;
  vault: string;
  slippage: number;
}

export interface QuoteResult {
  expectedOutput: string;
  minimumOutput: string;
  priceImpact: number;
  route: string[];
  estimatedShares: string;
}

export enum TransactionStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}
