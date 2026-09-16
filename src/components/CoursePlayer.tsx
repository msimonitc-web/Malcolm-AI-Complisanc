import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
  HelpCircle,
  Download,
  MessageSquare,
  Award,
  Sparkles,
  Copy,
  Check,
  Send,
  ThumbsUp,
  Bookmark,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAcademy } from '../context/AcademyContext';
import { Lesson, CourseModule } from '../types';

export const CoursePlayer: React.FC = () => {
  const {
    activeCourseId,
    activeLessonId,
    setActiveLessonId,
    courses,
    enrolledProgress,
    toggleLessonCompletion,
    markLessonComplete,
    savePersonalNote,
    recordQuizScore,
    claimCertificate,
    setSelectedCertificateForView,
    setActiveTab,
    getCourseProgressPercentage,
    isCourseCompleted,
  } = useAcademy();

  // Find course
  const course = courses.find((c) => c.id === activeCourseId) || courses[0];
  const progress = enrolledProgress[course.id];

  // Find current lesson and module
  let currentModule: CourseModule = course.modules[0];
  let currentLesson: Lesson = currentModule.lessons[0];

  for (const mod of course.modules) {
    const found = mod.lessons.find((l) => l.id === activeLessonId);
    if (found) {
      currentModule = mod;
      currentLesson = found;
      break;
    }
  }

  // Active workspace tab
  const [activeTabName, setActiveTabName] = useState<'notes' | 'quiz' | 'resources' | 'qa'>('notes');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Video state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Personal notes
  const [personalNoteText, setPersonalNoteText] = useState(
    progress?.personalNotes?.[currentLesson.id] || ''
  );
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Q&A input
  const [questionInput, setQuestionInput] = useState('');
  const [commentsList, setCommentsList] = useState(currentLesson.comments || []);

  // Sync personal notes when lesson changes
  useEffect(() => {
    setPersonalNoteText(progress?.personalNotes?.[currentLesson.id] || '');
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setCommentsList(currentLesson.comments || []);
    setIsPlaying(false);
  }, [currentLesson.id, progress]);

  // Video time format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);

      // Auto mark complete if user watches > 90%
      if (videoRef.current.currentTime / videoRef.current.duration > 0.9) {
        markLessonComplete(course.id, currentLesson.id);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Lesson traversal
  const allLessons: Lesson[] = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleSaveNote = () => {
    savePersonalNote(course.id, currentLesson.id, personalNoteText);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2000);
  };

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleQuizOptionSelect = (qId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!currentLesson.quiz) return;
    setQuizSubmitted(true);

    let correctCount = 0;
    currentLesson.quiz.forEach((q) => {
      if (selectedQuizAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / currentLesson.quiz.length) * 100);
    recordQuizScore(course.id, currentLesson.id, score);

    if (score >= 70) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      author: 'Alex Rivera (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      timestamp: 'Just now',
      content: questionInput.trim(),
      upvotes: 1,
    };

    setCommentsList([newComment, ...commentsList]);
    setQuestionInput('');
  };

  const isCompleted = progress?.completedLessonIds.includes(currentLesson.id);
  const courseCompleted = isCourseCompleted(course.id);
  const progressPct = getCourseProgressPercentage(course.id);

  return (
    <div className="space-y-4 pb-16">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mobile Curriculum Toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-xs"
          >
            <Menu className="w-4 h-4" />
            <span>Curriculum ({progressPct}%)</span>
          </button>

          {courseCompleted && (
            <button
              onClick={() => {
                const cert = claimCertificate(course.id);
                if (cert) setSelectedCertificateForView(cert);
              }}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-xs hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">View Official Certificate</span>
              <span className="sm:hidden">Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Classroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols on Desktop: Video Player & Workspace Tabs */}
        <div className="lg:col-span-8 space-y-4">
          {/* Video Container */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-800 relative group">
            <div className="relative aspect-video flex items-center justify-center bg-slate-950">
              {currentLesson.type === 'video' && currentLesson.videoUrl ? (
                <video
                  ref={videoRef}
                  src={currentLesson.videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  onEnded={() => markLessonComplete(course.id, currentLesson.id)}
                  onClick={handlePlayPause}
                  className="w-full h-full object-contain cursor-pointer"
                  poster={course.thumbnail}
                  playsInline
                />
              ) : (
                <div className="p-8 text-center text-white space-y-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-['Space_Grotesk']">
                    Interactive Assessment & Final Exam
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    This module tests your comprehension of full-stack patterns and architectures. Answer the questions in the Quiz tab below.
                  </p>
                </div>
              )}

              {/* Custom Overlay Controls on Hover / Play */}
              {currentLesson.type === 'video' && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 sm:p-4 text-white opacity-95 transition-opacity">
                  {/* Scrubber */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-3"
                  />

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePlayPause}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <span className="font-mono text-[11px] text-slate-300">
                        {formatTime(currentTime)} / {formatTime(duration || currentLesson.durationMinutes * 60)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Speed selector */}
                      <div className="flex items-center bg-white/10 rounded-md p-0.5">
                        {[1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSpeedChange(s)}
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                              playbackRate === s ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleFullscreen}
                        className="text-white/80 hover:text-white transition-colors"
                        title="Fullscreen"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lesson Header & Action Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {currentModule.title}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">{currentLesson.durationMinutes} mins</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                {currentLesson.title}
              </h2>
            </div>

            {/* Complete Toggle & Next Lesson */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => toggleLessonCompletion(course.id, currentLesson.id)}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-slate-400" />
                    <span>Mark Complete</span>
                  </>
                )}
              </button>

              {nextLesson && (
                <button
                  onClick={() => setActiveLessonId(nextLesson.id)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Tabbed Interactive Workspace */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Tabs Header */}
            <div className="border-b border-slate-200 px-4 flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTabName('notes')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTabName === 'notes'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Notes & Code</span>
              </button>

              <button
                onClick={() => setActiveTabName('quiz')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTabName === 'quiz'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Knowledge Check</span>
                {currentLesson.quiz && (
                  <span className="px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold">
                    {currentLesson.quiz.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTabName('resources')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTabName === 'resources'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Resources</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                  {currentLesson.resources?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTabName('qa')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTabName === 'qa'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discussion Q&A</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                  {commentsList.length}
                </span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 sm:p-6">
              {/* TAB 1: Notes & Personal Notepad */}
              {activeTabName === 'notes' && (
                <div className="space-y-6">
                  {/* Instructor Lecture Notes */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Lesson Summary & Reference Guide
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {currentLesson.summary}
                    </p>

                    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto relative group">
                      <button
                        onClick={() => handleCopySnippet(currentLesson.notes)}
                        className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                      <pre className="whitespace-pre-wrap">{currentLesson.notes}</pre>
                    </div>
                  </div>

                  {/* Student's Personal Notebook */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Bookmark className="w-4 h-4 text-indigo-600" />
                        <span>Your Personal Student Notepad (Saved Automatically)</span>
                      </label>
                      {noteSavedFeedback && (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Saved!
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={personalNoteText}
                      onChange={(e) => setPersonalNoteText(e.target.value)}
                      onBlur={handleSaveNote}
                      placeholder="Write your notes, key insights, questions or code reminders for this lesson..."
                      className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/30 text-slate-800"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleSaveNote}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Interactive Quiz */}
              {activeTabName === 'quiz' && (
                <div className="space-y-6">
                  {currentLesson.quiz && currentLesson.quiz.length > 0 ? (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Module Knowledge Check</h4>
                          <p className="text-xs text-slate-500">
                            Score 70% or higher to automatically pass this checkpoint.
                          </p>
                        </div>
                        {progress?.quizScores?.[currentLesson.id] !== undefined && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                            Score: {progress.quizScores[currentLesson.id]}%
                          </span>
                        )}
                      </div>

                      {currentLesson.quiz.map((q, idx) => {
                        const selected = selectedQuizAnswers[q.id];
                        const isCorrect = selected === q.correctAnswer;

                        return (
                          <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                              {idx + 1}. {q.question}
                            </h5>

                            <div className="space-y-2">
                              {q.options.map((opt, optIdx) => {
                                let optionStyle =
                                  'border-slate-200 bg-white hover:border-slate-300 text-slate-800';

                                if (quizSubmitted) {
                                  if (optIdx === q.correctAnswer) {
                                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                                  } else if (selected === optIdx && !isCorrect) {
                                    optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                                  }
                                } else if (selected === optIdx) {
                                  optionStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => handleQuizOptionSelect(q.id, optIdx)}
                                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {quizSubmitted && optIdx === q.correctAnswer && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                                <strong>Explanation:</strong> {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={quizSubmitted || Object.keys(selectedQuizAnswers).length === 0}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {quizSubmitted ? 'Quiz Evaluated' : 'Submit & Check Answers'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No quiz required for this overview lesson. Proceed to the next lecture!
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Downloadable Resources */}
              {activeTabName === 'resources' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Source Code, Architecture Assets & PDFs
                  </h4>
                  {currentLesson.resources && currentLesson.resources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentLesson.resources.map((res) => (
                        <div
                          key={res.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                              <Download className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-900 truncate">{res.name}</p>
                              <span className="text-[11px] text-slate-500 font-mono">{res.size}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => alert(`Downloading ${res.name}...`)}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-indigo-50 text-indigo-700 text-xs font-bold shadow-2xs shrink-0"
                          >
                            Get
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No external attachments for this chapter.</p>
                  )}
                </div>
              )}

              {/* TAB 4: Q&A Community Discussion */}
              {activeTabName === 'qa' && (
                <div className="space-y-5">
                  <form onSubmit={handleAddQuestion} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask instructor or fellow students a question about this lesson..."
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-600 text-slate-800"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </form>

                  <div className="space-y-3.5 divide-y divide-slate-100">
                    {commentsList.map((comm) => (
                      <div key={comm.id} className="pt-3.5 first:pt-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={comm.avatar}
                              alt={comm.author}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{comm.author}</span>
                                {comm.isInstructor && (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                                    Instructor
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">{comm.timestamp}</span>
                            </div>
                          </div>
                          <button className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-600">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{comm.upvotes}</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 pl-10 leading-relaxed">{comm.content}</p>

                        {comm.replies && comm.replies.length > 0 && (
                          <div className="pl-10 pt-2 space-y-2">
                            {comm.replies.map((rep) => (
                              <div key={rep.id} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={rep.avatar}
                                    alt={rep.author}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <span className="text-xs font-bold text-indigo-950">{rep.author}</span>
                                  {rep.isInstructor && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-600 text-white">
                                      Instructor Response
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-700 pl-8 leading-relaxed">{rep.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols on Desktop: Course Curriculum Drawer/Sidebar */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden sticky top-20">
            {/* Header with Progress */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Curriculum Structure
                </h3>
                <span className="text-xs font-bold text-indigo-600">{progressPct}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Modules List */}
            <div className="p-2 max-h-[70vh] overflow-y-auto space-y-3">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="space-y-1">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100/60 rounded-lg">
                    {mod.title}
                  </div>
                  <div className="space-y-0.5 pl-1">
                    {mod.lessons.map((les) => {
                      const isCurrent = les.id === currentLesson.id;
                      const isLesCompleted = progress?.completedLessonIds.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          onClick={() => setActiveLessonId(les.id)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                            isCurrent
                              ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-200'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isLesCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isCurrent ? (
                              <div className="w-4 h-4 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                              </div>
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate leading-tight">{les.title}</p>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {les.durationMinutes}m · {les.type}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Sheet for Curriculum (Improves Mobile Responsiveness) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Course Curriculum</h3>
                <p className="text-xs text-indigo-600 font-bold">{progressPct}% Completed</p>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {course.modules.map((mod) => (
                <div key={mod.id} className="space-y-1">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 rounded-lg">
                    {mod.title}
                  </div>
                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isCurrent = les.id === currentLesson.id;
                      const isLesCompleted = progress?.completedLessonIds.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          onClick={() => {
                            setActiveLessonId(les.id);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start gap-2.5 min-h-[44px] ${
                            isCurrent
                              ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isLesCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate leading-tight font-medium">{les.title}</p>
                            <span className="text-[10px] text-slate-400">
                              {les.durationMinutes} mins · {les.type}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
