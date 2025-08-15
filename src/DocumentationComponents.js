import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

// Simple tooltip that appears on hover
export const InfoTooltip = ({ content, size = 'sm' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative inline-block ml-1">
      <Info 
        size={size === 'sm' ? 14 : 18} 
        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      />
      {showTooltip && (
        <div className="absolute z-10 w-64 bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transform -translate-x-1/2 left-1/2 mt-1">
          {content}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white dark:border-b-gray-800"></div>
        </div>
      )}
    </div>
  );
};

// Modal component for more detailed documentation
export const DocumentationModal = ({ title, content, onClose, isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="p-6 flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
          {content}
        </div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Help button that opens documentation
export const HelpButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center px-3 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
  >
    <Info size={18} className="mr-2" /> Help & Documentation
  </button>
);

// Documentation content for blockchain concepts
export const BlockchainDocContent = () => (
  <div className="space-y-6 text-gray-700 dark:text-gray-300">
    <section>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What is a Blockchain?</h3>
      <p>
        A blockchain is a distributed, immutable ledger that records transactions across a network of computers. 
        Each record or "block" is cryptographically linked to the previous one, creating a continuous "chain" that 
        cannot be altered without changing all subsequent blocks.
      </p>
    </section>
    
    <section>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Key Blockchain Concepts</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Block</strong>: A container for a set of transactions that have been verified and added to the blockchain.
        </li>
        <li>
          <strong>Transaction</strong>: A record of an action on the blockchain, such as transferring tokens or executing a smart contract.
        </li>
        <li>
          <strong>Validator</strong>: In a Proof of Authority blockchain like ZTACC, validators are trusted entities that verify transactions 
          and create new blocks.
        </li>
        <li>
          <strong>Wallet</strong>: A digital tool that stores the cryptographic keys needed to access and manage your blockchain assets and identity.
        </li>
        <li>
          <strong>Smart Contract</strong>: Self-executing code stored on the blockchain that automatically enforces agreements between parties.
        </li>
      </ul>
    </section>
    
    <section>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">ZTACC Blockchain Specifics</h3>
      <p>
        The ZTACC blockchain is purpose-built for secure access control using the zero-trust security model. 
        It uses a Proof of Authority (PoA) consensus mechanism, which is energy-efficient and allows for high transaction 
        throughput. ZTACC's blockchain immutably records all access requests, authentications, and security decisions, 
        creating a transparent and auditable security framework.
      </p>
    </section>
  </div>
);

// Documentation content for zero-trust concepts
export const ZeroTrustDocContent = () => (
  <div className="space-y-6 text-gray-700 dark:text-gray-300">
    <section>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What is Zero-Trust Security?</h3>
      <p>
        Zero-Trust is a security model that operates on the principle "never trust, always verify." 
        It requires strict identity verification for every person and device trying to access resources, 
        regardless of whether they are inside or outside the network perimeter.
      </p>
    </section>
    
    <section>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Key Zero-Trust Principles</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Verify Explicitly</strong>: Always authenticate and authorize based on all available data points.
        </li>
        <li>
          <strong>Least Privilege Access</strong>: Limit user access with Just-In-Time and Just-Enough-Access.
        </li>
        <li>
          <strong>Assume Breach</strong>: Minimize blast radius and segment access. Verify end-to-end encryption and use analytics to improve defenses.
        </li>
        <li>
          <strong>Continuous Verification</strong>: Access decisions are determined dynamically based on continuous security monitoring.
        </li>
      </ul>
    </section>
    
    <section>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">ZTACC Zero-Trust Implementation</h3>
      <p>
        ZTACC integrates zero-trust principles with blockchain technology to create a secure, transparent access control system:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Trust Score</strong>: A dynamic rating that determines a user's trustworthiness based on behavior, network reputation, and other factors.
        </li>
        <li>
          <strong>Continuous Authentication</strong>: Users are constantly re-verified rather than receiving long-lived access tokens.
        </li>
        <li>
          <strong>Immutable Audit Trail</strong>: All access requests and decisions are recorded on the blockchain for complete transparency.
        </li>
        <li>
          <strong>Context-Aware Access</strong>: Access decisions consider factors like location, device security posture, and time of request.
        </li>
      </ul>
    </section>
  </div>
);

// Help components for specific sections
export const BlockExplorerHelp = () => (
  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Understanding Blocks</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
      The Blocks tab shows you the history of blocks added to the ZTACC blockchain. Each block contains:
    </p>
    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
      <li><strong>Block Number</strong>: The sequential number of the block in the blockchain</li>
      <li><strong>Hash</strong>: A unique cryptographic identifier for the block</li>
      <li><strong>Age</strong>: When the block was created</li>
      <li><strong>Transactions</strong>: How many transactions are included in the block</li>
      <li><strong>Validator</strong>: Which authorized entity created and validated this block</li>
      <li><strong>Size</strong>: The data size of the block in bytes</li>
    </ul>
    <div className="mt-2 text-right">
      <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Learn more about blockchain blocks</button>
    </div>
  </div>
);

export const TransactionExplorerHelp = () => (
  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Understanding Transactions</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
      The Transactions tab displays all activities recorded on the ZTACC blockchain:
    </p>
    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
      <li><strong>Hash</strong>: A unique identifier for each transaction</li>
      <li><strong>Type</strong>: What kind of transaction (Token Transfer, Access Control, etc.)</li>
      <li><strong>From/To</strong>: The sender and recipient addresses</li>
      <li><strong>Value</strong>: Amount of ZTAC tokens transferred (if applicable)</li>
      <li><strong>Status</strong>: Whether the transaction was successful or failed</li>
    </ul>
    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
      <strong>Tip:</strong> Click on any transaction to see its complete details.
    </div>
  </div>
);

export const AccessControlHelp = () => (
  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Understanding Access Control</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
      The Access Control tab shows ZTACC's zero-trust security in action:
    </p>
    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
      <li><strong>Access Requests</strong>: Attempts to access protected resources</li>
      <li><strong>Approval/Denial Rates</strong>: The percentage of requests granted or denied</li>
      <li><strong>Trust Scores</strong>: Dynamic ratings that determine access permissions</li>
      <li><strong>Resource Access Patterns</strong>: Which resources are being accessed and by whom</li>
    </ul>
    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
      <strong>Why Access Control on a Blockchain?</strong> By recording access decisions on a blockchain, ZTACC 
      creates an immutable audit trail and enables sophisticated, decentralized security policies.
    </div>
  </div>
);

// Help component to integrate in the main Explorer
export const ZTACCHelp = () => {
  const [showDocModal, setShowDocModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: null
  });
  
  const openBlockchainDocs = () => {
    setModalContent({
      title: "Understanding Blockchain Technology",
      content: <BlockchainDocContent />
    });
    setShowDocModal(true);
  };
  
  const openZeroTrustDocs = () => {
    setModalContent({
      title: "Zero-Trust Security Explained",
      content: <ZeroTrustDocContent />
    });
    setShowDocModal(true);
  };
  
  return (
    <>
      {/* Help Section for Main Explorer Interface */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">ZTACC Explorer Help</h2>
          <div className="flex space-x-2">
            <button
              onClick={openBlockchainDocs}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              Blockchain Basics
            </button>
            <button
              onClick={openZeroTrustDocs}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800"
            >
              Zero-Trust Security
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Welcome to the ZTACC Explorer! This tool lets you explore the Zero-Trust Access Control Chain, 
          view blocks and transactions, analyze security metrics, and track the flow of ZTAC tokens. 
          Use the tabs above to navigate between different sections.
        </p>
      </div>
      
      {/* Documentation Modal */}
      <DocumentationModal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
    </>
  );
};

// Export all components
export { 
  InfoTooltip, 
  DocumentationModal, 
  HelpButton, 
  BlockchainDocContent, 
  ZeroTrustDocContent, 
  ZTACCHelp,
  BlockExplorerHelp,
  TransactionExplorerHelp,
  AccessControlHelp
}; 