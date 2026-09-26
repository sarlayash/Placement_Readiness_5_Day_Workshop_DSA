import React, { useRef, useCallback } from 'react';
import { UserProgress } from '../types';
import { ISTStatus, isDayUnlocked } from '../utils/istTime';
import {
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileBadge,
  Lock,
  X,
} from 'lucide-react';
import { HACKERRANK_COURSE_URL } from '../data/curriculum';

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
  onOpenBadges: () => void;
  onOpenCertificate: () => void;
  onOpenFinalExam: () => void;
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
  onOpenBadges,
  onOpenCertificate,
  onOpenFinalExam,
}) => {
  const isDraggingRef = useRef(false);

  const startResizing = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
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
    [onWidthChange]
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container - White Background */}
      <aside
        style={{ width: `${width}px` }}
        className={`fixed top-17 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 lg:hidden bg-slate-50">
          <span className="font-bold text-sm rainbow-text">Syllabus Navigation</span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Section: 5-Day Curriculum */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span className="rainbow-text font-black">5-Day Curriculum</span>
              <span className="text-[10px] text-slate-400 font-mono">T1 — T10</span>
            </div>

            <div className="space-y-1.5">
              {DAY_METADATA.map((item) => {
                const isSelected = currentDay === item.day;
                const lockState = isDayUnlocked(item.day, progress.badgesUnlocked, istStatus, demoBypass);
                const isCompleted = !!progress.badgesUnlocked[item.day];
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
                    className={`w-full text-left p-3 rounded-2xl border transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-indigo-300 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-200'
                        : lockState.unlocked
                        ? 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                        : 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-xs ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isSelected
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `D${item.day}`}
                        </div>
                        <div>
                          <div className="text-xs font-extrabold tracking-tight flex items-center gap-1.5">
                            <span className={isSelected ? 'rainbow-text font-black' : 'text-slate-800'}>
                              Day {item.day}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                Badge
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[170px] font-medium">
                            {item.part1} • {item.part2}
                          </div>
                        </div>
                      </div>

                      {/* Lock / Unlock Icon */}
                      <div className="shrink-0 mt-0.5">
                        {!lockState.unlocked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Sub-status badges: Pre & Post */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${prePassed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        Pre: {prePassed ? 'Passed' : 'Pending'}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${postPassed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        Post: {postPassed ? 'Passed' : 'Pending'}
                      </span>
                    </div>

                    {/* Lock reason */}
                    {!lockState.unlocked && (
                      <div className="mt-1 text-[10px] text-amber-700 leading-tight">
                        {lockState.reason}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Assessments & Certifications */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span className="rainbow-text font-black">Certificates & Honors</span>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={onOpenBadges}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Daily Badges Showcase</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {Object.values(progress.badgesUnlocked).filter(Boolean).length}/5
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenFinalExam}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="rainbow-text font-bold">Proctored Final Exam</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    progress.finalExamPassed
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {progress.finalExamPassed ? 'Cleared' : 'Day 5'}
                </span>
              </button>

              {progress.finalExamPassed && (
                <button
                  type="button"
                  onClick={onOpenCertificate}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900 font-bold text-xs shadow-xs hover:border-indigo-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileBadge className="w-4 h-4 text-indigo-600" />
                    <span>View Kapil Certificate</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </button>
              )}
            </div>
          </div>

          {/* Section: External Practice */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Practice Hub
            </div>
            <a
              href={HACKERRANK_COURSE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-emerald-600" />
                <span>HackerRank ti27183-jiet</span>
              </div>
              <span className="text-[10px] text-slate-400">Open ↗</span>
            </a>
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>IST Active Window:</span>
            <span className="text-slate-800 font-bold font-mono">08:00 - 20:00</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Drag right handle to expand/collapse
          </div>
        </div>

        {/* Drag-Expand Handle on Right Edge */}
        <div
          onMouseDown={startResizing}
          onDoubleClick={() => onWidthChange(280)}
          title="Drag left or right to expand/contract navigation bar (Double click to reset)"
          className="resizer-handle-x absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-indigo-400 active:bg-indigo-600 flex items-center justify-center group z-50 select-none"
        >
          <div className="w-[2px] h-8 bg-slate-300 group-hover:bg-indigo-600 rounded-full" />
        </div>
      </aside>
    </>
  );
};
