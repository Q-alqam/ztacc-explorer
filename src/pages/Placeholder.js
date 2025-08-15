import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const Placeholder = ({ darkMode, toggleDarkMode, sidebarOpen, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  // Format the page name from the path
  const getPageName = () => {
    const segment = path.split('/')[1];
    if (!segment) return 'Home';
    
    // Handle special cases
    if (segment === 'access' && path.includes('/access/')) {
      const subSegment = path.split('/')[2];
      return `Access Control: ${capitalizeWords(subSegment.replace('-', ' '))}`;
    }
    
    if (segment === 'contracts' && path.includes('/contracts/')) {
      const subSegment = path.split('/')[2];
      return `Smart Contracts: ${capitalizeWords(subSegment.replace('-', ' '))}`;
    }
    
    if (segment === 'docs' && path.includes('/docs/api')) {
      return 'API Documentation';
    }
    
    // Handle dynamic routes
    if (segment === 'block' && path.includes('/block/')) {
      const blockNumber = path.split('/')[2];
      return `Block #${blockNumber}`;
    }
    
    if (segment === 'transaction' && path.includes('/transaction/')) {
      const txHash = path.split('/')[2];
      const shortHash = txHash.substring(0, 8) + '...' + txHash.substring(txHash.length - 6);
      return `Transaction: ${shortHash}`;
    }
    
    return capitalizeWords(segment);
  };
  
  // Helper to capitalize each word
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };
  
  const pageName = getPageName();

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title={pageName}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {pageName} Page
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This page is currently under development. Check back soon for updates!
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Placeholder; 