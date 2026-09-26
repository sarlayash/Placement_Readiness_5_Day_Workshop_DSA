import { WheelSlice, SpinningWheelMCQ } from '../types';

export const WHEEL_SLICES: WheelSlice[] = [
  {
    id: 'slice-standard',
    label: '+4 / -1 Mark',
    bonus: 4,
    penalty: 1,
    color: '#3b82f6',
    tier: 'Standard Placement Tier (TCS / Infosys / Wipro)',
  },
  {
    id: 'slice-product',
    label: '+5 / -1.5 Marks',
    bonus: 5,
    penalty: 1.5,
    color: '#8b5cf6',
    tier: 'Product Firm Tier (Amazon / Flipkart)',
  },
  {
    id: 'slice-faang',
    label: '+6 / -2 Marks',
    bonus: 6,
    penalty: 2,
    color: '#ec4899',
    tier: 'Tier-1 FAANG (Google / Microsoft / Uber)',
  },
  {
    id: 'slice-jackpot',
    label: '★ +10 / -3 JACKPOT',
    bonus: 10,
    penalty: 3,
    color: '#f59e0b',
    tier: 'High Roller Mega Jackpot Tier',
  },
  {
    id: 'slice-safe',
    label: '+3 / -0.5 Mark',
    bonus: 3,
    penalty: 0.5,
    color: '#10b981',
    tier: 'Safe Speedrun Tier (Low Risk)',
  },
  {
    id: 'slice-wizard',
    label: '+8 / -2.5 Marks',
    bonus: 8,
    penalty: 2.5,
    color: '#06b6d4',
    tier: 'Algorithmic Wizard Tier',
  },
  {
    id: 'slice-golden',
    label: '+5 / -1 Mark',
    bonus: 5,
    penalty: 1,
    color: '#eab308',
    tier: 'Golden Advantage Tier',
  },
  {
    id: 'slice-titan',
    label: '+7 / -2 Marks',
    bonus: 7,
    penalty: 2,
    color: '#ef4444',
    tier: 'Placement Titan Honors Tier',
  },
];

export const SPINNING_WHEEL_MCQS: SpinningWheelMCQ[] = [
  {
    id: 'sw-1',
    topic: 'T1: Graphs • BFS Properties',
    difficulty: 'Easy',
    question:
      'In an unweighted undirected graph with V vertices and E edges, why does Breadth-First Search (BFS) guarantee finding the shortest path from a source vertex S to any other vertex?',
    options: [
      'Because it explores the deepest node first before backtracking',
      'Because edges are explored level by level in non-decreasing order of hop distance from the source',
      'Because it calculates edge relaxation similar to Bellman-Ford',
      'Because it sorts the adjacency matrix before inserting into a priority queue',
    ],
    correctAnswer: 1,
    explanation:
      'BFS explores the graph in concentric frontier rings (level-by-level). Every vertex at distance k is discovered before any vertex at distance k+1 is processed, ensuring the first discovery yields the minimum number of edge hops.',
  },
  {
    id: 'sw-2',
    topic: 'T2: In-Place Arrays & Space Complexity',
    difficulty: 'Easy',
    question:
      'To rotate an array of size N right by K positions in-place with strictly O(1) auxiliary memory, what is the canonical three-step reversal sequence?',
    options: [
      'Reverse first K elements, reverse remaining N-K elements, then reverse entire array',
      'Reverse entire array, reverse first K elements, then reverse remaining N-K elements',
      'Shift every element right by 1 in a nested loop running K times',
      'Allocate a temporary array of size K and copy elements over',
    ],
    correctAnswer: 1,
    explanation:
      'Reversing the entire array brings the last K elements to the front (in reversed order). Reversing the first K restores their relative order, and reversing the remaining N-K restores their original relative order — all done in O(N) time and O(1) space.',
  },
  {
    id: 'sw-3',
    topic: 'T6: Two-Pointer Approach',
    difficulty: 'Medium',
    question:
      'Given a sorted array of N integers, we want to find if two elements sum up to a target T. If the current sum arr[left] + arr[right] > T, how should the two pointers adjust?',
    options: [
      'Increment left because greater numbers might be further right',
      'Decrement right because all elements to the right will only produce even larger sums',
      'Reset left to 0 and decrement right by 2',
      'Sort the array again in descending order',
    ],
    correctAnswer: 1,
    explanation:
      'Since the array is sorted, decreasing right strictly decreases the sum. Any element paired with arr[right] at or to the right of the current position will exceed the target, allowing us to safely prune the right element in O(1).',
  },
  {
    id: 'sw-4',
    topic: 'T8: Divide & Conquer • Master Theorem',
    difficulty: 'Medium',
    question:
      'A divide-and-conquer sorting algorithm splits an input of size N into 2 equal halves, sorts each half recursively, and merges them in linear O(N) time: T(N) = 2T(N/2) + O(N). What is its closed-form asymptotic time complexity?',
    options: [
      'O(N)',
      'O(N log N)',
      'O(N^2)',
      'O(log N)',
    ],
    correctAnswer: 1,
    explanation:
      'By the Master Theorem (Case 2), where a = 2, b = 2, and f(N) = O(N^1): since log_b(a) = log_2(2) = 1, we have T(N) = Theta(N^1 * log N) = O(N log N). This is the hallmark of MergeSort.',
  },
  {
    id: 'sw-5',
    topic: 'T4: Number Theory • Sieve of Eratosthenes',
    difficulty: 'Medium',
    question:
      'What is the precise time complexity of the classical Sieve of Eratosthenes algorithm to generate all prime numbers up to N?',
    options: [
      'O(N^2)',
      'O(N log N)',
      'O(N log log N)',
      'O(sqrt(N))',
    ],
    correctAnswer: 2,
    explanation:
      'The inner loop runs N/p times for each prime p <= N. The sum over all primes sum(1/p) is known from Mertens\' second theorem to grow as log(log N). Thus, the total operational count is O(N sum_{p} 1/p) = O(N log log N).',
  },
  {
    id: 'sw-6',
    topic: 'T4: Mathematical Algorithms • Binary Exponentiation',
    difficulty: 'Easy',
    question:
      'How does Binary Exponentiation (Fast Power) compute (A^B) % M in O(log B) steps instead of O(B) multiplications?',
    options: [
      'By iteratively computing A * A * A up to B times',
      'By repeatedly squaring the base A -> A^2 and halving the exponent B when even',
      'By taking the natural logarithm using floating point math',
      'By looking up precomputed values in an array of size B',
    ],
    correctAnswer: 1,
    explanation:
      'When B is even, A^B = (A^2)^(B/2). When B is odd, A^B = A * A^(B-1). This reduces the exponent by half at each step, taking at most 2 * floor(log2 B) multiplications.',
  },
  {
    id: 'sw-7',
    topic: 'T6: Linked List Invariants • Cycle Detection',
    difficulty: 'Medium',
    question:
      'In Floyd\'s Cycle-Finding Algorithm (Tortoise and Hare), if the slow pointer moves 1 step and the fast pointer moves 2 steps, which statement is true about cycle detection?',
    options: [
      'They will never meet if the cycle length is an odd number',
      'The relative distance between them inside the cycle decreases by 1 on each step, guaranteeing a collision in O(Cycle Length)',
      'Fast pointer must move 3 steps to detect cycles in directed graphs',
      'It requires a hash set of memory addresses to record visited nodes',
    ],
    correctAnswer: 1,
    explanation:
      'Once both pointers are inside the loop of length L, the relative distance between them changes by (2 - 1) = 1 step per iteration. In modular arithmetic modulo L, the gap between them strictly closes by 1 until gap = 0, proving meeting within L steps.',
  },
  {
    id: 'sw-8',
    topic: 'T3: Recursion Analysis • Fibonacci Call Tree',
    difficulty: 'Hard',
    question:
      'Without memoization or dynamic programming, why does the naive recursive function fib(N) = fib(N-1) + fib(N-2) exhibit exponential O(2^N) or O(1.618^N) time complexity?',
    options: [
      'Because each call allocates an array of size N on the stack',
      'Because the recursion tree branches into 2 child subproblems at almost every level of depth N, creating redundant re-evaluations',
      'Because calculating base cases fib(0) and fib(1) takes linear time',
      'Because the call stack limit is exceeded in modern compilers',
    ],
    correctAnswer: 1,
    explanation:
      'The number of leaf nodes in the recursion tree equals fib(N+1), which scales as Phi^N ((1 + sqrt(5))/2)^N approx 1.618^N. Since identical subtrees (e.g. fib(3)) are recalculated millions of times without memoization, the total operations scale exponentially.',
  },
  {
    id: 'sw-9',
    topic: 'T2 & T6: Data Structures • Monotonic Deque',
    difficulty: 'Hard',
    question:
      'When finding the sliding window maximum of size K across an array of size N using a Monotonic Decreasing Deque, what is the total amortized time complexity across all N elements?',
    options: [
      'O(N * K)',
      'O(N log K)',
      'O(N)',
      'O(K log N)',
    ],
    correctAnswer: 2,
    explanation:
      'Each element index from 0 to N-1 is pushed into the deque at most once and popped from the back (or front when out of window) at most once. Hence, across the entire array, at most 2N operations occur, resulting in strictly O(N) linear time, amortized O(1) per element.',
  },
  {
    id: 'sw-10',
    topic: 'T1: Graphs • Cycle Detection in Directed Graphs',
    difficulty: 'Hard',
    question:
      'In a Directed Graph, why is a simple boolean visited[] array insufficient for cycle detection, and why are 3 states (White/Unvisited, Gray/Visiting, Black/Processed) required?',
    options: [
      'Because directed edges can be bidirectional in edge lists',
      'Because a node visited along an independent branch (cross edge) does not constitute a cycle; a cycle only exists if an edge points to an ancestor currently on the active recursion stack (back edge / Gray state)',
      'Because 3 states are required to compute topological sort via Kahn algorithm',
      'Because directed graphs can contain negative weight loops',
    ],
    correctAnswer: 1,
    explanation:
      'In a DAG, two different paths can converge on the same node (a cross or forward edge), which is visited but NOT part of a cycle. A cycle occurs strictly when a directed edge targets a vertex currently in progress on the current DFS recursion stack (the Gray state), which is a true back edge.',
  },
];
