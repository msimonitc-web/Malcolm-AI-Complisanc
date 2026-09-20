import React, { useState, useEffect } from 'react';
import {
  Key,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAcademy } from '../context/AcademyContext';
import { activationTokenService } from '../services/activationTokenService';
import { CompliseyLogo } from './CompliseyLogo';

interface RedeemTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToken?: string;
  onSuccessOpenCourse?: (courseId: string) => void;
}

export const RedeemTokenModal: React.FC<RedeemTokenModalProps> = ({
  isOpen,
  onClose,
  initialToken = '',
  onSuccessOpenCourse,
}) => {
  const { redeemActivationToken, courses } = useAcademy();

  const [tokenInput, setTokenInput] = useState(initialToken);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    courseTitle: string;
    courseIds: string[];
    token: string;
    issuedBy: string;
  } | null>(null);

  useEffect(() => {
    if (initialToken) {
      setTokenInput(initialToken.trim().toUpperCase());
    }
  }, [initialToken]);

  if (!isOpen) return null;

  const handleRedeem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanToken = tokenInput.trim().toUpperCase();
    if (!cleanToken) {
      setErrorMessage("Please enter an activation token issued by Malcolm Simon or Eric D'Souza.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = redeemActivationToken(cleanToken);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessData({
          courseTitle: result.courseTitle || 'Accredited Compliance Training',
          courseIds: result.activatedCourseIds || [],
          token: cleanToken,
          issuedBy: result.issuedBy || 'CompliSey Administration',
        });

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (err) {
          // ignore
        }
      } else {
        setErrorMessage(result.message);
      }
    }, 400);
  };



  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0b1b3d] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-[#1d3d75] animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#071433] text-amber-400 flex items-center justify-center shadow-xs border border-amber-400/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Redeem Course Activation Token
                </h3>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700/50">
                  Section 34 Access
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unlock your accredited Seychelles AML/CFT course curriculum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successData ? (
          /* Activation Success View */
          <div className="space-y-4 py-2">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-200 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Course Curriculum Successfully Activated!</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                Your token <strong className="font-mono bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">{successData.token}</strong> issued by <strong>{successData.issuedBy}</strong> has verified payment and unlocked your training seat.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-[#071433] rounded-xl border border-slate-200 dark:border-[#193566] space-y-2">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Activated Curriculum:
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{successData.courseTitle}</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                Includes full interactive lesson access, video modules, practical case studies, end-of-module assessments, and verifiable Section 34 completion certificate.
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const targetCourseId = successData.courseIds[0] || 'c-1';
                  if (onSuccessOpenCourse) {
                    onSuccessOpenCourse(targetCourseId);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#071433] dark:bg-amber-400 text-amber-300 dark:text-[#071433] hover:bg-[#0c245c] dark:hover:bg-amber-300 text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Start Studying Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Token Input View */
          <form onSubmit={handleRedeem} className="space-y-4">
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                Courses activate upon payment verification and token issuance by administrators <strong>Malcolm Simon</strong> or <strong>Eric D'Souza</strong>. Under Section 34 of the Seychelles AML/CFT Act 2020, all individual and corporate tokens are single-use and strictly non-transferable, permanently locking to the learner's accredited audit record.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Enter Activation Token / Key
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. ACT-AML-7821 or ACT-ALL-2026"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value.toUpperCase());
                    setErrorMessage(null);
                  }}
                  className="w-full px-3.5 py-2.5 font-mono text-sm uppercase bg-slate-50 dark:bg-[#071433] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
                <Key className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Format: <span className="font-mono font-bold">ACT-XXX-XXXX</span> (provided in your payment receipt or activation email).
              </p>
            </div>



            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#071433] dark:bg-amber-400 text-amber-300 dark:text-[#071433] hover:bg-[#0c245c] dark:hover:bg-amber-300 text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verifying Token...</span>
                ) : (
                  <>
                    <span>Activate Course Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
