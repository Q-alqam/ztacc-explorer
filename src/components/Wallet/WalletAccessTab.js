import React, { useState } from 'react';
import { 
  Shield, Filter, RefreshCw, AlertCircle, CheckCircle, Clock, 
  X, ChevronRight, ChevronLeft
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, ResponsiveContainer, 
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

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

const getStatusColorClasses = (status) => {
  return status === 'Success' || status === 'Approved'
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
};

// Mock access trends data - empty to match screenshot
const mockAccessTrendsData = Array.from({ length: 30 }).map(() => ({
  date: new Date(),
  approved: 0,
  denied: 0
}));

const WalletAccessTab = ({ darkMode = false, wallet }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Simulate empty data for now as shown in screenshot
  const filteredRequests = [];

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
      {/* Access Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Access Requests */}
        <div className={`bg-blue-50 dark:bg-gray-800 p-4 rounded-lg shadow ${darkMode ? 'border border-gray-700' : ''}`}>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {wallet?.accessRequests || 87}
            </p>
          </div>
          
          {/* Approved Requests */}
        <div className={`bg-green-50 dark:bg-gray-800 p-4 rounded-lg shadow ${darkMode ? 'border border-gray-700' : ''}`}>
          <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {wallet?.accessGranted || 82}
            </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {wallet?.accessGranted && wallet?.accessRequests 
              ? ((wallet.accessGranted / wallet.accessRequests) * 100).toFixed(2) 
              : "94.25"}%
            </p>
          </div>
          
          {/* Denied Requests */}
        <div className={`bg-red-50 dark:bg-gray-800 p-4 rounded-lg shadow ${darkMode ? 'border border-gray-700' : ''}`}>
          <p className="text-sm text-gray-600 dark:text-gray-400">Denied</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {wallet?.accessDenied || 5}
            </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {wallet?.accessDenied && wallet?.accessRequests 
              ? ((wallet.accessDenied / wallet.accessRequests) * 100).toFixed(2) 
              : "5.75"}%
            </p>
          </div>
        </div>

      {/* Access Request Trends */}
      <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${darkMode ? 'border border-gray-700' : ''}`}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Access Request Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={mockAccessTrendsData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDenied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={false}
                stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
              />
              <Tooltip 
                contentStyle={darkMode ? { backgroundColor: '#1F2937', border: 'none', color: '#fff' } : undefined}
              />
              <Area 
                type="monotone" 
                dataKey="approved" 
                stroke="#10B981" 
                fillOpacity={1}
                fill="url(#colorApproved)" 
              />
              <Area 
                type="monotone" 
                dataKey="denied" 
                stroke="#EF4444" 
                fillOpacity={1}
                fill="url(#colorDenied)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Access Request History */}
      <div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Access Request History
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
            <button 
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-1 text-sm ${
                    selectedFilter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            <button 
                  onClick={() => setSelectedFilter('approved')}
                  className={`px-3 py-1 text-sm ${
                    selectedFilter === 'approved' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 dark:text-gray-300'
              }`}
            >
                  Approved
            </button>
            <button 
                  onClick={() => setSelectedFilter('denied')}
                  className={`px-3 py-1 text-sm ${
                    selectedFilter === 'denied' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 dark:text-gray-300'
              }`}
            >
                  Denied
            </button>
              </div>
            <button 
                onClick={handleRefresh}
                className={`p-2 rounded-full ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
        
          {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Requester
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Trust Score
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRequests.map((request) => (
                    <tr key={request.id || request.hash} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDateTime(request.timestamp)}
                    </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                        {truncateAddress(request.from)}
                    </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                        {truncateAddress(request.to)}
                    </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          getStatusColorClasses(request.status)
                      }`}>
                          {request.status === 'Success' ? 'Approved' : 'Denied'}
                      </span>
                    </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {request.trustScore || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          View Details
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
            <div className={`bg-white dark:bg-gray-800 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-8 text-center`}>
              <p className="text-gray-500 dark:text-gray-400">
            No access requests found with the current filter
              </p>
            </div>
          )}
          </div>
      </div>
    </div>
  );
};

export default WalletAccessTab; 