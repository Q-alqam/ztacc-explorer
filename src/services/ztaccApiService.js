// ZTACC Blockchain API Service
// ============================

import environment, { getApiUrl, logApiCall } from '../config/environment';

class ZTACCApiService {
  constructor() {
    this.baseUrl = environment.API_BASE_URL;
    this.timeout = environment.API_TIMEOUT;
  }

  // Generic fetch method with error handling
  async fetchWithTimeout(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      logApiCall(endpoint);
      
      const response = await fetch(getApiUrl(endpoint), {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      
      throw error;
    }
  }

  // Core Blockchain APIs
  // ====================

  async getChain() {
    return this.fetchWithTimeout(environment.ENDPOINTS.CHAIN);
  }

  async getNodeInfo() {
    return this.fetchWithTimeout(environment.ENDPOINTS.NODE_INFO);
  }

  async getValidators() {
    return this.fetchWithTimeout(environment.ENDPOINTS.VALIDATORS);
  }

  async getPeers() {
    return this.fetchWithTimeout(environment.ENDPOINTS.PEERS);
  }

  async getNetworkStatus() {
    return this.fetchWithTimeout(environment.ENDPOINTS.NETWORK_STATUS);
  }

  // Token & Economics APIs
  // ======================

  async getTokenEconomics() {
    return this.fetchWithTimeout(environment.ENDPOINTS.TOKEN_ECONOMICS);
  }

  async getTokenBalance(address) {
    return this.fetchWithTimeout(`${environment.ENDPOINTS.TOKEN_BALANCE}/${address}`);
  }

  async getTokenTransactions() {
    return this.fetchWithTimeout(environment.ENDPOINTS.TOKEN_TRANSACTIONS);
  }

  async getTokenAccounts() {
    return this.fetchWithTimeout(environment.ENDPOINTS.TOKEN_ACCOUNTS);
  }

  async getTokenSupply() {
    return this.fetchWithTimeout(environment.ENDPOINTS.TOKEN_SUPPLY);
  }

  // Admin & Management APIs
  // =======================

  async getAdminGenesisCheck() {
    return this.fetchWithTimeout(environment.ENDPOINTS.ADMIN_GENESIS_CHECK);
  }

  async getAdminNetworkStats() {
    return this.fetchWithTimeout(environment.ENDPOINTS.ADMIN_NETWORK_STATS);
  }

  async getAdminValidators() {
    return this.fetchWithTimeout(environment.ENDPOINTS.ADMIN_VALIDATORS);
  }

  async getAdminStakingData() {
    return this.fetchWithTimeout(environment.ENDPOINTS.ADMIN_STAKING_DATA);
  }

  // Dashboard Data Aggregation
  // ==========================

  async getDashboardData() {
    try {
      const [nodeInfo, networkStatus, economics] = await Promise.all([
        this.getNodeInfo(),
        this.getNetworkStatus(),
        this.getTokenEconomics()
      ]);

      return {
        success: true,
        data: {
          nodeInfo,
          networkStatus,
          economics
        }
      };
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getBlockTimeStats() {
    try {
      const response = await this.fetchWithTimeout(environment.ENDPOINTS.BLOCK_TIME);
      return response;
    } catch (error) {
      console.error('Failed to get block time stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getLiveTPS() {
    try {
      const response = await this.fetchWithTimeout(environment.ENDPOINTS.LIVE_TPS);
      return response;
    } catch (error) {
      console.error('Failed to get live TPS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getBlocks24h() {
    try {
      const response = await this.fetchWithTimeout(environment.ENDPOINTS.BLOCKS_24H);
      return response;
    } catch (error) {
      console.error('Failed to get 24h block production:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTPS24h() {
    try {
      const response = await this.fetchWithTimeout(environment.ENDPOINTS.TPS_24H);
      return response;
    } catch (error) {
      console.error('Failed to get 24h TPS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getValidatorsUptime24h() {
    try {
      const response = await this.fetchWithTimeout(environment.ENDPOINTS.VALIDATORS_UPTIME_24H);
      return response;
    } catch (error) {
      console.error('Failed to get 24h validator uptime:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTransactionStats() {
    try {
      const response = await this.fetchWithTimeout(environment.ENDPOINTS.TOKEN_TRANSACTIONS);
      return response;
    } catch (error) {
      console.error('Failed to get transaction stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTransactionCount() {
    try {
      // Get the chain to count total transactions across all blocks
      const chainData = await this.getChain();
      if (chainData.chain) {
        const totalTransactions = chainData.chain.reduce((total, block) => {
          return total + (block.transactions?.length || 0);
        }, 0);
        
        return {
          success: true,
          totalTransactions,
          blockCount: chainData.chain.length
        };
      }
      
      return {
        success: false,
        error: 'No chain data available'
      };
    } catch (error) {
      console.error('Failed to get transaction count:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getBlockchainOverview() {
    try {
      const [chain, validators, peers] = await Promise.all([
        this.getChain(),
        this.getValidators(),
        this.getPeers()
      ]);

      return {
        success: true,
        data: {
          chain,
          validators,
          peers
        }
      };
    } catch (error) {
      console.error('Failed to load blockchain overview:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Health Check
  // ============

  async healthCheck() {
    try {
      const startTime = Date.now();
      await this.getNodeInfo();
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create singleton instance
const ztaccApiService = new ZTACCApiService();

export default ztaccApiService;
