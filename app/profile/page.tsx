'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  if (loading) return <div className="p-20 text-center font-bold text-blue-600 animate-bounce">Chargement du profil...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* ENTÊTE PROFIL */}
        <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Mon Profil</h1>
              <p className="text-slate-500 font-medium">{user?.email}</p>
              <span className="inline-block mt-2 px-4 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest">
                Compte Actif
              </span>
            </div>
          </div>
        </div>

        {/* PARAMÈTRES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 mb-4 uppercase text-xs tracking-widest text-blue-600">Informations</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">ID Utilisateur</p>
                <p className="text-sm font-mono text-slate-600 truncate">{user?.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Dernière connexion</p>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(user?.last_sign_in_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
            <h3 className="font-black mb-4 uppercase text-xs tracking-widest text-blue-400">Sécurité</h3>
            <p className="text-sm text-slate-400 mb-6">Vous souhaitez modifier vos accès ?</p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-sm font-bold border border-white/10">
              Modifier le mot de passe
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}