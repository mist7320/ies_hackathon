import { useState, useEffect } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // First, accept a username passed from the login page redirect
    const urlParams = new URLSearchParams(window.location.search);
    const redirectedUsername = urlParams.get('user');

    if (redirectedUsername) {
      localStorage.setItem('username', redirectedUsername);
      setUsername(redirectedUsername);
      setIsAuthenticated(true);

      // Clean up the URL so refreshes don't keep reusing the query param
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      // Fall back to dashboard-local storage
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        setIsAuthenticated(true);
      } else {
        // Redirect to login if not authenticated
        window.location.replace('http://localhost:8000/');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

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
      <DashboardLayout activeRoute={activeRoute} onNavigate={setActiveRoute} username={username}>
        {renderPage()}
      </DashboardLayout>
    </div>
  );
}

export default App;
