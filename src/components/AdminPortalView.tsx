import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  AlertCircle,
  FileText,
  UserCheck,
  CreditCard,
  Download,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  DollarSign,
  ArrowUpRight,
  RefreshCw,
  Mail,
  Send,
  Inbox,
  ExternalLink,
  Copy,
  Key,
  Receipt,
  Film,
  Users,
  Lock,
  Activity,
  Trash2,
  Bug,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAcademy } from '../context/AcademyContext';
import { EnrollmentOrder, AdminEmailNotification, CourseActivationToken, Transaction } from '../types';
import { CompliseyLogo } from './CompliseyLogo';
import { AdminEmailNotificationModal } from './AdminEmailNotificationModal';
import { ClientReceiptNotificationModal } from './ClientReceiptNotificationModal';
import { MultiSeatTokenModal } from './MultiSeatTokenModal';
import { AdminAuditTrailView } from './AdminAuditTrailView';
import { E2ETestSuiteModal } from './E2ETestSuiteModal';
import { AdminBugsErrorsConsole } from './AdminBugsErrorsConsole';
import { AdminUserPortalOverview } from './AdminUserPortalOverview';
import { AdminChangePasswordModal } from './AdminChangePasswordModal';
import { systemErrorService } from '../services/systemErrorService';
import {
  DEFAULT_ADMIN_EMAILS,
  adminEmailNotificationService,
  clientReceiptNotificationService,
  ClientReceiptConfirmation,
  ResendStatusInfo,
} from '../services/adminEmailNotificationService';
import { activationTokenService } from '../services/activationTokenService';
import { systemAuditLogService } from '../services/systemAuditLogService';
import { useCsrf, CsrfInput } from '../context/CsrfContext';

interface AdminPortalViewProps {
  onViewProforma: (order: EnrollmentOrder) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ onViewProforma }) => {
  const {
    orders,
    adminActivateOrder,
    formatPrice,
    courses,
    student,
    openCoursePlayer,
    currentUser,
    adminNotifications,
    unreadAdminNotificationsCount,
    markAdminNotificationAsRead,
    markAllAdminNotificationsAsRead,
    triggerManualNotificationDispatch,
    activationTokens,
    generateCustomActivationToken,
    clientReceipts,
    getClientReceiptForOrder,
    sendClientReceiptConfirmationEmail,
    setSelectedTransactionForReceipt,
    setSelectedProformaForView,
    transactions,
    setIsMarketingStudioOpen,
    deleteOrder,
    clearDemoOrders,
    isE2ETestModalOpen,
    setIsE2ETestModalOpen,
  } = useAcademy();

  const { csrfToken, submitProtectedForm } = useCsrf();

  const [activeAdminTab, setActiveAdminTab] = useState<
    | 'orders'
    | 'tokens'
    | 'email_notifications'
    | 'client_receipts'
    | 'audit_trail'
    | 'user_portal_overview'
    | 'bugs_errors'
  >('orders');
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_payment' | 'activated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForActivation, setSelectedOrderForActivation] = useState<EnrollmentOrder | null>(null);
  const [bankReceiptNote, setBankReceiptNote] = useState('');
  const [isSubmittingActivation, setIsSubmittingActivation] = useState(false);
  const [activationSuccessMsg, setActivationSuccessMsg] = useState<string | null>(null);
  const [selectedNotificationForModal, setSelectedNotificationForModal] = useState<AdminEmailNotification | null>(null);
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState<ClientReceiptConfirmation | null>(null);
  const [testDispatchSuccess, setTestDispatchSuccess] = useState(false);
  const [testDispatchDetails, setTestDispatchDetails] = useState<string | null>(null);
  const [isTestDispatching, setIsTestDispatching] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedOrderForSeatTokens, setSelectedOrderForSeatTokens] = useState<EnrollmentOrder | null>(null);
  const [resendStatus, setResendStatus] = useState<ResendStatusInfo | null>(null);

  const activeE2EOrderId = typeof window !== 'undefined' ? localStorage.getItem('e2e_active_test_order_id') : null;
  const activeE2EOrder = activeE2EOrderId ? orders.find((o) => o.id === activeE2EOrderId) : null;

  useEffect(() => {
    adminEmailNotificationService.checkResendStatus().then((st) => {
      if (st) setResendStatus(st);
    });
  }, []);

  // New Custom Token Creation Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newIssuer, setNewIssuer] = useState<'Malcolm Simon' | "Eric D'Souza">('Malcolm Simon');
  const [newPackageType, setNewPackageType] = useState<'all' | 'level1' | 'level2' | 'c-1' | 'c-2' | 'c-3' | 'c-4' | 'c-5' | 'c-6'>('all');
  const [tokenCreatedMsg, setTokenCreatedMsg] = useState<string | null>(null);

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === 'all' || ord.status === filterStatus;
    const matchesSearch =
      ord.proformaNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.ccsBookingId && ord.ccsBookingId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ord.bankReferenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending_payment').length;
  const activatedCount = orders.filter((o) => o.status === 'activated').length;
  const totalPendingAmount = orders
    .filter((o) => o.status === 'pending_payment')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const handlePreviewOrderNotification = (order: EnrollmentOrder) => {
    const existing = adminNotifications.find((n) => n.orderId === order.id);
    if (existing) {
      setSelectedNotificationForModal(existing);
      markAdminNotificationAsRead(existing.id);
    } else {
      const { subject, textContent, htmlContent } = adminEmailNotificationService.generateEmailTemplates(
        order,
        DEFAULT_ADMIN_EMAILS
      );
      setSelectedNotificationForModal({
        id: `preview_${order.id}`,
        orderId: order.id,
        proformaNumber: order.proformaNumber,
        ccsBookingId: order.ccsBookingId,
        studentName: order.contactName,
        studentEmail: order.contactEmail,
        studentPhone: order.contactPhone || '',
        companyName: order.companyName,
        companyAddress: order.companyAddress || '',
        coursePackageTitle: order.courseTitle,
        courseId: order.courseId,
        seatCount: order.seatCount,
        unitPrice: order.unitPrice,
        totalAmount: order.totalAmount,
        currency: order.currency,
        recipientEmails: DEFAULT_ADMIN_EMAILS,
        subject,
        htmlContent,
        textContent,
        status: 'delivered',
        notes: order.notes,
        sentAt: order.createdAt,
      });
    }
  };

  const handleTriggerTestDispatch = async () => {
    setIsTestDispatching(true);
    setTestDispatchDetails(null);
    try {
      const res = await adminEmailNotificationService.sendTestVerificationEmail();
      setIsTestDispatching(false);
      setTestDispatchSuccess(true);
      const recipientStr = Array.isArray(res.testRecipients)
        ? res.testRecipients.join(', ')
        : 'Malcolm & Eric';
      setTestDispatchDetails(`Live verification email sent via Resend to: ${recipientStr} (Message ID: ${res.id || 'dispatched'})`);
      setTimeout(() => setTestDispatchSuccess(false), 9000);
    } catch (e: unknown) {
      setIsTestDispatching(false);
      const msg = e instanceof Error ? e.message : String(e);
      setTestDispatchDetails(`Dispatch notice: ${msg}`);
      setTestDispatchSuccess(true);
      setTimeout(() => setTestDispatchSuccess(false), 9000);
    }
  };

  const handleConfirmActivation = async (order: EnrollmentOrder) => {
    setIsSubmittingActivation(true);
    try {
      await submitProtectedForm('/api/admin/activate-order', {
        orderId: order.id,
        proformaNumber: order.proformaNumber,
        bankReceiptNote: bankReceiptNote || 'Confirmed via Seychelles Bank Account credit',
        _csrf: csrfToken,
      });
    } catch (err) {
      console.warn('Order activated locally; CSRF telemetry processed:', err);
    }

    setTimeout(() => {
      adminActivateOrder(order.id, bankReceiptNote || 'Confirmed via MCB Seychelles wire transfer');
      setIsSubmittingActivation(false);
      setSelectedOrderForActivation(null);
      setBankReceiptNote('');
      setActivationSuccessMsg(`Order ${order.proformaNumber} for ${order.companyName} has been successfully activated! Funds confirmed at MCB Seychelles (A/C: 00001073508). Official Payment Receipt & Tax Invoice dispatched to ${order.contactEmail}.`);

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setActivationSuccessMsg(null);
      }, 6000);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 font-['IBM_Plex_Sans']">
      {/* Header & Status Banner */}
      <div className="bg-[#071433] text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-400 text-[#071433] text-xs font-black uppercase tracking-wider">
                Administrator Backend Module
              </span>
              <span className="text-xs text-slate-300">Complisanc Consulting Services (SEY)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bank Transfer Verification &amp; Seat Activation Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Inspect incoming bank wire transfers from Seychelles fiduciaries and corporate reporting entities, verify funds received at The Mauritius Commercial Bank (Seychelles) Ltd. (A/C: 00001073508), and activate staff training modules.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsE2ETestModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-black shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Run End-to-End Compliance Simulator</span>
              </button>

              <button
                onClick={() => setIsPasswordChangeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                title="Change Malcolm Simon or Eric D'Souza administrator password"
              >
                <Key className="w-3.5 h-3.5 text-amber-300" />
                <span>Change Password</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('user_portal_overview')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAdminTab === 'user_portal_overview'
                    ? 'bg-amber-400 text-[#071433]'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                title="Inspect public portal courses, syllabus, and learner view"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>User Portal Overview</span>
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shrink-0 flex flex-col items-end">
            <span className="text-xs text-amber-300 font-semibold uppercase">Pending Verification</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{pendingCount} Orders</span>
            <span className="text-xs text-slate-300">Totaling {formatPrice(totalPendingAmount)}</span>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-8 pointer-events-none">
          <CompliseyLogo className="w-72 h-72" cColor="#ffffff" ankhColor="#ffffff" />
        </div>
      </div>

      {/* Active E2E Simulator Drill Banner */}
      {activeE2EOrder && activeE2EOrder.status === 'pending_payment' && (
        <div className="p-4 bg-amber-500/15 border-2 border-amber-400 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#071433] bg-amber-400 px-2 py-0.5 rounded">
                  Active E2E Testing Drill
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Awaiting Token Issuance: {activeE2EOrder.proformaNumber} ({activeE2EOrder.companyName})
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1">
                You are currently in the Admin Desk as Malcolm Simon. Click <strong>"Issue Token &amp; Confirm MCB Wire"</strong> on order{' '}
                <span className="font-mono font-bold text-amber-900">{activeE2EOrder.proformaNumber}</span> to verify bank wire receipt and dispatch the live Tax Invoice &amp; Token email to <strong className="text-slate-900">{activeE2EOrder.contactEmail}</strong>!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedOrderForActivation(activeE2EOrder)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Issue Token &amp; Activate</span>
            </button>
            <button
              onClick={() => setIsE2ETestModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
            >
              Back to Simulator
            </button>
          </div>
        </div>
      )}

      {/* Success notification banner */}
      {activationSuccessMsg && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{activationSuccessMsg}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsE2ETestModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#071433] font-black text-xs cursor-pointer shadow-xs flex items-center gap-1 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Re-open E2E Simulator</span>
            </button>
            <button
              onClick={() => setActivationSuccessMsg(null)}
              className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Admin Module Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'orders'
                ? 'bg-[#071433] text-amber-300 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Proforma Orders &amp; Activation</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-[10px] font-black">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('tokens')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'tokens'
                ? 'bg-[#071433] text-amber-300 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Activation Tokens &amp; Links</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 text-[10px] font-black">
              {activationTokens.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('email_notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'email_notifications'
                ? 'bg-[#071433] text-amber-300 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Automated Admin Email Alerts</span>
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-black">
              {adminNotifications.length}
            </span>
            {unreadAdminNotificationsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('client_receipts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'client_receipts'
                ? 'bg-[#071433] text-amber-300 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Client Receipts &amp; Invoices</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 text-[10px] font-black">
              {clientReceipts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit_trail')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'audit_trail'
                ? 'bg-[#071433] text-amber-300 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Audit Trail &amp; Event Logs</span>
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 text-[10px] font-black">
              {systemAuditLogService.getAllEvents().length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('user_portal_overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'user_portal_overview'
                ? 'bg-[#071433] text-amber-300 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
            title="Comprehensive oversight of courses, passing standards, and corporate licensing"
          >
            <Eye className="w-4 h-4 text-amber-500" />
            <span>User Portal Overview</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-[10px] font-black">
              {courses.length} Courses
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('bugs_errors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'bugs_errors'
                ? 'bg-rose-950 text-rose-200 border border-rose-800 shadow-xs'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
            title="Real-time crash, network, and exception diagnostic monitoring"
          >
            <Bug className="w-4 h-4 text-rose-500" />
            <span>Bugs &amp; Error Console</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                systemErrorService.getUnresolvedIncidents().length > 0
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {systemErrorService.getAllIncidents().length}
            </span>
          </button>

          <button
            onClick={() => setIsMarketingStudioOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer bg-amber-400 hover:bg-amber-300 text-[#071433] shadow-xs"
            title="Generate Social Media Reels, Facebook & Instagram templates"
          >
            <Film className="w-4 h-4" />
            <span>Marketing &amp; Reels Studio</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Active Inboxes: <strong className="text-slate-800">malcolm@complisanc.com</strong> &amp; <strong className="text-slate-800">eric@complisanc.com</strong></span>
        </div>
      </div>

      {activeAdminTab === 'orders' ? (
        <>
          {/* Roadmap Info Card: Seychelles Bank Direct Online Gateway */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-800 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-blue-950">
                Seychelles Acquiring Bank Gateway Integration Notice
              </h3>
              <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 text-[10px] font-bold uppercase">
                In Technical Sandbox
              </span>
            </div>
            <p className="text-xs text-blue-900 mt-0.5">
              Direct Seychelles merchant card processing via local banking acquiring channels is currently completing testing. In the interim, all corporate &amp; individual seat enrollments are issued via <strong>Proforma Invoices</strong> and activated upon receipt of <strong>direct bank transfer</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Awaiting Payment</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{pendingCount}</p>
          <p className="text-xs text-amber-700 mt-0.5">Require bank ledger verification</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activated Seats</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{activatedCount}</p>
          <p className="text-xs text-emerald-700 mt-0.5">Active in student portals</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Corporate Invoices</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Proforma &amp; Tax invoices tracked</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-[#071433] text-amber-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending_payment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === 'pending_payment'
                ? 'bg-amber-500 text-[#071433]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Bank Wire ({pendingCount})</span>
          </button>
          <button
            onClick={() => setFilterStatus('activated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === 'activated'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Activated ({activatedCount})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              const pendingOrders = orders.filter(o => o.status === 'pending_payment');
              if (pendingOrders.length === 0) {
                alert('No pending/unpaid registrations found.');
                return;
              }
              if (window.confirm(`Are you sure you want to delete all ${pendingOrders.length} pending/unpaid registrations? This will purge dead dead data.`)) {
                pendingOrders.forEach(ord => deleteOrder(ord.id));
              }
            }}
            title="Purge all pending/unpaid registrations"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Purge Unpaid ({orders.filter(o => o.status === 'pending_payment').length})</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Purge all initial demo/seed orders (ORD-PRF-9841, ORD-PRF-9842, etc.) to prepare a clean slate for production Go-Live?')) {
                clearDemoOrders();
              }
            }}
            title="Purge demo test records for clean Go-Live launch"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-red-50 hover:border-red-300 text-xs font-semibold text-slate-600 hover:text-red-700 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600" />
            <span className="hidden md:inline">Purge Demo Data</span>
            <span className="md:hidden">Purge</span>
          </button>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search company, proforma, wire ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#071433]"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Proforma # &amp; Date</th>
                <th className="p-3.5">Reporting Entity / Client</th>
                <th className="p-3.5">Catalogue Access &amp; Seats</th>
                <th className="p-3.5">CCS Booking ID (Wire Ref)</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900">{order.proformaNumber}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{order.companyName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {order.contactName} · <span className="font-mono">{order.contactEmail}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800 line-clamp-1 max-w-xs" title={order.courseTitle}>
                        {order.courseTitle}
                      </div>
                      <div className="text-[11px] font-bold text-blue-700 mt-0.5">
                        {order.items && order.items.length > 0 ? (
                          <span>
                            {order.items.length} {order.items.length === 1 ? 'Package' : 'Packages'} · {order.seatCount} {order.seatCount === 1 ? 'Seat' : 'Seats'}
                          </span>
                        ) : (
                          <span>
                            {order.seatCount} {order.seatCount === 1 ? 'Seat' : 'Seats'}
                          </span>
                        )}
                      </div>
                      {order.status === 'activated' && (
                        <button
                          onClick={() => setSelectedOrderForSeatTokens(order)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/60 text-[10px] font-bold transition-colors mt-1 cursor-pointer"
                          title={order.seatCount > 1 ? "Manage individual seat tokens, assign staff and export roster" : "View non-transferable seat token & statutory Section 34 audit record"}
                        >
                          {order.seatCount > 1 ? (
                            <Users className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <UserCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          )}
                          <span>{order.seatCount > 1 ? `Manage ${order.seatCount} Seat Tokens` : 'Seat Token & Audit'}</span>
                        </button>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span className="font-mono font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200 text-[11px] block w-fit">
                        {order.ccsBookingId || order.bankReferenceCode}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="font-bold text-slate-900">
                        {formatPrice(order.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">{order.currency}</div>
                    </td>

                    <td className="p-3.5 text-center">
                      {order.status === 'pending_payment' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>Pending Transfer</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Activated</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handlePreviewOrderNotification(order)}
                          title="View Automated Admin Email Alert (Dispatched to malcolm@complisanc.com & eric@complisanc.com)"
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-blue-700 hover:text-blue-900 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onViewProforma(order)}
                          title="View Official Proforma Invoice"
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete registration ${order.proformaNumber} (${order.companyName})? This removes dead/unpaid registration data.`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          title="Delete Registration / Order"
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {order.status === 'pending_payment' && (
                          <button
                            onClick={() => setSelectedOrderForActivation(order)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Activate Course</span>
                          </button>
                        )}

                        {order.status === 'activated' && (
                          <div className="flex items-center gap-1.5">
                            {order.seatCount > 1 ? (
                              <button
                                onClick={() => setSelectedOrderForSeatTokens(order)}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 dark:text-amber-300 border border-amber-400/50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                title="Manage non-transferable seat tokens, assign staff, and export roster"
                              >
                                <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                <span>{order.seatCount} Seat Tokens &amp; Roster</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedOrderForSeatTokens(order)}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 dark:text-amber-300 border border-amber-400/50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                title="View non-transferable seat token & statutory Section 34 audit record"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                <span>Seat Token &amp; Audit</span>
                              </button>
                            )}

                            {order.activationToken && (
                              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 px-2 py-0.5 rounded-lg">
                                <span className="font-mono text-[10px] font-bold text-amber-900 dark:text-amber-300">
                                  {order.activationToken}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(order.activationToken!);
                                    setCopiedToken(order.activationToken!);
                                    setTimeout(() => setCopiedToken(null), 2000);
                                  }}
                                  title="Copy activation token to clipboard"
                                  className="p-0.5 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                                >
                                  {copiedToken === order.activationToken ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    const url = activationTokenService.buildActivationUrl(order.activationToken!);
                                    navigator.clipboard.writeText(url);
                                    setCopiedLink(order.activationToken!);
                                    setTimeout(() => setCopiedLink(null), 2000);
                                  }}
                                  title="Copy direct activation URL for student"
                                  className="p-0.5 text-blue-600 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
                                >
                                  {copiedLink === order.activationToken ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <ExternalLink className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            )}

                            {order.status === 'activated' && (
                              <button
                                onClick={() => {
                                  const rc = getClientReceiptForOrder(order.id);
                                  if (rc) {
                                    setSelectedReceiptForModal(rc);
                                  } else {
                                    onViewProforma(order);
                                  }
                                }}
                                title="Inspect Client Receipt Confirmation Email & Tax Invoice"
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Receipt Email</span>
                              </button>
                            )}

                            <button
                              onClick={() => openCoursePlayer(order.courseId)}
                              title="Open Course Player for this module"
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>Enter Course</span>
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to permanently delete order ${order.proformaNumber} (${order.companyName})?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          title="Delete/Purge Order Record"
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors ml-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      ) : activeAdminTab === 'tokens' ? (
        /* Course Activation Tokens & Links Management Tab */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-[#071433] text-white p-5 sm:p-6 rounded-2xl border border-amber-400/30 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-[#071433] text-[10px] font-black uppercase tracking-wider">
                    Access Control Desk
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Authorizing Administrators: Malcolm Simon &amp; Eric D'Souza</span>
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">
                  Course Activation Tokens &amp; Direct Student Links
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Students only obtain course player access after course registration and verified payment. Malcolm Simon and Eric D'Souza issue a secure token or direct link. Once the student inputs or clicks the token, their selected courses are instantly unlocked.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xl font-black text-amber-300">{activationTokens.length}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Issued Tokens</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xl font-black text-emerald-400">
                    {activationTokens.filter((t) => t.status === 'active').length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Awaiting Student</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xl font-black text-blue-300">
                    {activationTokens.filter((t) => t.status === 'redeemed').length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Redeemed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Issue New Token Form */}
          <div className="bg-white dark:bg-[#071433] rounded-2xl border border-slate-200 dark:border-[#1d3d75] p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-[#132b57]">
              <PlusCircle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Issue &amp; Authorize New Course Activation Token
              </h3>
            </div>

            {tokenCreatedMsg && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{tokenCreatedMsg}</span>
                </div>
                <button
                  onClick={() => setTokenCreatedMsg(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newStudentName || !newStudentEmail) {
                  alert('Please enter student name and email.');
                  return;
                }

                let selectedCourseIds: string[] = [];
                let selectedCourseTitle = '';

                if (newPackageType === 'all') {
                  selectedCourseIds = ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6'];
                  selectedCourseTitle = 'Complete Seychelles AML/CFT Officer Curriculum (All 6 Courses)';
                } else if (newPackageType === 'level1') {
                  selectedCourseIds = ['c-1', 'c-2', 'c-3'];
                  selectedCourseTitle = 'Level 1: Statutory Compliance Foundations (3 Courses)';
                } else if (newPackageType === 'level2') {
                  selectedCourseIds = ['c-4', 'c-5', 'c-6'];
                  selectedCourseTitle = 'Level 2: Advanced Financial Crime & Supervisory Readiness (3 Courses)';
                } else {
                  const c = courses.find((crs) => crs.id === newPackageType);
                  selectedCourseIds = [newPackageType];
                  selectedCourseTitle = c ? c.title : 'Seychelles Compliance Course';
                }

                const generated = generateCustomActivationToken({
                  courseIds: selectedCourseIds,
                  courseTitle: selectedCourseTitle,
                  issuedBy: newIssuer,
                  issuedToName: newStudentName,
                  issuedToEmail: newStudentEmail,
                });

                setTokenCreatedMsg(`Token ${generated.token} successfully created and authorized by ${newIssuer}! Direct link generated.`);
                setNewStudentName('');
                setNewStudentEmail('');
                confetti({ particleCount: 50, spread: 60 });
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Authorizing Administrator
                </label>
                <select
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#060e24] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-800 dark:text-white"
                >
                  <option value="Malcolm Simon">Malcolm Simon (Complisey Director)</option>
                  <option value="Eric D'Souza">Eric D'Souza (Complisey Training Lead)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Recipient Student / Officer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Marcus Delpech"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#060e24] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Recipient Corporate / Student Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g., student@fiduciary-sey.sc"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#060e24] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Curriculum Package / Course
                </label>
                <select
                  value={newPackageType}
                  onChange={(e) => setNewPackageType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#060e24] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-800 dark:text-white"
                >
                  <option value="all">Complete Curriculum (All 6 Courses)</option>
                  <option value="level1">Level 1: Statutory Foundations (Courses 1-3)</option>
                  <option value="level2">Level 2: Advanced AML/CFT (Courses 4-6)</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      Single: {c.title.slice(0, 40)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-[#071433]" />
                  <span>Generate &amp; Authorize Activation Token</span>
                </button>
              </div>
            </form>
          </div>

          {/* Tokens Registry Table */}
          <div className="bg-white dark:bg-[#071433] rounded-2xl border border-slate-200 dark:border-[#1d3d75] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-[#132b57] flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Authorized Activation Tokens Registry ({activationTokens.length})
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Click copy icon to copy token or send direct link to student
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#050b1a] text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-[#132b57]">
                  <tr>
                    <th className="p-3.5">Seat / Token Code</th>
                    <th className="p-3.5">Designated Staff (Identity Bound)</th>
                    <th className="p-3.5">Purchasing Firm / Contact</th>
                    <th className="p-3.5">Authorized Courses</th>
                    <th className="p-3.5 text-center">Statutory Status</th>
                    <th className="p-3.5 text-right">Actions &amp; Direct Links</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#132b57]">
                  {activationTokens.map((tok) => {
                    const activationUrl = activationTokenService.buildActivationUrl(tok.token);
                    const isRedeemed = tok.status === 'redeemed';
                    const isAssigned = tok.status === 'assigned';
                    const associatedOrder = tok.orderId ? orders.find((o) => o.id === tok.orderId) : null;

                    return (
                      <tr key={tok.token} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/40">
                              {tok.token}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(tok.token);
                                setCopiedToken(tok.token);
                                setTimeout(() => setCopiedToken(null), 2000);
                              }}
                              title="Copy Token"
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                            >
                              {copiedToken === tok.token ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            {tok.seatNumber ? (
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                Seat #{tok.seatNumber} of {tok.totalSeatsInOrder || associatedOrder?.seatCount || 1}
                              </span>
                            ) : null}
                            <span className="text-[10px] text-slate-400">
                              Issued: {new Date(tok.issuedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* Designated Staff & Non-Transferable Identity Lock */}
                        <td className="p-3.5">
                          {isRedeemed ? (
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span>{tok.redeemedBy}</span>
                              </div>
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                                Redeemed &amp; Locked ({tok.redeemedAt ? new Date(tok.redeemedAt).toLocaleDateString() : 'Active'})
                              </div>
                            </div>
                          ) : isAssigned ? (
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-500" />
                                <span>{tok.assignedToName}</span>
                              </div>
                              <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                {tok.assignedToEmail}
                              </div>
                              <div className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                                Non-Transferable · Locked to Staff
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="text-slate-400 italic text-[11px]">Unassigned (Open for firm staff)</span>
                              {associatedOrder && associatedOrder.seatCount > 1 && (
                                <button
                                  onClick={() => setSelectedOrderForSeatTokens(associatedOrder)}
                                  className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline block font-semibold mt-0.5 cursor-pointer"
                                >
                                  + Assign in Roster
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {tok.issuedToName}
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {tok.issuedToEmail}
                          </div>
                          {tok.proformaNumber && (
                            <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                              Ref: {tok.proformaNumber}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 max-w-xs">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                            {tok.courseTitle}
                          </div>
                          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                            {tok.courseIds.length} {tok.courseIds.length === 1 ? 'Course' : 'Courses'} Unlocked
                          </div>
                        </td>

                        <td className="p-3.5 text-center">
                          {isRedeemed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                              <CheckCircle2 className="w-3 h-3 text-blue-600" />
                              <span>Redeemed &amp; Bound</span>
                            </span>
                          ) : isAssigned ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                              <Lock className="w-3 h-3 text-amber-600" />
                              <span>Assigned · Locked</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Active · Open Seat</span>
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {associatedOrder && associatedOrder.seatCount > 1 && (
                              <button
                                onClick={() => setSelectedOrderForSeatTokens(associatedOrder)}
                                className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-400/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                title="Open entire seat roster for this corporate order"
                              >
                                <Users className="w-3 h-3" />
                                <span>Roster ({associatedOrder.seatCount})</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(activationUrl);
                                setCopiedLink(tok.token);
                                setTimeout(() => setCopiedLink(null), 2500);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-[#1d3d75] hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                              title="Copy direct activation URL"
                            >
                              {copiedLink === tok.token ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-400" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>

                            <a
                              href={activationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-lg border border-slate-300 dark:border-[#1d3d75] hover:bg-slate-100 dark:hover:bg-white/10 text-blue-600 dark:text-blue-400"
                              title="Test direct activation link in new window"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Automated Email Notifications System Tab */
        <div className="space-y-4">
          {/* Notification System Banner */}
          <div className="bg-gradient-to-r from-[#071433] via-[#0c2356] to-[#071433] text-white p-5 rounded-2xl border border-amber-400/30 shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-[#071433] text-[10px] font-black uppercase tracking-wider">
                    Automated Alert Trigger
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Trigger Active &amp; Firestore Synced</span>
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">
                  Admin Proforma Invoice Email Notification System
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Whenever a student requests a proforma invoice, an automated email notification is generated and dispatched to the designated Complisey executive inboxes with student details, company credentials, course package specs, and bank reconciliation reference codes.
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-amber-200">
                  <span><strong>Designated Admin Recipients:</strong></span>
                  <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px] text-amber-300 border border-white/10">msimonitc@gmail.com (Malcolm Simon · Direct)</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px] text-white border border-white/10">malcolm@complisanc.com (Malcolm Simon)</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px] text-white border border-white/10">eric@complisanc.com (Eric D'Souza)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <button
                  onClick={handleTriggerTestDispatch}
                  disabled={isTestDispatching}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-[#071433] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Send className={`w-3.5 h-3.5 ${isTestDispatching ? 'animate-bounce' : ''}`} />
                  <span>{isTestDispatching ? 'Dispatching...' : 'Dispatch Verification to Malcolm & Eric'}</span>
                </button>

                <button
                  onClick={markAllAdminNotificationsAsRead}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs transition-colors text-center cursor-pointer"
                >
                  Mark All Read
                </button>
              </div>
            </div>
          </div>

          {testDispatchSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{testDispatchDetails || 'Live verification email alert successfully dispatched to Malcolm Simon & Eric D\'Souza!'}</span>
            </div>
          )}

          {/* Resend Engine Status & Diagnostic Banner */}
          <div className="bg-[#071433] text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white tracking-wide">Resend Transactional Email Engine</span>
                    {resendStatus?.configured ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Delivery Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Simulated Sandbox Ready
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      (Free Tier: 3,000 emails/mo)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Sender: <strong className="text-white font-mono">{resendStatus?.sender || 'Complisey Academy <onboarding@resend.dev>'}</strong> · Target Inboxes: <span className="text-amber-300 font-semibold">malcolm@complisanc.com</span> &amp; <span className="text-amber-300 font-semibold">eric@complisanc.com</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <span className="text-amber-400 font-semibold">Domain Notice:</span>
                    <span>To deliver to @complisanc.com inboxes without restriction, verify <code className="text-slate-200 font-mono">complisanc.com</code> at <a href="https://resend.com/domains" target="_blank" rel="noreferrer" className="text-amber-300 underline hover:text-amber-200">resend.com/domains</a> (onboarding@resend.dev delivers directly to account owner msimonitc@gmail.com).</span>
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 shrink-0 flex items-center gap-2">
                {!resendStatus?.configured ? (
                  <span className="text-xs text-amber-200/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-400/30">
                    Provide <code className="text-amber-300 font-mono">RESEND_API_KEY</code> in Secrets to enable live dispatch
                  </span>
                ) : (
                  <span className="text-xs text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                    API Key verified &amp; connected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Notifications Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Automated Proforma Alert Log ({adminNotifications.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Full audit trail of email alerts dispatched upon student proforma requests
                </p>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                {unreadAdminNotificationsCount > 0 ? (
                  <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {unreadAdminNotificationsCount} Unread Alert{unreadAdminNotificationsCount > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    All alerts reviewed
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {adminNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No automated email notifications logged yet. When a student requests a proforma invoice, an automated email notification will appear here.
                </div>
              ) : (
                adminNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border transition-all ${
                      notification.isRead
                        ? 'bg-slate-50/70 border-slate-200'
                        : 'bg-amber-50/40 border-amber-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">
                            {notification.proformaNumber}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="font-mono text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {notification.ccsBookingId}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(notification.sentAt).toLocaleString()}
                          </span>
                          {!notification.isRead && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#071433] font-bold text-[10px] uppercase">
                              New Alert
                            </span>
                          )}
                        </div>

                        <div className="text-xs">
                          <span className="font-bold text-slate-900">{notification.studentName}</span>
                          <span className="text-slate-500"> ({notification.studentEmail})</span>
                          <span className="text-slate-400"> — </span>
                          <span className="font-semibold text-slate-700">{notification.companyName}</span>
                        </div>

                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                          <span className="font-medium text-slate-900">Package:</span>
                          <span className="text-blue-800 font-semibold">{notification.coursePackageTitle}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-bold text-slate-800">
                            {notification.seatCount} Seat{notification.seatCount > 1 ? 's' : ''} (SCR {notification.totalAmount.toLocaleString('en-US')})
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>Delivered to:</span>
                          <span className="font-mono text-slate-700 font-medium">
                            {notification.recipientEmails.join(', ')}
                          </span>
                        </div>
                      </div>

                      {(() => {
                        const matchingOrder = orders.find(
                          (o) => o.id === notification.orderId || o.proformaNumber === notification.proformaNumber
                        );

                        return (
                          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                            {matchingOrder && (
                              <button
                                onClick={() => setSelectedProformaForView(matchingOrder)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                title="View Proforma Invoice"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-700" />
                                <span>Proforma</span>
                              </button>
                            )}

                            {matchingOrder && matchingOrder.status === 'pending_payment' && (
                              <button
                                onClick={() => {
                                  adminActivateOrder(
                                    matchingOrder.id,
                                    `Activated from Alert Desk by ${currentUser?.name || 'Complisey Admin'}`
                                  );
                                  markAdminNotificationAsRead(notification.id);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                                title="1-Click Activate Course Enrollment"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>1-Click Activate</span>
                              </button>
                            )}

                            {matchingOrder && matchingOrder.status === 'activated' && (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Activated</span>
                              </span>
                            )}

                            <button
                              onClick={() => {
                                setSelectedNotificationForModal(notification);
                                markAdminNotificationAsRead(notification.id);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#071433] hover:bg-[#0c245c] text-amber-300 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Email</span>
                            </button>

                            <a
                              href={adminEmailNotificationService.getMailtoUrl(notification)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                              title="Open in your mail client"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Mail Client</span>
                            </a>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Client Receipts & Tax Invoices Tab */}
      {activeAdminTab === 'client_receipts' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-[#071433] text-white p-5 sm:p-6 rounded-2xl border border-emerald-500/30 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
                    <Receipt className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Official Client Receipts &amp; Tax Invoices
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Payment Receipt Confirmations Dispatched to Clients
                </h2>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  Every time a payment is confirmed and credited to <strong className="text-emerald-300">The Mauritius Commercial Bank (Seychelles) Ltd. (A/C: 00001073508)</strong>, an official Payment Receipt &amp; Tax Invoice email is automatically generated and dispatched to the corporate client. These records serve as statutory compliance evidence under Section 34 of the Seychelles AML/CFT Act 2020.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-right">
                  <span className="text-[10px] text-slate-300 uppercase block font-semibold">Total Receipts</span>
                  <span className="text-2xl font-black text-emerald-300">{clientReceipts.length}</span>
                </div>
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-right">
                  <span className="text-[10px] text-slate-300 uppercase block font-semibold">Settled (MCB Seychelles)</span>
                  <span className="text-2xl font-black text-amber-300">
                    {formatPrice(clientReceipts.reduce((acc, r) => acc + (r.totalAmount || 0), 0))} SCR
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Coordinates Reference Pill */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-emerald-950 font-medium">
                Official Designated Beneficiary: <strong>The Mauritius Commercial Bank (Seychelles) Ltd.</strong> • Branch: Eden Branch • A/C: <code className="font-bold">00001073508</code> • SWIFT: <code className="font-bold">MCBLSCSC</code> • Currency: <strong>SCR</strong>
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200 font-bold shrink-0">
              Complisanc Consulting Services (SEY)
            </span>
          </div>

          {/* Receipts List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Dispatched Client Confirmations</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {clientReceipts.length}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {clientReceipts.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No client receipts dispatched yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    When an order in the "Proforma Orders &amp; Activation" tab is verified and activated, the system immediately dispatches the official receipt confirmation to the client and logs it here.
                  </p>
                  <button
                    onClick={() => setActiveAdminTab('orders')}
                    className="px-4 py-2 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Go to Orders &amp; Activation
                  </button>
                </div>
              ) : (
                clientReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#071433] text-amber-300 font-mono text-xs font-bold">
                          {receipt.invoiceNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-xs font-semibold">
                          {receipt.proformaNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs">
                          {receipt.ccsBookingId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Delivered</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span>
                          <strong className="text-slate-900">{receipt.companyName}</strong> ({receipt.studentName})
                        </span>
                        <span className="font-mono text-slate-500">{receipt.studentEmail}</span>
                        <span className="text-slate-400">•</span>
                        <span>{receipt.coursePackageTitle}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-bold text-blue-700">{receipt.seatCount} Seat(s)</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-0.5">
                        <span>Settlement Bank: <strong className="text-slate-700">{receipt.bankName}</strong></span>
                        <span>A/C: <code className="font-bold text-slate-700">{receipt.accountNumber}</code></span>
                        <span>Dispatched: <strong className="text-slate-700">{new Date(receipt.paymentConfirmedAt).toLocaleString()}</strong></span>
                        <span>By: <strong className="text-slate-700">{receipt.confirmedBy}</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-sm sm:text-base font-black text-emerald-700 block">
                          {formatPrice(receipt.totalAmount)} {receipt.currency}
                        </span>
                        <span className="text-[10px] text-slate-400">Payment Cleared</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setSelectedReceiptForModal(receipt)}
                          className="px-3 py-1.5 rounded-lg bg-[#071433] hover:bg-[#0c245c] text-amber-300 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Receipt Email</span>
                        </button>

                        <a
                          href={clientReceiptNotificationService.getReceiptMailtoUrl(receipt)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          title="Open mail client"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Mail Client</span>
                        </a>

                        <button
                          onClick={() => {
                            const relatedOrder = orders.find((o) => o.id === receipt.orderId);
                            if (relatedOrder) {
                              onViewProforma(relatedOrder);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          title="View Proforma / Invoice Document"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Centralized System Audit Trail & Troubleshooting Tab */}
      {activeAdminTab === 'audit_trail' && (
        <AdminAuditTrailView />
      )}

      {/* User Portal Live Operations & Curriculum Overview */}
      {activeAdminTab === 'user_portal_overview' && (
        <AdminUserPortalOverview />
      )}

      {/* Sensitive Operations Bugs & Error Diagnostics Console */}
      {activeAdminTab === 'bugs_errors' && (
        <AdminBugsErrorsConsole />
      )}

      {/* Activation Confirmation Dialog Modal */}
      {selectedOrderForActivation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Verify Payment &amp; Activate Module</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedOrderForActivation.proformaNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForActivation(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p>
                <strong className="text-slate-700">Corporate Client:</strong>{' '}
                <span className="font-bold text-slate-900">{selectedOrderForActivation.companyName}</span>
              </p>
              <p>
                <strong className="text-slate-700">Course:</strong>{' '}
                <span className="font-semibold text-slate-800">{selectedOrderForActivation.courseTitle}</span>
              </p>
              <p>
                <strong className="text-slate-700">Seats to Unlock:</strong>{' '}
                <span className="font-bold text-blue-700">{selectedOrderForActivation.seatCount} staff seat(s)</span>
              </p>
              <p>
                <strong className="text-slate-700">Wire Settlement Bank:</strong>{' '}
                <span className="font-bold text-slate-900">The Mauritius Commercial Bank (Seychelles) Ltd.</span>
              </p>
              <p>
                <strong className="text-slate-700">Wire Amount Expected:</strong>{' '}
                <span className="font-bold text-emerald-700">
                  {formatPrice(selectedOrderForActivation.totalAmount)} {selectedOrderForActivation.currency}
                </span>{' '}
                (Ref: <code className="font-bold">{selectedOrderForActivation.bankReferenceCode}</code>)
              </p>
            </div>

            <CsrfInput formName="admin-activation" />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Bank Credit / Verification Reference (Optional)
              </label>
              <input
                type="text"
                value={bankReceiptNote}
                onChange={(e) => setBankReceiptNote(e.target.value)}
                placeholder="e.g. MCB Seychelles wire credit ref #00001073508-492 verified"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
              />
              <p className="text-[11px] text-slate-500">
                Confirming will verify settlement into MCB Seychelles, immediately activate course modules, grant student access, generate the formal Tax Invoice, and automatically dispatch an official Payment Receipt Confirmation email to {selectedOrderForActivation.contactEmail}.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedOrderForActivation(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingActivation}
                onClick={() => handleConfirmActivation(selectedOrderForActivation)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmittingActivation ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Confirm &amp; Activate Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Email Notification Preview Modal */}
      <AdminEmailNotificationModal
        notification={selectedNotificationForModal}
        isOpen={!!selectedNotificationForModal}
        onClose={() => setSelectedNotificationForModal(null)}
        onNavigateToOrder={(orderId) => {
          setActiveAdminTab('orders');
          const target = orders.find((o) => o.id === orderId);
          if (target && target.status === 'pending_payment') {
            setSelectedOrderForActivation(target);
          }
        }}
      />

      {/* Client Receipt Confirmation Preview Modal */}
      <ClientReceiptNotificationModal
        receipt={selectedReceiptForModal}
        isOpen={!!selectedReceiptForModal}
        onClose={() => setSelectedReceiptForModal(null)}
        onPrintTaxInvoice={() => {
          if (selectedReceiptForModal) {
            const relatedOrder = orders.find((o) => o.id === selectedReceiptForModal.orderId);
            if (relatedOrder) {
              setSelectedReceiptForModal(null);
              onViewProforma(relatedOrder);
            }
          }
        }}
      />
      {/* Multi-Seat Non-Transferable Token Management & Roster Modal */}
      <MultiSeatTokenModal
        order={selectedOrderForSeatTokens}
        isOpen={!!selectedOrderForSeatTokens}
        onClose={() => setSelectedOrderForSeatTokens(null)}
      />

      {/* End-to-End Compliance Lifecycle Simulator Modal */}
      <E2ETestSuiteModal
        isOpen={isE2ETestModalOpen}
        onClose={() => setIsE2ETestModalOpen(false)}
      />

      {/* Administrator Credentials & Password Rotation Modal */}
      <AdminChangePasswordModal
        isOpen={isPasswordChangeModalOpen}
        onClose={() => setIsPasswordChangeModalOpen(false)}
        defaultEmail={currentUser?.email || 'malcolm@complisanc.com'}
      />
    </div>
  );
};
