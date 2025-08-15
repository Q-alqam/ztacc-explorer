import React, { useState, useEffect } from 'react';
import { Search, Clock, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WalletSearch = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [error, setError] = useState('');
  
  // Load search history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('walletSearchHistory');
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory).slice(0, 5));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);
  
  // Save search history to localStorage
  const saveToHistory = (address) => {
    const newHistory = [
      { address, timestamp: new Date().toISOString() },
      ...searchHistory.filter(item => item.address !== address)
    ].slice(0, 5);
    
    setSearchHistory(newHistory);
    localStorage.setItem('walletSearchHistory', JSON.stringify(newHistory));
  };
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a wallet address');
      return;
    }
    
    // Basic address validation (can be extended with your specific blockchain address format)
    if (!query.startsWith('0x') || query.length < 10) {
      setError('Invalid wallet address format');
      return;
    }
    
    setIsSearching(true);
    setError('');
    
    // In a real app, you might want to check if the address exists before navigating
    setTimeout(() => {
      saveToHistory(query);
      setIsSearching(false);
      navigate(`/wallet/${query}`);
    }, 800);
  };
  
  // Clear a specific item from history
  const clearHistoryItem = (e, address) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(item => item.address !== address);
    setSearchHistory(newHistory);
    localStorage.setItem('walletSearchHistory', JSON.stringify(newHistory));
  };
  
  // Clear all search history
  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('walletSearchHistory');
  };
  
  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  
  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div className={`flex items-center border ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'
        } rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}>
          <div className="p-2 text-gray-400">
            <Search size={20} />
          </div>
          
          <input
            type="text"
            placeholder="Search wallet address (0x...)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setError('');
            }}
            onFocus={() => setShowHistory(true)}
            className={`flex-1 py-2 px-1 outline-none ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } placeholder-gray-400`}
          />
          
          {query && (
            <button 
              type="button"
              onClick={() => setQuery('')}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={16} />
            </button>
          )}
          
          <button 
            type="submit"
            className={`px-4 py-2 ${
              isSearching ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-medium flex items-center transition-colors`}
            disabled={isSearching}
          >
            {isSearching ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching
              </span>
            ) : (
              <span className="flex items-center">
                Search <ArrowRight size={16} className="ml-1" />
              </span>
            )}
          </button>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mt-1 ml-2">{error}</p>
        )}
      </form>
      
      {/* Search History Dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <div 
          className={`absolute z-10 mt-1 w-full rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <div className="p-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
              <Clock size={14} className="mr-1" /> Recent Searches
            </span>
            <button 
              onClick={clearAllHistory}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
            >
              Clear All
            </button>
          </div>
          
          <ul>
            {searchHistory.map((item, index) => (
              <li 
                key={index} 
                className={`p-2 flex items-center justify-between cursor-pointer ${
                  darkMode 
                    ? 'hover:bg-gray-700 border-b border-gray-700' 
                    : 'hover:bg-gray-100 border-b border-gray-100'
                } ${index === searchHistory.length - 1 ? 'border-b-0' : ''}`}
                onClick={() => {
                  setQuery(item.address);
                  setShowHistory(false);
                  navigate(`/wallet/${item.address}`);
                }}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <Search size={14} className="text-blue-500 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className={`font-mono ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {item.address.substring(0, 8)}...{item.address.substring(item.address.length - 6)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => clearHistoryItem(e, item.address)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Click outside to close dropdown */}
      {showHistory && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowHistory(false)}
        ></div>
      )}
    </div>
  );
};

export default WalletSearch; 