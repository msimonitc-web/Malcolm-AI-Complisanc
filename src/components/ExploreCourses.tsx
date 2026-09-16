import React, { useState } from 'react';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  Search,
  Zap,
  Building,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const ExploreCourses: React.FC = () => {
  const {
    courses,
    enrolledProgress,
    setSelectedCourseForCheckout,
    openCoursePlayer,
    formatPrice,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
  } = useAcademy();

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(courses.map((c) => c.category)))];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesDifficulty = selectedDifficulty === 'All' || c.level === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-900/40 border border-blue-700/40 text-blue-900 text-[11px] font-bold uppercase tracking-wider">
              Seychelles Domestic &amp; Global Compliance Curriculum
            </span>
            <span className="text-xs text-amber-700 font-bold">12-Month Prepaid Seats · SCR Pricing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['IBM_Plex_Sans']">
            AML/CFT Courses for Regulated Reporting Entities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Statutory training tailored for Seychelles reporting entities (fiduciaries, CSPs, banks, securities dealers) alongside international programs aligned with FATF 40 Recommendations for cross-border financial centers.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search regulations, SAR, CDD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#071433]"
          />
        </div>
      </div>

      {/* 12-Month Seat Policy Notice Banner */}
      <div className="bg-[#071433] text-white p-4 sm:p-5 rounded-2xl border border-blue-900/50 shadow-md space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-[#071433] text-[10px] font-black uppercase tracking-wider">
                Prepaid Seat Model
              </span>
              <span className="text-xs text-amber-300 font-semibold">Twelve-Month Access to Full Catalogue</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200">
              You pay for a twelve-month prepaid seat, not for certificates. The seat opens the current catalogue (all six courses), unit quizzes, and the 80% exam. A completion certificate is included for each course you pass with no extra charge per PDF.
            </p>
            <p className="text-[11px] text-slate-300 italic">
              * The seat is not a single diploma for the whole catalogue. Pay in full before access. Pay by bank transfer in Seychelles rupees, quoting the CCS booking ID. Facilitated in-house workshops are a separate offering and are not sold through this site.
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/15 shrink-0 text-xs space-y-1">
            <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Seat Price Schedule</div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-300">Individual:</span>
              <span className="font-bold text-white">SCR 1,000 / seat</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-300">Corp 1–5:</span>
              <span className="font-bold text-amber-300">SCR 900 / seat</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-300">Corp 6–10:</span>
              <span className="font-bold text-amber-300">SCR 800 / seat</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-300">Corp 11–20:</span>
              <span className="font-bold text-amber-300">SCR 750 / seat</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-300">Corp 21+:</span>
              <span className="font-bold text-emerald-400">SCR 600 / seat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
              categoryFilter === cat
                ? 'bg-[#071433] text-amber-300 shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = !!enrolledProgress[course.id];

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Header Image */}
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#071433]/90 text-white backdrop-blur-xs">
                    {course.category}
                  </span>
                </div>

                {isEnrolled && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Enrolled Seat
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-500 font-bold mb-1">
                    <div className="flex items-center">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="ml-1 text-slate-800">{course.rating}</span>
                    </div>
                    <span className="text-slate-400">({course.reviewsCount} reviews)</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#071433] transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {course.shortDescription}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.totalHours} hrs CPD
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {course.lessonsCount} lessons & exam
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-semibold">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      CompliSey Certificate
                    </span>
                  </div>
                </div>

                {/* Pricing & Gateway CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-[#071433] font-['Space_Grotesk']">
                        {formatPrice(course.price)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(course.originalPrice)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Prepaid 12-Month Seat
                    </span>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => openCoursePlayer(course.id)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                    >
                      Open Seat
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedCourseForCheckout(course)}
                      className="px-4 py-2.5 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold shadow-md shadow-[#071433]/20 transition-all flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 fill-amber-300" />
                      <span>Enrol with Gateway</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
