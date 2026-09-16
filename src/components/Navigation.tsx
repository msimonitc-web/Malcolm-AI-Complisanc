import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Award,
  CreditCard,
  Search,
  KeyRound,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { ActiveTab, CurrencyType } from '../types';
import { CompliseyLogo } from './CompliseyLogo';

export const Navigation: React.FC = () => {
  const {
    student,
    activeTab,
    setActiveTab,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
    transactions,
    certificates,
    enrolledProgress,
    courses,
    orders,
    processPaymentEnrollment,
    openCoursePlayer,
  } = useAcademy();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showJoinCodeModal, setShowJoinCodeModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinCodeError, setJoinCodeError] = useState('');
  const [joinCodeSuccess, setJoinCodeSuccess] = useState('');

  const enrolledCount = Object.keys(enrolledProgress).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_payment').length;

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badgeCount?: number;
    badgeStyle?: string;
  }[] = [
    { id: 'dashboard', label: 'My Compliance', icon: LayoutDashboard },
    { id: 'explore', label: 'AML/CFT Courses', icon: Compass },
    { id: 'certificates', label: 'Audit Certificates', icon: Award, badgeCount: certificates.length },
    { id: 'billing', label: 'Seats & Invoices', icon: CreditCard },
    {
      id: 'admin',
      label: 'Admin Desk',
      icon: ShieldCheck,
      badgeCount: pendingOrdersCount,
      badgeStyle: 'bg-amber-400 text-[#071433]',
    },
  ];

  const handleRedeemJoinCode = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinCodeError('');
    setJoinCodeSuccess('');

    const code = joinCodeInput.trim().toUpperCase();

    if (code === 'DEMO2026') {
      setJoinCodeError(
        'DEMO2026 is an informational preview code. To unlock instant seat enrollment, use live corporate code: COMPLISEY-SEAT-2026'
      );
      return;
    }

    if (code === 'COMPLISEY-SEAT-2026' || code === 'FSA-STAFF-2026' || code === 'VICTORIA2026') {
      // Enroll in the second AML course instantly
      const targetCourse = courses[1] || courses[0];
      processPaymentEnrollment(
        targetCourse.id,
        'stripe',
        { brand: 'Prepaid Corporate Seat', last4: 'SEAT' },
        code,
        targetCourse.price
      );
      setJoinCodeSuccess(`Seat code activated! Enrolled in "${targetCourse.title}".`);
      setTimeout(() => {
        setShowJoinCodeModal(false);
        setJoinCodeInput('');
        openCoursePlayer(targetCourse.id);
      }, 1200);
      return;
    }

    setJoinCodeError('Invalid seat join code. Try corporate voucher: COMPLISEY-SEAT-2026');
  };

  return (
    <>
      {/* Statutory / Local Review Banner */}
      <div className="bg-[#0b2149] text-amber-300 text-xs px-4 py-1.5 text-center font-medium border-b border-[#14326d] flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
        <span>
          Local review build. Certificates are marked DRAFT. <strong>DEMO2026</strong> is not a live join code.
        </span>
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#071433] text-white border-b border-[#13285c] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-6 lg:gap-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-3 text-left focus:outline-hidden group"
              >
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center p-1 text-white shadow-md ring-2 ring-white/20 group-hover:ring-amber-400/60 transition-all">
                  <CompliseyLogo className="w-full h-full" cColor="#1d3c6a" ankhColor="#d9a438" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-['IBM_Plex_Sans']">
                      Compli<span className="text-amber-400">Sey</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/40">
                      Academy
                    </span>
                  </div>
                  <span className="hidden sm:block text-[10px] text-slate-300 tracking-normal">
                    AML/CFT Staff Training for Seychelles Regulated Firms
                  </span>
                </div>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'bg-white/15 text-white font-bold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                      {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                        <span
                          className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                            item.badgeStyle || 'bg-amber-400 text-[#071433]'
                          }`}
                        >
                          {item.badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Prepaid Seat / Join Code Button */}
              <button
                onClick={() => setShowJoinCodeModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition-colors"
                title="Enter 12-Month Prepaid Seat Join Code"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Join Code</span>
              </button>

              {/* Currency Selector (USD, SCR, EUR, GBP) */}
              <div className="flex items-center bg-[#0d2250] rounded-lg p-0.5 border border-[#1b3a7a]">
                {(['USD', 'SCR', 'EUR', 'GBP'] as CurrencyType[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2 py-1 text-[11px] font-bold rounded transition-all ${
                      currency === c
                        ? 'bg-amber-400 text-[#071433] shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Student Profile Badge */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-amber-400/40 focus:outline-hidden transition-all text-left"
                  aria-label="Compliance user profile"
                >
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-8 h-8 rounded-full object-cover border border-amber-400/40"
                  />
                  <div className="hidden xl:block">
                    <span className="text-xs font-bold text-white block leading-tight">
                      {student.name}
                    </span>
                    <span className="text-[10px] text-slate-300 block leading-none">
                      Regulated Entity Staff
                    </span>
                  </div>
                </button>

                {/* Profile dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <p className="text-xs font-bold text-slate-900">{student.name}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{student.title}</p>
                      <p className="text-[10px] text-indigo-700 font-mono mt-0.5">{student.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Mandatory Training Dashboard</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                          {enrolledCount} Active
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('certificates');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Compliance Audit File Certificates</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          {certificates.length} Issued
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('billing');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>Corporate Seats &amp; Invoices</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                          {transactions.length} Records
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-amber-900 bg-amber-50/60 font-bold hover:bg-amber-100/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                          <span>Admin Activation Desk</span>
                        </div>
                        {pendingOrdersCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-[#071433] font-bold text-[10px]">
                            {pendingOrdersCount} Pending
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setShowJoinCodeModal(true);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                        <span>Redeem Prepaid Seat Join Code</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 px-4 text-[11px] text-slate-400">
                      Complisanc Consulting Services (SEY) trading as Complisey
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Guarantees Touch Targets >= 44px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#071433] text-white border-t border-[#13285c] shadow-xl px-2 py-1 safe-area-bottom">
        <nav className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-amber-400 font-bold scale-105'
                    : 'text-slate-300 hover:text-white active:bg-white/10'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                  {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                    <span
                      className={`absolute -top-1 -right-2 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                        item.badgeStyle || 'bg-amber-400 text-[#071433]'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 leading-tight whitespace-nowrap">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Join Code / Prepaid Seat Modal */}
      {showJoinCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#071433] text-amber-400 flex items-center justify-center shadow-xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Redeem Prepaid Seat Join Code
                  </h3>
                  <p className="text-xs text-slate-500">
                    CompliSey 12-Month Regulated Staff Training Seat
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowJoinCodeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRedeemJoinCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enter Join Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. COMPLISEY-SEAT-2026"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono uppercase text-slate-900 focus:outline-hidden focus:border-[#071433] focus:bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Corporate join codes are provided by your firm's MLRO or CompliSey invoice.
                </p>
              </div>

              {joinCodeError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{joinCodeError}</span>
                </div>
              )}

              {joinCodeSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{joinCodeSuccess}</span>
                </div>
              )}

              <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-[11px] text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sample Live Join Codes for Evaluation:</span>
                </div>
                <div className="font-mono text-slate-700">
                  • <strong className="text-blue-900">COMPLISEY-SEAT-2026</strong> (Full Corporate Seat)
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinCodeModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#071433] text-amber-300 hover:bg-[#0c245c] text-xs font-bold shadow-md transition-colors"
                >
                  Activate Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
