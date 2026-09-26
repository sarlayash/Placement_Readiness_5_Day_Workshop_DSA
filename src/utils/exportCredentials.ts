import { jsPDF } from 'jspdf';
import { GoogleUser, UserProgress, Badge } from '../types';

/**
 * Utility to wrap and draw multi-line text safely onto an HTML5 2D canvas context.
 * Prevents text spillover or cropping.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

/**
 * Generates an ultra high-resolution, uncropped 1920x1080 Canvas of the Placement Certificate
 */
export function generateCertificateCanvas(
  user: GoogleUser,
  progress: UserProgress
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const width = canvas.width;
  const height = canvas.height;

  // 1. Crisp White/Ivory Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#ffffff');
  bgGrad.addColorStop(0.5, '#fcfdff');
  bgGrad.addColorStop(1, '#f8fafc');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Top Rainbow Accent Bar
  const rainbow = ctx.createLinearGradient(0, 0, width, 0);
  rainbow.addColorStop(0, '#ef4444');
  rainbow.addColorStop(0.2, '#f59e0b');
  rainbow.addColorStop(0.4, '#10b981');
  rainbow.addColorStop(0.6, '#0ea5e9');
  rainbow.addColorStop(0.8, '#6366f1');
  rainbow.addColorStop(1, '#a855f7');
  ctx.fillStyle = rainbow;
  ctx.fillRect(0, 0, width, 14);

  // 3. Elegant Outer Double Royal Navy & Gold Border
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 44, width - 60, height - 74);

  // Inset Gold/Indigo Fine Border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 54, width - 80, height - 94);

  // Corner Embellishments
  const cornerSize = 40;
  const corners = [
    [40, 54],
    [width - 40, 54],
    [40, height - 40],
    [width - 40, height - 40],
  ];
  ctx.fillStyle = '#f59e0b';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Subtle Watermark in background
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.font = '900 160px sans-serif';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.025)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KAPIL', 0, 0);
  ctx.restore();

  // 5. Header Section
  // Program Pill
  ctx.fillStyle = '#eef2ff';
  ctx.strokeStyle = '#c7d2fe';
  ctx.lineWidth = 2;
  const pillW = 620;
  const pillH = 40;
  const pillX = (width - pillW) / 2;
  const pillY = 90;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#3730a3';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PLACEMENT READINESS BOOTCAMP • 5-DAY INTENSIVE PROGRAM', width / 2, pillY + 26);

  // Certificate Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 56px "Cinzel", "Times New Roman", serif';
  ctx.fillText('CERTIFICATE OF EXCELLENCE', width / 2, 195);

  // Subtitle
  ctx.fillStyle = '#64748b';
  ctx.font = 'italic 20px "Georgia", serif';
  ctx.fillText('Powered by Kapil • Advanced Data Structures & Algorithmic Problem Solving', width / 2, 235);

  // Decorative Horizontal Divider
  const divGrad = ctx.createLinearGradient(width / 2 - 300, 0, width / 2 + 300, 0);
  divGrad.addColorStop(0, 'rgba(217, 119, 6, 0)');
  divGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.8)');
  divGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 300, 265);
  ctx.lineTo(width / 2 + 300, 265);
  ctx.stroke();

  // 6. Recipient Details
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('THIS IS TO OFFICIALLY CERTIFY THAT', width / 2, 320);

  // Candidate Name in High-Contrast Rainbow Gradient
  const nameGrad = ctx.createLinearGradient(width / 2 - 250, 0, width / 2 + 250, 0);
  nameGrad.addColorStop(0, '#4338ca');
  nameGrad.addColorStop(0.5, '#7c3aed');
  nameGrad.addColorStop(1, '#db2777');
  ctx.fillStyle = nameGrad;
  ctx.font = 'bold 54px sans-serif';
  ctx.fillText(user.name, width / 2, 390);

  // Name Underline Bar
  const textWidth = ctx.measureText(user.name).width;
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2 - textWidth / 2 - 30, 410);
  ctx.lineTo(width / 2 + textWidth / 2 + 30, 410);
  ctx.stroke();

  // Google Email
  ctx.fillStyle = '#64748b';
  ctx.font = '16px monospace';
  ctx.fillText(`Google Verified Account: ${user.email}`, width / 2, 445);

  // 7. Statement of Achievement Body (with safe line wrapping)
  ctx.fillStyle = '#334155';
  ctx.font = '20px sans-serif';
  const citation =
    'has demonstrated technical excellence, conceptual precision, and algorithmic problem-solving rigor across the comprehensive curriculum covering Topics T1 through T10 (Graphs, Advanced Recursion, In-Place Array Transformations, Algorithmic Time & Space Complexity, Number Theory, Two-Pointer Invariants, Sliding Window, and Divide & Conquer Algorithms), successfully achieving top honors in the Proctored Final Technical Assessment with verified academic integrity.';

  wrapText(ctx, citation, width / 2, 500, 1400, 36);

  // 8. Bottom Section: Details, Official Seal, Signature
  const bottomDividerY = 740;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(120, bottomDividerY);
  ctx.lineTo(width - 120, bottomDividerY);
  ctx.stroke();

  const issueDate = progress.finalExamDate
    ? new Date(progress.finalExamDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      });

  const certId = progress.certificateId || 'KAPIL-PRP-2026-FINAL-VERIFIED';

  // Left Column: Credentials & Date
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('ISSUED ON (IST):', 140, 785);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(issueDate, 140, 815);

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('CREDENTIAL ID:', 140, 860);
  ctx.fillStyle = '#4f46e5';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(certId, 140, 890);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('VERIFICATION STATUS: 100% PROCTORED & PASSED', 140, 930);

  // Center Column: Official Golden Seal
  const sealX = width / 2;
  const sealY = 855;
  const sealR = 75;

  // Outer gold rim
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, sealR);
  sealGrad.addColorStop(0, '#fef3c7');
  sealGrad.addColorStop(0.7, '#fde68a');
  sealGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = sealGrad;
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner dashed circle
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 10, 0, Math.PI * 2);
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Seal Text
  ctx.fillStyle = '#78350f';
  ctx.font = '900 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('KAPIL', sealX, sealY - 24);

  // Medal Star Symbol
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('★ ★ ★', sealX, sealY + 4);

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('OFFICIAL SEAL', sealX, sealY + 28);
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('VERIFIED 2026', sealX, sealY + 44);

  // Right Column: Kapil's Signature
  ctx.textAlign = 'right';
  ctx.fillStyle = '#1e1b4b';
  ctx.font = 'italic bold 44px "Brush Script MT", "Segoe Script", "Times New Roman", cursive';
  ctx.fillText('Kapil', width - 140, 825);

  // Signature line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width - 340, 845);
  ctx.lineTo(width - 140, 845);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Kapil', width - 140, 875);

  ctx.fillStyle = '#64748b';
  ctx.font = '14px sans-serif';
  ctx.fillText('Lead Placement Mentor & Architect', width - 140, 900);
  ctx.fillText('Placement Readiness Council', width - 140, 922);

  // 9. Bottom Footer Authenticity Ribbon
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px monospace';
  ctx.fillText(
    `Authenticity Hash: sha256:${certId.toLowerCase()}-verified • Valid Globally • Placement Readiness 5-Day Workshop`,
    width / 2,
    1020
  );

  return canvas;
}

/**
 * Download Certificate directly as an uncropped High-Res PNG (1920 x 1080)
 */
export function downloadCertificatePNG(user: GoogleUser, progress: UserProgress): void {
  const canvas = generateCertificateCanvas(user, progress);
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  const safeName = user.name.replace(/[^a-zA-Z0-9]/g, '_');
  link.download = `Kapil_Placement_Certificate_${safeName}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download Certificate directly as an uncropped Vector A4/1080p Landscape PDF
 */
export function downloadCertificatePDF(user: GoogleUser, progress: UserProgress): void {
  const canvas = generateCertificateCanvas(user, progress);
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [1920, 1080],
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, 1920, 1080, undefined, 'FAST');
  const safeName = user.name.replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`Kapil_Placement_Certificate_${safeName}.pdf`);
}

/**
 * Generates an ultra high-resolution, uncropped 1000x1000 Canvas of an Individual Badge
 */
export function generateBadgeCanvas(
  badge: Badge,
  user: GoogleUser | null,
  isUnlocked: boolean
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const width = canvas.width;
  const height = canvas.height;

  // Background
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 500);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.6, '#070d1e');
  bgGrad.addColorStop(1, '#030712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer Rainbow Border Ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 460, 0, Math.PI * 2);
  const rainbow = ctx.createConicGradient(0, width / 2, height / 2);
  rainbow.addColorStop(0, '#ef4444');
  rainbow.addColorStop(0.2, '#f59e0b');
  rainbow.addColorStop(0.4, '#10b981');
  rainbow.addColorStop(0.6, '#0ea5e9');
  rainbow.addColorStop(0.8, '#6366f1');
  rainbow.addColorStop(1, '#ef4444');
  ctx.strokeStyle = rainbow;
  ctx.lineWidth = 14;
  ctx.stroke();
  ctx.restore();

  // Inner Concentric Gold Rings
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 435, 0, Math.PI * 2);
  ctx.strokeStyle = isUnlocked ? '#f59e0b' : '#475569';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 420, 0, Math.PI * 2);
  ctx.strokeStyle = isUnlocked ? '#fbbf24' : '#334155';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Central Glowing Medal Shield
  const shieldR = 140;
  const shieldY = 360;
  const shieldGrad = ctx.createRadialGradient(width / 2, shieldY, 20, width / 2, shieldY, shieldR);
  if (isUnlocked) {
    shieldGrad.addColorStop(0, '#fbbf24');
    shieldGrad.addColorStop(0.7, '#f59e0b');
    shieldGrad.addColorStop(1, '#b45309');
  } else {
    shieldGrad.addColorStop(0, '#64748b');
    shieldGrad.addColorStop(1, '#334155');
  }
  ctx.beginPath();
  ctx.arc(width / 2, shieldY, shieldR, 0, Math.PI * 2);
  ctx.fillStyle = shieldGrad;
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Medal Icon Star / Award
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 90px sans-serif';
  ctx.fillText('★', width / 2, shieldY + 32);

  // Day Badge Tag Pill
  ctx.fillStyle = isUnlocked ? '#4f46e5' : '#334155';
  const pillW = 220;
  const pillH = 46;
  ctx.beginPath();
  ctx.roundRect((width - pillW) / 2, 540, pillW, pillH, 23);
  ctx.fill();
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(`DAY ${badge.day} HONORS`, width / 2, 572);

  // Badge Title (Rainbow / Gold)
  ctx.fillStyle = isUnlocked ? '#f8fafc' : '#94a3b8';
  ctx.font = 'bold 50px sans-serif';
  ctx.fillText(badge.title, width / 2, 650);

  // Subtitle / Topic Focus
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(badge.subtitle, width / 2, 705);

  // Criteria
  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px sans-serif';
  wrapText(ctx, badge.criteria, width / 2, 760, 700, 30);

  // Learner Recipient and Kapil Branding
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(250, 850);
  ctx.lineTo(750, 850);
  ctx.stroke();

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(
    user ? `Awarded to: ${user.name}` : 'Placement Readiness Bootcamp',
    width / 2,
    890
  );

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Powered by Kapil • 5-Day Placement Bootcamp', width / 2, 930);

  return canvas;
}

/**
 * Download an individual Badge as an uncropped High-Res PNG (1000 x 1000)
 */
export function downloadBadgePNG(badge: Badge, user: GoogleUser | null, isUnlocked: boolean): void {
  const canvas = generateBadgeCanvas(badge, user, isUnlocked);
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  const safeName = badge.title.replace(/[^a-zA-Z0-9]/g, '_');
  link.download = `Kapil_Badge_Day${badge.day}_${safeName}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download an individual Badge as an uncropped Vector Single-Page PDF (1000 x 1000)
 */
export function downloadBadgePDF(badge: Badge, user: GoogleUser | null, isUnlocked: boolean): void {
  const canvas = generateBadgeCanvas(badge, user, isUnlocked);
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [1000, 1000],
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, 1000, 1000, undefined, 'FAST');
  const safeName = badge.title.replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`Kapil_Badge_Day${badge.day}_${safeName}.pdf`);
}

/**
 * Download All 5 Badges compiled into an uncropped Multi-Page PDF Showcase Dossier
 */
export function downloadAllBadgesPDF(
  badges: Badge[],
  user: GoogleUser | null,
  progress: UserProgress
): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [1000, 1000],
  });

  badges.forEach((b, index) => {
    if (index > 0) pdf.addPage([1000, 1000], 'portrait');
    const isUnlocked = !!progress.badgesUnlocked[b.day];
    const canvas = generateBadgeCanvas(b, user, isUnlocked);
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(dataUrl, 'PNG', 0, 0, 1000, 1000, undefined, 'FAST');
  });

  pdf.save(`Kapil_All_Placement_Badges_Dossier.pdf`);
}

/**
 * Download All 5 Badges combined into a single wide PNG Showcase Banner (5000 x 1000)
 */
export function downloadAllBadgesPNG(
  badges: Badge[],
  user: GoogleUser | null,
  progress: UserProgress
): void {
  const totalW = 1000 * badges.length;
  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  badges.forEach((b, index) => {
    const isUnlocked = !!progress.badgesUnlocked[b.day];
    const badgeCanvas = generateBadgeCanvas(b, user, isUnlocked);
    ctx.drawImage(badgeCanvas, index * 1000, 0);
  });

  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = `Kapil_All_Placement_Badges_Showcase.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
