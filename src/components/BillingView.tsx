import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Lock,
  Plus,
  ArrowUpRight,
  KeyRound,
  Users,
  Building,
  Building2,
  Clock,
  FileText,
  Eye,
  ArrowRight,
  LifeBuoy,
  AlertCircle,
  User,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const BillingView: React.FC = () => {
  const {
    transactions,
    orders,
    currentUser,
    setSelectedTransactionForReceipt,
    setSelectedProformaForView,
    setSelectedOrderForPayment,
    formatPrice,
    setActiveTab,
    currency,
    setIsSupportModalOpen,
  } = useAcademy();

  const [activeSubTab, setActiveSubTab] = useState<'proforma' | 'paid'>('proforma');

  // Gated Access: Only authenticated registered sessions can view invoices & payments
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center font-['IBM_Plex_Sans'] space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 mx-auto flex items-center justify-center border border-amber-300 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-[#071433]" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 border border-amber-300 px-3 py-1 rounded-full inline-block">
            Access Restricted · Registration Required
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Invoices, Bank Wires &amp; Receipts
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            In compliance with Seychelles statutory reporting and financial record confidentiality standards, official Proforma Invoices, MCB Seychelles bank remittance instructions, and paid tax receipts are private documents restricted to registered individual compliance candidates and licensed corporate reporting entities.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-left space-y-4 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            How to Access Your Account's Invoices:
          </h4>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>New Candidate / Corporate Entity:</strong> Complete registration on the courses page to instantly generate your accredited learner/corporate session and view your official proforma quotation.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Existing Candidate:</strong> Click <em>Learner / Corporate Sign In</em> in the top navigation using your registered email address to view all historical invoices and certificates.
              </span>
            </li>
          </ul>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2"
            >
              <span>Go to Course Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-slate-600" />
              <span>Contact Malcolm Simon / Support</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userEmail = currentUser.email.trim().toLowerCase();
  const userCompany = currentUser.companyName?.trim().toLowerCase();
  const isAdmin = currentUser.role === 'admin';
  const isCorporate = currentUser.role === 'corporate';

  // Strict isolation of orders based on authenticated role and entity identity
  const scopedOrders = orders.filter((o) => {
    if (isAdmin) return true;
    const isEmail = Boolean(o.contactEmail && o.contactEmail.trim().toLowerCase() === userEmail);
    if (isCorporate) {
      const isCompany = Boolean(
        userCompany &&
        userCompany !== 'individual learner' &&
        o.companyName?.trim().toLowerCase() === userCompany
      );
      return isEmail || isCompany;
    }
    return isEmail;
  });

  // Strict isolation of transactions based on authenticated role and entity identity
  const scopedTransactions = transactions.filter((tx) => {
    if (isAdmin) return true;
    const payerEmail = tx.paymentMethodDetails?.payerEmail?.trim().toLowerCase();
    const isEmail = Boolean(payerEmail && payerEmail === userEmail);
    if (isCorporate) {
      const isCompany = Boolean(
        userCompany &&
        userCompany !== 'individual learner' &&
        (tx.companyName?.trim().toLowerCase() === userCompany ||
         tx.courseTitle?.toLowerCase().includes(userCompany) ||
         tx.paymentMethodDetails?.brand?.toLowerCase().includes(userCompany))
      );
      return isEmail || isCompany;
    }
    return isEmail;
  });

  const pendingCount = scopedOrders.filter((o) => o.status === 'pending_payment').length;

  return (
    <div className="space-y-6 pb-12 font-['IBM_Plex_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              isAdmin
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : isCorporate
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}>
              {isAdmin
                ? 'Back Office Oversight · All Reporting Entities'
                : isCorporate
                ? `Corporate Account · ${currentUser.companyName}`
                : `Individual Candidate · ${currentUser.name}`}
            </span>
            {currentUser.sessionId && (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Session: {currentUser.sessionId.substring(0, 14)}...
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {isAdmin
              ? 'Complisey Central Billing, Wires & Receipts'
              : isCorporate
              ? `Corporate Invoices & Bank Wires — ${currentUser.companyName}`
              : `My Training Invoices & Receipts`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAdmin
              ? 'Complisanc Consulting Services (SEY) trading as Complisey · Master ledger for Seychelles licensed entities, direct wires, and student billing.'
              : isCorporate
              ? `Official Proforma Invoices and statutory training records registered for ${currentUser.companyName}.`
              : `Official Seychelles proforma quotations and payment receipts issued to ${currentUser.name} (${currentUser.email}).`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <LifeBuoy className="w-4 h-4 text-amber-400" />
            <span>Support &amp; Wire Help</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#071433] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Activation Desk</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#071433] text-amber-300 text-[10px] font-black">
                  {pendingCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Gateway & Bank Transfer Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-sm shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Payment Flow
            </span>
            <h4 className="text-sm font-bold text-slate-900">Seychelles Bank Wire (Proforma)</h4>
            <span className="text-[11px] text-emerald-600 font-medium">● MCB Seychelles Direct Transfer</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-extrabold text-sm">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Direct Bank Gateway
            </span>
            <h4 className="text-sm font-bold text-slate-900">Seychelles Bank Merchant API</h4>
            <span className="text-[11px] text-amber-700 font-medium">● In Technical Sandbox Testing</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
            <Building className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Issuing Entity
            </span>
            <h4 className="text-sm font-bold text-slate-900">Complisanc Consulting (SEY)</h4>
            <span className="text-[11px] text-slate-500 font-medium">Trading as Complisey (Victoria, Mahé)</span>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('proforma')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'proforma'
              ? 'bg-[#071433] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>
            {isCorporate
              ? `Corporate Proformas (${scopedOrders.length})`
              : isAdmin
              ? `All Proforma Invoices (${scopedOrders.length})`
              : `My Proforma Invoices (${scopedOrders.length})`}
          </span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#071433] text-[10px] font-black">
              {pendingCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('paid')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'paid'
              ? 'bg-[#071433] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Official Paid Tax Invoices ({scopedTransactions.length})</span>
        </button>
      </div>

      {/* Proforma Invoices Table */}
      {activeSubTab === 'proforma' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isCorporate
                  ? `Corporate Proforma Invoices — ${currentUser.companyName}`
                  : isAdmin
                  ? 'All Corporate & Individual Proforma Invoices'
                  : 'My Proforma Invoices for Bank Remittance'}
              </h3>
              <p className="text-xs text-slate-500">
                Instruct your accounts department or bank to remit funds quoting the official wire booking reference.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {scopedOrders.length} Proforma{scopedOrders.length === 1 ? '' : 's'}
            </span>
          </div>

          {scopedOrders.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {scopedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {ord.proformaNumber}
                      </span>
                      {ord.status === 'pending_payment' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Awaiting Bank Transfer
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Activated
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                      {ord.courseTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>
                        Entity: <strong className="text-slate-700">{ord.companyName}</strong> ({ord.contactName})
                      </span>
                      <span>·</span>
                      <span>
                        Seats: <strong className="text-blue-700">{ord.seatCount} Seat(s)</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Wire Ref: <code className="font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{ord.ccsBookingId || ord.bankReferenceCode}</code>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-[#071433] font-['Space_Grotesk']">
                        {formatPrice(ord.totalAmount)}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">{ord.currency}</span>
                    </div>

                    <button
                      onClick={() => setSelectedProformaForView(ord)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white hover:border-[#071433] text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Proforma</span>
                    </button>

                    {ord.status === 'pending_payment' && (
                      <button
                        onClick={() => setSelectedOrderForPayment(ord)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Online (Card)</span>
                      </button>
                    )}

                    {isAdmin && ord.status === 'pending_payment' && (
                      <button
                        onClick={() => setActiveTab('admin')}
                        title="Activate in Admin Desk"
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-[#0c245c] text-amber-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Admin Activate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                No Proforma Invoices Found
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isCorporate
                  ? `No pending proforma invoices are currently registered for ${currentUser.companyName}.`
                  : `No pending proforma invoices registered for ${currentUser.email}.`}
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="mt-2 px-4 py-2 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Browse Course Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Paid Tax Invoices Table */}
      {activeSubTab === 'paid' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#071433]" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Official Paid Tax Invoices &amp; Receipts
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {scopedTransactions.length} Recorded Invoice{scopedTransactions.length === 1 ? '' : 's'}
            </span>
          </div>

          {scopedTransactions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {scopedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {tx.invoiceNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                        {tx.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                      {tx.courseTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="capitalize">
                        Payment: {tx.paymentMethodDetails.brand || 'Bank Transfer (MCB Seychelles)'}
                      </span>
                      {tx.couponApplied && (
                        <span className="text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
                          Discount: {tx.couponApplied} (-{formatPrice(tx.discountAmount || 0)})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-[#071433] font-['Space_Grotesk']">
                        {formatPrice(tx.amount)}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">{tx.currency}</span>
                    </div>

                    <button
                      onClick={() => setSelectedTransactionForReceipt(tx)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white hover:border-[#071433] text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>View Receipt</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                No Paid Invoices Recorded Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When your wire remittance or online payment is settled and verified, your official tax receipt and certificate activations will appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
