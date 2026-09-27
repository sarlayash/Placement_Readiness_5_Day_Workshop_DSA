import { SolvedProgram } from '../types';

export const LEVEL_ZERO_PROGRAMS: SolvedProgram[] = [
  // =========================================================================
  // PROGRAM 1: Hello World & Formatted Welcome
  // =========================================================================
  {
    id: 'lvl0-1',
    day: 0,
    title: 'LEVEL 0: Program 1 — Hello World & Formatted Welcome',
    difficulty: 'Level 0',
    topicTag: 'LEVEL 0: Foundations • Syntax & I/O',
    problemStatement:
      'Write a program that prints "Hello, World! Welcome to Kapil\'s 5-Day Placement Bootcamp." on the first line, and reads a person\'s name to print "Welcome, [Name]! Let\'s master DSA." on the second line.',
    sampleInput: 'Kapil',
    sampleOutput:
      'Hello, World! Welcome to Kapil\'s 5-Day Placement Bootcamp.\nWelcome, Kapil! Let\'s master DSA.',
    explanation:
      'This program introduces standard output and standard input syntax across languages. It teaches the fundamental boilerplate, package/library inclusions, the main entry point, and string formatting.',
    kapilInsight:
      'Kapil\'s Rule: Every placement candidate must be flawless in basic boilerplate syntax. In live coding interviews, getting standard I/O right in the first 30 seconds shows professional muscle memory.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    solutions: {
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World! Welcome to Kapil's 5-Day Placement Bootcamp.");
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextLine()) {
            String name = scanner.nextLine().trim();
            System.out.println("Welcome, " + name + "! Let's master DSA.");
        }
        scanner.close();
    }
}`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    printf("Hello, World! Welcome to Kapil's 5-Day Placement Bootcamp.\\n");
    char name[100];
    if (fgets(name, sizeof(name), stdin) != NULL) {
        // Strip trailing newline
        name[strcspn(name, "\\r\\n")] = '\\0';
        printf("Welcome, %s! Let's master DSA.\\n", name);
    }
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World! Welcome to Kapil's 5-Day Placement Bootcamp." << endl;
    string name;
    if (getline(cin, name)) {
        cout << "Welcome, " << name << "! Let's master DSA." << endl;
    }
    return 0;
}`,
      python: `import sys

def main():
    print("Hello, World! Welcome to Kapil's 5-Day Placement Bootcamp.")
    try:
        name = sys.stdin.readline().strip()
        if name:
            print(f"Welcome, {name}! Let's master DSA.")
    except Exception:
        pass

if __name__ == "__main__":
    main()`,
      javascript: `const readline = require('readline');

console.log("Hello, World! Welcome to Kapil's 5-Day Placement Bootcamp.");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (name) => {
    console.log(\`Welcome, \${name.trim()}! Let's master DSA.\`);
    rl.close();
});`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LEVEL 0: Program 1 — Hello World & Greeting</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d1e; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 500px; margin: 0 auto; background: #0d1b38; border: 1px solid #1e3a70; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; }
    p { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; }
    input { width: 100%; box-sizing: border-box; padding: 10px 14px; background: #050b18; border: 1px solid #224480; border-radius: 8px; color: #fff; margin: 12px 0; font-size: 0.95rem; }
    button { background: linear-gradient(135deg, #3b82f6, #6366f1); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .output-box { margin-top: 16px; padding: 14px; background: #030712; border-radius: 8px; border-left: 4px solid #10b981; font-family: monospace; font-size: 0.88rem; color: #34d399; min-height: 48px; white-space: pre-line; }
  </style>
</head>
<body>
  <div class="card">
    <h2>👋 LEVEL 0: Hello World & Greeting</h2>
    <p>Hello, World! Welcome to Kapil's 5-Day Placement Bootcamp.</p>
    <label for="nameInput" style="font-size: 0.85rem; color: #cbd5e1;">Enter your name:</label>
    <input type="text" id="nameInput" placeholder="e.g. Kapil" value="Kapil">
    <button onclick="greetUser()">Generate Welcome</button>
    <div id="output" class="output-box">Welcome, Kapil! Let's master DSA.</div>
  </div>

  <script>
    function greetUser() {
      const name = document.getElementById('nameInput').value.trim() || 'Learner';
      const output = document.getElementById('output');
      output.textContent = "Hello, World! Welcome to Kapil's 5-Day Placement Bootcamp.\\n" +
                           "Welcome, " + name + "! Let's master DSA.";
    }
  </script>
</body>
</html>`
    },
    testCases: [
      {
        id: 'lvl0-1-tc1',
        input: 'Kapil',
        expectedOutput:
          "Hello, World! Welcome to Kapil's 5-Day Placement Bootcamp.\nWelcome, Kapil! Let's master DSA.",
        isHidden: false,
        explanation: 'Greeting formatted with input Kapil'
      },
      {
        id: 'lvl0-1-tc2',
        input: 'Placement Candidate',
        expectedOutput:
          "Hello, World! Welcome to Kapil's 5-Day Placement Bootcamp.\nWelcome, Placement Candidate! Let's master DSA.",
        isHidden: true,
        explanation: 'Greeting formatted with multi-word string'
      }
    ]
  },

  // =========================================================================
  // PROGRAM 2: Sum and Average of Two Numbers
  // =========================================================================
  {
    id: 'lvl0-2',
    day: 0,
    title: 'LEVEL 0: Program 2 — Sum and Average of Two Numbers',
    difficulty: 'Level 0',
    topicTag: 'LEVEL 0: Foundations • Arithmetic & Precision',
    problemStatement:
      'Given two numbers A and B, calculate their sum (A + B) and their mathematical average ((A + B) / 2.0). Display the sum as an integer and the average rounded/formatted to 2 decimal places.',
    sampleInput: '10 25',
    sampleOutput: 'Sum: 35\nAverage: 17.50',
    explanation:
      'Demonstrates basic integer arithmetic and type casting from integer to floating point. In integer-divided operations like in C/Java/C++, dividing by integer 2 causes truncation; dividing by 2.0 preserves precision.',
    kapilInsight:
      'Kapil\'s Rule: Watch out for integer truncation! In C/C++ and Java, `(a + b) / 2` drops decimals. Always cast to `double` or divide by `2.0` when calculating averages.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    solutions: {
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextDouble()) {
            double a = sc.nextDouble();
            double b = sc.nextDouble();
            long sum = (long)(a + b);
            double avg = (a + b) / 2.0;
            System.out.println("Sum: " + sum);
            System.out.printf("Average: %.2f\\n", avg);
        }
        sc.close();
    }
}`,
      c: `#include <stdio.h>

int main() {
    double a, b;
    if (scanf("%lf %lf", &a, &b) == 2) {
        long long sum = (long long)(a + b);
        double avg = (a + b) / 2.0;
        printf("Sum: %lld\\n", sum);
        printf("Average: %.2f\\n", avg);
    }
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double a, b;
    if (cin >> a >> b) {
        long long sum = (long long)(a + b);
        double avg = (a + b) / 2.0;
        cout << "Sum: " << sum << endl;
        cout << fixed << setprecision(2) << "Average: " << avg << endl;
    }
    return 0;
}`,
      python: `import sys

def main():
    input_data = sys.stdin.read().split()
    if len(input_data) >= 2:
        a = float(input_data[0])
        b = float(input_data[1])
        s = int(a + b)
        avg = (a + b) / 2.0
        print(f"Sum: {s}")
        print(f"Average: {avg:.2f}")

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');

function computeSumAndAvg(a, b) {
    const sum = Math.round(a + b);
    const avg = (a + b) / 2.0;
    return \`Sum: \${sum}\\nAverage: \${avg.toFixed(2)}\`;
}

const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length >= 2) {
    const a = parseFloat(input[0]);
    const b = parseFloat(input[1]);
    console.log(computeSumAndAvg(a, b));
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LEVEL 0: Program 2 — Sum & Average Calculator</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d1e; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 500px; margin: 0 auto; background: #0d1b38; border: 1px solid #1e3a70; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; }
    .row { display: flex; gap: 12px; margin: 12px 0; }
    input { flex: 1; padding: 10px 14px; background: #050b18; border: 1px solid #224480; border-radius: 8px; color: #fff; font-size: 0.95rem; }
    button { width: 100%; background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 6px; }
    button:hover { opacity: 0.9; }
    .output-box { margin-top: 16px; padding: 14px; background: #030712; border-radius: 8px; border-left: 4px solid #38bdf8; font-family: monospace; font-size: 0.92rem; color: #38bdf8; white-space: pre-line; }
  </style>
</head>
<body>
  <div class="card">
    <h2>➕ LEVEL 0: Sum & Average Calculator</h2>
    <div class="row">
      <input type="number" id="numA" placeholder="Number A" value="10">
      <input type="number" id="numB" placeholder="Number B" value="25">
    </div>
    <button onclick="calculate()">Compute Sum & Average</button>
    <div id="output" class="output-box">Sum: 35\nAverage: 17.50</div>
  </div>

  <script>
    function calculate() {
      const a = parseFloat(document.getElementById('numA').value) || 0;
      const b = parseFloat(document.getElementById('numB').value) || 0;
      const sum = Math.round(a + b);
      const avg = (a + b) / 2.0;
      document.getElementById('output').textContent = "Sum: " + sum + "\\nAverage: " + avg.toFixed(2);
    }
  </script>
</body>
</html>`
    },
    testCases: [
      {
        id: 'lvl0-2-tc1',
        input: '10 25',
        expectedOutput: 'Sum: 35\nAverage: 17.50',
        isHidden: false,
        explanation: 'Sum = 35, Average = 35/2 = 17.50'
      },
      {
        id: 'lvl0-2-tc2',
        input: '7 14',
        expectedOutput: 'Sum: 21\nAverage: 10.50',
        isHidden: true,
        explanation: 'Sum = 21, Average = 21/2 = 10.50'
      }
    ]
  },

  // =========================================================================
  // PROGRAM 3: Check Even or Odd Number
  // =========================================================================
  {
    id: 'lvl0-3',
    day: 0,
    title: 'LEVEL 0: Program 3 — Check Even or Odd Number',
    difficulty: 'Level 0',
    topicTag: 'LEVEL 0: Foundations • Conditionals & Modulo',
    problemStatement:
      'Given an integer N, determine whether the number is Even or Odd using conditional logic. Output "N is Even" or "N is Odd".',
    sampleInput: '42',
    sampleOutput: '42 is Even',
    explanation:
      'An integer is divisible by 2 if `N % 2 == 0`. Alternatively, bitwise check `(N & 1) == 0` evaluates the least significant bit in 1 CPU cycle.',
    kapilInsight:
      'Kapil\'s Pro-Tip: In competitive programming and low-level code, `(N & 1) == 0` is faster than `N % 2 == 0` because it avoids division circuitry. Master both!',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    solutions: {
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLong()) {
            long n = sc.nextLong();
            if ((n & 1) == 0) {
                System.out.println(n + " is Even");
            } else {
                System.out.println(n + " is Odd");
            }
        }
        sc.close();
    }
}`,
      c: `#include <stdio.h>

int main() {
    long long n;
    if (scanf("%lld", &n) == 1) {
        if ((n & 1) == 0) {
            printf("%lld is Even\\n", n);
        } else {
            printf("%lld is Odd\\n", n);
        }
    }
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    if (cin >> n) {
        if ((n & 1) == 0) {
            cout << n << " is Even" << endl;
        } else {
            cout << n << " is Odd" << endl;
        }
    }
    return 0;
}`,
      python: `import sys

def main():
    line = sys.stdin.read().strip()
    if line:
        n = int(line.split()[0])
        if n % 2 == 0:
            print(f"{n} is Even")
        else:
            print(f"{n} is Odd")

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const n = parseInt(input.split(/\\s+/)[0], 10);
    console.log(n % 2 === 0 ? \`\${n} is Even\` : \`\${n} is Odd\`);
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LEVEL 0: Program 3 — Even or Odd Checker</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d1e; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 500px; margin: 0 auto; background: #0d1b38; border: 1px solid #1e3a70; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; }
    input { width: 100%; box-sizing: border-box; padding: 10px 14px; background: #050b18; border: 1px solid #224480; border-radius: 8px; color: #fff; margin: 12px 0; font-size: 0.95rem; }
    button { width: 100%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .badge { display: inline-block; padding: 8px 16px; border-radius: 9999px; font-weight: bold; margin-top: 16px; font-size: 0.95rem; }
    .even { background: #064e3b; color: #34d399; border: 1px solid #059669; }
    .odd { background: #701a75; color: #f472b6; border: 1px solid #db2777; }
  </style>
</head>
<body>
  <div class="card">
    <h2>⚖️ LEVEL 0: Even or Odd Checker</h2>
    <label for="numInput" style="font-size: 0.85rem; color: #cbd5e1;">Enter any integer:</label>
    <input type="number" id="numInput" value="42" placeholder="e.g. 42">
    <button onclick="checkParity()">Check Parity</button>
    <div id="result">
      <span class="badge even">42 is Even</span>
    </div>
  </div>

  <script>
    function checkParity() {
      const val = parseInt(document.getElementById('numInput').value, 10);
      const res = document.getElementById('result');
      if (isNaN(val)) {
        res.innerHTML = '<span style="color:#ef4444;">Please enter a valid integer</span>';
        return;
      }
      const isEven = (val % 2 === 0);
      res.innerHTML = '<span class="badge ' + (isEven ? 'even' : 'odd') + '">' + val + ' is ' + (isEven ? 'Even' : 'Odd') + '</span>';
    }
  </script>
</body>
</html>`
    },
    testCases: [
      {
        id: 'lvl0-3-tc1',
        input: '42',
        expectedOutput: '42 is Even',
        isHidden: false,
        explanation: '42 % 2 == 0 so it is Even'
      },
      {
        id: 'lvl0-3-tc2',
        input: '77',
        expectedOutput: '77 is Odd',
        isHidden: true,
        explanation: '77 % 2 == 1 so it is Odd'
      }
    ]
  },

  // =========================================================================
  // PROGRAM 4: Find Largest of Three Numbers
  // =========================================================================
  {
    id: 'lvl0-4',
    day: 0,
    title: 'LEVEL 0: Program 4 — Find Largest of Three Numbers',
    difficulty: 'Level 0',
    topicTag: 'LEVEL 0: Foundations • Relational Operators',
    problemStatement:
      'Given three distinct or non-distinct integers A, B, and C, find and print the maximum value among them using conditional statements or logical comparisons.',
    sampleInput: '45 89 23',
    sampleOutput: 'Largest: 89',
    explanation:
      'Evaluate `if (A >= B && A >= C)` then A is largest; `else if (B >= C)` B is largest; `else` C is largest. Demonstrates short-circuit logical operators and nested conditions.',
    kapilInsight:
      'Kapil\'s Rule: In interview rounds, start with the raw `if-else` comparison ladder to show boolean logic understanding, then mention built-in `Math.max(a, Math.max(b, c))` to demonstrate clean code.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    solutions: {
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLong()) {
            long a = sc.nextLong();
            long b = sc.nextLong();
            long c = sc.nextLong();
            long maxVal = a;
            if (b > maxVal) maxVal = b;
            if (c > maxVal) maxVal = c;
            System.out.println("Largest: " + maxVal);
        }
        sc.close();
    }
}`,
      c: `#include <stdio.h>

int main() {
    long long a, b, c;
    if (scanf("%lld %lld %lld", &a, &b, &c) == 3) {
        long long maxVal = a;
        if (b > maxVal) maxVal = b;
        if (c > maxVal) maxVal = c;
        printf("Largest: %lld\\n", maxVal);
    }
    return 0;
}`,
      cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    long long a, b, c;
    if (cin >> a >> b >> c) {
        long long maxVal = max({a, b, c});
        cout << "Largest: " << maxVal << endl;
    }
    return 0;
}`,
      python: `import sys

def main():
    parts = sys.stdin.read().split()
    if len(parts) >= 3:
        a, b, c = map(int, parts[:3])
        largest = max(a, b, c)
        print(f"Largest: {largest}")

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');

const parts = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (parts.length >= 3) {
    const a = parseInt(parts[0], 10);
    const b = parseInt(parts[1], 10);
    const c = parseInt(parts[2], 10);
    const largest = Math.max(a, b, c);
    console.log(\`Largest: \${largest}\`);
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LEVEL 0: Program 4 — Find Largest of Three</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d1e; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 500px; margin: 0 auto; background: #0d1b38; border: 1px solid #1e3a70; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 14px 0; }
    input { width: 100%; box-sizing: border-box; padding: 10px; background: #050b18; border: 1px solid #224480; border-radius: 8px; color: #fff; font-size: 0.95rem; text-align: center; }
    button { width: 100%; background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .output-box { margin-top: 16px; padding: 14px; background: #030712; border-radius: 8px; border-left: 4px solid #f59e0b; font-family: monospace; font-size: 0.95rem; color: #fbbf24; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🏆 LEVEL 0: Largest of Three Numbers</h2>
    <div class="grid">
      <input type="number" id="valA" value="45" placeholder="A">
      <input type="number" id="valB" value="89" placeholder="B">
      <input type="number" id="valC" value="23" placeholder="C">
    </div>
    <button onclick="findMax()">Find Largest Number</button>
    <div id="output" class="output-box">Largest: 89</div>
  </div>

  <script>
    function findMax() {
      const a = parseFloat(document.getElementById('valA').value) || 0;
      const b = parseFloat(document.getElementById('valB').value) || 0;
      const c = parseFloat(document.getElementById('valC').value) || 0;
      const maxVal = Math.max(a, b, c);
      document.getElementById('output').textContent = "Largest: " + maxVal;
    }
  </script>
</body>
</html>`
    },
    testCases: [
      {
        id: 'lvl0-4-tc1',
        input: '45 89 23',
        expectedOutput: 'Largest: 89',
        isHidden: false,
        explanation: '89 is greater than 45 and 23'
      },
      {
        id: 'lvl0-4-tc2',
        input: '-10 -5 -20',
        expectedOutput: 'Largest: -5',
        isHidden: true,
        explanation: 'Among negative numbers, -5 is closest to 0'
      }
    ]
  },

  // =========================================================================
  // PROGRAM 5: Swap Two Numbers
  // =========================================================================
  {
    id: 'lvl0-5',
    day: 0,
    title: 'LEVEL 0: Program 5 — Swap Two Numbers (With & Without 3rd Variable)',
    difficulty: 'Level 0',
    topicTag: 'LEVEL 0: Foundations • Memory & Variables',
    problemStatement:
      'Given two numbers A and B, swap their values and print them before and after the swap. Showcase the swap logic clearly.',
    sampleInput: '15 28',
    sampleOutput: 'Before: A = 15, B = 28\nAfter: A = 28, B = 15',
    explanation:
      'Method 1: Use temporary variable `temp = a; a = b; b = temp;`.\nMethod 2 (In-place arithmetic): `a = a + b; b = a - b; a = a - b;`.\nMethod 3 (Bitwise XOR): `a = a ^ b; b = a ^ b; a = a ^ b;`.',
    kapilInsight:
      'Kapil\'s Rule: Interviewers love asking "Swap without third variable". Always explain integer overflow risk when using `a = a + b` if values are near `INT_MAX`, and provide the XOR swap as the safest in-place alternative!',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    solutions: {
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLong()) {
            long a = sc.nextLong();
            long b = sc.nextLong();
            System.out.println("Before: A = " + a + ", B = " + b);
            
            // In-place arithmetic swap
            a = a + b;
            b = a - b;
            a = a - b;
            
            System.out.println("After: A = " + a + ", B = " + b);
        }
        sc.close();
    }
}`,
      c: `#include <stdio.h>

int main() {
    long long a, b;
    if (scanf("%lld %lld", &a, &b) == 2) {
        printf("Before: A = %lld, B = %lld\\n", a, b);
        
        // XOR in-place swap
        a = a ^ b;
        b = a ^ b;
        a = a ^ b;
        
        printf("After: A = %lld, B = %lld\\n", a, b);
    }
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        cout << "Before: A = " << a << ", B = " << b << endl;
        
        // Swapping using std::swap or arithmetic
        long long temp = a;
        a = b;
        b = temp;
        
        cout << "After: A = " << a << ", B = " << b << endl;
    }
    return 0;
}`,
      python: `import sys

def main():
    parts = sys.stdin.read().split()
    if len(parts) >= 2:
        a = int(parts[0])
        b = int(parts[1])
        print(f"Before: A = {a}, B = {b}")
        
        # Idiomatic Python tuple swap
        a, b = b, a
        
        print(f"After: A = {a}, B = {b}")

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');

const parts = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (parts.length >= 2) {
    let a = parseInt(parts[0], 10);
    let b = parseInt(parts[1], 10);
    console.log(\`Before: A = \${a}, B = \${b}\`);
    
    // ES6 Destructuring swap
    [a, b] = [b, a];
    
    console.log(\`After: A = \${a}, B = \${b}\`);
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LEVEL 0: Program 5 — Swap Two Variables</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d1e; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 500px; margin: 0 auto; background: #0d1b38; border: 1px solid #1e3a70; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; }
    .boxes { display: flex; align-items: center; justify-content: space-around; margin: 16px 0; }
    .box { background: #050b18; border: 2px dashed #3b82f6; border-radius: 12px; padding: 14px 20px; text-align: center; }
    .label { font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px; }
    .val { font-size: 1.5rem; font-weight: bold; color: #38bdf8; }
    .arrow { font-size: 1.5rem; color: #f59e0b; }
    button { width: 100%; background: linear-gradient(135deg, #0ea5e9, #2563eb); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .output-box { margin-top: 16px; padding: 14px; background: #030712; border-radius: 8px; border-left: 4px solid #0ea5e9; font-family: monospace; font-size: 0.92rem; color: #38bdf8; white-space: pre-line; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🔄 LEVEL 0: Swap Two Variables</h2>
    <div class="boxes">
      <div class="box">
        <div class="label">Bucket A</div>
        <div class="val" id="boxA">15</div>
      </div>
      <div class="arrow">⇄</div>
      <div class="box">
        <div class="label">Bucket B</div>
        <div class="val" id="boxB">28</div>
      </div>
    </div>
    <button onclick="performSwap()">Trigger In-Place Swap</button>
    <div id="output" class="output-box">Before: A = 15, B = 28\nAfter: A = 28, B = 15</div>
  </div>

  <script>
    let a = 15, b = 28;
    function performSwap() {
      const beforeStr = "Before: A = " + a + ", B = " + b;
      // In-place arithmetic swap
      a = a + b;
      b = a - b;
      a = a - b;
      document.getElementById('boxA').textContent = a;
      document.getElementById('boxB').textContent = b;
      document.getElementById('output').textContent = beforeStr + "\\nAfter: A = " + a + ", B = " + b;
    }
  </script>
</body>
</html>`
    },
    testCases: [
      {
        id: 'lvl0-5-tc1',
        input: '15 28',
        expectedOutput: 'Before: A = 15, B = 28\nAfter: A = 28, B = 15',
        isHidden: false,
        explanation: 'Values swapped between A and B'
      },
      {
        id: 'lvl0-5-tc2',
        input: '100 999',
        expectedOutput: 'Before: A = 100, B = 999\nAfter: A = 999, B = 100',
        isHidden: true,
        explanation: 'Values swapped with larger numbers'
      }
    ]
  },

  // =========================================================================
  // PROGRAM 6: Factorial of a Number
  // =========================================================================
  {
    id: 'lvl0-6',
    day: 0,
    title: 'LEVEL 0: Program 6 — Factorial of a Number',
    difficulty: 'Level 0',
    topicTag: 'LEVEL 0: Foundations • Loops & Accumulators',
    problemStatement:
      'Given a non-negative integer N (0 <= N <= 20), calculate its factorial (N!). Note that 0! = 1.',
    sampleInput: '5',
    sampleOutput: '5! = 120',
    explanation:
      'The factorial of a non-negative integer N is the product of all positive integers less than or equal to N. For N = 0, 0! is defined as 1. Handled iteratively with a 64-bit integer (`long long` in C/C++, `long` in Java) to avoid 32-bit overflow.',
    kapilInsight:
      'Kapil\'s Rule: 13! overflows standard 32-bit signed integers (max 2.14 x 10^9). 20! fits in 64-bit unsigned/signed `long long`. For N > 20, use BigInteger in Java or Python\'s arbitrary precision integers.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    solutions: {
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            long fact = 1;
            for (int i = 1; i <= n; i++) {
                fact *= i;
            }
            System.out.println(n + "! = " + fact);
        }
        sc.close();
    }
}`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        long long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact *= i;
        }
        printf("%d! = %lld\\n", n, fact);
    }
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        long long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact *= i;
        }
        cout << n << "! = " << fact << endl;
    }
    return 0;
}`,
      python: `import sys

def main():
    line = sys.stdin.read().strip()
    if line:
        n = int(line.split()[0])
        fact = 1
        for i in range(1, n + 1):
            fact *= i
        print(f"{n}! = {fact}")

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const n = parseInt(input.split(/\\s+/)[0], 10);
    let fact = 1n;
    for (let i = 1n; i <= BigInt(n); i++) {
        fact *= i;
    }
    console.log(\`\${n}! = \${fact.toString()}\`);
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LEVEL 0: Program 6 — Factorial Calculator</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d1e; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 500px; margin: 0 auto; background: #0d1b38; border: 1px solid #1e3a70; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; }
    input { width: 100%; box-sizing: border-box; padding: 10px 14px; background: #050b18; border: 1px solid #224480; border-radius: 8px; color: #fff; margin: 12px 0; font-size: 0.95rem; }
    button { width: 100%; background: linear-gradient(135deg, #ec4899, #be185d); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .output-box { margin-top: 16px; padding: 14px; background: #030712; border-radius: 8px; border-left: 4px solid #ec4899; font-family: monospace; font-size: 0.95rem; color: #f472b6; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h2>❗ LEVEL 0: Factorial Calculator</h2>
    <label for="factInput" style="font-size: 0.85rem; color: #cbd5e1;">Enter N (0 to 20):</label>
    <input type="number" id="factInput" min="0" max="20" value="5">
    <button onclick="computeFactorial()">Calculate Factorial</button>
    <div id="output" class="output-box">5! = 120</div>
  </div>

  <script>
    function computeFactorial() {
      const n = parseInt(document.getElementById('factInput').value, 10);
      if (isNaN(n) || n < 0) {
        document.getElementById('output').textContent = "Please enter non-negative integer";
        return;
      }
      let fact = 1n;
      for (let i = 1n; i <= BigInt(n); i++) {
        fact *= i;
      }
      document.getElementById('output').textContent = n + "! = " + fact.toString();
    }
  </script>
</body>
</html>`
    },
    testCases: [
      {
        id: 'lvl0-6-tc1',
        input: '5',
        expectedOutput: '5! = 120',
        isHidden: false,
        explanation: '5 * 4 * 3 * 2 * 1 = 120'
      },
      {
        id: 'lvl0-6-tc2',
        input: '0',
        expectedOutput: '0! = 1',
        isHidden: false,
        explanation: '0! is defined mathematically as 1'
      },
      {
        id: 'lvl0-6-tc3',
        input: '7',
        expectedOutput: '7! = 5040',
        isHidden: true,
        explanation: '7! = 5040'
      }
    ]
  },

  // =========================================================================
  // PROGRAM 7: Reverse a Number
  // =========================================================================
  {
    id: 'lvl0-7',
    day: 0,
    title: 'LEVEL 0: Program 7 — Reverse an Integer',
    difficulty: 'Level 0',
    topicTag: 'LEVEL 0: Foundations • Digit Extraction & While Loops',
    problemStatement:
      'Given an integer N, reverse its digits. If the number is negative, preserve the negative sign (e.g. -456 becomes -654). Output "Reversed: [Result]".',
    sampleInput: '12345',
    sampleOutput: 'Reversed: 54321',
    explanation:
      'Repeatedly extract the last digit using modulo 10 (`rem = n % 10`), append it to the accumulating reversed number (`rev = rev * 10 + rem`), and divide N by 10 (`n = n / 10`) until N becomes 0.',
    kapilInsight:
      'Kapil\'s Rule: This is the mother of all digit extraction problems. Once you master `n % 10` and `n / 10`, you can solve Armstrong numbers, Palindrome numbers, and digital roots effortlessly.',
    timeComplexity: 'O(log10 N)',
    spaceComplexity: 'O(1)',
    solutions: {
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLong()) {
            long n = sc.nextLong();
            boolean isNeg = n < 0;
            long num = Math.abs(n);
            long rev = 0;
            while (num > 0) {
                rev = rev * 10 + (num % 10);
                num /= 10;
            }
            if (isNeg) rev = -rev;
            System.out.println("Reversed: " + rev);
        }
        sc.close();
    }
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    long long n;
    if (scanf("%lld", &n) == 1) {
        int isNeg = (n < 0);
        long long num = isNeg ? -n : n;
        long long rev = 0;
        while (num > 0) {
            rev = rev * 10 + (num % 10);
            num /= 10;
        }
        if (isNeg) rev = -rev;
        printf("Reversed: %lld\\n", rev);
    }
    return 0;
}`,
      cpp: `#include <iostream>
#include <cmath>
using namespace std;

int main() {
    long long n;
    if (cin >> n) {
        bool isNeg = (n < 0);
        long long num = abs(n);
        long long rev = 0;
        while (num > 0) {
            rev = rev * 10 + (num % 10);
            num /= 10;
        }
        if (isNeg) rev = -rev;
        cout << "Reversed: " << rev << endl;
    }
    return 0;
}`,
      python: `import sys

def main():
    line = sys.stdin.read().strip()
    if line:
        n = int(line.split()[0])
        is_neg = n < 0
        s = str(abs(n))[::-1]
        rev = -int(s) if is_neg else int(s)
        print(f"Reversed: {rev}")

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const n = parseInt(input.split(/\\s+/)[0], 10);
    const isNeg = n < 0;
    const str = Math.abs(n).toString().split('').reverse().join('');
    const rev = (isNeg ? -1 : 1) * parseInt(str, 10);
    console.log(\`Reversed: \${rev}\`);
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LEVEL 0: Program 7 — Reverse Number Visualizer</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d1e; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 500px; margin: 0 auto; background: #0d1b38; border: 1px solid #1e3a70; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; }
    input { width: 100%; box-sizing: border-box; padding: 10px 14px; background: #050b18; border: 1px solid #224480; border-radius: 8px; color: #fff; margin: 12px 0; font-size: 0.95rem; }
    button { width: 100%; background: linear-gradient(135deg, #14b8a6, #0d9488); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .output-box { margin-top: 16px; padding: 14px; background: #030712; border-radius: 8px; border-left: 4px solid #14b8a6; font-family: monospace; font-size: 0.95rem; color: #2dd4bf; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h2>⏪ LEVEL 0: Reverse an Integer</h2>
    <label for="revInput" style="font-size: 0.85rem; color: #cbd5e1;">Enter any integer:</label>
    <input type="number" id="revInput" value="12345">
    <button onclick="reverseNum()">Reverse Digits</button>
    <div id="output" class="output-box">Reversed: 54321</div>
  </div>

  <script>
    function reverseNum() {
      const n = parseInt(document.getElementById('revInput').value, 10);
      if (isNaN(n)) return;
      const isNeg = n < 0;
      const reversedStr = Math.abs(n).toString().split('').reverse().join('');
      const res = (isNeg ? '-' : '') + parseInt(reversedStr, 10);
      document.getElementById('output').textContent = "Reversed: " + res;
    }
  </script>
</body>
</html>`
    },
    testCases: [
      {
        id: 'lvl0-7-tc1',
        input: '12345',
        expectedOutput: 'Reversed: 54321',
        isHidden: false,
        explanation: 'Digits 12345 reversed to 54321'
      },
      {
        id: 'lvl0-7-tc2',
        input: '-987',
        expectedOutput: 'Reversed: -789',
        isHidden: true,
        explanation: 'Negative sign preserved'
      }
    ]
  },

  // =========================================================================
  // PROGRAM 8: Check Palindrome (Number / String)
  // =========================================================================
  {
    id: 'lvl0-8',
    day: 0,
    title: 'LEVEL 0: Program 8 — Check Palindrome (Number / String)',
    difficulty: 'Level 0',
    topicTag: 'LEVEL 0: Foundations • Two Pointers & Symmetry',
    problemStatement:
      'Given a word or number as a string S, determine whether it is a Palindrome (reads the same forwards and backwards). Output "S is a Palindrome" or "S is NOT a Palindrome".',
    sampleInput: 'radar',
    sampleOutput: 'radar is a Palindrome',
    explanation:
      'A sequence is a palindrome if character at index `left` matches character at index `right` while moving `left` forward and `right` backward until they meet.',
    kapilInsight:
      'Kapil\'s Rule: Two-pointer symmetry check takes O(N) time and O(1) auxiliary space without allocating a reversed copy. This fundamental pattern is tested in almost every Day 3 & Day 4 placement problem.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    solutions: {
      java: `import java.util.Scanner;

public class Solution {
    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next().trim();
            if (isPalindrome(s)) {
                System.out.println(s + " is a Palindrome");
            } else {
                System.out.println(s + " is NOT a Palindrome");
            }
        }
        sc.close();
    }
}`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool isPalindrome(const char* s) {
    int left = 0, right = strlen(s) - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    char s[200];
    if (scanf("%199s", s) == 1) {
        if (isPalindrome(s)) {
            printf("%s is a Palindrome\\n", s);
        } else {
            printf("%s is NOT a Palindrome\\n", s);
        }
    }
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(const string& s) {
    int left = 0, right = (int)s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    string s;
    if (cin >> s) {
        if (isPalindrome(s)) {
            cout << s << " is a Palindrome" << endl;
        } else {
            cout << s << " is NOT a Palindrome" << endl;
        }
    }
    return 0;
}`,
      python: `import sys

def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

def main():
    line = sys.stdin.read().strip()
    if line:
        s = line.split()[0]
        if is_palindrome(s):
            print(f"{s} is a Palindrome")
        else:
            print(f"{s} is NOT a Palindrome")

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');

function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++;
        right--;
    }
    return true;
}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const s = input.split(/\\s+/)[0];
    console.log(isPalindrome(s) ? \`\${s} is a Palindrome\` : \`\${s} is NOT a Palindrome\`);
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LEVEL 0: Program 8 — Palindrome Checker</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d1e; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 500px; margin: 0 auto; background: #0d1b38; border: 1px solid #1e3a70; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; }
    input { width: 100%; box-sizing: border-box; padding: 10px 14px; background: #050b18; border: 1px solid #224480; border-radius: 8px; color: #fff; margin: 12px 0; font-size: 0.95rem; }
    button { width: 100%; background: linear-gradient(135deg, #a855f7, #7c3aed); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .badge { display: inline-block; padding: 8px 16px; border-radius: 9999px; font-weight: bold; margin-top: 16px; font-size: 0.95rem; }
    .palin { background: #064e3b; color: #34d399; border: 1px solid #059669; }
    .not-palin { background: #4c0519; color: #f43f5e; border: 1px solid #be123c; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🪞 LEVEL 0: Palindrome Checker</h2>
    <label for="strInput" style="font-size: 0.85rem; color: #cbd5e1;">Enter string or number:</label>
    <input type="text" id="strInput" value="radar" placeholder="e.g. radar or 1221">
    <button onclick="checkPalin()">Verify Palindrome</button>
    <div id="result">
      <span class="badge palin">radar is a Palindrome</span>
    </div>
  </div>

  <script>
    function checkPalin() {
      const s = document.getElementById('strInput').value.trim();
      const res = document.getElementById('result');
      if (!s) {
        res.innerHTML = '<span style="color:#ef4444;">Please enter text</span>';
        return;
      }
      let left = 0, right = s.length - 1, isPal = true;
      while (left < right) {
        if (s[left] !== s[right]) { isPal = false; break; }
        left++;
        right--;
      }
      res.innerHTML = '<span class="badge ' + (isPal ? 'palin' : 'not-palin') + '">' + s + ' is ' + (isPal ? 'a Palindrome' : 'NOT a Palindrome') + '</span>';
    }
  </script>
</body>
</html>`
    },
    testCases: [
      {
        id: 'lvl0-8-tc1',
        input: 'radar',
        expectedOutput: 'radar is a Palindrome',
        isHidden: false,
        explanation: 'radar reversed is radar'
      },
      {
        id: 'lvl0-8-tc2',
        input: 'placement',
        expectedOutput: 'placement is NOT a Palindrome',
        isHidden: false,
        explanation: 'placement reversed is tnemecalp'
      },
      {
        id: 'lvl0-8-tc3',
        input: '12321',
        expectedOutput: '12321 is a Palindrome',
        isHidden: true,
        explanation: 'Numeric palindrome'
      }
    ]
  },

  // =========================================================================
  // PROGRAM 9: Multiplication Table Generator
  // =========================================================================
  {
    id: 'lvl0-9',
    day: 0,
    title: 'LEVEL 0: Program 9 — Multiplication Table Generator',
    difficulty: 'Level 0',
    topicTag: 'LEVEL 0: Foundations • Iteration & Formatted Output',
    problemStatement:
      'Given an integer N, generate and display its multiplication table from 1 to 10 in the exact format "N x i = Result".',
    sampleInput: '7',
    sampleOutput:
      '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70',
    explanation:
      'A single `for` loop executing from 1 through 10 multiplies N by the loop counter `i` and prints the formatted string.',
    kapilInsight:
      'Kapil\'s Rule: Formatted output tests your command over string templating across languages (`printf` in C, `cout` in C++, string concatenation in Java, f-strings in Python, and template literals in JS).',
    timeComplexity: 'O(1) [Fixed 10 steps]',
    spaceComplexity: 'O(1)',
    solutions: {
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            for (int i = 1; i <= 10; i++) {
                System.out.println(n + " x " + i + " = " + (n * i));
            }
        }
        sc.close();
    }
}`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        for (int i = 1; i <= 10; i++) {
            printf("%d x %d = %d\\n", n, i, n * i);
        }
    }
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        for (int i = 1; i <= 10; i++) {
            cout << n << " x " << i << " = " << (n * i) << endl;
        }
    }
    return 0;
}`,
      python: `import sys

def main():
    line = sys.stdin.read().strip()
    if line:
        n = int(line.split()[0])
        for i in range(1, 11):
            print(f"{n} x {i} = {n * i}")

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const n = parseInt(input.split(/\\s+/)[0], 10);
    for (let i = 1; i <= 10; i++) {
        console.log(\`\${n} x \${i} = \${n * i}\`);
    }
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LEVEL 0: Program 9 — Multiplication Table</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d1e; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 500px; margin: 0 auto; background: #0d1b38; border: 1px solid #1e3a70; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; }
    input { width: 100%; box-sizing: border-box; padding: 10px 14px; background: #050b18; border: 1px solid #224480; border-radius: 8px; color: #fff; margin: 12px 0; font-size: 0.95rem; }
    button { width: 100%; background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .table-grid { margin-top: 16px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .step { background: #030712; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 0.88rem; color: #38bdf8; border: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="card">
    <h2>✖️ LEVEL 0: Multiplication Table Generator</h2>
    <label for="tableInput" style="font-size: 0.85rem; color: #cbd5e1;">Enter number N:</label>
    <input type="number" id="tableInput" value="7">
    <button onclick="generateTable()">Generate Table (1 to 10)</button>
    <div id="tableOutput" class="table-grid"></div>
  </div>

  <script>
    function generateTable() {
      const n = parseInt(document.getElementById('tableInput').value, 10) || 7;
      const container = document.getElementById('tableOutput');
      container.innerHTML = '';
      for (let i = 1; i <= 10; i++) {
        const div = document.createElement('div');
        div.className = 'step';
        div.textContent = n + " x " + i + " = " + (n * i);
        container.appendChild(div);
      }
    }
    generateTable();
  </script>
</body>
</html>`
    },
    testCases: [
      {
        id: 'lvl0-9-tc1',
        input: '7',
        expectedOutput:
          '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70',
        isHidden: false,
        explanation: 'Multiplication table for 7 from 1 to 10'
      },
      {
        id: 'lvl0-9-tc2',
        input: '12',
        expectedOutput:
          '12 x 1 = 12\n12 x 2 = 24\n12 x 3 = 36\n12 x 4 = 48\n12 x 5 = 60\n12 x 6 = 72\n12 x 7 = 84\n12 x 8 = 96\n12 x 9 = 108\n12 x 10 = 120',
        isHidden: true,
        explanation: 'Multiplication table for 12'
      }
    ]
  },

  // =========================================================================
  // PROGRAM 10: Simple Arithmetic Calculator
  // =========================================================================
  {
    id: 'lvl0-10',
    day: 0,
    title: 'LEVEL 0: Program 10 — Simple Arithmetic Calculator',
    difficulty: 'Level 0',
    topicTag: 'LEVEL 0: Foundations • Switch-Case & Edge Handling',
    problemStatement:
      'Given two numbers A and B, and an arithmetic operator character OP (\'+\', \'-\', \'*\', \'/\'), perform the calculation. If division by zero is attempted (OP is \'/\' and B is 0), print "Error: Division by Zero". Otherwise, output "Result: [Value]" (with division formatted to 2 decimals).',
    sampleInput: '20 4 /',
    sampleOutput: 'Result: 5.00',
    explanation:
      'Utilizes `switch-case` (in Java, C, C++) or `if-elif-else` (in Python) to route computation based on operator token. Includes defensive validation against zero denominators.',
    kapilInsight:
      'Kapil\'s Rule: In interview system-design or algorithmic coding, handling divide-by-zero is the #1 check interviewers make to test boundary-condition discipline. Never skip edge cases!',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    solutions: {
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextDouble()) {
            double a = sc.nextDouble();
            double b = sc.nextDouble();
            String op = sc.next();
            switch (op.charAt(0)) {
                case '+':
                    System.out.printf("Result: %.2f\\n", (a + b));
                    break;
                case '-':
                    System.out.printf("Result: %.2f\\n", (a - b));
                    break;
                case '*':
                    System.out.printf("Result: %.2f\\n", (a * b));
                    break;
                case '/':
                    if (b == 0) {
                        System.out.println("Error: Division by Zero");
                    } else {
                        System.out.printf("Result: %.2f\\n", (a / b));
                    }
                    break;
                default:
                    System.out.println("Error: Invalid Operator");
            }
        }
        sc.close();
    }
}`,
      c: `#include <stdio.h>

int main() {
    double a, b;
    char op;
    if (scanf("%lf %lf %c", &a, &b, &op) == 3) {
        switch (op) {
            case '+':
                printf("Result: %.2f\\n", a + b);
                break;
            case '-':
                printf("Result: %.2f\\n", a - b);
                break;
            case '*':
                printf("Result: %.2f\\n", a * b);
                break;
            case '/':
                if (b == 0.0) {
                    printf("Error: Division by Zero\\n");
                } else {
                    printf("Result: %.2f\\n", a / b);
                }
                break;
            default:
                printf("Error: Invalid Operator\\n");
        }
    }
    return 0;
}`,
      cpp: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double a, b;
    char op;
    if (cin >> a >> b >> op) {
        cout << fixed << setprecision(2);
        switch (op) {
            case '+': cout << "Result: " << (a + b) << endl; break;
            case '-': cout << "Result: " << (a - b) << endl; break;
            case '*': cout << "Result: " << (a * b) << endl; break;
            case '/':
                if (b == 0.0) {
                    cout << "Error: Division by Zero" << endl;
                } else {
                    cout << "Result: " << (a / b) << endl;
                }
                break;
            default: cout << "Error: Invalid Operator" << endl;
        }
    }
    return 0;
}`,
      python: `import sys

def main():
    parts = sys.stdin.read().split()
    if len(parts) >= 3:
        a = float(parts[0])
        b = float(parts[1])
        op = parts[2]
        if op == '+':
            print(f"Result: {a + b:.2f}")
        elif op == '-':
            print(f"Result: {a - b:.2f}")
        elif op == '*':
            print(f"Result: {a * b:.2f}")
        elif op == '/':
            if b == 0:
                print("Error: Division by Zero")
            else:
                print(f"Result: {a / b:.2f}")
        else:
            print("Error: Invalid Operator")

if __name__ == "__main__":
    main()`,
      javascript: `const fs = require('fs');

const parts = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (parts.length >= 3) {
    const a = parseFloat(parts[0]);
    const b = parseFloat(parts[1]);
    const op = parts[2];
    
    if (op === '+') console.log(\`Result: \${(a + b).toFixed(2)}\`);
    else if (op === '-') console.log(\`Result: \${(a - b).toFixed(2)}\`);
    else if (op === '*') console.log(\`Result: \${(a * b).toFixed(2)}\`);
    else if (op === '/') {
        if (b === 0) console.log("Error: Division by Zero");
        else console.log(\`Result: \${(a / b).toFixed(2)}\`);
    } else {
        console.log("Error: Invalid Operator");
    }
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LEVEL 0: Program 10 — Mini Calculator</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d1e; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 500px; margin: 0 auto; background: #0d1b38; border: 1px solid #1e3a70; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; font-size: 1.25rem; }
    .row { display: flex; gap: 8px; margin: 12px 0; }
    input, select { padding: 10px; background: #050b18; border: 1px solid #224480; border-radius: 8px; color: #fff; font-size: 0.95rem; }
    input { flex: 1; }
    select { width: 70px; text-align: center; font-weight: bold; }
    button { width: 100%; background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .output-box { margin-top: 16px; padding: 14px; background: #030712; border-radius: 8px; border-left: 4px solid #10b981; font-family: monospace; font-size: 0.95rem; color: #34d399; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🧮 LEVEL 0: Arithmetic Calculator</h2>
    <div class="row">
      <input type="number" id="calcA" value="20" placeholder="A">
      <select id="calcOp">
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="*">*</option>
        <option value="/" selected>/</option>
      </select>
      <input type="number" id="calcB" value="4" placeholder="B">
    </div>
    <button onclick="calculateResult()">Calculate</button>
    <div id="output" class="output-box">Result: 5.00</div>
  </div>

  <script>
    function calculateResult() {
      const a = parseFloat(document.getElementById('calcA').value) || 0;
      const b = parseFloat(document.getElementById('calcB').value);
      const op = document.getElementById('calcOp').value;
      const out = document.getElementById('output');
      
      if (isNaN(b)) {
        out.textContent = "Error: Invalid second number";
        return;
      }
      if (op === '/' && b === 0) {
        out.textContent = "Error: Division by Zero";
        out.style.borderLeftColor = "#ef4444";
        out.style.color = "#f87171";
        return;
      }
      out.style.borderLeftColor = "#10b981";
      out.style.color = "#34d399";
      let res = 0;
      if (op === '+') res = a + b;
      else if (op === '-') res = a - b;
      else if (op === '*') res = a * b;
      else if (op === '/') res = a / b;
      out.textContent = "Result: " + res.toFixed(2);
    }
  </script>
</body>
</html>`
    },
    testCases: [
      {
        id: 'lvl0-10-tc1',
        input: '20 4 /',
        expectedOutput: 'Result: 5.00',
        isHidden: false,
        explanation: '20 divided by 4 is 5.00'
      },
      {
        id: 'lvl0-10-tc2',
        input: '15 0 /',
        expectedOutput: 'Error: Division by Zero',
        isHidden: false,
        explanation: 'Division by zero caught and handled'
      },
      {
        id: 'lvl0-10-tc3',
        input: '12 7 *',
        expectedOutput: 'Result: 84.00',
        isHidden: true,
        explanation: '12 times 7 is 84.00'
      }
    ]
  }
];
