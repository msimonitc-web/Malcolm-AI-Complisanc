import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  CheckCircle2,
  Lock,
  Copy,
  ArrowRight,
  ShieldCheck,
  Send,
  AlertCircle,
  Sparkles,
  Calendar,
  User,
  Clock,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAcademy } from '../context/AcademyContext';
import { SEYCHELLES_BANK_ACCOUNTS } from '../data/bankingDetails';
import { CompliseyLogo } from './CompliseyLogo';

export const InstantPaymentModal: React.FC = () => {
  const {
    selectedOrderForPayment,
    setSelectedOrderForPayment,
    formatPrice,
    processOnlineOrderPayment,
    submitWireRemittance,
    setSelectedProformaForView,
    setActiveTab,
  } = useAcademy();

  const [activeTabMode, setActiveTabMode] = useState<'card' | 'bank_wire'>('card');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Card Form State
  const [cardholderName, setCardholderName] = useState(selectedOrderForPayment?.contactName || 'Malcolm Simon');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessingCard, setIsProcessingCard] = useState(false);
  const [cardSuccess, setCardSuccess] = useState(false);

  // Bank Wire Remittance Form State
  const [remitBank, setRemitBank] = useState('The Mauritius Commercial Bank (Seychelles) Ltd.');
  const [remitRef, setRemitRef] = useState('');
  const [remitDate, setRemitDate] = useState(new Date().toISOString().split('T')[0]);
  const [remitNotes, setRemitNotes] = useState('');
  const [isSubmittingRemit, setIsSubmittingRemit] = useState(false);
  const [remitSuccess, setRemitSuccess] = useState(false);

  if (!selectedOrderForPayment) return null;

  const order = selectedOrderForPayment;
  const bankInfo = SEYCHELLES_BANK_ACCOUNTS[order.currency] || SEYCHELLES_BANK_ACCOUNTS.SCR;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleQuickFillCard = () => {
    setCardholderName(order.contactName || 'Malcolm Simon');
    setCardNumber('4532 •••• •••• 8824');
    setExpiryDate('08/28');
    setCvv('712');
  };

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingCard(true);

    setTimeout(() => {
      processOnlineOrderPayment(order.id, {
        cardBrand: 'Visa Secure',
        last4: cardNumber.slice(-4) || '8824',
        cardholderName: cardholderName.trim() || order.contactName,
      });

      setIsProcessingCard(false);
      setCardSuccess(true);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }, 900);
  };

  const handleRemittanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remitRef.trim()) return;

    setIsSubmittingRemit(true);
    setTimeout(() => {
      submitWireRemittance(order.id, {
        bankName: remitBank,
        referenceNumber: remitRef.trim(),
        remittanceDate: remitDate,
        senderNotes: remitNotes.trim(),
      });
      setIsSubmittingRemit(false);
      setRemitSuccess(true);
    }, 600);
  };

  const handleClose = () => {
    setSelectedOrderForPayment(null);
    setCardSuccess(false);
    setRemitSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#071433]/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-['IBM_Plex_Sans']">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shadow-xs">
              <CompliseyLogo className="w-full h-full" cColor="#071433" ankhColor="#d9a438" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Complete Enrollment Payment
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="font-mono font-bold text-blue-900">{order.proformaNumber}</span>
                <span>·</span>
                <span>Ref: <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[11px] font-bold text-slate-800">{order.ccsBookingId || order.bankReferenceCode}</code></span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div className="bg-[#071433] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div>
            <span className="text-slate-300 block text-[11px]">Enrolled Learner / Entity:</span>
            <span className="font-bold text-white text-sm">{order.contactName}</span>
            <span className="text-amber-300 ml-1">({order.companyName})</span>
          </div>
          <div className="text-right">
            <span className="text-slate-300 block text-[11px]">Total Payable:</span>
            <span className="text-lg font-black text-amber-300 font-['Space_Grotesk']">
              {formatPrice(order.totalAmount)} {order.currency}
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTabMode('card');
              setRemitSuccess(false);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTabMode === 'card'
                ? 'bg-white text-[#071433] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Online Card Payment (Instant Access)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTabMode('bank_wire');
              setCardSuccess(false);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTabMode === 'bank_wire'
                ? 'bg-white text-[#071433] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Bank Wire Remittance Advice</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Card Success View */}
          {cardSuccess && (
            <div className="py-8 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-xl font-black text-slate-900">
                  Payment Verified &amp; Enrollment Activated!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your payment of <strong>{formatPrice(order.totalAmount)} {order.currency}</strong> has been cleared. An official Seychelles Tax Invoice &amp; Payment Receipt has been dispatched to <strong>{order.contactEmail}</strong> and courses are unlocked on your account.
                </p>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveTab('dashboard');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>Go to My Compliance Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setSelectedProformaForView(order);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <span>View Official Invoice &amp; Receipt</span>
                </button>
              </div>
            </div>
          )}

          {/* Wire Remit Success View */}
          {remitSuccess && (
            <div className="py-8 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-800 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-xl font-black text-slate-900">
                  Wire Remittance Advice Submitted!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thank you, <strong>{order.contactName}</strong>. Your remittance notice for reference <code className="font-bold text-blue-950 bg-blue-50 px-1 py-0.5 rounded border border-blue-200">{remitRef}</code> has been dispatched directly to Complisey Back Office administrators (Malcolm Simon &amp; Eric D'Souza). Once credited into MCB Seychelles, your LMS access will be activated immediately.
                </p>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveTab('billing');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>View Orders &amp; Invoices Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Card Form */}
          {!cardSuccess && !remitSuccess && activeTabMode === 'card' && (
            <form onSubmit={handleCardPayment} className="space-y-4">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-0.5">
                  <span className="font-bold block">Instant Automated Course Unlock</span>
                  <span className="text-emerald-800">
                    Visa and Mastercard payments are processed with Level 1 PCI-DSS encryption. Your 6-course curriculum and CPD transcripts unlock immediately upon transaction confirmation.
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cardholder Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="e.g. Malcolm Simon"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Card Number
                    </label>
                    <button
                      type="button"
                      onClick={handleQuickFillCard}
                      className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Quick Test Fill</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8824"
                      className="w-full px-3 py-2 pl-9 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Security Code (CVV)
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 pl-8 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>256-Bit SSL Encrypted Sandbox Gateway</span>
                </span>

                <button
                  type="submit"
                  disabled={isProcessingCard}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingCard ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Pay {formatPrice(order.totalAmount)} {order.currency} &amp; Unlock</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Bank Wire Remittance Form */}
          {!cardSuccess && !remitSuccess && activeTabMode === 'bank_wire' && (
            <div className="space-y-4">
              {/* Bank Account Wire Information Card */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Official Remittance Account (Seychelles)
                  </span>
                  <span className="text-[11px] text-blue-700 font-semibold">Local &amp; International Clearing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Bank &amp; Branch</span>
                    <strong className="text-slate-800 text-xs">{bankInfo.bankName}</strong>
                    <div className="text-[11px] text-slate-500">{bankInfo.branch}</div>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Account Number</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-mono font-bold text-slate-900 text-xs">{bankInfo.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankInfo.accountNumber, 'acc')}
                        className="text-blue-700 hover:text-blue-900 p-0.5"
                        title="Copy Account"
                      >
                        {copiedKey === 'acc' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">SWIFT / BIC Code</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {bankInfo.swiftCode || bankInfo.swiftBic || 'MCBLSCSC'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankInfo.swiftCode || bankInfo.swiftBic || 'MCBLSCSC', 'swift')}
                        className="text-blue-700 hover:text-blue-900 p-0.5"
                        title="Copy SWIFT"
                      >
                        {copiedKey === 'swift' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-amber-800 font-bold uppercase block">Required Payment Narration</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-mono font-black text-amber-950 text-xs">
                        {order.ccsBookingId || order.bankReferenceCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.ccsBookingId || order.bankReferenceCode, 'ref')}
                        className="text-amber-800 hover:text-amber-950 p-0.5"
                        title="Copy Reference"
                      >
                        {copiedKey === 'ref' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remittance Notification Form */}
              <form onSubmit={handleRemittanceSubmit} className="space-y-3 pt-1">
                <div className="border-t border-slate-200 pt-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Submit Remittance Advice (Notify Complisey Accounts)
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    If you have already wired the funds from MCB Seychelles or another financial institution, submit your transfer transaction code below for priority clearance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Remitting Financial Institution
                    </label>
                    <select
                      value={remitBank}
                      onChange={(e) => setRemitBank(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                    >
                      <option value="The Mauritius Commercial Bank (Seychelles) Ltd.">The Mauritius Commercial Bank (MCB)</option>
                      <option value="Absa Bank (Seychelles) Ltd.">Absa Bank Seychelles</option>
                      <option value="Al Salam Bank Seychelles">Al Salam Bank</option>
                      <option value="International Wire (SWIFT Transfer)">International / Overseas Wire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bank Transaction / Transfer Reference *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MCB-TRF-98214 or SIMB-4819"
                      value={remitRef}
                      onChange={(e) => setRemitRef(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Transfer
                    </label>
                    <input
                      type="date"
                      value={remitDate}
                      onChange={(e) => setRemitDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sender Notes / Reference Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remitted from Malcolm Simon personal account"
                      value={remitNotes}
                      onChange={(e) => setRemitNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      setSelectedProformaForView(order);
                    }}
                    className="text-xs text-blue-700 hover:text-blue-900 underline font-semibold cursor-pointer"
                  >
                    View Official Printable Proforma PDF
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingRemit}
                    className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-amber-300 text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingRemit ? 'Submitting...' : 'Submit Remittance Advice'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
