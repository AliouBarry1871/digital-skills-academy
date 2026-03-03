'use client';



import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

import { useRouter } from 'next/navigation';



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



  const handleCourseClick = (course: any) => {

    if (!user) {

      alert("Veuillez vous connecter pour accéder à nos cours.");

      router.push('/login');

      return;

    }



    if (course.price > 0 && course.payment_link) {

      window.open(course.payment_link, '_blank');

    } else {

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



  if (loading) return (

    <div className="min-h-screen flex items-center justify-center bg-white">

       <div className="text-center font-bold text-blue-600 animate-pulse text-xl">

          Chargement de l'académie...

       </div>

    </div>

  );



  return (

    <div className="min-h-screen bg-slate-50 flex flex-col">

      <div className="flex-grow">

        {/* HERO SECTION */}

        <section className="bg-white border-b border-slate-100 py-20 px-6">

          <div className="max-w-4xl mx-auto text-center">

            <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">

              Qu'allez-vous apprendre <span className="text-blue-600">aujourd'hui ?</span>

            </h1>

            

            <div className="relative max-w-2xl mx-auto mt-10 mb-8">

              <input 

                type="text"

                placeholder="Rechercher un sujet (Python, Marketing...)"

                className="w-full px-8 py-5 bg-slate-100 border-none rounded-[2rem] focus:ring-2 focus:ring-blue-600 outline-none text-lg font-medium shadow-inner transition-all"

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



        {/* COURSES GRID */}

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

                    className={`text-center py-4 rounded-2xl font-black transition-all shadow-lg ${

                      course.price > 0 

                      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-100' 

                      : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'

                    }`}

                  >

                    {course.price > 0 ? `ACHETER - ${course.price} FCFA` : 'SUIVRE LE COURS'}

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

        </main>

      </div>



      {/* NOUVELLE SECTION CONTACT DESIGN */}

      <footer className="bg-slate-950 text-white pt-24 pb-12 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">

            

            {/* Côté texte et infos */}

            <div>

              <span className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm">Contactez-nous</span>

              <h2 className="text-5xl font-black mt-4 mb-8 leading-tight">

                Une question ? <br />

                <span className="text-slate-400">Parlons de votre projet.</span>

              </h2>

              

              <div className="space-y-8">

                <div className="flex items-center gap-6 group">

                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl group-hover:border-blue-500 transition-colors">

                    📍

                  </div>

                  <div>

                    <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Localisation</p>

                    <p className="text-lg font-bold"></p>

                  </div>

                </div>



                <div className="flex items-center gap-6 group">

                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl group-hover:border-blue-500 transition-colors">

                    📧

                  </div>

                  <div>

                    <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Email Direct</p>

                    <p className="text-lg font-bold">mamadoualioubarry1871@gmail.com</p>

                  </div>

                </div>

              </div>

            </div>



            {/* Côté Formulaire */}

            <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-slate-800 backdrop-blur-sm shadow-2xl">

              <form 

                action="https://formspree.io/f/mdalrrka" 

                method="POST"

                className="space-y-4"

              >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <input 

                    type="text" 

                    name="name" 

                    placeholder="Nom complet" 

                    required

                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600"

                  />

                  <input 

                    type="email" 

                    name="email" 

                    placeholder="Email" 

                    required

                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600"

                  />

                </div>

                <textarea 

                  name="message" 

                  rows={4} 

                  placeholder="Votre message ici..." 

                  required

                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600 resize-none"

                ></textarea>

                

                <button 

                  type="submit"

                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95"

                >

                  ENVOYER LE MESSAGE

                </button>

              </form>

            </div>



          </div>



          <div className="border-t border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">

            <p className="text-slate-600 font-medium">© Digital Skills Academy : L'excellence technologique à votre portée.
Apprenez. Pratiquez. Réussissez. Nous formons la prochaine génération de leaders du numérique avec des contenus de haute qualité et un support dédié à votre réussite.</p>

            <div className="flex gap-8 text-slate-500 text-sm font-bold uppercase tracking-widest">

              <span className="hover:text-blue-500 cursor-pointer transition-colors">Instagram</span>

              <span className="hover:text-blue-500 cursor-pointer transition-colors">LinkedIn</span>

              <span className="hover:text-blue-500 cursor-pointer transition-colors">YouTube</span>

            </div>

          </div>

        </div>

      </footer>

    </div>

  );

}