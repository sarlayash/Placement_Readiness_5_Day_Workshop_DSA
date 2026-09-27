import { AlgorithmVisualization } from '../types';

export const ALGORITHM_VISUALIZATIONS: AlgorithmVisualization[] = [
  // =========================================================================
  // SEARCHING ALGORITHMS
  // =========================================================================
  {
    id: 'linear-search',
    category: 'Searching',
    name: 'Linear Search',
    tagline: 'Sequential scan through elements until target key is found',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    description:
      'Checks each element sequentially from index 0 to N-1. Best suited for unsorted lists or small collections where preprocessing overhead is not justified.',
    kapilRule:
      "Kapil's Rule: When input data is unsorted and you only perform 1 or 2 lookups, Linear Search is actually faster in practice than sorting first (O(N) vs O(N log N)).",
    defaultInput: '45, 12, 89, 34, 70, 23, 56, 91',
    targetLabel: 'Search Target',
    defaultTarget: 70
  },
  {
    id: 'binary-search',
    category: 'Searching',
    name: 'Binary Search',
    tagline: 'Logarithmic search space halving on strictly sorted data',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    description:
      'Calculates mid = low + (high - low) / 2 and discards half the search range in each comparison. The gold standard for high-performance lookup in sorted sequences.',
    kapilRule:
      "Kapil's Rule: Always write `mid = low + (high - low) / 2` instead of `(low + high) / 2` to prevent 32-bit signed integer overflow in placement coding interviews.",
    defaultInput: '12, 23, 34, 45, 56, 70, 89, 91',
    targetLabel: 'Search Target',
    defaultTarget: 56
  },

  // =========================================================================
  // SORTING ALGORITHMS
  // =========================================================================
  {
    id: 'bubble-sort',
    category: 'Sorting',
    name: 'Bubble Sort',
    tagline: 'Repeatedly swaps adjacent out-of-order pairs to float maximum to end',
    timeComplexity: 'O(N²) [O(N) Best with early exit]',
    spaceComplexity: 'O(1)',
    description:
      'Steps through the array, compares adjacent items, and swaps them if in wrong order. Each outer pass places the next highest element into its permanent sorted index.',
    kapilRule:
      "Kapil's Rule: Add a `swapped` boolean flag. If an entire pass finishes with 0 swaps, break immediately to achieve optimal O(N) best-case complexity.",
    defaultInput: '54, 26, 93, 17, 77, 31, 44, 55',
    defaultTarget: undefined
  },
  {
    id: 'selection-sort',
    category: 'Sorting',
    name: 'Selection Sort',
    tagline: 'Repeatedly identifies minimum in unsorted suffix and swaps into boundary',
    timeComplexity: 'O(N²) [Always N(N-1)/2 comparisons]',
    spaceComplexity: 'O(1)',
    description:
      'Maintains two subarrays: sorted on the left and unsorted on the right. In each pass, finds the minimum element from the unsorted part and swaps it with the first unsorted element.',
    kapilRule:
      "Kapil's Rule: Selection sort minimizes memory writes (at most N swaps), making it valuable in flash memory or hardware where write cycles are expensive.",
    defaultInput: '64, 25, 12, 22, 11, 90, 38, 47',
    defaultTarget: undefined
  },
  {
    id: 'insertion-sort',
    category: 'Sorting',
    name: 'Insertion Sort',
    tagline: 'Inserts current element into its correct sorted position in prefix',
    timeComplexity: 'O(N²) [O(N) for nearly sorted arrays]',
    spaceComplexity: 'O(1)',
    description:
      'Iterates through input elements, growing a sorted output list behind it. Compares current key with predecessor elements and shifts larger items right until key fits.',
    kapilRule:
      "Kapil's Rule: Insertion sort is adaptive and stable! It is the core algorithm inside hybrid sorts like TimSort (Python and Java's Arrays.sort()) for partitions <= 32.",
    defaultInput: '38, 27, 43, 3, 9, 82, 10, 19',
    defaultTarget: undefined
  },
  {
    id: 'merge-sort',
    category: 'Sorting',
    name: 'Merge Sort',
    tagline: 'Divide-and-conquer splitting into halves and merging sorted halves',
    timeComplexity: 'O(N log N) [Guaranteed worst case]',
    spaceComplexity: 'O(N)',
    description:
      'Recursively splits array into halves until subarrays of size 1 remain, then merges adjacent subarrays in linear time using two pointers into sorted order.',
    kapilRule:
      "Kapil's Rule: Merge Sort is strictly stable and guarantees O(N log N) even in adversarial worst-case inputs, making it ideal for linked lists and external sorting.",
    defaultInput: '48, 14, 82, 29, 65, 33, 91, 52',
    defaultTarget: undefined
  },
  {
    id: 'quick-sort',
    category: 'Sorting',
    name: 'Quick Sort',
    tagline: 'In-place partitioning around a chosen pivot with recursive sub-sorts',
    timeComplexity: 'O(N log N) Avg [O(N²) Worst Case]',
    spaceComplexity: 'O(log N) [Call stack]',
    description:
      'Picks a pivot element and partitions the array such that all items smaller than pivot are left, and all larger are right. Recursively partitions both subarrays.',
    kapilRule:
      "Kapil's Rule: Beware of sorted input when picking first element as pivot! Always use randomized pivot or median-of-three to avoid O(N²) quadratic degradation in interviews.",
    defaultInput: '50, 23, 9, 18, 61, 32, 84, 45',
    defaultTarget: undefined
  },

  // =========================================================================
  // GRAPH ALGORITHMS
  // =========================================================================
  {
    id: 'bfs-graph',
    category: 'Graphs',
    name: 'Breadth-First Search (BFS)',
    tagline: 'Level-by-level concentric wave exploration using FIFO queue',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description:
      'Starts at a source node and explores all adjacent neighbors at the present depth level before moving on to the nodes at the next depth level using a queue.',
    kapilRule:
      "Kapil's Rule: BFS guarantees the unweighted shortest path from source to any node. Always mark vertices as visited WHEN PUSHING to the queue, never when popping!",
    defaultInput: '0, 1, 2, 3, 4, 5',
    defaultTarget: 5
  },
  {
    id: 'dfs-graph',
    category: 'Graphs',
    name: 'Depth-First Search (DFS)',
    tagline: 'Deep branch traversal with recursive backtracking and stack memory',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V) [Call stack]',
    description:
      'Starts at root/source and explores as far as possible along each branch before backtracking. Essential for topological sort, cycle detection, and connected components.',
    kapilRule:
      "Kapil's Rule: Three-color DFS (White = unvisited, Gray = in recursion stack, Black = completed) is the bulletproof standard to detect directed graph cycles.",
    defaultInput: '0, 1, 2, 3, 4, 5',
    defaultTarget: 4
  },
  {
    id: 'dijkstra-graph',
    category: 'Graphs',
    name: "Dijkstra's Shortest Path",
    tagline: 'Greedy min-heap edge relaxation for non-negative weighted graphs',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description:
      'Computes shortest paths from a single source vertex to all other vertices in a weighted graph by greedily picking unvisited vertex with minimum tentative distance.',
    kapilRule:
      "Kapil's Rule: Dijkstra fails if negative edge weights exist! In those cases, pivot immediately to the Bellman-Ford algorithm in interview questions.",
    defaultInput: '0, 1, 2, 3, 4',
    defaultTarget: 4
  },

  // =========================================================================
  // TREE ALGORITHMS
  // =========================================================================
  {
    id: 'bst-ops',
    category: 'Trees',
    name: 'Binary Search Tree (BST) Operations',
    tagline: 'Dynamic insertion, comparison paths, and sorted search ordering',
    timeComplexity: 'O(log N) Avg [O(N) Skewed]',
    spaceComplexity: 'O(N)',
    description:
      'Demonstrates binary search property: every node in the left subtree has value less than the node, and right subtree has value greater than the node.',
    kapilRule:
      "Kapil's Rule: An In-order traversal of any Binary Search Tree ALWAYS yields elements in strictly sorted ascending order. Remember this invariant for tree validation!",
    defaultInput: '50, 30, 70, 20, 40, 60, 80',
    targetLabel: 'Search / Insert Value',
    defaultTarget: 40
  },
  {
    id: 'tree-traversal',
    category: 'Trees',
    name: 'Tree Traversals (Inorder, Preorder, Postorder)',
    tagline: 'Comprehensive visual node visiting order across DFS and BFS',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H) [Height of Tree]',
    description:
      'Visualizes how changing the visiting order of root relative to left and right subtrees yields different mathematical expressions and serialized trees.',
    kapilRule:
      "Kapil's Rule: Preorder is used to serialize/copy trees; Inorder retrieves sorted BST; Postorder is essential for bottom-up tasks like deleting trees or finding tree height.",
    defaultInput: '50, 30, 70, 20, 40, 60, 80',
    defaultTarget: undefined
  }
];
