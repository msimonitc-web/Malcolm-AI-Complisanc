import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Maximize2,
  Minimize2,
  AlertTriangle,
  History,
  Info,
} from 'lucide-react';

export interface LockdownViolation {
  id: string;
  timestamp: string;
  type: 'tab_switch' | 'window_blur' | 'fullscreen_exit';
  title: string;
  detail: string;
}

interface QuizLockdownBannerProps {
  violations: LockdownViolation[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onViewAuditLog: () => void;
  isSubmitted: boolean;
  score?: number;
  passMark?: number;
}

export const QuizLockdownBanner: React.FC<QuizLockdownBannerProps> = ({
  violations,
  isFullscreen,
  onToggleFullscreen,
  onViewAuditLog,
  isSubmitted,
  score,
  passMark = 80,
}) => {
  const violationCount = violations.length;
  const hasViolations = violationCount > 0;
  const isSevere = violationCount >= 3;

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isSubmitted
          ? hasViolations
            ? 'bg-amber-50/80 border-amber-300'
            : 'bg-emerald-50/80 border-emerald-300'
          : hasViolations
          ? isSevere
            ? 'bg-rose-50 border-rose-300 shadow-xs'
            : 'bg-amber-50/70 border-amber-300 shadow-xs'
          : 'bg-slate-900 text-white border-slate-800 shadow-md'
      }`}
    >
      {/* Top Status Bar */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isSubmitted
                ? hasViolations
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
                : hasViolations
                ? isSevere
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-amber-500 text-white'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {hasViolations ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm tracking-wide uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Quiz Lockdown™ Mode</span>
              </span>

              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSubmitted
                    ? hasViolations
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-emerald-200 text-emerald-900'
                    : hasViolations
                    ? isSevere
                      ? 'bg-rose-200 text-rose-950 font-black'
                      : 'bg-amber-200 text-amber-950'
                    : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    hasViolations
                      ? isSevere
                        ? 'bg-rose-600 animate-ping'
                        : 'bg-amber-600'
                      : 'bg-emerald-400 animate-pulse'
                  }`}
                />
                <span>
                  {isSubmitted
                    ? hasViolations
                      ? 'Attempt Flagged'
                      : 'Integrity Verified'
                    : hasViolations
                    ? `${violationCount} Violation${violationCount > 1 ? 's' : ''}`
                    : 'Monitoring Active'}
                </span>
              </span>
            </div>

            <p
              className={`text-xs mt-0.5 ${
                !isSubmitted && !hasViolations
                  ? 'text-slate-300'
                  : 'text-slate-700'
              }`}
            >
              Academic integrity proctoring active · Strict {passMark}% pass-mark threshold
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hasViolations && (
            <button
              type="button"
              onClick={onViewAuditLog}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                !isSubmitted && !hasViolations
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-600" />
              <span>Log ({violationCount})</span>
            </button>
          )}

          {!isSubmitted && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isFullscreen
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
                  : !hasViolations
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
              title="Toggle Fullscreen Lockdown for distraction-free exam environment"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Fullscreen Lockdown</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Rules banner / Warning Notice */}
      {!isSubmitted && (
        <div
          className={`px-4 py-2.5 text-xs flex items-start gap-2 border-t ${
            hasViolations
              ? isSevere
                ? 'bg-rose-100/70 border-rose-200 text-rose-900'
                : 'bg-amber-100/70 border-amber-200 text-amber-950'
              : 'bg-slate-800/80 border-slate-800 text-slate-300'
          }`}
        >
          {hasViolations ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="leading-tight">
            {hasViolations ? (
              <span>
                <strong>Integrity Notice:</strong> Tab switching or focus loss was detected during this assessment.
                Under Seychelles AML/CFT reporting entity guidelines, all departures are recorded on your certificate audit log.
              </span>
            ) : (
              <span>
                <strong>Academic Integrity Requirement:</strong> Do not switch browser tabs, open external applications, or minimize this window while answering questions. All focus changes are logged.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
