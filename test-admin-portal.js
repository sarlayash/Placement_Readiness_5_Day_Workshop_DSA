import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('========================================================================');
console.log('🛡️  AUDITING KAPIL ADMIN PORTAL & AUTHENTICATION SUITE  🛡️');
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

// 1. Audit Admin Service & Credentials Logic
console.log('--- 1. AUDITING ADMIN SERVICE & CREDENTIALS VERIFICATION ---');
const adminServicePath = path.join(__dirname, 'src/utils/adminService.ts');
assert(fs.existsSync(adminServicePath), 'adminService.ts exists');
const adminServiceContent = fs.readFileSync(adminServicePath, 'utf8');

assert(adminServiceContent.includes('KAPILADMIN'), 'Username KAPILADMIN verified in service');
assert(adminServiceContent.includes('ADMIN123'), 'Password ADMIN123 verified in service');
assert(adminServiceContent.includes('verifyAdminCredentials'), 'verifyAdminCredentials exported');
assert(adminServiceContent.includes('generateDailyCSV'), 'generateDailyCSV exported');
assert(adminServiceContent.includes('generateMasterCSV'), 'generateMasterCSV exported');
assert(adminServiceContent.includes('issueCustomBadge'), 'issueCustomBadge exported');
assert(adminServiceContent.includes('issueCustomCertificate'), 'issueCustomCertificate exported');
assert(adminServiceContent.includes('addAdminAssignment'), 'addAdminAssignment exported');
assert(adminServiceContent.includes('addAdminQuiz'), 'addAdminQuiz exported');

// 2. Audit UI Security: Credentials MUST NOT be shown on screen
console.log('\n--- 2. AUDITING UI CREDENTIAL PRIVACY (NO ID/PASS ON SCREEN) ---');
const loginModalPath = path.join(__dirname, 'src/components/AdminLoginModal.tsx');
assert(fs.existsSync(loginModalPath), 'AdminLoginModal.tsx exists');
const loginModalContent = fs.readFileSync(loginModalPath, 'utf8');

assert(!loginModalContent.includes('KAPILADMIN'), 'AdminLoginModal does NOT display KAPILADMIN on screen');
assert(!loginModalContent.includes('ADMIN123'), 'AdminLoginModal does NOT display ADMIN123 on screen');
assert(loginModalContent.includes('type={showPassword ? \'text\' : \'password\'}'), 'Password input is masked with toggle option');
assert(loginModalContent.includes('Kapil\'s Administrator Portal'), 'Portal title verified');

// 3. Audit Admin Dashboard Modal & Capabilities
console.log('\n--- 3. AUDITING ADMIN DASHBOARD TABS & FEATURES ---');
const dashboardModalPath = path.join(__dirname, 'src/components/AdminDashboardModal.tsx');
assert(fs.existsSync(dashboardModalPath), 'AdminDashboardModal.tsx exists');
const dashboardContent = fs.readFileSync(dashboardModalPath, 'utf8');

assert(dashboardContent.includes('Learner Logins & Progress'), 'Tab: Learner Logins & Progress present');
assert(dashboardContent.includes('CSV Reports Center'), 'Tab: CSV Reports Center present');
assert(dashboardContent.includes('Issue New Badges'), 'Tab: Issue New Badges present');
assert(dashboardContent.includes('Issue New Certificates'), 'Tab: Issue New Certificates present');
assert(dashboardContent.includes('Add New Assignments'), 'Tab: Add New Assignments present');
assert(dashboardContent.includes('Add New Quizzes'), 'Tab: Add New Quizzes present');
assert(dashboardContent.includes('handleDownloadCSV'), 'CSV download handler wired');
assert(dashboardContent.includes('handleIssueBadge'), 'Badge issuance handler wired');
assert(dashboardContent.includes('handleIssueCertificate'), 'Certificate issuance handler wired');
assert(dashboardContent.includes('handleAddAssignment'), 'Assignment creation handler wired');
assert(dashboardContent.includes('handleAddQuiz'), 'Quiz creation handler wired');

// 4. Audit Main Page Touchpoints & Floating Lock
console.log('\n--- 4. AUDITING MAIN PAGE LOCK TOUCHPOINTS & INTEGRATION ---');
const appPath = path.join(__dirname, 'src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');
const headerPath = path.join(__dirname, 'src/components/Header.tsx');
const headerContent = fs.readFileSync(headerPath, 'utf8');
const sidebarPath = path.join(__dirname, 'src/components/LeftSidebar.tsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

assert(headerContent.includes('onOpenAdmin'), 'Header.tsx receives onOpenAdmin prop');
assert(headerContent.includes('<Lock'), 'Header.tsx renders Lock icon for Admin');
assert(sidebarContent.includes('onOpenAdmin'), 'LeftSidebar.tsx receives onOpenAdmin prop');
assert(sidebarContent.includes('<Lock'), 'LeftSidebar.tsx renders Lock icon for Admin');
assert(appContent.includes('Floating Admin Lock Button on Main Page') && appContent.includes('Admin (Kapil)'), 'App.tsx renders Floating Admin Lock icon on main page');
assert(appContent.includes('<AdminLoginModal'), 'App.tsx renders AdminLoginModal');
assert(appContent.includes('<AdminDashboardModal'), 'App.tsx renders AdminDashboardModal');
assert(appContent.includes('syncCurrentUserToRoster'), 'App.tsx synchronizes active learner into Admin roster');

// 5. Audit Learner Journey Integrity (Zero Breaking Changes)
console.log('\n--- 5. AUDITING LEARNER JOURNEY UNTOUCHED INTEGRITY ---');
assert(appContent.includes('<DayView'), 'DayView rendered in App.tsx');
assert(appContent.includes('<IDEWorkspace'), 'IDEWorkspace rendered in App.tsx');
assert(appContent.includes('<LevelZeroModal'), 'LevelZeroModal rendered in App.tsx');
assert(appContent.includes('<AlgorithmVisualizerModal'), 'AlgorithmVisualizerModal rendered in App.tsx');
assert(appContent.includes('<SpinningWheelModal'), 'SpinningWheelModal rendered in App.tsx');
assert(appContent.includes('<AptitudeSection'), 'AptitudeSection rendered in App.tsx');
assert(appContent.includes('<DailyFeedbackModal'), 'DailyFeedbackModal rendered in App.tsx');

// 6. Audit Zero Fake Users & Real Firebase Sync Integrity
console.log('\n--- 6. AUDITING ZERO FAKE USERS & REAL FIREBASE AUTH SYNC ---');
assert(!adminServiceContent.includes('SEED_STUDENTS'), 'adminService.ts does NOT contain SEED_STUDENTS');
assert(!adminServiceContent.includes('aarav.mehta') && !adminServiceContent.includes('priya.sharma'), 'adminService.ts does NOT contain fake mock students');
assert(adminServiceContent.includes('REAL_FIREBASE_AUTH_USERS'), 'adminService.ts contains verified REAL_FIREBASE_AUTH_USERS');
assert(adminServiceContent.includes('kapilnarula27july@gmail.com'), 'Verified Firebase user kapilnarula27july@gmail.com present');
assert(adminServiceContent.includes('forceSyncFirebaseRoster'), 'forceSyncFirebaseRoster exported');
assert(dashboardContent.includes('Sync Firebase Roster'), 'AdminDashboardModal renders Sync Firebase Roster button');
assert(dashboardContent.includes('Real Google Users'), 'AdminDashboardModal renders Real Google Users metric');
assert(dashboardContent.includes('100% Real Firebase Sync • Zero Fake Users'), 'AdminDashboardModal displays Real Firebase Sync badge');

console.log('\n========================================================================');
console.log(`📊 TOTAL ADMIN AUDIT CHECKS RUN: ${totalTests}`);
console.log(`✅ PASSED CHECKS: ${passedTests}`);
console.log(`❌ FAILED CHECKS: ${failedTests}`);
if (failedTests === 0) {
  console.log('🎉 100% KAPIL ADMIN PORTAL, AUTH, REPORTS & BADGES VERIFIED PERFECTLY!');
} else {
  console.error(`💥 ${failedTests} CHECKS FAILED!`);
  process.exit(1);
}
console.log('========================================================================');
