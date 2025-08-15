import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wallet, ChevronLeft, ExternalLink, Copy, Check, LogOut } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

// Import wallet components
import WalletProfile from '../components/Wallet/WalletProfile';
import Layout from '../components/Layout/Layout';

// Mock wallet data (this would be fetched from your API in a real application)
const mockWalletData = {
  address: '0x13ff81ff7d19a',
  balance: 2456.78,
  transactions: 143,
  firstActivity: '2023-07-15T14:22:35Z',
  lastActivity: '2025-03-10T09:45:12Z',
  accessRequests: 87,
  accessGranted: 82,
  accessDenied: 5,
  tokensSent: 1245.32,
  tokensReceived: 3702.10,
  delegatedStake: 1000.00,
  validatorRewards: 67.45,
  tags: ['Active Validator', 'High Volume'],
  watchlisted: false,
  trustScore: 95,
  accessLevel: 'High',
  validatorStatus: 'Active'
};

// Mock transaction history
const mockTransactionHistory = Array.from({ length: 15 }).map((_, i) => ({
  hash: `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`,
  blockNumber: 10000 - i * 10,
  type: i % 4 === 0 ? 'Access Control' : i % 4 === 1 ? 'Token Transfer' : i % 4 === 2 ? 'Validation' : 'Smart Contract',
  timestamp: new Date(Date.now() - i * 86400000 * (Math.random() * 3 + 1)).toISOString(),
  direction: i % 3 === 0 ? 'out' : i % 3 === 1 ? 'in' : 'self',
  status: Math.random() > 0.1 ? 'Success' : 'Failed',
  amount: Math.random() * 100,
  fee: (Math.random() * 0.01).toFixed(6),
  from: `0x${Math.random().toString(16).substring(2, 10)}`,
  to: `0x${Math.random().toString(16).substring(2, 10)}`,
  trustScore: Math.floor(Math.random() * 100),
  accessLevel: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
  validationWeight: Math.random() * 10
}));

const WalletPage = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const { address } = useParams();
  const navigate = useNavigate();
  const { walletConnected, walletAddress, disconnectWallet } = useWallet();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // Check if this is the user's connected wallet
  const isConnectedWallet = walletConnected && walletAddress === address;

  // Fetch wallet data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setWallet(mockWalletData);
          setTransactions(mockTransactionHistory);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load wallet data');
        setLoading(false);
      }
    };

    if (address) {
      fetchWalletData();
    }
  }, [address]);

  // Handle wallet click (for navigation)
  const handleWalletClick = (newAddress) => {
    navigate(`/wallet/${newAddress}`);
  };

  // Handle go back
  const handleGoBack = () => {
    navigate(-1);
  };

  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format address for display
  const formatAddress = () => {
    if (!address) return '';
    if (address.length <= 12) return address;
    
    // For mobile screens, show a shorter version
    if (window.innerWidth < 640) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    
    return address;
  };

  // Generate a title for the page based on the address
  const title = address ? `Wallet: ${address.substring(0, 8)}...` : 'Wallet Explorer';

  // Handle wallet disconnect
  const handleDisconnectWallet = () => {
    if (isConnectedWallet) {
      setDisconnecting(true);
      setTimeout(() => {
        disconnectWallet();
        navigate('/dashboard');
      }, 500);
    }
  };

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title={title}
    >
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-600 dark:text-blue-400 mb-4 hover:underline"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        ) : (
          <>
            {/* Wallet Header - Responsive for mobile */}
            <div className="bg-blue-900 dark:bg-blue-800 rounded-t-lg p-4 sm:p-6 mb-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Wallet size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Wallet Details</h1>
                    {isConnectedWallet && (
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                        Your Wallet
                      </span>
                    )}
                  </div>
                </div>
                {isConnectedWallet && (
                  <button
                    onClick={handleDisconnectWallet}
                    disabled={disconnecting}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
                  >
                    {disconnecting ? (
                      <>
                        <span className="animate-pulse">Disconnecting...</span>
                      </>
                    ) : (
                      <>
                        <LogOut size={16} className="mr-2" />
                        Disconnect Wallet
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            {/* Wallet Address Card - Mobile Friendly */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 border-t border-blue-800 dark:border-blue-700 rounded-b-lg shadow-md mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Wallet Address</div>
                  <div className="flex items-center">
                    <span className="font-mono text-gray-900 dark:text-white break-all sm:break-normal">
                      {formatAddress()}
                    </span>
                    <button 
                      onClick={copyAddressToClipboard} 
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      aria-label="Copy address"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wallet Profile Component */}
            <WalletProfile 
              darkMode={darkMode} 
              wallet={wallet} 
              transactions={transactions}
              onWalletClick={handleWalletClick}
              hideHeader={true}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default WalletPage; 