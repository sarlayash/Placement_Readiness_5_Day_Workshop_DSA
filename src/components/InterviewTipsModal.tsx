import React, { useState } from 'react';
import { KAPIL_INTERVIEW_TIPS } from '../data/interviewTips';
import {
  Lightbulb,
  AlertTriangle,
  Compass,
  Award,
  Users,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface InterviewTipsModalProps {
  onClose: () => void;
}

export const InterviewTipsModal: React.FC<InterviewTipsModalProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Strategy', 'Technical', 'Red Flags', 'Behavioral'];

  const filteredTips =
    selectedCategory === 'All'
      ? KAPIL_INTERVIEW_TIPS
      : KAPIL_INTERVIEW_TIPS.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-800 bg-[#070d1e] p-6 md:p-8 text-slate-100 shadow-2xl my-8">
        {/* Header in Dark Theme */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center shadow-md">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base md:text-lg text-white">
                  Kapil&apos;s Placement Interview Playbook
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                  FAANG Standard
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Strategic advice, red-flag avoidance, hidden test case mastery, and STAR behavioral answers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 my-5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tips Cards Grid */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {filteredTips.map((tip) => (
            <div
              key={tip.id}
              className="p-6 rounded-2xl border border-slate-800/90 bg-[#0a1229] space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
                        tip.category === 'Strategy'
                          ? 'border-indigo-800 bg-indigo-950/60 text-indigo-300'
                          : tip.category === 'Technical'
                          ? 'border-emerald-800 bg-emerald-950/60 text-emerald-300'
                          : tip.category === 'Red Flags'
                          ? 'border-rose-800 bg-rose-950/60 text-rose-300'
                          : 'border-amber-800 bg-amber-950/60 text-amber-300'
                      }`}
                    >
                      {tip.category}
                    </span>
                    <h3 className="font-extrabold text-white text-base">{tip.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{tip.subtitle}</p>
                </div>
              </div>

              {/* Key Points */}
              <div className="space-y-2 pt-1">
                {tip.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Kapil Quote */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs italic text-amber-300/90 font-medium">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>&ldquo;{tip.kapilQuote}&rdquo; — Kapil</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-800 mt-5 text-xs text-slate-400">
          <div>Placement Readiness Program • Powered by Kapil</div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            Back to Practice
          </button>
        </div>
      </div>
    </div>
  );
};
