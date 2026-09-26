import React from 'react';
import { BADGES } from '../data/curriculum';
import { UserProgress } from '../types';
import { Award, CheckCircle2, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BadgeGalleryProps {
  progress: UserProgress;
  onClose: () => void;
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ progress, onClose }) => {
  const unlockedCount = Object.values(progress.badgesUnlocked).filter(Boolean).length;

  const triggerBadgeConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 text-slate-800 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold">
                Daily Honors
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {unlockedCount} of 5 Badges Earned
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black mt-1 rainbow-text">Placement Mastery Badge Gallery</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {BADGES.map((badge) => {
            const isUnlocked = !!progress.badgesUnlocked[badge.day];

            return (
              <div
                key={badge.id}
                onClick={() => isUnlocked && triggerBadgeConfetti()}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative cursor-pointer ${
                  isUnlocked
                    ? 'border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 shadow-md hover:scale-[1.02]'
                    : 'border-slate-200 bg-slate-50/60 opacity-60'
                }`}
              >
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

                <div className="mt-4 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className={isUnlocked ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                    {isUnlocked ? 'Status: Unlocked ✓' : 'Status: Locked 🔒'}
                  </span>
                  {isUnlocked && (
                    <span className="text-indigo-600 font-mono font-bold">Honors Issued</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="font-medium">Badges are automatically unlocked when daily post-assessments are passed.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-colors cursor-pointer shadow-xs"
          >
            Back to Syllabus
          </button>
        </div>
      </div>
    </div>
  );
};
