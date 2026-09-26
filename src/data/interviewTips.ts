export interface InterviewTipItem {
  id: string;
  category: 'Strategy' | 'Technical' | 'Red Flags' | 'Behavioral';
  title: string;
  subtitle: string;
  keyPoints: string[];
  kapilQuote: string;
}

export const KAPIL_INTERVIEW_TIPS: InterviewTipItem[] = [
  {
    id: 'tip-1',
    category: 'Strategy',
    title: 'Kapil’s 4-Step Problem Decomposition Framework',
    subtitle: 'What interviewers at Google, Microsoft, and Amazon grade in the first 15 minutes',
    keyPoints: [
      'Step 1: Clarify & Inquire (2-3 mins) — Confirm constraints (e.g. Can N be negative? Are values distinct? What is max N?). Clarifying shows senior-level engineering maturity.',
      'Step 2: Propose the Brute Force (2-3 mins) — State the naive solution explicitly (e.g. O(N^2) or O(2^N)). Calculate its time and space bounds to demonstrate why it will TLE.',
      'Step 3: State the Optimal Invariant (4-5 mins) — Explain your mathematical intuition (e.g. Two-Pointer squeeze, Binary Search cut, Legendre formula, BFS level queue). Wait for interviewer nod before typing!',
      'Step 4: Clean Implementation & Dry Run (15-20 mins) — Write clean variable names. Never say "I am done" without dry-running on an edge case with your own hands.',
    ],
    kapilQuote: 'Do not rush into writing code in the first 5 minutes. The interview is a collaborative design session, not a speed typing competition.',
  },
  {
    id: 'tip-2',
    category: 'Technical',
    title: 'Hidden Test Cases Strategy (Edge & Corner Invariants)',
    subtitle: 'How automated hiring platforms design hidden test cases to break candidate solutions',
    keyPoints: [
      'Corner Case 1: Empty or Single Element — Does your algorithm check `if (n <= 1)` or will it throw IndexOutOfBounds?',
      'Corner Case 2: Extreme Integer Overflow — In LCM, GCD, and Midpoint calculations, always use `low + (high - low) / 2` and `(a / gcd) * b` to prevent 32-bit integer overflow.',
      'Corner Case 3: Duplicate Elements — In Two-Pointer 3Sum and QuickSort, duplicates cause infinite loops or duplicate outputs. Always advance pointers past identical numbers.',
      'Corner Case 4: Negative Numbers — In squaring sorted arrays, negative absolute values are largest at index 0. Compare left and right ends.',
      'Corner Case 5: Deep Recursion Stack — In Graph DFS and Recursion, recursion depth > 10^4 leads to Memory Limit Exceeded / Stack Overflow. Use BFS or iterative loops for large N.',
    ],
    kapilQuote: 'Hidden test cases are not surprises; they are the boundary conditions of your mathematical proof.',
  },
  {
    id: 'tip-3',
    category: 'Technical',
    title: 'Pattern Mastery: T1 to T10 Interview Signals',
    subtitle: 'Instant pattern triggers when reading any placement coding problem statement',
    keyPoints: [
      'Graphs (T1): Unweighted shortest path = BFS Queue. Weighted without negative edges = Dijkstra Min-Heap. Minimum network cost = Kruskal MST + DSU.',
      'Recursion & Arrays (T2-T3): In-place merge without extra space = Always fill backwards from index M+N-1. Matrix 90° rotation = Transpose + Row Reverse.',
      'Complexity & Math (T4-T5): Consecutive primes = Sieve of Eratosthenes up to N. Trailing factorials = Legendre formula (divide by 5, 25, 125). Odd count = O(1) mathematical range difference.',
      'Two Pointers (T6-T7): Sorted target sum = Opposite ends converging inward. Container maximum area = Always advance the shorter wall. Palindrome substrings = Expand around 2N-1 centers.',
      'Divide and Conquer (T8-T10): Rotated sorted array = At least one half is always sorted. Inversion counting = Merge step piggybacking. Median of 2 sorted arrays = Binary search on partition cut.',
    ],
    kapilQuote: 'When you identify the pattern within 60 seconds, 80% of your anxiety evaporates.',
  },
  {
    id: 'tip-4',
    category: 'Red Flags',
    title: 'Top 7 Instant Rejection Red Flags',
    subtitle: 'Mistakes that cause immediate elimination even if your code passes test cases',
    keyPoints: [
      'Red Flag 1: Silent Coding — Staying quiet for 10 minutes. The interviewer cannot read your mind; think aloud at all times.',
      'Red Flag 2: Jumping to Code Without Complexity — Typing before agreeing on Big-O. If you write an O(N^2) solution for N=10^5, you fail immediately.',
      'Red Flag 3: Variable Names like `a, b, c, temp2, x1` — Write production-quality code: `leftIndex, currentSum, visitedNodes`.',
      'Red Flag 4: Defensiveness upon Hints — If an interviewer offers a hint, embrace it eagerly: "That’s a great observation; let me see how that changes the invariant."',
      'Red Flag 5: Ignoring Edge Cases — Submitting without checking `null`, negative numbers, or arrays of length 0.',
    ],
    kapilQuote: 'An interviewer does not just hire an algorithm; they hire a future teammate they will have to review pull requests for.',
  },
  {
    id: 'tip-5',
    category: 'Behavioral',
    title: 'Behavioral & Leadership Readiness (STAR Method)',
    subtitle: 'Structuring technical project explanations and problem-solving anecdotes',
    keyPoints: [
      'S - Situation: Set the background concisely in 2 sentences.',
      'T - Task: What was the specific technical bottleneck you owned?',
      'A - Action: What algorithmic tradeoff did you implement? (e.g. "I replaced an O(N^2) nested query with an in-memory hash set reducing latency from 2.4s to 40ms").',
      'R - Result: Quantify impact (e.g. 99.9% uptime, 40% memory reduction, zero crashes).',
    ],
    kapilQuote: 'Your technical stories must prove that you take extreme ownership of software stability.',
  },
];
