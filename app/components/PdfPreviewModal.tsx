'use client';

import { useEffect } from 'react';
import { CoursePdf } from '@/lib/courses-data';

interface PdfPreviewModalProps {
  pdf: CoursePdf | null;
  onClose: () => void;
}

export default function PdfPreviewModal({ pdf, onClose }: PdfPreviewModalProps) {
  useEffect(() => {
    if (!pdf) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [pdf, onClose]);

  if (!pdf) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] bg-slate-900 border border-white/10 rounded-2xl sm:rounded-3xl text-white shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* EN-TÊTE FIXE ET VISIBLE TOUT LE TEMPS */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-900 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Bouton Marche Arrière Très Visible */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold transition-all border border-white/10 shrink-0"
              title="Revenir au cours"
            >
              <span>←</span>
              <span className="hidden sm:inline">Retour au cours</span>
            </button>

            <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-sm font-black shrink-0">
              {pdf.number}
            </span>

            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block truncate">
                Support officiel • Fiche #{pdf.number}
              </span>
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
                {pdf.title}
              </h3>
            </div>
          </div>

          {/* Bouton Croix Fermer */}
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm shrink-0 transition-colors"
            title="Fermer la fenêtre"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* CORPS DE DÉFILEMENT (ADAPTÉ À TOUTES LES TAILLES D'ÉCRAN) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          
          {/* Métadonnées & Résumé */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {pdf.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-slate-400 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1">
                <span>📄</span> Format PDF
              </span>
              <span className="flex items-center gap-1">
                <span>💾</span> {pdf.file_size}
              </span>
              <span className="flex items-center gap-1">
                <span>📑</span> {pdf.pages}
              </span>
            </div>
          </div>

          {/* Visionneuse PDF Intégrée */}
          <div className="w-full h-[55vh] sm:h-[60vh] rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-inner relative">
            <iframe
              src={`${pdf.download_url}#toolbar=1`}
              className="w-full h-full border-0"
              title={pdf.title}
            />
          </div>
        </div>

        {/* PIED DE PAGE FIXE AVEC LES ACTIONS */}
        <div className="px-4 sm:px-6 py-3 bg-slate-900 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <span>←</span> Fermer
          </button>

          <div className="flex items-center gap-2">
            <a
              href={pdf.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10 transition-all"
            >
              <span>👁️</span> Plein écran
            </a>
            <a
              href={pdf.download_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <span>📥</span> Télécharger ({pdf.file_size})
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
