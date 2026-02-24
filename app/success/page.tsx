'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import confetti from 'canvas-confetti'; // Si tu veux des confettis, sinon on l'enlève

export default function SuccessPage() {
  useEffect(() => {
    // Petit effet de fête à l'arrivée
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 shadow-xl text-center border border-slate-100">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8">
          ✅
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
          Félicitations pour votre réussite !
        </h1>
        
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          Votre paiement a été validé. Notre équipe vérifie vos informations et génère votre certificat personnalisé. 
          Vous le recevrez par email sous **24h à 48h**.
        </p>

        <div className="bg-blue-50 rounded-2xl p-6 mb-10 text-left">
          <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            ℹ️ Prochaine étape
          </h4>
          <p className="text-blue-700 text-sm">
            Si vous n'avez pas encore envoyé votre <b>nom complet</b> tel qu'il doit apparaître sur le certificat, 
            veuillez contacter le support via WhatsApp avec votre reçu.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all">
            Retour à l'accueil
          </Link>
          <a href="https://wa.me/221774532255" className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-700 transition-all">
            Contacter le Support
          </a>
        </div>
      </div>
    </div>
  );
}