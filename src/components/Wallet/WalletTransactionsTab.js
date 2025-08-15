import React, { useState } from 'react';
import { 
  ArrowDownUp, Filter, RefreshCw, Search, 
  TrendingUp, TrendingDown, ChevronRight, ChevronLeft,
  Calendar, Download, ExternalLink
} from 'lucide-react';

// Helper functions
const truncateAddress = (address, length = 6) => {
  if (!address) return '—';
  return `${address.substring(0, length + 2)}...${address.substring(address.length - length)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const WalletTransactionsTab = ({ wallet, transactions, darkMode, onWalletClick }) => {
  const [filter, setFilter] = useState('all'); // all, sent, received, access
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const itemsPerPage = 10;
  
  // Transaction detail modal
  const TransactionDetailModal = ({ transaction, onClose }) => {
    if (!transaction) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`relative w-full max-w-2xl rounded-lg shadow-xl ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Transaction Details</h2>
            
            <div className="space-y-6">
              {/* Transaction Overview */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Hash</p>
                    <p className="font-mono text-gray-900 dark:text-white">{transaction.hash || transaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Block</p>
                    <p className="font-medium text-gray-900 dark:text-white">#{transaction.blockNumber?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Timestamp</p>
                    <p className="text-gray-900 dark:text-white">{formatDateTime(transaction.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'Success' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Transaction Details */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                    <div className="flex items-center space-x-2">
                      <span 
                        onClick={() => {
                          onWalletClick(transaction.from);
                          onClose();
                        }}
                        className="font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
                      >
                        {truncateAddress(transaction.from)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                    <div className="flex items-center space-x-2">
                      <span 
                        onClick={() => {
                          onWalletClick(transaction.to);
                          onClose();
                        }}
                        className="font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
                      >
                        {truncateAddress(transaction.to)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Value</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.amount ? `${transaction.amount.toFixed(2)} ZTACC` : '0 ZTACC'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Fee</p>
                    <p className="text-gray-900 dark:text-white">{transaction.fee || "0.000000"} ZTACC</p>
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Additional Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Transaction Type</span>
                    <span className="text-gray-900 dark:text-gray-100">{transaction.type}</span>
                  </div>
                  {transaction.type === 'Access Control' && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Trust Score</span>
                      <span className="text-gray-900 dark:text-gray-100">{transaction.trustScore || "N/A"}</span>
                    </div>
                  )}
                  {transaction.type === 'Validation' && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Validation Weight</span>
                      <span className="text-gray-900 dark:text-gray-100">{transaction.validationWeight || "N/A"}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Access Level</span>
                    <span className="text-gray-900 dark:text-gray-100">{transaction.accessLevel || "Standard"}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center">
                  <ExternalLink size={16} className="mr-1" /> View in Explorer
                </button>
                <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center">
                  <Download size={16} className="mr-1" /> Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Filter transactions
  const filterTransactions = () => {
    if (!transactions) return [];
    
    let filtered = [...transactions];
    
    // Apply type filter
    if (filter === 'sent') {
      filtered = filtered.filter(tx => tx.direction === 'out');
    } else if (filter === 'received') {
      filtered = filtered.filter(tx => tx.direction === 'in');
    } else if (filter === 'access') {
      filtered = filtered.filter(tx => tx.type === 'Access Control');
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        (tx.hash && tx.hash.toLowerCase().includes(query)) ||
        (tx.from && tx.from.toLowerCase().includes(query)) ||
        (tx.to && tx.to.toLowerCase().includes(query)) ||
        (tx.type && tx.type.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };
  
  const filteredTransactions = filterTransactions();
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Render the modal when a transaction is selected */}
      {selectedTransaction && (
        <TransactionDetailModal 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
        />
      )}
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`flex items-center px-3 py-2 rounded text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            <ArrowDownUp size={16} className="mr-1" /> All Transactions
          </button>
          <button 
            onClick={() => setFilter('sent')}
            className={`flex items-center px-3 py-2 rounded text-sm font-medium ${
              filter === 'sent' 
                ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            <TrendingDown size={16} className="mr-1" /> Sent
          </button>
          <button 
            onClick={() => setFilter('received')}
            className={`flex items-center px-3 py-2 rounded text-sm font-medium ${
              filter === 'received' 
                ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            <TrendingUp size={16} className="mr-1" /> Received
          </button>
          <button 
            onClick={() => setFilter('access')}
            className={`flex items-center px-3 py-2 rounded text-sm font-medium ${
              filter === 'access' 
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-100' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Access Control
          </button>
        </div>
        
        <div className="flex w-full md:w-auto space-x-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>
          
          <button 
            className={`flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors ${
              isRefreshing ? 'opacity-75' : ''
            }`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} /> 
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Transaction History
        </h2>
        
        {paginatedTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tx Hash</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedTransactions.map((tx) => (
                  <tr 
                    key={tx.hash || tx.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      {truncateAddress(tx.hash || tx.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {tx.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDateTime(tx.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {truncateAddress(tx.from)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {truncateAddress(tx.to)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center">
                        {tx.direction === 'out' ? (
                          <TrendingDown size={14} className="mr-1 text-red-500" />
                        ) : tx.direction === 'in' ? (
                          <TrendingUp size={14} className="mr-1 text-green-500" />
                        ) : null}
                        {tx.amount ? `${tx.amount.toFixed(2)} ZTACC` : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'Success' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            No transactions found with the current filters
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium text-gray-800 dark:text-gray-100">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-800 dark:text-gray-100">{Math.min(page * itemsPerPage, filteredTransactions.length)}</span> of <span className="font-medium text-gray-800 dark:text-gray-100">{filteredTransactions.length}</span> transactions
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium ${
                  page === 1 
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <ChevronLeft size={16} className="inline mr-1" /> Previous
              </button>
              <button 
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium ${
                  page === totalPages 
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Next <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletTransactionsTab; 