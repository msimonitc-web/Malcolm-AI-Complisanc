import React, { useState, useMemo } from 'react';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  Search,
  Zap,
  X,
  Layers,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  PlayCircle,
  FileCheck,
  ShieldCheck,
  Tag,
  SlidersHorizontal,
  ArrowRight,
  Eye,
  ShoppingCart,
  Lock,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { Course, CourseModule } from '../types';
import { CourseCurriculumPreviewModal } from './CourseCurriculumPreviewModal';

interface FlatModuleItem {
  course: Course;
  module: CourseModule;
  moduleIndex: number;
  totalModulesInCourse: number;
  matchesQuery: boolean;
}

export const ExploreCourses: React.FC = () => {
  const {
    courses,
    enrolledProgress,
    isCourseUnlocked,
    setSelectedCourseForCheckout,
    openCoursePlayer,
    formatPrice,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    addToCart,
    setIsCartOpen,
    cart,
  } = useAcademy();

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'courses' | 'modules'>('courses');
  const [expandedCourseModules, setExpandedCourseModules] = useState<Record<string, boolean>>({});
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  // Popular quick-search filter tags
  const POPULAR_TOPICS = [
    'CDD / KYC',
    'FIU Reporting',
    'AML/CFT Act 2020',
    'PEPs',
    'Sanctions',
    'Beneficial Ownership',
    'FATF 40',
  ];

  // Available categories with their counts
  const categories = useMemo(() => {
    const unique = Array.from(new Set(courses.map((c) => c.category)));
    return ['All', ...unique];
  }, [courses]);

  // Difficulty options
  const difficultyLevels = ['All', 'All Levels', 'Intermediate', 'Advanced'];

  // Toggle module expansion for a course card
  const toggleCourseModules = (courseId: string) => {
    setExpandedCourseModules((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // Helper to check if a module matches the search query
  const checkModuleMatches = (module: CourseModule, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    const titleMatch = module.title.toLowerCase().includes(q);
    const descMatch = module.description.toLowerCase().includes(q);
    const lessonMatch = module.lessons.some(
      (l) => l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q)
    );
    return titleMatch || descMatch || lessonMatch;
  };

  // Filter courses based on search query, category, and difficulty
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = searchQuery.toLowerCase().trim();

      // Search matching across course metadata and underlying modules/lessons
      const matchesCourseMeta =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));

      const matchesAnyModule =
        !q ||
        c.modules.some((m) => checkModuleMatches(m, q));

      const matchesSearch = matchesCourseMeta || matchesAnyModule;

      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      const matchesDifficulty =
        selectedDifficulty === 'All' ||
        c.level === selectedDifficulty ||
        (selectedDifficulty === 'All Levels' && c.level === 'All Levels');

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [courses, searchQuery, categoryFilter, selectedDifficulty]);

  // Flattened modules across matching courses for "Modules View"
  const matchingModulesList = useMemo<FlatModuleItem[]>(() => {
    const list: FlatModuleItem[] = [];
    filteredCourses.forEach((c) => {
      c.modules.forEach((mod, idx) => {
        const matchesQ = checkModuleMatches(mod, searchQuery.trim());
        // If searching, prioritize or filter to matching modules
        if (!searchQuery.trim() || matchesQ) {
          list.push({
            course: c,
            module: mod,
            moduleIndex: idx + 1,
            totalModulesInCourse: c.modules.length,
            matchesQuery: matchesQ,
          });
        }
      });
    });
    return list;
  }, [filteredCourses, searchQuery]);

  // Total count of modules matching criteria
  const totalMatchingModulesCount = matchingModulesList.length;

  // Clear all filters
  const resetAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setSelectedDifficulty('All');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' || categoryFilter !== 'All' || selectedDifficulty !== 'All';

  // Helper for difficulty badge styling
  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-900/10 border border-blue-700/20 text-blue-900 text-[11px] font-bold uppercase tracking-wider">
              Seychelles Statutory &amp; International Compliance Curriculum
            </span>
            <span className="text-xs text-amber-700 font-bold hidden sm:inline">
              12-Month Prepaid Seats · SCR Pricing
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['IBM_Plex_Sans']">
            Explore Courses &amp; Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-0.5">
            Search our comprehensive curriculum by statutory topic, regulatory category, or difficulty level. Filter down to individual learning modules and lesson units.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('courses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'courses'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Course Catalogue ({filteredCourses.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('modules')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'modules'
                ? 'bg-[#071433] text-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Module Directory ({totalMatchingModulesCount})</span>
          </button>
        </div>
      </div>

      {/* 12-Month Seat Policy Notice & Cart Shortcuts Banner */}
      <div className="bg-[#071433] text-white p-4 sm:p-5 rounded-2xl border border-blue-900/50 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-[#071433] text-[10px] font-black uppercase tracking-wider">
                Prepaid Statutory Training
              </span>
              <span className="text-xs text-amber-300 font-semibold">Twelve-Month Accredited LMS Access</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200">
              CompliSey Academy provides accredited training for Reporting Entities under Section 34 of the Seychelles AML/CFT Act 2020. Add courses or full packages to your consolidated Checkout Cart to generate an official Proforma Invoice with settlement instructions.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  addToCart({
                    courseId: 'pkg-both',
                    courseTitle: 'CompliSey Academy: Complete 6-Course Curriculum Pack',
                    packageType: 'pack',
                    seatCount: 1,
                    cpdHours: 12,
                    modulesCount: 6,
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#071433] text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-[#071433]" />
                <span>Add Complete Pack (SCR 2,500)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  addToCart({
                    courseId: 'pkg-level-1',
                    courseTitle: 'CompliSey Academy: Level 1 Statutory Foundations',
                    packageType: 'level1',
                    seatCount: 1,
                    cpdHours: 6,
                    modulesCount: 3,
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white border border-blue-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-blue-300" />
                <span>Add Level 1 (SCR 1,250)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  addToCart({
                    courseId: 'pkg-level-2',
                    courseTitle: 'CompliSey Academy: Level 2 Advanced Operations',
                    packageType: 'level2',
                    seatCount: 1,
                    cpdHours: 6,
                    modulesCount: 3,
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-emerald-300" />
                <span>Add Level 2 (SCR 1,500)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-amber-300 border border-blue-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ml-auto"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Cart ({cart.length})</span>
              </button>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/15 shrink-0 text-xs space-y-1.5 min-w-[240px]">
            <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Official Tariff Schedule</span>
              <span className="text-slate-300">SCR</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-300 border-b border-white/10 pb-0.5">
                <span>Individuals:</span>
                <span className="font-bold text-white">L1: 1,250 | L2: 1,500 | Pack: 2,500</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Corp 1–5 seats:</span>
                <span className="font-bold text-amber-200">L1: 1,100 | L2: 1,300 | Pack: 2,250</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Corp 6–10 seats:</span>
                <span className="font-bold text-amber-200">L1: 1,000 | L2: 1,200 | Pack: 2,050</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Corp 11–20 seats:</span>
                <span className="font-bold text-amber-200">L1: 900 | L2: 1,100 | Pack: 1,850</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Corp 21+ seats:</span>
                <span className="font-bold text-emerald-400">L1: 800 | L2: 1,000 | Pack: 1,650</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE SEARCH & FILTER BAR                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
        {/* Top Row: Search Input + Difficulty Dropdown + Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by module name, statute (AML Act 2020), CDD, PEPs, STR, FIU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#071433]/20 focus:border-[#071433] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Level Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {difficultyLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl === 'All' ? 'All Difficulties' : lvl}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition-colors flex items-center gap-1.5"
                title="Reset all search filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Middle Row: Category Filter Chips */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Filter By Regulatory Category:
            </span>
            <span className="text-xs text-slate-400">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const count = cat === 'All'
                ? courses.length
                : courses.filter((c) => c.category === cat).length;
              const isSelected = categoryFilter === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 min-h-[34px] ${
                    isSelected
                      ? 'bg-[#071433] text-amber-300 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat === 'All' ? 'All Categories' : cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-amber-400/20 text-amber-200'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: Popular Topic Quick Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-slate-400" />
            Quick Module Tags:
          </span>
          {POPULAR_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setSearchQuery(topic)}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium border transition-colors ${
                searchQuery.toLowerCase() === topic.toLowerCase()
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-blue-900 font-medium">
              <span>Active filters:</span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-950 font-bold flex items-center gap-1">
                  Query: &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categoryFilter !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-950 font-bold flex items-center gap-1">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter('All')} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedDifficulty !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-950 font-bold flex items-center gap-1">
                  Level: {selectedDifficulty}
                  <button onClick={() => setSelectedDifficulty('All')} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <div className="text-xs text-blue-800 font-semibold">
              Showing {filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'} · {totalMatchingModulesCount} module{totalMatchingModulesCount === 1 ? '' : 's'}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE: MODULE DIRECTORY VIEW                                           */}
      {/* ========================================================================= */}
      {viewMode === 'modules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>Matching Modules Directory ({matchingModulesList.length})</span>
            </h3>
            <span className="text-xs text-slate-500">
              Each module includes interactive units, references, and a statutory quiz
            </span>
          </div>

          {matchingModulesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingModulesList.map(({ course, module, moduleIndex, totalModulesInCourse }) => {
                const isEnrolled = isCourseUnlocked(course.id);
                const totalMinutes = module.lessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
                const hasQuiz = module.lessons.some((l) => l.type === 'quiz' || (l.quiz && l.quiz.length > 0));

                return (
                  <div
                    key={`${course.id}-${module.id}`}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#071433] text-amber-300">
                          {course.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDifficultyBadge(course.level)}`}>
                          {course.level}
                        </span>
                      </div>

                      {/* Course Reference */}
                      <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 mb-1 truncate">
                        <span>Course:</span>
                        <span className="text-blue-900 font-bold truncate">{course.title}</span>
                      </div>

                      {/* Module Title */}
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                        {module.title}
                      </h4>

                      {/* Module Description */}
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {module.description}
                      </p>

                      {/* Module Lessons List Preview */}
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-slate-400" />
                            {module.lessons.length} Lessons ({totalMinutes} mins)
                          </span>
                          {hasQuiz && (
                            <span className="flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                              <ShieldCheck className="w-3 h-3" />
                              80% Quiz Included
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          {module.lessons.slice(0, 3).map((lesson, lIdx) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between gap-2 px-2 py-1 rounded-md bg-slate-50 text-[11px] text-slate-700"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <PlayCircle className="w-3 h-3 text-blue-600 shrink-0" />
                                <span className="truncate">{lesson.title}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                {lesson.durationMinutes}m
                              </span>
                            </div>
                          ))}
                          {module.lessons.length > 3 && (
                            <div className="text-[10px] text-slate-400 italic pl-2">
                              + {module.lessons.length - 3} more lessons in this module...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action CTA */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Module {moduleIndex} of {totalModulesInCourse}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewCourse(course)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                          title="Preview complete curriculum outline and modules"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Preview Module</span>
                        </button>

                        {isEnrolled ? (
                          <button
                            type="button"
                            onClick={() => openCoursePlayer(course.id, module.lessons[0]?.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Open Module</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedCourseForCheckout(course)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs border border-amber-400/30 cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Register &amp; Pay to Unlock</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No modules match your filter criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We couldn&apos;t find any modules matching &ldquo;{searchQuery}&rdquo; in category &ldquo;{categoryFilter}&rdquo; with difficulty &ldquo;{selectedDifficulty}&rdquo;.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-xl bg-[#071433] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE: COURSE CATALOGUE VIEW (DEFAULT)                                 */}
      {/* ========================================================================= */}
      {viewMode === 'courses' && (
        <div className="space-y-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isEnrolled = isCourseUnlocked(course.id);
                const isModulesExpanded = !!expandedCourseModules[course.id];

                // Count how many modules match current search query
                const matchingModulesCount = searchQuery.trim()
                  ? course.modules.filter((m) => checkModuleMatches(m, searchQuery.trim())).length
                  : course.modules.length;

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
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#071433]/90 text-white backdrop-blur-xs">
                          {course.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-xs ${getDifficultyBadge(course.level)}`}>
                          {course.level}
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

                      {/* Quick Preview Module Badge Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewCourse(course);
                        }}
                        className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-[#071433]/85 hover:bg-[#071433] text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1.5 transition-colors border border-white/20 shadow-xs"
                        title="Preview course curriculum and modules"
                      >
                        <Eye className="w-3 h-3 text-amber-300" />
                        <span>Preview Module</span>
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-amber-500 font-bold mb-1">
                          <div className="flex items-center">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="ml-1 text-slate-800">{course.rating}</span>
                            <span className="ml-1 text-slate-400 font-normal">({course.reviewsCount})</span>
                          </div>
                          {searchQuery.trim() && matchingModulesCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                              {matchingModulesCount} matching {matchingModulesCount === 1 ? 'module' : 'modules'}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#071433] transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          {course.shortDescription}
                        </p>

                        {/* Highlights & Modules Expand Toggle */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {course.totalHours} hrs CPD
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            {course.lessonsCount} lessons
                          </span>
                          <span className="flex items-center gap-1 text-amber-700 font-semibold">
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            Certificate
                          </span>
                        </div>

                        {/* Interactive Modules Preview Button */}
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => toggleCourseModules(course.id)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-blue-700" />
                              <span>
                                {course.modules.length} Course Modules
                                {searchQuery.trim() && ` (${matchingModulesCount} match)`}
                              </span>
                            </span>
                            {isModulesExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          {/* Expandable Module Breakdown */}
                          {isModulesExpanded && (
                            <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 animate-in fade-in duration-150 text-left">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
                                Curriculum Modules:
                              </div>
                              {course.modules.map((m, mIdx) => {
                                const isMatch = checkModuleMatches(m, searchQuery.trim());
                                return (
                                  <div
                                    key={m.id}
                                    className={`p-2 rounded-lg border text-xs ${
                                      isMatch && searchQuery.trim()
                                        ? 'bg-amber-50/80 border-amber-200 text-slate-800'
                                        : 'bg-white border-slate-200/70 text-slate-700'
                                    }`}
                                  >
                                    <div className="font-bold text-[11px] text-slate-900 mb-0.5">
                                      {m.title}
                                    </div>
                                    <div className="text-[10px] text-slate-500 line-clamp-1 mb-1.5">
                                      {m.description}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1">
                                      {m.lessons.map((lesson) => (
                                        <button
                                          key={lesson.id}
                                          type="button"
                                          onClick={() => {
                                            if (isEnrolled) {
                                              openCoursePlayer(course.id, lesson.id);
                                            } else {
                                              setSelectedCourseForCheckout(course);
                                            }
                                          }}
                                          className={`px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 transition-colors ${
                                            isEnrolled
                                              ? 'bg-blue-50 text-blue-800 hover:bg-blue-100 cursor-pointer'
                                              : 'bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-800 cursor-pointer'
                                          }`}
                                          title={
                                            isEnrolled
                                              ? `Jump to ${lesson.title}`
                                              : `Locked · Registration & Payment required to access ${lesson.title}`
                                          }
                                        >
                                          {isEnrolled ? (
                                            <PlayCircle className="w-2.5 h-2.5 text-blue-600" />
                                          ) : (
                                            <Lock className="w-2.5 h-2.5 text-amber-600" />
                                          )}
                                          <span className="truncate max-w-[120px]">{lesson.title}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
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
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-emerald-700 font-bold">
                              Prepaid 12-Month Seat
                            </span>
                            <span className="text-[10px] text-slate-300">·</span>
                            <span className="text-[10px] text-amber-700 font-semibold">
                              Corp from SCR 600
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewCourse(course)}
                            className="px-2.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                            title="Preview course curriculum and syllabus"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span className="hidden sm:inline">Preview</span>
                          </button>

                          {isEnrolled ? (
                            <button
                              type="button"
                              onClick={() => openCoursePlayer(course.id)}
                              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                            >
                              Open Seat
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const isL1 = course.id === 'c-1' || course.id === 'c-2' || course.id === 'c-3';
                                  addToCart({
                                    courseId: course.id,
                                    courseTitle: course.title,
                                    packageType: isL1 ? 'level1' : 'level2',
                                    seatCount: 1,
                                    cpdHours: course.totalHours || 2,
                                    modulesCount: course.modules.length || 3,
                                  });
                                }}
                                className="px-3 py-2.5 rounded-xl border border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50 text-slate-800 hover:text-[#071433] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                                title="Add to consolidated Checkout Cart"
                              >
                                <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
                                <span>Cart</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedCourseForCheckout(course)}
                                className="px-3.5 py-2.5 rounded-xl bg-[#071433] hover:bg-[#0c245c] text-amber-300 text-xs font-bold shadow-md shadow-[#071433]/20 transition-all flex items-center gap-1.5 cursor-pointer border border-amber-400/30"
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Register &amp; Pay to Unlock</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No courses match your search or filters</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try searching with different statutory terms, changing the category, or adjusting the difficulty level filter.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-xl bg-[#071433] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Non-interactive Curriculum Overview Preview Modal */}
      <CourseCurriculumPreviewModal
        course={previewCourse}
        isOpen={!!previewCourse}
        onClose={() => setPreviewCourse(null)}
        isEnrolled={!!previewCourse && isCourseUnlocked(previewCourse.id)}
        onEnrolClick={(c) => setSelectedCourseForCheckout(c)}
        onOpenPlayerClick={(cId) => openCoursePlayer(cId)}
      />
    </div>
  );
};
