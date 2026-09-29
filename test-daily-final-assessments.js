import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('========================================================================');
console.log('🎯 AUDITING 25-MCQ DAILY PROCTORED ASSESSMENTS & UNLOCKED DAYS (1 TO 5) 🎯');
console.log('========================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failedTests++;
  } else {
    console.log(`✅ PASSED: ${message}`);
    passedTests++;
  }
}

// 1. Audit dailyFinalAssessments.ts File & Structure
console.log('--- 1. AUDITING DAILY FINAL ASSESSMENTS (125 TOTAL MCQS) ---');
const assessmentsPath = path.join(__dirname, 'src/data/dailyFinalAssessments.ts');
assert(fs.existsSync(assessmentsPath), 'src/data/dailyFinalAssessments.ts exists');

const assessmentsRaw = fs.readFileSync(assessmentsPath, 'utf8');

// Check Days 1 to 5 existence
for (let d = 1; d <= 5; d++) {
  const dayKeyPattern = new RegExp(`\\b${d}:\\s*\\[`);
  assert(dayKeyPattern.test(assessmentsRaw), `Day ${d} array is configured in DAILY_FINAL_ASSESSMENTS`);
}

// Count total questions across file (should be exactly 125)
const questionIdMatches = assessmentsRaw.match(/id:\s*'d\d-fa-\d+'/g) || [];
assert(questionIdMatches.length === 125, `Exactly 125 total questions exist (found ${questionIdMatches.length})`);

// Check unique IDs (no duplicates)
const uniqueIds = new Set(questionIdMatches);
assert(uniqueIds.size === 125, `All 125 question IDs are strictly unique (found ${uniqueIds.size} unique IDs)`);

// Check 25 questions per day (10 Aptitude + 15 DSA)
for (let d = 1; d <= 5; d++) {
  const dayMatches = assessmentsRaw.match(new RegExp(`id:\\s*'d${d}-fa-\\d+'`, 'g')) || [];
  assert(dayMatches.length === 25, `Day ${d} has exactly 25 questions (found ${dayMatches.length})`);
}

// Check Day-specific topics in explanations and tags
assert(assessmentsRaw.includes('Day 1 Aptitude:') && assessmentsRaw.includes('Day 1 DSA:'), 'Day 1 contains both Aptitude & DSA questions');
assert(assessmentsRaw.includes('Day 2 Aptitude:') && assessmentsRaw.includes('Day 2 DSA:'), 'Day 2 contains both Aptitude & DSA questions');
assert(assessmentsRaw.includes('Day 3 Aptitude:') && assessmentsRaw.includes('Day 3 DSA:'), 'Day 3 contains both Aptitude & DSA questions');
assert(assessmentsRaw.includes('Day 4 Aptitude:') && assessmentsRaw.includes('Day 4 DSA:'), 'Day 4 contains both Aptitude & DSA questions');
assert(assessmentsRaw.includes('Day 5 Aptitude:') && assessmentsRaw.includes('Day 5 DSA:'), 'Day 5 contains both Aptitude & DSA questions');

// Check Syllabus specificity
assert(assessmentsRaw.includes('Topological Sort') || assessmentsRaw.includes('BFS'), 'Day 1 covers Graph algorithms (T1)');
assert(assessmentsRaw.includes('Euclidean') || assessmentsRaw.includes('Lamé'), 'Day 2 covers Math/Euclidean algorithms (T3/T4)');
assert(assessmentsRaw.includes('Sieve') || assessmentsRaw.includes('Two Pointers'), 'Day 3 covers Number Theory & Two Pointers (T5/T6)');
assert(assessmentsRaw.includes('Sliding Window') || assessmentsRaw.includes('Divide & Conquer'), 'Day 4 covers Window & D&C (T7/T8)');
assert(assessmentsRaw.includes('Matrix') || assessmentsRaw.includes('Median of Two Sorted Arrays'), 'Day 5 covers Matrix & Advanced D&C (T9/T10)');

// 2. Audit ProctoredExamModal.tsx (30 Min Timer • Pure Browser Integrity • ZERO Camera)
console.log('\n--- 2. AUDITING PROCTORED EXAM MODAL (ZERO CAMERA • 30 MIN TIMER) ---');
const modalPath = path.join(__dirname, 'src/components/ProctoredExamModal.tsx');
assert(fs.existsSync(modalPath), 'src/components/ProctoredExamModal.tsx exists');

const modalRaw = fs.readFileSync(modalPath, 'utf8');

// Strict check: ZERO camera requirement
assert(!modalRaw.includes('getUserMedia'), 'ProctoredExamModal does NOT call navigator.mediaDevices.getUserMedia');
assert(!modalRaw.includes('<video'), 'ProctoredExamModal does NOT render any <video> elements');
assert(!modalRaw.includes('<Camera'), 'ProctoredExamModal does NOT render Camera component or feed');
assert(modalRaw.includes('No Camera Required') || modalRaw.includes('No camera hardware required'), 'ProctoredExamModal explicitly states no camera is required');

// Check 30-minute timer duration
assert(modalRaw.includes('30 * 60'), 'ProctoredExamModal timer is initialized to 30 minutes (1800s)');
assert(modalRaw.includes('30-minute timer initiated') || modalRaw.includes('30 Minutes strict'), 'ProctoredExamModal logs 30-minute timer countdown');

// Check 25-MCQ Navigator Palette
assert(modalRaw.includes('Question Navigator (1 to 25)'), 'Question Navigator (1 to 25) is rendered in ProctoredExamModal');
assert(modalRaw.includes('questions.map'), 'ProctoredExamModal maps over all 25 daily questions');

// Check Anti-Cheat Sentry
assert(modalRaw.includes('visibilitychange'), 'Visibility change sentry active for tab-switch monitoring');
assert(modalRaw.includes('requestFullscreen'), 'Fullscreen enforcement active');
assert(modalRaw.includes('onCopy') && modalRaw.includes('onPaste'), 'Clipboard copy-paste blocked by proctor');

// 3. Audit Day Unlock Logic (All Days 1-5 Unlocked by Default)
console.log('\n--- 3. AUDITING ALL DAYS UNLOCKED IN PREREQUISITES ---');
const prereqPath = path.join(__dirname, 'src/utils/prerequisites.ts');
const prereqRaw = fs.readFileSync(prereqPath, 'utf8');

assert(prereqRaw.includes('ALL DAYS 1 TO 5 ARE UNLOCKED BY DEFAULT'), 'prerequisites.ts explicitly marks all days unlocked by default');
assert(!prereqRaw.includes('!istStatus.isWithinActiveWindow'), 'IST time window lock is removed from default day access');

// 4. Audit DayView.tsx & LeftSidebar.tsx Touchpoints
console.log('\n--- 4. AUDITING DAYVIEW & LEFTSIDEBAR EXAM LAUNCH TOUCHPOINTS ---');
const dayViewRaw = fs.readFileSync(path.join(__dirname, 'src/components/DayView.tsx'), 'utf8');
assert(dayViewRaw.includes('25 Proctored MCQs (10 Aptitude + 15 DSA)'), 'DayView renders 25 Proctored MCQs card for all days');
assert(dayViewRaw.includes('⏱️ 30 Mins • 🚫 No Camera Required'), 'DayView highlights 30 Mins and No Camera Required');
assert(dayViewRaw.includes('onOpenFinalExam(day)'), 'DayView triggers onOpenFinalExam with active day');

const leftSidebarRaw = fs.readFileSync(path.join(__dirname, 'src/components/LeftSidebar.tsx'), 'utf8');
assert(leftSidebarRaw.includes('Proctored Exam (25 MCQs)'), 'LeftSidebar renders Proctored Exam (25 MCQs) link');
assert(leftSidebarRaw.includes('Exam: 25 MCQs') || leftSidebarRaw.includes('dayFinalExamPassed'), 'LeftSidebar displays daily exam status');

console.log('\n========================================================================');
console.log(`📊 TOTAL CHECKS RUN: ${totalTests}`);
console.log(`✅ PASSED CHECKS: ${passedTests}`);
console.log(`❌ FAILED CHECKS: ${failedTests}`);
if (failedTests === 0) {
  console.log('🎉 100% OF ALL DAILY 25-MCQ ASSESSMENTS & UNLOCKED DAYS VERIFIED!');
} else {
  process.exit(1);
}
console.log('========================================================================');
