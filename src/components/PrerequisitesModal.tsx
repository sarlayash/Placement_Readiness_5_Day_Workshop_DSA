import React from 'react';
import { FinalExamEligibility } from '../utils/prerequisites';
import {
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  X,
} from 'lucide-react';

interface PrerequisitesModalProps {
  eligibility: FinalExamEligibility;
  onNavigateToDay: (day: number) => void;
  onEnableBypass?: () => void;
  onClose: () => void;
}

export const PrerequisitesModal: React.FC<PrerequisitesModalProps> = ({
  eligibility,
  onNavigateToDay,
  onEnableBypass,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 md:p-8 text-slate-800 shadow-2xl my-6 overflow-hidden">
        {/* Top Warning Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 rainbow-text">
                Final Proctored Assessment Prerequisites
              </h2>
              <p className="text-xs text-slate-500">
                Placement rules strictly require 100% completion of Days 1 through 5 tasks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout Banner */}
        <div className="my-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-900">
              {eligibility.totalTasksRemaining} Required Task(s) Remaining Across the Curriculum
            </div>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
              To safeguard verified certification standards, you must pass pre-assessments, solve guided questions, acknowledge the 6 solved programs, and earn daily honors badges before entering the proctored exam hall.
            </p>
          </div>
        </div>

        {/* Days 1 to 5 Checklist Grid */}
        <div className="space-y-3 my-4 max-h-[50vh] overflow-y-auto pr-1">
          {eligibility.dayStatuses.map((status) => {
            return (
              <div
                key={status.day}
                className={`p-4 rounded-2xl border transition-all ${
                  status.isComplete
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-white hover:border-indigo-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                        status.isComplete
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      D{status.day}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">
                      Day {status.day} Status
                    </span>
                    {status.isComplete ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All Sections Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> {status.missingTasks.length} Pending
                      </span>
                    )}
                  </div>

                  {!status.isComplete && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToDay(status.day);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Jump to Day {status.day}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Subtask Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    {status.prePassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span className={status.prePassed ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                      Pre-Assessment ({status.prePassed ? `Passed: ${status.preScore}%` : 'Pending'})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {status.allQuestionsSolved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span className={status.allQuestionsSolved ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                      Guided Questions ({status.questionsSolved}/{status.totalQuestions} Solved)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {status.allProgramsAcknowledged ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span className={status.allProgramsAcknowledged ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                      6 Solved Programs ({status.programsAcknowledged}/{status.totalPrograms} Acknowledged)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {status.postPassed && status.badgeEarned ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span className={status.postPassed ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                      Post-Assessment & Badge ({status.postPassed ? `Score: ${status.postScore}%` : 'Score >= 70%'})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          {onEnableBypass && (
            <button
              type="button"
              onClick={() => {
                onEnableBypass();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-900 font-bold underline cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Enable Testing Bypass (Evaluation Mode)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Return to Learning
          </button>
        </div>
      </div>
    </div>
  );
};
