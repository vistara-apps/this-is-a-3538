// IPFS service using Pinata for decentralized storage of delivery proofs
import axios, { AxiosInstance } from 'axios';

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface DeliveryProofMetadata {
  deliveryId: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
  proofType: 'photo' | 'signature' | 'qr-code';
  courierAddress: string;
  shipperAddress: string;
}

class IPFSService {
  private client: AxiosInstance;
  private readonly pinataApiKey: string;
  private readonly pinataSecretKey: string;

  constructor() {
    this.pinataApiKey = process.env.VITE_PINATA_API_KEY || '';
    this.pinataSecretKey = process.env.VITE_PINATA_SECRET_KEY || '';

    this.client = axios.create({
      baseURL: 'https://api.pinata.cloud',
      timeout: 30000,
      headers: {
        'pinata_api_key': this.pinataApiKey,
        'pinata_secret_api_key': this.pinataSecretKey,
      },
    });
  }

  /**
   * Upload delivery proof file to IPFS via Pinata
   */
  async uploadDeliveryProof(
    file: File,
    metadata: DeliveryProofMetadata
  ): Promise<{ ipfsHash: string; pinSize: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Add metadata
      const pinataMetadata = {
        name: `delivery-proof-${metadata.deliveryId}`,
        keyvalues: {
          deliveryId: metadata.deliveryId,
          proofType: metadata.proofType,
          timestamp: metadata.timestamp,
          courierAddress: metadata.courierAddress,
          shipperAddress: metadata.shipperAddress,
          ...(metadata.location && {
            latitude: metadata.location.lat.toString(),
            longitude: metadata.location.lng.toString(),
          }),
        },
      };

      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

      const pinataOptions = {
        cidVersion: 1,
        customPinPolicy: {
          regions: [
            {
              id: 'FRA1',
              desiredReplicationCount: 2,
            },
            {
              id: 'NYC1',
              desiredReplicationCount: 2,
            },
          ],
        },
      };

      formData.append('pinataOptions', JSON.stringify(pinataOptions));

      const response = await this.client.post<PinataResponse>(
        '/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload delivery proof to IPFS');
    }
  }

  /**
   * Upload JSON metadata to IPFS
   */
  async uploadMetadata(
    metadata: Record<string, any>,
    name: string
  ): Promise<{ ipfsHash: string; pinSize: number }> {
    try {
      const response = await this.client.post<PinataResponse>(
        '/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            pinataMetadata: {
              name: name,
            },
            pinataOptions: {
              cidVersion: 1,
            },
          },
        }
      );

      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
      };
    } catch (error) {
      console.error('IPFS metadata upload error:', error);
      throw new Error('Failed to upload metadata to IPFS');
    }
  }

  /**
   * Get file from IPFS via Pinata gateway
   */
  getFileUrl(ipfsHash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  }

  /**
   * Get file metadata from Pinata
   */
  async getFileMetadata(ipfsHash: string): Promise<any> {
    try {
      const response = await this.client.get(`/data/pinList?hashContains=${ipfsHash}`);
      return response.data.rows[0] || null;
    } catch (error) {
      console.error('Error fetching file metadata:', error);
      throw new Error('Failed to fetch file metadata');
    }
  }

  /**
   * Unpin file from IPFS (remove from Pinata)
   */
  async unpinFile(ipfsHash: string): Promise<boolean> {
    try {
      await this.client.delete(`/pinning/unpin/${ipfsHash}`);
      return true;
    } catch (error) {
      console.error('Error unpinning file:', error);
      return false;
    }
  }

  /**
   * Test Pinata connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/data/testAuthentication');
      return response.data.message === 'Congratulations! You are communicating with the Pinata API!';
    } catch (error) {
      console.error('Pinata connection test failed:', error);
      return false;
    }
  }

  /**
   * Create delivery proof package with multiple files
   */
  async createDeliveryProofPackage(
    files: File[],
    metadata: DeliveryProofMetadata
  ): Promise<{ ipfsHash: string; files: string[] }> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileMetadata = {
          ...metadata,
          fileIndex: index,
          fileName: file.name,
        };
        return await this.uploadDeliveryProof(file, fileMetadata);
      });

      const uploadResults = await Promise.all(uploadPromises);
      
      // Create a manifest file with all the IPFS hashes
      const manifest = {
        deliveryId: metadata.deliveryId,
        timestamp: metadata.timestamp,
        proofType: metadata.proofType,
        files: uploadResults.map((result, index) => ({
          fileName: files[index].name,
          ipfsHash: result.ipfsHash,
          size: result.pinSize,
        })),
        location: metadata.location,
        courierAddress: metadata.courierAddress,
        shipperAddress: metadata.shipperAddress,
      };

      const manifestResult = await this.uploadMetadata(
        manifest,
        `delivery-proof-manifest-${metadata.deliveryId}`
      );

      return {
        ipfsHash: manifestResult.ipfsHash,
        files: uploadResults.map(r => r.ipfsHash),
      };
    } catch (error) {
      console.error('Error creating delivery proof package:', error);
      throw new Error('Failed to create delivery proof package');
    }
  }

  /**
   * Verify delivery proof integrity
   */
  async verifyDeliveryProof(ipfsHash: string): Promise<{
    isValid: boolean;
    metadata?: any;
    error?: string;
  }> {
    try {
      const metadata = await this.getFileMetadata(ipfsHash);
      
      if (!metadata) {
        return {
          isValid: false,
          error: 'Proof not found on IPFS',
        };
      }

      // Check if the file is still pinned and accessible
      const fileUrl = this.getFileUrl(ipfsHash);
      const response = await axios.head(fileUrl, { timeout: 10000 });
      
      return {
        isValid: response.status === 200,
        metadata: metadata.metadata,
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Failed to verify proof integrity',
      };
    }
  }
}

// Export singleton instance
export const ipfsService = new IPFSService();
export default ipfsService;
