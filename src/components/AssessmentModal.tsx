import React, { useState } from 'react';
import { AssessmentQuestion } from '../types';
import { CheckCircle2, XCircle, AlertCircle, Award, ArrowRight, RotateCcw, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentModalProps {
  day: number;
  type: 'pre' | 'post';
  questions: AssessmentQuestion[];
  onComplete: (scorePercentage: number, passed: boolean) => void;
  onClose: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  day,
  type,
  questions,
  onComplete,
  onClose,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optionIdx,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const passed = score >= 70;

    if (passed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      });
    }

    onComplete(score, passed);
  };

  const score = isSubmitted ? calculateScore() : 0;
  const passed = score >= 70;
  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 text-slate-800 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold">
                Day {day} • {type === 'pre' ? 'Pre-Assessment' : 'Post-Assessment'}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {questions.length} Questions • Pass Bar: 70%
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black mt-1 rainbow-text">
              {type === 'pre'
                ? `Diagnostic Pre-Assessment: Day ${day}`
                : `Mastery Post-Assessment & Badge Qualifier: Day ${day}`}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Banner if Submitted */}
        {isSubmitted && (
          <div
            className={`my-4 p-4 rounded-2xl border flex items-center justify-between ${
              passed
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : 'border-amber-200 bg-amber-50 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-3">
              {passed ? (
                <Award className="w-8 h-8 text-emerald-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-600" />
              )}
              <div>
                <div className="text-base font-extrabold rainbow-text">
                  {passed ? 'Assessment Passed! Excellent work.' : 'Assessment Completed (Retake Encouraged)'}
                </div>
                <div className="text-xs text-slate-600">
                  Your Score: <span className="font-mono font-bold text-sm text-slate-900">{score}%</span> ({Math.round((score / 100) * questions.length)} / {questions.length} correct)
                  {type === 'post' && passed && ' • Official Daily Badge Unlocked!'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
                setCurrentIdx(0);
              }}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 underline font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Question Pager / Navigation */}
        <div className="flex items-center gap-1.5 my-4 overflow-x-auto pb-1">
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[idx] !== undefined;
            const isCorrect = isSubmitted && selectedAnswers[idx] === q.correctAnswer;
            const isWrong = isSubmitted && selectedAnswers[idx] !== q.correctAnswer;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`w-9 h-9 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  currentIdx === idx
                    ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white'
                    : isCorrect
                    ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                    : isWrong
                    ? 'bg-rose-100 border border-rose-300 text-rose-800 line-through'
                    : isAnswered
                    ? 'bg-slate-100 text-slate-800 border border-slate-300'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Active Question View */}
        {questions[currentIdx] && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-indigo-600 uppercase tracking-wider font-bold">
                Question {currentIdx + 1} of {questions.length} • {questions[currentIdx].topicTag}
              </div>
              <p className="text-sm md:text-base font-bold text-slate-900 leading-relaxed">
                {questions[currentIdx].question}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {questions[currentIdx].options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                const isCorrectOption = optIdx === questions[currentIdx].correctAnswer;

                let borderClasses = 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-800';
                if (isSubmitted) {
                  if (isCorrectOption) {
                    borderClasses = 'border-emerald-300 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-400';
                  } else if (isSelected && !isCorrectOption) {
                    borderClasses = 'border-rose-300 bg-rose-50 text-rose-950 opacity-70';
                  }
                } else if (isSelected) {
                  borderClasses = 'border-indigo-400 bg-indigo-50/80 text-indigo-950 font-bold ring-1 ring-indigo-300';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentIdx, optIdx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${borderClasses}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 text-slate-500">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-xs md:text-sm flex-1 leading-snug">{option}</span>
                    {isSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {isSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation when submitted */}
            {isSubmitted && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-1.5 text-xs text-slate-700">
                <span className="font-extrabold rainbow-text block">Kapil&apos;s Algorithmic Rationale:</span>
                <p className="leading-relaxed">{questions[currentIdx].explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
          <button
            type="button"
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40 text-xs font-bold"
          >
            ← Previous
          </button>

          {!isSubmitted ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                {answeredCount} of {questions.length} answered
              </span>

              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
                >
                  Submit Assessment
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-colors shadow-xs cursor-pointer"
            >
              Continue to Syllabus
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
