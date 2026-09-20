import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, AlertCircle, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CourseModule, ShortAnswerQuestion } from '../types';

interface UnitAssessmentViewProps {
  module: CourseModule;
  moduleIndex: number;
  currentScore?: number;
  onSaveQuizScore: (score: number) => void;
  onProceedNext: () => void;
}

export const UnitAssessmentView: React.FC<UnitAssessmentViewProps> = ({
  module,
  moduleIndex,
  currentScore,
  onSaveQuizScore,
  onProceedNext,
}) => {
  const quizQuestions = module.unitQuiz || [];
  const shortAnswerQuestions = module.shortAnswerQuestions || [];
  const PASS_MARK = 80;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  const [revealedRubrics, setRevealedRubrics] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(currentScore !== undefined);
  const [calculatedScore, setCalculatedScore] = useState<number>(currentScore ?? 0);

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleShortAnswerChange = (qId: string, val: string) => {
    setShortAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const toggleRubric = (qId: string) => {
    setRevealedRubrics((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizQuestions.length === 0) {
      onSaveQuizScore(100);
      setCalculatedScore(100);
      setIsSubmitted(true);
      return;
    }

    let correct = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / quizQuestions.length) * 100);
    setCalculatedScore(finalScore);
    setIsSubmitted(true);
    onSaveQuizScore(finalScore);

    if (finalScore >= PASS_MARK) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
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
      {/* Assessment Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
          <span>Unit {moduleIndex + 1} Assessment</span>
          <span>·</span>
          <span>80% Required to Advance</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {module.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Complete the multiple-choice knowledge evaluation and practical application questions before proceeding to the next unit.
        </p>
      </div>

      {/* Results Banner if Submitted */}
      {isSubmitted && (
        <div className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
          passed
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            {passed ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {passed ? 'Unit Assessment Passed!' : 'Assessment Not Passed'}
              </h3>
              <p className="text-xs opacity-90">
                Your Score: <strong>{calculatedScore}%</strong> (Passing threshold: {PASS_MARK}%).
                {passed ? ' You may proceed to the next unit.' : ' Please review the material and retake the quiz.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!passed ? (
              <button
                type="button"
                onClick={handleRetake}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onProceedNext}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Multiple Choice Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Part 1: Multiple Choice Questions ({quizQuestions.length})</span>
          </h3>

          {quizQuestions.map((q, qIndex) => {
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
                  <div className="mt-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 border-l-2 border-indigo-500">
                    <strong className="text-indigo-600 dark:text-indigo-400">Explanation: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Short Answer Questions */}
        {shortAnswerQuestions.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Part 2: Practical Scenario Analysis ({shortAnswerQuestions.length})</span>
            </h3>

            {shortAnswerQuestions.map((sq, sqIndex) => (
              <div
                key={sq.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3"
              >
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {sqIndex + 1}. {sq.question}
                </p>

                <textarea
                  rows={3}
                  value={shortAnswers[sq.id] || ''}
                  onChange={(e) => handleShortAnswerChange(sq.id, e.target.value)}
                  placeholder="Type your regulatory analysis, citations, and compliance recommendations..."
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-hidden"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleRubric(sq.id)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {revealedRubrics[sq.id] ? 'Hide Sample Regulatory Response' : 'Show Sample Regulatory Response & Rubric'}
                  </button>
                </div>

                {revealedRubrics[sq.id] && (
                  <div className="p-3.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs space-y-2">
                    <div>
                      <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">Model Answer:</strong>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{sq.sampleAnswer}</p>
                    </div>
                    {sq.gradingRubric && (
                      <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
                        <strong className="text-amber-800 dark:text-amber-400 block mb-0.5">Grading Criteria:</strong>
                        <p className="text-slate-600 dark:text-slate-400 italic">{sq.gradingRubric}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Submit Action */}
        {!isSubmitted && (
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                Object.keys(selectedAnswers).length === quizQuestions.length
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit Unit {moduleIndex + 1} Assessment
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
