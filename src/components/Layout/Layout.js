import React, { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ 
  children, 
  darkMode, 
  toggleDarkMode, 
  sidebarOpen, 
  toggleSidebar, 
  onCloseSidebar,
  title = 'ZTACC Explorer' // Default title
}) => {
  // Update document title when the title prop changes
  useEffect(() => {
    document.title = `${title} | ZTACC Explorer`;
  }, [title]);

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar 
        darkMode={darkMode} 
        isOpen={sidebarOpen} 
        onClose={onCloseSidebar} 
      />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          toggleSidebar={toggleSidebar} 
          title={title}
        />
        
        <main className="flex-grow overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 