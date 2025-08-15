import React, { createContext, useState, useContext } from 'react';

// Create Modal Context
const ModalContext = createContext();

// Custom hook to use the modal context
export const useModal = () => useContext(ModalContext);

// Modal Provider component
export const ModalProvider = ({ children }) => {
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  // Function to open welcome modal
  const openWelcomeModal = () => {
    // Only open if it's not already open
    setWelcomeModalOpen(true);
  };

  // Function to close welcome modal
  const closeWelcomeModal = () => {
    // Ensure we're actually closing it
    setWelcomeModalOpen(false);
    
    // Add a flag in session storage to prevent immediate reopening
    sessionStorage.setItem('modal_just_closed', 'true');
    
    // Clear the flag after a short delay
    setTimeout(() => {
      sessionStorage.removeItem('modal_just_closed');
    }, 1000);
  };

  // Reset the "seen" status
  const resetWelcomeModal = () => {
    localStorage.removeItem('ztacc_welcome_seen');
  };

  return (
    <ModalContext.Provider 
      value={{ 
        welcomeModalOpen, 
        openWelcomeModal, 
        closeWelcomeModal,
        resetWelcomeModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext; 