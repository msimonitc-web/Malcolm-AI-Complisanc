import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, ensureFirebaseAuth } from '../lib/firebase';

export interface RemoteProgressRecord {
  studentId: string;
  studentName?: string;
  courseId: string;
  courseTitle?: string;
  completionPercentage: number;
  completedLessonIds: string[];
  quizScores?: Record<string, number>;
  lastQuizLessonId?: string;
  lastQuizScore?: number;
  isCompleted: boolean;
  updatedAt: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

class ProgressSyncService {
  private syncListeners: Set<(status: SyncStatus, lastSyncedAt?: Date, info?: string) => void> = new Set();
  private currentStatus: SyncStatus = 'idle';
  private lastSyncedAt: Date | null = null;
  private lastSyncMessage: string = '';

  private getDocId(studentId: string, courseId: string): string {
    const cleanStudent = (studentId || 'default_student').replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanCourse = (courseId || 'course').replace(/[^a-zA-Z0-9_-]/g, '_');
    return `${cleanStudent}_${cleanCourse}`.substring(0, 120);
  }

  public getStatus() {
    return {
      status: this.currentStatus,
      lastSyncedAt: this.lastSyncedAt,
      message: this.lastSyncMessage,
    };
  }

  public onStatusChange(callback: (status: SyncStatus, lastSyncedAt?: Date, info?: string) => void) {
    this.syncListeners.add(callback);
    callback(this.currentStatus, this.lastSyncedAt || undefined, this.lastSyncMessage);
    return () => {
      this.syncListeners.delete(callback);
    };
  }

  private updateStatus(status: SyncStatus, message: string = '') {
    this.currentStatus = status;
    this.lastSyncMessage = message;
    if (status === 'synced') {
      this.lastSyncedAt = new Date();
    }
    this.syncListeners.forEach((fn) => fn(status, this.lastSyncedAt || undefined, message));
  }

  /**
   * Saves student course completion percentage and quiz module status to Firestore
   */
  public async syncProgressOnQuizFinish(params: {
    studentId: string;
    studentName?: string;
    courseId: string;
    courseTitle?: string;
    completionPercentage: number;
    completedLessonIds: string[];
    quizScores?: Record<string, number>;
    lastQuizLessonId?: string;
    lastQuizScore?: number;
    isCompleted: boolean;
  }): Promise<boolean> {
    try {
      this.updateStatus('syncing', `Syncing quiz completion (${params.completionPercentage}%)...`);
      await ensureFirebaseAuth();

      const docId = this.getDocId(params.studentId, params.courseId);
      const docRef = doc(db, 'student_progress', docId);

      const record: RemoteProgressRecord = {
        studentId: params.studentId,
        studentName: params.studentName || 'Student',
        courseId: params.courseId,
        courseTitle: params.courseTitle || '',
        completionPercentage: Math.min(100, Math.max(0, Math.round(params.completionPercentage))),
        completedLessonIds: params.completedLessonIds || [],
        quizScores: params.quizScores || {},
        lastQuizLessonId: params.lastQuizLessonId || '',
        lastQuizScore: params.lastQuizScore !== undefined ? params.lastQuizScore : 100,
        isCompleted: params.isCompleted,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, record, { merge: true });
      this.updateStatus('synced', `Course completion (${record.completionPercentage}%) saved to database.`);
      return true;
    } catch (error) {
      console.error('Error syncing course progress to Firestore database:', error);
      this.updateStatus('error', 'Sync failed, cached locally.');
      return false;
    }
  }

  /**
   * Fetches latest progress from Firestore for a specific student and course
   */
  public async fetchProgress(studentId: string, courseId: string): Promise<RemoteProgressRecord | null> {
    try {
      await ensureFirebaseAuth();
      const docId = this.getDocId(studentId, courseId);
      const docRef = doc(db, 'student_progress', docId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as RemoteProgressRecord;
      }
      return null;
    } catch (err) {
      console.warn('Error fetching progress from Firestore:', err);
      return null;
    }
  }

  /**
   * Sets up a real-time listener for cross-device synchronization
   * Whenever student progress is updated on another device, this callback receives the new state
   */
  public subscribeToStudentProgress(
    studentId: string,
    onRemoteUpdate: (records: RemoteProgressRecord[]) => void
  ): Unsubscribe {
    const colRef = collection(db, 'student_progress');
    const q = query(colRef, where('studentId', '==', studentId));

    return onSnapshot(
      q,
      (snapshot) => {
        const records: RemoteProgressRecord[] = [];
        snapshot.forEach((docSnap) => {
          records.push(docSnap.data() as RemoteProgressRecord);
        });
        if (records.length > 0) {
          onRemoteUpdate(records);
          this.updateStatus('synced', 'Real-time database sync active across devices.');
        }
      },
      (error) => {
        console.warn('Real-time progress sync snapshot error:', error);
        this.updateStatus('offline', 'Real-time sync paused.');
      }
    );
  }
}

export const progressSyncService = new ProgressSyncService();
