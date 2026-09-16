import React, { useState } from 'react';
import { X, Award, Printer, ShieldCheck, CheckCircle2, FileCheck, ExternalLink } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { CompliseyLogo } from './CompliseyLogo';

export const CertificateModal: React.FC = () => {
  const { selectedCertificateForView, setSelectedCertificateForView, student } = useAcademy();
  const [isDraftMode, setIsDraftMode] = useState(true);

  if (!selectedCertificateForView) return null;

  const cert = selectedCertificateForView;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#071433]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-[#071433] text-white flex items-center justify-between border-b border-[#14326d]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-[#071433] flex items-center justify-center font-bold shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-wide block">
                CompliSey Certificate of AML/CFT Course Completion
              </span>
              <span className="text-[10px] text-slate-300 block">
                Documented for Reporting Entity Staff Compliance File
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDraftMode(!isDraftMode)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                isDraftMode
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
              }`}
            >
              {isDraftMode ? 'DRAFT Watermark' : 'FINAL Certified'}
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors text-white"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setSelectedCertificateForView(null)}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-10 bg-[#fdfdfb] text-slate-900 relative print:p-0">
          {/* Subtle Watermark for Local Review */}
          {isDraftMode && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
              <span className="text-8xl sm:text-9xl font-black font-['Space_Grotesk'] text-slate-200/50 -rotate-25 uppercase tracking-widest">
                DRAFT
              </span>
            </div>
          )}

          <div className="border-4 border-double border-[#071433]/30 rounded-xl p-6 sm:p-10 text-center relative bg-white/95 shadow-sm">
            {/* Header with CompliSey Coat/Seal */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center p-1.5 shadow-md mb-2">
                <CompliseyLogo className="w-full h-full" cColor="#071433" ankhColor="#d9a438" />
              </div>
              <span className="text-base font-extrabold tracking-widest text-[#071433] uppercase font-['IBM_Plex_Sans']">
                COMPLISEY ACADEMY
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-0.5">
                Complisanc Consulting Services (SEY) trading as Complisey
              </span>
            </div>

            <div className="w-24 h-0.5 bg-amber-500 mx-auto mb-5" />

            <h2 className="text-xs sm:text-sm font-bold tracking-widest text-amber-800 uppercase mb-2">
              Certificate of Competency & Completion
            </h2>

            <p className="text-xs italic text-slate-500 font-['IBM_Plex_Serif'] mb-2">
              This is to certify that
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#071433] tracking-tight font-['IBM_Plex_Serif'] mb-1">
              {cert.studentName}
            </h1>

            <p className="text-xs text-slate-600 font-medium mb-4">
              {student.title}
            </p>

            <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mb-4">
              has completed the required curriculum, interactive case studies, and passed the regulated competency assessment with distinction for:
            </p>

            <div className="px-5 py-2.5 bg-[#071433]/5 rounded-xl inline-block border border-[#071433]/15 mb-6 max-w-xl">
              <h3 className="text-sm sm:text-base font-bold text-[#071433]">
                {cert.courseTitle}
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Compliant with Section 34 of the Seychelles AML/CFT Act 2020 & FIU Guidelines
              </p>
            </div>

            {/* Footer Verification & Signatures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-4 border-t border-slate-200 mt-4">
              <div className="text-center">
                <div className="h-8 flex items-center justify-center font-['IBM_Plex_Serif'] italic text-sm font-bold text-slate-800 border-b border-slate-300 px-4">
                  CompliSey Regulatory Faculty
                </div>
                <p className="text-[11px] font-bold text-slate-800 mt-1">Lead AML/CFT Faculty</p>
                <p className="text-[10px] text-slate-400">CompliSey Consulting Services</p>
              </div>

              {/* Certified Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-400 text-[#071433] flex flex-col items-center justify-center shadow-md ring-4 ring-amber-100 border border-amber-500/50 p-2">
                  <CompliseyLogo className="w-8 h-8" cColor="#071433" ankhColor="#071433" />
                  <span className="text-[7px] font-black tracking-tighter text-[#071433] mt-0.5">VERIFIED</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1">ID: {cert.id}</span>
              </div>

              <div className="text-center">
                <div className="h-8 flex items-center justify-center font-mono text-xs font-semibold text-slate-700 border-b border-slate-300 px-4">
                  {cert.issueDate}
                </div>
                <p className="text-[11px] font-bold text-slate-800 mt-1">Date of Issuance</p>
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Grade: {cert.gradeScore} · 4.0 CPD Hours
                </p>
              </div>
            </div>

            {/* Regulatory Retention Notice */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
              <span className="flex items-center gap-1 text-slate-600">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                Retain this certificate on the entity's staff compliance training file (7-year retention).
              </span>
              <span className="font-mono text-slate-500">{cert.verificationCode}</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 hidden sm:inline">
            Complisanc Consulting Services (SEY) trading as Complisey.
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[#071433] text-amber-300 text-xs font-bold hover:bg-[#0e2763] transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print for Audit File</span>
            </button>
            <button
              onClick={() => setSelectedCertificateForView(null)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
