// Blockchain service for smart contract interactions
import { 
  createPublicClient, 
  createWalletClient, 
  http, 
  parseUnits, 
  formatUnits,
  getContract,
  Address,
  Hash
} from 'viem';
import { base } from 'viem/chains';
import { CONTRACTS, TOKEN_DECIMALS, GAS_LIMITS, ESCROW_STATUS } from '../contracts';
import { PaymentSession } from '../types';

interface EscrowDetails {
  shipper: Address;
  courier: Address;
  amount: bigint;
  token: Address;
  status: number;
}

class BlockchainService {
  private publicClient;
  private walletClient: any = null;

  constructor() {
    this.publicClient = createPublicClient({
      chain: base,
      transport: http(process.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org'),
    });
  }

  /**
   * Initialize wallet client with user's wallet
   */
  setWalletClient(walletClient: any) {
    this.walletClient = walletClient;
  }

  /**
   * Create escrow for delivery payment
   */
  async createEscrow(
    deliveryId: string,
    shipperAddress: Address,
    amount: number,
    tokenSymbol: 'USDC' | 'SHIP'
  ): Promise<{ hash: Hash; escrowAddress: Address }> {
    if (!this.walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      const tokenContract = tokenSymbol === 'USDC' ? CONTRACTS.USDC : CONTRACTS.SHIP_TOKEN;
      const decimals = TOKEN_DECIMALS[tokenSymbol];
      const amountWei = parseUnits(amount.toString(), decimals);

      // First approve the escrow contract to spend tokens
      const approveHash = await this.walletClient.writeContract({
        address: tokenContract.address,
        abi: tokenContract.abi,
        functionName: 'approve',
        args: [CONTRACTS.ESCROW.address, amountWei],
        gas: GAS_LIMITS.TOKEN_APPROVE,
      });

      // Wait for approval transaction
      await this.publicClient.waitForTransactionReceipt({ hash: approveHash });

      // Create escrow
      const escrowHash = await this.walletClient.writeContract({
        address: CONTRACTS.ESCROW.address,
        abi: CONTRACTS.ESCROW.abi,
        functionName: 'createEscrow',
        args: [deliveryId, shipperAddress, amountWei, tokenContract.address],
        gas: GAS_LIMITS.CREATE_ESCROW,
      });

      return {
        hash: escrowHash,
        escrowAddress: CONTRACTS.ESCROW.address,
      };
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw new Error('Failed to create escrow payment');
    }
  }

  /**
   * Assign courier to delivery
   */
  async assignCourier(
    deliveryId: string,
    courierAddress: Address
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACTS.ESCROW.address,
        abi: CONTRACTS.ESCROW.abi,
        functionName: 'assignCourier',
        args: [deliveryId, courierAddress],
        gas: GAS_LIMITS.ASSIGN_COURIER,
      });

      return hash;
    } catch (error) {
      console.error('Error assigning courier:', error);
      throw new Error('Failed to assign courier');
    }
  }

  /**
   * Complete delivery and release payment
   */
  async completeDelivery(
    deliveryId: string,
    proofHash: string
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACTS.ESCROW.address,
        abi: CONTRACTS.ESCROW.abi,
        functionName: 'completeDelivery',
        args: [deliveryId, proofHash],
        gas: GAS_LIMITS.COMPLETE_DELIVERY,
      });

      return hash;
    } catch (error) {
      console.error('Error completing delivery:', error);
      throw new Error('Failed to complete delivery');
    }
  }

  /**
   * Refund escrow payment
   */
  async refundEscrow(deliveryId: string): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACTS.ESCROW.address,
        abi: CONTRACTS.ESCROW.abi,
        functionName: 'refundEscrow',
        args: [deliveryId],
        gas: GAS_LIMITS.REFUND_ESCROW,
      });

      return hash;
    } catch (error) {
      console.error('Error refunding escrow:', error);
      throw new Error('Failed to refund escrow');
    }
  }

  /**
   * Get escrow details
   */
  async getEscrowDetails(deliveryId: string): Promise<EscrowDetails | null> {
    try {
      const result = await this.publicClient.readContract({
        address: CONTRACTS.ESCROW.address,
        abi: CONTRACTS.ESCROW.abi,
        functionName: 'getEscrowDetails',
        args: [deliveryId],
      }) as [Address, Address, bigint, Address, number];

      return {
        shipper: result[0],
        courier: result[1],
        amount: result[2],
        token: result[3],
        status: result[4],
      };
    } catch (error) {
      console.error('Error getting escrow details:', error);
      return null;
    }
  }

  /**
   * Get token balance for an address
   */
  async getTokenBalance(
    walletAddress: Address,
    tokenSymbol: 'USDC' | 'SHIP'
  ): Promise<number> {
    try {
      const tokenContract = tokenSymbol === 'USDC' ? CONTRACTS.USDC : CONTRACTS.SHIP_TOKEN;
      const decimals = TOKEN_DECIMALS[tokenSymbol];

      const balance = await this.publicClient.readContract({
        address: tokenContract.address,
        abi: tokenContract.abi,
        functionName: 'balanceOf',
        args: [walletAddress],
      }) as bigint;

      return parseFloat(formatUnits(balance, decimals));
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }

  /**
   * Transfer tokens
   */
  async transferTokens(
    to: Address,
    amount: number,
    tokenSymbol: 'USDC' | 'SHIP'
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      const tokenContract = tokenSymbol === 'USDC' ? CONTRACTS.USDC : CONTRACTS.SHIP_TOKEN;
      const decimals = TOKEN_DECIMALS[tokenSymbol];
      const amountWei = parseUnits(amount.toString(), decimals);

      const hash = await this.walletClient.writeContract({
        address: tokenContract.address,
        abi: tokenContract.abi,
        functionName: 'transfer',
        args: [to, amountWei],
        gas: GAS_LIMITS.TOKEN_TRANSFER,
      });

      return hash;
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw new Error('Failed to transfer tokens');
    }
  }

  /**
   * Mint SHIP tokens (for rewards)
   */
  async mintShipTokens(
    to: Address,
    amount: number
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      const amountWei = parseUnits(amount.toString(), TOKEN_DECIMALS.SHIP);

      const hash = await this.walletClient.writeContract({
        address: CONTRACTS.SHIP_TOKEN.address,
        abi: CONTRACTS.SHIP_TOKEN.abi,
        functionName: 'mint',
        args: [to, amountWei],
        gas: GAS_LIMITS.TOKEN_TRANSFER,
      });

      return hash;
    } catch (error) {
      console.error('Error minting SHIP tokens:', error);
      throw new Error('Failed to mint SHIP tokens');
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(hash: Hash) {
    try {
      return await this.publicClient.waitForTransactionReceipt({ hash });
    } catch (error) {
      console.error('Error getting transaction receipt:', error);
      throw new Error('Failed to get transaction receipt');
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(
    contractAddress: Address,
    abi: any[],
    functionName: string,
    args: any[]
  ): Promise<bigint> {
    if (!this.walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      return await this.publicClient.estimateContractGas({
        address: contractAddress,
        abi,
        functionName,
        args,
        account: this.walletClient.account,
      });
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw new Error('Failed to estimate gas');
    }
  }

  /**
   * Get current gas price
   */
  async getGasPrice(): Promise<bigint> {
    try {
      return await this.publicClient.getGasPrice();
    } catch (error) {
      console.error('Error getting gas price:', error);
      throw new Error('Failed to get gas price');
    }
  }

  /**
   * Check if address has sufficient balance for transaction
   */
  async checkSufficientBalance(
    address: Address,
    amount: number,
    tokenSymbol: 'USDC' | 'SHIP'
  ): Promise<boolean> {
    try {
      const balance = await this.getTokenBalance(address, tokenSymbol);
      return balance >= amount;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }

  /**
   * Get escrow status string
   */
  getEscrowStatusString(status: number): string {
    switch (status) {
      case ESCROW_STATUS.PENDING:
        return 'pending';
      case ESCROW_STATUS.LOCKED:
        return 'locked';
      case ESCROW_STATUS.COMPLETED:
        return 'completed';
      case ESCROW_STATUS.REFUNDED:
        return 'refunded';
      default:
        return 'unknown';
    }
  }

  /**
   * Monitor transaction status
   */
  async monitorTransaction(
    hash: Hash,
    onUpdate?: (status: 'pending' | 'confirmed' | 'failed') => void
  ): Promise<boolean> {
    try {
      onUpdate?.('pending');
      
      const receipt = await this.publicClient.waitForTransactionReceipt({ 
        hash,
        timeout: 60000, // 1 minute timeout
      });

      if (receipt.status === 'success') {
        onUpdate?.('confirmed');
        return true;
      } else {
        onUpdate?.('failed');
        return false;
      }
    } catch (error) {
      console.error('Transaction monitoring error:', error);
      onUpdate?.('failed');
      return false;
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
export default blockchainService;
