import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Package, Truck, User, Home } from 'lucide-react';
import { useDelivery } from '../context/DeliveryContext';

function Header() {
  const location = useLocation();
  const { state, dispatch } = useDelivery();

  const toggleUserType = () => {
    const newType = state.userProfile.type === 'shipper' ? 'courier' : 'shipper';
    dispatch({ type: 'SET_USER_TYPE', payload: newType });
  };

  return (
    <header className="glass-effect border-b border-white/20">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Package className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">ShipChain</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              
              {state.userProfile.type === 'shipper' ? (
                <>
                  <Link 
                    to="/create-delivery" 
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === '/create-delivery' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    Ship Package
                  </Link>
                  <Link 
                    to="/deliveries" 
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === '/deliveries' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    My Shipments
                  </Link>
                </>
              ) : (
                <Link 
                  to="/courier" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === '/courier' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Courier Hub
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleUserType}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">
                {state.userProfile.type === 'shipper' ? 'Switch to Courier' : 'Switch to Shipper'}
              </span>
              <span className="sm:hidden">
                {state.userProfile.type === 'shipper' ? 'Courier' : 'Shipper'}
              </span>
            </button>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg text-white">
              <span className="text-sm font-medium">$SHIP:</span>
              <span className="font-bold">{state.userProfile.shipTokenBalance}</span>
            </div>
            
            <ConnectButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/20">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              location.pathname === '/' 
                ? 'bg-white/20 text-white' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          
          {state.userProfile.type === 'shipper' ? (
            <>
              <Link 
                to="/create-delivery" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === '/create-delivery' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="text-sm">Ship</span>
              </Link>
              <Link 
                to="/deliveries" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === '/deliveries' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="text-sm">Shipments</span>
              </Link>
            </>
          ) : (
            <Link 
              to="/courier" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/courier' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span className="text-sm">Courier</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;