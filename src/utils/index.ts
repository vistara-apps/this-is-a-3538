// Utility functions for ShipChain application

/**
 * Format currency values
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format token amounts
 */
export const formatTokenAmount = (amount: number, symbol: string, decimals: number = 2): string => {
  return `${amount.toFixed(decimals)} ${symbol}`;
};

/**
 * Truncate wallet address for display
 */
export const truncateAddress = (address: string, startLength: number = 6, endLength: number = 4): string => {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

/**
 * Generate unique delivery ID
 */
export const generateDeliveryId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `del_${timestamp}_${randomStr}`;
};

/**
 * Calculate delivery fee based on distance and urgency
 */
export const calculateDeliveryFee = (
  distance: number, // in kilometers
  urgency: 'standard' | 'urgent' | 'express',
  packageSize: 'small' | 'medium' | 'large'
): number => {
  const baseFee = 5; // Base fee in USDC
  const distanceFee = distance * 0.5; // $0.50 per km
  
  const urgencyMultiplier = {
    standard: 1,
    urgent: 1.5,
    express: 2,
  };
  
  const sizeMultiplier = {
    small: 1,
    medium: 1.2,
    large: 1.5,
  };
  
  return Math.round((baseFee + distanceFee) * urgencyMultiplier[urgency] * sizeMultiplier[packageSize] * 100) / 100;
};

/**
 * Calculate estimated delivery time
 */
export const calculateEstimatedDeliveryTime = (
  distance: number, // in kilometers
  urgency: 'standard' | 'urgent' | 'express'
): number => {
  const baseSpeed = 30; // km/h average speed
  const baseTime = (distance / baseSpeed) * 60; // in minutes
  
  const urgencyFactor = {
    standard: 1.2, // Allow extra time
    urgent: 1,
    express: 0.8, // Faster delivery
  };
  
  return Math.round(baseTime * urgencyFactor[urgency]);
};

/**
 * Format time duration
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return time.toLocaleDateString();
};

/**
 * Validate wallet address
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Get urgency color class
 */
export const getUrgencyColor = (urgency: 'standard' | 'urgent' | 'express'): string => {
  const colors = {
    standard: 'text-green-400',
    urgent: 'text-yellow-400',
    express: 'text-red-400',
  };
  return colors[urgency];
};

/**
 * Get status color class
 */
export const getStatusColor = (status: string): string => {
  const colors = {
    pending: 'text-yellow-400',
    matched: 'text-blue-400',
    'in-progress': 'text-purple-400',
    completed: 'text-green-400',
    cancelled: 'text-red-400',
  };
  return colors[status as keyof typeof colors] || 'text-gray-400';
};

/**
 * Get status background color class
 */
export const getStatusBgColor = (status: string): string => {
  const colors = {
    pending: 'bg-yellow-500/20',
    matched: 'bg-blue-500/20',
    'in-progress': 'bg-purple-500/20',
    completed: 'bg-green-500/20',
    cancelled: 'bg-red-500/20',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-500/20';
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generate random color for avatars
 */
export const generateAvatarColor = (seed: string): string => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Generate QR code data for delivery verification
 */
export const generateDeliveryQRData = (deliveryId: string, courierAddress: string): string => {
  return JSON.stringify({
    deliveryId,
    courierAddress,
    timestamp: Date.now(),
    type: 'delivery_verification',
  });
};

/**
 * Parse QR code data
 */
export const parseQRData = (qrData: string): any => {
  try {
    return JSON.parse(qrData);
  } catch (error) {
    console.error('Invalid QR code data:', error);
    return null;
  }
};

/**
 * Get current location
 */
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};
