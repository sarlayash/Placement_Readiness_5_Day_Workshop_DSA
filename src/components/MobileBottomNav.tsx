import React from 'react';
import { BookOpen, Brain, Zap, Code2, Award, WifiOff } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'syllabus' | 'aptitude';
  onSelectTab: (tab: 'syllabus' | 'aptitude') => void;
  onOpenSpinningWheel: () => void;
  onOpenIDE: () => void;
  onOpenBadges: () => void;
  isOnline: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSpinningWheel,
  onOpenIDE,
  onOpenBadges,
  isOnline,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around safe-bottom">
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
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer min-w-[56px] ${
          currentTab === 'syllabus'
            ? 'text-indigo-600 font-extrabold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <BookOpen className={`w-5 h-5 ${currentTab === 'syllabus' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">Syllabus</span>
      </button>

      {/* 2. 25 Aptitude */}
      <button
        type="button"
        onClick={() => onSelectTab('aptitude')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer min-w-[56px] ${
          currentTab === 'aptitude'
            ? 'text-indigo-600 font-extrabold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <Brain className={`w-5 h-5 ${currentTab === 'aptitude' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">Aptitude</span>
      </button>

      {/* 3. Wheel of Fortune (Center Highlight) */}
      <button
        type="button"
        onClick={onOpenSpinningWheel}
        className="flex flex-col items-center justify-center p-1.5 -mt-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md active:scale-95 transition-transform cursor-pointer min-w-[56px]"
      >
        <Zap className="w-5 h-5 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-tight">Wheel</span>
      </button>

      {/* 4. Browser IDE */}
      <button
        type="button"
        onClick={onOpenIDE}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-500 hover:text-slate-900 font-medium transition-all cursor-pointer min-w-[56px]"
      >
        <Code2 className="w-5 h-5 text-indigo-500" />
        <span className="text-[10px] mt-0.5">IDE</span>
      </button>

      {/* 5. Badges */}
      <button
        type="button"
        onClick={onOpenBadges}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-500 hover:text-slate-900 font-medium transition-all cursor-pointer min-w-[56px]"
      >
        <Award className="w-5 h-5 text-amber-500" />
        <span className="text-[10px] mt-0.5">Badges</span>
      </button>
    </div>
  );
};
