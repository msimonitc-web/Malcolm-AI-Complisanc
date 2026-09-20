import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Lock,
  ArrowRight,
  Award,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Play,
  FileText,
  CloudLightning,
  CloudOff,
  Check,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAcademy } from '../context/AcademyContext';
import { WatermarkOverlay } from './WatermarkOverlay';
import { useCourseProgress, WizardStepId } from '../hooks/useCourseProgress';
import { CourseFeedbackSurveyModal } from './CourseFeedbackSurveyModal';

interface StepConfig {
  id: WizardStepId;
  label: string;
  type: 'content' | 'quiz' | 'exam' | 'success';
}

const STEPS: StepConfig[] = [
  { id: 'introduction', label: '1. Introduction', type: 'content' },
  { id: 'quiz1', label: '2. Fund Quiz', type: 'quiz' },
  { id: 'content2', label: '3. Guidelines', type: 'content' },
  { id: 'quiz2', label: '4. Sanctions Quiz', type: 'quiz' },
  { id: 'finalExam', label: '5. Final Exam', type: 'exam' },
  { id: 'completed', label: '6. Completed', type: 'success' },
];

export const CourseWizard: React.FC = () => {
  const { student, claimCertificate } = useAcademy();
  const {
    currentStep,
    setCurrentStep,
    quiz1Submitted,
    quiz1Score,
    quiz2Submitted,
    quiz2Score,
    examSubmitted,
    examScore,
    unlockedSteps,
    syncStatus,
    isSyncing,
    updateQuiz1,
    updateQuiz2,
    updateExam,
    resetProgress,
  } = useCourseProgress('c-wizard', student.email || 'learner@demo.com', student.name);

  // Quiz input answers are kept locally for unsubmitted attempts
  const [answers1, setAnswers1] = useState<Record<number, number>>({});
  const [answers2, setAnswers2] = useState<Record<number, number>>({});
  const [answersExam, setAnswersExam] = useState<Record<number, number>>({});

  // Auto-open course feedback survey modal on completion
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentStep === 'completed') {
      const alreadySubmitted = localStorage.getItem('feedback_submitted_c-1');
      if (!alreadySubmitted) {
        setIsFeedbackOpen(true);
      }
    }
  }, [currentStep]);

  // Quiz 1 Questions (Passing: 70% or higher - 2 out of 3 required)
  const quiz1Questions = [
    {
      id: 1,
      question: 'What is the primary role of the Financial Intelligence Unit (FIU) in Seychelles?',
      options: [
        'To prosecute criminals directly in judicial courts',
        'To receive, analyze, and disseminate suspicious transaction reports (STRs)',
        'To operate commercial banking licenses',
        'To manage offshore mutual funds'
      ],
      correct: 1,
      explanation: 'The FIU is the national center for receiving, analyzing, and disseminating STRs to law enforcement authorities under Seychelles AML laws.'
    },
    {
      id: 2,
      question: 'Which of the following stages of money laundering involves mixing illicit funds into the legitimate financial system through complex financial transactions?',
      options: [
        'Placement',
        'Layering',
        'Integration',
        'Amortization'
      ],
      correct: 1,
      explanation: 'Layering is the stage where illicit funds are distanced from their source through multiple, complex transactions to obscure the audit trail.'
    },
    {
      id: 3,
      question: 'Under standard AML/CFT guidelines, how long must records of customer identifications and transactions be retained after the relationship ends?',
      options: [
        'At least 1 year',
        'At least 3 years',
        'At least 7 years',
        'Records can be deleted immediately'
      ],
      correct: 2,
      explanation: 'Seychelles AML regulations mandate that customer records, transactions, and due diligence archives be securely kept for at least 7 years.'
    }
  ];

  // Quiz 2 Questions (Passing: 70% or higher - 2 out of 3 required)
  const quiz2Questions = [
    {
      id: 1,
      question: 'What action should a Reporting Entity take immediately upon discovering that a client matches a designated person on an international sanctions list?',
      options: [
        'Notify the client and ask them to explain',
        'Wait for the annual audit to report it',
        'Freeze the assets immediately without prior notice and file an STR within 24 hours',
        'Close the account and transfer the funds back to the country of origin'
      ],
      correct: 2,
      explanation: 'Sanctions regulations require immediate asset freezing without tipping off the client, followed by filing a suspicious transaction/sanctions match report with the FIU.'
    },
    {
      id: 2,
      question: 'What is a "Politically Exposed Person" (PEP)?',
      options: [
        'Any registered political party voter',
        'An individual entrusted with prominent public functions, their family members, or close associates',
        'A journalist covering parliament proceedings',
        'A corporate security officer'
      ],
      correct: 1,
      explanation: 'A PEP is an individual who is or has been entrusted with prominent public functions, which elevates their risk profile and requires enhanced customer due diligence.'
    },
    {
      id: 3,
      question: 'What does "Enhanced Due Diligence" (EDD) entail for high-risk clients?',
      options: [
        'Taking no action other than basic ID collection',
        'Conducting more thorough inquiries, identifying source of wealth/funds, and obtaining senior management approval',
        'Refusing to open an account under any circumstances',
        'Charging higher maintenance fees'
      ],
      correct: 1,
      explanation: 'EDD demands rigorous verification steps, establishing the legitimate source of wealth and funds, and securing senior management approval before onboarding high-risk clients.'
    }
  ];

  // Final Exam Questions (Passing: 80% or higher - 4 out of 5 required)
  const finalExamQuestions = [
    {
      id: 1,
      question: 'What is the standard threshold percentage to classify a "Beneficial Owner" (UBO) of a legal entity under standard due diligence rules?',
      options: [
        'Any shareholder holding 1% or more',
        'Any shareholder holding 10% or more',
        'Any individual who ultimately owns or controls 10% to 25% or more of shares or voting rights',
        'Only directors of the company'
      ],
      correct: 2,
      explanation: 'A Beneficial Owner is typically defined as an individual holding a threshold of 25% (or 10% in high-risk jurisdictions like Seychelles depending on the risk assessment) of shares/voting rights.'
    },
    {
      id: 2,
      question: 'What constitutes the offense of "Tipping-Off" under AML/CFT legislation?',
      options: [
        'Giving monetary rewards to the FIU officers',
        'Disclosing to a customer or a third party that an STR or investigation is being conducted',
        'Recommending competitors to a client',
        'Exchanging currency rates under the table'
      ],
      correct: 1,
      explanation: 'Tipping-off is a criminal offense where an employee informs a suspect or third party that an STR or investigation is underway, potentially jeopardizing the inquiry.'
    },
    {
      id: 3,
      question: 'Which of the following describes the Risk-Based Approach (RBA)?',
      options: [
        'Applying identical, strict measures to all customers regardless of risk factors',
        'Avoiding all risks by refusing high-volume transaction entities entirely',
        'Identifying, assessing, and understanding AML/CFT risks, then allocating resources proportionally to mitigate high-risk exposures',
        'Letting clients define their own risk tiers'
      ],
      correct: 2,
      explanation: 'The Risk-Based Approach requires entities to analyze specific risks (country, product, channel, client) and execute controls matching the severity of those risks.'
    },
    {
      id: 4,
      question: 'Under international guidelines, what should a reporting entity do if it cannot fulfill customer due diligence (CDD) requirements?',
      options: [
        'Onboard the client and do the verification next year',
        'Not open the account, terminate the relationship, and consider filing an STR',
        'Accept alternative unverified social media profiles as verification',
        'Report the client to the local chamber of commerce'
      ],
      correct: 1,
      explanation: 'If CDD cannot be completed, the relationship must not be established or must be terminated, and the compliance officer should assess filing an STR with the FIU.'
    },
    {
      id: 5,
      question: 'Who carries the ultimate responsibility for an organization\'s AML/CFT compliance framework, policies, and internal controls?',
      options: [
        'The junior desk clerk',
        'The external auditor',
        'The Board of Directors and Senior Management',
        'The local police inspector'
      ],
      correct: 2,
      explanation: 'Senior management and the Board carry direct administrative, legal, and operational accountability for ensuring an adequate and compliant AML/CFT framework.'
    }
  ];

  // Safe, lock-enforced navigation function
  const navigateToStep = (stepId: WizardStepId) => {
    if (unlockedSteps[stepId]) {
      setCurrentStep(stepId);
    }
  };

  // Grade quiz 1 (Enforcing strictly >= 70%)
  const handleGradeQuiz1 = () => {
    let correctCount = 0;
    quiz1Questions.forEach((q) => {
      if (answers1[q.id] === q.correct) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / quiz1Questions.length) * 100);
    const passed = percentage >= 70;
    // Strictly unlock Guidelines AND Quiz 2 only upon passing Quiz 1
    const updatedUnlocked = { ...unlockedSteps, content2: passed, quiz2: passed };
    updateQuiz1(percentage, true, updatedUnlocked);

    if (passed) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    }
  };

  // Grade quiz 2 (Enforcing strictly >= 70%)
  const handleGradeQuiz2 = () => {
    let correctCount = 0;
    quiz2Questions.forEach((q) => {
      if (answers2[q.id] === q.correct) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / quiz2Questions.length) * 100);
    const passed = percentage >= 70;
    // Strictly unlock Final Exam only upon passing Quiz 2
    const updatedUnlocked = { ...unlockedSteps, finalExam: passed };
    updateQuiz2(percentage, true, updatedUnlocked);

    if (passed) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    }
  };

  // Grade Final Exam (Enforcing strictly >= 80%)
  const handleGradeExam = () => {
    let correctCount = 0;
    finalExamQuestions.forEach((q) => {
      if (answersExam[q.id] === q.correct) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / finalExamQuestions.length) * 100);
    const passed = percentage >= 80;
    // Strictly unlock completed only upon passing final exam
    const updatedUnlocked = { ...unlockedSteps, completed: passed };
    updateExam(percentage, true, updatedUnlocked);

    if (passed) {
      claimCertificate('c-1'); // Claim foundational course cert as a match
      // Multi-burst celebration confetti
      const end = Date.now() + 2 * 1000;
      const interval = setInterval(() => {
        if (Date.now() > end) return clearInterval(interval);
        confetti({ startVelocity: 30, spread: 360, ticks: 60, origin: { x: Math.random(), y: Math.random() - 0.2 } });
      }, 200);
    }
  };

  const handleStepClick = (stepId: WizardStepId) => {
    navigateToStep(stepId);
  };

  const getStepIndex = (stepId: WizardStepId) => {
    return STEPS.findIndex((s) => s.id === stepId);
  };

  const handleResetQuiz1 = () => {
    setAnswers1({});
    updateQuiz1(0, false, { ...unlockedSteps, content2: false, quiz2: false });
  };

  const handleResetQuiz2 = () => {
    setAnswers2({});
    updateQuiz2(0, false, { ...unlockedSteps, finalExam: false });
  };

  const handleResetExam = () => {
    setAnswersExam({});
    updateExam(0, false, { ...unlockedSteps, completed: false });
  };

  const getCompletedStagesCount = (): number => {
    let count = 0;
    if (currentStep !== 'introduction' || unlockedSteps.content2) count++;
    if (unlockedSteps.content2) count++;
    if (unlockedSteps.finalExam || (currentStep !== 'introduction' && currentStep !== 'quiz1' && currentStep !== 'content2')) count++;
    if (unlockedSteps.finalExam) count++;
    if (unlockedSteps.completed || (examSubmitted && examScore >= 80)) count++;
    return count;
  };

  const getProgressPercentage = (): number => {
    return getCompletedStagesCount() * 20;
  };

  const completedCount = getCompletedStagesCount();
  const progressPercent = getProgressPercentage();

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="bg-white dark:bg-[#0d1527] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Linear Learning System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Course Module Progression Wizard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete the content steps and quizzes to unlock the Final Certification Exam.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Module Completion:</span>
            <span className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-full">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Real-time Visual Progress Bar */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-[#111c35] rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">Live Stage Tracker</span>
              {syncStatus === 'synced' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                  Synced
                </span>
              )}
              {syncStatus === 'syncing' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full animate-pulse">
                  <CloudLightning className="w-3 h-3" />
                  Syncing
                </span>
              )}
              {syncStatus === 'error' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full">
                  <CloudOff className="w-3 h-3" />
                  Offline
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{progressPercent}% Completed</span>
              <span className="text-slate-400 font-semibold">({completedCount} of 5 Stages)</span>
            </div>
          </div>
          
          <div className="relative pt-1 pb-1">
            {/* Background Line */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stage Indicator Nodes */}
            <div className="absolute top-0.5 left-0 w-full flex justify-between px-1 pointer-events-none">
              {[
                { label: 'Intro', active: true, done: currentStep !== 'introduction' || unlockedSteps.content2 },
                { label: 'Quiz 1', active: unlockedSteps.quiz1, done: unlockedSteps.content2 },
                { label: 'Guidelines', active: unlockedSteps.content2, done: unlockedSteps.finalExam || (currentStep !== 'introduction' && currentStep !== 'quiz1' && currentStep !== 'content2') },
                { label: 'Quiz 2', active: unlockedSteps.quiz2 || unlockedSteps.finalExam, done: unlockedSteps.finalExam },
                { label: 'Exam', active: unlockedSteps.finalExam, done: unlockedSteps.completed || (examSubmitted && examScore >= 80) }
              ].map((node, nIdx) => {
                const isCurrent = (nIdx === 0 && currentStep === 'introduction') ||
                                  (nIdx === 1 && currentStep === 'quiz1') ||
                                  (nIdx === 2 && currentStep === 'content2') ||
                                  (nIdx === 3 && currentStep === 'quiz2') ||
                                  (nIdx === 4 && (currentStep === 'finalExam' || currentStep === 'completed'));
                
                return (
                  <div key={nIdx} className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                      node.done 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : isCurrent 
                        ? 'bg-indigo-600 border-indigo-600 scale-125' 
                        : node.active 
                        ? 'bg-white dark:bg-[#111c35] border-indigo-400' 
                        : 'bg-slate-200 dark:bg-slate-800 border-slate-300'
                    }`} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between px-1 text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
            <span>1. Introduction</span>
            <span>2. Quiz 1</span>
            <span>3. Guidelines</span>
            <span>4. Quiz 2</span>
            <span>5. Final Exam</span>
          </div>
        </div>

        {/* Step Stepper Navigation Map */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          {STEPS.map((step, idx) => {
            const isUnlocked = unlockedSteps[step.id];
            const isActive = currentStep === step.id;
            const isDone = isUnlocked && getStepIndex(currentStep) > idx;

            return (
              <button
                key={step.id}
                disabled={!isUnlocked}
                onClick={() => handleStepClick(step.id)}
                className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1.5 relative ${
                  isActive
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-900 dark:text-indigo-300 font-bold'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400 font-medium'
                    : isUnlocked
                    ? 'bg-white dark:bg-[#111c35] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 cursor-pointer'
                    : 'bg-slate-50 dark:bg-[#0e1629] border-slate-100 dark:border-slate-800/60 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Step {idx + 1}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : !isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : null}
                </div>
                <span className="truncate leading-tight font-bold">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sandbox Workspace Step Screen */}
      <div className="bg-white dark:bg-[#0d1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden min-h-[500px] flex flex-col relative">
        <WatermarkOverlay isAbsolute={false} />
        
        {/* Step Render Area */}
        <div className="flex-1 p-6 sm:p-8 space-y-6 relative z-10">
          
          {/* STEP 1: Introduction */}
          {currentStep === 'introduction' && (
            <div className="space-y-6 max-w-4xl">
              <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Unit 1 of 5 · Core Theory</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  Foundations of Anti-Money Laundering &amp; The Three Stages
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Carefully read this instructional section before taking Quiz 1. The assessment directly tests your comprehension of these core statutory concepts.
                </p>
              </div>

              <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 border-l-4 border-indigo-600 rounded-r-xl">
                  <h4 className="font-bold text-indigo-950 dark:text-indigo-200 text-sm mb-1">
                    What is Money Laundering?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    Money laundering is the process of disguising the illegal origin and ownership of criminal property (the proceeds of crime) so that it appears to have originated from legitimate sources. It applies across banking, corporate service providers, gaming, real estate, and designated non-financial businesses and professions (DNFBPs).
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
                    <span>The Three Classical Stages of Money Laundering</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
                    In international standards and statutory teaching, money laundering is broken down into three distinct, sequential stages:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Stage 1: Placement */}
                    <div className="p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-[#111c35] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          Stage 1
                        </span>
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Most Vulnerable</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Placement</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        The physical entry of dirty cash into the legitimate financial system. Common methods include cash-intensive businesses, bureaux de change, and <strong>structuring (smurfing)</strong>—breaking large cash amounts into small deposits just below statutory reporting thresholds.
                      </p>
                      <div className="text-[11px] p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium">
                        <strong>Key Lesson:</strong> Launderers are <em>most vulnerable to detection at placement</em> because handling raw illicit cash is inherently conspicuous.
                      </div>
                    </div>

                    {/* Stage 2: Layering */}
                    <div className="p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-[#111c35] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          Stage 2
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Audit Trail Severance</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Layering</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Separating illicit money from its criminal source by creating complex layers of financial transactions, wire transfers, offshore shell companies, and crypto conversions to <strong>obscure the audit trail</strong> and sever links to the predicate crime.
                      </p>
                      <div className="text-[11px] p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium">
                        <strong>Key Lesson:</strong> Layering involves rapid, multi-account movements and unclear commercial rationale to confuse forensic investigators.
                      </div>
                    </div>

                    {/* Stage 3: Integration */}
                    <div className="p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-[#111c35] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          Stage 3
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Apparent Legitimacy</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Integration</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Re-introducing the laundered funds into the formal economy so they appear as legitimate wealth. Launderers invest in real estate, pay themselves executive salaries through front companies, or fabricate bogus business loans and dividends.
                      </p>
                      <div className="text-[11px] p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium">
                        <strong>Key Lesson:</strong> Integration is the hardest stage to trace from appearance alone because funds masquerade as ordinary commercial wealth.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statutory Duties & Record Keeping */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#111c35] space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                      The Financial Intelligence Unit (FIU)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      In Seychelles, the <strong>FIU</strong> is the designated national autonomous agency mandated to <em>receive, analyze, and disseminate Suspicious Transaction Reports (STRs)</em> to law enforcement authorities.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#111c35] space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                      Statutory Record Retention (7 Years)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Under Section 33 of the Seychelles AML/CFT Act 2020, Reporting Entities must securely maintain customer identification files, CDD records, and transaction receipts for <strong>at least 7 years</strong> after business relationship termination.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 italic">
                  Take your time to understand these definitions. When ready, proceed to Quiz 1.
                </span>
                <button
                  onClick={() => navigateToStep('quiz1')}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>Proceed to Quiz 1</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Quiz 1 (Fund Quiz - 70% threshold) */}
          {currentStep === 'quiz1' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Unit 2 of 5</span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                    Quiz 1: AML Fundamentals Assessment
                  </h2>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                  Passing Threshold: 70% (2/3 Correct)
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6 max-w-4xl">
                {quiz1Questions.map((q, qIndex) => (
                  <div key={q.id} className="p-4 bg-slate-50 dark:bg-[#111c35] border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px]">
                        Q{qIndex + 1}
                      </span>
                      <span>{q.question}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = answers1[q.id] === optIndex;
                        const isCorrectOpt = q.correct === optIndex;
                        const showRationale = quiz1Submitted;

                        let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-[#0e1629] text-slate-700 dark:text-slate-300';
                        if (showRationale) {
                          if (isCorrectOpt) {
                            optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400';
                          } else if (isSelected) {
                            optionStyle = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-400';
                          } else {
                            optionStyle = 'border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0d1527] opacity-60 text-slate-400';
                          }
                        } else if (isSelected) {
                          optionStyle = 'border-indigo-600 bg-indigo-500/10 text-indigo-950 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20';
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={quiz1Submitted}
                            onClick={() => setAnswers1((prev) => ({ ...prev, [q.id]: optIndex }))}
                            className={`p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ${optionStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quiz1Submitted && (
                      <div className="mt-2 pl-6 text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-[#0d1527] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40">
                        <strong>Rationale:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Grading Actions Footer */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {quiz1Submitted ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500">Your Score:</span>
                      <span className={`px-3 py-1.5 rounded-full font-black text-xs ${
                        quiz1Score >= 70
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
                          : 'bg-rose-500/10 text-rose-600 border border-rose-200'
                      }`}>
                        {quiz1Score}% ({quiz1Score >= 70 ? 'Passed' : 'Failed'})
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Please answer all 3 questions before submitting.</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {quiz1Submitted && quiz1Score < 70 && (
                    <button
                      onClick={handleResetQuiz1}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Quiz 1</span>
                    </button>
                  )}

                  {!quiz1Submitted ? (
                    <button
                      disabled={Object.keys(answers1).length < quiz1Questions.length}
                      onClick={handleGradeQuiz1}
                      className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Answers</span>
                    </button>
                  ) : quiz1Score >= 70 ? (
                    <button
                      onClick={() => navigateToStep('content2')}
                      className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <span>Continue to Section 2</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
 
          {/* STEP 3: Content Section 2 (Practical Guidelines) */}
          {currentStep === 'content2' && (
            <div className="space-y-6 max-w-4xl">
              <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Unit 3 of 5 · Statutory Practice</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  Targeted Financial Sanctions, PEPs &amp; Customer Due Diligence
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Read these practical operational rules before proceeding to Quiz 2. Every compliance officer must master these protocols.
                </p>
              </div>

              <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sanctions & Asset Freezing */}
                  <div className="p-4 rounded-xl border-2 border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-[#151c2d] space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        Targeted Financial Sanctions &amp; Asset Freezing
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      When screening reveals an exact match with a United Nations Security Council or domestic sanctions list, the reporting entity has an immediate obligation:
                    </p>
                    <div className="text-xs p-3 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-slate-800 dark:text-slate-200 space-y-1">
                      <p className="font-bold text-rose-700 dark:text-rose-400">Mandatory Protocol:</p>
                      <p>1. <strong>Freeze assets immediately without delay and without prior notice</strong> to the customer.</p>
                      <p>2. Do NOT tip off the customer or alert them to the match.</p>
                      <p>3. Submit a sanctions match filing to the FIU within <strong>24 hours</strong>.</p>
                    </div>
                  </div>

                  {/* PEPs */}
                  <div className="p-4 rounded-xl border-2 border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-[#151c2d] space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        Politically Exposed Persons (PEPs)
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      A <strong>Politically Exposed Person (PEP)</strong> is an individual who is or has been entrusted with prominent public functions (e.g. heads of state, senior politicians, judicial or military officials, senior executives of state enterprises), as well as their <strong>family members and close associates</strong>.
                    </p>
                    <div className="text-xs p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-slate-800 dark:text-slate-200 space-y-1">
                      <p className="font-bold text-amber-700 dark:text-amber-400">Regulatory Requirement:</p>
                      <p>PEPs are not forbidden, but they represent higher inherent risk. Entities must apply <strong>Enhanced Due Diligence (EDD)</strong>, verify the Source of Wealth and Source of Funds, and obtain <strong>Senior Management approval</strong> before establishing or continuing the business relationship.</p>
                    </div>
                  </div>
                </div>

                {/* CDD & Tipping-off */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111c35] space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                    The Crime of Tipping-Off
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Under Seychelles law, it is a serious criminal offence to disclose to a customer or any third party that a Suspicious Transaction Report (STR) or investigation is being contemplated, has been submitted, or is underway. All suspicion escalations must remain strictly internal to the Money Laundering Reporting Officer (MLRO).
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => navigateToStep('quiz1')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 hover:bg-slate-50 dark:text-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Quiz 1</span>
                </button>

                <button
                  onClick={() => navigateToStep('quiz2')}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>Proceed to Quiz 2</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Quiz 2 (Sanctions Quiz - 70% threshold) */}
          {currentStep === 'quiz2' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Unit 4 of 5</span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                    Quiz 2: Sanctions & PEP Guidelines Assessment
                  </h2>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                  Passing Threshold: 70% (2/3 Correct)
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6 max-w-4xl">
                {quiz2Questions.map((q, qIndex) => (
                  <div key={q.id} className="p-4 bg-slate-50 dark:bg-[#111c35] border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px]">
                        Q{qIndex + 1}
                      </span>
                      <span>{q.question}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = answers2[q.id] === optIndex;
                        const isCorrectOpt = q.correct === optIndex;
                        const showRationale = quiz2Submitted;

                        let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-[#0e1629] text-slate-700 dark:text-slate-300';
                        if (showRationale) {
                          if (isCorrectOpt) {
                            optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400';
                          } else if (isSelected) {
                            optionStyle = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-400';
                          } else {
                            optionStyle = 'border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0d1527] opacity-60 text-slate-400';
                          }
                        } else if (isSelected) {
                          optionStyle = 'border-indigo-600 bg-indigo-500/10 text-indigo-950 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20';
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={quiz2Submitted}
                            onClick={() => setAnswers2((prev) => ({ ...prev, [q.id]: optIndex }))}
                            className={`p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ${optionStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quiz2Submitted && (
                      <div className="mt-2 pl-6 text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-[#0d1527] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40">
                        <strong>Rationale:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Grading Actions Footer */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {quiz2Submitted ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500">Your Score:</span>
                      <span className={`px-3 py-1.5 rounded-full font-black text-xs ${
                        quiz2Score >= 70
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
                          : 'bg-rose-500/10 text-rose-600 border border-rose-200'
                      }`}>
                        {quiz2Score}% ({quiz2Score >= 70 ? 'Passed' : 'Failed'})
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Please answer all 3 questions before submitting.</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateToStep('content2')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 hover:bg-slate-50 dark:text-slate-200 dark:border-slate-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Guidelines</span>
                  </button>

                  {quiz2Submitted && quiz2Score < 70 && (
                    <button
                      onClick={handleResetQuiz2}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Quiz 2</span>
                    </button>
                  )}

                  {!quiz2Submitted ? (
                    <button
                      disabled={Object.keys(answers2).length < quiz2Questions.length}
                      onClick={handleGradeQuiz2}
                      className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Answers</span>
                    </button>
                  ) : quiz2Score >= 70 ? (
                    <button
                      onClick={() => navigateToStep('finalExam')}
                      className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <span>Advance to Final Exam</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Final Exam (80% Passing standard) */}
          {currentStep === 'finalExam' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900/50">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Phase 5 of 5</span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600 animate-pulse" />
                    Final Statutory Certification Exam
                  </h2>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-black">
                  Passing Standard: 80% (4/5 Correct)
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6 max-w-4xl">
                {finalExamQuestions.map((q, qIndex) => (
                  <div key={q.id} className="p-4 bg-slate-50 dark:bg-[#111c35] border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-extrabold text-[10px]">
                        E{qIndex + 1}
                      </span>
                      <span>{q.question}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = answersExam[q.id] === optIndex;
                        const isCorrectOpt = q.correct === optIndex;
                        const showRationale = examSubmitted;

                        let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-[#0e1629] text-slate-700 dark:text-slate-300';
                        if (showRationale) {
                          if (isCorrectOpt) {
                            optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400';
                          } else if (isSelected) {
                            optionStyle = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-400';
                          } else {
                            optionStyle = 'border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#0d1527] opacity-60 text-slate-400';
                          }
                        } else if (isSelected) {
                          optionStyle = 'border-indigo-600 bg-indigo-500/10 text-indigo-950 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20';
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={examSubmitted}
                            onClick={() => setAnswersExam((prev) => ({ ...prev, [q.id]: optIndex }))}
                            className={`p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ${optionStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {examSubmitted && (
                      <div className="mt-2 pl-6 text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-[#0d1527] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40">
                        <strong>Feedback:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Grading Actions Footer */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {examSubmitted ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500">Exam Outcome:</span>
                      <span className={`px-3 py-1.5 rounded-full font-black text-xs ${
                        examScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
                          : 'bg-rose-500/10 text-rose-600 border border-rose-200'
                      }`}>
                        {examScore}% ({examScore >= 80 ? 'Certified' : 'Reassessment Required'})
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Verify all answers thoroughly. This affects your official audit logs.</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={examSubmitted}
                    onClick={() => navigateToStep('quiz2')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 hover:bg-slate-50 dark:text-slate-200 dark:border-slate-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Quiz 2</span>
                  </button>

                  {examSubmitted && examScore < 80 && (
                    <button
                      onClick={handleResetExam}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-Take Final Exam</span>
                    </button>
                  )}

                  {!examSubmitted ? (
                    <button
                      disabled={Object.keys(answersExam).length < finalExamQuestions.length}
                      onClick={handleGradeExam}
                      className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Submit Examination File</span>
                    </button>
                  ) : examScore >= 80 ? (
                    <button
                      onClick={() => navigateToStep('completed')}
                      className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer animate-bounce"
                    >
                      <span>Claim Your Certificate</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {currentStep === 'completed' && (
            <div className="text-center py-10 max-w-xl mx-auto space-y-6">
              <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Award className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  Congratulations, {student.name}!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  You have successfully completed the progressive module training and passed the statutory certification examination with a score of <strong className="text-indigo-600 dark:text-indigo-400">{examScore}%</strong>.
                </p>
              </div>

              {/* Verified Badge Certificate Mockup */}
              <div className="p-6 bg-slate-50 dark:bg-[#111c35] border border-slate-200 dark:border-slate-800 rounded-2xl text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Complisey Credentials</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">AML/CFT Officer Certificate</p>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-black border border-emerald-200">
                    VERIFIED SECURE
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px]">ISSUED TO</span>
                    <p className="font-extrabold text-slate-800 dark:text-white">{student.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">PASSING DATE</span>
                    <p className="font-extrabold text-slate-800 dark:text-white">September 2026</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">RECORD ID</span>
                    <p className="font-mono text-[10px] text-slate-600 dark:text-slate-300">CSY-WZD-94827</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">ACCREDITATION</span>
                    <p className="font-extrabold text-slate-800 dark:text-white">Complisey Academy SEY</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-4 h-4 text-amber-300" />
                  <span>Provide Module Feedback</span>
                </button>
                <button
                  onClick={() => {
                    setAnswers1({});
                    setAnswers2({});
                    setAnswersExam({});
                    resetProgress();
                  }}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Reset & Restart Module Wizard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CourseFeedbackSurveyModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        courseId="c-1"
        courseTitle="Seychelles AML/CFT Statutory Fundamentals"
        studentId={student.email || 'learner@demo.com'}
        studentName={student.name}
        studentEmail={student.email || 'learner@demo.com'}
      />
    </div>
  );
};
