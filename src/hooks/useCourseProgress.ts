import { useEffect, useState, useRef, useCallback } from 'react';
import { progressSyncService, SyncStatus } from '../services/progressSyncService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type WizardStepId = 'introduction' | 'quiz1' | 'content2' | 'quiz2' | 'finalExam' | 'completed';

interface SavedWizardState {
  currentStep: WizardStepId;
  quiz1Submitted: boolean;
  quiz1Score: number;
  quiz2Submitted: boolean;
  quiz2Score: number;
  examSubmitted: boolean;
  examScore: number;
  unlockedSteps: Record<WizardStepId, boolean>;
}

export function useCourseProgress(
  courseId: string,
  studentId: string,
  studentName?: string
) {
  // Local states
  const [currentStep, setCurrentStep] = useState<WizardStepId>('introduction');
  const [quiz1Submitted, setQuiz1Submitted] = useState(false);
  const [quiz1Score, setQuiz1Score] = useState(0);
  const [quiz2Submitted, setQuiz2Submitted] = useState(false);
  const [quiz2Score, setQuiz2Score] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [unlockedSteps, setUnlockedSteps] = useState<Record<WizardStepId, boolean>>({
    introduction: true,
    quiz1: true,
    content2: false,
    quiz2: false,
    finalExam: false,
    completed: false,
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Use refs to keep track of the most current values to avoid dependency loop in triggerSync
  const stateRef = useRef<SavedWizardState>({
    currentStep,
    quiz1Submitted,
    quiz1Score,
    quiz2Submitted,
    quiz2Score,
    examSubmitted,
    examScore,
    unlockedSteps,
  });

  // Track the timestamp of the last local update we sent
  const lastLocalUpdateRef = useRef<string>('');
  // Prevent infinite loops during remote load updates
  const isUpdatingFromRemoteRef = useRef(false);

  // Keep ref in sync
  useEffect(() => {
    stateRef.current = {
      currentStep,
      quiz1Submitted,
      quiz1Score,
      quiz2Submitted,
      quiz2Score,
      examSubmitted,
      examScore,
      unlockedSteps,
    };
  }, [
    currentStep,
    quiz1Submitted,
    quiz1Score,
    quiz2Submitted,
    quiz2Score,
    examSubmitted,
    examScore,
    unlockedSteps,
  ]);

  // Sync state changes to backend Firestore
  const triggerSync = useCallback(async (customState?: Partial<SavedWizardState>) => {
    if (isUpdatingFromRemoteRef.current) return;

    try {
      setIsSyncing(true);
      setSyncStatus('syncing');

      const activeState = { ...stateRef.current, ...customState };
      
      // Calculate completion percent based on 5 stages (Intro, Quiz1, Content2, Quiz2, Exam)
      let completedStages = 0;
      if (activeState.currentStep !== 'introduction' || activeState.unlockedSteps.content2) completedStages++;
      if (activeState.unlockedSteps.content2) completedStages++;
      if (activeState.unlockedSteps.finalExam || (activeState.currentStep !== 'introduction' && activeState.currentStep !== 'quiz1' && activeState.currentStep !== 'content2')) completedStages++;
      if (activeState.unlockedSteps.finalExam) completedStages++;
      if (activeState.unlockedSteps.completed || (activeState.examSubmitted && activeState.examScore >= 80)) completedStages++;
      
      const progressPercent = completedStages * 20;
      const nowIso = new Date().toISOString();
      lastLocalUpdateRef.current = nowIso;

      const docId = `${studentId.replace(/[^a-zA-Z0-9_-]/g, '_')}_${courseId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      const docRef = doc(db, 'student_progress', docId);

      await setDoc(docRef, {
        studentId,
        studentName: studentName || 'Student',
        courseId,
        courseTitle: 'Course Wizard Module',
        completionPercentage: progressPercent,
        completedLessonIds: Object.keys(activeState.unlockedSteps).filter(k => activeState.unlockedSteps[k as WizardStepId]),
        quizScores: {
          quiz1: activeState.quiz1Score,
          quiz2: activeState.quiz2Score,
          exam: activeState.examScore,
        },
        extraState: {
          currentStep: activeState.currentStep,
          quiz1Submitted: activeState.quiz1Submitted,
          quiz1Score: activeState.quiz1Score,
          quiz2Submitted: activeState.quiz2Submitted,
          quiz2Score: activeState.quiz2Score,
          examSubmitted: activeState.examSubmitted,
          examScore: activeState.examScore,
          unlockedSteps: activeState.unlockedSteps,
        },
        isCompleted: activeState.unlockedSteps.completed,
        updatedAt: nowIso,
      }, { merge: true });

      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('Failed to sync progress to database:', err);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  }, [courseId, studentId, studentName]);

  // Real-time listener for multi-session sync
  useEffect(() => {
    if (!studentId || !courseId) return;

    setSyncStatus('syncing');
    const unsubscribe = progressSyncService.subscribeToStudentProgress(
      studentId,
      (records) => {
        const record = records.find(r => r.courseId === courseId);
        if (!record || !record.updatedAt) {
          setSyncStatus('idle');
          return;
        }

        // Avoid writing back remote updates we just made
        if (record.updatedAt === lastLocalUpdateRef.current) {
          setSyncStatus('synced');
          return;
        }

        // Extract extraState and update state variables if remote is newer
        const remoteExtra = (record as any).extraState as SavedWizardState | undefined;
        if (remoteExtra) {
          isUpdatingFromRemoteRef.current = true;
          
          if (remoteExtra.currentStep) setCurrentStep(remoteExtra.currentStep);
          if (remoteExtra.quiz1Submitted !== undefined) setQuiz1Submitted(remoteExtra.quiz1Submitted);
          if (remoteExtra.quiz1Score !== undefined) setQuiz1Score(remoteExtra.quiz1Score);
          if (remoteExtra.quiz2Submitted !== undefined) setQuiz2Submitted(remoteExtra.quiz2Submitted);
          if (remoteExtra.quiz2Score !== undefined) setQuiz2Score(remoteExtra.quiz2Score);
          if (remoteExtra.examSubmitted !== undefined) setExamSubmitted(remoteExtra.examSubmitted);
          if (remoteExtra.examScore !== undefined) setExamScore(remoteExtra.examScore);
          if (remoteExtra.unlockedSteps) setUnlockedSteps(remoteExtra.unlockedSteps);

          setTimeout(() => {
            isUpdatingFromRemoteRef.current = false;
          }, 100);
        }
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
      }
    );

    return () => unsubscribe();
  }, [courseId, studentId]);

  // Wrapper actions that trigger sync automatically
  const updateCurrentStep = (step: WizardStepId) => {
    setCurrentStep(step);
    triggerSync({ currentStep: step });
  };

  const updateQuiz1 = (score: number, submitted: boolean, unlocked: Record<WizardStepId, boolean>) => {
    setQuiz1Score(score);
    setQuiz1Submitted(submitted);
    setUnlockedSteps(unlocked);
    triggerSync({ quiz1Score: score, quiz1Submitted: submitted, unlockedSteps: unlocked });
  };

  const updateQuiz2 = (score: number, submitted: boolean, unlocked: Record<WizardStepId, boolean>) => {
    setQuiz2Score(score);
    setQuiz2Submitted(submitted);
    setUnlockedSteps(unlocked);
    triggerSync({ quiz2Score: score, quiz2Submitted: submitted, unlockedSteps: unlocked });
  };

  const updateExam = (score: number, submitted: boolean, unlocked: Record<WizardStepId, boolean>) => {
    setExamScore(score);
    setExamSubmitted(submitted);
    setUnlockedSteps(unlocked);
    triggerSync({ examScore: score, examSubmitted: submitted, unlockedSteps: unlocked });
  };

  const resetProgress = () => {
    const freshUnlocked = {
      introduction: true,
      quiz1: true,
      content2: false,
      quiz2: false,
      finalExam: false,
      completed: false,
    };
    setCurrentStep('introduction');
    setQuiz1Submitted(false);
    setQuiz1Score(0);
    setQuiz2Submitted(false);
    setQuiz2Score(0);
    setExamSubmitted(false);
    setExamScore(0);
    setUnlockedSteps(freshUnlocked);

    triggerSync({
      currentStep: 'introduction',
      quiz1Submitted: false,
      quiz1Score: 0,
      quiz2Submitted: false,
      quiz2Score: 0,
      examSubmitted: false,
      examScore: 0,
      unlockedSteps: freshUnlocked,
    });
  };

  return {
    currentStep,
    setCurrentStep: updateCurrentStep,
    quiz1Submitted,
    setQuiz1Submitted,
    quiz1Score,
    setQuiz1Score,
    quiz2Submitted,
    setQuiz2Submitted,
    quiz2Score,
    setQuiz2Score,
    examSubmitted,
    setExamSubmitted,
    examScore,
    setExamScore,
    unlockedSteps,
    setUnlockedSteps,
    syncStatus,
    isSyncing,
    lastSyncedAt,
    updateQuiz1,
    updateQuiz2,
    updateExam,
    resetProgress,
  };
}
