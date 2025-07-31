import { useState, useEffect, useCallback } from 'react';
import { WalletState, TransactionState } from '../lib/types';

declare global {
  interface Window {
    freighter?: {
      isConnected(): Promise<boolean>;
      getAddress(): Promise<string>;
      signTransaction(xdr: string, network?: string): Promise<string>;
      requestAccess(): Promise<string>;
    };
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balances: {},
    isLoading: false,
  });

  const [transactionState, setTransactionState] = useState<TransactionState>({
    isLoading: false,
    hash: null,
    error: null,
    success: false,
  });

  // Check if Freighter is installed
  const isFreighterInstalled = useCallback(() => {
    return typeof window !== 'undefined' && window.freighter;
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isFreighterInstalled()) {
      setTransactionState(prev => ({
        ...prev,
        error: 'Freighter wallet not found. Please install it first.',
      }));
      return;
    }

    try {
      setWalletState(prev => ({ ...prev, isLoading: true }));
      
      const address = await window.freighter!.requestAccess();
      
      setWalletState(prev => ({
        ...prev,
        isConnected: true,
        address,
        isLoading: false,
      }));

      // Store connection in localStorage
      localStorage.setItem('yieldzap_wallet_connected', 'true');
      localStorage.setItem('yieldzap_wallet_address', address);
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({ ...prev, isLoading: false }));
      setTransactionState(prev => ({
        ...prev,
        error: 'Failed to connect wallet. Please try again.',
      }));
    }
  }, [isFreighterInstalled]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balances: {},
      isLoading: false,
    });
    localStorage.removeItem('yieldzap_wallet_connected');
    localStorage.removeItem('yieldzap_wallet_address');
  }, []);

  // Auto-reconnect on page load
  useEffect(() => {
    const autoReconnect = async () => {
      if (!isFreighterInstalled()) return;

      const wasConnected = localStorage.getItem('yieldzap_wallet_connected');
      const savedAddress = localStorage.getItem('yieldzap_wallet_address');

      if (wasConnected && savedAddress) {
        try {
          const isConnected = await window.freighter!.isConnected();
          if (isConnected) {
            const address = await window.freighter!.getAddress();
            setWalletState(prev => ({
              ...prev,
              isConnected: true,
              address,
            }));
          } else {
            // Clear stored connection if wallet is no longer connected
            localStorage.removeItem('yieldzap_wallet_connected');
            localStorage.removeItem('yieldzap_wallet_address');
          }
        } catch (error) {
          console.error('Auto-reconnect failed:', error);
          localStorage.removeItem('yieldzap_wallet_connected');
          localStorage.removeItem('yieldzap_wallet_address');
        }
      }
    };

    autoReconnect();
  }, [isFreighterInstalled]);

  // Sign transaction
  const signTransaction = useCallback(async (xdr: string, networkPassphrase?: string) => {
    if (!walletState.isConnected || !window.freighter) {
      throw new Error('Wallet not connected');
    }

    try {
      setTransactionState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const signedXdr = await window.freighter.signTransaction(xdr, networkPassphrase);
      
      setTransactionState(prev => ({ 
        ...prev, 
        isLoading: false, 
        success: true 
      }));
      
      return signedXdr;
    } catch (error) {
      console.error('Transaction signing failed:', error);
      setTransactionState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Transaction signing failed',
      }));
      throw error;
    }
  }, [walletState.isConnected]);

  // Clear transaction state
  const clearTransactionState = useCallback(() => {
    setTransactionState({
      isLoading: false,
      hash: null,
      error: null,
      success: false,
    });
  }, []);

  return {
    walletState,
    transactionState,
    isFreighterInstalled,
    connectWallet,
    disconnectWallet,
    signTransaction,
    clearTransactionState,
  };
};
