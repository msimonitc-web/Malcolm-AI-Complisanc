import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Play,
  ChevronDown,
  ChevronUp,
  Circle,
  BookOpen,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { CourseModule } from '../types';
import { useAcademy } from '../context/AcademyContext';

interface ModuleProgressIndicatorProps {
  courseId: string;
  modules: CourseModule[];
  completedLessonIds?: string[];
  variant?: 'card-compact' | 'card-expandable' | 'hero-breakdown';
  className?: string;
}

export const ModuleProgressIndicator: React.FC<ModuleProgressIndicatorProps> = ({
  courseId,
  modules = [],
  completedLessonIds = [],
  variant = 'card-expandable',
  className = '',
}) => {
  const { openCoursePlayer } = useAcademy();
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute metrics for each module safely
  const safeModules = Array.isArray(modules) ? modules : [];
  const moduleMetrics = safeModules.map((module, index) => {
    const lessonsList = Array.isArray(module?.lessons) ? module.lessons : [];
    const totalLessons = lessonsList.length;
    const completedLessons = lessonsList.filter((l) =>
      completedLessonIds.includes(l.id)
    ).length;
    const percentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const isComplete = totalLessons > 0 && completedLessons >= totalLessons;
    const isInProgress = completedLessons > 0 && !isComplete;
    const isNotStarted = completedLessons === 0;

    // Find next incomplete lesson, or first lesson
    const nextLesson =
      lessonsList.find((l) => !completedLessonIds.includes(l.id)) ||
      lessonsList[0];

    return {
      module,
      index: index + 1,
      totalLessons,
      completedLessons,
      percentage,
      isComplete,
      isInProgress,
      isNotStarted,
      nextLessonId: nextLesson?.id,
      nextLessonTitle: nextLesson?.title,
    };
  });

  const completedModulesCount = moduleMetrics.filter((m) => m.isComplete).length;
  const totalModulesCount = moduleMetrics.length;

  // Clean module title without repeated "Module X:" prefix if already present
  const cleanTitle = (rawTitle: string, index: number) => {
    return rawTitle.replace(/^Module\s+\d+:\s*/i, '');
  };

  /* -------------------------------------------------------------
     VARIANT 1: HERO BREAKDOWN (Full detailed view on Resume Card)
  ------------------------------------------------------------- */
  if (variant === 'hero-breakdown') {
    return (
      <div className={`space-y-3 pt-4 border-t border-slate-100 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Module Progress Breakdown
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {completedModulesCount} of {totalModulesCount} Modules Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {moduleMetrics.map((item) => (
            <div
              key={item.module.id}
              className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between gap-2 ${
                item.isComplete
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : item.isInProgress
                  ? 'bg-amber-50/60 border-amber-200 shadow-2xs'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {item.isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : item.isInProgress ? (
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-900 truncate">
                      Module {item.index}: {cleanTitle(item.module.title, item.index)}
                    </span>
                  </div>

                  <span
                    className={`font-mono font-bold text-[11px] shrink-0 px-1.5 py-0.5 rounded ${
                      item.isComplete
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.isInProgress
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isComplete
                        ? 'bg-emerald-500'
                        : item.isInProgress
                        ? 'bg-amber-500'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">
                  {item.completedLessons} of {item.totalLessons} lessons passed
                </span>

                <button
                  onClick={() => openCoursePlayer(courseId, item.nextLessonId)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-colors ${
                    item.isComplete
                      ? 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/60'
                      : item.isInProgress
                      ? 'text-amber-800 hover:text-amber-950 hover:bg-amber-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span>{item.isComplete ? 'Review' : item.isInProgress ? 'Resume' : 'Start'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     VARIANT 2: EXPANDABLE CARD PROGRESS (Inside Grid Course Cards)
  ------------------------------------------------------------- */
  return (
    <div className={`space-y-2 pt-2 border-t border-slate-100 ${className}`}>
      {/* Segmented Module Visual Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 text-slate-600 font-semibold">
            <Layers className="w-3 h-3 text-slate-500" />
            <span>Modules Progress</span>
          </div>
          <span className="text-slate-500 font-mono text-[10px]">
            {completedModulesCount}/{totalModulesCount} modules complete
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="flex items-center gap-1 w-full">
          {moduleMetrics.map((m) => (
            <div
              key={m.module.id}
              className="flex-1 group relative cursor-pointer"
              onClick={() => openCoursePlayer(courseId, m.nextLessonId)}
              title={`Module ${m.index}: ${cleanTitle(m.module.title, m.index)} (${m.completedLessons}/${m.totalLessons} lessons, ${m.percentage}%)`}
            >
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                <div
                  className={`h-full transition-all duration-300 ${
                    m.isComplete
                      ? 'bg-emerald-500'
                      : m.isInProgress
                      ? 'bg-amber-500'
                      : 'bg-slate-200'
                  }`}
                  style={{ width: `${m.percentage}%` }}
                />
              </div>

              {/* Mini Module label */}
              <div className="flex items-center justify-between text-[9px] text-slate-500 mt-0.5 px-0.5">
                <span className="font-semibold">M{m.index}</span>
                <span className="font-mono">{m.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle to expand lesson/module details */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[11px] text-slate-700 font-medium transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                completedModulesCount === totalModulesCount
                  ? 'bg-emerald-500'
                  : completedModulesCount > 0
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
            <span>{isExpanded ? 'Hide module breakdown' : 'View all module details'}</span>
          </span>

          <span className="flex items-center gap-0.5 text-slate-500">
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        {/* Expanded Modules List */}
        {isExpanded && (
          <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {moduleMetrics.map((item) => (
              <div
                key={item.module.id}
                onClick={() => openCoursePlayer(courseId, item.nextLessonId)}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:border-slate-400 ${
                  item.isComplete
                    ? 'bg-emerald-50/40 border-emerald-200/70 hover:bg-emerald-50'
                    : item.isInProgress
                    ? 'bg-amber-50/50 border-amber-200/80 hover:bg-amber-50'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-start gap-1.5 min-w-0">
                    {item.isComplete ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : item.isInProgress ? (
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 line-clamp-1">
                        M{item.index}: {cleanTitle(item.module.title, item.index)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.completedLessons} of {item.totalLessons} lessons passed
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 ${
                      item.isComplete
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.isInProgress
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.percentage}%
                  </span>
                </div>

                {/* Progress bar per module */}
                <div className="w-full bg-slate-200/70 rounded-full h-1 mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.isComplete
                        ? 'bg-emerald-500'
                        : item.isInProgress
                        ? 'bg-amber-500'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
