import React, { useState } from 'react';
import { Package, MapPin, Clock, User, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { useDelivery } from '../context/DeliveryContext';
import Card from './ui/Card';
import Button from './ui/Button';

function DeliveryList() {
  const { state, dispatch } = useDelivery();
  const { deliveries, couriers } = state;
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showCourierModal, setShowCourierModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-500/20 text-orange-300';
      case 'in-progress': return 'bg-blue-500/20 text-blue-300';
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'cancelled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Package className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'border-l-green-400';
      case 'medium': return 'border-l-yellow-400';
      case 'high': return 'border-l-orange-400';
      case 'urgent': return 'border-l-red-400';
      default: return 'border-l-gray-400';
    }
  };

  const handleAssignCourier = (deliveryId, courierId) => {
    dispatch({
      type: 'UPDATE_DELIVERY_STATUS',
      payload: { deliveryId, status: 'in-progress', courierId }
    });
    setShowCourierModal(false);
    setSelectedDelivery(null);
  };

  const availableCouriers = couriers.filter(c => c.availabilityStatus === 'available');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">My Shipments</h1>
        <p className="text-white/70">Track and manage your delivery requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {['all', 'pending', 'in-progress', 'completed'].map((filter) => (
          <Button
            key={filter}
            variant="ghost"
            className="text-white hover:bg-white/10 capitalize"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveries.map((delivery) => {
          const assignedCourier = delivery.courierId ? couriers.find(c => c.courierId === delivery.courierId) : null;
          
          return (
            <Card key={delivery.deliveryId} className={`bg-white/10 backdrop-blur-md border-white/20 border-l-4 ${getUrgencyColor(delivery.urgency)}`}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">#{delivery.deliveryId}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                    {getStatusIcon(delivery.status)}
                    {delivery.status}
                  </span>
                </div>

                {/* Package Details */}
                <div>
                  <p className="text-white font-medium mb-1">{delivery.packageDetails}</p>
                  <p className="text-white/70 text-sm capitalize">Urgency: {delivery.urgency}</p>
                </div>

                {/* Locations */}
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

                {/* Courier Info */}
                {assignedCourier && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {assignedCourier.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{assignedCourier.name}</p>
                          <p className="text-white/70 text-xs">{assignedCourier.vehicle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">{assignedCourier.rating}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-white/70 text-sm">Payment</span>
                  <span className="text-white font-medium">${delivery.paymentAmount} {delivery.paymentToken}</span>
                </div>

                {/* Actions */}
                {delivery.status === 'pending' && (
                  <Button
                    onClick={() => {
                      setSelectedDelivery(delivery);
                      setShowCourierModal(true);
                    }}
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Assign Courier
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {deliveries.length === 0 && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center py-12">
          <Package className="w-12 h-12 text-white/50 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No deliveries yet</h3>
          <p className="text-white/70 mb-6">Create your first delivery request to get started</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Create Delivery
          </Button>
        </Card>
      )}

      {/* Courier Selection Modal */}
      {showCourierModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-white/95 backdrop-blur-md max-w-md w-full">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Available Couriers</h3>
              <p className="text-gray-600">Select a courier for delivery #{selectedDelivery.deliveryId}</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {availableCouriers.map((courier) => (
                <div
                  key={courier.courierId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAssignCourier(selectedDelivery.deliveryId, courier.courierId)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-medium">
                      {courier.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{courier.name}</p>
                      <p className="text-gray-600 text-sm">{courier.vehicle} • {courier.deliveryHistory} deliveries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-900">{courier.rating}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              onClick={() => setShowCourierModal(false)}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

export default DeliveryList;