import React, { useState } from 'react';
import { AppShell } from './components/AppShell';
import { Dashboard } from './components/Dashboard';
import { CreateDelivery } from './components/CreateDelivery';
import { CourierView } from './components/CourierView';
import { DeliveryManagement } from './components/DeliveryManagement';

type View = 'dashboard' | 'create-delivery' | 'courier' | 'manage-deliveries';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [userType, setUserType] = useState<'shipper' | 'courier'>('shipper');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userType={userType} onNavigate={setCurrentView} />;
      case 'create-delivery':
        return <CreateDelivery onBack={() => setCurrentView('dashboard')} />;
      case 'courier':
        return <CourierView onBack={() => setCurrentView('dashboard')} />;
      case 'manage-deliveries':
        return <DeliveryManagement onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard userType={userType} onNavigate={setCurrentView} />;
    }
  };

  return (
    <AppShell 
      currentView={currentView} 
      onNavigate={setCurrentView}
      userType={userType}
      onUserTypeChange={setUserType}
    >
      {renderView()}
    </AppShell>
  );
}

export default App;