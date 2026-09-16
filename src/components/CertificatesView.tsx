import React from 'react';
import { Award, CheckCircle2, Download, ExternalLink, ShieldCheck, Sparkles, BookOpen, FileCheck } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const CertificatesView: React.FC = () => {
  const {
    certificates,
    setSelectedCertificateForView,
    courses,
    enrolledProgress,
    isCourseCompleted,
    claimCertificate,
    setActiveTab,
  } = useAcademy();

  // Find any completed courses that don't have their certificate claimed yet
  const unclimedCompletedCourses = courses.filter((c) => {
    return isCourseCompleted(c.id) && !certificates.some((cert) => cert.courseId === c.id);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['IBM_Plex_Sans']">
            Compliance Training Audit Certificates
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            CompliSey verifiable completion certificates for your firm's annual staff training file under Section 34 of the AML/CFT Act 2020.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
          <Award className="w-4 h-4 text-amber-600" />
          <span>{certificates.length} Documented Credential{certificates.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      {/* Unclaimed certificates banner */}
      {unclimedCompletedCourses.length > 0 && (
        <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                You have {unclimedCompletedCourses.length} AML/CFT course completed and ready for certification!
              </h4>
              <p className="text-xs text-amber-900">
                Seal your credential to place on your regulated firm's annual audit file.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const c = unclimedCompletedCourses[0];
              const cert = claimCertificate(c.id);
              if (cert) setSelectedCertificateForView(cert);
            }}
            className="px-4 py-2 rounded-xl bg-[#071433] hover:bg-[#0d2866] text-amber-300 text-xs font-bold transition-colors shadow-xs shrink-0"
          >
            Claim Certificate Now
          </button>
        </div>
      )}

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-[#071433] flex items-center justify-center shadow-md shadow-amber-500/20">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {cert.id}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                    CompliSey Certificate of Competency
                  </span>
                  <h3 className="text-base font-bold text-[#071433] mt-0.5">{cert.courseTitle}</h3>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5 border border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Staff Member:</span>
                    <strong className="text-slate-900">{cert.studentName}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Date Issued:</span>
                    <span>{cert.issueDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Audit Status:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passed ({cert.gradeScore}) · 4.0 CPD Hours
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Valid for FSA/FIU File</span>
                </div>

                <button
                  onClick={() => setSelectedCertificateForView(cert)}
                  className="px-4 py-2 rounded-xl bg-[#071433] hover:bg-[#0f2c70] text-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>View Official PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No certificates unlocked yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Complete the lectures and score 80%+ on the mandatory AML/CFT exam to issue your verifiable certificate for the audit file.
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#071433] text-amber-300 text-xs font-bold hover:bg-[#0c245c] transition-colors"
          >
            Continue Active Course
          </button>
        </div>
      )}
    </div>
  );
};
