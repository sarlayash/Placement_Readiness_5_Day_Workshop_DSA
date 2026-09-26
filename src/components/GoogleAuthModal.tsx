import React, { useState } from 'react';
import { GoogleUser } from '../types';
import { signInWithGoogleFirebase, DEMO_USER } from '../utils/firebase';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, UserCheck, Sparkles, X } from 'lucide-react';

interface GoogleAuthModalProps {
  onSignIn: (user: GoogleUser) => void;
  onClose?: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ onSignIn, onClose }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFirebaseGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMessage('');
    try {
      const user = await signInWithGoogleFirebase();
      onSignIn(user);
    } catch (err: unknown) {
      console.warn('Firebase Google Auth notice:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('popup-closed-by-user')) {
        setErrorMessage('Google Sign-In popup was closed. Please try again or use the Demo User below.');
      } else if (msg.includes('unauthorized-domain')) {
        setErrorMessage('Firebase Domain Authorization: Localhost not yet whitelisted in Firebase Console. You can use the instant Demo User below to proceed immediately!');
      } else {
        setErrorMessage('Google Authentication encountered a network/domain notice. You can continue instantly with the Demo User below.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDemoSignIn = () => {
    onSignIn(DEMO_USER);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 md:p-8 text-slate-800 shadow-2xl">
        {/* Top Rainbow Accent Line */}
        <div className="absolute top-0 left-8 right-8 h-1.5 rounded-b-full bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-sky-500 to-purple-600" />

        {/* Optional Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Kapil Branding Header with Rainbow Text */}
        <div className="text-center mt-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-2xl mb-3 shadow-md">
            K
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight rainbow-text">
            Placement Readiness App
          </h2>
          <p className="text-xs uppercase tracking-widest text-slate-500 mt-1 font-bold">
            5-Day Intensive • Powered by Kapil
          </p>
        </div>

        {/* Exclusive Google Sign-In Banner */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">Strict Google Authentication Protocol:</span>
              <p>
                Powered by official Firebase SDK. Only verified <span className="text-indigo-600 font-semibold underline">Google Accounts</span> or the authorized <span className="text-slate-900 font-semibold">Demo User</span> are permitted. No passwords or third-party logins allowed.
              </p>
            </div>
          </div>
        </div>

        {/* Error / Domain Notice Banner */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 mb-5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sign In Actions */}
        <div className="space-y-3 mb-4">
          {/* Primary Action: Official Firebase Google Popup */}
          <button
            type="button"
            disabled={isAuthenticating}
            onClick={handleFirebaseGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all bg-white border-2 border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.99] disabled:opacity-60 shadow-sm cursor-pointer"
          >
            {/* Google Vector Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isAuthenticating ? 'Connecting to Google...' : 'Sign in with Google'}</span>
            {!isAuthenticating && <ArrowRight className="w-4 h-4 ml-1 text-slate-400" />}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or Instant Demo Access
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Secondary Action: ONLY DEMO USER (No fake accounts list) */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <img
                src={DEMO_USER.avatar}
                alt={DEMO_USER.name}
                className="w-10 h-10 rounded-full border border-slate-300 object-cover"
              />
              <div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <span>Continue as Demo User</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-700 font-bold uppercase">
                    Demo
                  </span>
                </div>
                <div className="text-xs text-slate-500">{DEMO_USER.email}</div>
              </div>
            </div>
            <UserCheck className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors mr-1" />
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Firebase v11 App: placement-readiness-5-day • Proctored</span>
        </div>
      </div>
    </div>
  );
};
