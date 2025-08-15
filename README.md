# ZTACC Explorer

A blockchain explorer for the Zero Trust Access Control Chain (ZTACC) blockchain, designed to provide an intuitive interface for exploring blocks, transactions, validators, and smart contracts on the ZTACC network.

## Overview

ZTACC Explorer allows users to:

- Browse blocks and transactions on the Zero Trust Access Control Chain
- Explore smart contracts and their interactions
- Monitor validators and network performance
- Track access control events and policies
- Analyze network data through interactive visualizations
- Connect wallets and manage identities

The explorer is fully responsive and works seamlessly on desktop, tablet, and mobile devices.

## Project Structure

The project is organized as follows:

```
src/
├── components/
│   ├── Explorer/
│   │   ├── BlocksTab.js
│   │   ├── TransactionsTab.js
│   │   ├── AccessControlTab.js
│   │   ├── ValidatorsTab.js
│   │   ├── OverviewTab.js
│   │   ├── Charts.js
│   │   ├── LiveTransactionFeed.js
│   │   ├── StatsCard.js
│   │   ├── TabButton.js
│   │   └── TransactionModal.js
│   ├── Layout/
│   │   ├── Header.js
│   │   ├── MobileHeader.js
│   │   ├── Sidebar.js
│   │   ├── Footer.js
│   │   ├── MobileNavigation.js
│   │   └── Layout.js
│   ├── Wallet/
│   │   ├── WalletProfile.js
│   │   ├── AuthenticatedWalletProfile.js
│   │   ├── WalletOverviewTab.js
│   │   ├── WalletAccessTab.js
│   │   ├── WalletAnalyticsTab.js
│   │   ├── WalletTransactionsTab.js
│   │   └── index.js
│   └── Documentation/
│       └── DocumentationComponents.js
├── pages/
│   ├── Dashboard.js
│   ├── BlocksPage.js
│   ├── BlockDetailsPage.js
│   ├── TransactionsPage.js
│   ├── TransactionDetailsPage.js
│   ├── WalletPage.js
│   ├── WalletDashboard.js
│   ├── ConnectWallet.js
│   ├── ValidatorsPage.js
│   ├── AccessControlPage.js
│   ├── SmartContractsPage.js
│   ├── SmartContractDetailsPage.js
│   ├── AnalyticsPage.js
│   └── NotFound.js
├── context/
│   └── WalletContext.js
├── App.js
├── ZTACCExplorer.js
└── index.js
```

## Key Features

### Blockchain Explorer
- **Block Explorer**: Browse and search blocks, view block details and included transactions
- **Transaction Explorer**: Track transactions, filter by type, and view detailed transaction data
- **Smart Contracts**: Explore verified contracts, view source code, and interact with contracts
- **Validators**: Monitor network validators, staking information, and validation performance

### Access Control Features
- **Access Policies**: View and manage access control policies on the ZTACC network
- **Trust Scores**: Monitor trust metrics for addresses and contracts
- **Identity Management**: Connect wallets and manage digital identity on the network

### Mobile Responsiveness
- Fully responsive design that works on devices of all sizes
- Mobile-optimized navigation with bottom navigation bar
- Touch-friendly components and interactions
- Responsive tables that transform into cards on small screens
- Optimized charts and data visualizations for mobile

## Recent Updates

- Added comprehensive mobile responsiveness across all pages
- Implemented Smart Contracts section with listing and detail pages
- Created mobile-optimized navigation with bottom navigation bar
- Transformed tables into card views for small screens
- Added responsive transaction modals and charts
- Enhanced header with mobile toggle menu

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Technologies Used

- React
- Tailwind CSS
- React Router
- React Feather (for icons)
- Recharts (for charts)
- Web3.js (for blockchain interaction)

## License

This project is proprietary software for the ZTACC network.
