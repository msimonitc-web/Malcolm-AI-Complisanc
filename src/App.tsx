import React, { useState, useEffect } from 'react';
import { HelpCircle, LifeBuoy, ShieldAlert, ArrowLeft, ShieldCheck, LogOut, Key, Film, Video, Sparkles } from 'lucide-react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { CsrfProvider } from './context/CsrfContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navigation } from './components/Navigation';
import { CourseDashboard } from './components/CourseDashboard';
import { CoursePlayer } from './components/CoursePlayer';
import { ExploreCourses } from './components/ExploreCourses';
import { CertificatesView } from './components/CertificatesView';
import { BillingView } from './components/BillingView';
import { AdminPortalView } from './components/AdminPortalView';
import { AdminLoginView } from './components/AdminLoginView';
import { CorporatePortalView } from './components/CorporatePortalView';
import { CourseWizard } from './components/CourseWizard';
import { PaymentModal } from './components/PaymentModal';
import { ProformaInvoiceModal } from './components/ProformaInvoiceModal';
import { BillingReceiptModal } from './components/BillingReceiptModal';
import { CertificateModal } from './components/CertificateModal';
import { LegalModals } from './components/LegalModals';
import { SupportCenterModal } from './components/SupportCenterModal';
import { RedeemTokenModal } from './components/RedeemTokenModal';
import { AdminNotificationToast } from './components/AdminNotificationToast';
import { AdminEmailNotificationModal } from './components/AdminEmailNotificationModal';
import { CartDrawer } from './components/CartDrawer';
import { InstantPaymentModal } from './components/InstantPaymentModal';
import { RegistrationWizardModal } from './components/RegistrationWizardModal';
import { MarketingStudioModal } from './components/MarketingStudioModal';
import { E2ETestSuiteModal } from './components/E2ETestSuiteModal';
import { PublicCertificateVerifierModal } from './components/PublicCertificateVerifierModal';
import { AdminEmailNotification } from './types';
import { CompliseyLogo } from './components/CompliseyLogo';
import { ThemeToggle } from './components/ThemeToggle';

const AcademyAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    logout,
    setActiveLegalModal,
    isSupportModalOpen,
    setIsSupportModalOpen,
    selectedProformaForView,
    setSelectedProformaForView,
    latestNotificationToast,
    dismissNotificationToast,
    markAdminNotificationAsRead,
    isRedeemModalOpen,
    setIsRedeemModalOpen,
    pendingActivationToken,
    setPendingActivationToken,
    isRegistrationWizardOpen,
    setIsRegistrationWizardOpen,
    isMarketingStudioOpen,
    setIsMarketingStudioOpen,
    isE2ETestModalOpen,
    setIsE2ETestModalOpen,
    isCertificateVerifierOpen,
    setIsCertificateVerifierOpen,
    openCoursePlayer,
    setIsCartOpen,
  } = useAcademy();

  const [activePreviewNotification, setActivePreviewNotification] = useState<AdminEmailNotification | null>(null);
  const [initialVerifyCode, setInitialVerifyCode] = useState<string>('');

  // Check if current URL path or hash indicates the restricted /admin portal
  const [isAdminPath, setIsAdminPath] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#/admin');
    }
    return false;
  });

  // Synchronize route changes and URL token parameters (?activate=TOKEN, ?test=e2e, ?verify=CODE)
  useEffect(() => {
    const syncRouteAndTokens = () => {
      const isNowAdmin = window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#/admin');
      setIsAdminPath(isNowAdmin);

      // Check query parameter for instant activation token or E2E test suite
      const params = new URLSearchParams(window.location.search);
      const token = params.get('activate') || params.get('token');
      if (token) {
        setPendingActivationToken(token);
        setIsRedeemModalOpen(true);
      }

      if (params.get('test') === 'e2e' || params.get('e2e') === 'true') {
        setIsE2ETestModalOpen(true);
      }

      const verifyParam = params.get('verify') || params.get('cert');
      if (verifyParam) {
        if (verifyParam !== 'true' && verifyParam !== '1') {
          setInitialVerifyCode(verifyParam);
        }
        setIsCertificateVerifierOpen(true);
      }
    };

    syncRouteAndTokens();
    window.addEventListener('popstate', syncRouteAndTokens);
    window.addEventListener('hashchange', syncRouteAndTokens);
    return () => {
      window.removeEventListener('popstate', syncRouteAndTokens);
      window.removeEventListener('hashchange', syncRouteAndTokens);
    };
  }, [setPendingActivationToken, setIsRedeemModalOpen, setIsE2ETestModalOpen, setIsCertificateVerifierOpen]);

  const navigateToAdmin = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin');
      setIsAdminPath(true);
    }
  };

  const navigateToUserPortal = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      setIsAdminPath(false);
    }
  };

  // Basic IP Protection: Block Right-Click and DevTools shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I/J/C, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Dedicated Restricted Admin Portal (academy.complisey.com/admin)
  if (isAdminPath) {
    if (currentUser?.role !== 'admin') {
      return <AdminLoginView onBackToPublicPortal={navigateToUserPortal} />;
    }

    return (
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#060c18] text-slate-900 dark:text-slate-100 font-['IBM_Plex_Sans',sans-serif]">
        {/* Admin Navigation Header */}
        <header className="sticky top-0 z-40 bg-[#071433] text-white border-b border-amber-400/30 px-4 sm:px-8 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CompliseyLogo variant="full" />
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/20">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-[#071433] text-[10px] font-black uppercase tracking-wider">
                  Admin Terminal (/admin)
                </span>
                <span className="text-xs text-slate-300">
                  Restricted Access (Malcolm Simon &amp; Eric D'Souza)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle variant="compact" />

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Operator:</span>
                <span>{currentUser.name}</span>
              </div>

              <button
                onClick={navigateToUserPortal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                title="Switch view to public user portal"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">User Portal (academy.complisey.com)</span>
                <span className="sm:hidden">User Portal</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  navigateToUserPortal();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
                title="Log Out Administrator"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <AdminPortalView onViewProforma={(ord) => setSelectedProformaForView(ord)} />
        </main>

        {/* Proforma Modal */}
        <ProformaInvoiceModal
          order={selectedProformaForView}
          onClose={() => setSelectedProformaForView(null)}
        />
      </div>
    );
  }

  // Standard User Portal (academy.complisey.com)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090f1f] text-slate-900 dark:text-slate-100 font-['IBM_Plex_Sans',sans-serif] transition-colors duration-200">
      {/* Responsive Top & Mobile Navigation */}
      <Navigation
        onOpenRedeemModal={() => setIsRedeemModalOpen(true)}
        onNavigateAdmin={navigateToAdmin}
      />

      {/* Main Content Area with Mobile Safe Spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 mb-16 md:mb-0">
        {activeTab === 'dashboard' && <CourseDashboard />}
        {activeTab === 'explore' && <ExploreCourses />}
        {activeTab === 'player' && <CoursePlayer />}
        {activeTab === 'certificates' && <CertificatesView />}
        {activeTab === 'billing' && <BillingView />}
        {activeTab === 'corporate' && <CorporatePortalView />}
        {activeTab === 'wizard' && <CourseWizard />}
        {activeTab === 'marketing' && (
          <div className="bg-white dark:bg-[#071433] rounded-3xl border border-amber-400/30 p-8 text-center space-y-4 max-w-2xl mx-auto my-10 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 mx-auto flex items-center justify-center">
              <Film className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              CompliSey Marketing Kit
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Facebook, Instagram Reel &amp; Social Template Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
              Generate 9:16 vertical reels, 1:1 feed graphics, and high-resolution downloadable PNG cards for AML/CFT compliance campaigns, board governance, and staff training awareness.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setIsMarketingStudioOpen(true)}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] font-bold text-xs cursor-pointer shadow-md transition-all flex items-center gap-2"
              >
                <span>Launch Marketing &amp; Reel Studio</span>
              </button>
              <button
                onClick={() => setActiveTab(currentUser?.role === 'admin' ? 'admin' : 'dashboard')}
                className="px-5 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-xs cursor-pointer transition-all"
              >
                Back to {currentUser?.role === 'admin' ? 'Back Office Admin' : 'Dashboard'}
              </button>
            </div>
          </div>
        )}
        {activeTab === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminPortalView onViewProforma={(ord) => setSelectedProformaForView(ord)} />
          ) : (
            <div className="bg-white dark:bg-[#071433] rounded-2xl border border-rose-200 dark:border-rose-900/60 p-8 text-center space-y-4 max-w-xl mx-auto my-12 shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 mx-auto flex items-center justify-center font-bold">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Complisey Back Office Restricted</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                The Back Office Operations Desk is strictly restricted to Complisey administration operators (Malcolm Simon &amp; Eric D'Souza) for financial proforma processing, wire verification, and seat provisioning.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab(currentUser?.role === 'corporate' ? 'corporate' : 'dashboard')}
                  className="px-5 py-2.5 rounded-xl bg-[#071433] dark:bg-amber-400 text-amber-300 dark:text-[#071433] font-bold text-xs cursor-pointer shadow-md transition-all"
                >
                  Return to {currentUser?.role === 'corporate' ? 'Corporate Admin Portal' : 'My Compliance Dashboard'}
                </button>
                <button
                  onClick={navigateToAdmin}
                  className="px-5 py-2.5 rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 font-bold text-xs cursor-pointer transition-all"
                >
                  Administrator Login (/admin)
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Complisey Footer matching index.html, accessible on desktop & mobile */}
      <footer className="py-5 pb-20 md:pb-5 bg-[#071433] text-slate-400 text-xs border-t border-[#13285c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left space-y-1">
            <div>
              <span>Complisanc Consulting Services (SEY) trading as </span>
              <strong className="text-white">Complisey</strong>.
              <span className="text-slate-500 ml-1">Private AML/CFT staff training for Seychelles and international reporting entities.</span>
            </div>
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span>Admin &amp; Support: <a href="mailto:malcolm@complisanc.com" className="font-mono text-amber-300 hover:underline">malcolm@complisanc.com</a></span>
              <span className="text-slate-600">·</span>
              <span>Training Inquiries: <a href="mailto:eric@complisanc.com" className="font-mono text-amber-300 hover:underline">eric@complisanc.com (Eric D'Souza)</a></span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-300">
            <button
              onClick={() => setIsRegistrationWizardOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-300 hover:text-amber-200 hover:bg-amber-400/30 font-bold cursor-pointer transition-colors shadow-2xs"
            >
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>How to Register (Walkthrough)</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsRedeemModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 hover:text-amber-200 hover:bg-amber-400/25 font-bold cursor-pointer transition-colors shadow-2xs"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Activate Course with Token</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsCertificateVerifierOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 font-bold cursor-pointer transition-colors text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Verify Certificate Authenticity</span>
            </button>
            {currentUser?.role === 'admin' && (
              <>
                <span>·</span>
                <button
                  onClick={() => setIsMarketingStudioOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 text-amber-300 hover:text-white font-medium cursor-pointer transition-colors text-xs"
                >
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span>Marketing Studio (Admin)</span>
                </button>
              </>
            )}
            <span>·</span>
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="hover:text-white cursor-pointer transition-colors text-slate-400 hover:underline"
            >
              Support Center &amp; Bank Transfers
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveLegalModal('privacy')}
              className="hover:text-white cursor-pointer transition-colors text-slate-400 hover:underline"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveLegalModal('terms')}
              className="hover:text-white cursor-pointer transition-colors text-slate-400 hover:underline"
            >
              Terms &amp; Conditions
            </button>
            <span>·</span>
            <button
              onClick={navigateToAdmin}
              className="hover:text-amber-400 text-slate-500 cursor-pointer transition-colors text-[11px]"
              title="Restricted CompliSey Back Office"
            >
              Admin Portal (/admin)
            </button>
            <span>·</span>
            <a
              href="https://complisey.com/"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              complisey.com
            </a>
          </div>
        </div>

        {/* Global Independent Training Provider Notice */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 pt-3 border-t border-white/10 text-[11px] text-slate-400 text-center sm:text-left leading-relaxed">
          <strong className="text-slate-300">Training Provider Notice:</strong> Complisanc Consulting Services (SEY) trading as Complisey (<a href="https://complisey.com/" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">complisey.com</a>) is an independent compliance training academy. We provide structured professional training to regulated entities to ensure their staff meet required AML/CFT compliance benchmarks and internal training policies.
        </div>
      </footer>

      {/* Course Activation Token Modal */}
      <RedeemTokenModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        initialToken={pendingActivationToken || ''}
        onSuccessOpenCourse={(courseId) => {
          setActiveTab('player');
          openCoursePlayer(courseId);
        }}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal />

      {/* Proforma Invoice Modal for Seychelles Bank Transfers */}
      <ProformaInvoiceModal
        order={selectedProformaForView}
        onClose={() => setSelectedProformaForView(null)}
      />

      {/* Invoice Receipt Modal */}
      <BillingReceiptModal />

      {/* Verified Certificate Modal */}
      <CertificateModal />

      {/* Legal & Compliance Standards Modal */}
      <LegalModals />

      {/* Support Center & Bank Transfer Assistance Modal */}
      <SupportCenterModal />

      {/* Checkout Shopping Cart Drawer */}
      <CartDrawer />

      {/* Direct Online Payment & Wire Remittance Modal */}
      <InstantPaymentModal />

      {/* Real-time Automated Admin Email Notification Toast */}
      <AdminNotificationToast
        notification={latestNotificationToast}
        onDismiss={dismissNotificationToast}
        onViewDetails={(notif) => {
          setActivePreviewNotification(notif);
          markAdminNotificationAsRead(notif.id);
        }}
      />

      {/* Global Admin Email Notification Preview Modal */}
      <AdminEmailNotificationModal
        notification={activePreviewNotification}
        isOpen={!!activePreviewNotification}
        onClose={() => setActivePreviewNotification(null)}
        onNavigateToOrder={(orderId) => {
          navigateToAdmin();
        }}
      />

      {/* How to Register & Get Started Onboarding Wizard Modal */}
      <RegistrationWizardModal
        isOpen={isRegistrationWizardOpen}
        onClose={() => setIsRegistrationWizardOpen(false)}
        onOpenCatalog={() => setActiveTab('explore')}
        onOpenTokenModal={() => setIsRedeemModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Social Media, Facebook & Instagram Reel Marketing Studio Modal */}
      <MarketingStudioModal
        isOpen={isMarketingStudioOpen || activeTab === 'marketing'}
        onClose={() => {
          setIsMarketingStudioOpen(false);
          if (activeTab === 'marketing') {
            setActiveTab(currentUser?.role === 'admin' ? 'admin' : 'dashboard');
          }
        }}
      />

      {/* End-to-End Compliance Lifecycle Simulator Modal */}
      <E2ETestSuiteModal
        isOpen={isE2ETestModalOpen}
        onClose={() => setIsE2ETestModalOpen(false)}
      />

      {/* Public Certificate Authenticator Modal */}
      <PublicCertificateVerifierModal
        isOpen={isCertificateVerifierOpen}
        onClose={() => setIsCertificateVerifierOpen(false)}
        initialCode={initialVerifyCode}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AcademyProvider>
        <CsrfProvider>
          <AcademyAppContent />
        </CsrfProvider>
      </AcademyProvider>
    </ThemeProvider>
  );
}

