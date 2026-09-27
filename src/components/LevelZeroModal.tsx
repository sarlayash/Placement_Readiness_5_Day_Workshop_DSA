import React, { useState } from 'react';
import { SolvedProgram, SupportedLanguage, Question } from '../types';
import { LEVEL_ZERO_PROGRAMS } from '../data/levelZeroPrograms';
import {
  X,
  CheckCircle2,
  Circle,
  Code2,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Play,
  Monitor,
  Lightbulb,
  FileCheck2,
  Flame,
  Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelZeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedIds: string[];
  onToggleComplete: (programId: string) => void;
  onOpenIDE: (question: Question) => void;
}

const LANGUAGE_LABELS: { lang: SupportedLanguage; label: string; tag: string; color: string }[] = [
  { lang: 'java', label: 'Java', tag: 'JDK 17+', color: 'from-amber-500 to-orange-600' },
  { lang: 'c', label: 'C', tag: 'C99 / C11', color: 'from-sky-500 to-blue-600' },
  { lang: 'cpp', label: 'C++', tag: 'C++17 / C++20', color: 'from-blue-600 to-indigo-700' },
  { lang: 'python', label: 'Python', tag: 'Python 3.10+', color: 'from-emerald-500 to-teal-600' },
  { lang: 'html', label: 'HTML', tag: 'Interactive DOM', color: 'from-orange-500 to-rose-600' },
  { lang: 'javascript', label: 'JavaScript', tag: 'ES6+ / Node', color: 'from-yellow-400 to-amber-500' }
];

export const LevelZeroModal: React.FC<LevelZeroModalProps> = ({
  isOpen,
  onClose,
  completedIds,
  onToggleComplete,
  onOpenIDE
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string>(LEVEL_ZERO_PROGRAMS[0]?.id || 'lvl0-1');
  const [selectedLangs, setSelectedLangs] = useState<Record<string, SupportedLanguage>>({});
  const [htmlPreviewActive, setHtmlPreviewActive] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredPrograms = LEVEL_ZERO_PROGRAMS.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.problemStatement.toLowerCase().includes(q) ||
      p.topicTag.toLowerCase().includes(q) ||
      p.explanation.toLowerCase().includes(q)
    );
  });

  const completedCount = LEVEL_ZERO_PROGRAMS.filter((p) => completedIds.includes(p.id)).length;
  const progressPercent = Math.round((completedCount / LEVEL_ZERO_PROGRAMS.length) * 100);

  const handleCopyCode = (programId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(programId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggle = (program: SolvedProgram) => {
    const wasCompleted = completedIds.includes(program.id);
    onToggleComplete(program.id);
    if (!wasCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#34d399', '#f59e0b', '#ec4899']
      });
    }
  };

  const openInIDE = (p: SolvedProgram) => {
    const q: Question = {
      id: p.id,
      day: 0,
      topicCode: 'LEVEL 0',
      number: parseInt(p.id.replace('lvl0-', ''), 10) || 1,
      name: p.title,
      description: p.problemStatement,
      inputFormat: 'Standard Input',
      outputFormat: 'Standard Output',
      sampleInput: p.sampleInput,
      sampleOutput: p.sampleOutput,
      constraints: [
        'LEVEL 0: Fundamental syntax and core logic verification',
        `Time Complexity: ${p.timeComplexity}`,
        `Space Complexity: ${p.spaceComplexity}`
      ],
      kapilIntuition: `${p.kapilInsight}\n\nExplanation:\n${p.explanation}`,
      timeComplexity: p.timeComplexity,
      spaceComplexity: p.spaceComplexity,
      type: 'inclass',
      difficulty: 'Easy',
      hackerRankUrl: 'https://www.hackerrank.com',
      testCases: p.testCases,
      starterCode: p.solutions,
      interviewTips: [
        p.kapilInsight,
        `Expected Time: ${p.timeComplexity}`,
        `Expected Space: ${p.spaceComplexity}`,
        'Write clean variable names and keep standard I/O concise.'
      ]
    };
    onOpenIDE(q);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Rainbow Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-sky-500 via-indigo-500 to-purple-600" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40">
                LEVEL 0
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Bootstrapping Foundations (10 Programs)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="rainbow-text">LEVEL 0: 10 Solved Basic Programs</span>
              <Flame className="w-5 h-5 text-amber-400 shrink-0" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Same core program implemented in <strong>Java</strong>, <strong>C</strong>,{' '}
              <strong>C++</strong>, <strong>Python</strong>, and <strong>interactive HTML/JS</strong>.
              Master basic syntax, standard I/O, conditionals, and loops before diving into T1-T10.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Progress Counter Pill */}
            <div className="bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-2xl flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Completed
                </div>
                <div className="text-sm font-black text-white">
                  <span className="text-emerald-400 font-mono">{completedCount}</span> /{' '}
                  <span className="font-mono">10</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400 font-mono">
                {progressPercent}%
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Close Level 0 Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Search Filter */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="w-full sm:w-1/2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-semibold text-slate-300">Overall Level 0 Mastery</span>
              <span className="font-mono font-bold text-sky-400">{completedCount} of 10 Mastered</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/60">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 10 Level 0 programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
          </div>
        </div>

        {/* Program List Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 divide-y divide-slate-800/60">
          {filteredPrograms.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No Level 0 programs matched "{searchTerm}".</p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-3 text-xs text-sky-400 hover:underline font-semibold"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredPrograms.map((program, idx) => {
              const isExpanded = expandedId === program.id;
              const isCompleted = completedIds.includes(program.id);
              const activeLang: SupportedLanguage = selectedLangs[program.id] || 'java';
              const isHtmlPreview = !!htmlPreviewActive[program.id];
              const activeCode = program.solutions[activeLang] || '';

              return (
                <div
                  key={program.id}
                  className={`pt-5 first:pt-0 transition-all ${
                    isExpanded ? 'space-y-4' : 'hover:bg-slate-800/20 rounded-2xl p-2'
                  }`}
                >
                  {/* Program Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div
                      className="flex items-start sm:items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
                      onClick={() => setExpandedId(isExpanded ? '' : program.id)}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(program);
                        }}
                        className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                        title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-sky-950/80 text-sky-400 border border-sky-800/80 font-mono">
                            PROG {idx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-mono">
                            LEVEL 0
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {program.topicTag}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5 truncate">
                          {program.title}
                        </h3>
                      </div>
                    </div>

                    {/* Action Bar for Expanded vs Collapsed */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => openInIDE(program)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
                        title="Open in Browser IDE with test runner"
                      >
                        <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Open in IDE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggle(program)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isCompleted
                            ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
                            : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Mark Complete</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? '' : program.id)}
                        className="p-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 p-5">
                      {/* Problem Statement & Sample IO */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Problem Statement
                          </h4>
                          <p className="text-sm text-slate-200 leading-relaxed">
                            {program.problemStatement}
                          </p>

                          <div className="pt-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                              Explanation & Logic
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {program.explanation}
                            </p>
                          </div>
                        </div>

                        {/* Complexity & Kapil Insight Pill */}
                        <div className="space-y-3 bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">Time Complexity:</span>
                            <span className="font-mono font-bold text-emerald-400">
                              {program.timeComplexity}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
                            <span className="text-slate-400 font-medium">Space Complexity:</span>
                            <span className="font-mono font-bold text-sky-400">
                              {program.spaceComplexity}
                            </span>
                          </div>
                          <div className="border-t border-slate-800 pt-2 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Kapil's Strategic Insight</span>
                            </div>
                            <p className="text-[11px] text-slate-300 italic leading-snug">
                              {program.kapilInsight}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Sample Input / Output Blocks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Sample Input
                          </div>
                          <pre className="text-slate-200 whitespace-pre-wrap">{program.sampleInput}</pre>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Sample Output
                          </div>
                          <pre className="text-emerald-400 whitespace-pre-wrap">{program.sampleOutput}</pre>
                        </div>
                      </div>

                      {/* 5-Language Code Switcher & Code Box */}
                      <div className="space-y-2 pt-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                          {/* Language selector tabs */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {LANGUAGE_LABELS.map((item) => {
                              const isSelected = activeLang === item.lang;
                              return (
                                <button
                                  key={item.lang}
                                  type="button"
                                  onClick={() => {
                                    setSelectedLangs((prev) => ({
                                      ...prev,
                                      [program.id]: item.lang
                                    }));
                                  }}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-gradient-to-r ' +
                                        item.color +
                                        ' text-white shadow-xs'
                                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 border border-slate-700/60'
                                  }`}
                                >
                                  <span>{item.label}</span>
                                  <span className="text-[9px] opacity-75 font-mono">
                                    {item.tag}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Extra Controls: Live Preview toggle for HTML, Copy button */}
                          <div className="flex items-center gap-2">
                            {activeLang === 'html' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setHtmlPreviewActive((prev) => ({
                                    ...prev,
                                    [program.id]: !prev[program.id]
                                  }));
                                }}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isHtmlPreview
                                    ? 'bg-emerald-600 text-white border border-emerald-500'
                                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
                                }`}
                              >
                                <Monitor className="w-3.5 h-3.5" />
                                <span>{isHtmlPreview ? 'View Source' : 'Live Preview'}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleCopyCode(program.id, activeCode)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                              title="Copy code to clipboard"
                            >
                              {copiedId === program.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Code Display or Live HTML Preview */}
                        {activeLang === 'html' && isHtmlPreview ? (
                          <div className="rounded-xl border border-slate-700 bg-slate-950 overflow-hidden">
                            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                Interactive HTML5 & JavaScript Sandbox
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Live Browser DOM Execution
                              </span>
                            </div>
                            <iframe
                              title={`preview-${program.id}`}
                              srcDoc={activeCode}
                              className="w-full h-80 border-none bg-slate-950"
                              sandbox="allow-scripts"
                            />
                          </div>
                        ) : (
                          <div className="relative rounded-xl border border-slate-800 bg-[#060b17] overflow-hidden">
                            <div className="bg-[#0b142b] px-4 py-1.5 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                              <span>
                                {activeLang.toUpperCase()} Solution • LEVEL 0 Syntax
                              </span>
                              <span className="text-slate-500 font-mono text-[10px]">
                                {activeCode.split('\n').length} lines
                              </span>
                            </div>
                            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-96">
                              <code>{activeCode}</code>
                            </pre>
                          </div>
                        )}
                      </div>

                      {/* Test Cases Accordion / Row */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                          <span>Verification Test Cases</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {program.testCases.length} Cases
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                          {program.testCases.map((tc, tcIdx) => (
                            <div
                              key={tc.id}
                              className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <div className="text-[10px] text-slate-400 font-bold">
                                  Case #{tcIdx + 1} {tc.isHidden ? '(Hidden Test)' : '(Visible)'}
                                </div>
                                <div className="truncate text-slate-300 text-[11px]">
                                  In: <span className="text-amber-300">{tc.input}</span>
                                </div>
                                <div className="truncate text-slate-300 text-[11px]">
                                  Exp: <span className="text-emerald-300">{tc.expectedOutput}</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                Verified
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              All 10 Level 0 programs count toward your workshop foundational readiness.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            Done Reviewing Level 0
          </button>
        </div>
      </div>
    </div>
  );
};
