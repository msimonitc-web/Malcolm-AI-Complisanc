import React from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { Navigation } from './components/Navigation';
import { CourseDashboard } from './components/CourseDashboard';
import { CoursePlayer } from './components/CoursePlayer';
import { ExploreCourses } from './components/ExploreCourses';
import { CertificatesView } from './components/CertificatesView';
import { BillingView } from './components/BillingView';
import { AdminPortalView } from './components/AdminPortalView';
import { PaymentModal } from './components/PaymentModal';
import { ProformaInvoiceModal } from './components/ProformaInvoiceModal';
import { BillingReceiptModal } from './components/BillingReceiptModal';
import { CertificateModal } from './components/CertificateModal';
import { LegalModals } from './components/LegalModals';

const AcademyAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveLegalModal,
    selectedProformaForView,
    setSelectedProformaForView,
  } = useAcademy();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['IBM_Plex_Sans',sans-serif]">
      {/* Responsive Top & Mobile Navigation */}
      <Navigation />

      {/* Main Content Area with Mobile Safe Spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 mb-16 md:mb-0">
        {activeTab === 'dashboard' && <CourseDashboard />}
        {activeTab === 'explore' && <ExploreCourses />}
        {activeTab === 'player' && <CoursePlayer />}
        {activeTab === 'certificates' && <CertificatesView />}
        {activeTab === 'billing' && <BillingView />}
        {activeTab === 'admin' && (
          <AdminPortalView onViewProforma={(ord) => setSelectedProformaForView(ord)} />
        )}
      </main>

      {/* Complisey Footer matching index.html */}
      <footer className="hidden md:block py-5 bg-[#071433] text-slate-400 text-xs border-t border-[#13285c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span>Complisanc Consulting Services (SEY) trading as </span>
            <strong className="text-white">Complisey</strong>.
            <span className="text-slate-500 ml-1">Private AML/CFT staff training for Seychelles and international reporting entities.</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
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
      </footer>

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
    </div>
  );
};

export default function App() {
  return (
    <AcademyProvider>
      <AcademyAppContent />
    </AcademyProvider>
  );
}
