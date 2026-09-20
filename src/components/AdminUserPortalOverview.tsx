import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Building2,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  GraduationCap,
  Layers,
  BarChart3,
  Search,
  Eye,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const AdminUserPortalOverview: React.FC = () => {
  const {
    courses,
    orders,
    transactions,
    activationTokens,
    formatPrice,
    setIsE2ETestModalOpen,
    setIsCertificateVerifierOpen,
  } = useAcademy();

  const [activeInspectorTab, setActiveInspectorTab] = useState<'curriculum' | 'assessments' | 'corporate' | 'certificates'>('curriculum');
  const [courseSearch, setCourseSearch] = useState('');

  // Calculate metrics
  const totalEnrolledSeats = orders.reduce((sum, o) => sum + (o.seatCount || 1), 0);
  const corporateOrdersCount = orders.filter((o) => o.seatCount > 1 || o.isCorporate).length;
  const activatedSeats = orders
    .filter((o) => o.status === 'activated')
    .reduce((sum, o) => sum + (o.seatCount || 1), 0);
  const totalCpdHours = courses.reduce((sum, c) => sum + (c.cpdHours || 0), 0);
  const totalModules = courses.reduce((sum, c) => sum + (c.modules?.length || 0), 0);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 font-['IBM_Plex_Sans'] animate-in fade-in duration-200">
      {/* Overview Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#071433] via-[#0c245c] to-[#071433] text-white border border-[#19366e] shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#071433] text-[10px] font-black uppercase tracking-wider">
                User Portal Telemetry &amp; Overview
              </span>
              <span className="text-xs text-slate-300">
                academy.complisey.com Live Status
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Learner &amp; Corporate Portal Live Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time oversight of public course engagement, syllabus distribution, passing standards, and corporate licensing without leaving the secured administrator terminal.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 relative z-10">
            <button
              onClick={() => setIsE2ETestModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Launch E2E Simulator</span>
            </button>

            <button
              onClick={() => setIsCertificateVerifierOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Verify Serial QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Executive Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0a162d] border border-slate-200 dark:border-[#193264] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Accredited Courses</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {courses.length} Modules
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {totalModules} Units · {totalCpdHours} CPD Hours
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0a162d] border border-slate-200 dark:border-[#193264] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Candidate Seats</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalEnrolledSeats} Registered
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-bold">
            {activatedSeats} Activated &amp; Auditable
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0a162d] border border-slate-200 dark:border-[#193264] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Corporate Clients</span>
            <Building2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {corporateOrdersCount} Entities
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Fiduciaries &amp; Banks
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0a162d] border border-slate-200 dark:border-[#193264] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Section 34 Pass Mark</span>
            <Award className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            80% Passing
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Professional CPD Standard
          </div>
        </div>
      </div>

      {/* User Portal Inspector Tabs */}
      <div className="rounded-2xl bg-white dark:bg-[#071433] border border-slate-200 dark:border-[#17326c] shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="p-4 border-b border-slate-200 dark:border-[#17326c] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveInspectorTab('curriculum')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeInspectorTab === 'curriculum'
                  ? 'bg-[#071433] text-amber-300 dark:bg-amber-400 dark:text-[#071433]'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Course Catalog ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('assessments')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeInspectorTab === 'assessments'
                  ? 'bg-[#071433] text-amber-300 dark:bg-amber-400 dark:text-[#071433]'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Assessment &amp; Quiz Engine</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('corporate')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeInspectorTab === 'corporate'
                  ? 'bg-[#071433] text-amber-300 dark:bg-amber-400 dark:text-[#071433]'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Corporate HR Licensing</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('certificates')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeInspectorTab === 'certificates'
                  ? 'bg-[#071433] text-amber-300 dark:bg-amber-400 dark:text-[#071433]'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Digital Certificates</span>
            </button>
          </div>

          {activeInspectorTab === 'curriculum' && (
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog course..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#0b1e4a] border border-slate-300 dark:border-[#1b3d78] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Curriculum Catalog Inspector */}
        {activeInspectorTab === 'curriculum' && (
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b1d3d] border border-slate-200 dark:border-[#19366f] space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold">
                        {c.code}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {c.cpdHours} CPD Hours
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {c.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-[#19366f]/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Units: <strong>{c.modules?.length || 0} Lessons</strong></span>
                      <span className="font-bold text-slate-900 dark:text-white font-['Space_Grotesk']">
                        {formatPrice(c.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Comprehensive CPD Accredited Syllabus</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Assessment & Quiz Engine Inspector */}
        {activeInspectorTab === 'assessments' && (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1f44] border border-slate-200 dark:border-[#1b3e7d] space-y-1.5">
                <span className="text-xs text-slate-500 font-bold uppercase">Pass Requirement</span>
                <div className="text-xl font-black text-slate-900 dark:text-white">80.0% Minimum</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Mandatory threshold for statutory compliance under Section 34 AML/CFT Act 2020.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1f44] border border-slate-200 dark:border-[#1b3e7d] space-y-1.5">
                <span className="text-xs text-slate-500 font-bold uppercase">Anti-Cheat Lockdown</span>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">Strict Enforcement</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Context menu, devtools, and tab switching monitored with automated warnings.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1f44] border border-slate-200 dark:border-[#1b3e7d] space-y-1.5">
                <span className="text-xs text-slate-500 font-bold uppercase">Competency Profiling</span>
                <div className="text-xl font-black text-blue-600 dark:text-blue-400">Section Diagnostics</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Weakness diagnostics automatically highlighted for corporate MLRO reports.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Statutory Auditor Notice for Compliance Officers</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Upon achieving ≥ 80% on all unit assessments and the final statutory exam, certificates are cryptographically locked and issued with a unique tamper-proof serial number verifiable worldwide.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Corporate HR Licensing */}
        {activeInspectorTab === 'corporate' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Corporate Tier Pricing &amp; Multi-Seat Licensing Structure
              </h4>
              <span className="text-xs text-slate-500">
                Tiered volume discounts applied automatically
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c1e3d] border border-slate-200 dark:border-[#17356c] space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Tier 1: 1–5 Seats</div>
                <div className="text-sm font-black text-slate-700 dark:text-amber-400">SCR 1,950 / seat</div>
                <div className="text-[11px] text-slate-500">Standard rate for smaller compliance teams.</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c1e3d] border border-slate-200 dark:border-[#17356c] space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Tier 2: 6–15 Seats</div>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">10% Volume Rebate</div>
                <div className="text-[11px] text-slate-500">Mid-sized fiduciary &amp; audit firms.</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c1e3d] border border-slate-200 dark:border-[#17356c] space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Tier 3: 16–30 Seats</div>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">15% Volume Rebate</div>
                <div className="text-[11px] text-slate-500">Commercial banks &amp; fund managers.</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c1e3d] border border-slate-200 dark:border-[#17356c] space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Tier 4: 31+ Seats</div>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">20% Volume Rebate</div>
                <div className="text-[11px] text-slate-500">Institutional enterprise licensing.</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Digital Certificates */}
        {activeInspectorTab === 'certificates' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tamper-Proof Certificate Security &amp; Verification Protocol
                </h4>
                <p className="text-xs text-slate-500">
                  Complisanc Consulting Services (SEY) official compliance credentials
                </p>
              </div>

              <button
                onClick={() => setIsCertificateVerifierOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold cursor-pointer"
              >
                Launch Verifier Tool
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1f44] border border-slate-200 dark:border-[#193972] space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Academy Faculty Signatories</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Every issued certificate carries authenticated digital signatures from Malcolm Simon (Managing Director) and Eric D'Souza (Director of Training Inquiries).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1f44] border border-slate-200 dark:border-[#193972] space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>1-Year Validity Cycle</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Accredited credentials remain valid for 12 months, triggering automated renewal alerts for Section 34 annual refresher training.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
