import React from 'react';
import { BookOpen, Brain, Zap, Code2, Award, WifiOff, MessageSquare } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'syllabus' | 'aptitude';
  onSelectTab: (tab: 'syllabus' | 'aptitude') => void;
  onOpenSpinningWheel: () => void;
  onOpenIDE: () => void;
  onOpenBadges: () => void;
  isOnline: boolean;
  onOpenFeedback?: () => void;
  feedbackActive?: boolean;
  feedbackFilled?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSpinningWheel,
  onOpenIDE,
  onOpenBadges,
  isOnline,
  onOpenFeedback,
  feedbackActive,
  feedbackFilled,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-1.5 py-1.5 flex items-center justify-around safe-bottom">
      {/* Offline Toast if disconnected */}
      {!isOnline && (
        <div className="absolute -top-7 left-0 right-0 bg-amber-600 text-white text-[10px] font-bold py-1 px-3 text-center flex items-center justify-center gap-1 shadow-md">
          <WifiOff className="w-3 h-3" />
          <span>Offline Mode Active • All changes saved locally</span>
        </div>
      )}

      {/* 1. Syllabus */}
      <button
        type="button"
        onClick={() => onSelectTab('syllabus')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer min-w-[50px] ${
          currentTab === 'syllabus'
            ? 'text-indigo-600 font-extrabold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <BookOpen className={`w-5 h-5 ${currentTab === 'syllabus' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[9px] mt-0.5">Syllabus</span>
      </button>

      {/* 2. 25 Aptitude */}
      <button
        type="button"
        onClick={() => onSelectTab('aptitude')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer min-w-[50px] ${
          currentTab === 'aptitude'
            ? 'text-indigo-600 font-extrabold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <Brain className={`w-5 h-5 ${currentTab === 'aptitude' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[9px] mt-0.5">Aptitude</span>
      </button>

      {/* 3. Wheel of Fortune (Center Highlight) */}
      <button
        type="button"
        onClick={onOpenSpinningWheel}
        className="flex flex-col items-center justify-center p-1 -mt-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md active:scale-95 transition-transform cursor-pointer min-w-[52px]"
      >
        <Zap className="w-5 h-5 animate-pulse" />
        <span className="text-[8px] font-black uppercase tracking-tight">Wheel</span>
      </button>

      {/* 4. Browser IDE */}
      <button
        type="button"
        onClick={onOpenIDE}
        className="flex flex-col items-center justify-center p-1 rounded-xl text-slate-500 hover:text-slate-900 font-medium transition-all cursor-pointer min-w-[50px]"
      >
        <Code2 className="w-5 h-5 text-indigo-500" />
        <span className="text-[9px] mt-0.5">IDE</span>
      </button>

      {/* 5. Daily Feedback Button */}
      {onOpenFeedback && (
        <button
          type="button"
          onClick={onOpenFeedback}
          className={`relative flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer min-w-[50px] ${
            feedbackFilled
              ? 'text-emerald-600 font-semibold'
              : feedbackActive
              ? 'text-rose-600 font-extrabold animate-pulse'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          {feedbackActive && !feedbackFilled && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white animate-ping" />
          )}
          <MessageSquare className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">
            {feedbackFilled ? 'Feedback' : feedbackActive ? 'Live!' : 'Feedback'}
          </span>
        </button>
      )}

      {/* 6. Badges */}
      <button
        type="button"
        onClick={onOpenBadges}
        className="flex flex-col items-center justify-center p-1 rounded-xl text-slate-500 hover:text-slate-900 font-medium transition-all cursor-pointer min-w-[50px]"
      >
        <Award className="w-5 h-5 text-amber-500" />
        <span className="text-[9px] mt-0.5">Badges</span>
      </button>
    </div>
  );
};
