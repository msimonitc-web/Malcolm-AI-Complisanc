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
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const BillingView: React.FC = () => {
  const {
    transactions,
    orders,
    setSelectedTransactionForReceipt,
    setSelectedProformaForView,
    formatPrice,
    setActiveTab,
    currency,
  } = useAcademy();

  const [activeSubTab, setActiveSubTab] = useState<'proforma' | 'paid'>('proforma');

  const pendingCount = orders.filter((o) => o.status === 'pending_payment').length;

  return (
    <div className="space-y-6 pb-12 font-['IBM_Plex_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Corporate Invoices, Bank Transfers &amp; Receipts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Complisanc Consulting Services (SEY) trading as Complisey · Official Proforma Invoices and training expense records for Seychelles reporting entities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('admin')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#071433] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Activation Desk</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#071433] text-amber-300 text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>
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
            <span className="text-[11px] text-emerald-600 font-medium">● Nouvobanq &amp; MCB Direct Transfer</span>
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
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'proforma'
              ? 'bg-[#071433] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Proforma Invoices &amp; Wire Orders ({orders.length})</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#071433] text-[10px] font-black">
              {pendingCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('paid')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'paid'
              ? 'bg-[#071433] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Official Paid Tax Invoices ({transactions.length})</span>
        </button>
      </div>

      {/* Proforma Invoices Table */}
      {activeSubTab === 'proforma' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Corporate Proforma Invoices for Bank Remittance
              </h3>
              <p className="text-xs text-slate-500">
                Instruct your accounts team to remit funds to our Seychelles accounts quoting the wire reference.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {orders.length} Proforma{orders.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.map((ord) => (
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
                      Seats: <strong className="text-blue-700">{ord.seatCount} Seat(s)</strong> (All 6 Catalogue Courses)
                    </span>
                    <span>·</span>
                    <span>
                      CCS Booking ID: <code className="font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{ord.ccsBookingId || ord.bankReferenceCode}</code>
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
                    className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white hover:border-[#071433] text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Proforma</span>
                  </button>

                  {ord.status === 'pending_payment' && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      title="Activate in Admin Desk"
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Admin Activate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
              {transactions.length} Recorded Invoice{transactions.length === 1 ? '' : 's'}
            </span>
          </div>

          {transactions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
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
                        Payment: {tx.paymentMethodDetails.brand || 'Bank Transfer (Nouvobanq)'}
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
                      className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white hover:border-[#071433] text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>View Receipt</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No completed transactions found yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
