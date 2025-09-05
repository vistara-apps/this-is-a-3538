// Centralized API service layer for ShipChain
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, Delivery, Courier, DeliveryProof, UserProfile } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Delivery endpoints
  async createDelivery(deliveryData: Partial<Delivery>): Promise<ApiResponse<Delivery>> {
    try {
      const response: AxiosResponse<ApiResponse<Delivery>> = await this.client.post('/deliveries', deliveryData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDeliveries(filters?: {
    status?: string;
    shipperId?: string;
    courierId?: string;
  }): Promise<ApiResponse<Delivery[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Delivery[]>> = await this.client.get('/deliveries', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDelivery(deliveryId: string): Promise<ApiResponse<Delivery>> {
    try {
      const response: AxiosResponse<ApiResponse<Delivery>> = await this.client.get(`/deliveries/${deliveryId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: string,
    courierId?: string
  ): Promise<ApiResponse<Delivery>> {
    try {
      const response: AxiosResponse<ApiResponse<Delivery>> = await this.client.patch(`/deliveries/${deliveryId}`, {
        status,
        courierId,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Courier endpoints
  async getCouriers(filters?: {
    availabilityStatus?: string;
    location?: { lat: number; lng: number; radius: number };
  }): Promise<ApiResponse<Courier[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Courier[]>> = await this.client.get('/couriers', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCourier(courierId: string): Promise<ApiResponse<Courier>> {
    try {
      const response: AxiosResponse<ApiResponse<Courier>> = await this.client.get(`/couriers/${courierId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCourierStatus(
    courierId: string,
    status: 'available' | 'busy' | 'offline'
  ): Promise<ApiResponse<Courier>> {
    try {
      const response: AxiosResponse<ApiResponse<Courier>> = await this.client.patch(`/couriers/${courierId}`, {
        availabilityStatus: status,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // User profile endpoints
  async getUserProfile(walletAddress: string): Promise<ApiResponse<UserProfile>> {
    try {
      const response: AxiosResponse<ApiResponse<UserProfile>> = await this.client.get(`/users/${walletAddress}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUserProfile(walletAddress: string, profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const response: AxiosResponse<ApiResponse<UserProfile>> = await this.client.patch(`/users/${walletAddress}`, profileData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Rating and reputation endpoints
  async submitRating(
    deliveryId: string,
    rating: number,
    review?: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response: AxiosResponse<ApiResponse<{ success: boolean }>> = await this.client.post('/ratings', {
        deliveryId,
        rating,
        review,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Matching algorithm endpoint
  async findMatchingCouriers(deliveryId: string): Promise<ApiResponse<Courier[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Courier[]>> = await this.client.post(`/deliveries/${deliveryId}/match`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delivery proof endpoints
  async uploadDeliveryProof(
    deliveryId: string,
    proofData: FormData
  ): Promise<ApiResponse<DeliveryProof>> {
    try {
      const response: AxiosResponse<ApiResponse<DeliveryProof>> = await this.client.post(
        `/deliveries/${deliveryId}/proof`,
        proofData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Token balance endpoints
  async getTokenBalance(walletAddress: string, tokenSymbol: string): Promise<ApiResponse<{ balance: number }>> {
    try {
      const response: AxiosResponse<ApiResponse<{ balance: number }>> = await this.client.get(
        `/tokens/${tokenSymbol}/balance/${walletAddress}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Notification endpoints
  async getNotifications(walletAddress: string): Promise<ApiResponse<any[]>> {
    try {
      const response: AxiosResponse<ApiResponse<any[]>> = await this.client.get(`/notifications/${walletAddress}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markNotificationRead(notificationId: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response: AxiosResponse<ApiResponse<{ success: boolean }>> = await this.client.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error - please check your connection');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
