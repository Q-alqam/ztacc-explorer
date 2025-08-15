import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { ModalProvider, useModal } from './context/ModalContext';
import WelcomeModal from './components/WelcomeModal';

// Import pages
import Dashboard from './pages/Dashboard';
import WalletDashboard from './pages/WalletDashboard';
import WalletPage from './pages/WalletPage';
import BlocksPage from './pages/BlocksPage';
import BlockDetailsPage from './pages/BlockDetailsPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailsPage from './pages/TransactionDetailsPage';
import NotFound from './pages/NotFound';
import Placeholder from './pages/Placeholder';
import ConnectWallet from './pages/ConnectWallet';
import ValidatorsPage from './pages/ValidatorsPage';
import AccessControlPage from './pages/AccessControlPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SmartContractsPage from './pages/SmartContractsPage';
import SmartContractDetailsPage from './pages/SmartContractDetailsPage';

// AppContent component to handle location-based effects
const AppContent = ({ commonProps }) => {
  const location = useLocation();
  const { openWelcomeModal } = useModal();
  
  // Show welcome modal on dashboard navigation
  useEffect(() => {
    const isMainPage = location.pathname === '/' || location.pathname === '/dashboard';
    
    if (isMainPage) {
      // Check if we've visited the dashboard in this session
      const hasVisitedDashboard = sessionStorage.getItem('visited_dashboard');
      // Check if the modal was just closed
      const modalJustClosed = sessionStorage.getItem('modal_just_closed');
      
      if (!hasVisitedDashboard && !modalJustClosed) {
        // First visit to dashboard in this session, show the modal
        const timer = setTimeout(() => {
          openWelcomeModal();
        }, 500);
        
        // Mark that we've visited the dashboard in this session
        sessionStorage.setItem('visited_dashboard', 'true');
        
        return () => clearTimeout(timer);
      }
    } else {
      // When navigating away from dashboard, reset the flag so modal shows on next dashboard visit
      sessionStorage.removeItem('visited_dashboard');
    }
  }, [location.pathname, openWelcomeModal]);
  
  return (
    <>
      {/* Global WelcomeModal */}
      <WelcomeModal darkMode={commonProps.darkMode} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard {...commonProps} />} />
        <Route path="/wallets" element={<WalletDashboard {...commonProps} />} />
        <Route path="/wallet/:address" element={<WalletPage {...commonProps} />} />
        <Route path="/connect" element={<ConnectWallet {...commonProps} />} />
        {/* Block routes */}
        <Route path="/blocks" element={<BlocksPage {...commonProps} />} />
        <Route path="/block/:blockId" element={<BlockDetailsPage {...commonProps} />} />
        <Route path="/validators" element={<ValidatorsPage {...commonProps} />} />
        {/* Transaction routes */}
        <Route path="/transactions" element={<TransactionsPage {...commonProps} />} />
        <Route path="/transaction/:hash" element={<TransactionDetailsPage {...commonProps} />} />
        
        {/* Placeholder routes for navigation */}
        <Route path="/analytics" element={<AnalyticsPage {...commonProps} />} />
        
        {/* Access Control section */}
        <Route path="/access" element={<AccessControlPage {...commonProps} />} />
        <Route path="/access/requests" element={<AccessControlPage {...commonProps} />} />
        <Route path="/access/policies" element={<AccessControlPage {...commonProps} />} />
        <Route path="/access/trust-scores" element={<AccessControlPage {...commonProps} />} />
        
        {/* Smart Contracts section */}
        <Route path="/contracts" element={<SmartContractsPage {...commonProps} />} />
        <Route path="/contracts/verified" element={<SmartContractsPage {...commonProps} />} />
        <Route path="/contracts/interactions" element={<SmartContractsPage {...commonProps} />} />
        <Route path="/contracts/deploy" element={<SmartContractsPage {...commonProps} />} />
        <Route path="/contract/:contractId" element={<SmartContractDetailsPage {...commonProps} />} />
        
        {/* Support section */}
        <Route path="/docs" element={<Placeholder {...commonProps} />} />
        <Route path="/docs/api" element={<Placeholder {...commonProps} />} />
        <Route path="/settings" element={<Placeholder {...commonProps} />} />
        <Route path="/support" element={<Placeholder {...commonProps} />} />
        
        {/* 404 catch-all */}
        <Route path="*" element={<NotFound darkMode={commonProps.darkMode} toggleDarkMode={commonProps.toggleDarkMode} />} />
      </Routes>
    </>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check user's preference for dark mode
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Common props for all components
  const commonProps = {
    darkMode,
    toggleDarkMode,
    sidebarOpen,
    toggleSidebar,
    closeSidebar
  };

  return (
    <WalletProvider>
      <ModalProvider>
        <Router>
          <AppContent commonProps={commonProps} />
        </Router>
      </ModalProvider>
    </WalletProvider>
  );
}

export default App;