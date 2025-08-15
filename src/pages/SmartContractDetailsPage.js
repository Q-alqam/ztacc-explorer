import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  Code, 
  Clock, 
  List,
  Copy,
  Check,
  FileText,
  HardDrive,
  Activity
} from 'react-feather';

const SmartContractDetailsPage = ({ darkMode, toggleDarkMode, sidebarOpen, toggleSidebar, closeSidebar }) => {
  const { contractId } = useParams();
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('code');
  const [copiedText, setCopiedText] = useState(null);
  const [showCodeOptions, setShowCodeOptions] = useState(false);

  useEffect(() => {
    // Fetch contract data
    const fetchContractData = async () => {
      // Simulate API call
      setTimeout(() => {
        setContract({
          id: contractId,
          name: "ZTACCAccessToken",
          status: "Verified",
          type: "Access Control",
          creator: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          transactions: 3521,
          balance: 2480.5,
          byteCode: "0x608060405234801561001057600080fd5b50600436106100415760003560e01c8063",
          abi: [
            {
              name: "approve",
              type: "function",
              inputs: [
                { name: "spender", type: "address" },
                { name: "amount", type: "uint256" }
              ],
              outputs: [{ type: "bool" }]
            },
            {
              name: "transfer",
              type: "function",
              inputs: [
                { name: "recipient", type: "address" },
                { name: "amount", type: "uint256" }
              ],
              outputs: [{ type: "bool" }]
            }
          ],
          sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ZTACCAccessToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    constructor() ERC20("ZTACC Access Token", "ZAT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
    
    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Must have minter role");
        _mint(to, amount);
    }
    
    function burn(address from, uint256 amount) public {
        require(hasRole(BURNER_ROLE, msg.sender), "Must have burner role");
        _burn(from, amount);
    }
}`
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchContractData();
  }, [contractId]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
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
      case 'Access Control':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const tabs = [
    { id: 'code', label: 'Code', icon: <Code size={18} /> },
    { id: 'transactions', label: 'Transactions', icon: <Activity size={18} /> },
    { id: 'storage', label: 'Storage', icon: <HardDrive size={18} /> },
  ];

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title={contract ? `Contract: ${contract.name}` : 'Contract Details'}
    >
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ) : contract ? (
          <>
            {/* Contract Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Code size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {contract.name}
                      </h1>
                      <div className="flex flex-wrap items-center mt-1 gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(contract.status)}`}>
                          {contract.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeClass(contract.type)}`}>
                          {contract.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 sm:ml-auto">
                    <div className="flex items-center">
                      <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Interact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contract Address & Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contract Address</h3>
                      <button 
                        onClick={() => copyToClipboard(contract.id, 'address')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {copiedText === 'address' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white font-mono break-all">
                      {contract.id}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Creator</h3>
                    </div>
                    <Link to={`/wallet/${contract.creator}`} className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                      {contract.creator}
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Balance</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {contract.balance.toFixed(2)} ZTACC
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Transactions</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {contract.transactions.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h3>
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-1" />
                      <p className="text-sm text-gray-900 dark:text-white">
                        {contract.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                {/* Desktop Tabs */}
                <div className="hidden sm:flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-6 inline-flex items-center text-sm font-medium border-b-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Mobile Tab Dropdown */}
                <div className="sm:hidden">
                  <div className="relative">
                    <button
                      onClick={() => setShowCodeOptions(!showCodeOptions)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      <div className="flex items-center">
                        {tabs.find(t => t.id === activeTab)?.icon}
                        <span className="ml-2">{tabs.find(t => t.id === activeTab)?.label}</span>
                      </div>
                      <List size={16} />
                    </button>
                    
                    {showCodeOptions && (
                      <div className="absolute z-10 w-full bg-white dark:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600 rounded-b-md">
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setShowCodeOptions(false);
                            }}
                            className={`w-full text-left px-4 py-2 flex items-center text-sm ${
                              activeTab === tab.id
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'code' && (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Source Code</h3>
                        <button 
                          onClick={() => copyToClipboard(contract.sourceCode, 'source')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          {copiedText === 'source' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 overflow-x-auto">
                        <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono">
                          {contract.sourceCode}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">ABI</h3>
                        <button 
                          onClick={() => copyToClipboard(JSON.stringify(contract.abi, null, 2), 'abi')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          {copiedText === 'abi' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 overflow-x-auto">
                        <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono">
                          {JSON.stringify(contract.abi, null, 2)}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Bytecode</h3>
                        <button 
                          onClick={() => copyToClipboard(contract.byteCode, 'bytecode')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          {copiedText === 'bytecode' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 overflow-x-auto">
                        <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono truncate">
                          {contract.byteCode}...
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'transactions' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
                    
                    {/* Desktop Transactions */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tx Hash</th>
                            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">From</th>
                            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Age</th>
                            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {[...Array(5)].map((_, i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 font-mono">
                                0x{Math.random().toString(16).substr(2, 8)}...
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {i % 2 === 0 ? 'transfer' : 'approve'}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 font-mono">
                                0x{Math.random().toString(16).substr(2, 6)}...
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {i + 1} {i === 0 ? 'min' : 'hrs'} ago
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {(Math.random() * 100).toFixed(2)} ZTACC
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile Transactions */}
                    <div className="sm:hidden space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                              0x{Math.random().toString(16).substr(2, 8)}...
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {i + 1} {i === 0 ? 'min' : 'hrs'} ago
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Method:</span>
                              <div className="text-gray-900 dark:text-white">
                                {i % 2 === 0 ? 'transfer' : 'approve'}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Value:</span>
                              <div className="text-gray-900 dark:text-white">
                                {(Math.random() * 100).toFixed(2)} ZTACC
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500 dark:text-gray-400">From:</span>
                              <div className="text-blue-600 dark:text-blue-400 font-mono">
                                0x{Math.random().toString(16).substr(2, 42)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'storage' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Contract Storage</h3>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-6 text-center">
                      <FileText size={36} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-gray-900 dark:text-white font-medium mb-2">Storage Viewer</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                        Access to contract storage data is currently being developed.
                        Check back soon for detailed contract state information.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Contract Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The contract you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/contracts"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Contracts
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SmartContractDetailsPage; 