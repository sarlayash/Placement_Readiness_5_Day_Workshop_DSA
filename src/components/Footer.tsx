import React from 'react';
import { ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { HACKERRANK_COURSE_URL } from '../data/curriculum';

interface FooterProps {
  completedCount: number;
  totalQuestions: number;
  badgesEarned: number;
  onResetProgress: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  completedCount,
  totalQuestions,
  badgesEarned,
  onResetProgress,
}) => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600 text-xs py-8 px-4 lg:px-8 mt-auto shadow-2xs">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Tier: Mentorship & Curriculum Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black flex items-center justify-center text-xs shadow-xs">
                K
              </span>
              <span className="font-extrabold text-base tracking-tight rainbow-text">Kapil Placement Readiness</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              An intensive 5-day bootcamp engineered to prepare learners for Tier-1 software engineering and product company assessments.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-extrabold uppercase tracking-wider text-[11px] rainbow-text block">
              Curriculum Architecture
            </span>
            <div className="text-slate-500 space-y-1 font-medium">
              <div>• 5 Days • 2 Parts / Day (T1 - T10)</div>
              <div>• Daily Pre & Post Assessments</div>
              <div>• Daily Unlock: 08:00 AM IST</div>
              <div>• Daily Relock: 08:00 PM IST</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-extrabold uppercase tracking-wider text-[11px] rainbow-text block">
              Learner Telemetry
            </span>
            <div className="space-y-1 text-slate-500 font-medium">
              <div className="flex items-center justify-between">
                <span>Problems Solved:</span>
                <span className="text-slate-900 font-mono font-bold">{completedCount} / {totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Daily Badges:</span>
                <span className="text-slate-900 font-mono font-bold">{badgesEarned} / 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span>IST Sync:</span>
                <span className="text-emerald-700 font-bold font-mono">UTC+05:30 (Live)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-extrabold uppercase tracking-wider text-[11px] rainbow-text block">
              Official Portals
            </span>
            <div className="space-y-1.5">
              <a
                href={HACKERRANK_COURSE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors w-full justify-between font-semibold"
              >
                <span>HackerRank Course Hub</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <button
                type="button"
                onClick={onResetProgress}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors w-full justify-between font-semibold cursor-pointer"
                title="Reset local completion progress for fresh testing"
              >
                <span>Reset Learner State</span>
                <RefreshCw className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Placement Integrity & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict Google Authentication • Proctor-Enforced Verification • Single Credential Policy</span>
          </div>
          <div>
            Placement Readiness App powered by <strong className="rainbow-text font-black">Kapil</strong> © {new Date().getFullYear()}. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
