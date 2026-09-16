import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ArrowRight,
  Sparkles,
  Flame,
  Target,
  Filter,
  PlusCircle,
  BarChart3,
  Compass,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { EnrolledCourseProgress } from '../types';

export const CourseDashboard: React.FC = () => {
  const {
    student,
    courses,
    enrolledProgress,
    openCoursePlayer,
    isCourseCompleted,
    getCourseProgressPercentage,
    claimCertificate,
    certificates,
    setSelectedCertificateForView,
    setActiveTab,
    setSelectedCourseForCheckout,
    formatPrice,
  } = useAcademy();

  const [filterTab, setFilterTab] = useState<'all' | 'in-progress' | 'completed'>('all');

  // Enrolled courses
  const enrolledCourses = courses.filter((c) => enrolledProgress[c.id]);

  // Find most recently accessed or active course to "Resume"
  const activeCourseId = Object.keys(enrolledProgress)[0] || courses[0]?.id;
  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];
  const activeProgress = enrolledProgress[activeCourse?.id];
  const activePercent = activeCourse ? getCourseProgressPercentage(activeCourse.id) : 0;

  // Next recommended lesson
  const nextLessonId = activeProgress?.activeLessonId || activeCourse?.modules[0]?.lessons[0]?.id;
  const nextLesson = activeCourse?.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === nextLessonId);

  // Filter courses
  const filteredCourses = enrolledCourses.filter((course) => {
    const isDone = isCourseCompleted(course.id);
    if (filterTab === 'completed') return isDone;
    if (filterTab === 'in-progress') return !isDone;
    return true;
  });

  const progressList = Object.values(enrolledProgress) as EnrolledCourseProgress[];
  const totalCompletedLessons = progressList.reduce(
    (sum, p) => sum + p.completedLessonIds.length,
    0
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Motivation Banner */}
      <div className="bg-[#071433] text-white rounded-2xl p-5 sm:p-7 shadow-lg relative overflow-hidden border border-[#14326d]">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                Reporting Entity Staff Training
              </span>
              <span className="flex items-center gap-1 text-slate-300 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Audit File: 2026 Statutory Cycle
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight font-['IBM_Plex_Sans'] text-white">
              Welcome back, {student.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You are completing required AML/CFT training for <strong className="text-white">Victoria Fiduciary Services Ltd</strong>. You have logged <strong className="text-amber-300">{student.loggedHoursThisWeek} hours</strong> toward your annual training audit target.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-black text-white font-['Space_Grotesk']">
                {enrolledCourses.length}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Active Seats</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-black text-emerald-400 font-['Space_Grotesk']">
                {totalCompletedLessons}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Lessons Passed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-black text-amber-400 font-['Space_Grotesk']">
                {certificates.length}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Certificates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero "Resume Current Module" Card */}
      {activeCourse && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <div className="relative w-full sm:w-36 sm:h-24 aspect-video sm:aspect-auto rounded-xl overflow-hidden shrink-0 bg-slate-900">
                <img
                  src={activeCourse.thumbnail}
                  alt={activeCourse.title}
                  className="w-full h-full object-cover opacity-85"
                />
                <button
                  onClick={() => openCoursePlayer(activeCourse.id, nextLessonId)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-[#071433] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-[#071433] ml-0.5" />
                  </div>
                </button>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#071433]/10 text-[#071433]">
                    {activeCourse.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {activePercent}% Completed
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {activeCourse.title}
                </h3>

                {nextLesson && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Next: </span>
                    <strong className="text-slate-800">{nextLesson.title}</strong>
                    <span className="text-slate-400">({nextLesson.durationMinutes}m)</span>
                  </p>
                )}

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Resume button */}
            <div className="w-full lg:w-auto flex sm:flex-row lg:flex-col items-center gap-2.5 shrink-0">
              <button
                onClick={() => openCoursePlayer(activeCourse.id, nextLessonId)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#071433] hover:bg-[#0e2a6d] text-amber-300 text-xs sm:text-sm font-bold shadow-md shadow-[#071433]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue Course</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {activePercent === 100 && (
                <button
                  onClick={() => {
                    const cert = claimCertificate(activeCourse.id);
                    if (cert) setSelectedCertificateForView(cert);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>View Certificate</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Course List Section Header with Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-['IBM_Plex_Sans']">
              Your AML/CFT Regulatory Training File
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Each completed course issues an official CompliSey Certificate for FSA/FIU inspection files.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl">
            {(['all', 'in-progress', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterTab === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'all' ? 'All Seats' : tab === 'in-progress' ? 'In Progress' : 'Audit Ready'}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const progress = enrolledProgress[course.id];
              const percent = getCourseProgressPercentage(course.id);
              const isCompleted = isCourseCompleted(course.id);
              const cert = certificates.find((c) => c.courseId === course.id);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#071433]/90 text-white backdrop-blur-xs">
                          {course.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white/95 text-slate-800 shadow-xs">
                          {course.totalHours} hrs CPD
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {course.shortDescription}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium">Compliance Progress</span>
                          <span className="font-bold text-slate-800">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">
                      {progress?.completedLessonIds.length || 0} of {course.lessonsCount} lessons
                    </span>

                    {isCompleted ? (
                      <button
                        onClick={() => {
                          const c = cert || claimCertificate(course.id);
                          if (c) setSelectedCertificateForView(c);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Diploma</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openCoursePlayer(course.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#071433] hover:bg-[#0e2a6d] text-amber-300 text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span>Resume</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No courses match this filter</h3>
            <p className="text-xs text-slate-500 mt-1">
              Explore the CompliSey catalogue to add statutory AML/CFT courses for your staff.
            </p>
            <button
              onClick={() => setActiveTab('explore')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#071433] text-amber-300 text-xs font-bold hover:bg-[#0c245c]"
            >
              Browse AML Courses
            </button>
          </div>
        )}
      </div>

      {/* Browse More Courses Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 to-[#071433] rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-lg">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            Prepaid Twelve-Month Seats
          </span>
          <h3 className="text-base sm:text-lg font-bold">
            Need AML/CFT Training for Additional Staff or MLROs?
          </h3>
          <p className="text-xs text-slate-300">
            Fulfill mandatory ongoing training under Section 34 of the AML/CFT Act 2020. Corporate team discounts available with instant gateway checkout or corporate invoicing.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5"
        >
          <span>Explore All Short Courses</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
