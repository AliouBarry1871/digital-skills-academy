'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CoursePlayer() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]); 
  const [currentLesson, setCurrentLesson] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError || !courseData) {
        router.push('/');
        return;
      }
      setCourse(courseData);

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      if (lessonsData && lessonsData.length > 0) {
        setLessons(lessonsData);
        setCurrentLesson(lessonsData[0]);
      }
      
      setLoading(false);
    }
    fetchData();
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
      <nav className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors font-medium text-sm">
          ← Retour
        </Link>
        <div className="text-center hidden md:block">
            <h2 className="text-sm font-bold truncate max-w-xs">{course.title}</h2>
        </div>
        <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Mode Étudiant
        </span>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-grow">
            {/* LECTEUR VIDÉO */}
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800">
              {course.price > 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/90 p-8 text-center backdrop-blur-sm">
                  <span className="text-5xl mb-4">🔒</span>
                  <h2 className="text-2xl font-black mb-2">Contenu Premium</h2>
                  <p className="text-slate-400 mb-6 max-w-sm">Payez une seule fois pour débloquer toutes les leçons de ce cours.</p>
                  <a href={course.payment_link} target="_blank" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-4 rounded-xl transition-all">
                    Débloquer pour {course.price} FCFA
                  </a>
                </div>
              ) : (
                currentLesson ? (
                  <iframe 
                    src={currentLesson.video_url}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                    Sélectionnez une leçon pour commencer
                  </div>
                )
              )}
            </div>

            <div className="mt-8">
              <h1 className="text-3xl font-black mb-4">{currentLesson?.title || course.title}</h1>
              <div className="flex gap-3 mb-8">
                <span className="px-3 py-1 bg-slate-800 rounded-lg text-blue-400 text-xs font-bold uppercase">{course.category}</span>
                <span className="px-3 py-1 bg-slate-800 rounded-lg text-amber-400 text-xs font-bold uppercase">Formation 2026</span>
              </div>

              {/* --- SECTION INTERACTIVE : QUIZ ET PDF INTÉGRÉS --- */}
              <div className="space-y-10 mt-12">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <span className="bg-blue-500 p-2 rounded-lg text-white text-lg">🛠️</span> 
                  Ateliers & Ressources
                </h3>

                <div className="grid grid-cols-1 gap-10">
                  {/* LE QUIZ GOOGLE INTÉGRÉ */}
                  <div className="bg-slate-800/40 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-4 bg-slate-800/60 border-b border-slate-700 flex justify-between items-center">
                      <span className="font-bold text-sm flex items-center gap-2">
                        <span className="text-blue-400">●</span> Quiz interactif : Testez vos réflexes
                      </span>
                    </div>
                    <div className="aspect-[16/10] w-full bg-white">
                      <iframe 
                        src="https://phishingquiz.withgoogle.com/" 
                        className="w-full h-full"
                        title="Quiz Phishing"
                      ></iframe>
                    </div>
                  </div>

                  {/* LE GUIDE PDF INTÉGRÉ */}
                  <div className="bg-slate-800/40 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-4 bg-slate-800/60 border-b border-slate-700 flex justify-between items-center">
                      <span className="font-bold text-sm flex items-center gap-2">
                        <span className="text-blue-400">●</span> Guide Officiel (Lecture directe)
                      </span>
                      <a 
                        href="https://www.ssi.gouv.fr/uploads/2017/01/guide_cpme_bonnes_pratiques.pdf" 
                        target="_blank" 
                        className="text-[10px] bg-slate-700 px-3 py-1 rounded-full hover:bg-slate-600 transition-colors"
                      >
                        PLEIN ÉCRAN ↗
                      </a>
                    </div>
                    <div className="h-[600px] w-full bg-slate-900">
                      <iframe 
                        src="https://www.ssi.gouv.fr/uploads/2017/01/guide_cpme_bonnes_pratiques.pdf#toolbar=0" 
                        className="w-full h-full"
                        title="Guide PDF"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SOMMAIRE À DROITE */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-slate-800/40 border border-slate-800 rounded-3xl overflow-hidden sticky top-24">
              <div className="p-6 border-b border-slate-800 bg-slate-800/50">
                <h3 className="font-black text-xl flex items-center gap-2">
                  <span className="text-blue-500">📑</span> Sommaire
                </h3>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">{lessons.length} Leçons disponibles</p>
              </div>

              <div className="max-h-[500px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => course.price === 0 && setCurrentLesson(lesson)}
                    className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all text-left ${
                      currentLesson?.id === lesson.id 
                        ? 'bg-blue-600 shadow-lg shadow-blue-600/20 text-white' 
                        : 'hover:bg-slate-700/50 text-slate-400'
                    } ${course.price > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs ${
                      currentLesson?.id === lesson.id ? 'bg-white/20' : 'bg-slate-900'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold leading-tight">{lesson.title}</span>
                      <span className="text-[10px] mt-1 opacity-60 uppercase font-black">{lesson.duration || 'Vidéo'}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 m-4 rounded-2xl shadow-xl">
                <h4 className="font-bold text-sm mb-2">Prêt pour le certificat ?</h4>
                <p className="text-[11px] text-blue-100 mb-4 leading-relaxed">Terminez toutes les leçons pour obtenir votre diplôme DSA.</p>
                <a href={course.payment_link} target="_blank" className="block text-center bg-white text-blue-700 text-xs font-black py-3 rounded-xl hover:bg-slate-100 transition-colors">
                  DÉBLOQUER LE CERTIFICAT
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="mt-12 p-8 bg-slate-800/20 border border-slate-800 rounded-[2.5rem]">
           <h3 className="text-xl font-bold mb-4 text-slate-200 uppercase tracking-widest text-sm">Description du programme</h3>
           <p className="text-slate-400 leading-relaxed">{course.description}</p>
        </div>
      </main>
    </div>
  );
}