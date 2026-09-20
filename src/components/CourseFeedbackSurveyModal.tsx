import React, { useState } from 'react';
import { Star, MessageSquare, BookOpen, Send, X, ThumbsUp, AlertCircle, Loader2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: 'anonymous_learner',
      email: 'learner@demo.com',
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface CourseFeedbackSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
}

export const CourseFeedbackSurveyModal: React.FC<CourseFeedbackSurveyModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  studentId,
  studentName,
  studentEmail,
}) => {
  const [clarityRating, setClarityRating] = useState<number>(0);
  const [clarityHover, setClarityHover] = useState<number>(0);

  const [relevanceRating, setRelevanceRating] = useState<number>(0);
  const [relevanceHover, setRelevanceHover] = useState<number>(0);

  const [paceRating, setPaceRating] = useState<string>('just_right');
  const [qualitativeFeedback, setQualitativeFeedback] = useState<string>('');
  const [futureSuggestions, setFutureSuggestions] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clarityRating === 0 || relevanceRating === 0) {
      setErrorMessage('Please select star ratings for both Course Clarity and Material Relevance.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const feedbackId = `FB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const payload = {
      id: feedbackId,
      courseId,
      courseTitle,
      studentId,
      studentName,
      studentEmail,
      clarityRating,
      relevanceRating,
      paceRating,
      qualitativeFeedback,
      futureSuggestions,
      submittedAt: new Date().toISOString(),
    };

    const path = `course_feedback/${feedbackId}`;
    try {
      await setDoc(doc(db, 'course_feedback', feedbackId), payload);
      setIsSubmitted(true);
      // Persist feedback submission state locally so we do not prompt again for this course
      localStorage.setItem(`feedback_submitted_${courseId}`, 'true');
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, path);
      } catch (formattedError: any) {
        setErrorMessage('Failed to securely transmit feedback. Please verify connection and retry.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#071430] w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden transform transition-all duration-300">
        {/* Banner/Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
            id="close-feedback-btn"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">Continuous Improvement</span>
              <h3 className="text-lg font-black leading-tight">Post-Course Feedback Survey</h3>
            </div>
          </div>
          <p className="text-xs text-indigo-100/90 mt-2 leading-relaxed">
            Your qualitative insights are highly valued! They help us optimize course clarity, materials relevance, and regulatory compliance auditing.
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <ThumbsUp className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Feedback Submitted Successfully!</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Thank you for contributing to the Seychelles CompliSey Training Academy standards.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" id="feedback-survey-form">
              {/* Course Title Reference */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[#111c35] border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Feedback for: <strong className="font-extrabold">{courseTitle}</strong></span>
              </div>

              {/* Clarity Rating */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                  1. Course Clarity & Explanation <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  How clearly were the statutory requirements and compliance examples explained?
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setClarityRating(star)}
                      onMouseEnter={() => setClarityHover(star)}
                      onMouseLeave={() => setClarityHover(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (clarityHover || clarityRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  {clarityRating > 0 && (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                      {clarityRating === 1 && 'Needs Improvement'}
                      {clarityRating === 2 && 'Fair'}
                      {clarityRating === 3 && 'Good'}
                      {clarityRating === 4 && 'Very Clear'}
                      {clarityRating === 5 && 'Outstandingly Clear'}
                    </span>
                  )}
                </div>
              </div>

              {/* Material Relevance */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                  2. Practical Relevance to Seychelles AML/CFT <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  How helpful are the sanctions, PEP controls, and auditing files to your daily duties?
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRelevanceRating(star)}
                      onMouseEnter={() => setRelevanceHover(star)}
                      onMouseLeave={() => setRelevanceHover(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (relevanceHover || relevanceRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  {relevanceRating > 0 && (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                      {relevanceRating === 1 && 'Irrelevant'}
                      {relevanceRating === 2 && 'Slightly Relevant'}
                      {relevanceRating === 3 && 'Moderately Helpful'}
                      {relevanceRating === 4 && 'Highly Relevant'}
                      {relevanceRating === 5 && 'Directly Applicable'}
                    </span>
                  )}
                </div>
              </div>

              {/* Pace */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                  3. Training Content Pace <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {[
                    { value: 'slow', label: 'Too Slow' },
                    { value: 'just_right', label: 'Perfect Pace' },
                    { value: 'fast', label: 'Too Fast' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPaceRating(option.value)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        paceRating === option.value
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-300'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qualitative freeform feedback */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                  4. Qualitative Insights (Valuable aspects / improvements)
                </label>
                <textarea
                  value={qualitativeFeedback}
                  onChange={(e) => setQualitativeFeedback(e.target.value)}
                  placeholder="What was the most useful section? Any suggestions to make the case scenarios clearer?"
                  rows={2}
                  maxLength={500}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-[#09152e] placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 text-right block">{qualitativeFeedback.length}/500 chars</span>
              </div>

              {/* Future suggestions */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                  5. Suggestions for Future Compliance Modules
                </label>
                <input
                  type="text"
                  value={futureSuggestions}
                  onChange={(e) => setFutureSuggestions(e.target.value)}
                  placeholder="e.g. Crypto Asset compliance, TF/PF Risk indicators, CTR filings..."
                  maxLength={120}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-[#09152e] placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Errors */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Skip Feedback
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Insights</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
