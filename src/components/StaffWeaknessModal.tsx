import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Printer,
  ShieldAlert,
  Award,
  BookOpen,
  UserCheck,
  Building2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { StaffAssessmentProfile, StaffAssessmentWeakness } from '../types';
import { CompliseyLogo } from './CompliseyLogo';

interface StaffWeaknessModalProps {
  profile: StaffAssessmentProfile | null;
  companyName: string;
  onClose: () => void;
  onViewCertificate?: (certId: string) => void;
  onUpdateHrNotes?: (memberId: string, notes: string, status: 'completed' | 'in_progress' | 'action_required') => void;
}

export const StaffWeaknessModal: React.FC<StaffWeaknessModalProps> = ({
  profile,
  companyName,
  onClose,
  onViewCertificate,
  onUpdateHrNotes,
}) => {
  if (!profile) return null;

  const [notes, setNotes] = useState(profile.hrNotes || '');
  const [remediationStatus, setRemediationStatus] = useState<'completed' | 'in_progress' | 'action_required'>(
    profile.hrRemediationStatus || 'in_progress'
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveNotes = () => {
    if (onUpdateHrNotes) {
      onUpdateHrNotes(profile.memberId, notes, remediationStatus);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const criticalCount = profile.weaknesses.filter((w) => w.status === 'critical').length;
  const moderateCount = profile.weaknesses.filter((w) => w.status === 'moderate').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#071433]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#071433] text-white flex items-center justify-between border-b border-[#14326d] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#071433] flex items-center justify-center font-bold shadow-xs">
              <ShieldAlert className="w-4 h-4 text-[#071433]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wide">
                  Staff Assessment &amp; Competency Weakness Diagnostic
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-900 text-amber-300 border border-blue-700">
                  HR &amp; MLRO File
                </span>
              </div>
              <span className="text-[11px] text-slate-300">
                Diagnostic AML/CFT staff competency gap analysis
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 text-white transition-colors cursor-pointer"
              title="Print for Staff HR Training File"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 bg-[#fbfbfa]">
          {/* Header Summary Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 font-['IBM_Plex_Sans']">
                  {profile.memberName}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {profile.role}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span className="font-mono">{profile.memberEmail}</span>
                <span>·</span>
                <span className="font-semibold text-slate-700">{companyName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                  Overall Competency
                </span>
                <span className="text-2xl font-black font-mono text-[#071433]">
                  {profile.overallScore > 0 ? `${profile.overallScore}%` : 'In Progress'}
                </span>
              </div>
              <div className="h-10 w-[1px] bg-slate-200" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                  Identified Gaps
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {criticalCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px] border border-rose-200">
                      {criticalCount} Critical
                    </span>
                  )}
                  {moderateCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-200">
                      {moderateCount} Moderate
                    </span>
                  )}
                  {criticalCount === 0 && moderateCount === 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                      Zero Critical Gaps
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Domain Performance Radar / Bar */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>Regulatory Competency Domains Tested</span>
              </h3>
              <span className="text-[11px] text-slate-500">Benchmark: 80% passing standard</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {Object.entries(profile.domainScores).map(([domain, rawScore]) => {
                const score = typeof rawScore === 'number' ? rawScore : Number(rawScore) || 0;
                const isUnder = score < 80 && score > 0;
                const isStrong = score >= 90;
                return (
                  <div
                    key={domain}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                      isUnder
                        ? 'bg-rose-50/60 border-rose-200'
                        : isStrong
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 truncate pr-2">{domain}</span>
                      <span
                        className={`font-mono font-bold ${
                          isUnder ? 'text-rose-700' : isStrong ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        {score > 0 ? `${score}%` : 'Pending'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isUnder ? 'bg-rose-500' : isStrong ? 'bg-emerald-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, score)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Identified Weaknesses & Statutory Root-Cause Analysis */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Specific Assessment Weaknesses &amp; Knowledge Gaps</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed error breakdown highlighting operational and legal misconceptions.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-600">
                {profile.weaknesses.length} Area{profile.weaknesses.length === 1 ? '' : 's'} Flagged
              </span>
            </div>

            <div className="space-y-3.5">
              {profile.weaknesses.map((weakness, index) => (
                <div
                  key={weakness.id || index}
                  className={`rounded-xl border p-4 text-xs space-y-2.5 transition-all ${
                    weakness.status === 'critical'
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          weakness.status === 'critical'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500 text-[#071433]'
                        }`}
                      >
                        {weakness.status === 'critical' ? 'Critical Weakness' : 'Moderate Gap'}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{weakness.topicTitle}</h4>
                    </div>
                    <span className="font-mono text-slate-600 text-[11px] font-semibold">
                      Category: {weakness.category} ({weakness.score}% Score)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Concept Tested
                      </span>
                      <p className="text-slate-700 leading-relaxed">{weakness.conceptTested}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-rose-200/70 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                        Error / Misconception Identified
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium">{weakness.errorIdentified}</p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Statutory Citation:</span>
                      <strong className="text-slate-800">{weakness.statutoryReference}</strong>
                    </div>
                    <div className="flex items-start gap-2 pt-1 border-t border-slate-100 text-slate-800">
                      <strong className="text-blue-900 text-xs shrink-0">HR &amp; MLRO Action:</strong>
                      <span className="text-xs text-slate-700 leading-relaxed">
                        {weakness.recommendedAction}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Certificates & Transcripts */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Accredited Completion Certificates &amp; Transcripts</span>
            </h3>

            {profile.completedCertificates.length > 0 ? (
              <div className="space-y-2">
                {profile.completedCertificates.map((cert) => (
                  <div
                    key={cert.certificateId}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{cert.courseTitle}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Issued: {cert.issueDate}</span>
                        <span>·</span>
                        <span className="font-semibold text-emerald-700">Grade: {cert.gradeScore}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-600">ID: {cert.certificateId}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onViewCertificate && onViewCertificate(cert.certificateId)}
                      className="px-3 py-1.5 rounded-lg bg-[#071433] hover:bg-[#0c245c] text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Download Certificate &amp; Transcript</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                No formal certificates claimed yet. Staff member is currently working through active course modules.
              </p>
            )}
          </div>

          {/* HR & MLRO Remediation Sign-off */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-700" />
              <span>HR &amp; Compliance Remediation Record</span>
            </h3>
            <p className="text-xs text-slate-500">
              Document internal compliance coaching and remedial training sessions for regulatory inspection readiness.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Remediation Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRemediationStatus('in_progress')}
                    className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                      remediationStatus === 'in_progress'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    In Progress / Coaching Scheduled
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemediationStatus('completed')}
                    className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                      remediationStatus === 'completed'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Remediation Completed &amp; Re-tested
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemediationStatus('action_required')}
                    className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                      remediationStatus === 'action_required'
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Immediate MLRO Escalation Required
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Compliance Officer &amp; HR Notes (Confidential Internal File)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record dates of refresher sessions, case studies reviewed, and MLRO sign-offs..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#071433] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Notes are securely stored in the corporate reporting file.
                </span>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-4 py-2 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Remediation Notes Saved!' : 'Save HR Remediation Note'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-700" />
            <span>Authorized Corporate Compliance &amp; HR Diagnostic Dossier</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
