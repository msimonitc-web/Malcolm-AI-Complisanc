import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertCircle, RotateCcw, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FinalExamQuestion, Course } from '../types';

interface FinalExamWizardViewProps {
  course: Course;
  currentScore?: number;
  onSaveExamScore: (score: number) => void;
  onProceedToCertificate: () => void;
}

export const FinalExamWizardView: React.FC<FinalExamWizardViewProps> = ({
  course,
  currentScore,
  onSaveExamScore,
  onProceedToCertificate,
}) => {
  const examQuestions = course.finalExam || [];
  const PASS_MARK = 80;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(currentScore !== undefined);
  const [calculatedScore, setCalculatedScore] = useState<number>(currentScore ?? 0);

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (examQuestions.length === 0) {
      onSaveExamScore(100);
      setCalculatedScore(100);
      setIsSubmitted(true);
      return;
    }

    let correct = 0;
    examQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / examQuestions.length) * 100);
    setCalculatedScore(finalScore);
    setIsSubmitted(true);
    onSaveExamScore(finalScore);

    if (finalScore >= PASS_MARK) {
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 },
        });
      } catch (err) {}
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const passed = calculatedScore >= PASS_MARK;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Exam Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Certification Final Exam</span>
          <span>·</span>
          <span>80% Required for Certification</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {course.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          This comprehensive examination tests your mastery across all statutory modules. Achieve 80% or higher to unlock and claim your official CompliSey Certificate.
        </p>
      </div>

      {/* Case Study Callout if available */}
      {course.caseStudy && (
        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
            <span>Case Study Context: {course.caseStudy.title}</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {course.caseStudy.scenario}
          </p>
        </div>
      )}

      {/* Results Banner if Submitted */}
      {isSubmitted && (
        <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          passed
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            {passed ? (
              <Award className="w-10 h-10 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-10 h-10 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {passed ? 'Congratulations! Examination Passed!' : 'Exam Passing Standard Not Met'}
              </h3>
              <p className="text-xs opacity-90 mt-0.5">
                Your Score: <strong>{calculatedScore}%</strong> (Threshold: {PASS_MARK}%).
                {passed
                  ? ' You have fulfilled all regulatory compliance criteria for certification.'
                  : ' Review unit summaries and retake the final exam.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!passed ? (
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Exam</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onProceedToCertificate}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Award className="w-4 h-4" />
                <span>Proceed to Certificate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {examQuestions.map((q, qIndex) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = selectedOpt === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3"
              >
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {qIndex + 1}. {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isOptionSelected = selectedOpt === optIndex;
                    const isOptionCorrect = optIndex === q.correctAnswer;

                    let optionStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300';
                    if (isSubmitted) {
                      if (isOptionCorrect) {
                        optionStyle = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        optionStyle = 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                      }
                    } else if (isOptionSelected) {
                      optionStyle = 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-medium';
                    }

                    return (
                      <button
                        type="button"
                        key={optIndex}
                        onClick={() => handleSelectAnswer(q.id, optIndex)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-start gap-2.5 ${optionStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border ${
                          isSubmitted && isOptionCorrect
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : isOptionSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-300 dark:border-slate-700 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && q.explanation && (
                  <div className="mt-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 border-l-2 border-amber-500">
                    <strong className="text-amber-600 dark:text-amber-400">Regulatory Rationale: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Action */}
        {!isSubmitted && (
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={Object.keys(selectedAnswers).length < examQuestions.length}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                Object.keys(selectedAnswers).length === examQuestions.length
                  ? 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit Final Regulatory Exam
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
