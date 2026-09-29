import React, { useState, useEffect } from 'react';
import { Topic, Question, UserProgress, FeedbackWindowStatus } from '../types';
import { ISTStatus } from '../utils/istTime';
import { checkDayCompletion, checkFinalExamEligibility, isDayUnlockedStrict } from '../utils/prerequisites';
import { formatFeedbackTimer } from '../utils/feedback';
import {
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Code2,
  ShieldCheck,
  Check,
  BookOpen,
  FileCheck2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sliders,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { HACKERRANK_COURSE_URL } from '../data/curriculum';
import { SOLVED_PROGRAMS } from '../data/solvedPrograms';
import { SolvedProgramsSection } from './SolvedProgramsSection';

interface DayViewProps {
  day: number;
  topics: Topic[]; // usually 2 topics (Part 1 and Part 2)
  progress: UserProgress;
  istStatus: ISTStatus;
  demoBypass: boolean;
  onSelectDay?: (day: number) => void;
  onToggleQuestion: (questionId: string) => void;
  onOpenPreAssessment: () => void;
  onOpenPostAssessment: () => void;
  onOpenFinalExam: (day?: number) => void;
  onOpenCertificate: () => void;
  onOpenIDE: (question: Question) => void;
  onToggleAcknowledgeProgram: (programId: string) => void;
  onOpenLevelZero?: () => void;
  onOpenVisualizer?: () => void;
  onOpenFeedback?: () => void;
  feedbackStatus?: FeedbackWindowStatus;
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
  userId?: string;
}

export const DayView: React.FC<DayViewProps> = ({
  day,
  topics,
  progress,
  istStatus,
  demoBypass,
  onSelectDay,
  onToggleQuestion,
  onOpenPreAssessment,
  onOpenPostAssessment,
  onOpenFinalExam,
  onOpenCertificate,
  onOpenIDE,
  onToggleAcknowledgeProgram,
  onOpenLevelZero,
  onOpenVisualizer,
  onOpenFeedback,
  feedbackStatus,
  onOpenAdmin,
  isAdmin = false,
  userId,
}) => {
  const [, setLockVersion] = useState(0);

  useEffect(() => {
    const handler = () => setLockVersion((v) => v + 1);
    window.addEventListener('kapil_day_locks_updated', handler);
    return () => window.removeEventListener('kapil_day_locks_updated', handler);
  }, []);

  const [activePart, setActivePart] = useState<1 | 2>(1);
  const [activeMainView, setActiveMainView] = useState<'syllabus' | 'solved' | 'all'>('syllabus');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const selectedTopic = topics.find((t) => t.part === activePart) || topics[0];

  const lockResult = isDayUnlockedStrict(day, progress, istStatus, demoBypass, userId);
  const dayStatus = checkDayCompletion(day, progress);
  const examEligibility = checkFinalExamEligibility(progress, demoBypass);

  const prePassed = !!progress.dayPreAssessmentPassed[day];
  const preScore = progress.dayPreAssessmentScores[day] || 0;
  const postPassed = !!progress.dayPostAssessmentPassed[day];
  const postScore = progress.dayPostAssessmentScores[day] || 0;
  const badgeUnlocked = !!progress.badgesUnlocked[day];
  const dayFinalScore = progress.dayFinalExamScores?.[day];
  const dayFinalPassed = !!progress.dayFinalExamPassed?.[day];

  const totalQuestionsInDay = topics.reduce((acc, t) => acc + t.questions.length, 0);
  const completedQuestionsInDay = topics.reduce((acc, t) => {
    return acc + t.questions.filter((q) => progress.completedQuestionIds.includes(q.id)).length;
  }, 0);

  const toggleExpand = (id: string) => {
    setExpandedQuestionId((prev) => (prev === id ? null : id));
  };

  // STRICT INACCESSIBLE DAY SCREEN: When a day is locked or relocked, learners cannot view its questions or assessments
  if (!lockResult.unlocked) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8 px-4 animate-fadeIn">
        <div className="rounded-3xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 via-white to-amber-50/40 p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />

          {/* Big Lock Icon with Halo */}
          <div className="mx-auto w-20 h-20 rounded-3xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-rose-600 shadow-inner">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider border border-rose-200">
              Access Restricted • Strict Day Lock
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {lockResult.adminOverridden ? `Day ${day} Relocked by Admin Kapil` : `Day ${day} Content is Strictly Inaccessible`}
            </h1>
            <p className="text-xs md:text-sm text-rose-700 font-medium bg-rose-50/90 p-4 rounded-2xl border border-rose-200 leading-relaxed">
              {lockResult.reason || `You must complete all prerequisite assessments and coding problems from previous days to unlock Day ${day}.`}
            </p>
          </div>

          {/* Prerequisite Steps Required */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 text-left space-y-4 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Learner Completion Checklist for Day {day - 1}:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-2.5">
                <span className="font-mono font-black text-indigo-600 shrink-0 text-sm">1.</span>
                <div>
                  <div className="font-bold text-slate-800">Pre-Assessment</div>
                  <div className="text-[11px] text-slate-500">10 MCQs on Day {day - 1} fundamentals</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-2.5">
                <span className="font-mono font-black text-emerald-600 shrink-0 text-sm">2.</span>
                <div>
                  <div className="font-bold text-slate-800">5 Solved Practice Questions</div>
                  <div className="text-[11px] text-slate-500">Acknowledge all 5 exemplar codes</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-2.5">
                <span className="font-mono font-black text-amber-600 shrink-0 text-sm">3.</span>
                <div>
                  <div className="font-bold text-slate-800">Guided Syllabus Problems</div>
                  <div className="text-[11px] text-slate-500">Solve in-class & post-class tasks</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-2.5">
                <span className="font-mono font-black text-purple-600 shrink-0 text-sm">4.</span>
                <div>
                  <div className="font-bold text-slate-800">Post-Assessment (&ge; 70%)</div>
                  <div className="text-[11px] text-slate-500">10 MCQs to win Day {day - 1} Badge</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {day > 1 && onSelectDay && (
              <button
                type="button"
                onClick={() => onSelectDay(day - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go to Day {day - 1} to Complete Prerequisites</span>
              </button>
            )}

            {isAdmin && onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Day {day} via Admin Panel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Admin Override Alert Banner */}
      {lockResult.adminOverridden && lockResult.unlocked && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-between gap-3 text-amber-200 text-xs shadow-md animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Unlock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-extrabold text-amber-300">Admin Override Active:</span> Day {day} has been unlocked for you by Admin Kapil. Full access is granted to all curriculum questions, masterclasses, and assessments!
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 whitespace-nowrap">
            Admin Unlocked ✓
          </span>
        </div>
      )}

      {/* Day Header Banner - Clean White Card with Rainbow Title */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden">
        {/* Subtle top rainbow line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-sky-500 via-indigo-500 to-purple-600" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold tracking-wide shadow-xs">
                Day {day} of 5
              </span>
              <span className="text-xs text-slate-500 font-bold">
                6 Hours Guided Training • 2 Parts
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight rainbow-text mt-1">
              {topics.map((t) => t.name).filter((v, i, a) => a.indexOf(v) === i).join(' & ')}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Placement Readiness Bootcamp • Powered by Kapil • HackerRank Collection Portal
            </p>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="flex items-center gap-3 self-start sm:self-center flex-wrap">
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Day Progress</div>
              <div className="text-sm font-mono font-extrabold text-slate-800">
                {completedQuestionsInDay} / {totalQuestionsInDay} Solved
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-right">
              <div className="text-[10px] uppercase font-bold text-emerald-700">Solved Exemplars</div>
              <div className="text-sm font-mono font-extrabold text-emerald-900">
                {SOLVED_PROGRAMS.filter((p) => p.day === day && (progress.acknowledgedSolvedProgramIds || []).includes(p.id)).length} / 5 Done
              </div>
            </div>

            {badgeUnlocked && (
              <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/70 flex items-center gap-2 shadow-xs">
                <Award className="w-5 h-5 text-amber-500" />
                <div className="text-left text-xs">
                  <div className="font-bold text-amber-900">Badge Won</div>
                  <div className="text-[10px] text-amber-700 font-semibold">Day {day} Master</div>
                </div>
              </div>
            )}

            {/* Kapil's Admin Portal Card */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 shadow-xs cursor-pointer transition-all ${
                  isAdmin
                    ? 'border-amber-500 bg-amber-500 text-slate-950 font-black shadow-amber-500/20'
                    : 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-950 ring-1 ring-amber-300'
                }`}
                title="Kapil Administrator Portal"
              >
                <div className="p-1 rounded-xl bg-amber-500/20 text-amber-800">
                  <Lock className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-left text-xs">
                  <div className="font-extrabold text-amber-950 leading-tight">Admin Portal</div>
                  <div className="text-[10px] text-amber-800 font-semibold">{isAdmin ? 'Super Admin' : 'Kapil Access'}</div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Step 1 & Step 4 Action Cards Grid (Pre & Post Assessments) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Pre-Assessment Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                  Step 1
                </span>
                <span className="text-xs font-extrabold text-slate-900 rainbow-text">Diagnostic Pre-Assessment</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {prePassed
                  ? `Completed with score: ${preScore}%`
                  : `10 MCQs based on Day ${day} fundamentals prior to coding`}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenPreAssessment}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                prePassed
                  ? 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-xs'
              }`}
            >
              {prePassed ? 'Review' : 'Start Pre-Test'}
            </button>
          </div>

          {/* Post-Assessment Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                  Step 4
                </span>
                <span className="text-xs font-extrabold text-slate-900 rainbow-text">Mastery Post-Assessment</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {postPassed
                  ? `Badge Qualified: ${postScore}% score`
                  : `10 MCQs based on Day ${day} concepts (Score >= 70% to qualify for badge)`}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenPostAssessment}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                postPassed
                  ? 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 shadow-xs'
              }`}
            >
              {postPassed ? 'Review' : 'Take Post-Test'}
            </button>
          </div>
        </div>

        {/* Day Final Proctored Assessment (25 MCQs: Aptitude + DSA • 30 Mins • No Camera) */}
        <div className="p-4 md:p-5 rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                Day {day} Final Assessment
              </span>
              <span className="text-xs font-black text-slate-900 rainbow-text">
                25 Proctored MCQs (10 Aptitude + 15 DSA)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                ⏱️ 30 Mins • 🚫 No Camera Required
              </span>
            </div>
            <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed max-w-2xl">
              Strict 30-minute browser integrity proctored exam testing Day {day} concepts ({topics.map((t) => t.name).join(' & ')}). 10 Quantitative/Logical Aptitude + 15 Data Structures & Algorithms. Minimum 70% required to clear.
            </p>
            {dayFinalScore !== undefined && (
              <div className="text-xs font-bold pt-0.5">
                {dayFinalPassed ? (
                  <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Passed with {dayFinalScore}% ✓
                  </span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Score: {dayFinalScore}% (Score &gt;= 70% to pass)
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => onOpenFinalExam(day)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                dayFinalPassed
                  ? 'border border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:opacity-90 active:scale-[0.98]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{dayFinalPassed ? 'Retake / Review 25 MCQs' : 'Start 25-MCQ Assessment (30m)'}</span>
            </button>
          </div>
        </div>

        {/* Daily Workshop Feedback Card (2:30 PM - 3:30 PM IST) */}
        {onOpenFeedback && (
          <div
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              progress.feedbackSubmitted?.[day]
                ? 'border-emerald-300 bg-emerald-50/60'
                : feedbackStatus?.isActive
                ? 'border-rose-300 bg-rose-50/80 shadow-xs'
                : 'border-slate-200 bg-slate-50/60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                  Daily Requirement
                </span>
                <span className="text-xs font-black text-slate-900 rainbow-text">
                  Day {day} Workshop Feedback (fpln.site)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  2:30 PM – 3:30 PM IST
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {progress.feedbackSubmitted?.[day]
                  ? `✓ Day ${day} feedback submitted and recorded in your placement portfolio.`
                  : feedbackStatus?.isActive
                  ? `🔔 Form is LIVE NOW! Window closes strictly at 3:30 PM IST (${formatFeedbackTimer(
                      feedbackStatus.timeRemainingSec
                    )} remaining).`
                  : `Feedback window opens daily from 2:30 PM to 3:30 PM IST. Same link for all 5 days with daily evaluation.`}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={onOpenFeedback}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  progress.feedbackSubmitted?.[day]
                    ? 'border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50'
                    : feedbackStatus?.isActive
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:opacity-90 animate-pulse'
                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{progress.feedbackSubmitted?.[day] ? 'View / Update Feedback' : 'Open Day Feedback'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Primary View Switcher: Guided Syllabus vs. 6 Solved Programs Masterclass */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100/90 border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMainView('syllabus')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeMainView === 'syllabus'
                ? 'bg-white text-indigo-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Guided Syllabus & Practice</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
              {completedQuestionsInDay}/{totalQuestionsInDay}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainView('solved')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeMainView === 'solved'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-amber-300" />
            <span>5 Coding Solved Practice Questions (2 Easy • 2 Med • 1 Hard)</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
              activeMainView === 'solved' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {SOLVED_PROGRAMS.filter((p) => p.day === day && (progress.acknowledgedSolvedProgramIds || []).includes(p.id)).length}/5 Done
            </span>
          </button>

          {onOpenLevelZero && (
            <button
              type="button"
              onClick={onOpenLevelZero}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 shadow-2xs"
              title="LEVEL 0: 10 Solved Basic Programs in Java, C, C++, Python, HTML/JS"
            >
              <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>LEVEL 0 (10 Solved)</span>
              <span className="px-1.5 py-0.2 rounded-md bg-sky-200/90 text-sky-900 text-[10px] font-mono font-bold">
                {progress.levelZeroCompletedIds?.length || 0}/10
              </span>
            </button>
          )}

          {onOpenVisualizer && (
            <button
              type="button"
              onClick={onOpenVisualizer}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs"
              title="Interactive Algorithm Visualizer Lab (Searching, Sorting, Graphs, Trees)"
            >
              <Sliders className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>Algorithm Visualizer</span>
              <span className="px-1.5 py-0.2 rounded-md bg-purple-200/90 text-purple-900 text-[10px] font-mono font-bold">
                {progress.visualizationCompletedIds?.length || 0}/11
              </span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setActiveMainView(activeMainView === 'all' ? 'syllabus' : 'all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border self-start sm:self-center cursor-pointer ${
            activeMainView === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          {activeMainView === 'all' ? '✓ Showing All Sections' : 'Show All Sections'}
        </button>
      </div>

      {/* Part 1 vs Part 2 Syllabus Section */}
      {(activeMainView === 'syllabus' || activeMainView === 'all') && (
        <div className="space-y-6">
          <div className="flex border-b border-slate-200 gap-2">
            {topics.map((t) => (
          <button
            key={t.code}
            type="button"
            onClick={() => setActivePart(t.part)}
            className={`flex items-center gap-2.5 py-3 px-5 border-b-2 font-bold text-xs md:text-sm transition-all cursor-pointer ${
              activePart === t.part
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-black">
              Part {t.part}
            </span>
            <span className={activePart === t.part ? 'rainbow-text font-black' : ''}>
              {t.code}: {t.name}
            </span>
            <span className="text-xs text-slate-400 font-normal">
              ({t.questions.length} problems)
            </span>
          </button>
        ))}
      </div>

      {/* Selected Topic Details Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold rainbow-text">
              {selectedTopic.code}: {selectedTopic.name}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {selectedTopic.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              Duration: {selectedTopic.durationHours}h
            </span>
            <a
              href={HACKERRANK_COURSE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 hover:border-indigo-400 transition-colors font-bold"
            >
              <span>HackerRank Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Key Concepts Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedTopic.keyConcepts.map((concept, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold px-3 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>

      {/* In-Class Questions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <h3 className="font-black text-sm uppercase tracking-wider rainbow-text">
              In-Class Guided Questions ({selectedTopic.questions.filter((q) => q.type === 'inclass').length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Interactive Walkthrough & Constraints</span>
        </div>

        <div className="space-y-3">
          {selectedTopic.questions
            .filter((q) => q.type === 'inclass')
            .map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                isExpanded={expandedQuestionId === q.id}
                isCompleted={progress.completedQuestionIds.includes(q.id)}
                onToggleExpand={() => toggleExpand(q.id)}
                onToggleSolved={() => onToggleQuestion(q.id)}
                onOpenIDE={() => onOpenIDE(q)}
              />
            ))}
        </div>
      </div>

      {/* Post-Class Practice Section */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <h3 className="font-black text-sm uppercase tracking-wider rainbow-text">
              Post-Class Independent Practice ({selectedTopic.questions.filter((q) => q.type === 'postclass').length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Algorithmic Mastery & Reinforcement</span>
        </div>

        <div className="space-y-3">
          {selectedTopic.questions
            .filter((q) => q.type === 'postclass')
            .map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                isExpanded={expandedQuestionId === q.id}
                isCompleted={progress.completedQuestionIds.includes(q.id)}
                onToggleExpand={() => toggleExpand(q.id)}
                onToggleSolved={() => onToggleQuestion(q.id)}
                onOpenIDE={() => onOpenIDE(q)}
              />
            ))}
        </div>
      </div>
      </div>
      )}

      {/* 5 Coding Solved Practice Questions (2 Easy • 2 Medium • 1 Hard) */}
      {(activeMainView === 'solved' || activeMainView === 'all') && (
        <SolvedProgramsSection
          day={day}
          programs={SOLVED_PROGRAMS}
          acknowledgedIds={progress.acknowledgedSolvedProgramIds || []}
          onToggleAcknowledge={onToggleAcknowledgeProgram}
          onOpenIDE={onOpenIDE}
        />
      )}

      {/* Day 5 Special: Proctored Exam & Certificate Gateway Banner */}
      {day === 5 && (
        <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 p-6 md:p-8 space-y-4 shadow-md mt-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-sky-500 to-purple-600" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-[10px] tracking-wider uppercase">
                  Capstone Milestone
                </span>
                <span className="text-xs text-slate-600 font-bold">
                  Proctored Certification Assessment
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight rainbow-text">
                Grand Placement Readiness Certification
              </h2>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                Complete the Day 5 Final Assessment (25 MCQs: Topics T9 &amp; T10 + Aptitude) with browser-integrity proctoring (30-min timer, tab-switch sentry, no camera required) to earn the official Kapil Placement Certificate.
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              {progress.finalExamPassed ? (
                <button
                  type="button"
                  onClick={onOpenCertificate}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>View Verified Certificate</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenFinalExam(5)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md animate-pulse"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Launch Day 5 Assessment (25 MCQs • 30m)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface QuestionCardProps {
  question: Question;
  isExpanded: boolean;
  isCompleted: boolean;
  onToggleExpand: () => void;
  onToggleSolved: () => void;
  onOpenIDE: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isExpanded,
  isCompleted,
  onToggleExpand,
  onToggleSolved,
  onOpenIDE,
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/70'
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Top Header of Card */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Solved Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSolved();
            }}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
              isCompleted
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-300 bg-white hover:border-slate-400 text-transparent'
            }`}
            title={isCompleted ? 'Mark as unsolved' : 'Mark as solved'}
          >
            <Check className="w-4 h-4" />
          </button>

          <div
            onClick={onToggleExpand}
            className="cursor-pointer min-w-0 flex-1"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-indigo-600">
                {question.topicCode}
                {question.number ? ` • #${question.number}` : ''}
              </span>
              <h4
                className={`text-sm font-bold truncate ${
                  isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'
                }`}
              >
                {question.name}
              </h4>
            </div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5">
              {question.description}
            </div>
          </div>
        </div>

        {/* Right Badges & Expand Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
            {question.difficulty}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
            {question.timeComplexity}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenIDE();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-600 bg-[#070d1e] text-indigo-300 hover:bg-[#0c1633] text-[11px] font-bold shadow-xs cursor-pointer transition-colors"
            title="Open in Browser IDE (C, C++, Java, Python, HTML, JS + Hidden Tests)"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">IDE</span>
          </button>

          <button
            type="button"
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="px-4 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs bg-slate-50/40 rounded-b-2xl">
          {/* Detailed Problem Statement */}
          <div className="space-y-1 pt-1">
            <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[10px] rainbow-text">
              Problem Statement
            </span>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm">
              {question.description}
            </p>
          </div>

          {/* I/O Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1 shadow-2xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">
                Input Format
              </span>
              <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap">
                {question.inputFormat}
              </pre>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1 shadow-2xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">
                Output Format
              </span>
              <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap">
                {question.outputFormat}
              </pre>
            </div>
          </div>

          {/* Sample I/O */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1 shadow-2xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">
                Sample Input
              </span>
              <pre className="font-mono text-xs text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 whitespace-pre-wrap">
                {question.sampleInput}
              </pre>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1 shadow-2xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">
                Sample Output
              </span>
              <pre className="font-mono text-xs text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 whitespace-pre-wrap">
                {question.sampleOutput}
              </pre>
            </div>
          </div>

          {/* Constraints */}
          {question.constraints.length > 0 && (
            <div className="space-y-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Constraints & Invariants
              </span>
              <div className="flex flex-wrap gap-2">
                {question.constraints.map((c, i) => (
                  <span
                    key={i}
                    className="font-mono text-[11px] px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Kapil's Strategic Intuition Callout */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="rainbow-text font-black">Kapil&apos;s Algorithmic Intuition & Interviewer Expectation:</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              {question.kapilIntuition}
            </p>
            <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-slate-600">
              <span>Time: <strong className="text-indigo-600">{question.timeComplexity}</strong></span>
              <span>Space: <strong className="text-indigo-600">{question.spaceComplexity}</strong></span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleSolved}
                className={`px-3.5 py-1.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {isCompleted ? '✓ Marked as Solved' : 'Mark as Solved'}
              </button>

              <button
                type="button"
                onClick={onOpenIDE}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-600 bg-[#070d1e] text-indigo-200 hover:bg-[#0c1633] text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Open in IDE (6 Langs + Tests)</span>
              </button>
            </div>

            <a
              href={question.hackerRankUrl || HACKERRANK_COURSE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all shadow-xs"
            >
              <span>Solve on HackerRank</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
