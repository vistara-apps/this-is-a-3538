import React, { createContext, useContext, useReducer } from 'react';

const DeliveryContext = createContext();

const initialState = {
  deliveries: [
    {
      deliveryId: '1',
      shipperId: 'shipper1',
      courierId: null,
      pickupLocation: '123 Main St, New York, NY',
      dropoffLocation: '456 Broadway, New York, NY',
      packageDetails: 'Electronics - Handle with care',
      status: 'pending',
      paymentAmount: 25,
      paymentToken: 'USDC',
      deliveryProof: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      urgency: 'high'
    },
    {
      deliveryId: '2',
      shipperId: 'shipper2',
      courierId: 'courier1',
      pickupLocation: '789 Park Ave, New York, NY',
      dropoffLocation: '321 Wall St, New York, NY',
      packageDetails: 'Documents - Confidential',
      status: 'in-progress',
      paymentAmount: 15,
      paymentToken: 'USDC',
      deliveryProof: null,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: null,
      urgency: 'medium'
    }
  ],
  couriers: [
    {
      courierId: 'courier1',
      walletAddress: '0x1234...',
      rating: 4.8,
      availabilityStatus: 'available',
      deliveryHistory: 47,
      onchainCredentials: ['verified', 'premium'],
      name: 'Alex Rodriguez',
      vehicle: 'Motorcycle'
    },
    {
      courierId: 'courier2',
      walletAddress: '0x5678...',
      rating: 4.6,
      availabilityStatus: 'busy',
      deliveryHistory: 32,
      onchainCredentials: ['verified'],
      name: 'Sarah Chen',
      vehicle: 'Car'
    },
    {
      courierId: 'courier3',
      walletAddress: '0x9abc...',
      rating: 4.9,
      availabilityStatus: 'available',
      deliveryHistory: 89,
      onchainCredentials: ['verified', 'premium', 'express'],
      name: 'Marcus Johnson',
      vehicle: 'Bicycle'
    }
  ],
  userProfile: {
    type: 'shipper', // 'shipper' or 'courier'
    walletAddress: null,
    shipTokenBalance: 150
  }
};

function deliveryReducer(state, action) {
  switch (action.type) {
    case 'ADD_DELIVERY':
      return {
        ...state,
        deliveries: [...state.deliveries, action.payload]
      };
    case 'UPDATE_DELIVERY_STATUS':
      return {
        ...state,
        deliveries: state.deliveries.map(delivery => 
          delivery.deliveryId === action.payload.deliveryId
            ? { ...delivery, status: action.payload.status, courierId: action.payload.courierId }
            : delivery
        )
      };
    case 'COMPLETE_DELIVERY':
      return {
        ...state,
        deliveries: state.deliveries.map(delivery => 
          delivery.deliveryId === action.payload.deliveryId
            ? { 
                ...delivery, 
                status: 'completed', 
                completedAt: new Date().toISOString(),
                deliveryProof: action.payload.proof
              }
            : delivery
        )
      };
    case 'SET_USER_TYPE':
      return {
        ...state,
        userProfile: { ...state.userProfile, type: action.payload }
      };
    case 'SET_WALLET_ADDRESS':
      return {
        ...state,
        userProfile: { ...state.userProfile, walletAddress: action.payload }
      };
    case 'ADD_SHIP_TOKENS':
      return {
        ...state,
        userProfile: { 
          ...state.userProfile, 
          shipTokenBalance: state.userProfile.shipTokenBalance + action.payload 
        }
      };
    default:
      return state;
  }
}

export function DeliveryProvider({ children }) {
  const [state, dispatch] = useReducer(deliveryReducer, initialState);

  return (
    <DeliveryContext.Provider value={{ state, dispatch }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}