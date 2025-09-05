import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Package, Truck, BarChart3, Settings, User } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  userType: 'shipper' | 'courier';
  onUserTypeChange: (type: 'shipper' | 'courier') => void;
}

export function AppShell({ 
  children, 
  currentView, 
  onNavigate, 
  userType, 
  onUserTypeChange 
}: AppShellProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { 
      id: userType === 'shipper' ? 'create-delivery' : 'courier', 
      label: userType === 'shipper' ? 'Create Delivery' : 'Find Deliveries', 
      icon: userType === 'shipper' ? Package : Truck 
    },
    { id: 'manage-deliveries', label: 'My Deliveries', icon: Package },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">
                  ShipChain<span className="text-xs opacity-70">™</span>
                </h1>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        currentView === item.id
                          ? 'bg-white/20 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Type Toggle */}
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => onUserTypeChange('shipper')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    userType === 'shipper'
                      ? 'bg-white text-purple-600'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Shipper
                </button>
                <button
                  onClick={() => onUserTypeChange('courier')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    userType === 'courier'
                      ? 'bg-white text-purple-600'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Courier
                </button>
              </div>

              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}