'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DEFAULT_COURSES, Course } from '@/lib/courses-data';
import RealPaymentModal from '@/app/components/RealPaymentModal';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [courseFilter, setCourseFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // État de la modale de paiement réel
  const [paymentModalData, setPaymentModalData] = useState<{
    isOpen: boolean;
    itemTitle: string;
    itemType: 'course' | 'certificate';
    amount: number;
    stripeLink?: string;
    courseId?: string;
  }>({
    isOpen: false,
    itemTitle: '',
    itemType: 'course',
    amount: 35000,
  });

  const categories = ['Tous', 'Cyber-sécurité', 'Python', 'Développement', 'Bureautique', 'Marketing Digital'];

  useEffect(() => {
    async function fetchData() {
      let loadedCourses: Course[] = DEFAULT_COURSES;
      try {
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (coursesData && coursesData.length > 0) {
          const existingIds = new Set(coursesData.map((c: any) => c.id));
          const combined = [
            ...coursesData,
            ...DEFAULT_COURSES.filter(c => !existingIds.has(c.id)),
          ];
          loadedCourses = combined;
        }
      } catch (err) {
        console.warn("Supabase fetch failed, using default courses", err);
      }

      const { data: { user } } = await supabase.auth.getUser();

      setCourses(loadedCourses);
      setUser(user);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleCourseClick = (course: any) => {
    if (course.price > 0) {
      // Ouvre la modale de paiement réel (Stripe, Wave, Orange Money)
      setPaymentModalData({
        isOpen: true,
        itemTitle: course.title,
        itemType: 'course',
        amount: course.price,
        stripeLink: course.payment_link,
        courseId: course.id,
      });
    } else {
      router.push(`/courses/${course.id}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Tous' || course.category === selectedCategory;

    const matchesType =
      courseFilter === 'all'
        ? true
        : courseFilter === 'free'
        ? course.price === 0
        : course.price > 0;

    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-400 font-bold tracking-wider uppercase text-xs">
            Chargement de l'académie...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">

      {/* ========================================================================= */}
      {/* 1. NAVBAR PROFESSIONNELLE D'ÉLITE                                          */}
      {/* ========================================================================= */}
      <nav className="bg-[#0b1122]/90 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
              <span className="text-white font-black text-xl">D</span>
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white uppercase block leading-none">
                DIGITAL<span className="text-blue-400">SKILLS</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold block mt-0.5">
                Academy
              </span>
            </div>
          </Link>

          {/* NAVIGATION */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#formations" className="hover:text-blue-400 transition-colors">
              Formations
            </a>
            <a href="#masterclasses" className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5">
              <span>👑</span> Masterclasses
            </a>
            <a href="#a-propos" className="hover:text-blue-400 transition-colors">
              À Propos
            </a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
          </div>

          {/* BOUTONS CONNEXION / PROFIL */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-all"
                >
                  Mon Espace
                </Link>
                <Link
                  href="/profile"
                  className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-sm"
                  title="Profil"
                >
                  👤
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20 transition-all"
                >
                  Quitter
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
              >
                Se Connecter
              </Link>
            )}
          </div>

        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION AVEC EMBLÈME D'APPRENTISSAGE (LIVRE LUMINEUX 3D & SAVOIR) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-16 pb-24 px-6 border-b border-white/5 bg-gradient-to-b from-[#0c142b] via-[#070b15] to-[#070b15]">
        
        {/* HALOS LUMINEUX D'ARRIÈRE-PLAN */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* CÔTÉ TEXTE & PROPOSITION DE VALEUR */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              L'Académie de Référence des Métiers d'Avenir
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Développez des compétences numériques <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                qui transforment votre avenir.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Formez-vous avec des cours <b>100% en français</b>, des vidéos pratiques, 
              des supports PDF téléchargeables numérotés et obtenez des <b>certificats officiels reconnus</b> à 10 000 FCFA ou rejoignez nos Masterclasses d'Élite.
            </p>

            {/* BOUTONS D'APPEL À L'ACTION */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#formations"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>📚</span> Découvrir les Formations
              </a>

              <a
                href="#masterclasses"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>👑</span> Masterclasses Avancées
              </a>
            </div>

            {/* GARANTIES RAPIDES */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="block text-2xl font-black text-white">5 000+</span>
                <span className="text-[11px] text-slate-400 font-medium">Apprenants formés</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-amber-400">10 000 F</span>
                <span className="text-[11px] text-slate-400 font-medium">Certificat officiel</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-400">100%</span>
                <span className="text-[11px] text-slate-400 font-medium">Pratique & en Français</span>
              </div>
            </div>

          </div>

          {/* CÔTÉ VISUEL ARTISTIQUE : LE LIVRE LUMINEUX DU SAVOIR & TECHNOLOGIE */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            
            <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
              
              {/* CERCLE D'ORBITE LUMINEUX */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin" style={{ animationDuration: '40s' }}></div>
              <div className="absolute inset-8 rounded-full border border-dashed border-amber-500/20 animate-spin" style={{ animationDuration: '60s', animationDirection: 'reverse' }}></div>

              {/* CARTE CENTRALE STYLISÉE : LIVRE 3D LUMINEUX */}
              <div className="relative z-10 w-[360px] sm:w-[400px] p-8 rounded-[3rem] bg-gradient-to-br from-[#111936] via-[#0d1428] to-[#070b15] border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 text-center overflow-hidden">
                
                {/* Lueur intérieure */}
                <div className="absolute -top-20 -left-20 w-44 h-44 bg-blue-500/30 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

                {/* VISUEL SVG DU LIVRE DU SAVOIR ET DE LA RÉUSSITE */}
                <div className="relative mx-auto mb-6 w-36 h-36 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_25px_rgba(37,99,235,0.4)]">
                    <defs>
                      <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1D4ED8" />
                      </linearGradient>
                      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FDE68A" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#B45309" />
                      </linearGradient>
                    </defs>

                    {/* Faisceau lumineux ascendant */}
                    <polygon points="100,20 160,160 40,160" fill="url(#bookGrad)" opacity="0.15" />

                    {/* Couverture du livre */}
                    <path d="M 25 155 Q 100 170 175 155 L 175 145 Q 100 160 25 145 Z" fill="#0f172a" />
                    
                    {/* Pages du livre ouvertes */}
                    <path d="M 25 145 Q 100 160 100 80 Q 100 160 175 145 L 175 75 Q 100 90 100 25 Q 100 90 25 75 Z" fill="#ffffff" opacity="0.95" />
                    
                    {/* Lignes de texte et code dans le livre */}
                    <path d="M 40 85 Q 90 95 90 60" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M 40 105 Q 90 115 90 80" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M 40 125 Q 90 135 90 100" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M 160 85 Q 110 95 110 60" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M 160 105 Q 110 115 110 80" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M 160 125 Q 110 135 110 100" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />

                    {/* Tranche centrale du livre */}
                    <line x1="100" y1="25" x2="100" y2="160" stroke="#1D4ED8" strokeWidth="4" />

                    {/* Étoile de certification au sommet */}
                    <polygon points="100,10 104,22 116,22 106,30 110,42 100,34 90,42 94,30 84,22 96,22" fill="url(#goldGrad)" />
                  </svg>
                </div>

                <h3 className="text-xl font-black text-white mb-2">
                  L'Art d'Apprendre & de Réussir
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Des parcours interactifs conçus pour transformer votre savoir en opportunités concrètes.
                </p>

                {/* BADGES FLOTTANTS */}
                <div className="flex flex-wrap justify-center gap-2 pt-2 border-t border-white/10">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                    📖 Supports PDF
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    🎓 Certificat 10 000 F
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    🎥 Vidéos HD
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. RECHERCHE & FILTRAGE DU CATALOGUE                                       */}
      {/* ========================================================================= */}
      <section id="formations" className="py-12 px-6 max-w-7xl mx-auto w-full">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 block mb-1">
              Catalogue Pédagogique 2026
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Toutes nos formations professionnelles
            </h2>
          </div>

          {/* BARRE DE RECHERCHE */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Rechercher (Python, Sécurité...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-white text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* ONGLETS DE FILTRAGE (TYPE & CATÉGORIES) */}
        <div className="flex flex-col gap-4 mb-10">
          
          {/* FILTRE PAR TYPE (TOUS / GRATUITS / MASTERCLASSES) */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setCourseFilter('all')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                courseFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Tous les Cursus ({courses.length})
            </button>
            <button
              onClick={() => setCourseFilter('free')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                courseFilter === 'free'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Formations Offertes (Certificat 10 000 FCFA)
            </button>
            <button
              onClick={() => setCourseFilter('premium')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                courseFilter === 'premium'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                  : 'bg-white/5 text-amber-300 hover:bg-white/10'
              }`}
            >
              <span>👑</span> Masterclasses Payantes
            </button>
          </div>

          {/* FILTRE PAR CATÉGORIE THÉMATIQUE */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. GRILLE DES CARTES DE COURS                                              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const isPremium = course.price > 0;

            return (
              <div
                key={course.id}
                className={`group rounded-[2.5rem] p-8 border transition-all duration-300 flex flex-col justify-between relative shadow-xl hover:-translate-y-2 ${
                  isPremium
                    ? 'bg-gradient-to-b from-[#141a33] to-[#0c1022] border-amber-500/30 hover:border-amber-400 shadow-amber-500/10'
                    : 'bg-[#0f172a]/80 border-white/10 hover:border-blue-500/50 shadow-black/40'
                }`}
              >
                <div>
                  
                  {/* BADGES EN-TÊTE */}
                  <div className="flex justify-between items-start mb-5">
                    <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {course.category}
                    </span>

                    {isPremium ? (
                      <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wider shadow-sm flex items-center gap-1">
                        <span>👑</span> MASTERCLASS
                      </span>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-500/20">
                        OFFERTE
                      </span>
                    )}
                  </div>

                  {/* TITRE DU COURS */}
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-slate-400 mb-5 line-clamp-3 leading-relaxed text-xs">
                    {course.description}
                  </p>

                  {/* AVANTAGES EXCLUSIFS MASTERCLASS PAYANTE */}
                  {course.premium_features && course.premium_features.length > 0 && (
                    <div className="mb-5 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                      <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                        Avantages exclusifs inclus :
                      </span>
                      {course.premium_features.slice(0, 3).map((feat: string, i: number) => (
                        <div key={i} className="text-[11px] text-slate-300 flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* BADGES DÉTAILS */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {isPremium ? (
                      <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-xl flex items-center gap-1.5">
                        <span>💎</span> Accès Illimité & Certification
                      </span>
                    ) : (
                      <span className="text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/25 px-3 py-1 rounded-xl flex items-center gap-1.5">
                        <span>🎓</span> Certificat officiel : 10 000 FCFA
                      </span>
                    )}
                    <span className="text-[10px] font-bold bg-white/5 text-slate-400 px-2.5 py-1 rounded-xl border border-white/5">
                      📥 Supports PDF Inclus
                    </span>
                    <span className="text-[10px] font-bold bg-blue-500/10 text-blue-300 px-2.5 py-1 rounded-xl border border-blue-500/20">
                      🎥 100% en Français
                    </span>
                  </div>

                </div>

                {/* BOUTON D'ACTION PRINCIPAL */}
                <div>
                  <button
                    onClick={() => handleCourseClick(course)}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                      isPremium
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-amber-500/25 hover:scale-[1.02]'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 hover:scale-[1.02]'
                    }`}
                  >
                    {isPremium
                      ? `Rejoindre la Masterclass - ${course.price.toLocaleString('fr-FR')} FCFA`
                      : 'Commencer la Formation'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION À PROPOS DE DIGITAL SKILLS ACADEMY                             */}
      {/* ========================================================================= */}
      <section id="a-propos" className="py-20 px-6 border-t border-white/5 bg-[#0a0f1d] relative">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 block">
              Notre Mission Pédagogique
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              À propos de <span className="text-blue-400">Digital Skills Academy</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Fondée avec la conviction que les compétences technologiques sont le moteur du développement personnel et économique, 
              <b> Digital Skills Academy</b> est un institut d'apprentissage en ligne de nouvelle génération conçu pour l'Afrique et la francophonie.
            </p>
          </div>

          {/* LES 4 PILIERS D'EXCELLENCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl font-black">
                🗣️
              </div>
              <h4 className="text-base font-bold text-white">100% en Français</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Des explications limpides sans jargon inutile pour permettre à chacun d'assimiler rapidement les concepts complexes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-black">
                📥
              </div>
              <h4 className="text-base font-bold text-white">Supports PDF Numérotés</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chaque module dispose de ses guides, fiches mémo et manuels pratiques téléchargeables pour réviser même sans connexion.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl font-black">
                🎓
              </div>
              <h4 className="text-base font-bold text-white">Certificats Officiels</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Des attestations d'accomplissement authentiques et vérifiables en ligne avec sceau officiel et identifiant unique.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl font-black">
                💳
              </div>
              <h4 className="text-base font-bold text-white">Paiements Réels Locaux</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Réglez facilement en toute sécurité avec Wave, Orange Money ou par Carte Bancaire internationale via Stripe.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PIED DE PAGE (FOOTER) COMPLET AVEC EMAIL ET COORDONNÉES OFFICIELLES     */}
      {/* ========================================================================= */}
      <footer id="contact" className="bg-[#050811] text-white pt-20 pb-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* INFORMATIONS PRINCIPALES DIGITAL SKILLS ACADEMY */}
            <div className="lg:col-span-5 space-y-6">
              
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-lg">D</span>
                </div>
                <span className="font-black text-xl tracking-tight text-white uppercase">
                  DIGITAL<span className="text-blue-400">SKILLS</span> ACADEMY
                </span>
              </Link>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
                L'institut d'excellence pour l'apprentissage des métiers numériques. Formez-vous aux standards internationaux, 
                validez vos acquis et boostez votre carrière avec nos attestations officielles certifiées.
              </p>

              {/* COORDONNÉES DE CONTACT OFFICIELLES */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                    📧
                  </span>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Email Direct</span>
                    <a href="mailto:mamadoualioubarry1871@gmail.com" className="font-bold text-blue-400 hover:underline">
                      mamadoualioubarry1871@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                    📱
                  </span>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Téléphone & WhatsApp</span>
                    <a href="https://wa.me/221774532255" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-400 hover:underline">
                      +221 77 453 22 55
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                    📍
                  </span>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Localisation</span>
                    <span className="font-medium text-slate-300">Dakar, Sénégal • Accessible partout en ligne</span>
                  </div>
                </div>
              </div>

            </div>

            {/* FORMULAIRE DE CONTACT DIRECT (FORMSPREE) */}
            <div className="lg:col-span-7 bg-[#0b1224] p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 block mb-1">
                Une Question ou un Projet ?
              </span>
              <h3 className="text-2xl font-black text-white mb-6">
                Écrivez-nous directement
              </h3>

              <form
                action="https://formspree.io/f/mdalrrka"
                method="POST"
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Votre nom complet"
                    required
                    className="w-full px-5 py-3.5 bg-slate-900/80 border border-white/10 rounded-2xl text-white text-xs outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Votre adresse email"
                    required
                    className="w-full px-5 py-3.5 bg-slate-900/80 border border-white/10 rounded-2xl text-white text-xs outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                  />
                </div>

                <textarea
                  name="message"
                  rows={3}
                  placeholder="Comment pouvons-nous vous aider ?"
                  required
                  className="w-full px-5 py-3.5 bg-slate-900/80 border border-white/10 rounded-2xl text-white text-xs outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                ></textarea>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all"
                >
                  Envoyer mon Message
                </button>
              </form>
            </div>

          </div>

          {/* BADGES DE MOYENS DE PAIEMENT RÉEL & SÉCURITÉ */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Moyens de paiement acceptés :
              </span>
              <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                🌊 Wave
              </span>
              <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                🍊 Orange Money
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-bold">
                💳 Visa & Mastercard (Stripe)
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} Digital Skills Academy. Tous droits réservés.
            </p>
          </div>

        </div>
      </footer>

      {/* MODALE DE PAIEMENT RÉEL POUR MASTERCLASSES ET COURS */}
      <RealPaymentModal
        isOpen={paymentModalData.isOpen}
        onClose={() => setPaymentModalData({ ...paymentModalData, isOpen: false })}
        itemTitle={paymentModalData.itemTitle}
        itemType={paymentModalData.itemType}
        amount={paymentModalData.amount}
        stripeLink={paymentModalData.stripeLink}
        courseId={paymentModalData.courseId}
      />

    </div>
  );
}