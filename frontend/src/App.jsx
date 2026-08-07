import { useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import UploadDocuments from './pages/UploadDocuments';
import Documents from './pages/Documents';
import ContractReview from './pages/ContractReview';
import Compliance from './pages/Compliance';
import RiskAnalytics from './pages/RiskAnalytics';
import Obligations from './pages/Obligations';
import Search from './pages/Search';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [activeRoute, setActiveRoute] = useState('dashboard');

  const renderPage = () => {
    switch (activeRoute) {
      case 'upload':
        return <UploadDocuments />;
      case 'documents':
        return <Documents />;
      case 'contract-review':
        return <ContractReview />;
      case 'compliance':
        return <Compliance />;
      case 'risk-analytics':
        return <RiskAnalytics />;
      case 'obligations':
        return <Obligations />;
      case 'search':
        return <Search />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={setActiveRoute} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <DashboardLayout activeRoute={activeRoute} onNavigate={setActiveRoute}>
        {renderPage()}
      </DashboardLayout>
    </div>
  );
}

export default App;
