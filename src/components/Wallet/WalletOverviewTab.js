import React from 'react';
import { 
  Box, Activity, Shield, FileText, ArrowRight, ChevronRight, 
  TrendingUp, TrendingDown, Wallet
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, ResponsiveContainer, 
  XAxis, YAxis, Tooltip 
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

const WalletOverviewTab = ({ wallet, transactions, activityData, darkMode, onWalletClick }) => {
  // Generate activity chart data if not provided
  const walletActivityData = activityData || Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      transactions: Math.floor(Math.random() * 8) + 1,
      value: Math.floor(Math.random() * 200) + 50
    };
  });

  return (
    <div className="space-y-6">
      {/* Token Balance and Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Token Balance</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{wallet?.balance?.toLocaleString() || "0"}</span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">ZTACC</span>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={wallet?.trustScore >= 80 ? "text-green-600 dark:text-green-400" : 
                             wallet?.trustScore >= 50 ? "text-yellow-600 dark:text-yellow-400" : 
                             "text-red-600 dark:text-red-400"}>
              Trust Score: {wallet?.trustScore || "N/A"}%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Transfer Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Sent</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {wallet?.tokensSent?.toLocaleString() || "0"} ZTACC
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Received</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {wallet?.tokensReceived?.toLocaleString() || "0"} ZTACC
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Transactions</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {wallet?.transactions || "0"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Security Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Access Requests</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {wallet?.accessRequests || "0"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Approved</span>
              <span className="text-green-600 dark:text-green-400">
                {wallet?.accessGranted || "0"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Denied</span>
              <span className="text-red-600 dark:text-red-400">
                {wallet?.accessDenied || "0"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Wallet Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={walletActivityData}>
              <XAxis 
                dataKey="date" 
                stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
                tick={{fontSize: 12}}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis stroke={darkMode ? "#9CA3AF" : "#4B5563"} />
              <Tooltip 
                contentStyle={darkMode ? { backgroundColor: '#1F2937', border: 'none', color: '#fff' } : undefined}
                formatter={(value) => [`${value}`, 'Value']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                fill={darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"} 
              />
              <Area 
                type="monotone" 
                dataKey="transactions" 
                stroke="#10B981" 
                fill={darkMode ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)"} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
            <Activity className="mr-2" size={18} />
            Recent Transactions
          </h3>
          <button 
            className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center hover:text-blue-800 dark:hover:text-blue-300"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        
        {transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tx Hash</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Age</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Direction</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.hash || tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      {truncateAddress(tx.hash || tx.id)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {tx.type}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(tx.timestamp)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {tx.direction === 'out' ? (
                        <span className="flex items-center text-red-500">
                          <TrendingDown size={14} className="mr-1" /> Out
                        </span>
                      ) : (
                        <span className="flex items-center text-green-500">
                          <TrendingUp size={14} className="mr-1" /> In
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {tx.amount ? `${tx.amount.toFixed(2)} ZTACC` : '—'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
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
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No transactions found for this wallet
          </div>
        )}
      </div>

      {/* Validation Stats (if applicable) */}
      {wallet?.validatorStatus === 'Active' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Validator Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">Delegated Stake</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {wallet.delegatedStake?.toLocaleString() || "0"} ZTACC
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">Validator Rewards</p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">
                {wallet.validatorRewards?.toLocaleString() || "0"} ZTACC
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <p className="text-sm text-purple-700 dark:text-purple-300">Access Level</p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {wallet.accessLevel || "Standard"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletOverviewTab; 