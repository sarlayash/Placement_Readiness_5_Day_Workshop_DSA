import { GoogleUser, UserProgress, FeedbackWindowStatus } from '../types';
import { ISTStatus } from '../utils/istTime';
import {
  Clock,
  LogOut,
  Award,
  Menu,
  Lock,
  Unlock,
  Sparkles,
  Code2,
  Lightbulb,
  Zap,
  Brain,
  LogIn,
  Smartphone,
  WifiOff,
  MessageSquare,
} from 'lucide-react';

interface HeaderProps {
  user: GoogleUser | null;
  progress: UserProgress;
  istStatus: ISTStatus;
  demoBypass: boolean;
  onToggleDemoBypass: () => void;
  onSignOut: () => void;
  onToggleLeftSidebar: () => void;
  onOpenBadges: () => void;
  onOpenCertificate: () => void;
  onOpenIDE?: () => void;
  onOpenInterviewTips?: () => void;
  onOpenSpinningWheel?: () => void;
  onOpenAptitude?: () => void;
  onOpenLevelZero?: () => void;
  onPromptLogin?: () => void;
  onOpenPWAInstall?: () => void;
  isOnline?: boolean;
  feedbackStatus?: FeedbackWindowStatus;
  onOpenFeedback?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  progress,
  istStatus,
  demoBypass,
  onToggleDemoBypass,
  onSignOut,
  onToggleLeftSidebar,
  onOpenBadges,
  onOpenCertificate,
  onOpenIDE,
  onOpenInterviewTips,
  onOpenSpinningWheel,
  onOpenAptitude,
  onOpenLevelZero,
  onPromptLogin,
  onOpenPWAInstall,
  isOnline = true,
  feedbackStatus,
  onOpenFeedback,
}) => {
  const badgeCount = Object.values(progress.badgesUnlocked).filter(Boolean).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md text-slate-800 transition-all shadow-xs">
      {/* Top Rainbow Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-sky-500 via-indigo-500 to-purple-600" />

      <div className="flex items-center justify-between px-3 lg:px-6 h-16 gap-2 sm:gap-3">
        {/* Left Side: Mobile Menu & Brand with Rainbow Heading */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleLeftSidebar}
            className="lg:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            title="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black flex items-center justify-center text-lg shadow-sm">
              K
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight rainbow-text">
                  Placement Readiness App
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  5-Day Boot
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Powered by <strong className="text-slate-900 font-bold">Kapil</strong> • 8 AM - 8 PM IST
              </div>
            </div>
          </div>
        </div>

        {/* Center: Live IST Status & Active Window Pill */}
        <div className="hidden xl:flex items-center gap-2.5 text-xs">
          {/* IST Time Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-mono text-slate-800 font-bold">{istStatus.istTimeString}</span>
            <span className="text-[10px] text-slate-500 border-l border-slate-200 pl-1.5">IST</span>
          </div>

          {/* Active Window or Relock Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-colors ${
              istStatus.isWithinActiveWindow
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
          >
            {istStatus.isWithinActiveWindow ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-900">Active (8am - 8pm)</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-amber-600" />
                <span className="font-bold text-amber-900">Night Lock</span>
              </>
            )}
          </div>

          {/* Time Lock Override / Sandbox for Testing */}
          <button
            type="button"
            onClick={onToggleDemoBypass}
            title={demoBypass ? 'Lock schedule bypassed for testing' : 'Click to bypass 8am-8pm lock'}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
              demoBypass
                ? 'border-indigo-400 bg-indigo-600 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            {demoBypass ? <Unlock className="w-3 h-3 text-white" /> : <Lock className="w-3 h-3" />}
            <span>{demoBypass ? 'Bypass ON' : 'Bypass'}</span>
          </button>
        </div>

        {/* Right Side: Quick Action Links */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Wheel of Fortune Button */}
          {onOpenSpinningWheel && (
            <button
              type="button"
              onClick={onOpenSpinningWheel}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Spinning Wheel for 10 Bonus MCQs with Negative Marks"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span className="hidden sm:inline">Spin Wheel</span>
              <span className="sm:hidden">Wheel</span>
            </button>
          )}

          {/* Aptitude Quick Button */}
          {onOpenAptitude && (
            <button
              type="button"
              onClick={onOpenAptitude}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Jump to 25 Placement Aptitude MCQs"
            >
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">25 Aptitude</span>
              <span className="sm:hidden">Apt</span>
            </button>
          )}

          {/* LEVEL 0 Foundations Button */}
          {onOpenLevelZero && (
            <button
              type="button"
              onClick={onOpenLevelZero}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-sky-300 bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 text-sky-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="LEVEL 0: 10 Solved Basic Programs in Java, C, C++, Python, HTML"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span className="hidden sm:inline">LEVEL 0</span>
              <span className="sm:hidden">L0</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-sky-200/90 text-sky-900 font-mono">
                {progress.levelZeroCompletedIds?.length || 0}/10
              </span>
            </button>
          )}

          {/* Quick Badges Button */}
          <button
            type="button"
            onClick={onOpenBadges}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-semibold transition-colors cursor-pointer"
            title="View Daily Badges"
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Badges</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {badgeCount}/5
            </span>
          </button>

          {/* Certificate Quick Link (if final passed) */}
          {progress.finalExamPassed && (
            <button
              type="button"
              onClick={onOpenCertificate}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-95 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Certificate</span>
            </button>
          )}

          {/* Browser IDE Quick Button */}
          {onOpenIDE && (
            <button
              type="button"
              onClick={onOpenIDE}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-600 bg-[#070d1e] hover:bg-[#0c1633] text-indigo-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Open Browser IDE (C, C++, Java, Python, HTML, JS + Hidden Tests)"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">IDE</span>
            </button>
          )}

          {/* Interview Tips Playbook Quick Button */}
          {onOpenInterviewTips && (
            <button
              type="button"
              onClick={onOpenInterviewTips}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Kapil's Placement Interview Playbook"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Playbook</span>
            </button>
          )}

          {/* Daily Workshop Feedback Button (2:30 PM - 3:30 PM IST) */}
          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                feedbackStatus?.isFilledToday
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : feedbackStatus?.isActive
                  ? 'border-rose-400 bg-rose-600 text-white animate-pulse'
                  : feedbackStatus?.reminderStage === '5m' || feedbackStatus?.reminderStage === '10m' || feedbackStatus?.reminderStage === '30m'
                  ? 'border-amber-300 bg-amber-50 text-amber-900 animate-pulse'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              title="Daily Workshop Feedback (Active 2:30 PM - 3:30 PM IST daily)"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {feedbackStatus?.isFilledToday ? (
                <>
                  <span className="hidden sm:inline">Feedback Done</span>
                  <span className="sm:hidden">Feedback ✓</span>
                </>
              ) : feedbackStatus?.isActive ? (
                <>
                  <span className="hidden sm:inline">Feedback LIVE</span>
                  <span className="sm:hidden">Live!</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Daily Feedback</span>
                  <span className="sm:hidden">Feedback</span>
                </>
              )}
            </button>
          )}

          {/* PWA Phone App Download Button */}
          {onOpenPWAInstall && (
            <button
              type="button"
              onClick={onOpenPWAInstall}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Download & Install PWA App on Phone or PC (Works 100% Offline)"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Install App</span>
              <span className="lg:hidden">App</span>
            </button>
          )}

          {/* Offline Indicator if connection dropped */}
          {!isOnline && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500 text-white text-[10px] font-bold shadow-xs animate-pulse"
              title="Device is currently offline. All features & storage working locally."
            >
              <WifiOff className="w-3 h-3" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}

          {/* User Profile / Login Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-indigo-200 object-cover"
                title={`${user.name} (${user.email})`}
              />
              <div className="hidden 2xl:block text-left text-xs leading-none">
                <div className="font-bold text-slate-900 truncate max-w-[120px]">{user.name}</div>
                <div className="text-[10px] text-slate-500 truncate max-w-[120px] mt-0.5">Google User</div>
              </div>

              <button
                type="button"
                onClick={onSignOut}
                className="p-1.5 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onPromptLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 text-xs font-extrabold transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile IST Sub-header */}
      <div className="xl:hidden flex items-center justify-between px-4 py-1.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-indigo-600" />
          <span className="font-mono font-medium">{istStatus.istTimeString} IST</span>
          <span>{istStatus.isWithinActiveWindow ? '● Active' : '🔒 Locked'}</span>
        </div>
        <button
          type="button"
          onClick={onToggleDemoBypass}
          className="text-[10px] underline font-bold text-indigo-600 cursor-pointer"
        >
          {demoBypass ? 'Bypass ON' : 'Bypass Lock'}
        </button>
      </div>
    </header>
  );
};
