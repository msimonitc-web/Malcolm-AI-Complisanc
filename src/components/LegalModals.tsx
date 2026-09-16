import React, { useState } from 'react';
import {
  FileText,
  X,
  Printer,
  ExternalLink,
  Globe2,
  Lock,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Scale,
  Award,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { CompliseyLogo } from './CompliseyLogo';

export const LegalModals: React.FC = () => {
  const { activeLegalModal, setActiveLegalModal } = useAcademy();
  const [selectedJurisdictionFilter, setSelectedJurisdictionFilter] = useState<'all' | 'seychelles' | 'global'>('all');

  if (!activeLegalModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#071433] text-white p-4 sm:p-6 border-b border-[#152a5e] flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
                Regulatory &amp; Commercial Compliance
              </span>
              <span className="text-xs text-slate-300 hidden sm:inline">
                Complisanc Consulting Services (SEY) trading as Complisey
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold font-['IBM_Plex_Sans'] flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              {activeLegalModal === 'privacy' ? 'Privacy Policy & Global Data Protection' : 'Terms & Conditions of Service'}
            </h3>
            <p className="text-xs text-slate-400">
              Last Updated: September 2026 · Compliant with Seychelles Laws, EU/UK GDPR Standards &amp; FATF Reporting Guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print Document"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveLegalModal(null)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Privacy vs Terms + Jurisdiction Filter) */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          {/* Document Switcher */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveLegalModal('privacy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeLegalModal === 'privacy'
                  ? 'bg-[#071433] text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => setActiveLegalModal('terms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeLegalModal === 'terms'
                  ? 'bg-[#071433] text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms &amp; Conditions</span>
            </button>
          </div>

          {/* Multi-Jurisdiction Tag */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-700">Scope:</span>
            <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[11px] font-bold">
              Seychelles Domestic + International Cross-Border (FATF / GDPR)
            </span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed font-['IBM_Plex_Sans']">
          {activeLegalModal === 'privacy' ? (
            /* PRIVACY POLICY CONTENT */
            <div className="space-y-6">
              {/* Executive Summary Box */}
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-blue-950 font-bold text-xs uppercase tracking-wider">
                  <CompliseyLogo className="w-4 h-4" cColor="#1e3a8a" ankhColor="#d9a438" />
                  Dual Statutory Framework: Seychelles Law &amp; International Standards
                </div>
                <p className="text-xs text-blue-900 leading-relaxed">
                  Complisey provides AML/CFT and regulatory education designed for regulated reporting entities in the Republic of Seychelles as well as internationally in FATF-aligned jurisdictions (including the UK, EU, UAE/ADGM, BVI, Cayman, and Commonwealth offshore and onshore hubs). This policy governs how we collect, verify, protect, and report training telemetry.
                </p>
              </div>

              {/* Section 1 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Data Controller Identity &amp; Legal Entity
                </h4>
                <p>
                  The data controller responsible for personal information processed through Complisey Academy is{' '}
                  <strong className="text-slate-900">Complisanc Consulting Services (SEY) trading as Complisey</strong>, a registered entity in Victoria, Mahé, Republic of Seychelles (hereinafter referred to as &ldquo;Complisey&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
                </p>
                <p>
                  For data protection inquiries, audit requests, or supervisory verifications, our designated compliance officer can be reached at <span className="font-mono text-blue-700">privacy@complisey.com</span> or via our registered business presence in Seychelles.
                </p>
              </section>

              {/* Section 2 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Categories of Data Collected
                </h4>
                <p>
                  To fulfill statutory training mandates and deliver accredited coursework, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-slate-900">Student &amp; Professional Identity:</strong> Full legal name, professional email address, job title, and employer / reporting entity name.
                  </li>
                  <li>
                    <strong className="text-slate-900">Competency &amp; Training Telemetry:</strong> Video progress timestamps, module completion status, quiz submissions, final examination grades, and verifiable certificate issuance identifiers (required to validate genuine CPD training hours).
                  </li>
                  <li>
                    <strong className="text-slate-900">Commercial &amp; Billing Data:</strong> Corporate billing address, country/jurisdiction, VAT/Tax identifiers, invoice numbers, and payment gateway tokens. We do not store full payment card numbers or CVV codes on our servers; transactions are processed through PCI-DSS Level 1 certified gateways (Stripe, PayPal).
                  </li>
                  <li>
                    <strong className="text-slate-900">Technical Data:</strong> IP address, browser type, and login session identifiers to safeguard against account sharing and protect assessment integrity.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Sponsoring Employer &amp; Compliance Officer Visibility Clause
                </h4>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
                  <p className="font-semibold mb-1">Notice for Corporate &amp; Sponsored Learners:</p>
                  <p className="text-xs leading-relaxed">
                    Where your course seat has been funded, assigned, or redeemed via an employer join code or corporate training pack, your sponsoring employer (specifically authorized MLROs, Compliance Officers, or HR administrators) possesses the legal right to access your training completion logs, examination scores, and verifiable audit certificates. This is necessary for your firm to maintain its statutory staff training compliance file.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  Statutory 7-Year Retention &amp; Data Erasure Reconciliation
                </h4>
                <p>
                  Under <strong className="text-slate-900">Section 34 of the Seychelles Anti-Money Laundering and Countering the Financing of Terrorism Act 2020</strong> and international FATF Recommendation 18 standards, regulated reporting entities are legally mandated to retain employee AML/CFT training and competency records for a minimum of <strong className="text-slate-900">seven (7) years</strong>.
                </p>
                <p>
                  While data subjects have rights under applicable data protection legislation to request deletion of personal data, statutory regulatory retention rules take precedence. Complisey is legally prohibited from erasing verified course completion, certificate serials, and examination audit logs before the statutory 7-year regulatory retention period expires.
                </p>
              </section>

              {/* Section 5 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    5
                  </span>
                  International Data Protection &amp; Cross-Border Transfers (EU/UK GDPR Standards)
                </h4>
                <p>
                  For corporate clients and individual practitioners residing in the European Union, United Kingdom, or other international jurisdictions:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-slate-900">Lawful Bases:</strong> We process data on grounds of contractual necessity (Article 6(1)(b) GDPR), legal compliance (Article 6(1)(c) GDPR), and legitimate interest in providing audited regulatory accreditation (Article 6(1)(f) GDPR).
                  </li>
                  <li>
                    <strong className="text-slate-900">International Safeguards:</strong> Cross-border data transfers are protected through standard contractual safeguards, 256-bit TLS transit encryption, and restricted database access.
                  </li>
                  <li>
                    <strong className="text-slate-900">Data Subject Rights:</strong> Subject to the statutory 7-year retention limit noted above, users retain rights to access, data portability, correction of inaccurate biographical records, and complaints to their supervisory authority.
                  </li>
                </ul>
              </section>
            </div>
          ) : (
            /* TERMS AND CONDITIONS CONTENT */
            <div className="space-y-6">
              {/* Executive Summary Box */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
                  <Scale className="w-4 h-4 text-amber-700" />
                  Commercial Agreement: 12-Month Staff Seats &amp; Professional Standards
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  These Terms of Service constitute a legally binding agreement between you (and the regulated institution on whose behalf you act) and Complisanc Consulting Services (SEY) trading as Complisey. By accessing our platform, purchasing seats, or redeeming join vouchers, you accept these terms.
                </p>
              </div>

              {/* Section 1 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Educational Purpose &amp; Regulatory Disclaimer (Non-Legal Advice)
                </h4>
                <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg text-red-950">
                  <p className="font-semibold mb-1">Crucial Regulatory &amp; Legal Notice:</p>
                  <p className="text-xs leading-relaxed">
                    Courses, lecture videos, typologies, and assessments provided by Complisey are for <strong>professional educational and continuing professional development (CPD) purposes only</strong>. Completion of any course or receipt of a certificate does <strong>NOT</strong> constitute formal legal advice, nor does it guarantee regulatory approval, immunity from enforcement actions, or exemption from statutory audits by the Financial Services Authority (FSA), Financial Intelligence Unit (FIU), or any international supervisory body.
                  </p>
                  <p className="text-xs mt-2 leading-relaxed">
                    Each reporting entity remains exclusively responsible for formulating, implementing, and enforcing its own internal compliance manuals, risk assessments, customer due diligence (CDD) procedures, and suspicious transaction reporting (STR) frameworks.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Prepaid 12-Month Staff Seats &amp; Licensing Terms
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-slate-900">Seat Duration:</strong> Each training seat license remains active for twelve (12) calendar months from the date of activation or invoice settlement.
                  </li>
                  <li>
                    <strong className="text-slate-900">Single-User License:</strong> Each seat is designated to a single individual practitioner. Account sharing, group viewing for uncredited staff, or sharing login credentials is a material breach and grounds for seat termination without refund.
                  </li>
                  <li>
                    <strong className="text-slate-900">Corporate Seat Transferability:</strong> For corporate multi-seat purchasers, an uncommenced seat (where less than 5% progress has occurred) may be reassigned to another staff member upon written notice to our support desk.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Assessment Integrity &amp; Verifiable Certificates
                </h4>
                <p>
                  To protect the integrity of Complisey audit credentials placed on regulatory compliance inspection files:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-slate-900">Personal Completion Warranty:</strong> The learner warrants that all module quizzes and the final comprehensive examination are taken personally without unauthorized assistance, proxy test-taking, or AI bot automation.
                  </li>
                  <li>
                    <strong className="text-slate-900">Passing Grade:</strong> Official verifiable certificates require achieving an 80% passing grade on the final examination.
                  </li>
                  <li>
                    <strong className="text-slate-900">DRAFT Markings:</strong> Certificates marked &ldquo;DRAFT&rdquo; (generated in demonstration, preview, or unverified environments) possess no legal standing for regulatory compliance audits and may not be submitted to supervisory authorities.
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  Intellectual Property &amp; Commercial Restrictions
                </h4>
                <p>
                  All curriculum materials, video recordings, slides, regulatory case studies, and proprietary guidance documents remain the exclusive intellectual property of Complisanc Consulting Services (SEY).
                </p>
                <p>
                  Clients may download designated regulatory reference PDFs for internal compliance use, but may not distribute, reproduce, broadcast, or white-label any course materials without express prior written consent.
                </p>
              </section>

              {/* Section 5 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    5
                  </span>
                  Payments, Currencies, International Taxes &amp; Digital Refund Policy
                </h4>
                <p>
                  Seats are priced and billed in the selected currency (USD, EUR, GBP). For international corporate purchasers, reverse charge mechanisms or local withholding taxes must be accounted for by the purchasing reporting entity.
                </p>
                <p>
                  <strong className="text-slate-900">Digital Access Refund Policy:</strong> Because digital course materials, templates, and assessments are immediately accessible upon payment, refund requests are only considered within 14 calendar days of purchase, provided that the user has completed less than 15% of the coursework and has not generated or claimed any verifiable certificate.
                </p>
              </section>

              {/* Section 6 */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">
                    6
                  </span>
                  Governing Law, International Scope &amp; Dispute Resolution
                </h4>
                <p>
                  These Terms are governed by and construed in accordance with the laws of the <strong className="text-slate-900">Republic of Seychelles</strong>, with consideration to international commercial principles.
                </p>
                <p>
                  Any dispute arising out of or in connection with these terms shall first be submitted to good-faith mediation in Victoria, Mahé, Seychelles, or via accredited international electronic arbitration. The courts of the Republic of Seychelles shall possess non-exclusive jurisdiction.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Verifiable against Seychelles AML/CFT Act 2020 s.34 &amp; International FATF Recommendations.
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Copy</span>
            </button>
            <button
              onClick={() => setActiveLegalModal(null)}
              className="px-5 py-2 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold transition-colors shadow-xs"
            >
              I Understand &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
