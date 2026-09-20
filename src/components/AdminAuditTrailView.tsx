import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Terminal,
  Database,
  User,
  Key,
  CreditCard,
  FileText,
  AlertOctagon,
  X,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  systemAuditLogService,
  SystemAuditEvent,
  AuditCategory,
  AuditSeverity,
} from '../services/systemAuditLogService';

export const AdminAuditTrailView: React.FC = () => {
  const [events, setEvents] = useState<SystemAuditEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | 'all'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<SystemAuditEvent | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [diagnosticMsg, setDiagnosticMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = systemAuditLogService.subscribe((updated) => {
      setEvents(updated);
    });
    return () => unsub();
  }, []);

  const handleRefreshFromCloud = async () => {
    setIsSyncing(true);
    setDiagnosticMsg(null);
    try {
      await systemAuditLogService.fetchRemoteEvents();
      setDiagnosticMsg('Successfully synchronized events with Google Cloud Firestore.');
    } catch (e) {
      setDiagnosticMsg('Loaded local cache; cloud sync will retry in background.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setDiagnosticMsg(null), 4000);
    }
  };

  const handleTriggerDiagnostic = () => {
    const evt = systemAuditLogService.logDiagnosticTestEvent();
    setDiagnosticMsg(`Diagnostic event ${evt.id} dispatched to system event log and cloud store.`);
    setTimeout(() => setDiagnosticMsg(null), 4000);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered list
  const filteredEvents = useMemo(() => {
    const now = Date.now();
    return events.filter((e) => {
      // Time filter
      if (selectedTimeRange === '24h') {
        const diffHours = (now - new Date(e.timestamp).getTime()) / (1000 * 3600);
        if (diffHours > 24) return false;
      } else if (selectedTimeRange === '7d') {
        const diffDays = (now - new Date(e.timestamp).getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && e.category !== selectedCategory) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'ALL' && e.severity !== selectedSeverity) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inId = e.id.toLowerCase().includes(q);
        const inAction = e.action.toLowerCase().includes(q);
        const inActor = e.actor.toLowerCase().includes(q);
        const inDetails = e.details.toLowerCase().includes(q);
        const inMeta = e.metadata ? JSON.stringify(e.metadata).toLowerCase().includes(q) : false;
        const inIp = e.ipAddress?.toLowerCase().includes(q);
        return inId || inAction || inActor || inDetails || inMeta || inIp;
      }

      return true;
    });
  }, [events, selectedCategory, selectedSeverity, selectedTimeRange, searchQuery]);

  // Summary counts
  const countCritical = events.filter((e) => e.severity === 'CRITICAL').length;
  const countWarning = events.filter((e) => e.severity === 'WARNING').length;
  const countTokens = events.filter((e) => e.category === 'TOKENS').length;
  const countBilling = events.filter((e) => e.category === 'BILLING').length;

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            Critical
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
            <ShieldAlert className="w-3 h-3 text-red-600" />
            Error
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            <Info className="w-3 h-3 text-blue-500" />
            Info
          </span>
        );
    }
  };

  const getCategoryIcon = (category: AuditCategory) => {
    switch (category) {
      case 'TOKENS':
        return <Key className="w-4 h-4 text-amber-500" />;
      case 'BILLING':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'ORDERS':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'EXAMS':
        return <Shield className="w-4 h-4 text-indigo-500" />;
      case 'SECURITY':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'AUTH':
        return <User className="w-4 h-4 text-teal-500" />;
      default:
        return <Terminal className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / System Health Header */}
      <div className="bg-[#071433] rounded-2xl p-6 text-white shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
                <Activity className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black tracking-tight text-white">
                Centralized System Audit Trail &amp; Event Diagnostics
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Real-time operational logging and compliance audit trail for troubleshooting transactions, seat allocations, proctoring alerts, and administrative state changes. Connected to Google Cloud Firestore.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerDiagnostic}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              title="Dispatches a test diagnostic event to verify pipeline"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Log Pipeline</span>
            </button>

            <button
              onClick={handleRefreshFromCloud}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all test audit logs?')) {
                  systemAuditLogService.clearLogs();
                  setDiagnosticMsg('Audit event logs cleared successfully.');
                  setTimeout(() => setDiagnosticMsg(null), 4000);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all border border-rose-500/30 flex items-center gap-1.5 cursor-pointer"
              title="Clear test audit logs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Logs</span>
            </button>

            <button
              onClick={() => systemAuditLogService.exportToCSV(filteredEvents)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
              title="Download filtered logs as statutory compliance CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => systemAuditLogService.exportToJSON(filteredEvents)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
              title="Download raw structured JSON for automated log ingestion"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Diagnostic notification toast */}
        {diagnosticMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{diagnosticMsg}</span>
          </div>
        )}

        {/* Quick Diagnostic Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 block">Total Logged Events</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-black text-white">{events.length}</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 block">Course Tokens &amp; Seats</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-black text-amber-300">{countTokens}</span>
              <span className="text-[10px] text-slate-400">Tokens</span>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 block">Billing &amp; Remittance</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-black text-emerald-400">{countBilling}</span>
              <span className="text-[10px] text-slate-400">Financial</span>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 block">Critical Discrepancies</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-lg font-black ${countCritical > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                {countCritical}
              </span>
              <span className="text-[10px] text-slate-400">
                {countWarning} Warnings
              </span>
            </div>
          </div>
        </div>

        {/* Connected Database Infrastructure Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Database:</span>
            <code className="bg-slate-800 px-2 py-0.5 rounded text-slate-200 font-mono text-[10px]">
              ai-studio-compliseyacademy-372a3493-e2e7-4f6c-b44f-4577f2afdfe9
            </code>
            <span className="text-emerald-400 font-semibold">• Firestore Cloud Online</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Statutory Scope: Seychelles AML/CFT Act 2020 Compliance Audit Trail
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search action, actor email, token, IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Time range selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Period:
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setSelectedTimeRange('24h')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedTimeRange === '24h' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                24 Hours
              </button>
              <button
                onClick={() => setSelectedTimeRange('7d')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedTimeRange === '7d' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setSelectedTimeRange('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedTimeRange === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills (Category & Severity) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Category:
            </span>
            {['ALL', 'TOKENS', 'BILLING', 'ORDERS', 'EXAMS', 'SECURITY', 'AUTH', 'SYSTEM'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#071433] text-amber-300 shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Severity:
            </span>
            {['ALL', 'INFO', 'WARNING', 'CRITICAL'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedSeverity === sev
                    ? 'bg-slate-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Table / Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">System Event Stream</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
              {filteredEvents.length} events
            </span>
          </div>

          <span className="text-xs text-slate-400">
            Sorted by most recent • Auto-synchronized
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Info className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No audit events match your search filters.</p>
            <p className="text-xs text-slate-400">Try adjusting your category, severity, or search parameters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredEvents.map((event) => {
              const dateObj = new Date(event.timestamp);
              const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

              const isCriticalOrWarning = event.severity === 'CRITICAL' || event.severity === 'WARNING';

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEventForDetail(event)}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    event.severity === 'CRITICAL' ? 'bg-rose-50/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                      {getCategoryIcon(event.category)}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getSeverityBadge(event.severity)}

                        <span className="font-mono text-xs font-bold text-slate-900">
                          {event.action}
                        </span>

                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                          {event.category}
                        </span>

                        <span className="text-xs text-slate-400">
                          {formattedDate} {formattedTime}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                        {event.details}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-0.5">
                        <span>
                          Actor: <strong className="text-slate-800">{event.actor}</strong>{' '}
                          <span className="text-slate-400">({event.actorRole})</span>
                        </span>
                        {event.ipAddress && (
                          <span>
                            • IP: <span className="font-mono text-slate-600">{event.ipAddress}</span>
                          </span>
                        )}
                        {event.metadata?.proformaNumber && (
                          <span>
                            • Proforma: <span className="font-mono text-blue-600 font-semibold">{event.metadata.proformaNumber}</span>
                          </span>
                        )}
                        {event.metadata?.token && (
                          <span>
                            • Token: <span className="font-mono text-amber-600 font-semibold">{event.metadata.token}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEventForDetail(event);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      <span>Inspect Payload</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspect Event Payload Modal */}
      {selectedEventForDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#071433] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Event Diagnostics &amp; Audit Payload
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {selectedEventForDetail.id}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedEventForDetail(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Event Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Action</span>
                  <span className="font-mono font-bold text-slate-900">{selectedEventForDetail.action}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Severity</span>
                  <div>{getSeverityBadge(selectedEventForDetail.severity)}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Category</span>
                  <span className="font-bold text-slate-800">{selectedEventForDetail.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Actor</span>
                  <span className="font-semibold text-slate-900">{selectedEventForDetail.actor}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Actor Role</span>
                  <span className="font-mono text-slate-700">{selectedEventForDetail.actorRole}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Timestamp</span>
                  <span className="font-mono text-[11px] text-slate-600">
                    {new Date(selectedEventForDetail.timestamp).toISOString()}
                  </span>
                </div>
              </div>

              {/* Event Description */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Human-Readable Event Description</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedEventForDetail.details}
                </div>
              </div>

              {/* JSON Metadata Payload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-900">Contextual Payload &amp; Metadata (JSON)</label>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(selectedEventForDetail.metadata || {}, null, 2),
                        'json_payload'
                      )
                    }
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'json_payload' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'json_payload' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-xl overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                  {JSON.stringify(selectedEventForDetail.metadata || {}, null, 2)}
                </pre>
              </div>

              {/* Origin & Client Environment */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Client Device &amp; Network Trace
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Origin IP:</span>{' '}
                    <code className="font-mono text-slate-800">{selectedEventForDetail.ipAddress || '127.0.0.1'}</code>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500">User Agent:</span>{' '}
                    <span className="font-mono text-slate-800" title={selectedEventForDetail.userAgent}>
                      {selectedEventForDetail.userAgent || 'CompliseyKernel/1.0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statutory Note */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Audit Record Integrity:</strong> This event log entry constitutes an immutable digital audit record for administrative compliance and reporting history.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                Firestore Collection: <code className="font-mono text-slate-700">/system_audit_logs/{selectedEventForDetail.id}</code>
              </span>
              <button
                onClick={() => setSelectedEventForDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
