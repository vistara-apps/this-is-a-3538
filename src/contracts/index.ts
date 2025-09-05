// Smart contract addresses and ABIs for ShipChain

export const CONTRACTS = {
  // Base Mainnet addresses (placeholder - would be deployed contracts)
  ESCROW: {
    address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    abi: [
      {
        "inputs": [
          {"name": "deliveryId", "type": "string"},
          {"name": "shipper", "type": "address"},
          {"name": "amount", "type": "uint256"},
          {"name": "token", "type": "address"}
        ],
        "name": "createEscrow",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"name": "deliveryId", "type": "string"},
          {"name": "courier", "type": "address"}
        ],
        "name": "assignCourier",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"name": "deliveryId", "type": "string"},
          {"name": "proofHash", "type": "string"}
        ],
        "name": "completeDelivery",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"name": "deliveryId", "type": "string"}],
        "name": "refundEscrow",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"name": "deliveryId", "type": "string"}],
        "name": "getEscrowDetails",
        "outputs": [
          {"name": "shipper", "type": "address"},
          {"name": "courier", "type": "address"},
          {"name": "amount", "type": "uint256"},
          {"name": "token", "type": "address"},
          {"name": "status", "type": "uint8"}
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  },
  SHIP_TOKEN: {
    address: '0x2345678901234567890123456789012345678901' as `0x${string}`,
    abi: [
      {
        "inputs": [
          {"name": "to", "type": "address"},
          {"name": "amount", "type": "uint256"}
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"name": "from", "type": "address"},
          {"name": "to", "type": "address"},
          {"name": "amount", "type": "uint256"}
        ],
        "name": "transferFrom",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  },
  USDC: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`, // Base USDC
    abi: [
      {
        "inputs": [
          {"name": "to", "type": "address"},
          {"name": "amount", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"name": "spender", "type": "address"},
          {"name": "amount", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  }
};

// Contract interaction helpers
export const ESCROW_STATUS = {
  PENDING: 0,
  LOCKED: 1,
  COMPLETED: 2,
  REFUNDED: 3
} as const;

export const TOKEN_DECIMALS = {
  USDC: 6,
  SHIP: 18
} as const;

// Gas limits for different operations
export const GAS_LIMITS = {
  CREATE_ESCROW: 200000n,
  ASSIGN_COURIER: 100000n,
  COMPLETE_DELIVERY: 150000n,
  REFUND_ESCROW: 100000n,
  TOKEN_TRANSFER: 80000n,
  TOKEN_APPROVE: 60000n
} as const;
