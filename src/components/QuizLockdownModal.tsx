import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  ExternalLink,
  X,
  History,
  CheckCircle2,
  FileWarning,
} from 'lucide-react';
import { LockdownViolation } from './QuizLockdownBanner';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  latestViolation: LockdownViolation | null;
  totalViolations: number;
}

export const QuizLockdownWarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onClose,
  latestViolation,
  totalViolations,
}) => {
  if (!isOpen || !latestViolation) return null;

  const isSevere = totalViolations >= 3;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans'] animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs ring-4 ring-rose-50">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Academic Integrity Violation Detected
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                CompliSey Quiz Lockdown™ Proctoring Notice
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Body */}
        <div className="my-4 space-y-3.5">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-rose-800 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{latestViolation.title}</span>
              </span>
              <span className="font-mono text-[11px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-md">
                {latestViolation.timestamp}
              </span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {latestViolation.detail}
            </p>
          </div>

          {/* Violation Counter Details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                Session Violations
              </span>
              <span className="text-lg font-black text-rose-600 font-mono">
                {totalViolations} / 3 Max
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                Audit Trail Status
              </span>
              <span className="text-xs font-extrabold text-amber-700">
                {isSevere ? 'Flagged for Review' : 'Incident Logged'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">Why was this flagged?</div>
            <p className="text-[11px] leading-relaxed">
              To satisfy Seychelles Anti-Money Laundering &amp; Countering the Financing of Terrorism Act (AML/CFT Act 2020) and reporting entity training policies, assessment attempts require continuous uncompromised attention. All browser tab switches and window blur events are recorded on your firm compliance training file.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 hover:text-amber-200 text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Acknowledge &amp; Return to Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  violations: LockdownViolation[];
  courseTitle: string;
}

export const QuizLockdownAuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  violations,
  courseTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans'] animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Academic Integrity Audit Log
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{courseTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-4 overflow-y-auto flex-1 space-y-2.5 pr-1">
          {violations.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">Clean Session Record</p>
              <p className="text-[11px] text-slate-500">
                No tab switches or unmonitored exits detected during this assessment session.
              </p>
            </div>
          ) : (
            violations.map((v, i) => (
              <div
                key={v.id || i}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1 hover:border-amber-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileWarning className="w-3.5 h-3.5 text-amber-600" />
                    <span>#{i + 1} {v.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {v.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 pl-5">{v.detail}</p>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total events: <strong>{violations.length}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
