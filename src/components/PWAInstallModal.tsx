import React, { useState } from 'react';
import { promptPWAInstall, isIOS, isAppInstalled } from '../utils/pwa';
import {
  Smartphone,
  Download,
  CheckCircle2,
  WifiOff,
  Sparkles,
  Share,
  PlusSquare,
  X,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PWAInstallModalProps {
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ onClose }) => {
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'installed' | 'manual'>('idle');
  const iOS = isIOS();
  const alreadyInstalled = isAppInstalled();

  const handleInstallClick = async () => {
    setInstallStatus('installing');
    const outcome = await promptPWAInstall();

    if (outcome === 'accepted') {
      setInstallStatus('installed');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      });
    } else if (outcome === 'unsupported' || iOS) {
      setInstallStatus('manual');
    } else {
      setInstallStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 md:p-8 text-slate-800 shadow-2xl my-6 overflow-hidden">
        {/* Top Rainbow Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-sky-500 via-indigo-500 to-purple-600" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 rainbow-text">
                Install Placement App (PWA)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Download to your phone or desktop for full offline practice
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Grid */}
        <div className="my-5 space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
            <WifiOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-bold">100% Offline Capability:</strong>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Practice all 30 solved programs, write code in the In-Browser IDE, review the 25 Aptitude MCQs, and prepare without needing an active internet connection.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-bold">Native Phone Experience:</strong>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Launches in standalone fullscreen without browser search bars, with quick thumb-reach navigation and responsive touch-first layout.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-bold">Zero Storage Bloat:</strong>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Takes less than 3 MB of space on your device. All your badges, solutions, and progress stay encrypted and synchronized.
              </p>
            </div>
          </div>
        </div>

        {/* Manual Instructions for iOS or unsupported browsers */}
        {(iOS || installStatus === 'manual') && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-2 mb-4">
            <div className="font-extrabold flex items-center gap-1.5 text-indigo-900">
              <Share className="w-4 h-4 text-indigo-600" />
              <span>How to Install on iPhone / iPad (Safari):</span>
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-slate-700 leading-relaxed">
              <li>
                Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-indigo-600 mx-0.5" /> at the bottom of Safari.
              </li>
              <li>
                Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong> <PlusSquare className="w-3.5 h-3.5 inline text-indigo-600 mx-0.5" />.
              </li>
              <li>
                Tap <strong>Add</strong> at the top right. The Placement App icon will appear on your home screen!
              </li>
            </ol>
          </div>
        )}

        {/* Success State */}
        {alreadyInstalled && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Placement Readiness PWA is already active on your device!</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
          {!alreadyInstalled && !iOS && (
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={installStatus === 'installing'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{installStatus === 'installing' ? 'Prompting Install...' : 'Download / Install Now'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
