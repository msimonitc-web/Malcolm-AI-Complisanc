import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, Download, Share2, Printer, Sparkles, ExternalLink, Building2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, Certificate, StudentProfile } from '../types';
import { useAcademy } from '../context/AcademyContext';

interface CourseCertificateViewProps {
  course: Course;
  student: StudentProfile;
  certificate: Certificate | null;
  examScore?: number;
  onClaimCertificate: () => Certificate | null;
  onViewCertificateModal: (cert: Certificate) => void;
}

export const CourseCertificateView: React.FC<CourseCertificateViewProps> = ({
  course,
  student,
  certificate,
  examScore = 96,
  onClaimCertificate,
  onViewCertificateModal,
}) => {
  const { currentUser } = useAcademy();
  const isCorporateLearner = !!student.companyName && currentUser?.role !== 'corporate';

  const [claimedCert, setClaimedCert] = useState<Certificate | null>(certificate);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = () => {
    setIsClaiming(true);
    const cert = onClaimCertificate();
    if (cert) {
      setClaimedCert(cert);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
    }
    setIsClaiming(false);
  };

  const activeCert = claimedCert || certificate;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xs">
          <Award className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Course Completed & Certified!
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
          Congratulations on completing all modules, unit assessments, and passing the final exam for{' '}
          <strong className="text-slate-900 dark:text-white">{course.title}</strong>.
        </p>
      </div>

      {/* Certificate Preview Card */}
      <div className="relative bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-600/50 rounded-2xl p-6 sm:p-10 shadow-lg overflow-hidden">
        {/* Certificate Watermark Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
          <ShieldCheck className="w-96 h-96 text-amber-900 dark:text-amber-100" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Certificate Header Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Official CompliSey Regulatory Credential</span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
              This is to certify that
            </h3>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white underline decoration-amber-400/60 underline-offset-8">
              {student.name}
            </p>
            {student.companyName && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {student.title ? `${student.title} · ` : ''}{student.companyName}
              </p>
            )}
          </div>

          <div className="max-w-xl space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              has successfully fulfilled all statutory compliance modules, verified practical assessments, and achieved a passing score on the comprehensive regulatory examination:
            </p>
            <h4 className="text-base sm:text-lg font-bold text-indigo-950 dark:text-indigo-200">
              {course.title}
            </h4>
          </div>

          {/* Verification Metas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 w-full max-w-lg text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Exam Grade</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{examScore}% (Distinction)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Issue Date</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {activeCert?.issueDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Verification ID</span>
              <span className="font-mono font-medium text-slate-600 dark:text-slate-400 text-[11px]">
                {activeCert?.verificationCode || `VERIFY-${course.id.toUpperCase()}-2026`}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {!activeCert ? (
              <button
                type="button"
                onClick={handleClaim}
                disabled={isClaiming}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Claim Official Certificate</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onViewCertificateModal(activeCert)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View High-Res Certificate</span>
                </button>
                {!isCorporateLearner ? (
                  <button
                    type="button"
                    onClick={() => onViewCertificateModal(activeCert)}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Audit Copy</span>
                  </button>
                ) : (
                  <span className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-semibold text-xs flex items-center gap-2 select-none">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>PDF Download Locked</span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
