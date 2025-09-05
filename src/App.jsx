import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CreateDelivery from './components/CreateDelivery';
import DeliveryList from './components/DeliveryList';
import CourierDashboard from './components/CourierDashboard';
import { DeliveryProvider } from './context/DeliveryContext';

function App() {
  return (
    <DeliveryProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800">
          <Header />
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create-delivery" element={<CreateDelivery />} />
              <Route path="/deliveries" element={<DeliveryList />} />
              <Route path="/courier" element={<CourierDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DeliveryProvider>
  );
}

export default App;