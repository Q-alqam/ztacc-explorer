// ZTACC Blockchain API Environment Configuration
// =============================================

const environment = {
  // API Base URLs
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002',
  API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,

  // Network Configuration
  NETWORK_NAME: process.env.REACT_APP_NETWORK_NAME || 'ZTACC',
  NETWORK_VERSION: process.env.REACT_APP_NETWORK_VERSION || '1.0.0',
  NETWORK_ENVIRONMENT: process.env.REACT_APP_NETWORK_ENVIRONMENT || 'development',

  // Blockchain Explorer Settings
  BLOCKS_PER_PAGE: parseInt(process.env.REACT_APP_BLOCKS_PER_PAGE) || 20,
  TRANSACTIONS_PER_PAGE: parseInt(process.env.REACT_APP_TRANSACTIONS_PER_PAGE) || 50,
  REFRESH_INTERVAL: parseInt(process.env.REACT_APP_REFRESH_INTERVAL) || 5000,

  // Feature Flags
  ENABLE_REAL_TIME_UPDATES: process.env.REACT_APP_ENABLE_REAL_TIME_UPDATES !== 'false',
  ENABLE_VALIDATOR_MONITORING: process.env.REACT_APP_ENABLE_VALIDATOR_MONITORING !== 'false',
  ENABLE_TRANSACTION_TRACKING: process.env.REACT_APP_ENABLE_TRANSACTION_TRACKING !== 'false',

  // Development Settings
  DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE !== 'false',
  LOG_API_CALLS: process.env.REACT_APP_LOG_API_CALLS !== 'false',

  // API Endpoints
  ENDPOINTS: {
    CHAIN: '/chain',
    NODE_INFO: '/api/node-info',
    VALIDATORS: '/validators',
    PEERS: '/peers',
    NETWORK_STATUS: '/network_status',
    TOKEN_ECONOMICS: '/api/token/economics',
    TOKEN_BALANCE: '/api/token/balance',
    TOKEN_TRANSACTIONS: '/api/token/transactions',
    TOKEN_ACCOUNTS: '/api/token/accounts',
    TOKEN_SUPPLY: '/api/token/supply',
    BLOCK_TIME: '/api/explorer/block-time',
    LIVE_TPS: '/api/explorer/live-tps',
    BLOCKS_24H: '/api/explorer/24h-block-production',
    TPS_24H: '/api/explorer/24h-tps',
    VALIDATORS_UPTIME_24H: '/api/explorer/24h-validator-uptime',
    ADMIN_GENESIS_CHECK: '/api/admin/genesis_check',
    ADMIN_NETWORK_STATS: '/api/admin/network_stats',
    ADMIN_VALIDATORS: '/api/admin/validators',
    ADMIN_STAKING_DATA: '/api/admin/staking_data'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${environment.API_BASE_URL}${endpoint}`;
};

// Helper function to get environment info
export const getEnvironmentInfo = () => {
  return {
    isDevelopment: environment.NETWORK_ENVIRONMENT === 'development',
    isProduction: environment.NETWORK_ENVIRONMENT === 'production',
    baseUrl: environment.API_BASE_URL,
    networkName: environment.NETWORK_NAME
  };
};

// Helper function for logging (only in debug mode)
export const logApiCall = (endpoint, data = null) => {
  if (environment.LOG_API_CALLS) {
    console.log(`🌐 API Call: ${endpoint}`, data);
  }
};

export default environment;
