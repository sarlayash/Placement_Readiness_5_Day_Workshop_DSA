import { AptitudeMCQ } from '../types';

export const APTITUDE_MCQS: AptitudeMCQ[] = [
  // 1. Time and Work -> Task Scheduler & Greedy Queue
  {
    id: 'apt-1',
    category: 'Quantitative',
    question:
      'Worker A can finish a software module in 12 days, and Worker B can finish the same module in 24 days. If they work together, how many days will it take them to complete the module?',
    options: ['6 days', '8 days', '9 days', '10 days'],
    correctAnswer: 1,
    explanation:
      'Rate of A = 1/12 per day. Rate of B = 1/24 per day. Combined Rate = 1/12 + 1/24 = (2 + 1)/24 = 3/24 = 1/8 per day. Therefore, total time required = 1 / (1/8) = 8 days.',
    linkedDsaProblem: {
      id: 'd1-e1',
      title: 'Task Scheduling & Reachability (BFS / Greedy)',
      day: 1,
      topic: 'T1: Graphs & Topological Scheduling',
      conceptTieIn:
        'Time & Work problems calculate unit rate additions, which directly maps to multi-worker DAG task scheduling where independent nodes execute concurrently across worker threads.',
    },
  },

  // 2. Permutations & Combinations -> Subsets & Backtracking
  {
    id: 'apt-2',
    category: 'Combinatorics',
    question:
      'How many distinct non-empty subsets can be formed from a set containing 6 distinct interview topics?',
    options: ['32', '63', '64', '128'],
    correctAnswer: 1,
    explanation:
      'The total number of subsets for a set of size N is 2^N. For N = 6, 2^6 = 64. Excluding the empty set, the number of non-empty subsets is 64 - 1 = 63.',
    linkedDsaProblem: {
      id: 'q-t2-80',
      title: 'Generate All Subsets / Power Set',
      day: 1,
      topic: 'T2: Recursion & Backtracking',
      conceptTieIn:
        'The mathematical proof that 2^N subsets exist dictates the exact O(2^N) state space branching tree used in recursive subset generation.',
    },
  },

  // 3. Relative Speed -> Two Pointer Meeting Point
  {
    id: 'apt-3',
    category: 'Quantitative',
    question:
      'Two runners start from opposite ends of a circular 600m track at the same time running towards each other at 15 m/s and 25 m/s respectively. After how many seconds will they meet for the first time?',
    options: ['12 seconds', '15 seconds', '20 seconds', '24 seconds'],
    correctAnswer: 1,
    explanation:
      'Relative speed when moving towards each other = Speed_1 + Speed_2 = 15 + 25 = 40 m/s. Time to meet = Total Distance / Relative Speed = 600m / 40 m/s = 15 seconds.',
    linkedDsaProblem: {
      id: 'q-t6-97',
      title: 'Two-Pointer Target Sum Invariant',
      day: 3,
      topic: 'T6: Two-Pointer Approach',
      conceptTieIn:
        'Relative velocity where two entities close a gap at the sum of their individual speeds is the continuous mathematical foundation of converging two-pointer algorithms.',
    },
  },

  // 4. Modulo Arithmetic & Cyclicity -> Modular Exponentiation
  {
    id: 'apt-4',
    category: 'Number Theory',
    question:
      'What is the remainder when (7^103) is divided by 5?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 2,
    explanation:
      'Powers of 7 modulo 5: 7^1 = 7 = 2 (mod 5), 7^2 = 4 (mod 5), 7^3 = 8 = 3 (mod 5), 7^4 = 21 = 1 (mod 5). The cyclicity is 4. Exponent 103 = 4 * 25 + 3. Hence, 7^103 = 7^3 = 3 (mod 5). Remainder is 3.',
    linkedDsaProblem: {
      id: 'q-t4-89',
      title: 'Fast Modular Exponentiation (A^B % M)',
      day: 2,
      topic: 'T4: Number Theory & Complexity',
      conceptTieIn:
        'Cyclicity and Euler\'s Totient Theorem reduce astronomical exponential calculations to O(log B) steps, essential for cryptographic hashing and competitive programming.',
    },
  },

  // 5. Probability -> Randomized Algorithms
  {
    id: 'apt-5',
    category: 'Combinatorics',
    question:
      'Two standard 6-sided dice are rolled simultaneously. What is the probability that the sum of the numbers shown is greater than or equal to 10?',
    options: ['1/12', '1/6', '5/36', '1/4'],
    correctAnswer: 1,
    explanation:
      'Total outcomes = 6 * 6 = 36. Outcomes with sum >= 10: Sum 10 -> (4,6), (5,5), (6,4) [3 pairs]; Sum 11 -> (5,6), (6,5) [2 pairs]; Sum 12 -> (6,6) [1 pair]. Total favorable outcomes = 3 + 2 + 1 = 6. Probability = 6/36 = 1/6.',
    linkedDsaProblem: {
      id: 'q-t4-90',
      title: 'Randomized Array Shuffling (Fisher-Yates)',
      day: 2,
      topic: 'T4: Mathematical Algorithms',
      conceptTieIn:
        'Combinatorial probability spaces provide the mathematical proof for uniform distribution in randomized algorithms like Fisher-Yates and Randomized QuickSelect.',
    },
  },

  // 6. Pigeonhole Principle -> Find Duplicate in Array
  {
    id: 'apt-6',
    category: 'Logical',
    question:
      'A drawer contains socks of 4 distinct colors. What is the minimum number of socks a person must pull out in the dark to guarantee at least one matching pair of the same color?',
    options: ['4', '5', '8', '9'],
    correctAnswer: 1,
    explanation:
      'By the Pigeonhole Principle, if there are n = 4 colors (holes), choosing n + 1 = 5 socks (pigeons) guarantees that at least one color must receive at least ceil(5/4) = 2 socks.',
    linkedDsaProblem: {
      id: 'q-t6-98',
      title: 'Find the Duplicate Number (Floyd\'s Tortoise)',
      day: 3,
      topic: 'T6: Two-Pointer & Floyd Cycle',
      conceptTieIn:
        'The Pigeonhole Principle guarantees that an array of size N+1 containing integers from 1 to N must contain at least one duplicate, which is solved in O(1) space via cycle detection.',
    },
  },

  // 7. Logarithmic Halving -> Binary Search
  {
    id: 'apt-7',
    category: 'Algorithmic',
    question:
      'A bacterial colony doubles in size every hour. If it takes 20 hours to completely fill a petri dish, after how many hours was the dish exactly half full?',
    options: ['10 hours', '15 hours', '19 hours', '19.5 hours'],
    correctAnswer: 2,
    explanation:
      'Since the colony doubles every hour, moving back by 1 hour divides the population by 2. If it is 100% full at hour 20, it was exactly 50% (half) full at 20 - 1 = 19 hours.',
    linkedDsaProblem: {
      id: 'q-t8-105',
      title: 'Rotated Sorted Array Search (Binary Search)',
      day: 4,
      topic: 'T8: Divide & Conquer',
      conceptTieIn:
        'Logarithmic scaling is the inverse of exponential doubling. Every binary search step halves the search space, reducing N candidates to 1 in ceil(log2 N) queries.',
    },
  },

  // 8. Profit & Loss / Arbitrage -> Best Time to Buy and Sell Stock
  {
    id: 'apt-8',
    category: 'Quantitative',
    question:
      'A trader buys shares on Day 1 for $45, sells on Day 3 for $54, buys again on Day 4 for $50, and sells on Day 5 for $68. What is the total percentage profit realized on the initial $45 investment?',
    options: ['40%', '45%', '60%', '64.4%'],
    correctAnswer: 2,
    explanation:
      'Profit 1 = 54 - 45 = $9. Profit 2 = 68 - 50 = $18. Total cumulative profit = 9 + 18 = $27. Percentage profit on initial $45 capital = (27 / 45) * 100% = 60%.',
    linkedDsaProblem: {
      id: 'q-t2-81',
      title: 'Best Time to Buy & Sell Stock (Kadane / Greedy)',
      day: 1,
      topic: 'T2: Arrays & Greedy Invariants',
      conceptTieIn:
        'Maximizing price differences across chronological transactions is the exact principle behind single-pass O(N) stock profit algorithms.',
    },
  },

  // 9. Venn Diagrams & Set Inclusion -> Array Intersection & Bitmasks
  {
    id: 'apt-9',
    category: 'Logical',
    question:
      'In a college batch of 100 students, 60 study C++, 45 study Java, and 20 study both C++ and Java. How many students study neither C++ nor Java?',
    options: ['10', '15', '20', '25'],
    correctAnswer: 1,
    explanation:
      'By Principle of Inclusion-Exclusion: n(C++ union Java) = n(C++) + n(Java) - n(C++ intersection Java) = 60 + 45 - 20 = 85. Students studying neither = Total - n(C++ union Java) = 100 - 85 = 15.',
    linkedDsaProblem: {
      id: 'q-t2-79',
      title: 'Intersection of Two Arrays (Two Pointers & Hash)',
      day: 1,
      topic: 'T2: Array Transformations',
      conceptTieIn:
        'Set-theoretic inclusion-exclusion governs hash map frequency intersections and bitmask union operations in O(N + M) complexity.',
    },
  },

  // 10. Greatest Common Divisor (Euclid) -> Array Reduction & GCD
  {
    id: 'apt-10',
    category: 'Number Theory',
    question:
      'What is the edge length of the largest square tile that can evenly pave a rectangular room of dimensions 280 cm by 168 cm without cutting any tiles?',
    options: ['28 cm', '42 cm', '56 cm', '70 cm'],
    correctAnswer: 2,
    explanation:
      'The edge of the largest square tile is the Greatest Common Divisor GCD(280, 168). Using Euclid\'s algorithm: 280 % 168 = 112; 168 % 112 = 56; 112 % 56 = 0. Therefore, GCD(280, 168) = 56 cm.',
    linkedDsaProblem: {
      id: 'q-t4-91',
      title: 'Euclidean GCD & Array Reductions',
      day: 2,
      topic: 'T4: Mathematical Algorithms',
      conceptTieIn:
        'Euclidean division theorem GCD(A, B) = GCD(B, A % B) guarantees logarithmic convergence in O(log(min(A, B))) iterations.',
    },
  },

  // 11. Arithmetic Progression -> Subarray Sum & Prefix Sums
  {
    id: 'apt-11',
    category: 'Quantitative',
    question:
      'What is the sum of the first 50 positive odd integers: 1 + 3 + 5 + ... + 99?',
    options: ['2450', '2500', '2550', '2600'],
    correctAnswer: 1,
    explanation:
      'The sum of the first N positive odd integers is always N^2. Here N = 50, so Sum = 50^2 = 2500. Alternatively, AP formula: S_n = n/2 * (a + l) = 50/2 * (1 + 99) = 25 * 100 = 2500.',
    linkedDsaProblem: {
      id: 'q-t6-99',
      title: 'Subarray Sum Equals K (Prefix Sum Hash Map)',
      day: 3,
      topic: 'T6: Prefix Sums & Two Pointers',
      conceptTieIn:
        'Arithmetic series formulas are the basis for prefix sum arrays where range sums query query(L, R) = prefix[R] - prefix[L-1] in O(1) time.',
    },
  },

  // 12. Clock Angles -> Circular Arrays & Modular Indexing
  {
    id: 'apt-12',
    category: 'Logical',
    question:
      'What is the acute angle between the hour hand and the minute hand of a clock at 3:15?',
    options: ['0 degrees', '7.5 degrees', '12 degrees', '15 degrees'],
    correctAnswer: 1,
    explanation:
      'At 3:15, the minute hand is at 15 * 6 = 90 degrees. In 15 minutes, the hour hand moves 15 * 0.5 = 7.5 degrees past the 3 o\'clock mark (which is 90 degrees). Position of hour hand = 90 + 7.5 = 97.5 degrees. Angle difference = 97.5 - 90 = 7.5 degrees.',
    linkedDsaProblem: {
      id: 'q-t3-84',
      title: 'Circular Queue / Circular Array Indexing',
      day: 2,
      topic: 'T3: Modular Arithmetic on Arrays',
      conceptTieIn:
        'Continuous angular sweep on a 360-degree circle is modeled as modular arithmetic index = (index + offset) % Capacity in circular data structures.',
    },
  },

  // 13. Logical Relations / Implication -> 2-SAT & Graph Bipartition
  {
    id: 'apt-13',
    category: 'Logical',
    question:
      'Consider the statement: "If an algorithm is optimal, then it uses minimal space." What is the contrapositive of this conditional statement?',
    options: [
      'If an algorithm uses minimal space, then it is optimal',
      'If an algorithm is not optimal, then it does not use minimal space',
      'If an algorithm does not use minimal space, then it is not optimal',
      'An algorithm is optimal if and only if it uses minimal space',
    ],
    correctAnswer: 2,
    explanation:
      'For any conditional statement "If P, then Q" (P -> Q), the logical contrapositive is "If not Q, then not P" (~Q -> ~P). Both statements are logically equivalent.',
    linkedDsaProblem: {
      id: 'q-t1-75',
      title: 'Cycle Detection in Dependency Graphs (DFS)',
      day: 1,
      topic: 'T1: Graphs & Topological Ordering',
      conceptTieIn:
        'Boolean implication networks (P -> Q) form directed implication graphs used in 2-SAT and cycle detection to evaluate logical satisfiability in O(V + E).',
    },
  },

  // 14. Mixtures and Alligation -> Partitioning & Two Pointers
  {
    id: 'apt-14',
    category: 'Quantitative',
    question:
      'In what ratio must an IT training firm mix two batches of students scoring 60% and 85% average respectively, to obtain an overall batch average of 75%?',
    options: ['2 : 3', '3 : 2', '4 : 5', '5 : 4'],
    correctAnswer: 0,
    explanation:
      'By Rule of Alligation: (Higher value - Mean) / (Mean - Lower value) = (85 - 75) / (75 - 60) = 10 / 15 = 2 / 3. The ratio of the first batch to the second batch is 2 : 3.',
    linkedDsaProblem: {
      id: 'q-t7-101',
      title: 'Dutch National Flag (3-Way Partitioning)',
      day: 4,
      topic: 'T7: Two-Pointer Partitioning',
      conceptTieIn:
        'Alligation ratios determine pivot balancing in QuickSort and 3-way pointer partitioning to divide elements around a target metric in a single pass.',
    },
  },

  // 15. Combinatorial Handshakes -> Graph Edges N*(N-1)/2
  {
    id: 'apt-15',
    category: 'Combinatorics',
    question:
      'At a tech summit, 12 lead architects meet in a room. If each architect shakes hands with every other architect exactly once, how many total handshakes occur?',
    options: ['66', '72', '132', '144'],
    correctAnswer: 0,
    explanation:
      'Choosing 2 people out of 12 to shake hands corresponds to C(12, 2) = (12 * 11) / (2 * 1) = 132 / 2 = 66 handshakes.',
    linkedDsaProblem: {
      id: 'q-t1-74',
      title: 'Social Network Adjacency Graph Construction',
      day: 1,
      topic: 'T1: Graphs Representation',
      conceptTieIn:
        'The formula N*(N-1)/2 represents the total number of edges in a complete undirected graph K_N, which defines the upper bound on graph density.',
    },
  },

  // 16. Geometric Progression -> Recurrence Convergence
  {
    id: 'apt-16',
    category: 'Algorithmic',
    question:
      'A ping-pong ball is dropped from a height of 100 meters. Each time it bounces, it rebounds to exactly 1/2 of its previous height. What is the total vertical distance traveled by the ball when it finally comes to rest?',
    options: ['200 meters', '250 meters', '300 meters', '400 meters'],
    correctAnswer: 2,
    explanation:
      'Initial drop = 100m. Rebounds: 2 * [50 + 25 + 12.5 + ...]. The infinite sum S = 50 / (1 - 0.5) = 100m. Total distance = 100 + 2 * (100) = 300 meters.',
    linkedDsaProblem: {
      id: 'q-t3-85',
      title: 'Recursion Depth & Infinite Recurrence Halving',
      day: 2,
      topic: 'T3: Recursion Analysis',
      conceptTieIn:
        'Infinite geometric series sum a / (1 - r) proves that algorithms halving work repeatedly (like Binary Search or QuickSelect) take strictly bounded O(N) total steps.',
    },
  },

  // 17. Unit Digit Cyclicity -> Hash Table Buckets
  {
    id: 'apt-17',
    category: 'Number Theory',
    question:
      'What is the units digit of the mathematical expression: 3^65 * 6^59 * 7^71?',
    options: ['2', '4', '6', '8'],
    correctAnswer: 1,
    explanation:
      'Unit digit of 3^65: 65 % 4 = 1 -> 3^1 = 3. Unit digit of 6^59: Any positive power of 6 ends in 6. Unit digit of 7^71: 71 % 4 = 3 -> 7^3 = 343 -> 3. Multiplying units digits: 3 * 6 * 3 = 54 -> unit digit is 4.',
    linkedDsaProblem: {
      id: 'q-t5-93',
      title: 'Cyclic Hash Functions & Modulo Distribution',
      day: 3,
      topic: 'T5: Math Algorithms & Hashing',
      conceptTieIn:
        'Cyclicity in modular powers is the basis of universal hashing and linear congruential generators that avoid hash collisions.',
    },
  },

  // 18. Knights and Knaves -> 2-Colorable Bipartite Graph
  {
    id: 'apt-18',
    category: 'Logical',
    question:
      'On an island, Knights always tell the truth and Knaves always lie. Person A says: "We are both Knaves." What are Person A and Person B?',
    options: [
      'Both are Knights',
      'A is a Knave and B is a Knight',
      'Both are Knaves',
      'A is a Knight and B is a Knave',
    ],
    correctAnswer: 1,
    explanation:
      'If A were a Knight, A would speak the truth, meaning A is a Knave — a contradiction. Thus A must be a Knave. Since A is a Knave, A\'s statement "We are both Knaves" is a lie. Since A is already a Knave, for the conjunction to be false, B must NOT be a Knave. Therefore, B is a Knight.',
    linkedDsaProblem: {
      id: 'q-t1-76',
      title: 'Is Graph Bipartite? (2-Coloring with BFS/DFS)',
      day: 1,
      topic: 'T1: Graph Traversals & Bipartition',
      conceptTieIn:
        'Binary truth-value assignments under mutual negation constraints form bipartite graph 2-coloring problems solved via alternating BFS.',
    },
  },

  // 19. Boat and Stream -> Binary Search on Answer
  {
    id: 'apt-19',
    category: 'Quantitative',
    question:
      'A boat travels 36 km downstream in 3 hours and returns the same 36 km upstream in 6 hours. What is the speed of the water stream?',
    options: ['2 km/h', '3 km/h', '4 km/h', '6 km/h'],
    correctAnswer: 1,
    explanation:
      'Downstream speed (B + S) = 36 / 3 = 12 km/h. Upstream speed (B - S) = 36 / 6 = 6 km/h. Subtracting the two equations: 2S = 12 - 6 = 6 -> Stream speed S = 3 km/h. (Boat speed B = 9 km/h).',
    linkedDsaProblem: {
      id: 'q-t8-106',
      title: 'Ship Packages Within D Days (Binary Search on Answer)',
      day: 4,
      topic: 'T8: Divide & Conquer Optimization',
      conceptTieIn:
        'Rate balancing equations are foundational to "Binary Search on Answer" problems where monotonic rate functions verify feasibility in O(N log(Range)).',
    },
  },

  // 20. Calendar Odd Days -> Direct Array Indexing
  {
    id: 'apt-20',
    category: 'Logical',
    question:
      'If January 1 of a non-leap year falls on a Monday, what day of the week will December 31 of the same year fall on?',
    options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    correctAnswer: 1,
    explanation:
      'A standard non-leap year has 365 days = 52 weeks + 1 odd day. Because day 1 is Monday, day 365 is (1 + 364) = 1 + (52 * 7 + 0) = Monday. The first and last day of a non-leap year are always identical.',
    linkedDsaProblem: {
      id: 'q-t5-94',
      title: 'Direct Lookups & Constant Time Math Indexing',
      day: 3,
      topic: 'T5: Math Algorithms',
      conceptTieIn:
        'Calendar calculations use modular period arithmetic to map temporal values directly to days-of-the-week arrays in O(1) time without looping.',
    },
  },

  // 21. Palindromic Numbers -> Valid Palindrome
  {
    id: 'apt-21',
    category: 'Number Theory',
    question:
      'How many positive 3-digit palindromic integers (integers that read the same backwards and forwards, e.g. 121, 747) exist between 100 and 999?',
    options: ['81', '90', '100', '110'],
    correctAnswer: 1,
    explanation:
      'A 3-digit palindrome has form "ABA". The first digit A can be any number from 1 to 9 (9 choices, cannot be 0). The middle digit B can be any number from 0 to 9 (10 choices). The last digit is fixed by A (1 choice). Total count = 9 * 10 * 1 = 90 palindromes.',
    linkedDsaProblem: {
      id: 'q-t6-100',
      title: 'Valid Palindrome Verification (Two Pointers)',
      day: 3,
      topic: 'T6: Two-Pointer Approach',
      conceptTieIn:
        'Symmetry constraints reduce degree-of-freedom by half, directly inspiring two-pointer palindrome checkers that compare str[L] == str[R] while L < R.',
    },
  },

  // 22. Inversion Count in Permutations -> MergeSort Inversions
  {
    id: 'apt-22',
    category: 'Algorithmic',
    question:
      'In a permutation of numbers [3, 1, 2, 5, 4], an "inversion" is a pair (i, j) where i < j but arr[i] > arr[j]. How many total inversions exist in this array?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    explanation:
      'Inversions: (3, 1) since 3 > 1; (3, 2) since 3 > 2; (5, 4) since 5 > 4. No other pairs violate order. Total inversions = 3.',
    linkedDsaProblem: {
      id: 'q-t8-107',
      title: 'Count Inversions in Array (Merge Sort)',
      day: 4,
      topic: 'T8: Divide & Conquer',
      conceptTieIn:
        'Counting inversions measures how far an array is from being sorted. Using Divide & Conquer, inversions can be counted during the MergeSort merge step in O(N log N) time.',
    },
  },

  // 23. Bitwise Math -> Brian Kernighan & Bitmasking
  {
    id: 'apt-23',
    category: 'Algorithmic',
    question:
      'What is the result of the bitwise expression N & (N - 1) when applied to any positive integer N in binary?',
    options: [
      'It sets all bits of N to 1',
      'It clears the lowest (least significant) set bit of N to 0',
      'It doubles the value of N',
      'It computes the bitwise complement of N',
    ],
    correctAnswer: 1,
    explanation:
      'Subtracting 1 flips all bits after the lowest set bit (including that bit itself). Performing bitwise AND with N keeps all higher bits unchanged while clearing that lowest set bit to 0. This is the foundation of Brian Kernighan\'s algorithm to count set bits.',
    linkedDsaProblem: {
      id: 'q-t4-92',
      title: 'Number of 1 Bits (Brian Kernighan\'s Algorithm)',
      day: 2,
      topic: 'T4: Bit Manipulation & Complexity',
      conceptTieIn:
        'N & (N - 1) loops only as many times as there are set bits (O(SetBits)), making it strictly faster than shifting across all 32 bits.',
    },
  },

  // 24. Grid Combinatorics -> Unique Paths Dynamic Programming
  {
    id: 'apt-24',
    category: 'Combinatorics',
    question:
      'A robot moves on an M x N grid starting from the top-left cell (0, 0) to the bottom-right cell (M-1, N-1). It can only move Right or Down. If M = 4 and N = 5, how many unique paths exist?',
    options: ['24', '35', '56', '70'],
    correctAnswer: 1,
    explanation:
      'To reach the destination, the robot must make exactly (M - 1) = 3 Down moves and (N - 1) = 4 Right moves. Total moves = 3 + 4 = 7. The number of unique paths is C(7, 3) = (7 * 6 * 5) / (3 * 2 * 1) = 35.',
    linkedDsaProblem: {
      id: 'q-t9-109',
      title: 'Unique Paths in Grid (Combinatorial DP)',
      day: 5,
      topic: 'T9: Dynamic Programming & Divide & Conquer',
      conceptTieIn:
        'Grid traversal problems combine combinatorial path formulas C(M+N-2, M-1) with state-transition dynamic programming dp[i][j] = dp[i-1][j] + dp[i][j-1].',
    },
  },

  // 25. Optimal Decision / Probability -> QuickSelect Median Finding
  {
    id: 'apt-25',
    category: 'Quantitative',
    question:
      'A company interviews 5 candidates sequentially for a software engineer role. If the interviewer must rank them from 1st to 5th without ties, how many possible complete preference orderings exist?',
    options: ['25', '60', '120', '720'],
    correctAnswer: 2,
    explanation:
      'Arranging 5 distinct candidates in an ordered ranking corresponds to 5! = 5 * 4 * 3 * 2 * 1 = 120 possible permutations.',
    linkedDsaProblem: {
      id: 'q-t8-108',
      title: 'Kth Largest Element / QuickSelect',
      day: 4,
      topic: 'T8: Divide & Conquer Partitioning',
      conceptTieIn:
        'Finding rank statistics in unsorted collections (like median finding) is solved in expected O(N) linear time using Hoare\'s QuickSelect partition algorithm.',
    },
  },
];
