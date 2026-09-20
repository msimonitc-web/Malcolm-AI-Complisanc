import React, { useState, useEffect } from 'react';
import {
  X,
  HardDriveDownload,
  CheckCircle2,
  Trash2,
  Download,
  FileText,
  WifiOff,
  Wifi,
  Layers,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { Course } from '../types';
import {
  offlineStorageService,
  DownloadedCourseMeta,
} from '../services/offlineStorageService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineCourseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCourse: (courseId: string) => void;
}

export const OfflineCourseManagerModal: React.FC<OfflineCourseManagerModalProps> = ({
  isOpen,
  onClose,
  onOpenCourse,
}) => {
  const { courses, enrolledProgress, isCourseUnlocked } = useAcademy();
  const { isOnline } = useOnlineStatus();

  const [downloadedList, setDownloadedList] = useState<DownloadedCourseMeta[]>([]);
  const [storageInfo, setStorageInfo] = useState({ totalBytes: 0, totalFormatted: '0 MB', count: 0 });
  const [downloadingCourseId, setDownloadingCourseId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const refreshState = () => {
    setDownloadedList(offlineStorageService.getDownloadedCourses());
    setStorageInfo(offlineStorageService.getTotalOfflineStorage());
  };

  useEffect(() => {
    if (isOpen) {
      refreshState();
    }
    const unsubscribe = offlineStorageService.subscribe(refreshState);
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadCourse = async (course: Course) => {
    setDownloadingCourseId(course.id);
    try {
      const meta = await offlineStorageService.downloadCourse(course);
      refreshState();
      setFeedbackMessage(`"${course.title}" successfully downloaded for offline study (${meta.sizeFormatted})!`);
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (e) {
      console.error(e);
      setFeedbackMessage('Failed to download course content.');
    } finally {
      setDownloadingCourseId(null);
    }
  };

  const handleRemoveCourse = (courseId: string, courseTitle: string) => {
    offlineStorageService.removeDownloadedCourse(courseId);
    refreshState();
    setFeedbackMessage(`Removed "${courseTitle}" from offline storage.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all offline cached courses?')) {
      await offlineStorageService.clearAllOfflineStorage();
      refreshState();
      setFeedbackMessage('All offline course content has been cleared from device storage.');
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleDownloadSampleResource = (course: Course) => {
    const firstRes = course.modules[0]?.lessons[0]?.resources?.[0];
    if (firstRes) {
      offlineStorageService.downloadOfflineResource(firstRes.id, course);
      setFeedbackMessage(`Exported offline statutory material "${firstRes.name}"!`);
      setTimeout(() => setFeedbackMessage(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#071433] via-[#0c2356] to-[#071433] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#071433] flex items-center justify-center font-bold shadow-xs shrink-0">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Offline Course Content &amp; Workbox Storage
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                  isOnline ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  <span>{isOnline ? 'Connected' : 'Offline'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Download curriculum modules, statutory notes, and reference guides to continue learning without internet.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Storage & Service Worker Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Offline Courses</span>
              <p className="text-xl font-black text-slate-900">{storageInfo.count}</p>
              <p className="text-[11px] text-slate-500">Ready for disconnected study</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Device Cache Footprint</span>
              <p className="text-xl font-black text-blue-700">{storageInfo.totalFormatted}</p>
              <p className="text-[11px] text-slate-500">Service worker &amp; storage data</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Workbox Strategy</span>
              <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Stale-While-Revalidate</span>
              </p>
              <p className="text-[11px] text-slate-500">Precached dashboard UI shell</p>
            </div>
          </div>

          {/* Explanation Callout */}
          <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">
                How Offline Mode Operates with Workbox Service Worker:
              </p>
              <p className="text-blue-800 leading-relaxed text-[11px]">
                The service worker caches the core dashboard interface, stylesheets, and fonts automatically. When you download a course, its complete lesson syllabus, regulatory notes, quizzes, and statutory guidance PDFs are saved to your device, allowing uninterrupted study even on remote flights, marine vessels, or during island telecommunication outages.
              </p>
            </div>
          </div>

          {/* Enrolled Courses Download Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Course Catalog &amp; Offline Availability
              </h3>

              {downloadedList.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Downloads</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {courses.map((course) => {
                const isDownloaded = offlineStorageService.isCourseDownloaded(course.id);
                const isEnrolled = isCourseUnlocked(course.id);
                const isDownloading = downloadingCourseId === course.id;
                const downloadedMeta = downloadedList.find((d) => d.courseId === course.id);

                return (
                  <div
                    key={course.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isDownloaded
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {course.title}
                            </span>
                            {isDownloaded && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Downloaded ({downloadedMeta?.sizeFormatted || '4.2 MB'})</span>
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-1 pt-0.5">
                            {course.shortDescription}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600">
                            <span className="flex items-center gap-1 font-medium">
                              <BookOpen className="w-3 h-3 text-slate-400" />
                              <span>{course.lessonsCount} Lessons</span>
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="flex items-center gap-1 font-medium">
                              <FileText className="w-3 h-3 text-slate-400" />
                              <span>Statutory Notes &amp; Quizzes Included</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                        {isDownloaded ? (
                          <>
                            <button
                              onClick={() => {
                                onOpenCourse(course.id);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                            >
                              <span>Study Offline</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDownloadSampleResource(course)}
                              title="Export statutory study notes file directly"
                              className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleRemoveCourse(course.id, course.title)}
                              title="Delete from offline storage"
                              className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 text-[11px]">
            CompliSey Academy PWA Service Worker v2026.1 · Workbox Offline Cache
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
