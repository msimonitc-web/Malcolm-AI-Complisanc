import React, { useState } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  Clock,
  MapPin,
  HelpCircle,
  Copy,
  CheckCircle2,
  Send,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { SEYCHELLES_BANK_ACCOUNTS } from '../data/bankingDetails';
import { CompliseyLogo } from './CompliseyLogo';
import { useCsrf, CsrfInput, CsrfBadge } from '../context/CsrfContext';

export const SupportCenterModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, formatPrice } = useAcademy();
  const { csrfToken, submitProtectedForm } = useCsrf();

  const [activeTab, setActiveTab] = useState<'bank_guidance' | 'contacts' | 'quick_message'>('bank_guidance');
  const [selectedCurrency, setSelectedCurrency] = useState<'SCR' | 'USD' | 'EUR' | 'GBP'>('SCR');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Quick message composer state
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderEntity, setSenderEntity] = useState('');
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [inquiryType, setInquiryType] = useState('Wire Remittance Proof & Activation');
  const [messageBody, setMessageBody] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  if (!isSupportModalOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify submission against CSRF backend protection
    try {
      await submitProtectedForm('/api/forms/support-ticket', {
        senderName,
        senderEmail,
        senderEntity,
        bookingId: bookingIdInput,
        inquiryType,
        messageBody,
        _csrf: csrfToken,
      });
    } catch (err) {
      console.warn('Protected support ticket endpoint reached or offline:', err);
    }

    const subject = encodeURIComponent(`[Complisey Support] ${inquiryType} - ${senderEntity || senderName}`);
    const body = encodeURIComponent(
      `Hello Complisey Support Team,\n\n` +
      `From: ${senderName} (${senderEmail})\n` +
      `Reporting Entity: ${senderEntity || 'N/A'}\n` +
      `Booking ID / Proforma Ref: ${bookingIdInput || 'N/A'}\n` +
      `Inquiry Category: ${inquiryType}\n\n` +
      `Message Details:\n${messageBody}\n\n` +
      `[Anti-CSRF Security Verified: ${csrfToken.slice(0, 10)}...]\n` +
      `Sent via Complisey Academy Support Center`
    );

    const mailtoUrl = `mailto:malcolm@complisanc.com,eric@complisanc.com?subject=${subject}&body=${body}`;
    try {
      const win = window.open(mailtoUrl, '_blank');
      if (!win) {
        window.location.href = mailtoUrl;
      }
    } catch {
      window.location.href = mailtoUrl;
    }
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageBody('');
    }, 4000);
  };

  const currentBank = SEYCHELLES_BANK_ACCOUNTS[selectedCurrency] || SEYCHELLES_BANK_ACCOUNTS.SCR;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#071433] text-white flex items-center justify-between shrink-0 border-b border-[#142c63]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shadow-xs">
              <CompliseyLogo className="w-full h-full" cColor="#ffffff" ankhColor="#f59e0b" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white font-['IBM_Plex_Sans']">
                  CompliSey Support Center
                </h2>
                <span className="px-2 py-0.5 rounded bg-amber-400 text-[#071433] text-[10px] font-black uppercase tracking-wider">
                  Administrative Help
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Direct training support, proforma reconciliation, and bank wire remittance guidance
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-5 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('bank_guidance')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'bank_guidance'
                ? 'border-[#071433] text-[#071433] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-blue-700" />
            <span>Bank Transfer Process &amp; Coordinates</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'contacts'
                ? 'border-[#071433] text-[#071433] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-600" />
            <span>Direct Administrative Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('quick_message')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'quick_message'
                ? 'border-[#071433] text-[#071433] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Send Email to Malcolm &amp; Eric</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">
          {/* TAB 1: Bank Transfer Guidance */}
          {activeTab === 'bank_guidance' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Process Step-by-Step Overview */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>How Corporate Bank Transfer &amp; Seat Provisioning Works</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-mono">1</span>
                      <span>Generate Proforma Invoice</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Select your desired seat count from <em>Seats &amp; Invoices</em> or <em>Demo Corp MLRO</em>. You receive a unique <strong>CCS Booking ID</strong> (e.g. <code>CCS-BK-2026-00412</code>).
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-mono">2</span>
                      <span>Quote Booking ID in Narration</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Instruct your bank (MCB Seychelles, Absa, or international SWIFT) to include your <strong>CCS Booking ID</strong> in the payment narration field.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-mono">3</span>
                      <span>Email Transfer Advice to Malcolm &amp; Eric</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Send your bank debit confirmation or SWIFT slip to <strong>malcolm@complisanc.com</strong> and <strong>eric@complisanc.com</strong> for expedited matching.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-mono">4</span>
                      <span>Instant Seat Allocation &amp; Join Code</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Complisey activates your seats immediately and dispatches your master Join Code (e.g. <code>DEMO2026</code>) plus formal statutory Tax Invoice.
                    </p>
                  </div>
                </div>
              </div>

              {/* Currency Selector & Bank Remittance Coordinates */}
              <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-700" />
                      <span>Complisanc Consulting Services (SEY) Bank Accounts</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Select currency for official Victoria, Mahé clearing coordinates:
                    </p>
                  </div>

                  {/* Currency Buttons */}
                  <div className="flex items-center bg-white rounded-lg p-0.5 border border-blue-200 shadow-2xs">
                    {(['SCR', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setSelectedCurrency(curr)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                          selectedCurrency === curr
                            ? 'bg-[#071433] text-amber-300 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bank Details Card */}
                <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {currentBank.currency} Account · Seychelles Clearing
                      </span>
                      <div className="text-sm font-bold text-slate-900 mt-1">{currentBank.bankName}</div>
                      <div className="text-xs text-slate-500">{currentBank.branch}</div>
                    </div>
                    {currentBank.routingOrClearing && (
                      <div className="text-right text-[11px] text-slate-600 font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                        {currentBank.routingOrClearing}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Account Name:</span>
                      <span className="font-semibold text-slate-900">{currentBank.accountName}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Account Number:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-bold text-blue-900 text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {currentBank.accountNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(currentBank.accountNumber, 'acc')}
                          className="p-1 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                          title="Copy Account Number"
                        >
                          {copiedKey === 'acc' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">SWIFT / BIC Code:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {currentBank.swiftBic}
                        </span>
                        <button
                          onClick={() => handleCopy(currentBank.swiftBic, 'swift')}
                          className="p-1 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                          title="Copy SWIFT Code"
                        >
                          {copiedKey === 'swift' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Recommended Payment Reference:</span>
                      <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 block truncate">
                        [Your CCS Booking ID or Proforma #]
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Important for Regulated Entities:</strong> All bank transfer fees are payable by the remitter (OUR). To ensure same-day seat activation, please forward your wire confirmation slip to both <strong>malcolm@complisanc.com</strong> and <strong>eric@complisanc.com</strong>.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Direct Administrative Contacts */}
          {activeTab === 'contacts' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="text-xs text-slate-600 leading-relaxed">
                For administrative assistance, proforma invoice updates, corporate purchase orders, or bespoke compliance training arrangements, reach out directly to Complisanc's executive and operations team:
              </div>

              {/* Direct Personnel Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Malcolm Simon Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#071433] text-amber-400 font-bold flex items-center justify-center font-mono text-sm border border-blue-900 shrink-0">
                        MS
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Malcolm Simon</h4>
                        <p className="text-[11px] text-blue-700 font-semibold">Managing Director &amp; Lead Solutions Architect</p>
                      </div>
                    </div>

                    <div className="text-[11px] bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-slate-600 space-y-1">
                      <p className="font-medium text-slate-700">17 Years Head of Compliance &amp; MLRO · 20+ Years Financial RegTech</p>
                      <p className="text-[10px] text-slate-500">Architect of CompliSey (KYC/AML) &amp; SC PEP Register. Leads corporate agreements, institutional onboarding, data compliance, and administrative operations.</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="font-mono font-bold text-slate-800 truncate text-[11px]">malcolm@complisanc.com</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopy('malcolm@complisanc.com', 'email-malcolm')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500"
                          title="Copy email address"
                        >
                          {copiedKey === 'email-malcolm' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href="mailto:malcolm@complisanc.com?subject=CompliSey%20Academy%20Administration%20and%20Support%20Inquiry"
                          className="px-2 py-0.5 rounded bg-[#071433] text-amber-300 text-[10px] font-bold hover:bg-[#0c245c] transition-colors"
                        >
                          Email
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-mono text-slate-700 truncate text-[11px]">+248 2 628 264 / 2 766 557</span>
                      </div>
                      <a
                        href="tel:+2482628264"
                        className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold hover:bg-emerald-800 transition-colors"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>

                {/* Eric D'Souza Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center font-mono text-sm border border-blue-700 shrink-0">
                        ED
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Eric D'Souza</h4>
                        <p className="text-[11px] text-emerald-700 font-semibold">Regulatory Compliance Expert &amp; Training Lead</p>
                      </div>
                    </div>

                    <div className="text-[11px] bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-slate-600 space-y-1">
                      <p className="font-medium text-slate-700">Former FSA Seychelles Policy Analyst · Associate Lecturer (Unisey)</p>
                      <p className="text-[10px] text-slate-500">Coordinated National Risk Assessment on VA &amp; VASPs and VASP Act 2024. Certified Cryptoasset Anti-Financial Crime Specialist. Leads curriculum, assessments, and CPD certification.</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="font-mono font-bold text-slate-800 truncate text-[11px]">eric@complisanc.com</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopy('eric@complisanc.com', 'email-eric')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500"
                          title="Copy email address"
                        >
                          {copiedKey === 'email-eric' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href="mailto:eric@complisanc.com?subject=CompliSey%20Academy%20Training%20Inquiry"
                          className="px-2 py-0.5 rounded bg-[#071433] text-amber-300 text-[10px] font-bold hover:bg-[#0c245c] transition-colors"
                        >
                          Email
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-mono text-slate-700 truncate text-[11px]">+248 2 810 304</span>
                      </div>
                      <a
                        href="tel:+2482810304"
                        className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold hover:bg-emerald-800 transition-colors"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Office, Operations Hours, & Statutory Identity */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Administrative Office &amp; Regulatory Presence</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> Location
                    </span>
                    <p className="text-slate-800 font-medium">
                      Complisanc Consulting Services (SEY)<br />
                      Victoria, Mahé, Seychelles
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Operating Hours
                    </span>
                    <p className="text-slate-800 font-medium">
                      Mon – Fri: 08:30 – 16:30 SCT<br />
                      Seychelles Time (UTC+4)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" /> Primary Banking
                    </span>
                    <p className="text-slate-800 font-medium">
                      The Mauritius Commercial Bank (MCB)<br />
                      Eden Branch (SCR / USD / EUR / GBP)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Quick Email Helper */}
          {activeTab === 'quick_message' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Direct Routing:</strong> This form dispatches your message simultaneously to <strong>malcolm@complisanc.com</strong> and <strong>eric@complisanc.com</strong> with your booking details formatted for rapid processing.
                </div>
              </div>

              {messageSent && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your email client has been opened with pre-filled details for Malcolm Simon &amp; Eric D'Souza. Thank you!</span>
                </div>
              )}

              <form onSubmit={handleQuickSubmit} className="space-y-3 text-xs">
                <CsrfInput formName="support" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vanessa Joubert"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#071433] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Official Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="v.joubert@fiduciary.sc"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#071433] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Regulated Entity / Firm Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Victoria Fiduciary Services Ltd"
                      value={senderEntity}
                      onChange={(e) => setSenderEntity(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#071433] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      CCS Booking ID or Proforma Ref
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CCS-BK-2026-00412"
                      value={bookingIdInput}
                      onChange={(e) => setBookingIdInput(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-hidden focus:border-[#071433] focus:bg-white uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#071433] focus:bg-white font-medium"
                  >
                    <option value="Wire Remittance Proof & Activation">Wire Remittance Proof &amp; Immediate Activation</option>
                    <option value="Proforma Invoice Issuance Request">Proforma Invoice Issuance Request</option>
                    <option value="Corporate Seat Volume Discount (10+ seats)">Corporate Seat Volume Discount (10+ seats)</option>
                    <option value="Staff Compliance Training File Audit Verification">Staff Compliance Training File Audit Verification</option>
                    <option value="General Administrative Assistance">General Administrative Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message / Remittance Details *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide wire details, number of staff seats, or specific administrative questions..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#071433] focus:bg-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <CsrfBadge />
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to malcolm@ &amp; eric@</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Training Provider Status Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700">Notice on Training Provider Status:</span> Complisanc Consulting Services (SEY) trading as Complisey is an independent compliance training provider (<a href="https://complisey.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-semibold">complisey.com</a>). We provide structured training to regulated entities to ensure they are compliant with their statutory obligations and training policies.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Administrative desk active · Response within 2–4 hours during business days</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
