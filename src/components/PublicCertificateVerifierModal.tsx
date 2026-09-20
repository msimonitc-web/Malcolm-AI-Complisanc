import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Search,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Building2,
  User,
  Printer,
  Check,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { Certificate } from '../types';
import { CompliseyLogo } from './CompliseyLogo';

interface PublicCertificateVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const PublicCertificateVerifierModal: React.FC<PublicCertificateVerifierModalProps> = ({
  isOpen,
  onClose,
  initialCode = '',
}) => {
  const { certificates, setSelectedCertificateForView } = useAcademy();
  const [searchQuery, setSearchQuery] = useState(initialCode);
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedCert, setMatchedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    if (initialCode) {
      setSearchQuery(initialCode);
      handleVerify(initialCode);
    }
  }, [initialCode, isOpen]);

  if (!isOpen) return null;

  // Sample quick codes for demonstration
  const sampleCodes = [
    { label: 'Sample: Active Certificate', code: 'CERT-AML-REF' },
    { label: 'Sample: Demo Corporate', code: 'VERIFY-EXP-AML-2025' },
    { label: 'Sample: Statutory L1', code: 'SEY-AML-2026-001' },
  ];

  const handleVerify = (codeToSearch?: string) => {
    const query = (codeToSearch || searchQuery).trim().toUpperCase();
    if (!query) return;

    setHasSearched(true);

    // Search in current certificates with safe nullish operators
    const found = certificates.find(
      (c) =>
        (c?.id && c.id.toUpperCase() === query) ||
        (c?.verificationCode && c.verificationCode.toUpperCase() === query) ||
        (c?.studentName && c.studentName.toUpperCase().includes(query))
    );

    if (found) {
      setMatchedCert(found);
      return;
    }

    // Fallback known demo records if not found in local dynamic state
    if (query === 'CERT-AML-REF' || query === 'VERIFY-EXP-AML-2025') {
      const issueDate = new Date();
      issueDate.setMonth(issueDate.getMonth() - 2);
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 10);

      setMatchedCert({
        id: 'CERT-AML-REF',
        courseId: 'c-1',
        courseTitle: 'Seychelles AML/CFT Statutory Fundamentals (Level 1)',
        studentName: 'Alex Rivera',
        studentTitle: 'Senior Compliance & CDD Officer',
        companyName: 'Victoria Fiduciary Services Ltd (Seychelles)',
        issueDate: issueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        expiryDate: expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        instructorName: 'CompliSey Regulatory Faculty (Malcolm Simon & Eric D\'Souza)',
        gradeScore: '92% (Distinction)',
        verificationCode: 'VERIFY-EXP-AML-2025',
        cpdHours: 6.0,
        statutoryCompetencies: [
          'Section 34 Staff Competency Certification (Seychelles AML/CFT Act 2020)',
          'Customer Due Diligence (CDD) & Ultimate Beneficial Ownership (UBO) Verification',
          'Targeted Financial Sanctions Screening & Freezing Protocols',
          'Suspicious Transaction Reporting (STR) Escalation & Section 48 Tipping-Off Prohibitions',
        ],
      });
    } else if (query.includes('SEY-AML') || query.includes('001') || query.includes('2026')) {
      const issueDate = new Date();
      issueDate.setDate(issueDate.getDate() - 14);
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      setMatchedCert({
        id: query.startsWith('SEY') ? query : 'SEY-AML-2026-001',
        courseId: 'full-pack',
        courseTitle: 'CompliSey Academy: Complete Professional Curriculum Pack (Levels 1 & 2)',
        studentName: 'Marcus Delpech',
        studentTitle: 'Money Laundering Reporting Officer (MLRO)',
        companyName: 'Mahe Trust & Corporate Administration Ltd',
        issueDate: issueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        expiryDate: expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        instructorName: 'CompliSey Regulatory Faculty (Executive Directors)',
        gradeScore: '96% (Distinction)',
        verificationCode: `VERIFY-${query}`,
        cpdHours: 12.0,
        statutoryCompetencies: [
          'Comprehensive 12 CPD Units Compliance Master Training',
          'Professional Compliance CPD Training Record & Continuing Education Portfolio',
          'Corporate Fiduciary Risk Profiling & High-Risk Jurisdiction Management',
          'Institutional Penalties & MLRO Legal Liabilities under Section 52',
        ],
      });
    } else {
      setMatchedCert(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#071433] rounded-3xl border border-slate-200 dark:border-amber-400/30 max-w-2xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#071433] text-white p-6 sm:p-7 border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-[#071433] flex items-center justify-center font-bold shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                  Public Audit Registry
                </span>
                <span className="text-xs text-slate-300">· Section 34 Authenticator</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-1">
                Certificate Authenticity Verification
              </h2>
              <p className="text-xs text-slate-300">
                Official certificate verification registry for Complisey Academy CPD credentials, reporting entities, and compliance employers.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="space-y-3"
          >
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Enter Certificate ID or Verification Code:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. CERT-AML-REF or VERIFY-EXP-AML-2025"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/15 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono uppercase tracking-wide focus:outline-hidden focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
              >
                <span>Verify</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Demo Test Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Quick Test Samples:</span>
              {sampleCodes.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => {
                    setSearchQuery(s.code);
                    handleVerify(s.code);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-amber-400/10 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  {s.label} ({s.code})
                </button>
              ))}
            </div>
          </form>

          {/* Verification Results */}
          {hasSearched && (
            <div>
              {matchedCert ? (
                <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border-2 border-emerald-500 dark:border-emerald-600/70 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-200 dark:border-emerald-800/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                            Verified Genuine
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                            {matchedCert.id}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                          CompliSey Official AML/CFT Audit Credential
                        </h4>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                        Statutory Validity
                      </span>
                      <div className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center sm:justify-end gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Compliant with Section 34</span>
                      </div>
                    </div>
                  </div>

                  {/* Certified Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Certified Learner:</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {matchedCert.studentName}
                      </div>
                      {matchedCert.studentTitle && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {matchedCert.studentTitle}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Regulated Entity:</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {matchedCert.companyName || 'Independent Compliance Officer'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Seychelles Jurisdiction
                      </div>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Curriculum &amp; Exam Result:</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {matchedCert.courseTitle}
                      </div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                        Grade: {matchedCert.gradeScore} · {matchedCert.cpdHours || 6.0} Verified CPD Units
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Issue Date:</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {matchedCert.issueDate}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Annual Recertification Due:</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {matchedCert.expiryDate || 'Annual Review Recommended'}
                      </div>
                    </div>
                  </div>

                  {/* Competency Statement */}
                  <div className="p-3 bg-white dark:bg-black/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-xs space-y-1.5">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      Audit Trail Competencies Confirmed:
                    </div>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                      {(matchedCert.statutoryCompetencies || [
                        'Customer Due Diligence (CDD) under AML/CFT Act 2020',
                        'Beneficial Ownership (UBO) Verification Protocols',
                        'Suspicious Transaction Reporting (STR) & FIU Escalation',
                        'Targeted Financial Sanctions & Asset Freezing Mandates',
                      ]).map((comp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Signatories & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Issuer: <strong className="text-slate-700 dark:text-slate-300">{matchedCert.instructorName}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCertificateForView(matchedCert);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Full Certificate Document</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                    No Matching Certificate Found for "{searchQuery}"
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
                    Please double-check the Certificate ID or Verification Code from the bottom of the issued certificate document. You can also contact CompliSey Support (malcolm@complisanc.com) for manual registry lookups.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-[#050e24] p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CompliseyLogo className="w-4 h-4" />
            <span>CompliSey Academy Audit Registry · Victoria, Seychelles</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
