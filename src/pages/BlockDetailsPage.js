import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  Layers, Clock, Database, ChevronLeft, Copy, Check, 
  Shield, FileText, ArrowRight, RefreshCw, ArrowDown, ArrowUp, ArrowLeft
} from 'lucide-react';

// Generate mock block data
const generateMockBlock = (blockId) => {
  const now = Date.now();
  const blockNumber = parseInt(blockId) || 1000000;
  
  return {
    number: blockNumber,
    hash: `0x${Math.random().toString(16).substring(2, 62)}`,
    parentHash: `0x${Math.random().toString(16).substring(2, 62)}`,
    timestamp: new Date(now - (1000000 - blockNumber) * 15000),
    transactionCount: Math.floor(Math.random() * 100) + 1,
    size: Math.floor(Math.random() * 1000) + 500, // in KB
    gasUsed: Math.floor(Math.random() * 8000000) + 2000000,
    gasLimit: 10000000,
    validator: `0x${Math.random().toString(16).substring(2, 42)}`,
    validatorName: 'ZTACC Validator Alpha',
    reward: (Math.random() * 0.05).toFixed(5),
    difficulty: Math.floor(Math.random() * 1000000),
    totalDifficulty: Math.floor(Math.random() * 10000000000),
    extraData: `0x${Math.random().toString(16).substring(2, 30)}`,
    accessEvents: Math.floor(Math.random() * 50),
    accessRequests: {
      approved: Math.floor(Math.random() * 40),
      denied: Math.floor(Math.random() * 10)
    },
    nonce: `0x${Math.random().toString(16).substring(2, 18)}`,
    stateRoot: `0x${Math.random().toString(16).substring(2, 62)}`,
    transactionsRoot: `0x${Math.random().toString(16).substring(2, 62)}`,
    receiptsRoot: `0x${Math.random().toString(16).substring(2, 62)}`,
  };
};

// Generate mock transactions for the block
const generateMockTransactions = (blockNumber, count) => {
  return Array.from({ length: count }).map((_, i) => ({
    hash: `0x${Math.random().toString(16).substring(2, 62)}`,
    blockNumber,
    timestamp: new Date(),
    from: `0x${Math.random().toString(16).substring(2, 42)}`,
    to: `0x${Math.random().toString(16).substring(2, 42)}`,
    value: Math.random() * 10,
    fee: Math.random() * 0.01,
    gasUsed: Math.floor(Math.random() * 100000),
    status: Math.random() > 0.1 ? 'Success' : 'Failed',
    type: ['Transfer', 'Access Control', 'Smart Contract', 'Validation'][Math.floor(Math.random() * 4)],
    method: ['transfer', 'approve', 'requestAccess', 'validate', 'execute'][Math.floor(Math.random() * 5)],
  }));
};

const BlockDetailsPage = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const { blockId } = useParams();
  const navigate = useNavigate();
  const [block, setBlock] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load block data on initial render
  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // Simulate API delay
        setTimeout(() => {
          const mockBlock = generateMockBlock(blockId);
          const mockTxs = generateMockTransactions(mockBlock.number, mockBlock.transactionCount);
          setBlock(mockBlock);
          setTransactions(mockTxs);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching block data:', error);
        setLoading(false);
      }
    };
    
    fetchBlockData();
  }, [blockId]);
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const mockBlock = generateMockBlock(blockId);
      const mockTxs = generateMockTransactions(mockBlock.number, mockBlock.transactionCount);
      setBlock(mockBlock);
      setTransactions(mockTxs);
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };
  
  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Format address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const formatHashWithCopy = (hash) => {
    if (!hash) return '';
    
    return (
      <div className="flex items-center">
        <span className="font-mono text-sm">
          {hash.length > 20 
            ? `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`
            : hash
          }
        </span>
        <button 
          onClick={() => copyToClipboard(hash)} 
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    );
  };
  
  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title={block ? `Block #${block.number}` : 'Block Details'}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/blocks')}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Blocks
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : block ? (
          <>
            {/* Block Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-blue-600 dark:bg-blue-800 p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-full mr-4">
                      <Layers size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">Block #{block.number}</h1>
                      <p className="text-blue-100 text-sm mt-1 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatTimestamp(block.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {/* Previous Block Button */}
                    <button
                      onClick={() => navigate(`/block/${block.number - 1}`)}
                      className="flex items-center px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded"
                    >
                      <ArrowLeft size={14} className="mr-1" />
                      Previous
                    </button>
                    
                    {/* Next Block Button */}
                    <button
                      onClick={() => navigate(`/block/${block.number + 1}`)}
                      className="flex items-center px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded"
                    >
                      Next
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                    
                    {/* Refresh Button */}
                    <button
                      onClick={handleRefresh}
                      className={`flex items-center px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded ${
                        isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isRefreshing}
                    >
                      <RefreshCw size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Block Summary */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Transactions</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{block.transactionCount}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Size</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{block.size} KB</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Gas Used</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {Math.floor(block.gasUsed / 1000000)}M ({Math.round((block.gasUsed / block.gasLimit) * 100)}%)
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Access Events</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {block.accessEvents} ({block.accessRequests.approved} approved, {block.accessRequests.denied} denied)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-3 px-4 font-medium text-sm border-b-2 ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`py-3 px-4 font-medium text-sm border-b-2 ${
                      activeTab === 'transactions'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Transactions ({block.transactionCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('access')}
                    className={`py-3 px-4 font-medium text-sm border-b-2 ${
                      activeTab === 'access'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Access Events ({block.accessEvents})
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Block Details</h2>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <dl>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Block Height</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{block.number}</dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Timestamp</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{formatTimestamp(block.timestamp)}</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Transactions</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{block.transactionCount}</dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Block Hash</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{formatHashWithCopy(block.hash)}</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Parent Hash</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{formatHashWithCopy(block.parentHash)}</dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Validator</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                          <div className="flex items-center">
                            <a 
                              href={`/wallet/${block.validator}`}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/wallet/${block.validator}`);
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {formatAddress(block.validator)}
                            </a>
                            <span className="ml-2 text-gray-500 dark:text-gray-400">({block.validatorName})</span>
                          </div>
                        </dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Size</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{block.size} KB</dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Gas Used</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                          {block.gasUsed.toLocaleString()} ({Math.round((block.gasUsed / block.gasLimit) * 100)}%)
                        </dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Gas Limit</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{block.gasLimit.toLocaleString()}</dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Block Reward</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{block.reward} ZTACC</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
              
              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Transaction Hash
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          From
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {transactions.map((tx) => (
                        <tr key={tx.hash} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 font-mono">
                              {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              tx.type === 'Access Control' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                : tx.type === 'Transfer'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : tx.type === 'Smart Contract'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
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
                              {formatAddress(tx.from)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                              {formatAddress(tx.to)}
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
                              onClick={() => navigate(`/transaction/${tx.hash}`)}
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
              )}
              
              {/* Access Events Tab */}
              {activeTab === 'access' && (
                <div className="p-4 sm:p-6">
                  <div className="text-center py-20">
                    <div className="inline-block p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                      <Shield size={48} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      Access Events Coming Soon
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      This feature is under development. Access event details will be available soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Block Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The block you're looking for doesn't exist or hasn't been indexed yet.
            </p>
            <button
              onClick={() => navigate('/blocks')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              View All Blocks
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlockDetailsPage; 