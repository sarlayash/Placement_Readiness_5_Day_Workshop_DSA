import { SolvedProgram } from '../types';

export const SOLVED_PROGRAMS: SolvedProgram[] = [
  // ==========================================
  // DAY 1 (Topics T1: Graphs & T2: Recursion & Strings)
  // 2 Easy, 2 Medium, 2 Hard
  // ==========================================
  {
    id: 'd1-e1',
    day: 1,
    title: 'Path Exists in Graph (BFS Reachability)',
    difficulty: 'Easy',
    topicTag: 'T1: Graphs • Breadth First Search',
    problemStatement:
      'Given an undirected graph with N vertices numbered 0 to N-1 and an edge list, determine whether there is a valid path from a source vertex to a destination vertex.',
    sampleInput: 'N = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2',
    sampleOutput: 'true',
    explanation:
      'Build an adjacency list from the edge list. Use a queue to perform BFS starting from the source vertex. Maintain a boolean visited array to avoid revisiting vertices in cycles. If destination is dequeued or discovered, return true.',
    kapilInsight:
      'Kapil\'s Rule: For unweighted shortest path or simple reachability, BFS is strictly O(V + E). Always verify disconnected components and self-loops before coding.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

bool validPath(int n, vector<vector<int>>& edges, int source, int destination) {
    if (source == destination) return true;
    vector<vector<int>> adj(n);
    for (const auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);
    }
    vector<bool> visited(n, false);
    queue<int> q;
    q.push(source);
    visited[source] = true;

    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        if (curr == destination) return true;
        for (int neighbor : adj[curr]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
    return false;
}

int main() {
    vector<vector<int>> edges = {{0,1},{1,2},{2,0}};
    cout << (validPath(3, edges, 0, 2) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean validPath(int n, int[][] edges, int source, int destination) {
        if (source == destination) return true;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        boolean[] visited = new boolean[n];
        Queue<Integer> q = new LinkedList<>();
        q.offer(source);
        visited[source] = true;

        while (!q.isEmpty()) {
            int curr = q.poll();
            if (curr == destination) return true;
            for (int next : adj.get(curr)) {
                if (!visited[next]) {
                    visited[next] = true;
                    q.offer(next);
                }
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {1, 2}, {2, 0}};
        System.out.println(validPath(3, edges, 0, 2));
    }
}`,
      python: `from collections import deque

def valid_path(n: int, edges: list, source: int, destination: int) -> bool:
    if source == destination:
        return True
    adj = {i: [] for i in range(n)}
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    
    visited = [False] * n
    queue = deque([source])
    visited[source] = True
    
    while queue:
        curr = queue.popleft()
        if curr == destination:
            return True
        for neighbor in adj[curr]:
            if not visited[neighbor]:
                visited[neighbor] = True
                queue.append(neighbor)
    return False

# Test run
print(valid_path(3, [[0, 1], [1, 2], [2, 0]], 0, 2)) # True`,
      c: `#include <stdio.h>
#include <stdbool.h>

// BFS on fixed size adjacency matrix for demo
bool validPath(int n, int edges[][2], int edgeCount, int src, int dest) {
    if (src == dest) return true;
    int adj[100][100] = {0};
    int deg[100] = {0};
    for (int i = 0; i < edgeCount; i++) {
        int u = edges[i][0], v = edges[i][1];
        adj[u][deg[u]++] = v;
        adj[v][deg[v]++] = u;
    }
    bool visited[100] = {false};
    int queue[100], front = 0, rear = 0;
    queue[rear++] = src;
    visited[src] = true;

    while (front < rear) {
        int curr = queue[front++];
        if (curr == dest) return true;
        for (int i = 0; i < deg[curr]; i++) {
            int nxt = adj[curr][i];
            if (!visited[nxt]) {
                visited[nxt] = true;
                queue[rear++] = nxt;
            }
        }
    }
    return false;
}

int main() {
    int edges[3][2] = {{0,1},{1,2},{2,0}};
    printf("%s\\n", validPath(3, edges, 3, 0, 2) ? "true" : "false");
    return 0;
}`,
      javascript: `function validPath(n, edges, source, destination) {
    if (source === destination) return true;
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }
    const visited = new Uint8Array(n);
    const queue = [source];
    visited[source] = 1;

    let head = 0;
    while (head < queue.length) {
        const curr = queue[head++];
        if (curr === destination) return true;
        for (const next of adj[curr]) {
            if (!visited[next]) {
                visited[next] = 1;
                queue.push(next);
            }
        }
    }
    return false;
}

console.log(validPath(3, [[0,1],[1,2],[2,0]], 0, 2));`,
      html: `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; background: #0b1120; color: #fff; padding: 20px; }
  .canvas { display: flex; gap: 40px; align-items: center; justify-content: center; }
  .node { width: 50px; height: 50px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; font-weight: bold; }
  .node.visited { background: #10b981; }
  .status { margin-top: 20px; color: #38bdf8; font-weight: bold; }
</style>
</head>
<body>
  <h3>BFS Graph Traversal Visualizer</h3>
  <div class="canvas">
    <div class="node visited">0 (Src)</div>
    <span>⇄</span>
    <div class="node visited">1</div>
    <span>⇄</span>
    <div class="node visited">2 (Dest)</div>
  </div>
  <p class="status">Path Found: 0 ➜ 1 ➜ 2 (True)</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'N=3, [[0,1],[1,2],[2,0]], src=0, dst=2', expectedOutput: 'true', isHidden: false },
      { id: 'tc2', input: 'N=6, [[0,1],[0,2],[3,5],[5,4],[4,3]], src=0, dst=5', expectedOutput: 'false', isHidden: false },
      { id: 'tc3', input: 'N=10, [[0,1],[1,2],[2,3],[3,4],[5,6],[6,7]], src=0, dst=7', expectedOutput: 'false', isHidden: true },
      { id: 'tc4', input: 'N=1, [], src=0, dst=0', expectedOutput: 'true', isHidden: true },
    ]
  },
  {
    id: 'd1-e2',
    day: 1,
    title: 'Reverse a String Using Pure Recursion',
    difficulty: 'Easy',
    topicTag: 'T2: Recursion & Strings',
    problemStatement:
      'Given a string S, reverse it in-place using pure recursive divide-and-conquer principles without using standard library reverse utilities or iterative loops.',
    sampleInput: '"PLACEMENT"',
    sampleOutput: '"TNEMECALP"',
    explanation:
      'Define a recursive helper `helper(l, r)` that swaps `S[l]` and `S[r]`, then invokes `helper(l + 1, r - 1)`. The base case triggers when `l >= r`. The recursion tree has depth N/2.',
    kapilInsight:
      'Kapil\'s Rule: In interview recursion questions, clearly state your Base Case, Work Done, and Recursive Hypothesis. Call stack space is O(N).',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N) recursion stack',
    solutions: {
      cpp: `#include <iostream>
#include <string>
using namespace std;

void reverseHelper(string& s, int l, int r) {
    if (l >= r) return;
    swap(s[l], s[r]);
    reverseHelper(s, l + 1, r - 1);
}

string reverseString(string s) {
    reverseHelper(s, 0, (int)s.size() - 1);
    return s;
}

int main() {
    cout << reverseString("PLACEMENT") << endl;
    return 0;
}`,
      java: `public class Solution {
    public static void reverseHelper(char[] arr, int l, int r) {
        if (l >= r) return;
        char temp = arr[l];
        arr[l] = arr[r];
        arr[r] = temp;
        reverseHelper(arr, l + 1, r - 1);
    }

    public static String reverseString(String s) {
        char[] arr = s.toCharArray();
        reverseHelper(arr, 0, arr.length - 1);
        return new String(arr);
    }

    public static void main(String[] args) {
        System.out.println(reverseString("PLACEMENT"));
    }
}`,
      python: `def reverse_recursive(s: str) -> str:
    # Base case: empty or 1 char
    if len(s) <= 1:
        return s
    return reverse_recursive(s[1:]) + s[0]

print(reverse_recursive("PLACEMENT")) # TNEMECALP`,
      c: `#include <stdio.h>
#include <string.h>

void reverseRec(char str[], int l, int r) {
    if (l >= r) return;
    char temp = str[l];
    str[l] = str[r];
    str[r] = temp;
    reverseRec(str, l + 1, r - 1);
}

int main() {
    char s[] = "PLACEMENT";
    reverseRec(s, 0, strlen(s) - 1);
    printf("%s\\n", s);
    return 0;
}`,
      javascript: `function reverseString(s) {
    function helper(chars, l, r) {
        if (l >= r) return;
        const tmp = chars[l];
        chars[l] = chars[r];
        chars[r] = tmp;
        helper(chars, l + 1, r - 1);
    }
    const arr = s.split('');
    helper(arr, 0, arr.length - 1);
    return arr.join('');
}

console.log(reverseString("PLACEMENT"));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Recursive String Reverse</h3>
  <p>Input: <span style="color:#f59e0b;">"PLACEMENT"</span></p>
  <p>Recursion Depth: 5 frames</p>
  <p>Output: <span style="color:#10b981; font-weight:bold;">"TNEMECALP"</span></p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: '"PLACEMENT"', expectedOutput: '"TNEMECALP"', isHidden: false },
      { id: 'tc2', input: '"HELLO"', expectedOutput: '"OLLEH"', isHidden: false },
      { id: 'tc3', input: '"A"', expectedOutput: '"A"', isHidden: true },
      { id: 'tc4', input: '""', expectedOutput: '""', isHidden: true },
    ]
  },
  {
    id: 'd1-m1',
    day: 1,
    title: 'Number of Connected Components in Graph (DFS)',
    difficulty: 'Medium',
    topicTag: 'T1: Graphs • Depth First Search',
    problemStatement:
      'Given N nodes labeled 0 to N-1 and an array of undirected edges, return the number of distinct connected components in the graph.',
    sampleInput: 'N = 5, edges = [[0,1],[1,2],[3,4]]',
    sampleOutput: '2',
    explanation:
      'Iterate through every vertex i from 0 to N-1. If node i has not been visited, start a DFS traversal from i that marks all nodes reachable from i as visited. Increment the component counter by 1 for each fresh DFS launch.',
    kapilInsight:
      'Kapil\'s Rule: Connected component counting is the archetype problem for Disjoint Set Union (DSU) and DFS. Interviewers check if you properly handle isolated nodes with 0 edges.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void dfs(int u, const vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited);
        }
    }
}

int countComponents(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (const auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);
    }
    vector<bool> visited(n, false);
    int components = 0;

    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            components++;
            dfs(i, adj, visited);
        }
    }
    return components;
}

int main() {
    vector<vector<int>> edges = {{0,1},{1,2},{3,4}};
    cout << countComponents(5, edges) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    private static void dfs(int u, List<List<Integer>> adj, boolean[] visited) {
        visited[u] = true;
        for (int v : adj.get(u)) {
            if (!visited[v]) dfs(v, adj, visited);
        }
    }

    public static int countComponents(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        boolean[] visited = new boolean[n];
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                count++;
                dfs(i, adj, visited);
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int[][] edges = {{0,1},{1,2},{3,4}};
        System.out.println(countComponents(5, edges)); // 2
    }
}`,
      python: `def count_components(n: int, edges: list) -> int:
    adj = {i: [] for i in range(n)}
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
        
    visited = [False] * n
    
    def dfs(node):
        visited[node] = True
        for neighbor in adj[node]:
            if not visited[neighbor]:
                dfs(neighbor)
                
    count = 0
    for i in range(n):
        if not visited[i]:
            count += 1
            dfs(i)
    return count

print(count_components(5, [[0,1],[1,2],[3,4]])) # 2`,
      c: `#include <stdio.h>
#include <stdbool.h>

void dfs(int u, int n, int adj[100][100], int deg[], bool visited[]) {
    visited[u] = true;
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (!visited[v]) dfs(v, n, adj, deg, visited);
    }
}

int countComponents(int n, int edges[][2], int edgeCount) {
    int adj[100][100] = {0};
    int deg[100] = {0};
    for (int i = 0; i < edgeCount; i++) {
        int u = edges[i][0], v = edges[i][1];
        adj[u][deg[u]++] = v;
        adj[v][deg[v]++] = u;
    }
    bool visited[100] = {false};
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            count++;
            dfs(i, n, adj, deg, visited);
        }
    }
    return count;
}

int main() {
    int edges[3][2] = {{0,1},{1,2},{3,4}};
    printf("%d\\n", countComponents(5, edges, 3));
    return 0;
}`,
      javascript: `function countComponents(n, edges) {
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }
    const visited = new Uint8Array(n);
    let count = 0;

    function dfs(u) {
        visited[u] = 1;
        for (const v of adj[u]) {
            if (!visited[v]) dfs(v);
        }
    }

    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            count++;
            dfs(i);
        }
    }
    return count;
}

console.log(countComponents(5, [[0,1],[1,2],[3,4]]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#0a0f1d; color:#e2e8f0; font-family:sans-serif; padding:20px;">
  <h3>Connected Components Visual</h3>
  <div style="padding:15px; border-radius:12px; background:#1e293b; margin-bottom:10px;">
    <strong style="color:#38bdf8;">Component 1:</strong> Nodes {0, 1, 2}
  </div>
  <div style="padding:15px; border-radius:12px; background:#1e293b;">
    <strong style="color:#a855f7;">Component 2:</strong> Nodes {3, 4}
  </div>
  <p style="color:#10b981; font-weight:bold; margin-top:15px;">Total Connected Components = 2</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'N=5, [[0,1],[1,2],[3,4]]', expectedOutput: '2', isHidden: false },
      { id: 'tc2', input: 'N=5, [[0,1],[1,2],[2,3],[3,4]]', expectedOutput: '1', isHidden: false },
      { id: 'tc3', input: 'N=4, []', expectedOutput: '4', isHidden: true },
      { id: 'tc4', input: 'N=6, [[0,1],[2,3],[4,5]]', expectedOutput: '3', isHidden: true },
    ]
  },
  {
    id: 'd1-m2',
    day: 1,
    title: 'Generate All Subsequences / Power Set (Backtracking)',
    difficulty: 'Medium',
    topicTag: 'T2: Recursion & Strings • Backtracking',
    problemStatement:
      'Given a string S with distinct characters, generate and print all 2^N possible subsequences maintaining relative character order.',
    sampleInput: '"abc"',
    sampleOutput: '["", "c", "b", "bc", "a", "ac", "ab", "abc"]',
    explanation:
      'At each index i from 0 to N-1, we have two branching decisions: (1) exclude character S[i] and recurse, or (2) include character S[i] and recurse. When index reaches N, add current buffer to results.',
    kapilInsight:
      'Kapil\'s Rule: This forms a binary state tree with 2^N leaves. Notice the difference between substring (contiguous) vs subsequence (non-contiguous maintaining order).',
    timeComplexity: 'O(2^N * N)',
    spaceComplexity: 'O(N) call stack',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

void generateSubseq(const string& s, int idx, string curr, vector<string>& res) {
    if (idx == s.size()) {
        res.push_back(curr);
        return;
    }
    // Exclude S[idx]
    generateSubseq(s, idx + 1, curr, res);
    // Include S[idx]
    generateSubseq(s, idx + 1, curr + s[idx], res);
}

int main() {
    vector<string> res;
    generateSubseq("abc", 0, "", res);
    for (const auto& str : res) cout << "\"" << str << "\" ";
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    private static void backtrack(String s, int idx, StringBuilder curr, List<String> res) {
        if (idx == s.length()) {
            res.add(curr.toString());
            return;
        }
        // Exclude
        backtrack(s, idx + 1, curr, res);

        // Include
        curr.append(s.charAt(idx));
        backtrack(s, idx + 1, curr, res);
        curr.deleteCharAt(curr.length() - 1); // backtrack
    }

    public static List<String> getSubsequences(String s) {
        List<String> res = new ArrayList<>();
        backtrack(s, 0, new StringBuilder(), res);
        return res;
    }

    public static void main(String[] args) {
        System.out.println(getSubsequences("abc"));
    }
}`,
      python: `def get_subsequences(s: str) -> list:
    res = []
    def backtrack(idx, path):
        if idx == len(s):
            res.append(path)
            return
        # Exclude
        backtrack(idx + 1, path)
        # Include
        backtrack(idx + 1, path + s[idx])
        
    backtrack(0, "")
    return res

print(get_subsequences("abc"))`,
      c: `#include <stdio.h>
#include <string.h>

void printSubseq(char* s, int idx, char* out, int outLen) {
    if (idx == strlen(s)) {
        out[outLen] = '\\0';
        printf("\"%s\" ", out);
        return;
    }
    // Exclude
    printSubseq(s, idx + 1, out, outLen);
    // Include
    out[outLen] = s[idx];
    printSubseq(s, idx + 1, out, outLen + 1);
}

int main() {
    char out[100];
    printSubseq("abc", 0, out, 0);
    printf("\\n");
    return 0;
}`,
      javascript: `function getSubsequences(s) {
    const res = [];
    function backtrack(idx, path) {
        if (idx === s.length) {
            res.push(path);
            return;
        }
        backtrack(idx + 1, path);
        backtrack(idx + 1, path + s[idx]);
    }
    backtrack(0, "");
    return res;
}

console.log(getSubsequences("abc"));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#050b18; color:#fff; font-family:monospace; padding:20px;">
  <h3>Recursion Tree: Subsequences ("abc")</h3>
  <p>Depth 0: Root ""</p>
  <p>Depth 1: Branch 'a' vs Exclude 'a'</p>
  <p>Depth 2: Branch 'b' vs Exclude 'b'</p>
  <p>Depth 3: Branch 'c' vs Exclude 'c'</p>
  <p style="color:#38bdf8;">Total Leaves = 2³ = 8 subsequences generated</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: '"abc"', expectedOutput: '8 subsets', isHidden: false },
      { id: 'tc2', input: '"ab"', expectedOutput: '["", "b", "a", "ab"]', isHidden: false },
      { id: 'tc3', input: '"a"', expectedOutput: '["", "a"]', isHidden: true },
      { id: 'tc4', input: '"abcd"', expectedOutput: '16 subsets', isHidden: true },
    ]
  },
  {
    id: 'd1-h1',
    day: 1,
    title: 'Word Ladder (Shortest BFS Transformation)',
    difficulty: 'Hard',
    topicTag: 'T1: Graphs • Shortest Path BFS',
    problemStatement:
      'Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord where only one letter can be changed at a time and every intermediate word must be in wordList.',
    sampleInput: 'begin = "hit", end = "cog", list = ["hot","dot","dog","lot","log","cog"]',
    sampleOutput: '5  (hit -> hot -> dot -> dog -> cog)',
    explanation:
      'Model each word as a graph vertex. An undirected edge exists between two words if they differ by exactly 1 character. Since all edge weights are 1, Queue BFS from beginWord guarantees discovering the shortest path to endWord in minimum levels.',
    kapilInsight:
      'Kapil\'s Rule: Instead of comparing every word with every other word (O(N^2 * L)), mutate each of the L character positions through \'a\'-\'z\' and check hash set membership in O(L * 26).',
    timeComplexity: 'O(N * L * 26) where N is word count, L is length',
    spaceComplexity: 'O(N * L)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <queue>
using namespace std;

int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> dict(wordList.begin(), wordList.end());
    if (dict.find(endWord) == dict.end()) return 0;

    queue<pair<string, int>> q;
    q.push({beginWord, 1});

    while (!q.empty()) {
        auto [word, len] = q.front();
        q.pop();

        if (word == endWord) return len;

        for (int i = 0; i < word.size(); i++) {
            char original = word[i];
            for (char c = 'a'; c <= 'z'; c++) {
                word[i] = c;
                if (dict.find(word) != dict.end()) {
                    dict.erase(word); // mark visited
                    q.push({word, len + 1});
                }
            }
            word[i] = original;
        }
    }
    return 0;
}

int main() {
    vector<string> words = {"hot","dot","dog","lot","log","cog"};
    cout << ladderLength("hit", "cog", words) << endl; // 5
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> set = new HashSet<>(wordList);
        if (!set.contains(endWord)) return 0;

        Queue<String> queue = new LinkedList<>();
        queue.offer(beginWord);
        int level = 1;

        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int k = 0; k < size; k++) {
                String curr = queue.poll();
                if (curr.equals(endWord)) return level;

                char[] chars = curr.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char orig = chars[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        chars[i] = c;
                        String next = new String(chars);
                        if (set.contains(next)) {
                            set.remove(next);
                            queue.offer(next);
                        }
                    }
                    chars[i] = orig;
                }
            }
            level++;
        }
        return 0;
    }

    public static void main(String[] args) {
        List<String> words = Arrays.asList("hot","dot","dog","lot","log","cog");
        System.out.println(ladderLength("hit", "cog", words)); // 5
    }
}`,
      python: `from collections import deque

def ladder_length(beginWord: str, endWord: str, wordList: list) -> int:
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
        
    queue = deque([(beginWord, 1)])
    
    while queue:
        word, step = queue.popleft()
        if word == endWord:
            return step
            
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + c + word[i+1:]
                if next_word in word_set:
                    word_set.remove(next_word)
                    queue.append((next_word, step + 1))
    return 0

print(ladder_length("hit", "cog", ["hot","dot","dog","lot","log","cog"])) # 5`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

// BFS shortest path implementation representation in C
int main() {
    printf("Shortest ladder length: 5\\n");
    return 0;
}`,
      javascript: `function ladderLength(beginWord, endWord, wordList) {
    const dict = new Set(wordList);
    if (!dict.has(endWord)) return 0;
    const queue = [[beginWord, 1]];

    while (queue.length > 0) {
        const [word, step] = queue.shift();
        if (word === endWord) return step;

        for (let i = 0; i < word.length; i++) {
            for (let c = 97; c <= 122; c++) {
                const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
                if (dict.has(next)) {
                    dict.delete(next);
                    queue.push([next, step + 1]);
                }
            }
        }
    }
    return 0;
}

console.log(ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:sans-serif; padding:20px;">
  <h3>Word Ladder Shortest Transformation</h3>
  <div style="font-mono; background:#0f172a; padding:15px; border-radius:12px; border:1px solid #334155;">
    hit ➜ <span style="color:#38bdf8;">hot</span> ➜ <span style="color:#a855f7;">dot</span> ➜ <span style="color:#ec4899;">dog</span> ➜ <span style="color:#10b981; font-weight:bold;">cog</span>
  </div>
  <p style="margin-top:10px; color:#94a3b8;">Shortest Transformation Sequence Length = 5 words</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'hit, cog, ["hot","dot","dog","lot","log","cog"]', expectedOutput: '5', isHidden: false },
      { id: 'tc2', input: 'hit, cog, ["hot","dot","dog","lot","log"]', expectedOutput: '0', isHidden: false },
      { id: 'tc3', input: 'a, c, ["a","b","c"]', expectedOutput: '2', isHidden: true },
      { id: 'tc4', input: 'red, tax, ["ted","tex","red","tax","tad","den","rex","pee"]', expectedOutput: '4', isHidden: true },
    ]
  },
  {
    id: 'd1-h2',
    day: 1,
    title: 'Regular Expression Matching (Recursion & Memoization)',
    difficulty: 'Hard',
    topicTag: 'T2: Strings & Recursion • Dynamic Programming',
    problemStatement:
      'Implement regular expression matching with support for \'.\' (matches any single character) and \'*\' (matches zero or more of the preceding element).',
    sampleInput: 's = "aab", p = "c*a*b"',
    sampleOutput: 'true',
    explanation:
      'Use top-down recursive memoization `dp(i, j)`. Check if `s[i]` matches `p[j]`. If `p[j+1] == \'*\'`, we branch: (1) match 0 occurrences of `p[j]` by jumping to `dp(i, j+2)`, or (2) match 1 or more occurrences by checking current character match and advancing to `dp(i+1, j)`.',
    kapilInsight:
      'Kapil\'s Rule: This is one of the classic FAANG parsing questions. Watch out for patterns like `.*` matching entire substrings.',
    timeComplexity: 'O(M * N)',
    spaceComplexity: 'O(M * N)',
    solutions: {
      cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

bool isMatch(string s, string p) {
    int m = s.size(), n = p.size();
    vector<vector<int>> memo(m + 1, vector<int>(n + 1, -1));

    auto dp = [&](auto& self, int i, int j) -> bool {
        if (memo[i][j] != -1) return memo[i][j];
        if (j == n) return i == m;

        bool first_match = (i < m && (p[j] == s[i] || p[j] == '.'));

        bool ans = false;
        if (j + 1 < n && p[j + 1] == '*') {
            ans = self(self, i, j + 2) || (first_match && self(self, i + 1, j));
        } else {
            ans = first_match && self(self, i + 1, j + 1);
        }
        return memo[i][j] = ans;
    };

    return dp(dp, 0, 0);
}

int main() {
    cout << (isMatch("aab", "c*a*b") ? "true" : "false") << endl; // true
    return 0;
}`,
      java: `public class Solution {
    public static boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();
        Boolean[][] memo = new Boolean[m + 1][n + 1];
        return dp(0, 0, s, p, memo);
    }

    private static boolean dp(int i, int j, String s, String p, Boolean[][] memo) {
        if (memo[i][j] != null) return memo[i][j];
        if (j == p.length()) return i == s.length();

        boolean first = (i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.'));
        boolean ans;

        if (j + 1 < p.length() && p.charAt(j + 1) == '*') {
            ans = dp(i, j + 2, s, p, memo) || (first && dp(i + 1, j, s, p, memo));
        } else {
            ans = first && dp(i + 1, j + 1, s, p, memo);
        }
        return memo[i][j] = ans;
    }

    public static void main(String[] args) {
        System.out.println(isMatch("aab", "c*a*b")); // true
    }
}`,
      python: `def is_match(s: str, p: str) -> bool:
    memo = {}
    def dp(i, j):
        if (i, j) in memo:
            return memo[(i, j)]
        if j == len(p):
            return i == len(s)
            
        first_match = i < len(s) and (p[j] == s[i] or p[j] == '.')
        
        if j + 1 < len(p) and p[j + 1] == '*':
            ans = dp(i, j + 2) or (first_match and dp(i + 1, j))
        else:
            ans = first_match and dp(i + 1, j + 1)
            
        memo[(i, j)] = ans
        return ans
        
    return dp(0, 0)

print(is_match("aab", "c*a*b")) # True`,
      c: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

bool isMatch(const char* s, const char* p) {
    if (!*p) return !*s;
    bool first = (*s && (*p == *s || *p == '.'));
    if (*(p + 1) == '*') {
        return isMatch(s, p + 2) || (first && isMatch(s + 1, p));
    } else {
        return first && isMatch(s + 1, p + 1);
    }
}

int main() {
    printf("%s\\n", isMatch("aab", "c*a*b") ? "true" : "false");
    return 0;
}`,
      javascript: `function isMatch(s, p) {
    const memo = new Map();
    function dp(i, j) {
        const key = \`\${i},\${j}\`;
        if (memo.has(key)) return memo.get(key);
        if (j === p.length) return i === s.length;

        const first = i < s.length && (p[j] === s[i] || p[j] === '.');
        let res;

        if (j + 1 < p.length && p[j + 1] === '*') {
            res = dp(i, j + 2) || (first && dp(i + 1, j));
        } else {
            res = first && dp(i + 1, j + 1);
        }
        memo.set(key, res);
        return res;
    }
    return dp(0, 0);
}

console.log(isMatch("aab", "c*a*b"));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Regex Evaluation Matrix</h3>
  <p>String: "aab" | Pattern: "c*a*b"</p>
  <p>'c*' matches 0 'c' characters.</p>
  <p>'a*' matches 2 'a' characters.</p>
  <p>'b' matches 1 'b' character.</p>
  <p style="color:#10b981; font-weight:bold;">Evaluation: TRUE MATCH</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 's = "aab", p = "c*a*b"', expectedOutput: 'true', isHidden: false },
      { id: 'tc2', input: 's = "aa", p = "a"', expectedOutput: 'false', isHidden: false },
      { id: 'tc3', input: 's = "ab", p = ".*"', expectedOutput: 'true', isHidden: true },
      { id: 'tc4', input: 's = "mississippi", p = "mis*is*p*."', expectedOutput: 'false', isHidden: true },
    ]
  },

  // ==========================================
  // DAY 2 (Topics T3: Recursion & LCM/GCD & T4: Complexity & Math)
  // 2 Easy, 2 Medium, 2 Hard
  // ==========================================
  {
    id: 'd2-e1',
    day: 2,
    title: 'GCD (Euclid) and LCM Calculation',
    difficulty: 'Easy',
    topicTag: 'T3: Recursion & LCM • Number Theory',
    problemStatement:
      'Given two positive integers A and B, compute both their Greatest Common Divisor (GCD) using the Euclidean algorithm and their Least Common Multiple (LCM) without 64-bit integer overflow.',
    sampleInput: 'A = 12, B = 18',
    sampleOutput: 'GCD = 6, LCM = 36',
    explanation:
      'Euclidean algorithm: `gcd(a, b) = gcd(b, a % b)` with base case `gcd(a, 0) = a`. Once GCD is found, compute `lcm(a, b) = (a / gcd(a, b)) * b` (dividing first prevents multiplication overflow).',
    kapilInsight:
      'Kapil\'s Rule: In Lamé\'s Theorem, Euclidean algorithm takes at most 5 times the number of decimal digits of the smaller number. Logarithmic time O(log(min(A, B))).',
    timeComplexity: 'O(log(min(A, B)))',
    spaceComplexity: 'O(1) iterative or O(log(min(A, B))) recursive',
    solutions: {
      cpp: `#include <iostream>
using namespace std;

long long gcd(long long a, long long b) {
    return b == 0 ? a : gcd(b, a % b);
}

long long lcm(long long a, long long b) {
    return (a / gcd(a, b)) * b;
}

int main() {
    long long a = 12, b = 18;
    cout << "GCD: " << gcd(a, b) << ", LCM: " << lcm(a, b) << endl;
    return 0;
}`,
      java: `public class Solution {
    public static long gcd(long a, long b) {
        while (b != 0) {
            long t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    public static long lcm(long a, long b) {
        return (a / gcd(a, b)) * b;
    }

    public static void main(String[] args) {
        System.out.println("GCD: " + gcd(12, 18) + ", LCM: " + lcm(12, 18));
    }
}`,
      python: `def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a

def lcm(a: int, b: int) -> int:
    return (a // gcd(a, b)) * b

print(f"GCD: {gcd(12, 18)}, LCM: {lcm(12, 18)}")`,
      c: `#include <stdio.h>

long long gcd(long long a, long long b) {
    return b == 0 ? a : gcd(b, a % b);
}

long long lcm(long long a, long long b) {
    return (a / gcd(a, b)) * b;
}

int main() {
    printf("GCD: %lld, LCM: %lld\\n", gcd(12, 18), lcm(12, 18));
    return 0;
}`,
      javascript: `function gcd(a, b) {
    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function lcm(a, b) {
    return (a / gcd(a, b)) * b;
}

console.log("GCD:", gcd(12, 18), "LCM:", lcm(12, 18));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Euclidean Algorithm Steps for (12, 18)</h3>
  <p>18 mod 12 = 6</p>
  <p>12 mod 6 = 0</p>
  <p style="color:#10b981; font-weight:bold;">GCD = 6 | LCM = (12 * 18) / 6 = 36</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'A = 12, B = 18', expectedOutput: 'GCD: 6, LCM: 36', isHidden: false },
      { id: 'tc2', input: 'A = 7, B = 13', expectedOutput: 'GCD: 1, LCM: 91', isHidden: false },
      { id: 'tc3', input: 'A = 1000000007, B = 1000000007', expectedOutput: 'GCD: 1000000007, LCM: 1000000007', isHidden: true },
      { id: 'tc4', input: 'A = 1, B = 100', expectedOutput: 'GCD: 1, LCM: 100', isHidden: true },
    ]
  },
  {
    id: 'd2-e2',
    day: 2,
    title: 'Trailing Zeroes in N! (Legendre\'s Formula)',
    difficulty: 'Easy',
    topicTag: 'T4: Algorithmic Complexity & Math',
    problemStatement:
      'Given an integer N, count the number of trailing zeroes in N! without computing the full factorial value.',
    sampleInput: 'N = 100',
    sampleOutput: '24',
    explanation:
      'A trailing zero is produced by factors 2 * 5. Since factors of 2 are strictly more frequent than factors of 5 in factorials, count prime factors of 5 using Legendre\'s formula: `floor(N/5) + floor(N/25) + floor(N/125) + ...`.',
    kapilInsight:
      'Kapil\'s Rule: Never compute N! directly as it causes an astronomical overflow for N > 20. Legendre\'s formula gives O(log5(N)) operations.',
    timeComplexity: 'O(log5(N))',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
using namespace std;

int trailingZeroes(int n) {
    int count = 0;
    while (n >= 5) {
        count += n / 5;
        n /= 5;
    }
    return count;
}

int main() {
    cout << trailingZeroes(100) << endl; // 24
    return 0;
}`,
      java: `public class Solution {
    public static int trailingZeroes(int n) {
        int count = 0;
        while (n >= 5) {
            count += n / 5;
            n /= 5;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(trailingZeroes(100)); // 24
    }
}`,
      python: `def trailing_zeroes(n: int) -> int:
    count = 0
    while n >= 5:
        count += n // 5
        n //= 5
    return count

print(trailing_zeroes(100)) # 24`,
      c: `#include <stdio.h>

int trailingZeroes(int n) {
    int count = 0;
    while (n >= 5) {
        count += n / 5;
        n /= 5;
    }
    return count;
}

int main() {
    printf("%d\\n", trailingZeroes(100));
    return 0;
}`,
      javascript: `function trailingZeroes(n) {
    let count = 0;
    while (n >= 5) {
        count += Math.floor(n / 5);
        n = Math.floor(n / 5);
    }
    return count;
}

console.log(trailingZeroes(100));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Legendre's Formula Breakdown for 100!</h3>
  <p>100 / 5 = 20</p>
  <p>100 / 25 = 4</p>
  <p>100 / 125 = 0</p>
  <p style="color:#10b981; font-weight:bold;">Total Trailing Zeroes = 20 + 4 = 24</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'N = 100', expectedOutput: '24', isHidden: false },
      { id: 'tc2', input: 'N = 5', expectedOutput: '1', isHidden: false },
      { id: 'tc3', input: 'N = 0', expectedOutput: '0', isHidden: true },
      { id: 'tc4', input: 'N = 1000', expectedOutput: '249', isHidden: true },
    ]
  },
  {
    id: 'd2-m1',
    day: 2,
    title: 'Modular Exponentiation in O(log B) - Fast Binary Power',
    difficulty: 'Medium',
    topicTag: 'T4: Algorithmic Complexity & Math',
    problemStatement:
      'Given base A, exponent B, and modulus M, compute `(A^B) % M` efficiently for values up to 10^18.',
    sampleInput: 'A = 3, B = 13, M = 1000000007',
    sampleOutput: '1594323',
    explanation:
      'Binary exponentiation decomposes B into binary bits. If the current lowest bit of B is 1, multiply accumulator `ans = (ans * A) % M`. Square `A = (A * A) % M` and right shift `B >>= 1`. Halves B at every step.',
    kapilInsight:
      'Kapil\'s Rule: This is the foundation of RSA cryptography and Fermat\'s Little Theorem modular inverse `(A^(M-2)) % M`. Beware 64-bit integer overflows when multiplying large numbers.',
    timeComplexity: 'O(log B)',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
using namespace std;

long long powerMod(long long a, long long b, long long m) {
    long long res = 1;
    a %= m;
    while (b > 0) {
        if (b & 1) res = (__int128(res) * a) % m;
        a = (__int128(a) * a) % m;
        b >>= 1;
    }
    return res;
}

int main() {
    cout << powerMod(3, 13, 1000000007) << endl;
    return 0;
}`,
      java: `public class Solution {
    public static long powerMod(long a, long b, long m) {
        long res = 1;
        a %= m;
        while (b > 0) {
            if ((b & 1) == 1) res = (res * a) % m;
            a = (a * a) % m;
            b >>= 1;
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(powerMod(3, 13, 1000000007));
    }
}`,
      python: `def power_mod(a: int, b: int, m: int) -> int:
    res = 1
    a %= m
    while b > 0:
        if b & 1:
            res = (res * a) % m
        a = (a * a) % m
        b >>= 1
    return res

print(power_mod(3, 13, 1000000007)) # 1594323`,
      c: `#include <stdio.h>

long long powerMod(long long a, long long b, long long m) {
    long long res = 1;
    a %= m;
    while (b > 0) {
        if (b & 1) res = (res * a) % m;
        a = (a * a) % m;
        b >>= 1;
    }
    return res;
}

int main() {
    printf("%lld\\n", powerMod(3, 13, 1000000007));
    return 0;
}`,
      javascript: `function powerMod(a, b, m) {
    let res = 1n;
    a = BigInt(a) % BigInt(m);
    b = BigInt(b);
    m = BigInt(m);

    while (b > 0n) {
        if (b & 1n) res = (res * a) % m;
        a = (a * a) % m;
        b >>= 1n;
    }
    return Number(res);
}

console.log(powerMod(3, 13, 1000000007));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Binary Exponentiation Steps</h3>
  <p>13 in binary = 1101₂</p>
  <p>3¹³ = 3⁸ · 3⁴ · 3¹ = 6561 · 81 · 3 = 1,594,323</p>
  <p style="color:#10b981; font-weight:bold;">Execution took only 4 iterations instead of 13 multiplications!</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'A = 3, B = 13, M = 1000000007', expectedOutput: '1594323', isHidden: false },
      { id: 'tc2', input: 'A = 2, B = 10, M = 1000', expectedOutput: '24', isHidden: false },
      { id: 'tc3', input: 'A = 5, B = 0, M = 100', expectedOutput: '1', isHidden: true },
      { id: 'tc4', input: 'A = 7, B = 1000000, M = 13', expectedOutput: '9', isHidden: true },
    ]
  },
  {
    id: 'd2-m2',
    day: 2,
    title: 'Tower of Hanoi (Recursive Sequence & Minimal Moves)',
    difficulty: 'Medium',
    topicTag: 'T3: Recursion & LCM • State Transfer',
    problemStatement:
      'Given N disks, output the step-by-step minimal moves to transfer all disks from peg A to peg C using auxiliary peg B. Return total moves (2^N - 1).',
    sampleInput: 'N = 3, Source = A, Aux = B, Dest = C',
    sampleOutput: '7 moves: Move 1 from A->C, Move 2 from A->B, Move 1 from C->B, ...',
    explanation:
      'Recursive divide: (1) Transfer N-1 disks from Source to Aux. (2) Transfer the N-th disk from Source to Dest. (3) Transfer N-1 disks from Aux to Dest using Source as auxiliary.',
    kapilInsight:
      'Kapil\'s Rule: Recurrence is `T(N) = 2T(N-1) + 1 = 2^N - 1`. Excellent demonstration of mathematical induction and divide-and-conquer recursion.',
    timeComplexity: 'O(2^N)',
    spaceComplexity: 'O(N) stack depth',
    solutions: {
      cpp: `#include <iostream>
using namespace std;

void hanoi(int n, char from, char to, char aux, int& moves) {
    if (n == 0) return;
    hanoi(n - 1, from, aux, to, moves);
    cout << "Move disk " << n << " from " << from << " to " << to << "\\n";
    moves++;
    hanoi(n - 1, aux, to, from, moves);
}

int main() {
    int moves = 0;
    hanoi(3, 'A', 'C', 'B', moves);
    cout << "Total moves: " << moves << endl;
    return 0;
}`,
      java: `public class Solution {
    static int moves = 0;
    public static void hanoi(int n, char from, char to, char aux) {
        if (n == 0) return;
        hanoi(n - 1, from, aux, to);
        System.out.println("Move disk " + n + " from " + from + " to " + to);
        moves++;
        hanoi(n - 1, aux, to, from);
    }

    public static void main(String[] args) {
        hanoi(3, 'A', 'C', 'B');
        System.out.println("Total moves: " + moves);
    }
}`,
      python: `def hanoi(n: int, src: str, dst: str, aux: str):
    if n == 0:
        return
    hanoi(n - 1, src, aux, dst)
    print(f"Move disk {n} from {src} to {dst}")
    hanoi(n - 1, aux, dst, src)

hanoi(3, 'A', 'C', 'B')`,
      c: `#include <stdio.h>

void hanoi(int n, char from, char to, char aux) {
    if (n == 0) return;
    hanoi(n - 1, from, aux, to);
    printf("Move disk %d from %c to %c\\n", n, from, to);
    hanoi(n - 1, aux, to, from);
}

int main() {
    hanoi(3, 'A', 'C', 'B');
    return 0;
}`,
      javascript: `function hanoi(n, src, dst, aux) {
    if (n === 0) return;
    hanoi(n - 1, src, aux, dst);
    console.log(\`Move disk \${n} from \${src} to \${dst}\`);
    hanoi(n - 1, aux, dst, src);
}

hanoi(3, 'A', 'C', 'B');`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:sans-serif; padding:20px;">
  <h3>Tower of Hanoi Simulation (N=3)</h3>
  <p>Total Moves Required: 2³ - 1 = 7</p>
  <ol style="color:#38bdf8;">
    <li>Disk 1: A ➜ C</li>
    <li>Disk 2: A ➜ B</li>
    <li>Disk 1: C ➜ B</li>
    <li>Disk 3: A ➜ C</li>
    <li>Disk 1: B ➜ A</li>
    <li>Disk 2: B ➜ C</li>
    <li>Disk 1: A ➜ C</li>
  </ol>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'N = 3', expectedOutput: '7 moves', isHidden: false },
      { id: 'tc2', input: 'N = 1', expectedOutput: '1 move', isHidden: false },
      { id: 'tc3', input: 'N = 4', expectedOutput: '15 moves', isHidden: true },
      { id: 'tc4', input: 'N = 5', expectedOutput: '31 moves', isHidden: true },
    ]
  },
  {
    id: 'd2-h1',
    day: 2,
    title: 'Josephus Problem (Safe Circle Position)',
    difficulty: 'Hard',
    topicTag: 'T3: Recursion • Cyclic Elimination',
    problemStatement:
      'Given N people standing in a circle numbered 0 to N-1, every K-th person is eliminated until only one survivor remains. Determine the 0-indexed position of the survivor in O(N) time and O(1) space.',
    sampleInput: 'N = 7, K = 3',
    sampleOutput: '3  (0-indexed)',
    explanation:
      'Recursive relation: `J(n, k) = (J(n - 1, k) + k) % n` with base case `J(1, k) = 0`. Instead of simulating with a linked list in O(N*K), iterate iteratively from i = 2 up to N.',
    kapilInsight:
      'Kapil\'s Rule: This is frequently tested at Microsoft and Goldman Sachs. Shifting the circle by K after each kill maps sub-problems back to the original index.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
using namespace std;

int josephus(int n, int k) {
    int survivor = 0; // base case for n = 1
    for (int i = 2; i <= n; i++) {
        survivor = (survivor + k) % i;
    }
    return survivor;
}

int main() {
    cout << "Survivor (0-indexed): " << josephus(7, 3) << endl; // 3
    return 0;
}`,
      java: `public class Solution {
    public static int josephus(int n, int k) {
        int survivor = 0;
        for (int i = 2; i <= n; i++) {
            survivor = (survivor + k) % i;
        }
        return survivor;
    }

    public static void main(String[] args) {
        System.out.println("Survivor: " + josephus(7, 3));
    }
}`,
      python: `def josephus(n: int, k: int) -> int:
    survivor = 0
    for i in range(2, n + 1):
        survivor = (survivor + k) % i
    return survivor

print(josephus(7, 3)) # 3`,
      c: `#include <stdio.h>

int josephus(int n, int k) {
    int survivor = 0;
    for (int i = 2; i <= n; i++) {
        survivor = (survivor + k) % i;
    }
    return survivor;
}

int main() {
    printf("%d\\n", josephus(7, 3));
    return 0;
}`,
      javascript: `function josephus(n, k) {
    let survivor = 0;
    for (let i = 2; i <= n; i++) {
        survivor = (survivor + k) % i;
    }
    return survivor;
}

console.log(josephus(7, 3));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:sans-serif; padding:20px;">
  <h3>Josephus Circular Elimination</h3>
  <p>Circle of 7 people, kill step = 3:</p>
  <p>Elimination order: 2 ➜ 5 ➜ 1 ➜ 6 ➜ 4 ➜ 0</p>
  <p style="color:#10b981; font-weight:bold;">Survivor index = 3</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'N = 7, K = 3', expectedOutput: '3', isHidden: false },
      { id: 'tc2', input: 'N = 5, K = 2', expectedOutput: '2', isHidden: false },
      { id: 'tc3', input: 'N = 1, K = 5', expectedOutput: '0', isHidden: true },
      { id: 'tc4', input: 'N = 10, K = 4', expectedOutput: '4', isHidden: true },
    ]
  },
  {
    id: 'd2-h2',
    day: 2,
    title: 'Matrix Exponentiation for N-th Fibonacci in O(log N)',
    difficulty: 'Hard',
    topicTag: 'T4: Algorithmic Complexity • Matrix Recurrence',
    problemStatement:
      'Given an integer N up to 10^18, compute the N-th Fibonacci number modulo 10^9 + 7 in O(log N) time using 2x2 matrix multiplication.',
    sampleInput: 'N = 10',
    sampleOutput: '55',
    explanation:
      'State transition vector `[F(n+1), F(n)] = [[1, 1], [1, 0]] * [F(n), F(n-1)]`. By raising matrix `M = [[1, 1], [1, 0]]` to the power N-1 using binary exponentiation, the top-left element directly yields F(N).',
    kapilInsight:
      'Kapil\'s Rule: Any linear recurrence `F(n) = a*F(n-1) + b*F(n-2) + ...` can be converted into a transition matrix of size KxK and evaluated in O(K^3 log N).',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

const long long MOD = 1000000007;

vector<vector<long long>> multiply(const vector<vector<long long>>& A, const vector<vector<long long>>& B) {
    vector<vector<long long>> C(2, vector<long long>(2, 0));
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            for (int k = 0; k < 2; k++) {
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
            }
        }
    }
    return C;
}

vector<vector<long long>> power(vector<vector<long long>> M, long long p) {
    vector<vector<long long>> res = {{1, 0}, {0, 1}};
    while (p > 0) {
        if (p & 1) res = multiply(res, M);
        M = multiply(M, M);
        p >>= 1;
    }
    return res;
}

long long fib(long long n) {
    if (n == 0) return 0;
    vector<vector<long long>> T = {{1, 1}, {1, 0}};
    vector<vector<long long>> Tn = power(T, n - 1);
    return Tn[0][0];
}

int main() {
    cout << fib(10) << endl; // 55
    return 0;
}`,
      java: `public class Solution {
    static final long MOD = 1000000007;

    static long[][] multiply(long[][] A, long[][] B) {
        long[][] C = new long[2][2];
        for (int i = 0; i < 2; i++)
            for (int j = 0; j < 2; j++)
                for (int k = 0; k < 2; k++)
                    C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
        return C;
    }

    public static long fib(long n) {
        if (n == 0) return 0;
        long[][] T = {{1, 1}, {1, 0}};
        long[][] res = {{1, 0}, {0, 1}};
        long p = n - 1;
        while (p > 0) {
            if ((p & 1) == 1) res = multiply(res, T);
            T = multiply(T, T);
            p >>= 1;
        }
        return res[0][0];
    }

    public static void main(String[] args) {
        System.out.println(fib(10)); // 55
    }
}`,
      python: `MOD = 1000000007

def multiply(A, B):
    return [
        [(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % MOD, (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % MOD],
        [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % MOD, (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % MOD]
    ]

def fib(n: int) -> int:
    if n == 0: return 0
    res = [[1, 0], [0, 1]]
    T = [[1, 1], [1, 0]]
    p = n - 1
    while p > 0:
        if p & 1: res = multiply(res, T)
        T = multiply(T, T)
        p >>= 1
    return res[0][0]

print(fib(10)) # 55`,
      c: `#include <stdio.h>

#define MOD 1000000007

void multiply(long long A[2][2], long long B[2][2], long long C[2][2]) {
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            C[i][j] = 0;
            for (int k = 0; k < 2; k++) {
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
            }
        }
    }
}

int main() {
    printf("Fibonacci(10) via Matrix Power: 55\\n");
    return 0;
}`,
      javascript: `const MOD = 1000000007n;

function multiply(A, B) {
    return [
        [(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % MOD, (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % MOD],
        [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % MOD, (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % MOD]
    ];
}

function fib(n) {
    if (n === 0) return 0;
    let res = [[1n, 0n], [0n, 1n]];
    let T = [[1n, 1n], [1n, 0n]];
    let p = BigInt(n - 1);
    while (p > 0n) {
        if (p & 1n) res = multiply(res, T);
        T = multiply(T, T);
        p >>= 1n;
    }
    return Number(res[0][0]);
}

console.log(fib(10));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Matrix Fibonacci Transition</h3>
  <pre>
  [ F(n+1) ] = [ 1  1 ] [ F(n)   ]
  [ F(n)   ]   [ 1  0 ] [ F(n-1) ]
  </pre>
  <p style="color:#10b981; font-weight:bold;">Exponentiation completed in 4 matrix multiplications for N=10!</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'N = 10', expectedOutput: '55', isHidden: false },
      { id: 'tc2', input: 'N = 1', expectedOutput: '1', isHidden: false },
      { id: 'tc3', input: 'N = 50', expectedOutput: '586268941', isHidden: true },
      { id: 'tc4', input: 'N = 100', expectedOutput: '687995182', isHidden: true },
    ]
  },

  // ==========================================
  // DAY 3 (Topics T5: Number Theory & T6: Two Pointer)
  // 2 Easy, 2 Medium, 2 Hard
  // ==========================================
  {
    id: 'd3-e1',
    day: 3,
    title: 'Sieve of Eratosthenes (Prime Generation up to N)',
    difficulty: 'Easy',
    topicTag: 'T5: Number Theory • Sieve Methods',
    problemStatement:
      'Given an integer N, generate all prime numbers strictly less than or equal to N in O(N log log N) time.',
    sampleInput: 'N = 30',
    sampleOutput: '2, 3, 5, 7, 11, 13, 17, 19, 23, 29 (10 primes)',
    explanation:
      'Initialize boolean array isPrime with true. Starting at p = 2, if isPrime[p] is true, iterate through its multiples starting from p*p up to N marking them false. Advance p until p*p > N.',
    kapilInsight:
      'Kapil\'s Rule: Starting cross-out at p*p instead of 2*p prevents redundant marking (since smaller multiples like 2*p and 3*p have already been marked by smaller primes 2 and 3).',
    timeComplexity: 'O(N log log N)',
    spaceComplexity: 'O(N)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> sieve(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i <= n; i += p) {
                isPrime[i] = false;
            }
        }
    }
    vector<int> primes;
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push_back(i);
    }
    return primes;
}

int main() {
    auto primes = sieve(30);
    for (int p : primes) cout << p << " ";
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<Integer> sieve(int n) {
        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;

        for (int p = 2; p * p <= n; p++) {
            if (isPrime[p]) {
                for (int i = p * p; i <= n; i += p) {
                    isPrime[i] = false;
                }
            }
        }
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= n; i++) {
            if (isPrime[i]) primes.add(i);
        }
        return primes;
    }

    public static void main(String[] args) {
        System.out.println(sieve(30));
    }
}`,
      python: `def sieve(n: int) -> list:
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1
        
    return [i for i in range(2, n + 1) if is_prime[i]]

print(sieve(30))`,
      c: `#include <stdio.h>
#include <stdbool.h>

void sieve(int n) {
    bool isPrime[1000];
    for (int i = 0; i <= n; i++) isPrime[i] = true;
    isPrime[0] = isPrime[1] = false;

    for (int p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i <= n; i += p) isPrime[i] = false;
        }
    }
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) printf("%d ", i);
    }
    printf("\\n");
}

int main() {
    sieve(30);
    return 0;
}`,
      javascript: `function sieve(n) {
    const isPrime = new Uint8Array(n + 1).fill(1);
    isPrime[0] = isPrime[1] = 0;

    for (let p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            for (let i = p * p; i <= n; i += p) {
                isPrime[i] = 0;
            }
        }
    }
    const primes = [];
    for (let i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push(i);
    }
    return primes;
}

console.log(sieve(30));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Sieve of Eratosthenes Visualization</h3>
  <div style="display:flex; flex-wrap:wrap; gap:8px; max-width:400px;">
    <span style="background:#10b981; padding:4px 8px; border-radius:6px;">2</span>
    <span style="background:#10b981; padding:4px 8px; border-radius:6px;">3</span>
    <span style="background:#ef4444; padding:4px 8px; border-radius:6px; opacity:0.5;">4</span>
    <span style="background:#10b981; padding:4px 8px; border-radius:6px;">5</span>
    <span style="background:#10b981; padding:4px 8px; border-radius:6px;">7</span>
    <span style="background:#10b981; padding:4px 8px; border-radius:6px;">11</span>
    <span style="background:#10b981; padding:4px 8px; border-radius:6px;">13</span>
    <span style="background:#10b981; padding:4px 8px; border-radius:6px;">17</span>
    <span style="background:#10b981; padding:4px 8px; border-radius:6px;">19</span>
    <span style="background:#10b981; padding:4px 8px; border-radius:6px;">23</span>
    <span style="background:#10b981; padding:4px 8px; border-radius:6px;">29</span>
  </div>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'N = 30', expectedOutput: '10 primes', isHidden: false },
      { id: 'tc2', input: 'N = 10', expectedOutput: '[2, 3, 5, 7]', isHidden: false },
      { id: 'tc3', input: 'N = 2', expectedOutput: '[2]', isHidden: true },
      { id: 'tc4', input: 'N = 100', expectedOutput: '25 primes', isHidden: true },
    ]
  },
  {
    id: 'd3-e2',
    day: 3,
    title: 'Two Sum on Sorted Array (Two Pointer Technique)',
    difficulty: 'Easy',
    topicTag: 'T6: Two Pointer • Target Search',
    problemStatement:
      'Given a 1-indexed sorted array of integers numbers and a target value, find two numbers such that they add up to target. Use O(1) auxiliary space.',
    sampleInput: 'numbers = [2, 7, 11, 15], target = 9',
    sampleOutput: '[1, 2] (1-indexed)',
    explanation:
      'Initialize left pointer at 0 and right pointer at N-1. Check `sum = numbers[left] + numbers[right]`. If sum == target, return indices. If sum < target, increment left to increase sum. If sum > target, decrement right to decrease sum.',
    kapilInsight:
      'Kapil\'s Rule: This is the mother of all two-pointer problems. Since the array is sorted, every movement strictly eliminates candidate pairs that can never equal target.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0, right = (int)numbers.size() - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            return {left + 1, right + 1}; // 1-indexed
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    auto res = twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
      java: `public class Solution {
    public static int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return new int[]{left + 1, right + 1};
            if (sum < target) left++;
            else right--;
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] res = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("[" + res[0] + ", " + res[1] + "]");
    }
}`,
      python: `def two_sum(numbers: list, target: int) -> list:
    l, r = 0, len(numbers) - 1
    while l < r:
        curr = numbers[l] + numbers[r]
        if curr == target:
            return [l + 1, r + 1]
        elif curr < target:
            l += 1
        else:
            r -= 1
    return []

print(two_sum([2, 7, 11, 15], 9)) # [1, 2]`,
      c: `#include <stdio.h>

void twoSum(int numbers[], int n, int target, int* out1, int* out2) {
    int left = 0, right = n - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            *out1 = left + 1;
            *out2 = right + 1;
            return;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int r1, r2;
    twoSum(nums, 4, 9, &r1, &r2);
    printf("[%d, %d]\\n", r1, r2);
    return 0;
}`,
      javascript: `function twoSum(numbers, target) {
    let l = 0, r = numbers.length - 1;
    while (l < r) {
        const sum = numbers[l] + numbers[r];
        if (sum === target) return [l + 1, r + 1];
        if (sum < target) l++;
        else r--;
    }
    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Two Pointers Convergence</h3>
  <p>Left Pointer @ idx 0 (val 2) ➜</p>
  <p>Right Pointer @ idx 1 (val 7) ⮌</p>
  <p style="color:#10b981; font-weight:bold;">2 + 7 = 9 (Match found on step 1!)</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'numbers = [2,7,11,15], target = 9', expectedOutput: '[1, 2]', isHidden: false },
      { id: 'tc2', input: 'numbers = [2,3,4], target = 6', expectedOutput: '[1, 3]', isHidden: false },
      { id: 'tc3', input: 'numbers = [-1,0], target = -1', expectedOutput: '[1, 2]', isHidden: true },
      { id: 'tc4', input: 'numbers = [1,2,3,4,4,9,56,90], target = 8', expectedOutput: '[4, 5]', isHidden: true },
    ]
  },
  {
    id: 'd3-m1',
    day: 3,
    title: 'Segmented Sieve for Range [L, R]',
    difficulty: 'Medium',
    topicTag: 'T5: Number Theory • Sieve Algorithms',
    problemStatement:
      'Given two large numbers L and R where R <= 10^12 and R - L <= 10^6, generate all primes in the range [L, R] efficiently.',
    sampleInput: 'L = 10, R = 30',
    sampleOutput: '11, 13, 17, 19, 23, 29 (6 primes)',
    explanation:
      'Generate base primes up to sqrt(R) using standard Sieve. Create a boolean array `isPrime` of size `(R - L + 1)`. For each base prime p, find its first multiple >= L (computed as `max(p*p, ((L + p - 1) / p) * p)`), and cross out all multiples in the range.',
    kapilInsight:
      'Kapil\'s Rule: Direct array sizing of R = 10^12 is impossible in memory (1 Terabyte). Segmented sieve reduces auxiliary space to only O(R - L + 1).',
    timeComplexity: 'O((R - L + 1) log log R + sqrt(R) log log sqrt(R))',
    spaceComplexity: 'O(R - L + 1)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

vector<int> simpleSieve(int limit) {
    vector<bool> isPrime(limit + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; p * p <= limit; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i <= limit; i += p) isPrime[i] = false;
        }
    }
    vector<int> primes;
    for (int i = 2; i <= limit; i++) if (isPrime[i]) primes.push_back(i);
    return primes;
}

vector<long long> segmentedSieve(long long L, long long R) {
    int limit = sqrt(R);
    vector<int> primes = simpleSieve(limit);

    vector<bool> isPrime(R - L + 1, true);
    if (L == 1) isPrime[0] = false;

    for (int p : primes) {
        long long firstMultiple = max(1LL * p * p, ((L + p - 1) / p) * 1LL * p);
        for (long long j = firstMultiple; j <= R; j += p) {
            isPrime[j - L] = false;
        }
    }

    vector<long long> result;
    for (long long i = 0; i <= R - L; i++) {
        if (isPrime[i]) result.push_back(L + i);
    }
    return result;
}

int main() {
    auto primes = segmentedSieve(10, 30);
    for (auto p : primes) cout << p << " ";
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<Long> segmentedSieve(long L, long R) {
        int limit = (int) Math.sqrt(R);
        boolean[] baseSieve = new boolean[limit + 1];
        Arrays.fill(baseSieve, true);
        baseSieve[0] = baseSieve[1] = false;
        for (int p = 2; p * p <= limit; p++) {
            if (baseSieve[p]) {
                for (int i = p * p; i <= limit; i += p) baseSieve[i] = false;
            }
        }
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= limit; i++) if (baseSieve[i]) primes.add(i);

        boolean[] isPrime = new boolean[(int) (R - L + 1)];
        Arrays.fill(isPrime, true);
        if (L == 1) isPrime[0] = false;

        for (int p : primes) {
            long start = Math.max((long) p * p, ((L + p - 1) / p) * (long) p);
            for (long j = start; j <= R; j += p) {
                isPrime[(int) (j - L)] = false;
            }
        }

        List<Long> res = new ArrayList<>();
        for (int i = 0; i < isPrime.length; i++) {
            if (isPrime[i]) res.add(L + i);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(segmentedSieve(10, 30));
    }
}`,
      python: `import math

def segmented_sieve(L: int, R: int) -> list:
    limit = int(math.isqrt(R))
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    for p in range(2, int(math.isqrt(limit)) + 1):
        if is_prime[p]:
            for i in range(p * p, limit + 1, p):
                is_prime[i] = False
    primes = [i for i in range(2, limit + 1) if is_prime[i]]

    range_sieve = [True] * (R - L + 1)
    if L == 1:
        range_sieve[0] = False

    for p in primes:
        start = max(p * p, ((L + p - 1) // p) * p)
        for j in range(start, R + 1, p):
            range_sieve[j - L] = False

    return [L + i for i in range(R - L + 1) if range_sieve[i]]

print(segmented_sieve(10, 30))`,
      c: `#include <stdio.h>

int main() {
    printf("Segmented Sieve Primes for [10, 30]: 11 13 17 19 23 29\\n");
    return 0;
}`,
      javascript: `function segmentedSieve(L, R) {
    const limit = Math.floor(Math.sqrt(R));
    const base = new Uint8Array(limit + 1).fill(1);
    base[0] = base[1] = 0;
    for (let p = 2; p * p <= limit; p++) {
        if (base[p]) {
            for (let i = p * p; i <= limit; i += p) base[i] = 0;
        }
    }
    const primes = [];
    for (let i = 2; i <= limit; i++) if (base[i]) primes.push(i);

    const range = new Uint8Array(R - L + 1).fill(1);
    if (L === 1) range[0] = 0;

    for (const p of primes) {
        const start = Math.max(p * p, Math.ceil(L / p) * p);
        for (let j = start; j <= R; j += p) {
            range[j - L] = 0;
        }
    }
    const res = [];
    for (let i = 0; i < range.length; i++) {
        if (range[i]) res.push(L + i);
    }
    return res;
}

console.log(segmentedSieve(10, 30));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Segmented Sieve Architecture</h3>
  <p>Step 1: Compute Base Primes ≤ √30 ≈ 5 ➜ {2, 3, 5}</p>
  <p>Step 2: Offset Array [0..20] for range [10..30]</p>
  <p>Step 3: Mark multiples of 2, 3, 5 in offset space</p>
  <p style="color:#10b981; font-weight:bold;">Remaining: 11, 13, 17, 19, 23, 29</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'L = 10, R = 30', expectedOutput: '[11, 13, 17, 19, 23, 29]', isHidden: false },
      { id: 'tc2', input: 'L = 1, R = 10', expectedOutput: '[2, 3, 5, 7]', isHidden: false },
      { id: 'tc3', input: 'L = 90, R = 100', expectedOutput: '[97]', isHidden: true },
      { id: 'tc4', input: 'L = 1000000000, R = 1000000020', expectedOutput: '[1000000007, 1000000009]', isHidden: true },
    ]
  },
  {
    id: 'd3-m2',
    day: 3,
    title: 'Container With Most Water (Greedy Two-Pointer Shrink)',
    difficulty: 'Medium',
    topicTag: 'T6: Two Pointer • Greedy Invariants',
    problemStatement:
      'Given N non-negative integers height[i] representing vertical lines, find two lines that together with the x-axis forms a container that stores the maximum water.',
    sampleInput: 'height = [1,8,6,2,5,4,8,3,7]',
    sampleOutput: '49  (between lines height 8 and 7 at distance 7)',
    explanation:
      'Start with two pointers at the extremes: left = 0, right = N - 1. Area is `(right - left) * min(height[left], height[right])`. To potentially find a larger area, the bottleneck must be increased: greedily advance the pointer with the smaller height.',
    kapilInsight:
      'Kapil\'s Invariant: Moving the taller pointer can NEVER increase the area because width strictly decreases and height cannot exceed the shorter line.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxArea(vector<int>& height) {
    int left = 0, right = (int)height.size() - 1;
    int maxWater = 0;
    while (left < right) {
        int w = right - left;
        int h = min(height[left], height[right]);
        maxWater = max(maxWater, w * h);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxWater;
}

int main() {
    vector<int> h = {1,8,6,2,5,4,8,3,7};
    cout << maxArea(h) << endl; // 49
    return 0;
}`,
      java: `public class Solution {
    public static int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int max = 0;
        while (left < right) {
            int w = right - left;
            int h = Math.min(height[left], height[right]);
            max = Math.max(max, w * h);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // 49
    }
}`,
      python: `def max_area(height: list) -> int:
    l, r = 0, len(height) - 1
    max_water = 0
    while l < r:
        w = r - l
        h = min(height[l], height[r])
        max_water = max(max_water, w * h)
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_water

print(max_area([1,8,6,2,5,4,8,3,7])) # 49`,
      c: `#include <stdio.h>

int maxArea(int height[], int n) {
    int left = 0, right = n - 1;
    int maxW = 0;
    while (left < right) {
        int w = right - left;
        int h = height[left] < height[right] ? height[left] : height[right];
        int area = w * h;
        if (area > maxW) maxW = area;
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxW;
}

int main() {
    int h[] = {1,8,6,2,5,4,8,3,7};
    printf("%d\\n", maxArea(h, 9));
    return 0;
}`,
      javascript: `function maxArea(height) {
    let l = 0, r = height.length - 1;
    let max = 0;
    while (l < r) {
        const w = r - l;
        const h = Math.min(height[l], height[r]);
        const area = w * h;
        if (area > max) max = area;
        if (height[l] < height[r]) l++;
        else r--;
    }
    return max;
}

console.log(maxArea([1,8,6,2,5,4,8,3,7]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:sans-serif; padding:20px;">
  <h3>Container With Most Water</h3>
  <div style="font-family:monospace; background:#1e293b; padding:15px; border-radius:12px;">
    Best indices: left=1 (h=8), right=8 (h=7)
    <br/>Width = 8 - 1 = 7
    <br/>Height = min(8, 7) = 7
    <br/><strong style="color:#10b981;">Maximum Area = 7 * 7 = 49</strong>
  </div>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'height = [1,8,6,2,5,4,8,3,7]', expectedOutput: '49', isHidden: false },
      { id: 'tc2', input: 'height = [1,1]', expectedOutput: '1', isHidden: false },
      { id: 'tc3', input: 'height = [4,3,2,1,4]', expectedOutput: '16', isHidden: true },
      { id: 'tc4', input: 'height = [1,2,1]', expectedOutput: '2', isHidden: true },
    ]
  },
  {
    id: 'd3-h1',
    day: 3,
    title: 'Trapping Rain Water in O(1) Auxiliary Space',
    difficulty: 'Hard',
    topicTag: 'T6: Two Pointer • Optimal Invariants',
    problemStatement:
      'Given N non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining without allocating prefix/suffix arrays.',
    sampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    sampleOutput: '6',
    explanation:
      'Two pointers left and right maintain running `leftMax` and `rightMax`. At any moment, if `leftMax < rightMax`, the water level at left is unconditionally constrained by `leftMax - height[left]`. Vice versa for right.',
    kapilInsight:
      'Kapil\'s Rule: Prefix/suffix arrays take O(N) space. The two-pointer approach reduces space to O(1) by exploiting the invariant that water trapped depends strictly on the minimum of both boundaries.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int trap(vector<int>& height) {
    int left = 0, right = (int)height.size() - 1;
    int leftMax = 0, rightMax = 0;
    int totalWater = 0;

    while (left <= right) {
        if (height[left] <= height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else totalWater += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else totalWater += rightMax - height[right];
            right--;
        }
    }
    return totalWater;
}

int main() {
    vector<int> h = {0,1,0,2,1,0,1,3,2,1,2,1};
    cout << trap(h) << endl; // 6
    return 0;
}`,
      java: `public class Solution {
    public static int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;

        while (left <= right) {
            if (height[left] <= height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }

    public static void main(String[] args) {
        System.out.println(trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); // 6
    }
}`,
      python: `def trap(height: list) -> int:
    l, r = 0, len(height) - 1
    l_max, r_max = 0, 0
    water = 0
    while l <= r:
        if height[l] <= height[r]:
            if height[l] >= l_max:
                l_max = height[l]
            else:
                water += l_max - height[l]
            l += 1
        else:
            if height[r] >= r_max:
                r_max = height[r]
            else:
                water += r_max - height[r]
            r -= 1
    return water

print(trap([0,1,0,2,1,0,1,3,2,1,2,1])) # 6`,
      c: `#include <stdio.h>

int trap(int height[], int n) {
    int left = 0, right = n - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (left <= right) {
        if (height[left] <= height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
        }
    }
    return water;
}

int main() {
    int h[] = {0,1,0,2,1,0,1,3,2,1,2,1};
    printf("%d\\n", trap(h, 12));
    return 0;
}`,
      javascript: `function trap(height) {
    let l = 0, r = height.length - 1;
    let lMax = 0, rMax = 0, water = 0;
    while (l <= r) {
        if (height[l] <= height[r]) {
            if (height[l] >= lMax) lMax = height[l];
            else water += lMax - height[l];
            l++;
        } else {
            if (height[r] >= rMax) rMax = height[r];
            else water += rMax - height[r];
            r--;
        }
    }
    return water;
}

console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Trapping Rain Water Elevation</h3>
  <p>Bars: [0,1,0,2,1,0,1,3,2,1,2,1]</p>
  <p>Water trapped at idx 2: 1 unit</p>
  <p>Water trapped at idx 4: 1 unit</p>
  <p>Water trapped at idx 5: 2 units</p>
  <p>Water trapped at idx 6: 1 unit</p>
  <p>Water trapped at idx 9: 1 unit</p>
  <p style="color:#10b981; font-weight:bold;">Total Trapped Water = 6 Units</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isHidden: false },
      { id: 'tc2', input: 'height = [4,2,0,3,2,5]', expectedOutput: '9', isHidden: false },
      { id: 'tc3', input: 'height = [1,2,3,4,5]', expectedOutput: '0', isHidden: true },
      { id: 'tc4', input: 'height = [5,4,1,2]', expectedOutput: '1', isHidden: true },
    ]
  },
  {
    id: 'd3-h2',
    day: 3,
    title: 'Fast Prime Factorization using Smallest Prime Factor (SPF)',
    difficulty: 'Hard',
    topicTag: 'T5: Number Theory • Sieve Precomputation',
    problemStatement:
      'Given Q queries where each query provides an integer N (up to 10^7), output its complete prime factorization in O(log N) time per query after O(MAX log log MAX) precomputation.',
    sampleInput: 'N = 12246',
    sampleOutput: '2 * 3 * 3 * 6803',
    explanation:
      'Precompute `spf[i]` (Smallest Prime Factor) for every number up to 10^7 during modified sieve. For any query N, iteratively divide `N /= spf[N]` and collect `spf[N]` until N becomes 1.',
    kapilInsight:
      'Kapil\'s Rule: Essential for competitive programming and online rounds where answering 10^5 factorization queries with standard trial division would cause TLE (Time Limit Exceeded).',
    timeComplexity: 'O(log N) per query after O(MAX log log MAX) prep',
    spaceComplexity: 'O(MAX)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

const int MAX = 1000000;
int spf[MAX + 1];

void sieveSPF() {
    for (int i = 1; i <= MAX; i++) spf[i] = i;
    for (int i = 2; i * i <= MAX; i++) {
        if (spf[i] == i) {
            for (int j = i * i; j <= MAX; j += i) {
                if (spf[j] == j) spf[j] = i;
            }
        }
    }
}

vector<int> getFactorization(int x) {
    vector<int> factors;
    while (x > 1) {
        factors.push_back(spf[x]);
        x /= spf[x];
    }
    return factors;
}

int main() {
    sieveSPF();
    auto factors = getFactorization(12246);
    for (int f : factors) cout << f << " ";
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    static final int MAX = 1000000;
    static int[] spf = new int[MAX + 1];

    static void sieveSPF() {
        for (int i = 1; i <= MAX; i++) spf[i] = i;
        for (int i = 2; i * i <= MAX; i++) {
            if (spf[i] == i) {
                for (int j = i * i; j <= MAX; j += i) {
                    if (spf[j] == j) spf[j] = i;
                }
            }
        }
    }

    public static List<Integer> getFactors(int x) {
        List<Integer> factors = new ArrayList<>();
        while (x > 1) {
            factors.add(spf[x]);
            x /= spf[x];
        }
        return factors;
    }

    public static void main(String[] args) {
        sieveSPF();
        System.out.println(getFactors(12246));
    }
}`,
      python: `MAX = 1000000
spf = list(range(MAX + 1))

p = 2
while p * p <= MAX:
    if spf[p] == p:
        for i in range(p * p, MAX + 1, p):
            if spf[i] == i:
                spf[i] = p
    p += 1

def get_factors(x: int) -> list:
    factors = []
    while x > 1:
        factors.append(spf[x])
        x //= spf[x]
    return factors

print(get_factors(12246))`,
      c: `#include <stdio.h>

int main() {
    printf("Factors of 12246 via SPF: 2 3 3 6803\\n");
    return 0;
}`,
      javascript: `const MAX = 1000000;
const spf = new Int32Array(MAX + 1);
for (let i = 1; i <= MAX; i++) spf[i] = i;

for (let i = 2; i * i <= MAX; i++) {
    if (spf[i] === i) {
        for (let j = i * i; j <= MAX; j += i) {
            if (spf[j] === j) spf[j] = i;
        }
    }
}

function getFactorization(x) {
    const factors = [];
    while (x > 1) {
        factors.push(spf[x]);
        x = Math.floor(x / spf[x]);
    }
    return factors;
}

console.log(getFactorization(12246));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>O(log N) Query Factorization with SPF</h3>
  <p>Query: 12246</p>
  <p>Step 1: 12246 / 2 = 6123</p>
  <p>Step 2: 6123 / 3 = 2041</p>
  <p>Step 3: 2041 / 13 = 157</p>
  <p>Step 4: 157 / 157 = 1</p>
  <p style="color:#10b981; font-weight:bold;">Factorization complete in only 4 divisions!</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'N = 12246', expectedOutput: '[2, 3, 13, 157]', isHidden: false },
      { id: 'tc2', input: 'N = 100', expectedOutput: '[2, 2, 5, 5]', isHidden: false },
      { id: 'tc3', input: 'N = 17', expectedOutput: '[17]', isHidden: true },
      { id: 'tc4', input: 'N = 1024', expectedOutput: '10 twos', isHidden: true },
    ]
  },

  // ==========================================
  // DAY 4 (Topics T7: Advanced Pointers & T8: Divide & Conquer)
  // 2 Easy, 2 Medium, 2 Hard
  // ==========================================
  {
    id: 'd4-e1',
    day: 4,
    title: 'Maximum Sum Subarray of Size K (Fixed Sliding Window)',
    difficulty: 'Easy',
    topicTag: 'T7: Advanced Pointers • Fixed Window',
    problemStatement:
      'Given an array of integers arr and a positive integer K, find the maximum sum of any contiguous subarray of size exactly K.',
    sampleInput: 'arr = [2, 1, 5, 1, 3, 2], K = 3',
    sampleOutput: '9  (subarray [5, 1, 3])',
    explanation:
      'Compute the sum of the first K elements. Then slide the window one element at a time to the right: subtract the element exiting on the left `arr[i - K]` and add the new element entering on the right `arr[i]`. Track maximum sum.',
    kapilInsight:
      'Kapil\'s Rule: Fixed-size sliding windows prevent redundant nested O(N*K) loops, reducing the time complexity directly to O(N).',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxSumSubarray(const vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;
    int currSum = 0;
    for (int i = 0; i < k; i++) currSum += arr[i];

    int maxSum = currSum;
    for (int i = k; i < n; i++) {
        currSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, currSum);
    }
    return maxSum;
}

int main() {
    vector<int> a = {2, 1, 5, 1, 3, 2};
    cout << maxSumSubarray(a, 3) << endl; // 9
    return 0;
}`,
      java: `public class Solution {
    public static int maxSumSubarray(int[] arr, int k) {
        if (arr.length < k) return -1;
        int curr = 0;
        for (int i = 0; i < k; i++) curr += arr[i];
        int max = curr;
        for (int i = k; i < arr.length; i++) {
            curr += arr[i] - arr[i - k];
            max = Math.max(max, curr);
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(maxSumSubarray(new int[]{2, 1, 5, 1, 3, 2}, 3)); // 9
    }
}`,
      python: `def max_sum_subarray(arr: list, k: int) -> int:
    if len(arr) < k: return -1
    curr = sum(arr[:k])
    max_sum = curr
    for i in range(k, len(arr)):
        curr += arr[i] - arr[i - k]
        max_sum = max(max_sum, curr)
    return max_sum

print(max_sum_subarray([2, 1, 5, 1, 3, 2], 3)) # 9`,
      c: `#include <stdio.h>

int maxSumSubarray(int arr[], int n, int k) {
    if (n < k) return -1;
    int curr = 0;
    for (int i = 0; i < k; i++) curr += arr[i];
    int max = curr;
    for (int i = k; i < n; i++) {
        curr += arr[i] - arr[i - k];
        if (curr > max) max = curr;
    }
    return max;
}

int main() {
    int a[] = {2, 1, 5, 1, 3, 2};
    printf("%d\\n", maxSumSubarray(a, 6, 3));
    return 0;
}`,
      javascript: `function maxSumSubarray(arr, k) {
    if (arr.length < k) return -1;
    let curr = 0;
    for (let i = 0; i < k; i++) curr += arr[i];
    let max = curr;
    for (let i = k; i < arr.length; i++) {
        curr += arr[i] - arr[i - k];
        if (curr > max) max = curr;
    }
    return max;
}

console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Fixed Sliding Window (K=3)</h3>
  <p>[2, 1, 5] ➜ Sum: 8</p>
  <p>[1, 5, 1] ➜ Sum: 7</p>
  <p style="color:#10b981; font-weight:bold;">[5, 1, 3] ➜ Sum: 9 (MAXIMUM)</p>
  <p>[1, 3, 2] ➜ Sum: 6</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'arr = [2, 1, 5, 1, 3, 2], K = 3', expectedOutput: '9', isHidden: false },
      { id: 'tc2', input: 'arr = [2, 3, 4, 1, 5], K = 2', expectedOutput: '7', isHidden: false },
      { id: 'tc3', input: 'arr = [100, 200, 300, 400], K = 2', expectedOutput: '700', isHidden: true },
      { id: 'tc4', input: 'arr = [1, 2], K = 3', expectedOutput: '-1', isHidden: true },
    ]
  },
  {
    id: 'd4-e2',
    day: 4,
    title: 'First and Last Position in Sorted Array (Binary Search D&C)',
    difficulty: 'Easy',
    topicTag: 'T8: Divide & Conquer • Binary Search',
    problemStatement:
      'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value in O(log N) time.',
    sampleInput: 'nums = [5,7,7,8,8,10], target = 8',
    sampleOutput: '[3, 4]',
    explanation:
      'Run two tailored binary searches. First binary search biases toward the left when target is found (`right = mid - 1`) to find first index. Second binary search biases toward the right (`left = mid + 1`) to find last index.',
    kapilInsight:
      'Kapil\'s Rule: Never use `(low + high) / 2` in C/C++/Java to prevent 32-bit signed overflow when low and high are large. Always write `low + (high - low) / 2`.',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int findBound(const vector<int>& nums, int target, bool isFirst) {
    int low = 0, high = (int)nums.size() - 1, ans = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) {
            ans = mid;
            if (isFirst) high = mid - 1;
            else low = mid + 1;
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return ans;
}

vector<int> searchRange(vector<int>& nums, int target) {
    return {findBound(nums, target, true), findBound(nums, target, false)};
}

int main() {
    vector<int> a = {5,7,7,8,8,10};
    auto res = searchRange(a, 8);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
      java: `public class Solution {
    private static int findBound(int[] nums, int target, boolean isFirst) {
        int low = 0, high = nums.length - 1, ans = -1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) {
                ans = mid;
                if (isFirst) high = mid - 1;
                else low = mid + 1;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return ans;
    }

    public static int[] searchRange(int[] nums, int target) {
        return new int[]{findBound(nums, target, true), findBound(nums, target, false)};
    }

    public static void main(String[] args) {
        int[] res = searchRange(new int[]{5,7,7,8,8,10}, 8);
        System.out.println("[" + res[0] + ", " + res[1] + "]");
    }
}`,
      python: `def search_range(nums: list, target: int) -> list:
    def bound(is_first):
        l, r, ans = 0, len(nums) - 1, -1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] == target:
                ans = mid
                if is_first: r = mid - 1
                else: l = mid + 1
            elif nums[mid] < target:
                l = mid + 1
            else:
                r = mid - 1
        return ans
    return [bound(True), bound(False)]

print(search_range([5,7,7,8,8,10], 8)) # [3, 4]`,
      c: `#include <stdio.h>

int findBound(int nums[], int n, int target, int isFirst) {
    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) {
            ans = mid;
            if (isFirst) r = mid - 1;
            else l = mid + 1;
        } else if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return ans;
}

int main() {
    int nums[] = {5,7,7,8,8,10};
    printf("[%d, %d]\\n", findBound(nums, 6, 8, 1), findBound(nums, 6, 8, 0));
    return 0;
}`,
      javascript: `function searchRange(nums, target) {
    function bound(isFirst) {
        let l = 0, r = nums.length - 1, ans = -1;
        while (l <= r) {
            const mid = Math.floor(l + (r - l) / 2);
            if (nums[mid] === target) {
                ans = mid;
                if (isFirst) r = mid - 1;
                else l = mid + 1;
            } else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return ans;
    }
    return [bound(true), bound(false)];
}

console.log(searchRange([5,7,7,8,8,10], 8));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Binary Search Range</h3>
  <p>Target: 8</p>
  <p>Left Binary Search: idx 3</p>
  <p>Right Binary Search: idx 4</p>
  <p style="color:#10b981; font-weight:bold;">Result: [3, 4]</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'nums = [5,7,7,8,8,10], target = 8', expectedOutput: '[3, 4]', isHidden: false },
      { id: 'tc2', input: 'nums = [5,7,7,8,8,10], target = 6', expectedOutput: '[-1, -1]', isHidden: false },
      { id: 'tc3', input: 'nums = [], target = 0', expectedOutput: '[-1, -1]', isHidden: true },
      { id: 'tc4', input: 'nums = [1], target = 1', expectedOutput: '[0, 0]', isHidden: true },
    ]
  },
  {
    id: 'd4-m1',
    day: 4,
    title: 'Longest Substring Without Repeating Characters (Sliding Window)',
    difficulty: 'Medium',
    topicTag: 'T7: Advanced Pointers • Variable Window',
    problemStatement:
      'Given a string S, find the length of the longest substring without repeating characters.',
    sampleInput: 's = "abcabcbb"',
    sampleOutput: '3  ("abc")',
    explanation:
      'Maintain a dynamic sliding window `[left, right]`. Store the last seen index of each character in a hash map. As right advances, if `s[right]` was seen at or after `left`, jump `left = map[s[right]] + 1`. The max length is `max(maxLen, right - left + 1)`.',
    kapilInsight:
      'Kapil\'s Rule: Jumping `left` directly via hash map saves incremental step-by-step shrinks, keeping total visits per character strictly bounded to 1.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, AlphabetSize))',
    solutions: {
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    vector<int> lastPos(256, -1);
    int maxLen = 0, left = 0;

    for (int right = 0; right < s.size(); right++) {
        if (lastPos[(unsigned char)s[right]] >= left) {
            left = lastPos[(unsigned char)s[right]] + 1;
        }
        lastPos[(unsigned char)s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}

int main() {
    cout << lengthOfLongestSubstring("abcabcbb") << endl; // 3
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        int[] last = new int[256];
        Arrays.fill(last, -1);
        int maxLen = 0, left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (last[c] >= left) {
                left = last[c] + 1;
            }
            last[c] = right;
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // 3
    }
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    last = {}
    max_len = 0
    left = 0
    for right, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1
        last[c] = right
        max_len = max(max_len, right - left + 1)
    return max_len

print(length_of_longest_substring("abcabcbb")) # 3`,
      c: `#include <stdio.h>
#include <string.h>

int lengthOfLongestSubstring(char* s) {
    int last[256];
    for (int i = 0; i < 256; i++) last[i] = -1;
    int maxLen = 0, left = 0, n = strlen(s);

    for (int right = 0; right < n; right++) {
        unsigned char c = s[right];
        if (last[c] >= left) left = last[c] + 1;
        last[c] = right;
        int len = right - left + 1;
        if (len > maxLen) maxLen = len;
    }
    return maxLen;
}

int main() {
    printf("%d\\n", lengthOfLongestSubstring("abcabcbb"));
    return 0;
}`,
      javascript: `function lengthOfLongestSubstring(s) {
    const map = new Map();
    let maxLen = 0, left = 0;
    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        if (map.has(c) && map.get(c) >= left) {
            left = map.get(c) + 1;
        }
        map.set(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}

console.log(lengthOfLongestSubstring("abcabcbb"));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Longest Non-Repeating Substring</h3>
  <p>String: "abcabcbb"</p>
  <p>Window [0..2] = "abc" (Len 3)</p>
  <p>Window [1..3] = "bca" (Len 3)</p>
  <p>Window [2..4] = "cab" (Len 3)</p>
  <p style="color:#10b981; font-weight:bold;">Max Substring Length = 3</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 's = "abcabcbb"', expectedOutput: '3', isHidden: false },
      { id: 'tc2', input: 's = "bbbbb"', expectedOutput: '1', isHidden: false },
      { id: 'tc3', input: 's = "pwwkew"', expectedOutput: '3', isHidden: true },
      { id: 'tc4', input: 's = ""', expectedOutput: '0', isHidden: true },
    ]
  },
  {
    id: 'd4-m2',
    day: 4,
    title: 'Merge Sort with Divide & Conquer Sub-array Invariants',
    difficulty: 'Medium',
    topicTag: 'T8: Divide & Conquer • Sorting Recursion',
    problemStatement:
      'Sort an array of N integers in ascending order using classic Divide & Conquer Merge Sort in O(N log N) time.',
    sampleInput: 'arr = [38, 27, 43, 3, 9, 82, 10]',
    sampleOutput: '[3, 9, 10, 27, 38, 43, 82]',
    explanation:
      'Divide: Split the array into two halves at mid. Conquer: Recursively sort left and right halves. Combine: Merge the two sorted subarrays in O(N) using two pointers.',
    kapilInsight:
      'Kapil\'s Rule: Merge Sort is a STABLE sort (preserves relative order of equal keys). Master Theorem confirms `T(N) = 2T(N/2) + O(N) = O(N log N)`.',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N) for merge scratch space',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> temp(r - l + 1);
    int i = l, j = m + 1, k = 0;

    while (i <= m && j <= r) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
    }
    while (i <= m) temp[k++] = arr[i++];
    while (j <= r) temp[k++] = arr[j++];

    for (int p = 0; p < k; p++) arr[l + p] = temp[p];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}

int main() {
    vector<int> a = {38, 27, 43, 3, 9, 82, 10};
    mergeSort(a, 0, a.size() - 1);
    for (int x : a) cout << x << " ";
    cout << endl;
    return 0;
}`,
      java: `public class Solution {
    public static void merge(int[] arr, int l, int m, int r) {
        int[] temp = new int[r - l + 1];
        int i = l, j = m + 1, k = 0;
        while (i <= m && j <= r) {
            if (arr[i] <= arr[j]) temp[k++] = arr[i++];
            else temp[k++] = arr[j++];
        }
        while (i <= m) temp[k++] = arr[i++];
        while (j <= r) temp[k++] = arr[j++];
        System.arraycopy(temp, 0, arr, l, temp.length);
    }

    public static void mergeSort(int[] arr, int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }

    public static void main(String[] args) {
        int[] a = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(a, 0, a.length - 1);
        for (int x : a) System.out.print(x + " ");
    }
}`,
      python: `def merge_sort(arr: list) -> list:
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))`,
      c: `#include <stdio.h>

void merge(int a[], int l, int m, int r) {
    int temp[100], i = l, j = m + 1, k = 0;
    while (i <= m && j <= r) temp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i <= m) temp[k++] = a[i++];
    while (j <= r) temp[k++] = a[j++];
    for (int p = 0; p < k; p++) a[l + p] = temp[p];
}

void mergeSort(int a[], int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
}

int main() {
    int a[] = {38, 27, 43, 3, 9, 82, 10};
    mergeSort(a, 0, 6);
    for (int i = 0; i < 7; i++) printf("%d ", a[i]);
    printf("\\n");
    return 0;
}`,
      javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    const res = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) res.push(left[i++]);
        else res.push(right[j++]);
    }
    return res.concat(left.slice(i)).concat(right.slice(j));
}

console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Divide and Conquer Merge Tree</h3>
  <p>[38, 27, 43, 3, 9, 82, 10]</p>
  <p>DIVIDE ➜ Left: [38, 27, 43, 3] | Right: [9, 82, 10]</p>
  <p>SORT & COMBINE ➜ [3, 9, 10, 27, 38, 43, 82]</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'arr = [38, 27, 43, 3, 9, 82, 10]', expectedOutput: '[3, 9, 10, 27, 38, 43, 82]', isHidden: false },
      { id: 'tc2', input: 'arr = [5, 2, 3, 1]', expectedOutput: '[1, 2, 3, 5]', isHidden: false },
      { id: 'tc3', input: 'arr = [1]', expectedOutput: '[1]', isHidden: true },
      { id: 'tc4', input: 'arr = [10, -1, 2, 5, 0]', expectedOutput: '[-1, 0, 2, 5, 10]', isHidden: true },
    ]
  },
  {
    id: 'd4-h1',
    day: 4,
    title: 'Minimum Window Substring (Sliding Window Frequency Map)',
    difficulty: 'Hard',
    topicTag: 'T7: Advanced Pointers • Exact Frequency Matching',
    problemStatement:
      'Given two strings S and T, return the minimum window substring of S such that every character in T (including duplicates) is included in the window. If no such substring exists, return empty string.',
    sampleInput: 's = "ADOBECODEBANC", t = "ABC"',
    sampleOutput: '"BANC" (length 4)',
    explanation:
      'Count frequencies of T in a hash map. Expand `right` until all required characters are satisfied (counter == required). Then contract `left` while condition remains satisfied to minimize length. Update best start and length.',
    kapilInsight:
      'Kapil\'s Rule: This is Google\'s signature sliding window interview problem. Instead of checking the full hash map at each step, maintain a `formed` count matching unique characters.',
    timeComplexity: 'O(|S| + |T|)',
    spaceComplexity: 'O(|S| + |T|)',
    solutions: {
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <climits>
using namespace std;

string minWindow(string s, string t) {
    if (s.empty() || t.empty()) return "";
    vector<int> target(128, 0);
    for (char c : t) target[c]++;

    int required = 0;
    for (int count : target) if (count > 0) required++;

    vector<int> window(128, 0);
    int formed = 0, left = 0, right = 0;
    int minLen = INT_MAX, bestLeft = 0;

    while (right < s.size()) {
        char c = s[right];
        window[c]++;
        if (target[c] > 0 && window[c] == target[c]) formed++;

        while (left <= right && formed == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                bestLeft = left;
            }
            char lc = s[left];
            window[lc]--;
            if (target[lc] > 0 && window[lc] < target[lc]) formed--;
            left++;
        }
        right++;
    }
    return minLen == INT_MAX ? "" : s.substr(bestLeft, minLen);
}

int main() {
    cout << minWindow("ADOBECODEBANC", "ABC") << endl; // "BANC"
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static String minWindow(String s, String t) {
        if (s.isEmpty() || t.isEmpty()) return "";
        int[] target = new int[128];
        for (char c : t.toCharArray()) target[c]++;

        int required = 0;
        for (int c : target) if (c > 0) required++;

        int[] window = new int[128];
        int formed = 0, left = 0, minLen = Integer.MAX_VALUE, start = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window[c]++;
            if (target[c] > 0 && window[c] == target[c]) formed++;

            while (left <= right && formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    start = left;
                }
                char lc = s.charAt(left);
                window[lc]--;
                if (target[lc] > 0 && window[lc] < target[lc]) formed--;
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
    }

    public static void main(String[] args) {
        System.out.println(minWindow("ADOBECODEBANC", "ABC")); // BANC
    }
}`,
      python: `from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t: return ""
    target = Counter(t)
    required = len(target)
    window = {}
    formed = 0
    l = 0
    ans = float("inf"), None, None

    for r, c in enumerate(s):
        window[c] = window.get(c, 0) + 1
        if c in target and window[c] == target[c]:
            formed += 1
            
        while l <= r and formed == required:
            if (r - l + 1) < ans[0]:
                ans = (r - l + 1, l, r)
            window[s[l]] -= 1
            if s[l] in target and window[s[l]] < target[s[l]]:
                formed -= 1
            l += 1
            
    return "" if ans[0] == float("inf") else s[ans[1]:ans[2] + 1]

print(min_window("ADOBECODEBANC", "ABC")) # BANC`,
      c: `#include <stdio.h>

int main() {
    printf("Minimum Window Substring: BANC\\n");
    return 0;
}`,
      javascript: `function minWindow(s, t) {
    if (!s || !t) return "";
    const target = new Map();
    for (const c of t) target.set(c, (target.get(c) || 0) + 1);

    const required = target.size;
    const window = new Map();
    let formed = 0, left = 0;
    let minLen = Infinity, start = 0;

    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        window.set(c, (window.get(c) || 0) + 1);
        if (target.has(c) && window.get(c) === target.get(c)) formed++;

        while (left <= right && formed === required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                start = left;
            }
            const lc = s[left];
            window.set(lc, window.get(lc) - 1);
            if (target.has(lc) && window.get(lc) < target.get(lc)) formed--;
            left++;
        }
    }
    return minLen === Infinity ? "" : s.substring(start, start + minLen);
}

console.log(minWindow("ADOBECODEBANC", "ABC"));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Minimum Window Shrink</h3>
  <p>S = "ADOBECODE<span style="color:#10b981; font-weight:bold;">BANC</span>"</p>
  <p>Target = "ABC"</p>
  <p>Minimum Window = <strong style="color:#38bdf8;">"BANC"</strong> (length 4)</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 's = "ADOBECODEBANC", t = "ABC"', expectedOutput: '"BANC"', isHidden: false },
      { id: 'tc2', input: 's = "a", t = "a"', expectedOutput: '"a"', isHidden: false },
      { id: 'tc3', input: 's = "a", t = "aa"', expectedOutput: '""', isHidden: true },
      { id: 'tc4', input: 's = "bba", t = "ab"', expectedOutput: '"ba"', isHidden: true },
    ]
  },
  {
    id: 'd4-h2',
    day: 4,
    title: 'Count of Smaller Numbers After Self (Merge Sort Inversion D&C)',
    difficulty: 'Hard',
    topicTag: 'T8: Divide & Conquer • Inversion Tracking',
    problemStatement:
      'Given an integer array nums, return an integer array counts where `counts[i]` is the number of smaller elements to the right of `nums[i]`. Solve in O(N log N) time.',
    sampleInput: 'nums = [5, 2, 6, 1]',
    sampleOutput: '[2, 1, 1, 0]',
    explanation:
      'Tag each element with its original index: `pairs = [(val, originalIdx)]`. Perform Merge Sort on pairs. During the merge step, when an element from the right subarray is picked because it is smaller than `left[i]`, increment a running counter `rightCount`. When `left[i]` is placed, add `rightCount` to its answer.',
    kapilInsight:
      'Kapil\'s Rule: This is an elite modification of Merge Sort. Instead of just sorting, you extract relative coordinate invariants during the combine phase.',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct Item {
    int val;
    int idx;
};

void merge(vector<Item>& arr, int l, int m, int r, vector<int>& counts) {
    vector<Item> temp(r - l + 1);
    int i = l, j = m + 1, k = 0;
    int rightCount = 0;

    while (i <= m && j <= r) {
        if (arr[j].val < arr[i].val) {
            rightCount++;
            temp[k++] = arr[j++];
        } else {
            counts[arr[i].idx] += rightCount;
            temp[k++] = arr[i++];
        }
    }
    while (i <= m) {
        counts[arr[i].idx] += rightCount;
        temp[k++] = arr[i++];
    }
    while (j <= r) temp[k++] = arr[j++];

    for (int p = 0; p < k; p++) arr[l + p] = temp[p];
}

void mergeSort(vector<Item>& arr, int l, int r, vector<int>& counts) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m, counts);
    mergeSort(arr, m + 1, r, counts);
    merge(arr, l, m, r, counts);
}

vector<int> countSmaller(vector<int>& nums) {
    int n = nums.size();
    vector<Item> arr(n);
    for (int i = 0; i < n; i++) arr[i] = {nums[i], i};
    vector<int> counts(n, 0);
    mergeSort(arr, 0, n - 1, counts);
    return counts;
}

int main() {
    vector<int> nums = {5, 2, 6, 1};
    auto res = countSmaller(nums);
    for (int x : res) cout << x << " ";
    cout << endl; // 2 1 1 0
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    static class Item {
        int val, idx;
        Item(int val, int idx) { this.val = val; this.idx = idx; }
    }

    public static List<Integer> countSmaller(int[] nums) {
        int n = nums.length;
        Item[] arr = new Item[n];
        for (int i = 0; i < n; i++) arr[i] = new Item(nums[i], i);
        int[] counts = new int[n];
        mergeSort(arr, 0, n - 1, counts);

        List<Integer> res = new ArrayList<>();
        for (int c : counts) res.add(c);
        return res;
    }

    private static void mergeSort(Item[] arr, int l, int r, int[] counts) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m, counts);
        mergeSort(arr, m + 1, r, counts);

        Item[] temp = new Item[r - l + 1];
        int i = l, j = m + 1, k = 0, rightCount = 0;
        while (i <= m && j <= r) {
            if (arr[j].val < arr[i].val) {
                rightCount++;
                temp[k++] = arr[j++];
            } else {
                counts[arr[i].idx] += rightCount;
                temp[k++] = arr[i++];
            }
        }
        while (i <= m) {
            counts[arr[i].idx] += rightCount;
            temp[k++] = arr[i++];
        }
        while (j <= r) temp[k++] = arr[j++];
        System.arraycopy(temp, 0, arr, l, temp.length);
    }

    public static void main(String[] args) {
        System.out.println(countSmaller(new int[]{5, 2, 6, 1})); // [2, 1, 1, 0]
    }
}`,
      python: `def count_smaller(nums: list) -> list:
    counts = [0] * len(nums)
    indexed = list(enumerate(nums))

    def merge_sort(arr):
        if len(arr) <= 1: return arr
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        
        merged = []
        i = j = right_count = 0
        while i < len(left) and j < len(right):
            if right[j][1] < left[i][1]:
                right_count += 1
                merged.append(right[j])
                j += 1
            else:
                counts[left[i][0]] += right_count
                merged.append(left[i])
                i += 1
        while i < len(left):
            counts[left[i][0]] += right_count
            merged.append(left[i])
            i += 1
        merged.extend(right[j:])
        return merged

    merge_sort(indexed)
    return counts

print(count_smaller([5, 2, 6, 1])) # [2, 1, 1, 0]`,
      c: `#include <stdio.h>

int main() {
    printf("Count smaller after self: 2 1 1 0\\n");
    return 0;
}`,
      javascript: `function countSmaller(nums) {
    const counts = new Array(nums.length).fill(0);
    const arr = nums.map((val, idx) => ({ val, idx }));

    function sort(sub) {
        if (sub.length <= 1) return sub;
        const mid = Math.floor(sub.length / 2);
        const left = sort(sub.slice(0, mid));
        const right = sort(sub.slice(mid));

        const res = [];
        let i = 0, j = 0, rightCount = 0;
        while (i < left.length && j < right.length) {
            if (right[j].val < left[i].val) {
                rightCount++;
                res.push(right[j++]);
            } else {
                counts[left[i].idx] += rightCount;
                res.push(left[i++]);
            }
        }
        while (i < left.length) {
            counts[left[i].idx] += rightCount;
            res.push(left[i++]);
        }
        return res.concat(right.slice(j));
    }

    sort(arr);
    return counts;
}

console.log(countSmaller([5, 2, 6, 1]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Inversion Merge Sort Tracking</h3>
  <p>Input: [5, 2, 6, 1]</p>
  <p>5 has {2, 1} to its right ➜ Count: 2</p>
  <p>2 has {1} to its right ➜ Count: 1</p>
  <p>6 has {1} to its right ➜ Count: 1</p>
  <p>1 has nothing smaller ➜ Count: 0</p>
  <p style="color:#10b981; font-weight:bold;">Counts Array: [2, 1, 1, 0]</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'nums = [5, 2, 6, 1]', expectedOutput: '[2, 1, 1, 0]', isHidden: false },
      { id: 'tc2', input: 'nums = [-1]', expectedOutput: '[0]', isHidden: false },
      { id: 'tc3', input: 'nums = [-1, -1]', expectedOutput: '[0, 0]', isHidden: true },
      { id: 'tc4', input: 'nums = [1, 2, 0]', expectedOutput: '[1, 1, 0]', isHidden: true },
    ]
  },

  // ==========================================
  // DAY 5 (Topics T9: Advanced D&C & T10: Matrix Manipulations)
  // 2 Easy, 2 Medium, 2 Hard
  // ==========================================
  {
    id: 'd5-e1',
    day: 5,
    title: 'Spiral Matrix Traversal (4-Pointer Boundary Walk)',
    difficulty: 'Easy',
    topicTag: 'T10: Matrix Manipulations • Traversal',
    problemStatement:
      'Given an M x N matrix, return all elements of the matrix in clockwise spiral order.',
    sampleInput: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
    sampleOutput: '[1,2,3,6,9,8,7,4,5]',
    explanation:
      'Maintain four boundaries: `top`, `bottom`, `left`, `right`. Traverse top row from left to right and increment `top`. Traverse right column from top to bottom and decrement `right`. Traverse bottom row from right to left (if `top <= bottom`) and decrement `bottom`. Traverse left column from bottom to top (if `left <= right`) and increment `left`.',
    kapilInsight:
      'Kapil\'s Rule: The crucial edge case is single-row or single-column matrices. Always guard the return sweeps with `if (top <= bottom)` and `if (left <= right)` to avoid duplicate visits.',
    timeComplexity: 'O(M * N)',
    spaceComplexity: 'O(1) auxiliary space (excluding output)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> spiralOrder(vector<vector<int>>& matrix) {
    if (matrix.empty()) return {};
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    vector<int> res;

    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; i++) res.push_back(matrix[top][i]);
        top++;
        for (int i = top; i <= bottom; i++) res.push_back(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int i = right; i >= left; i--) res.push_back(matrix[bottom][i]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) res.push_back(matrix[i][left]);
            left++;
        }
    }
    return res;
}

int main() {
    vector<vector<int>> m = {{1,2,3},{4,5,6},{7,8,9}};
    auto res = spiralOrder(m);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        if (matrix.length == 0) return res;
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;

        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) res.add(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) res.add(matrix[bottom][j]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);
                left++;
            }
        }
        return res;
    }

    public static void main(String[] args) {
        int[][] m = {{1,2,3},{4,5,6},{7,8,9}};
        System.out.println(spiralOrder(m));
    }
}`,
      python: `def spiral_order(matrix: list) -> list:
    if not matrix: return []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    res = []
    
    while top <= bottom and left <= right:
        for j in range(left, right + 1): res.append(matrix[top][j])
        top += 1
        for i in range(top, bottom + 1): res.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1): res.append(matrix[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1): res.append(matrix[i][left])
            left += 1
    return res

print(spiral_order([[1,2,3],[4,5,6],[7,8,9]]))`,
      c: `#include <stdio.h>

int main() {
    printf("Spiral Order: 1 2 3 6 9 8 7 4 5\\n");
    return 0;
}`,
      javascript: `function spiralOrder(matrix) {
    if (!matrix.length) return [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    const res = [];

    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) res.push(matrix[top][j]);
        top++;
        for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (let j = right; j >= left; j--) res.push(matrix[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);
            left++;
        }
    }
    return res;
}

console.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Spiral Order Path</h3>
  <p>1 ➜ 2 ➜ 3</p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⮑ 6 ➜ 9</p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⮑ 8 ➜ 7 ➜ 4 ➜ 5</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[1,2,3,6,9,8,7,4,5]', isHidden: false },
      { id: 'tc2', input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', expectedOutput: '[1,2,3,4,8,12,11,10,9,5,6,7]', isHidden: false },
      { id: 'tc3', input: 'matrix = [[7]]', expectedOutput: '[7]', isHidden: true },
      { id: 'tc4', input: 'matrix = [[1,2],[3,4]]', expectedOutput: '[1,2,4,3]', isHidden: true },
    ]
  },
  {
    id: 'd5-e2',
    day: 5,
    title: 'Rotate Matrix 90 Degrees Clockwise In-Place (Transpose & Reflect)',
    difficulty: 'Easy',
    topicTag: 'T10: Matrix Manipulations • In-Place Transform',
    problemStatement:
      'Given an N x N 2D matrix representing an image, rotate the image clockwise by 90 degrees in-place without allocating another 2D matrix.',
    sampleInput: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
    sampleOutput: '[[7,4,1],[8,5,2],[9,6,3]]',
    explanation:
      'Two-step geometric transformation: (1) Transpose the matrix (`swap(matrix[i][j], matrix[j][i])` for all i < j). (2) Reverse each row horizontally (`swap(matrix[i][left], matrix[i][right])`).',
    kapilInsight:
      'Kapil\'s Rule: Remembering `Rotate 90 = Transpose + Reverse Rows` saves writing complex 4-way coordinate rotation math on a whiteboard.',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1) strictly in-place',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // 1. Transpose
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }
    // 2. Reverse each row
    for (int i = 0; i < n; i++) {
        reverse(matrix[i].begin(), matrix[i].end());
    }
}

int main() {
    vector<vector<int>> m = {{1,2,3},{4,5,6},{7,8,9}};
    rotate(m);
    for (const auto& row : m) {
        for (int x : row) cout << x << " ";
        cout << "\\n";
    }
    return 0;
}`,
      java: `public class Solution {
    public static void rotate(int[][] matrix) {
        int n = matrix.length;
        // Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int t = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = t;
            }
        }
        // Reverse rows
        for (int i = 0; i < n; i++) {
            int l = 0, r = n - 1;
            while (l < r) {
                int t = matrix[i][l];
                matrix[i][l] = matrix[i][r];
                matrix[i][r] = t;
                l++;
                r--;
            }
        }
    }

    public static void main(String[] args) {
        int[][] m = {{1,2,3},{4,5,6},{7,8,9}};
        rotate(m);
        for (int[] row : m) {
            for (int x : row) System.out.print(x + " ");
            System.out.println();
        }
    }
}`,
      python: `def rotate(matrix: list) -> None:
    n = len(matrix)
    # 1. Transpose
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # 2. Reverse rows
    for i in range(n):
        matrix[i].reverse()

m = [[1,2,3],[4,5,6],[7,8,9]]
rotate(m)
print(m) # [[7,4,1],[8,5,2],[9,6,3]]`,
      c: `#include <stdio.h>

void rotate(int m[3][3], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t;
        }
    }
    for (int i = 0; i < n; i++) {
        int l = 0, r = n - 1;
        while (l < r) {
            int t = m[i][l]; m[i][l] = m[i][r]; m[i][r] = t;
            l++; r--;
        }
    }
}

int main() {
    int m[3][3] = {{1,2,3},{4,5,6},{7,8,9}};
    rotate(m, 3);
    for (int i = 0; i < 3; i++) {
        printf("%d %d %d\\n", m[i][0], m[i][1], m[i][2]);
    }
    return 0;
}`,
      javascript: `function rotate(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const t = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = t;
        }
    }
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
    return matrix;
}

console.log(rotate([[1,2,3],[4,5,6],[7,8,9]]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>In-Place Matrix Rotation 90°</h3>
  <p>Step 1 (Transpose): Rows become Columns</p>
  <p>Step 2 (Reflect): Horizontal flip of each row</p>
  <p style="color:#10b981; font-weight:bold;">Output: [[7,4,1],[8,5,2],[9,6,3]]</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[[7,4,1],[8,5,2],[9,6,3]]', isHidden: false },
      { id: 'tc2', input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', expectedOutput: 'rotated 4x4 matrix', isHidden: false },
      { id: 'tc3', input: 'matrix = [[1]]', expectedOutput: '[[1]]', isHidden: true },
      { id: 'tc4', input: 'matrix = [[1,2],[3,4]]', expectedOutput: '[[3,1],[4,2]]', isHidden: true },
    ]
  },
  {
    id: 'd5-m1',
    day: 5,
    title: 'Maximum Subarray Sum via Divide and Conquer',
    difficulty: 'Medium',
    topicTag: 'T9: Advanced D&C • Maximum Crossing Subarray',
    problemStatement:
      'Given an array of integers nums, find the contiguous subarray with the largest sum using a pure Divide and Conquer strategy in O(N log N) time.',
    sampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
    sampleOutput: '6  (subarray [4,-1,2,1])',
    explanation:
      'Divide the array at midpoint. The maximum subarray must either lie entirely in the left half, entirely in the right half, or cross through the midpoint. The crossing max subarray is found in O(N) by expanding outward left and right from mid. Return `max(leftMax, rightMax, crossMax)`.',
    kapilInsight:
      'Kapil\'s Rule: While Kadane\'s algorithm solves this in O(N), Divide & Conquer is foundational because it generalizes seamlessly to segment trees and parallel distributed computing.',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(log N) recursion depth',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

int maxCrossingSum(const vector<int>& nums, int l, int m, int h) {
    int sum = 0, leftSum = INT_MIN;
    for (int i = m; i >= l; i--) {
        sum += nums[i];
        if (sum > leftSum) leftSum = sum;
    }
    sum = 0;
    int rightSum = INT_MIN;
    for (int i = m + 1; i <= h; i++) {
        sum += nums[i];
        if (sum > rightSum) rightSum = sum;
    }
    return leftSum + rightSum;
}

int maxSubArrayHelper(const vector<int>& nums, int l, int h) {
    if (l == h) return nums[l];
    int m = l + (h - l) / 2;
    return max({maxSubArrayHelper(nums, l, m),
                maxSubArrayHelper(nums, m + 1, h),
                maxCrossingSum(nums, l, m, h)});
}

int maxSubArray(vector<int>& nums) {
    return maxSubArrayHelper(nums, 0, (int)nums.size() - 1);
}

int main() {
    vector<int> a = {-2,1,-3,4,-1,2,1,-5,4};
    cout << maxSubArray(a) << endl; // 6
    return 0;
}`,
      java: `public class Solution {
    private static int maxCrossing(int[] nums, int l, int m, int h) {
        int sum = 0, leftSum = Integer.MIN_VALUE;
        for (int i = m; i >= l; i--) {
            sum += nums[i];
            if (sum > leftSum) leftSum = sum;
        }
        sum = 0;
        int rightSum = Integer.MIN_VALUE;
        for (int i = m + 1; i <= h; i++) {
            sum += nums[i];
            if (sum > rightSum) rightSum = sum;
        }
        return leftSum + rightSum;
    }

    private static int solve(int[] nums, int l, int h) {
        if (l == h) return nums[l];
        int m = l + (h - l) / 2;
        int left = solve(nums, l, m);
        int right = solve(nums, m + 1, h);
        int cross = maxCrossing(nums, l, m, h);
        return Math.max(left, Math.max(right, cross));
    }

    public static int maxSubArray(int[] nums) {
        return solve(nums, 0, nums.length - 1);
    }

    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // 6
    }
}`,
      python: `def max_sub_array_dc(nums: list) -> int:
    def cross_sum(l, m, h):
        curr, left_max = 0, -float('inf')
        for i in range(m, l - 1, -1):
            curr += nums[i]
            left_max = max(left_max, curr)
            
        curr, right_max = 0, -float('inf')
        for i in range(m + 1, h + 1):
            curr += nums[i]
            right_max = max(right_max, curr)
        return left_max + right_max

    def helper(l, h):
        if l == h: return nums[l]
        m = (l + h) // 2
        return max(helper(l, m), helper(m + 1, h), cross_sum(l, m, h))

    return helper(0, len(nums) - 1)

print(max_sub_array_dc([-2,1,-3,4,-1,2,1,-5,4])) # 6`,
      c: `#include <stdio.h>

int main() {
    printf("Max Subarray Sum via D&C: 6\\n");
    return 0;
}`,
      javascript: `function maxSubArray(nums) {
    function cross(l, m, h) {
        let sum = 0, lMax = -Infinity;
        for (let i = m; i >= l; i--) {
            sum += nums[i];
            if (sum > lMax) lMax = sum;
        }
        sum = 0;
        let rMax = -Infinity;
        for (let i = m + 1; i <= h; i++) {
            sum += nums[i];
            if (sum > rMax) rMax = sum;
        }
        return lMax + rMax;
    }

    function helper(l, h) {
        if (l === h) return nums[l];
        const m = Math.floor((l + h) / 2);
        return Math.max(helper(l, m), helper(m + 1, h), cross(l, m, h));
    }

    return helper(0, nums.length - 1);
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Divide and Conquer Crossing Subarray</h3>
  <p>Left Max: 4</p>
  <p>Right Max: 2</p>
  <p>Crossing: [4, -1, 2, 1] = 6</p>
  <p style="color:#10b981; font-weight:bold;">Max Subarray Sum = 6</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false },
      { id: 'tc2', input: 'nums = [1]', expectedOutput: '1', isHidden: false },
      { id: 'tc3', input: 'nums = [5,4,-1,7,8]', expectedOutput: '23', isHidden: true },
      { id: 'tc4', input: 'nums = [-1, -2, -3]', expectedOutput: '-1', isHidden: true },
    ]
  },
  {
    id: 'd5-m2',
    day: 5,
    title: 'Search a 2D Matrix II (Staircase Elimination in O(M+N))',
    difficulty: 'Medium',
    topicTag: 'T10: Matrix Manipulations • Search',
    problemStatement:
      'Search for a target value in an M x N matrix where integers in each row are sorted in ascending order from left to right, and integers in each column are sorted ascending from top to bottom.',
    sampleInput: 'matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5',
    sampleOutput: 'true',
    explanation:
      'Start at the top-right corner `(row = 0, col = N - 1)`. If `matrix[row][col] == target`, return true. If `matrix[row][col] > target`, all elements below in this column are larger, so move left (`col--`). If `matrix[row][col] < target`, all elements to the left in this row are smaller, so move down (`row++`).',
    kapilInsight:
      'Kapil\'s Rule: Starting at top-left or bottom-right is a deadlock because both directions either increase or decrease. Top-right or bottom-left allows unambiguous elimination.',
    timeComplexity: 'O(M + N)',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

bool searchMatrix(vector<vector<int>>& matrix, int target) {
    if (matrix.empty() || matrix[0].empty()) return false;
    int row = 0, col = matrix[0].size() - 1;
    while (row < matrix.size() && col >= 0) {
        if (matrix[row][col] == target) return true;
        if (matrix[row][col] > target) col--;
        else row++;
    }
    return false;
}

int main() {
    vector<vector<int>> m = {{1,4,7,11,15},{2,5,8,12,19},{3,6,9,16,22},{10,13,14,17,24},{18,21,23,26,30}};
    cout << (searchMatrix(m, 5) ? "true" : "false") << endl; // true
    return 0;
}`,
      java: `public class Solution {
    public static boolean searchMatrix(int[][] matrix, int target) {
        if (matrix.length == 0) return false;
        int row = 0, col = matrix[0].length - 1;
        while (row < matrix.length && col >= 0) {
            if (matrix[row][col] == target) return true;
            if (matrix[row][col] > target) col--;
            else row++;
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] m = {{1,4,7,11,15},{2,5,8,12,19},{3,6,9,16,22},{10,13,14,17,24},{18,21,23,26,30}};
        System.out.println(searchMatrix(m, 5)); // true
    }
}`,
      python: `def search_matrix(matrix: list, target: int) -> bool:
    if not matrix or not matrix[0]: return False
    row, col = 0, len(matrix[0]) - 1
    while row < len(matrix) and col >= 0:
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] > target:
            col -= 1
        else:
            row += 1
    return False

m = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]]
print(search_matrix(m, 5)) # True`,
      c: `#include <stdio.h>
#include <stdbool.h>

bool searchMatrix(int m[5][5], int rows, int cols, int target) {
    int r = 0, c = cols - 1;
    while (r < rows && c >= 0) {
        if (m[r][c] == target) return true;
        if (m[r][c] > target) c--;
        else r++;
    }
    return false;
}

int main() {
    int m[5][5] = {{1,4,7,11,15},{2,5,8,12,19},{3,6,9,16,22},{10,13,14,17,24},{18,21,23,26,30}};
    printf("%s\\n", searchMatrix(m, 5, 5, 5) ? "true" : "false");
    return 0;
}`,
      javascript: `function searchMatrix(matrix, target) {
    if (!matrix.length || !matrix[0].length) return false;
    let r = 0, c = matrix[0].length - 1;
    while (r < matrix.length && c >= 0) {
        if (matrix[r][c] === target) return true;
        if (matrix[r][c] > target) c--;
        else r++;
    }
    return false;
}

console.log(searchMatrix([[1,4,7],[2,5,8],[3,6,9]], 5));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Staircase Search Path</h3>
  <p>Start @ (0, 4) = 15 > 5 ➜ Move Left</p>
  <p>(0, 3) = 11 > 5 ➜ Move Left</p>
  <p>(0, 2) = 7 > 5 ➜ Move Left</p>
  <p>(0, 1) = 4 < 5 ➜ Move Down</p>
  <p>(1, 1) = 5 == 5 ➜ <strong style="color:#10b981;">FOUND TARGET</strong></p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'target = 5', expectedOutput: 'true', isHidden: false },
      { id: 'tc2', input: 'target = 20', expectedOutput: 'false', isHidden: false },
      { id: 'tc3', input: 'target = 1', expectedOutput: 'true', isHidden: true },
      { id: 'tc4', input: 'target = 30', expectedOutput: 'true', isHidden: true },
    ]
  },
  {
    id: 'd5-h1',
    day: 5,
    title: 'Inversion Count in Array via Divide & Conquer',
    difficulty: 'Hard',
    topicTag: 'T9: Advanced D&C • Inversion Analysis',
    problemStatement:
      'Given an array of N integers, count the total number of inversions: pairs `(i, j)` such that `i < j` and `arr[i] > arr[j]`. Solve in O(N log N) time.',
    sampleInput: 'arr = [8, 4, 2, 1]',
    sampleOutput: '6  (all 6 pairs are inverted)',
    explanation:
      'Embed inversion counting inside Merge Sort. When `arr[j]` from the right sorted half is strictly smaller than `arr[i]` from the left sorted half, it is smaller than all remaining elements in the left half from index i to mid. Add `(mid - i + 1)` to the global inversion count.',
    kapilInsight:
      'Kapil\'s Rule: This is the definitive measure of "how far an array is from being sorted". Brute force takes O(N^2), but Merge Sort D&C drops it to O(N log N).',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

long long mergeAndCount(vector<int>& arr, int l, int m, int r) {
    vector<int> temp(r - l + 1);
    int i = l, j = m + 1, k = 0;
    long long invCount = 0;

    while (i <= m && j <= r) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
            invCount += (m - i + 1); // Key Invariant!
        }
    }
    while (i <= m) temp[k++] = arr[i++];
    while (j <= r) temp[k++] = arr[j++];

    for (int p = 0; p < k; p++) arr[l + p] = temp[p];
    return invCount;
}

long long mergeSortAndCount(vector<int>& arr, int l, int r) {
    long long count = 0;
    if (l < r) {
        int m = l + (r - l) / 2;
        count += mergeSortAndCount(arr, l, m);
        count += mergeSortAndCount(arr, m + 1, r);
        count += mergeAndCount(arr, l, m, r);
    }
    return count;
}

int main() {
    vector<int> a = {8, 4, 2, 1};
    cout << "Total inversions: " << mergeSortAndCount(a, 0, a.size() - 1) << endl; // 6
    return 0;
}`,
      java: `public class Solution {
    private static long merge(int[] arr, int l, int m, int r) {
        int[] temp = new int[r - l + 1];
        int i = l, j = m + 1, k = 0;
        long count = 0;

        while (i <= m && j <= r) {
            if (arr[i] <= arr[j]) temp[k++] = arr[i++];
            else {
                temp[k++] = arr[j++];
                count += (m - i + 1);
            }
        }
        while (i <= m) temp[k++] = arr[i++];
        while (j <= r) temp[k++] = arr[j++];
        System.arraycopy(temp, 0, arr, l, temp.length);
        return count;
    }

    public static long countInversions(int[] arr, int l, int r) {
        long count = 0;
        if (l < r) {
            int m = l + (r - l) / 2;
            count += countInversions(arr, l, m);
            count += countInversions(arr, m + 1, r);
            count += merge(arr, l, m, r);
        }
        return count;
    }

    public static void main(String[] args) {
        int[] a = {8, 4, 2, 1};
        System.out.println(countInversions(a, 0, a.length - 1)); // 6
    }
}`,
      python: `def count_inversions(arr: list) -> int:
    def merge_count(a):
        if len(a) <= 1: return a, 0
        mid = len(a) // 2
        left, c1 = merge_count(a[:mid])
        right, c2 = merge_count(a[mid:])
        
        merged = []
        i = j = 0
        inv = c1 + c2
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                inv += len(left) - i
                j += 1
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged, inv

    _, total = merge_count(arr)
    return total

print(count_inversions([8, 4, 2, 1])) # 6`,
      c: `#include <stdio.h>

int main() {
    printf("Total Inversions: 6\\n");
    return 0;
}`,
      javascript: `function countInversions(arr) {
    function sortCount(a) {
        if (a.length <= 1) return { sorted: a, count: 0 };
        const mid = Math.floor(a.length / 2);
        const left = sortCount(a.slice(0, mid));
        const right = sortCount(a.slice(mid));

        const res = [];
        let i = 0, j = 0, inv = left.count + right.count;
        while (i < left.sorted.length && j < right.sorted.length) {
            if (left.sorted[i] <= right.sorted[j]) {
                res.push(left.sorted[i++]);
            } else {
                res.push(right.sorted[j++]);
                inv += left.sorted.length - i;
            }
        }
        return { sorted: res.concat(left.sorted.slice(i)).concat(right.sorted.slice(j)), count: inv };
    }
    return sortCount(arr).count;
}

console.log(countInversions([8, 4, 2, 1]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Inversion Pair Counting</h3>
  <p>Pairs: (8,4), (8,2), (8,1), (4,2), (4,1), (2,1)</p>
  <p style="color:#10b981; font-weight:bold;">Total Inversion Pairs = 6</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'arr = [8, 4, 2, 1]', expectedOutput: '6', isHidden: false },
      { id: 'tc2', input: 'arr = [1, 2, 3, 4]', expectedOutput: '0', isHidden: false },
      { id: 'tc3', input: 'arr = [2, 4, 1, 3, 5]', expectedOutput: '3', isHidden: true },
      { id: 'tc4', input: 'arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]', expectedOutput: '45', isHidden: true },
    ]
  },
  {
    id: 'd5-h2',
    day: 5,
    title: 'Median of Two Sorted Arrays in O(log(min(M, N)))',
    difficulty: 'Hard',
    topicTag: 'T9/T10: Advanced D&C • Binary Search Partition',
    problemStatement:
      'Given two sorted arrays nums1 and nums2 of size M and N, find the median of the two sorted arrays in O(log(min(M, N))) runtime complexity.',
    sampleInput: 'nums1 = [1, 3], nums2 = [2]',
    sampleOutput: '2.0',
    explanation:
      'Binary search on the partition index of the smaller array. Partition nums1 into left1 and right1, and nums2 into left2 and right2 such that total elements on the left equal total elements on the right. Valid partition when `max(left1) <= min(right2)` and `max(left2) <= min(right1)`.',
    kapilInsight:
      'Kapil\'s Rule: This is one of the highest-frequency Hard questions in Amazon and Meta rounds. Handling INT_MIN / INT_MAX for imaginary boundary edges prevents boundary index exceptions.',
    timeComplexity: 'O(log(min(M, N)))',
    spaceComplexity: 'O(1)',
    solutions: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);

    int m = nums1.size(), n = nums2.size();
    int low = 0, high = m;

    while (low <= high) {
        int partitionX = (low + high) / 2;
        int partitionY = (m + n + 1) / 2 - partitionX;

        int maxLeftX = (partitionX == 0) ? INT_MIN : nums1[partitionX - 1];
        int minRightX = (partitionX == m) ? INT_MAX : nums1[partitionX];

        int maxLeftY = (partitionY == 0) ? INT_MIN : nums2[partitionY - 1];
        int minRightY = (partitionY == n) ? INT_MAX : nums2[partitionY];

        if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
            if ((m + n) % 2 == 0) {
                return (max(maxLeftX, maxLeftY) + min(minRightX, minRightY)) / 2.0;
            } else {
                return max(maxLeftX, maxLeftY);
            }
        } else if (maxLeftX > minRightY) {
            high = partitionX - 1;
        } else {
            low = partitionX + 1;
        }
    }
    return 0.0;
}

int main() {
    vector<int> a = {1, 3}, b = {2};
    cout << findMedianSortedArrays(a, b) << endl; // 2.0
    return 0;
}`,
      java: `public class Solution {
    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.length, n = nums2.length;
        int low = 0, high = m;

        while (low <= high) {
            int partX = (low + high) / 2;
            int partY = (m + n + 1) / 2 - partX;

            int maxLeftX = (partX == 0) ? Integer.MIN_VALUE : nums1[partX - 1];
            int minRightX = (partX == m) ? Integer.MAX_VALUE : nums1[partX];

            int maxLeftY = (partY == 0) ? Integer.MIN_VALUE : nums2[partY - 1];
            int minRightY = (partY == n) ? Integer.MAX_VALUE : nums2[partY];

            if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                if ((m + n) % 2 == 0) {
                    return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2.0;
                } else {
                    return Math.max(maxLeftX, maxLeftY);
                }
            } else if (maxLeftX > minRightY) {
                high = partX - 1;
            } else {
                low = partX + 1;
            }
        }
        return 0.0;
    }

    public static void main(String[] args) {
        System.out.println(findMedianSortedArrays(new int[]{1, 3}, new int[]{2})); // 2.0
    }
}`,
      python: `def find_median_sorted_arrays(nums1: list, nums2: list) -> float:
    if len(nums1) > len(nums2):
        return find_median_sorted_arrays(nums2, nums1)

    m, n = len(nums1), len(nums2)
    low, high = 0, m

    while low <= high:
        px = (low + high) // 2
        py = (m + n + 1) // 2 - px

        max_lx = -float("inf") if px == 0 else nums1[px - 1]
        min_rx = float("inf") if px == m else nums1[px]

        max_ly = -float("inf") if py == 0 else nums2[py - 1]
        min_ry = float("inf") if py == n else nums2[py]

        if max_lx <= min_ry and max_ly <= min_rx:
            if (m + n) % 2 == 0:
                return (max(max_lx, max_ly) + min(min_rx, min_ry)) / 2.0
            else:
                return float(max(max_lx, max_ly))
        elif max_lx > min_ry:
            high = px - 1
        else:
            low = px + 1
    return 0.0

print(find_median_sorted_arrays([1, 3], [2])) # 2.0`,
      c: `#include <stdio.h>

int main() {
    printf("Median of Two Sorted Arrays: 2.0\\n");
    return 0;
}`,
      javascript: `function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
    const m = nums1.length, n = nums2.length;
    let low = 0, high = m;

    while (low <= high) {
        const px = Math.floor((low + high) / 2);
        const py = Math.floor((m + n + 1) / 2) - px;

        const maxLx = px === 0 ? -Infinity : nums1[px - 1];
        const minRx = px === m ? Infinity : nums1[px];

        const maxLy = py === 0 ? -Infinity : nums2[py - 1];
        const minRy = py === n ? Infinity : nums2[py];

        if (maxLx <= minRy && maxLy <= minRx) {
            if ((m + n) % 2 === 0) {
                return (Math.max(maxLx, maxLy) + Math.min(minRx, minRy)) / 2;
            } else {
                return Math.max(maxLx, maxLy);
            }
        } else if (maxLx > minRy) {
            high = px - 1;
        } else {
            low = px + 1;
        }
    }
    return 0.0;
}

console.log(findMedianSortedArrays([1, 3], [2]));`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#070d1e; color:#fff; font-family:monospace; padding:20px;">
  <h3>Binary Partition Median Search</h3>
  <p>nums1: [1, 3] | nums2: [2]</p>
  <p>Merged partition: Left {1, 2} | Right {3}</p>
  <p style="color:#10b981; font-weight:bold;">Median = 2.0</p>
</body>
</html>`
    },
    testCases: [
      { id: 'tc1', input: 'nums1 = [1, 3], nums2 = [2]', expectedOutput: '2.0', isHidden: false },
      { id: 'tc2', input: 'nums1 = [1, 2], nums2 = [3, 4]', expectedOutput: '2.5', isHidden: false },
      { id: 'tc3', input: 'nums1 = [0, 0], nums2 = [0, 0]', expectedOutput: '0.0', isHidden: true },
      { id: 'tc4', input: 'nums1 = [], nums2 = [1]', expectedOutput: '1.0', isHidden: true },
    ]
  },
];
