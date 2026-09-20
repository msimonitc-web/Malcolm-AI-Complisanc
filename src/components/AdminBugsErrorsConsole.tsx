import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Bug,
  Activity,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Play,
  Terminal,
  Server,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import {
  systemErrorService,
  SystemIncident,
  DiagnosticResult,
  ErrorSeverity,
} from '../services/systemErrorService';
import { useAcademy } from '../context/AcademyContext';

export const AdminBugsErrorsConsole: React.FC = () => {
  const { currentUser } = useAcademy();
  const [incidents, setIncidents] = useState<SystemIncident[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'unresolved' | 'critical' | 'error' | 'warning'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(null);
  const [simulatedFeedback, setSimulatedFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = systemErrorService.subscribe((list) => {
      setIncidents(list);
    });
    return unsubscribe;
  }, []);

  const runDiagnosticCheck = async () => {
    setIsRunningDiagnostics(true);
    try {
      const results = await systemErrorService.runDiagnosticSuite();
      setDiagnostics(results);
    } catch (e: any) {
      console.error('Diagnostic error:', e);
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const handleSimulateBug = () => {
    const testIncident = systemErrorService.logIncident({
      severity: 'error',
      category: 'quiz_engine',
      title: 'Simulated Section 34 Quiz Validation Latency Spike',
      message: 'Assessment scoring worker exceeded 1200ms latency during candidate submission test drill.',
      component: 'UnitAssessmentView / ScoringEngine',
      stackTrace: 'Error: Latency simulated at UnitAssessmentView.tsx:482:12\n    at evaluateScore (QuizWorker.ts:114:9)',
      userSessionId: currentUser?.sessionId || 'sess-admin-drill',
      userEmail: currentUser?.email || 'malcolm@complisanc.com',
    });
    setExpandedIncidentId(testIncident.id);
    setSimulatedFeedback('Test incident successfully simulated and captured in the live error stream.');
    setTimeout(() => setSimulatedFeedback(null), 4000);
  };

  const handleResolveIncident = (id: string) => {
    systemErrorService.resolveIncident(
      id,
      currentUser?.name || 'Administrator',
      'Investigated and confirmed operational. No data corruption detected.'
    );
  };

  const handleReopenIncident = (id: string) => {
    systemErrorService.reopenIncident(id);
  };

  const handleClearResolved = () => {
    systemErrorService.clearResolvedIncidents();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `complisey_bug_incident_report_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered incidents
  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'unresolved' && inc.resolved) return false;
    if (filterSeverity === 'critical' && inc.severity !== 'critical') return false;
    if (filterSeverity === 'error' && inc.severity !== 'error') return false;
    if (filterSeverity === 'warning' && inc.severity !== 'warning') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.message.toLowerCase().includes(q) ||
        (inc.component && inc.component.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const unresolvedCount = incidents.filter((i) => !i.resolved).length;
  const criticalCount = incidents.filter((i) => !i.resolved && i.severity === 'critical').length;
  const errorCount = incidents.filter((i) => !i.resolved && i.severity === 'error').length;
  const warningCount = incidents.filter((i) => !i.resolved && i.severity === 'warning').length;

  return (
    <div className="space-y-6 font-['IBM_Plex_Sans'] animate-in fade-in duration-200">
      {/* Header & Mission Statement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#071433] text-white border border-[#17326c] shadow-lg relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Bug className="w-3 h-3" />
              <span>Real-Time Error &amp; Incident Console</span>
            </span>
            <span className="text-xs text-slate-400">
              Back Office Priority: Sensitive Data Security &amp; Zero Failure
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            System Diagnostics, Bugs &amp; Runtime Error Monitor
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Concentrate on identifying, isolating, and resolving runtime discrepancies, assessment scoring faults, unhandled network rejections, and security telemetry for Malcolm Simon and Eric D'Souza.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={runDiagnosticCheck}
            disabled={isRunningDiagnostics}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningDiagnostics ? 'animate-spin' : ''}`} />
            <span>{isRunningDiagnostics ? 'Testing Modules...' : 'Run Diagnostics'}</span>
          </button>

          <button
            onClick={handleSimulateBug}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-amber-300" />
            <span>Simulate Drill Bug</span>
          </button>
        </div>
      </div>

      {simulatedFeedback && (
        <div className="p-3.5 bg-emerald-950/70 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{simulatedFeedback}</span>
          </div>
          <button
            onClick={() => setSimulatedFeedback(null)}
            className="text-[10px] font-bold text-emerald-400 underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0a162d] border border-slate-200 dark:border-[#193264] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Incidents</span>
            <Bug className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {unresolvedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {incidents.length} total logged
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0a162d] border border-slate-200 dark:border-[#193264] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Critical Failures</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            {criticalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Require immediate patch
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0a162d] border border-slate-200 dark:border-[#193264] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Standard Errors</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {errorCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            UI / Runtime exceptions
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0a162d] border border-slate-200 dark:border-[#193264] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>System Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {unresolvedCount === 0 ? '100%' : `${Math.max(80, 100 - unresolvedCount * 4)}%`}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Statutory stability index
          </div>
        </div>
      </div>

      {/* Diagnostics Panel (if run or available) */}
      {diagnostics.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09152b] border border-slate-200 dark:border-[#17336b] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Subsystem Integrity &amp; Diagnostic Results
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Last executed {new Date().toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {diagnostics.map((diag) => (
              <div
                key={diag.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1e3d] border border-slate-200 dark:border-[#19366f] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {diag.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      diag.status === 'pass'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : diag.status === 'warn'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {diag.status} ({diag.latencyMs}ms)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {diag.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incident Stream & Bug Triage Table */}
      <div className="rounded-2xl bg-white dark:bg-[#071433] border border-slate-200 dark:border-[#17326c] shadow-xs overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-[#17326c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === 'all'
                  ? 'bg-[#071433] text-amber-300 dark:bg-amber-400 dark:text-[#071433]'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All ({incidents.length})
            </button>
            <button
              onClick={() => setFilterSeverity('unresolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === 'unresolved'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Unresolved ({unresolvedCount})
            </button>
            <button
              onClick={() => setFilterSeverity('error')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === 'error'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Errors ({errorCount})
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search error, component..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#0b1e4a] border border-slate-300 dark:border-[#1b3d78] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleExportJson}
              title="Export Incident Log JSON"
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleClearResolved}
              title="Clear Resolved Incidents"
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-700 hover:text-rose-600 dark:text-slate-200 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Incident List */}
        {filteredIncidents.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-[#13285c]">
            {filteredIncidents.map((inc) => {
              const isExpanded = expandedIncidentId === inc.id;

              return (
                <div
                  key={inc.id}
                  className={`p-4 sm:p-5 transition-colors ${
                    inc.resolved
                      ? 'bg-slate-50/40 dark:bg-white/[0.02] opacity-75'
                      : 'hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            inc.severity === 'critical'
                              ? 'bg-rose-600 text-white'
                              : inc.severity === 'error'
                              ? 'bg-rose-100 text-rose-900 dark:bg-rose-950/70 dark:text-rose-200 border border-rose-400/40'
                              : inc.severity === 'warning'
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 border border-amber-400/40'
                              : 'bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-200'
                          }`}
                        >
                          {inc.severity}
                        </span>

                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {inc.title}
                        </span>

                        {inc.occurrenceCount > 1 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/20 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                            {inc.occurrenceCount}x
                          </span>
                        )}

                        {inc.resolved && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-500" />
                            Resolved by {inc.resolvedBy || 'Admin'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {inc.message}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(inc.timestamp).toLocaleString()}
                        </span>
                        {inc.component && (
                          <span>
                            Component: <strong className="text-slate-600 dark:text-slate-300">{inc.component}</strong>
                          </span>
                        )}
                        {inc.userEmail && (
                          <span>
                            User: <strong className="text-slate-600 dark:text-slate-300">{inc.userEmail}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {!inc.resolved ? (
                        <button
                          onClick={() => handleResolveIncident(inc.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark Resolved</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReopenIncident(inc.id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#1d3d75] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer"
                        >
                          Reopen
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedIncidentId(isExpanded ? null : inc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Stack Trace / Technical Details */}
                  {isExpanded && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] space-y-2 overflow-x-auto border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                        <span>Incident ID: {inc.id}</span>
                        <span>Category: {inc.category}</span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {inc.stackTrace || inc.message || 'No stack trace captured.'}
                      </div>
                      {inc.resolutionNotes && (
                        <div className="text-slate-300 pt-2 border-t border-slate-800 font-sans text-xs">
                          <strong>Resolution Notes:</strong> {inc.resolutionNotes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Zero Active Incidents or Unresolved Bugs
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Complisey Academy runtime services, assessment engines, and proforma generators are operating within statutory tolerances.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
