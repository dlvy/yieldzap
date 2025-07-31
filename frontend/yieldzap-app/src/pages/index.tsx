import { useState, useEffect } from 'react';
import ZapComponent from '../components/ZapComponent';
import WalletButton from '../components/WalletButton';
import { useWallet } from '../hooks/useWallet';

export default function Home() {
  const {
    walletState,
    transactionState,
    connectWallet,
    disconnectWallet,
    signTransaction,
    clearTransactionState,
  } = useWallet();

  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Handle zap execution
  const handleZap = async (zapParams: any) => {
    try {
      console.log('Executing zap with params:', zapParams);
      
      // In a real implementation, this would:
      // 1. Build the transaction XDR
      // 2. Sign it with the wallet
      // 3. Submit to the network
      // 4. Monitor for confirmation
      
      // For now, we'll simulate the process
      setNotification({
        type: 'info',
        message: 'Building transaction...'
      });

      // Simulate transaction building delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setNotification({
        type: 'info',
        message: 'Waiting for wallet signature...'
      });

      // In real implementation, build XDR and sign here
      // const transactionXDR = await buildZapTransaction(zapParams);
      // const signedXDR = await signTransaction(transactionXDR);
      
      // Simulate signing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setNotification({
        type: 'success',
        message: 'Zap completed successfully! 🚀'
      });

      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);

    } catch (error) {
      console.error('Zap failed:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Zap failed'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stellar-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-stellar-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Y</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">YieldZap</h1>
              </div>
              <div className="hidden md:flex items-center gap-6 ml-8">
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Vaults
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Analytics
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Docs
                </a>
              </div>
            </div>
            <WalletButton
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              isConnected={walletState.isConnected}
              address={walletState.address}
              isLoading={walletState.isLoading}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            One-Click{' '}
            <span className="bg-gradient-to-r from-stellar-500 to-stellar-600 bg-clip-text text-transparent">
              Yield Farming
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Swap any token and deposit into yield-generating vaults on Stellar in a single transaction. 
            Powered by Soroswap and DeFindex.
          </p>
        </div>

        {/* Main Zap Interface */}
        <div className="flex justify-center mb-12">
          <ZapComponent
            onZap={handleZap}
            isLoading={transactionState.isLoading}
            walletConnected={walletState.isConnected}
            userAddress={walletState.address || undefined}
          />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-stellar-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-stellar-600 text-2xl">🌀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimal Swaps</h3>
            <p className="text-gray-600">
              Automatically routes through Soroswap aggregator for best prices across all Stellar DEXs.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-2xl">🏦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto Yield</h3>
            <p className="text-gray-600">
              Seamlessly deposits into DeFindex vaults for optimized yield generation strategies.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gas Efficient</h3>
            <p className="text-gray-600">
              Single transaction execution saves gas and reduces slippage compared to manual steps.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">$2.5M</div>
              <div className="text-gray-600 text-sm">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">1,234</div>
              <div className="text-gray-600 text-sm">Zaps Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">8.5%</div>
              <div className="text-gray-600 text-sm">Average APY</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
              <div className="text-gray-600 text-sm">Active Vaults</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {notification.message}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-stellar-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Y</span>
                </div>
                <span className="text-xl font-bold">YieldZap</span>
              </div>
              <p className="text-gray-400">
                One-click yield farming on Stellar. Built with Soroswap and DeFindex.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white">Vaults</a>
                <a href="#" className="block hover:text-white">Analytics</a>
                <a href="#" className="block hover:text-white">API</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white">Documentation</a>
                <a href="#" className="block hover:text-white">GitHub</a>
                <a href="#" className="block hover:text-white">Security</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white">Discord</a>
                <a href="#" className="block hover:text-white">Twitter</a>
                <a href="#" className="block hover:text-white">Telegram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 YieldZap. Built with ❤️ for the Stellar ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
