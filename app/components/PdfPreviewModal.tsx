'use client';

import { CoursePdf } from '@/lib/courses-data';

interface PdfPreviewModalProps {
  pdf: CoursePdf | null;
  onClose: () => void;
}

export default function PdfPreviewModal({ pdf, onClose }: PdfPreviewModalProps) {
  if (!pdf) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
        
        {/* EN-TÊTE */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xl font-black">
              {pdf.number}
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                Support de cours officiel PDF
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white">{pdf.title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* DÉTAILS DU DOCUMENT */}
        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            {pdf.description}
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1.5">
              <span>📄</span> Format : PDF Standard
            </span>
            <span className="flex items-center gap-1.5">
              <span>💾</span> Taille : {pdf.file_size}
            </span>
            <span className="flex items-center gap-1.5">
              <span>📑</span> Volume : {pdf.pages}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/10 text-slate-300 hover:bg-white/15 text-xs font-bold uppercase tracking-wider transition-all"
          >
            Fermer
          </button>
          <a
            href={pdf.download_url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
          >
            <span>📥</span> Télécharger le document ({pdf.file_size})
          </a>
        </div>

      </div>
    </div>
  );
}
