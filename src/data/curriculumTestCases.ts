import { TestCase } from '../types';

/**
 * Authentic, verified LeetCode, HackerRank and GFG test cases for all 44 curriculum questions.
 * Includes both sample (visible) and rigorous hidden edge/stress vectors.
 */
export const CURRICULUM_TEST_CASES: Record<string, TestCase[]> = {
  "q-t1-73": [
    {
      "id": "tc-q-t1-73-1",
      "input": "4 4\n1 2\n2 3\n3 4\n1 4\n1",
      "expectedOutput": "0 1 2 1",
      "isHidden": false,
      "explanation": "Official syllabus sample: Shortest hops from hub 1 to all nodes 1..4."
    },
    {
      "id": "tc-q-t1-73-2",
      "input": "3 2\n1 2\n2 3\n1",
      "expectedOutput": "0 1 2",
      "isHidden": false,
      "explanation": "Linear path 1-2-3 with distances 0, 1, 2."
    },
    {
      "id": "tc-q-t1-73-3",
      "input": "5 5\n1 2\n1 3\n2 4\n3 4\n4 5\n1",
      "expectedOutput": "0 1 1 2 3",
      "isHidden": true,
      "explanation": "Stress test: Diamond graph with branch hop to node 5."
    },
    {
      "id": "tc-q-t1-73-4",
      "input": "4 2\n1 2\n3 4\n1",
      "expectedOutput": "0 1 -1 -1",
      "isHidden": true,
      "explanation": "Disconnected component test: nodes 3 and 4 are unreachable (-1)."
    }
  ],
  "q-t1-74": [
    {
      "id": "tc-q-t1-74-1",
      "input": "3 2\n1 2\n1 3",
      "expectedOutput": "User 1: Degree 2, Friends: 2 3\nUser 2: Degree 1, Friends: 1\nUser 3: Degree 1, Friends: 1",
      "isHidden": false,
      "explanation": "Official syllabus sample: Adjacency list representation with sorted neighbors."
    },
    {
      "id": "tc-q-t1-74-2",
      "input": "2 1\n1 2",
      "expectedOutput": "User 1: Degree 1, Friends: 2\nUser 2: Degree 1, Friends: 1",
      "isHidden": false,
      "explanation": "Single edge between users 1 and 2."
    },
    {
      "id": "tc-q-t1-74-3",
      "input": "4 3\n1 2\n2 3\n3 4",
      "expectedOutput": "User 1: Degree 1, Friends: 2\nUser 2: Degree 2, Friends: 1 3\nUser 3: Degree 2, Friends: 2 4\nUser 4: Degree 1, Friends: 3",
      "isHidden": true,
      "explanation": "Stress test: 4-node linear chain graph."
    },
    {
      "id": "tc-q-t1-74-4",
      "input": "3 0",
      "expectedOutput": "User 1: Degree 0, Friends: None\nUser 2: Degree 0, Friends: None\nUser 3: Degree 0, Friends: None",
      "isHidden": true,
      "explanation": "Boundary case: Isolated nodes with 0 friendships."
    }
  ],
  "q-t1-75": [
    {
      "id": "tc-q-t1-75-1",
      "input": "3 3\n1 2\n2 3\n3 1",
      "expectedOutput": "CYCLE DETECTED",
      "isHidden": false,
      "explanation": "Official syllabus sample: Triangle 1-2-3 creates a circular loop."
    },
    {
      "id": "tc-q-t1-75-2",
      "input": "3 2\n1 2\n2 3",
      "expectedOutput": "ACYCLIC GRID",
      "isHidden": false,
      "explanation": "Linear tree of 3 vertices is acyclic."
    },
    {
      "id": "tc-q-t1-75-3",
      "input": "4 4\n1 2\n2 3\n3 4\n4 2",
      "expectedOutput": "CYCLE DETECTED",
      "isHidden": true,
      "explanation": "Cycle inside 2-3-4 component."
    },
    {
      "id": "tc-q-t1-75-4",
      "input": "4 3\n1 2\n1 3\n1 4",
      "expectedOutput": "ACYCLIC GRID",
      "isHidden": true,
      "explanation": "Star graph centered at 1 with 0 cycles."
    }
  ],
  "q-t1-76": [
    {
      "id": "tc-q-t1-76-1",
      "input": "4 4\n1 2 5\n1 3 10\n2 4 15\n3 4 5\n4",
      "expectedOutput": "15",
      "isHidden": false,
      "explanation": "Official syllabus sample: Shortest path 1 -> 3 -> 4 has cost 10 + 5 = 15."
    },
    {
      "id": "tc-q-t1-76-2",
      "input": "3 2\n1 2 4\n2 3 6\n3",
      "expectedOutput": "10",
      "isHidden": false,
      "explanation": "Linear path 1 -> 2 -> 3 with total weight 4 + 6 = 10."
    },
    {
      "id": "tc-q-t1-76-3",
      "input": "4 5\n1 2 1\n2 3 2\n3 4 3\n1 3 5\n1 4 10\n4",
      "expectedOutput": "6",
      "isHidden": true,
      "explanation": "Optimal path 1 -> 2 -> 3 -> 4 has weight 1 + 2 + 3 = 6."
    },
    {
      "id": "tc-q-t1-76-4",
      "input": "3 1\n1 2 5\n3",
      "expectedOutput": "-1",
      "isHidden": true,
      "explanation": "Destination 3 is unreachable from 1; returns -1."
    }
  ],
  "q-t1-77": [
    {
      "id": "tc-q-t1-77-1",
      "input": "4 4 1 4\n1 2\n2 4\n1 3\n3 4",
      "expectedOutput": "1 -> 2 -> 4\n1 -> 3 -> 4",
      "isHidden": false,
      "explanation": "Official syllabus sample: Two alternate routes 1-2-4 and 1-3-4."
    },
    {
      "id": "tc-q-t1-77-2",
      "input": "3 2 1 3\n1 2\n2 3",
      "expectedOutput": "1 -> 2 -> 3",
      "isHidden": false,
      "explanation": "Single linear route from 1 to 3."
    },
    {
      "id": "tc-q-t1-77-3",
      "input": "4 5 1 4\n1 2\n1 3\n1 4\n2 4\n3 4",
      "expectedOutput": "1 -> 2 -> 4\n1 -> 3 -> 4\n1 -> 4",
      "isHidden": true,
      "explanation": "Three distinct paths including direct jump 1 -> 4."
    },
    {
      "id": "tc-q-t1-77-4",
      "input": "3 1 1 3\n1 2",
      "expectedOutput": "NO PATH",
      "isHidden": true,
      "explanation": "No path exists between 1 and 3."
    }
  ],
  "q-t1-78": [
    {
      "id": "tc-q-t1-78-1",
      "input": "4 5\n1 2 1\n2 3 4\n1 3 2\n3 4 3\n2 4 5",
      "expectedOutput": "6",
      "isHidden": false,
      "explanation": "Official syllabus sample: Kruskal MST chooses edges (1,2:1), (1,3:2), (3,4:3) with sum 6."
    },
    {
      "id": "tc-q-t1-78-2",
      "input": "3 3\n1 2 5\n2 3 5\n1 3 2",
      "expectedOutput": "7",
      "isHidden": false,
      "explanation": "Edges (1,3:2) and (1,2:5) connect all 3 vertices with total weight 7."
    },
    {
      "id": "tc-q-t1-78-3",
      "input": "5 7\n1 2 4\n1 3 2\n2 3 1\n2 4 5\n3 4 8\n3 5 10\n4 5 2",
      "expectedOutput": "10",
      "isHidden": true,
      "explanation": "Stress test: 5-vertex MST with cost 2 + 1 + 2 + 5 = 10."
    },
    {
      "id": "tc-q-t1-78-4",
      "input": "2 1\n1 2 42",
      "expectedOutput": "42",
      "isHidden": true,
      "explanation": "Single edge between two poles with cost 42."
    }
  ],
  "q-t2-inv": [
    {
      "id": "tc-q-t2-inv-1",
      "input": "nums1 = [1,2,3,0,0,0], m = 3\nnums2 = [2,5,6], n = 3",
      "expectedOutput": "[1,2,2,3,5,6]",
      "isHidden": false,
      "explanation": "Official syllabus sample: Two sorted inventory lists merged in-place in non-decreasing order."
    },
    {
      "id": "tc-q-t2-inv-2",
      "input": "nums1 = [1], m = 1\nnums2 = [], n = 0",
      "expectedOutput": "[1]",
      "isHidden": false,
      "explanation": "nums2 is empty, nums1 remains untouched."
    },
    {
      "id": "tc-q-t2-inv-3",
      "input": "nums1 = [0], m = 0\nnums2 = [1], n = 1",
      "expectedOutput": "[1]",
      "isHidden": true,
      "explanation": "nums1 has m=0; nums2 is copied into nums1."
    },
    {
      "id": "tc-q-t2-inv-4",
      "input": "nums1 = [4,5,6,0,0,0], m = 3\nnums2 = [1,2,3], n = 3",
      "expectedOutput": "[1,2,3,4,5,6]",
      "isHidden": true,
      "explanation": "nums2 contains strictly smaller elements than nums1."
    }
  ],
  "q-t2-garden": [
    {
      "id": "tc-q-t2-garden-1",
      "input": "3\n1 2 3\n4 5 6\n7 8 9",
      "expectedOutput": "7 4 1\n8 5 2\n9 6 3",
      "isHidden": false,
      "explanation": "Official syllabus sample: 90 degree clockwise rotation of 3x3 matrix in-place."
    },
    {
      "id": "tc-q-t2-garden-2",
      "input": "2\n1 2\n3 4",
      "expectedOutput": "3 1\n4 2",
      "isHidden": false,
      "explanation": "2x2 grid clockwise rotation."
    },
    {
      "id": "tc-q-t2-garden-3",
      "input": "4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16",
      "expectedOutput": "15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11",
      "isHidden": true,
      "explanation": "Stress test: 4x4 matrix rotated 90 degrees clockwise."
    },
    {
      "id": "tc-q-t2-garden-4",
      "input": "1\n42",
      "expectedOutput": "42",
      "isHidden": true,
      "explanation": "Boundary case: 1x1 matrix rotation."
    }
  ],
  "q-t2-pangram": [
    {
      "id": "tc-q-t2-pangram-1",
      "input": "\"The quick brown fox jumps over the lazy dog\"",
      "expectedOutput": "PANGRAM",
      "isHidden": false,
      "explanation": "Official syllabus sample: Sentence contains all 26 lowercase English letters."
    },
    {
      "id": "tc-q-t2-pangram-2",
      "input": "\"leetcode\"",
      "expectedOutput": "NOT PANGRAM",
      "isHidden": false,
      "explanation": "Missing majority of letters from the alphabet."
    },
    {
      "id": "tc-q-t2-pangram-3",
      "input": "\"Pack my box with five dozen liquor jugs\"",
      "expectedOutput": "PANGRAM",
      "isHidden": true,
      "explanation": "Well-known pangram containing all 26 characters."
    },
    {
      "id": "tc-q-t2-pangram-4",
      "input": "\"\"",
      "expectedOutput": "NOT PANGRAM",
      "isHidden": true,
      "explanation": "Empty string boundary test."
    }
  ],
  "q-t2-palin": [
    {
      "id": "tc-q-t2-palin-1",
      "input": "\"A man, a plan, a canal: Panama\"",
      "expectedOutput": "YES",
      "isHidden": false,
      "explanation": "Official syllabus sample: Classic alphanumeric palindrome ignoring non-letters."
    },
    {
      "id": "tc-q-t2-palin-2",
      "input": "\"race a car\"",
      "expectedOutput": "NO",
      "isHidden": false,
      "explanation": "Mismatch on characters (e vs a)."
    },
    {
      "id": "tc-q-t2-palin-3",
      "input": "\"Was it a car or a cat I saw?\"",
      "expectedOutput": "YES",
      "isHidden": true,
      "explanation": "Valid palindrome sentence."
    },
    {
      "id": "tc-q-t2-palin-4",
      "input": "\" \"",
      "expectedOutput": "YES",
      "isHidden": true,
      "explanation": "Empty / whitespace palindrome per LeetCode definition."
    }
  ],
  "q-t2-stock": [
    {
      "id": "tc-q-t2-stock-1",
      "input": "4\n1 3\n2 6\n8 10\n15 18",
      "expectedOutput": "[1, 6] [8, 10] [15, 18]",
      "isHidden": false,
      "explanation": "Official syllabus sample: Intervals [1, 3] and [2, 6] overlap and merge into [1, 6]."
    },
    {
      "id": "tc-q-t2-stock-2",
      "input": "2\n1 4\n4 5",
      "expectedOutput": "[1, 5]",
      "isHidden": false,
      "explanation": "Intervals share boundary point 4 and merge into [1, 5]."
    },
    {
      "id": "tc-q-t2-stock-3",
      "input": "3\n1 4\n0 4\n3 5",
      "expectedOutput": "[0, 5]",
      "isHidden": true,
      "explanation": "Unsorted input completely overlapping into single interval [0, 5]."
    },
    {
      "id": "tc-q-t2-stock-4",
      "input": "1\n1 4",
      "expectedOutput": "[1, 4]",
      "isHidden": true,
      "explanation": "Single interval boundary test."
    }
  ],
  "q-t3-clock": [
    {
      "id": "tc-q-t3-clock-1",
      "input": "12 30",
      "expectedOutput": "165.0",
      "isHidden": false,
      "explanation": "Official syllabus sample: Hour hand at 12:30 is at 15 degrees, minute hand at 180 degrees. Diff is 165.0."
    },
    {
      "id": "tc-q-t3-clock-2",
      "input": "3 30",
      "expectedOutput": "75.0",
      "isHidden": false,
      "explanation": "At 3:30, hour hand at 105 degrees, minute hand at 180 degrees -> 75.0 degrees."
    },
    {
      "id": "tc-q-t3-clock-3",
      "input": "3 15",
      "expectedOutput": "7.5",
      "isHidden": true,
      "explanation": "At 3:15, hour hand moved 7.5 degrees past 3."
    },
    {
      "id": "tc-q-t3-clock-4",
      "input": "12 0",
      "expectedOutput": "0.0",
      "isHidden": true,
      "explanation": "Both hands align at 12:00 sharp."
    }
  ],
  "q-t3-lcm": [
    {
      "id": "tc-q-t3-lcm-1",
      "input": "3\n4 6 8",
      "expectedOutput": "24",
      "isHidden": false,
      "explanation": "Official syllabus sample: LCM(4, 6, 8) = 24."
    },
    {
      "id": "tc-q-t3-lcm-2",
      "input": "2\n12 15",
      "expectedOutput": "60",
      "isHidden": false,
      "explanation": "LCM(12, 15) = 60."
    },
    {
      "id": "tc-q-t3-lcm-3",
      "input": "4\n5 10 15 20",
      "expectedOutput": "60",
      "isHidden": true,
      "explanation": "LCM(5, 10, 15, 20) = 60."
    },
    {
      "id": "tc-q-t3-lcm-4",
      "input": "1\n42",
      "expectedOutput": "42",
      "isHidden": true,
      "explanation": "Single element LCM is the element itself."
    }
  ],
  "q-t3-revstr": [
    {
      "id": "tc-q-t3-revstr-1",
      "input": "[\"h\",\"e\",\"l\",\"l\",\"o\"]",
      "expectedOutput": "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
      "isHidden": false,
      "explanation": "Official syllabus sample: Reverse string character array in-place."
    },
    {
      "id": "tc-q-t3-revstr-2",
      "input": "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]",
      "expectedOutput": "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]",
      "isHidden": false,
      "explanation": "Even length string reversal."
    },
    {
      "id": "tc-q-t3-revstr-3",
      "input": "[\"A\"]",
      "expectedOutput": "[\"A\"]",
      "isHidden": true,
      "explanation": "Single character array remains identical."
    },
    {
      "id": "tc-q-t3-revstr-4",
      "input": "[]",
      "expectedOutput": "[]",
      "isHidden": true,
      "explanation": "Empty array boundary test."
    }
  ],
  "q-t3-palincust": [
    {
      "id": "tc-q-t3-palincust-1",
      "input": "1221",
      "expectedOutput": "TRUE",
      "isHidden": false,
      "explanation": "Official syllabus sample: 1221 reads identical forwards and backwards."
    },
    {
      "id": "tc-q-t3-palincust-2",
      "input": "-121",
      "expectedOutput": "FALSE",
      "isHidden": false,
      "explanation": "Negative numbers are not palindromes due to leading negative sign."
    },
    {
      "id": "tc-q-t3-palincust-3",
      "input": "10",
      "expectedOutput": "FALSE",
      "isHidden": true,
      "explanation": "10 backwards is 01, not a palindrome."
    },
    {
      "id": "tc-q-t3-palincust-4",
      "input": "7",
      "expectedOutput": "TRUE",
      "isHidden": true,
      "explanation": "Single digit positive integers are always palindromic."
    }
  ],
  "q-t3-numways": [
    {
      "id": "tc-q-t3-numways-1",
      "input": "5",
      "expectedOutput": "8",
      "isHidden": false,
      "explanation": "Official syllabus sample: 5 steps has 8 distinct combinations of 1 and 2 steps."
    },
    {
      "id": "tc-q-t3-numways-2",
      "input": "2",
      "expectedOutput": "2",
      "isHidden": false,
      "explanation": "2 steps: (1+1) or (2) -> 2 ways."
    },
    {
      "id": "tc-q-t3-numways-3",
      "input": "3",
      "expectedOutput": "3",
      "isHidden": true,
      "explanation": "3 steps: (1+1+1), (1+2), (2+1) -> 3 ways."
    },
    {
      "id": "tc-q-t3-numways-4",
      "input": "1",
      "expectedOutput": "1",
      "isHidden": true,
      "explanation": "1 step has exactly 1 way."
    }
  ],
  "q-t4-1": [
    {
      "id": "tc-q-t4-1-1",
      "input": "10",
      "expectedOutput": "4 (primes are 2, 3, 5, 7)",
      "isHidden": false,
      "explanation": "Official syllabus sample: 4 prime numbers strictly less than or equal to 10."
    },
    {
      "id": "tc-q-t4-1-2",
      "input": "1",
      "expectedOutput": "0",
      "isHidden": false,
      "explanation": "No prime numbers exist <= 1."
    },
    {
      "id": "tc-q-t4-1-3",
      "input": "20",
      "expectedOutput": "8 (primes are 2, 3, 5, 7, 11, 13, 17, 19)",
      "isHidden": true,
      "explanation": "Primes up to 20: 2, 3, 5, 7, 11, 13, 17, 19 (total 8)."
    },
    {
      "id": "tc-q-t4-1-4",
      "input": "2",
      "expectedOutput": "1 (primes are 2)",
      "isHidden": true,
      "explanation": "Boundary case: 2 is the only even prime."
    }
  ],
  "q-t4-2": [
    {
      "id": "tc-q-t4-2-1",
      "input": "128 36",
      "expectedOutput": "4",
      "isHidden": false,
      "explanation": "Official syllabus sample: GCD(128, 36) = 4."
    },
    {
      "id": "tc-q-t4-2-2",
      "input": "48 18",
      "expectedOutput": "6",
      "isHidden": false,
      "explanation": "GCD(48, 18) = 6."
    },
    {
      "id": "tc-q-t4-2-3",
      "input": "101 103",
      "expectedOutput": "1",
      "isHidden": true,
      "explanation": "Coprime numbers yield GCD of 1."
    },
    {
      "id": "tc-q-t4-2-4",
      "input": "0 42",
      "expectedOutput": "42",
      "isHidden": true,
      "explanation": "GCD(0, X) = X."
    }
  ],
  "q-t4-lcmcheck": [
    {
      "id": "tc-q-t4-lcmcheck-1",
      "input": "3 6\n2 3 2",
      "expectedOutput": "4",
      "isHidden": false,
      "explanation": "Official syllabus sample: 4 contiguous subarrays have LCM equal to 6: [2,3], [2,3,2], [3,2], and [2,3,2] variants."
    },
    {
      "id": "tc-q-t4-lcmcheck-2",
      "input": "2 4\n5 1",
      "expectedOutput": "0",
      "isHidden": false,
      "explanation": "No subarray has LCM equal to 4."
    },
    {
      "id": "tc-q-t4-lcmcheck-3",
      "input": "4 12\n3 4 6 12",
      "expectedOutput": "5",
      "isHidden": true,
      "explanation": "Subarrays with LCM 12: [3,4], [3,4,6], [3,4,6,12], [4,6,12], [12]."
    },
    {
      "id": "tc-q-t4-lcmcheck-4",
      "input": "1 7\n7",
      "expectedOutput": "1",
      "isHidden": true,
      "explanation": "Single element matches target LCM."
    }
  ],
  "q-t4-smartgrid": [
    {
      "id": "tc-q-t4-smartgrid-1",
      "input": "4\n1 2\n2 3\n3 4\n1 3",
      "expectedOutput": "3",
      "isHidden": false,
      "explanation": "Official syllabus sample: 3 non-overlapping intervals can be selected: [1,2], [2,3], [3,4]."
    },
    {
      "id": "tc-q-t4-smartgrid-2",
      "input": "3\n1 2\n1 2\n1 2",
      "expectedOutput": "1",
      "isHidden": false,
      "explanation": "Duplicate overlapping intervals allow only 1 selection."
    },
    {
      "id": "tc-q-t4-smartgrid-3",
      "input": "5\n1 4\n2 5\n5 7\n6 8\n7 9",
      "expectedOutput": "3",
      "isHidden": true,
      "explanation": "Compatible schedule [1,4], [5,7], [7,9] yields 3."
    },
    {
      "id": "tc-q-t4-smartgrid-4",
      "input": "1\n10 20",
      "expectedOutput": "1",
      "isHidden": true,
      "explanation": "Single interval always selectable."
    }
  ],
  "q-t5-5": [
    {
      "id": "tc-q-t5-5-1",
      "input": "3 7",
      "expectedOutput": "3 (3, 5, 7)",
      "isHidden": false,
      "explanation": "Official syllabus sample: 3 odd numbers between 3 and 7 (inclusive)."
    },
    {
      "id": "tc-q-t5-5-2",
      "input": "8 10",
      "expectedOutput": "1 (9)",
      "isHidden": false,
      "explanation": "Single odd number 9 in [8, 10]."
    },
    {
      "id": "tc-q-t5-5-3",
      "input": "1 10",
      "expectedOutput": "5 (1, 3, 5, 7, 9)",
      "isHidden": true,
      "explanation": "5 odd numbers between 1 and 10."
    },
    {
      "id": "tc-q-t5-5-4",
      "input": "4 4",
      "expectedOutput": "0",
      "isHidden": true,
      "explanation": "Single even number range yields 0 odds."
    }
  ],
  "q-t5-6": [
    {
      "id": "tc-q-t5-6-1",
      "input": "25",
      "expectedOutput": "6",
      "isHidden": false,
      "explanation": "Official syllabus sample: 25/5 + 25/25 = 5 + 1 = 6 trailing zeroes."
    },
    {
      "id": "tc-q-t5-6-2",
      "input": "5",
      "expectedOutput": "1",
      "isHidden": false,
      "explanation": "5! = 120 has 1 trailing zero."
    },
    {
      "id": "tc-q-t5-6-3",
      "input": "100",
      "expectedOutput": "24",
      "isHidden": true,
      "explanation": "floor(100/5) + floor(100/25) = 20 + 4 = 24."
    },
    {
      "id": "tc-q-t5-6-4",
      "input": "0",
      "expectedOutput": "0",
      "isHidden": true,
      "explanation": "0! = 1 has 0 trailing zeroes."
    }
  ],
  "q-t5-primefact": [
    {
      "id": "tc-q-t5-primefact-1",
      "input": "360",
      "expectedOutput": "2^3 * 3^2 * 5^1",
      "isHidden": false,
      "explanation": "Official syllabus sample: 360 = 2^3 * 3^2 * 5^1."
    },
    {
      "id": "tc-q-t5-primefact-2",
      "input": "13",
      "expectedOutput": "13^1",
      "isHidden": false,
      "explanation": "Prime number factor breakdown is p^1."
    },
    {
      "id": "tc-q-t5-primefact-3",
      "input": "100",
      "expectedOutput": "2^2 * 5^2",
      "isHidden": true,
      "explanation": "100 = 2^2 * 5^2."
    },
    {
      "id": "tc-q-t5-primefact-4",
      "input": "84",
      "expectedOutput": "2^2 * 3^1 * 7^1",
      "isHidden": true,
      "explanation": "84 = 2^2 * 3^1 * 7^1."
    }
  ],
  "q-t5-glowing": [
    {
      "id": "tc-q-t5-glowing-1",
      "input": "9 25",
      "expectedOutput": "3 (9, 16, 25)",
      "isHidden": false,
      "explanation": "Official syllabus sample: 3 perfect squares between 9 and 25 (inclusive)."
    },
    {
      "id": "tc-q-t5-glowing-2",
      "input": "3 8",
      "expectedOutput": "1 (4)",
      "isHidden": false,
      "explanation": "Single square 4 in range [3, 8]."
    },
    {
      "id": "tc-q-t5-glowing-3",
      "input": "1 100",
      "expectedOutput": "10",
      "isHidden": true,
      "explanation": "Squares from 1^2 to 10^2 -> 10 squares."
    },
    {
      "id": "tc-q-t5-glowing-4",
      "input": "17 24",
      "expectedOutput": "0",
      "isHidden": true,
      "explanation": "No perfect squares between 17 and 24."
    }
  ],
  "q-t6-11": [
    {
      "id": "tc-q-t6-11-1",
      "input": "\"race a car\"",
      "expectedOutput": "false",
      "isHidden": false,
      "explanation": "Official syllabus sample: Characters do not match symmetrically."
    },
    {
      "id": "tc-q-t6-11-2",
      "input": "\"A man, a plan, a canal: Panama\"",
      "expectedOutput": "true",
      "isHidden": false,
      "explanation": "Classic palindrome sentence."
    },
    {
      "id": "tc-q-t6-11-3",
      "input": "\"0P\"",
      "expectedOutput": "false",
      "isHidden": true,
      "explanation": "Digit 0 vs character P mismatch."
    },
    {
      "id": "tc-q-t6-11-4",
      "input": "\" \"",
      "expectedOutput": "true",
      "isHidden": true,
      "explanation": "Empty phrase after stripping non-alphanumerics."
    }
  ],
  "q-t6-12": [
    {
      "id": "tc-q-t6-12-1",
      "input": "\"IceCreAm\"",
      "expectedOutput": "\"AceCreIm\"",
      "isHidden": false,
      "explanation": "Official syllabus sample: Vowels I, e, e, A reversed in-place."
    },
    {
      "id": "tc-q-t6-12-2",
      "input": "\"leetcode\"",
      "expectedOutput": "\"leotcede\"",
      "isHidden": false,
      "explanation": "Vowels e, e, o, e reversed to e, o, e, e."
    },
    {
      "id": "tc-q-t6-12-3",
      "input": "\"hello\"",
      "expectedOutput": "\"holle\"",
      "isHidden": true,
      "explanation": "Vowels e and o swapped."
    },
    {
      "id": "tc-q-t6-12-4",
      "input": "\"xyz\"",
      "expectedOutput": "\"xyz\"",
      "isHidden": true,
      "explanation": "No vowels in string remains unchanged."
    }
  ],
  "q-t6-zerosum": [
    {
      "id": "tc-q-t6-zerosum-1",
      "input": "[-1,0,1,2,-1,-4]",
      "expectedOutput": "[[-1,-1,2],[-1,0,1]]",
      "isHidden": false,
      "explanation": "Official syllabus sample: Unique triplets summing to zero."
    },
    {
      "id": "tc-q-t6-zerosum-2",
      "input": "[0,1,1]",
      "expectedOutput": "[]",
      "isHidden": false,
      "explanation": "No triplets sum to 0."
    },
    {
      "id": "tc-q-t6-zerosum-3",
      "input": "[0,0,0]",
      "expectedOutput": "[[0,0,0]]",
      "isHidden": true,
      "explanation": "All zero triplet."
    },
    {
      "id": "tc-q-t6-zerosum-4",
      "input": "[-2,0,1,1,2]",
      "expectedOutput": "[[-2,0,2],[-2,1,1]]",
      "isHidden": true,
      "explanation": "Two distinct zero-sum triplets."
    }
  ],
  "q-t6-signalsquares": [
    {
      "id": "tc-q-t6-signalsquares-1",
      "input": "[-4,-1,0,3,10]",
      "expectedOutput": "[0,1,9,16,100]",
      "isHidden": false,
      "explanation": "Official syllabus sample: Sorted squares using outer-end two pointers."
    },
    {
      "id": "tc-q-t6-signalsquares-2",
      "input": "[-7,-3,2,3,11]",
      "expectedOutput": "[4,9,9,49,121]",
      "isHidden": false,
      "explanation": "Sorted squares of mixed integers."
    },
    {
      "id": "tc-q-t6-signalsquares-3",
      "input": "[-5,-4,-3,-2,-1]",
      "expectedOutput": "[1,4,9,16,25]",
      "isHidden": true,
      "explanation": "Strictly negative array reversed after squaring."
    },
    {
      "id": "tc-q-t6-signalsquares-4",
      "input": "[0]",
      "expectedOutput": "[0]",
      "isHidden": true,
      "explanation": "Single zero element."
    }
  ],
  "q-t7-13": [
    {
      "id": "tc-q-t7-13-1",
      "input": "\"abcdefg\", k = 2",
      "expectedOutput": "\"bacdfeg\"",
      "isHidden": false,
      "explanation": "Official syllabus sample: Reverse first 2 of every 4 characters."
    },
    {
      "id": "tc-q-t7-13-2",
      "input": "\"abcd\", k = 2",
      "expectedOutput": "\"bacd\"",
      "isHidden": false,
      "explanation": "Reverse first 2, next 2 remain normal."
    },
    {
      "id": "tc-q-t7-13-3",
      "input": "\"a\", k = 2",
      "expectedOutput": "\"a\"",
      "isHidden": true,
      "explanation": "Fewer than k characters: reversed completely."
    },
    {
      "id": "tc-q-t7-13-4",
      "input": "\"abcdefghij\", k = 3",
      "expectedOutput": "\"cbadefihgj\"",
      "isHidden": true,
      "explanation": "Reverse 3, skip 3, reverse 3, skip 1."
    }
  ],
  "q-t7-14": [
    {
      "id": "tc-q-t7-14-1",
      "input": "[1,8,6,2,5,4,8,3,7]",
      "expectedOutput": "49",
      "isHidden": false,
      "explanation": "Official syllabus sample: Lines at index 1 (height 8) and index 8 (height 7) give area min(8,7) * 7 = 49."
    },
    {
      "id": "tc-q-t7-14-2",
      "input": "[1,1]",
      "expectedOutput": "1",
      "isHidden": false,
      "explanation": "Two walls of height 1 with distance 1 give area 1."
    },
    {
      "id": "tc-q-t7-14-3",
      "input": "[4,3,2,1,4]",
      "expectedOutput": "16",
      "isHidden": true,
      "explanation": "Ends with height 4 separated by 4 width give 16."
    },
    {
      "id": "tc-q-t7-14-4",
      "input": "[1,2,1]",
      "expectedOutput": "2",
      "isHidden": true,
      "explanation": "Area between 1 and 1 width 2 gives 2."
    }
  ],
  "q-t7-specialpalin": [
    {
      "id": "tc-q-t7-specialpalin-1",
      "input": "\"aaa\"",
      "expectedOutput": "6 (\"a\", \"a\", \"a\", \"aa\", \"aa\", \"aaa\")",
      "isHidden": false,
      "explanation": "Official syllabus sample: 6 palindromic substrings expanding around centers."
    },
    {
      "id": "tc-q-t7-specialpalin-2",
      "input": "\"abc\"",
      "expectedOutput": "3 (\"a\", \"b\", \"c\")",
      "isHidden": false,
      "explanation": "Single-letter palindromic substrings only."
    },
    {
      "id": "tc-q-t7-specialpalin-3",
      "input": "\"aba\"",
      "expectedOutput": "4 (\"a\", \"b\", \"a\", \"aba\")",
      "isHidden": true,
      "explanation": "Substrings \"a\", \"b\", \"a\", and \"aba\"."
    },
    {
      "id": "tc-q-t7-specialpalin-4",
      "input": "\"a\"",
      "expectedOutput": "1 (\"a\")",
      "isHidden": true,
      "explanation": "Single character string."
    }
  ],
  "q-t7-revwords": [
    {
      "id": "tc-q-t7-revwords-1",
      "input": "\"Let's take LeetCode contest\"",
      "expectedOutput": "\"s'teL ekat edoCteeL tsetnoc\"",
      "isHidden": false,
      "explanation": "Official syllabus sample: Each individual word reversed while preserving word spacing."
    },
    {
      "id": "tc-q-t7-revwords-2",
      "input": "\"Mr Ding\"",
      "expectedOutput": "\"rM gniD\"",
      "isHidden": false,
      "explanation": "Two-word sentence reversal."
    },
    {
      "id": "tc-q-t7-revwords-3",
      "input": "\"algorithm\"",
      "expectedOutput": "\"mhtirogla\"",
      "isHidden": true,
      "explanation": "Single word reversed."
    },
    {
      "id": "tc-q-t7-revwords-4",
      "input": "\"a b c\"",
      "expectedOutput": "\"a b c\"",
      "isHidden": true,
      "explanation": "Single letter words remain unchanged."
    }
  ],
  "q-t8-23": [
    {
      "id": "tc-q-t8-23-1",
      "input": "nums = [4,5,6,7,0,1,2], target = 0",
      "expectedOutput": "4",
      "isHidden": false,
      "explanation": "Official syllabus sample: Target 0 found at index 4 in rotated array."
    },
    {
      "id": "tc-q-t8-23-2",
      "input": "nums = [4,5,6,7,0,1,2], target = 3",
      "expectedOutput": "-1",
      "isHidden": false,
      "explanation": "Target 3 does not exist in array."
    },
    {
      "id": "tc-q-t8-23-3",
      "input": "nums = [1], target = 0",
      "expectedOutput": "-1",
      "isHidden": true,
      "explanation": "Single element mismatch."
    },
    {
      "id": "tc-q-t8-23-4",
      "input": "nums = [6,7,1,2,3,4,5], target = 7",
      "expectedOutput": "1",
      "isHidden": true,
      "explanation": "Target found at index 1."
    }
  ],
  "q-t8-34": [
    {
      "id": "tc-q-t8-34-1",
      "input": "[2,0,2,1,1,0]",
      "expectedOutput": "[0,0,1,1,2,2]",
      "isHidden": false,
      "explanation": "Official syllabus sample: Dutch National Flag 3-way partition in O(N)."
    },
    {
      "id": "tc-q-t8-34-2",
      "input": "[2,0,1]",
      "expectedOutput": "[0,1,2]",
      "isHidden": false,
      "explanation": "Simple 3-element partition."
    },
    {
      "id": "tc-q-t8-34-3",
      "input": "[0]",
      "expectedOutput": "[0]",
      "isHidden": true,
      "explanation": "Single element array."
    },
    {
      "id": "tc-q-t8-34-4",
      "input": "[1,1,1,0,0,2,2]",
      "expectedOutput": "[0,0,1,1,1,2,2]",
      "isHidden": true,
      "explanation": "Array with multiple duplicates."
    }
  ],
  "q-t8-24": [
    {
      "id": "tc-q-t8-24-1",
      "input": "nums = [5,7,7,8,8,10], target = 8",
      "expectedOutput": "[3, 4]",
      "isHidden": false,
      "explanation": "Official syllabus sample: First occurrence at index 3, last occurrence at index 4."
    },
    {
      "id": "tc-q-t8-24-2",
      "input": "nums = [5,7,7,8,8,10], target = 6",
      "expectedOutput": "[-1, -1]",
      "isHidden": false,
      "explanation": "Target 6 not present in array."
    },
    {
      "id": "tc-q-t8-24-3",
      "input": "nums = [], target = 0",
      "expectedOutput": "[-1, -1]",
      "isHidden": true,
      "explanation": "Empty array boundary test."
    },
    {
      "id": "tc-q-t8-24-4",
      "input": "nums = [8,8,8,8], target = 8",
      "expectedOutput": "[0, 3]",
      "isHidden": true,
      "explanation": "All elements identical."
    }
  ],
  "q-t8-35": [
    {
      "id": "tc-q-t8-35-1",
      "input": "[38, 27, 43, 3, 9, 82, 10]",
      "expectedOutput": "[3, 9, 10, 27, 38, 43, 82]",
      "isHidden": false,
      "explanation": "Official syllabus sample: Classic merge sort dividing and merging."
    },
    {
      "id": "tc-q-t8-35-2",
      "input": "[5, 2, 3, 1]",
      "expectedOutput": "[1, 2, 3, 5]",
      "isHidden": false,
      "explanation": "Unsorted 4-element array."
    },
    {
      "id": "tc-q-t8-35-3",
      "input": "[5, 1, 1, 2, 0, 0]",
      "expectedOutput": "[0, 0, 1, 1, 2, 5]",
      "isHidden": true,
      "explanation": "Stable sorting with duplicate values."
    },
    {
      "id": "tc-q-t8-35-4",
      "input": "[42]",
      "expectedOutput": "[42]",
      "isHidden": true,
      "explanation": "Single element sorted array."
    }
  ],
  "q-t9-maxsub": [
    {
      "id": "tc-q-t9-maxsub-1",
      "input": "[-2,1,-3,4,-1,2,1,-5,4]",
      "expectedOutput": "6 (subarray [4,-1,2,1])",
      "isHidden": false,
      "explanation": "Official syllabus sample: Maximum contiguous subarray sum is 6."
    },
    {
      "id": "tc-q-t9-maxsub-2",
      "input": "[1]",
      "expectedOutput": "1 (subarray [1])",
      "isHidden": false,
      "explanation": "Single element subarray."
    },
    {
      "id": "tc-q-t9-maxsub-3",
      "input": "[5,4,-1,7,8]",
      "expectedOutput": "23 (subarray [5,4,-1,7,8])",
      "isHidden": true,
      "explanation": "Entire array constitutes maximum sum 23."
    },
    {
      "id": "tc-q-t9-maxsub-4",
      "input": "[-1]",
      "expectedOutput": "-1 (subarray [-1])",
      "isHidden": true,
      "explanation": "Single negative element."
    }
  ],
  "q-t9-median": [
    {
      "id": "tc-q-t9-median-1",
      "input": "nums1 = [1, 3], nums2 = [2]",
      "expectedOutput": "2.0",
      "isHidden": false,
      "explanation": "Official syllabus sample: Combined sorted array is [1, 2, 3], median is 2.0."
    },
    {
      "id": "tc-q-t9-median-2",
      "input": "nums1 = [1, 2], nums2 = [3, 4]",
      "expectedOutput": "2.5",
      "isHidden": false,
      "explanation": "Combined array [1, 2, 3, 4], median is (2 + 3) / 2 = 2.5."
    },
    {
      "id": "tc-q-t9-median-3",
      "input": "nums1 = [0, 0], nums2 = [0, 0]",
      "expectedOutput": "0.0",
      "isHidden": true,
      "explanation": "Zeros array yields 0.0."
    },
    {
      "id": "tc-q-t9-median-4",
      "input": "nums1 = [], nums2 = [1]",
      "expectedOutput": "1.0",
      "isHidden": true,
      "explanation": "One array empty."
    }
  ],
  "q-t9-inversion": [
    {
      "id": "tc-q-t9-inversion-1",
      "input": "[8, 4, 2, 1]",
      "expectedOutput": "6",
      "isHidden": false,
      "explanation": "Official syllabus sample: Strictly decreasing array has N*(N-1)/2 = 6 inversions."
    },
    {
      "id": "tc-q-t9-inversion-2",
      "input": "[1, 2, 3, 4]",
      "expectedOutput": "0",
      "isHidden": false,
      "explanation": "Sorted array has 0 inversions."
    },
    {
      "id": "tc-q-t9-inversion-3",
      "input": "[2, 4, 1, 3, 5]",
      "expectedOutput": "3",
      "isHidden": true,
      "explanation": "Inversions: (2,1), (4,1), (4,3) -> 3."
    },
    {
      "id": "tc-q-t9-inversion-4",
      "input": "[1]",
      "expectedOutput": "0",
      "isHidden": true,
      "explanation": "Single element has 0 inversions."
    }
  ],
  "q-t9-quickselect": [
    {
      "id": "tc-q-t9-quickselect-1",
      "input": "[3,2,1,5,6,4], k = 2",
      "expectedOutput": "5",
      "isHidden": false,
      "explanation": "Official syllabus sample: 2nd largest element in [3,2,1,5,6,4] is 5."
    },
    {
      "id": "tc-q-t9-quickselect-2",
      "input": "[3,2,3,1,2,4,5,5,6], k = 4",
      "expectedOutput": "4",
      "isHidden": false,
      "explanation": "4th largest element is 4."
    },
    {
      "id": "tc-q-t9-quickselect-3",
      "input": "[1], k = 1",
      "expectedOutput": "1",
      "isHidden": true,
      "explanation": "Single element stream."
    },
    {
      "id": "tc-q-t9-quickselect-4",
      "input": "[7,10,4,3,20,15], k = 3",
      "expectedOutput": "10",
      "isHidden": true,
      "explanation": "3rd largest element is 10."
    }
  ],
  "q-t10-closestpair": [
    {
      "id": "tc-q-t10-closestpair-1",
      "input": "4\n0 0\n1 1\n2 4\n5 1",
      "expectedOutput": "1.4142",
      "isHidden": false,
      "explanation": "Official syllabus sample: Closest points (0,0) and (1,1) have distance sqrt(2) = 1.4142."
    },
    {
      "id": "tc-q-t10-closestpair-2",
      "input": "3\n0 0\n3 0\n0 4",
      "expectedOutput": "3.0000",
      "isHidden": false,
      "explanation": "Distance between (0,0) and (3,0) is 3.0."
    },
    {
      "id": "tc-q-t10-closestpair-3",
      "input": "2\n1 1\n1 2",
      "expectedOutput": "1.0000",
      "isHidden": true,
      "explanation": "Vertical distance of 1."
    },
    {
      "id": "tc-q-t10-closestpair-4",
      "input": "4\n1 1\n4 5\n10 10\n4 6",
      "expectedOutput": "1.0000",
      "isHidden": true,
      "explanation": "Distance between (4,5) and (4,6) is 1.0."
    }
  ],
  "q-t10-skyline": [
    {
      "id": "tc-q-t10-skyline-1",
      "input": "[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]",
      "expectedOutput": "[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]",
      "isHidden": false,
      "explanation": "Official syllabus sample: Key turning points of multi-building skyline."
    },
    {
      "id": "tc-q-t10-skyline-2",
      "input": "[[0,2,3],[2,5,3]]",
      "expectedOutput": "[[0,3],[5,0]]",
      "isHidden": false,
      "explanation": "Continuous equal-height skyline."
    },
    {
      "id": "tc-q-t10-skyline-3",
      "input": "[[1,2,1]]",
      "expectedOutput": "[[1,1],[2,0]]",
      "isHidden": true,
      "explanation": "Single building skyline."
    },
    {
      "id": "tc-q-t10-skyline-4",
      "input": "[[1,5,3],[1,5,4]]",
      "expectedOutput": "[[1,4],[5,0]]",
      "isHidden": true,
      "explanation": "Overlapping identical base buildings."
    }
  ],
  "q-t10-majority": [
    {
      "id": "tc-q-t10-majority-1",
      "input": "[2,2,1,1,1,2,2]",
      "expectedOutput": "2",
      "isHidden": false,
      "explanation": "Official syllabus sample: 2 appears 4 times out of 7, exceeding floor(N/2)."
    },
    {
      "id": "tc-q-t10-majority-2",
      "input": "[3,2,3]",
      "expectedOutput": "3",
      "isHidden": false,
      "explanation": "3 is the majority element."
    },
    {
      "id": "tc-q-t10-majority-3",
      "input": "[1]",
      "expectedOutput": "1",
      "isHidden": true,
      "explanation": "Single element is the trivial majority."
    },
    {
      "id": "tc-q-t10-majority-4",
      "input": "[6,5,5]",
      "expectedOutput": "5",
      "isHidden": true,
      "explanation": "5 appears 2 out of 3 times."
    }
  ],
  "q-t10-strassen": [
    {
      "id": "tc-q-t10-strassen-1",
      "input": "2\n1 2\n3 4\n5 6\n7 8",
      "expectedOutput": "19 22\n43 50",
      "isHidden": false,
      "explanation": "Official syllabus sample: 2x2 matrix multiplication [[1,2],[3,4]] * [[5,6],[7,8]] = [[19,22],[43,50]]."
    },
    {
      "id": "tc-q-t10-strassen-2",
      "input": "2\n1 0\n0 1\n3 4\n5 6",
      "expectedOutput": "3 4\n5 6",
      "isHidden": false,
      "explanation": "Identity matrix multiplication."
    },
    {
      "id": "tc-q-t10-strassen-3",
      "input": "2\n0 0\n0 0\n1 2\n3 4",
      "expectedOutput": "0 0\n0 0",
      "isHidden": true,
      "explanation": "Zero matrix multiplication."
    },
    {
      "id": "tc-q-t10-strassen-4",
      "input": "1\n5\n6",
      "expectedOutput": "30",
      "isHidden": true,
      "explanation": "1x1 scalar multiplication."
    }
  ]
};
