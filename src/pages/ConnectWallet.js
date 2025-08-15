import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { Wallet, Check, AlertTriangle, Info, Shield, LogOut } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const ConnectWallet = ({ darkMode, toggleDarkMode, sidebarOpen, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const { connectWallet, disconnectWallet, walletConnected, walletAddress, formatAddress } = useWallet();
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  
  // Redirect to wallet page if already connected
  useEffect(() => {
    if (walletConnected && walletAddress && !disconnecting) {
      navigate(`/wallet/${walletAddress}`);
    }
  }, [walletConnected, walletAddress, navigate, disconnecting]);

  const walletOptions = [
    { id: 'ztacc', name: 'ZTACC Wallet', icon: '🛡️', popular: true, featured: true },
    { id: 'metamask', name: 'MetaMask', icon: '🦊', popular: true },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', popular: true },
    { id: 'trust', name: 'Trust Wallet', icon: '🛡️', popular: false },
    { id: 'ledger', name: 'Ledger', icon: '💼', popular: false },
    { id: 'trezor', name: 'Trezor', icon: '🔒', popular: false },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '💰', popular: true }
  ];

  const handleConnectWallet = (walletId) => {
    setSelectedWallet(walletId);
    setConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      // Mock successful connection
      const mockAddress = '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9';
      // Update wallet context
      connectWallet(mockAddress);
      // Navigate to wallet page
      navigate(`/wallet/${mockAddress}`);
    }, 1500);
  };

  const handleDisconnectWallet = () => {
    setDisconnecting(true);
    setTimeout(() => {
      disconnectWallet();
      setDisconnecting(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title="Connect Wallet"
    >
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Wallet size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mx-auto">
              {walletConnected 
                ? 'Your wallet is currently connected to the ZTACC Explorer.' 
                : 'Connect your wallet to access the Zero-Trust Access Control Chain Explorer features.'}
            </p>
          </div>
          
          <div className="p-6">
            {connecting ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Connecting to {walletOptions.find(w => w.id === selectedWallet)?.name}...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Please check your wallet and confirm the connection.
                </p>
                <button
                  onClick={() => setConnecting(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : disconnecting ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Disconnecting wallet...
                </h3>
              </div>
            ) : walletConnected ? (
              <div className="text-center py-10">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-center mb-3">
                    <Check size={24} className="text-green-600 dark:text-green-400 mr-2" />
                    <p className="text-green-700 dark:text-green-300 font-medium">
                      Connected to wallet
                    </p>
                  </div>
                  <p className="font-mono text-gray-700 dark:text-gray-300">
                    {formatAddress(walletAddress)}
                  </p>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => navigate(`/wallet/${walletAddress}`)}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                  >
                    <Wallet size={18} className="mr-2" />
                    View Wallet Details
                  </button>
                  
                  <button
                    onClick={handleDisconnectWallet}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center"
                  >
                    <LogOut size={18} className="mr-2" />
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Featured ZTACC Wallet */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Recommended
                  </h3>
                  <button
                    onClick={() => handleConnectWallet('ztacc')}
                    className="w-full flex items-center p-4 border-2 border-blue-500 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
                      <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 dark:text-white">ZTACC Wallet</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Zero-Trust Access Control Chain native wallet</div>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs font-medium text-blue-800 dark:text-blue-300">
                      Recommended
                    </div>
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Popular Wallets
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {walletOptions.filter(w => w.popular && !w.featured).map(wallet => (
                      <button
                        key={wallet.id}
                        onClick={() => handleConnectWallet(wallet.id)}
                        className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-2xl mr-3">{wallet.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{wallet.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Other Wallets
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {walletOptions.filter(w => !w.popular).map(wallet => (
                      <button
                        key={wallet.id}
                        onClick={() => handleConnectWallet(wallet.id)}
                        className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-2xl mr-3">{wallet.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{wallet.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Info size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
                  Your wallet connection is secured through a zero-knowledge proof system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConnectWallet; 