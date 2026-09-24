import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  RefreshCw, 
  Server, 
  HardDrive,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { systemAuditLogService } from '../services/systemAuditLogService';
import { activationTokenService } from '../services/activationTokenService';

export const AdminDatabaseBackupView: React.FC = () => {
  const { orders, activationTokens, clientReceipts } = useAcademy();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);
  
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restorePreview, setRestorePreview] = useState<any | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState<string | null>(null);
  const [showConfirmRestoreModal, setShowConfirmRestoreModal] = useState(false);
  const [showCleanSlateModal, setShowCleanSlateModal] = useState(false);

  const auditLogs = systemAuditLogService.getAllEvents();

  // Calculate storage sizes and stats
  const ordersCount = orders.length;
  const tokensCount = activationTokens.length;
  const receiptsCount = clientReceipts.length;
  const auditLogsCount = auditLogs.length;

  const handleExportBackup = () => {
    setIsExporting(true);
    setExportSuccessMsg(null);
    try {
      const backupData = {
        version: '1.0',
        academy: 'Complisey Academy — Seychelles AML/CFT Professional Training',
        timestamp: new Date().toISOString(),
        exportedBy: "Malcolm Simon / Eric D'Souza (Back Office)",
        records: {
          orders: localStorage.getItem('academy_orders') ? JSON.parse(localStorage.getItem('academy_orders') || '[]') : orders,
          activationTokens: localStorage.getItem('complisey_activation_tokens') ? JSON.parse(localStorage.getItem('complisey_activation_tokens') || '[]') : activationTokens,
          auditLogs: localStorage.getItem('academy_system_audit_logs') ? JSON.parse(localStorage.getItem('academy_system_audit_logs') || '[]') : auditLogs,
          clientReceipts: localStorage.getItem('complisey_client_receipts') ? JSON.parse(localStorage.getItem('complisey_client_receipts') || '[]') : clientReceipts,
          adminPasswords: localStorage.getItem('complisey_admin_passwords') ? JSON.parse(localStorage.getItem('complisey_admin_passwords') || '{}') : {},
          studentProfile: localStorage.getItem('academy_student') ? JSON.parse(localStorage.getItem('academy_student') || '{}') : null,
          adminNotifications: localStorage.getItem('complisey_admin_notifications') ? JSON.parse(localStorage.getItem('complisey_admin_notifications') || '[]') : [],
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute("download", `complisey_academy_database_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      systemAuditLogService.logEvent(
        'SYSTEM',
        'INFO',
        'DATABASE_BACKUP_EXPORTED',
        'Malcolm Simon',
        'admin',
        `Full academy database backup successfully exported (${ordersCount} orders, ${tokensCount} tokens, ${auditLogsCount} audit events).`,
        { ordersCount, tokensCount, auditLogsCount, timestamp: new Date().toISOString() }
      );

      setExportSuccessMsg(`Successfully generated and downloaded academy database snapshot (${ordersCount} orders, ${tokensCount} tokens, ${auditLogsCount} audit logs).`);
    } catch (err: any) {
      console.error('Backup export failed:', err);
      setExportSuccessMsg('Failed to export backup: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreError(null);
    setRestoreSuccessMsg(null);
    setRestoreFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.records || !json.academy) {
          throw new Error('Invalid backup file format. Missing Complisey Academy records structure.');
        }
        setRestorePreview({
          timestamp: json.timestamp || 'Unknown',
          version: json.version || '1.0',
          exportedBy: json.exportedBy || 'Unknown',
          ordersCount: json.records.orders?.length || 0,
          tokensCount: json.records.activationTokens?.length || 0,
          auditLogsCount: json.records.auditLogs?.length || 0,
          receiptsCount: json.records.clientReceipts?.length || 0,
          rawRecords: json.records,
        });
      } catch (err: any) {
        setRestoreError('Failed to parse backup file: ' + (err?.message || 'Invalid JSON'));
        setRestoreFile(null);
        setRestorePreview(null);
      }
    };
    reader.readAsText(file);
  };

  const executeRestore = () => {
    if (!restorePreview || !restorePreview.rawRecords) return;
    setIsRestoring(true);
    setRestoreError(null);

    try {
      const recs = restorePreview.rawRecords;
      if (recs.orders) localStorage.setItem('academy_orders', JSON.stringify(recs.orders));
      if (recs.activationTokens) localStorage.setItem('complisey_activation_tokens', JSON.stringify(recs.activationTokens));
      if (recs.auditLogs) localStorage.setItem('academy_system_audit_logs', JSON.stringify(recs.auditLogs));
      if (recs.clientReceipts) localStorage.setItem('complisey_client_receipts', JSON.stringify(recs.clientReceipts));
      if (recs.adminPasswords) localStorage.setItem('complisey_admin_passwords', JSON.stringify(recs.adminPasswords));
      if (recs.studentProfile) localStorage.setItem('academy_student', JSON.stringify(recs.studentProfile));
      if (recs.adminNotifications) localStorage.setItem('complisey_admin_notifications', JSON.stringify(recs.adminNotifications));

      systemAuditLogService.logEvent(
        'SYSTEM',
        'WARNING',
        'DATABASE_BACKUP_RESTORED',
        'Malcolm Simon',
        'admin',
        `Database successfully restored from backup snapshot (Restored ${recs.orders?.length || 0} orders, ${recs.activationTokens?.length || 0} tokens).`,
        { restoredTimestamp: restorePreview.timestamp, restoredBy: restorePreview.exportedBy }
      );

      setShowConfirmRestoreModal(false);
      setRestoreSuccessMsg('Database restore completed successfully! Reloading academy state...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setRestoreError('Restore execution failed: ' + (err?.message || 'Unknown error'));
      setIsRestoring(false);
    }
  };

  const executeCleanSlateReset = () => {
    try {
      localStorage.removeItem('academy_orders');
      activationTokenService.clearAllTokens();
      localStorage.removeItem('complisey_client_receipts');
      localStorage.removeItem('complisey_admin_notifications');

      systemAuditLogService.logEvent(
        'SYSTEM',
        'CRITICAL',
        'DATABASE_INITIALIZED_ZERO_RECORDS',
        'Malcolm Simon',
        'admin',
        'Database initialized with zero records for Go-Life launch (October 5, 2026). All demo/test data purged.',
        { timestamp: new Date().toISOString() }
      );

      setShowCleanSlateModal(false);
      alert('Complisey Academy successfully initialized with zero records! Reloading academy for October 5 Go-Live...');
      window.location.reload();
    } catch (err: any) {
      console.error('Clean slate reset failed:', err);
      alert('Failed to initialize clean slate: ' + (err?.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c1f4a] via-[#132c63] to-[#0c1f4a] rounded-2xl p-6 text-white border border-[#1e3a75] shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Database Backup &amp; Disaster Recovery
                <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono">
                  Section 34 Compliant
                </span>
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Securely backup, restore, or clean-slate initialize all academy records to prepare for global launch on <strong>October 5, 2026</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Database Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f1f44] border border-[#1a3875] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Proforma Orders</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{ordersCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active &amp; archived records</div>
        </div>

        <div className="bg-[#0f1f44] border border-[#1a3875] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Activation Tokens</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{tokensCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Machine-bound licenses</div>
        </div>

        <div className="bg-[#0f1f44] border border-[#1a3875] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Audit Trail Logs</span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{auditLogsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Immutable security events</div>
        </div>

        <div className="bg-[#0f1f44] border border-[#1a3875] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Client Receipts</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{receiptsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Tax &amp; payment receipts</div>
        </div>
      </div>

      {/* Main Actions Grid: Export, Restore, and Clean Slate Initialization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Export Backup Card */}
        <div className="bg-[#0f1f44] border border-[#1a3875] rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Export Snapshot</h3>
                <p className="text-xs text-slate-400">Download JSON backup</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Generate an instantaneous JSON backup containing all proforma invoices, student records, multi-seat corporate assignments, and audit logs.
            </p>

            {exportSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{exportSuccessMsg}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleExportBackup}
            disabled={isExporting}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Backup (.JSON)</span>
              </>
            )}
          </button>
        </div>

        {/* Restore Backup Card */}
        <div className="bg-[#0f1f44] border border-[#1a3875] rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Restore Snapshot</h3>
                <p className="text-xs text-slate-400">Recover from backup file</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Upload a previously saved `.json` backup file to restore all orders and activation tokens.
            </p>

            {/* File Input */}
            <div className="mb-4">
              <label className="block w-full cursor-pointer p-3 rounded-xl border-2 border-dashed border-[#23438a] hover:border-amber-400/60 bg-[#081533] text-center transition-all">
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleFileSelected} 
                  className="hidden" 
                />
                <div className="flex flex-col items-center gap-1">
                  <Upload className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold text-white truncate max-w-[220px]">
                    {restoreFile ? restoreFile.name : 'Select JSON backup'}
                  </span>
                </div>
              </label>
            </div>

            {restoreError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
                {restoreError}
              </div>
            )}

            {restorePreview && (
              <div className="mb-3 p-2.5 rounded-xl bg-blue-900/30 border border-blue-500/40 text-blue-200 text-xs">
                <span className="font-bold text-amber-300">Valid:</span> {restorePreview.ordersCount} orders, {restorePreview.tokensCount} tokens
              </div>
            )}
          </div>

          <button
            onClick={() => setShowConfirmRestoreModal(true)}
            disabled={!restorePreview || isRestoring}
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            <span>Restore Database</span>
          </button>
        </div>

        {/* Clean Slate Initialization Card (Zero Records) */}
        <div className="bg-[#0f1f44] border border-rose-500/40 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Go-Live Clean Slate</h3>
                <p className="text-xs text-rose-300">Initialize with Zero Records</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Purge all pre-seeded demo orders, test activation tokens, and trial receipts to establish a completely clean, zero-records state for the official October 5, 2026 launch.
            </p>
          </div>

          <button
            onClick={() => setShowCleanSlateModal(true)}
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Initialize Zero Records</span>
          </button>
        </div>

      </div>

      {/* Confirmation Modal for Restore */}
      {showConfirmRestoreModal && restorePreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1f4a] border border-amber-500/50 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-3 rounded-xl bg-amber-400/20 border border-amber-400/40">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Confirm Database Restoration</h3>
                <p className="text-xs text-slate-300">Critical Administrative Action</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              You are about to overwrite current database records with the backup snapshot dated <strong className="text-white">{new Date(restorePreview.timestamp).toLocaleString()}</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1a3875]">
              <button
                type="button"
                onClick={() => setShowConfirmRestoreModal(false)}
                className="px-4 py-2 rounded-xl bg-[#132c63] hover:bg-[#1a3875] text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeRestore}
                disabled={isRestoring}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#071433] text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Restoring...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Restore</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clean Slate Go-Live Initialization */}
      {showCleanSlateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1f4a] border border-rose-500/50 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Initialize Zero-Records Go-Live?</h3>
                <p className="text-xs text-slate-300">October 5, 2026 Production Launch Preparation</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              This action will permanently purge all demo proforma orders, test activation tokens, and trial client receipts. The academy will start with <strong className="text-white">zero records</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1a3875]">
              <button
                type="button"
                onClick={() => setShowCleanSlateModal(false)}
                className="px-4 py-2 rounded-xl bg-[#132c63] hover:bg-[#1a3875] text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeCleanSlateReset}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Initialize Zero Records</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
