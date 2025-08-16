import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Clock, Search, Server, AlertTriangle, CheckCircle, 
  XCircle, Zap, Database, Shield, FileText, Code, DollarSign,
  ArrowUpRight, Pause, Play, ChevronRight, Users, Layers, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

// Import components
import Layout from '../components/Layout/Layout';

// Import ZTACC API service
import ztaccApiService from '../services/ztaccApiService';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blocks24hData, setBlocks24hData] = useState([]);
  const [tps24hData, setTps24hData] = useState([]);
  const [validatorsUptime24hData, setValidatorsUptime24hData] = useState([]);
  const [networkStats, setNetworkStats] = useState({
    blocks: 0,
    transactions: 0,
    validators: 0,
    totalValidators: 0,
    activeValidators: 0,
    unhealthyValidators: 0,
    offlineValidators: 0,
    avgBlockTime: 0,
    transactionsPerBlock: 0,
    nextBlock: '0s',
    liveTPS: 8055,
    pendingTx: 0,
    gasFee: 0,
    accessRequests: 0,
    accessApproved: 0,
    accessDenied: 0,
    approvalRate: 0,
    deniedRequests24h: 0,
    failedTransactions24h: 0,
    tokenPrice: 0,
    tokenChange: 0,
    transactionsLastTenMin: 0,
    successRate: 0,
    failedCount: 0,
    networkHealth: 'healthy',
    transactionSuccessRate: 0,
    failedTransactions24h: 0
  });

  // Load 24-hour analytics data
  const load24hAnalyticsData = async () => {
    try {
      const [blocksResult, tpsResult, uptimeResult] = await Promise.all([
        ztaccApiService.getBlocks24h(),
        ztaccApiService.getTPS24h(),
        ztaccApiService.getValidatorsUptime24h()
      ]);

      // Process block production data
      if (blocksResult.success && blocksResult.hourly_breakdown) {
        const blocksChartData = blocksResult.hourly_breakdown.map(hour => ({
          time: hour.hour.split(' ')[1], // Extract time part (HH:MM)
          blocks: hour.block_count
        }));
        setBlocks24hData(blocksChartData);
        console.log('24h block production data loaded:', blocksChartData);
      }

      // Process TPS data
      if (tpsResult.success && tpsResult.hourly_breakdown) {
        const tpsChartData = tpsResult.hourly_breakdown.map(hour => ({
          time: hour.hour.split(' ')[1], // Extract time part (HH:MM)
          tps: hour.tps
        }));
        setTps24hData(tpsChartData);
        console.log('24h TPS data loaded:', tpsChartData);
      }

      // Process validator uptime data
      if (uptimeResult.success && uptimeResult.hourly_breakdown) {
        const uptimeChartData = uptimeResult.hourly_breakdown.map(hour => ({
          time: hour.hour.split(' ')[1], // Extract time part (HH:MM)
          activeValidators: hour.active_validators.length,
          blocksProduced: hour.blocks_produced
        }));
        setValidatorsUptime24hData(uptimeChartData);
        console.log('24h validator uptime data loaded:', uptimeChartData);
      }
    } catch (error) {
      console.error('Failed to load 24h analytics data:', error);
    }
  };

  // Load transaction statistics data
  const loadTransactionStats = async () => {
    try {
      const txStatsResult = await ztaccApiService.getTransactionStats();
      console.log('🔍 Transaction stats API response:', txStatsResult);
      
      if (txStatsResult.success && txStatsResult.transactions) {
        const transactions = txStatsResult.transactions;
        const totalTransactions = transactions.length;
        
        // Calculate success rate and failed transactions
        // For now, assume all transactions are successful since we don't have explicit failure data
        // You can modify this logic based on your actual transaction data structure
        const successfulTransactions = transactions.filter(tx => {
          // Check if transaction has any error indicators
          // Adjust this logic based on your actual transaction structure
          return !tx.error && !tx.failed && tx.status !== 'failed';
        }).length;
        
        const failedTransactions = totalTransactions - successfulTransactions;
        const successRate = totalTransactions > 0 ? Math.round((successfulTransactions / totalTransactions) * 100) : 0;
        
        console.log('📊 Transaction stats calculated:', {
          totalTransactions,
          successfulTransactions,
          failedTransactions,
          successRate
        });
        
        // Update network stats with transaction statistics
        setNetworkStats(prev => ({
          ...prev,
          transactionSuccessRate: successRate,
          failedTransactions24h: failedTransactions
        }));
      } else {
        console.log('⚠️ Transaction stats API failed or no data:', txStatsResult.error || 'No transactions data');
      }
    } catch (error) {
      console.error('❌ Failed to load transaction stats:', error);
    }
  };

  // Load real blockchain data
  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await ztaccApiService.getDashboardData();
      
      if (result.success) {
        const { nodeInfo, networkStatus, economics } = result.data;
        
        // Get real transaction count and block time from blockchain
        let totalTransactions = 0;
        let avgBlockTime = 12.3; // Default fallback
        let transactionsPerBlock = 16; // Default fallback
        
        try {
          const txCountResult = await ztaccApiService.getTransactionCount();
          if (txCountResult.success) {
            totalTransactions = txCountResult.totalTransactions;
            transactionsPerBlock = Math.round(totalTransactions / nodeInfo.chain_length) || 16;
          } else {
            // Fallback to estimation if direct count fails
            totalTransactions = nodeInfo.chain_length * 16;
          }
        } catch (txError) {
          console.log('Using estimated transaction count:', txError.message);
          totalTransactions = nodeInfo.chain_length * 16; // Fallback estimate
        }

        // Get real average block time from dedicated API
        try {
          const blockTimeResult = await ztaccApiService.getBlockTimeStats();
          if (blockTimeResult.success && blockTimeResult.statistics) {
            avgBlockTime = blockTimeResult.statistics.average_block_time_seconds;
            console.log('Real block time from API:', avgBlockTime);
          } else {
            console.log('Using default block time:', blockTimeResult.error || 'API failed');
            avgBlockTime = 12.3; // Keep default if API fails
          }
        } catch (blockTimeError) {
          console.log('Using default block time:', blockTimeError.message);
          avgBlockTime = 12.3; // Keep default if calculation fails
        }

        // Calculate network health status based on validator health and network status
        let networkHealth = 'healthy';
        try {
          if (networkStatus.blockchain_info && networkStatus.blockchain_info.validator_health) {
            const validatorHealth = networkStatus.blockchain_info.validator_health;
            const healthyCount = validatorHealth.healthy_count || 0;
            const totalCount = validatorHealth.total_count || 0;
            const unhealthyCount = validatorHealth.unhealthy_count || 0;
            
            // Debug: Log validator data
            console.log('🔍 Validator data from API:', {
              blockchain_info: networkStatus.blockchain_info,
              validator_health: validatorHealth,
              healthy_count: healthyCount,
              total_count: totalCount,
              unhealthy_count: unhealthyCount
            });
            
            // Determine network health based on validator status
            if (unhealthyCount === 0 && healthyCount > 0) {
              networkHealth = 'healthy';
            } else if (unhealthyCount > 0 && healthyCount > 0) {
              networkHealth = 'warning';
            } else if (healthyCount === 0) {
              networkHealth = 'critical';
            }
            
            console.log('Network health calculated:', {
              healthy: healthyCount,
              unhealthy: unhealthyCount,
              total: totalCount,
              status: networkHealth
            });
          }
        } catch (healthError) {
          console.log('Using default network health:', healthError.message);
          networkHealth = 'healthy'; // Default fallback
        }

        // Calculate next block timing based on average block time
        let nextBlock = '0s';
        try {
          if (avgBlockTime > 0) {
            // Estimate next block based on average block time
            // This gives users an idea of when to expect the next block
            nextBlock = `${Math.round(avgBlockTime)}s`;
            console.log('Next block estimated:', nextBlock);
          }
        } catch (nextBlockError) {
          console.log('Using default next block timing:', nextBlockError.message);
          nextBlock = '0s'; // Default fallback
        }

        // Get real live TPS from dedicated API
        let liveTPS = 0;
        try {
          const tpsResult = await ztaccApiService.getLiveTPS();
          if (tpsResult.success && tpsResult.data) {
            liveTPS = tpsResult.data.tps || 0;
            console.log('Real live TPS from API:', liveTPS);
          } else {
            console.log('Using fallback TPS:', tpsResult.error || 'API failed');
            liveTPS = 0; // Fallback if API fails
          }
        } catch (tpsError) {
          console.log('Using fallback TPS:', tpsError.message);
          liveTPS = 0; // Fallback if calculation fails
        }
        
        // Update network stats with real blockchain data
        setNetworkStats(prev => ({
          ...prev,
          blocks: nodeInfo.chain_length || 0,
          transactions: totalTransactions,
          validators: networkStatus.blockchain_info.active_validator_count || 0,
          totalValidators: networkStatus.blockchain_info.total_validator_count || 0,
          activeValidators: networkStatus.blockchain_info.active_validator_count || 0,
          unhealthyValidators: 0, // Reset unhealthyValidators
          offlineValidators: 0, // Reset offlineValidators
          avgBlockTime: parseFloat(avgBlockTime),
          transactionsPerBlock: transactionsPerBlock,
          nextBlock: nextBlock,
          liveTPS: liveTPS,
          pendingTx: 0,
          gasFee: economics.economics.transaction_fee || 0,
          accessRequests: 0,
          accessApproved: 0,
          accessDenied: 0,
          approvalRate: 0,
          deniedRequests24h: 0,
          failedTransactions24h: 0,
          tokenPrice: 0,
          tokenChange: 0,
          transactionsLastTenMin: 0,
          successRate: 0,
          failedCount: 0,
          networkHealth: networkHealth
        }));

        // Debug: Log what we're setting for validators
        console.log('📊 Setting validator counts:', {
          validators: networkStatus.blockchain_info.active_validator_count || 0,
          totalValidators: networkStatus.blockchain_info.total_validator_count || 0,
          activeValidators: networkStatus.blockchain_info.active_validator_count || 0,
          blockchain_info: networkStatus.blockchain_info
        });

        // Get additional validator data from /validators endpoint and combine with network_status health data
        try {
          const validatorsResult = await ztaccApiService.getValidators();
          console.log('🔍 Validators API response:', validatorsResult);
          
          if (validatorsResult.active_validators) {
            console.log('🔍 Active validators array:', validatorsResult.active_validators);
            console.log('🔍 Active validators array length:', validatorsResult.active_validators.length);
            console.log('🔍 Total count from API:', validatorsResult.total_count);
            
            // Get health data from network_status (already fetched above)
            const validatorHealth = networkStatus.blockchain_info?.validator_health;
            console.log('🔍 Validator health from network_status:', validatorHealth);
            
            // Calculate validator counts by combining both data sources
            const totalValidators = validatorsResult.total_count || validatorsResult.active_validators.length;
            const activeValidators = validatorsResult.active_validators.length;
            
            // Use health data from network_status for accurate counts
            const healthyValidators = validatorHealth?.healthy_count || 0;
            const unhealthyValidators = 0; // Set to 0 to match testing dashboard logic
            const offlineValidators = totalValidators - healthyValidators; // All non-healthy are offline
            
            console.log('📊 Validator counts calculated (combined data):', {
              totalValidators,
              activeValidators,
              healthyValidators,
              unhealthyValidators,
              offlineValidators,
              validatorHealth: validatorHealth,
              note: 'Unhealthy validators counted as offline to match testing dashboard'
            });
            
            // Update with accurate validator counts
            setNetworkStats(prev => ({
              ...prev,
              totalValidators: totalValidators,
              activeValidators: healthyValidators, // Use healthy count from network_status
              unhealthyValidators: unhealthyValidators,
              offlineValidators: offlineValidators,
              validators: totalValidators // Keep legacy field updated
            }));
          } else {
            console.log('❌ Validators API response structure issue:', {
              hasActiveValidators: !!validatorsResult.active_validators,
              hasTotalCount: !!validatorsResult.total_count,
              fullResponse: validatorsResult
            });
          }
        } catch (validatorsError) {
          console.log('⚠️ Failed to get validators data:', validatorsError.message);
        }
      } else {
        setError(result.error || 'Failed to load blockchain data');
      }
    } catch (error) {
      console.error('Failed to load blockchain data:', error);
      setError(error.message || 'Failed to connect to blockchain');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadBlockchainData();
    load24hAnalyticsData(); // Load 24h analytics data on mount
    loadTransactionStats(); // Load transaction statistics on mount
  }, []);

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        loadBlockchainData();
        load24hAnalyticsData(); // Refresh 24h analytics data
        loadTransactionStats(); // Refresh transaction statistics
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

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
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="text-red-400 mr-2" size={20} />
              <span className="text-red-800 dark:text-red-200">
                {error} - <button 
                  onClick={loadBlockchainData}
                  className="underline hover:no-underline"
                >
                  Retry
                </button>
              </span>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Blocks</p>
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {loading ? '...' : networkStats.blocks.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Transactions</p>
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {loading ? '...' : networkStats.transactions.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Validators</p>
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {loading ? '...' : networkStats.activeValidators}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Avg Block Time</p>
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {loading ? '...' : `${networkStats.avgBlockTime}s`}
            </p>
          </div>
        </div>
        
        {/* Refresh and Controls Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={loadBlockchainData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={16} />
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                isPaused 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {isPaused ? <Play className="mr-2" size={16} /> : <Pause className="mr-2" size={16} />}
              {isPaused ? 'Resume Auto-refresh' : 'Pause Auto-refresh'}
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {loading ? 'Updating...' : 'Auto-refresh every 10s'}
          </div>
        </div>
        
        {/* Network Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                loading ? 'bg-gray-100 dark:bg-gray-800' : 
                networkStats.networkHealth === 'healthy' ? 'bg-green-100 dark:bg-green-900' :
                networkStats.networkHealth === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                'bg-red-100 dark:bg-red-900'
              }`}>
                <Server className={`${
                  loading ? 'text-gray-400' :
                  networkStats.networkHealth === 'healthy' ? 'text-green-600 dark:text-green-400' :
                  networkStats.networkHealth === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`} size={20} />
              </div>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Network Status</p>
              <p className={`font-medium ${
                loading ? 'text-gray-400' :
                networkStats.networkHealth === 'healthy' ? 'text-green-600 dark:text-green-400' :
                networkStats.networkHealth === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {loading ? '...' : networkStats.networkHealth || 'Unknown'}
              </p>
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
              <p className="font-medium text-gray-900 dark:text-white">{loading ? '...' : networkStats.nextBlock}</p>
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
              <p className="font-medium text-gray-900 dark:text-white">{loading ? '...' : networkStats.liveTPS}</p>
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
              <p className="font-medium text-gray-900 dark:text-white">
                {loading ? '...' : networkStats.gasFee} ZTACC
              </p>
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
                      <AreaChart data={blocks24hData}>
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
                          dataKey="blocks" 
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
                      <span className="text-gray-900 dark:text-white font-medium">
                        {loading ? '...' : networkStats.blocks.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average Block Time</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {loading ? '...' : `${networkStats.avgBlockTime}s`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transactions Per Block</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {loading ? '...' : networkStats.transactionsPerBlock}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Active Validators</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {loading ? '...' : networkStats.validators}
                      </span>
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
                      <AreaChart data={tps24hData}>
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
                      <span className="text-gray-900 dark:text-white font-medium">
                        {loading ? '...' : networkStats.transactions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {loading ? '...' : `${networkStats.transactionSuccessRate}%`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Failed (24h)</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {loading ? '...' : networkStats.failedTransactions24h}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average Gas Fee</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {loading ? '...' : `${networkStats.gasFee} ZTACC`}
                      </span>
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm relative">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Control Requests (24h)</h3>
                  
                  {/* Coming Soon Overlay */}
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🚧</div>
                      <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Coming Soon</h4>
                    </div>
                  </div>
                  
                  <div className="h-64 opacity-30">
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
                  <div className="flex justify-center mt-4 space-x-8 opacity-30">
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm relative">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Control Statistics</h3>
                  
                  {/* Coming Soon Overlay */}
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🚧</div>
                      <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Coming Soon</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-4 opacity-30">
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
                      <LineChart data={validatorsUptime24hData}>
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
                          dataKey="activeValidators" 
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
                      <span className="text-green-600 dark:text-green-400 font-medium">{loading ? '...' : networkStats.activeValidators}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Validators</span>
                      <span className="text-gray-900 dark:text-white font-medium">{loading ? '...' : networkStats.totalValidators}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Unhealthy Validators</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">{loading ? '...' : networkStats.unhealthyValidators}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Offline Validators</span>
                      <span className="text-gray-900 dark:text-white font-medium">{loading ? '...' : networkStats.offlineValidators}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Blocks Produced</span>
                      <span className="text-gray-900 dark:text-white font-medium">{loading ? '...' : networkStats.blocks.toLocaleString()}</span>
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm relative">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Statistics</h3>
            
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-4xl mb-2">🚧</div>
                <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Coming Soon</h4>
              </div>
            </div>
            
            <div className="space-y-4 opacity-30">
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
                <span className="text-gray-900 dark:text-white font-medium">{networkStats.activeValidators}/{networkStats.totalValidators}</span>
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