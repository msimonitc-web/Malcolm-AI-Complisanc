import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Headphones,
  Menu,
  X,
  FileText,
  BookOpen,
  HelpCircle,
  Download,
  MessageSquare,
  Award,
  Sparkles,
  Check,
  Send,
  ThumbsUp,
  Bookmark,
  Share2,
  Cloud,
  RefreshCw,
  HardDriveDownload,
  WifiOff,
  Wifi,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  History,
  RotateCw,
  Key,
  CreditCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAcademy } from '../context/AcademyContext';
import { WatermarkOverlay } from './WatermarkOverlay';
import { Lesson, CourseModule } from '../types';
import { offlineStorageService } from '../services/offlineStorageService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { QuizLockdownBanner, LockdownViolation } from './QuizLockdownBanner';
import { QuizLockdownWarningModal, QuizLockdownAuditModal } from './QuizLockdownModal';
import { useCsrf, CsrfInput } from '../context/CsrfContext';
import { ThemeToggle } from './ThemeToggle';
import { CourseWizardProgress, WizardStage } from './CourseWizardProgress';
import { UnitAssessmentView } from './UnitAssessmentView';
import { FinalExamWizardView } from './FinalExamWizardView';
import { CourseCertificateView } from './CourseCertificateView';

export const CoursePlayer: React.FC = () => {
  const {
    activeCourseId,
    activeLessonId,
    setActiveLessonId,
    courses,
    enrolledProgress,
    toggleLessonCompletion,
    markLessonComplete,
    savePersonalNote,
    recordQuizScore,
    recordUnitQuizScore,
    recordExamScore,
    claimCertificate,
    setSelectedCertificateForView,
    setActiveTab,
    getCourseProgressPercentage,
    isCourseCompleted,
    isCourseUnlocked,
    syncStatus,
    lastSyncedAt,
    syncMessage,
    forceSyncProgress,
    student,
    currentUser,
    recordIntegrityViolation,
    setIsRedeemModalOpen,
    setSelectedCourseForCheckout,
  } = useAcademy();

  const isCorporateLearner = !!student.companyName && currentUser?.role !== 'corporate';

  // Find course
  const course = courses.find((c) => c.id === activeCourseId) || courses[0];
  const progress = enrolledProgress[course.id];

  // Find current lesson and module
  let currentModuleIndex = 0;
  let currentModule: CourseModule = course.modules[0];
  let currentLesson: Lesson = currentModule.lessons[0];

  for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
    const mod = course.modules[mIdx];
    const found = mod.lessons.find((l) => l.id === activeLessonId);
    if (found) {
      currentModuleIndex = mIdx;
      currentModule = mod;
      currentLesson = found;
      break;
    }
  }

  // Wizard Stage state: controls if we are viewing lesson lectures, unit assessment, final exam, or certificate
  const [wizardStage, setWizardStage] = useState<WizardStage>({
    type: 'module',
    moduleIndex: currentModuleIndex,
    subStep: 'lessons',
  });

  const completedLessonIds = progress?.completedLessonIds || [];
  const unitQuizScores = progress?.unitQuizScores || {};
  const examScore = progress?.examScore;

  // Access validation for progressive locking
  const canAccessStage = (stage: WizardStage): boolean => {
    if (stage.type === 'module') {
      if (stage.moduleIndex === 0) return true;
      // Previous module must have its quiz passed (score >= 80)
      const prevMod = course.modules[stage.moduleIndex - 1];
      if (!prevMod) return true;
      return (unitQuizScores[prevMod.id] ?? 0) >= 80;
    }
    if (stage.type === 'finalExam') {
      // All unit quizzes must be passed
      return course.modules.every((m) => (unitQuizScores[m.id] ?? 0) >= 80);
    }
    if (stage.type === 'certificate') {
      // Must pass final exam with 80% or higher
      return (examScore ?? 0) >= 80 || isCourseCompleted(course.id);
    }
    return true;
  };

  const handleSelectStage = (stage: WizardStage) => {
    if (!canAccessStage(stage)) return;
    setWizardStage(stage);
    if (stage.type === 'module') {
      const targetMod = course.modules[stage.moduleIndex];
      if (targetMod && targetMod.lessons.length > 0) {
        setActiveLessonId(targetMod.lessons[0].id);
      }
    }
  };

  // Active workspace tab
  const [activeTabName, setActiveTabName] = useState<'notes' | 'quiz' | 'resources' | 'qa'>('notes');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Video state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Personal notes
  const [personalNoteText, setPersonalNoteText] = useState(
    progress?.personalNotes?.[currentLesson.id] || ''
  );
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  // Quiz state & 80% assessment threshold
  const PASS_MARK = 80;
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Quiz Lockdown Proctoring state
  const [lockdownViolations, setLockdownViolations] = useState<LockdownViolation[]>([]);
  const [latestViolation, setLatestViolation] = useState<LockdownViolation | null>(null);
  const [showLockdownWarning, setShowLockdownWarning] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isFullscreenLockdown, setIsFullscreenLockdown] = useState(false);
  const lastViolationTimeRef = useRef<number>(0);
  const isFullscreenRequestedRef = useRef<boolean>(false);

  // Q&A input
  const [questionInput, setQuestionInput] = useState('');
  const [commentsList, setCommentsList] = useState(currentLesson.comments || []);
  const { csrfToken, submitProtectedForm } = useCsrf();

  // Offline status & downloaded state
  const { isOnline } = useOnlineStatus();
  const [isDownloaded, setIsDownloaded] = useState(() =>
    offlineStorageService.isCourseDownloaded(course.id)
  );
  const [isDownloadingOffline, setIsDownloadingOffline] = useState(false);
  const [resourceToast, setResourceToast] = useState<string | null>(null);

  // Trainer Speech Narration & Audio Lecture Player State
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const [isNarrationPaused, setIsNarrationPaused] = useState(false);
  const [narrationSpeed, setNarrationSpeed] = useState<number>(1.0);
  const [showWrittenTranscript, setShowWrittenTranscript] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check speech synthesis support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  // Cleanup narration when lesson changes or unmounts
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsNarrationPlaying(false);
    setIsNarrationPaused(false);
  }, [activeLessonId]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayNarration = () => {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setResourceToast('Audio narration is not supported in this browser.');
        setTimeout(() => setResourceToast(null), 3000);
        return;
      }

      // If currently paused, resume
      if (isNarrationPaused && isNarrationPlaying) {
        window.speechSynthesis.resume();
        setIsNarrationPaused(false);
        return;
      }

      // Cancel any previous utterance
      window.speechSynthesis.cancel();

      const rawTranscript = currentLesson.transcript || currentLesson.notes || '';
      const div = document.createElement('div');
      div.innerHTML = rawTranscript;
      let cleanText = div.textContent || div.innerText || '';

      // Standardize statutory compliance acronyms for smooth verbal delivery
      cleanText = cleanText
        .replace(/AML\/CFT/g, 'A M L C F T')
        .replace(/AML/g, 'A M L')
        .replace(/CFT/g, 'C F T')
        .replace(/FSA/g, 'F S A')
        .replace(/FIU/g, 'F I U')
        .replace(/VASP/g, 'Vasp')
        .replace(/VASPs/g, 'Vasps')
        .replace(/CDD/g, 'C D D')
        .replace(/EDD/g, 'E D D')
        .replace(/PEP/g, 'Pep')
        .replace(/PEPs/g, 'Peps')
        .replace(/STR/g, 'S T R')
        .replace(/STRs/g, 'S T Rs')
        .replace(/SAR/g, 'S A R')
        .replace(/SARs/g, 'S A Rs')
        .replace(/UBO/g, 'U B O')
        .replace(/UBOs/g, 'U B Os')
        .replace(/NRA/g, 'N R A')
        .replace(/SCR\s?([0-9,]+)/g, '$1 Seychelles Rupees');

      if (!cleanText.trim()) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = narrationSpeed;
      utterance.pitch = 1.0;

      // Pick a natural English voice if available
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const englishVoice =
            voices.find(
              (v) =>
                (v.name.includes('Natural') ||
                  v.name.includes('Neural') ||
                  v.name.includes('Google') ||
                  v.name.includes('Samantha') ||
                  v.name.includes('Daniel') ||
                  v.name.includes('Oliver') ||
                  v.name.includes('George')) &&
                v.lang.startsWith('en')
            ) || voices.find((v) => v.lang.startsWith('en'));

          if (englishVoice) {
            utterance.voice = englishVoice;
          }
        }
      } catch {
        // Fall back to browser default voice
      }

      utterance.onstart = () => {
        setIsNarrationPlaying(true);
        setIsNarrationPaused(false);
      };

      utterance.onend = () => {
        setIsNarrationPlaying(false);
        setIsNarrationPaused(false);
      };

      utterance.onerror = (e) => {
        // Canceled events are normal when switching or restarting
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Speech synthesis event:', e.error);
        }
        setIsNarrationPlaying(false);
        setIsNarrationPaused(false);
      };

      utteranceRef.current = utterance;

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Unable to initialize speech synthesis:', err);
      setIsNarrationPlaying(false);
      setIsNarrationPaused(false);
    }
  };

  const handlePauseNarration = () => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
        setIsNarrationPaused(true);
      }
    } catch (err) {
      console.warn('Speech pause error:', err);
    }
  };

  const handleStopNarration = () => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsNarrationPlaying(false);
        setIsNarrationPaused(false);
      }
    } catch (err) {
      console.warn('Speech stop error:', err);
    }
  };

  const handleChangeNarrationSpeed = (speed: number) => {
    setNarrationSpeed(speed);
    if (isNarrationPlaying && !isNarrationPaused) {
      handlePlayNarration();
    }
  };

  const hasQuiz = Boolean(currentLesson.quiz && currentLesson.quiz.length > 0);
  const isAssessmentActive = activeTabName === 'quiz' && hasQuiz && !quizSubmitted;

  // Quiz Lockdown: Detect and flag browser tab switching, window navigation, and focus loss
  useEffect(() => {
    if (!isAssessmentActive) return;

    const recordViolation = (
      type: 'tab_switch' | 'window_blur' | 'fullscreen_exit',
      title: string,
      detail: string
    ) => {
      const now = Date.now();
      // Debounce events firing simultaneously within 1.2 seconds
      if (now - lastViolationTimeRef.current < 1200) return;
      lastViolationTimeRef.current = now;

      const violation: LockdownViolation = {
        id: `viol-${now}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type,
        title,
        detail,
      };

      setLockdownViolations((prev) => [...prev, violation]);
      setLatestViolation(violation);
      setShowLockdownWarning(true);

      // Record globally in context for active Corporate Portal administrative visibility
      recordIntegrityViolation({
        id: violation.id,
        studentId: student.id || 'learner_alex_rivera',
        studentName: student.name || 'Alex Rivera',
        studentEmail: student.email || 'eric@complisanc.com',
        courseId: course.id,
        courseTitle: course.title,
        lessonId: currentLesson.id,
        lessonTitle: currentLesson.title,
        violationType: type,
        violationTitle: title,
        violationDetail: detail,
        timestamp: new Date().toISOString(),
      });

      // Secure CSRF academic integrity telemetry log to admin service
      submitProtectedForm('/api/forms/lockdown-violation', {
        id: violation.id,
        studentId: student.id || 'learner_alex_rivera',
        studentName: student.name || 'Alex Rivera',
        studentEmail: student.email || 'eric@complisanc.com',
        courseId: course.id,
        courseTitle: course.title,
        lessonId: currentLesson.id,
        lessonTitle: currentLesson.title,
        violationType: type,
        violationTitle: title,
        violationDetail: detail,
        timestamp: new Date().toISOString(),
        _csrf: csrfToken,
      }).catch((err) => {
        console.warn('Academic integrity violation logged; telemetry dispatched:', err);
      });
    };

    // 1. Detect browser tab switching or minimizing window via Page Visibility API
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation(
          'tab_switch',
          'Browser Tab Switch Detected',
          'You navigated away from the exam tab or minimized the browser window while the 80% assessment was active.'
        );
      }
    };

    // 2. Detect window blur (switching to another application, dual monitor clicking, dev tools)
    const handleWindowBlur = () => {
      if (!document.hidden) {
        recordViolation(
          'window_blur',
          'Window Focus Lost / External App Navigation',
          'The exam window lost focus. An external window, secondary monitor, or third-party application was brought to the foreground.'
        );
      }
    };

    // 3. Warn before closing or navigating away from the page during active exam
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      recordViolation(
        'tab_switch',
        'Attempted Page Exit / Navigation',
        'Attempted to reload or navigate away from the active competency assessment page.'
      );
      e.preventDefault();
      e.returnValue = 'Assessment Lockdown Active: Leaving this page will record an academic integrity flag on your official training record.';
      return e.returnValue;
    };

    // 4. Detect exiting fullscreen if in fullscreen lockdown
    const handleFullscreenChange = () => {
      const isFull = Boolean(document.fullscreenElement);
      setIsFullscreenLockdown(isFull);
      if (!isFull && isFullscreenRequestedRef.current) {
        isFullscreenRequestedRef.current = false;
        recordViolation(
          'fullscreen_exit',
          'Fullscreen Lockdown Exited',
          'You exited fullscreen mode before completing and submitting your 80% assessment.'
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isAssessmentActive]);

  useEffect(() => {
    setIsDownloaded(offlineStorageService.isCourseDownloaded(course.id));
    const unsubscribe = offlineStorageService.subscribe(() => {
      setIsDownloaded(offlineStorageService.isCourseDownloaded(course.id));
    });
    return () => unsubscribe();
  }, [course.id]);

  const handleToggleOfflineDownload = async () => {
    if (isDownloaded) {
      offlineStorageService.removeDownloadedCourse(course.id);
      setIsDownloaded(false);
      setResourceToast('Removed course from local offline storage.');
      setTimeout(() => setResourceToast(null), 3000);
    } else {
      setIsDownloadingOffline(true);
      try {
        const meta = await offlineStorageService.downloadCourse(course);
        setIsDownloaded(true);
        setResourceToast(`Course saved for offline study (${meta.sizeFormatted})!`);
        setTimeout(() => setResourceToast(null), 3500);
      } catch (err) {
        setResourceToast('Failed to cache course for offline use.');
      } finally {
        setIsDownloadingOffline(false);
      }
    }
  };

  const handleDownloadResource = (resId: string, resName: string) => {
    const success = offlineStorageService.downloadOfflineResource(resId, course);
    if (success) {
      setResourceToast(`Downloaded "${resName}" to your device for offline study.`);
    } else {
      setResourceToast(`Exported "${resName}".`);
    }
    setTimeout(() => setResourceToast(null), 3500);
  };

  // Asset protection event listeners (Disable right-click, select-all, printing, copy shortcuts)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setResourceToast('Right-click is disabled to protect proprietary CompliSey course materials.');
      setTimeout(() => setResourceToast(null), 3000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C / Cmd+C inside classroom
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'c') {
        const selection = window.getSelection()?.toString();
        if (selection) {
          e.preventDefault();
          setResourceToast('Copying course syllabus or summaries is locked under copyright terms.');
          setTimeout(() => setResourceToast(null), 3000);
        }
      }
      // Block Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'p') {
        e.preventDefault();
        setResourceToast('Printing course materials is restricted under CompliSey regulatory licensing.');
        setTimeout(() => setResourceToast(null), 3500);
      }
      // Block Ctrl+A / Cmd+A
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'a') {
        e.preventDefault();
      }
    };

    const classroomArea = document.getElementById('complisey-secure-classroom');
    if (classroomArea) {
      classroomArea.addEventListener('contextmenu', handleContextMenu);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (classroomArea) {
        classroomArea.removeEventListener('contextmenu', handleContextMenu);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync personal notes & reset quiz lockdown session when lesson changes
  useEffect(() => {
    setPersonalNoteText(progress?.personalNotes?.[currentLesson.id] || '');
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setLockdownViolations([]);
    setLatestViolation(null);
    setShowLockdownWarning(false);
    setCommentsList(currentLesson.comments || []);
    setIsPlaying(false);
    if (currentLesson.type === 'quiz') {
      setActiveTabName('quiz');
    }
  }, [currentLesson.id, progress]);

  // Video time format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);

      // Auto mark complete if user watches > 90%
      if (videoRef.current.currentTime / videoRef.current.duration > 0.9) {
        markLessonComplete(course.id, currentLesson.id);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Lesson traversal
  const allLessons: Lesson[] = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleSaveNote = () => {
    savePersonalNote(course.id, currentLesson.id, personalNoteText);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2000);
  };

  const handleQuizOptionSelect = (qId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleToggleFullscreenLockdown = async () => {
    try {
      if (!document.fullscreenElement) {
        isFullscreenRequestedRef.current = true;
        await document.documentElement.requestFullscreen();
        setIsFullscreenLockdown(true);
      } else {
        isFullscreenRequestedRef.current = false;
        await document.exitFullscreen();
        setIsFullscreenLockdown(false);
      }
    } catch (err) {
      console.warn('Fullscreen request blocked or not supported:', err);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setLockdownViolations([]);
    setLatestViolation(null);
    setShowLockdownWarning(false);
  };

  const handleSubmitQuiz = () => {
    if (!currentLesson.quiz) return;
    setQuizSubmitted(true);

    // If currently in fullscreen lockdown, exit cleanly without logging violation
    if (document.fullscreenElement) {
      isFullscreenRequestedRef.current = false;
      document.exitFullscreen().catch(() => {});
      setIsFullscreenLockdown(false);
    }

    let correctCount = 0;
    currentLesson.quiz.forEach((q) => {
      if (selectedQuizAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / currentLesson.quiz.length) * 100);
    recordQuizScore(course.id, currentLesson.id, score);

    if (score >= PASS_MARK) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      author: 'Alex Rivera (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      timestamp: 'Just now',
      content: questionInput.trim(),
      upvotes: 1,
    };

    setCommentsList([newComment, ...commentsList]);
    setQuestionInput('');

    // Secure form dispatch with CSRF token verification
    try {
      await submitProtectedForm('/api/forms/qa-discussion', {
        lessonId: currentLesson.id,
        courseId: course.id,
        content: newComment.content,
        _csrf: csrfToken,
      });
    } catch (err) {
      console.warn('QA comment synced locally; CSRF telemetry recorded:', err);
    }
  };

  const isCompleted = progress?.completedLessonIds.includes(currentLesson.id);
  const courseCompleted = isCourseCompleted(course.id);
  const progressPct = getCourseProgressPercentage(course.id);

  if (!isCourseUnlocked(course.id)) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-6 sm:p-10 bg-white dark:bg-[#0c1936] rounded-3xl border border-amber-400/40 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-500 border border-amber-400/40 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-300/40">
            Statutory Compliance Gate · Section 34 AML/CFT Act 2020
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Course Access Locked
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Access to <strong className="text-slate-900 dark:text-white">{course?.title}</strong>, interactive lessons, regulatory assessments, and digital CPD certificates requires a registered and settled training seat.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-left max-w-lg mx-auto space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>How to unlock this course:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Already have a company token?</strong> Click &ldquo;Redeem Activation Token&rdquo; below and enter your corporate license key.</li>
            <li><strong>Need to register your team or yourself?</strong> Register your seats, receive your official proforma invoice, and settle via MCB wire transfer.</li>
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsRedeemModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Key className="w-4 h-4" />
            <span>Redeem Activation Token</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCourseForCheckout(course);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#071433] hover:bg-[#0e224e] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer border border-[#1b356e]"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Register &amp; Settle Seats</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            Return to Overview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="complisey-secure-classroom" className="space-y-4 pb-16 relative">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Real-time Cloud Progress Sync Indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all"
            style={{
              backgroundColor: syncStatus === 'syncing' ? '#fffbeb' : '#f0fdf4',
              borderColor: syncStatus === 'syncing' ? '#fde68a' : '#bbf7d0',
              color: syncStatus === 'syncing' ? '#92400e' : '#166534',
            }}
            title={syncMessage || 'Real-time progress sync across devices active'}
          >
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Syncing to DB...</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cloud Synced ({progressPct}%)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </>
            )}
          </div>

          {/* Offline Status & Download Toggle */}
          <button
            onClick={handleToggleOfflineDownload}
            disabled={isDownloadingOffline || isCorporateLearner}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-2xs ${
              isCorporateLearner
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-75'
                : isDownloaded
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title={
              isCorporateLearner
                ? 'Downloads Restricted: Direct downloads are prohibited under corporate licensing plans.'
                : isDownloaded
                ? 'Downloaded for offline study (click to remove)'
                : 'Download course for offline study'
            }
          >
            <HardDriveDownload className={`w-3.5 h-3.5 ${isDownloadingOffline ? 'animate-bounce text-indigo-600' : isDownloaded && !isCorporateLearner ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{isCorporateLearner ? 'Downloads Restricted' : isDownloadingOffline ? 'Downloading...' : isDownloaded ? 'Offline Ready' : 'Download for Offline'}</span>
          </button>

          {/* Night Study Mode Toggle (Eye Strain Reduction) */}
          <ThemeToggle variant="player-bar" />

          {/* Mobile Curriculum Toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-xs"
          >
            <Menu className="w-4 h-4" />
            <span>Curriculum ({progressPct}%)</span>
          </button>

          {courseCompleted && (
            <button
              onClick={() => {
                const cert = claimCertificate(course.id);
                if (cert) setSelectedCertificateForView(cert);
              }}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-xs hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">View Official Certificate</span>
              <span className="sm:hidden">Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Offline Mode Alert or Feedback Notification */}
      {resourceToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resourceToast}</span>
          </div>
          <button onClick={() => setResourceToast(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {!isOnline && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs flex items-center justify-between gap-3 text-amber-950 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-400/30 text-amber-800 shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <span>
              <strong>Offline Study Mode:</strong> Your curriculum syllabus, statutory guide materials, notes, and quiz questions are running from local device cache. Completed lessons and quiz scores are recorded locally and will automatically synchronize with the cloud database when you reconnect.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-400 text-[#071433] text-[10px] font-black uppercase shrink-0">
            Workbox Cache
          </span>
        </div>
      )}

      {/* Progressive Step Wizard Bar */}
      <CourseWizardProgress
        course={course}
        activeModuleIndex={wizardStage.type === 'module' ? wizardStage.moduleIndex : currentModuleIndex}
        activeSubStep={
          wizardStage.type === 'module'
            ? wizardStage.subStep
            : wizardStage.type === 'finalExam'
            ? 'finalExam'
            : 'certificate'
        }
        completedLessonIds={completedLessonIds}
        unitQuizScores={unitQuizScores}
        examScore={examScore}
        onSelectStage={handleSelectStage}
        canAccessStage={canAccessStage}
      />

      {/* Main Classroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols on Desktop: Video Player & Workspace Tabs OR Assessment/Exam/Cert View */}
        <div className="lg:col-span-8 space-y-4 relative overflow-hidden">
          <WatermarkOverlay />
          {wizardStage.type === 'certificate' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <CourseCertificateView
                course={course}
                student={student}
                certificate={progress?.isCompleted ? (claimCertificate(course.id) || null) : null}
                examScore={examScore ?? 96}
                onClaimCertificate={() => claimCertificate(course.id)}
                onViewCertificateModal={(cert) => setSelectedCertificateForView(cert)}
              />
            </div>
          ) : wizardStage.type === 'finalExam' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <FinalExamWizardView
                course={course}
                currentScore={examScore}
                onSaveExamScore={(score) => recordExamScore(course.id, score)}
                onProceedToCertificate={() => {
                  claimCertificate(course.id);
                  setWizardStage({ type: 'certificate' });
                }}
              />
            </div>
          ) : wizardStage.type === 'module' && wizardStage.subStep === 'quiz' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <UnitAssessmentView
                module={course.modules[wizardStage.moduleIndex]}
                moduleIndex={wizardStage.moduleIndex}
                currentScore={unitQuizScores[course.modules[wizardStage.moduleIndex].id]}
                onSaveQuizScore={(score) => recordUnitQuizScore(course.id, course.modules[wizardStage.moduleIndex].id, score)}
                onProceedNext={() => {
                  const nextModIdx = wizardStage.moduleIndex + 1;
                  if (nextModIdx < course.modules.length) {
                    setWizardStage({ type: 'module', moduleIndex: nextModIdx, subStep: 'lessons' });
                    setActiveLessonId(course.modules[nextModIdx].lessons[0].id);
                  } else {
                    setWizardStage({ type: 'finalExam' });
                  }
                }}
              />
            </div>
          ) : (
            <>
              {/* Optional Video Container - Only rendered when genuine video media exists */}
              {currentLesson.type === 'video' && currentLesson.videoUrl && (
                <div className="bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-800 relative group mb-4">
                  <div className="relative aspect-video flex items-center justify-center bg-slate-950">
                    <video
                      ref={videoRef}
                      src={currentLesson.videoUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleTimeUpdate}
                      onEnded={() => markLessonComplete(course.id, currentLesson.id)}
                      onClick={handlePlayPause}
                      className="w-full h-full object-contain cursor-pointer"
                      poster={course.thumbnail}
                      playsInline
                    />

                    {/* Custom Overlay Controls on Hover / Play */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 sm:p-4 text-white opacity-95 transition-opacity">
                      {/* Scrubber */}
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-3"
                      />

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handlePlayPause}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                          >
                            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                          </button>

                          <button
                            onClick={toggleMute}
                            className="text-white/80 hover:text-white transition-colors"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>

                          <span className="font-mono text-[11px] text-slate-300">
                            {formatTime(currentTime)} / {formatTime(duration || currentLesson.durationMinutes * 60)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {/* Speed selector */}
                          <div className="flex items-center bg-white/10 rounded-md p-0.5">
                            {[1, 1.25, 1.5, 2].map((s) => (
                              <button
                                key={s}
                                onClick={() => handleSpeedChange(s)}
                                className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                  playbackRate === s ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                                }`}
                              >
                                {s}x
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={handleFullscreen}
                            className="text-white/80 hover:text-white transition-colors"
                            title="Fullscreen"
                          >
                            <Maximize className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Header & Action Controls */}
              <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {currentModule.title}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{currentLesson.durationMinutes} mins read</span>
                  </div>
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
                    {currentLesson.title}
                  </h2>
                </div>

                {/* Complete Toggle & Next Lesson */}
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <ThemeToggle variant="compact" />

                  <button
                    onClick={() => toggleLessonCompletion(course.id, currentLesson.id)}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-slate-400" />
                        <span>Mark Complete</span>
                      </>
                    )}
                  </button>

                  {nextLesson ? (
                    <button
                      onClick={() => setActiveLessonId(nextLesson.id)}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Next Lesson</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setWizardStage({
                          type: 'module',
                          moduleIndex: currentModuleIndex,
                          subStep: 'quiz',
                        })
                      }
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Take Unit Assessment</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Primary Lesson Content Reader Card */}
              <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Lesson Curriculum &amp; Study Notes
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-semibold tracking-wider uppercase border border-slate-200 dark:border-slate-700 select-none">
                      <ShieldCheck className="w-3 h-3 text-indigo-500" />
                      <span>Copyright Protected Content</span>
                    </div>
                  </div>

                  {/* Render Lesson HTML cleanly with high legibility */}
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base [&_p]:mb-3.5 [&_strong]:text-indigo-950 dark:[&_strong]:text-indigo-300 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 select-none"
                    dangerouslySetInnerHTML={{ __html: currentLesson.notes }}
                  />
                </div>

                {/* Trainer Narration / Audio Lecture Player */}
                {(currentLesson.transcript || currentLesson.audioUrl) && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#071433] via-[#0d2354] to-[#071433] text-white border border-blue-900 shadow-md space-y-3.5 select-none animate-in fade-in duration-200">
                    {/* Header Row: Title & Speed Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-800/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#071433] flex items-center justify-center font-bold shadow-xs shrink-0">
                          <Headphones className="w-5 h-5 text-[#071433]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white tracking-wide">
                              Trainer Voice Lecture
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-900/90 text-amber-300 border border-blue-700">
                              Audio Narration
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            CompliSey Regulatory Faculty Audio Lecture &amp; Analysis
                          </p>
                        </div>
                      </div>

                      {/* Speed & Live Status */}
                      <div className="flex items-center gap-2.5 self-start sm:self-auto">
                        {isNarrationPlaying && !isNarrationPaused && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-[11px] font-semibold animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span>Playing Audio</span>
                          </div>
                        )}
                        {isNarrationPaused && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-300 text-[11px] font-semibold">
                            <span>Paused</span>
                          </div>
                        )}

                        {/* Speed Switcher */}
                        <div className="flex items-center bg-[#050f26] border border-blue-900/80 rounded-lg p-0.5 text-xs">
                          {[0.85, 1.0, 1.25, 1.5].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => handleChangeNarrationSpeed(speed)}
                              className={`px-2 py-1 rounded font-mono text-[11px] font-bold transition-colors cursor-pointer ${
                                narrationSpeed === speed
                                  ? 'bg-amber-400 text-[#071433]'
                                  : 'text-slate-300 hover:text-white'
                              }`}
                              title={`Speed ${speed}x`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Playback Control Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#050f26]/80 p-3 rounded-xl border border-blue-900/60">
                      <div className="flex items-center gap-2">
                        {!isNarrationPlaying || isNarrationPaused ? (
                          <button
                            onClick={handlePlayNarration}
                            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer hover:scale-[1.02]"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>{isNarrationPaused ? 'Resume Lecture' : 'Listen to Lecture'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={handlePauseNarration}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#071433] text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                          >
                            <Pause className="w-4 h-4 fill-current" />
                            <span>Pause</span>
                          </button>
                        )}

                        {(isNarrationPlaying || isNarrationPaused) && (
                          <button
                            onClick={handleStopNarration}
                            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Stop & Restart Lecture"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restart</span>
                          </button>
                        )}
                      </div>

                      {/* Transcript Accordion Trigger */}
                      <button
                        onClick={() => setShowWrittenTranscript(!showWrittenTranscript)}
                        className="text-xs font-bold text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-white/5"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>{showWrittenTranscript ? 'Hide Written Transcript' : 'Read Written Transcript'}</span>
                        {showWrittenTranscript ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Collapsible Written Transcript Accordion */}
                    {showWrittenTranscript && (
                      <div className="p-4 sm:p-5 rounded-xl bg-white text-slate-900 space-y-2 border border-slate-200 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-100 pb-2 mb-2">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                            <span>Trainer Lecture Transcript (Read Along)</span>
                          </div>
                          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                            CompliSey Proprietary
                          </span>
                        </div>
                        <div
                          className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed [&_p]:mb-2 [&_strong]:font-bold select-none"
                          dangerouslySetInnerHTML={{ __html: currentLesson.transcript }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Lesson Bottom Navigation Bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {prevLesson ? (
                    <button
                      onClick={() => setActiveLessonId(prevLesson.id)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous: {prevLesson.title}</span>
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => toggleLessonCompletion(course.id, currentLesson.id)}
                      className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Marked Complete</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-slate-400" />
                          <span>Mark as Read</span>
                        </>
                      )}
                    </button>

                    {nextLesson ? (
                      <button
                        onClick={() => setActiveLessonId(nextLesson.id)}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Next Lesson</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setWizardStage({
                            type: 'module',
                            moduleIndex: currentModuleIndex,
                            subStep: 'quiz',
                          })
                        }
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Take Unit Assessment</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

          {/* Tabbed Interactive Workspace */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Tabs Header */}
            <div className="border-b border-slate-200 px-4 flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTabName('notes')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTabName === 'notes'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Notes & Code</span>
              </button>

              <button
                onClick={() => setActiveTabName('quiz')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTabName === 'quiz'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Knowledge Check</span>
                {currentLesson.quiz && (
                  <span className="px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold">
                    {currentLesson.quiz.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTabName('resources')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTabName === 'resources'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Resources</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                  {currentLesson.resources?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTabName('qa')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTabName === 'qa'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discussion Q&A</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                  {commentsList.length}
                </span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 sm:p-6">
              {/* TAB 1: Notes & Personal Notepad */}
              {activeTabName === 'notes' && (
                <div className="space-y-6 relative overflow-hidden min-h-[300px]">
                  {/* Dynamic Watermark Overlay */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05] select-none flex items-center justify-center z-0">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-24 -rotate-12 transform scale-125 w-full h-full justify-items-center items-center text-center">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="font-mono text-slate-800 text-[9px] font-black uppercase leading-tight whitespace-nowrap">
                          PROPRIETARY COMPLISEY ACADEMY<br />
                          IP RESTRICTED &amp; COMPLIANCE LOGGER<br />
                          LICENSED TO: {student.name}<br />
                          {student.email}<br />
                          {new Date().toISOString().split('T')[0]}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructor Lecture Notes */}
                  <div className="space-y-3 relative z-10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Lesson Key Takeaway &amp; Summary
                    </h4>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {currentLesson.summary}
                    </div>
                  </div>

                  {/* Student's Personal Notebook */}
                  <div className="pt-4 border-t border-slate-200 relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Bookmark className="w-4 h-4 text-indigo-600" />
                        <span>Your Personal Student Notepad (Saved Automatically)</span>
                      </label>
                      {noteSavedFeedback && (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Saved!
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={personalNoteText}
                      onChange={(e) => setPersonalNoteText(e.target.value)}
                      onBlur={handleSaveNote}
                      placeholder="Write your notes, key insights, questions or code reminders for this lesson..."
                      className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/30 text-slate-800"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleSaveNote}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Interactive Quiz with Quiz Lockdown Proctoring */}
              {activeTabName === 'quiz' && (
                <div className="space-y-6">
                  {currentLesson.quiz && currentLesson.quiz.length > 0 ? (
                    <div className="space-y-5">
                      {/* Proctoring Lockdown Status Banner */}
                      <QuizLockdownBanner
                        violations={lockdownViolations}
                        isFullscreen={isFullscreenLockdown}
                        onToggleFullscreen={handleToggleFullscreenLockdown}
                        onViewAuditLog={() => setShowAuditModal(true)}
                        isSubmitted={quizSubmitted}
                        score={progress?.quizScores?.[currentLesson.id]}
                        passMark={PASS_MARK}
                      />

                      {/* Header with 80% pass-mark specification */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>AML/CFT Regulatory Assessment</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                              80% Pass-Mark
                            </span>
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Seychelles reporting entity qualification standard. Score <strong>80% or higher</strong> to pass.
                          </p>
                        </div>
                        {progress?.quizScores?.[currentLesson.id] !== undefined && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto ${
                              progress.quizScores[currentLesson.id] >= PASS_MARK
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            Score: {progress.quizScores[currentLesson.id]}% (
                            {progress.quizScores[currentLesson.id] >= PASS_MARK ? 'PASSED' : 'BELOW 80%'})
                          </span>
                        )}
                      </div>

                      {/* Academic Integrity & Results Card when submitted */}
                      {quizSubmitted && (
                        <div
                          className={`p-4 rounded-2xl border transition-all ${
                            (progress?.quizScores?.[currentLesson.id] ?? 0) >= PASS_MARK
                              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                              : 'bg-amber-50/90 border-amber-300 text-amber-950'
                          } space-y-3`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  (progress?.quizScores?.[currentLesson.id] ?? 0) >= PASS_MARK
                                    ? 'bg-emerald-200 text-emerald-800'
                                    : 'bg-amber-200 text-amber-800'
                                }`}
                              >
                                {(progress?.quizScores?.[currentLesson.id] ?? 0) >= PASS_MARK ? (
                                  <ShieldCheck className="w-5 h-5" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <h5 className="text-sm font-black">
                                  {(progress?.quizScores?.[currentLesson.id] ?? 0) >= PASS_MARK
                                    ? 'Assessment Passed (≥80% Standard Met)'
                                    : 'Passing Threshold Not Reached (<80% Required)'}
                                </h5>
                                <p className="text-xs text-slate-600">
                                  Achieved: <strong>{progress?.quizScores?.[currentLesson.id]}%</strong> · Mandatory threshold: <strong>80%</strong>
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleRetakeQuiz}
                              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                            >
                              <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Retake for Clean Record</span>
                            </button>
                          </div>

                          <div className="pt-2.5 border-t border-slate-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              {lockdownViolations.length === 0 ? (
                                <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Academic Integrity: Verified Clean (0 tab switches or focus departures)</span>
                                </span>
                              ) : (
                                <span className="text-rose-800 font-bold flex items-center gap-1.5">
                                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                                  <span>
                                    Academic Integrity: Flagged with {lockdownViolations.length} tab switch event(s)
                                  </span>
                                </span>
                              )}
                            </div>

                            {lockdownViolations.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setShowAuditModal(true)}
                                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                              >
                                <History className="w-3.5 h-3.5" />
                                <span>Inspect Violation Timestamps</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Quiz Questions */}
                      {currentLesson.quiz.map((q, idx) => {
                        const selected = selectedQuizAnswers[q.id];
                        const isCorrect = selected === q.correctAnswer;

                        return (
                          <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                              {idx + 1}. {q.question}
                            </h5>

                            <div className="space-y-2">
                              {q.options.map((opt, optIdx) => {
                                let optionStyle =
                                  'border-slate-200 bg-white hover:border-slate-300 text-slate-800';

                                if (quizSubmitted) {
                                  if (optIdx === q.correctAnswer) {
                                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                                  } else if (selected === optIdx && !isCorrect) {
                                    optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                                  }
                                } else if (selected === optIdx) {
                                  optionStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => handleQuizOptionSelect(q.id, optIdx)}
                                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {quizSubmitted && optIdx === q.correctAnswer && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                                <strong>Explanation:</strong> {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                        {/* Real-time sync feedback */}
                        {quizSubmitted && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
                            <Cloud className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              Assessment recorded · <strong>{progressPct}% course completion</strong> saved across devices
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                          {quizSubmitted && (
                            <>
                              <button
                                type="button"
                                onClick={handleRetakeQuiz}
                                className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Retake Assessment</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => forceSyncProgress(course.id)}
                                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                title="Force sync completion to cloud database"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                                <span>Re-sync</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={handleSubmitQuiz}
                            disabled={quizSubmitted || Object.keys(selectedQuizAnswers).length === 0}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {quizSubmitted ? 'Assessment Submitted & Evaluated' : 'Submit 80% Assessment'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No quiz required for this overview lesson. Proceed to the next lecture!
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Downloadable Resources */}
              {activeTabName === 'resources' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Statutory Guides, Compliance Handouts &amp; Policy Templates
                  </h4>
                  {currentLesson.resources && currentLesson.resources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentLesson.resources.map((res) => (
                        <div
                          key={res.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                              <Download className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-900 truncate">{res.name}</p>
                              <span className="text-[11px] text-slate-500 font-mono">{res.size}</span>
                            </div>
                          </div>
                          {!isCorporateLearner ? (
                            <button
                              onClick={() => handleDownloadResource(res.id, res.name)}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-indigo-50 text-indigo-700 text-xs font-bold shadow-2xs shrink-0 flex items-center gap-1 transition-colors"
                              title="Export statutory document (offline supported)"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </button>
                          ) : (
                            <span
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-not-allowed select-none"
                              title="Downloads Restricted: Handouts can only be read inside CompliSey secure browser view under corporate account terms."
                            >
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Locked</span>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No external attachments for this chapter.</p>
                  )}
                </div>
              )}

              {/* TAB 4: Q&A Community Discussion */}
              {activeTabName === 'qa' && (
                <div className="space-y-5">
                  <form onSubmit={handleAddQuestion} className="flex gap-2">
                    <CsrfInput formName="qa-discussion" />
                    <input
                      type="text"
                      placeholder="Ask instructor or fellow students a question about this lesson..."
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-600 text-slate-800"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </form>

                  <div className="space-y-3.5 divide-y divide-slate-100">
                    {commentsList.map((comm) => (
                      <div key={comm.id} className="pt-3.5 first:pt-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={comm.avatar}
                              alt={comm.author}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{comm.author}</span>
                                {comm.isInstructor && (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                                    Instructor
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">{comm.timestamp}</span>
                            </div>
                          </div>
                          <button className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-600">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{comm.upvotes}</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 pl-10 leading-relaxed">{comm.content}</p>

                        {comm.replies && comm.replies.length > 0 && (
                          <div className="pl-10 pt-2 space-y-2">
                            {comm.replies.map((rep) => (
                              <div key={rep.id} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={rep.avatar}
                                    alt={rep.author}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <span className="text-xs font-bold text-indigo-950">{rep.author}</span>
                                  {rep.isInstructor && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-600 text-white">
                                      Instructor Response
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-700 pl-8 leading-relaxed">{rep.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </div>

        {/* Right 4 Cols on Desktop: Course Curriculum Drawer/Sidebar */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden sticky top-20">
            {/* Header with Progress */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Curriculum Structure
                </h3>
                <span className="text-xs font-bold text-indigo-600">{progressPct}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Modules List */}
            <div className="p-2 max-h-[70vh] overflow-y-auto space-y-3">
              {course.modules.map((mod, modIdx) => {
                const modAccessible = canAccessStage({ type: 'module', moduleIndex: modIdx, subStep: 'lessons' });

                return (
                  <div key={mod.id} className="space-y-1">
                    <div className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center justify-between ${
                      modAccessible
                        ? 'text-slate-700 bg-slate-100/60'
                        : 'text-slate-400 bg-slate-100/20'
                    }`}>
                      <span>{mod.title}</span>
                      {!modAccessible && <Lock className="w-3 h-3 text-slate-400" />}
                    </div>
                    <div className="space-y-0.5 pl-1">
                      {mod.lessons.map((les) => {
                        const isCurrent = wizardStage.type === 'module' && wizardStage.subStep === 'lessons' && les.id === currentLesson.id;
                        const isLesCompleted = progress?.completedLessonIds.includes(les.id);

                        return (
                          <button
                            key={les.id}
                            disabled={!modAccessible}
                            onClick={() => {
                              setActiveLessonId(les.id);
                              setWizardStage({ type: 'module', moduleIndex: modIdx, subStep: 'lessons' });
                            }}
                            className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                              !modAccessible
                                ? 'opacity-50 cursor-not-allowed text-slate-400'
                                : isCurrent
                                ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-200'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {!modAccessible ? (
                                <Lock className="w-4 h-4 text-slate-300" />
                              ) : isLesCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : isCurrent ? (
                                <div className="w-4 h-4 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                </div>
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate leading-tight">{les.title}</p>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {les.durationMinutes}m · {les.type}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Sheet for Curriculum (Improves Mobile Responsiveness) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Course Curriculum</h3>
                <p className="text-xs text-indigo-600 font-bold">{progressPct}% Completed</p>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {course.modules.map((mod, modIdx) => {
                const modAccessible = canAccessStage({ type: 'module', moduleIndex: modIdx, subStep: 'lessons' });

                return (
                  <div key={mod.id} className="space-y-1">
                    <div className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center justify-between ${
                      modAccessible
                        ? 'text-slate-800 bg-slate-100'
                        : 'text-slate-400 bg-slate-100/40'
                    }`}>
                      <span>{mod.title}</span>
                      {!modAccessible && <Lock className="w-3 h-3 text-slate-400" />}
                    </div>
                    <div className="space-y-1">
                      {mod.lessons.map((les) => {
                        const isCurrent = wizardStage.type === 'module' && wizardStage.subStep === 'lessons' && les.id === currentLesson.id;
                        const isLesCompleted = progress?.completedLessonIds.includes(les.id);

                        return (
                          <button
                            key={les.id}
                            disabled={!modAccessible}
                            onClick={() => {
                              setActiveLessonId(les.id);
                              setWizardStage({ type: 'module', moduleIndex: modIdx, subStep: 'lessons' });
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start gap-2.5 min-h-[44px] ${
                              !modAccessible
                                ? 'opacity-50 cursor-not-allowed text-slate-400'
                                : isCurrent
                                ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {!modAccessible ? (
                                <Lock className="w-4 h-4 text-slate-300" />
                              ) : isLesCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : isCurrent ? (
                                <div className="w-4 h-4 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                </div>
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate leading-tight font-medium">{les.title}</p>
                              <span className="text-[10px] text-slate-400">
                                {les.durationMinutes} mins · {les.type}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Academic Integrity Quiz Lockdown Proctoring Modals */}
      <QuizLockdownWarningModal
        isOpen={showLockdownWarning}
        onClose={() => setShowLockdownWarning(false)}
        latestViolation={latestViolation}
        totalViolations={lockdownViolations.length}
      />

      <QuizLockdownAuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        violations={lockdownViolations}
        courseTitle={course.title}
      />
    </div>
  );
};
