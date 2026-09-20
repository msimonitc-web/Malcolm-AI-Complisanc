import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Smartphone,
  Share2,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Type,
  Palette,
  ExternalLink,
  ShieldCheck,
  Building2,
  Award,
  BookOpen,
  ArrowRight,
  Eye,
  Layers,
  Film,
  Instagram,
  Facebook,
  Linkedin,
  X,
  Volume2,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Music,
} from 'lucide-react';
import { CompliseyLogo } from './CompliseyLogo';
import { BANKING_DETAILS } from '../data/bankingDetails';

interface MarketingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type AspectRatioType = '9:16' | '1:1' | '16:9';
export type ThemePaletteType = 'navy_gold' | 'emerald_authority' | 'deep_sapphire' | 'obsidian_gold';

interface CampaignTemplate {
  id: string;
  name: string;
  category: 'Compliance Training' | 'Corporate Onboarding' | 'Director Governance' | 'Frontline Staff';
  slides: {
    eyebrow: string;
    headline: string;
    subtitle: string;
    statutoryRef: string;
    bullets: string[];
    ctaText: string;
    highlightTag: string;
  }[];
  captionInstagram: string;
  captionFacebook: string;
  captionLinkedin: string;
  hashtags: string[];
}

const TEMPLATES: CampaignTemplate[] = [
  {
    id: 'compliance_audit',
    name: 'Seychelles AML/CFT Training Alert',
    category: 'Compliance Training',
    slides: [
      {
        eyebrow: 'SEYCHELLES COMPLIANCE TRAINING ALERT',
        headline: 'Is Your Reporting Entity Compliance Audit-Ready?',
        subtitle: 'Annual AML/CFT staff training for regulated institutions in Seychelles.',
        statutoryRef: 'Seychelles AML/CFT Compliance Framework',
        bullets: [
          'Comprehensive training for all reporting entity personnel',
          'Strengthen institutional controls and mitigate liabilities',
          'Self-paced online certification with cryptographic verification',
        ],
        ctaText: 'Enroll Your Team at complisey.com',
        highlightTag: 'ANNUAL COMPLIANCE TRAINING',
      },
      {
        eyebrow: 'REGULATORY RISK & OVERSIGHT',
        headline: 'Strengthen Personal & Corporate Governance',
        subtitle: 'Defend your institution and leadership with documented training records.',
        statutoryRef: 'Seychelles FIU & FSA Supervisory Guidelines',
        bullets: [
          'Clear governance and accountability for directors & senior officers',
          'FSA supervisory audits scrutinize documented staff training logs',
          'Cryptographic QR certificates provide verifiable audit defense',
        ],
        ctaText: 'Protect Your License Now',
        highlightTag: 'SUPERVISORY OVERSIGHT',
      },
      {
        eyebrow: 'THE COMPLISEY SOLUTION',
        headline: 'Accredited Self-Paced Training in 6 Practical Modules',
        subtitle: 'Designed specifically for the Seychelles financial and corporate sector.',
        statutoryRef: 'Level 1 Foundations + Level 2 Advanced Operations',
        bullets: [
          'Interactive fund flow analysis & real Seychelles typologies',
          'Practical anti-tipping-off & STR filing protocols',
          'Instant proforma invoice with MCB Seychelles wire coordinates',
        ],
        ctaText: 'Explore Course Curriculum',
        highlightTag: 'DESIGNED FOR SEYCHELLES',
      },
      {
        eyebrow: 'FAST-TRACK CORPORATE ENROLLMENT',
        headline: 'Get Started Today with Direct Seychelles Bank Wire',
        subtitle: 'Settle via The Mauritius Commercial Bank (Seychelles) Ltd. for instant tokens.',
        statutoryRef: 'A/C: 00001073508 • SWIFT: MCBLSCSC • Currency: SCR',
        bullets: [
          'Generate instant corporate proforma with zero upfront credit card',
          'Automated receipt confirmation dispatched upon payment clearance',
          'One-click student token allocation for HR and compliance teams',
        ],
        ctaText: 'Visit academy.complisey.com',
        highlightTag: 'INSTANT ACTIVATION',
      },
    ],
    captionInstagram:
      "⚠️ Is your Seychelles reporting entity audit ready? Regular staff and director AML/CFT training is an essential compliance obligation under Seychelles regulatory standards. Mitigate governance liabilities with Complisey Academy's self-paced, verifiable online modules.\n\n📚 Instant corporate proforma invoicing with local MCB Seychelles bank wire settlement.\n\n🔗 Click the link in bio to enroll your team or visit academy.complisey.com",
    captionFacebook:
      "ATTENTION SEYCHELLES COMPLIANCE OFFICERS & DIRECTORS:\n\nUnder Seychelles regulatory standards, all reporting entities must ensure that their directors and employees receive regular, verifiable anti-money laundering and counter-terrorist financing training.\n\nDocumented annual training safeguards institutions and designated officers from regulatory findings and penalties.\n\nComplisey Academy provides:\n✅ Comprehensive 6-course curriculum tailored to Seychelles financial practice\n✅ Interactive case studies, fund flow analysis & safe STR escalation protocols\n✅ Downloadable verifiable certificates with cryptographic QR validation for institutional audit files\n✅ Direct settlement via The Mauritius Commercial Bank (Seychelles) Ltd.\n\nGenerate your corporate proforma invoice today at https://academy.complisey.com or contact eric@complisanc.com.",
    captionLinkedin:
      "Compliance Update for Seychelles Financial Institutions & Corporate Service Providers 🇸🇨\n\nSeychelles regulatory standards require reporting entities to maintain documented, ongoing AML/CFT training for all employees, directors, and compliance staff.\n\nComplisey Academy delivers accredited, self-paced online curriculum covering:\n• Legal & Regulatory Frameworks (FIU & FSA Guidelines)\n• Beneficial Ownership Transparency & CDD Verification\n• Sanctions Screening & Proliferation Financing\n• Transaction Monitoring & Suspicious Transaction Reporting (STR)\n• Preventing Confidentiality & Tipping-Off Breaches\n\nEquip your team with verifiable proof of compliance. Group corporate enrollments and proforma wire payments are available via The Mauritius Commercial Bank (Seychelles) Ltd.\n\nLearn more: https://academy.complisey.com | Contact: malcolm@complisanc.com",
    hashtags: [
      '#SeychellesAML',
      '#FIUSeychelles',
      '#ComplianceTraining',
      '#CorporateGovernanceSeychelles',
      '#AMLTraining',
      '#SeychellesBusiness',
      '#CompliseyAcademy',
    ],
  },
  {
    id: 'corporate_onboarding',
    name: 'Corporate Training in 4 Easy Steps',
    category: 'Corporate Onboarding',
    slides: [
      {
        eyebrow: 'CORPORATE COMPLIANCE SIMPLIFIED',
        headline: 'Train Your Seychelles Team in 4 Simple Steps',
        subtitle: 'From enrollment to verified certification in under 48 hours.',
        statutoryRef: 'Seychelles AML/CFT Compliance Program',
        bullets: [
          'No complex setup or upfront credit card required',
          'Consolidated billing across multiple company departments',
          'Centralized management in the Corporate Admin Portal',
        ],
        ctaText: 'See How Easy It Is',
        highlightTag: 'STEP-BY-STEP WORKFLOW',
      },
      {
        eyebrow: 'STEP 1: SELECT SEATS & PROFORMA',
        headline: 'Instant Proforma Invoicing in Seychelles Rupees (SCR)',
        subtitle: 'Select individual courses or the 6-module master curriculum pack.',
        statutoryRef: 'Proforma Reference Generated Automatically',
        bullets: [
          'Choose exact staff seat count with automatic volume discounts',
          'Receive official Seychelles proforma (PRF-CS-2026-XXXX)',
          'Clear tax invoicing ready for corporate accounting approval',
        ],
        ctaText: 'Calculate Group Savings',
        highlightTag: 'STEP 1: PROFORMA',
      },
      {
        eyebrow: 'STEP 2: DIRECT MCB BANK WIRE',
        headline: 'The Mauritius Commercial Bank (Seychelles) Ltd.',
        subtitle: 'Designated domestic settlement account in Victoria, Mahe.',
        statutoryRef: 'A/C: 00001073508 • SWIFT: MCBLSCSC • Currency: SCR',
        bullets: [
          'Wire transfer directly from your Seychelles corporate account',
          'Quote your CCS Booking ID in transfer narration for rapid matching',
          'Admin verifies payment and issues official confirmation receipt',
        ],
        ctaText: 'View Bank Coordinates',
        highlightTag: 'STEP 2: WIRE TRANSFER',
      },
      {
        eyebrow: 'STEP 3 & 4: TOKENS & CERTIFICATION',
        headline: 'Instant Token Unlock & Cryptographic Certificates',
        subtitle: 'Staff study online, pass quizzes (80%), and claim compliance proof.',
        statutoryRef: 'Verifiable Certification for Audit Records',
        bullets: [
          'Employees redeem tokens in one click with 12 months access',
          'Track real-time completion progress in the HR dashboard',
          'Download official certificates with verifiable QR audit codes',
        ],
        ctaText: 'Start Corporate Enrollment',
        highlightTag: 'STEP 3 & 4: CERTIFY',
      },
    ],
    captionInstagram:
      "How to train your entire Seychelles compliance team in 4 simple steps 🚀\n\n1️⃣ Select courses in the Cart & generate an official proforma\n2️⃣ Settle via domestic wire to MCB Seychelles (A/C: 00001073508)\n3️⃣ Distribute fast-track activation tokens to your staff\n4️⃣ Download verifiable certificates with QR codes for compliance audit files!\n\nNo upfront credit card required. Visit academy.complisey.com to register your team today.",
    captionFacebook:
      "Streamline AML compliance training for your Seychelles company:\n\nComplisey Academy makes corporate compliance frictionless with our 4-step corporate onboarding system:\n\n1. Select staff seats in our online catalog\n2. Settle via local bank transfer to The Mauritius Commercial Bank (Seychelles) Ltd.\n3. Receive instant activation tokens and automated receipt confirmation\n4. Monitor employee progress and download verifiable completion certificates\n\nGet started today at https://academy.complisey.com",
    captionLinkedin:
      "Corporate AML/CFT Training Made Simple for Seychelles Reporting Entities.\n\nManaging staff AML/CFT training compliance in Seychelles doesn't have to be complicated. Complisey Academy's enterprise portal allows compliance officers and HR managers to:\n\n• Procure group seats with volume pricing\n• Pay via domestic wire to MCB Seychelles (Victoria branch)\n• Provision access instantly via magic tokens\n• Export verifiable audit logs for regulatory reviews\n\nSchedule your team's enrollment: https://academy.complisey.com",
    hashtags: [
      '#SeychellesCompliance',
      '#CorporateTraining',
      '#AMLTraining',
      '#FIUSeychelles',
      '#HRManagementSeychelles',
      '#CompliseyAcademy',
    ],
  },
  {
    id: 'director_governance',
    name: 'Directors & Senior Management Governance',
    category: 'Director Governance',
    slides: [
      {
        eyebrow: 'BOARD OF DIRECTORS & SENIOR MANAGEMENT',
        headline: 'Directors: Are You Protected with Documented Governance?',
        subtitle: 'Governance and compliance accountability under the Seychelles regulatory framework.',
        statutoryRef: 'Governance & Supervisory Guidelines',
        bullets: [
          'Institutional non-compliance creates serious governance liability',
          'Directors must demonstrate documented oversight of AML controls',
          'Supervisory scrutiny of AML frameworks and MLRO reporting',
        ],
        ctaText: 'Protect Your Governance Track Record',
        highlightTag: 'BOARD GOVERNANCE',
      },
      {
        eyebrow: 'SUPERVISORY OVERSIGHT STANDARDS',
        headline: 'What Regulators Expect From the Board',
        subtitle: 'Moving beyond tick-box compliance to defensible governance.',
        statutoryRef: 'Seychelles National Risk Assessment (NRA) Guidance',
        bullets: [
          'Approval and annual review of corporate AML/CFT risk assessments',
          'Resource allocation for continuous staff and executive education',
          'Independent audit reviews and robust escalation procedures',
        ],
        ctaText: 'Access Executive Briefing',
        highlightTag: 'GOVERNANCE AUDIT',
      },
      {
        eyebrow: 'THE COMPLISEY EXECUTIVE MODULE',
        headline: 'Executive Governance & Risk Masterclass',
        subtitle: 'High-impact 45-minute training specifically for board members.',
        statutoryRef: 'Practical Case Studies & Governance Strategies',
        bullets: [
          'Clear explanation of regulatory duties and institutional exposure',
          'Safeguarding against tipping-off and confidentiality violations',
          'Documented compliance verification for corporate audit files',
        ],
        ctaText: 'Enroll Board Members Today',
        highlightTag: 'EXECUTIVE TRACK',
      },
      {
        eyebrow: 'CERTIFIED DEFENSE',
        headline: 'Incontrovertible Audit Trail for Your Board',
        subtitle: 'Cryptographic proof of training ready for regulatory reviews.',
        statutoryRef: 'The Mauritius Commercial Bank (Seychelles) Ltd. Settlement',
        bullets: [
          'Verifiable CPD hours and unique digital certification',
          'Confidential executive enrollment via direct bank transfer',
          'Instant proforma invoice generated for corporate accounts',
        ],
        ctaText: 'Contact: malcolm@complisanc.com',
        highlightTag: 'OFFICIAL CERTIFICATION',
      },
    ],
    captionInstagram:
      "Directors & Compliance Officers in Seychelles ⚖️\n\nDid you know that Seychelles regulatory standards emphasize direct accountability for senior management and directors in cases of institutional non-compliance? Complisey Academy's Board of Directors track provides the exact governance safeguards and verifiable proof your board needs for supervisory reviews.\n\n🔗 Protect your board at academy.complisey.com",
    captionFacebook:
      "BOARD OF DIRECTORS GOVERNANCE UNDER SEYCHELLES LAW:\n\nRegulators in Seychelles are increasingly scrutinizing the tone at the top. Directors and senior managers must ensure institutional compliance and adequate staff AML/CFT training.\n\nComplisey Academy's Executive Track gives your board:\n• Clear understanding of regulatory obligations and governance safeguards\n• Strategies to strengthen institutional compliance\n• Verifiable certification for institutional audit files\n\nDirect bank wire settlement available via The Mauritius Commercial Bank (Seychelles) Ltd.\n\nEnroll your board: https://academy.complisey.com",
    captionLinkedin:
      "Director & Executive Governance under Seychelles Regulatory Framework 🏛️\n\nCorporate governance is under the spotlight. Regulators require documented proof that boards exercise genuine oversight of their AML/CFT compliance frameworks.\n\nComplisey Academy offers specialized executive training designed to protect board members and MLROs by establishing clear audit trails of compliance knowledge and regulatory adherence.\n\nSettle corporate accounts easily with local wire transfer to MCB Seychelles.\n\nExplore our executive tracks: https://academy.complisey.com",
    hashtags: [
      '#CorporateGovernanceSeychelles',
      '#BoardGovernance',
      '#SeychellesAML',
      '#FIUSeychelles',
      '#CompliseyAcademy',
    ],
  },
  {
    id: 'frontline_staff',
    name: 'Frontline Staff & Red-Flag Detection',
    category: 'Frontline Staff',
    slides: [
      {
        eyebrow: 'FRONTLINE STAFF & CLIENT HANDLING',
        headline: 'Detecting Red Flags & Managing Confidentiality',
        subtitle: 'Crucial day-to-day compliance for client-facing and operational staff.',
        statutoryRef: 'Anti-Tipping-Off & Reporting Protocols',
        bullets: [
          'Strictly prevents tipping off customers subject to inquiry or review',
          'Early red-flag identification during customer due diligence (CDD)',
          'Safe and confidential escalation to your internal MLRO',
        ],
        ctaText: 'Train Your Frontline Staff',
        highlightTag: 'ANTI-TIPPING-OFF',
      },
      {
        eyebrow: 'CUSTOMER DUE DILIGENCE (CDD)',
        headline: 'Beyond the Passport Copy: True Risk Assessment',
        subtitle: 'Practical guidance based on Seychelles regulatory alerts.',
        statutoryRef: 'Source of Wealth & Beneficial Ownership Protocols',
        bullets: [
          'Identifying complex corporate layering and nominee structures',
          'Screening politically exposed persons (PEPs) and close associates',
          'Trigger events requiring immediate CDD refreshment',
        ],
        ctaText: 'See Practical Scenarios',
        highlightTag: 'CDD VERIFICATION',
      },
      {
        eyebrow: 'INTERACTIVE CASE STUDIES',
        headline: 'Learn by Doing with Simulated Fund Flow Scenarios',
        subtitle: 'Realistic Seychelles and international financial crime case studies.',
        statutoryRef: 'High-Yield Quizzes with 80% Passing Threshold',
        bullets: [
          'Visual interactive fund flow graphs and red-flag spotting exercises',
          'Clear explanations grounded in compliance best practices',
          'Unlimited attempts to ensure genuine operational understanding',
        ],
        ctaText: 'Start Learning Today',
        highlightTag: 'INTERACTIVE LEARNING',
      },
      {
        eyebrow: 'INSTANT RECOGNITION',
        headline: 'Empower Your Team with Verifiable Credentials',
        subtitle: 'Annual certification that demonstrates compliance to regulators.',
        statutoryRef: 'Complisey Academy • Victoria, Mahe, Seychelles',
        bullets: [
          'Self-paced completion per interactive module',
          'Cryptographic certificates with QR code verification',
          'Seamless corporate proforma billing via MCB Seychelles',
        ],
        ctaText: 'Visit academy.complisey.com',
        highlightTag: 'PROVEN EXCELLENCE',
      },
    ],
    captionInstagram:
      "Tipping off a client regarding an AML inquiry or report is a serious violation under Seychelles law. 🛑\n\nEnsure your frontline and client-facing staff know how to detect red flags, verify beneficial ownership, and safely escalate suspicious activity without committing tipping-off breaches. Complisey Academy's interactive training makes compliance engaging and practical.\n\n🔗 Enroll your staff at academy.complisey.com",
    captionFacebook:
      "Protect your institution from anti-tipping-off violations:\n\nClient-facing staff are your first line of defense. Complisey Academy's Frontline Training Module equips customer service, account managers, and administrative staff with the exact skills needed to:\n\n• Identify suspicious transaction patterns without tipping off the client\n• Verify complex beneficial ownership structures\n• Maintain strict confidentiality during internal MLRO escalations\n\nCorporate group bookings available with settlement into The Mauritius Commercial Bank (Seychelles) Ltd.\n\nEnroll your team today at https://academy.complisey.com",
    captionLinkedin:
      "Frontline Compliance: The First Line of Defense for Seychelles Reporting Entities 🛡️\n\nInadvertent tipping off carries severe regulatory penalties. Frontline employees must understand how to interact professionally with customers while managing sensitive suspicious transaction reporting (STR) protocols.\n\nComplisey Academy's practical simulations and case studies ensure your staff can:\n1. Spot subtle red flags during onboarding and transaction processing\n2. Follow compliant internal reporting lines to the MLRO\n3. Preserve confidentiality during regulatory inquiries\n\nEquip your frontline staff with certified skills: https://academy.complisey.com",
    hashtags: [
      '#AntiTippingOff',
      '#CDDCompliance',
      '#SeychellesAML',
      '#FinancialCrime',
      '#FrontlineStaff',
      '#CompliseyAcademy',
    ],
  },
];

export const MarketingStudioModal: React.FC<MarketingStudioModalProps> = ({ isOpen, onClose }) => {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [palette, setPalette] = useState<ThemePaletteType>('navy_gold');
  const [activeCaptionTab, setActiveCaptionTab] = useState<'instagram' | 'facebook' | 'linkedin'>('instagram');

  // Reel simulation states
  const [isPlayingReel, setIsPlayingReel] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Editable overlay text (defaults to current slide content)
  const currentTemplate = TEMPLATES[selectedTemplateIndex];
  const currentSlide = currentTemplate.slides[activeSlideIndex] || currentTemplate.slides[0];

  const [editEyebrow, setEditEyebrow] = useState(currentSlide.eyebrow);
  const [editHeadline, setEditHeadline] = useState(currentSlide.headline);
  const [editSubtitle, setEditSubtitle] = useState(currentSlide.subtitle);
  const [editStatutoryRef, setEditStatutoryRef] = useState(currentSlide.statutoryRef);
  const [editCta, setEditCta] = useState(currentSlide.ctaText);

  // Canvas ref for exporting high-resolution image
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep editor state in sync when slide or template changes
  useEffect(() => {
    const s = currentTemplate.slides[activeSlideIndex] || currentTemplate.slides[0];
    setEditEyebrow(s.eyebrow);
    setEditHeadline(s.headline);
    setEditSubtitle(s.subtitle);
    setEditStatutoryRef(s.statutoryRef);
    setEditCta(s.ctaText);
  }, [selectedTemplateIndex, activeSlideIndex]);

  // Reel auto-play timer simulation (cycles slides every 4 seconds)
  useEffect(() => {
    if (!isPlayingReel) return;

    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % currentTemplate.slides.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [isPlayingReel, currentTemplate.slides.length]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // High-Resolution HTML5 Canvas Export Engine
  const exportHighResImage = () => {
    setIsDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsDownloading(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // Set resolution based on aspect ratio
    let width = 1080;
    let height = 1920; // 9:16
    if (aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    // Palette colors
    let bgGradStart = '#071433';
    let bgGradEnd = '#020817';
    let accentColor = '#d9a438'; // gold
    let secondaryAccent = '#facc15';

    if (palette === 'emerald_authority') {
      bgGradStart = '#06281e';
      bgGradEnd = '#02100c';
      accentColor = '#10b981';
      secondaryAccent = '#34d399';
    } else if (palette === 'deep_sapphire') {
      bgGradStart = '#0b2559';
      bgGradEnd = '#040d21';
      accentColor = '#38bdf8';
      secondaryAccent = '#60a5fa';
    } else if (palette === 'obsidian_gold') {
      bgGradStart = '#18181b';
      bgGradEnd = '#09090b';
      accentColor = '#eab308';
      secondaryAccent = '#fde047';
    }

    // 1. Draw rich gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, bgGradStart);
    grad.addColorStop(1, bgGradEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw subtle geometric luxury watermarks/accents
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width, 0, width * 0.4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, height, width * 0.35, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Draw outer gold framing border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = width * 0.008;
    ctx.strokeRect(width * 0.04, height * 0.03, width * 0.92, height * 0.94);

    // 4. Header Badge / Crest area
    ctx.textAlign = 'center';
    ctx.fillStyle = accentColor;
    ctx.font = `bold ${Math.round(width * 0.024)}px sans-serif`;
    ctx.fillText('COMPLISEY ACADEMY • SEYCHELLES', width / 2, height * 0.08);

    // Eyebrow tag in pill
    ctx.fillStyle = 'rgba(217, 164, 56, 0.2)';
    const eyebrowWidth = width * 0.65;
    const eyebrowHeight = height * 0.035;
    ctx.fillRect(width / 2 - eyebrowWidth / 2, height * 0.11, eyebrowWidth, eyebrowHeight);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width / 2 - eyebrowWidth / 2, height * 0.11, eyebrowWidth, eyebrowHeight);

    ctx.fillStyle = secondaryAccent;
    ctx.font = `bold ${Math.round(width * 0.02)}px sans-serif`;
    ctx.fillText(editEyebrow.toUpperCase(), width / 2, height * 0.11 + eyebrowHeight * 0.7);

    // 5. Main Headline (wrapped)
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(width * 0.05)}px sans-serif`;
    const headlineLines = wrapText(ctx, editHeadline, width * 0.8);
    let curY = height * 0.22;
    headlineLines.forEach((line) => {
      ctx.fillText(line, width / 2, curY);
      curY += height * 0.055;
    });

    // 6. Subtitle & Statutory Ref Box
    curY += height * 0.02;
    ctx.fillStyle = '#94a3b8';
    ctx.font = `${Math.round(width * 0.026)}px sans-serif`;
    const subtitleLines = wrapText(ctx, editSubtitle, width * 0.78);
    subtitleLines.forEach((line) => {
      ctx.fillText(line, width / 2, curY);
      curY += height * 0.035;
    });

    curY += height * 0.03;
    ctx.fillStyle = accentColor;
    ctx.font = `bold ${Math.round(width * 0.026)}px sans-serif`;
    ctx.fillText(`⚖️ ${editStatutoryRef}`, width / 2, curY);

    // 7. Feature bullet card box
    curY += height * 0.05;
    const boxW = width * 0.84;
    const boxH = height * 0.24;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(width / 2 - boxW / 2, curY, boxW, boxH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width / 2 - boxW / 2, curY, boxW, boxH);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = `${Math.round(width * 0.025)}px sans-serif`;

    let bulletY = curY + height * 0.05;
    currentSlide.bullets.slice(0, 3).forEach((b) => {
      ctx.fillStyle = accentColor;
      ctx.fillText('✔', width / 2 - boxW / 2 + width * 0.04, bulletY);
      ctx.fillStyle = '#f8fafc';
      const bLines = wrapText(ctx, b, boxW - width * 0.1);
      bLines.forEach((line, lIdx) => {
        ctx.fillText(line, width / 2 - boxW / 2 + width * 0.08, bulletY + lIdx * height * 0.03);
      });
      bulletY += height * 0.06;
    });

    // 8. Bank Coordinates Pill
    curY += boxH + height * 0.035;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fillRect(width / 2 - boxW / 2, curY, boxW, height * 0.05);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.strokeRect(width / 2 - boxW / 2, curY, boxW, height * 0.05);

    ctx.fillStyle = '#34d399';
    ctx.font = `bold ${Math.round(width * 0.02)}px monospace`;
    ctx.fillText('MCB Seychelles Wire Settlement • A/C: 00001073508 (SCR)', width / 2, curY + height * 0.032);

    // 9. Call to Action Button
    curY += height * 0.075;
    const ctaW = width * 0.75;
    const ctaH = height * 0.055;
    ctx.fillStyle = accentColor;
    ctx.fillRect(width / 2 - ctaW / 2, curY, ctaW, ctaH);

    ctx.fillStyle = '#071433';
    ctx.font = `bold ${Math.round(width * 0.026)}px sans-serif`;
    ctx.fillText(editCta.toUpperCase(), width / 2, curY + ctaH * 0.65);

    // 10. Footer Notice
    ctx.fillStyle = '#64748b';
    ctx.font = `${Math.round(width * 0.018)}px sans-serif`;
    ctx.fillText('Complisanc Consulting Services (SEY) • academy.complisey.com', width / 2, height * 0.94);

    // Download the rendered canvas
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `complisey-marketing-${currentTemplate.id}-slide-${activeSlideIndex + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export canvas image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Hidden canvas for high-resolution 1080p image rendering */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-6xl bg-white dark:bg-[#071433] rounded-3xl shadow-2xl border border-slate-200 dark:border-amber-400/20 overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#071433] text-white border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                  Social Media &amp; Reels Studio
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  Facebook, Instagram Reels &amp; LinkedIn Marketing Kit
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                CompliSey Marketing &amp; Reel Template Studio
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportHighResImage}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Exporting...' : 'Export High-Res Card (PNG)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Controls, Campaign Presets & Content Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Campaign Preset Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block">
                Choose Campaign Preset:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEMPLATES.map((tmpl, idx) => {
                  const isSelected = selectedTemplateIndex === idx;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        setSelectedTemplateIndex(idx);
                        setActiveSlideIndex(0);
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-400/15 border-amber-400 text-slate-900 dark:text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-[#0a183d]/40 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-500 dark:text-amber-300 block">
                          {tmpl.category}
                        </span>
                        <h4 className="text-xs font-bold mt-0.5 leading-snug">{tmpl.name}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-2">
                        {tmpl.slides.length} Reel Slides • Copy &amp; Hashtags Ready
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format & Palette Controls */}
            <div className="p-4 bg-slate-50 dark:bg-[#0a183d]/60 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Aspect Ratio selector */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                    Format &amp; Ratio
                  </span>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setAspectRatio('9:16')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        aspectRatio === '9:16'
                          ? 'bg-amber-400 text-[#071433]'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      9:16 (Reel / Story)
                    </button>
                    <button
                      onClick={() => setAspectRatio('1:1')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        aspectRatio === '1:1'
                          ? 'bg-amber-400 text-[#071433]'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      1:1 (Square Feed)
                    </button>
                    <button
                      onClick={() => setAspectRatio('16:9')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        aspectRatio === '16:9'
                          ? 'bg-amber-400 text-[#071433]'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      16:9 (Landscape)
                    </button>
                  </div>
                </div>

                {/* Color theme selector */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                    Branding Theme
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPalette('navy_gold')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        palette === 'navy_gold'
                          ? 'bg-[#071433] text-amber-300 border-amber-400 ring-2 ring-amber-400/40'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Navy &amp; Gold
                    </button>
                    <button
                      onClick={() => setPalette('emerald_authority')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        palette === 'emerald_authority'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-400 ring-2 ring-emerald-400/40'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Emerald
                    </button>
                    <button
                      onClick={() => setPalette('deep_sapphire')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        palette === 'deep_sapphire'
                          ? 'bg-blue-950 text-sky-300 border-sky-400 ring-2 ring-sky-400/40'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Sapphire
                    </button>
                    <button
                      onClick={() => setPalette('obsidian_gold')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        palette === 'obsidian_gold'
                          ? 'bg-zinc-950 text-yellow-300 border-yellow-400 ring-2 ring-yellow-400/40'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Obsidian
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide Navigation Scrubber */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingReel(!isPlayingReel)}
                    className="w-7 h-7 rounded-full bg-amber-400 text-[#071433] hover:bg-amber-300 flex items-center justify-center transition-transform cursor-pointer font-bold"
                    title={isPlayingReel ? 'Pause Reel Auto-Play' : 'Simulate Reel Auto-Play'}
                  >
                    {isPlayingReel ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Slide {activeSlideIndex + 1} of {currentTemplate.slides.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {currentTemplate.slides.map((_, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setActiveSlideIndex(sIdx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeSlideIndex === sIdx
                          ? 'bg-amber-400 text-[#071433] shadow-xs'
                          : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {sIdx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* In-Place Slide Text Editor */}
            <div className="p-4 bg-slate-50 dark:bg-[#0a183d]/60 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Edit Visual Slide Copy in Real-Time
                  </h4>
                </div>
                <button
                  onClick={() => {
                    const s = currentTemplate.slides[activeSlideIndex];
                    setEditEyebrow(s.eyebrow);
                    setEditHeadline(s.headline);
                    setEditSubtitle(s.subtitle);
                    setEditStatutoryRef(s.statutoryRef);
                    setEditCta(s.ctaText);
                  }}
                  className="text-[11px] text-slate-500 hover:text-amber-500 font-medium cursor-pointer"
                >
                  Reset Slide
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Eyebrow / Header Pill
                  </label>
                  <input
                    type="text"
                    value={editEyebrow}
                    onChange={(e) => setEditEyebrow(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Main Hook / Headline
                  </label>
                  <input
                    type="text"
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Subtitle / Context
                  </label>
                  <textarea
                    rows={2}
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Compliance Reference / Tagline
                    </label>
                    <input
                      type="text"
                      value={editStatutoryRef}
                      onChange={(e) => setEditStatutoryRef(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Call to Action Button
                    </label>
                    <input
                      type="text"
                      value={editCta}
                      onChange={(e) => setEditCta(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ready-to-Publish Caption Pack */}
            <div className="p-4 bg-slate-50 dark:bg-[#0a183d]/60 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Copy-Paste Social Captions &amp; Hashtags
                  </h4>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveCaptionTab('instagram')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeCaptionTab === 'instagram'
                        ? 'bg-rose-500 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Instagram className="w-3 h-3" />
                    <span>Reel / IG</span>
                  </button>
                  <button
                    onClick={() => setActiveCaptionTab('facebook')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeCaptionTab === 'facebook'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Facebook className="w-3 h-3" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => setActiveCaptionTab('linkedin')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeCaptionTab === 'linkedin'
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Linkedin className="w-3 h-3" />
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={4}
                  value={
                    activeCaptionTab === 'instagram'
                      ? `${currentTemplate.captionInstagram}\n\n${currentTemplate.hashtags.join(' ')}`
                      : activeCaptionTab === 'facebook'
                      ? `${currentTemplate.captionFacebook}\n\n${currentTemplate.hashtags.join(' ')}`
                      : `${currentTemplate.captionLinkedin}\n\n${currentTemplate.hashtags.join(' ')}`
                  }
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed focus:outline-hidden"
                />
                <button
                  onClick={() => {
                    const text =
                      activeCaptionTab === 'instagram'
                        ? `${currentTemplate.captionInstagram}\n\n${currentTemplate.hashtags.join(' ')}`
                        : activeCaptionTab === 'facebook'
                        ? `${currentTemplate.captionFacebook}\n\n${currentTemplate.hashtags.join(' ')}`
                        : `${currentTemplate.captionLinkedin}\n\n${currentTemplate.hashtags.join(' ')}`;
                    handleCopy(text, 'caption');
                  }}
                  className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedText === 'caption' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption &amp; Tags</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hashtag chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentTemplate.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Reel Simulator & Interactive Phone Frame (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="text-center mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-300 block">
                Live Interactive Visual Preview
              </span>
              <p className="text-xs text-slate-500">
                Previewing: {aspectRatio === '9:16' ? '9:16 Vertical Reel' : aspectRatio === '1:1' ? '1:1 Square Feed' : '16:9 Landscape'}
              </p>
            </div>

            {/* Mobile / Reel Frame Container */}
            <div
              className={`relative shadow-2xl rounded-[36px] p-3 border-[6px] border-slate-900 dark:border-slate-800 bg-slate-900 transition-all ${
                aspectRatio === '9:16'
                  ? 'w-[300px] sm:w-[330px] aspect-[9/16]'
                  : aspectRatio === '1:1'
                  ? 'w-[320px] sm:w-[360px] aspect-square rounded-3xl'
                  : 'w-full max-w-[420px] aspect-[16/9] rounded-3xl'
              }`}
            >
              {/* Inner Card Screen */}
              <div
                className={`w-full h-full rounded-[26px] overflow-hidden flex flex-col justify-between p-4 sm:p-5 relative select-none ${
                  palette === 'navy_gold'
                    ? 'bg-gradient-to-b from-[#071433] via-[#050e24] to-[#020817] text-white'
                    : palette === 'emerald_authority'
                    ? 'bg-gradient-to-b from-[#06281e] via-[#031711] to-[#020b08] text-white'
                    : palette === 'deep_sapphire'
                    ? 'bg-gradient-to-b from-[#0b2559] via-[#06173a] to-[#030d21] text-white'
                    : 'bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white'
                }`}
              >
                {/* 9:16 Reel Story Progress Bars at Top */}
                {aspectRatio === '9:16' && (
                  <div className="flex items-center gap-1 mb-2">
                    {currentTemplate.slides.map((_, sIdx) => {
                      const isPast = activeSlideIndex > sIdx;
                      const isCurr = activeSlideIndex === sIdx;
                      return (
                        <div key={sIdx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isPast
                                ? 'w-full bg-white'
                                : isCurr
                                ? isPlayingReel
                                  ? 'w-full bg-amber-400 animate-pulse'
                                  : 'w-1/2 bg-amber-400'
                                : 'w-0'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reel Header */}
                <div className="space-y-1.5 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center shadow-xs">
                        <CompliseyLogo className="w-full h-full" cColor="#1d3c6a" ankhColor="#d9a438" />
                      </div>
                      <span className="text-[11px] font-black tracking-wider text-amber-300">
                        COMPLISEY ACADEMY
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">SEYCHELLES</span>
                  </div>

                  {/* Eyebrow Pill */}
                  <div className="inline-block px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[9px] font-black uppercase tracking-wider text-amber-300">
                    {editEyebrow}
                  </div>
                </div>

                {/* Card Center Hook & Legal Content */}
                <div className="my-auto space-y-2.5 z-10 py-2">
                  <h3 className="text-base sm:text-lg font-black leading-snug tracking-tight text-white line-clamp-3">
                    {editHeadline}
                  </h3>

                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                    {editSubtitle}
                  </p>

                  <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 text-[10px] space-y-1 backdrop-blur-xs">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span className="truncate">{editStatutoryRef}</span>
                    </div>
                    {currentSlide.bullets.slice(0, 2).map((b, bIdx) => (
                      <div key={bIdx} className="text-slate-200 flex items-start gap-1">
                        <span className="text-amber-400 font-bold">✔</span>
                        <span className="truncate">{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* MCB Seychelles settlement reminder */}
                  <div className="p-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-[9px] text-emerald-300 font-mono text-center">
                    Settlement: MCB Seychelles • A/C: 00001073508
                  </div>
                </div>

                {/* Reel Footer & CTA */}
                <div className="space-y-2 z-10">
                  <button className="w-full py-2 rounded-xl bg-amber-400 text-[#071433] text-xs font-black uppercase tracking-wider shadow-md hover:bg-amber-300 transition-colors">
                    {editCta}
                  </button>

                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-white/10">
                    <span>academy.complisey.com</span>
                    <span className="font-semibold text-slate-300">AML/CFT Training</span>
                  </div>
                </div>

                {/* Simulated Instagram Reel Right Actions (Only in 9:16 mode) */}
                {aspectRatio === '9:16' && (
                  <div className="absolute right-2 bottom-20 flex flex-col items-center gap-3 text-white z-20">
                    <div className="flex flex-col items-center">
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span className="text-[9px] font-bold">1.4k</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-[9px]">48</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Send className="w-4 h-4" />
                      <span className="text-[9px]">Share</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Bookmark className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Export Action */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={exportHighResImage}
                disabled={isDownloading}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Generating Image...' : 'Download This Slide (PNG)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-[#050c1e] border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Export Specs:</span>
            <span>1080x1920 (9:16) / 1080x1080 (1:1) • High-DPI Canvas • Ready for Instagram, Facebook &amp; LinkedIn</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
