import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  RotateCcw,
  Search,
  ExternalLink,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'exam' | 'certificate' | 'audit';
  question: string;
  answer: string;
  highlights?: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'regulatory-status',
    category: 'audit',
    question: "What is Complisey's role as a training provider?",
    answer:
      'Complisanc Consulting Services (SEY) trading as Complisey (complisey.com) is an independent compliance training provider. We provide structured, practical training to regulated reporting entities and financial institutions to ensure they are fully compliant with their statutory obligations and internal training policies.',
    highlights: [
      'Independent compliance training provider (complisey.com)',
      'Practical training aligned with Section 34 of the AML/CFT Act 2020',
      'Helping regulated entities fulfill statutory training obligations and internal policies',
    ],
  },
  {
    id: 'exam-requirement',
    category: 'exam',
    question: 'Why is an 80% passing score strictly required for completion?',
    answer:
      'Under the Seychelles Anti-Money Laundering and Countering the Financing of Terrorism Act 2020 (AML/CFT Act 2020) and reporting entity compliance standards, firms must demonstrate substantive employee competence. CompliSey Academy applies the rigorous 80% threshold to ensure staff can reliably identify Politically Exposed Persons (PEPs), evaluate proliferation financing typologies, and properly adhere to internal escalation and statutory reporting procedures.',
    highlights: [
      'Mandated under Section 34 of AML/CFT Act 2020',
      'Satisfies statutory knowledge benchmarks',
      'Supports compliance with internal training policies',
    ],
  },
  {
    id: 'exam-retakes',
    category: 'exam',
    question: 'What happens if I score below 80% on a module quiz or final assessment?',
    answer:
      'You can retake the quiz as many times as you need without penalty or additional fees. If you score under 80%, we recommend reviewing the lesson curriculum, case studies, and statutory references in the player before re-attempting. Your progress and quiz scores are automatically synchronized in real-time across your devices.',
    highlights: [
      'Unlimited retakes at zero additional cost',
      'Immediate answer feedback and remediation explanations',
      'Real-time score recalculation upon meeting the 80% threshold',
    ],
  },
  {
    id: 'certificate-issuance',
    category: 'certificate',
    question: 'How and when is my Certificate of Completion issued?',
    answer:
      'Your certificate is generated automatically and immediately available once all modules in the course are completed with an 80% or higher assessment score. You can view, download, and print your certificate directly from your Course Dashboard or within the Course Player by clicking "View Diploma".',
    highlights: [
      'Instant digital issuance upon completing curriculum',
      'High-resolution PDF print format with official accreditation seals',
      'Permanent cloud backup in your student profile',
    ],
  },
  {
    id: 'audit-readiness',
    category: 'audit',
    question: 'Can this certificate be included in my firm\'s training records for compliance audits?',
    answer:
      'Yes. Every CompliSey Academy certificate features a unique cryptographic verification serial number (e.g., CS-AML-2026-XXXX), designated CPD credit hours, issuance date, and explicit curriculum alignment with the Seychelles AML/CFT Act 2020. This meets the documented training records required under Section 34 for reporting entity compliance files.',
    highlights: [
      'Contains unique verifiable serial ID and CPD units',
      'Directly fulfills Section 34 staff training criteria',
      'Designed for Seychelles Banks, CSPs, Securities Dealers, and TCSPs',
    ],
  },
  {
    id: 'certificate-validity',
    category: 'audit',
    question: 'How long is the AML/CFT certificate valid before refresher training is due?',
    answer:
      'In accordance with Seychelles statutory guidelines and international AML/CFT standards, reporting entities should maintain annual continuous staff training to address emerging typologies, updated sanctions lists, and internal compliance policy requirements.',
    highlights: [
      'Valid for 12 months (annual reporting cycle)',
      'Prepaid 12-month seats include seamless annual refresher updates',
      'Automatic renewal reminders 30 days prior to expiry',
    ],
  },
  {
    id: 'employer-verification',
    category: 'certificate',
    question: 'Can my Compliance Officer (MLRO) or employer verify my completion status?',
    answer:
      'Yes. Compliance Officers managing corporate accounts can inspect verified employee completion statuses, quiz percentage milestones, and issuance dates in real time from the Team Management and Proforma Invoice portals. Individual certificates can also be verified independently via the serial number.',
    highlights: [
      'Centralized compliance dashboard for MLROs',
      'Exportable team completion rosters for regulatory submissions',
      'Multi-device real-time sync ensures records are always up to date',
    ],
  },
];

export const CourseFaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'regulatory-status': true,
    'exam-requirement': true,
    'certificate-issuance': true,
  });
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'exam' | 'certificate' | 'audit'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    FAQ_DATA.forEach((item) => {
      allOpen[item.id] = true;
    });
    setOpenIds(allOpen);
  };

  const collapseAll = () => {
    setOpenIds({});
  };

  // Filter items based on category and search query
  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#071433] to-[#0c245c] text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#071433] flex items-center justify-center font-bold shrink-0 shadow-xs mt-0.5">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Compliance Knowledge Base
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-400/30">
                  Audit Verified
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                80% Exam Pass Mark & Certificate Issuance Guide
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Immediate answers to compliance course requirements, score benchmarks, unlimited assessment retakes, and official professional CPD training documentation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-slate-200 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-slate-200 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === 'all'
                  ? 'bg-amber-400 text-[#071433]'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              All FAQs ({FAQ_DATA.length})
            </button>
            <button
              onClick={() => setCategoryFilter('exam')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                categoryFilter === 'exam'
                  ? 'bg-amber-400 text-[#071433]'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>80% Exam & Retakes</span>
            </button>
            <button
              onClick={() => setCategoryFilter('certificate')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                categoryFilter === 'certificate'
                  ? 'bg-amber-400 text-[#071433]'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>Certificate Issuance</span>
            </button>
            <button
              onClick={() => setCategoryFilter('audit')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                categoryFilter === 'audit'
                  ? 'bg-amber-400 text-[#071433]'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>CPD Training Records</span>
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requirements..."
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="p-4 sm:p-6 divide-y divide-slate-100">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div key={faq.id} className="py-3.5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex items-start justify-between gap-3 text-left group transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                      {faq.question}
                    </span>
                  </div>

                  <div className="p-1 rounded-md text-slate-400 group-hover:text-slate-700 transition-colors">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 pl-0 pr-2 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>

                    {faq.highlights && faq.highlights.length > 0 && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Key Audit Takeaways:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {faq.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            No FAQ articles match your search &ldquo;{searchQuery}&rdquo;. Try another term or clear the filter.
          </div>
        )}
      </div>

      {/* Support Reduction Footer Banner */}
      <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Need help with a custom reporting entity staff accreditation or proforma invoice?
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-slate-500 text-xs">Admin &amp; Support:</span>
          <a
            href="mailto:malcolm@complisanc.com"
            className="font-semibold text-blue-700 hover:text-blue-900 underline font-mono"
            title="Contact Malcolm (Administration & Support)"
          >
            malcolm@complisanc.com
          </a>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500 text-xs">Training:</span>
          <a
            href="mailto:eric@complisanc.com"
            className="font-semibold text-blue-700 hover:text-blue-900 underline font-mono"
            title="Contact Eric D'Souza (Training Issues)"
          >
            eric@complisanc.com (Eric D'Souza)
          </a>
        </div>
      </div>
    </div>
  );
};
