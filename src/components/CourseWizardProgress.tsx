import React from 'react';
import { CheckCircle2, Lock, ArrowRight, Award, BookOpen, FileCheck, HelpCircle, Check, Sparkles } from 'lucide-react';
import { Course, CourseModule } from '../types';

export type WizardStage = 
  | { type: 'module'; moduleIndex: number; subStep: 'lessons' | 'quiz' | 'case' }
  | { type: 'finalExam' }
  | { type: 'certificate' };

interface CourseWizardProgressProps {
  course: Course;
  activeModuleIndex: number;
  activeSubStep: 'lessons' | 'quiz' | 'case' | 'finalExam' | 'certificate';
  completedLessonIds: string[];
  unitQuizScores: Record<string, number>;
  examScore?: number;
  onSelectStage: (stage: WizardStage) => void;
  canAccessStage: (stage: WizardStage) => boolean;
}

export const CourseWizardProgress: React.FC<CourseWizardProgressProps> = ({
  course,
  activeModuleIndex,
  activeSubStep,
  completedLessonIds,
  unitQuizScores,
  examScore,
  onSelectStage,
  canAccessStage,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        
        {/* Module Steps */}
        {(course?.modules || []).map((mod, idx) => {
          const modLessons = mod?.lessons || [];
          const modLessonsTotal = modLessons.length;
          const modLessonsCompleted = modLessons.filter((l) => completedLessonIds.includes(l.id)).length;
          const allLessonsDone = modLessonsTotal > 0 && modLessonsCompleted === modLessonsTotal;
          const quizPassed = (unitQuizScores[mod.id] ?? 0) >= 80;
          const isCurrentModule = activeSubStep !== 'finalExam' && activeSubStep !== 'certificate' && activeModuleIndex === idx;

          const moduleAccessible = canAccessStage({ type: 'module', moduleIndex: idx, subStep: 'lessons' });

          return (
            <div key={mod.id} className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => moduleAccessible && onSelectStage({ type: 'module', moduleIndex: idx, subStep: allLessonsDone && !quizPassed ? 'quiz' : 'lessons' })}
                disabled={!moduleAccessible}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-left ${
                  isCurrentModule
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-500/20'
                    : quizPassed
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                    : moduleAccessible
                    ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    : 'border-slate-200/50 dark:border-slate-800/50 opacity-50 cursor-not-allowed text-slate-400 dark:text-slate-600'
                }`}
              >
                <div className="shrink-0">
                  {quizPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : moduleAccessible ? (
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrentModule ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {idx + 1}
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="truncate max-w-[130px] sm:max-w-[160px] leading-tight font-medium">
                    Unit {idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    {quizPassed ? 'Quiz Passed (80%+)' : `${modLessonsCompleted}/${modLessonsTotal} Lessons`}
                  </span>
                </div>
              </button>

              <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
            </div>
          );
        })}

        {/* Final Exam Step */}
        <div className="flex items-center gap-2 shrink-0">
          {(() => {
            const isFinalExamActive = activeSubStep === 'finalExam';
            const finalExamAccessible = canAccessStage({ type: 'finalExam' });
            const examPassed = (examScore ?? 0) >= 80;

            return (
              <button
                type="button"
                onClick={() => finalExamAccessible && onSelectStage({ type: 'finalExam' })}
                disabled={!finalExamAccessible}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-left ${
                  isFinalExamActive
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-500/20'
                    : examPassed
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                    : finalExamAccessible
                    ? 'border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300'
                    : 'border-slate-200/50 dark:border-slate-800/50 opacity-50 cursor-not-allowed text-slate-400 dark:text-slate-600'
                }`}
              >
                <div className="shrink-0">
                  {examPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : finalExamAccessible ? (
                    <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="leading-tight font-medium">Final Exam</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    {examPassed ? `${examScore}% Passed` : '10 Questions · 80%'}
                  </span>
                </div>
              </button>
            );
          })()}

          <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        </div>

        {/* Certificate Step */}
        <div className="shrink-0">
          {(() => {
            const isCertActive = activeSubStep === 'certificate';
            const certAccessible = canAccessStage({ type: 'certificate' });

            return (
              <button
                type="button"
                onClick={() => certAccessible && onSelectStage({ type: 'certificate' })}
                disabled={!certAccessible}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-left ${
                  isCertActive
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-500/20'
                    : certAccessible
                    ? 'border-amber-400 dark:border-amber-600 bg-amber-100/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-2xs font-semibold'
                    : 'border-slate-200/50 dark:border-slate-800/50 opacity-50 cursor-not-allowed text-slate-400 dark:text-slate-600'
                }`}
              >
                <div className="shrink-0">
                  {certAccessible ? (
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="leading-tight font-medium">Certificate</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    {certAccessible ? 'Ready to Claim!' : 'Locked'}
                  </span>
                </div>
              </button>
            );
          })()}
        </div>

      </div>
    </div>
  );
};
