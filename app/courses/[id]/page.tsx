'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      if (!id) return;
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setCourse(data);
      setLoading(false);
    }
    loadCourse();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold text-blue-600 italic">Chargement du contenu...</div>;

  if (!course) return (
    <div className="p-20 text-center">
      <h1 className="text-2xl font-bold text-red-500">Oups ! Cours introuvable.</h1>
      <Link href="/" className="text-blue-600 underline mt-4 block">Retour à l'accueil</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="p-6 border-b">
        <Link href="/" className="text-blue-600 font-bold tracking-tight">← CATALOGUE DES COURS</Link>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-12">
        <h1 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tighter">{course.title}</h1>
        
        {/* Lecteur Vidéo Moderne */}
        <div className="aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 border-[12px] border-slate-100">
          {course.video_url ? (
            <iframe 
              className="w-full h-full"
              src={course.video_url}
              allowFullScreen
              title={course.title}
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 italic">Vidéo bientôt disponible</div>
          )}
        </div>

        <div className="max-w-3xl">
          <h3 className="text-blue-600 font-black text-sm uppercase mb-4 tracking-widest">Description du module</h3>
          <p className="text-xl text-slate-600 leading-relaxed">{course.description}</p>
        </div>
      </main>
    </div>
  );
}