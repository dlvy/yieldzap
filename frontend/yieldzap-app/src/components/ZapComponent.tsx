import React, { useState, useEffect } from 'react';
import { Zap, ArrowDown, Settings, Wallet, ExternalLink, TrendingUp } from 'lucide-react';

interface TokenOption {
  address: string;
  symbol: string;
  name: string;
  balance?: string;
  icon?: string;
}

interface VaultOption {
  address: string;
  name: string;
  asset: string;
  apy: number;
  tvl: string;
  description?: string;
}

interface ZapComponentProps {
  onZap: (params: any) => Promise<void>;
  isLoading: boolean;
  walletConnected: boolean;
  userAddress?: string;
}

const ZapComponent: React.FC<ZapComponentProps> = ({ 
  onZap, 
  isLoading, 
  walletConnected, 
  userAddress 
}) => {
  const [fromToken, setFromToken] = useState<TokenOption | null>(null);
  const [toToken, setToToken] = useState<TokenOption | null>(null);
  const [vault, setVault] = useState<VaultOption | null>(null);
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(1); // 1% default
  const [showSettings, setShowSettings] = useState(false);
  const [quote, setQuote] = useState<any>(null);

  // Mock data - replace with real data from APIs
  const availableTokens: TokenOption[] = [
    {
      address: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '1,234.56',
    },
    {
      address: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAUHKENNOSN',
      symbol: 'XLM',
      name: 'Stellar Lumens',
      balance: '5,678.90',
    },
    {
      address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      symbol: 'EURC',
      name: 'Euro Coin',
      balance: '890.12',
    },
  ];

  const availableVaults: VaultOption[] = [
    {
      address: 'VAULT1234567890ABCDEF',
      name: 'USDC Yield Vault',
      asset: 'USDC',
      apy: 8.5,
      tvl: '$2.5M',
      description: 'Optimized USDC lending strategy',
    },
    {
      address: 'VAULT0987654321FEDCBA',
      name: 'XLM Staking Vault',
      asset: 'XLM',
      apy: 12.3,
      tvl: '$1.8M',
      description: 'Native XLM staking rewards',
    },
    {
      address: 'VAULTEURC123456789',
      name: 'EURC Strategy Vault',
      asset: 'EURC',
      apy: 6.7,
      tvl: '$800K',
      description: 'European stablecoin strategy',
    },
  ];

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleZap = async () => {
    if (!fromToken || !toToken || !vault || !amount) return;

    const zapParams = {
      user: userAddress,
      from_token: fromToken.address,
      amount_in: amount,
      to_token: toToken.address,
      vault_address: vault.address,
      min_amount_out: quote?.minimumOutput || '0',
      swap_path: [],
      distribution: [],
    };

    await onZap(zapParams);
  };

  const isValidZap = fromToken && toToken && vault && amount && parseFloat(amount) > 0;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-stellar-500 to-stellar-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">YieldZap</h1>
                <p className="text-stellar-100 text-sm">One-click yield farming</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-b border-gray-100 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Slippage Tolerance</span>
              <div className="flex items-center gap-2">
                {[0.5, 1, 2, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      slippage === value
                        ? 'bg-stellar-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Zap Interface */}
        <div className="p-6 space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">From</label>
            <div className="relative">
              <select
                value={fromToken?.address || ''}
                onChange={(e) => {
                  const selected = availableTokens.find(t => t.address === e.target.value);
                  setFromToken(selected || null);
                }}
                className="w-full p-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-stellar-500 focus:border-transparent appearance-none"
              >
                <option value="">Select token</option>
                {availableTokens.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
              {fromToken && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  Balance: {fromToken.balance}
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-stellar-500 focus:border-transparent text-right"
              />
              {fromToken && (
                <button
                  onClick={() => setAmount(fromToken.balance?.replace(/,/g, '') || '0')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-stellar-600 hover:text-stellar-700 font-medium"
                >
                  MAX
                </button>
              )}
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapTokens}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors group"
            >
              <ArrowDown className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">To</label>
            <select
              value={toToken?.address || ''}
              onChange={(e) => {
                const selected = availableTokens.find(t => t.address === e.target.value);
                setToToken(selected || null);
              }}
              className="w-full p-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-stellar-500 focus:border-transparent appearance-none"
            >
              <option value="">Select token</option>
              {availableTokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vault Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Deposit to Vault</label>
            <div className="space-y-2">
              {availableVaults
                .filter(v => !toToken || v.asset === toToken.symbol)
                .map((vaultOption) => (
                  <button
                    key={vaultOption.address}
                    onClick={() => setVault(vaultOption)}
                    className={`w-full p-4 border rounded-xl text-left transition-colors ${
                      vault?.address === vaultOption.address
                        ? 'border-stellar-500 bg-stellar-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{vaultOption.name}</div>
                        <div className="text-sm text-gray-500">{vaultOption.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <TrendingUp className="w-4 h-4" />
                          {vaultOption.apy}% APY
                        </div>
                        <div className="text-sm text-gray-500">TVL: {vaultOption.tvl}</div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Quote Display */}
          {quote && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expected Output:</span>
                <span className="font-medium">{quote.expectedOutput} {toToken?.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Minimum Received:</span>
                <span className="font-medium">{quote.minimumOutput} {toToken?.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expected Vault Shares:</span>
                <span className="font-medium">{quote.estimatedShares}</span>
              </div>
            </div>
          )}

          {/* Zap Button */}
          <button
            onClick={handleZap}
            disabled={!isValidZap || isLoading || !walletConnected}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-colors ${
              isValidZap && walletConnected && !isLoading
                ? 'bg-stellar-500 hover:bg-stellar-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {!walletConnected ? (
              <div className="flex items-center justify-center gap-2">
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </div>
            ) : isLoading ? (
              'Processing Zap...'
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Zap & Deposit
              </div>
            )}
          </button>

          {/* Info Links */}
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-stellar-600 flex items-center gap-1">
              How it works <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#" className="hover:text-stellar-600 flex items-center gap-1">
              Risks <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZapComponent;
