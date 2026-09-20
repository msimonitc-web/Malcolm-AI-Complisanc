import React, { useEffect } from 'react';
import {
  X,
  BookOpen,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Video,
  HelpCircle,
  Eye,
  Zap,
  Lock,
  ExternalLink,
  Key,
} from 'lucide-react';
import { Course } from '../types';
import { CompliseyLogo } from './CompliseyLogo';

interface CourseCurriculumPreviewModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  isEnrolled: boolean;
  onEnrolClick: (course: Course) => void;
  onOpenPlayerClick: (courseId: string) => void;
  onRedeemTokenClick?: () => void;
}

export const CourseCurriculumPreviewModal: React.FC<CourseCurriculumPreviewModalProps> = ({
  course,
  isOpen,
  onClose,
  isEnrolled,
  onEnrolClick,
  onOpenPlayerClick,
  onRedeemTokenClick,
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const totalMinutes = course.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((lSum, l) => lSum + (l.durationMinutes || 0), 0),
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#071433] to-[#0c245c] text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-amber-400 text-[#071433] uppercase tracking-wider">
                  Curriculum Overview
                </span>
                {isEnrolled ? (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    Active Course
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/10 text-amber-300 border border-amber-400/30">
                    Inactive · Activation Required
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/20">
                  {course.category}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Level: {course.level}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {course.title}
              </h2>

              <p className="text-xs text-slate-300 line-clamp-2 max-w-2xl">
                {course.shortDescription}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-200">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{course.totalHours} hrs</strong> CPD ({totalMinutes} mins)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{course.modules.length} Modules</strong> ({course.lessonsCount} lessons)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>80% Pass</strong> Mark
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Section 34 Training Ready</span>
            </div>
          </div>
        </div>

        {/* Non-interactive Notice Banner */}
        <div className={`px-5 py-2.5 border-b flex items-center justify-between gap-3 text-xs shrink-0 ${
          isEnrolled
            ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
            : 'bg-amber-50/95 text-amber-950 border-amber-200/80'
        }`}>
          <div className="flex items-center gap-2">
            {!isEnrolled ? (
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            )}
            <span className="font-medium">
              {!isEnrolled ? (
                <>
                  <strong>Access Restricted:</strong> Full lesson materials, interactive lectures, proctored exams, and digital CPD certificates are locked until registered and paid.
                </>
              ) : (
                <>
                  <strong>Enrolled Seat Active:</strong> You have full access to study modules, take quizzes, and claim your CPD certificate.
                </>
              )}
            </span>
          </div>
          <span className={`hidden sm:inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 ${
            isEnrolled ? 'bg-emerald-200/70 text-emerald-900' : 'bg-amber-200/70 text-amber-900'
          }`}>
            {isEnrolled ? 'SEAT ACTIVE' : 'LOCKED · PAYMENT REQUIRED'}
          </span>
        </div>

        {/* Scrollable Curriculum Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 divide-y divide-slate-100">
          {/* Detailed Description */}
          <div className="pb-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Course Summary &amp; Statutory Scope
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(course.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Module Breakdown List */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-800" />
                <span>Curriculum Modules ({course.modules?.length || 0})</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                {course.lessonsCount || 0} lessons total
              </span>
            </div>

            <div className="space-y-3.5">
              {(course.modules || []).map((mod, modIdx) => (
                <div
                  key={mod.id}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs"
                >
                  {/* Module Header Bar */}
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#071433] text-amber-300 text-[11px] font-black flex items-center justify-center shrink-0">
                          {modIdx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {mod.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 pl-7">
                        {mod.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pl-7 sm:pl-0 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-semibold">
                        {mod.lessons.length} {mod.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                      </span>
                    </div>
                  </div>

                  {/* Lessons in Module */}
                  <div className="p-3 space-y-2 divide-y divide-slate-100">
                    {(mod.lessons || []).map((lesson, lIdx) => (
                      <div
                        key={lesson.id}
                        className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {lesson.type === 'video' ? (
                              <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            ) : lesson.type === 'quiz' ? (
                              <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}
                            <span className="font-semibold text-slate-900">
                              {lesson.title}
                            </span>
                            {lesson.quiz && lesson.quiz.length > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Quiz Included
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500 pl-5.5 leading-relaxed">
                            {lesson.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pl-5.5 sm:pl-0 shrink-0 text-slate-400 font-mono text-[11px]">
                          <span>{lesson.durationMinutes} min</span>
                          <Lock className="w-3 h-3 text-slate-400" title="Unlocked with course seat" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Faculty & Statutory Accreditation */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Regulatory Faculty &amp; Accreditation
              </h3>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                Section 34 AML/CFT Act 2020
              </span>
            </div>
            <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-[#0f2454] p-1.5 flex items-center justify-center shrink-0 shadow-xs border border-blue-900/40">
                <CompliseyLogo className="w-full h-full" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    CompliSey Regulatory Faculty
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                    Institutional Faculty
                  </span>
                </div>
                <div className="text-[11px] text-blue-900 font-medium">
                  Seychelles AML/CFT Specialists · CompliSey Academy
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Independent Continuing Professional Development (CPD) training academy providing specialized AML/CFT compliance curriculum and professional skill development.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            12-month access to all courses, quizzes, and digital CPD certificates.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              Close Overview
            </button>

            {isEnrolled ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPlayerClick(course.id);
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Open in Course Player</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRedeemTokenClick?.();
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-amber-400/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Redeem Token</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEnrolClick(course);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#071433]/20 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-amber-300" />
                  <span>Register &amp; Order Course</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
