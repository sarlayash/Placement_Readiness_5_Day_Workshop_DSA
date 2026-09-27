import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

console.log('🚀 Deploying dist folder to gh-pages...');

const indexHtml = path.join(distDir, 'index.html');
const notFoundHtml = path.join(distDir, '404.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, notFoundHtml);
}

try {
  execSync('git init', { cwd: distDir, stdio: 'inherit' });
  execSync('git remote add origin https://github.com/sarlayash/Placement_Readiness_5_Day_Workshop_DSA.git', { cwd: distDir, stdio: 'inherit' });
  execSync('git checkout -B gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { cwd: distDir, stdio: 'inherit' });
  execSync('git push origin gh-pages --force', { cwd: distDir, stdio: 'inherit' });
  console.log('✅ Successfully deployed to GitHub Pages!');
} finally {
  const distGit = path.join(distDir, '.git');
  if (fs.existsSync(distGit)) {
    fs.rmSync(distGit, { recursive: true, force: true });
  }
}
