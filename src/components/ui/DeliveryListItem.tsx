import React from 'react';
import { MapPin, Package, Clock, DollarSign } from 'lucide-react';
import { Delivery } from '../../types';
import { formatRelativeTime, getStatusColor, getStatusBgColor, getUrgencyColor, formatTokenAmount } from '../../utils';
import { Avatar } from './Avatar';
import { RatingStars } from './RatingStars';

interface DeliveryListItemProps {
  delivery: Delivery;
  variant?: 'pending' | 'inProgress' | 'completed' | 'cancelled';
  onClick?: () => void;
  showCourier?: boolean;
  courierInfo?: {
    name: string;
    rating: number;
    avatar?: string;
  };
  className?: string;
}

export function DeliveryListItem({
  delivery,
  variant = 'pending',
  onClick,
  showCourier = false,
  courierInfo,
  className = ''
}: DeliveryListItemProps) {
  const statusColor = getStatusColor(delivery.status);
  const statusBgColor = getStatusBgColor(delivery.status);
  const urgencyColor = getUrgencyColor(delivery.urgency);

  const getVariantStyles = () => {
    switch (variant) {
      case 'pending':
        return 'border-l-4 border-l-yellow-500';
      case 'inProgress':
        return 'border-l-4 border-l-blue-500';
      case 'completed':
        return 'border-l-4 border-l-green-500';
      case 'cancelled':
        return 'border-l-4 border-l-red-500';
      default:
        return 'border-l-4 border-l-gray-500';
    }
  };

  return (
    <div
      className={`
        bg-white/5 
        backdrop-blur-sm 
        rounded-lg 
        p-4 
        ${getVariantStyles()}
        hover:bg-white/10 
        transition-all 
        duration-200 
        cursor-pointer
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBgColor} ${statusColor}`}>
            {delivery.status.replace('-', ' ')}
          </span>
          <span className={`text-xs font-medium ${urgencyColor}`}>
            {delivery.urgency}
          </span>
        </div>
        <div className="text-right">
          <div className="text-white font-semibold">
            {formatTokenAmount(delivery.paymentAmount, delivery.paymentToken)}
          </div>
          <div className="text-xs text-gray-400">
            {formatRelativeTime(delivery.createdAt)}
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">
              From: {delivery.pickupLocation}
            </div>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">
              To: {delivery.dropoffLocation}
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Package className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-300 truncate">
              {delivery.packageDetails}
            </div>
          </div>
        </div>
      </div>

      {/* Courier Info */}
      {showCourier && courierInfo && (
        <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg mb-3">
          <Avatar
            name={courierInfo.name}
            src={courierInfo.avatar}
            size="sm"
            variant="withStatus"
            status="online"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-white">
              {courierInfo.name}
            </div>
            <RatingStars
              rating={courierInfo.rating}
              variant="static"
              size="sm"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>ID: {delivery.deliveryId.slice(-8)}</span>
          {delivery.estimatedDeliveryTime && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{delivery.estimatedDeliveryTime} min</span>
            </div>
          )}
        </div>
        
        {delivery.completedAt && (
          <div className="text-green-400">
            Completed {formatRelativeTime(delivery.completedAt)}
          </div>
        )}
      </div>

      {/* Special Instructions */}
      {delivery.specialInstructions && (
        <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-200">
          <strong>Special Instructions:</strong> {delivery.specialInstructions}
        </div>
      )}
    </div>
  );
}
