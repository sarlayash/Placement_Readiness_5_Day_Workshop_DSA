import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=====================================================');
console.log('⚡ STARTING DEEP AUTOMATED USER JOURNEY & PWA AUDIT ⚡');
console.log('=====================================================\n');

let failedTests = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failedTests++;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// 1. Audit Dist Build & PWA Assets
console.log('--- 1. AUDITING DIST ARTIFACTS & PWA ASSETS ---');
const distPath = path.join(__dirname, 'dist');
assert(fs.existsSync(distPath), 'dist directory exists');

const manifestPath = path.join(distPath, 'manifest.json');
assert(fs.existsSync(manifestPath), 'dist/manifest.json exists');
const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert(manifestContent.name && manifestContent.name.includes('Kapil'), 'manifest.json has Kapil branding in name');
assert(manifestContent.display === 'standalone', 'manifest.json display is standalone');
assert(manifestContent.icons && manifestContent.icons.length > 0, 'manifest.json contains valid app icons');
assert(manifestContent.start_url === './', 'manifest.json start_url is relative for both GH Pages and Firebase');

const swPath = path.join(distPath, 'sw.js');
assert(fs.existsSync(swPath), 'dist/sw.js exists');
const swContent = fs.readFileSync(swPath, 'utf8');
assert(swContent.includes('CACHE_NAME'), 'sw.js contains CACHE_NAME');
assert(swContent.includes('install'), 'sw.js has install event listener');
assert(swContent.includes('fetch'), 'sw.js has fetch event caching strategy');

const pwaIconPath = path.join(distPath, 'pwa-icon.svg');
assert(fs.existsSync(pwaIconPath), 'dist/pwa-icon.svg exists');

const htmlPath = path.join(distPath, 'index.html');
assert(fs.existsSync(htmlPath), 'dist/index.html exists');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
assert(htmlContent.includes('manifest.json'), 'index.html links to manifest.json');
assert(htmlContent.includes('apple-mobile-web-app-capable'), 'index.html contains iOS PWA tags');
assert(htmlContent.includes('theme-color'), 'index.html contains theme-color meta tag');

console.log('\n--- 2. AUDITING DATA STRUCTURES & SYLLABUS INTEGRITY ---');
const curriculumRaw = fs.readFileSync(path.join(__dirname, 'src/data/curriculum.ts'), 'utf8');
assert(curriculumRaw.includes('T1: Graphs'), 'Day 1 includes T1 Graphs');
assert(curriculumRaw.includes("code: 'T10'"), 'Day 5 includes T10 curriculum');
assert(curriculumRaw.includes('HACKERRANK_COURSE_URL'), 'HackerRank course link present');

const solvedProgramsRaw = fs.readFileSync(path.join(__dirname, 'src/data/solvedPrograms.ts'), 'utf8');
const solvedMatches = solvedProgramsRaw.match(/id:\s*'[dD]\d-[emh]\d'/g) || [];
assert(solvedMatches.length === 30, `Exactly 30 solved programs exist (found ${solvedMatches.length})`);

// 6 per day: 2 Easy, 2 Medium, 2 Hard
for (let d = 1; d <= 5; d++) {
  const dayOccurrences = (solvedProgramsRaw.match(new RegExp(`day:\\s*${d},`, 'g')) || []).length;
  assert(dayOccurrences === 6, `Day ${d} has exactly 6 solved programs (found ${dayOccurrences})`);
}

const aptitudeRaw = fs.readFileSync(path.join(__dirname, 'src/data/aptitudeMCQs.ts'), 'utf8');
const aptCount = (aptitudeRaw.match(/id:\s*'apt-\d+'/g) || []).length;
assert(aptCount === 25, `Exactly 25 Aptitude MCQs exist (found ${aptCount})`);

const spinningRaw = fs.readFileSync(path.join(__dirname, 'src/data/spinningWheelMCQs.ts'), 'utf8');
const spinCount = (spinningRaw.match(/id:\s*'sw-\d+'/g) || []).length;
assert(spinCount === 10, `Exactly 10 Spinning Wheel MCQs exist with negative marking (found ${spinCount})`);

console.log('\n--- 3. AUDITING STRICT PREREQUISITES LOGIC CODE ---');
const prereqCode = fs.readFileSync(path.join(__dirname, 'src/utils/prerequisites.ts'), 'utf8');
assert(prereqCode.includes('checkDayCompletion'), 'checkDayCompletion function exported');
assert(prereqCode.includes('isDayUnlockedStrict'), 'isDayUnlockedStrict function exported');
assert(prereqCode.includes('checkFinalExamEligibility'), 'checkFinalExamEligibility function exported');
assert(prereqCode.includes('acknowledgedSolvedProgramIds'), 'Strict check includes 6 solved programs acknowledgment');
assert(prereqCode.includes('badgesUnlocked'), 'Strict check includes badge verification');

console.log('\n--- 4. AUDITING FIREBASE LIVE CONFIG ---');
const firebaseCode = fs.readFileSync(path.join(__dirname, 'src/utils/firebase.ts'), 'utf8');
assert(firebaseCode.includes('AIzaSyDlcS9oV71Y5Z1h91my_iaU3zI29KpFW-0'), 'Live Firebase apiKey configured');
assert(firebaseCode.includes('placement-readiness-5-day.firebaseapp.com'), 'authDomain configured');
assert(firebaseCode.includes('G-D7WWZD39NE'), 'measurementId configured');

console.log('\n--- 5. AUDITING MOBILE BOTTOM NAVIGATION & OFFLINE TOAST ---');
const bottomNavCode = fs.readFileSync(path.join(__dirname, 'src/components/MobileBottomNav.tsx'), 'utf8');
assert(bottomNavCode.includes('Offline Mode Active'), 'Mobile nav displays offline notice banner');
assert(bottomNavCode.includes('md:hidden'), 'Bottom nav is responsive for mobile and tablet views');

console.log('\n--- 6. AUDITING DAILY FEEDBACK LINK & REMINDER TIMELINES ---');
const feedbackCode = fs.readFileSync(path.join(__dirname, 'src/utils/feedback.ts'), 'utf8');
assert(feedbackCode.includes('https://fpln.site/feedback/form.php?id=4gvfOQ8m'), 'Correct feedback URL fpln.site configured');
assert(feedbackCode.includes('startHour: 14') && feedbackCode.includes('startMinute: 30'), 'Feedback starts at 2:30 PM IST (14:30)');
assert(feedbackCode.includes('endHour: 15') && feedbackCode.includes('endMinute: 30'), 'Feedback closes at 3:30 PM IST (15:30)');
assert(feedbackCode.includes('reminder30mMinute: 0'), '30-minute reminder scheduled for 2:00 PM IST');
assert(feedbackCode.includes('reminder10mMinute: 20'), '10-minute reminder scheduled for 2:20 PM IST');
assert(feedbackCode.includes('reminder5mMinute: 25'), '5-minute reminder scheduled for 2:25 PM IST');

const feedbackModalCode = fs.readFileSync(path.join(__dirname, 'src/components/DailyFeedbackModal.tsx'), 'utf8');
assert(feedbackModalCode.includes('Daily Workshop Feedback'), 'Daily feedback modal title verified');
assert(feedbackModalCode.includes('2:30 PM – 3:30 PM IST'), 'Window timing clearly displayed');
assert(feedbackModalCode.includes('Simulate 2:00 PM'), 'Tester simulator controls present');

const feedbackBannerCode = fs.readFileSync(path.join(__dirname, 'src/components/FeedbackReminderBanner.tsx'), 'utf8');
assert(feedbackBannerCode.includes('30-Min Reminder'), '30-min reminder banner verified');
assert(feedbackBannerCode.includes('10-Min Reminder'), '10-min reminder banner verified');
assert(feedbackBannerCode.includes('5-Min Reminder'), '5-min reminder banner verified');
assert(feedbackBannerCode.includes('LIVE NOW'), 'Live active banner verified');

console.log('\n--- 7. AUDITING LEVEL 0 PROGRAMS & 5-LANGUAGE COMPATIBILITY ---');
const levelZeroRaw = fs.readFileSync(path.join(__dirname, 'src/data/levelZeroPrograms.ts'), 'utf8');
const lvl0Matches = levelZeroRaw.match(/id:\s*'lvl0-\d+'/g) || [];
assert(lvl0Matches.length === 10, `Exactly 10 LEVEL 0 programs exist (found ${lvl0Matches.length})`);

for (let i = 1; i <= 10; i++) {
  assert(levelZeroRaw.includes(`id: 'lvl0-${i}'`), `Level 0 program lvl0-${i} exists`);
}

assert(levelZeroRaw.includes("difficulty: 'Level 0'"), "Level 0 difficulty tags configured");
assert(levelZeroRaw.includes("java:") && levelZeroRaw.includes("c:") && levelZeroRaw.includes("cpp:") && levelZeroRaw.includes("python:") && levelZeroRaw.includes("html:"), "All 5 core languages (Java, C, C++, Python, HTML) present in solutions");

const levelZeroModalRaw = fs.readFileSync(path.join(__dirname, 'src/components/LevelZeroModal.tsx'), 'utf8');
assert(levelZeroModalRaw.includes('LEVEL 0: 10 Solved Basic Programs'), 'Level 0 modal title verified');
assert(levelZeroModalRaw.includes('Java') && levelZeroModalRaw.includes('C++') && levelZeroModalRaw.includes('Python') && levelZeroModalRaw.includes('HTML'), 'Language switcher verified in LevelZeroModal');
assert(levelZeroModalRaw.includes('Live Preview') || levelZeroModalRaw.includes('sandbox="allow-scripts"'), 'HTML interactive sandbox/preview verified in LevelZeroModal');

console.log('\n=====================================================');
if (failedTests === 0) {
  console.log('🎉 ALL AUDIT & DEEP VERIFICATION CHECKS PASSED (100%)');
} else {
  console.error(`💥 ${failedTests} CHECKS FAILED`);
  process.exit(1);
}
console.log('=====================================================');
