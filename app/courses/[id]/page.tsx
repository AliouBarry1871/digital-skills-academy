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
  const [activeTab, setActiveTab] = useState<'video' | 'quiz' | 'doc'>('video');

  useEffect(() => {
    async function fetchData() {
      const { data: courseData } = await supabase.from('courses').select('*').eq('id', id).single();
      if (!courseData) { router.push('/'); return; }
      setCourse(courseData);

      const { data: lessonsData } = await supabase.from('lessons').select('*').eq('course_id', id).order('order_index', { ascending: true });
      if (lessonsData && lessonsData.length > 0) {
        setLessons(lessonsData);
        setCurrentLesson(lessonsData[0]);
      }
      setLoading(false);
    }
    fetchData();
  }, [id, router]);

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-blue-500 animate-pulse font-bold">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      {/* NAV SIMPLE */}
      <nav className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0b0f1a]/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white text-sm">← Retour</Link>
        <h2 className="text-sm font-bold opacity-80">{course.title}</h2>
        <div className="w-20"></div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* ZONE PRINCIPALE (LECTEUR UNIQUE) */}
          <div className="flex-grow">
            <div className="bg-[#161d2f] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
              
              {/* SÉLECTEUR D'AFFICHAGE (ONGLETS) */}
              <div className="flex border-b border-white/5 bg-black/20">
                <button onClick={() => setActiveTab('video')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'video' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-500'}`}>Cours Vidéo</button>
                <button onClick={() => setActiveTab('quiz')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'quiz' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-500'}`}>Quiz Interactif</button>
                <button onClick={() => setActiveTab('doc')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'doc' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-500'}`}>Support PDF</button>
              </div>

              {/* CONTENU DYNAMIQUE DANS LE MÊME ESPACE */}
              <div className="relative aspect-video w-full bg-black">
                {activeTab === 'video' && currentLesson && (
                  <iframe 
                    src={`${currentLesson.video_url}?rel=0&modestbranding=1&showinfo=0&controls=1&iv_load_policy=3`}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  ></iframe>
                )}

                {activeTab === 'quiz' && (
                  <iframe 
                    src="https://phishingquiz.withgoogle.com/" 
                    className="absolute inset-0 w-full h-full bg-white"
                  ></iframe>
                )}

                {activeTab === 'doc' && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                      <span className="text-6xl mb-4">📄</span>
                      <h3 className="text-xl font-bold mb-2">Guide de Cybersécurité</h3>
                      <p className="text-slate-400 mb-6 text-sm">Le document officiel est prêt pour votre lecture.</p>
                      <a href="https://www.ssi.gouv.fr/uploads/2017/01/guide_cpme_bonnes_pratiques.pdf" target="_blank" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold text-sm transition-all">Télécharger ou Lire le PDF</a>
                   </div>
                )}
              </div>
            </div>

            {/* INFOS COURS SOUS LE LECTEUR */}
            <div className="mt-8 px-2">
              <h1 className="text-2xl font-black">{currentLesson?.title || course.title}</h1>
              <div className="mt-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-slate-400 text-sm leading-relaxed">{course.description}</p>
              </div>
            </div>
          </div>

          {/* PLAYLIST À DROITE */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-[#161d2f] border border-white/5 rounded-[2rem] overflow-hidden sticky top-24">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h3 className="font-bold flex items-center gap-2">📑 Sommaire du cours</h3>
              </div>
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => { setCurrentLesson(lesson); setActiveTab('video'); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${currentLesson?.id === lesson.id ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                  >
                    <span className="text-xs font-bold opacity-50">{index + 1}</span>
                    <span className="text-sm font-bold truncate">{lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}