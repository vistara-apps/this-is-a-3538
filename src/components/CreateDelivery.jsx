import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Clock, DollarSign } from 'lucide-react';
import { useDelivery } from '../context/DeliveryContext';
import { usePaymentContext } from '../hooks/usePaymentContext';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

function CreateDelivery() {
  const navigate = useNavigate();
  const { dispatch } = useDelivery();
  const { createSession } = usePaymentContext();
  const [isCreating, setIsCreating] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);

  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    packageDetails: '',
    urgency: 'medium',
    paymentAmount: 20,
    paymentToken: 'USDC'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Process payment first
      if (!paymentMade) {
        await createSession();
        setPaymentMade(true);
      }

      // Create delivery
      const newDelivery = {
        deliveryId: Date.now().toString(),
        shipperId: 'current-user',
        courierId: null,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        packageDetails: formData.packageDetails,
        status: 'pending',
        paymentAmount: formData.paymentAmount,
        paymentToken: formData.paymentToken,
        deliveryProof: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
        urgency: formData.urgency
      };

      dispatch({ type: 'ADD_DELIVERY', payload: newDelivery });
      
      // Reset form
      setFormData({
        pickupLocation: '',
        dropoffLocation: '',
        packageDetails: '',
        urgency: 'medium',
        paymentAmount: 20,
        paymentToken: 'USDC'
      });

      navigate('/deliveries');
    } catch (error) {
      console.error('Error creating delivery:', error);
      alert('Error creating delivery. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Delivery</h1>
        <p className="text-white/70">Fill in the details for your package delivery</p>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Package Details */}
          <div>
            <label className="block text-white font-medium mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Package Details
            </label>
            <Input
              name="packageDetails"
              value={formData.packageDetails}
              onChange={handleChange}
              placeholder="Describe your package (e.g., Electronics - Handle with care)"
              required
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-white font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Pickup Location
            </label>
            <Input
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="Enter pickup address"
              required
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
          </div>

          {/* Dropoff Location */}
          <div>
            <label className="block text-white font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Dropoff Location
            </label>
            <Input
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              placeholder="Enter delivery address"
              required
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-white font-medium mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Urgency Level
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low" className="bg-gray-800">Low - Within 24 hours</option>
              <option value="medium" className="bg-gray-800">Medium - Within 6 hours</option>
              <option value="high" className="bg-gray-800">High - Within 2 hours</option>
              <option value="urgent" className="bg-gray-800">Urgent - Within 1 hour</option>
            </select>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Payment Amount
              </label>
              <Input
                type="number"
                name="paymentAmount"
                value={formData.paymentAmount}
                onChange={handleChange}
                min="1"
                required
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Token</label>
              <select
                name="paymentToken"
                value={formData.paymentToken}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USDC" className="bg-gray-800">USDC</option>
                <option value="SHIP" className="bg-gray-800">$SHIP</option>
                <option value="ETH" className="bg-gray-800">ETH</option>
              </select>
            </div>
          </div>

          {/* Urgency Multiplier Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-blue-300 font-medium mb-2">Pricing Info</h3>
            <div className="text-white/70 text-sm space-y-1">
              <p>• Low urgency: Base price</p>
              <p>• Medium urgency: +25% fee</p>
              <p>• High urgency: +50% fee</p>
              <p>• Urgent delivery: +100% fee</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isCreating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isCreating ? (
                <>Creating Delivery...</>
              ) : (
                <>
                  <Package className="w-5 h-5 mr-2" />
                  Create Delivery Request
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Payment Info */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-6">
        <h3 className="text-white font-medium mb-4">Smart Contract Escrow</h3>
        <div className="text-white/70 text-sm space-y-2">
          <p>✓ Payment is held securely in smart contract escrow</p>
          <p>✓ Funds are only released when delivery is confirmed</p>
          <p>✓ Full transparency and immutable transaction records</p>
          <p>✓ Automatic dispute resolution through on-chain logic</p>
        </div>
      </Card>
    </div>
  );
}

export default CreateDelivery;