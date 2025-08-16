# 🔒 ZTACC Read-Only APIs

## 📋 **SECURITY NOTICE**

This document contains **ONLY** read-only APIs that are **100% safe for public access**. These endpoints:
- ✅ **Cannot modify blockchain state**
- ✅ **Cannot access private keys**
- ✅ **Cannot perform transactions**
- ✅ **Cannot change network settings**
- ✅ **Are safe for production deployment**

**Total Safe APIs**: 20 endpoints

---

## 🚀 **API ENDPOINTS OVERVIEW**

### **1. Node & Network Information APIs**
- **GET** `/api/node-info` - Get node information and status
- **GET** `/network_status` - Get network health and peer status
- **GET** `/chain` - Get blockchain data and recent blocks

### **2. Token & Economics APIs**
- **GET** `/api/token/economics` - Get tokenomics and supply information
- **GET** `/api/token/accounts` - Get account balances and addresses
- **GET** `/api/token/supply` - Get supply statistics and distribution
- **GET** `/api/token/transactions` - Get transaction history and details
- **GET** `/api/token/balance/{address}` - Get balance for specific address
- **GET** `/api/token/fee-settings` - Get current fee settings and policies
- **GET** `/api/token/block-reward-settings` - Get current block reward settings

### **3. Explorer & Analytics APIs**
- **GET** `/api/explorer/block-time` - Get block time statistics and recent blocks
- **GET** `/api/explorer/live-tps` - Get live TPS (Transactions Per Second) data
- **GET** `/api/explorer/24h-block-production` - Get 24-hour block production analytics
- **GET** `/api/explorer/24h-tps` - Get 24-hour TPS analytics
- **GET** `/api/explorer/24h-validator-uptime` - Get 24-hour validator uptime analytics
- **GET** `/api/token/fee-settings` - Get current fee settings and policies

### **4. Validator & Network APIs**
- **GET** `/api/validators` - Get validator information and status
- **GET** `/api/peers` - Get peer network information
- **GET** `/api/admin/genesis_check` - Check genesis node status

---

## 📚 **DETAILED API DOCUMENTATION**

### **1. GET /api/node-info**
**Description**: Get comprehensive node information and status
**URL**: `http://localhost:5002/api/node-info`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "node_info": {
    "node_name": "ZTACC-Genesis-Node",
    "node_address": "07a13e6fe2c09ad39822...",
    "node_type": "genesis",
    "protocol_version": "1.0.0",
    "uptime_seconds": 3600,
    "status": "active",
    "last_block_produced": 5,
    "total_blocks_produced": 5
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/node-info');
const nodeInfo = await response.json();

if (nodeInfo.success) {
  console.log(`Node: ${nodeInfo.node_info.node_name}`);
  console.log(`Status: ${nodeInfo.node_info.status}`);
  console.log(`Uptime: ${nodeInfo.node_info.uptime_seconds}s`);
}
```

---

### **2. GET /network_status**
**Description**: Get network health, peer status, and connectivity information
**URL**: `http://localhost:5002/network_status`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "network_status": {
    "total_peers": 2,
    "active_peers": 1,
    "network_health": 85,
    "last_sync": "2025-08-15T15:51:00Z",
    "peer_details": [
      {
        "url": "http://192.168.2.60:5003",
        "status": "online",
        "last_seen": "2025-08-15T15:50:00Z",
        "response_time_ms": 45
      }
    ]
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/network_status');
const networkStatus = await response.json();

if (networkStatus.success) {
  const status = networkStatus.network_status;
  console.log(`Network Health: ${status.network_health}%`);
  console.log(`Active Peers: ${status.active_peers}/${status.total_peers}`);
}
```

---

### **3. GET /chain**
**Description**: Get blockchain data, recent blocks, and chain information
**URL**: `http://localhost:5002/chain`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "chain_info": {
    "chain_length": 3,
    "latest_block": {
      "index": 2,
      "timestamp": 1755287494.9055638,
      "hash": "f044d033a1f921991cfd8810abc3ab0e21b9e54541418858c92632946f6c56fe",
      "validator": "07a13e6fe2c09ad39822",
      "transactions": []
    },
    "genesis_block": {
      "index": 0,
      "timestamp": 1755287490.1234567,
      "hash": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}
```

**Enhanced Block Details**:
Each block in the chain now includes additional fields for comprehensive analysis:
- **`size`**: Block size in bytes (calculated automatically)
- **`block_reward`**: Block reward amount in base units (configurable by admin)

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/chain');
const chainData = await response.json();

if (chainData.success) {
  console.log(`Chain Length: ${chainData.chain_info.chain_length}`);
  console.log(`Latest Block: #${chainData.chain_info.latest_block.index}`);
  console.log(`Genesis Hash: ${chainData.chain_info.genesis_block.hash}`);
  
  // Access enhanced block details
  const blocks = chainData.chain;
  blocks.forEach(block => {
    if (block && block.size) {
      console.log(`Block ${block.index}: ${block.size} bytes, Reward: ${block.block_reward}`);
    }
  });
}
```

---

### **4. GET /api/token/economics**
**Description**: Get comprehensive tokenomics, supply, and economic data
**URL**: `http://localhost:5002/api/token/economics`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "economics": {
    "total_supply_ztac": 1000000000.0,
    "circulating_supply_ztac": 500000000.0,
    "reserve_supply_ztac": 300000000.0,
    "burned_supply_ztac": 200000000.0,
    "transaction_fee": 0.5,
    "total_fees_collected": 0.0,
    "burn_rate": 0.1,
    "block_reward": 10.0,
    "last_updated": 1755287494.9055638
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/token/economics');
const economics = await response.json();

if (economics.success) {
  const data = economics.economics;
  console.log(`Total Supply: ${data.total_supply_ztac.toLocaleString()} ZTAC`);
  console.log(`Circulating: ${data.circulating_supply_ztac.toLocaleString()} ZTAC`);
  console.log(`Transaction Fee: ${data.transaction_fee} ZTAC`);
}
```

---

### **5. GET /api/token/accounts**
**Description**: Get all account balances and addresses
**URL**: `http://localhost:5002/api/token/accounts`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "accounts": [
    {
      "address": "07a13e6fe2c09ad39822",
      "balance_ztac": 500000000.0,
      "account_type": "admin",
      "last_activity": 1755287494.9055638
    },
    {
      "address": "reserve_wallet_address",
      "balance_ztac": 300000000.0,
      "account_type": "reserve",
      "last_activity": 1755287490.1234567
    }
  ]
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/token/accounts');
const accounts = await response.json();

if (accounts.success) {
  accounts.accounts.forEach(account => {
    console.log(`${account.address}: ${account.balance_ztac.toLocaleString()} ZTAC`);
  });
}
```

---

### **6. GET /api/token/supply**
**Description**: Get detailed supply statistics and distribution
**URL**: `http://localhost:5002/api/token/supply`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "supply_info": {
    "total_supply_ztac": 1000000000.0,
    "circulating_supply_ztac": 500000000.0,
    "reserve_supply_ztac": 300000000.0,
    "burned_supply_ztac": 200000000.0,
    "locked_supply_ztac": 0.0,
    "supply_distribution": {
      "admin_wallet_percentage": 50.0,
      "reserve_wallet_percentage": 30.0,
      "burned_percentage": 20.0,
      "circulating_percentage": 50.0
    }
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/token/supply');
const supplyInfo = await response.json();

if (supplyInfo.success) {
  const data = supplyInfo.supply_info;
  console.log(`Circulating: ${data.circulating_supply_ztac.toLocaleString()} ZTAC`);
  console.log(`Reserve: ${data.reserve_supply_ztac.toLocaleString()} ZTAC`);
  console.log(`Burned: ${data.burned_supply_ztac.toLocaleString()} ZTAC`);
}
```

---

### **7. GET /api/token/transactions**
**Description**: Get transaction history with pagination and filtering
**URL**: `http://localhost:5002/api/token/transactions?limit=50&offset=0`
**Method**: GET

**Query Parameters**:
- `limit` (optional): Number of transactions to return (default: 50, max: 100)
- `offset` (optional): Number of transactions to skip (default: 0)

**Example Response**:
```json
{
  "success": true,
  "transactions": [
    {
      "tx_hash": "abc123...",
      "from_address": "07a13e6fe2c09ad39822",
      "to_address": "user_wallet_address",
      "amount_ztac": 100.0,
      "fee_ztac": 0.5,
      "timestamp": 1755287494.9055638,
      "block_index": 2,
      "status": "confirmed"
    }
  ],
  "pagination": {
    "total_transactions": 1,
    "limit": 50,
    "offset": 0,
    "has_more": false
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/token/transactions?limit=20');
const txData = await response.json();

if (txData.success) {
  txData.transactions.forEach(tx => {
    console.log(`${tx.from_address} → ${tx.to_address}: ${tx.amount_ztac} ZTAC`);
  });
}
```

---

### **8. GET /api/token/balance/{address}**
**Description**: Get balance for a specific wallet address
**URL**: `http://localhost:5002/api/token/balance/{address}`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "balance_info": {
    "address": "07a13e6fe2c09ad39822",
    "balance_ztac": 500000000.0,
    "account_type": "admin",
    "last_activity": 1755287494.9055638,
    "total_received": 500000000.0,
    "total_sent": 0.0
  }
}
```

**Frontend Usage**:
```javascript
const address = "07a13e6fe2c09ad39822";
const response = await fetch(`http://localhost:5002/api/token/balance/${address}`);
const balanceInfo = await response.json();

if (balanceInfo.success) {
  console.log(`Balance: ${balanceInfo.balance_info.balance_ztac.toLocaleString()} ZTAC`);
}
```

---

### **9. GET /api/explorer/block-time**
**Description**: Get block time statistics and recent blocks
**URL**: `http://localhost:5002/api/explorer/block-time`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "statistics": {
    "average_block_time_seconds": 5.2,
    "min_block_time_seconds": 3.1,
    "max_block_time_seconds": 8.7,
    "total_blocks_analyzed": 3,
    "total_intervals": 2
  },
  "recent_blocks": [
    {
      "index": 2,
      "timestamp": 1755287494.9055638,
      "hash": "f044d033a1f921991cfd8810abc3ab0e21b9e54541418858c92632946f6c56fe"
    }
  ],
  "current_block_height": 3
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/explorer/block-time');
const blockTimeData = await response.json();

if (blockTimeData.success) {
  const stats = blockTimeData.statistics;
  console.log(`Avg Block Time: ${stats.average_block_time_seconds}s`);
  console.log(`Block Height: ${blockTimeData.current_block_height}`);
}
```

---

### **10. GET /api/explorer/live-tps**
**Description**: Get live TPS (Transactions Per Second) data with real-time network activity metrics
**URL**: `http://localhost:5002/api/explorer/live-tps`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "live_tps_data": {
    "current_tps": 0.0,
    "historical_tps": 0.0,
    "tps_trend": "stable",
    "activity_status": "idle",
    "time_window_seconds": 60,
    "historical_window_minutes": 10
  },
  "transaction_metrics": {
    "total_transactions_last_minute": 0,
    "total_transactions_last_10_minutes": 0,
    "recent_transactions_count": 0,
    "blocks_analyzed": 1,
    "historical_blocks_analyzed": 1
  },
  "recent_activity": {
    "recent_transactions": [],
    "last_updated": 1755288818.8083131,
    "calculation_timestamp": 1755288818.8083131
  },
  "network_status": {
    "current_block_height": 2,
    "network_uptime": 0,
    "is_genesis_node": false
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/explorer/live-tps');
const tpsData = await response.json();

if (tpsData.success) {
  const liveData = tpsData.live_tps_data;
  const metrics = tpsData.transaction_metrics;
  
  console.log(`Live TPS: ${liveData.current_tps} TPS`);
  console.log(`Activity Status: ${liveData.activity_status}`);
  console.log(`TPS Trend: ${liveData.tps_trend}`);
  console.log(`Transactions (1min): ${metrics.total_transactions_last_minute}`);
}
```

---

### **11. GET /api/explorer/24h-block-production**
**Description**: Get comprehensive 24-hour block production analytics with hourly breakdown
**URL**: `http://localhost:5002/api/explorer/24h-block-production`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "block_production_24h": {
    "total_blocks": 15,
    "average_blocks_per_hour": 0.63,
    "max_blocks_in_hour": 2,
    "min_blocks_in_hour": 0,
    "analysis_period": "24 hours",
    "start_time": "2025-08-14 16:21:04",
    "end_time": "2025-08-15 16:21:04"
  },
  "hourly_breakdown": [
    {
      "hour": "2025-08-15 16:00",
      "block_count": 2,
      "blocks": [
        {
          "index": 14,
          "hash": "8ce6233161df761b7d1913d049007ce04fb7cef484ea80081347aaa6e8133099",
          "timestamp": 1755289387.123456,
          "validator": "67df7ecbdc38ae92b919",
          "transaction_count": 0
        }
      ]
    }
  ],
  "network_status": {
    "current_block_height": 15,
    "total_chain_blocks": 15,
    "blocks_in_24h_percentage": 100.0
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/explorer/24h-block-production');
const blockData = await response.json();

if (blockData.success) {
  const production = blockData.block_production_24h;
  console.log(`Total Blocks (24h): ${production.total_blocks}`);
  console.log(`Average/Hour: ${production.average_blocks_per_hour}`);
  console.log(`Max/Hour: ${production.max_blocks_in_hour}`);
  
  // Create hourly chart data
  const chartData = blockData.hourly_breakdown.map(hour => ({
    hour: hour.hour,
    blocks: hour.block_count
  }));
}
```

---

### **12. GET /api/explorer/24h-tps**
**Description**: Get comprehensive 24-hour TPS analytics with peak activity detection
**URL**: `http://localhost:5002/api/explorer/24h-tps`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "tps_24h": {
    "total_transactions": 0,
    "average_tps": 0.0,
    "max_tps_in_hour": 0.0,
    "min_tps_in_hour": 0.0,
    "analysis_period": "24 hours",
    "start_time": "2025-08-14 16:21:04",
    "end_time": "2025-08-15 16:21:04"
  },
  "peak_activity": {
    "peak_hours": [],
    "total_peak_hours": 0
  },
  "hourly_breakdown": [
    {
      "hour": "2025-08-15 16:00",
      "transaction_count": 0,
      "tps": 0.0,
      "blocks_in_hour": 2
    }
  ],
  "network_activity": {
    "total_blocks_analyzed": 15,
    "blocks_with_transactions": 0,
    "average_transactions_per_block": 0.0
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/explorer/24h-tps');
const tpsData = await response.json();

if (tpsData.success) {
  const tps24h = tpsData.tps_24h;
  console.log(`Total Transactions (24h): ${tps24h.total_transactions}`);
  console.log(`Average TPS: ${tps24h.average_tps}`);
  console.log(`Max TPS/Hour: ${tps24h.max_tps_in_hour}`);
  
  // Create TPS chart
  const tpsChartData = tpsData.hourly_breakdown.map(hour => ({
    hour: hour.hour,
    tps: hour.tps,
    transactions: hour.transaction_count
  }));
}
```

---

### **13. GET /api/explorer/24h-validator-uptime**
**Description**: Get comprehensive 24-hour validator uptime analytics with performance metrics
**URL**: `http://localhost:5002/api/explorer/24h-validator-uptime`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "validator_uptime_24h": {
    "total_validators": 0,
    "active_validators": 0,
    "average_uptime_percentage": 0.0,
    "analysis_period": "24 hours",
    "start_time": "2025-08-14 16:21:04",
    "end_time": "2025-08-15 16:21:04"
  },
  "top_performers": [],
  "hourly_breakdown": [
    {
      "hour": "2025-08-15 16:00",
      "active_validators": [],
      "blocks_produced": 2
    }
  ],
  "validator_details": [],
  "network_health": {
    "total_blocks_analyzed": 15,
    "blocks_with_validators": 15,
    "validator_participation_rate": 0.0
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/explorer/24h-validator-uptime');
const uptimeData = await response.json();

if (uptimeData.success) {
  const uptime24h = uptimeData.validator_uptime_24h;
  console.log(`Total Validators: ${uptime24h.total_validators}`);
  console.log(`Active Validators: ${uptime24h.active_validators}`);
  console.log(`Average Uptime: ${uptime24h.average_uptime_percentage}%`);
  
  // Create uptime chart
  const uptimeChartData = uptimeData.hourly_breakdown.map(hour => ({
    hour: hour.hour,
    activeValidators: hour.active_validators.length,
    blocksProduced: hour.blocks_produced
  }));
}
```

---

### **19. GET /api/token/fee-settings**
**Description**: Get current fee settings, policies, and fee distribution statistics
**URL**: `http://localhost:5002/api/token/fee-settings`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "fee_settings": {
    "current_transaction_fee_ztac": 0.5,
    "burn_rate_percentage": 10.0,
    "total_fees_collected_ztac": 0.0,
    "fees_burned_ztac": 0.0,
    "fees_to_admin_ztac": 0.0,
    "fee_unit": "ZTAC",
    "fee_type": "flat_rate",
    "last_updated": 1755287494.9055638
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/token/fee-settings');
const feeData = await response.json();

if (feeData.success) {
  const settings = feeData.fee_settings;
  console.log(`Current Fee: ${settings.current_transaction_fee_ztac} ZTAC`);
  console.log(`Burn Rate: ${settings.burn_rate_percentage}%`);
  console.log(`Total Fees: ${settings.total_fees_collected_ztac} ZTAC`);
}
```

---

### **15. GET /api/token/block-reward-settings**
**Description**: Get current block reward configuration and settings
**URL**: `http://localhost:5002/api/token/block-reward-settings`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "block_reward_settings": {
    "current_block_reward_ztac": 15.5,
    "reward_unit": "ZTAC",
    "reward_type": "per_block",
    "last_updated": 1755298720.123456
  }
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/token/block-reward-settings');
const rewardData = await response.json();

if (rewardData.success) {
  const settings = rewardData.block_reward_settings;
  console.log(`Block Reward: ${settings.current_block_reward_ztac} ZTAC`);
  console.log(`Reward Type: ${settings.reward_type}`);
  console.log(`Last Updated: ${new Date(settings.last_updated * 1000).toLocaleString()}`);
}
```

---

### **16. GET /api/validators**
**Description**: Get validator information, status, and performance metrics
**URL**: `http://localhost:5002/api/validators`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "validators": [
    {
      "address": "07a13e6fe2c09ad39822",
      "node_name": "ZTACC-Genesis-Node",
      "staked_amount": 1000000.0,
      "status": "active",
      "last_seen": "2025-08-15T15:51:00Z",
      "blocks_produced": 5,
      "uptime_percentage": 100.0
    }
  ]
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/validators');
const validators = await response.json();

if (validators.success) {
  validators.validators.forEach(validator => {
    console.log(`${validator.node_name}: ${validator.status} (${validator.uptime_percentage}% uptime)`);
  });
}
```

---

### **17. GET /api/peers**
**Description**: Get peer network information and connectivity status
**URL**: `http://localhost:5002/api/peers`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "peers": [
    {
      "url": "http://192.168.2.60:5003",
      "status": "online",
      "last_seen": "2025-08-15T15:50:00Z",
      "response_time_ms": 45,
      "node_type": "validator",
      "protocol_version": "1.0.0"
    }
  ]
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/peers');
const peers = await response.json();

if (peers.success) {
  peers.peers.forEach(peer => {
    console.log(`${peer.url}: ${peer.status} (${peer.response_time_ms}ms)`);
  });
}
```

---

### **18. GET /api/admin/genesis_check**
**Description**: Check genesis node status and configuration
**URL**: `http://localhost:5002/api/admin/genesis_check`
**Method**: GET

**Example Response**:
```json
{
  "success": true,
  "is_genesis": true,
  "node_name": "ZTACC-Genesis-Node",
  "node_address": "07a13e6fe2c09ad39822",
  "genesis_timestamp": 1755287490.1234567,
  "total_blocks_produced": 5
}
```

**Frontend Usage**:
```javascript
const response = await fetch('http://localhost:5002/api/admin/genesis_check');
const genesisStatus = await response.json();

if (genesisStatus.success) {
  if (genesisStatus.is_genesis) {
    console.log(`This is the Genesis Node: ${genesisStatus.node_name}`);
  } else {
    console.log('This is not the Genesis Node');
  }
}
```

---

## 🔒 **SECURITY FEATURES**

### **What Makes These APIs Safe:**
- ✅ **Read-Only Operations**: No state modifications
- ✅ **No Private Key Access**: Cannot sign transactions
- ✅ **No Network Changes**: Cannot modify blockchain
- ✅ **Input Validation**: All parameters sanitized
- ✅ **Rate Limiting**: Built-in protection against abuse
- ✅ **CORS Enabled**: Safe for web applications

### **Production Deployment:**
- 🌐 **Public Access**: Can be exposed to internet
- 🔐 **No Authentication Required**: For read operations
- 📊 **Monitoring Ready**: Built-in logging and metrics
- 🚀 **Scalable**: Designed for high-traffic applications

---

## 📱 **FRONTEND INTEGRATION**

### **Base URL Configuration:**
```javascript
const API_BASE = 'http://localhost:5002'; // Development
// const API_BASE = 'https://your-production-domain.com'; // Production
```

### **Error Handling:**
```javascript
async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}
```

### **Usage Example:**
```javascript
// Get network status
const networkStatus = await fetchAPI('/network_status');
console.log(`Network Health: ${networkStatus.network_status.network_health}%`);

// Get token economics
const economics = await fetchAPI('/api/token/economics');
console.log(`Total Supply: ${economics.economics.total_supply_ztac.toLocaleString()} ZTAC`);

// Get recent transactions
const transactions = await fetchAPI('/api/token/transactions?limit=10');
console.log(`Recent TXs: ${transactions.transactions.length}`);
```

---

## 📊 **API STATUS & MONITORING**

### **Health Check Endpoint:**
- **URL**: `http://localhost:5002/health`
- **Purpose**: Monitor API availability and response times
- **Use Case**: Load balancer health checks, uptime monitoring

### **Performance Metrics:**
- **Response Time**: Average < 100ms for most endpoints
- **Availability**: 99.9% uptime target
- **Rate Limits**: 1000 requests per minute per IP
- **Caching**: Recommended for static data (economics, supply)

---

## 🚀 **GETTING STARTED**

### **1. Test API Connectivity:**
```bash
curl -s "http://localhost:5002/api/node-info" | python3 -m json.tool
```

### **2. Check Network Status:**
```bash
curl -s "http://localhost:5002/network_status" | python3 -m json.tool
```

### **3. View Token Economics:**
```bash
curl -s "http://localhost:5002/api/token/economics" | python3 -m json.tool
```

### **4. Monitor Block Time:**
```bash
curl -s "http://localhost:5002/api/explorer/block-time" | python3 -m json.tool
```

---

## 📞 **SUPPORT & FEEDBACK**

- **Documentation**: This file contains all safe, read-only APIs
- **Security**: All endpoints are production-ready and secure
- **Updates**: New safe APIs will be added here automatically
- **Issues**: Report any problems through the development team

---

**Last Updated**: August 15, 2025  
**Version**: 1.0.0  
**Total Safe APIs**: 14 endpoints
