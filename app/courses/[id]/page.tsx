'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CoursePlayer() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        router.push('/'); // Redirige vers l'accueil si le cours n'existe pas
      } else {
        setCourse(data);
      }
      setLoading(false);
    }
    fetchCourse();
  }, [id, router]);

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center font-bold text-blue-500 animate-pulse text-xl">
        Ouverture de la salle de classe...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* BARRE DE NAVIGATION */}
      <nav className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors font-medium">
          ← Retour à l'accueil
        </Link>
        <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          Mode Étudiant
        </span>
      </nav>

      <main className="max-w-6xl mx-auto p-6 lg:p-12">
        
        {/* LECTEUR VIDÉO OU MESSAGE DE VERROUILLAGE */}
        <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border border-slate-800">
          {course.price > 0 ? (
            /* --- CAS DU COURS PAYANT --- */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/90 p-8 text-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
                <span className="text-4xl">🔒</span>
              </div>
              <h2 className="text-3xl font-black mb-4">Contenu Premium</h2>
              <p className="text-slate-400 mb-8 max-w-md text-lg">
                Ce cours est réservé aux membres ayant validé leur inscription. 
                Payez une seule fois pour débloquer l'accès à vie.
              </p>
              <a 
                href={course.payment_link}
                target="_blank"
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-10 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-xl shadow-amber-500/20"
              >
                Débloquer le cours ({course.price} FCFA)
              </a>
              <p className="mt-6 text-sm text-slate-500 italic">
                Une fois le paiement effectué, votre accès sera activé manuellement sous 24h.
              </p>
            </div>
          ) : (
            /* --- CAS DU COURS GRATUIT --- */
            <iframe 
              src={course.video_url}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          )}
        </div>

        {/* INFOS DU COURS */}
        <div className="mt-12 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
             <span className="px-4 py-1.5 bg-slate-800 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest border border-slate-700">
               {course.category}
             </span>
             {course.price > 0 && (
               <span className="text-amber-400 font-bold text-sm flex items-center gap-2">
                 <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
                 Formation Certifiante ⭐
               </span>
             )}
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
            {course.title}
          </h1>
          
          <div className="bg-slate-800/30 border border-slate-800 p-8 rounded-[2rem]">
            <h3 className="text-xl font-bold mb-4 text-slate-200">À propos de ce cours</h3>
            <div className="prose prose-invert max-w-none text-slate-400 text-lg leading-relaxed">
              <p>{course.description}</p>
            </div>
          </div>

          {/* RAPPEL PAIEMENT EN BAS SI PAYANT */}
          {course.price > 0 && (
            <div className="mt-12 p-8 border-2 border-dashed border-slate-700 rounded-[2rem] text-center">
              <p className="text-slate-400 font-medium">
                Des difficultés avec le paiement ? Contactez le support via le bouton WhatsApp en bas de page.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}