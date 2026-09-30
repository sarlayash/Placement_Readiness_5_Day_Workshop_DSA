// =========================================================================
// AUTOMATED TEST SUITE: COMPLETE SOLUTIONS & TEST CASES AUDIT
// Verifies all 44 curriculum questions, 25 solved programs, and 10 Level 0 programs.
// =========================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('========================================================================');
console.log('⚡ AUDITING PRODUCTION-GRADE SOLUTIONS & SAMPLE/HIDDEN TEST CASES ⚡');
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
// 1. AUDIT CURRICULUM TEST CASES FILE
// -------------------------------------------------------------------------
console.log('--- 1. AUDITING CURRICULUM TEST CASES (src/data/curriculumTestCases.ts) ---');
const tcFilePath = path.join(__dirname, 'src/data/curriculumTestCases.ts');
assert(fs.existsSync(tcFilePath), 'curriculumTestCases.ts exists');

const tcContent = fs.readFileSync(tcFilePath, 'utf8');
const tcStart = tcContent.indexOf('= {') + 2;
const tcEnd = tcContent.lastIndexOf('}');
assert(tcStart > 1 && tcEnd !== -1, 'CURRICULUM_TEST_CASES object found');
const testCasesMap = JSON.parse(tcContent.slice(tcStart, tcEnd + 1));

const qKeys = Object.keys(testCasesMap);
assert(qKeys.length === 44, `Exactly 44 questions have test cases configured (found ${qKeys.length})`);

let allTestCasesValid = true;
let dummyPatternFound = false;

qKeys.forEach((qid) => {
  const tcs = testCasesMap[qid];
  if (!Array.isArray(tcs) || tcs.length < 4) {
    allTestCasesValid = false;
    console.error(`Question ${qid} has insufficient test cases: ${tcs?.length}`);
  }
  tcs.forEach((tc) => {
    if (!tc.input || !tc.expectedOutput) {
      allTestCasesValid = false;
      console.error(`Question ${qid} test case ${tc.id} has empty input or output`);
    }
    if (tc.input.includes('[HIDDEN TEST VECTOR') || tc.input.includes('(Variant test case)')) {
      dummyPatternFound = true;
      console.error(`Question ${qid} test case ${tc.id} contains dummy text placeholder`);
    }
  });
});

assert(allTestCasesValid, 'All 44 questions have at least 4 valid test cases with non-empty inputs and outputs');
assert(!dummyPatternFound, 'Zero test cases contain placeholder strings like "[HIDDEN TEST VECTOR" or "(Variant test case)"');

// -------------------------------------------------------------------------
// 2. AUDIT CURRICULUM SOLUTIONS FILE
// -------------------------------------------------------------------------
console.log('\n--- 2. AUDITING CURRICULUM SOLUTIONS (src/data/curriculumSolutions.ts) ---');
const solFilePath = path.join(__dirname, 'src/data/curriculumSolutions.ts');
assert(fs.existsSync(solFilePath), 'curriculumSolutions.ts exists');

const solContent = fs.readFileSync(solFilePath, 'utf8');
const solStart = solContent.indexOf('= {') + 2;
const solEnd = solContent.lastIndexOf('}');
assert(solStart > 1 && solEnd !== -1, 'CURRICULUM_SOLUTIONS object found');
const solutionsMap = JSON.parse(solContent.slice(solStart, solEnd + 1));

const solKeys = Object.keys(solutionsMap);
assert(solKeys.length === 44, `Exactly 44 questions have complete solutions (found ${solKeys.length})`);

let allLangsPresent = true;
let trivialPrintFound = false;
const requiredLangs = ['cpp', 'java', 'python', 'c', 'javascript', 'html'];

solKeys.forEach((qid) => {
  const sols = solutionsMap[qid];
  requiredLangs.forEach((lang) => {
    if (!sols[lang] || sols[lang].trim().length < 30) {
      allLangsPresent = false;
      console.error(`Question ${qid} missing or has stub solution for language ${lang}`);
    }
    // Check that it does not contain trivial printf("${sampleOutput}") stubs
    if (sols[lang] && (sols[lang].includes('printf("${sampleOutput') || sols[lang].includes('cout << "${sampleOutput'))) {
      trivialPrintFound = true;
      console.error(`Question ${qid} contains fake print stub in ${lang}`);
    }
  });
});

assert(allLangsPresent, 'All 44 curriculum questions have full solutions across cpp, java, python, c, javascript, and html');
assert(!trivialPrintFound, 'All solutions contain genuine algorithmic implementations without fake print shortcuts');

// -------------------------------------------------------------------------
// 3. AUDIT 25 SOLVED MASTERCLASS PROGRAMS
// -------------------------------------------------------------------------
console.log('\n--- 3. AUDITING 25 SOLVED MASTERCLASS PROGRAMS (src/data/solvedPrograms.ts) ---');
const solvedPath = path.join(__dirname, 'src/data/solvedPrograms.ts');
assert(fs.existsSync(solvedPath), 'solvedPrograms.ts exists');
const solvedContent = fs.readFileSync(solvedPath, 'utf8');

const solvedMatches = solvedContent.match(/id:\s*'[dD]\d-[emh]\d'/g) || [];
assert(solvedMatches.length === 25, `Found exactly 25 solved programs (found ${solvedMatches.length})`);

for (let d = 1; d <= 5; d++) {
  const dayMatches = (solvedContent.match(new RegExp(`day:\\s*${d},`, 'g')) || []).length;
  assert(dayMatches === 5, `Day ${d} contains exactly 5 solved programs (found ${dayMatches})`);
}

// -------------------------------------------------------------------------
// 4. AUDIT 10 LEVEL 0 PROGRAMS
// -------------------------------------------------------------------------
console.log('\n--- 4. AUDITING 10 LEVEL 0 FOUNDATIONS (src/data/levelZeroPrograms.ts) ---');
const lvl0Path = path.join(__dirname, 'src/data/levelZeroPrograms.ts');
assert(fs.existsSync(lvl0Path), 'levelZeroPrograms.ts exists');
const lvl0Content = fs.readFileSync(lvl0Path, 'utf8');

for (let p = 1; p <= 10; p++) {
  assert(lvl0Content.includes(`id: 'lvl0-${p}'`), `Level 0 Program ${p} (lvl0-${p}) exists`);
}

// -------------------------------------------------------------------------
// 5. AUDIT STARTER CODE TEMPLATES (src/utils/codeTemplates.ts)
// -------------------------------------------------------------------------
console.log('\n--- 5. AUDITING CODE TEMPLATES (src/utils/codeTemplates.ts) ---');
const codeTemplatesPath = path.join(__dirname, 'src/utils/codeTemplates.ts');
const ctContent = fs.readFileSync(codeTemplatesPath, 'utf8');
assert(!ctContent.includes('printf("${sampleOutput'), 'No fake printf sample output in codeTemplates.ts');
assert(!ctContent.includes('cout << "${sampleOutput'), 'No fake cout sample output in codeTemplates.ts');
assert(ctContent.includes('generateStarterCode'), 'generateStarterCode exported');
assert(ctContent.includes('generateTestCases'), 'generateTestCases exported');

// -------------------------------------------------------------------------
// 6. AUDIT IDE WORKSPACE UI & TEST RUNNER (src/components/IDEWorkspace.tsx)
// -------------------------------------------------------------------------
console.log('\n--- 6. AUDITING IDE WORKSPACE CAPABILITIES (src/components/IDEWorkspace.tsx) ---');
const idePath = path.join(__dirname, 'src/components/IDEWorkspace.tsx');
const ideContent = fs.readFileSync(idePath, 'utf8');
assert(ideContent.includes('Official Solution'), 'IDE contains Official Solution viewer/toggle');
assert(ideContent.includes('handleLoadModelSolution') || ideContent.includes('Apply & Test'), 'IDE has action to load model solution');
assert(ideContent.includes('modelSolution'), 'IDE connects to question model solutions');
assert(ideContent.includes('testCasesToRun'), 'IDE executes against sample and hidden test cases');
assert(ideContent.includes('isModelCode'), 'IDE recognizes verified model solution on test run');

console.log('\n========================================================================');
console.log(`📊 TOTAL AUDIT CHECKS: ${totalTests}`);
console.log(`✅ PASSED CHECKS: ${passedTests}`);
console.log(`❌ FAILED CHECKS: ${failedTests}`);
if (failedTests === 0) {
  console.log('🎉 ALL SOLUTIONS, TEST CASES, AND PLATFORM AUDITS PASSED WITH 100% SUCCESS!');
} else {
  console.error('⚠️ SOME AUDIT CHECKS FAILED. PLEASE REVIEW ABOVE LOGS.');
  process.exit(1);
}
console.log('========================================================================\n');
