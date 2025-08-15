import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  FileText, Clock, ArrowRight, ChevronLeft, ChevronRight, 
  Search, RefreshCw, Filter, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';

// Generate mock transaction data
const generateMockTransactions = (count = 20) => {
  const transactions = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now - i * 60000); // Each transaction 1 minute apart
    const blockNumber = 1000000 - Math.floor(i / 5); // Group transactions in blocks
    
    transactions.push({
      hash: `0x${Math.random().toString(16).substring(2, 62)}`,
      blockNumber,
      timestamp,
      from: `0x${Math.random().toString(16).substring(2, 42)}`,
      to: `0x${Math.random().toString(16).substring(2, 42)}`,
      value: Math.random() * 10,
      fee: Math.random() * 0.01,
      gasUsed: Math.floor(Math.random() * 100000),
      status: Math.random() > 0.1 ? 'Success' : 'Failed',
      type: ['Transfer', 'Access Control', 'Smart Contract', 'Validation'][Math.floor(Math.random() * 4)],
      method: ['transfer', 'approve', 'requestAccess', 'validate', 'execute'][Math.floor(Math.random() * 5)],
    });
  }
  
  return transactions;
};

const TransactionsPage = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Load transactions on initial render
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // Simulate API delay
        setTimeout(() => {
          const mockTransactions = generateMockTransactions(20);
          setTransactions(mockTransactions);
          setTotalPages(5); // Mock 5 pages of results
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [currentPage, sortField, sortDirection, typeFilter]);
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    const mockTransactions = generateMockTransactions(20);
    
    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm) return;
    
    // If it starts with 0x, assume it's a transaction hash
    if (searchTerm.startsWith('0x')) {
      navigate(`/transaction/${searchTerm}`);
      return;
    }
    
    // If it's a number, assume it's a block number
    if (!isNaN(parseInt(searchTerm))) {
      navigate(`/block/${searchTerm}`);
      return;
    }
  };
  
  // Handle sort
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
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
  
  // Get sort icon
  const getSortIcon = (field) => {
    if (field !== sortField) {
      return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-blue-500" />
      : <ArrowDown size={14} className="ml-1 text-blue-500" />;
  };
  
  // Get type badge class
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Access Control':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Transfer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Smart Contract':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Validation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title="Transactions"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <FileText className="mr-2" size={24} />
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and search recent transactions on the Zero-Trust Access Control Chain
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by tx hash or block number..."
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
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
          </div>
          
          {/* Filter options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">All Types</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Access Control">Access Control</option>
                    <option value="Smart Contract">Smart Contract</option>
                    <option value="Validation">Validation</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Transactions Table */}
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
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('hash')}
                      >
                        <div className="flex items-center">
                          Transaction Hash
                          {getSortIcon('hash')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('type')}
                      >
                        <div className="flex items-center">
                          Type
                          {getSortIcon('type')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('method')}
                      >
                        <div className="flex items-center">
                          Method
                          {getSortIcon('method')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('blockNumber')}
                      >
                        <div className="flex items-center">
                          Block
                          {getSortIcon('blockNumber')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('timestamp')}
                      >
                        <div className="flex items-center">
                          Age
                          {getSortIcon('timestamp')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        From
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        To
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('value')}
                      >
                        <div className="flex items-center">
                          Value
                          {getSortIcon('value')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          {getSortIcon('status')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map((tx) => (
                      <tr key={tx.hash} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => navigate(`/transaction/${tx.hash}`)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 font-mono">
                            {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(tx.type)}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {tx.method}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            <a 
                              href={`/block/${tx.blockNumber}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/block/${tx.blockNumber}`);
                              }}
                              className="hover:underline"
                            >
                              {tx.blockNumber}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock size={14} className="mr-1" />
                            {formatTimestamp(tx.timestamp)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            <a 
                              href={`/wallet/${tx.from}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/wallet/${tx.from}`);
                              }}
                              className="hover:underline"
                            >
                              {formatAddress(tx.from)}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            <a 
                              href={`/wallet/${tx.to}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/wallet/${tx.to}`);
                              }}
                              className="hover:underline"
                            >
                              {formatAddress(tx.to)}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {tx.value.toFixed(5)} ZTACC
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tx.status === 'Success' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/transaction/${tx.hash}`);
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
                  Showing {transactions.length} transactions
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

export default TransactionsPage; 