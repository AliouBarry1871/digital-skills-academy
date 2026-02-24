'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const categories = ['Tous', 'Développement', 'Cyber-sécurité', 'Bureautique', 'Marketing Digital', 'Python'];

  useEffect(() => {
    async function fetchData() {
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (coursesData) setCourses(coursesData);
      setUser(user);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Fonction de gestion du clic sur un cours
  const handleCourseClick = (course: any) => {
    if (!user) {
      alert("Veuillez vous connecter pour accéder à nos cours.");
      router.push('/login');
      return;
    }

    if (course.price > 0 && course.payment_link) {
      // Si le cours est payant, on ouvre le lien Stripe dans un nouvel onglet
      window.open(course.payment_link, '_blank');
    } else {
      // Si gratuit, on va vers la salle de classe
      router.push(`/courses/${course.id}`);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = confirm(`Es-tu sûr de vouloir supprimer le cours "${title}" ?`);
    if (confirmDelete) {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) {
        alert("Erreur : " + error.message);
      } else {
        setCourses(courses.filter(course => course.id !== id));
      }
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse">Chargement de l'académie...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-grow">
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

        <main className="max-w-6xl mx-auto p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative">
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      course.category === 'Cyber-sécurité' ? 'bg-red-100 text-red-600' :
                      course.category === 'Développement' ? 'bg-blue-100 text-blue-600' :
                      course.category === 'Python' ? 'bg-yellow-100 text-yellow-700' :
                      course.category === 'Marketing Digital' ? 'bg-purple-100 text-purple-600' :
                      course.category === 'Bureautique' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {course.category || 'Général'}
                    </span>

                    {course.price > 0 ? (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-[10px] font-black border border-amber-200">
                        PREMIUM
                      </span>
                    ) : (
                      <span className="bg-slate-50 text-slate-400 px-3 py-1.5 rounded-full text-[10px] font-bold">
                        OFFERT
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-slate-500 mb-8 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleCourseClick(course)}
                    className={`text-center py-4 rounded-2xl font-bold transition-all shadow-lg ${
                      course.price > 0 
                      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-100' 
                      : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'
                    }`}
                  >
                    {course.price > 0 ? `Acheter - ${course.price}€` : 'Suivre le cours'}
                  </button>

                  {user && (
                    <button 
                      onClick={() => handleDelete(course.id, course.title)}
                      className="text-[10px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest transition-colors py-2"
                    >
                      Supprimer ce cours
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🕵️‍♂️</div>
              <p className="text-slate-400 text-xl font-medium">Aucun cours trouvé...</p>
            </div>
          )}
        </main>
      </div>

      {/* SECTION CONTACT (FOOTER) */}
      <footer className="bg-slate-900 text-white py-16 px-8 mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-black mb-4">Digital Skills Academy</h3>
            <p className="text-slate-400 leading-relaxed">
              La plateforme de référence pour maîtriser les technologies de demain.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm text-blue-400 mb-6">Contact</h4>
            <ul className="space-y-4 text-slate-300">
              <li>📞 WhatsApp : +221 77 453 22 55</li>
              <li>📧 Email : mamadoualioubarry1871@gmail.com</li>
              <li>📍 Dakar, Sénégal</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm text-blue-400 mb-6">Support</h4>
            <p className="text-slate-300 mb-4">Besoin d'aide pour une inscription ?</p>
            <a href="mailto:support@digital-skills.com" className="bg-blue-600 px-6 py-3 rounded-xl font-bold inline-block hover:bg-blue-700 transition-all">
              Nous écrire
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
          © 2026 Digital Skills Academy. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}