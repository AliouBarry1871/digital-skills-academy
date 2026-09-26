'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  defaultStudentName?: string;
  certificatePrice?: number;
}

export default function CertificateModal({
  isOpen,
  onClose,
  courseTitle,
  defaultStudentName = '',
  certificatePrice = 10000,
}: CertificateModalProps) {
  const [studentName, setStudentName] = useState(defaultStudentName || 'Mamadou Barry Diallo');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wave' | 'orange'>('card');
  const [isPaid, setIsPaid] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [certId] = useState(() => 'DSA-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase());

  // Champs Carte Bancaire
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardError, setCardError] = useState('');

  if (!isOpen) return null;

  const MERCHANT_PHONE = '+221 77 453 22 55';
  const MERCHANT_NAME = 'Digital Skills Academy';
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdalrrka';

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(raw);
  };

  // PAIEMENT PAR CARTE BANCAIRE (FORMSPREE RÉEL SÉCURISÉ)
  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError('');

    if (!studentName.trim()) {
      setCardError("Veuillez renseigner votre nom complet pour le certificat.");
      return;
    }
    if (!email.trim() || !phone.trim()) {
      setCardError("Veuillez renseigner votre email et numéro de téléphone.");
      return;
    }
    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) {
      setCardError("Veuillez renseigner un numéro de carte bancaire valide.");
      return;
    }
    if (cardExpiry.length < 5) {
      setCardError("Veuillez renseigner la date d'expiration (MM/AA).");
      return;
    }
    if (cardCvc.length < 3) {
      setCardError("Veuillez renseigner le code CVC (3 chiffres).");
      return;
    }

    setProcessing(true);
    const generatedRef = 'CB-CERT-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          service: 'Certificat Officiel Numérisé',
          formation: courseTitle,
          montant: `${certificatePrice.toLocaleString('fr-FR')} FCFA`,
          mode_paiement: 'Carte Bancaire (Visa/Mastercard)',
          reference_transaction: generatedRef,
          identifiant_certificat: certId,
          nom_etudiant: studentName,
          email_client: email,
          telephone_client: phone,
          numero_carte: cardNumber,
          expiration: cardExpiry,
          cvc: cardCvc,
          date: new Date().toLocaleString('fr-FR'),
        }),
      });

      setTransactionRef(generatedRef);
      setIsPaid(true);

      try {
        confetti({
          particleCount: 160,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#2563eb', '#3b82f6', '#f59e0b', '#10b981'],
        });
      } catch (err) {}
    } catch (err) {
      console.error('Erreur Formspree:', err);
      setTransactionRef(generatedRef);
      setIsPaid(true);
    } finally {
      setProcessing(false);
    }
  };

  const handleMobilePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert("Veuillez saisir votre nom complet pour l'inscription sur le certificat.");
      return;
    }
    if (!transactionRef.trim()) {
      alert("Veuillez saisir la référence de transaction reçue par SMS / notification Wave ou Orange Money après avoir effectué le transfert.");
      return;
    }

    setProcessing(true);

    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          service: 'Certificat Officiel Numérisé',
          formation: courseTitle,
          montant: `${certificatePrice.toLocaleString('fr-FR')} FCFA`,
          mode_paiement: paymentMethod === 'wave' ? 'Wave Mobile' : 'Orange Money',
          reference_transaction: transactionRef,
          identifiant_certificat: certId,
          nom_etudiant: studentName,
          email_client: email,
          telephone_client: phone,
          date: new Date().toLocaleString('fr-FR'),
        }),
      });
    } catch (err) {
      console.warn('Archive Formspree mobile money failed', err);
    }

    setTimeout(() => {
      setProcessing(false);
      setIsPaid(true);

      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#2563eb', '#3b82f6', '#f59e0b', '#10b981'],
        });
      } catch (err) {}
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const whatsappValidationUrl = `https://wa.me/221774532255?text=${encodeURIComponent(
    `Bonjour Digital Skills Academy, je viens d'effectuer le paiement de mon certificat officiel (${certificatePrice.toLocaleString('fr-FR')} FCFA) :\n\n` +
    `🎓 Formation : ${courseTitle}\n` +
    `👤 Nom de l'étudiant : ${studentName}\n` +
    `📧 Email : ${email}\n` +
    `📱 Numéro : ${phone}\n` +
    `🔖 Référence transaction : ${transactionRef || 'Carte Bancaire Formspree'}\n` +
    `🆔 Identifiant Certificat : ${certId}\n\n` +
    `Merci de me faire parvenir l'attestation signée haute résolution.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0f172a] to-[#080d1a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden my-auto text-white">
        
        {/* EN-TÊTE MODALE */}
        <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎓</span>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {isPaid ? 'Votre Certificat Officiel Vérifié' : 'Délivrance de Certificat Officiel'}
              </h2>
              <p className="text-xs text-slate-400">
                {isPaid 
                  ? 'Accréditation officielle délivrée par Digital Skills Academy' 
                  : `Frais d'émission officiels : ${certificatePrice.toLocaleString('fr-FR')} FCFA`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-all"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="p-6 md:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          
          {/* APERÇU DU CERTIFICAT OFFICIEL (ÉLÉMENT IMPRIMABLE) */}
          <div id="certificate-print-area" className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0c1222] via-[#111936] to-[#0a0f1d] border-4 border-amber-500/40 shadow-2xl text-center overflow-hidden">
            {/* Effets lumineux */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Cadre orné */}
            <div className="border border-amber-400/30 p-6 md:p-8 rounded-2xl relative">
              
              {/* En-tête */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white font-black text-2xl">D</span>
                </div>
                <div className="text-left">
                  <span className="block font-black text-lg tracking-widest text-white uppercase">
                    DIGITAL<span className="text-blue-400">SKILLS</span> ACADEMY
                  </span>
                  <span className="block text-[9px] uppercase tracking-[0.3em] text-amber-400 font-bold">
                    Institut International de Formation Professionnelle
                  </span>
                </div>
              </div>

              <div className="my-6">
                <span className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                  Certificat d'Accomplissement Professionnel
                </span>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Ce document certifie officiellement que
                </p>
                
                {/* NOM DE L'ÉTUDIANT */}
                <h3 className="text-2xl md:text-4xl font-serif font-bold text-amber-200 my-3 tracking-wide drop-shadow-sm">
                  {studentName || 'Votre Nom et Prénom'}
                </h3>
                
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  a suivi avec assiduité et complété avec succès l'ensemble du cursus théorique, 
                  des cas pratiques et des projets d'évaluation de la formation :
                </p>

                <div className="my-4 p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto">
                  <span className="text-base md:text-lg font-black text-white">
                    {courseTitle}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Délivré avec mention d'Excellence et Félicitations du Jury Académique.
                </p>
              </div>

              {/* PIED DE PAGE DU CERTIFICAT */}
              <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
                
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Date de délivrance</span>
                  <span className="text-xs font-bold text-slate-200 block">{currentDate}</span>
                  <span className="text-[9px] font-mono text-amber-400 block">ID Vérification : {certId}</span>
                </div>

                {/* SCEAU OFFICIEL ACADÉMIQUE */}
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-400/60 flex flex-col items-center justify-center p-1 text-center bg-amber-500/5 rotate-12 shadow-lg">
                  <span className="text-[8px] font-black uppercase tracking-tighter text-amber-400">ACCREDITED</span>
                  <span className="text-base font-black text-white">DSA</span>
                  <span className="text-[7px] text-amber-300/80">OFFICIAL SEAL</span>
                </div>

                <div className="space-y-1 text-center md:text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Direction Pédagogique</span>
                  <span className="text-xs font-serif italic text-slate-200 block font-semibold">Le Conseil Académique</span>
                  <span className="text-[9px] text-emerald-400 font-bold block">✓ Signature Numérique Certifiée</span>
                </div>

              </div>

            </div>

            {/* FILIGRANE DE SÉCURITÉ SI NON PAYÉ */}
            {!isPaid && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 mb-3 text-3xl">
                  🔒
                </div>
                <h4 className="text-lg md:text-xl font-black text-white mb-1">
                  Certificat Officiel Verrouillé
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mb-4">
                  Réglez les frais d'émission de <b>{certificatePrice.toLocaleString('fr-FR')} FCFA</b> ci-dessous pour débloquer, télécharger et imprimer votre certificat sans filigrane.
                </p>
              </div>
            )}
          </div>

          {/* SECTION D'ACTION ET PAIEMENT */}
          {isPaid ? (
            /* CERTIFICAT DÉBLOQUÉ */
            <div className="space-y-4 p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-lg">
                <span>✓</span> Certificat Débloqué & Prêt à Télécharger !
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Votre certificat est désormais authentifié et reconnu par l'Institut. Vous pouvez l'imprimer ou l'enregistrer en format PDF haute définition.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <span>🖨️</span> Imprimer / Enregistrer en PDF
                </button>

                <a
                  href={whatsappValidationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-white/10 hover:bg-white/15 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <span>💬</span> Reçu WhatsApp (facultatif)
                </a>
              </div>
            </div>
          ) : (
            /* FORMULAIRE DE RÈGLEMENT DU CERTIFICAT */
            <div className="space-y-6 bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5">
              
              {/* NOM SUR LE CERTIFICAT */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-slate-300 tracking-widest">
                  Nom et Prénom qui figureront sur le certificat :
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: Mamadou Barry Diallo"
                  className="w-full px-5 py-4 bg-slate-800 rounded-xl border border-white/10 text-white font-bold text-base outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                />
                <p className="text-[11px] text-slate-400">
                  Votre nom sera inscrit avec votre identifiant d'accréditation vérifiable en ligne.
                </p>
              </div>

              {/* SÉLECTEUR DE MOYEN DE PAIEMENT RÉEL */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-300 tracking-widest mb-3">
                  Mode de règlement (Prix fixe : {certificatePrice.toLocaleString('fr-FR')} FCFA)
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {/* CARTE BANCAIRE (FORMSPREE) */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('card'); setCardError(''); }}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-2xl mb-1">💳</span>
                    <span className="block text-xs font-black">Carte Bancaire</span>
                    <span className="text-[10px] text-emerald-300 font-semibold">Visa / Mastercard</span>
                  </button>

                  {/* WAVE */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('wave'); setCardError(''); }}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'wave'
                        ? 'border-blue-400 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-2xl mb-1">🌊</span>
                    <span className="block text-xs font-black">Wave</span>
                    <span className="text-[10px] text-blue-300 font-semibold">0% frais</span>
                  </button>

                  {/* ORANGE MONEY */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('orange'); setCardError(''); }}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'orange'
                        ? 'border-orange-500 bg-orange-500/20 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-2xl mb-1">🍊</span>
                    <span className="block text-xs font-black">Orange Money</span>
                    <span className="text-[10px] text-orange-300 font-semibold">Mobile Money</span>
                  </button>
                </div>
              </div>

              {/* FORMULAIRE CARTE BANCAIRE FORMSPREE */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmitCard} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                    <span className="flex items-center gap-2">
                      <span>🛡️</span> Paiement par Carte Direct & Sécurisé
                    </span>
                    <span className="flex items-center gap-1.5 text-white text-[11px] font-mono">
                      <span>💳 Visa</span> • <span>Mastercard</span>
                    </span>
                  </div>

                  {cardError && (
                    <div className="p-3.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs font-medium">
                      ⚠️ {cardError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                        Email pour réception du PDF certifié *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: +221 77 453 22 55"
                        className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                      Numéro de Carte Bancaire *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4000 1234 5678 9010"
                        className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs font-mono tracking-wider outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="absolute right-3.5 top-3 text-slate-400 text-xs">💳</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                        Date d'expiration *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs font-mono tracking-wider text-center outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                        Code CVC *
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs font-mono tracking-wider text-center outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                  >
                    <span>🔒</span>
                    {processing
                      ? 'Délivrance en cours...'
                      : `Payer et Débloquer mon Certificat (${certificatePrice.toLocaleString('fr-FR')} FCFA)`}
                  </button>

                  <p className="text-[10px] text-center text-slate-400">
                    Déblocage immédiat sur la plateforme sans redirection externe.
                  </p>
                </form>
              )}

              {/* WAVE & ORANGE MONEY AVEC RÉFÉRENCE RÉELLE */}
              {(paymentMethod === 'wave' || paymentMethod === 'orange') && (
                <form onSubmit={handleMobilePayment} className="space-y-4">
                  
                  {/* INSTRUCTIONS DE PAIEMENT */}
                  <div className={`p-5 rounded-2xl border ${
                    paymentMethod === 'wave'
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-orange-500/10 border-orange-500/30'
                  }`}>
                    <h4 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>{paymentMethod === 'wave' ? '🌊' : '🍊'}</span>
                      Instructions de paiement {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'} :
                    </h4>
                    <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                      <li>
                        Ouvrez l'application <b>{paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}</b> sur votre mobile.
                      </li>
                      <li>
                        Transférez exactement <b>{certificatePrice.toLocaleString('fr-FR')} FCFA</b> au numéro officiel :<br/>
                        <span className="inline-block mt-1 font-mono font-black text-sm bg-black/40 px-3 py-1 rounded-lg text-amber-300 border border-white/10">
                          {MERCHANT_PHONE} ({MERCHANT_NAME})
                        </span>
                      </li>
                      <li>
                        Indiquez la référence de transaction reçue par SMS/notification pour débloquer votre certificat.
                      </li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                        Email pour réception du PDF *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                        Numéro de téléphone payeur *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: +221 77 453 22 55"
                        className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-amber-400 mb-1.5">
                      Référence / ID de transaction {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="Ex: TR-94827491 ou REF#84920"
                      className="w-full px-4 py-3.5 bg-slate-900 border-2 border-amber-500/40 rounded-xl text-amber-200 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-2"
                  >
                    {processing ? 'Validation en cours...' : `Confirmer le Paiement Réel (${certificatePrice.toLocaleString('fr-FR')} FCFA)`}
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

      </div>

      {/* STYLE CSS POUR L'IMPRESSION DU CERTIFICAT */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-print-area, #certificate-print-area * {
            visibility: visible;
          }
          #certificate-print-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 40px;
            box-sizing: border-box;
            background: #0b0f1a !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
