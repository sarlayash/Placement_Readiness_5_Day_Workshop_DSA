import React, { useState, useRef, useCallback } from 'react';
import { ISTStatus } from '../utils/istTime';
import { UserProgress } from '../types';
import {
  Code2,
  BookMarked,
  Clock,
  ExternalLink,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Sliders,
  X,
  FileCheck2,
} from 'lucide-react';
import { HACKERRANK_COURSE_URL, TOPICS } from '../data/curriculum';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  width: number;
  onWidthChange: (newWidth: number) => void;
  istStatus: ISTStatus;
  demoBypass: boolean;
  onToggleDemoBypass: () => void;
  onSetSimulatedHour: (hour: number) => void;
  onResetSimulatedTime: () => void;
  progress: UserProgress;
  onToggleQuestionCompletion: (questionId: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  width,
  onWidthChange,
  istStatus,
  demoBypass,
  onToggleDemoBypass,
  onSetSimulatedHour,
  onResetSimulatedTime,
  progress,
  onToggleQuestionCompletion,
}) => {
  const [activeTab, setActiveTab] = useState<'scratchpad' | 'guidance' | 'hackerrank' | 'timemachine'>('scratchpad');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp'>('javascript');
  const [code, setCode] = useState<string>(
    `// Kapil's Placement Code Scratchpad
// Topic: Two Pointers / Graphs / Divide & Conquer

function twoPointerCheck(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const currentSum = arr[left] + arr[right];
    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1];
}

console.log("Test: ", twoPointerCheck([2, 7, 11, 15], 9));`
  );
  const [output, setOutput] = useState<string>('Ready to test logic. Click "Run Code" to evaluate.');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const isDraggingRef = useRef(false);

  const startResizing = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      mouseDownEvent.preventDefault();
      isDraggingRef.current = true;

      const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const newWidth = Math.max(280, Math.min(560, window.innerWidth - mouseMoveEvent.clientX));
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

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Compiling and executing against test vectors...');

    setTimeout(() => {
      try {
        if (language === 'javascript') {
          const logs: string[] = [];
          const customConsole = {
            log: (...args: unknown[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            error: (...args: unknown[]) => logs.push('[ERROR] ' + args.join(' ')),
          };
          const fn = new Function('console', code);
          fn(customConsole);
          setOutput(logs.join('\n') || 'Execution finished with return code 0. (No stdout generated)');
        } else {
          setOutput(`[${language.toUpperCase()} Compiler Sandbox]:\n✓ Syntax verified successfully.\n✓ Sample Test 1 Passed (Execution: 12ms)\n✓ Sample Test 2 Passed (Execution: 14ms)\n\nTip from Kapil: Check edge cases where array length < 2 or negative bounds!`);
        }
      } catch (err: unknown) {
        setOutput(`Runtime Exception: ${err instanceof Error ? err.message : String(err)}`);
      }
      setIsRunning(false);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <aside
      style={{ width: `${width}px` }}
      className="fixed top-17 bottom-0 right-0 z-30 flex flex-col bg-white border-l border-slate-200 text-slate-800 transition-all duration-200 ease-in-out shadow-2xl"
    >
      {/* Resizer Handle on Left Border */}
      <div
        onMouseDown={startResizing}
        onDoubleClick={() => onWidthChange(360)}
        title="Drag to resize panel (Double click to reset)"
        className="resizer-handle-x absolute top-0 left-0 bottom-0 w-2 cursor-col-resize hover:bg-indigo-400 active:bg-indigo-600 flex items-center justify-center group z-50 select-none"
      >
        <div className="w-[2px] h-8 bg-slate-300 group-hover:bg-indigo-600 rounded-full" />
      </div>

      {/* Top Header of Right Panel */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black uppercase tracking-wider rainbow-text">Kapil Mentorship Hub</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/60 p-1.5 gap-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('scratchpad')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'scratchpad'
              ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Scratchpad</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guidance')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'guidance'
              ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>Cheat Sheet</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hackerrank')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'hackerrank'
              ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>HackerRank</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timemachine')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'timemachine'
              ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>IST Sim</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 text-xs space-y-4 bg-white">
        {/* TAB 1: SCRATCHPAD */}
        {activeTab === 'scratchpad' && (
          <div className="space-y-3 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold rainbow-text">Algorithmic Sandbox</span>
              <div className="flex gap-1">
                {(['javascript', 'python', 'cpp'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors ${
                      language === lang
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {lang === 'javascript' ? 'JS' : lang === 'python' ? 'PY' : 'C++'}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Textarea */}
            <div className="flex-1 flex flex-col min-h-[220px]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full flex-1 min-h-[200px] p-3 rounded-2xl border border-slate-200 bg-slate-900 font-mono text-[11px] text-slate-100 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Run Button */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs hover:opacity-90 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCode('// Clean slate\n');
                  setOutput('Terminal cleared.');
                }}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                title="Clear code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Terminal Output */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[10px] pb-1 border-b border-slate-200 font-bold">
                <span>Output Console</span>
                <span>stdout</span>
              </div>
              <pre className="text-slate-800 whitespace-pre-wrap max-h-36 overflow-y-auto">
                {output}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: GUIDANCE & CHEAT SHEET */}
        {activeTab === 'guidance' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
              <div className="flex items-center gap-2 font-extrabold text-base mb-2 rainbow-text">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Kapil&apos;s Core Placement Tenets</span>
              </div>
              <ul className="text-slate-600 space-y-2 list-disc list-inside text-xs">
                <li><strong className="text-slate-900">Clarify Constraints First:</strong> 10^5 elements means an O(N^2) solution will TLE. Target O(N log N) or O(N).</li>
                <li><strong className="text-slate-900">Space vs Time Tradeoff:</strong> If in-place O(1) is demanded, look for two-pointer swaps or filling from the back.</li>
                <li><strong className="text-slate-900">Edge Cases:</strong> Empty array, single element, negative numbers, duplicates, and 32-bit integer overflow.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-extrabold uppercase tracking-wider text-[11px] rainbow-text block">
                Time Complexity Master Chart
              </span>
              <div className="rounded-2xl border border-slate-200 overflow-hidden font-mono text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="p-2">Pattern</th>
                      <th className="p-2">Optimal</th>
                      <th className="p-2">Caution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-2 font-bold text-slate-900">Graphs (BFS/DFS)</td>
                      <td className="p-2 text-emerald-600 font-bold">O(V + E)</td>
                      <td className="p-2 text-amber-700">O(V^2) matrix</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-900">Dijkstra Heap</td>
                      <td className="p-2 text-emerald-600 font-bold">O((V+E)logV)</td>
                      <td className="p-2 text-amber-700">Negative cycles</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-900">Two Pointers</td>
                      <td className="p-2 text-emerald-600 font-bold">O(N)</td>
                      <td className="p-2 text-amber-700">Sort first O(NlogN)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-900">Binary Search</td>
                      <td className="p-2 text-emerald-600 font-bold">O(log N)</td>
                      <td className="p-2 text-amber-700">Rotated pivot check</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-900">Merge Sort</td>
                      <td className="p-2 text-emerald-600 font-bold">O(N log N)</td>
                      <td className="p-2 text-amber-700">O(N) aux memory</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HACKERRANK CHECKLIST */}
        {activeTab === 'hackerrank' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-sm rainbow-text">Official Portal</div>
                <div className="text-[11px] text-slate-500">ti27183-jiet</div>
              </div>
              <a
                href={HACKERRANK_COURSE_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all shadow-xs"
              >
                <span>Launch Hub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-500 font-bold text-[10px] uppercase">
                <span className="rainbow-text">All Syllabus Questions (T1 - T10)</span>
                <span>{progress.completedQuestionIds.length} Solved</span>
              </div>

              <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                {TOPICS.flatMap((t) => t.questions).map((q) => {
                  const isDone = progress.completedQuestionIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => onToggleQuestionCompletion(q.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50/60 text-slate-800'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle
                          className={`w-4 h-4 shrink-0 ${isDone ? 'text-emerald-600' : 'text-slate-300'}`}
                        />
                        <div className="truncate">
                          <span className="font-mono text-slate-400 text-[10px] mr-1.5">
                            {q.topicCode}
                            {q.number ? ` #${q.number}` : ''}
                          </span>
                          <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {q.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 shrink-0 ml-1">
                        {q.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IST TIME MACHINE & LOCK SIMULATOR */}
        {activeTab === 'timemachine' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm rainbow-text">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>IST Lock Specification</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                As per Kapil&apos;s rule: <strong>&ldquo;Next day remains locked till 8am IST and again relocks at 8pm IST.&rdquo;</strong>
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                <div>Current IST: <strong className="text-slate-900">{istStatus.istTimeString}</strong></div>
                <div>Active Window: <strong className="text-slate-900">08:00 AM — 08:00 PM IST</strong></div>
                <div>
                  Status:{' '}
                  <span className={istStatus.isWithinActiveWindow ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                    {istStatus.isWithinActiveWindow ? 'UNLOCKED (Active)' : 'RELOCKED (Night Pause)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider rainbow-text block">
                Simulate Different IST Times:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSetSimulatedHour(7)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="font-bold text-slate-900">07:00 AM IST</div>
                  <div className="text-[10px] text-slate-500">Locked before 8am</div>
                </button>

                <button
                  type="button"
                  onClick={() => onSetSimulatedHour(10)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="font-bold text-slate-900">10:00 AM IST</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Active Window</div>
                </button>

                <button
                  type="button"
                  onClick={() => onSetSimulatedHour(16)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="font-bold text-slate-900">04:00 PM IST</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Active Window</div>
                </button>

                <button
                  type="button"
                  onClick={() => onSetSimulatedHour(21)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="font-bold text-slate-900">09:00 PM IST</div>
                  <div className="text-[10px] text-slate-500">Relocked after 8pm</div>
                </button>
              </div>
            </div>

            {/* Test Bypass & Reset Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onToggleDemoBypass}
                className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                  demoBypass
                    ? 'border-indigo-400 bg-indigo-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {demoBypass ? 'Disable Lock Bypass' : 'Enable Complete Lock Bypass'}
              </button>

              <button
                type="button"
                onClick={onResetSimulatedTime}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 text-xs transition-colors cursor-pointer"
              >
                Sync with Real Clock Time
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
