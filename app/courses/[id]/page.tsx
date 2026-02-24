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
        router.push('/'); // Redirige si le cours n'existe pas
      } else {
        setCourse(data);
      }
      setLoading(false);
    }
    fetchCourse();
  }, [id, router]);

  if (loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse">Ouverture de la salle de classe...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* BARRE DE NAVIGATION SIMPLE */}
      <nav className="p-6 border-b border-slate-800 flex justify-between items-center">
        <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          ← Retour à l'accueil
        </Link>
        <span className="bg-blue-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          En cours de visionnage
        </span>
      </nav>

      <main className="max-w-6xl mx-auto p-6 lg:p-12">
        {/* LECTEUR VIDÉO */}
        <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl bg-black border border-slate-800">
          {course.price > 0 ? (
            /* SI LE COURS EST PAYANT : On pourrait mettre une logique ici, 
               mais pour l'instant on affiche la vidéo ou un message */
            <iframe 
              src={course.video_url}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          ) : (
            <iframe 
              src={course.video_url}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            ></iframe>
          )}
        </div>

        {/* INFOS DU COURS */}
        <div className="mt-12 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
             <span className="px-4 py-1.5 bg-slate-800 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
               {course.category}
             </span>
             {course.price > 0 && (
               <span className="text-amber-400 font-bold text-sm">Contenu Premium ⭐</span>
             )}
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            {course.title}
          </h1>
          
          <div className="prose prose-invert max-w-none text-slate-400 text-lg leading-relaxed">
            <p>{course.description}</p>
          </div>

          {/* BOUTON D'ACTION SI PAYANT */}
          {course.price > 0 && course.payment_link && (
            <div className="mt-10 p-8 bg-slate-800/50 rounded-[2rem] border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Ce cours vous plaît ?</h3>
              <p className="text-slate-400 mb-6">Soutenez l'académie et débloquez les ressources bonus pour seulement {course.price}€.</p>
              <a 
                href={course.payment_link}
                target="_blank"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-4 rounded-2xl transition-all"
              >
                Acheter la certification
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}