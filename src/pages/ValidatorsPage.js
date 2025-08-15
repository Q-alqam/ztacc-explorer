import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  Shield, Users, Server, Clock, CheckCircle, XCircle, 
  AlertTriangle, DollarSign, Lock, Search, RefreshCw, Filter,
  ChevronLeft, ChevronRight, ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

// Mock data for validators chart
const validatorStatusData = [
  { name: 'Active', value: 38 },
  { name: 'Standby', value: 7 },
  { name: 'Slashed', value: 2 },
  { name: 'Inactive', value: 3 }
];

const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#9CA3AF'];

// Mock data for validator uptime
const validatorUptimeData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  uptime: 99.8 + (Math.random() * 0.2),
}));

// Mock data for validator rewards
const validatorRewardsData = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  rewards: Math.floor(Math.random() * 1000) + 500,
}));

// Mock validator data
const generateMockValidators = (count = 50) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Validator ${i + 1}`,
    address: `0x${Math.random().toString(16).substring(2, 42)}`,
    status: i < 38 ? 'Active' : i < 45 ? 'Standby' : i < 47 ? 'Slashed' : 'Inactive',
    staked: Math.floor(Math.random() * 900000) + 100000,
    uptime: (99.7 + Math.random() * 0.3).toFixed(2),
    blocksProduced: Math.floor(Math.random() * 1000) + 100,
    rewardsEarned: Math.floor(Math.random() * 10000) + 1000,
    joinedAt: new Date(Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000)),
    slashEvents: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0,
  }));
};

const ValidatorsPage = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('staked');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Add new state variables for the calculator
  const [stakeAmount, setStakeAmount] = useState(100000);
  const [expectedUptime, setExpectedUptime] = useState(99.5);
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [calculatedRewards, setCalculatedRewards] = useState({
    rewards: 0,
    apr: 0,
    roi: 0
  });
  
  // Add function to calculate rewards
  const calculateRewards = () => {
    // Basic reward calculation logic
    let baseReward = 0;
    
    // Get stake multiplier based on tiers
    let stakeTier = 1.0; // default multiplier
    if (stakeAmount >= 1000000) {
      stakeTier = 1.3; // Platinum
    } else if (stakeAmount >= 500000) {
      stakeTier = 1.2; // Gold
    } else if (stakeAmount >= 250000) {
      stakeTier = 1.1; // Silver
    }
    
    // Calculate uptime factor (penalize if below 99%)
    const uptimeFactor = expectedUptime >= 99 ? expectedUptime/100 : (expectedUptime/100) * 0.8;
    
    // Estimate blocks produced per month (assuming ~20 blocks per validator per day)
    const blocksPerDay = 20;
    let timeMultiplier = 1;
    
    switch(timePeriod) {
      case 'daily':
        timeMultiplier = 1;
        break;
      case 'weekly':
        timeMultiplier = 7;
        break;
      case 'monthly':
        timeMultiplier = 30;
        break;
      case 'yearly':
        timeMultiplier = 365;
        break;
      default:
        timeMultiplier = 30; // monthly by default
    }
    
    // Base block rewards
    const blockReward = 20 * blocksPerDay * timeMultiplier;
    
    // Transaction fees (estimated average)
    const txFees = 5 * blocksPerDay * timeMultiplier;
    
    // Access validations (estimated)
    const accessValidations = 10 * timeMultiplier;
    
    // Calculate total rewards
    const totalRewards = ((blockReward + txFees + accessValidations) * stakeTier * uptimeFactor).toFixed(0);
    
    // Calculate APR (Annual Percentage Rate)
    const annualRewards = totalRewards * (timePeriod === 'yearly' ? 1 : (365 / timeMultiplier));
    const apr = ((annualRewards / stakeAmount) * 100).toFixed(2);
    
    // Calculate ROI for the selected time period
    const roi = ((totalRewards / stakeAmount) * 100).toFixed(2);
    
    setCalculatedRewards({
      rewards: totalRewards,
      apr: apr,
      roi: roi
    });
  };
  
  // Auto-calculate whenever inputs change
  useEffect(() => {
    if (stakeAmount >= 100000) {
      calculateRewards();
    }
  }, [stakeAmount, expectedUptime, timePeriod]);
  
  // Load validators on initial render
  useEffect(() => {
    const fetchValidators = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // Simulate API delay
        setTimeout(() => {
          const mockValidators = generateMockValidators(50);
          setValidators(mockValidators);
          setTotalPages(5); // Mock 5 pages of results
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching validators:', error);
        setLoading(false);
      }
    };
    
    fetchValidators();
  }, [currentPage, sortField, sortDirection, statusFilter]);
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    const mockValidators = generateMockValidators(50);
    
    setTimeout(() => {
      setValidators(mockValidators);
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Format address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };
  
  // Get filtered validators
  const filteredValidators = validators
    .filter(validator => {
      if (statusFilter === 'all') return true;
      return validator.status.toLowerCase() === statusFilter.toLowerCase();
    })
    .filter(validator => {
      if (!searchTerm) return true;
      return (
        validator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        validator.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      if (a[sortField] > b[sortField]) {
        comparison = 1;
      } else if (a[sortField] < b[sortField]) {
        comparison = -1;
      }
      return sortDirection === 'desc' ? comparison * -1 : comparison;
    });
  
  // Get stats
  const validatorStats = {
    total: validators.length,
    active: validators.filter(v => v.status === 'Active').length,
    standby: validators.filter(v => v.status === 'Standby').length,
    slashed: validators.filter(v => v.status === 'Slashed').length,
    inactive: validators.filter(v => v.status === 'Inactive').length,
    avgUptime: validators.length > 0 
      ? (validators.reduce((sum, v) => sum + parseFloat(v.uptime), 0) / validators.length).toFixed(2)
      : 0,
    totalStaked: validators.reduce((sum, v) => sum + v.staked, 0),
    avgRewards: validators.length > 0
      ? Math.floor(validators.reduce((sum, v) => sum + v.rewardsEarned, 0) / validators.length)
      : 0,
  };
  
  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title="Validators"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Shield className="mr-2" size={24} />
            Validators
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and search validators on the Zero-Trust Access Control Chain
          </p>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-4 overflow-x-auto pb-1">
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
                onClick={() => setActiveTab('validators')}
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'validators'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                All Validators
              </button>
              <button
                onClick={() => setActiveTab('requirements')}
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'requirements'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Requirements
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'rewards'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Rewards
              </button>
            </nav>
          </div>
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                    <Users size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Validators</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{validatorStats.total}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(validatorStats.active / validatorStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {validatorStats.active} Active
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                    <Clock size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Uptime</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{validatorStats.avgUptime}%</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${validatorStats.avgUptime}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Last 24h
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
                    <Lock size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Staked</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {(validatorStats.totalStaked / 1000000).toFixed(2)}M ZTAC
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    85% of Max
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
                    <DollarSign size={20} className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Rewards</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {validatorStats.avgRewards} ZTAC
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: '70%' }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Monthly
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Validator Status Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validator Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={validatorStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {validatorStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} validators`, name]}
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                          color: darkMode ? 'white' : 'black',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Validator Uptime Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validator Uptime (24h)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={validatorUptimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                        tickLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                        axisLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                      />
                      <YAxis 
                        domain={[99.5, 100]} 
                        tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                        tickLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                        axisLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Uptime']}
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                          color: darkMode ? 'white' : 'black',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="uptime" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', r: 4 }}
                        activeDot={{ r: 6, fill: '#2563EB' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Validators */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Validators</h3>
                <button 
                  onClick={() => setActiveTab('validators')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  View All <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Validator</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Staked</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uptime</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {validators.slice(0, 5).map((validator) => (
                      <tr key={validator.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                              <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{validator.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{formatAddress(validator.address)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            validator.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            validator.status === 'Standby' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            validator.status === 'Slashed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {validator.status === 'Active' && <CheckCircle size={12} className="mr-1" />}
                            {validator.status === 'Standby' && <Clock size={12} className="mr-1" />}
                            {validator.status === 'Slashed' && <AlertTriangle size={12} className="mr-1" />}
                            {validator.status === 'Inactive' && <XCircle size={12} className="mr-1" />}
                            {validator.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {validator.staked.toLocaleString()} ZTAC
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {validator.uptime}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(validator.joinedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Validator Resources */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validator Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Becoming a Validator</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Learn about the requirements and process to become a validator on the ZTACC network.</p>
                  <button 
                    onClick={() => setActiveTab('requirements')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    View Requirements <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Validator Rewards</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Understand the economic incentives and rewards for maintaining a validator node.</p>
                  <button 
                    onClick={() => setActiveTab('rewards')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    View Rewards <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Validator Documentation</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Technical documentation for setting up and maintaining a ZTACC validator node.</p>
                  <a 
                    href="#" 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    Read Docs <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Validators Tab */}
        {activeTab === 'validators' && (
          <div>
            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search validators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Filter size={16} className="mr-2" />
                    Filters
                  </button>
                  
                  <button
                    onClick={handleRefresh}
                    className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isRefreshing}
                  >
                    <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
              
              {showFilters && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 pl-3 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="standby">Standby</option>
                      <option value="slashed">Slashed</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 pl-3 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={sortField}
                      onChange={(e) => setSortField(e.target.value)}
                    >
                      <option value="staked">Staked Amount</option>
                      <option value="uptime">Uptime</option>
                      <option value="blocksProduced">Blocks Produced</option>
                      <option value="rewardsEarned">Rewards Earned</option>
                      <option value="joinedAt">Join Date</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Direction</label>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 pl-3 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={sortDirection}
                      onChange={(e) => setSortDirection(e.target.value)}
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setSortField('staked');
                        setSortDirection('desc');
                        setSearchTerm('');
                      }}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Validators Table */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Validator</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Staked</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uptime</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blocks Produced</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rewards</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slash Events</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading validators...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredValidators.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
                          No validators found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredValidators
                        .slice((currentPage - 1) * 10, currentPage * 10)
                        .map((validator) => (
                          <tr key={validator.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                  <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{validator.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{formatAddress(validator.address)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                validator.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                validator.status === 'Standby' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                validator.status === 'Slashed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                              }`}>
                                {validator.status === 'Active' && <CheckCircle size={12} className="mr-1" />}
                                {validator.status === 'Standby' && <Clock size={12} className="mr-1" />}
                                {validator.status === 'Slashed' && <AlertTriangle size={12} className="mr-1" />}
                                {validator.status === 'Inactive' && <XCircle size={12} className="mr-1" />}
                                {validator.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {validator.staked.toLocaleString()} ZTAC
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {validator.uptime}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {validator.blocksProduced.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {validator.rewardsEarned.toLocaleString()} ZTAC
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(validator.joinedAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {validator.slashEvents > 0 ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                  {validator.slashEvents}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  0
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {!loading && filteredValidators.length > 0 && (
                <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * 10, filteredValidators.length)}</span> of{' '}
                        <span className="font-medium">{filteredValidators.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft size={16} />
                        </button>
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                          const pageNumber = i + 1;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === pageNumber
                                  ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                              } text-sm font-medium`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight size={16} />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requirements Tab */}
        {activeTab === 'requirements' && (
          <div>
            {/* Introduction */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validator Requirements</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                ZTACC validators are responsible for securing the network, producing blocks, and validating transactions.
                Becoming a validator requires meeting specific technical and economic requirements to ensure the reliability
                and security of the Zero-Trust Access Control Chain.
              </p>
              <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full mr-4">
                  <Shield size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">Validator Framework</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    ZTACC uses a Delegated Proof of Stake (DPoS) consensus mechanism with a limited number of validators.
                    The network currently supports up to 50 active validators and 10 standby validators.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Technical Requirements */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technical Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-2">
                    <Server size={20} className="text-gray-700 dark:text-gray-300 mr-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">CPU</h4>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• 8 cores / 16 threads</li>
                    <li>• 3.0+ GHz processor</li>
                    <li>• Modern CPU architecture (x86-64)</li>
                    <li>• AES-NI support required</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-2">
                    <div className="w-5 h-5 mr-2 text-center text-gray-700 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Memory</h4>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• 32 GB RAM minimum</li>
                    <li>• 64 GB RAM recommended</li>
                    <li>• ECC memory preferred</li>
                    <li>• High memory bandwidth</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-2">
                    <div className="w-5 h-5 mr-2 text-center text-gray-700 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Storage</h4>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• 2 TB NVMe SSD minimum</li>
                    <li>• 4 TB NVMe SSD recommended</li>
                    <li>• Enterprise-grade storage</li>
                    <li>• Redundant storage configuration</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-2">
                    <div className="w-5 h-5 mr-2 text-center text-gray-700 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Network</h4>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• 1 Gbps dedicated connection</li>
                    <li>• 99.9% uptime SLA</li>
                    <li>• Low latency connection</li>
                    <li>• DDoS protection</li>
                  </ul>
                </div>
              </div>
              
              {/* Additional Technical Requirements */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Software and Maintenance</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• Running the latest version of ZTACC validator software</li>
                  <li>• Automatic security updates enabled</li>
                  <li>• Regular system maintenance and monitoring</li>
                  <li>• Hardware security module (HSM) for key management</li>
                  <li>• Redundant systems for high availability</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Uptime Requirements</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• Minimum 99.5% uptime calculated on a 30-day rolling basis</li>
                  <li>• No more than 4 hours of consecutive downtime</li>
                  <li>• No more than 12 hours of total downtime per month</li>
                  <li>• Planned maintenance must be announced at least 24 hours in advance</li>
                </ul>
              </div>
            </div>
            
            {/* Economic Requirements */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Economic Requirements</h3>
              <div className="bg-purple-50 dark:bg-purple-900 p-5 rounded-lg mb-6">
                <div className="flex items-center mb-3">
                  <Lock size={24} className="text-purple-600 dark:text-purple-400 mr-2" />
                  <h4 className="font-medium text-purple-800 dark:text-purple-300">Token Stake Requirement</h4>
                </div>
                <p className="text-purple-600 dark:text-purple-400 mb-4">
                  Validators must stake a minimum of 100,000 ZTAC tokens to be eligible for validation. 
                  This stake serves as collateral and can be slashed for malicious behavior or poor performance.
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Stake Tiers</h5>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tier</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stake Amount</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reward Multiplier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Standard</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">100,000 ZTAC</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">1.0x</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Silver</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">250,000 ZTAC</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">1.1x</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Gold</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">500,000 ZTAC</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">1.2x</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Platinum</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">1,000,000 ZTAC</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">1.3x</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Lock-up Period</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• Minimum staking period of 3 months</li>
                  <li>• 14-day unbonding period after requesting stake withdrawal</li>
                  <li>• Early unstaking results in a 10% penalty on the staked amount</li>
                  <li>• Staked tokens cannot be used for delegation or other purposes</li>
                </ul>
              </div>
            </div>
            
            {/* Selection Process */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validator Selection Process</h3>
              <div className="relative pb-12">
                <div className="absolute left-6 top-5 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                
                {/* Step 1 */}
                <div className="relative mb-8">
                  <div className="absolute left-0 mt-1.5 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center z-10">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Application Submission</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Submit a validator application through the ZTACC governance portal. The application should include:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 mb-2 space-y-1">
                      <li>Validator operator information</li>
                      <li>Technical infrastructure details</li>
                      <li>Security measures</li>
                      <li>Past experience with blockchain validation</li>
                      <li>Proposed stake amount</li>
                    </ul>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="relative mb-8">
                  <div className="absolute left-0 mt-1.5 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center z-10">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Token Staking</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      After initial approval, stake the required minimum tokens (100,000 ZTAC) to the validator staking contract.
                      The staking transaction must be initiated from the same wallet address specified in the application.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative mb-8">
                  <div className="absolute left-0 mt-1.5 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center z-10">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Technical Verification</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Set up your validator node using the provided instructions and connect to the ZTACC testnet.
                      Your node will undergo a 7-day testing period to verify:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 mb-2 space-y-1">
                      <li>Block production capabilities</li>
                      <li>Network stability</li>
                      <li>Response time</li>
                      <li>Security compliance</li>
                    </ul>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute left-0 mt-1.5 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center z-10">
                    <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Activation</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      After successfully completing the testing period, your validator will be eligible for activation
                      on the ZTACC mainnet. Activation depends on:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
                      <li>Current number of active validators</li>
                      <li>Your stake amount relative to other validators</li>
                      <li>Network performance during testing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Apply CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow text-white mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold mb-2">Ready to Become a Validator?</h3>
                  <p className="text-blue-100">
                    Apply now to join the ZTACC validator network and earn rewards while securing the blockchain.
                  </p>
                </div>
                <a 
                  href="#" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply as Validator
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div>
            {/* Introduction */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validator Rewards</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                ZTACC validators are rewarded for their contribution to network security and operation.
                Rewards are distributed based on several factors including stake amount, uptime,
                and participation in consensus.
              </p>
              <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full mr-4">
                  <DollarSign size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Reward Mechanism</h4>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Validators earn rewards from block production, transaction fees, and special rewards for access control validations.
                    The current annual reward rate ranges from 8% to 12% based on network conditions and validator performance.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Reward Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reward Distribution</h3>
              
              {/* Reward Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Block Production Reward</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">20 ZTAC</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per block produced</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Fee Share</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">70%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Of transaction fees</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Access Control Validation</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5 ZTAC</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per validation</p>
                  </div>
                </div>
              </div>
              
              {/* Distribution Chart */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Monthly Reward Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={validatorRewardsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                        tickLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                        axisLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                        label={{ value: 'Day of Month', position: 'insideBottom', offset: -5, fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                      />
                      <YAxis 
                        tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                        tickLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                        axisLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                        label={{ value: 'Rewards (ZTAC)', angle: -90, position: 'insideLeft', fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} ZTAC`, 'Rewards']}
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                          color: darkMode ? 'white' : 'black',
                        }}
                        cursor={{fill: 'rgba(0, 0, 0, 0.1)'}}
                      />
                      <Bar 
                        dataKey="rewards" 
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                      >
                        {validatorRewardsData.map((entry, index) => {
                          // Find min and max rewards for normalization
                          const maxReward = Math.max(...validatorRewardsData.map(d => d.rewards));
                          const minReward = Math.min(...validatorRewardsData.map(d => d.rewards));
                          
                          // Normalize the current reward value between 0 and 1
                          const normalizedValue = (entry.rewards - minReward) / (maxReward - minReward);
                          
                          // Color scale: low (cool) to high (warm)
                          // We'll use blue for low values and red for high values
                          const getColorForValue = (value) => {
                            // Low values (blue to teal to green)
                            if (value < 0.33) {
                              return `#3B82F6`; // Blue
                            } 
                            // Medium values (green to yellow)
                            else if (value < 0.66) {
                              return `#10B981`; // Green
                            } 
                            // High values (yellow to red)
                            else {
                              return `#F59E0B`; // Orange/Yellow
                            }
                          };
                          
                          const color = getColorForValue(normalizedValue);
                          
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={color}
                              fillOpacity={1}
                              strokeWidth={0}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Reward Calculation */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reward Calculation Formula</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Validator rewards are calculated using the following formula:
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                  <p className="text-sm font-mono text-center text-gray-700 dark:text-gray-300">
                    Reward = (Base Reward × Stake Multiplier × Uptime Factor) + Transaction Fees + Access Validations
                  </p>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li><strong>Base Reward:</strong> Fixed amount per block produced (20 ZTAC)</li>
                  <li><strong>Stake Multiplier:</strong> Based on stake tier (1.0x to 1.3x)</li>
                  <li><strong>Uptime Factor:</strong> Percentage of time validator was online and responsive</li>
                  <li><strong>Transaction Fees:</strong> 70% of transaction fees from blocks produced</li>
                  <li><strong>Access Validations:</strong> 5 ZTAC per access control validation performed</li>
                </ul>
              </div>
            </div>
            
            {/* Slashing Mechanisms */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Slashing Mechanisms</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                To maintain network integrity and incentivize proper validator behavior, ZTACC implements several slashing conditions.
                When a validator violates network rules, a portion of their staked tokens may be slashed (confiscated).
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Offense</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slashing Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Additional Penalties</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AlertTriangle size={16} className="text-red-500 mr-2" />
                          <span className="text-gray-900 dark:text-white">Double Signing</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Signing two different blocks at the same height</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-md">
                          10% of stake
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Removal from active validator set for 30 days
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AlertTriangle size={16} className="text-red-500 mr-2" />
                          <span className="text-gray-900 dark:text-white">Downtime</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Missing more than 95% of blocks in a 24-hour period</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded-md">
                          1% of stake
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Temporary suspension until node is back online
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AlertTriangle size={16} className="text-red-500 mr-2" />
                          <span className="text-gray-900 dark:text-white">Invalid Transactions</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Proposing blocks with invalid transactions</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300 rounded-md">
                          5% of stake
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Reduced block rewards for 7 days
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AlertTriangle size={16} className="text-red-500 mr-2" />
                          <span className="text-gray-900 dark:text-white">Malicious Behavior</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Attempting to attack or compromise the network</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-md">
                          Up to 100% of stake
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Permanent ban from validator network
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Rewards Calculator */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rewards Calculator</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Estimate your potential rewards based on stake amount, uptime, and network participation.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stake Amount (ZTAC)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="100000"
                      min="100000"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(Math.max(100000, Number(e.target.value)))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Uptime (%)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="99.5"
                      min="0"
                      max="100"
                      step="0.1"
                      value={expectedUptime}
                      onChange={(e) => setExpectedUptime(Math.min(100, Math.max(0, Number(e.target.value))))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Period</label>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 pl-3 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Rewards</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {calculatedRewards.rewards > 0 ? `${calculatedRewards.rewards.toLocaleString()} ZTAC` : '- ZTAC'}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Annual Percentage Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {calculatedRewards.apr > 0 ? `${calculatedRewards.apr}%` : '- %'}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Return on Investment</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {calculatedRewards.roi > 0 ? `${calculatedRewards.roi}%` : '- %'}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  *This calculator provides estimates only. Actual rewards may vary based on network conditions and validator performance.
                </p>
              </div>
            </div>
            
            {/* FAQ */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">How often are rewards distributed?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Validator rewards are distributed at the end of each epoch (approximately every 24 hours).
                    Block production rewards are immediately available, while transaction fees and access validation
                    rewards are distributed in batches.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Can I withdraw my stake at any time?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No. Validators must maintain their stake for a minimum of 3 months. After the minimum period,
                    you can request to withdraw your stake, which will initiate a 14-day unbonding period.
                    During the unbonding period, you will not receive rewards but your stake can still be slashed for
                    previous violations.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">What happens if my validator is offline?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If your validator is offline, you won't receive block production rewards for the periods you're offline.
                    Extended downtime (missing more than 95% of blocks in a 24-hour period) can result in slashing and
                    temporary suspension from the active validator set. It's critical to maintain high uptime to
                    maximize rewards and avoid penalties.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Are rewards automatically compounded?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No, rewards are not automatically compounded. They are distributed to your validator reward address,
                    and you can choose to restake them manually to increase your validator stake and potentially
                    move up to a higher stake tier with better reward multipliers.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">What is the difference between active and standby validators?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Active validators participate in block production and consensus, receiving full rewards.
                    Standby validators don't produce blocks but remain ready to be promoted to active status
                    if an active validator is slashed or voluntarily exits. Standby validators receive a smaller
                    reward (approximately 20% of active validator rewards) for maintaining their node and providing
                    network security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ValidatorsPage; 