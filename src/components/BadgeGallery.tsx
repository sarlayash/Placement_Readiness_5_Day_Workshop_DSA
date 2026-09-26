import React, { useState } from 'react';
import { BADGES } from '../data/curriculum';
import { GoogleUser, UserProgress, Badge } from '../types';
import { Award, CheckCircle2, Download, FileText, Image, Sparkles, X, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  downloadBadgePNG,
  downloadBadgePDF,
  downloadAllBadgesPDF,
  downloadAllBadgesPNG,
} from '../utils/exportCredentials';

interface BadgeGalleryProps {
  user: GoogleUser | null;
  progress: UserProgress;
  onClose: () => void;
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ user, progress, onClose }) => {
  const [downloadingBadgeId, setDownloadingBadgeId] = useState<string | null>(null);
  const unlockedCount = Object.values(progress.badgesUnlocked).filter(Boolean).length;

  const triggerBadgeConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
    });
  };

  const handleDownloadBadgePNG = (badge: Badge, isUnlocked: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloadingBadgeId(`${badge.id}-png`);
      downloadBadgePNG(badge, user, isUnlocked);
    } catch (err) {
      console.error('Badge PNG download error:', err);
    } finally {
      setTimeout(() => setDownloadingBadgeId(null), 500);
    }
  };

  const handleDownloadBadgePDF = (badge: Badge, isUnlocked: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloadingBadgeId(`${badge.id}-pdf`);
      downloadBadgePDF(badge, user, isUnlocked);
    } catch (err) {
      console.error('Badge PDF download error:', err);
    } finally {
      setTimeout(() => setDownloadingBadgeId(null), 500);
    }
  };

  const handleDownloadAllPDF = () => {
    try {
      setDownloadingBadgeId('all-pdf');
      downloadAllBadgesPDF(BADGES, user, progress);
    } catch (err) {
      console.error('All Badges PDF error:', err);
    } finally {
      setTimeout(() => setDownloadingBadgeId(null), 500);
    }
  };

  const handleDownloadAllPNG = () => {
    try {
      setDownloadingBadgeId('all-png');
      downloadAllBadgesPNG(BADGES, user, progress);
    } catch (err) {
      console.error('All Badges PNG error:', err);
    } finally {
      setTimeout(() => setDownloadingBadgeId(null), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 md:p-8 text-slate-800 shadow-2xl my-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold">
                Daily Placement Honors
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {unlockedCount} of 5 Badges Earned
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black mt-1 rainbow-text">
              Placement Mastery Badge Gallery
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Download individual or bundle credentials in uncropped, high-resolution PNG and PDF formats.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Download All Dossier PDF */}
            <button
              type="button"
              onClick={handleDownloadAllPDF}
              disabled={downloadingBadgeId !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Download all 5 badges in a multi-page PDF Dossier"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>{downloadingBadgeId === 'all-pdf' ? 'Compiling...' : 'All Badges PDF'}</span>
            </button>

            {/* Download All Banner PNG */}
            <button
              type="button"
              onClick={handleDownloadAllPNG}
              disabled={downloadingBadgeId !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/80 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Download showcase banner with all 5 badges in high-resolution PNG"
            >
              <Image className="w-3.5 h-3.5 text-purple-600" />
              <span>{downloadingBadgeId === 'all-png' ? 'Stitching...' : 'Showcase PNG'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quality Banner */}
        <div className="mt-3 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Zero-Cropping Vector Standard:</strong> Each badge renders at 1000×1000 square resolution with gold concentric rings and verified candidate attribution.
            </span>
          </div>
          <span className="font-mono text-[10px] text-indigo-700 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
            PNG + PDF AVAILABLE
          </span>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {BADGES.map((badge) => {
            const isUnlocked = !!progress.badgesUnlocked[badge.day];
            const isDownloadingPNG = downloadingBadgeId === `${badge.id}-png`;
            const isDownloadingPDF = downloadingBadgeId === `${badge.id}-pdf`;

            return (
              <div
                key={badge.id}
                onClick={() => isUnlocked && triggerBadgeConfetti()}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative ${
                  isUnlocked
                    ? 'border-indigo-200 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/40 shadow-md hover:shadow-lg hover:scale-[1.01]'
                    : 'border-slate-200 bg-slate-50/60 opacity-70'
                }`}
              >
                <div>
                  {/* Badge Medal / Graphic */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs ${
                        isUnlocked
                          ? 'border-amber-300 bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md'
                          : 'border-slate-200 bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Award className="w-7 h-7" />
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isUnlocked
                          ? 'border-indigo-200 bg-indigo-100 text-indigo-800'
                          : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      Day {badge.day}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                      <span className={isUnlocked ? 'rainbow-text' : 'text-slate-800'}>{badge.title}</span>
                      {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium">{badge.subtitle}</div>
                    <p className="text-[10px] text-slate-600 leading-relaxed pt-2 border-t border-slate-200/80 mt-2">
                      {badge.criteria}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70">
                  <div className="flex items-center justify-between text-[10px] mb-2.5">
                    <span className={isUnlocked ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      {isUnlocked ? 'Status: Unlocked ✓' : 'Status: Locked 🔒'}
                    </span>
                    {isUnlocked && (
                      <span className="text-indigo-600 font-mono font-bold">Honors Issued</span>
                    )}
                  </div>

                  {/* Individual Badge Download Buttons (PNG & PDF) */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDownloadBadgePNG(badge, isUnlocked, e)}
                      disabled={downloadingBadgeId !== null}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer disabled:opacity-50 ${
                        isUnlocked
                          ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
                          : 'border-slate-200 bg-slate-100/80 text-slate-400 hover:bg-slate-100'
                      }`}
                      title="Download 1000x1000 uncropped high-res PNG"
                    >
                      <Image className="w-3 h-3 text-indigo-600" />
                      <span>{isDownloadingPNG ? '...' : 'PNG'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDownloadBadgePDF(badge, isUnlocked, e)}
                      disabled={downloadingBadgeId !== null}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer disabled:opacity-50 ${
                        isUnlocked
                          ? 'border-indigo-600 bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                          : 'border-slate-300 bg-slate-200 text-slate-500 hover:bg-slate-200'
                      }`}
                      title="Download 1000x1000 uncropped vector PDF"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{isDownloadingPDF ? '...' : 'PDF'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="font-medium">
              Badges automatically unlock upon scoring ≥ 70% in daily post-assessments. Downloads have no cropping or formatting spillover.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-colors cursor-pointer shadow-xs"
          >
            Back to Syllabus
          </button>
        </div>
      </div>
    </div>
  );
};
