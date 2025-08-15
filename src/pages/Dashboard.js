import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Clock, Search, Server, AlertTriangle, CheckCircle, 
  XCircle, Zap, Database, Shield, FileText, Code, DollarSign,
  ArrowUpRight, Pause, Play, ChevronRight, Users, Layers
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

// Import components
import Layout from '../components/Layout/Layout';

// Mock data for TPS chart
const tpsChartData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  tps: Math.floor(Math.random() * 15) + 5
}));

// Mock data for access control chart
const accessChartData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  approved: Math.floor(Math.random() * 120) + 40,
  denied: Math.floor(Math.random() * 30) + 10
}));

// Mock blocks chart data
const blocksChartData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  count: Math.floor(Math.random() * 5) + 1,
  size: Math.floor(Math.random() * 200) + 100
}));

// Mock validators chart data
const validatorsChartData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  active: Math.floor(Math.random() * 2) + 3,
  total: 5
}));

// Mock recent transactions
const mockTransactions = Array.from({ length: 10 }).map((_, i) => ({
  hash: `0x${Math.random().toString(16).substring(2, 7)}...${Math.random().toString(16).substring(2, 9)}`,
  timestamp: new Date(Date.now() - i * 180000),
  type: i % 4 === 0 ? 'Token Transfer' : i % 4 === 1 ? 'Access Control' : i % 4 === 2 ? 'Smart Contract' : 'Validation',
  amount: i % 4 === 0 ? (Math.random() * 100).toFixed(2) : null,
  status: Math.random() > 0.15 ? 'Success' : 'Failed'
}));

// Mock recent blocks
const mockBlocks = Array.from({ length: 5 }).map((_, i) => ({
  number: 10061 - i,
  timestamp: new Date(Date.now() - i * 300000),
  transactions: Math.floor(Math.random() * 15) + 2,
  validator: `validator-${(i % 4) + 1}`,
  size: `${Math.floor(Math.random() * 1000) + 500} bytes`
}));

const Dashboard = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [overviewTab, setOverviewTab] = useState('blocks');
  const [networkStats, setNetworkStats] = useState({
    blocks: 10061,
    transactions: 159427,
    validators: 5,
    avgBlockTime: 12.3,
    nextBlock: '0s',
    liveTPS: 10.5,
    pendingTx: 32,
    gasFee: 0.00023,
    accessRequests: 89543,
    accessApproved: 85244,
    accessDenied: 4299,
    approvalRate: 95.20,
    deniedRequests24h: 142,
    failedTransactions24h: 7,
    tokenPrice: 1.23,
    tokenChange: 2.4,
    transactionsLastTenMin: 182,
    successRate: 86.8,
    failedCount: 24
  });

  // Filter transactions based on selected filter
  const filteredTransactions = transactionFilter === 'all' 
    ? mockTransactions 
    : mockTransactions.filter(tx => tx.type === transactionFilter);

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title="ZTACC Explorer"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Blocks</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {networkStats.blocks.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Transactions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {networkStats.transactions.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Validators</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {networkStats.validators}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Avg Block Time</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {networkStats.avgBlockTime}s
            </p>
          </div>
        </div>
        
        {/* Network Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Server className="text-green-600 dark:text-green-400" size={20} />
              </div>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Network Status</p>
              <p className="font-medium text-green-600 dark:text-green-400">Healthy</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Clock className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Next Block</p>
              <p className="font-medium text-gray-900 dark:text-white">{networkStats.nextBlock}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Zap className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Live TPS</p>
              <p className="font-medium text-gray-900 dark:text-white">{networkStats.liveTPS}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                <DollarSign className="text-amber-600 dark:text-amber-400" size={20} />
              </div>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Gas Fee</p>
              <p className="font-medium text-gray-900 dark:text-white">{networkStats.gasFee} ZTAC</p>
            </div>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Overview</h2>
            <div className="ml-4 flex space-x-1">
              <button 
                onClick={() => setOverviewTab('blocks')}
                className={`px-3 py-1 ${overviewTab === 'blocks' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} text-sm font-medium rounded-md`}
              >
                Blocks
              </button>
              <button 
                onClick={() => setOverviewTab('transactions')}
                className={`px-3 py-1 ${overviewTab === 'transactions' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} text-sm font-medium rounded-md`}
              >
                Transactions
              </button>
              <button 
                onClick={() => setOverviewTab('access')}
                className={`px-3 py-1 ${overviewTab === 'access' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} text-sm font-medium rounded-md`}
              >
                Access
              </button>
              <button 
                onClick={() => setOverviewTab('validators')}
                className={`px-3 py-1 ${overviewTab === 'validators' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} text-sm font-medium rounded-md`}
              >
                Validators
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {overviewTab === 'blocks' && (
              <>
                {/* TPS Chart - Keep as blocks chart */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Block Production (24h)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={tpsChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                        <XAxis 
                          dataKey="time" 
                          stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
                        />
                        <YAxis stroke={darkMode ? "#9CA3AF" : "#4B5563"} />
                        <Tooltip 
                          contentStyle={darkMode ? { backgroundColor: '#1F2937', border: 'none', color: '#fff' } : undefined}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="tps" 
                          stroke="#3B82F6" 
                          fill={darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"} 
                          name="Blocks"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Block Stats Card */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Block Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Blocks</span>
                      <span className="text-gray-900 dark:text-white font-medium">{networkStats.blocks.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average Block Time</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{networkStats.avgBlockTime}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transactions Per Block</span>
                      <span className="text-gray-900 dark:text-white font-medium">{Math.round(networkStats.transactions / networkStats.blocks)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Active Validators</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">{networkStats.validators}</span>
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => navigate('/blocks')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View All Blocks
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {overviewTab === 'transactions' && (
              <>
                {/* TPS Chart */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transactions Per Second (24h)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={tpsChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                        <XAxis 
                          dataKey="time" 
                          stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
                        />
                        <YAxis stroke={darkMode ? "#9CA3AF" : "#4B5563"} />
                        <Tooltip 
                          contentStyle={darkMode ? { backgroundColor: '#1F2937', border: 'none', color: '#fff' } : undefined}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="tps" 
                          stroke="#3B82F6" 
                          fill={darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Transaction Stats Card */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Transactions</span>
                      <span className="text-gray-900 dark:text-white font-medium">{networkStats.transactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">{networkStats.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Failed (24h)</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">{networkStats.failedTransactions24h}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average Gas Fee</span>
                      <span className="text-gray-900 dark:text-white font-medium">{networkStats.gasFee} ZTAC</span>
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => navigate('/transactions')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View All Transactions
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {overviewTab === 'access' && (
              <>
                {/* Access Control Chart */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Control Requests (24h)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={accessChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                        <XAxis 
                          dataKey="time" 
                          stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
                        />
                        <YAxis stroke={darkMode ? "#9CA3AF" : "#4B5563"} />
                        <Tooltip 
                          contentStyle={darkMode ? { backgroundColor: '#1F2937', border: 'none', color: '#fff' } : undefined}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="approved" 
                          stroke="#10B981" 
                          fill={darkMode ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)"} 
                          name="Approved"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="denied" 
                          stroke="#EF4444" 
                          fill={darkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)"} 
                          name="Denied"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center mt-4 space-x-8">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Approved</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Denied</span>
                    </div>
                  </div>
                </div>
                
                {/* Access Stats Card */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Control Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Requests</span>
                      <span className="text-gray-900 dark:text-white font-medium">{networkStats.accessRequests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Approved</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">{networkStats.accessApproved.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Denied</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">{networkStats.accessDenied.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Approval Rate</span>
                      <span className="text-gray-900 dark:text-white font-medium">{networkStats.approvalRate}%</span>
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => navigate('/access')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Access Control
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {overviewTab === 'validators' && (
              <>
                {/* Validators Uptime Chart - Using TPS data as mock */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validator Uptime (24h)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tpsChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                        <XAxis 
                          dataKey="time" 
                          stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
                        />
                        <YAxis stroke={darkMode ? "#9CA3AF" : "#4B5563"} />
                        <Tooltip 
                          contentStyle={darkMode ? { backgroundColor: '#1F2937', border: 'none', color: '#fff' } : undefined}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tps" 
                          stroke="#3B82F6" 
                          name="Active Validators"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Validators Stats Card */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validator Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Active Validators</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">{networkStats.validators}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Validators</span>
                      <span className="text-gray-900 dark:text-white font-medium">{networkStats.validators}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Blocks Produced</span>
                      <span className="text-gray-900 dark:text-white font-medium">{networkStats.blocks.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">99.9%</span>
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => navigate('/validators')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View All Validators
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Security Statistics */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Access Requests</span>
                <span className="text-gray-900 dark:text-white font-medium">{networkStats.accessRequests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Access Approved</span>
                <span className="text-green-600 dark:text-green-400 font-medium">{networkStats.accessApproved.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Access Denied</span>
                <span className="text-red-600 dark:text-red-400 font-medium">{networkStats.accessDenied.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Approval Rate</span>
                <span className="text-gray-900 dark:text-white font-medium">{networkStats.approvalRate}%</span>
              </div>
            </div>
          </div>
          
          {/* Network Performance */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Network Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Transactions Per Second</span>
                <span className="text-gray-900 dark:text-white font-medium">{networkStats.liveTPS}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Block Time</span>
                <span className="text-gray-900 dark:text-white font-medium">{networkStats.avgBlockTime}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Validators</span>
                <span className="text-gray-900 dark:text-white font-medium">{networkStats.validators}/{networkStats.validators}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Network Status</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Healthy</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transactions and Blocks Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Live Transaction Feed */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Transaction Feed</h3>
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium"
              >
                {isPaused ? (
                  <>
                    <Play size={16} className="mr-1" /> Play
                  </>
                ) : (
                  <>
                    <Pause size={16} className="mr-1" /> Pause
                  </>
                )}
              </button>
            </div>
            
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
              <button 
                onClick={() => setTransactionFilter('Token Transfer')}
                className={`px-3 py-1 text-sm font-medium rounded-md whitespace-nowrap ${
                  transactionFilter === 'Token Transfer' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Token Transfer
              </button>
              <button 
                onClick={() => setTransactionFilter('Access Control')}
                className={`px-3 py-1 text-sm font-medium rounded-md whitespace-nowrap ${
                  transactionFilter === 'Access Control' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Access Control
              </button>
              <button 
                onClick={() => setTransactionFilter('Smart Contract')}
                className={`px-3 py-1 text-sm font-medium rounded-md whitespace-nowrap ${
                  transactionFilter === 'Smart Contract' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Smart Contract
              </button>
              <button 
                onClick={() => setTransactionFilter('Validation')}
                className={`px-3 py-1 text-sm font-medium rounded-md whitespace-nowrap ${
                  transactionFilter === 'Validation' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Validation
              </button>
              <button 
                onClick={() => setTransactionFilter('all')}
                className={`px-3 py-1 text-sm font-medium rounded-md whitespace-nowrap ${
                  transactionFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Activity size={18} className="text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-gray-900 dark:text-white font-medium">{networkStats.transactionsLastTenMin} Transactions in the Last 10 Mins</span>
              </div>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-gray-600 dark:text-gray-400">{networkStats.successRate}% Success</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-gray-600 dark:text-gray-400">{networkStats.failedCount} Failed</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {filteredTransactions.map((tx, index) => (
                <div 
                  key={tx.hash}
                  className="flex justify-between items-start p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(`/transaction/${tx.hash}`)}
                >
                  <div>
                    <p className="font-mono text-blue-600 dark:text-blue-400">{tx.hash}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tx.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{tx.type}</span>
                      {tx.amount && (
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                          {tx.amount} ZTAC
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'Success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Blocks */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Blocks</h3>
              <button 
                onClick={() => navigate('/blocks')}
                className="text-sm text-blue-600 dark:text-blue-400 font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-2">Block</th>
                    <th className="pb-2">Age</th>
                    <th className="pb-2">Txs</th>
                    <th className="pb-2">Validator</th>
                    <th className="pb-2">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBlocks.map(block => (
                    <tr 
                      key={block.number} 
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => navigate(`/block/${block.number}`)}
                    >
                      <td className="py-3 font-medium text-blue-600 dark:text-blue-400">{block.number}</td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">
                        {block.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3 text-gray-900 dark:text-white">{block.transactions}</td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">{block.validator}</td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">{block.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 