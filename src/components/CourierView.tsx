import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ArrowLeft, MapPin, Package, DollarSign, Clock, Star, User } from 'lucide-react';

interface CourierViewProps {
  onBack: () => void;
}

interface DeliveryJob {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  packageDescription: string;
  packageSize: 'small' | 'medium' | 'large';
  urgency: 'standard' | 'urgent' | 'express';
  paymentAmount: number;
  paymentToken: 'USDC' | 'SHIP';
  distance: number;
  estimatedTime: number;
  shipperRating: number;
  shipperName: string;
  createdAt: Date;
}

export function CourierView({ onBack }: CourierViewProps) {
  const [selectedJob, setSelectedJob] = useState<DeliveryJob | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  const availableJobs: DeliveryJob[] = [
    {
      id: '1',
      pickupAddress: 'Downtown Tech Hub, 123 Innovation Dr',
      dropoffAddress: 'University Campus, 456 Academic Way',
      packageDescription: 'Important documents in envelope',
      packageSize: 'small',
      urgency: 'urgent',
      paymentAmount: 28.50,
      paymentToken: 'USDC',
      distance: 3.2,
      estimatedTime: 25,
      shipperRating: 4.8,
      shipperName: 'TechCorp Inc',
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: '2',
      pickupAddress: 'Shopping Mall, 789 Retail Plaza',
      dropoffAddress: 'Residential Area, 321 Suburb Lane',
      packageDescription: 'Electronics (smartphone)',
      packageSize: 'small',
      urgency: 'standard',
      paymentAmount: 18.00,
      paymentToken: 'USDC',
      distance: 5.7,
      estimatedTime: 35,
      shipperRating: 4.9,
      shipperName: 'Sarah Johnson',
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      id: '3',
      pickupAddress: 'Medical Center, 555 Health Ave',
      dropoffAddress: 'Senior Living, 888 Care Street',
      packageDescription: 'Medical supplies',
      packageSize: 'medium',
      urgency: 'express',
      paymentAmount: 45.00,
      paymentToken: 'USDC',
      distance: 2.1,
      estimatedTime: 15,
      shipperRating: 5.0,
      shipperName: 'MedCare Services',
      createdAt: new Date(Date.now() - 8 * 60 * 1000),
    },
  ];

  const handleAcceptJob = async (job: DeliveryJob) => {
    try {
      setIsAccepting(true);
      setSelectedJob(job);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Job accepted! Please proceed to pickup location: ${job.pickupAddress}`);
      onBack();
    } catch (error) {
      console.error('Error accepting job:', error);
      alert('Error accepting job. Please try again.');
    } finally {
      setIsAccepting(false);
      setSelectedJob(null);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'express': return 'text-red-600 bg-red-100';
      case 'urgent': return 'text-orange-600 bg-orange-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'small': return '📦';
      case 'medium': return '📫';
      case 'large': return '📮';
      default: return '📦';
    }
  };

  const timeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-2xl font-bold text-white">Available Delivery Jobs</h1>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-100">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Jobs Available</p>
              <p className="text-xl font-bold text-gray-900">{availableJobs.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-green-100">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Potential Earnings</p>
              <p className="text-xl font-bold text-gray-900">
                ${availableJobs.reduce((sum, job) => sum + job.paymentAmount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-purple-100">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Time</p>
              <p className="text-xl font-bold text-gray-900">
                {Math.round(availableJobs.reduce((sum, job) => sum + job.estimatedTime, 0) / availableJobs.length)}m
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {availableJobs.map((job) => (
          <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getSizeIcon(job.packageSize)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.packageDescription}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-3 h-3" />
                        <span>{job.shipperName}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{job.shipperRating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                      {job.urgency}
                    </span>
                    <span className="text-xs text-gray-500">{timeAgo(job.createdAt)}</span>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="text-gray-900 font-medium">{job.pickupAddress}</span>
                  <span className="text-gray-400">→</span>
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-gray-900 font-medium">{job.dropoffAddress}</span>
                </div>

                {/* Details */}
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{job.distance} km</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>~{job.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package className="w-3 h-3" />
                    <span className="capitalize">{job.packageSize} package</span>
                  </div>
                </div>
              </div>

              {/* Payment and Action */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${job.paymentAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">{job.paymentToken}</div>
                </div>
                <Button
                  onClick={() => handleAcceptJob(job)}
                  loading={isAccepting && selectedJob?.id === job.id}
                  disabled={isAccepting}
                  size="lg"
                >
                  Accept Job
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {availableJobs.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Available</h3>
          <p className="text-gray-600">Check back soon for new delivery opportunities!</p>
        </Card>
      )}
    </div>
  );
}