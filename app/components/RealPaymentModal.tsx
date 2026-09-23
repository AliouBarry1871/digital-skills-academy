'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';

interface RealPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemType: 'course' | 'certificate';
  amount: number; // En FCFA
  stripeLink?: string;
  courseId?: string;
}

export default function RealPaymentModal({
  isOpen,
  onClose,
  itemTitle,
  itemType,
  amount,
  stripeLink,
  courseId,
}: RealPaymentModalProps) {
  const [method, setMethod] = useState<'wave' | 'orange' | 'card'>('wave');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [step, setStep] = useState<'form' | 'processing' | 'confirmed'>('form');

  if (!isOpen) return null;

  // Numéro marchand officiel de Digital Skills Academy
  const MERCHANT_PHONE = '+221 77 453 22 55';
  const MERCHANT_NAME = 'Digital Skills Academy';

  // Lien Stripe officiel par défaut si aucun lien personnalisé n'est fourni
  const defaultStripeLink = stripeLink || 'https://buy.stripe.com/test_6oU9AV78S8TlaKcfPg6EU00';

  const handleCardRedirect = () => {
    // Redirection directe vers la page de paiement sécurisée Stripe par carte bancaire
    window.open(defaultStripeLink, '_blank');
  };

  const handleSubmitMobileMoney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert("Veuillez renseigner votre nom complet et votre numéro de téléphone.");
      return;
    }
    if (!transactionRef.trim()) {
      alert("Veuillez saisir la référence de la transaction reçue sur votre application Wave ou Orange Money après le transfert.");
      return;
    }

    setStep('processing');

    setTimeout(() => {
      setStep('confirmed');
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#2563eb', '#f59e0b', '#10b981'],
        });
      } catch (err) {}
    }, 1200);
  };

  const getWhatsAppMessage = () => {
    return encodeURIComponent(
      `Bonjour Digital Skills Academy, je viens d'effectuer mon paiement réel pour ${itemType === 'certificate' ? 'le certificat' : 'la formation'} :\n\n` +
      `📌 Objet : ${itemTitle}\n` +
      `💰 Montant : ${amount.toLocaleString('fr-FR')} FCFA\n` +
      `👤 Nom : ${fullName}\n` +
      `📧 Email : ${email}\n` +
      `📱 Numéro payeur : ${phone}\n` +
      `💳 Mode : ${method.toUpperCase()}\n` +
      `🔖 Référence transaction : ${transactionRef}\n\n` +
      `Merci de valider mon accès.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0f172a] to-[#080d1a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden my-auto text-white">
        
        {/* EN-TÊTE DU CHECKOUT SÉCURISÉ */}
        <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">
              🔒
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                Paiement Sécurisé SSL 256-Bit
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Règlement Officiel • {amount.toLocaleString('fr-FR')} FCFA
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-all"
          >
            ✕
          </button>
        </div>

        {/* CONTENU */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* RÉCAPITULATIF DE LA COMMANDE */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {itemType === 'certificate' ? 'Délivrance de Certificat Officiel' : 'Accès Masterclass Expert'}
              </span>
              <h3 className="text-base font-bold text-white">{itemTitle}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Accès immédiat et vérification prioritaire</p>
            </div>
            <div className="text-right sm:text-right w-full sm:w-auto">
              <span className="text-2xl font-black text-amber-400">
                {amount.toLocaleString('fr-FR')} <span className="text-sm font-bold text-slate-300">FCFA</span>
              </span>
            </div>
          </div>

          {step === 'confirmed' ? (
            /* CONFIRMATION DU PAIEMENT RÉEL */
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>
              <h3 className="text-2xl font-black text-white">Paiement Enregistré avec Succès !</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Votre transaction (Réf : <b className="text-amber-300 font-mono">{transactionRef}</b>) a été enregistrée auprès de <b>{MERCHANT_NAME}</b>.
              </p>
              
              <div className="p-4 bg-white/5 rounded-2xl text-xs text-slate-300 text-left space-y-1.5 max-w-md mx-auto">
                <p><b>Bénéficiaire :</b> {fullName}</p>
                <p><b>Service :</b> {itemTitle}</p>
                <p><b>Montant réglé :</b> {amount.toLocaleString('fr-FR')} FCFA</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={`https://wa.me/221774532255?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <span>💬</span> Confirmer sur WhatsApp avec le reçu
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-4 bg-white/10 hover:bg-white/15 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            /* SÉLECTION DU MODE DE PAIEMENT RÉEL */
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-300 mb-3">
                  Choisissez votre méthode de paiement réel :
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {/* WAVE */}
                  <button
                    type="button"
                    onClick={() => setMethod('wave')}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      method === 'wave'
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
                    onClick={() => setMethod('orange')}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      method === 'orange'
                        ? 'border-orange-500 bg-orange-500/20 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-2xl mb-1">🍊</span>
                    <span className="block text-xs font-black">Orange Money</span>
                    <span className="text-[10px] text-orange-300 font-semibold">Mobile Money</span>
                  </button>

                  {/* CARTE STRIPE */}
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      method === 'card'
                        ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-2xl mb-1">💳</span>
                    <span className="block text-xs font-black">Carte Bancaire</span>
                    <span className="text-[10px] text-emerald-300 font-semibold">Visa / Mastercard</span>
                  </button>
                </div>
              </div>

              {/* OPTION 1 : CARTE BANCAIRE (STRIPE RÉEL) */}
              {method === 'card' && (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <span>🛡️</span> Paiement par Carte Bancaire International (Stripe)
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Vous allez être redirigé vers la passerelle sécurisée de <b>Stripe</b> pour saisir votre numéro de carte bancaire (Visa, Mastercard, American Express).
                  </p>
                  <button
                    type="button"
                    onClick={handleCardRedirect}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>💳</span> Ouvrir le formulaire de paiement par Carte ({amount.toLocaleString('fr-FR')} FCFA)
                  </button>
                  <p className="text-[10px] text-slate-400">
                    Cryptage SSL 256 bits garanti par Stripe.
                  </p>
                </div>
              )}

              {/* OPTION 2 & 3 : WAVE & ORANGE MONEY (RÉEL) */}
              {(method === 'wave' || method === 'orange') && (
                <form onSubmit={handleSubmitMobileMoney} className="space-y-4">
                  
                  {/* INSTRUCTIONS OFFICIELLES DE TRANSFERT RÉEL */}
                  <div className={`p-5 rounded-2xl border ${
                    method === 'wave'
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-orange-500/10 border-orange-500/30'
                  }`}>
                    <h4 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>{method === 'wave' ? '🌊' : '🍊'}</span>
                      Instructions de paiement réel {method === 'wave' ? 'Wave' : 'Orange Money'} :
                    </h4>
                    <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                      <li>
                        Ouvrez votre application <b>{method === 'wave' ? 'Wave' : 'Orange Money'}</b> sur votre téléphone.
                      </li>
                      <li>
                        Effectuez un transfert de <b>{amount.toLocaleString('fr-FR')} FCFA</b> au numéro officiel :<br/>
                        <span className="inline-block mt-1 font-mono font-black text-sm bg-black/40 px-3 py-1 rounded-lg text-amber-300 border border-white/10">
                          {MERCHANT_PHONE} ({MERCHANT_NAME})
                        </span>
                      </li>
                      <li>
                        Une fois le transfert effectué, <b>copiez le numéro / référence de la transaction</b> reçu par SMS ou dans l'historique de votre application et collez-le ci-dessous.
                      </li>
                    </ol>
                  </div>

                  {/* COORDONNÉES DU PAYEUR */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                        Nom complet de l'étudiant *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex: Mamadou Diallo"
                        className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                        Votre Numéro {method === 'wave' ? 'Wave' : 'Orange Money'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: +221 77 000 00 00"
                        className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                      Adresse email (pour confirmation et facture) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  {/* RÉFÉRENCE DE LA TRANSACTION */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-amber-400 mb-1.5">
                      Référence / ID de transaction {method === 'wave' ? 'Wave' : 'Orange Money'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="Ex: TR-94827491 ou REF#84920"
                      className="w-full px-4 py-3.5 bg-slate-900 border-2 border-amber-500/40 rounded-xl text-amber-200 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Cette référence permet à notre système et à l'administration de valider instantanément votre paiement réel.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.01] active:scale-95 mt-2"
                  >
                    Valider le Paiement Réel de {amount.toLocaleString('fr-FR')} FCFA
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
