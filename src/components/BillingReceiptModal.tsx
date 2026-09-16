import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { CompliseyLogo } from './CompliseyLogo';

export const BillingReceiptModal: React.FC = () => {
  const { selectedTransactionForReceipt, setSelectedTransactionForReceipt, formatPrice } = useAcademy();

  if (!selectedTransactionForReceipt) return null;

  const tx = selectedTransactionForReceipt;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#071433]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <CompliseyLogo className="w-4 h-4" cColor="#071433" ankhColor="#d9a438" />
            <span>Official CompliSey Tax Invoice & Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={() => setSelectedTransactionForReceipt(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shadow-xs">
                  <CompliseyLogo className="w-full h-full" cColor="#071433" ankhColor="#d9a438" />
                </div>
                <span className="text-lg font-black tracking-tight font-['IBM_Plex_Sans'] text-[#071433]">
                  COMPLISEY ACADEMY
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Complisanc Consulting Services (SEY) trading as Complisey<br />
                Victoria, Mahé, Republic of Seychelles · academy.complisey.com
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle className="w-3.5 h-3.5" />
                PAID IN FULL
              </span>
              <p className="text-xs font-mono text-slate-600 font-bold mt-1">Invoice: {tx.invoiceNumber}</p>
              <p className="text-xs text-slate-500">
                Date: {new Date(tx.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Payment Method & Transaction ID */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 font-medium uppercase tracking-wider block text-[10px]">
                Payment Routing
              </span>
              <span className="font-bold text-slate-900 capitalize">
                {tx.gateway} Gateway ({tx.paymentMethodDetails.brand || 'Digital'} •••• {tx.paymentMethodDetails.last4 || '4242'})
              </span>
              <span className="text-slate-500 block text-[11px] truncate">{tx.paymentMethodDetails.payerEmail || 'compliance@firm.sc'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium uppercase tracking-wider block text-[10px]">
                Transaction Reference
              </span>
              <span className="font-mono text-slate-800 font-semibold truncate block">
                {tx.id}
              </span>
              <span className="text-emerald-600 font-medium text-[11px] flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                Verified & Cleared
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100/70 p-3 font-bold text-slate-700 grid grid-cols-12">
              <span className="col-span-8">Description & Scope</span>
              <span className="col-span-2 text-center">Seats</span>
              <span className="col-span-2 text-right">Amount</span>
            </div>

            <div className="p-3 grid grid-cols-12 items-center border-t border-slate-200">
              <div className="col-span-8">
                <h5 className="font-bold text-slate-900">{tx.courseTitle}</h5>
                <p className="text-[11px] text-slate-500">
                  Twelve-Month Regulated Staff Training Seat · Certificate Included
                </p>
              </div>
              <span className="col-span-2 text-center text-slate-700 font-medium">1</span>
              <span className="col-span-2 text-right font-bold text-slate-900">
                {formatPrice(tx.amount + (tx.discountAmount || 0))}
              </span>
            </div>

            {tx.discountAmount && tx.discountAmount > 0 ? (
              <div className="p-3 grid grid-cols-12 items-center border-t border-slate-100 bg-emerald-50/50 text-emerald-800">
                <span className="col-span-8 font-medium">
                  Corporate Coupon / Voucher ({tx.couponApplied})
                </span>
                <span className="col-span-2 text-center">-</span>
                <span className="col-span-2 text-right font-bold">
                  -{formatPrice(tx.discountAmount)}
                </span>
              </div>
            ) : null}

            <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm">
              <span className="text-slate-800">Total Billed:</span>
              <div className="text-right">
                <span className="text-base text-[#071433] font-['Space_Grotesk'] font-black">
                  {formatPrice(tx.amount)}
                </span>
                <span className="text-xs text-slate-500 ml-1">{tx.currency}</span>
              </div>
            </div>
          </div>

          {/* Compliance Record Footnote */}
          <div className="pt-2 text-center text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
            <p>
              Complisanc Consulting Services (SEY) trading as Complisey.
            </p>
            <p className="text-slate-400 mt-0.5">
              This invoice serves as formal evidence of training expenditure for regulatory inspection under Section 34 of the AML/CFT Act 2020.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={() => setSelectedTransactionForReceipt(null)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#071433] text-amber-300 text-xs font-bold hover:bg-[#0d2763] flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
