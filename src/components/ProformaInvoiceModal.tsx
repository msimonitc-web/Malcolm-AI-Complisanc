import React from 'react';
import { X, Printer, Download, Building2, Calendar, FileText, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { CompliseyLogo } from './CompliseyLogo';
import { SEYCHELLES_BANK_ACCOUNTS } from '../data/bankingDetails';
import { EnrollmentOrder } from '../types';

interface ProformaInvoiceModalProps {
  order: EnrollmentOrder | null;
  onClose: () => void;
  onGoToAdmin?: () => void;
}

export const ProformaInvoiceModal: React.FC<ProformaInvoiceModalProps> = ({ order, onClose, onGoToAdmin }) => {
  const { formatPrice, setActiveTab } = useAcademy();

  if (!order) return null;

  const bankInfo = SEYCHELLES_BANK_ACCOUNTS[order.currency] || SEYCHELLES_BANK_ACCOUNTS.USD;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[95vh]">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
              Corporate Proforma Invoice
            </span>
            <span className="text-xs text-slate-300 font-mono hidden sm:inline">{order.proformaNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print Proforma Invoice"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm font-['IBM_Plex_Sans']">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-xs">
                <CompliseyLogo className="w-full h-full" cColor="#071433" ankhColor="#d9a438" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-[#071433]">COMPLISEY ACADEMY</h1>
                <p className="text-[11px] text-slate-500">Complisanc Consulting Services (SEY) trading as Complisey</p>
                <p className="text-[11px] text-slate-500">Victoria, Mahé, Republic of Seychelles · Reg # 842109</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-md bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs uppercase tracking-wider mb-1">
                {order.status === 'activated' ? 'PROFORMA (ACTIVATED)' : 'PROFORMA INVOICE'}
              </span>
              <p className="font-mono text-xs text-slate-700 font-bold">{order.proformaNumber}</p>
              <p className="text-[11px] text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Status Alert Banner */}
          {order.status === 'pending_payment' ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-xs uppercase">
                <Calendar className="w-4 h-4 text-amber-700" />
                Awaiting Seychelles Bank Transfer &amp; Admin Activation
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Pay in full before access. Please instruct your finance department to remit in Seychelles rupees (SCR) quoting the <strong>CCS Booking ID: <span className="font-mono text-blue-900 bg-amber-100 px-1.5 py-0.5 rounded">{order.ccsBookingId || order.bankReferenceCode}</span></strong>.
              </p>
              <p className="text-[11px] text-amber-800 italic">
                Once received, our administrator activates your 12-month prepaid seat(s) directly in the backend module.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Payment Verified &amp; 12-Month Seat Access Activated
              </div>
              <p className="text-xs text-emerald-800">
                This enrollment order was verified and activated on {new Date(order.activatedAt || '').toLocaleDateString()}. Full 6-course catalogue unlocked. Formal Tax Invoice: <strong className="font-mono">{order.taxInvoiceNumber || 'INV-CS-PAID'}</strong>.
              </p>
            </div>
          )}

          {/* Bill To / Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Billed To / Entity</span>
              <p className="font-bold text-slate-900">{order.companyName}</p>
              {order.companyAddress && <p className="text-slate-600 text-xs mt-0.5">{order.companyAddress}</p>}
              <p className="text-slate-600 text-xs mt-1">Attn: {order.contactName} ({order.contactEmail})</p>
              {order.contactPhone && <p className="text-slate-600 text-xs">{order.contactPhone}</p>}
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Order Details</span>
              <p className="text-xs"><strong className="text-slate-700">Access Scope:</strong> 12-Month Prepaid Seat (All 6 Catalogue Courses)</p>
              <p className="text-xs mt-1"><strong className="text-slate-700">Number of Seats:</strong> {order.seatCount} Seat{order.seatCount > 1 ? 's' : ''}</p>
              <p className="text-xs mt-1">
                <strong className="text-slate-700">CCS Booking ID:</strong>{' '}
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  {order.ccsBookingId || order.bankReferenceCode}
                </span>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Prepaid Seat Description</th>
                  <th className="p-3 text-center">Seats</th>
                  <th className="p-3 text-right">Unit Rate</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">
                    12-Month Prepaid Seat — Full Catalogue Access (6 Courses)
                    <div className="text-[11px] font-normal text-slate-600 mt-1 space-y-0.5">
                      <div>• Opens the current catalogue (all six courses), unit quizzes, and the 80% final exam.</div>
                      <div>• A completion certificate is included for each course passed (no extra charge per PDF).</div>
                      <div>• The seat is not a single diploma for the whole catalogue.</div>
                      <div className="text-slate-500 italic">• Facilitated in-house workshops are a separate offering and are not sold through this site.</div>
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-slate-800">{order.seatCount}</td>
                  <td className="p-3 text-right text-slate-600">{formatPrice(order.unitPrice)}</td>
                  <td className="p-3 text-right font-bold text-slate-900">{formatPrice(order.totalAmount)}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={3} className="p-3 text-right text-slate-700">Total Due on Wire (Pay in full before access):</td>
                  <td className="p-3 text-right text-base text-[#071433]">{formatPrice(order.totalAmount)} {order.currency}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Official Seychelles Bank Remittance Coordinates */}
          <div className="p-4 sm:p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-blue-950 text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-blue-700" />
                Seychelles Bank Wire Transfer Instructions (Pay in SCR)
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-200/70 text-blue-900">
                Currency: Seychelles Rupees (SCR)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Bank Name:</span>
                <strong className="text-slate-900">{bankInfo.bankName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Account Beneficiary:</span>
                <strong className="text-slate-900">{bankInfo.accountName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Account Number:</span>
                <strong className="text-blue-900 font-mono text-sm">{bankInfo.accountNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">SWIFT / BIC Code:</span>
                <strong className="text-slate-900 font-mono">{bankInfo.swiftBic}</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Bank Branch &amp; Address:</span>
                <span className="text-slate-700">{bankInfo.branch}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-semibold text-blue-950">Required Payment Reference / Narration on Bank Transfer:</span>
              <span className="font-mono font-bold bg-white px-2.5 py-1 rounded border border-blue-300 text-blue-900">
                {order.ccsBookingId || order.bankReferenceCode}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Questions? Contact accounts desk: <span className="font-mono text-slate-700">finance@complisey.com</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {order.status === 'pending_payment' && (
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('admin');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#071433] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Open Admin Desk to Activate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
