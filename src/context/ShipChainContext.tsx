import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { Delivery, Courier, UserProfile, Notification } from '../types';
import { apiService } from '../services/api';
import { blockchainService } from '../services/blockchain';
import { ipfsService } from '../services/ipfs';

// State interface
interface ShipChainState {
  // User data
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  
  // Deliveries
  deliveries: Delivery[];
  activeDelivery: Delivery | null;
  
  // Couriers
  availableCouriers: Courier[];
  selectedCourier: Courier | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Token balances
  usdcBalance: number;
  shipBalance: number;
}

// Action types
type ShipChainAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_DELIVERIES'; payload: Delivery[] }
  | { type: 'ADD_DELIVERY'; payload: Delivery }
  | { type: 'UPDATE_DELIVERY'; payload: Delivery }
  | { type: 'SET_ACTIVE_DELIVERY'; payload: Delivery | null }
  | { type: 'SET_AVAILABLE_COURIERS'; payload: Courier[] }
  | { type: 'SET_SELECTED_COURIER'; payload: Courier | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_TOKEN_BALANCES'; payload: { usdc: number; ship: number } };

// Initial state
const initialState: ShipChainState = {
  userProfile: null,
  isAuthenticated: false,
  deliveries: [],
  activeDelivery: null,
  availableCouriers: [],
  selectedCourier: null,
  loading: false,
  error: null,
  notifications: [],
  unreadCount: 0,
  usdcBalance: 0,
  shipBalance: 0,
};

// Reducer
function shipChainReducer(state: ShipChainState, action: ShipChainAction): ShipChainState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_DELIVERIES':
      return { ...state, deliveries: action.payload };
    
    case 'ADD_DELIVERY':
      return { ...state, deliveries: [...state.deliveries, action.payload] };
    
    case 'UPDATE_DELIVERY':
      return {
        ...state,
        deliveries: state.deliveries.map(delivery =>
          delivery.deliveryId === action.payload.deliveryId ? action.payload : delivery
        ),
        activeDelivery: state.activeDelivery?.deliveryId === action.payload.deliveryId 
          ? action.payload 
          : state.activeDelivery,
      };
    
    case 'SET_ACTIVE_DELIVERY':
      return { ...state, activeDelivery: action.payload };
    
    case 'SET_AVAILABLE_COURIERS':
      return { ...state, availableCouriers: action.payload };
    
    case 'SET_SELECTED_COURIER':
      return { ...state, selectedCourier: action.payload };
    
    case 'SET_NOTIFICATIONS':
      return { 
        ...state, 
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    
    case 'SET_TOKEN_BALANCES':
      return {
        ...state,
        usdcBalance: action.payload.usdc,
        shipBalance: action.payload.ship,
      };
    
    default:
      return state;
  }
}

// Context
interface ShipChainContextType {
  state: ShipChainState;
  
  // User actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  
  // Delivery actions
  createDelivery: (deliveryData: Partial<Delivery>) => Promise<Delivery>;
  updateDeliveryStatus: (deliveryId: string, status: string, courierId?: string) => Promise<void>;
  completeDelivery: (deliveryId: string, proofFiles: File[]) => Promise<void>;
  cancelDelivery: (deliveryId: string) => Promise<void>;
  
  // Courier actions
  findAvailableCouriers: (deliveryId: string) => Promise<void>;
  selectCourier: (courier: Courier) => void;
  acceptDelivery: (deliveryId: string) => Promise<void>;
  
  // Notification actions
  markNotificationRead: (notificationId: string) => Promise<void>;
  
  // Token actions
  refreshTokenBalances: () => Promise<void>;
  transferTokens: (to: string, amount: number, token: 'USDC' | 'SHIP') => Promise<void>;
}

const ShipChainContext = createContext<ShipChainContextType | undefined>(undefined);

// Provider component
interface ShipChainProviderProps {
  children: ReactNode;
}

export function ShipChainProvider({ children }: ShipChainProviderProps) {
  const [state, dispatch] = useReducer(shipChainReducer, initialState);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Initialize blockchain service with wallet client
  useEffect(() => {
    if (walletClient) {
      blockchainService.setWalletClient(walletClient);
    }
  }, [walletClient]);

  // Load user data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      loadUserData();
    } else {
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      dispatch({ type: 'SET_USER_PROFILE', payload: null });
    }
  }, [isConnected, address]);

  // Load user data
  const loadUserData = async () => {
    if (!address) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Load user profile
      const profileResponse = await apiService.getUserProfile(address);
      if (profileResponse.success && profileResponse.data) {
        dispatch({ type: 'SET_USER_PROFILE', payload: profileResponse.data });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      }

      // Load deliveries
      const deliveriesResponse = await apiService.getDeliveries();
      if (deliveriesResponse.success && deliveriesResponse.data) {
        dispatch({ type: 'SET_DELIVERIES', payload: deliveriesResponse.data });
      }

      // Load notifications
      const notificationsResponse = await apiService.getNotifications(address);
      if (notificationsResponse.success && notificationsResponse.data) {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notificationsResponse.data });
      }

      // Load token balances
      await refreshTokenBalances();

    } catch (error) {
      console.error('Error loading user data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    // This is handled by RainbowKit
    // Just ensure we're ready when connection happens
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'SET_USER_PROFILE', payload: null });
    dispatch({ type: 'SET_DELIVERIES', payload: [] });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
  };

  // Update user profile
  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await apiService.updateUserProfile(address, profileData);
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER_PROFILE', payload: response.data });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Create delivery
  const createDelivery = async (deliveryData: Partial<Delivery>): Promise<Delivery> => {
    if (!address) throw new Error('Wallet not connected');

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Create delivery via API
      const response = await apiService.createDelivery({
        ...deliveryData,
        shipperId: address,
        createdAt: new Date().toISOString(),
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create delivery');
      }

      const delivery = response.data;

      // Create escrow on blockchain
      if (delivery.paymentAmount && delivery.paymentToken) {
        await blockchainService.createEscrow(
          delivery.deliveryId,
          address as `0x${string}`,
          delivery.paymentAmount,
          delivery.paymentToken
        );
      }

      dispatch({ type: 'ADD_DELIVERY', payload: delivery });
      return delivery;

    } catch (error) {
      console.error('Error creating delivery:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create delivery' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update delivery status
  const updateDeliveryStatus = async (deliveryId: string, status: string, courierId?: string) => {
    try {
      const response = await apiService.updateDeliveryStatus(deliveryId, status, courierId);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_DELIVERY', payload: response.data });

        // If assigning courier, update blockchain
        if (courierId && status === 'matched') {
          // This would need the courier's wallet address
          // await blockchainService.assignCourier(deliveryId, courierAddress);
        }
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update delivery status' });
      throw error;
    }
  };

  // Complete delivery
  const completeDelivery = async (deliveryId: string, proofFiles: File[]) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Upload proof to IPFS
      const proofResult = await ipfsService.createDeliveryProofPackage(proofFiles, {
        deliveryId,
        timestamp: new Date().toISOString(),
        proofType: 'photo',
        courierAddress: address,
        shipperAddress: state.activeDelivery?.shipperId || '',
      });

      // Complete delivery on blockchain
      await blockchainService.completeDelivery(deliveryId, proofResult.ipfsHash);

      // Update delivery status
      await updateDeliveryStatus(deliveryId, 'completed');

    } catch (error) {
      console.error('Error completing delivery:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to complete delivery' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Cancel delivery
  const cancelDelivery = async (deliveryId: string) => {
    try {
      await updateDeliveryStatus(deliveryId, 'cancelled');
      
      // Refund escrow if needed
      await blockchainService.refundEscrow(deliveryId);
    } catch (error) {
      console.error('Error cancelling delivery:', error);
      throw error;
    }
  };

  // Find available couriers
  const findAvailableCouriers = async (deliveryId: string) => {
    try {
      const response = await apiService.findMatchingCouriers(deliveryId);
      if (response.success && response.data) {
        dispatch({ type: 'SET_AVAILABLE_COURIERS', payload: response.data });
      }
    } catch (error) {
      console.error('Error finding couriers:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to find available couriers' });
    }
  };

  // Select courier
  const selectCourier = (courier: Courier) => {
    dispatch({ type: 'SET_SELECTED_COURIER', payload: courier });
  };

  // Accept delivery (for couriers)
  const acceptDelivery = async (deliveryId: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      await updateDeliveryStatus(deliveryId, 'matched', address);
    } catch (error) {
      console.error('Error accepting delivery:', error);
      throw error;
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId: string) => {
    try {
      await apiService.markNotificationRead(notificationId);
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Refresh token balances
  const refreshTokenBalances = async () => {
    if (!address) return;

    try {
      const [usdcBalance, shipBalance] = await Promise.all([
        blockchainService.getTokenBalance(address as `0x${string}`, 'USDC'),
        blockchainService.getTokenBalance(address as `0x${string}`, 'SHIP'),
      ]);

      dispatch({ 
        type: 'SET_TOKEN_BALANCES', 
        payload: { usdc: usdcBalance, ship: shipBalance } 
      });
    } catch (error) {
      console.error('Error refreshing token balances:', error);
    }
  };

  // Transfer tokens
  const transferTokens = async (to: string, amount: number, token: 'USDC' | 'SHIP') => {
    if (!address) throw new Error('Wallet not connected');

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await blockchainService.transferTokens(to as `0x${string}`, amount, token);
      await refreshTokenBalances();
      
    } catch (error) {
      console.error('Error transferring tokens:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to transfer tokens' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const contextValue: ShipChainContextType = {
    state,
    connectWallet,
    disconnectWallet,
    updateUserProfile,
    createDelivery,
    updateDeliveryStatus,
    completeDelivery,
    cancelDelivery,
    findAvailableCouriers,
    selectCourier,
    acceptDelivery,
    markNotificationRead,
    refreshTokenBalances,
    transferTokens,
  };

  return (
    <ShipChainContext.Provider value={contextValue}>
      {children}
    </ShipChainContext.Provider>
  );
}

// Hook to use the context
export function useShipChain() {
  const context = useContext(ShipChainContext);
  if (context === undefined) {
    throw new Error('useShipChain must be used within a ShipChainProvider');
  }
  return context;
}
