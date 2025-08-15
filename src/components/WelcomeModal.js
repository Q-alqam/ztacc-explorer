import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'react-feather';
import { useModal } from '../context/ModalContext';

const WelcomeModal = ({ darkMode }) => {
  const { welcomeModalOpen, closeWelcomeModal } = useModal();
  
  const handleCloseModal = () => {
    closeWelcomeModal();
  };
  
  // If modal is not open, don't render anything
  if (!welcomeModalOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm backdrop-brightness-75">
      <div className={`relative w-full max-w-md rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 md:p-8 overflow-hidden`}>
        {/* Decorative element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        {/* Close button */}
        <button 
          onClick={handleCloseModal}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
        
        {/* Modal content */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <AlertCircle size={28} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome to ZTACC Explorer
          </h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            You're viewing a demo of the Zero-Trust Access Control Chain Explorer
          </p>
        </div>
        
        <div className={`mb-6 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p className="mb-3">
            This is a demonstration of how the ZTACC Explorer will look and function. The explorer is currently under development.
          </p>
          <p>
            Explore blocks, transactions, smart contracts, and access control features of the ZTACC network through this interactive interface.
          </p>
        </div>
        
        <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> This is a demo version. Some features may be limited or use simulated data.
          </p>
        </div>
        
        <button
          onClick={handleCloseModal}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
        >
          Explore the Demo
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal; 