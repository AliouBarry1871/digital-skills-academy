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
    <div className="min-h-screen bg-slate-900 text-white pb-20">
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
            course.video_url ? (
              <iframe 
                src={course.video_url}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-500">
                Vidéo en cours de chargement...
              </div>
            )
          )}
        </div>

        {/* INFOS DU COURS */}
        <div className="mt-12 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
             <span className="px-4 py-1.5 bg-slate-800 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest border border-slate-700">
               {course.category}
             </span>
             <span className="text-amber-400 font-bold text-sm flex items-center gap-2">
               <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
               Parcours certifiant ⭐
             </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
            {course.title}
          </h1>
          
          <div className="bg-slate-800/30 border border-slate-800 p-8 rounded-[2rem] mb-12">
            <h3 className="text-xl font-bold mb-4 text-slate-200">À propos de ce cours</h3>
            <div className="prose prose-invert max-w-none text-slate-400 text-lg leading-relaxed">
              <p>{course.description}</p>
            </div>
          </div>

          {/* --- NOUVELLE SECTION CERTIFICATION --- */}
          <div className="relative p-10 bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
            {/* Décoration d'arrière-plan */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-white/20">
                🎓
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                  Obtenez votre Certificat Officiel
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed max-w-xl">
                  Valorisez vos nouvelles compétences ! Une fois cette formation terminée, vous pouvez commander votre certificat signé par **Digital Skills Academy** pour l'ajouter à votre CV ou LinkedIn.
                </p>
              </div>

              <div className="flex-shrink-0">
                <a 
                  href={course.payment_link} // Utilise le lien de paiement pour le certificat
                  target="_blank"
                  className="inline-block bg-white text-blue-800 hover:bg-slate-100 font-black px-8 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-xl hover:shadow-white/10 active:scale-95"
                >
                  Commander (Certificat)
                </a>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-blue-200 uppercase tracking-widest">
              <span className="flex items-center gap-2">✅ Format PDF HD</span>
              <span className="flex items-center gap-2">✅ ID de vérification</span>
              <span className="flex items-center gap-2">✅ Signé numériquement</span>
            </div>
          </div>

          {/* RAPPEL SUPPORT */}
          <div className="mt-12 p-8 border-2 border-dashed border-slate-700 rounded-[2rem] text-center">
            <p className="text-slate-500 font-medium">
              Une question sur la certification ? Notre équipe vous répond sur WhatsApp.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}