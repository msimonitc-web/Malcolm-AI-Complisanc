import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Mail,
  Copy,
  Receipt,
  Send,
  CreditCard,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { CompliseyLogo } from './CompliseyLogo';
import { SEYCHELLES_BANK_ACCOUNTS } from '../data/bankingDetails';
import { EnrollmentOrder, Transaction } from '../types';
import { WatermarkOverlay } from './WatermarkOverlay';

interface ProformaInvoiceModalProps {
  order: EnrollmentOrder | null;
  onClose: () => void;
  onGoToAdmin?: () => void;
}

export const ProformaInvoiceModal: React.FC<ProformaInvoiceModalProps> = ({ order, onClose, onGoToAdmin }) => {
  const {
    formatPrice,
    setActiveTab,
    setIsSupportModalOpen,
    setSelectedTransactionForReceipt,
    setSelectedOrderForPayment,
    transactions,
    sendClientReceiptConfirmationEmail,
  } = useAcademy();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [receiptFeedback, setReceiptFeedback] = useState<string | null>(null);
  const [isSendingReceipt, setIsSendingReceipt] = useState(false);

  if (!order) return null;

  const bankInfo = SEYCHELLES_BANK_ACCOUNTS[order.currency] || SEYCHELLES_BANK_ACCOUNTS.SCR;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleViewReceipt = () => {
    // Find existing transaction or synthesize one
    const foundTx = transactions.find(
      (t) =>
        t.invoiceNumber === order.taxInvoiceNumber ||
        t.paymentMethodDetails?.brand?.includes(order.ccsBookingId) ||
        t.paymentMethodDetails?.brand?.includes(order.bankReferenceCode)
    );

    if (foundTx) {
      setSelectedTransactionForReceipt(foundTx);
    } else {
      const fallbackTx: Transaction = {
        id: `tx_${order.id}`,
        courseId: order.courseId,
        courseTitle: order.courseTitle,
        amount: order.totalAmount,
        currency: order.currency,
        gateway: 'bank_transfer',
        status: 'succeeded',
        createdAt: order.activatedAt || order.createdAt,
        invoiceNumber: order.taxInvoiceNumber || `INV-CS-2026-${order.id.replace(/\D/g, '').padStart(5, '0')}`,
        paymentMethodDetails: {
          brand: `The Mauritius Commercial Bank (Seychelles) Ltd. (A/C: 00001073508) [Ref: ${order.ccsBookingId || order.bankReferenceCode}]`,
          payerEmail: order.contactEmail,
        },
      };
      setSelectedTransactionForReceipt(fallbackTx);
    }
  };

  const handleResendReceipt = async () => {
    setIsSendingReceipt(true);
    setReceiptFeedback(null);
    try {
      await sendClientReceiptConfirmationEmail(order.id);
      setReceiptFeedback(`Receipt confirmation sent to ${order.contactEmail} (CC'd to malcolm@complisanc.com & eric@complisanc.com)`);
      setTimeout(() => setReceiptFeedback(null), 5000);
    } catch (e) {
      setReceiptFeedback('Failed to dispatch receipt email. Please check network connection.');
    } finally {
      setIsSendingReceipt(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
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
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm font-['IBM_Plex_Sans'] relative overflow-hidden">
          <WatermarkOverlay opacity={0.06} />
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

          {/* Automated Admin Notification Dispatched Confirmation */}
          <div className="px-3.5 py-2.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-blue-950">
              <Mail className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>Automated Admin Alert Dispatched:</strong> Details for {order.contactName} ({order.companyName}) and package "{order.courseTitle}" sent to <span className="font-mono font-medium">malcolm@complisanc.com</span> &amp; <span className="font-mono font-medium">eric@complisanc.com</span>.
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              Delivered
            </span>
          </div>

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
                  <th className="p-3">Course / Package Description</th>
                  <th className="p-3 text-center">Seats</th>
                  <th className="p-3 text-right">Unit Rate</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items && order.items.length > 0 ? (
                  order.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-slate-900">
                        {it.courseTitle}
                        <div className="text-[11px] font-normal text-slate-600 mt-1 space-y-0.5">
                          <div>• {it.cpdHours ? `${it.cpdHours} CPD Hours · ` : ''}12-Month Digital LMS Access &amp; Unit Assessments</div>
                          <div>• Formal Certificate of Completion issued per seat on passing (80% pass mark)</div>
                          <div>• Fully aligned with Seychelles AML/CFT Act 2020 (Section 34 statutory staff training)</div>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-800">{it.seatCount}</td>
                      <td className="p-3 text-right text-slate-600">{formatPrice(it.unitPrice)}</td>
                      <td className="p-3 text-right font-bold text-slate-900">{formatPrice(it.totalAmount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">
                      {order.courseTitle || '12-Month Prepaid Seat — Full Catalogue Access (6 Courses)'}
                      <div className="text-[11px] font-normal text-slate-600 mt-1 space-y-0.5">
                        <div>• Opens the current catalogue, unit quizzes, and final statutory exams.</div>
                        <div>• A completion certificate is included for each course passed (no extra charge).</div>
                        <div>• Direct statutory audit documentation under Section 34 of the Seychelles AML/CFT Act 2020.</div>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">{order.seatCount}</td>
                    <td className="p-3 text-right text-slate-600">{formatPrice(order.unitPrice)}</td>
                    <td className="p-3 text-right font-bold text-slate-900">{formatPrice(order.totalAmount)}</td>
                  </tr>
                )}
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
          <div className="p-4 sm:p-5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-blue-950 text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Seychelles Bank Wire Remittance Coordinates</span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-blue-200/80 text-blue-900 self-start sm:self-auto">
                Settlement Currency: {bankInfo.currency} ({bankInfo.currency === 'SCR' ? 'Seychelles Rupees' : bankInfo.currency})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-lg border border-blue-100">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Bank Name</span>
                <strong className="text-slate-900 text-sm block">{bankInfo.bankName}</strong>
                <span className="text-[11px] text-slate-500">{bankInfo.branch}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Account Beneficiary</span>
                <strong className="text-slate-900 text-sm block">{bankInfo.accountName}</strong>
                <span className="text-[11px] text-slate-500">Complisey AML/CFT Training Division</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Account Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-blue-950 text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {bankInfo.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(bankInfo.accountNumber, 'acc')}
                    className="p-1 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedKey === 'acc' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {copiedKey === 'acc' && <span className="text-[10px] font-bold text-emerald-600">Copied</span>}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">SWIFT / BIC Code</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {bankInfo.swiftBic}
                  </span>
                  <button
                    onClick={() => handleCopy(bankInfo.swiftBic, 'swift')}
                    className="p-1 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                    title="Copy SWIFT Code"
                  >
                    {copiedKey === 'swift' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {copiedKey === 'swift' && <span className="text-[10px] font-bold text-emerald-600">Copied</span>}
                </div>
              </div>

              {bankInfo.iban && (
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">IBAN (International Bank Account Number)</span>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="font-mono font-bold text-blue-950 text-xs sm:text-sm bg-blue-50 px-2.5 py-1 rounded border border-blue-200 break-all">
                      {bankInfo.iban}
                    </span>
                    <button
                      onClick={() => handleCopy(bankInfo.iban!, 'iban')}
                      className="p-1 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                      title="Copy IBAN"
                    >
                      {copiedKey === 'iban' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {copiedKey === 'iban' && <span className="text-[10px] font-bold text-emerald-600">Copied</span>}
                  </div>
                </div>
              )}

              {bankInfo.bankAddress && (
                <div className="sm:col-span-2 text-[11px] text-slate-600">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Bank Physical Address</span>
                  <span>{bankInfo.bankAddress}</span>
                </div>
              )}
            </div>

            {/* Payment Reference Banner */}
            <div className="pt-2 border-t border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-blue-950">
                Required Payment Reference / Narration on Bank Transfer:
              </span>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="font-mono font-bold bg-white px-2.5 py-1 rounded border border-blue-300 text-blue-900 text-sm">
                  {order.ccsBookingId || order.bankReferenceCode}
                </span>
                <button
                  onClick={() => handleCopy(order.ccsBookingId || order.bankReferenceCode, 'ref')}
                  className="p-1.5 bg-white border border-blue-200 text-slate-500 hover:text-blue-700 rounded transition-colors"
                  title="Copy Reference"
                >
                  {copiedKey === 'ref' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {copiedKey === 'ref' && <span className="text-[10px] font-bold text-emerald-600">Copied</span>}
              </div>
            </div>
          </div>

          {/* Payment Receipt Confirmation Section (When Activated) */}
          {order.status === 'activated' && (
            <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                    Payment Received &amp; Verified into MCB Seychelles
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  Tax Invoice: {order.taxInvoiceNumber || 'INV-CS-PAID'}
                </span>
              </div>

              <p className="text-xs text-emerald-900">
                Payment of <strong>{formatPrice(order.totalAmount)} {order.currency}</strong> was cleared into The Mauritius Commercial Bank (Seychelles) Ltd. (A/C: 00001073508). An official Receipt Confirmation has been recorded and sent to <strong>{order.contactEmail}</strong>.
              </p>

              {receiptFeedback && (
                <div className="p-2.5 rounded-lg bg-white border border-emerald-300 text-xs text-emerald-900 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{receiptFeedback}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleViewReceipt}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View Official Receipt &amp; Tax Invoice</span>
                </button>

                <button
                  onClick={handleResendReceipt}
                  disabled={isSendingReceipt}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSendingReceipt ? 'Sending...' : 'Resend Receipt Confirmation Email'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Pending Payment Guidance */}
          {order.status === 'pending_payment' && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Automated Receipt Confirmation on Payment Clearance</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Once funds are verified in our account at <strong>The Mauritius Commercial Bank (Seychelles) Ltd.</strong>, Complisey's administrative system will automatically send an official Payment Receipt &amp; Tax Invoice directly to <strong>{order.contactEmail}</strong> with your LMS seat activation token and statutory compliance documentation under Section 34 of the Seychelles AML/CFT Act 2020.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 text-center sm:text-left flex flex-wrap items-center gap-1.5">
            <span>Bank remittance advice:</span>
            <span className="font-mono text-slate-800 font-bold">malcolm@complisanc.com</span>
            <span>&amp;</span>
            <span className="font-mono text-slate-800 font-bold">eric@complisanc.com</span>
            <button
              onClick={() => {
                setIsSupportModalOpen(true);
              }}
              className="ml-1 text-blue-700 hover:text-blue-900 underline font-semibold cursor-pointer inline-flex items-center gap-0.5"
            >
              Wire Process &amp; Support Guidance
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {order.status === 'activated' && (
              <button
                onClick={handleViewReceipt}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>View Receipt</span>
              </button>
            )}
            {order.status === 'pending_payment' && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    setSelectedOrderForPayment(order);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay Online (Card)</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('admin');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#071433] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Admin Desk to Activate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
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
