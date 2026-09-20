import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Building2,
  CreditCard,
  Key,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  X,
  Volume2,
  VolumeX,
  ExternalLink,
  Copy,
  Check,
  Video,
  ListOrdered,
  HelpCircle,
  FileText,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { BANKING_DETAILS } from '../data/bankingDetails';
import { CompliseyLogo } from './CompliseyLogo';

interface RegistrationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCatalog?: () => void;
  onOpenTokenModal?: () => void;
  onOpenCart?: () => void;
}

export const RegistrationWizardModal: React.FC<RegistrationWizardModalProps> = ({
  isOpen,
  onClose,
  onOpenCatalog,
  onOpenTokenModal,
  onOpenCart,
}) => {
  const {
    currentUser,
    setActiveTab,
    setIsRedeemModalOpen,
    setIsCartOpen,
    setSelectedProformaForView,
    orders,
  } = useAcademy();

  const [activeMode, setActiveMode] = useState<'video' | 'steps'>('video');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Video simulation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Custom video embed support
  const [customEmbedUrl, setCustomEmbedUrl] = useState<string>(() => {
    return localStorage.getItem('complisey_custom_tutorial_video') || '';
  });
  const [showEmbedInput, setShowEmbedInput] = useState(false);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  const CHAPTERS = [
    {
      id: 'chap-1',
      title: 'Course Selection & Proforma Invoicing',
      timestamp: '00:00 - 00:45',
      startPct: 0,
      endPct: 25,
      summary: 'Explore Level 1, Level 2, or Full 6-Course Curriculum and generate corporate proforma with zero upfront credit card.',
      tag: 'Step 1',
    },
    {
      id: 'chap-2',
      title: 'MCB Seychelles Bank Settlement',
      timestamp: '00:45 - 01:30',
      startPct: 25,
      endPct: 50,
      summary: 'Wire payment to The Mauritius Commercial Bank (Seychelles) Ltd. (A/C: 00001073508) referencing your CCS Booking Code.',
      tag: 'Step 2',
    },
    {
      id: 'chap-3',
      title: 'Instant Activation & Token Unlock',
      timestamp: '01:30 - 02:15',
      startPct: 50,
      endPct: 75,
      summary: 'Admin verifies credit, sends official payment receipt confirmation email, and issues fast-track LMS activation tokens.',
      tag: 'Step 3',
    },
    {
      id: 'chap-4',
      title: 'Interactive Learning & Verifiable Certificates',
      timestamp: '02:15 - 03:00',
      startPct: 75,
      endPct: 100,
      summary: 'Work through interactive case studies, achieve 80% passing grade on final exams, and download QR-verified certificates for compliance audit files.',
      tag: 'Step 4',
    },
  ];

  // Video progress timer simulation
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTimeRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setVideoProgress((prev) => {
        // Full video is 180 seconds (3 mins)
        const rate = (100 / 180) * playbackSpeed;
        const next = prev + rate * delta;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Sync active chapter with video progress
  useEffect(() => {
    const idx = CHAPTERS.findIndex((c) => videoProgress >= c.startPct && videoProgress < c.endPct);
    if (idx !== -1 && idx !== activeChapterIndex) {
      setActiveChapterIndex(idx);
    }
  }, [videoProgress]);

  const handleSeek = (percentage: number) => {
    setVideoProgress(percentage);
    const idx = CHAPTERS.findIndex((c) => percentage >= c.startPct && percentage <= c.endPct);
    if (idx !== -1) setActiveChapterIndex(idx);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveCustomEmbed = (url: string) => {
    setCustomEmbedUrl(url);
    localStorage.setItem('complisey_custom_tutorial_video', url);
    setShowEmbedInput(false);
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('complisey_onboarding_dismissed', 'true');
    }
    onClose();
  };

  const STEPS_DATA = [
    {
      step: '01',
      title: 'Select Courses or Curriculum Pack',
      subtitle: 'Individual staff enrollments or multi-seat corporate packages',
      icon: BookOpen,
      color: 'blue',
      description:
        'Browse our curriculum tailored specifically for Seychelles reporting entities. You can choose individual modules (SCR 2,500 / $175), Level 1 Foundations, Level 2 Advanced Operations, or the complete 6-course master pack with automatic multi-seat discounts.',
      bullets: [
        'Self-paced, available 24/7 across desktop, tablet, and mobile',
        'Includes downloadable compliance toolkits, audit checklists & red-flag summaries',
        'Add items to the Checkout Cart to consolidate multiple departments into one invoice',
      ],
      actionLabel: 'Browse Course Catalog',
      action: () => {
        handleClose();
        if (onOpenCatalog) onOpenCatalog();
        else setActiveTab('explore');
      },
    },
    {
      step: '02',
      title: 'Receive Proforma Invoice & Bank Details',
      subtitle: 'Settlement via The Mauritius Commercial Bank (Seychelles) Ltd.',
      icon: CreditCard,
      color: 'emerald',
      description:
        'Upon checkout or registration, the system immediately generates an official Seychelles Proforma Invoice (PRF-CS-2026-XXXX) and unique CCS Booking ID. No credit card is required upfront. The proforma contains complete designated wire transfer coordinates.',
      bullets: [
        `Beneficiary Bank: ${BANKING_DETAILS.bankName}`,
        `Account Name: ${BANKING_DETAILS.accountName}`,
        `Account Number: ${BANKING_DETAILS.accountNumber} • SWIFT: ${BANKING_DETAILS.swift}`,
        'Include your CCS Booking Reference code in your bank transfer narration',
      ],
      actionLabel: 'Copy Bank Coordinates',
      action: () => {
        handleCopy(
          `Bank: ${BANKING_DETAILS.bankName}\nAccount Name: ${BANKING_DETAILS.accountName}\nAccount Number: ${BANKING_DETAILS.accountNumber}\nIBAN: ${BANKING_DETAILS.iban}\nSWIFT: ${BANKING_DETAILS.swift}`,
          'bank-coords'
        );
      },
    },
    {
      step: '03',
      title: 'Wire Verification & Instant Token Activation',
      subtitle: 'Automated receipt confirmation dispatched to your corporate email',
      icon: Key,
      color: 'amber',
      description:
        'Once your transfer is credited at MCB Seychelles, Complisey administration (Malcolm Simon or Eric D\'Souza) verifies the wire and instantly unlocks your seats. An official Payment Receipt Confirmation & Tax Invoice is automatically sent to your corporate email with fast-track LMS activation tokens.',
      bullets: [
        'Each seat receives a unique activation token (e.g. CS-ACT-XXXX-XXXX)',
        'Click the magic link in your email or enter your token into the platform for instant unlock',
        'Corporate compliance officers can easily distribute tokens to staff or monitor progress from the Corporate Admin Portal',
      ],
      actionLabel: 'Redeem Course Token',
      action: () => {
        handleClose();
        if (onOpenTokenModal) onOpenTokenModal();
        else setIsRedeemModalOpen(true);
      },
    },
    {
      step: '04',
      title: 'Complete Interactive Units & Quizzes',
      subtitle: 'Practical Seychelles case studies with 80% passing threshold',
      icon: Zap,
      color: 'indigo',
      description:
        'Learners progress through high-yield lessons, fund flow diagrams, sanctions screening simulations, and anti-tipping-off protocols. Each module ends with an exam requiring an 80% score to certify competency. Unlimited retakes and comprehensive explanations are provided.',
      bullets: [
        'Real-world case studies based on recent Seychelles FIU circulars & FATF guidance',
        'Progress auto-saves to your profile so you can resume anytime',
        'Interactive feedback reinforces practical compliance guidelines',
      ],
      actionLabel: 'Go to My Dashboard',
      action: () => {
        handleClose();
        setActiveTab('dashboard');
      },
    },
    {
      step: '05',
      title: 'Download Verifiable Certificate',
      subtitle: 'Cryptographic proof of professional compliance training',
      icon: Award,
      color: 'purple',
      description:
        'Upon scoring 80% or higher, your official CompliSey Certificate of Completion is issued with verifiable CPD hours, a unique cryptographic serial number, and a public QR validation link. This provides verifiable documentary proof of staff training for institutional audit and corporate governance records.',
      bullets: [
        'Download instant high-resolution PDF certificate with gold Complisey seal',
        'Scan QR code anytime for instant third-party authenticity verification',
        'Corporate managers can export full staff compliance logs in one click',
      ],
      actionLabel: 'Got It, Let’s Get Started',
      action: handleClose,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#071433] rounded-3xl shadow-2xl border border-slate-200 dark:border-amber-400/20 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#071433] text-white border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                  Quickstart Guide
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  Seychelles AML/CFT Training Academy
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                How to Register &amp; Get Started
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveMode('video')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'video'
                    ? 'bg-amber-400 text-[#071433] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Video Walkthrough</span>
                <span className="sm:hidden">Video</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('steps')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'steps'
                    ? 'bg-amber-400 text-[#071433] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">5 Step Guide</span>
                <span className="sm:hidden">Steps</span>
              </button>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close Walkthrough"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeMode === 'video' ? (
            /* VIDEO MODE CONTAINER */
            <div className="space-y-5">
              {/* If a custom video embed link is configured, render it */}
              {customEmbedUrl ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl relative">
                  <iframe
                    src={customEmbedUrl}
                    title="CompliSey Academy Tutorial"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => setShowEmbedInput(true)}
                      className="px-2.5 py-1 rounded-md bg-black/60 hover:bg-black/90 text-white text-[10px] font-medium border border-white/20 backdrop-blur-xs cursor-pointer"
                    >
                      Change Video URL
                    </button>
                  </div>
                </div>
              ) : (
                /* High-Fidelity Interactive Visual Simulation Video Player */
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#050c1f] border border-amber-400/20 shadow-2xl flex flex-col justify-between group select-none">
                  {/* Visual Background Canvas Scene */}
                  <div className="absolute inset-0 bg-radial from-[#0a183d] to-[#040814] flex items-center justify-center p-6 sm:p-10">
                    {activeChapterIndex === 0 && (
                      <div className="text-center space-y-3 max-w-lg animate-in fade-in duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 mx-auto flex items-center justify-center shadow-lg">
                          <BookOpen className="w-7 h-7" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                          Step 1 • Course Catalog &amp; Cart
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          Select Individual Modules or Corporate Curriculum
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          Add single seats (SCR 2,500 / $175) or discounted multi-course tracks into the Checkout Cart. Instant proforma generation with zero upfront credit card.
                        </p>
                      </div>
                    )}

                    {activeChapterIndex === 1 && (
                      <div className="text-center space-y-3 max-w-lg animate-in fade-in duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 mx-auto flex items-center justify-center shadow-lg">
                          <Building2 className="w-7 h-7" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                          Step 2 • Official Banking Wire Coordinates
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          The Mauritius Commercial Bank (Seychelles) Ltd.
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                          A/C: <span className="text-amber-300 font-bold">00001073508</span> • SWIFT: <span className="text-amber-300 font-bold">MCBLSCSC</span> • Branch: Eden Branch
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Narration must include your proforma booking reference (e.g. CCS-BKG-XXXXX).
                        </p>
                      </div>
                    )}

                    {activeChapterIndex === 2 && (
                      <div className="text-center space-y-3 max-w-lg animate-in fade-in duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 mx-auto flex items-center justify-center shadow-lg">
                          <Key className="w-7 h-7" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                          Step 3 • Automated Receipt &amp; Token Dispatch
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          Payment Cleared • Instant Seat Provisioning
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          Admins confirm wire receipt and the system immediately dispatches your official Tax Invoice and unique 12-month access token to your email.
                        </p>
                      </div>
                    )}

                    {activeChapterIndex === 3 && (
                      <div className="text-center space-y-3 max-w-lg animate-in fade-in duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-400/30 mx-auto flex items-center justify-center shadow-lg">
                          <Award className="w-7 h-7" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-400/30">
                          Step 4 • Certification &amp; Compliance Records
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          Pass Quizzes (80%) &amp; Claim QR Certificate
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          Demonstrate verifiable AML/CFT training compliance. Download printable certificates with cryptographic validation.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Top Overlay Badge */}
                  <div className="relative z-10 p-4 flex items-center justify-between text-xs text-white/70">
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs border border-white/10">
                      <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span className="font-semibold text-white">
                        {isPlaying ? 'Playing Walkthrough' : 'Interactive Guide Simulator'}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-amber-300">
                        {CHAPTERS[activeChapterIndex]?.tag}: {CHAPTERS[activeChapterIndex]?.title}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowEmbedInput(true)}
                      className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-black/40 hover:bg-black/60 px-2.5 py-1 rounded-md text-slate-300 hover:text-white border border-white/10 cursor-pointer"
                    >
                      <span>Embed Custom Video</span>
                    </button>
                  </div>

                  {/* Bottom Video Controls Bar */}
                  <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-2">
                    {/* Scrub Bar */}
                    <div className="relative w-full h-3 flex items-center group cursor-pointer">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={videoProgress}
                        onChange={(e) => handleSeek(parseFloat(e.target.value) || 0)}
                        className="absolute inset-0 w-full h-2.5 opacity-0 cursor-pointer z-20"
                      />
                      <div className="relative w-full h-2.5 bg-white/20 group-hover:h-3 rounded-full transition-all flex items-center overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all relative"
                          style={{ width: `${videoProgress}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-110" />
                        </div>

                        {/* Chapter Markers on Scrubber */}
                        <div className="absolute inset-0 flex justify-between pointer-events-none px-0.5">
                          <div className="w-0.5 h-full bg-white/40" style={{ left: '25%' }} />
                          <div className="w-0.5 h-full bg-white/40" style={{ left: '50%' }} />
                          <div className="w-0.5 h-full bg-white/40" style={{ left: '75%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-8 h-8 rounded-full bg-amber-400 text-[#071433] hover:bg-amber-300 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-md font-bold"
                          title={isPlaying ? 'Pause' : 'Play Walkthrough'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>

                        <button
                          onClick={() => handleSeek(0)}
                          className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Restart Video"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        <span className="font-mono text-[11px] text-slate-300">
                          {Math.floor((videoProgress * 1.8) / 60)}:
                          {String(Math.floor((videoProgress * 1.8) % 60)).padStart(2, '0')} / 03:00
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Playback speed toggle */}
                        <button
                          onClick={() => setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          {playbackSpeed}x
                        </button>

                        <button
                          onClick={() => setActiveMode('steps')}
                          className="px-2.5 py-1 rounded bg-amber-400/20 border border-amber-400/40 text-amber-300 hover:bg-amber-400/30 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          View Written Steps
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Video Embed URL Input Modal Drawer */}
              {showEmbedInput && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Custom Video Walkthrough Link (YouTube, Vimeo, Loom or MP4)
                    </h4>
                    <button
                      onClick={() => setShowEmbedInput(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Paste an embed link (e.g. <code>https://www.youtube.com/embed/VIDEO_ID</code> or Loom URL) to replace the simulation player with your official recorded tutorial video.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      defaultValue={customEmbedUrl}
                      id="custom-embed-input"
                      placeholder="https://www.youtube.com/embed/..."
                      className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-amber-400"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('custom-embed-input') as HTMLInputElement;
                        if (input) handleSaveCustomEmbed(input.value.trim());
                      }}
                      className="px-4 py-2 bg-amber-400 text-[#071433] rounded-xl text-xs font-bold hover:bg-amber-300 cursor-pointer"
                    >
                      Save Video
                    </button>
                    {customEmbedUrl && (
                      <button
                        onClick={() => handleSaveCustomEmbed('')}
                        className="px-3 py-2 bg-rose-100 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-200 cursor-pointer"
                      >
                        Reset to Simulator
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Interactive Chapter Selector Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {CHAPTERS.map((chap, idx) => {
                  const isActive = activeChapterIndex === idx;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => handleSeek(chap.startPct)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'bg-amber-50 dark:bg-amber-400/10 border-amber-400 text-slate-900 dark:text-white shadow-xs'
                          : 'bg-white dark:bg-[#0c1b3f] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              isActive
                                ? 'bg-amber-400 text-[#071433]'
                                : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {chap.tag}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{chap.timestamp}</span>
                        </div>
                        <h4 className="text-xs font-bold leading-snug line-clamp-1">{chap.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {chap.summary}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* STEP-BY-STEP WRITTEN WALKTHROUGH */
            <div className="space-y-5">
              {/* Step Progress Indicator Bar */}
              <div className="flex items-center justify-between gap-1 p-2 bg-slate-50 dark:bg-[#0c1b3f] rounded-2xl border border-slate-200 dark:border-white/5 overflow-x-auto">
                {STEPS_DATA.map((stepItem, idx) => {
                  const isCurrent = currentStepIndex === idx;
                  const isDone = currentStepIndex > idx;
                  return (
                    <button
                      key={stepItem.step}
                      onClick={() => setCurrentStepIndex(idx)}
                      className={`flex-1 min-w-[120px] px-3 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2 ${
                        isCurrent
                          ? 'bg-amber-400 text-[#071433] font-bold shadow-xs'
                          : isDone
                          ? 'bg-white dark:bg-white/5 text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border border-current shrink-0">
                        {isDone ? <Check className="w-3 h-3" /> : stepItem.step}
                      </span>
                      <span className="text-xs truncate font-semibold">{stepItem.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Detailed Card */}
              {(() => {
                const s = STEPS_DATA[currentStepIndex];
                const IconComponent = s.icon;
                return (
                  <div className="p-5 sm:p-6 bg-slate-50/60 dark:bg-[#0a183d]/60 rounded-3xl border border-slate-200 dark:border-white/10 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-500 dark:text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-300">
                            Step {s.step} of 05
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                            {s.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{s.subtitle}</p>
                        </div>
                      </div>

                      <button
                        onClick={s.action}
                        className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        <span>{s.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {s.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Key Information &amp; Audit Requirements:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {s.bullets.map((bullet, bIdx) => (
                          <div
                            key={bIdx}
                            className="p-3 bg-white dark:bg-[#071433] rounded-xl border border-slate-200 dark:border-white/10 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step 2 Dedicated Banking Box */}
                    {s.step === '02' && (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                              Official Seychelles Wire Settlement Coordinates
                            </span>
                          </div>
                          <span className="text-[10px] font-bold bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
                            The Mauritius Commercial Bank (Seychelles) Ltd.
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                          <div className="p-2.5 bg-white dark:bg-slate-900/90 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                            <span className="text-[10px] text-slate-500 block">Account Name</span>
                            <span className="font-bold text-slate-900 dark:text-white truncate block">
                              {BANKING_DETAILS.accountName}
                            </span>
                          </div>

                          <div className="p-2.5 bg-white dark:bg-slate-900/90 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Account Number</span>
                              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                                {BANKING_DETAILS.accountNumber}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopy(BANKING_DETAILS.accountNumber, 'acc')}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                              title="Copy Account Number"
                            >
                              {copiedField === 'acc' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="p-2.5 bg-white dark:bg-slate-900/90 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-500 block">SWIFT / BIC</span>
                              <span className="font-mono font-bold text-slate-900 dark:text-white">
                                {BANKING_DETAILS.swift}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopy(BANKING_DETAILS.swift, 'swift')}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                              title="Copy SWIFT"
                            >
                              {copiedField === 'swift' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="p-2.5 bg-white dark:bg-slate-900/90 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Currency</span>
                              <span className="font-bold text-amber-600 dark:text-amber-400">
                                {BANKING_DETAILS.currency} (SCR)
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">Seychelles Rupee</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step Navigation Bar */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentStepIndex === 0}
                        className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous Step</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {currentStepIndex < STEPS_DATA.length - 1 ? (
                          <button
                            onClick={() => setCurrentStepIndex((prev) => Math.min(STEPS_DATA.length - 1, prev + 1))}
                            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-[#071433] text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Next Step ({STEPS_DATA[currentStepIndex + 1]?.title})</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={handleClose}
                            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                            <span>Complete Walkthrough &amp; Enter Academy</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-[#050c1e] border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
            />
            <span className="text-[11px]">Don't show this walkthrough automatically when I log in</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleClose();
                setIsCartOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Open Shopping Cart
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-1.5 rounded-xl bg-[#071433] dark:bg-amber-400 text-amber-300 dark:text-[#071433] font-bold transition-all shadow-xs cursor-pointer hover:opacity-95"
            >
              Explore Academy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
