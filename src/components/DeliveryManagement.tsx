import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ArrowLeft, MapPin, Package, Clock, User, Star, Camera, CheckCircle } from 'lucide-react';

interface DeliveryManagementProps {
  onBack: () => void;
}

interface Delivery {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  packageDescription: string;
  status: 'pending' | 'accepted' | 'picked-up' | 'in-transit' | 'delivered' | 'completed';
  amount: number;
  courier?: {
    name: string;
    rating: number;
    phone: string;
  };
  shipper?: {
    name: string;
    rating: number;
  };
  createdAt: Date;
  estimatedDelivery?: Date;
  completedAt?: Date;
  urgency: 'standard' | 'urgent' | 'express';
}

export function DeliveryManagement({ onBack }: DeliveryManagementProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const deliveries: Delivery[] = [
    {
      id: '1',
      pickupAddress: 'Downtown Tech Hub, 123 Innovation Dr',
      dropoffAddress: 'University Campus, 456 Academic Way',
      packageDescription: 'Important documents',
      status: 'in-transit',
      amount: 28.50,
      courier: { name: 'Alex Chen', rating: 4.9, phone: '+1 (555) 123-4567' },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
      urgency: 'urgent',
    },
    {
      id: '2',
      pickupAddress: 'Shopping Mall, 789 Retail Plaza',
      dropoffAddress: 'Residential Area, 321 Suburb Lane',
      packageDescription: 'Electronics (smartphone)',
      status: 'completed',
      amount: 18.00,
      courier: { name: 'Maria Santos', rating: 5.0, phone: '+1 (555) 987-6543' },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      urgency: 'standard',
    },
    {
      id: '3',
      pickupAddress: 'Medical Center, 555 Health Ave',
      dropoffAddress: 'Senior Living, 888 Care Street',
      packageDescription: 'Medical supplies',
      status: 'pending',
      amount: 45.00,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      urgency: 'express',
    },
  ];

  const filteredDeliveries = deliveries.filter(delivery => {
    if (filter === 'active') return ['pending', 'accepted', 'picked-up', 'in-transit'].includes(delivery.status);
    if (filter === 'completed') return ['delivered', 'completed'].includes(delivery.status);
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'picked-up': return 'text-purple-600 bg-purple-100';
      case 'in-transit': return 'text-orange-600 bg-orange-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'express': return 'text-red-600';
      case 'urgent': return 'text-orange-600';
      default: return 'text-green-600';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleConfirmDelivery = async (deliveryId: string) => {
    // Simulate confirming delivery completion
    alert('Delivery confirmed! Payment has been released to the courier.');
  };

  const handleUploadProof = async (deliveryId: string) => {
    // Simulate uploading delivery proof
    alert('Delivery proof uploaded successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-2xl font-bold text-white">My Deliveries</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-white/10 rounded-lg p-1">
        {[
          { key: 'all', label: 'All Deliveries' },
          { key: 'active', label: 'Active' },
          { key: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
              filter === tab.key
                ? 'bg-white text-purple-600'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Delivery List */}
      <div className="space-y-4">
        {filteredDeliveries.map((delivery) => (
          <Card key={delivery.id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{delivery.packageDescription}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>#{delivery.id}</span>
                        <span className={`font-medium ${getUrgencyColor(delivery.urgency)}`}>
                          {delivery.urgency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                    {delivery.status.replace('-', ' ')}
                  </span>
                </div>

                {/* Route */}
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="text-gray-900">{delivery.pickupAddress}</span>
                  <span className="text-gray-400">→</span>
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-gray-900">{delivery.dropoffAddress}</span>
                </div>

                {/* Courier Info */}
                {delivery.courier && (
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{delivery.courier.name}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-gray-600">{delivery.courier.rating}</span>
                    {delivery.status === 'in-transit' && (
                      <span className="text-blue-600 font-medium ml-2">
                        📞 {delivery.courier.phone}
                      </span>
                    )}
                  </div>
                )}

                {/* Timing */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Created: {formatTime(delivery.createdAt)}</span>
                  </div>
                  {delivery.estimatedDelivery && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Est. Delivery: {formatTime(delivery.estimatedDelivery)}</span>
                    </div>
                  )}
                  {delivery.completedAt && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Completed: {formatTime(delivery.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions and Payment */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    ${delivery.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">USDC</div>
                </div>

                <div className="flex space-x-2">
                  {delivery.status === 'in-transit' && (
                    <Button size="sm" variant="outline">
                      Track
                    </Button>
                  )}
                  
                  {delivery.status === 'delivered' && (
                    <Button 
                      size="sm"
                      onClick={() => handleConfirmDelivery(delivery.id)}
                    >
                      Confirm & Release Payment
                    </Button>
                  )}

                  {delivery.status === 'picked-up' && delivery.courier && (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleUploadProof(delivery.id)}
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Upload Proof
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {filter === 'all' ? '' : filter} deliveries found
          </h3>
          <p className="text-gray-600">
            {filter === 'completed' 
              ? "You haven't completed any deliveries yet." 
              : "Create your first delivery to get started!"
            }
          </p>
        </Card>
      )}
    </div>
  );
}