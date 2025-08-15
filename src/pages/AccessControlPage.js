import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  Shield, Lock, Key, User, Users, FileText, CheckCircle, 
  XCircle, AlertTriangle, Clock, Search, RefreshCw, Filter,
  ChevronLeft, ChevronRight, ArrowRight, BarChart2
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

// Mock data for access request status chart
const accessStatusData = [
  { name: 'Approved', value: 68 },
  { name: 'Pending', value: 15 },
  { name: 'Rejected', value: 12 },
  { name: 'Expired', value: 5 }
];

const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#9CA3AF'];

// Mock data for trust score distribution
const trustScoreData = Array.from({ length: 10 }).map((_, i) => ({
  score: (i + 1) * 10,
  count: Math.floor(Math.random() * 100) + 10,
}));

// Mock data for access request trend
const accessTrendData = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  requests: Math.floor(Math.random() * 50) + 20,
  approvals: Math.floor(Math.random() * 40) + 15,
}));

const AccessControlPage = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [accessRequests, setAccessRequests] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('requestTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Set active tab based on route when component mounts or route changes
  useEffect(() => {
    if (location.pathname.includes('/access/requests')) {
      setActiveTab('requests');
    } else if (location.pathname.includes('/access/policies')) {
      setActiveTab('policies');
    } else if (location.pathname.includes('/access/trust-scores')) {
      setActiveTab('trust-scores');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  // Handle tab changes with URL navigation
  const handleTabChange = (tab) => {
    switch(tab) {
      case 'requests':
        navigate('/access/requests');
        break;
      case 'policies':
        navigate('/access/policies');
        break;
      case 'trust-scores':
        navigate('/access/trust-scores');
        break;
      default:
        navigate('/access');
        break;
    }
  };
  
  // Load access requests on initial render
  useEffect(() => {
    const fetchAccessRequests = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // Simulate API delay
        setTimeout(() => {
          const mockRequests = generateMockAccessRequests(50);
          setAccessRequests(mockRequests);
          setTotalPages(5); // Mock 5 pages of results
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching access requests:', error);
        setLoading(false);
      }
    };
    
    const fetchPolicies = async () => {
      try {
        // In a real app, this would be an API call
        // Simulate API delay
        setTimeout(() => {
          const mockPolicies = generateMockPolicies(20);
          setPolicies(mockPolicies);
        }, 1200);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };
    
    fetchAccessRequests();
    fetchPolicies();
  }, [currentPage, sortField, sortDirection, statusFilter]);
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    const mockRequests = generateMockAccessRequests(50);
    const mockPolicies = generateMockPolicies(20);
    
    setTimeout(() => {
      setAccessRequests(mockRequests);
      setPolicies(mockPolicies);
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format address/ID
  const formatId = (id) => {
    if (!id) return '';
    if (id.startsWith('0x')) {
      return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
    }
    return id;
  };
  
  // Get filtered access requests
  const filteredRequests = accessRequests
    .filter(request => {
      if (statusFilter === 'all') return true;
      return request.status.toLowerCase() === statusFilter.toLowerCase();
    })
    .filter(request => {
      if (!searchTerm) return true;
      return (
        request.sourceWalletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.targetWalletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.sourceWallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.targetWallet.toLowerCase().includes(searchTerm.toLowerCase())
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
  const accessStats = {
    total: accessRequests.length,
    approved: accessRequests.filter(r => r.status === 'Approved').length,
    pending: accessRequests.filter(r => r.status === 'Pending').length,
    rejected: accessRequests.filter(r => r.status === 'Rejected').length,
    expired: accessRequests.filter(r => r.status === 'Expired').length,
    avgTrustScore: accessRequests.length > 0 
      ? Math.floor(accessRequests.reduce((sum, r) => sum + r.trustScore, 0) / accessRequests.length)
      : 0,
    policyCount: policies.length,
    activePolices: policies.filter(p => p.active).length
  };
  
  // Generate mock access requests as wallet-to-wallet based
  const generateMockAccessRequests = (count = 50) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      sourceWallet: `0x${Math.random().toString(16).substring(2, 42)}`,
      sourceWalletName: `Wallet-${Math.floor(Math.random() * 100) + 1}`,
      targetWallet: `0x${Math.random().toString(16).substring(2, 42)}`,
      targetWalletName: `Wallet-${Math.floor(Math.random() * 100) + 1}`,
      status: i < 35 ? 'Approved' : i < 45 ? 'Pending' : i < 47 ? 'Rejected' : 'Expired',
      trustScore: Math.floor(Math.random() * 30) + 70,
      requestTime: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)),
      responseTime: i < 35 ? new Date(Date.now() - (Math.random() * 29 * 24 * 60 * 60 * 1000)) : null,
      expirationTime: i < 35 ? new Date(Date.now() + (Math.random() * 60 * 24 * 60 * 60 * 1000)) : null,
      accessType: ['Read', 'Write', 'Execute', 'Full'][Math.floor(Math.random() * 4)],
      policyApplied: `Policy-${Math.floor(Math.random() * 10) + 1}`,
    }));
  };
  
  // Generate mock policies data
  const generateMockPolicies = (count = 20) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      name: `Policy-${i + 1}`,
      description: `Description for Policy-${i + 1}`,
      resources: Math.floor(Math.random() * 10) + 1,
      users: Math.floor(Math.random() * 100) + 10,
      requestsProcessed: Math.floor(Math.random() * 1000) + 100,
      approvalRate: Math.floor(Math.random() * 30) + 70,
      createdAt: new Date(Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000)),
      updatedAt: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)),
      active: Math.random() > 0.2,
      priority: Math.floor(Math.random() * 10) + 1,
      conditions: Math.floor(Math.random() * 5) + 1,
    }));
  };
  
  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title="Access Control"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Shield className="mr-2" size={24} />
            Access Control
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor wallet-to-wallet access control activities and trust relationships on the blockchain
          </p>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex flex-wrap -mb-px">
              <button
                onClick={() => handleTabChange('overview')}
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleTabChange('requests')}
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Access Requests
              </button>
              <button
                onClick={() => handleTabChange('policies')}
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'policies'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Policies
              </button>
              <button
                onClick={() => handleTabChange('trust-scores')}
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'trust-scores'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Trust Scores
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
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                    <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Requests</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{accessStats.total}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(accessStats.approved / accessStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {accessStats.approved} Approved
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                    <Lock size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Policies</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{accessStats.activePolices}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(accessStats.activePolices / accessStats.policyCount) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {accessStats.policyCount} Total
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
                    <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{accessStats.pending}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${(accessStats.pending / accessStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {((accessStats.pending / accessStats.total) * 100).toFixed(1)}% of Total
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
                    <BarChart2 size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Trust Score</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{accessStats.avgTrustScore}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${accessStats.avgTrustScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {accessStats.avgTrustScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Access Status Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Request Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accessStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {accessStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} requests`, name]}
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

              {/* Access Trend Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Request Trend (30 Days)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={accessTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                        tickLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                        axisLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                      />
                      <YAxis 
                        tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                        tickLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                        axisLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [value, name === 'requests' ? 'Requests' : 'Approvals']}
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                          color: darkMode ? 'white' : 'black',
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="requests" 
                        name="Requests"
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.2} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="approvals" 
                        name="Approvals"
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Access Requests */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Access Requests</h3>
                <button 
                  onClick={() => handleTabChange('requests')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  View All <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source Wallet</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Wallet</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trust Score</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requested</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {accessRequests.slice(0, 5).map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                              <Users size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{request.sourceWalletName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{formatId(request.sourceWallet)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                              <User size={16} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{request.targetWalletName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{formatId(request.targetWallet)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            request.status === 'Pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            request.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {request.status === 'Approved' && <CheckCircle size={12} className="mr-1" />}
                            {request.status === 'Pending' && <Clock size={12} className="mr-1" />}
                            {request.status === 'Rejected' && <XCircle size={12} className="mr-1" />}
                            {request.status === 'Expired' && <AlertTriangle size={12} className="mr-1" />}
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2`}>
                              <div 
                                className={`h-full rounded-full ${
                                  request.trustScore >= 80 ? 'bg-green-500' :
                                  request.trustScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${request.trustScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {request.trustScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(request.requestTime)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Access Resources */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Control Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Wallet Access Requests</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">View the history of access requests between wallets on the blockchain network.</p>
                  <button 
                    onClick={() => handleTabChange('requests')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    View Requests <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Access Policies</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Explore the policies that govern wallet-to-wallet access on the blockchain.</p>
                  <button 
                    onClick={() => handleTabChange('policies')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    View Policies <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Trust Score Information</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Learn about how trust scores are calculated and used for wallet access decisions.</p>
                  <button 
                    onClick={() => handleTabChange('trust-scores')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    View Trust Scores <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Access Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search requests..."
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
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 pl-3 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={sortField}
                      onChange={(e) => setSortField(e.target.value)}
                    >
                      <option value="requestTime">Request Time</option>
                      <option value="resource">Resource</option>
                      <option value="requester">Requester</option>
                      <option value="trustScore">Trust Score</option>
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
                        setSortField('requestTime');
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
            
            {/* Access Requests Table - Modified for wallet-to-wallet */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source Wallet</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Wallet</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trust Score</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Access Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requested</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Policy</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading access requests...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
                          No access requests found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests
                        .slice((currentPage - 1) * 10, currentPage * 10)
                        .map((request) => (
                          <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                  <Users size={16} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{request.sourceWalletName}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{formatId(request.sourceWallet)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                                  <User size={16} className="text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{request.targetWalletName}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{formatId(request.targetWallet)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                request.status === 'Pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                request.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                              }`}>
                                {request.status === 'Approved' && <CheckCircle size={12} className="mr-1" />}
                                {request.status === 'Pending' && <Clock size={12} className="mr-1" />}
                                {request.status === 'Rejected' && <XCircle size={12} className="mr-1" />}
                                {request.status === 'Expired' && <AlertTriangle size={12} className="mr-1" />}
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2`}>
                                  <div 
                                    className={`h-full rounded-full ${
                                      request.trustScore >= 80 ? 'bg-green-500' :
                                      request.trustScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${request.trustScore}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {request.trustScore}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {request.accessType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(request.requestTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {request.policyApplied}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {!loading && filteredRequests.length > 0 && (
                <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * 10, filteredRequests.length)}</span> of{' '}
                        <span className="font-medium">{filteredRequests.length}</span> results
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

        {/* Policies Tab - Remove edit/create functionality */}
        {activeTab === 'policies' && (
          <div>
            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search policies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
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
            </div>
            
            {/* Policies Table - Modified to remove actions */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Policy</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resources</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Users</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Approval Rate</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading policies...</span>
                          </div>
                        </td>
                      </tr>
                    ) : policies.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
                          No policies found.
                        </td>
                      </tr>
                    ) : (
                      policies.map((policy) => (
                        <tr key={policy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                                <FileText size={16} className="text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{policy.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{policy.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              policy.active 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {policy.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {policy.resources}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {policy.users}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2">
                                <div 
                                  className={`h-full rounded-full ${
                                    policy.approvalRate >= 80 ? 'bg-green-500' :
                                    policy.approvalRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${policy.approvalRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {policy.approvalRate}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-md">
                              P{policy.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(policy.updatedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Policy Types */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Policy Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Resource-Based Policies</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Define access rules for specific resources such as APIs, databases, or services.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside mb-3">
                    <li>Fine-grained resource control</li>
                    <li>Resource-specific conditions</li>
                    <li>Explicit deny/allow rules</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Identity-Based Policies</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Define access rules based on user identity, roles, or groups.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside mb-3">
                    <li>Role-based access control</li>
                    <li>Group permissions</li>
                    <li>Time-based restrictions</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Trust Score Policies</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Define access rules based on dynamic trust scores and risk assessments.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside mb-3">
                    <li>Behavioral analysis</li>
                    <li>Context-aware access</li>
                    <li>Adaptive permissions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Scores Tab */}
        {activeTab === 'trust-scores' && (
          <div>
            {/* Trust Score Overview */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trust Score Overview</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Trust scores are dynamic measurements used to determine access permissions based on a variety of factors.
                The Zero-Trust Access Control system continuously evaluates these factors to adjust trust scores in real-time.
              </p>
              <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full mr-4">
                  <Shield size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">Zero-Trust Principle</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Our system follows the "never trust, always verify" principle. Every access request is evaluated
                    based on multiple security factors before granting access, regardless of the user's position or previous access history.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Trust Score Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trust Score Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trustScoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                    <XAxis 
                      dataKey="score" 
                      tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                      tickLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                      axisLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                      label={{ value: 'Trust Score', position: 'insideBottom', offset: -5, fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                    />
                    <YAxis 
                      tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                      tickLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                      axisLine={{ stroke: darkMode ? '#4B5563' : '#E5E7EB' }}
                      label={{ value: 'Number of Users', angle: -90, position: 'insideLeft', fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} users`, 'Count']}
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : 'white',
                        borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                        color: darkMode ? 'white' : 'black',
                      }}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.1)', stroke: 'none' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                      name="Users"
                      isAnimationActive={false}
                    >
                      {trustScoreData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill="#3B82F6" 
                          fillOpacity={1}
                          strokeWidth={0}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-red-50 dark:bg-red-900 p-3 rounded-lg">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Low Trust (0-60)</p>
                  <p className="text-xs text-red-600 dark:text-red-400">Limited access with strict verification</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Medium Trust (61-80)</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">Standard access with regular verification</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">High Trust (81-100)</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Enhanced access with periodic verification</p>
                </div>
              </div>
            </div>
            
            {/* Trust Score Factors */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trust Score Factors</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Identity Factors (30%)</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Multi-factor Authentication</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Whether the user has completed MFA during the current session
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Account Age & History</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Age of the account and historical behavior patterns
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Credential Strength</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Strength of passwords, keys, and other authentication factors
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Contextual Factors (40%)</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Device Security</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Security status of the device being used (patches, OS, antivirus)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Network Location</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Network type, geolocation, and connection security
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Access Time & Frequency</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Time of access and frequency of resource usage
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Behavioral Factors (30%)</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Typical Usage Patterns</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Consistency with the user's normal behavior patterns
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Resource Access History</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Previous interactions with the requested resource
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Anomaly Detection</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Detection of unusual behavior or potential security threats
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Trust Score Adjustments</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Trust scores are continuously adjusted based on:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Real-time security telemetry</li>
                    <li>• Global threat intelligence</li>
                    <li>• Previous access history</li>
                    <li>• Resource sensitivity level</li>
                    <li>• Organizational security policies</li>
                  </ul>
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                      <strong>Note:</strong> Trust scores are calculated per-session and do not persist indefinitely.
                      Each new session starts with a baseline score that is adjusted based on current factors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust Score FAQ */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">How often are trust scores updated?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Trust scores are updated in real-time based on continuous evaluation of all security factors.
                    Major events like authentication failures, device changes, or unusual behavior patterns
                    trigger immediate recalculation of the trust score.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">How can I improve my trust score?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You can improve your trust score by enabling multi-factor authentication, 
                    keeping your devices updated and secure, using strong credentials, 
                    maintaining consistent usage patterns, and avoiding suspicious activities.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Can a high trust score guarantee access to all resources?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No. Even with a high trust score, access is still governed by specific policies
                    set for each resource. A high trust score indicates greater trustworthiness,
                    but access is ultimately determined by a combination of trust scores, policies,
                    and other contextual factors.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">What happens if my trust score suddenly drops?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If your trust score drops significantly, you may lose access to certain resources
                    until the underlying issues are resolved. This could be triggered by suspicious
                    activities, using an unrecognized device, connecting from an unusual location,
                    or other security-related concerns. Contact your administrator if you believe
                    your trust score has been incorrectly reduced.
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

export default AccessControlPage; 