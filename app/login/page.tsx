'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Nouveau : pour le certificat
  const [isSignUp, setIsSignUp] = useState(false); // Basculer entre login et signup
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // --- LOGIQUE D'INSCRIPTION ---
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName, // Envoie le nom à auth.users
          },
        },
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Inscription réussie ! Vérifiez vos emails ou connectez-vous.");
        setIsSignUp(false);
      }
    } else {
      // --- LOGIQUE DE CONNEXION ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Erreur : " + error.message);
      } else {
        router.push('/');
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-slate-50/50">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-100/50">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
            {isSignUp ? 'Créer un compte' : 'Bienvenue'}
          </h1>
          <p className="text-slate-400 font-medium">
            {isSignUp ? 'Rejoignez l\'académie dès aujourd\'hui' : 'Connectez-vous pour continuer'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-[10px] font-black uppercase text-blue-600 mb-2 ml-1 tracking-[0.2em]">Nom Complet (pour vos certificats)</label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium text-slate-900"
                placeholder="Ex: Jean Dupont"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase text-blue-600 mb-2 ml-1 tracking-[0.2em]">Email</label>
            <input
              type="email"
              required
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium text-slate-900"
              placeholder="votre@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-blue-600 mb-2 ml-1 tracking-[0.2em]">Mot de passe</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium text-slate-900"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-slate-900 hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-blue-200 mt-4 disabled:opacity-50 disabled:translate-y-0"
          >
            {loading ? 'Traitement...' : isSignUp ? 'CRÉER MON COMPTE' : 'SE CONNECTER'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
          >
            {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas encore de compte ? S\'inscrire'}
          </button>
        </div>
      </div>
    </div>
  );
}