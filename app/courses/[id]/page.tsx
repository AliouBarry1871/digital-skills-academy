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
      try {
        // 1. Récupérer les détails du cours
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

        // 2. Récupérer les leçons associées
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', id)
          .order('order_index', { ascending: true });

        if (lessonsData && lessonsData.length > 0) {
          setLessons(lessonsData);
          setCurrentLesson(lessonsData[0]);
        } else {
          // Sécurité : Si aucune leçon n'existe, on crée une leçon virtuelle 
          // basée sur les infos du cours pour que le lecteur ne soit pas vide.
          setCurrentLesson({
            title: "Introduction",
            video_url: courseData.video_url,
            id: 'default'
          });
        }
      } catch (err) {
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-blue-500 font-bold">Chargement de votre session...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      {/* NAV SIMPLE */}
      <nav className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0b0f1a]/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white text-sm flex items-center gap-2">
          <span className="text-lg">←</span> Retour à l'accueil
        </Link>
        <h2 className="text-sm font-bold opacity-80 truncate max-w-[200px] md:max-w-none">
          {course.title}
        </h2>
        <div className="hidden md:block w-20"></div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* ZONE PRINCIPALE (LECTEUR UNIQUE) */}
          <div className="flex-grow">
            <div className="bg-[#161d2f] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
              
              {/* SÉLECTEUR D'AFFICHAGE (ONGLETS) */}
              <div className="flex border-b border-white/5 bg-black/20 overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('video')} 
                  className={`flex-1 md:flex-none px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'video' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-500'}`}
                >
                  Cours Vidéo
                </button>
                <button 
                  onClick={() => setActiveTab('quiz')} 
                  className={`flex-1 md:flex-none px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'quiz' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-500'}`}
                >
                  Quiz Interactif
                </button>
                <button 
                  onClick={() => setActiveTab('doc')} 
                  className={`flex-1 md:flex-none px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'doc' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-500'}`}
                >
                  Support PDF
                </button>
              </div>

              {/* CONTENU DYNAMIQUE */}
              <div className="relative aspect-video w-full bg-black shadow-inner">
                {activeTab === 'video' && currentLesson && (
                  <iframe 
                    src={`${currentLesson.video_url}${currentLesson.video_url.includes('?') ? '&' : '?'}rel=0&modestbranding=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                )}

                {activeTab === 'quiz' && (
                  <iframe 
                    src="https://phishingquiz.withgoogle.com/" 
                    className="absolute inset-0 w-full h-full bg-white"
                    title="Quiz Cybersécurité"
                  ></iframe>
                )}

                {activeTab === 'doc' && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-gradient-to-b from-[#161d2f] to-[#0b0f1a]">
                      <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-4xl mb-6 border border-blue-500/20">📄</div>
                      <h3 className="text-xl font-bold mb-2">Support de cours officiel</h3>
                      <p className="text-slate-400 mb-8 text-sm max-w-md">Consultez les bonnes pratiques de l'ANSSI pour approfondir vos connaissances en cybersécurité.</p>
                      <a 
                        href="https://www.ssi.gouv.fr/uploads/2017/01/guide_cpme_bonnes_pratiques.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                      >
                        Ouvrir le document PDF
                      </a>
                   </div>
                )}
              </div>
            </div>

            {/* INFOS COURS SOUS LE LECTEUR */}
            <div className="mt-8 px-2 mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">
                  En cours de lecture
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-4">
                {currentLesson?.title || course.title}
              </h1>
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">À propos de ce module</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium">
                  {course.description}
                </p>
              </div>
            </div>
          </div>

          {/* PLAYLIST À DROITE */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-[#161d2f] border border-white/5 rounded-[2.5rem] overflow-hidden sticky top-24 shadow-2xl">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-3">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                  Sommaire du cours
                </h3>
              </div>
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {lessons.length > 0 ? lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => { setCurrentLesson(lesson); setActiveTab('video'); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                    className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] transition-all text-left group ${currentLesson?.id === lesson.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-white/5 text-slate-400'}`}
                  >
                    <span className={`text-[10px] font-black h-8 w-8 shrink-0 rounded-full flex items-center justify-center border ${currentLesson?.id === lesson.id ? 'border-white/20 bg-white/10' : 'border-white/5 bg-black/20'}`}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold leading-tight">{lesson.title}</span>
                  </button>
                )) : (
                  <div className="p-8 text-center text-slate-500 text-sm italic">
                    Aucune leçon supplémentaire disponible.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
      
      {/* STYLE POUR LA SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}