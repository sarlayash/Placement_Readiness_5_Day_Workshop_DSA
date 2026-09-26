import React, { useState } from 'react';
import { SolvedProgram, SupportedLanguage, Question } from '../types';
import {
  CheckCircle2,
  Circle,
  Code2,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SolvedProgramsSectionProps {
  day: number;
  programs: SolvedProgram[];
  acknowledgedIds: string[];
  onToggleAcknowledge: (programId: string) => void;
  onOpenIDE: (question: Question) => void;
}

export const SolvedProgramsSection: React.FC<SolvedProgramsSectionProps> = ({
  day,
  programs,
  acknowledgedIds,
  onToggleAcknowledge,
  onOpenIDE,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(programs[0]?.id || null);
  const [selectedLangs, setSelectedLangs] = useState<Record<string, SupportedLanguage>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter programs
  const dayPrograms = programs.filter((p) => p.day === day);
  const filtered = filterDifficulty === 'All'
    ? dayPrograms
    : dayPrograms.filter((p) => p.difficulty === filterDifficulty);

  const acknowledgedCount = dayPrograms.filter((p) => acknowledgedIds.includes(p.id)).length;
  const isAllAcknowledged = dayPrograms.length > 0 && acknowledgedCount === dayPrograms.length;

  const handleCopyCode = (programId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(programId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAcknowledge = (p: SolvedProgram) => {
    const isNowAcknowledging = !acknowledgedIds.includes(p.id);
    onToggleAcknowledge(p.id);

    if (isNowAcknowledging) {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
      });
    }
  };

  // Convert a SolvedProgram to Question format for the In-Browser IDE
  const openInIDE = (p: SolvedProgram) => {
    const q: Question = {
      id: p.id,
      day: p.day,
      topicCode: `Day ${p.day} Solved`,
      number: 1,
      name: p.title,
      description: p.problemStatement,
      inputFormat: 'Standard Input',
      outputFormat: 'Standard Output',
      sampleInput: p.sampleInput,
      sampleOutput: p.sampleOutput,
      constraints: ['Placement Benchmark Program', `Time: ${p.timeComplexity}`, `Space: ${p.spaceComplexity}`],
      kapilIntuition: `${p.kapilInsight}\n\nExplanation: ${p.explanation}`,
      timeComplexity: p.timeComplexity,
      spaceComplexity: p.spaceComplexity,
      type: 'inclass',
      difficulty: p.difficulty,
      hackerRankUrl: 'https://www.hackerrank.com',
      testCases: p.testCases,
      starterCode: p.solutions,
      interviewTips: [
        p.kapilInsight,
        `Expected Time: ${p.timeComplexity}`,
        `Expected Space: ${p.spaceComplexity}`,
      ],
    };
    onOpenIDE(q);
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Header Banner for Solved Programs */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider border border-emerald-200">
                Step 2 • Placement Exemplars
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                6 Solved Programs (2 Easy • 2 Medium • 2 Hard)
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight rainbow-text">
              Day {day} Kapil&apos;s Solved Programs Masterclass
            </h2>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Study the 6 benchmark solutions with production-grade implementations in <strong>C, C++, Java, Python, HTML, and JavaScript</strong>. Acknowledge each program as complete after verifying the logic, time complexity invariants, and edge cases.
            </p>
          </div>

          {/* Acknowledgement Status Pill */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-2xs text-right min-w-[160px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Learner Acknowledged</div>
              <div className="text-lg font-mono font-extrabold text-slate-900 flex items-center justify-end gap-1.5">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <span>{acknowledgedCount} / {dayPrograms.length}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(acknowledgedCount / (dayPrograms.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            {isAllAcknowledged && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                All 6 Mastered & Acknowledged!
              </span>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => {
            const count = diff === 'All'
              ? dayPrograms.length
              : dayPrograms.filter((p) => p.difficulty === diff).length;

            return (
              <button
                key={diff}
                type="button"
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterDifficulty === diff
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>{diff}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  filterDifficulty === diff ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Cards Grid / List */}
      <div className="space-y-4">
        {filtered.map((program) => {
          const isExpanded = expandedId === program.id;
          const isAcknowledged = acknowledgedIds.includes(program.id);
          const currentLang = selectedLangs[program.id] || 'cpp';
          const code = program.solutions[currentLang] || '';

          const diffBadgeColor =
            program.difficulty === 'Easy'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : program.difficulty === 'Medium'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-rose-50 text-rose-800 border-rose-200';

          return (
            <div
              key={program.id}
              className={`rounded-2xl border transition-all ${
                isAcknowledged
                  ? 'border-emerald-300/80 bg-white shadow-xs ring-1 ring-emerald-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Header Bar */}
              <div className="p-4 md:p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Mark Complete Checkbox Icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcknowledge(program);
                    }}
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isAcknowledged
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                        : 'border-slate-300 bg-white hover:border-emerald-500 text-transparent'
                    }`}
                    title={isAcknowledged ? 'Click to unacknowledge' : 'Acknowledge: I have understood this program'}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <div
                    onClick={() => setExpandedId(isExpanded ? null : program.id)}
                    className="cursor-pointer min-w-0 flex-1"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${diffBadgeColor}`}>
                        {program.difficulty}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {program.topicTag}
                      </span>
                      <h3 className="text-sm md:text-base font-extrabold text-slate-900 truncate">
                        {program.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-1">
                      {program.problemStatement}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Quick IDE launcher */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openInIDE(program);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-600 bg-[#070d1e] text-indigo-300 hover:bg-[#0c1633] text-xs font-bold shadow-xs cursor-pointer transition-colors"
                    title="Run and experiment in In-Browser IDE"
                  >
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Open in IDE</span>
                  </button>

                  {/* Expand Chevron */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : program.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Card Body */}
              {isExpanded && (
                <div className="px-4 md:px-6 pb-6 pt-3 border-t border-slate-100 space-y-5 bg-slate-50/50 rounded-b-2xl">
                  {/* Problem & I/O Specifications */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Problem Statement
                    </span>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {program.problemStatement}
                    </p>
                  </div>

                  {/* Sample I/O Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Sample Input</div>
                      <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap">{program.sampleInput}</pre>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1 shadow-2xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Sample Output</div>
                      <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap">{program.sampleOutput}</pre>
                    </div>
                  </div>

                  {/* Kapil's Algorithmic Intuition Box */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-black text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Kapil&apos;s Algorithmic Intuition & Interviewer Invariants:</span>
                    </div>
                    <p className="text-amber-950 leading-relaxed">
                      {program.kapilInsight}
                    </p>
                    <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-amber-900 font-bold">
                      <span>Time: <strong className="text-indigo-700">{program.timeComplexity}</strong></span>
                      <span>Space: <strong className="text-indigo-700">{program.spaceComplexity}</strong></span>
                    </div>
                  </div>

                  {/* Multi-Language Solution Viewer */}
                  <div className="rounded-2xl border border-slate-800 bg-[#070d1e] overflow-hidden shadow-lg">
                    {/* Top Language Tabs Bar */}
                    <div className="flex items-center justify-between px-3 py-2 bg-[#0c1633] border-b border-slate-800">
                      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                        {(['cpp', 'java', 'python', 'c', 'javascript', 'html'] as SupportedLanguage[]).map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setSelectedLangs((prev) => ({ ...prev, [program.id]: lang }))}
                            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                              currentLang === lang
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`}
                          >
                            {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(program.id, code)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                        >
                          {copiedId === program.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Code Block / HTML live preview */}
                    {currentLang === 'html' ? (
                      <div className="p-4 space-y-3">
                        <div className="text-xs text-slate-400 font-mono">Live Visualizer Preview:</div>
                        <iframe
                          title={`preview-${program.id}`}
                          srcDoc={code}
                          className="w-full h-48 rounded-xl border border-slate-700 bg-white"
                          sandbox="allow-scripts"
                        />
                      </div>
                    ) : (
                      <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-80 leading-relaxed">
                        <code>{code}</code>
                      </pre>
                    )}
                  </div>

                  {/* Learner Acknowledgement Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-white">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          Learner Self-Verification & Acknowledgement
                        </span>
                        {isAcknowledged && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ Verified Complete
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Confirm that you have studied the optimal algorithm, edge cases, and time/space invariants.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openInIDE(program)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Run in IDE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAcknowledge(program)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                          isAcknowledged
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-95'
                        }`}
                      >
                        {isAcknowledged ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Acknowledged & Mastered</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-white/80" />
                            <span>Mark as Complete (Acknowledge)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
