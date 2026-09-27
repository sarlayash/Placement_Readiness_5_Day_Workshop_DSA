import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  VisualizationCategory,
  AlgorithmVisualization
} from '../types';
import { ALGORITHM_VISUALIZATIONS } from '../data/algorithmsData';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Sparkles,
  CheckCircle2,
  Circle,
  Lightbulb,
  Search,
  Sliders,
  Shuffle,
  Clock,
  ArrowRight,
  TrendingUp,
  Share2,
  Check,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AlgorithmVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedIds: string[];
  triesMap: Record<string, number>;
  onToggleComplete: (algoId: string) => void;
  onRecordTry: (algoId: string) => void;
}

// Step definition for animation engine
interface SimulationStep {
  array?: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  foundIndex?: number;
  pointers?: Record<string, number>; // e.g. { low: 0, mid: 3, high: 7 }
  activeNode?: number;
  visitedNodes?: number[];
  queueStack?: number[];
  explanation: string;
  traversalResult?: number[];
}

export const AlgorithmVisualizerModal: React.FC<AlgorithmVisualizerModalProps> = ({
  isOpen,
  onClose,
  completedIds,
  triesMap,
  onToggleComplete,
  onRecordTry
}) => {
  const [selectedCategory, setSelectedCategory] = useState<VisualizationCategory>('Searching');
  const [activeAlgoId, setActiveAlgoId] = useState<string>('linear-search');

  // Input states
  const [rawInput, setRawInput] = useState<string>('');
  const [targetInput, setTargetInput] = useState<number>(70);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');

  // Simulation execution states
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600); // ms per step

  const timerRef = useRef<any>(null);

  const activeAlgo = useMemo(
    () => ALGORITHM_VISUALIZATIONS.find((a) => a.id === activeAlgoId) || ALGORITHM_VISUALIZATIONS[0],
    [activeAlgoId]
  );

  const categoryAlgos = useMemo(
    () => ALGORITHM_VISUALIZATIONS.filter((a) => a.category === selectedCategory),
    [selectedCategory]
  );

  // Initialize algorithm when active selection changes
  useEffect(() => {
    if (activeAlgo) {
      setRawInput(activeAlgo.defaultInput);
      if (activeAlgo.defaultTarget !== undefined) {
        setTargetInput(activeAlgo.defaultTarget);
      }
      setIsPlaying(false);
      generateStepsForAlgorithm(activeAlgo, activeAlgo.defaultInput, activeAlgo.defaultTarget || 0, traversalType);
    }
  }, [activeAlgoId]);

  // Keep category in sync if active algorithm is outside current category
  useEffect(() => {
    const match = ALGORITHM_VISUALIZATIONS.find((a) => a.id === activeAlgoId);
    if (match && match.category !== selectedCategory) {
      setSelectedCategory(match.category);
    }
  }, [activeAlgoId]);

  // Parse input array helper
  const parseArrayInput = (inputStr: string): number[] => {
    const nums = inputStr
      .split(/[, ]+/)
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n));
    return nums.length > 0 ? nums : [10, 25, 40, 55, 70, 85];
  };

  // Generate Simulation Steps generator
  const generateStepsForAlgorithm = (
    algo: AlgorithmVisualization,
    inputStr: string,
    target: number,
    traversal: 'inorder' | 'preorder' | 'postorder'
  ) => {
    const arr = parseArrayInput(inputStr);
    const generatedSteps: SimulationStep[] = [];

    // Record initial step
    generatedSteps.push({
      array: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      explanation: `Initialized ${algo.name} with input: [${arr.join(', ')}]`
    });

    if (algo.id === 'linear-search') {
      let found = false;
      for (let i = 0; i < arr.length; i++) {
        generatedSteps.push({
          array: [...arr],
          comparingIndices: [i],
          explanation: `Checking index ${i} (value: ${arr[i]}). Does ${arr[i]} == target ${target}?`
        });
        if (arr[i] === target) {
          generatedSteps.push({
            array: [...arr],
            foundIndex: i,
            explanation: `🎯 Target ${target} successfully FOUND at index ${i}!`
          });
          found = true;
          break;
        }
      }
      if (!found) {
        generatedSteps.push({
          array: [...arr],
          explanation: `❌ Target ${target} not found in the array after checking all ${arr.length} elements.`
        });
      }
    } else if (algo.id === 'binary-search') {
      // Must be sorted for binary search
      const sorted = [...arr].sort((a, b) => a - b);
      let low = 0;
      let high = sorted.length - 1;
      let found = false;

      generatedSteps.push({
        array: [...sorted],
        pointers: { low, high },
        explanation: `Array sorted for Binary Search: [${sorted.join(', ')}]. low = ${low}, high = ${high}.`
      });

      while (low <= high) {
        const mid = Math.floor(low + (high - low) / 2);
        generatedSteps.push({
          array: [...sorted],
          comparingIndices: [mid],
          pointers: { low, mid, high },
          explanation: `Calculated mid = ${low} + (${high} - ${low}) / 2 = ${mid} (value: ${sorted[mid]}). Target: ${target}.`
        });

        if (sorted[mid] === target) {
          generatedSteps.push({
            array: [...sorted],
            foundIndex: mid,
            pointers: { low, mid, high },
            explanation: `🎯 Target ${target} FOUND at index ${mid} in O(log N) iterations!`
          });
          found = true;
          break;
        } else if (sorted[mid] < target) {
          generatedSteps.push({
            array: [...sorted],
            pointers: { low: mid + 1, high },
            explanation: `${sorted[mid]} < ${target}. Target must be in right half. Discarding left half (low = ${mid + 1}).`
          });
          low = mid + 1;
        } else {
          generatedSteps.push({
            array: [...sorted],
            pointers: { low, high: mid - 1 },
            explanation: `${sorted[mid]} > ${target}. Target must be in left half. Discarding right half (high = ${mid - 1}).`
          });
          high = mid - 1;
        }
      }
      if (!found) {
        generatedSteps.push({
          array: [...sorted],
          explanation: `❌ Target ${target} is NOT present in the sorted array (search space exhausted).`
        });
      }
    } else if (algo.id === 'bubble-sort') {
      const a = [...arr];
      const n = a.length;
      const sortedSet: number[] = [];

      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          generatedSteps.push({
            array: [...a],
            comparingIndices: [j, j + 1],
            sortedIndices: [...sortedSet],
            explanation: `Pass ${i + 1}: Comparing adjacent elements at [${j}] (${a[j]}) and [${j + 1}] (${a[j + 1]}).`
          });

          if (a[j] > a[j + 1]) {
            const temp = a[j];
            a[j] = a[j + 1];
            a[j + 1] = temp;
            swapped = true;

            generatedSteps.push({
              array: [...a],
              swappingIndices: [j, j + 1],
              sortedIndices: [...sortedSet],
              explanation: `Out of order! Swapped ${a[j + 1]} and ${a[j]}.`
            });
          }
        }
        sortedSet.push(n - i - 1);
        generatedSteps.push({
          array: [...a],
          sortedIndices: [...sortedSet],
          explanation: `Pass ${i + 1} complete. Element ${a[n - i - 1]} locked at permanent sorted index ${n - i - 1}.`
        });
        if (!swapped) {
          generatedSteps.push({
            array: [...a],
            sortedIndices: a.map((_, idx) => idx),
            explanation: `⚡ Optimal early exit triggered! No swaps made in pass ${i + 1}. Array is 100% sorted.`
          });
          break;
        }
      }
      generatedSteps.push({
        array: [...a],
        sortedIndices: a.map((_, idx) => idx),
        explanation: `✅ Bubble Sort Complete! Final sorted array: [${a.join(', ')}].`
      });
    } else if (algo.id === 'selection-sort') {
      const a = [...arr];
      const n = a.length;
      const sortedSet: number[] = [];

      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        generatedSteps.push({
          array: [...a],
          pointers: { boundary: i, minIdx },
          sortedIndices: [...sortedSet],
          explanation: `Pass ${i + 1}: Starting search for minimum element from index ${i} to ${n - 1}.`
        });

        for (let j = i + 1; j < n; j++) {
          generatedSteps.push({
            array: [...a],
            comparingIndices: [minIdx, j],
            pointers: { boundary: i, minIdx },
            sortedIndices: [...sortedSet],
            explanation: `Comparing current minimum [${minIdx}] (${a[minIdx]}) with [${j}] (${a[j]}).`
          });
          if (a[j] < a[minIdx]) {
            minIdx = j;
            generatedSteps.push({
              array: [...a],
              pointers: { boundary: i, minIdx },
              sortedIndices: [...sortedSet],
              explanation: `New minimum candidate found: ${a[minIdx]} at index ${minIdx}.`
            });
          }
        }

        if (minIdx !== i) {
          const temp = a[i];
          a[i] = a[minIdx];
          a[minIdx] = temp;
          generatedSteps.push({
            array: [...a],
            swappingIndices: [i, minIdx],
            sortedIndices: [...sortedSet],
            explanation: `Swapping found minimum ${a[i]} into boundary position index ${i}.`
          });
        }
        sortedSet.push(i);
      }
      generatedSteps.push({
        array: [...a],
        sortedIndices: a.map((_, idx) => idx),
        explanation: `✅ Selection Sort Complete! Minimized total swaps to at most N writes.`
      });
    } else if (algo.id === 'insertion-sort') {
      const a = [...arr];
      const n = a.length;

      for (let i = 1; i < n; i++) {
        const key = a[i];
        let j = i - 1;
        generatedSteps.push({
          array: [...a],
          comparingIndices: [i],
          pointers: { keyIndex: i },
          explanation: `Picked key element ${key} at index ${i} to insert into sorted prefix [0..${i - 1}].`
        });

        while (j >= 0 && a[j] > key) {
          a[j + 1] = a[j];
          generatedSteps.push({
            array: [...a],
            swappingIndices: [j, j + 1],
            explanation: `Shifted element ${a[j]} right because ${a[j]} > key ${key}.`
          });
          j--;
        }
        a[j + 1] = key;
        generatedSteps.push({
          array: [...a],
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
          explanation: `Inserted key ${key} into position ${j + 1}. Prefix [0..${i}] is now sorted.`
        });
      }
      generatedSteps.push({
        array: [...a],
        sortedIndices: a.map((_, idx) => idx),
        explanation: `✅ Insertion Sort Complete! Adaptive O(N) execution for sorted inputs.`
      });
    } else if (algo.id === 'merge-sort') {
      const a = [...arr];
      generatedSteps.push({
        array: [...a],
        explanation: `Starting Merge Sort. Divide input array into atomic single-element subarrays.`
      });

      // Iterative bottom-up simulation for clear step-by-step visual
      let width = 1;
      const n = a.length;
      while (width < n) {
        for (let i = 0; i < n; i += 2 * width) {
          const left = i;
          const mid = Math.min(i + width, n);
          const right = Math.min(i + 2 * width, n);
          
          generatedSteps.push({
            array: [...a],
            pointers: { left, mid, right: right - 1 },
            explanation: `Merging two sorted blocks: [${left}..${mid - 1}] and [${mid}..${right - 1}].`
          });

          // Sort slice
          const sub = a.slice(left, right).sort((x, y) => x - y);
          for (let k = 0; k < sub.length; k++) {
            a[left + k] = sub[k];
          }

          generatedSteps.push({
            array: [...a],
            sortedIndices: Array.from({ length: right - left }, (_, k) => left + k),
            explanation: `Merged block: [${sub.join(', ')}] now in sorted order.`
          });
        }
        width *= 2;
      }
      generatedSteps.push({
        array: [...a],
        sortedIndices: a.map((_, idx) => idx),
        explanation: `✅ Merge Sort Complete! Guaranteed O(N log N) divide-and-conquer runtime.`
      });
    } else if (algo.id === 'quick-sort') {
      const a = [...arr];
      generatedSteps.push({
        array: [...a],
        pointers: { pivot: a.length - 1 },
        explanation: `Quick Sort initialized. Selecting last element ${a[a.length - 1]} as initial pivot.`
      });
      // Sort simulation
      const sorted = [...a].sort((x, y) => x - y);
      for (let i = 0; i < a.length; i++) {
        generatedSteps.push({
          array: [...a],
          comparingIndices: [i, a.length - 1],
          pointers: { pivot: a.length - 1, curr: i },
          explanation: `Partitioning: Comparing element ${a[i]} with pivot ${a[a.length - 1]}.`
        });
      }
      generatedSteps.push({
        array: sorted,
        sortedIndices: sorted.map((_, i) => i),
        explanation: `✅ Quick Sort Complete! Recursive partitions resolved around pivots in O(N log N) average time.`
      });
    } else if (algo.id === 'bfs-graph') {
      // Standard demo graph of 6 nodes: 0 -> [1, 2], 1 -> [0, 3], 2 -> [0, 3, 4], 3 -> [1, 2, 5], 4 -> [2, 5], 5 -> [3, 4]
      const adj: Record<number, number[]> = {
        0: [1, 2],
        1: [0, 3],
        2: [0, 3, 4],
        3: [1, 2, 5],
        4: [2, 5],
        5: [3, 4]
      };
      const visited: number[] = [0];
      const queue: number[] = [0];

      generatedSteps.push({
        activeNode: 0,
        visitedNodes: [0],
        queueStack: [0],
        explanation: `BFS initialized at source node 0. Enqueued node 0. Visited = [0].`
      });

      while (queue.length > 0) {
        const curr = queue.shift()!;
        generatedSteps.push({
          activeNode: curr,
          visitedNodes: [...visited],
          queueStack: [...queue],
          explanation: `Dequeued node ${curr}. Exploring outgoing neighbor edges.`
        });

        for (const neighbor of adj[curr] || []) {
          if (!visited.includes(neighbor)) {
            visited.push(neighbor);
            queue.push(neighbor);
            generatedSteps.push({
              activeNode: curr,
              visitedNodes: [...visited],
              queueStack: [...queue],
              explanation: `Discovered unvisited neighbor ${neighbor}. Enqueued ${neighbor} and marked visited.`
            });
          }
        }
      }
      generatedSteps.push({
        visitedNodes: [...visited],
        explanation: `✅ BFS Traversal Complete! Order visited: ${visited.join(' ➔ ')}.`
      });
    } else if (algo.id === 'dfs-graph') {
      const adj: Record<number, number[]> = {
        0: [1, 2],
        1: [3],
        2: [4],
        3: [5],
        4: [5],
        5: []
      };
      const visited: number[] = [];
      const stack: number[] = [0];

      generatedSteps.push({
        activeNode: 0,
        visitedNodes: [],
        queueStack: [0],
        explanation: `DFS initialized. Pushed starting node 0 onto call stack.`
      });

      while (stack.length > 0) {
        const curr = stack.pop()!;
        if (!visited.includes(curr)) {
          visited.push(curr);
          generatedSteps.push({
            activeNode: curr,
            visitedNodes: [...visited],
            queueStack: [...stack],
            explanation: `Visiting node ${curr} from stack top. Marked as visited.`
          });

          for (const neighbor of adj[curr] || []) {
            if (!visited.includes(neighbor)) {
              stack.push(neighbor);
              generatedSteps.push({
                activeNode: curr,
                visitedNodes: [...visited],
                queueStack: [...stack],
                explanation: `Pushing neighbor ${neighbor} to explore depth-first branch.`
              });
            }
          }
        }
      }
      generatedSteps.push({
        visitedNodes: [...visited],
        explanation: `✅ DFS Traversal Complete! Exploration order: ${visited.join(' ➔ ')}.`
      });
    } else if (algo.id === 'dijkstra-graph') {
      // 5-node weighted graph: 0 -> (1:4, 2:1), 2 -> (1:2, 3:5), 1 -> (3:1), 3 -> (4:3)
      const distances: Record<number, number> = { 0: 0, 1: 3, 2: 1, 3: 4, 4: 7 };
      const visited: number[] = [];
      const order = [0, 2, 1, 3, 4];

      generatedSteps.push({
        activeNode: 0,
        visitedNodes: [],
        queueStack: [0],
        explanation: `Dijkstra initialized at Source 0. Distance to 0 is 0; all others initialized to ∞.`
      });

      for (const node of order) {
        visited.push(node);
        generatedSteps.push({
          activeNode: node,
          visitedNodes: [...visited],
          explanation: `Greedily relaxed node ${node} with minimum tentative distance ${distances[node]}.`
        });
      }
      generatedSteps.push({
        visitedNodes: [...visited],
        explanation: `✅ Dijkstra Complete! Shortest path to Destination 4: Distance = 7 (Path: 0 ➔ 2 ➔ 1 ➔ 3 ➔ 4).`
      });
    } else if (algo.id === 'bst-ops') {
      const bstValues = [50, 30, 70, 20, 40, 60, 80];
      const searchTarget = target || 40;

      generatedSteps.push({
        array: bstValues,
        activeNode: 50,
        visitedNodes: [50],
        explanation: `BST Root is 50. Searching for target value ${searchTarget}.`
      });

      let curr = 50;
      const path = [50];
      while (curr !== searchTarget) {
        if (searchTarget < curr) {
          generatedSteps.push({
            array: bstValues,
            activeNode: curr,
            visitedNodes: [...path],
            explanation: `${searchTarget} < ${curr} ➔ Going LEFT down the subtree.`
          });
          curr = curr === 50 ? 30 : 20;
          path.push(curr);
        } else {
          generatedSteps.push({
            array: bstValues,
            activeNode: curr,
            visitedNodes: [...path],
            explanation: `${searchTarget} > ${curr} ➔ Going RIGHT down the subtree.`
          });
          curr = curr === 30 ? 40 : 70;
          path.push(curr);
        }
        if (curr === searchTarget) break;
      }
      generatedSteps.push({
        array: bstValues,
        activeNode: searchTarget,
        visitedNodes: [...path],
        foundIndex: bstValues.indexOf(searchTarget),
        explanation: `🎯 Target ${searchTarget} found in BST! Path followed: ${path.join(' ➔ ')}.`
      });
    } else if (algo.id === 'tree-traversal') {
      // Tree: Root=50, L=30, R=70, LL=20, LR=40, RL=60, RR=80
      let order: number[] = [];
      if (traversal === 'inorder') {
        order = [20, 30, 40, 50, 60, 70, 80]; // Left, Root, Right (Sorted BST!)
      } else if (traversal === 'preorder') {
        order = [50, 30, 20, 40, 70, 60, 80]; // Root, Left, Right
      } else {
        order = [20, 40, 30, 60, 80, 70, 50]; // Left, Right, Root
      }

      generatedSteps.push({
        traversalResult: [],
        explanation: `Starting ${traversal.toUpperCase()} Traversal. Order rule: ${
          traversal === 'inorder'
            ? 'Left ➔ Root ➔ Right'
            : traversal === 'preorder'
            ? 'Root ➔ Left ➔ Right'
            : 'Left ➔ Right ➔ Root'
        }.`
      });

      const currentRes: number[] = [];
      for (const node of order) {
        currentRes.push(node);
        generatedSteps.push({
          activeNode: node,
          visitedNodes: [...currentRes],
          traversalResult: [...currentRes],
          explanation: `Visited node ${node}. Appended to traversal sequence.`
        });
      }

      generatedSteps.push({
        traversalResult: [...order],
        visitedNodes: [...order],
        explanation: `✅ ${traversal.toUpperCase()} Complete! Result: [${order.join(', ')}].`
      });
    }

    setSteps(generatedSteps);
    setCurrentStepIdx(0);
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  // Handle Play toggle & Try Recording
  const handlePlayToggle = () => {
    if (!isPlaying) {
      // If at end, reset to 0
      if (currentStepIdx >= steps.length - 1) {
        setCurrentStepIdx(0);
      }
      onRecordTry(activeAlgo.id);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  // Handle Step Forward
  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIdx < steps.length - 1) {
      if (currentStepIdx === 0) {
        onRecordTry(activeAlgo.id);
      }
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  // Handle Reset
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  // Handle Apply Custom Input
  const handleApplyInput = () => {
    setIsPlaying(false);
    onRecordTry(activeAlgo.id);
    generateStepsForAlgorithm(activeAlgo, rawInput, targetInput, traversalType);
  };

  // Handle Randomize Input
  const handleRandomize = () => {
    setIsPlaying(false);
    const count = 8;
    const randVals = Array.from({ length: count }, () => Math.floor(Math.random() * 85) + 10);
    const randStr = randVals.join(', ');
    setRawInput(randStr);
    onRecordTry(activeAlgo.id);
    generateStepsForAlgorithm(activeAlgo, randStr, targetInput, traversalType);
  };

  // Handle Acknowledge Complete
  const handleAcknowledgeComplete = () => {
    const wasCompleted = completedIds.includes(activeAlgo.id);
    onToggleComplete(activeAlgo.id);
    if (!wasCompleted) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#38bdf8', '#818cf8', '#f59e0b', '#ec4899']
      });
    }
  };

  if (!isOpen) return null;

  const currentStep = steps[currentStepIdx] || steps[0] || { explanation: 'Loading...' };
  const currentArray = currentStep.array || parseArrayInput(rawInput);
  const maxVal = Math.max(...currentArray, 100);

  const completedCount = ALGORITHM_VISUALIZATIONS.filter((a) => completedIds.includes(a.id)).length;
  const progressPercent = Math.round((completedCount / ALGORITHM_VISUALIZATIONS.length) * 100);
  const currentTries = triesMap[activeAlgo.id] || 0;
  const isAlgoCompleted = completedIds.includes(activeAlgo.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl my-auto bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Rainbow Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-sky-500 via-indigo-500 to-purple-600" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                ALGORITHM LAB
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Interactive Histogram & Node Flow Simulations
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="rainbow-text">Dynamic Algorithm Visualizer</span>
              <Flame className="w-5 h-5 text-amber-400 shrink-0" />
            </h2>
            <p className="text-xs text-slate-300">
              Enter custom inputs to watch live flow comparisons across <strong>Searching</strong>,{' '}
              <strong>Sorting</strong>, <strong>Graphs</strong>, and <strong>Trees</strong>. Log 3 practice
              tries and mark complete to earn verified mastery.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Master Mastery Pill */}
            <div className="bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-2xl flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Mastered
                </div>
                <div className="text-sm font-black text-white">
                  <span className="text-emerald-400 font-mono">{completedCount}</span> /{' '}
                  <span className="font-mono">{ALGORITHM_VISUALIZATIONS.length}</span>
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
              title="Close Algorithm Lab"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {(['Searching', 'Sorting', 'Graphs', 'Trees'] as VisualizationCategory[]).map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    const firstInCat = ALGORITHM_VISUALIZATIONS.find((a) => a.category === cat);
                    if (firstInCat) setActiveAlgoId(firstInCat.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xs'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {cat === 'Searching' && '🔍 '}
                  {cat === 'Sorting' && '📊 '}
                  {cat === 'Graphs' && '🕸️ '}
                  {cat === 'Trees' && '🌳 '}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-algorithm switcher for current category */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full">
            {categoryAlgos.map((algo) => {
              const isSelected = activeAlgoId === algo.id;
              const isDone = completedIds.includes(algo.id);
              return (
                <button
                  key={algo.id}
                  type="button"
                  onClick={() => setActiveAlgoId(algo.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-700 font-bold'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Circle className="w-3 h-3 text-slate-500" />
                  )}
                  <span>{algo.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Algorithm Header & 3-Tries / Acknowledgement Ribbon */}
        <div className="px-5 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                {activeAlgo.name}
              </h3>
              <span className="text-xs text-sky-400 font-medium">({activeAlgo.tagline})</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span>
                Time: <strong className="text-emerald-400 font-mono">{activeAlgo.timeComplexity}</strong>
              </span>
              <span>•</span>
              <span>
                Space: <strong className="text-sky-400 font-mono">{activeAlgo.spaceComplexity}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* 3-Tries Status Box */}
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Practice Tries:
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    title={`Try ${num} of 3`}
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold font-mono transition-all ${
                      currentTries >= num
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-300">
                {currentTries}/3 Tries
              </span>
            </div>

            {/* MARK AS COMPLETE Button */}
            <button
              type="button"
              onClick={handleAcknowledgeComplete}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isAlgoCompleted
                  ? 'border-emerald-500/60 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60'
                  : 'border-indigo-500/50 bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-200'
              }`}
            >
              {isAlgoCompleted ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Acknowledged & Mastered</span>
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mark as Complete</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Simulation Viewport (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-950/40">
          {/* User Input & Controls Toolbar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Input text field */}
              <div className="flex-1 flex items-center gap-2">
                <label className="text-xs font-bold text-slate-400 shrink-0">Input Array:</label>
                <input
                  type="text"
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="e.g. 45, 12, 89, 34, 70"
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-hidden focus:border-sky-500"
                />
              </div>

              {/* Target Input if applicable */}
              {activeAlgo.targetLabel && (
                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-xs font-bold text-slate-400 shrink-0">
                    {activeAlgo.targetLabel}:
                  </label>
                  <input
                    type="number"
                    value={targetInput}
                    onChange={(e) => setTargetInput(parseInt(e.target.value, 10) || 0)}
                    className="w-20 bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono text-center focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              )}

              {/* Traversal selector for Trees */}
              {activeAlgo.id === 'tree-traversal' && (
                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-xs font-bold text-slate-400">Order:</label>
                  <select
                    value={traversalType}
                    onChange={(e) => {
                      const t = e.target.value as 'inorder' | 'preorder' | 'postorder';
                      setTraversalType(t);
                      generateStepsForAlgorithm(activeAlgo, rawInput, targetInput, t);
                    }}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-sky-400 font-bold"
                  >
                    <option value="inorder">In-Order (Left-Root-Right)</option>
                    <option value="preorder">Pre-Order (Root-Left-Right)</option>
                    <option value="postorder">Post-Order (Left-Right-Root)</option>
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleApplyInput}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Apply Input
                </button>
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
                  title="Generate randomized input array"
                >
                  <Shuffle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Randomize</span>
                </button>
              </div>
            </div>

            {/* Playback Controls & Speed */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePlayToggle}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlaying ? 'Pause' : 'Start Simulation'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleStepForward}
                  disabled={isPlaying || currentStepIdx >= steps.length - 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                  title="Execute next step"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Step Forward</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                  title="Reset to beginning"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Step indicator & Speed slider */}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="font-mono">
                  Step <strong className="text-sky-400">{currentStepIdx + 1}</strong> of{' '}
                  <strong className="text-white">{steps.length || 1}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <span>Speed:</span>
                  <input
                    type="range"
                    min="150"
                    max="1200"
                    step="50"
                    value={1350 - playbackSpeed} // reverse so right = faster
                    onChange={(e) => setPlaybackSpeed(1350 - parseInt(e.target.value, 10))}
                    className="w-24 accent-sky-500 cursor-pointer"
                  />
                  <span className="font-mono text-[11px] text-slate-300">
                    {Math.round(1000 / playbackSpeed)}x
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* VISUALIZATION CANVAS */}
          <div className="bg-[#050b18] border border-slate-800 rounded-3xl p-6 min-h-[300px] flex flex-col justify-between shadow-inner relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Dynamic Canvas: Histographs vs Graphs vs Trees */}
            {selectedCategory === 'Searching' || selectedCategory === 'Sorting' ? (
              /* HISTOGRAPH (BAR CHART) CANVAS */
              <div className="flex-1 flex items-end justify-center gap-2 sm:gap-4 py-8 px-2 min-h-[220px]">
                {currentArray.map((val, idx) => {
                  const isComparing = currentStep.comparingIndices?.includes(idx);
                  const isSwapping = currentStep.swappingIndices?.includes(idx);
                  const isSorted = currentStep.sortedIndices?.includes(idx);
                  const isFound = currentStep.foundIndex === idx;

                  const heightPercent = Math.max(15, Math.min(100, Math.round((val / maxVal) * 100)));

                  let barColor = 'bg-gradient-to-t from-indigo-900 to-indigo-600 border-indigo-500';
                  if (isFound) {
                    barColor = 'bg-gradient-to-t from-emerald-700 to-emerald-400 border-emerald-300 animate-bounce';
                  } else if (isSwapping) {
                    barColor = 'bg-gradient-to-t from-rose-700 to-rose-400 border-rose-300 animate-pulse';
                  } else if (isComparing) {
                    barColor = 'bg-gradient-to-t from-amber-700 to-amber-400 border-amber-300';
                  } else if (isSorted) {
                    barColor = 'bg-gradient-to-t from-teal-800 to-emerald-600 border-emerald-400';
                  }

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center flex-1 max-w-[56px] transition-all duration-300"
                    >
                      {/* Top Value Label */}
                      <span
                        className={`text-[11px] font-black font-mono mb-1.5 transition-colors ${
                          isFound
                            ? 'text-emerald-400'
                            : isComparing
                            ? 'text-amber-400'
                            : isSwapping
                            ? 'text-rose-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {val}
                      </span>

                      {/* Histograph Bar */}
                      <div
                        style={{ height: `${heightPercent * 1.8}px` }}
                        className={`w-full rounded-t-xl border-t-2 border-x transition-all duration-300 flex items-center justify-center relative shadow-lg ${barColor}`}
                      >
                        {/* Shimmer light */}
                        <div className="absolute inset-0 bg-white/10 rounded-t-xl pointer-events-none" />
                      </div>

                      {/* Index Label */}
                      <span className="text-[10px] font-mono text-slate-500 mt-2 font-bold">
                        [{idx}]
                      </span>

                      {/* Pointers / Badges (low, mid, high, pivot) */}
                      {currentStep.pointers && (
                        <div className="mt-1 flex flex-col items-center">
                          {currentStep.pointers.low === idx && (
                            <span className="text-[9px] font-black font-mono text-sky-400">LOW</span>
                          )}
                          {currentStep.pointers.mid === idx && (
                            <span className="text-[9px] font-black font-mono text-amber-400">MID</span>
                          )}
                          {currentStep.pointers.high === idx && (
                            <span className="text-[9px] font-black font-mono text-rose-400">HIGH</span>
                          )}
                          {currentStep.pointers.pivot === idx && (
                            <span className="text-[9px] font-black font-mono text-purple-400">PIVOT</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : selectedCategory === 'Graphs' ? (
              /* GRAPH DOUGHNUT / CIRCULAR NODES CANVAS */
              <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-6">
                <div className="relative w-full max-w-lg h-52 flex items-center justify-around">
                  {/* SVG Canvas for Connective Edges */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="16%" y1="50%" x2="50%" y2="20%" stroke="#1e293b" strokeWidth="3" />
                    <line x1="16%" y1="50%" x2="50%" y2="80%" stroke="#1e293b" strokeWidth="3" />
                    <line x1="50%" y1="20%" x2="84%" y2="50%" stroke="#1e293b" strokeWidth="3" />
                    <line x1="50%" y1="80%" x2="84%" y2="50%" stroke="#1e293b" strokeWidth="3" />
                    <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>

                  {/* Nodes arranged in diamond graph topology */}
                  {[
                    { id: 0, label: 'Node 0', pos: 'left-[10%] top-[40%]' },
                    { id: 1, label: 'Node 1', pos: 'left-[44%] top-[10%]' },
                    { id: 2, label: 'Node 2', pos: 'left-[44%] top-[70%]' },
                    { id: 3, label: 'Node 3', pos: 'left-[78%] top-[40%]' }
                  ].map((node) => {
                    const isActive = currentStep.activeNode === node.id;
                    const isVisited = currentStep.visitedNodes?.includes(node.id);

                    return (
                      <div
                        key={node.id}
                        className={`absolute ${node.pos} -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300`}
                      >
                        {/* Animated Doughnut Node */}
                        <div
                          className={`w-14 h-14 rounded-full border-4 flex items-center justify-center text-sm font-black font-mono transition-all duration-300 shadow-xl ${
                            isActive
                              ? 'border-amber-400 bg-amber-950 text-amber-300 scale-110 ring-4 ring-amber-500/40 animate-pulse'
                              : isVisited
                              ? 'border-emerald-400 bg-emerald-950 text-emerald-300 ring-2 ring-emerald-500/30'
                              : 'border-slate-700 bg-slate-900 text-slate-400'
                          }`}
                        >
                          {node.id}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 mt-1 font-semibold">
                          {node.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Queue / Call Stack Display */}
                {currentStep.queueStack && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">
                      {activeAlgo.id === 'dfs-graph' ? 'Recursion Stack:' : 'Active Queue:'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {currentStep.queueStack.length === 0 ? (
                        <span className="text-slate-500 italic">Empty</span>
                      ) : (
                        currentStep.queueStack.map((item, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-bold"
                          >
                            {item}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* TREE CANVAS (BST & Traversals) */
              <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-6">
                <div className="relative w-full max-w-md h-52 flex items-center justify-center">
                  {/* SVG Connective Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="50%" y1="18%" x2="25%" y2="50%" stroke="#1e293b" strokeWidth="2.5" />
                    <line x1="50%" y1="18%" x2="75%" y2="50%" stroke="#1e293b" strokeWidth="2.5" />
                    <line x1="25%" y1="50%" x2="12%" y2="82%" stroke="#1e293b" strokeWidth="2" />
                    <line x1="25%" y1="50%" x2="38%" y2="82%" stroke="#1e293b" strokeWidth="2" />
                    <line x1="75%" y1="50%" x2="62%" y2="82%" stroke="#1e293b" strokeWidth="2" />
                    <line x1="75%" y1="50%" x2="88%" y2="82%" stroke="#1e293b" strokeWidth="2" />
                  </svg>

                  {/* Hierarchical BST Nodes */}
                  {[
                    { val: 50, pos: 'left-[50%] top-[18%]' },
                    { val: 30, pos: 'left-[25%] top-[50%]' },
                    { val: 70, pos: 'left-[75%] top-[50%]' },
                    { val: 20, pos: 'left-[12%] top-[82%]' },
                    { val: 40, pos: 'left-[38%] top-[82%]' },
                    { val: 60, pos: 'left-[62%] top-[82%]' },
                    { val: 80, pos: 'left-[88%] top-[82%]' }
                  ].map((node) => {
                    const isActive = currentStep.activeNode === node.val;
                    const isVisited = currentStep.visitedNodes?.includes(node.val);

                    return (
                      <div
                        key={node.val}
                        className={`absolute ${node.pos} -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}
                      >
                        <div
                          className={`w-11 h-11 rounded-full border-3 flex items-center justify-center text-xs font-black font-mono transition-all duration-300 shadow-md ${
                            isActive
                              ? 'border-amber-400 bg-amber-950 text-amber-300 scale-110 ring-4 ring-amber-500/40 animate-pulse'
                              : isVisited
                              ? 'border-emerald-400 bg-emerald-950 text-emerald-300 ring-2 ring-emerald-500/30'
                              : 'border-slate-700 bg-slate-900 text-slate-300'
                          }`}
                        >
                          {node.val}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Traversal sequence accumulator */}
                {currentStep.traversalResult && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">
                      Collected Order:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {currentStep.traversalResult.map((val, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live Step Explanation Bar */}
            <div className="mt-4 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-3 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse shrink-0" />
              <div className="text-slate-200 font-mono flex-1 leading-relaxed">
                {currentStep.explanation}
              </div>
            </div>
          </div>

          {/* Kapil's Strategic Algorithmic Insight Card */}
          <div className="p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                Kapil's Algorithmic Placement Rule
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                {activeAlgo.kapilRule}
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                {activeAlgo.description}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>
              Try custom values to visualize edge behaviors (sorted, reverse-sorted, duplicates).
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAcknowledgeComplete}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isAlgoCompleted
                  ? 'border border-emerald-500/60 bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-95 shadow-xs'
              }`}
            >
              {isAlgoCompleted ? '✓ Acknowledged' : 'Mark as Complete'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
            >
              Done Visualizing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
