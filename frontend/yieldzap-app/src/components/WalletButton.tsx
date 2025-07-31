import { useState } from 'react';
import { Wallet, ExternalLink, Github, Twitter } from 'lucide-react';

interface WalletButtonProps {
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  isConnected: boolean;
  address: string | null;
  isLoading: boolean;
}

const WalletButton = ({ 
  onConnect, 
  onDisconnect, 
  isConnected, 
  address, 
  isLoading 
}: WalletButtonProps) => {
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
          {truncateAddress(address)}
        </div>
        <button
          onClick={onDisconnect}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isLoading}
      className="bg-stellar-500 hover:bg-stellar-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
    >
      <Wallet className="w-5 h-5" />
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default WalletButton;
