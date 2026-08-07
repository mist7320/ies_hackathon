import React, { useState } from 'react';
import {
  FileTextIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  FilterIcon,
  DownloadIcon,
  EyeIcon,
  ArrowUpRightIcon,
  ScaleIcon,
  AlertTriangleIcon
} from '../components/Icons';

const Dashboard = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 6 Primary Statistics Cards Data
  const statsCards = [
    {
      title: 'Total Contracts Analyzed',
      value: '1,284',
      change: '+12.4%',
      isPositive: true,
      period: 'vs last month',
      icon: FileTextIcon,
      accent: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    },
    {
      title: 'High Risk Flags',
      value: '18',
      change: '-8.3%',
      isPositive: true, // fewer risk flags is positive
      period: 'requires legal action',
      icon: ShieldAlertIcon,
      accent: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400',
    },
    {
      title: 'Pending Reviews',
      value: '7',
      change: '+2 new',
      isPositive: false,
      period: '3 urgent priority',
      icon: ClockIcon,
      accent: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    },
    {
      title: 'Extracted Obligations',
      value: '342',
      change: '+28 this week',
      isPositive: true,
      period: '94.2% AI auto-tagged',
      icon: CheckCircleIcon,
      accent: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'AI Audit Accuracy',
      value: '99.4%',
      change: '+0.8%',
      isPositive: true,
      period: 'validated against precedent',
      icon: SparklesIcon,
      accent: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
    },
    {
      title: 'Avg Time Saved / Doc',
      value: '4.2 Hrs',
      change: '+85%',
      isPositive: true,
      period: 'efficiency vs manual review',
      icon: ScaleIcon,
      accent: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    },
  ];

  // Recent Documents Data
  const documents = [
    {
      id: 'DOC-9041',
      name: 'Global Enterprise MSA - Acme Corp',
      category: 'Master Service Agreement',
      riskScore: 84,
      riskLevel: 'High Risk',
      status: 'Needs Review',
      date: 'Aug 07, 2026',
      author: 'Sarah Jenkins',
      flaggedClause: 'Unlimited Liability & Indemnity',
    },
    {
      id: 'DOC-8832',
      name: 'Cloud Infrastructure SLA v3.2',
      category: 'Service Level Agreement',
      riskScore: 32,
      riskLevel: 'Low Risk',
      status: 'Approved',
      date: 'Aug 06, 2026',
      author: 'Michael Chen',
      flaggedClause: 'Standard 99.9% Uptime',
    },
    {
      id: 'DOC-8719',
      name: 'Vendor Data Processing Addendum',
      category: 'DPA / Privacy',
      riskScore: 68,
      riskLevel: 'Medium Risk',
      status: 'Under Review',
      date: 'Aug 05, 2026',
      author: 'Elena Rostova',
      flaggedClause: 'EU Cross-border Transfer',
    },
    {
      id: 'DOC-8590',
      name: 'Executive Employment Contract - CTO',
      category: 'Employment',
      riskScore: 54,
      riskLevel: 'Medium Risk',
      status: 'Approved',
      date: 'Aug 04, 2026',
      author: 'Sarah Jenkins',
      flaggedClause: 'Non-Compete Geographic Scope',
    },
    {
      id: 'DOC-8411',
      name: 'Mutual Non-Disclosure Agreement - CyberDyne',
      category: 'NDA',
      riskScore: 12,
      riskLevel: 'Low Risk',
      status: 'Approved',
      date: 'Aug 02, 2026',
      author: 'David Vance',
      flaggedClause: '5-Year Confidentiality Term',
    },
    {
      id: 'DOC-8302',
      name: 'SaaS Licensing & Distribution Terms',
      category: 'Licensing',
      riskScore: 78,
      riskLevel: 'High Risk',
      status: 'Needs Review',
      date: 'Aug 01, 2026',
      author: 'Jessica Danforth',
      flaggedClause: 'Automatic Renewal Lock-in',
    },
  ];

  // Recent AI Activity Data Stream
  const aiActivities = [
    {
      id: 1,
      type: 'clause_flag',
      title: 'Flagged High Risk Clause',
      doc: 'Global Enterprise MSA - Acme Corp',
      detail: 'Indemnification cap missing in Section 14.2. Recommended maximum liability limit set to 2x annual contract value.',
      time: '12 minutes ago',
      level: 'high',
    },
    {
      id: 2,
      type: 'obligation',
      title: 'Extracted 6 Payment Milestones',
      doc: 'Vendor Data Processing Addendum',
      detail: 'Auto-scheduled compliance audit date for Nov 15, 2026 and quarterly GDPR reporting reminders.',
      time: '45 minutes ago',
      level: 'medium',
    },
    {
      id: 3,
      type: 'compliance',
      title: 'Regulatory Compliance Audit Passed',
      doc: 'Cloud Infrastructure SLA v3.2',
      detail: '100% compliant with ISO 27001 & SOC 2 Type II data governance standards.',
      time: '2 hours ago',
      level: 'low',
    },
    {
      id: 4,
      type: 'analysis',
      title: 'Precedent Match Identified',
      doc: 'Executive Employment Contract - CTO',
      detail: 'Non-compete clause matches 94% similarity with 2025 California legal precedents.',
      time: '4 hours ago',
      level: 'low',
    },
  ];

  // Category filter options
  const categories = ['All', 'High Risk', 'Master Service Agreement', 'NDA', 'DPA / Privacy', 'Approved'];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'High Risk' && doc.riskLevel === 'High Risk') ||
      (selectedCategory === 'Approved' && doc.status === 'Approved') ||
      doc.category === selectedCategory;

    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-950 border border-indigo-800/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Legal Intelligence Platform v4.2</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Contract Risk & AI Audit Command Center
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Real-time automated clause extraction, regulatory compliance scoring, and risk analytics across your enterprise legal documents.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('contract-review')}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <FileTextIcon className="w-4 h-4" />
              <span>Review Contract AI</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('upload')}
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold px-4 py-3 rounded-2xl transition-all"
            >
              <ArrowUpRightIcon className="w-4 h-4" />
              <span>Quick Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Statistics Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <span>Executive Performance & Risk Metrics</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Updated 2 minutes ago</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statsCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group relative bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-slate-700 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/40"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${card.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {card.value}
                  </span>
                  <div
                    className={`flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      card.isPositive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {card.isPositive ? (
                      <TrendingUpIcon className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDownIcon className="w-3.5 h-3.5" />
                    )}
                    <span>{card.change}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  {card.period}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid: Recent Documents Table & Recent AI Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Documents Table (2 columns on LG) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-xl space-y-5">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                  <FileTextIcon className="w-5 h-5 text-indigo-400" />
                  <span>Recent Document Audits</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filter by category, risk severity, or search by contract title
                </p>
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-700">
                  <FilterIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filter</span>
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('documents')}
                  className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1"
                >
                  <span>View Vault</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category Pills & Search */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Filter table..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Documents Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/40">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Document Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Risk Score</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Upload Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => {
                      const isHigh = doc.riskLevel === 'High Risk';
                      const isMedium = doc.riskLevel === 'Medium Risk';
                      return (
                        <tr
                          key={doc.id}
                          className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                          onClick={() => onNavigate && onNavigate('contract-review')}
                        >
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-2 rounded-lg bg-slate-800/80 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-colors">
                                <FileTextIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-slate-100 font-medium group-hover:text-indigo-300 transition-colors">
                                  {doc.name}
                                </p>
                                <p className="text-[10px] text-slate-500 flex items-center space-x-1">
                                  <span>ID: {doc.id}</span>
                                  <span>•</span>
                                  <span className="text-slate-400">{doc.author}</span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{doc.category}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    isHigh ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${doc.riskScore}%` }}
                                />
                              </div>
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                  isHigh
                                    ? 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                                    : isMedium
                                    ? 'bg-amber-950/60 text-amber-400 border-amber-800/50'
                                    : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                                }`}
                              >
                                {doc.riskScore}/100
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-full font-medium ${
                                doc.status === 'Approved'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : doc.status === 'Needs Review'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  doc.status === 'Approved'
                                    ? 'bg-emerald-400'
                                    : doc.status === 'Needs Review'
                                    ? 'bg-rose-400'
                                    : 'bg-amber-400'
                                }`}
                              />
                              <span>{doc.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">{doc.date}</td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate && onNavigate('contract-review');
                                }}
                                title="Review Clauses"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                title="Export Report"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                              >
                                <DownloadIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No documents found matching search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent AI Activity Feed (1 column on LG) */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <SparklesIcon className="w-5 h-5 text-indigo-400" />
                <span>Live AI Extraction Stream</span>
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            </div>

            <div className="space-y-4">
              {aiActivities.map((act) => {
                const isHigh = act.level === 'high';
                const isMed = act.level === 'medium';
                return (
                  <div
                    key={act.id}
                    className="relative pl-5 border-l-2 border-slate-800 hover:border-indigo-500 transition-colors space-y-1 group cursor-pointer"
                  >
                    <div
                      className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${
                        isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{act.time}</span>
                    </div>

                    <p className="text-[11px] font-medium text-slate-400 truncate">{act.doc}</p>
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
                      {act.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate && onNavigate('risk-analytics')}
              className="w-full py-2.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Explore AI Risk Analytics</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick AI Insight Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-800/40 p-5 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangleIcon className="w-4 h-4 text-amber-400" />
              <span>AI Executive Insight</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">3 Vendor Agreements</strong> expiring in the next 30 days contain auto-renewal clauses. Immediate legal review recommended to prevent unapproved renewals.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('obligations')}
              className="text-xs text-indigo-400 font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>View Expiring Obligations</span>
              <ArrowUpRightIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
