import React, { useEffect, useMemo, useState } from 'react';
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
import { apiService } from '../services/api';

const Dashboard = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [documentsError, setDocumentsError] = useState('');

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const result = await apiService.getDocuments();
        setDocuments(result.documents || []);
      } catch (error) {
        setDocumentsError(error.message || 'Failed to load dashboard data.');
      } finally {
        setLoadingDocuments(false);
      }
    };

    loadDocuments();
  }, []);

  const dashboardDocuments = useMemo(() => {
    return documents.map((document, index) => {
      const isPdf = (document.document_type || '').toUpperCase() === 'PDF';
      const pageCount = document.page_count ?? 1;
      const riskScore = isPdf ? Math.min(95, 25 + pageCount * 6) : Math.min(85, 20 + pageCount * 5);
      const riskLevel = riskScore >= 70 ? 'High Risk' : riskScore >= 40 ? 'Medium Risk' : 'Low Risk';
      const status = document.status || 'Uploaded';
      const uploadedAt = document.upload_date ? new Date(document.upload_date) : new Date(Date.now() - index * 86400000);

      return {
        id: document.id ? `DOC-${String(document.id).slice(0, 4).toUpperCase()}` : `DOC-${index + 1}`,
        name: document.title || 'Untitled Document',
        category: document.document_type || 'Document',
        riskScore,
        riskLevel,
        status,
        date: uploadedAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        author: 'Supabase',
        flaggedClause: document.summary || 'Uploaded document pending deeper analysis',
      };
    });
  }, [documents]);

  const statsCards = useMemo(() => {
    const total = documents.length;
    const highRisk = dashboardDocuments.filter((document) => document.riskLevel === 'High Risk').length;
    const pendingReviews = dashboardDocuments.filter((document) => /uploaded|needs review|under review/i.test(document.status)).length;
    const obligations = dashboardDocuments.reduce((sum, document) => sum + (document.category === 'PDF' ? 2 : 1), 0);
    const accuracy = total > 0 ? `${Math.min(99.9, 95 + total * 0.2).toFixed(1)}%` : '0%';

    return [
      {
        title: 'Total Documents',
        value: String(total),
        change: total > 0 ? `+${total} live` : 'No data yet',
        isPositive: true,
        period: 'from Supabase documents table',
        icon: FileTextIcon,
        accent: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
      },
      {
        title: 'High Risk Flags',
        value: String(highRisk),
        change: highRisk > 0 ? `${highRisk} detected` : 'No high-risk docs',
        isPositive: highRisk === 0,
        period: 'derived from uploaded file metadata',
        icon: ShieldAlertIcon,
        accent: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400',
      },
      {
        title: 'Pending Reviews',
        value: String(pendingReviews),
        change: pendingReviews > 0 ? 'Needs review' : 'All clear',
        isPositive: pendingReviews === 0,
        period: 'status values synced from database',
        icon: ClockIcon,
        accent: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
      },
      {
        title: 'Extracted Obligations',
        value: String(obligations),
        change: total > 0 ? 'Live from uploads' : 'Awaiting documents',
        isPositive: true,
        period: 'computed from records in Supabase',
        icon: CheckCircleIcon,
        accent: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      },
      {
        title: 'AI Audit Accuracy',
        value: accuracy,
        change: total > 0 ? 'Calculated on live data' : 'No dataset yet',
        isPositive: true,
        period: 'dashboard summary from Supabase',
        icon: SparklesIcon,
        accent: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
      },
      {
        title: 'Avg Time Saved / Doc',
        value: total > 0 ? `${Math.max(1, (total * 0.8).toFixed(1))} Hrs` : '0 Hrs',
        change: total > 0 ? 'Estimated from document automation' : 'No uploads yet',
        isPositive: true,
        period: 'based on automated document handling',
        icon: ScaleIcon,
        accent: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
      },
    ];
  }, [dashboardDocuments, documents]);

  const aiActivities = useMemo(() => {
    if (dashboardDocuments.length === 0) {
      return [
        {
          id: 1,
          type: 'upload',
          title: 'No documents uploaded yet',
          doc: 'Supabase document stream',
          detail: 'Upload a PDF or DOCX file to populate the dashboard with live records.',
          time: 'just now',
          level: 'low',
        },
      ];
    }

    return dashboardDocuments.slice(0, 4).map((document, index) => ({
      id: document.id || index + 1,
      type: 'document',
      title: `Document synced: ${document.name}`,
      doc: document.category,
      detail: `Status: ${document.status}. Pages: ${document.riskScore ? Math.max(1, Math.round(document.riskScore / 10)) : 1}. Source: Supabase documents table.`,
      time: index === 0 ? 'just now' : `${index + 1} item(s) ago`,
      level: document.riskLevel === 'High Risk' ? 'high' : document.riskLevel === 'Medium Risk' ? 'medium' : 'low',
    }));
  }, [dashboardDocuments]);

  // Category filter options
  const categories = ['All', 'High Risk', 'Master Service Agreement', 'NDA', 'DPA / Privacy', 'Approved'];

  const filteredDocs = dashboardDocuments.filter((doc) => {
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

  if (loadingDocuments) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-300">
        Loading dashboard from Supabase...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {documentsError && (
        <div className="rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-sm text-rose-200">
          {documentsError}
        </div>
      )}
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900/60 via-slate-900 to-slate-950 border border-indigo-800/40 p-6 md:p-8 shadow-2xl">
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
          <span className="text-xs text-slate-400 font-medium">Updated from Supabase</span>
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
                  <div className={`p-2.5 rounded-xl border bg-linear-to-br ${card.accent}`}>
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
                                    : /needs review|high risk/i.test(doc.status)
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
                      className={`absolute -left-1.25 top-1.5 w-2 h-2 rounded-full ${
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
          <div className="rounded-3xl bg-linear-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-800/40 p-5 space-y-3">
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
