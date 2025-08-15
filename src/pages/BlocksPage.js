import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  Layers, Clock, Database, ArrowRight, ChevronLeft, ChevronRight, 
  Search, RefreshCw, Filter
} from 'lucide-react';

// Generate mock block data
const generateMockBlocks = (count = 20) => {
  const blocks = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const blockNumber = 1000000 - i;
    const timestamp = new Date(now - i * 15000); // Each block 15 seconds apart
    
    blocks.push({
      number: blockNumber,
      hash: `0x${Math.random().toString(16).substring(2, 62)}`,
      timestamp,
      transactionCount: Math.floor(Math.random() * 100) + 1,
      size: Math.floor(Math.random() * 1000) + 500, // in KB
      gasUsed: Math.floor(Math.random() * 8000000) + 2000000,
      gasLimit: 10000000,
      validator: `0x${Math.random().toString(16).substring(2, 42)}`,
      reward: (Math.random() * 0.05).toFixed(5),
      accessEvents: Math.floor(Math.random() * 50),
    });
  }
  
  return blocks;
};

const BlocksPage = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load blocks on initial render
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // Simulate API delay
        setTimeout(() => {
          const mockBlocks = generateMockBlocks(20);
          setBlocks(mockBlocks);
          setTotalPages(5); // Mock 5 pages of results
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching blocks:', error);
        setLoading(false);
      }
    };
    
    fetchBlocks();
  }, [currentPage]);
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    const mockBlocks = generateMockBlocks(20);
    
    setTimeout(() => {
      setBlocks(mockBlocks);
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm) return;
    
    // If it's a number, assume it's a block number
    if (!isNaN(parseInt(searchTerm))) {
      navigate(`/block/${searchTerm}`);
      return;
    }
    
    // If it starts with 0x, assume it's a block hash
    if (searchTerm.startsWith('0x')) {
      navigate(`/block/${searchTerm}`);
      return;
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);
    
    if (secondsAgo < 60) {
      return `${secondsAgo} sec${secondsAgo !== 1 ? 's' : ''} ago`;
    }
    
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
      return `${minutesAgo} min${minutesAgo !== 1 ? 's' : ''} ago`;
    }
    
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
      return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleString();
  };
  
  // Format address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title="Blocks"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Layers className="mr-2" size={24} />
            Blocks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and search recent blocks on the Zero-Trust Access Control Chain
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by block number or hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-md border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </form>
            
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                className={`flex items-center px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                  isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                className="flex items-center px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
        
        {/* Blocks Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Block
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Txns
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Access Events
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Validator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Gas Used
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {blocks.map((block) => (
                      <tr key={block.number} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => navigate(`/block/${block.number}`)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              <Layers size={16} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {block.number}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                {block.hash.substring(0, 10)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock size={14} className="mr-1" />
                            {formatTimestamp(block.timestamp)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {block.transactionCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {block.accessEvents}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                          {formatAddress(block.validator)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {block.size} KB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {Math.floor(block.gasUsed / 1000000)}M ({Math.round((block.gasUsed / block.gasLimit) * 100)}%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/block/${block.number}`);
                            }}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            <ArrowRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing blocks {blocks[0]?.number} to {blocks[blocks.length - 1]?.number}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Prev
                  </button>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-md">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlocksPage; 