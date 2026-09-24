import React, { useState } from 'react';
import {
  Compass,
  Award,
  CreditCard,
  ShieldCheck,
  Building2,
  User,
  LogIn,
  LogOut,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Key,
  ShoppingCart,
  Film,
  Video,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { ActiveTab, UserAccount } from '../types';
import { CompliseyLogo } from './CompliseyLogo';
import { useCsrf, CsrfInput } from '../context/CsrfContext';
import { ThemeToggle } from './ThemeToggle';
import { PreLaunchSeatReservationModal } from './PreLaunchSeatReservationModal';

interface NavigationProps {
  onOpenRedeemModal?: () => void;
  onNavigateAdmin?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenRedeemModal,
  onNavigateAdmin,
}) => {
  const {
    currentUser,
    logout,
    loginWithCredentials,
    activeTab,
    setActiveTab,
    certificates,
    orders,
    unreadAdminNotificationsCount,
    setIsCartOpen,
    cartItemsCount,
    setIsRegistrationWizardOpen,
    setIsMarketingStudioOpen,
    setIsE2ETestModalOpen,
    setIsCertificateVerifierOpen,
  } = useAcademy();

  const { csrfToken, submitProtectedForm } = useCsrf();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  const userEmail = currentUser?.email?.trim().toLowerCase();
  const userCompany = currentUser?.companyName?.trim().toLowerCase();

  const userScopedPendingOrders = orders.filter((o) => {
    if (o.status !== 'pending_payment') return false;
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'corporate') {
      const isCompany = Boolean(
        userCompany &&
        userCompany !== 'individual learner' &&
        o.companyName?.trim().toLowerCase() === userCompany
      );
      const isEmail = Boolean(userEmail && o.contactEmail?.trim().toLowerCase() === userEmail);
      return isCompany || isEmail;
    }
    return Boolean(userEmail && o.contactEmail?.trim().toLowerCase() === userEmail);
  });
  const pendingOrdersCount = userScopedPendingOrders.length;

  // Build clean, role-tailored navigation items
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badgeCount?: number;
    badgeStyle?: string;
  }[] = [];

  if (!currentUser) {
    // Visitor navigation: Invoices & Payments are restricted until registration
    navItems.push(
      { id: 'dashboard', label: 'Overview & Courses', icon: BookOpen },
      { id: 'explore', label: 'Course Curriculum', icon: Compass }
    );
  } else if (currentUser.role === 'admin') {
    // Admin on frontend sees standard navigation (Admin portal is accessed strictly via /admin URL)
    navItems.push(
      { id: 'dashboard', label: 'My Compliance Dashboard', icon: BookOpen },
      { id: 'explore', label: 'Course Catalog', icon: Compass },
      { id: 'certificates', label: 'My Compliance Records', icon: Award, badgeCount: certificates.length },
      {
        id: 'billing',
        label: 'Invoices & Payments',
        icon: CreditCard,
        badgeCount: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
        badgeStyle: 'bg-amber-400 text-[#071433]',
      }
    );
  } else if (currentUser.role === 'corporate') {
    // Corporate Administrator & HR navigation
    navItems.push(
      { id: 'corporate', label: 'Corporate Admin & HR Portal', icon: Building2 },
      {
        id: 'billing',
        label: 'Corporate Invoices & Wires',
        icon: CreditCard,
        badgeCount: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
        badgeStyle: 'bg-amber-400 text-[#071433]',
      },
      { id: 'explore', label: 'Course Catalog & Syllabus', icon: Compass }
    );
  } else {
    // Regular Learner navigation
    navItems.push(
      { id: 'dashboard', label: 'My Compliance Dashboard', icon: BookOpen },
      { id: 'explore', label: 'Course Catalog', icon: Compass },
      { id: 'certificates', label: 'My Compliance Records', icon: Award, badgeCount: certificates.length },
      {
        id: 'billing',
        label: 'My Invoices & Payments',
        icon: CreditCard,
        badgeCount: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
        badgeStyle: 'bg-amber-400 text-[#071433]',
      }
    );
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const res = loginWithCredentials(loginEmail, loginPassword);
    if (res.success) {
      setLoginSuccess(res.message);
      try {
        await submitProtectedForm('/api/auth/login-credentials', {
          email: loginEmail,
          _csrf: csrfToken,
        });
      } catch (err) {
        console.warn('Login telemetry recorded:', err);
      }
      setTimeout(() => {
        setShowLoginModal(false);
        setLoginEmail('');
        setLoginPassword('');
      }, 800);
    } else {
      setLoginError(res.message);
    }
  };

  const scrollToRegistration = () => {
    setActiveTab('dashboard');
    setTimeout(() => {
      const el = document.getElementById('registration-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {/* Top Header Navigation - Clean, Uncluttered, Authoritative */}
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
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* How to Register Quick Walkthrough */}
              <button
                onClick={() => setIsRegistrationWizardOpen(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-400/50 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Watch How to Register & Get Started Walkthrough"
              >
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline">How to Register</span>
              </button>

              {/* User-Facing Dark Theme Toggle */}
              <ThemeToggle variant="compact" />

              {/* Checkout Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-400/50 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="View Checkout Cart"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-[#071433] transition-transform">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Public Certificate Authenticator */}
              <button
                onClick={() => setIsCertificateVerifierOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Verify an official CompliSey AML/CFT Certificate ID"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Verify Certificate</span>
              </button>

              {/* Course Activation Token Redemption Button */}
              <button
                onClick={onOpenRedeemModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/25 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Redeem course activation token or link received from Malcolm Simon or Eric"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Activate Course</span>
              </button>

              {/* E2E Test Suite Simulator Launcher (strictly in explicit test drill mode via ?test=e2e) */}
              {typeof window !== 'undefined' && window.location.search.includes('test') && (
                <button
                  onClick={() => setIsE2ETestModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  title="Run full End-to-End Compliance Lifecycle Simulator"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">E2E Simulator</span>
                </button>
              )}

              {!currentUser ? (
                // Unauthenticated Visitor Controls
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Log In</span>
                  </button>

                  <button
                    onClick={scrollToRegistration}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <span>Register / Enroll</span>
                    <ArrowRight className="w-3 h-3 text-[#071433]" />
                  </button>
                </div>
              ) : (
                // Authenticated Controls (Learner, Corporate, or Malcolm/Eric Admin)
                <div className="flex items-center gap-2">
                  {currentUser.role === 'admin' || currentUser.role === 'corporate' ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>{currentUser.name.split(' ')[0]}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentUser.name.split(' ')[0]}</span>
                    </div>
                  )}

                  <button
                    onClick={logout}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-rose-500/25 text-slate-300 hover:text-rose-200 border border-white/15 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
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

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-1 rounded-xl text-slate-300 hover:text-white active:bg-white/10"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full text-[9px] font-black bg-amber-400 text-[#071433] flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Cart</span>
          </button>

          {!currentUser ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-1 rounded-xl text-amber-300 active:bg-white/10"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Log In</span>
            </button>
          ) : (
            <button
              onClick={logout}
              className="flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-1 rounded-xl text-rose-300 active:bg-white/10"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5 leading-tight">Log Out</span>
            </button>
          )}
        </nav>
      </div>

      {/* Clean, Simple Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b1b3d] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-[#1d3d75] animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#071433] text-amber-400 flex items-center justify-center shadow-xs border border-amber-400/30">
                  <LogIn className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    CompliSey Academy Login
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sign in to access your compliance portal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Demo Pre-fill for User Portal */}
            <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-[#071433]/70 border border-slate-200 dark:border-[#193566]">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Quick-Select Portal Account:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('learner@complisey.com');
                    setLoginPassword('Learner2026!');
                  }}
                  className="p-2 text-left rounded-lg border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 text-xs font-bold text-emerald-900 dark:text-emerald-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold">Student Learner</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-normal">Compliance Officer</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('s.confait@fiduciary-sey.sc');
                    setLoginPassword('Corporate2026!');
                  }}
                  className="p-2 text-left rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 text-xs font-bold text-amber-900 dark:text-amber-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="font-bold">Corporate MLRO</span>
                  </div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 font-normal">Bulk Seats & Staff Tracking</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <CsrfInput formName="credentials-login" />
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.sc"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071433] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071433] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {loginError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccess && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#071433] dark:bg-amber-400 text-amber-300 dark:text-[#071433] hover:bg-[#0c245c] dark:hover:bg-amber-300 text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>


            </form>
          </div>
        </div>
      )}
    </>
  );
};
