import React, { useState } from 'react';
import {
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
  Building2,
  User,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
  Clock,
  HelpCircle,
  CreditCard,
  Send,
  ExternalLink,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    cartEnrollmentType,
    setCartEnrollmentType,
    removeFromCart,
    updateCartItemSeats,
    clearCart,
    cartItemsCount,
    cartTotalSeats,
    cartTotalSCR,
    cartTotalUSD,
    cartSavingsSCR,
    checkoutCart,
    addToCart,
    setActiveTab,
    orders,
    setSelectedOrderForPayment,
    setSelectedProformaForView,
    formatPrice,
    currentUser,
  } = useAcademy();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  const userEmail = currentUser?.email?.trim().toLowerCase();
  const userCompany = currentUser?.companyName?.trim().toLowerCase();

  const pendingOrders = !currentUser
    ? []
    : currentUser.role === 'admin'
    ? orders.filter((o) => o.status === 'pending_payment')
    : orders.filter((o) => {
        if (o.status !== 'pending_payment') return false;
        if (currentUser.role === 'corporate') {
          const isCompany = Boolean(
            userCompany &&
            userCompany !== 'individual learner' &&
            o.companyName?.trim().toLowerCase() === userCompany
          );
          const isEmail = Boolean(userEmail && o.contactEmail?.trim().toLowerCase() === userEmail);
          return isCompany || isEmail;
        }
        return Boolean(userEmail && o.contactEmail?.trim().toLowerCase() === userEmail);
      });

  // Checkout form fields - pre-fill from currentUser if available
  const [contactName, setContactName] = useState(() => currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(() => currentUser?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [companyName, setCompanyName] = useState(() => currentUser?.companyName && currentUser.companyName !== 'Individual Learner' ? currentUser.companyName : '');
  const [companyAddress, setCompanyAddress] = useState('');
  const [industrySector, setIndustrySector] = useState('Corporate Service Provider (CSP / Trust)');
  const [notes, setNotes] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with currentUser when cart opens
  React.useEffect(() => {
    if (isCartOpen && currentUser) {
      if (!contactName && currentUser.name) setContactName(currentUser.name);
      if (!contactEmail && currentUser.email) setContactEmail(currentUser.email);
      if (!companyName && currentUser.companyName && currentUser.companyName !== 'Individual Learner') {
        setCompanyName(currentUser.companyName);
      }
    }
  }, [isCartOpen, currentUser]);

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!contactName.trim()) {
      setFormError('Please enter the contact person name.');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setFormError('Please enter a valid work/student email address.');
      return;
    }
    if (cartEnrollmentType === 'corporate' && !companyName.trim()) {
      setFormError('Please enter the Reporting Entity / Company Name.');
      return;
    }
    if (!agreedTerms) {
      setFormError('Please accept the bank remittance and statutory terms to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      checkoutCart({
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim().toLowerCase(),
        contactPhone: contactPhone.trim(),
        companyName: cartEnrollmentType === 'corporate' ? companyName.trim() : 'Individual Learner',
        companyAddress: companyAddress.trim() || 'Victoria, Mahé, Republic of Seychelles',
        industrySector: cartEnrollmentType === 'corporate' ? industrySector : undefined,
        notes: notes.trim(),
        isCorporate: cartEnrollmentType === 'corporate',
      });
      setStep('cart');
    } catch (err: any) {
      setFormError(err?.message || 'An unexpected error occurred during proforma generation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPackageBadgeColor = (type: string) => {
    switch (type) {
      case 'pack':
      case 'both':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'level1':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'level2':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl z-10 flex flex-col h-full overflow-hidden border-l border-slate-200">
        {/* Drawer Header */}
        <div className="bg-[#071433] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">Checkout Cart</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-[#071433]">
                  {cartItemsCount} {cartItemsCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Seychelles AML/CFT Statutory Training Booking
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enrollment Tier Selector Bar */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-700 pl-1">Enrollment Tier:</span>
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              onClick={() => setCartEnrollmentType('individual')}
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                cartEnrollmentType === 'individual'
                  ? 'bg-[#071433] text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Individual</span>
            </button>
            <button
              onClick={() => setCartEnrollmentType('corporate')}
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                cartEnrollmentType === 'corporate'
                  ? 'bg-[#071433] text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Corporate (Volume)</span>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Active Orders Awaiting Payment */}
          {pendingOrders.length > 0 && (
            <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-900 tracking-wider">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Pending Invoice Awaiting Payment ({pendingOrders.length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab('billing');
                  }}
                  className="text-[11px] font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>All Invoices</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {pendingOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 bg-white border border-amber-200/90 rounded-lg shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-blue-950 block">
                          {ord.proformaNumber}
                        </span>
                        <div className="text-xs font-bold text-slate-900 line-clamp-1">
                          {ord.courseTitle}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {ord.contactName} {ord.companyName && ord.companyName !== 'Individual Learner' && `(${ord.companyName})`}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-amber-900 block font-['Space_Grotesk']">
                          {formatPrice(ord.totalAmount)} {ord.currency}
                        </span>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {ord.remittanceSubmitted ? 'Wire Remitted' : 'Payment Due'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCartOpen(false);
                          setSelectedOrderForPayment(ord);
                        }}
                        className="py-2 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Online (Card)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsCartOpen(false);
                          setSelectedProformaForView(ord);
                        }}
                        className="py-2 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-blue-700" />
                        <span>Bank Wire Info</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cartItemsCount === 0 ? (
            /* Empty State */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="max-w-xs mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {pendingOrders.length > 0 ? 'No additional items in cart' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pendingOrders.length > 0
                    ? 'Your previous registration has been converted into a pending booking proforma above.'
                    : 'Add full curriculum packages or individual modules to generate a consolidated Proforma Invoice.'}
                </p>
              </div>

              {/* Quick Add Recommendations */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2.5 max-w-sm mx-auto">
                <div className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Popular Packages</span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() =>
                      addToCart({
                        courseId: 'pkg-both',
                        courseTitle: 'CompliSey Academy: Complete 6-Course Curriculum Pack',
                        packageType: 'pack',
                        seatCount: cartEnrollmentType === 'corporate' ? 3 : 1,
                        cpdHours: 12,
                        modulesCount: 6,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-amber-200 bg-white hover:border-amber-400 text-left flex items-center justify-between group transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#071433]">
                        Complete 6-Course Pack
                      </div>
                      <div className="text-[11px] text-slate-500">
                        12 CPD · Levels 1 &amp; 2 All Modules
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      SCR 2,500
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      addToCart({
                        courseId: 'pkg-level-1',
                        courseTitle: 'CompliSey Academy: Level 1 Statutory Foundations',
                        packageType: 'level1',
                        seatCount: cartEnrollmentType === 'corporate' ? 3 : 1,
                        cpdHours: 6,
                        modulesCount: 3,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 text-left flex items-center justify-between group transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                        Level 1 Statutory Foundations
                      </div>
                      <div className="text-[11px] text-slate-500">6 CPD · Courses 1, 2, 3</div>
                    </div>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      SCR 1,250
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      addToCart({
                        courseId: 'pkg-level-2',
                        courseTitle: 'CompliSey Academy: Level 2 Advanced Operations',
                        packageType: 'level2',
                        seatCount: cartEnrollmentType === 'corporate' ? 3 : 1,
                        cpdHours: 6,
                        modulesCount: 3,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 text-left flex items-center justify-between group transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                        Level 2 Advanced Operations
                      </div>
                      <div className="text-[11px] text-slate-500">6 CPD · Courses 4, 5, 6</div>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      SCR 1,500
                    </span>
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveTab('courses');
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                  >
                    Browse full course catalogue &rarr;
                  </button>
                </div>
              </div>
            </div>
          ) : step === 'cart' ? (
            /* Items List View */
            <div className="space-y-3.5">
              {/* Volume Discount Notice if Corporate */}
              {cartEnrollmentType === 'corporate' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-blue-950">Corporate Volume Tier Applied: </span>
                    <span className="text-blue-800">
                      {cartTotalSeats <= 5
                        ? 'Tier 1–5 Seats (Save up to SCR 250/seat)'
                        : cartTotalSeats <= 10
                        ? 'Tier 6–10 Seats (Save up to SCR 450/seat)'
                        : cartTotalSeats <= 20
                        ? 'Tier 11–20 Seats (Save up to SCR 650/seat)'
                        : 'Tier 21+ Seats (Maximum Enterprise Rate - Save up to SCR 850/seat)'}
                    </span>
                    {cartSavingsSCR > 0 && (
                      <div className="font-black text-emerald-700 mt-1">
                        Total Corporate Savings: SCR {cartSavingsSCR.toLocaleString()} vs individual retail rates!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Items Card List */}
              <div className="space-y-2.5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-3.5 hover:border-slate-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold border mb-1 uppercase tracking-wider ${getPackageBadgeColor(
                            item.packageType
                          )}`}
                        >
                          {item.packageType === 'pack' || item.packageType === 'both'
                            ? 'Complete Pack (12 CPD)'
                            : item.packageType === 'level1'
                            ? 'Level 1 Foundations (6 CPD)'
                            : item.packageType === 'level2'
                            ? 'Level 2 Operations (6 CPD)'
                            : 'Specialist Course'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.courseTitle}
                        </h4>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove from Cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Seat Adjustment (if corporate) & Line Price */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
                      {cartEnrollmentType === 'corporate' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-600">Seats:</span>
                          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() => updateCartItemSeats(item.id, item.seatCount - 1)}
                              disabled={item.seatCount <= 1}
                              className="p-1 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Decrease seats"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={500}
                              value={item.seatCount}
                              onChange={(e) =>
                                updateCartItemSeats(item.id, parseInt(e.target.value) || 1)
                              }
                              className="w-12 text-center text-xs font-black text-slate-900 bg-white border-x border-slate-300 py-1 focus:outline-hidden"
                            />
                            <button
                              onClick={() => updateCartItemSeats(item.id, item.seatCount + 1)}
                              className="p-1 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Increase seats"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500 font-medium">
                          1 Learner Seat · 12-Month Access
                        </div>
                      )}

                      <div className="text-right">
                        <div className="text-xs font-black text-[#071433]">
                          SCR {item.totalPrice.toLocaleString()}
                        </div>
                        {item.seatCount > 1 && (
                          <div className="text-[10px] text-slate-500">
                            SCR {item.unitPrice.toLocaleString()} / seat
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add more button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveTab('courses');
                }}
                className="w-full py-2 border border-dashed border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More Courses / Packages</span>
              </button>

              {/* Cart Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Enrolment Seats:</span>
                  <span className="font-bold text-slate-900">{cartTotalSeats}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Settlement Currency:</span>
                  <span className="font-bold text-slate-900">Seychelles Rupees (SCR)</span>
                </div>
                {cartSavingsSCR > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-bold">
                    <span>Corporate Volume Discount:</span>
                    <span>- SCR {cartSavingsSCR.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-black text-slate-900">Total Amount Due:</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#071433]">
                      SCR {cartTotalSCR.toLocaleString()}
                    </span>
                    <div className="text-[10px] text-slate-500">
                      Approx. USD ${cartTotalUSD.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Checkout Details Form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                >
                  &larr; Back to Item List
                </button>
                <span className="text-xs font-bold text-slate-500">
                  Consolidated Proforma Invoice
                </span>
              </div>

              {formError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Order Summary Snapshot */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-950">
                    {cartItemsCount} Selected Package(s) · {cartTotalSeats} Seat(s)
                  </div>
                  <div className="text-[11px] text-amber-800">
                    Official Seychelles Bank Wire Settlement
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-[#071433]">
                    SCR {cartTotalSCR.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Organization Info if Corporate */}
              {cartEnrollmentType === 'corporate' && (
                <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>Reporting Entity Credentials</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Entity / Corporate Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Corporate Services (Seychelles) Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#071433]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Regulated Sector
                    </label>
                    <select
                      value={industrySector}
                      onChange={(e) => setIndustrySector(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#071433]"
                    >
                      <option value="Corporate Service Provider (CSP / Trust)">
                        Corporate &amp; Trust Service Provider (CSP)
                      </option>
                      <option value="Banking & Offshore Finance">
                        Banking &amp; Offshore Finance
                      </option>
                      <option value="Virtual Asset Service Provider (VASP)">
                        Virtual Asset Service Provider (VASP)
                      </option>
                      <option value="Securities, Brokerage & Funds">
                        Securities, Brokerage &amp; Funds
                      </option>
                      <option value="Gaming & Casino Operators">
                        Gaming &amp; Casino Operators
                      </option>
                      <option value="Legal & Accounting Firms">Legal &amp; Accounting Firms</option>
                      <option value="Real Estate & High-Value Goods">
                        Real Estate &amp; High-Value Goods
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Office / Postal Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suite 201, Premier Building, Victoria, Mahé"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#071433]"
                    />
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {cartEnrollmentType === 'corporate'
                      ? 'Authorized Contact / HR / Compliance Officer'
                      : 'Learner Contact Details'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marie-Claire Savy"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#071433]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. compliance@entity.sc"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#071433]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+248 2xxxxxx"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#071433]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Invoicing Notes / PO Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PO-2026-Q1 or Attn: Finance Department"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#071433]"
                  />
                </div>
              </div>

              {/* Compliance & Remittance Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cart-terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#071433] focus:ring-[#071433]"
                />
                <label htmlFor="cart-terms" className="text-[11px] text-slate-600 leading-snug">
                  I understand that generating this Proforma Invoice creates a statutory booking.
                  Remittance is payable via advance bank wire to Complisey’s account in Mahé,
                  Seychelles. Seats will be activated upon ledger verification.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#071433] hover:bg-[#0c245c] text-amber-300 hover:text-amber-200 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Proforma Invoice...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>
                      Generate Proforma Invoice · SCR {cartTotalSCR.toLocaleString()}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Drawer Footer (when in cart step) */}
        {cartItemsCount > 0 && step === 'cart' && (
          <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={clearCart}
                className="text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cart</span>
              </button>

              <div className="text-right">
                <span className="text-[11px] text-slate-500">Payable: </span>
                <span className="font-black text-slate-900 text-sm">
                  SCR {cartTotalSCR.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep('checkout')}
              className="w-full py-3 bg-[#071433] hover:bg-[#0c245c] text-amber-300 hover:text-amber-200 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>Proceed to Proforma Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Professional AML/CFT Training Academy · Direct Seychelles Bank Wire</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
