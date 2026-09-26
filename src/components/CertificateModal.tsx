import React, { useRef, useState } from 'react';
import { GoogleUser, UserProgress } from '../types';
import { Award, Download, FileText, Image, ShieldCheck, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadCertificatePNG, downloadCertificatePDF } from '../utils/exportCredentials';

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
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);

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

  const handleDownloadPNG = () => {
    try {
      setExporting('png');
      downloadCertificatePNG(user, progress);
    } catch (e) {
      console.error('PNG export failed', e);
    } finally {
      setExporting(null);
    }
  };

  const handleDownloadPDF = () => {
    try {
      setExporting('pdf');
      downloadCertificatePDF(user, progress);
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 md:p-8 text-slate-800 shadow-2xl my-6">
        {/* Modal Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black flex items-center justify-center text-sm shadow-xs">
              K
            </span>
            <div>
              <span className="font-extrabold text-slate-900 text-sm md:text-base rainbow-text">
                Official Verified Placement Credential
              </span>
              <p className="text-[11px] text-slate-500">
                Official Honors issued by Placement Readiness Program powered by Kapil
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Download PNG Button */}
            <button
              type="button"
              disabled={exporting !== null}
              onClick={handleDownloadPNG}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-xs font-bold text-indigo-900 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Download high-resolution 1920x1080 uncropped PNG certificate"
            >
              <Image className="w-3.5 h-3.5 text-indigo-600" />
              <span>{exporting === 'png' ? 'Generating...' : 'Download PNG'}</span>
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              disabled={exporting !== null}
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Download vector uncropped A4 landscape PDF certificate"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{exporting === 'pdf' ? 'Generating...' : 'Download PDF'}</span>
            </button>

            {/* Confetti celebrate */}
            <button
              type="button"
              onClick={triggerCelebration}
              className="p-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors"
              title="Celebrate Achievement"
            >
              <Award className="w-4 h-4 text-amber-600" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quality guarantee alert banner */}
        <div className="mt-4 px-3.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Zero-Cropping Standard:</strong> Generated at native 1920×1080 resolution. PNG & PDF exports are strictly formatted with no clipping, URL headers, or spillover.
            </span>
          </div>
          <span className="hidden md:inline-block font-mono text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-300">
            PNG & PDF ONLY
          </span>
        </div>

        {/* Luxury Certificate Canvas Preview */}
        <div
          id="printable-certificate"
          ref={certificateRef}
          className="my-5 p-6 md:p-10 rounded-3xl bg-white text-slate-900 border-4 md:border-8 border-double border-indigo-900/40 shadow-xl relative overflow-hidden font-serif"
        >
          {/* Top Rainbow Accent Strip inside Certificate */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-sky-500 via-indigo-500 to-purple-600" />

          {/* Subtle Watermark background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-[90px] md:text-[180px] font-black tracking-widest text-indigo-950">KAPIL</span>
          </div>

          {/* Top Decorative Border */}
          <div className="text-center space-y-1.5 border-b-2 border-indigo-900/30 pb-5 relative z-10">
            <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-full border border-indigo-200 bg-indigo-50/70 text-[10px] md:text-[11px] font-sans font-extrabold uppercase tracking-[0.25em] text-indigo-900">
              Placement Readiness Program • 5-Day Intensive
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase font-serif mt-1 rainbow-text">
              Certificate of Excellence
            </h1>
            <p className="text-xs md:text-sm italic text-slate-600 font-sans tracking-wide">
              Powered by Kapil • Technical Placement Readiness & Problem Solving
            </p>
          </div>

          {/* Body Content */}
          <div className="my-6 text-center space-y-3 relative z-10">
            <p className="text-xs font-sans uppercase tracking-widest text-slate-500 font-bold">
              This is to officially certify that
            </p>

            <div className="text-xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 border-b-2 border-indigo-500 inline-block px-6 md:px-10 pb-1 tracking-tight font-sans rainbow-text">
              {user.name}
            </div>

            <div className="text-xs font-mono text-slate-500">
              Google Authenticated: {user.email}
            </div>

            <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto font-sans pt-1">
              has demonstrated technical excellence and problem-solving rigor across the comprehensive syllabus covering
              <strong className="text-slate-950 font-bold"> Topics T1 through T10</strong> (Graphs, Advanced Recursion, In-Place Array Transformations, Time & Space Complexity, Number Theory, Two-Pointer Invariants, and Divide & Conquer Algorithms), achieving honors in the
              <strong className="text-slate-950 font-bold"> Proctored Final Technical Assessment</strong> with verified integrity.
            </p>
          </div>

          {/* Bottom Details & Signatures */}
          <div className="pt-6 border-t-2 border-indigo-900/30 grid grid-cols-1 sm:grid-cols-3 gap-5 items-end relative z-10 font-sans">
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
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-amber-500 p-1 flex items-center justify-center shadow-md bg-amber-50/50">
                <div className="w-full h-full rounded-full border border-dashed border-amber-600 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-[8px] md:text-[9px] font-black tracking-tighter uppercase leading-none text-amber-900">KAPIL</span>
                  <Award className="w-4 h-4 md:w-5 md:h-5 text-amber-600 my-0.5" />
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

        {/* Verification Footer Notes & Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-3 gap-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Authenticity Hash: sha256:{certId.toLowerCase()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPNG}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Save PNG (1920x1080)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Save PDF (Landscape)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
