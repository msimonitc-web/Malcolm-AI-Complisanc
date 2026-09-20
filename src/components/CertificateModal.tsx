import React, { useState } from 'react';
import {
  X,
  Award,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  ExternalLink,
  Lock,
  BookOpen,
  Clock,
  Layers,
  Building2,
  Check,
  FileText,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { CompliseyLogo } from './CompliseyLogo';
import { WatermarkOverlay } from './WatermarkOverlay';
import { getCourseTranscript } from '../data/assessmentWeaknessData';

export const CertificateModal: React.FC = () => {
  const { selectedCertificateForView, setSelectedCertificateForView, student, currentUser, courses } = useAcademy();
  const [activeModalTab, setActiveModalTab] = useState<'certificate' | 'transcript' | 'audit_package'>('certificate');
  const [isDraftMode, setIsDraftMode] = useState(false);

  if (!selectedCertificateForView) return null;

  const cert = selectedCertificateForView;

  // Find course data if available to pull full lesson syllabus
  const matchedCourse = courses.find(
    (c) => c.id === cert.courseId || c.title.toLowerCase().includes(cert.courseTitle.toLowerCase())
  );

  const transcript = matchedCourse
    ? getCourseTranscript(matchedCourse)
    : {
        totalHours: cert.cpdHours || 4.0,
        totalModules: 3,
        totalLessons: 18,
        topics: [
          {
            moduleTitle: 'Unit 1 — Regulatory Foundations & Key Concepts',
            durationMinutes: 50,
            topics: [
              'Introduction to Money Laundering & Predicate Crimes',
              'The Three Stages: Placement, Layering, Integration',
              'Seychelles Regulatory Framework & Core AML/CFT Definitions',
              'Customer Due Diligence (CDD) Tiers & Identification Duties',
            ],
            learningOutcomes: [
              'Compliance training standards for reporting entities',
              'Detection of placement and layering typologies',
            ],
          },
          {
            moduleTitle: 'Unit 2 — Typologies, Red Flags & Counter Duties',
            durationMinutes: 55,
            topics: [
              'Trade-Based Laundering & Offshore Holding Structures',
              'Targeted Financial Sanctions (TFS) Screening & 24-hr Freezing Rules',
              'Beneficial Ownership Unraveling to 10% Threshold',
              'Politically Exposed Persons (PEPs) & Enhanced Due Diligence',
            ],
            learningOutcomes: [
              'Targeted financial sanctions compliance',
              'Beneficial ownership verification',
            ],
          },
          {
            moduleTitle: 'Unit 3 — Internal Reporting, Confidentiality & Audits',
            durationMinutes: 50,
            topics: [
              'Suspicious Transaction Reporting (STR) to the FIU',
              'Anti-Tipping-Off Safeguards & Confidentiality Obligations',
              'Internal Escalation to the Compliance Officer / MLRO',
              '7-Year Record Retention Obligations',
            ],
            learningOutcomes: [
              'Reporting protocols and confidentiality rules',
              'Audit trail maintenance for regulatory review',
            ],
          },
        ],
        statutoryCompetencies: [
          'AML/CFT Professional Training Framework for Reporting Entities',
          'FIU Seychelles Guidance Notes on Beneficial Ownership & TFS',
          'Professional Compliance Standards & Reporting Entity Obligations',
          'Targeted Financial Sanctions Screening against UN & National Lists',
          'Strict Non-Disclosure & Anti-Tipping-Off Duties',
          '7-Year Audit Retention for CDD Records',
        ],
      };

  const isCorporateLearner =
    !!student?.companyName && currentUser?.role !== 'corporate' && currentUser?.role !== 'admin';
  const isCorporateAdmin = currentUser?.role === 'corporate' || currentUser?.role === 'admin';

  const handlePrint = () => {
    if (isCorporateLearner) return;
    window.print();
  };

  const displayCompanyName = cert.companyName || student?.companyName || 'Victoria Fiduciary Services Ltd';
  const displayTitle = cert.studentTitle || student?.title || 'Compliance Officer';

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#071433]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[94vh]">
        {/* Top Header Bar */}
        <div className="px-5 py-3 bg-[#071433] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#14326d] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#071433] flex items-center justify-center font-bold shadow-xs">
              <Award className="w-4 h-4 text-[#071433]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold tracking-wide">
                  CompliSey Regulatory Credential &amp; Syllabus Transcript
                </span>
                {isCorporateAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-blue-700">
                    Admin Download Authorized
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-300 block">
                Official Compliance Dossier for {displayCompanyName} · AML/CFT Training Record
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* View Selector Tabs */}
            <div className="flex items-center bg-[#0d2252] p-1 rounded-lg border border-blue-900 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setActiveModalTab('certificate')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeModalTab === 'certificate'
                    ? 'bg-amber-400 text-[#071433] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Certificate
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('transcript')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeModalTab === 'transcript'
                    ? 'bg-amber-400 text-[#071433] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Course Transcript
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('audit_package')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeModalTab === 'audit_package'
                    ? 'bg-amber-400 text-[#071433] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Combined 2-Page Audit Package (Certificate + Course Transcript)"
              >
                Audit Package (Both)
              </button>
            </div>

            {!isCorporateLearner ? (
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-[#071433] hover:bg-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Print or Save as PDF for Audit Records"
              >
                <Printer className="w-3.5 h-3.5 text-[#071433]" />
                <span className="hidden sm:inline">Download / Print</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-400/30">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Corporate Archive</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => setSelectedCertificateForView(null)}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-100/60 print:bg-white print:p-0 space-y-6">
          {/* Certificate View (Page 1) */}
          {(activeModalTab === 'certificate' || activeModalTab === 'audit_package') && (
            <div className="bg-[#fdfdfb] text-slate-900 relative rounded-xl border border-slate-300 shadow-md p-6 sm:p-10 print:border-none print:shadow-none print:p-0 print:m-0 print:break-after-page">
              <WatermarkOverlay opacity={0.07} />

              <div className="border-4 border-double border-[#071433]/30 rounded-xl p-6 sm:p-10 text-center relative bg-white/95 shadow-sm">
                {/* Header with CompliSey Seal */}
                <div className="flex flex-col items-center justify-center mb-3">
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

                <div className="w-24 h-0.5 bg-amber-500 mx-auto mb-4" />

                <h2 className="text-xs sm:text-sm font-bold tracking-widest text-amber-800 uppercase mb-2">
                  Certificate of Competency &amp; Completion
                </h2>

                <p className="text-xs italic text-slate-500 font-['IBM_Plex_Serif'] mb-2">
                  This is to certify that
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#071433] tracking-tight font-['IBM_Plex_Serif'] mb-1">
                  {cert.studentName}
                </h1>

                <p className="text-xs text-slate-600 font-semibold mb-4">
                  {displayTitle} · <span className="text-slate-800 font-bold">{displayCompanyName}</span>
                </p>

                <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mb-4">
                  has completed the accredited curriculum, practical operational unit assessments, and achieved a verified passing score on the comprehensive regulatory examination for:
                </p>

                <div className="px-5 py-2.5 bg-[#071433]/5 rounded-xl inline-block border border-[#071433]/15 mb-6 max-w-xl">
                  <h3 className="text-sm sm:text-base font-bold text-[#071433]">{cert.courseTitle}</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Training aligned with Seychelles AML/CFT regulatory standards &amp; institutional compliance policies
                  </p>
                </div>

                {/* Footer Verification & Signatures */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-4 border-t border-slate-200 mt-4">
                  <div className="text-center">
                    <div className="h-8 flex items-center justify-center font-['IBM_Plex_Serif'] italic text-sm font-bold text-slate-800 border-b border-slate-300 px-4">
                      CompliSey Regulatory Faculty
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 mt-1">Lead AML/CFT Faculty</p>
                    <p className="text-[10px] text-slate-400">Complisanc Consulting Services (SEY)</p>
                  </div>

                  {/* Certified Seal */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-400 text-[#071433] flex flex-col items-center justify-center shadow-md ring-4 ring-amber-100 border border-amber-500/50 p-2">
                      <CompliseyLogo className="w-8 h-8" cColor="#071433" ankhColor="#071433" />
                      <span className="text-[7px] font-black tracking-tighter text-[#071433] mt-0.5">
                        VERIFIED
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1">ID: {cert.id}</span>
                  </div>

                  <div className="text-center">
                    <div className="h-8 flex flex-col items-center justify-center border-b border-slate-300 px-2 leading-none py-1">
                      <span className="font-mono text-[11px] font-semibold text-slate-700">
                        {cert.issueDate}
                      </span>
                      {cert.expiryDate && (
                        <span className="text-[9px] text-amber-700 font-bold mt-0.5">
                          Expires: {cert.expiryDate}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 mt-1">Date of Issuance &amp; Expiry</p>
                    <p className="text-[10px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Grade: {cert.gradeScore} · {cert.cpdHours || 4.0} CPD Hours
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

                <div className="mt-2 text-[9px] text-slate-400 text-center leading-tight">
                  Complisey (complisey.com) is an independent training provider helping regulated entities ensure compliance with their regulatory obligations and training policies.
                </div>
              </div>
            </div>
          )}

          {/* Course Topics Syllabus Transcript (Page 2) */}
          {(activeModalTab === 'transcript' || activeModalTab === 'audit_package') && (
            <div className="bg-[#fdfdfb] text-slate-900 relative rounded-xl border border-slate-300 shadow-md p-6 sm:p-10 print:border-none print:shadow-none print:p-0 print:m-0">
              <div className="border-4 border-slate-200 rounded-xl p-6 sm:p-8 bg-white text-left space-y-6">
                {/* Transcript Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#071433] text-amber-400 flex items-center justify-center font-bold p-1 shadow-xs">
                      <CompliseyLogo className="w-full h-full" cColor="#ffffff" ankhColor="#d9a438" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold uppercase tracking-wider text-[#071433]">
                        Official Course Syllabus Transcript
                      </h2>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        Complisey Academy · Complisanc Consulting Services (SEY)
                      </span>
                      <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wide">
                        Curriculum Topics &amp; Core Compliance Competencies
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs space-y-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 shrink-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Credential Details
                    </div>
                    <div className="font-mono font-bold text-slate-800">{cert.id}</div>
                    <div className="text-slate-600 font-mono text-[11px]">Code: {cert.verificationCode}</div>
                    <div className="text-emerald-700 font-bold">CPD Hours: {cert.cpdHours || 4.0} hrs</div>
                  </div>
                </div>

                {/* Candidate & Course Profile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Student / Staff Member
                    </span>
                    <strong className="text-slate-900 text-sm">{cert.studentName}</strong>
                    <div className="text-slate-600">{displayTitle}</div>
                    <div className="text-blue-900 font-semibold">{displayCompanyName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Certified Course
                    </span>
                    <strong className="text-slate-900 text-sm">{cert.courseTitle}</strong>
                    <div className="text-slate-600">Completion Date: {cert.issueDate}</div>
                    <div className="text-emerald-700 font-bold">Examination Grade: {cert.gradeScore}</div>
                  </div>
                </div>

                {/* Topics Covered Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#071433] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-800" />
                      <span>Curriculum Modules &amp; Topics Covered</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {transcript.topics.length} Units · {transcript.totalLessons} Lessons
                    </span>
                  </div>

                  <div className="space-y-3">
                    {transcript.topics.map((unit, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#071433] text-amber-300 flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span>{unit.moduleTitle}</span>
                          </h4>
                          <span className="text-[11px] font-mono font-semibold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{unit.durationMinutes} mins</span>
                          </span>
                        </div>

                        <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {unit.topics.map((t, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                              <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Competencies Validated */}
                <div className="space-y-2.5 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#071433] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Core Competencies Assessed &amp; Validated</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {transcript.statutoryCompetencies.map((comp, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-2 text-[11px] text-emerald-950 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                        <span>{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formal Academic Registrar Endorsement */}
                <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="h-7 border-b border-slate-300 font-['IBM_Plex_Serif'] italic font-bold text-slate-800">
                      Malcolm Simon
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 mt-0.5">Academic Registrar &amp; Managing Director</div>
                    <div className="text-[10px] text-slate-400">Complisanc Consulting Services (SEY)</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="h-7 border-b border-slate-300 font-['IBM_Plex_Serif'] italic font-bold text-slate-800 sm:text-right">
                      CompliSey Faculty Board
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 mt-0.5">Training Academy Certification</div>
                    <div className="text-[10px] text-slate-400">Official Institutional Transcript Archive</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3 shrink-0">
          {isCorporateLearner ? (
            <div className="flex items-start gap-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex-1">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Corporate Staff Training Archive:</strong> Under reporting entity compliance policies for{' '}
                <strong className="font-extrabold">{displayCompanyName}</strong>, your certified credential and syllabus transcript are officially archived with your Corporate Administrator and HR Team for regulatory inspection.
              </span>
            </div>
          ) : (
            <div className="text-slate-600 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Accredited completion record and transcript for your firm's annual staff training file.
              </span>
            </div>
          )}

          <div className="flex gap-2 ml-auto shrink-0">
            {!isCorporateLearner && (
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-[#071433] text-amber-300 text-xs font-bold hover:bg-[#0e2763] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>
                  {activeModalTab === 'audit_package'
                    ? 'Download Complete 2-Page Audit Package'
                    : activeModalTab === 'transcript'
                    ? 'Download Course Transcript'
                    : 'Download Certificate & Transcript'}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedCertificateForView(null)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
