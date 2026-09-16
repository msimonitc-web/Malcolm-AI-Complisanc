import React, { useState } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAcademy } from '../context/AcademyContext';
import { EnrollmentOrder } from '../types';
import { CompliseyLogo } from './CompliseyLogo';

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
  } = useAcademy();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_payment' | 'activated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForActivation, setSelectedOrderForActivation] = useState<EnrollmentOrder | null>(null);
  const [bankReceiptNote, setBankReceiptNote] = useState('');
  const [isSubmittingActivation, setIsSubmittingActivation] = useState(false);
  const [activationSuccessMsg, setActivationSuccessMsg] = useState<string | null>(null);

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

  const handleConfirmActivation = (order: EnrollmentOrder) => {
    setIsSubmittingActivation(true);
    setTimeout(() => {
      adminActivateOrder(order.id, bankReceiptNote || 'Confirmed via Seychelles Bank Account credit');
      setIsSubmittingActivation(false);
      setSelectedOrderForActivation(null);
      setBankReceiptNote('');
      setActivationSuccessMsg(`Order ${order.proformaNumber} for ${order.companyName} has been successfully activated! The course seats are now active.`);

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setActivationSuccessMsg(null);
      }, 5000);
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
              Inspect incoming bank wire transfers from Seychelles fiduciaries and corporate reporting entities, verify funds received at Nouvobanq / MCB Seychelles, and activate staff training modules.
            </p>
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

      {/* Success notification banner */}
      {activationSuccessMsg && (
        <div className="p-4 bg-emerald-500 text-white rounded-xl shadow-md flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{activationSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActivationSuccessMsg(null)}
            className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

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
                        {order.seatCount} {order.seatCount === 1 ? 'Seat' : 'Seats'} (All 6 Catalogue Courses)
                      </div>
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
                          onClick={() => onViewProforma(order)}
                          title="View Official Proforma Invoice"
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
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
                          <button
                            onClick={() => openCoursePlayer(order.courseId)}
                            title="Open Course Player for this module"
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                          >
                            <span>Enter Course</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                <strong className="text-slate-700">Wire Amount Expected:</strong>{' '}
                <span className="font-bold text-emerald-700">
                  {formatPrice(selectedOrderForActivation.totalAmount)} {selectedOrderForActivation.currency}
                </span>{' '}
                (Ref: <code className="font-bold">{selectedOrderForActivation.bankReferenceCode}</code>)
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Bank Credit / Verification Reference (Optional)
              </label>
              <input
                type="text"
                value={bankReceiptNote}
                onChange={(e) => setBankReceiptNote(e.target.value)}
                placeholder="e.g. Nouvobanq credit #TXN-88210 verified"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
              />
              <p className="text-[11px] text-slate-500">
                Confirming will immediately activate course modules, grant student access, and generate the formal Tax Invoice.
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
    </div>
  );
};
