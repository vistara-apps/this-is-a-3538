import React, { useState } from 'react';
import { Truck, Package, Star, MapPin, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useDelivery } from '../context/DeliveryContext';
import Card from './ui/Card';
import Button from './ui/Button';

function CourierDashboard() {
  const { state, dispatch } = useDelivery();
  const { deliveries, couriers } = state;
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // Mock current courier data
  const currentCourier = couriers[0]; // Simulate logged-in courier
  const availableDeliveries = deliveries.filter(d => d.status === 'pending');
  const myActiveDeliveries = deliveries.filter(d => d.courierId === currentCourier.courierId && d.status === 'in-progress');
  const myCompletedDeliveries = deliveries.filter(d => d.courierId === currentCourier.courierId && d.status === 'completed');

  const handleAcceptDelivery = (deliveryId) => {
    dispatch({
      type: 'UPDATE_DELIVERY_STATUS',
      payload: { 
        deliveryId, 
        status: 'in-progress', 
        courierId: currentCourier.courierId 
      }
    });
    
    // Add SHIP tokens as reward
    dispatch({ type: 'ADD_SHIP_TOKENS', payload: 10 });
  };

  const handleCompleteDelivery = (deliveryId) => {
    dispatch({
      type: 'COMPLETE_DELIVERY',
      payload: { 
        deliveryId, 
        proof: 'Delivery completed with photo verification'
      }
    });
    
    // Add SHIP tokens as completion reward
    dispatch({ type: 'ADD_SHIP_TOKENS', payload: 25 });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'urgent': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getUrgencyMultiplier = (urgency) => {
    switch (urgency) {
      case 'low': return 1;
      case 'medium': return 1.25;
      case 'high': return 1.5;
      case 'urgent': return 2;
      default: return 1;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Courier Dashboard</h1>
        <p className="text-white/70">Manage your deliveries and earnings</p>
      </div>

      {/* Courier Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-white">{currentCourier.rating}</span>
              </div>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Deliveries</p>
              <p className="text-2xl font-bold text-white">{currentCourier.deliveryHistory}</p>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Active Deliveries</p>
              <p className="text-2xl font-bold text-white">{myActiveDeliveries.length}</p>
            </div>
            <Truck className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Status</p>
              <p className="text-2xl font-bold text-white capitalize">{currentCourier.availabilityStatus}</p>
            </div>
            <div className={`w-8 h-8 rounded-full ${currentCourier.availabilityStatus === 'available' ? 'bg-green-400' : 'bg-orange-400'}`} />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Deliveries */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Available Deliveries</h2>
          <div className="space-y-4">
            {availableDeliveries.map((delivery) => (
              <Card key={delivery.deliveryId} className="bg-white/10 backdrop-blur-md border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">#{delivery.deliveryId}</span>
                    </div>
                    <span className={`text-sm font-medium capitalize ${getUrgencyColor(delivery.urgency)}`}>
                      {delivery.urgency} priority
                    </span>
                  </div>

                  <p className="text-white font-medium">{delivery.packageDetails}</p>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-green-400 text-xs">Pickup</p>
                        <p className="text-white/70 text-sm">{delivery.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-400 text-xs">Dropoff</p>
                        <p className="text-white/70 text-sm">{delivery.dropoffLocation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-white font-medium">
                          ${Math.round(delivery.paymentAmount * getUrgencyMultiplier(delivery.urgency))}
                        </span>
                      </div>
                      <div className="text-yellow-400 text-sm">+{Math.round(delivery.paymentAmount / 2)} $SHIP</div>
                    </div>
                    <Button
                      onClick={() => handleAcceptDelivery(delivery.deliveryId)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {availableDeliveries.length === 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center py-8">
                <Package className="w-8 h-8 text-white/50 mx-auto mb-3" />
                <p className="text-white/70">No available deliveries</p>
              </Card>
            )}
          </div>
        </div>

        {/* Active & Recent Deliveries */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">My Deliveries</h2>
          
          {/* Active Deliveries */}
          {myActiveDeliveries.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-3">Active</h3>
              <div className="space-y-3">
                {myActiveDeliveries.map((delivery) => (
                  <Card key={delivery.deliveryId} className="bg-blue-500/10 border-blue-500/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">#{delivery.deliveryId}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                          <Truck className="w-3 h-3" />
                          In Progress
                        </span>
                      </div>
                      <p className="text-white/70 text-sm">{delivery.packageDetails}</p>
                      <Button
                        onClick={() => handleCompleteDelivery(delivery.deliveryId)}
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Delivered
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recent Completed */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Recent Completed</h3>
            <div className="space-y-3">
              {myCompletedDeliveries.slice(0, 3).map((delivery) => (
                <Card key={delivery.deliveryId} className="bg-green-500/10 border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">#{delivery.deliveryId}</span>
                      <p className="text-white/70 text-sm">{delivery.packageDetails}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                      <p className="text-green-400 text-sm mt-1">+${delivery.paymentAmount}</p>
                    </div>
                  </div>
                </Card>
              ))}
              
              {myCompletedDeliveries.length === 0 && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center py-6">
                  <CheckCircle className="w-6 h-6 text-white/50 mx-auto mb-2" />
                  <p className="text-white/70 text-sm">No completed deliveries yet</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Credentials & Achievements */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-white font-medium mb-4">Credentials & Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {currentCourier.onchainCredentials.map((credential) => (
            <span
              key={credential}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
            >
              {credential}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default CourierDashboard;