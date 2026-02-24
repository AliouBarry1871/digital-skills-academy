'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/'); // Redirige vers l'accueil après connexion
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-100/50">
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter text-center">Bienvenue</h1>
        <p className="text-slate-400 text-center mb-8 font-medium">Connectez-vous pour continuer</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-blue-600 mb-2 ml-1 tracking-widest">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              placeholder="votre@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-blue-600 mb-2 ml-1 tracking-widest">Mot de passe</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-blue-200"
          >
            {loading ? 'Connexion...' : 'SE CONNECTER'}
          </button>
        </form>
      </div>
    </div>
  );
}