import React, { createContext, useState, useContext, useEffect } from 'react';

// Create wallet context
const WalletContext = createContext();

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

// Wallet provider component
export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // Load wallet from localStorage on initial load
  useEffect(() => {
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setWalletConnected(true);
    }
  }, []);

  // Connect wallet
  const connectWallet = (address) => {
    setWalletAddress(address);
    setWalletConnected(true);
    localStorage.setItem('walletAddress', address);
    // Add console log for debugging
    console.log('Wallet connected:', address);
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletConnected(false);
    localStorage.removeItem('walletAddress');
    // Add console log for debugging
    console.log('Wallet disconnected');
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Context value
  const value = {
    walletAddress,
    walletConnected,
    connectWallet,
    disconnectWallet,
    formatAddress
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export default WalletContext; 