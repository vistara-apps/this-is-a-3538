import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Package, Truck, DollarSign, Star, TrendingUp, MapPin } from 'lucide-react';

interface DashboardProps {
  userType: 'shipper' | 'courier';
  onNavigate: (view: string) => void;
}

export function Dashboard({ userType, onNavigate }: DashboardProps) {
  const stats = userType === 'shipper' 
    ? [
        { label: 'Active Deliveries', value: '3', icon: Package, color: 'text-blue-600' },
        { label: 'Completed', value: '47', icon: TrendingUp, color: 'text-green-600' },
        { label: 'Total Spent', value: '$2,847', icon: DollarSign, color: 'text-purple-600' },
        { label: 'Avg Rating', value: '4.9', icon: Star, color: 'text-yellow-600' },
      ]
    : [
        { label: 'Available Jobs', value: '12', icon: MapPin, color: 'text-blue-600' },
        { label: 'Completed', value: '89', icon: TrendingUp, color: 'text-green-600' },
        { label: 'Earnings', value: '$5,234', icon: DollarSign, color: 'text-purple-600' },
        { label: 'Rating', value: '4.8', icon: Star, color: 'text-yellow-600' },
      ];

  const recentDeliveries = [
    {
      id: '1',
      from: 'Downtown Office',
      to: 'Suburban Home',
      status: 'in-progress',
      amount: '$25.00',
      courier: 'Alex Chen',
      rating: 4.9,
    },
    {
      id: '2',
      from: 'Tech Hub',
      to: 'University Campus',
      status: 'completed',
      amount: '$18.50',
      courier: 'Maria Santos',
      rating: 5.0,
    },
    {
      id: '3',
      from: 'Mall Plaza',
      to: 'Business District',
      status: 'pending',
      amount: '$32.00',
      courier: null,
      rating: null,
    },
  ];

  const chartData = [
    { day: 'Mon', deliveries: 12 },
    { day: 'Tue', deliveries: 19 },
    { day: 'Wed', deliveries: 8 },
    { day: 'Thu', deliveries: 15 },
    { day: 'Fri', deliveries: 22 },
    { day: 'Sat', deliveries: 16 },
    { day: 'Sun', deliveries: 9 },
  ];

  const maxDeliveries = Math.max(...chartData.map(d => d.deliveries));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to ShipChain
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          {userType === 'shipper' 
            ? 'Decentralized delivery, on-demand. Connect with verified couriers for your urgent and specialized delivery needs.'
            : 'Earn $SHIP tokens by completing deliveries. Build your reputation and grow your income with every successful delivery.'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Weekly Activity</h2>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={item.day} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600 w-8">{item.day}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="chart-bar h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(item.deliveries / maxDeliveries) * 100}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{item.deliveries}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Deliveries */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Deliveries</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('manage-deliveries')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {delivery.from} → {delivery.to}
                    </span>
                  </div>
                  {delivery.courier && (
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{delivery.courier}</span>
                      {delivery.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{delivery.rating}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{delivery.amount}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    delivery.status === 'completed' ? 'bg-green-100 text-green-800' :
                    delivery.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {delivery.status.replace('-', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={() => onNavigate(userType === 'shipper' ? 'create-delivery' : 'courier')}
          className="px-8 py-4"
        >
          {userType === 'shipper' ? 'Create New Delivery' : 'Find Available Deliveries'}
        </Button>
      </div>
    </div>
  );
}