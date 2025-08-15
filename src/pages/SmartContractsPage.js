import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  Code, 
  FileText, 
  List, 
  Search, 
  ChevronDown, 
  Filter
} from 'react-feather';

const SmartContractsPage = ({ darkMode, toggleDarkMode, sidebarOpen, toggleSidebar, closeSidebar }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Determine active tab based on URL
    const path = location.pathname;
    if (path.includes('/contracts/verified')) {
      setActiveTab('verified');
    } else if (path.includes('/contracts/interactions')) {
      setActiveTab('interactions');
    } else if (path.includes('/contracts/deploy')) {
      setActiveTab('deploy');
    } else {
      setActiveTab('all');
    }

    // Fetch mock contracts data
    const fetchContracts = async () => {
      // Simulating API call with setTimeout
      setTimeout(() => {
        setContracts(generateMockContracts(50));
        setIsLoading(false);
      }, 800);
    };

    fetchContracts();
  }, [location.pathname]);

  // Generate mock contract data
  const generateMockContracts = (count) => {
    const statuses = ['Verified', 'Unverified'];
    const types = ['ERC20', 'ERC721', 'Governance', 'DeFi', 'Access Control'];
    const names = ['ZeroTrust', 'AccessToken', 'ZTACC', 'Governance', 'SwapPool', 'AccessRegistry'];
    
    return Array.from({ length: count }, (_, i) => {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 90));
      
      return {
        id: `0x${Math.random().toString(16).substr(2, 40)}`,
        name: `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 1000)}`,
        creator: `0x${Math.random().toString(16).substr(2, 40)}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        type: types[Math.floor(Math.random() * types.length)],
        transactions: Math.floor(Math.random() * 10000),
        createdAt,
        balance: Math.random() * 10000,
      };
    });
  };

  const tabs = [
    { id: 'all', label: 'All Contracts', path: '/contracts' },
    { id: 'verified', label: 'Verified', path: '/contracts/verified' },
    { id: 'interactions', label: 'Interactions', path: '/contracts/interactions' },
    { id: 'deploy', label: 'Deploy Contract', path: '/contracts/deploy' },
  ];

  const handleTabChange = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tab.path);
      setActiveTab(tabId);
      setIsTabMenuOpen(false);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Contract status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Unverified':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Contract type badge styling
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'ERC20':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ERC721':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Governance':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'DeFi':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'Access Control':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Filter contracts based on active tab and filters
  const filteredContracts = contracts.filter(contract => {
    if (activeTab === 'verified' && contract.status !== 'Verified') return false;
    if (statusFilter && contract.status !== statusFilter) return false;
    return true;
  });

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title="Smart Contracts"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Smart Contracts
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Browse, search, and interact with contracts on the ZTACC network
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                  <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Desktop */}
        <div className="hidden md:block mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tabs - Mobile */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <button
              onClick={() => setIsTabMenuOpen(!isTabMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <span>{tabs.find(tab => tab.id === activeTab)?.label}</span>
              <ChevronDown size={20} className={`transition-transform ${isTabMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isTabMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search contracts..."
                className={`pl-10 pr-4 py-2 w-full border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Filter size={16} className="mr-2" />
              <span>Filters</span>
              <ChevronDown size={16} className={`ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">All Statuses</option>
                    <option value="Verified">Verified</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Deploy Contract Tab */}
        {activeTab === 'deploy' ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                    <Code size={28} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Deploy a New Smart Contract
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Upload and deploy your contract to the ZTACC network. This feature provides a
                    secure environment for contracts with built-in access control mechanisms.
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                    <div className="text-left mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contract Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="Enter contract name"
                        className={`w-full px-3 py-2 rounded-md border ${
                          darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    
                    <div className="text-left mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contract Type
                      </label>
                      <select
                        className={`w-full px-3 py-2 rounded-md border ${
                          darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select contract type</option>
                        <option value="ERC20">ERC20 Token</option>
                        <option value="ERC721">ERC721 NFT</option>
                        <option value="Access">Access Control</option>
                        <option value="Custom">Custom Contract</option>
                      </select>
                    </div>
                    
                    <div className="text-left mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Upload Contract Code
                      </label>
                      <div className={`border-2 border-dashed ${
                        darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                      } rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}>
                        <input type="file" className="hidden" />
                        <FileText size={24} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Click to upload or drag and drop your contract file (.sol)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Deploy Contract
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Contracts Listing */}
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Contract
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Creator
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Txs
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Created
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredContracts.map((contract) => (
                            <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => navigate(`/contract/${contract.id}`)}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900">
                                    <Code size={16} className="text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {contract.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                      {formatAddress(contract.id)}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                                  {formatAddress(contract.creator)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(contract.status)}`}>
                                  {contract.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(contract.type)}`}>
                                  {contract.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {contract.transactions.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {contract.createdAt.toLocaleDateString()}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {filteredContracts.map((contract) => (
                    <div 
                      key={contract.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                      onClick={() => navigate(`/contract/${contract.id}`)}
                    >
                      <div className="p-4">
                        <div className="flex items-center mb-3">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900">
                            <Code size={18} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {contract.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              {formatAddress(contract.id)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Creator:</span>
                            <div className="text-blue-600 dark:text-blue-400 font-mono">
                              {formatAddress(contract.creator)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Transactions:</span>
                            <div className="text-gray-900 dark:text-white">
                              {contract.transactions.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(contract.status)}`}>
                              {contract.status}
                            </span>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(contract.type)}`}>
                              {contract.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {contract.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SmartContractsPage; 