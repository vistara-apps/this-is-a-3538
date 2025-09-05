import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { ArrowLeft, MapPin, Package, DollarSign, Clock } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

interface CreateDeliveryProps {
  onBack: () => void;
}

interface DeliveryForm {
  pickupAddress: string;
  dropoffAddress: string;
  packageDescription: string;
  packageSize: 'small' | 'medium' | 'large';
  urgency: 'standard' | 'urgent' | 'express';
  paymentAmount: string;
  paymentToken: 'USDC' | 'SHIP';
  specialInstructions: string;
}

export function CreateDelivery({ onBack }: CreateDeliveryProps) {
  const [form, setForm] = useState<DeliveryForm>({
    pickupAddress: '',
    dropoffAddress: '',
    packageDescription: '',
    packageSize: 'medium',
    urgency: 'standard',
    paymentAmount: '',
    paymentToken: 'USDC',
    specialInstructions: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { createSession } = usePaymentContext();

  const updateForm = (field: keyof DeliveryForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Create escrow payment
      await createSession();
      
      // Simulate API call to create delivery
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Delivery request created successfully! Looking for available couriers...');
      onBack();
    } catch (error) {
      console.error('Error creating delivery:', error);
      alert('Error creating delivery. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const urgencyOptions = [
    { value: 'standard', label: 'Standard (2-4 hours)', price: 15 },
    { value: 'urgent', label: 'Urgent (1-2 hours)', price: 25 },
    { value: 'express', label: 'Express (30-60 mins)', price: 40 },
  ];

  const sizeOptions = [
    { value: 'small', label: 'Small (fits in bag)', dimensions: 'Up to 12" x 8" x 4"' },
    { value: 'medium', label: 'Medium (box size)', dimensions: 'Up to 18" x 14" x 8"' },
    { value: 'large', label: 'Large (oversized)', dimensions: 'Up to 36" x 24" x 12"' },
  ];

  const calculateEstimatedPrice = () => {
    const basePrice = urgencyOptions.find(opt => opt.value === form.urgency)?.price || 15;
    const sizeMultiplier = form.packageSize === 'small' ? 1 : form.packageSize === 'medium' ? 1.2 : 1.5;
    return (basePrice * sizeMultiplier).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-2xl font-bold text-white">Create New Delivery</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum ? 'bg-white text-purple-600' : 'bg-white/20 text-white/60'
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNum ? 'bg-white' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-white/80">
          <span>Location Details</span>
          <span>Package Info</span>
          <span>Payment & Review</span>
        </div>
      </div>

      <Card className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Where are we picking up and delivering?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Pickup Address"
                placeholder="Enter pickup location"
                value={form.pickupAddress}
                onChange={(value) => updateForm('pickupAddress', value)}
                icon={<MapPin className="w-4 h-4 text-gray-400" />}
                required
              />
              
              <Input
                label="Dropoff Address"
                placeholder="Enter delivery destination"
                value={form.dropoffAddress}
                onChange={(value) => updateForm('dropoffAddress', value)}
                icon={<MapPin className="w-4 h-4 text-gray-400" />}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => setStep(2)}
                disabled={!form.pickupAddress || !form.dropoffAddress}
              >
                Next: Package Details
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tell us about your package</h2>
            
            <Input
              label="Package Description"
              placeholder="What are you sending?"
              value={form.packageDescription}
              onChange={(value) => updateForm('packageDescription', value)}
              icon={<Package className="w-4 h-4 text-gray-400" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Package Size</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateForm('packageSize', option.value)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      form.packageSize === option.value
                        ? 'border-accent bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500 mt-1">{option.dimensions}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Delivery Urgency</label>
              <div className="space-y-3">
                {urgencyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateForm('urgency', option.value)}
                    className={`w-full p-4 border rounded-lg text-left transition-colors ${
                      form.urgency === option.value
                        ? 'border-accent bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{option.label}</div>
                      </div>
                      <div className="text-sm font-medium">${option.price}+</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Special Instructions (Optional)"
              placeholder="Any special handling instructions?"
              value={form.specialInstructions}
              onChange={(value) => updateForm('specialInstructions', value)}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!form.packageDescription}
              >
                Next: Payment
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Review and Pay</h2>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Delivery Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{form.pickupAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{form.dropoffAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium">{form.packageDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium capitalize">{form.packageSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Urgency:</span>
                  <span className="font-medium capitalize">{form.urgency}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Estimated Total:</span>
                  <span>${calculateEstimatedPrice()} USDC</span>
                </div>
              </div>
            </div>

            {/* Payment Token Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateForm('paymentToken', 'USDC')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    form.paymentToken === 'USDC'
                      ? 'border-accent bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">USDC (Recommended)</div>
                  <div className="text-sm text-gray-500">Stable, widely accepted</div>
                </button>
                <button
                  onClick={() => updateForm('paymentToken', 'SHIP')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    form.paymentToken === 'SHIP'
                      ? 'border-accent bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">$SHIP Tokens</div>
                  <div className="text-sm text-gray-500">10% discount applied</div>
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                loading={isSubmitting}
                size="lg"
              >
                Create Delivery & Pay
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}