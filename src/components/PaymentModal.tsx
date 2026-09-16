import React, { useState } from 'react';
import {
  X,
  Building2,
  Users,
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building,
  Sparkles,
  Info,
  Lock,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAcademy } from '../context/AcademyContext';
import { PaymentGatewayType } from '../types';
import { CompliseyLogo } from './CompliseyLogo';
import { SEYCHELLES_BANK_ACCOUNTS } from '../data/bankingDetails';
import { calculateOrderTotalSCR, SEAT_PRICING_SCHEDULE, formatSCR } from '../utils/pricing';

export const PaymentModal: React.FC = () => {
  const {
    selectedCourseForCheckout,
    setSelectedCourseForCheckout,
    createProformaOrder,
    setSelectedProformaForView,
    formatPrice,
    currency,
    setActiveLegalModal,
    setActiveTab,
  } = useAcademy();

  if (!selectedCourseForCheckout) return null;

  const course = selectedCourseForCheckout;

  // Default to bank_transfer since Stripe is not available in Seychelles
  const [gateway, setGateway] = useState<PaymentGatewayType>('bank_transfer');
  const [enrollmentType, setEnrollmentType] = useState<'corporate' | 'individual'>('corporate');
  const [seatCount, setSeatCount] = useState<number>(3);
  const [companyName, setCompanyName] = useState('Victoria Fiduciary Services Ltd');
  const [companyAddress, setCompanyAddress] = useState('Premier Building, Albert Street, Victoria, Mahé, Seychelles');
  const [contactName, setContactName] = useState('Marcus Delpech');
  const [contactEmail, setContactEmail] = useState('m.delpech@fiduciary-sey.sc');
  const [contactPhone, setContactPhone] = useState('+248 4 380 000');
  const [orderNotes, setOrderNotes] = useState('');

  // Promo code handling
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountRate?: number; flatDiscount?: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bank account details for selected currency (Nouvobanq Seychelles Rupee account primary)
  const bankInfo = SEYCHELLES_BANK_ACCOUNTS[currency] || SEYCHELLES_BANK_ACCOUNTS.SCR;

  // Seat pricing calculation based on official exclusive bands in SCR
  const isCorporate = enrollmentType === 'corporate';
  const effectiveSeatCount = isCorporate ? Math.max(1, seatCount) : 1;
  const pricingCalc = calculateOrderTotalSCR(effectiveSeatCount, isCorporate);

  const rawSubtotal = pricingCalc.totalSCR;

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountRate) {
      discountAmount = Math.round(rawSubtotal * appliedPromo.discountRate);
    } else if (appliedPromo.flatDiscount) {
      discountAmount = Math.min(rawSubtotal, appliedPromo.flatDiscount);
    }
  }
  const finalPrice = Math.max(0, Math.round(rawSubtotal - discountAmount));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();

    if (code === 'COMPLISEY20' || code === 'ACADEMY20') {
      setAppliedPromo({ code, discountRate: 0.2 });
      setPromoInput('');
    } else if (code === 'LAUNCH50' || code === 'FSA50') {
      setAppliedPromo({ code, discountRate: 0.5 });
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try COMPLISEY20 for corporate discount!');
    }
  };

  const handleGenerateProforma = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createProformaOrder({
        courseId: course.id,
        seatCount: effectiveSeatCount,
        isCorporate,
        companyName: isCorporate ? (companyName.trim() || 'Corporate Reporting Entity') : (contactName.trim() || 'Individual Learner'),
        companyAddress: companyAddress.trim(),
        contactName: contactName.trim() || 'Compliance Officer',
        contactEmail: contactEmail.trim() || 'compliance@reporting-entity.sc',
        contactPhone: contactPhone.trim(),
        notes: orderNotes.trim(),
      });

      setIsSubmitting(false);
      setSelectedCourseForCheckout(null);
      setSelectedProformaForView(newOrder);

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#071433]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-['IBM_Plex_Sans']">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shadow-xs">
              <CompliseyLogo className="w-full h-full" cColor="#071433" ankhColor="#d9a438" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Corporate Enrollment &amp; Proforma Invoice
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Complisanc Consulting Services (SEY) · Seychelles Direct Bank Wire
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCourseForCheckout(null)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {/* Method Selection Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => setGateway('bank_transfer')}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                gateway === 'bank_transfer'
                  ? 'border-[#071433] bg-[#071433]/5 ring-1 ring-[#071433]'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">Direct Bank Wire (Proforma)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  Active in Seychelles
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Official Proforma Invoice issued for corporate remitting. Course activated upon receipt of wire transfer.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setGateway('direct_bank_online')}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                gateway === 'direct_bank_online'
                  ? 'border-blue-700 bg-blue-50/50 ring-1 ring-blue-700'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-bold text-slate-900">Direct Bank Online Card</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold uppercase">
                  In Bank Integration
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Seychelles local bank merchant acquiring gateway currently completing certification.
              </p>
            </button>
          </div>

          {gateway === 'direct_bank_online' ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3 my-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Local Bank Card Processing Integration</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Direct online merchant card settlement with our domestic Seychelles acquiring bank is undergoing technical sandbox testing. Until final deployment, please use our standard <strong>Proforma Invoice &amp; Bank Transfer</strong> option.
              </p>
              <button
                type="button"
                onClick={() => setGateway('bank_transfer')}
                className="px-4 py-2 rounded-xl bg-[#071433] hover:bg-[#0f2866] text-amber-300 text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <span>Continue with Bank Transfer (Proforma Invoice)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleGenerateProforma}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Left Column: Form & Banking Info */}
                <div className="md:col-span-7 space-y-4">
                  {/* Seat Type & Pricing Bands */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Select Enrollment Tier (12-Month Prepaid Access)
                      </label>
                      <span className="text-[10px] text-amber-700 font-bold">SCR Pricing</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEnrollmentType('individual');
                          setSeatCount(1);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          enrollmentType === 'individual'
                            ? 'border-[#071433] bg-[#071433] text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-bold">Individual Seat</div>
                        <div className={`text-[11px] ${enrollmentType === 'individual' ? 'text-amber-300' : 'text-slate-500'}`}>
                          SCR 1,000 per seat (1 learner)
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEnrollmentType('corporate');
                          if (seatCount === 1) setSeatCount(3);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          enrollmentType === 'corporate'
                            ? 'border-[#071433] bg-[#071433] text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>Corporate Seats</span>
                          <span className="text-[9px] bg-amber-400 text-[#071433] font-black px-1.5 py-0.2 rounded">Tiered</span>
                        </div>
                        <div className={`text-[11px] ${enrollmentType === 'corporate' ? 'text-amber-300' : 'text-slate-500'}`}>
                          SCR 600 – SCR 900 per seat
                        </div>
                      </button>
                    </div>

                    {/* Seat Count Selection for Corporate */}
                    {isCorporate ? (
                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-slate-700">
                            Number of Staff Seats: <strong className="text-slate-900">{effectiveSeatCount} seats</strong>
                          </span>
                          <span className="text-[10px] text-blue-700 font-semibold">
                            {pricingCalc.bandLabel}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[1, 3, 5, 8, 10, 15, 20, 25, 50].map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => setSeatCount(count)}
                              className={`py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                                seatCount === count
                                  ? 'border-[#071433] bg-[#071433] text-amber-300 font-bold'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {count}
                            </button>
                          ))}
                          <div className="flex items-center gap-1 ml-auto">
                            <span className="text-[11px] text-slate-500">Custom:</span>
                            <input
                              type="number"
                              min={1}
                              max={500}
                              value={seatCount}
                              onChange={(e) => setSeatCount(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-center"
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Official Price Schedule Table */}
                    <div className="pt-2 border-t border-slate-200 text-[11px]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
                        <span>Online Seat Price Schedule</span>
                        <span className="text-slate-400 font-normal">Seat bands are exclusive</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 text-[10px] text-center">
                        <div className={`p-1.5 rounded border ${!isCorporate ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                          <div>Individual</div>
                          <div className="font-mono font-bold text-slate-900">SCR 1,000</div>
                        </div>
                        <div className={`p-1.5 rounded border ${isCorporate && effectiveSeatCount <= 5 ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                          <div>Corp 1–5</div>
                          <div className="font-mono font-bold text-slate-900">SCR 900</div>
                        </div>
                        <div className={`p-1.5 rounded border ${isCorporate && effectiveSeatCount >= 6 && effectiveSeatCount <= 10 ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                          <div>Corp 6–10</div>
                          <div className="font-mono font-bold text-slate-900">SCR 800</div>
                        </div>
                        <div className={`p-1.5 rounded border ${isCorporate && effectiveSeatCount >= 11 && effectiveSeatCount <= 20 ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                          <div>Corp 11–20</div>
                          <div className="font-mono font-bold text-slate-900">SCR 750</div>
                        </div>
                        <div className={`p-1.5 rounded border ${isCorporate && effectiveSeatCount >= 21 ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                          <div>Corp 21+</div>
                          <div className="font-mono font-bold text-slate-900">SCR 600</div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 italic">
                        * Seat bands are exclusive: five seats fall in the 1–5 band. Pay by bank transfer in Seychelles rupees quoting the CCS booking ID.
                      </p>
                    </div>
                  </div>

                  {/* Corporate Entity Details */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {isCorporate ? 'Corporate Billing Details' : 'Learner Billing Details'}
                      </span>
                      <span className="text-[10px] text-slate-500">For Official Proforma Invoice</span>
                    </div>

                    {isCorporate && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Reporting Entity / Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Victoria Fiduciary Services Ltd"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-[#071433]"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Registered Address in Seychelles / Overseas
                      </label>
                      <input
                        type="text"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        placeholder="e.g. Premier Building, Victoria, Mahé, Seychelles"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-[#071433]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isCorporate ? 'Contact Officer / MLRO *' : 'Full Legal Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Marcus Delpech"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-[#071433]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Official Email (For Seat Activation) *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="m.delpech@fiduciary.sc"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-[#071433]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Contact Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+248 4 380 000"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-[#071433]"
                      />
                    </div>
                  </div>

                  {/* Bank Wire Details Snapshot */}
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-blue-950 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-700" />
                        Complisey Bank Coordinates (Seychelles Rupees · SCR)
                      </span>
                      <span className="text-[10px] bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded">
                        SWIFT: {bankInfo.swiftBic}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Bank: <strong className="text-slate-900">{bankInfo.bankName}</strong> · Victoria, Mahé, Seychelles
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      Account Beneficiary: <strong className="text-slate-900">{bankInfo.accountName}</strong>
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      Nouvobanq SCR Account: <strong className="font-mono text-blue-900">{bankInfo.accountNumber}</strong>
                    </p>
                  </div>
                </div>

                {/* Right Column: Order Summary & Action */}
                <div className="md:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      Seat Order Summary
                    </h4>

                    {/* Catalogue Inclusion Highlight */}
                    <div className="p-2.5 rounded-xl bg-blue-900 text-white space-y-1.5 mb-3">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Prepaid 12-Month Seat Package</span>
                      </div>
                      <p className="text-[11px] text-slate-200 leading-snug">
                        Each seat opens the <strong>current catalogue (all six courses)</strong>, unit quizzes, and the 80% exam. A completion certificate is included for each course passed at no extra charge per PDF.
                      </p>
                      <div className="text-[10px] text-amber-200/90 font-medium">
                        * The seat is not a single diploma for the whole catalogue.
                      </div>
                    </div>

                    <div className="py-2.5 space-y-1.5 text-xs border-y border-slate-200">
                      <div className="flex justify-between text-slate-600">
                        <span>Prepaid Seat Tier:</span>
                        <span className="font-semibold text-slate-900">{pricingCalc.bandLabel}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Unit Rate per Seat:</span>
                        <span className="font-mono font-bold text-slate-900">{formatPrice(pricingCalc.ratePerSeat)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Number of Seats:</span>
                        <span>× {effectiveSeatCount}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Discount ({appliedPromo?.code}):</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                    </div>

                    {/* Promo code input */}
                    <div className="pt-2">
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Corporate code..."
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && <p className="text-[10px] text-rose-600 mt-0.5">{promoError}</p>}
                      {appliedPromo && (
                        <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          ✓ Code {appliedPromo.code} applied!
                        </p>
                      )}
                    </div>

                    <div className="pt-3 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-800">Total Due on Wire:</span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-[#071433] font-['Space_Grotesk']">
                          {formatPrice(finalPrice)}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold ml-1">SCR</span>
                      </div>
                    </div>

                    {/* Notice about Administrator Activation */}
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Pay in Full Before Access</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-tight">
                        Pay by bank transfer in Seychelles rupees, quoting the generated CCS booking ID. The administrator will activate full catalogue access once payment is confirmed.
                      </p>
                    </div>

                    <p className="text-[10px] text-slate-500 mt-2 italic">
                      Facilitated in-house workshops are a separate offering and are not sold through this site.
                    </p>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-[#071433] hover:bg-[#0f2866] text-amber-300 font-bold text-xs shadow-md shadow-[#071433]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin" />
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          <span>Generate Proforma Invoice ({formatPrice(finalPrice)})</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[10px] text-slate-400 mt-2">
                      Complisanc Consulting Services (SEY) trading as Complisey ·{' '}
                      <button
                        type="button"
                        onClick={() => setActiveLegalModal('terms')}
                        className="underline hover:text-slate-600 transition-colors"
                      >
                        Terms
                      </button>{' '}
                      &amp;{' '}
                      <button
                        type="button"
                        onClick={() => setActiveLegalModal('privacy')}
                        className="underline hover:text-slate-600 transition-colors"
                      >
                        Privacy
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
