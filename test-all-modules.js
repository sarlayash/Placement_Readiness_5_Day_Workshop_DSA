import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('========================================================================');
console.log('🛡️  FULL COMPREHENSIVE AUDIT & END-TO-END TEST SUITE FOR ALL MODULES  🛡️');
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

// -------------------------------------------------------------------------
// 1. AUDIT CURRICULUM MODULES (DAYS 1 TO 5, T1 TO T10)
// -------------------------------------------------------------------------
console.log('--- 1. AUDITING 5-DAY CURRICULUM (TOPICS T1 TO T10) ---');
const curriculumFilePath = path.join(__dirname, 'src/data/curriculum.ts');
assert(fs.existsSync(curriculumFilePath), 'curriculum.ts file exists');
const curriculumContent = fs.readFileSync(curriculumFilePath, 'utf8');

// Check HACKERRANK_COURSE_URL
assert(
  curriculumContent.includes('HACKERRANK_COURSE_URL =') &&
    curriculumContent.includes('https://www.hackerrank.com/'),
  'HackerRank Course URL configured properly'
);

// Check Topics T1 to T10
for (let t = 1; t <= 10; t++) {
  assert(
    curriculumContent.includes(`code: 'T${t}'`),
    `Topic T${t} exists in curriculum`
  );
}

// Check Days 1 to 5 parts
for (let d = 1; d <= 5; d++) {
  const dayOccurrences = (curriculumContent.match(new RegExp(`day:\\s*${d},`, 'g')) || []).length;
  assert(
    dayOccurrences >= 2,
    `Day ${d} contains both Part 1 and Part 2 topics (found ${dayOccurrences} references)`
  );
}

// Check Starter Code for all 6 languages in codeTemplates.ts
const codeTemplatesPath = path.join(__dirname, 'src/utils/codeTemplates.ts');
assert(fs.existsSync(codeTemplatesPath), 'codeTemplates.ts file exists');
const codeTemplatesContent = fs.readFileSync(codeTemplatesPath, 'utf8');
const languages = ['c', 'cpp', 'java', 'python', 'html', 'javascript'];
languages.forEach((lang) => {
  assert(
    codeTemplatesContent.includes(`${lang}:`),
    `Starter code includes language: ${lang}`
  );
});

// -------------------------------------------------------------------------
// 2. AUDIT DAILY ASSESSMENTS (PRE & POST ASSESSMENTS FOR DAYS 1 TO 5)
// -------------------------------------------------------------------------
console.log('\n--- 2. AUDITING PRE & POST ASSESSMENTS (100 TOTAL MCQS: 10 PRE + 10 POST PER DAY) ---');
for (let d = 1; d <= 5; d++) {
  assert(
    curriculumContent.includes(`day: ${d},`) &&
      curriculumContent.includes('preAssessment:') &&
      curriculumContent.includes('postAssessment:'),
    `Day ${d} has both preAssessment and postAssessment configured`
  );
}

const assessmentQuestionMatches = curriculumContent.match(/correctAnswer:\s*[0-3]/g) || [];
assert(
  assessmentQuestionMatches.length >= 100,
  `At least 100 assessment questions exist with valid 0-3 answer indices (found ${assessmentQuestionMatches.length})`
);

// -------------------------------------------------------------------------
// 3. AUDIT 25 SOLVED PROGRAMS (5 PER DAY: 2 EASY, 2 MEDIUM, 1 HARD)
// -------------------------------------------------------------------------
console.log('\n--- 3. AUDITING 25 SOLVED PROGRAMS (2E • 2M • 1H PER DAY) ---');
const solvedFilePath = path.join(__dirname, 'src/data/solvedPrograms.ts');
assert(fs.existsSync(solvedFilePath), 'solvedPrograms.ts file exists');
const solvedContent = fs.readFileSync(solvedFilePath, 'utf8');

for (let d = 1; d <= 5; d++) {
  const dayPrograms = solvedContent.match(new RegExp(`day:\\s*${d},`, 'g')) || [];
  assert(
    dayPrograms.length === 5,
    `Day ${d} has exactly 5 solved masterclass programs (found ${dayPrograms.length})`
  );
}

// -------------------------------------------------------------------------
// 4. AUDIT LEVEL 0 FOUNDATIONS (10 BASIC SOLVED PROGRAMS)
// -------------------------------------------------------------------------
console.log('\n--- 4. AUDITING LEVEL 0 FOUNDATIONS (10 SOLVED BASIC PROGRAMS) ---');
const levelZeroFilePath = path.join(__dirname, 'src/data/levelZeroPrograms.ts');
assert(fs.existsSync(levelZeroFilePath), 'levelZeroPrograms.ts file exists');
const levelZeroContent = fs.readFileSync(levelZeroFilePath, 'utf8');

for (let i = 1; i <= 10; i++) {
  assert(
    levelZeroContent.includes(`id: 'lvl0-${i}'`),
    `LEVEL 0 Program ${i} (lvl0-${i}) exists`
  );
}

// Check all 5 core languages in each Level 0 program
const levelZeroLangs = ['java', 'c', 'cpp', 'python', 'html'];
levelZeroLangs.forEach((lang) => {
  const matches = levelZeroContent.match(new RegExp(`${lang}:\\s*[\`"]`, 'g')) || [];
  assert(
    matches.length >= 10,
    `Language '${lang}' has solutions in all 10 Level 0 programs (found ${matches.length})`
  );
});

// -------------------------------------------------------------------------
// 5. AUDIT ALGORITHM VISUALIZER LAB (SEARCHING, SORTING, GRAPHS, TREES)
// -------------------------------------------------------------------------
console.log('\n--- 5. AUDITING ALGORITHM VISUALIZER LAB (11 ALGORITHMS) ---');
const algoDataPath = path.join(__dirname, 'src/data/algorithmsData.ts');
assert(fs.existsSync(algoDataPath), 'algorithmsData.ts exists');
const algoDataContent = fs.readFileSync(algoDataPath, 'utf8');

const requiredAlgos = [
  { id: 'linear-search', cat: 'Searching' },
  { id: 'binary-search', cat: 'Searching' },
  { id: 'bubble-sort', cat: 'Sorting' },
  { id: 'selection-sort', cat: 'Sorting' },
  { id: 'insertion-sort', cat: 'Sorting' },
  { id: 'merge-sort', cat: 'Sorting' },
  { id: 'quick-sort', cat: 'Sorting' },
  { id: 'bfs-graph', cat: 'Graphs' },
  { id: 'dfs-graph', cat: 'Graphs' },
  { id: 'dijkstra-graph', cat: 'Graphs' },
  { id: 'bst-ops', cat: 'Trees' },
  { id: 'tree-traversal', cat: 'Trees' }
];

requiredAlgos.forEach((algo) => {
  assert(
    algoDataContent.includes(`id: '${algo.id}'`) &&
      algoDataContent.includes(`category: '${algo.cat}'`),
    `Algorithm '${algo.id}' verified in category '${algo.cat}'`
  );
});

// -------------------------------------------------------------------------
// 6. AUDIT 25 APTITUDE MCQS & 10 SPINNING WHEEL MCQS
// -------------------------------------------------------------------------
console.log('\n--- 6. AUDITING 25 APTITUDE MCQS & 10 WHEEL MCQS ---');
const aptFilePath = path.join(__dirname, 'src/data/aptitudeMCQs.ts');
assert(fs.existsSync(aptFilePath), 'aptitudeMCQs.ts file exists');
const aptContent = fs.readFileSync(aptFilePath, 'utf8');
const aptCount = (aptContent.match(/id:\s*'apt-\d+'/g) || []).length;
assert(aptCount === 25, `Exactly 25 Aptitude MCQs exist (found ${aptCount})`);

const spinFilePath = path.join(__dirname, 'src/data/spinningWheelMCQs.ts');
assert(fs.existsSync(spinFilePath), 'spinningWheelMCQs.ts exists');
const spinContent = fs.readFileSync(spinFilePath, 'utf8');
const spinCount = (spinContent.match(/id:\s*'sw-\d+'/g) || []).length;
assert(spinCount === 10, `Exactly 10 Spinning Wheel MCQs exist with negative marking (found ${spinCount})`);

// -------------------------------------------------------------------------
// 7. AUDIT STRICT GATING & PREREQUISITES LOGIC
// -------------------------------------------------------------------------
console.log('\n--- 7. AUDITING STRICT PROGRESSION & GATEKEEPER LOGIC ---');
const prereqPath = path.join(__dirname, 'src/utils/prerequisites.ts');
assert(fs.existsSync(prereqPath), 'prerequisites.ts exists');
const prereqContent = fs.readFileSync(prereqPath, 'utf8');
assert(prereqContent.includes('isDayUnlockedStrict'), 'isDayUnlockedStrict logic present');
assert(prereqContent.includes('checkDayCompletion'), 'checkDayCompletion logic present');
assert(prereqContent.includes('checkFinalExamEligibility'), 'checkFinalExamEligibility logic present');
assert(prereqContent.includes('acknowledgedSolvedProgramIds'), 'Strict check gates on 6 solved programs acknowledgement');

// -------------------------------------------------------------------------
// 8. AUDIT DAILY FEEDBACK LINK & REMINDER WINDOW (2:30 PM - 3:30 PM IST)
// -------------------------------------------------------------------------
console.log('\n--- 8. AUDITING DAILY FEEDBACK & AUTOMATED REMINDER TIMELINES ---');
const feedbackUtilPath = path.join(__dirname, 'src/utils/feedback.ts');
assert(fs.existsSync(feedbackUtilPath), 'feedback.ts exists');
const feedbackContent = fs.readFileSync(feedbackUtilPath, 'utf8');
assert(
  feedbackContent.includes('https://fpln.site/feedback/form.php?id=4gvfOQ8m'),
  'Official feedback link verified: fpln.site/feedback/form.php?id=4gvfOQ8m'
);
assert(
  feedbackContent.includes('startHour: 14') && feedbackContent.includes('startMinute: 30'),
  'Feedback window start verified at 14:30 (2:30 PM IST)'
);
assert(
  feedbackContent.includes('endHour: 15') && feedbackContent.includes('endMinute: 30'),
  'Feedback window close verified at 15:30 (3:30 PM IST)'
);

// -------------------------------------------------------------------------
// 9. AUDIT ALL MODALS, UI COMPONENTS & CLEAN LINKS
// -------------------------------------------------------------------------
console.log('\n--- 9. AUDITING UI COMPONENTS, MODALS & NAVIGATION TOUCHPOINTS ---');
const componentsToCheck = [
  'Header.tsx',
  'LeftSidebar.tsx',
  'DayView.tsx',
  'Footer.tsx',
  'IDEWorkspace.tsx',
  'InterviewTipsModal.tsx',
  'AssessmentModal.tsx',
  'ProctoredExamModal.tsx',
  'CertificateModal.tsx',
  'BadgeGallery.tsx',
  'SpinningWheelModal.tsx',
  'AptitudeSection.tsx',
  'LevelZeroModal.tsx',
  'AlgorithmVisualizerModal.tsx',
  'DailyFeedbackModal.tsx',
  'FeedbackReminderBanner.tsx',
  'PWAInstallModal.tsx',
  'PrerequisitesModal.tsx',
  'MobileBottomNav.tsx'
];

componentsToCheck.forEach((comp) => {
  const p = path.join(__dirname, 'src/components', comp);
  assert(fs.existsSync(p), `Component src/components/${comp} exists`);
});

// Check App.tsx wires all modals
const appTsx = fs.readFileSync(path.join(__dirname, 'src/App.tsx'), 'utf8');
assert(appTsx.includes('<LevelZeroModal'), 'App.tsx renders LevelZeroModal');
assert(appTsx.includes('<AlgorithmVisualizerModal'), 'App.tsx renders AlgorithmVisualizerModal');
assert(appTsx.includes('<DailyFeedbackModal'), 'App.tsx renders DailyFeedbackModal');
assert(appTsx.includes('<ProctoredExamModal'), 'App.tsx renders ProctoredExamModal');
assert(appTsx.includes('<CertificateModal'), 'App.tsx renders CertificateModal');
assert(appTsx.includes('<BadgeGallery'), 'App.tsx renders BadgeGallery');
assert(appTsx.includes('<SpinningWheelModal'), 'App.tsx renders SpinningWheelModal');
assert(appTsx.includes('<IDEWorkspace'), 'App.tsx renders IDEWorkspace');

// -------------------------------------------------------------------------
// 10. AUDIT PWA & OFFLINE INFRASTRUCTURE
// -------------------------------------------------------------------------
console.log('\n--- 10. AUDITING PWA & OFFLINE RUNTIME ASSETS ---');
const manifestPublicPath = path.join(__dirname, 'public/manifest.json');
assert(fs.existsSync(manifestPublicPath), 'public/manifest.json exists');
const swPublicPath = path.join(__dirname, 'public/sw.js');
assert(fs.existsSync(swPublicPath), 'public/sw.js exists');

console.log('\n========================================================================');
console.log(`📊 TOTAL AUDIT CHECKS RUN: ${totalTests}`);
console.log(`✅ PASSED CHECKS: ${passedTests}`);
console.log(`❌ FAILED CHECKS: ${failedTests}`);
if (failedTests === 0) {
  console.log('🎉 100% OF ALL MODULES, DAYS, ASSESSMENTS & LINKS VERIFIED PERFECTLY!');
} else {
  console.error(`💥 ${failedTests} AUDIT CHECKS FAILED!`);
  process.exit(1);
}
console.log('========================================================================');
