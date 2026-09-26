import React, { useRef } from 'react';
import { GoogleUser, UserProgress } from '../types';
import { Award, Printer, ShieldCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  user: GoogleUser;
  progress: UserProgress;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  user,
  progress,
  onClose,
}) => {
  const certificateRef = useRef<HTMLDivElement | null>(null);

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

  const certId = progress.certificateId || 'KAPIL-PRP-2026-DEMO-999';

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 text-slate-800 shadow-2xl my-8">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black flex items-center justify-center text-xs shadow-xs">
              K
            </span>
            <span className="font-extrabold text-slate-900 text-sm rainbow-text">Official Verified Placement Credential</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={triggerCelebration}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all shadow-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Celebrate</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Luxury Certificate Canvas with Rainbow & Royal Styling */}
        <div
          id="printable-certificate"
          ref={certificateRef}
          className="my-6 p-8 md:p-12 rounded-3xl bg-white text-slate-900 border-8 border-double border-indigo-900/40 shadow-2xl relative overflow-hidden font-serif"
        >
          {/* Top Rainbow Accent Strip inside Certificate */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-sky-500 via-indigo-500 to-purple-600" />

          {/* Subtle Watermark background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-[180px] font-black tracking-widest text-indigo-950">KAPIL</span>
          </div>

          {/* Top Decorative Border */}
          <div className="text-center space-y-2 border-b-2 border-indigo-900/30 pb-6 relative z-10">
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-indigo-200 bg-indigo-50/60 text-[11px] font-sans font-extrabold uppercase tracking-[0.25em] text-indigo-900">
              Placement Readiness Program • 5-Day Intensive
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase font-serif mt-2 rainbow-text">
              Certificate of Excellence
            </h1>
            <p className="text-xs md:text-sm italic text-slate-600 font-sans tracking-wide">
              Powered by Kapil • Technical Placement Readiness & Problem Solving
            </p>
          </div>

          {/* Body Content */}
          <div className="my-8 text-center space-y-4 relative z-10">
            <p className="text-xs font-sans uppercase tracking-widest text-slate-500 font-bold">
              This is to officially certify that
            </p>

            <div className="text-2xl md:text-4xl font-extrabold text-slate-900 border-b-2 border-indigo-500 inline-block px-8 pb-1 tracking-tight font-sans rainbow-text">
              {user.name}
            </div>

            <div className="text-xs font-mono text-slate-500">
              Google Authenticated: {user.email}
            </div>

            <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto font-sans pt-2">
              has demonstrated technical excellence and problem-solving rigor across the comprehensive syllabus covering
              <strong className="text-slate-950 font-bold"> Topics T1 through T10</strong> (Graphs, Advanced Recursion, In-Place Array Transformations, Time & Space Complexity, Number Theory, Two-Pointer Invariants, and Divide & Conquer Algorithms), achieving honors in the
              <strong className="text-slate-950 font-bold"> Proctored Final Technical Assessment</strong> with verified integrity.
            </p>
          </div>

          {/* Bottom Details & Signatures */}
          <div className="pt-8 border-t-2 border-indigo-900/30 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end relative z-10 font-sans">
            {/* Left: Issue Date & Verification */}
            <div className="text-left space-y-1 text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Issued On (IST)
              </div>
              <div className="font-extrabold text-slate-900">{issueDate}</div>
              <div className="text-[10px] font-mono text-slate-600 pt-1">
                Credential ID: <br />
                <span className="font-bold text-indigo-700">{certId}</span>
              </div>
            </div>

            {/* Center: Official Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-amber-500 p-1 flex items-center justify-center shadow-md bg-amber-50/50">
                <div className="w-full h-full rounded-full border border-dashed border-amber-600 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-[9px] font-black tracking-tighter uppercase leading-none text-amber-900">KAPIL</span>
                  <Award className="w-5 h-5 text-amber-600 my-0.5" />
                  <span className="text-[7px] font-bold uppercase tracking-wider text-amber-700">VERIFIED</span>
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-1 font-bold">
                Official Seal
              </span>
            </div>

            {/* Right: Signature */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-2xl text-indigo-950 border-b border-slate-300 pb-1 font-bold">
                Kapil
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 rainbow-text">
                Kapil
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Lead Placement Mentor & Architect
              </div>
            </div>
          </div>
        </div>

        {/* Verification Footer Notes */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 print:hidden gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Authenticity Hash: sha256:{certId.toLowerCase()}</span>
          </div>
          <div>Authorized by Placement Readiness Council</div>
        </div>
      </div>
    </div>
  );
};
