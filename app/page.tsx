'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function HomePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous'); // Filtre par catégorie
  const [loading, setLoading] = useState(true);

  // Liste des catégories pour les filtres
  const categories = ['Tous', 'Développement', 'Cyber-sécurité', 'Bureautique', 'Marketing Digital', 'Python'];

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setCourses(data);
      setLoading(false);
    }
    fetchCourses();
  }, []);

  // Logique de filtrage croisée (Recherche + Catégorie)
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse">Chargement de l'académie...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SECTION HERO & RECHERCHE */}
      <section className="bg-white border-b border-slate-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">
            Qu'allez-vous apprendre <span className="text-blue-600">aujourd'hui ?</span>
          </h1>
          
          <div className="relative max-w-2xl mx-auto mt-10 mb-8">
            <input 
              type="text"
              placeholder="Rechercher un sujet..."
              className="w-full px-8 py-5 bg-slate-100 border-none rounded-[2rem] focus:ring-2 focus:ring-blue-600 outline-none text-lg font-medium shadow-inner"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* BOUTONS DE FILTRES RAPIDES */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRILLE DES COURS */}
      <main className="max-w-6xl mx-auto p-8 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* BADGE DE CATÉGORIE COLORÉ */}
                <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 ${
                  course.category === 'Cyber-sécurité' ? 'bg-red-100 text-red-600' :
                  course.category === 'Développement' ? 'bg-blue-100 text-blue-600' :
                  course.category === 'Python' ? 'bg-yellow-100 text-yellow-700' :
                  course.category === 'Marketing Digital' ? 'bg-purple-100 text-purple-600' :
                  course.category === 'Bureautique' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {course.category || 'Général'}
                </span>

                <h2 className="text-2xl font-bold text-slate-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h2>
                <p className="text-slate-500 mb-8 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <Link 
                href={`/courses/${course.id}`}
                className="bg-slate-900 text-white text-center py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg"
              >
                Suivre le cours
              </Link>
            </div>
          ))}
        </div>

        {/* MESSAGE SI VIDE */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🕵️‍♂️</div>
            <p className="text-slate-400 text-xl font-medium">Aucun cours trouvé dans cette catégorie...</p>
          </div>
        )}
      </main>
    </div>
  );
}