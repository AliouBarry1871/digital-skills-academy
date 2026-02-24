'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // Redirige si non connecté
      } else {
        setUser(user);
      }
      setLoading(false);
    }
    checkUser();
  }, [router]);

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-blue-600">Chargement de votre espace...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* En-tête de bienvenue */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">
            Bonjour, <span className="text-blue-600">{user?.email?.split('@')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 font-medium">Ravi de vous revoir sur votre académie.</p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200">
            <p className="text-blue-100 font-bold uppercase text-xs tracking-widest mb-2">Cours suivis</p>
            <h3 className="text-4xl font-black">12</h3>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-200">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Certificats</p>
            <h3 className="text-4xl font-black">2</h3>
          </div>
        </div>

        {/* Action rapide */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Continuer l'apprentissage</h2>
          <Link href="/" className="text-blue-600 font-bold hover:underline">Voir tout le catalogue</Link>
        </div>
      </div>
    </div>
  );
}