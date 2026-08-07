import React, { useState } from 'react';
import {
  ScaleIcon,
  FileTextIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  SearchIcon,
  BellIcon,
  UploadIcon,
  BarChartIcon,
  SettingsIcon,
  MenuIcon,
  XIcon,
  LayersIcon,
  ChevronRightIcon
} from '../components/Icons';

const DashboardLayout = ({ children, activeRoute = 'dashboard', onNavigate, username }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Get user initials from username
  const userInitials = username ? username.substring(0, 2).toUpperCase() : 'JD';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChartIcon, badge: null },
    { id: 'contract-review', label: 'Contract Review', icon: FileTextIcon, badge: 'AI AI' },
    { id: 'documents', label: 'Documents Vault', icon: LayersIcon, badge: '24' },
    { id: 'upload', label: 'Upload & Scan', icon: UploadIcon, badge: 'New' },
    { id: 'compliance', label: 'Compliance Audit', icon: CheckCircleIcon, badge: null },
    { id: 'obligations', label: 'Obligations', icon: ClockIcon, badge: '5 Pending' },
    { id: 'risk-analytics', label: 'Risk Analytics', icon: ShieldAlertIcon, badge: null },
    { id: 'reports', label: 'Reports & Exports', icon: ScaleIcon, badge: null },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, badge: null },
  ];

  const notifications = [
    { id: 1, title: 'High Risk Clause Flagged', desc: 'Indemnification cap missing in Vendor Agreement #1092', time: '10m ago', urgent: true },
    { id: 2, title: 'Obligation Deadline Near', desc: 'Q3 Security Audit Deliverable due in 3 days', time: '1h ago', urgent: false },
    { id: 3, title: 'AI Batch Audit Complete', desc: 'Processed 14 Master Service Agreements with 99.4% accuracy', time: '3h ago', urgent: false },
  ];

  const handleNavClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
    }
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '../../login/index.html';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-72 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <ScaleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h1 className="font-bold text-lg text-white tracking-tight">IES Legal AI</h1>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 rounded border border-indigo-500/30 uppercase">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-slate-400">Enterprise Compliance</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Core Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User / Engine Footer Status */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex items-center justify-between hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-sm font-bold text-indigo-300">
                    {userInitials}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
                </div>
                <div className="truncate text-left">
                  <p className="text-xs font-semibold text-slate-200 truncate">{username || 'User'}</p>
                  <p className="text-[11px] text-slate-400 truncate">Active Session</p>
                </div>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-slate-500" />
            </button>
            
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm text-slate-200 hover:bg-slate-700/60 hover:text-red-400 transition-colors border-t border-slate-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 max-w-xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            {/* Global Search Bar */}
            <div className="relative w-full">
              <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search contracts, clauses, obligations, or risk score..."
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 border border-slate-800 bg-slate-900 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3 ml-4">
            {/* AI Assistant Ready Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-medium">
              <SparklesIcon className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>LexiAI v4.2 Active</span>
            </div>

            {/* Quick Upload Button */}
            <button
              onClick={() => handleNavClick('upload')}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs md:text-sm font-medium px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <UploadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Document</span>
            </button>

            {/* Notifications Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
              >
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Notifications</h3>
                    <span className="text-[11px] text-indigo-400 cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border text-xs ${
                          item.urgent
                            ? 'bg-rose-950/20 border-rose-800/40 text-slate-200'
                            : 'bg-slate-950/40 border-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className={item.urgent ? 'text-rose-400' : 'text-indigo-400'}>{item.title}</span>
                          <span className="text-[10px] text-slate-500">{item.time}</span>
                        </div>
                        <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
