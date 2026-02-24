'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Vérifier si un utilisateur est déjà connecté au chargement
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // 2. Écouter en temps réel les changements d'état (connexion/déconnexion)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl">D</span>
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900">
            DIGITAL<span className="text-blue-600">SKILLS</span>
          </span>
        </Link>

        {/* MENU DROITE */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="hidden md:block text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
            Catalogue
          </Link>

          {user ? (
            // AFFICHAGE SI CONNECTÉ
            <div className="flex items-center gap-3 md:gap-5">
              
              {/* LIENS NAVIGATION INTERNE */}
              <div className="flex items-center gap-4 border-r border-slate-200 pr-4">
                <Link 
                  href="/dashboard" 
                  className="text-xs md:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  Mon Espace
                </Link>
                
                <Link 
                  href="/admin/add-course" 
                  className="hidden sm:block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  + Cours
                </Link>
              </div>

              {/* BOUTON PROFIL (ROND) */}
              <Link 
                href="/profile" 
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-blue-50 hover:shadow-inner transition-all border border-slate-200"
                title="Mon Profil"
              >
                <span className="text-lg">👤</span>
              </Link>
              
              {/* INFOS ÉTUDIANT (PC UNIQUEMENT) */}
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Connecté</span>
                <span className="text-xs font-medium text-slate-400 truncate max-w-[120px]">{user.email}</span>
              </div>

              {/* DÉCONNEXION */}
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                Quitter
              </button>
            </div>
          ) : (
            // AFFICHAGE SI DÉCONNECTÉ
            <Link 
              href="/login" 
              className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
            >
              SE CONNECTER
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}