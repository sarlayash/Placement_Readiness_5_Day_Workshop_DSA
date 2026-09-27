import React, { useRef, useCallback } from 'react';
import { UserProgress, FeedbackWindowStatus } from '../types';
import { ISTStatus } from '../utils/istTime';
import { isDayUnlockedStrict, checkDayCompletion } from '../utils/prerequisites';
import {
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileBadge,
  Lock,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Code2,
  Lightbulb,
  Zap,
  Brain,
  Smartphone,
  MessageSquare,
  Sliders,
} from 'lucide-react';
import { HACKERRANK_COURSE_URL } from '../data/curriculum';
import { SOLVED_PROGRAMS } from '../data/solvedPrograms';

interface LeftSidebarProps {
  currentDay: number;
  onSelectDay: (day: number) => void;
  progress: UserProgress;
  istStatus: ISTStatus;
  demoBypass: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  width: number;
  onWidthChange: (newWidth: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenBadges: () => void;
  onOpenCertificate: () => void;
  onOpenFinalExam: () => void;
  onOpenInterviewTips: () => void;
  onOpenIDE: () => void;
  onOpenSpinningWheel?: () => void;
  onOpenAptitude?: () => void;
  onOpenLevelZero?: () => void;
  onOpenVisualizer?: () => void;
  onOpenPWAInstall?: () => void;
  onOpenFeedback?: () => void;
  feedbackStatus?: FeedbackWindowStatus;
}

const DAY_METADATA = [
  { day: 1, part1: 'T1: Graphs', part2: 'T2: Recursion & Strings', badgeTitle: 'Graph Architect' },
  { day: 2, part1: 'T3: Recursion & LCM', part2: 'T4: Complexity & Math', badgeTitle: 'Math Algorist' },
  { day: 3, part1: 'T5: Number Theory', part2: 'T6: Two Pointer', badgeTitle: 'Two-Pointer Vanguard' },
  { day: 4, part1: 'T7: Advanced Pointers', part2: 'T8: Divide & Conquer', badgeTitle: 'D&C Conqueror' },
  { day: 5, part1: 'T9: Advanced D&C', part2: 'T10: Matrix & Synthesis', badgeTitle: 'Readiness Titan' },
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentDay,
  onSelectDay,
  progress,
  istStatus,
  demoBypass,
  isOpenMobile,
  onCloseMobile,
  width,
  onWidthChange,
  isCollapsed,
  onToggleCollapse,
  onOpenBadges,
  onOpenCertificate,
  onOpenFinalExam,
  onOpenInterviewTips,
  onOpenIDE,
  onOpenSpinningWheel,
  onOpenAptitude,
  onOpenLevelZero,
  onOpenVisualizer,
  onOpenPWAInstall,
  onOpenFeedback,
  feedbackStatus,
}) => {
  const isDraggingRef = useRef(false);

  const startResizing = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      if (isCollapsed) return;
      mouseDownEvent.preventDefault();
      isDraggingRef.current = true;

      const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const newWidth = Math.max(220, Math.min(460, mouseMoveEvent.clientX));
        onWidthChange(newWidth);
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [isCollapsed, onWidthChange]
  );

  const effectiveWidth = isCollapsed ? 76 : width;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Left Navigation Bar - NAVY BLUE THEME (#071329) */}
      <aside
        style={{ width: `${effectiveWidth}px` }}
        className={`fixed top-17 bottom-0 left-0 z-40 flex flex-col bg-[#071329] text-white border-r border-[#152a55] transition-[width,transform] duration-200 ease-in-out lg:translate-x-0 shadow-2xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Bar with Expand / Collapse Toggle */}
        <div className="flex items-center justify-between p-3.5 border-b border-[#152a55] bg-[#050e1f]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-300">
                Placement Syllabus
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 mx-auto">DSA</span>
          )}

          <div className="flex items-center gap-1 ml-auto">
            {/* Collapse/Expand Button for Laptop/Desktop */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#122347] transition-colors"
              title={isCollapsed ? 'Expand Navigation Bar' : 'Collapse Navigation Bar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Close Button on Mobile */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#122347]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
          {/* LEVEL 0: Foundations (10 Solved Programs) */}
          {onOpenLevelZero && (
            <button
              type="button"
              onClick={onOpenLevelZero}
              title={isCollapsed ? 'LEVEL 0: 10 Solved Programs' : undefined}
              className={`w-full flex items-center rounded-xl border border-sky-500/50 bg-gradient-to-r from-sky-950/60 via-blue-950/40 to-slate-900/60 hover:bg-sky-900/40 text-sky-200 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />
                {!isCollapsed && (
                  <div className="text-left">
                    <div className="font-extrabold text-white flex items-center gap-1.5">
                      <span className="rainbow-text">LEVEL 0: Foundations</span>
                    </div>
                    <div className="text-[10px] text-sky-300 font-normal">
                      10 Solved (Java, C, C++, Python, HTML)
                    </div>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-900/80 text-sky-200 font-mono font-bold border border-sky-700/60">
                  {progress.levelZeroCompletedIds?.length || 0}/10
                </span>
              )}
            </button>
          )}

          {/* Algorithm Visualizer Lab */}
          {onOpenVisualizer && (
            <button
              type="button"
              onClick={onOpenVisualizer}
              title={isCollapsed ? 'Algorithm Visualizer Lab' : undefined}
              className={`w-full flex items-center rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900/60 hover:bg-purple-900/40 text-purple-200 text-xs font-bold transition-all cursor-pointer shadow-xs mb-2 ${
                isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
                {!isCollapsed && (
                  <div className="text-left">
                    <div className="font-extrabold text-white flex items-center gap-1.5">
                      <span className="rainbow-text">Algorithm Visualizer</span>
                    </div>
                    <div className="text-[10px] text-purple-300 font-normal">
                      Searching • Sorting • Graphs • Trees
                    </div>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 font-mono font-bold border border-purple-700/60">
                  {progress.visualizationCompletedIds?.length || 0}/11
                </span>
              )}
            </button>
          )}

          {/* Section: 5-Day Curriculum */}
          <div className="space-y-1.5">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className="rainbow-text font-black">5-Day Curriculum</span>
                <span className="text-[10px] text-slate-500 font-mono">T1-T10</span>
              </div>
            )}

            <div className="space-y-1.5">
              {DAY_METADATA.map((item) => {
                const isSelected = currentDay === item.day;
                const lockState = isDayUnlockedStrict(item.day, progress, istStatus, demoBypass);
                const dayStatus = checkDayCompletion(item.day, progress);
                const isCompleted = dayStatus.isComplete;
                const prePassed = !!progress.dayPreAssessmentPassed[item.day];
                const postPassed = !!progress.dayPostAssessmentPassed[item.day];

                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => {
                      if (lockState.unlocked) {
                        onSelectDay(item.day);
                        onCloseMobile();
                      }
                    }}
                    disabled={!lockState.unlocked}
                    title={isCollapsed ? `Day ${item.day}: ${item.part1}` : undefined}
                    className={`w-full text-left rounded-2xl border transition-all relative cursor-pointer ${
                      isCollapsed ? 'p-2 flex flex-col items-center justify-center' : 'p-3'
                    } ${
                      isSelected
                        ? 'border-indigo-400 bg-gradient-to-r from-indigo-950/80 to-[#0e214d] text-white shadow-md ring-1 ring-indigo-500/50'
                        : lockState.unlocked
                        ? 'border-[#14264d] bg-[#091733] hover:bg-[#0e224d] hover:border-slate-600 text-slate-300'
                        : 'border-[#0f1d3d] bg-[#050e1f] text-slate-600 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-xs ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isSelected
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                              : 'bg-[#152a55] text-slate-300 border border-[#213e79]'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `D${item.day}`}
                        </div>

                        {!isCollapsed && (
                          <div className="min-w-0">
                            <div className="text-xs font-extrabold tracking-tight flex items-center gap-1.5">
                              <span className={isSelected ? 'rainbow-text font-black' : 'text-white'}>
                                Day {item.day}
                              </span>
                              {isCompleted && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                                  Won
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[170px] font-medium">
                              {item.part1} • {item.part2}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Lock / Unlock Icon */}
                      {!isCollapsed && (
                        <div className="shrink-0 mt-0.5">
                          {!lockState.unlocked ? (
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                          ) : isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Sub-status badges if expanded */}
                    {!isCollapsed && (
                      <div className="mt-2.5 pt-2 border-t border-[#152a55] flex flex-col gap-1 text-[10px] text-slate-400 font-medium">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${prePassed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                            Pre: {prePassed ? 'Passed' : 'Pending'}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${postPassed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                            Post: {postPassed ? 'Passed' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] pt-0.5">
                          <span className="text-emerald-400 font-mono font-bold">
                            {SOLVED_PROGRAMS.filter((p) => p.day === item.day && (progress.acknowledgedSolvedProgramIds || []).includes(p.id)).length}/6 Solved
                          </span>
                          <span className="text-slate-500 font-mono">2E • 2M • 2H</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Interactive Tools (Browser IDE & Interview Tips) */}
          <div className="space-y-1 pt-2 border-t border-[#152a55]">
            {!isCollapsed && (
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span className="rainbow-text font-black">Interactive Tools</span>
              </div>
            )}

            {/* Wheel of Fortune Button */}
            {onOpenSpinningWheel && (
              <button
                type="button"
                onClick={onOpenSpinningWheel}
                title={isCollapsed ? 'Spinning Wheel (10 MCQs)' : undefined}
                className={`w-full flex items-center rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 to-orange-950/30 hover:bg-amber-900/40 text-amber-200 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                  {!isCollapsed && <span>Wheel of Fortune</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-900 text-amber-300 font-mono">
                    10 MCQs
                  </span>
                )}
              </button>
            )}

            {/* 25 Aptitude MCQs Button */}
            {onOpenAptitude && (
              <button
                type="button"
                onClick={onOpenAptitude}
                title={isCollapsed ? '25 Placement Aptitude MCQs' : undefined}
                className={`w-full flex items-center rounded-xl border border-indigo-500/40 bg-[#0a1a3a] hover:bg-[#112652] text-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
                  {!isCollapsed && <span>25 Aptitude MCQs</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-900 text-indigo-300 font-mono">
                    DSA Link
                  </span>
                )}
              </button>
            )}

            {/* Launch Browser IDE Button */}
            <button
              type="button"
              onClick={onOpenIDE}
              title={isCollapsed ? 'Browser IDE' : undefined}
              className={`w-full flex items-center rounded-xl border border-[#1b3469] bg-[#0c1c3f] hover:bg-[#122a5e] text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
              }`}
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400 shrink-0" />
                {!isCollapsed && <span>Browser IDE (6 Langs)</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 font-mono">
                  IDE
                </span>
              )}
            </button>

            {/* Kapil's Interview Tips Button */}
            <button
              type="button"
              onClick={onOpenInterviewTips}
              title={isCollapsed ? 'Kapil Interview Tips' : undefined}
              className={`w-full flex items-center rounded-xl border border-amber-900/60 bg-amber-950/20 hover:bg-amber-950/40 text-amber-200 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                {!isCollapsed && <span>Interview Playbook</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-mono">
                  FAANG
                </span>
              )}
            </button>

            {/* Daily Feedback Button (2:30 PM - 3:30 PM IST) */}
            {onOpenFeedback && (
              <button
                type="button"
                onClick={onOpenFeedback}
                title={isCollapsed ? `Daily Feedback (Day ${currentDay})` : undefined}
                className={`w-full flex items-center rounded-xl border transition-all cursor-pointer shadow-xs ${
                  isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
                } ${
                  feedbackStatus?.isFilledToday
                    ? 'border-emerald-600/50 bg-emerald-950/30 text-emerald-200 hover:bg-emerald-900/40'
                    : feedbackStatus?.isActive
                    ? 'border-rose-500/80 bg-rose-950/40 text-rose-200 hover:bg-rose-900/50 animate-pulse'
                    : 'border-teal-700/40 bg-[#092233] text-teal-200 hover:bg-[#0c2e45]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-400 shrink-0" />
                  {!isCollapsed && <span>Daily Feedback</span>}
                </div>
                {!isCollapsed && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      feedbackStatus?.isFilledToday
                        ? 'bg-emerald-900 text-emerald-300'
                        : feedbackStatus?.isActive
                        ? 'bg-rose-900 text-rose-200 font-bold'
                        : 'bg-teal-950 text-teal-300'
                    }`}
                  >
                    {feedbackStatus?.isFilledToday ? '✓ Done' : feedbackStatus?.isActive ? 'LIVE NOW' : '2:30 PM'}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Section: Honors & Certifications */}
          <div className="space-y-1 pt-2 border-t border-[#152a55]">
            {!isCollapsed && (
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>Honors & Exam</span>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenBadges}
              title={isCollapsed ? 'Daily Badges' : undefined}
              className={`w-full flex items-center rounded-xl border border-[#14264d] hover:bg-[#0e224d] text-slate-300 text-xs font-semibold transition-colors cursor-pointer ${
                isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                {!isCollapsed && <span>Daily Badges</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#152a55] text-white">
                  {Object.values(progress.badgesUnlocked).filter(Boolean).length}/5
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenFinalExam}
              title={isCollapsed ? 'Proctored Final Exam' : undefined}
              className={`w-full flex items-center rounded-xl border border-[#14264d] hover:bg-[#0e224d] text-slate-300 text-xs font-semibold transition-colors cursor-pointer ${
                isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                {!isCollapsed && <span className="rainbow-text font-bold">Proctored Final Exam</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#152a55] text-slate-300">
                  {progress.finalExamPassed ? 'Cleared' : 'Day 5'}
                </span>
              )}
            </button>

            {progress.finalExamPassed && (
              <button
                type="button"
                onClick={onOpenCertificate}
                title={isCollapsed ? 'Kapil Certificate' : undefined}
                className={`w-full flex items-center rounded-xl border border-indigo-400 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer ${
                  isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileBadge className="w-4 h-4 text-white shrink-0" />
                  {!isCollapsed && <span>View Certificate</span>}
                </div>
                {!isCollapsed && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
              </button>
            )}
          </div>

          {/* Section: External Practice */}
          <div className="space-y-1 pt-2 border-t border-[#152a55]">
            <a
              href={HACKERRANK_COURSE_URL}
              target="_blank"
              rel="noreferrer"
              title={isCollapsed ? 'HackerRank Hub' : undefined}
              className={`flex items-center rounded-xl border border-[#14264d] hover:bg-[#0e224d] text-slate-300 text-xs font-semibold transition-colors ${
                isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
              }`}
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
                {!isCollapsed && <span>HackerRank Hub</span>}
              </div>
              {!isCollapsed && <span className="text-[10px] text-slate-400">↗</span>}
            </a>

            {/* Install Phone App (PWA) Button */}
            {onOpenPWAInstall && (
              <button
                type="button"
                onClick={onOpenPWAInstall}
                title={isCollapsed ? 'Install Phone App (Offline)' : undefined}
                className={`w-full flex items-center rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer ${
                  isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  {!isCollapsed && <span>Download Phone App</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200 font-mono font-bold">
                    PWA
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navy Blue Footer info */}
        {!isCollapsed && (
          <div className="p-3 border-t border-[#152a55] bg-[#050e1f] text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <span>IST Lock Mode:</span>
              <span className="text-white font-bold font-mono">08:00 - 20:00</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Click arrow to collapse or drag right handle
            </div>
          </div>
        )}

        {/* Drag-Expand Handle on Right Edge (when not collapsed) */}
        {!isCollapsed && (
          <div
            onMouseDown={startResizing}
            onDoubleClick={() => onWidthChange(280)}
            title="Drag left or right to expand/contract navigation bar (Double click to reset)"
            className="resizer-handle-x absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-indigo-400 active:bg-indigo-600 flex items-center justify-center group z-50 select-none"
          >
            <div className="w-[2px] h-8 bg-slate-600 group-hover:bg-indigo-400 rounded-full" />
          </div>
        )}
      </aside>
    </>
  );
};
