import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  Layers, Clock, Database, ArrowRight, ChevronLeft, ChevronRight, 
  Search, RefreshCw, Filter
} from 'lucide-react';
import ztaccApiService from '../services/ztaccApiService';

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
      totalFees: (Math.random() * 50).toFixed(2), // Total fees from transactions
    });
  }
  
  return blocks;
};

const BlocksPage = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [allBlocks, setAllBlocks] = useState([]); // Store all blocks for pagination
  const blocksPerPage = 20; // Number of blocks per page
  
  // Get blocks for current page
  const getCurrentPageBlocks = () => {
    const startIndex = (currentPage - 1) * blocksPerPage;
    const endIndex = startIndex + blocksPerPage;
    return allBlocks.slice(startIndex, endIndex);
  };
  
  // Update blocks when page changes
  useEffect(() => {
    const currentBlocks = getCurrentPageBlocks();
    setBlocks(currentBlocks);
  }, [currentPage, allBlocks]);
  
  // Load blocks on initial render
  useEffect(() => {
    fetchRealBlockchainData();
  }, []); // Remove currentPage dependency to avoid infinite loop
  
  // Navigate to first page
  const goToFirstPage = () => {
    setCurrentPage(1);
  };
  
  // Navigate to last page
  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };
  
  // Fetch real blockchain data
  const fetchRealBlockchainData = async () => {
    let chainResult = null; // Declare outside try block
    
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      // Basic connectivity check
      try {
        const testResponse = await fetch('http://localhost:5002/api/node-info');
        if (!testResponse.ok) {
          throw new Error(`HTTP ${testResponse.status}: ${testResponse.statusText}`);
        }
        console.log('✅ Basic connectivity test passed');
      } catch (connectError) {
        console.error('❌ Connectivity test failed:', connectError);
        throw new Error(`Cannot connect to blockchain server: ${connectError.message}`);
      }
      
      // Get chain data to get all blocks
      chainResult = await ztaccApiService.getChain();
      
      // Handle different possible response structures
      let chainData = null;
      if (chainResult.success && chainResult.chain) {
        chainData = chainResult.chain;
      } else if (chainResult.chain) {
        // Direct chain array response
        chainData = chainResult.chain;
      } else if (Array.isArray(chainResult)) {
        // Direct array response
        chainData = chainResult;
      } else {
        console.error('Invalid API response structure:', chainResult);
        throw new Error('Invalid API response structure');
      }
      
      if (chainData && chainData.length > 0) {
        // Take only the most recent blocks to avoid duplicate timestamp issues
        // Start from the end of the chain (most recent) and work backwards
        const recentBlocks = chainData.slice(-50); // Get last 50 blocks
        
        // Process blocks data
        const realBlocks = recentBlocks.map(block => {
          if (!block) return null;
          
          // Calculate block size (if available)
          const blockSize = block.size || Math.floor(Math.random() * 1000) + 500;
          
          // Calculate total fees from transactions in this block
          const totalFees = block.transactions && block.transactions.length > 0 
            ? block.transactions.reduce((sum, tx) => sum + (tx.fee_ztac || 0), 0)
            : 0;
          
          // Format timestamp - handle Unix timestamp format
          let timestamp;
          if (block.timestamp) {
            // Check if timestamp is already a Date object
            if (block.timestamp instanceof Date) {
              timestamp = block.timestamp;
            } else if (typeof block.timestamp === 'number') {
              // Unix timestamp (seconds since epoch)
              timestamp = new Date(block.timestamp * 1000);
            } else {
              // Try to parse as string
              timestamp = new Date(block.timestamp);
            }
          } else {
            timestamp = new Date();
          }
          
          return {
            number: block.index,
            hash: block.hash,
            timestamp: timestamp,
            transactionCount: block.transactions ? block.transactions.length : 0,
            size: blockSize,
            gasUsed: totalFees * 1000000, // Convert to gas units for display
            gasLimit: 10000000, // Default gas limit
            validator: block.validator || block.validator_address || block.miner || block.block_producer || 'Unknown',
            reward: block.block_reward || 0,
            totalFees: totalFees,
            rawBlock: block // Keep original data for reference
          };
        }).filter(block => block !== null);
        
        // Sort by block number in descending order to ensure most recent first
        const sortedBlocks = realBlocks.sort((a, b) => b.number - a.number);
        
        setAllBlocks(sortedBlocks); // Store all blocks
        setTotalPages(Math.ceil(sortedBlocks.length / blocksPerPage)); // Calculate total pages
        setLoading(false);
      } else {
        console.warn('No blockchain data available, using fallback data');
        setError('No blockchain data available.');
        // Fallback to mock data if API fails
        const mockBlocks = generateMockBlocks(20);
        setAllBlocks(mockBlocks); // Store all blocks
        setTotalPages(5);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error.message);
      setError(`Failed to connect to blockchain data source: ${error.message}`);
      // Fallback to mock data on error
      const mockBlocks = generateMockBlocks(20);
      setAllBlocks(mockBlocks); // Store all blocks
      setTotalPages(5);
      setLoading(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRealBlockchainData().finally(() => {
      setIsRefreshing(false);
    });
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
    
    if (secondsAgo < 1) {
      return 'Just now';
    } else if (secondsAgo < 60) {
      return `${secondsAgo} sec${secondsAgo === 1 ? '' : 's'} ago`;
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return `${minutesAgo} min${minutesAgo === 1 ? '' : 's'} ago`;
    } else if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    } else {
      const daysAgo = Math.floor(secondsAgo / 86400);
      return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
    }
  };
  
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return 'Unknown';
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format block size
  const formatBlockSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
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
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Layers className="mr-3 h-8 w-8" />
                Blocks
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Browse and search recent blocks on the Zero-Trust Access Control Chain
              </p>
            </div>
          </div>
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
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
              <Database size={48} className="mb-4" />
              <p className="text-lg font-semibold mb-2">{error}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please check your connection or try again later.
              </p>
              <button
                onClick={fetchRealBlockchainData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                          {formatAddress(block.validator)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatBlockSize(block.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {block.totalFees} ZTACC
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
                  {blocks.length > 0 ? (
                    `Showing blocks ${blocks[blocks.length - 1]?.number} to ${blocks[0]?.number}`
                  ) : (
                    'No blocks to display'
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    First
                  </button>
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
                    {currentPage} of {totalPages}
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
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Last
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