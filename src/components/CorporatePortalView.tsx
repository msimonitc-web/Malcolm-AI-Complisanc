import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Download,
  Copy,
  Plus,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  Award,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Printer,
  ChevronRight,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { INITIAL_CORPORATE_MEMBERS } from '../data/authDemo';
import { CorporateTeamMember, StaffAssessmentProfile, Certificate } from '../types';
import { useCsrf, CsrfInput } from '../context/CsrfContext';
import {
  INITIAL_STAFF_ASSESSMENT_PROFILES,
  createDefaultStaffAssessmentProfile,
} from '../data/assessmentWeaknessData';
import { StaffWeaknessModal } from './StaffWeaknessModal';
import { MultiSeatTokenModal } from './MultiSeatTokenModal';
import { EnrollmentOrder } from '../types';

export const CorporatePortalView: React.FC = () => {
  const {
    courses,
    setSelectedCourseForCheckout,
    formatPrice,
    orders,
    student,
    currentUser,
    integrityViolations,
    setSelectedCertificateForView,
    certificates,
  } = useAcademy();

  const { csrfToken, submitProtectedForm } = useCsrf();

  // Internal tab state
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'certificates' | 'weaknesses' | 'billing' | 'integrity'>('weaknesses');

  const [copiedCode, setCopiedCode] = useState(false);
  const [members, setMembers] = useState<CorporateTeamMember[]>(INITIAL_CORPORATE_MEMBERS);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Compliance Analyst');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [selectedOrderForSeatTokens, setSelectedOrderForSeatTokens] = useState<EnrollmentOrder | null>(null);

  // Assessment weakness profiles state
  const [staffProfiles, setStaffProfiles] = useState<Record<string, StaffAssessmentProfile>>(
    INITIAL_STAFF_ASSESSMENT_PROFILES
  );
  const [selectedProfileForModal, setSelectedProfileForModal] = useState<StaffAssessmentProfile | null>(null);
  const [weaknessFilter, setWeaknessFilter] = useState<'all' | 'critical' | 'moderate'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const companyName = currentUser?.companyName || student.companyName || 'Victoria Fiduciary Services Ltd';

  const corporateCode =
    student.companyName === 'Demo Corp Ltd' && student.joinCodeRedeemed
      ? student.joinCodeRedeemed
      : currentUser?.joinCode || 'DEMO2026';

  const totalSeatsAllocated = 5;
  const activeLearnersCount = members.length;
  const seatsRemaining = Math.max(0, totalSeatsAllocated - activeLearnersCount);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(corporateCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    const newId = `mem-${Date.now()}`;
    const newMember: CorporateTeamMember = {
      id: newId,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      joinedDate: new Date().toISOString().split('T')[0],
      completedCourses: 0,
      totalCourses: courses.length,
      overallScore: 0,
      lastActive: 'Just registered',
      certificatesCount: 0,
    };

    const newProfile = createDefaultStaffAssessmentProfile(newId, newMemberName, newMemberEmail, newMemberRole);

    setMembers((prev) => [newMember, ...prev]);
    setStaffProfiles((prev) => ({
      ...prev,
      [newId]: newProfile,
    }));

    setNewMemberName('');
    setNewMemberEmail('');
    setShowAddMemberModal(false);

    try {
      await submitProtectedForm('/api/forms/corporate-member', {
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        corporateCode,
        _csrf: csrfToken,
      });
    } catch (err) {
      console.warn('Member added locally; CSRF telemetry logged:', err);
    }
  };

  const handleUpdateHrNotes = (
    memberId: string,
    notes: string,
    status: 'completed' | 'in_progress' | 'action_required'
  ) => {
    setStaffProfiles((prev) => {
      const existing = prev[memberId];
      if (!existing) return prev;
      const updated = { ...existing, hrNotes: notes, hrRemediationStatus: status };
      if (selectedProfileForModal?.memberId === memberId) {
        setSelectedProfileForModal(updated);
      }
      return { ...prev, [memberId]: updated };
    });
  };

  const handleExportAuditCSV = () => {
    const headers = [
      'Learner Name',
      'Email',
      'Role',
      'Company',
      'Enrolled Join Code',
      'Completed Courses',
      'Total Courses',
      'Avg Quiz Score',
      'Certificates Held',
      'Remediation Status',
    ];
    const rows = members.map((m) => {
      const prof = staffProfiles[m.id];
      return [
        `"${m.name}"`,
        `"${m.email}"`,
        `"${m.role}"`,
        `"${companyName}"`,
        `"${corporateCode}"`,
        m.completedCourses,
        courses.length,
        `${m.overallScore}%`,
        m.certificatesCount,
        `"${prof?.hrRemediationStatus || 'N/A'}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Complisey_Training_Audit_Roster_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Staff compliance training audit log exported successfully for regulatory record keeping.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Compile all issued certificates across all staff members
  const allStaffCertificates = useMemo(() => {
    const list: {
      staffMember: CorporateTeamMember;
      certificate: {
        certificateId: string;
        courseId: string;
        courseTitle: string;
        issueDate: string;
        gradeScore: string;
        verificationCode: string;
        cpdHours: number;
      };
    }[] = [];

    members.forEach((m) => {
      const prof = staffProfiles[m.id];
      if (prof && prof.completedCertificates) {
        prof.completedCertificates.forEach((c) => {
          list.push({ staffMember: m, certificate: c });
        });
      }
    });

    return list;
  }, [members, staffProfiles]);

  const handleOpenCertificate = (staffMember: CorporateTeamMember, certData: {
    certificateId: string;
    courseId: string;
    courseTitle: string;
    issueDate: string;
    gradeScore: string;
    verificationCode: string;
    cpdHours: number;
  }) => {
    const fullCert: Certificate = {
      id: certData.certificateId,
      courseId: certData.courseId,
      courseTitle: certData.courseTitle,
      studentName: staffMember.name,
      studentTitle: staffMember.role,
      companyName,
      issueDate: certData.issueDate,
      instructorName: 'CompliSey Regulatory Faculty',
      gradeScore: certData.gradeScore,
      verificationCode: certData.verificationCode,
      cpdHours: certData.cpdHours,
    };
    setSelectedCertificateForView(fullCert);
  };

  // Filter corporate orders strictly for the authenticated corporate entity or central administrator
  const corporateOrders = orders.filter((o) => {
    if (currentUser?.role === 'admin') return true;
    const userEmail = currentUser?.email?.trim().toLowerCase();
    const userCompany = currentUser?.companyName?.trim().toLowerCase();
    const isEmail = Boolean(userEmail && o.contactEmail?.trim().toLowerCase() === userEmail);
    const isCompany = Boolean(
      userCompany &&
      userCompany !== 'individual learner' &&
      o.companyName?.trim().toLowerCase() === userCompany
    );
    return isEmail || isCompany;
  });

  // Total weaknesses count
  const allWeaknesses = (Object.values(staffProfiles) as StaffAssessmentProfile[]).flatMap((p) => p.weaknesses);
  const criticalWeaknessCount = allWeaknesses.filter((w) => w.status === 'critical').length;
  const moderateWeaknessCount = allWeaknesses.filter((w) => w.status === 'moderate').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Corporate Admin & HR Management Hub */}
      <div className="bg-[#071433] rounded-2xl text-white p-5 sm:p-7 border border-[#13285c] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-900/80 text-amber-300 text-xs font-bold uppercase tracking-wider border border-blue-700/50 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                Corporate Admin &amp; HR Compliance Oversight
              </span>
              <span className="text-xs text-slate-300">Reporting Entity Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['IBM_Plex_Sans']">
              {companyName} — Compliance Training &amp; Assessment Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Administrative portal for downloading verified completion certificates with course syllabus transcripts, and reviewing staff assessment results to highlight knowledge gaps and guide HR remediation before regulatory inspections.
            </p>
          </div>

          {/* Corporate Join Code Display */}
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/20 shrink-0 space-y-2 min-w-[230px]">
            <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                Staff Join Code
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-bold">
                Active Seats
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-[#071433]/80 px-3 py-2 rounded-lg border border-amber-400/40">
              <span className="font-mono text-base font-black text-amber-300 tracking-wider">
                {corporateCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Copy Join Code"
              >
                {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-300 leading-tight">
              Share with staff to unlock accredited courses and track team compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Corporate Portal Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('weaknesses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'weaknesses'
              ? 'bg-[#071433] text-amber-300 shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Assessments &amp; Weakness Diagnostics</span>
          {criticalWeaknessCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
              {criticalWeaknessCount} Gaps
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('certificates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'certificates'
              ? 'bg-[#071433] text-amber-300 shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Certificates &amp; Transcripts</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-800 border border-amber-300/40">
            {allStaffCertificates.length} Issued
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('roster')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'roster'
              ? 'bg-[#071433] text-amber-300 shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 text-blue-500" />
          <span>Staff Roster &amp; Seats ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('billing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'billing'
              ? 'bg-[#071433] text-amber-300 shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 text-slate-500" />
          <span>Invoices &amp; Bank Wires</span>
        </button>

        <button
          onClick={() => setActiveSubTab('integrity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'integrity'
              ? 'bg-[#071433] text-amber-300 shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Proctoring Logs ({integrityViolations.length})</span>
        </button>
      </div>

      {/* Audit Export Success Notification */}
      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: ASSESSMENTS & WEAKNESS DIAGNOSTICS                     */}
      {/* ============================================================== */}
      {activeSubTab === 'weaknesses' && (
        <div className="space-y-6">
          {/* Executive Weakness Briefing Banner */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <span>Executive Compliance Gap Analysis for HR &amp; MLRO</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                    {criticalWeaknessCount} Critical Areas Flagged
                  </span>
                </h3>
                <p className="text-xs text-amber-900 leading-relaxed max-w-3xl">
                  Assessments highlight areas where staff struggled during unit quizzes and final certification exams. Use these diagnostic findings to schedule targeted coaching sessions on AML/CFT statutory and compliance standards (e.g. 24-hr TFS freezing deadlines and Section 48 anti-tipping-off rules) for professional development.
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold transition-colors shadow-2xs shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Weakness Audit Report</span>
            </button>
          </div>

          {/* Firm-Wide Regulatory Domain Proficiency Heatmap */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Team Competency Across Core Seychelles AML/CFT Domains</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aggregate score calculated across all completed assessments and unit quizzes for {companyName} staff.
                </p>
              </div>
              <span className="text-[11px] text-slate-500">Benchmark: 80% passing standard</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Placement, Layering &amp; Integration</span>
                  <span className="font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                    78% ⚠️ Review
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }} />
                </div>
                <p className="text-[10px] text-rose-800 leading-tight font-medium">
                  Staff struggled distinguishing Layering vs Placement in multi-jurisdiction IBC and loan-back scenarios.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Red Flag Detection &amp; Indicators</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    82% Passed
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '82%' }} />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Proficient in smurfing and cash indicators. Review recommended on trade-based and pass-through flags.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Customer Due Diligence (CDD) &amp; UBO</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    88% Passed
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '88%' }} />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  High proficiency on natural person CDD. Minor gap noted on complex trust protector identification.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Targeted Financial Sanctions (TFS)</span>
                  <span className="font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                    81% ⚠️ Review
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '81%' }} />
                </div>
                <p className="text-[10px] text-rose-800 leading-tight font-medium">
                  2 staff confused the 24-hr immediate asset-freezing mandate with regular 5-day reporting.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">STR Filing &amp; Escalation</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    89% Passed
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '89%' }} />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Strong grasp of suspicious transaction thresholds and internal MLRO escalation pathways.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Section 48 Anti-Tipping-Off</span>
                  <span className="font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                    80% ⚠️ Review
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }} />
                </div>
                <p className="text-[10px] text-rose-800 leading-tight font-medium">
                  Critical legal risk: confusion regarding internal disclosure boundaries prior to statutory reports.
                </p>
              </div>
            </div>
          </div>

          {/* Individual Staff Weakness Diagnostic Profiles */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-700" />
                  <span>Staff Member Assessment Weakness Profiles</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select any staff member to view their complete assessment weakness dossier and coaching recommendations.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Filter:</span>
                <button
                  onClick={() => setWeaknessFilter('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    weaknessFilter === 'all'
                      ? 'bg-[#071433] text-amber-300'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  All Staff ({members.length})
                </button>
                <button
                  onClick={() => setWeaknessFilter('critical')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    weaknessFilter === 'critical'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white border border-slate-200 text-rose-700'
                  }`}
                >
                  Critical Gaps Flagged ({criticalWeaknessCount})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {members.map((member) => {
                const profile = staffProfiles[member.id];
                if (!profile) return null;

                const hasCritical = profile.weaknesses.some((w) => w.status === 'critical');
                if (weaknessFilter === 'critical' && !hasCritical) return null;

                return (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-sm">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-base">{member.name}</h4>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {member.role}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-mono">{member.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            Overall Exam Score
                          </span>
                          <span className="text-xl font-black font-mono text-[#071433]">
                            {member.overallScore > 0 ? `${member.overallScore}%` : 'In Progress'}
                          </span>
                        </div>

                        <div className="h-8 w-[1px] bg-slate-200" />

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            Remediation Status
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              profile.hrRemediationStatus === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : profile.hrRemediationStatus === 'action_required'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {profile.hrRemediationStatus === 'completed'
                              ? 'Coaching Completed'
                              : profile.hrRemediationStatus === 'action_required'
                              ? 'Action Required'
                              : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Identified Weaknesses Badges & Concepts */}
                    <div className="space-y-2 text-xs">
                      <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Specific Weaknesses &amp; Errors Identified in Assessments:
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {profile.weaknesses.map((w) => (
                          <div
                            key={w.id}
                            className={`p-3 rounded-xl border space-y-1.5 ${
                              w.status === 'critical'
                                ? 'bg-rose-50/50 border-rose-200'
                                : 'bg-amber-50/50 border-amber-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{w.topicTitle}</span>
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  w.status === 'critical'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-amber-500 text-[#071433]'
                                }`}
                              >
                                {w.status === 'critical' ? 'Critical' : 'Moderate'} ({w.score}%)
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-700 leading-snug">
                              <strong>Error:</strong> {w.errorIdentified}
                            </p>

                            <div className="pt-1 border-t border-slate-200/60 text-[10px] text-slate-500 flex items-center justify-between">
                              <span>Ref: {w.statutoryReference}</span>
                              <span className="font-semibold text-blue-900">Coaching recommended</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="text-slate-500 text-[11px] italic">
                        {profile.hrNotes ? `HR Note: "${profile.hrNotes}"` : 'No HR notes recorded yet.'}
                      </div>

                      <div className="flex items-center gap-2">
                        {profile.completedCertificates.length > 0 && (
                          <button
                            onClick={() =>
                              handleOpenCertificate(member, profile.completedCertificates[0])
                            }
                            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            <span>Download Certificate &amp; Transcript</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedProfileForModal(profile)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Full Diagnostic Dossier</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CERTIFICATES & TRANSCRIPTS (CORE USER REQUIREMENT)     */}
      {/* ============================================================== */}
      {activeSubTab === 'certificates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Verified Staff Completion Certificates &amp; Curriculum Transcripts</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                As appointed Corporate Administrator for {companyName}, you are authorized to download certified completion certificates and attached course syllabus transcripts for your reporting entity's staff training compliance and audit records.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print All Records</span>
              </button>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/75 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                {allStaffCertificates.length} Official Credentials Available for Download
              </span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All Verifiable CPD Professional Credentials
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Staff Member</th>
                    <th className="p-3.5">Firm Role</th>
                    <th className="p-3.5">Accredited Course Title</th>
                    <th className="p-3.5 text-center">Exam Grade</th>
                    <th className="p-3.5 text-center">CPD Hours</th>
                    <th className="p-3.5">Date Issued</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allStaffCertificates.map(({ staffMember, certificate }, idx) => (
                    <tr key={`${staffMember.id}-${certificate.certificateId}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{staffMember.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{staffMember.email}</div>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">{staffMember.role}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{certificate.courseTitle}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {certificate.certificateId}</div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {certificate.gradeScore}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-700">
                        {certificate.cpdHours} hrs
                      </td>
                      <td className="p-3.5 text-slate-600 font-mono">{certificate.issueDate}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenCertificate(staffMember, certificate)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download Certificate &amp; Transcript</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: STAFF ROSTER & SEATS                                   */}
      {/* ============================================================== */}
      {activeSubTab === 'roster' && (
        <div className="space-y-6">
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                  Prepaid Seats
                </span>
                <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">{totalSeatsAllocated} Seats</div>
                <span className="text-[11px] text-emerald-700 font-medium">{seatsRemaining} seat remaining</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                  Active Staff Enrolled
                </span>
                <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">{activeLearnersCount} Learners</div>
                <span className="text-[11px] text-slate-500">12-Month full catalogue access</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                  Certificates Earned
                </span>
                <div className="text-2xl font-black text-emerald-700 mt-0.5 font-mono">
                  {allStaffCertificates.length} Issued
                </div>
                <span className="text-[11px] text-slate-500">80% passing exam threshold</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                  Compliance Passing Rate
                </span>
                <div className="text-2xl font-black text-[#071433] mt-0.5 font-mono">88.0%</div>
                <span className="text-[11px] text-blue-700 font-medium">AML/CFT Training Standard</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Staff Roster Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-700" />
                  <span>Regulated Staff Training Roster</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Learners enrolled under {companyName} join code <strong className="font-mono text-slate-800">{corporateCode}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportAuditCSV}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export Training Audit CSV</span>
                </button>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#071433] text-amber-300 text-xs font-bold hover:bg-[#0c245c] shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Invite Staff Member</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-100/75 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Learner &amp; Email</th>
                    <th className="p-3.5">Firm Role</th>
                    <th className="p-3.5 text-center">Catalogue Progress</th>
                    <th className="p-3.5 text-center">Avg Exam Score</th>
                    <th className="p-3.5 text-center">Certificates</th>
                    <th className="p-3.5">Last Active</th>
                    <th className="p-3.5 text-right">Diagnostic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {members.map((member) => {
                    const prof = staffProfiles[member.id];
                    return (
                      <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-semibold text-slate-900">
                          <div className="font-bold text-slate-900">{member.name}</div>
                          <div className="text-[11px] font-normal text-slate-500 font-mono">{member.email}</div>
                        </td>
                        <td className="p-3.5 text-slate-700 font-medium">{member.role}</td>
                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">
                              {member.completedCourses} / {courses.length}
                            </span>
                            <span className="text-[10px] text-slate-400">courses passed</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-200 rounded-full mx-auto mt-1 overflow-hidden">
                            <div
                              className="h-full bg-blue-700 rounded-full"
                              style={{ width: `${(member.completedCourses / courses.length) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {member.overallScore > 0 ? `${member.overallScore}%` : 'In Progress'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                            {member.certificatesCount} Verified
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 font-medium">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{member.lastActive}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => prof && setSelectedProfileForModal(prof)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Weakness Profile →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: INVOICES & BANK WIRES                                   */}
      {/* ============================================================== */}
      {activeSubTab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-gradient-to-br from-blue-900 to-[#071433] rounded-2xl p-5 sm:p-6 text-white border border-blue-800/60 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-[#071433] text-[10px] font-black uppercase tracking-wider">
                  Volume Seat Discount
                </span>
                <span className="text-xs text-amber-300 font-semibold">Tiered SCR Pricing</span>
              </div>
              <h3 className="text-lg font-bold font-['IBM_Plex_Sans']">Order Additional 12-Month Staff Seats</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Each additional seat grants 12 months access to the complete 6-course Seychelles AML/CFT curriculum with verified digital completion certificates and transcripts for each passing staff member.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-white/10 border border-white/10">
                  <div className="text-[10px] text-slate-300">1–5 Seats</div>
                  <div className="font-mono font-bold text-amber-300">SCR 900</div>
                </div>
                <div className="p-2 rounded-lg bg-white/10 border border-white/10">
                  <div className="text-[10px] text-slate-300">6–10 Seats</div>
                  <div className="font-mono font-bold text-amber-300">SCR 800</div>
                </div>
                <div className="p-2 rounded-lg bg-white/10 border border-white/10">
                  <div className="text-[10px] text-slate-300">11–20 Seats</div>
                  <div className="font-mono font-bold text-amber-300">SCR 750</div>
                </div>
                <div className="p-2 rounded-lg bg-white/10 border border-white/10">
                  <div className="text-[10px] text-slate-300">21+ Seats</div>
                  <div className="font-mono font-bold text-emerald-400">SCR 600</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (courses[0]) {
                  setSelectedCourseForCheckout(courses[0]);
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Corporate Proforma Invoice (SCR Bank Transfer)</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>{companyName} Invoices &amp; Wires</span>
                </h3>
                <span className="text-[11px] text-slate-500">{corporateOrders.length} records</span>
              </div>

              <div className="space-y-2.5">
                {corporateOrders.length > 0 ? (
                  corporateOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{ord.proformaNumber}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === 'activated'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status === 'activated' ? 'Paid & Active' : 'Awaiting Wire'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {ord.seatCount} staff seat(s) · Booking ID:{' '}
                          <span className="font-mono font-bold text-blue-800">
                            {ord.ccsBookingId || ord.bankReferenceCode}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <div className="font-mono font-bold text-slate-900">{formatPrice(ord.totalAmount)}</div>
                          <div className="text-[10px] text-slate-400">MCB SCR</div>
                        </div>
                        {ord.status === 'activated' && ord.seatCount > 1 && (
                          <button
                            onClick={() => setSelectedOrderForSeatTokens(ord)}
                            className="px-3 py-1.5 rounded-lg bg-[#071433] hover:bg-blue-900 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-amber-400" />
                            <span>Manage {ord.seatCount} Seat Tokens</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                    Initial prepaid batch active under join code {corporateCode}.
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                All corporate seat orders are billed in Seychelles rupees (SCR) by bank wire to Complisey's MCB Seychelles account. Once confirmed, seats are provisioned instantly with professional records.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: ACADEMIC INTEGRITY & PROCTORING LOGS                   */}
      {/* ============================================================== */}
      {activeSubTab === 'integrity' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span>Mandatory Proctoring &amp; Academic Integrity Log</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Active Exam Proctoring Violations &amp; Tab-Exit Flags
              </h3>
              <p className="text-xs text-slate-500">
                Real-time proctoring and telemetry trail during formal CPD certification examinations.
              </p>
            </div>
            <div className="px-3 py-1 bg-red-50 border border-red-200 text-red-900 rounded-lg text-xs font-bold shrink-0 self-start sm:self-center">
              {integrityViolations.length} Flagged Events
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex gap-2.5">
              <span className="text-xl">⚖️</span>
              <div className="leading-relaxed">
                <strong>Statutory Requirements Note:</strong> To ensure the legitimacy of Seychelles statutory certifications, learners are restricted from switching tabs, exiting browser fullscreen, or losing active focus during 80% passing-grade final examinations. Any violation triggers immediate telemetry logged below and alerts the corporate compliance supervisor and Complisey Academy administration.
              </div>
            </div>

            <div className="overflow-x-auto">
              {integrityViolations.length > 0 ? (
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Staff Member</th>
                      <th className="p-3">Course / Lesson</th>
                      <th className="p-3">Violation Type</th>
                      <th className="p-3">Detail / Proctor Action</th>
                      <th className="p-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {integrityViolations.map((viol) => (
                      <tr key={viol.id} className="hover:bg-red-50/20 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{viol.studentName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{viol.studentEmail}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">
                            {viol.courseTitle || 'Seychelles AML/CFT Fundamentals'}
                          </div>
                          <div className="text-[10px] text-slate-400">Lesson ID: {viol.lessonId || 'Exam'}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              viol.violationType === 'tab_switch'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : viol.violationType === 'window_blur'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                            }`}
                          >
                            {viol.violationType === 'tab_switch' ? 'Browser Tab Switch' : 'Focus Lost / Dual Screen'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 max-w-sm leading-relaxed">
                          <p>{viol.violationDetail || viol.detail}</p>
                          <div className="text-[10px] text-red-600 font-semibold mt-0.5">
                            ⚠️ Logged &amp; dispatched to compliance admins
                          </div>
                        </td>
                        <td className="p-3 text-right text-slate-500 font-mono">
                          {new Date(viol.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  <span className="text-2xl">🛡️</span>
                  <p className="text-xs font-semibold mt-2 text-slate-700">No Academic Integrity Violations Logged</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    All compliance staff have stayed inside the secure exam environment during their assessments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-700" />
                <span>Invite Compliance Staff Member</span>
              </h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <CsrfInput formName="corporate-member" />
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Staff Member Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vanessa Joubert"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#071433] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="v.joubert@demo.local"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#071433] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Compliance Department Role
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#071433] focus:bg-white"
                >
                  <option value="Compliance Officer">Compliance Officer</option>
                  <option value="CDD &amp; Onboarding Analyst">CDD &amp; Onboarding Analyst</option>
                  <option value="Corporate Services Administrator">Corporate Services Administrator</option>
                  <option value="Fiduciary / Trustee Officer">Fiduciary / Trustee Officer</option>
                  <option value="Legal &amp; Regulatory Counsel">Legal &amp; Regulatory Counsel</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1">
                <div className="font-bold">Staff Seat Provisioning:</div>
                <p>
                  This will register the staff member under {companyName}. They will be sent instructions to log in and use join code{' '}
                  <strong className="font-mono text-blue-950">{corporateCode}</strong>.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#071433] text-amber-300 hover:bg-[#0c245c] font-bold shadow-md transition-colors cursor-pointer"
                >
                  Confirm &amp; Allocate Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Staff Weakness Diagnostic Modal */}
      <StaffWeaknessModal
        profile={selectedProfileForModal}
        companyName={companyName}
        onClose={() => setSelectedProfileForModal(null)}
        onViewCertificate={(certId) => {
          const match = allStaffCertificates.find((c) => c.certificate.certificateId === certId);
          if (match) {
            handleOpenCertificate(match.staffMember, match.certificate);
          }
        }}
        onUpdateHrNotes={handleUpdateHrNotes}
      />

      {/* Corporate Multi-Seat Token Management & Roster Modal */}
      <MultiSeatTokenModal
        order={selectedOrderForSeatTokens}
        isOpen={Boolean(selectedOrderForSeatTokens)}
        onClose={() => setSelectedOrderForSeatTokens(null)}
      />
    </div>
  );
};
