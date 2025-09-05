// Core data model types based on PRD specifications

export interface Shipper {
  shipperId: string;
  walletAddress: string;
  deliveryHistory: Delivery[];
}

export interface Courier {
  courierId: string;
  walletAddress: string;
  rating: number;
  availabilityStatus: 'available' | 'busy' | 'offline';
  deliveryHistory: Delivery[];
  onchainCredentials: string[];
  name?: string;
  vehicle?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Delivery {
  deliveryId: string;
  shipperId: string;
  courierId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  packageDetails: string;
  status: 'pending' | 'matched' | 'in-progress' | 'completed' | 'cancelled';
  paymentAmount: number;
  paymentToken: 'USDC' | 'SHIP';
  deliveryProof?: string; // IPFS hash
  createdAt: string;
  completedAt?: string;
  urgency: 'standard' | 'urgent' | 'express';
  specialInstructions?: string;
  packageSize: 'small' | 'medium' | 'large';
  estimatedDeliveryTime?: number; // minutes
}

export interface Token {
  tokenId: string;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export interface DeliveryProof {
  deliveryId: string;
  proofType: 'photo' | 'signature' | 'qr-code';
  ipfsHash: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface UserProfile {
  walletAddress: string;
  userType: 'shipper' | 'courier';
  shipTokenBalance: number;
  reputation: number;
  totalDeliveries: number;
  joinedAt: string;
}

export interface PaymentSession {
  sessionId: string;
  deliveryId: string;
  amount: number;
  token: string;
  escrowAddress: string;
  status: 'pending' | 'locked' | 'released' | 'refunded';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component prop types
export interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export interface UserTypeProps {
  userType: 'shipper' | 'courier';
  onUserTypeChange: (type: 'shipper' | 'courier') => void;
}

// Form types
export interface CreateDeliveryForm {
  pickupAddress: string;
  dropoffAddress: string;
  packageDescription: string;
  packageSize: 'small' | 'medium' | 'large';
  urgency: 'standard' | 'urgent' | 'express';
  paymentAmount: string;
  paymentToken: 'USDC' | 'SHIP';
  specialInstructions: string;
}

export interface CourierRegistrationForm {
  name: string;
  vehicle: string;
  phoneNumber: string;
  emergencyContact: string;
  insuranceProvider?: string;
}

// Smart contract types
export interface EscrowContract {
  address: string;
  abi: any[];
}

export interface ShipTokenContract {
  address: string;
  abi: any[];
}

// Location types
export interface Location {
  lat: number;
  lng: number;
  address: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'delivery_matched' | 'delivery_completed' | 'payment_received' | 'rating_received';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  deliveryId?: string;
}
