import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, BarChart2, Database, Shield, ArrowDownUp, 
  Users, Server, FileText, Settings, HelpCircle, 
  X, ChevronRight, Terminal, Code, Book
} from 'lucide-react';

const Sidebar = ({ darkMode = false, isOpen = true, onClose }) => {
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState(null);

  // Toggle a section to expand/collapse
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Check if a path is active
  const isActive = (path) => {
    // For exact match
    if (location.pathname === path) return true;
    
    // For parent paths when in subpaths (e.g. /access is active when in /access/requests)
    if (path !== '/' && location.pathname.startsWith(path + '/')) return true;
    
    // For dynamic routes - handle common patterns
    if (path === '/blocks' && location.pathname.match(/^\/block\/\d+$/)) return true;
    if (path === '/transactions' && location.pathname.match(/^\/transaction\/0x[a-fA-F0-9]+$/)) return true;
    if (path === '/wallets' && location.pathname.match(/^\/wallet\/0x[a-fA-F0-9]+$/)) return true;
    
    return false;
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home size={20} /> 
    },
    { 
      name: 'Blocks', 
      path: '/blocks', 
      icon: <Database size={20} /> 
    },
    { 
      name: 'Transactions', 
      path: '/transactions', 
      icon: <ArrowDownUp size={20} /> 
    },
    { 
      name: 'Wallets', 
      path: '/wallets', 
      icon: <Users size={20} /> 
    },
    { 
      name: 'Validators', 
      path: '/validators', 
      icon: <Server size={20} /> 
    },
    { 
      name: 'Access Control', 
      path: '/access', 
      icon: <Shield size={20} />,
      subItems: [
        { name: 'Access Requests', path: '/access/requests' },
        { name: 'Policies', path: '/access/policies' },
        { name: 'Trust Scores', path: '/access/trust-scores' }
      ]
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: <BarChart2 size={20} /> 
    },
    { 
      name: 'Smart Contracts', 
      path: '/contracts', 
      icon: <Code size={20} />,
      subItems: [
        { name: 'Verified Contracts', path: '/contracts/verified' },
        { name: 'Contract Interactions', path: '/contracts/interactions' },
        { name: 'Deploy Contract', path: '/contracts/deploy' }
      ]
    }
  ];

  const secondaryNavItems = [
    { 
      name: 'API Documentation', 
      path: '/docs/api', 
      icon: <Terminal size={20} /> 
    },
    { 
      name: 'ZTACC Docs', 
      path: '/docs', 
      icon: <Book size={20} /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings size={20} /> 
    },
    { 
      name: 'Help & Support', 
      path: '/support', 
      icon: <HelpCircle size={20} /> 
    }
  ];

  // Sidebar classes based on state
  const sidebarClasses = `fixed inset-y-0 left-0 z-40 w-64 transition-transform transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:translate-x-0 lg:static lg:inset-auto ${
    darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
  } shadow-lg lg:shadow-none overflow-y-auto flex flex-col`;

  return (
    <>
      <div className={sidebarClasses}>
        {/* Mobile close button - only shown on small screens */}
        <div className="lg:hidden flex justify-end p-4">
          <button 
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Logo */}
        <div className="p-4 flex items-center">
          <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">ZTACC Explorer</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Zero-Trust Access Control Chain</p>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="mt-4 flex-1">
          <div className="px-3 mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Explorer
            </h3>
            <ul className="mt-2 space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleSection(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-md ${
                          expandedSection === item.name
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3 text-gray-500 dark:text-gray-400">
                            {item.icon}
                          </span>
                          <span>{item.name}</span>
                        </div>
                        <ChevronRight
                          size={16}
                          className={`transform transition-transform ${
                            expandedSection === item.name ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {expandedSection === item.name && (
                        <ul className="mt-1 pl-12 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.path}>
                              <Link
                                to={subItem.path}
                                className={`block py-2 px-3 text-sm rounded-md ${
                                  isActive(subItem.path)
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-2 text-sm rounded-md ${
                        isActive(item.path)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-3 text-gray-500 dark:text-gray-400">
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-2 space-y-1">
              {secondaryNavItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm rounded-md ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3 text-gray-500 dark:text-gray-400">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        {/* Network Status */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Network Status</p>
              <p className="text-xs text-green-500">Healthy</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile view - only shown when sidebar is open on small screens */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar; 