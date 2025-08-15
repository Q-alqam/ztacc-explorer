import React, { useState } from 'react';
import { 
  Search, Bell, Sun, Moon, Menu, X, Wallet, 
  AlertTriangle, TrendingUp, LogOut, Loader, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { useModal } from '../../context/ModalContext';

const Header = ({ darkMode, toggleDarkMode, title, toggleSidebar }) => {
  const navigate = useNavigate();
  const { walletConnected, walletAddress, disconnectWallet, formatAddress } = useWallet();
  const { openWelcomeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // Network stats for the header
  const networkStats = {
    ztacPrice: 1.23,
    priceChange: 2.4,
    deniedRequests: 142,
    failedTransactions: 7
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Determine search type based on format
    if (searchQuery.startsWith('0x')) {
      // Either an address or transaction hash
      if (searchQuery.length < 20) {
        navigate(`/wallet/${searchQuery}`);
      } else {
        navigate(`/transaction/${searchQuery}`);
      }
    } else if (!isNaN(searchQuery)) {
      // Block number
      navigate(`/block/${searchQuery}`);
    } else {
      // General search
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle wallet connection
  const handleWalletClick = () => {
    if (walletConnected) {
      setDisconnecting(true);
      // Small delay to show visual feedback
      setTimeout(() => {
        disconnectWallet();
        setDisconnecting(false);
        // Navigate to home page after disconnecting
        navigate('/dashboard');
      }, 500);
    } else {
      navigate('/connect');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <Menu size={20} />
            </button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
            </div>
          </div>
          
          {/* Center - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by tx hash, block, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </form>
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Network Info Dropdown - Hidden on small mobile */}
            <div className="relative hidden xs:block">
              <button 
                className="p-1 text-blue-600 dark:text-blue-400 focus:outline-none"
                onClick={() => setShowNetworkInfo(!showNetworkInfo)}
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="ml-1 text-xs font-medium">
                      ZTAC: ${networkStats.ztacPrice}
                    </span>
                  </div>
                  <div className="flex items-center text-green-500 text-xs">
                    <TrendingUp size={12} className="mr-1" />
                    {networkStats.priceChange}%
                  </div>
                </div>
              </button>
              
              {showNetworkInfo && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Network Status
                    </h3>
                    <div className="text-xs text-red-600 dark:text-red-400 mb-3 flex items-center">
                      <AlertTriangle size={12} className="mr-1" />
                      Last 24h: {networkStats.deniedRequests} Denied Requests, {networkStats.failedTransactions} Failed Transactions
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Token Price
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          ${networkStats.ztacPrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          24h Change
                        </span>
                        <span className="text-xs font-medium text-green-500">
                          +{networkStats.priceChange}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-2">
                    <button 
                      onClick={() => navigate('/network')}
                      className="w-full text-center text-xs text-blue-600 dark:text-blue-400 font-medium"
                    >
                      View Network Details
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Help Button */}
            <button 
              onClick={openWelcomeModal}
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              title="About ZTACC Explorer"
            >
              <HelpCircle size={20} />
            </button>
            
            {/* Notifications */}
            <button className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
              <Bell size={20} />
            </button>
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Connect Wallet Button - Full text on larger screens, icon only on small screens */}
            <button 
              onClick={handleWalletClick}
              disabled={disconnecting}
              className={`flex items-center font-medium rounded-md transition-colors px-2 py-2 sm:px-4 sm:py-2 ${
                disconnecting 
                  ? 'bg-gray-500 text-white cursor-not-allowed' 
                  : walletConnected 
                    ? 'bg-green-600 hover:bg-red-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              aria-label={walletConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
            >
              {disconnecting ? (
                <>
                  <Loader size={16} className="animate-spin sm:mr-2" />
                  <span className="hidden sm:inline text-sm">Disconnecting...</span>
                </>
              ) : walletConnected ? (
                <>
                  <Wallet size={16} className="sm:mr-2" />
                  <span className="hidden xs:inline text-sm truncate max-w-[80px] sm:max-w-[120px]">
                    {formatAddress(walletAddress)}
                  </span>
                  <span className="hidden sm:inline-block ml-2 text-xs bg-red-500 px-1.5 py-0.5 rounded">
                    Disconnect
                  </span>
                </>
              ) : (
                <>
                  <Wallet size={16} className="sm:mr-2" />
                  <span className="hidden sm:inline text-sm">Connect Wallet</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Search - Only visible on small screens */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by tx hash, block, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
          </form>
        </div>
      </div>
      
      {/* Click outside to close network info dropdown */}
      {showNetworkInfo && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowNetworkInfo(false)}
        ></div>
      )}
    </header>
  );
};

export default Header; 