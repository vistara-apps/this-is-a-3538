import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Star, TrendingUp, Users, Clock, ArrowRight } from 'lucide-react';
import { useDelivery } from '../context/DeliveryContext';
import Card from './ui/Card';
import Button from './ui/Button';

function Dashboard() {
  const { state } = useDelivery();
  const { userProfile, deliveries, couriers } = state;

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
  const inProgressDeliveries = deliveries.filter(d => d.status === 'in-progress').length;
  const completedDeliveries = deliveries.filter(d => d.status === 'completed').length;
  const availableCouriers = couriers.filter(c => c.availabilityStatus === 'available').length;

  const recentDeliveries = deliveries.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Decentralized Delivery,
          <br />
          <span className="gradient-text">On-Demand</span>
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Connect with verified couriers for urgent and specialized deliveries. 
          Secure payments through smart contracts.
        </p>
        
        {userProfile.type === 'shipper' ? (
          <Link to="/create-delivery">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
              <Package className="w-5 h-5 mr-2" />
              Ship a Package
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        ) : (
          <Link to="/courier">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
              <Truck className="w-5 h-5 mr-2" />
              Start Delivering
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pending Deliveries</p>
              <p className="text-2xl font-bold text-white">{pendingDeliveries}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-white">{inProgressDeliveries}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{completedDeliveries}</p>
            </div>
            <Package className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Available Couriers</p>
              <p className="text-2xl font-bold text-white">{availableCouriers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <Link to="/deliveries">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentDeliveries.map((delivery) => (
              <div key={delivery.deliveryId} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex-1">
                  <p className="text-white font-medium">#{delivery.deliveryId}</p>
                  <p className="text-white/70 text-sm">{delivery.packageDetails}</p>
                  <p className="text-white/50 text-xs">{delivery.pickupLocation}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    delivery.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                    delivery.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-orange-500/20 text-orange-300'
                  }`}>
                    {delivery.status}
                  </span>
                  <p className="text-white font-medium mt-1">${delivery.paymentAmount}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Couriers */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Top Couriers</h2>
            <TrendingUp className="w-5 h-5 text-white/70" />
          </div>
          
          <div className="space-y-4">
            {couriers.slice(0, 3).map((courier, index) => (
              <div key={courier.courierId} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-medium">
                    {courier.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{courier.name}</p>
                    <p className="text-white/70 text-sm">{courier.vehicle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{courier.rating}</span>
                  </div>
                  <p className="text-white/70 text-sm">{courier.deliveryHistory} deliveries</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center p-8">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-purple-300" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Smart Matching</h3>
          <p className="text-white/70">AI-powered courier matching based on location, urgency, and requirements.</p>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center p-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-blue-300" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Trust & Reputation</h3>
          <p className="text-white/70">Blockchain-verified courier credentials and transparent rating system.</p>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center p-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-green-300" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Token Rewards</h3>
          <p className="text-white/70">Earn $SHIP tokens for deliveries and platform participation.</p>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;