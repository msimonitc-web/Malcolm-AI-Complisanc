import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Users,
  Layers,
  FileText,
  AlertCircle,
  Copy,
  Download,
  Mail,
  Check,
  Sparkles,
  Lock,
  ExternalLink,
  LifeBuoy,
  ShoppingCart,
  Video,
  Film,
  CreditCard,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { Course, EnrollmentOrder } from '../types';
import { CourseFaqSection } from './CourseFaqSection';
import { CorporateSeatCalculator } from './CorporateSeatCalculator';
import { useCsrf, CsrfInput } from '../context/CsrfContext';
import { calculateOrderTotalSCR, SEAT_PRICING_SCHEDULE, CoursePackageType } from '../utils/pricing';
import { BANKING_DETAILS, SEYCHELLES_BANK_ACCOUNTS } from '../data/bankingDetails';

export const CourseDashboard: React.FC = () => {
  const {
    student,
    currentUser,
    courses,
    enrolledProgress,
    isCourseUnlocked,
    openCoursePlayer,
    isCourseCompleted,
    getCourseProgressPercentage,
    certificates,
    setSelectedCertificateForView,
    setActiveTab,
    formatPrice,
    createProformaOrder,
    orders,
    setActiveLegalModal,
    setSelectedProformaForView,
    setSelectedOrderForPayment,
    addToCart,
    setIsCartOpen,
    cart,
    setIsRegistrationWizardOpen,
    setIsMarketingStudioOpen,
  } = useAcademy();

  const { csrfToken, submitProtectedForm } = useCsrf();

  // Registration Form State - Default to unselected so users make an intentional choice
  const [regType, setRegType] = useState<'individual' | 'corporate' | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'level1' | 'level2' | 'both' | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('Victoria, Mahé, Seychelles');
  const [industrySector, setIndustrySector] = useState('Corporate & Trust Service Provider (CSP)');
  const [seatCount, setSeatCount] = useState<number>(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<EnrollmentOrder | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  // Group Courses into Level 1 and Level 2
  const level1Courses = courses.slice(0, 3);
  const level2Courses = courses.slice(3, 6);

  // Enrolled courses for logged-in students who have registered and paid
  const enrolledCourseList = courses.filter((c) => isCourseUnlocked(c.id));

  // Price calculations based on centralized Seat Price Schedule
  const calculatePricing = (pkgOverride?: 'both' | 'level1' | 'level2') => {
    const isCorporate = regType === 'corporate';
    const effectiveSeats = isCorporate ? Math.max(1, seatCount) : 1;
    const activePkg = pkgOverride || selectedPackage || 'both';
    const mappedPkg: CoursePackageType = activePkg === 'both' ? 'pack' : activePkg;
    const pricingCalc = calculateOrderTotalSCR(effectiveSeats, isCorporate, mappedPkg);

    const ratePerSeat = pricingCalc.ratePerSeat;
    const totalSCR = pricingCalc.totalSCR;
    const totalUSD = Math.round(totalSCR / 14.5);

    return {
      ratePerSeat,
      effectiveSeats,
      totalSCR,
      totalUSD,
      bandLabel: pricingCalc.bandLabel,
      isCorporate,
      packageType: activePkg,
    };
  };

  const pricing = calculatePricing();
  const packPricing = calculatePricing('both');
  const level1Pricing = calculatePricing('level1');
  const level2Pricing = calculatePricing('level2');

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!regType) {
      setFormError('Please select whether you are enrolling as an Individual Learner or Corporate / Regulated Firm in Step 1.');
      return;
    }

    if (!selectedPackage) {
      setFormError('Please choose a Course Curriculum Package in Step 2.');
      return;
    }

    if (!fullName.trim()) {
      setFormError('Please enter the full contact name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (regType === 'corporate' && !companyName.trim()) {
      setFormError('Please enter your organization / firm name.');
      return;
    }

    if (!agreedToTerms) {
      setFormError('You must acknowledge and accept the Privacy Policy and Terms & Conditions to proceed with registration.');
      return;
    }

    setIsSubmitting(true);

    try {
      const packageTitle =
        selectedPackage === 'both'
          ? 'CompliSey Academy: Complete Professional Curriculum Pack (Levels 1 & 2 - All 6 Modules)'
          : selectedPackage === 'level1'
          ? 'CompliSey Academy: Level 1 Statutory Foundations (Modules 1, 2 & 3)'
          : 'CompliSey Academy: Level 2 Advanced Operational Compliance (Modules 4, 5 & 6)';

      const notes = `Package: ${selectedPackage.toUpperCase()} | Sector: ${regType === 'corporate' ? industrySector : 'Individual'} | Registration Type: ${regType.toUpperCase()}`;

      const newOrder = createProformaOrder({
        courseId: selectedPackage === 'both' ? 'full-catalogue-bundle' : selectedPackage === 'level1' ? 'level1-bundle' : 'level2-bundle',
        seatCount: pricing.effectiveSeats,
        companyName: regType === 'individual' ? 'Individual Learner' : companyName.trim(),
        companyAddress: regType === 'individual' ? 'Victoria, Mahé, Seychelles' : companyAddress,
        contactName: fullName.trim(),
        contactEmail: email.trim().toLowerCase(),
        contactPhone: phone.trim() || '+248 2500000',
        notes,
        isCorporate: regType === 'corporate',
        packageType: selectedPackage === 'both' ? 'pack' : selectedPackage,
      });

      // Submit CSRF protected telemetry
      try {
        await submitProtectedForm('/api/orders/register', {
          orderId: newOrder.id,
          proformaNumber: newOrder.proformaNumber,
          email: email.trim(),
          _csrf: csrfToken,
        });
      } catch (err) {
        console.warn('Order saved locally; CSRF recorded:', err);
      }

      setCompletedOrder(newOrder);
      setIsSubmitting(false);

      // Scroll to confirmation
      setTimeout(() => {
        const el = document.getElementById('order-confirmation-card');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setIsSubmitting(false);
      setFormError(err?.message || 'An error occurred during registration. Please try again.');
    }
  };

  const handleCopyBankDetails = () => {
    const text = `Beneficiary: ${BANKING_DETAILS.accountName}\nBank: ${BANKING_DETAILS.bankName}\nBranch: ${BANKING_DETAILS.branch}\nAccount Number: ${BANKING_DETAILS.accountNumber}\nIBAN: ${BANKING_DETAILS.iban || 'SC32MCBL06070000000001073508SCR'}\nSWIFT / BIC: ${BANKING_DETAILS.swiftBic}\nCurrency: SCR\nOrder Reference: ${completedOrder?.proformaNumber || completedOrder?.ccsBookingId || 'CompliSey Registration'}`;
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 3000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Active Pending Registration Alert Banner */}
      {(() => {
        // Restrict visibility strictly to registered sessions
        if (!currentUser || !currentUser.email) return null;

        const userEmail = currentUser.email.trim().toLowerCase();
        const userCompany = currentUser.companyName?.trim().toLowerCase();

        const myPendingOrder = orders.find((o) => {
          if (o.status !== 'pending_payment') return false;
          if (currentUser.role === 'admin') return true;

          const isEmail = o.contactEmail?.trim().toLowerCase() === userEmail;
          if (currentUser.role === 'corporate') {
            const isCompany = Boolean(
              userCompany &&
              userCompany !== 'individual learner' &&
              o.companyName?.trim().toLowerCase() === userCompany
            );
            return isEmail || isCompany;
          }

          return isEmail;
        });

        if (!myPendingOrder) return null;

        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#071433] via-[#091b42] to-[#0e2761] text-white border border-amber-400/40 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-[#071433] flex items-center justify-center font-black shrink-0 shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                    Registration Received — Awaiting Payment
                  </span>
                  <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded text-amber-200 border border-white/15">
                    {myPendingOrder.proformaNumber}
                  </span>
                  {myPendingOrder.remittanceSubmitted ? (
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                      Wire Remittance Advice Submitted
                    </span>
                  ) : (
                    <span className="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-bold">
                      Pending Settlement
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {myPendingOrder.contactName} · {myPendingOrder.courseTitle}
                </h3>
                <p className="text-xs text-slate-300">
                  Amount: <strong className="text-amber-300 font-['Space_Grotesk'] text-sm">{formatPrice(myPendingOrder.totalAmount)} {myPendingOrder.currency}</strong> · Quotation Ref: <code className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">{myPendingOrder.ccsBookingId || myPendingOrder.bankReferenceCode}</code>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <button
                type="button"
                onClick={() => setSelectedOrderForPayment(myPendingOrder)}
                className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Online (Card)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProformaForView(myPendingOrder)}
                className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
              >
                <Building2 className="w-4 h-4 text-amber-300" />
                <span>Bank Wire Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('billing')}
                className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Invoices</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Malcolm & Eric Administrator Notice Banner */}
      {currentUser?.role === 'admin' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#071433] flex items-center justify-center font-bold shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                Logged in as CompliSey Administrator ({currentUser.name})
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                You have administrative privileges. Verify incoming payment slips and activate student courses and corporate seats.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('admin')}
            className="px-4 py-2 rounded-xl bg-[#071433] text-amber-300 hover:bg-[#0c245c] text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
          >
            Open Admin Desk
          </button>
        </div>
      )}

      {/* Logged-In Student Quick Resume Card (if enrolled in any courses) */}
      {currentUser && enrolledCourseList.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#071433] text-white border border-[#14326d] shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                Active Training Seat
              </span>
              <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
                Welcome back, {currentUser.name.split(' ')[0]}
              </h2>
              <p className="text-xs text-slate-300">
                You have {enrolledCourseList.length} active course module{enrolledCourseList.length > 1 ? 's' : ''} in your compliance curriculum.
              </p>
            </div>
            {certificates.length > 0 && (
              <button
                onClick={() => setActiveTab('certificates')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-semibold border border-amber-400/30 transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View {certificates.length} Certificate{certificates.length > 1 ? 's' : ''}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {enrolledCourseList.map((course) => {
              const pct = getCourseProgressPercentage(course.id);
              const isDone = isCourseCompleted(course.id);
              return (
                <div
                  key={course.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{course.level}</span>
                      <span className="font-bold text-amber-400">{pct}%</span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 mb-2">
                      {course.title}
                    </h4>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => openCoursePlayer(course.id)}
                    className="w-full py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isDone ? 'Review Module' : pct > 0 ? 'Resume Study' : 'Start Course'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Website Introduction / Hero Section */}
      <section className="bg-gradient-to-br from-[#071433] via-[#0d2252] to-[#071433] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#17326e] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Seychelles AML/CFT Compliance Training Academy · Regulated Reporting Entities</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-['IBM_Plex_Sans'] leading-tight">
            Compli<span className="text-amber-400">Sey</span> Academy
          </h1>

          <p className="text-base sm:text-lg font-medium text-slate-200 leading-relaxed">
            Specialized anti-money laundering and countering the financing of terrorism (AML/CFT) staff training curriculum designed for reporting entities, compliance professionals, and financial institutions in Seychelles.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Operated by <strong className="text-white">Complisanc Consulting Services (SEY)</strong> under the leadership of <strong className="text-white">Malcolm Simon</strong> and <strong className="text-white">Eric D'Souza</strong>. Our curriculum delivers practical AML/CFT training structured to cater for regulated training standards across Corporate &amp; Trust Service Providers (CSPs), Commercial &amp; Offshore Banks, Fund Managers, Securities Dealers, Virtual Asset Service Providers (VASPs), Accountants, and Legal Practitioners in the Republic of Seychelles.
          </p>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Compliance Alignment</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Structured to cater for modern compliance standards and annual staff training requirements.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Two-Tier Curriculum</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Level 1 Foundations (3 Modules) and Level 2 Advanced Operations (3 Modules).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Audit Certificates</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Digital tamper-evident certificates with verifiable QR codes for regulatory inspection files.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Corporate Seats</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Firm-wide seat management for MLROs to monitor staff progress, quiz scores, and pass rates.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#registration-section"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Register for Courses (Individual or Corporate)</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setIsRegistrationWizardOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Video className="w-4 h-4 text-amber-400" />
              <span>How to Register (Video &amp; Guide)</span>
            </button>

            <a
              href="#level-1-section"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all cursor-pointer"
            >
              Explore Course Descriptions
            </a>
          </div>
        </div>
      </section>

      {/* 4-Step Commercial Workflow: From Registration to Verifiable Certificate */}
      <section className="bg-white dark:bg-[#0c1936] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            Streamlined Enrollment Process
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1.5">
            How It Works: 4 Simple Steps to Regulated Compliance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            CompliSey makes statutory AML/CFT training seamless for individuals and corporate compliance teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-3 shadow-xs">
              01
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
              Select Curriculum
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Choose Level 1 Foundations (6 CPD), Level 2 Advanced (6 CPD), or the Combined 12 CPD Pack.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 relative">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-[#071433] font-black text-xs flex items-center justify-center mb-3 shadow-xs">
              02
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
              Register Seats
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Book for a single compliance officer or bulk seats for your entire institution with volume discounts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center mb-3 shadow-xs">
              03
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
              Proforma Invoice &amp; Settle
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive your official Seychelles Proforma Invoice instantly and settle via MCB wire transfer or card.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 relative">
            <div className="w-8 h-8 rounded-lg bg-[#071433] dark:bg-amber-400 text-amber-300 dark:text-[#071433] font-black text-xs flex items-center justify-center mb-3 shadow-xs">
              04
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
              Train &amp; Certify
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Redeem tokens, complete modules, and download verifiable CPD certificates for your inspection audit file.
            </p>
          </div>
        </div>
      </section>

      {/* LEVEL 1: Course Descriptions (All 3 Modules) */}
      <section id="level-1-section" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
              Level 1 Curriculum · 6 CPD Hours
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              LEVEL 1: Statutory Foundations &amp; AML/CFT Core Controls
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Comprehensive foundational modules covering money laundering typologies, terrorist financing mechanisms, and the Seychelles legal reporting framework.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedPackage('level1');
              const el = document.getElementById('registration-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="self-start md:self-auto px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Register for Level 1 (Full Access Seat)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {level1Courses.map((course, idx) => (
            <div
              key={course.id}
              className="bg-white dark:bg-[#0c1936] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Course {idx + 1}</span>
                  <div className="flex items-center gap-1.5">
                    {!isCourseUnlocked(course.id) ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300/40">
                        <Lock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                        <span>Locked · Payment Required</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300/40">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Active</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {course.totalHours || 3}h
                    </span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {course.shortDescription || course.description}
                </p>

                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-3 mb-4">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Core Curriculum Modules ({course.modules?.length || 0} Units · {course.lessonsCount || 0} Lessons):
                  </div>
                  {course.modules?.map((mod, mIdx) => (
                    <div key={mod.id || mIdx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold shrink-0">{idx + 1}.{mIdx + 1}</span>
                      <span className="line-clamp-1">{mod.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    2 CPD Points · Final Assessment
                  </span>
                  {isCourseUnlocked(course.id) ? (
                    <button
                      onClick={() => openCoursePlayer(course.id)}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Study Now</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedPackage('level1');
                        const el = document.getElementById('registration-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>Register to Unlock</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LEVEL 2: Course Descriptions (All 3 Modules) */}
      <section id="level-2-section" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              Level 2 Curriculum · 6 CPD Hours
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              LEVEL 2: Advanced Operational Practice, Sanctions &amp; STRs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              In-depth operational modules for compliance officers, MLROs, and senior management focusing on beneficial ownership unmasking, sanctions screening, and STR reporting.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedPackage('level2');
              const el = document.getElementById('registration-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="self-start md:self-auto px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#071433] text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Register for Level 2 (Full Access Seat)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {level2Courses.map((course, idx) => (
            <div
              key={course.id}
              className="bg-white dark:bg-[#0c1936] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-amber-400/50 dark:hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400">Course {idx + 4}</span>
                  <div className="flex items-center gap-1.5">
                    {!isCourseUnlocked(course.id) ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300/40">
                        <Lock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                        <span>Locked · Payment Required</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300/40">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Active</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {course.totalHours || 3}h
                    </span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {course.shortDescription || course.description}
                </p>

                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-3 mb-4">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Core Curriculum Modules ({course.modules?.length || 0} Units · {course.lessonsCount || 0} Lessons):
                  </div>
                  {course.modules?.map((mod, mIdx) => (
                    <div key={mod.id || mIdx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">{idx + 4}.{mIdx + 1}</span>
                      <span className="line-clamp-1">{mod.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    2 CPD Points · Practical Lab
                  </span>
                  {isCourseUnlocked(course.id) ? (
                    <button
                      onClick={() => openCoursePlayer(course.id)}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Study Now</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedPackage('level2');
                        const el = document.getElementById('registration-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>Register to Unlock</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Volume Pricing & Tier Calculator */}
      <CorporateSeatCalculator
        onApplySelection={(seats, pkg) => {
          setRegType('corporate');
          setSeatCount(seats);
          setSelectedPackage(pkg);
          const el = document.getElementById('registration-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Interactive Registration & Enrollment Section */}
      <section id="registration-section" className="scroll-mt-20">
        <div className="bg-white dark:bg-[#0a1631] rounded-3xl border border-slate-200 dark:border-[#17326e] shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#071433] text-white p-6 sm:p-8 border-b border-[#14326d]">
            <div className="max-w-3xl space-y-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                Official Registration Desk
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                Register for CompliSey Academy Courses
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Enroll as an individual compliance professional or register multiple corporate seats for your regulated entity. Upon submitting your registration, you will receive official bank transfer instructions. Once payment is transferred and your payment slip is emailed, CompliSey Administrators (Malcolm Simon &amp; Eric) will activate your courses and seats.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Step 1: Type Selection */}
            <div className="space-y-6">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    1. Select Registration Type *
                  </label>
                  {!regType && (
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      👈 Please choose your enrollment tier
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl">
                  {/* Individual Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setRegType('individual');
                      setSeatCount(1);
                      setFormError(null);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 ${
                      regType === 'individual'
                        ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/30 ring-2 ring-amber-400/40 shadow-sm'
                        : 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-white/5 hover:border-slate-400 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      regType === 'individual' ? 'bg-amber-400 text-[#071433]' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          Individual Learner
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                          1 Personal Seat
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        For solo compliance officers, MLROs, directors, or self-funded professionals. Direct personal certificate issued in your name.
                      </div>
                    </div>
                  </button>

                  {/* Corporate Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setRegType('corporate');
                      if (seatCount < 2) setSeatCount(5);
                      setFormError(null);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 ${
                      regType === 'corporate'
                        ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/30 ring-2 ring-amber-400/40 shadow-sm'
                        : 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-white/5 hover:border-slate-400 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      regType === 'corporate' ? 'bg-amber-400 text-[#071433]' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          Corporate / Regulated Firm
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                          Volume Tiers
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        For CSPs, banks, securities dealers, or funds enrolling teams. Consolidated corporate invoicing &amp; central HR tokens.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Select Package & Seat Price Schedule */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    2. Choose Course Curriculum &amp; Seat Pricing *
                  </label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    12-Month Prepaid Seat Model
                  </span>
                </div>

                {!regType ? (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#071433]/50 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2 py-8">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Please select your Registration Type in Step 1
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      Select <strong>Individual Learner</strong> (1 personal seat) or <strong>Corporate / Regulated Firm</strong> (multi-seat volume tiers) above to view relevant pricing and packages.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Seat Price Schedule Grid */}
                    <div className="mb-3 p-3 rounded-xl bg-white dark:bg-[#0c1936] border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>Official Seat Price Schedule (Seychelles Rupees)</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {regType === 'individual' ? 'Active: Individual Tier' : `Active: Corporate (${pricing.effectiveSeats} Seats)`}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px]">
                        <div className={`p-2 rounded-lg border transition-all ${regType === 'individual' ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-600 font-bold text-amber-900 dark:text-amber-200 ring-1 ring-amber-400/50' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          <div className="font-semibold text-center">Individual</div>
                          <div className="space-y-0.5 mt-1 text-[9.5px]">
                            <div className={`flex justify-between ${selectedPackage === 'level1' ? 'font-black text-blue-600 dark:text-blue-400' : ''}`}>
                              <span>L1:</span> <span className="font-mono">SCR 1,250</span>
                            </div>
                            <div className={`flex justify-between ${selectedPackage === 'level2' ? 'font-black text-amber-600 dark:text-amber-400' : ''}`}>
                              <span>L2:</span> <span className="font-mono">SCR 1,500</span>
                            </div>
                            <div className={`flex justify-between border-t border-slate-200 dark:border-slate-700 pt-0.5 ${selectedPackage === 'both' ? 'font-black text-emerald-600 dark:text-emerald-400' : ''}`}>
                              <span>Pack:</span> <span className="font-mono">SCR 2,500</span>
                            </div>
                          </div>
                        </div>

                        <div className={`p-2 rounded-lg border transition-all ${regType === 'corporate' && seatCount <= 5 ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-600 font-bold text-amber-900 dark:text-amber-200 ring-1 ring-amber-400/50' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          <div className="font-semibold text-center">Corp 1–5</div>
                          <div className="space-y-0.5 mt-1 text-[9.5px]">
                            <div className={`flex justify-between ${selectedPackage === 'level1' ? 'font-black text-blue-600 dark:text-blue-400' : ''}`}>
                              <span>L1:</span> <span className="font-mono">SCR 1,100</span>
                            </div>
                            <div className={`flex justify-between ${selectedPackage === 'level2' ? 'font-black text-amber-600 dark:text-amber-400' : ''}`}>
                              <span>L2:</span> <span className="font-mono">SCR 1,300</span>
                            </div>
                            <div className={`flex justify-between border-t border-slate-200 dark:border-slate-700 pt-0.5 ${selectedPackage === 'both' ? 'font-black text-emerald-600 dark:text-emerald-400' : ''}`}>
                              <span>Pack:</span> <span className="font-mono">SCR 2,250</span>
                            </div>
                          </div>
                        </div>

                        <div className={`p-2 rounded-lg border transition-all ${regType === 'corporate' && seatCount >= 6 && seatCount <= 10 ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-600 font-bold text-amber-900 dark:text-amber-200 ring-1 ring-amber-400/50' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          <div className="font-semibold text-center">Corp 6–10</div>
                          <div className="space-y-0.5 mt-1 text-[9.5px]">
                            <div className={`flex justify-between ${selectedPackage === 'level1' ? 'font-black text-blue-600 dark:text-blue-400' : ''}`}>
                              <span>L1:</span> <span className="font-mono">SCR 1,000</span>
                            </div>
                            <div className={`flex justify-between ${selectedPackage === 'level2' ? 'font-black text-amber-600 dark:text-amber-400' : ''}`}>
                              <span>L2:</span> <span className="font-mono">SCR 1,200</span>
                            </div>
                            <div className={`flex justify-between border-t border-slate-200 dark:border-slate-700 pt-0.5 ${selectedPackage === 'both' ? 'font-black text-emerald-600 dark:text-emerald-400' : ''}`}>
                              <span>Pack:</span> <span className="font-mono">SCR 2,050</span>
                            </div>
                          </div>
                        </div>

                        <div className={`p-2 rounded-lg border transition-all ${regType === 'corporate' && seatCount >= 11 && seatCount <= 20 ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-600 font-bold text-amber-900 dark:text-amber-200 ring-1 ring-amber-400/50' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          <div className="font-semibold text-center">Corp 11–20</div>
                          <div className="space-y-0.5 mt-1 text-[9.5px]">
                            <div className={`flex justify-between ${selectedPackage === 'level1' ? 'font-black text-blue-600 dark:text-blue-400' : ''}`}>
                              <span>L1:</span> <span className="font-mono">SCR 900</span>
                            </div>
                            <div className={`flex justify-between ${selectedPackage === 'level2' ? 'font-black text-amber-600 dark:text-amber-400' : ''}`}>
                              <span>L2:</span> <span className="font-mono">SCR 1,100</span>
                            </div>
                            <div className={`flex justify-between border-t border-slate-200 dark:border-slate-700 pt-0.5 ${selectedPackage === 'both' ? 'font-black text-emerald-600 dark:text-emerald-400' : ''}`}>
                              <span>Pack:</span> <span className="font-mono">SCR 1,850</span>
                            </div>
                          </div>
                        </div>

                        <div className={`p-2 rounded-lg border transition-all ${regType === 'corporate' && seatCount >= 21 ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-600 font-bold text-amber-900 dark:text-amber-200 ring-1 ring-amber-400/50' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          <div className="font-semibold text-center">Corp 21+</div>
                          <div className="space-y-0.5 mt-1 text-[9.5px]">
                            <div className={`flex justify-between ${selectedPackage === 'level1' ? 'font-black text-blue-600 dark:text-blue-400' : ''}`}>
                              <span>L1:</span> <span className="font-mono">SCR 800</span>
                            </div>
                            <div className={`flex justify-between ${selectedPackage === 'level2' ? 'font-black text-amber-600 dark:text-amber-400' : ''}`}>
                              <span>L2:</span> <span className="font-mono">SCR 950</span>
                            </div>
                            <div className={`flex justify-between border-t border-slate-200 dark:border-slate-700 pt-0.5 ${selectedPackage === 'both' ? 'font-black text-emerald-600 dark:text-emerald-400' : ''}`}>
                              <span>Pack:</span> <span className="font-mono">SCR 1,600</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Package Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div
                        onClick={() => setSelectedPackage('both')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                          selectedPackage === 'both'
                            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-400/40 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 hover:bg-slate-100'
                        }`}
                      >
                        <div className="absolute -right-6 -top-6 w-16 h-16 bg-emerald-500/10 rounded-full blur-xs" />
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                              All 6 Modules · Full Pack
                            </span>
                            {selectedPackage === 'both' && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Selected
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
                            Complete Professional Curriculum Pack
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Full comprehensive 12 CPD hours curriculum (Levels 1 &amp; 2). Recommended for audit readiness.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                          <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                            SCR {packPricing.ratePerSeat.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ seat ({packPricing.bandLabel})</span>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setSelectedPackage('level1')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          selectedPackage === 'level1'
                            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-400/40 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                              3 Modules Focus
                            </span>
                            {selectedPackage === 'level1' && (
                              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Selected
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
                            Level 1 Statutory Foundations
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Modules 1, 2 &amp; 3: Money Laundering, Terrorist Financing, and Seychelles Framework.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                          <div className="text-base font-extrabold text-blue-700 dark:text-blue-400">
                            SCR {level1Pricing.ratePerSeat.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ seat ({level1Pricing.bandLabel})</span>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setSelectedPackage('level2')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          selectedPackage === 'level2'
                            ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 ring-2 ring-amber-400/40 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                              3 Modules Focus
                            </span>
                            {selectedPackage === 'level2' && (
                              <span className="text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Selected
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
                            Level 2 Advanced Operations
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Modules 4, 5 &amp; 6: Due Diligence &amp; UBOs, Sanctions Freezing, and STR Escalation.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                          <div className="text-base font-extrabold text-amber-700 dark:text-amber-400">
                            SCR {level2Pricing.ratePerSeat.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ seat ({level2Pricing.bandLabel})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Step 3: Fill Details */}
              <form onSubmit={handleRegistrationSubmit} className="space-y-6 pt-2">
                <CsrfInput formName="academy-registration-form" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      3. Contact &amp; Registration Details *
                    </label>
                    {regType === 'individual' && (
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Individual Learner (1 Seat)
                      </span>
                    )}
                    {regType === 'corporate' && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> Regulated Entity ({seatCount} Seats)
                      </span>
                    )}
                  </div>

                  {!regType ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
                      Contact fields will activate once you select your Registration Type in Step 1.
                    </div>
                  ) : (
                    <>
                      {regType === 'individual' && (
                        <div className="mb-4 p-3 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2.5">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>
                            <strong>Personal Registration:</strong> No corporate entity required. The official course access and verified completion certificate will be issued directly in your personal name.
                          </span>
                        </div>
                      )}

                      {regType === 'corporate' && (
                        <div className="mb-4 p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>
                            <strong>Corporate Registration:</strong> Multi-seat allocation with unified proforma/tax invoice for your regulated entity.
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            {regType === 'individual' ? 'Your Full Legal Name *' : 'Primary Compliance Contact Full Name *'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={regType === 'individual' ? 'e.g. Malcolm Simon' : 'e.g. Marcus Delpech'}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#071433] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            {regType === 'individual' ? 'Your Email Address (For Login & Certificate) *' : 'Official Corporate Email Address *'}
                          </label>
                          <input
                            type="email"
                            required
                            placeholder={regType === 'individual' ? 'e.g. malcolm@complisanc.com' : 'e.g. compliance@firm.sc'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#071433] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Phone / WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            placeholder="+248 2500000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#071433] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                          />
                        </div>

                        {regType === 'corporate' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Regulated Entity / Firm Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Victoria Fiduciary Services Ltd"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#071433] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                            />
                          </div>
                        )}

                        {regType === 'corporate' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Regulated Industry Sector
                            </label>
                            <select
                              value={industrySector}
                              onChange={(e) => setIndustrySector(e.target.value)}
                              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#071433] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                            >
                              <option>Corporate &amp; Trust Service Provider (CSP)</option>
                              <option>Commercial / Offshore Banking</option>
                              <option>Securities &amp; Financial Services</option>
                              <option>Virtual Asset Service Provider (VASP)</option>
                              <option>Accounting &amp; Audit Practice</option>
                              <option>Legal Practitioner / Notary</option>
                              <option>Gaming &amp; Casino Operator</option>
                              <option>Real Estate Agency</option>
                              <option>Other Regulated Reporting Entity</option>
                            </select>
                          </div>
                        )}

                        {regType === 'corporate' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Number of Staff Seats
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                max="150"
                                value={seatCount}
                                onChange={(e) => setSeatCount(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-24 px-3.5 py-2 bg-slate-50 dark:bg-[#071433] border border-slate-300 dark:border-[#1d3d75] rounded-xl text-xs text-slate-900 dark:text-white font-bold text-center focus:outline-hidden focus:border-amber-400"
                              />
                              <div className="flex items-center gap-1">
                                {[3, 5, 10, 20].map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSeatCount(s)}
                                    className={`px-2 py-1 text-[11px] rounded-lg border font-bold ${
                                      seatCount === s
                                        ? 'bg-amber-400 text-[#071433] border-amber-400'
                                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300'
                                    }`}
                                  >
                                    {s} seats
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Investment Total Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071433] border border-slate-200 dark:border-[#193566] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      Order Summary ({regType ? `${pricing.effectiveSeats} Seat${pricing.effectiveSeats > 1 ? 's' : ''} · ${pricing.bandLabel}` : 'Please choose registration type'})
                    </span>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {!selectedPackage
                        ? 'No curriculum package selected yet'
                        : selectedPackage === 'both'
                        ? 'Complete Professional Package (6 Modules)'
                        : selectedPackage === 'level1'
                        ? 'Level 1 Statutory Foundations (3 Modules)'
                        : 'Level 2 Advanced Operations (3 Modules)'}
                    </div>
                    {selectedPackage ? (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Rate: <strong className="text-slate-800 dark:text-slate-200">SCR {pricing.ratePerSeat.toLocaleString()}</strong> per seat ({pricing.bandLabel})
                      </div>
                    ) : (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        Select a course curriculum package in Step 2 to calculate your exact quotation.
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      {selectedPackage ? `SCR ${pricing.totalSCR.toLocaleString()}` : '—'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedPackage ? `Approx. USD $${pricing.totalUSD.toLocaleString()}` : 'Select package above'}
                    </div>
                  </div>
                </div>

                {/* Step 4: Mandatory Legal & Policy Acknowledgment */}
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="policy-ack-checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                    <label htmlFor="policy-ack-checkbox" className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer">
                      I confirm that I have read and agree to the <strong className="text-slate-900 dark:text-white">CompliSey Privacy Policy</strong> and <strong className="text-slate-900 dark:text-white">Terms &amp; Conditions</strong>. I understand that upon submission, an official bank transfer reference will be generated, and that courses and seats are activated by CompliSey Administrators (Malcolm Simon &amp; Eric) upon verification of our emailed bank payment slip.
                    </label>
                  </div>

                  <div className="flex items-center gap-3 text-xs pl-7">
                    <button
                      type="button"
                      onClick={() => setActiveLegalModal('privacy')}
                      className="text-amber-700 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Privacy Policy</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <span className="text-slate-400">·</span>
                    <button
                      type="button"
                      onClick={() => setActiveLegalModal('terms')}
                      className="text-amber-700 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Terms &amp; Conditions</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {formError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Step 5: Submit Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 w-full py-3.5 rounded-2xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-[#071433] text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Recording Registration...</span>
                    ) : (
                      <>
                        <span>Submit Registration &amp; Generate Bank Payment Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const packageTitle =
                        selectedPackage === 'both'
                          ? 'CompliSey Academy: Complete Professional Curriculum Pack (Levels 1 & 2 - All 6 Modules)'
                          : selectedPackage === 'level1'
                          ? 'CompliSey Academy: Level 1 Statutory Foundations (Modules 1, 2 & 3)'
                          : 'CompliSey Academy: Level 2 Advanced Operational Compliance (Modules 4, 5 & 6)';

                      const cId =
                        selectedPackage === 'both'
                          ? 'pkg-both'
                          : selectedPackage === 'level1'
                          ? 'pkg-level-1'
                          : 'pkg-level-2';
                      const cpd = selectedPackage === 'both' ? 12 : 6;
                      const mods = selectedPackage === 'both' ? 6 : 3;

                      addToCart({
                        courseId: cId,
                        courseTitle: packageTitle,
                        packageType: selectedPackage === 'both' ? 'pack' : selectedPackage,
                        seatCount: regType === 'corporate' ? Math.max(1, seatCount) : 1,
                        cpdHours: cpd,
                        modulesCount: mods,
                      });
                      setIsCartOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border-2 border-amber-400/80 hover:border-amber-500 bg-amber-50/70 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50 text-[#071433] dark:text-amber-300 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    title="Add this package selection to your consolidated cart"
                  >
                    <ShoppingCart className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Add to Cart ({cart.length})</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Step 6 / Post-Submission Confirmation Card & Bank Transfer Details */}
      {completedOrder && (
        <section id="order-confirmation-card" className="scroll-mt-20">
          <div className="bg-white dark:bg-[#0a1631] rounded-3xl border-2 border-emerald-500 dark:border-emerald-600 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                    Registration Recorded
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    Order Reference: {completedOrder.proformaNumber}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Complisanc Consulting Services Booking ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{completedOrder.ccsBookingId}</strong>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Payable</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  SCR {completedOrder.totalAmount.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  {completedOrder.seatCount} Seat{completedOrder.seatCount > 1 ? 's' : ''} · {completedOrder.companyName}
                </div>
              </div>
            </div>

            {/* Clear 3-Step Payment & Activation Guide */}
            <div className="my-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Next Steps to Activate Your Courses &amp; Seats:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071433] border border-slate-200 dark:border-[#17326e]">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-2.5">
                    1
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Make Bank Transfer
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Transfer <strong className="text-slate-900 dark:text-white">SCR {completedOrder.totalAmount.toLocaleString()}</strong> to the official Complisanc Consulting Services account below, referencing your Order Number.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-[#071433] flex items-center justify-center font-bold text-xs mb-2.5">
                    2
                  </div>
                  <h5 className="text-xs font-bold text-amber-950 dark:text-amber-300 mb-1">
                    Email Your Payment Slip
                  </h5>
                  <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    Email your payment slip, bank receipt, or swift confirmation to <strong className="text-amber-950 dark:text-white underline">eric@complisanc.com</strong> (Training Desk) or <strong className="text-amber-950 dark:text-white underline">malcolm@complisanc.com</strong> (Administration &amp; Support).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-2.5">
                    3
                  </div>
                  <h5 className="text-xs font-bold text-emerald-950 dark:text-emerald-300 mb-1">
                    Admin Activates Seats
                  </h5>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    CompliSey Administrators (Malcolm &amp; Eric) verify your slip and activate your courses &amp; seats in the academy immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Official Seychelles Bank Details Box */}
            <div className="p-5 rounded-2xl bg-[#071433] text-white border border-[#14326d] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Official Seychelles Bank Account Details
                  </span>
                </div>
                <button
                  onClick={handleCopyBankDetails}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBank ? 'Bank Details Copied!' : 'Copy Bank Details'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Beneficiary Account Name</div>
                  <div className="font-bold text-white mt-0.5">{BANKING_DETAILS.accountName}</div>
                </div>

                <div>
                  <div className="text-slate-400">Designated Bank</div>
                  <div className="font-bold text-white mt-0.5">{BANKING_DETAILS.bankName}</div>
                  <div className="text-[10px] text-slate-400">{BANKING_DETAILS.branch}</div>
                </div>

                <div>
                  <div className="text-slate-400">SCR Account Number</div>
                  <div className="font-mono font-bold text-amber-300 text-sm mt-0.5">{BANKING_DETAILS.accountNumber}</div>
                  <div className="text-[10px] text-slate-400">SWIFT / BIC: <span className="font-mono font-bold">{BANKING_DETAILS.swiftBic}</span></div>
                </div>

                <div>
                  <div className="text-slate-400">Official IBAN (SCR)</div>
                  <div className="font-mono font-bold text-amber-300 text-xs mt-0.5 truncate" title={BANKING_DETAILS.iban}>
                    {BANKING_DETAILS.iban || 'SC32MCBL06070000000001073508SCR'}
                  </div>
                  <div className="text-[10px] text-slate-400">USD Correspondent Available</div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-xs text-slate-300 flex items-center gap-2">
                <span className="font-bold text-amber-400">Required Transfer Reference:</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white font-bold">
                  {completedOrder.proformaNumber}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedProformaForView(completedOrder)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View &amp; Print Proforma Invoice PDF</span>
              </button>

              <button
                onClick={() => setSelectedOrderForPayment(completedOrder)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay Online / Submit Wire Remittance Advice</span>
              </button>

              <button
                onClick={() => {
                  setCompletedOrder(null);
                  setFullName('');
                  setEmail('');
                  setCompanyName('');
                  setAgreedToTerms(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                Register Another Order / Team
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Regulatory FAQ Section */}
      <CourseFaqSection />
    </div>
  );
};
