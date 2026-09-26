import React, { useState, useRef } from 'react';
import { WHEEL_SLICES, SPINNING_WHEEL_MCQS } from '../data/spinningWheelMCQs';
import { WheelSlice, SpinningWheelMCQ } from '../types';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  X,
  Zap,
  Award,
  LogIn,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpinningWheelModalProps {
  onClose: () => void;
  onContinueToHome: () => void;
  onPromptLogin?: () => void;
}

export const SpinningWheelModal: React.FC<SpinningWheelModalProps> = ({
  onClose,
  onContinueToHome,
  onPromptLogin,
}) => {
  // Phase: 'spin' | 'quiz' | 'results'
  const [phase, setPhase] = useState<'spin' | 'quiz' | 'results'>('spin');

  // Wheel state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [selectedSlice, setSelectedSlice] = useState<WheelSlice>(WHEEL_SLICES[0]);
  const [hasSpun, setHasSpun] = useState<boolean>(false);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});

  const wheelRef = useRef<HTMLDivElement | null>(null);

  // Handle Wheel Spin
  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Pick a random slice
    const randomIndex = Math.floor(Math.random() * WHEEL_SLICES.length);
    const winningSlice = WHEEL_SLICES[randomIndex];

    // Slices count = 8. Angle per slice = 360 / 8 = 45 deg.
    // In our SVG layout, pointer is at TOP (270 deg or -90 deg).
    // An offset formula to land cleanly in the middle of winningSlice:
    const sliceAngle = 360 / WHEEL_SLICES.length;
    // Add 5 to 7 full rotations (1800 - 2520 deg) + angle for slice
    const extraRounds = 5 + Math.floor(Math.random() * 3);
    const targetSliceCenter = randomIndex * sliceAngle + sliceAngle / 2;
    // Need top (270 deg) to point at this slice:
    const targetRotation = rotationAngle + extraRounds * 360 + (360 - targetSliceCenter) + 270;

    setRotationAngle(targetRotation);

    setTimeout(() => {
      setSelectedSlice(winningSlice);
      setIsSpinning(false);
      setHasSpun(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: [winningSlice.color, '#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    }, 4200);
  };

  const handleSelectOption = (qIndex: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
    setRevealedExplanations((prev) => ({
      ...prev,
      [qIndex]: true,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < SPINNING_WHEEL_MCQS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setPhase('results');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      });
    }
  };

  // Score computation
  const correctCount = SPINNING_WHEEL_MCQS.filter(
    (q, i) => userAnswers[i] === q.correctAnswer
  ).length;

  const wrongCount = SPINNING_WHEEL_MCQS.filter(
    (q, i) => userAnswers[i] !== undefined && userAnswers[i] !== null && userAnswers[i] !== q.correctAnswer
  ).length;

  const skippedCount = SPINNING_WHEEL_MCQS.length - (correctCount + wrongCount);

  const positiveMarks = correctCount * selectedSlice.bonus;
  const negativeMarks = wrongCount * selectedSlice.penalty;
  const netScore = Math.max(0, +(positiveMarks - negativeMarks).toFixed(1));
  const accuracy = correctCount + wrongCount > 0
    ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
    : 0;

  const currentQ: SpinningWheelMCQ = SPINNING_WHEEL_MCQS[currentQuestionIndex];
  const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== undefined && userAnswers[currentQuestionIndex] !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 md:p-8 text-slate-800 shadow-2xl my-6 overflow-hidden">
        {/* Top Rainbow Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-sky-500 via-indigo-500 to-purple-600" />

        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-pink-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
              ★
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm md:text-base rainbow-text">
                  Placement Wheel of Fortune • 10 Diagnostic MCQs
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                  Bonus + Negative Scoring
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Spin to unlock your multiplier rules, test core DSA concepts, and jumpstart your 5-day placement readiness.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ==================================================== */}
        {/* PHASE 1: SPINNING WHEEL */}
        {/* ==================================================== */}
        {phase === 'spin' && (
          <div className="py-6 flex flex-col items-center">
            {/* Multiplier Rule Announcement */}
            {hasSpun && (
              <div className="mb-6 w-full max-w-lg p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/80 text-center animate-fade-in shadow-xs">
                <div className="text-xs uppercase font-extrabold tracking-wider text-amber-800 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Wheel Landed on Honors Tier!</span>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1" style={{ color: selectedSlice.color }}>
                  {selectedSlice.label}
                </div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">
                  {selectedSlice.tier}
                </div>
                <div className="text-xs font-mono text-emerald-800 mt-2 font-bold bg-white/80 py-1 px-3 rounded-lg border border-amber-200 inline-block">
                  Correct Answer = +{selectedSlice.bonus} Marks | Wrong Answer = -{selectedSlice.penalty} Marks
                </div>
              </div>
            )}

            {/* The SVG Spinning Wheel */}
            <div className="relative w-72 h-72 md:w-84 md:h-84 my-4 flex items-center justify-center">
              {/* Pointer at the top */}
              <div className="absolute -top-3 z-20 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-red-600 drop-shadow-md" />
              </div>

              {/* Rotatable wheel disc */}
              <div
                ref={wheelRef}
                style={{
                  transform: `rotate(${rotationAngle}deg)`,
                  transition: isSpinning ? 'transform 4.2s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
                }}
                className="w-full h-full rounded-full shadow-2xl border-4 border-slate-900 overflow-hidden relative"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {WHEEL_SLICES.map((slice, i) => {
                    const count = WHEEL_SLICES.length;
                    const startAngle = (i * 360) / count;
                    const endAngle = ((i + 1) * 360) / count;
                    const rad = Math.PI / 180;
                    const x1 = 50 + 50 * Math.cos(startAngle * rad);
                    const y1 = 50 + 50 * Math.sin(startAngle * rad);
                    const x2 = 50 + 50 * Math.cos(endAngle * rad);
                    const y2 = 50 + 50 * Math.sin(endAngle * rad);
                    const midAngle = (startAngle + endAngle) / 2;
                    const textRad = midAngle * rad;
                    const tx = 50 + 32 * Math.cos(textRad);
                    const ty = 50 + 32 * Math.sin(textRad);

                    return (
                      <g key={slice.id}>
                        <path
                          d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                          fill={slice.color}
                          stroke="#ffffff"
                          strokeWidth="0.8"
                        />
                        <text
                          x={tx}
                          y={ty}
                          fill="#ffffff"
                          fontSize="3.8"
                          fontWeight="900"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                        >
                          {slice.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Center Hub Button */}
              <button
                type="button"
                onClick={spinWheel}
                disabled={isSpinning}
                className="absolute z-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-950 text-white border-4 border-amber-400 shadow-xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-80"
              >
                <Zap className="w-5 h-5 text-amber-400 mb-0.5 animate-pulse" />
                <span className="text-xs md:text-sm font-black tracking-widest uppercase">
                  {isSpinning ? 'SPINNING' : 'SPIN!'}
                </span>
                <span className="text-[9px] text-amber-300 font-mono font-bold">10 MCQs</span>
              </button>
            </div>

            {/* Bottom Actions for Spin Phase */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={spinWheel}
                disabled={isSpinning}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{hasSpun ? 'Spin Again for New Multiplier' : 'Spin the Wheel'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPhase('quiz')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Start 10 MCQs Challenge ({selectedSlice.label})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* PHASE 2: 10 MCQS QUIZ */}
        {/* ==================================================== */}
        {phase === 'quiz' && (
          <div className="py-4 space-y-4">
            {/* Quiz Progress & Live Score Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                  Question {currentQuestionIndex + 1} of {SPINNING_WHEEL_MCQS.length}
                </span>
                <span className="text-xs font-bold text-slate-600">{currentQ.topic}</span>
              </div>

              {/* Active Multiplier Rule */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +{selectedSlice.bonus} Correct
                </span>
                <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  -{selectedSlice.penalty} Wrong
                </span>
                <span className="font-sans text-slate-400">|</span>
                <span className="font-extrabold text-indigo-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Net: {netScore} pts
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="p-5 md:p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {currentQ.difficulty} Diagnostic
                </span>
                <span className="text-slate-400">
                  Answered: {Object.keys(userAnswers).length} / {SPINNING_WHEEL_MCQS.length}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  const isRevealed = revealedExplanations[currentQuestionIndex];
                  const isCorrect = optIdx === currentQ.correctAnswer;

                  let optionStyle =
                    'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:border-indigo-300';
                  if (isRevealed) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-red-400 bg-red-50/80 text-red-900';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-indigo-500 bg-indigo-50 text-indigo-950 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs md:text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg border border-slate-300 bg-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 pt-0.5 leading-relaxed">{opt}</span>

                      {isRevealed && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isRevealed && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box once answered */}
              {revealedExplanations[currentQuestionIndex] && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 animate-fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-slate-900">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Kapil's Algorithmic Explanation:</span>
                  </div>
                  <p className="leading-relaxed pl-5 text-slate-600">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {/* Quiz Navigation Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {SPINNING_WHEEL_MCQS.map((_, dotIdx) => {
                  const answered = userAnswers[dotIdx] !== undefined && userAnswers[dotIdx] !== null;
                  const isCur = dotIdx === currentQuestionIndex;
                  return (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(dotIdx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isCur
                          ? 'w-6 bg-indigo-600'
                          : answered
                          ? 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                      title={`Question ${dotIdx + 1}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>
                    {currentQuestionIndex === SPINNING_WHEEL_MCQS.length - 1
                      ? 'Submit & See Net Score'
                      : 'Next Question'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* PHASE 3: RESULTS SUMMARY & NEXT STEPS */}
        {/* ==================================================== */}
        {phase === 'results' && (
          <div className="py-6 text-center space-y-6">
            <div className="w-20 h-20 rounded-full border-4 border-amber-400 bg-amber-50 mx-auto flex items-center justify-center text-amber-600 shadow-md">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                10 MCQs Diagnostic Report
              </div>
              <h2 className="text-2xl md:text-3xl font-black rainbow-text">
                Your Net Placement Score: {netScore} Points
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Scored with {selectedSlice.label} ({selectedSlice.tier})
              </p>
            </div>

            {/* Score Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 text-center">
                <div className="text-xl font-black text-emerald-700">{correctCount}</div>
                <div className="text-[11px] font-bold text-emerald-800">Correct (+{positiveMarks})</div>
              </div>

              <div className="p-3.5 rounded-2xl border border-red-200 bg-red-50/60 text-center">
                <div className="text-xl font-black text-red-600">{wrongCount}</div>
                <div className="text-[11px] font-bold text-red-800">Wrong (-{negativeMarks})</div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-center">
                <div className="text-xl font-black text-slate-700">{skippedCount}</div>
                <div className="text-[11px] font-bold text-slate-500">Skipped (0)</div>
              </div>

              <div className="p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/60 text-center">
                <div className="text-xl font-black text-indigo-700">{accuracy}%</div>
                <div className="text-[11px] font-bold text-indigo-800">Accuracy Rate</div>
              </div>
            </div>

            {/* Kapil's Guidance */}
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 text-left space-y-1.5">
              <div className="font-extrabold flex items-center gap-1.5 text-indigo-900">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Kapil's Diagnosis:</span>
              </div>
              <p className="leading-relaxed text-slate-700">
                {accuracy >= 70
                  ? 'Outstanding baseline readiness! Your mathematical intuition and complexity calculation are sharp. Continue directly to the 25 Aptitude MCQs and 5-Day Syllabus to maintain this momentum.'
                  : 'Solid initial attempt! Review the In-Place Array Transformations and Recursion Tree Depth questions in Day 1 and Day 2 to eliminate negative marks in high-stakes placement rounds.'}
              </p>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onContinueToHome}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Home Page & 25 Aptitude MCQs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onPromptLogin && (
                <button
                  type="button"
                  onClick={onPromptLogin}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-indigo-600" />
                  <span>Sign In with Google to Save Score</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setPhase('spin');
                  setUserAnswers({});
                  setRevealedExplanations({});
                  setCurrentQuestionIndex(0);
                }}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Spin Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
