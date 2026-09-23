'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Course, Lesson, CoursePdf, DEFAULT_COURSES, syncCourseWithSupabase } from '@/lib/courses-data';
import CertificateModal from '@/app/components/CertificateModal';
import PdfPreviewModal from '@/app/components/PdfPreviewModal';

// Temps d'assiduité requis par module avant déblocage du bouton de validation (en secondes)
const REQUIRED_WATCH_SECONDS = 20;

export default function CoursePlayer() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Chronomètre de visionnage du module en cours
  const [secondsWatched, setSecondsWatched] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Modales
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<CoursePdf | null>(null);

  // Vue mobile
  const [mobileTab, setMobileTab] = useState<'video' | 'sommaire' | 'pdfs'>('video');

  // Nom de l'étudiant connecté
  const [studentName, setStudentName] = useState('Mamadou Barry Diallo');

  useEffect(() => {
    async function fetchData() {
      try {
        let loadedCourse: Course | null = null;

        // 1. Tenter de charger depuis Supabase
        try {
          const { data: courseData } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

          if (courseData) {
            const { data: lessonsData } = await supabase
              .from('lessons')
              .select('*')
              .eq('course_id', id)
              .order('order_index', { ascending: true });

            loadedCourse = syncCourseWithSupabase(courseData, lessonsData || []);
          }
        } catch (e) {
          console.warn("Supabase non accessible, utilisation du catalogue local", e);
        }

        // 2. Si pas trouvé dans Supabase, chercher dans le catalogue de cours prédéfinis
        if (!loadedCourse) {
          const matched = DEFAULT_COURSES.find(c => c.id === id);
          if (matched) {
            loadedCourse = matched;
          } else {
            loadedCourse = DEFAULT_COURSES[0];
          }
        }

        setCourse(loadedCourse);
        if (loadedCourse.lessons.length > 0) {
          setCurrentLesson(loadedCourse.lessons[0]);
        }

        // Charger l'utilisateur connecté pour pré-remplir son nom
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
          if (name) setStudentName(name);
        }

        // Charger la progression depuis localStorage
        if (typeof window !== 'undefined' && loadedCourse) {
          const savedProgress = localStorage.getItem(`dsa_progress_${loadedCourse.id}`);
          if (savedProgress) {
            try {
              setCompletedLessonIds(JSON.parse(savedProgress));
            } catch (err) {
              console.error(err);
            }
          }
        }

      } catch (err) {
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  // Réinitialiser et lancer le chronomètre dès que la leçon change
  useEffect(() => {
    setSecondsWatched(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setSecondsWatched((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentLesson?.id]);

  // Sauvegarder la progression
  const toggleLessonCompletion = (lessonId: string) => {
    if (!course) return;
    setCompletedLessonIds((prev) => {
      const updated = prev.includes(lessonId)
        ? prev.filter((i) => i !== lessonId)
        : [...prev, lessonId];
      if (typeof window !== 'undefined') {
        localStorage.setItem(`dsa_progress_${course.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markCurrentLessonCompleteAndNext = () => {
    if (!course || !currentLesson) return;
    if (!completedLessonIds.includes(currentLesson.id)) {
      toggleLessonCompletion(currentLesson.id);
    }
    // Passer à la leçon suivante si disponible
    const currentIndex = course.lessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex < course.lessons.length - 1) {
      setCurrentLesson(course.lessons[currentIndex + 1]);
    }
  };

  const goToPreviousLesson = () => {
    if (!course || !currentLesson) return;
    const currentIndex = course.lessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex > 0) {
      setCurrentLesson(course.lessons[currentIndex - 1]);
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-400 font-bold tracking-wider uppercase text-xs">
            Chargement de votre session d'apprentissage...
          </p>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(
    (completedLessonIds.length / (course.lessons.length || 1)) * 100
  );
  const isCourseFullyCompleted = progressPercent === 100;
  const currentLessonIndex = course.lessons.findIndex((l) => l.id === currentLesson?.id);
  const isCurrentLessonCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;

  // Calcul du temps restant pour valider le visionnage de la vidéo
  const remainingSeconds = Math.max(0, REQUIRED_WATCH_SECONDS - secondsWatched);
  const canMarkAsCompleted = isCurrentLessonCompleted || remainingSeconds === 0;

  return (
    <div className="min-h-screen bg-[#080d1a] text-white flex flex-col font-sans">
      
      {/* 1. BARRE DE NAVIGATION SUPÉRIEURE */}
      <nav className="border-b border-white/5 bg-[#0b1122]/90 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl transition-all"
          >
            <span>←</span> Catalogue
          </Link>
          <div className="hidden sm:block h-4 w-px bg-white/10"></div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block">
              {course.category} {course.is_premium && '• 👑 MASTERCLASS'}
            </span>
            <h1 className="text-sm font-bold text-slate-200 truncate max-w-[240px] md:max-w-md">
              {course.title}
            </h1>
          </div>
        </div>

        {/* STATUT CERTIFICAT EN HAUT À DROITE */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isCourseFullyCompleted) {
                setIsCertModalOpen(true);
              } else {
                alert(`Pour débloquer votre certificat officiel, vous devez terminer et valider tous les modules (${completedLessonIds.length}/${course.lessons.length} validés).`);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
              isCourseFullyCompleted
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 animate-pulse cursor-pointer'
                : 'bg-white/10 text-slate-400 hover:bg-white/15'
            }`}
          >
            <span>{isCourseFullyCompleted ? '🎓' : '🔒'}</span>
            <span className="hidden sm:inline">
              {isCourseFullyCompleted ? 'Certificat disponible :' : 'Certificat :'}
            </span>{' '}
            10 000 FCFA
          </button>
        </div>
      </nav>

      {/* SÉLECTEUR POUR MOBILE (ONGLETS) */}
      <div className="lg:hidden flex border-b border-white/10 bg-[#0c1326] sticky top-[57px] z-30">
        <button
          onClick={() => setMobileTab('sommaire')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
            mobileTab === 'sommaire' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400'
          }`}
        >
          Sommaire ({course.lessons.length})
        </button>
        <button
          onClick={() => setMobileTab('video')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
            mobileTab === 'video' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400'
          }`}
        >
          Vidéo
        </button>
        <button
          onClick={() => setMobileTab('pdfs')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
            mobileTab === 'pdfs' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400'
          }`}
        >
          PDFs ({course.pdfs.length})
        </button>
      </div>

      {/* 2. ZONE PRINCIPALE EN 3 COLONNES SUR PC */}
      <div className="flex-1 max-w-[1920px] mx-auto w-full p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ========================================================================= */}
        {/* COLONNE GAUCHE (FENÊTRE DES COURS / LEÇONS AJOUTÉES)                       */}
        {/* ========================================================================= */}
        <aside
          className={`lg:col-span-3 flex flex-col ${
            mobileTab === 'sommaire' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="bg-[#10172c] border border-white/10 rounded-[2rem] p-5 shadow-2xl flex flex-col h-full sticky top-24">
            
            {/* Titre & Progression */}
            <div className="pb-5 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Modules du cours (FR)
                </span>
                <span className="text-xs font-black text-slate-300">
                  {completedLessonIds.length}/{course.lessons.length} validés
                </span>
              </div>

              {/* Barre de progression */}
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-bold">
                <span>Progression du cours</span>
                <span className={isCourseFullyCompleted ? 'text-emerald-400 font-black' : 'text-slate-300'}>
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Liste numérotée des cours / leçons */}
            <div className="my-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-380px)] pr-1 custom-scrollbar">
              {course.lessons.map((lesson, idx) => {
                const isCurrent = currentLesson?.id === lesson.id;
                const isCompleted = completedLessonIds.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      setCurrentLesson(lesson);
                      setMobileTab('video');
                    }}
                    className={`w-full p-3.5 rounded-2xl cursor-pointer text-left transition-all border flex items-start gap-3.5 group ${
                      isCurrent
                        ? 'bg-blue-600/20 border-blue-500/80 shadow-lg shadow-blue-500/10 text-white'
                        : isCompleted
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300 hover:bg-white/5'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {/* Badge numéro / statut */}
                    <div className="shrink-0 mt-0.5">
                      {isCompleted ? (
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      ) : (
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold border ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-400'
                            : 'bg-black/30 border-white/10 text-slate-400'
                        }`}>
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    {/* Titre & durée */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-snug line-clamp-2 ${isCurrent ? 'text-white' : ''}`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 font-medium">
                          ⏱ {lesson.duration}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-black uppercase text-blue-400 tracking-wider">
                            En lecture
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Encadré d'incitation au Certificat */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 text-center">
                <span className="text-xl">🏆</span>
                <h4 className="text-xs font-bold text-amber-200 mt-1">
                  Certificat Officiel Digital Skills
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 mb-3">
                  {isCourseFullyCompleted
                    ? 'Tous les modules sont validés ! Votre certificat est prêt.'
                    : 'Suivez la formation jusqu\'au bout pour débloquer votre certificat.'}
                </p>
                <button
                  onClick={() => {
                    if (isCourseFullyCompleted) {
                      setIsCertModalOpen(true);
                    } else {
                      alert(`Validation requise : Complétez l'ensemble des modules (${completedLessonIds.length}/${course.lessons.length}) pour obtenir votre certificat.`);
                    }
                  }}
                  disabled={!isCourseFullyCompleted}
                  className={`w-full py-2.5 px-3 font-black text-xs rounded-xl uppercase tracking-wider transition-all ${
                    isCourseFullyCompleted
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {isCourseFullyCompleted ? 'Obtenir (10 000 FCFA)' : '🔒 Bloqué (En cours)'}
                </button>
              </div>
            </div>

          </div>
        </aside>

        {/* ========================================================================= */}
        {/* COLONNE DU MILIEU (VIDÉO CENTRALE & CONTENU)                               */}
        {/* ========================================================================= */}
        <main
          className={`lg:col-span-6 flex flex-col space-y-6 ${
            mobileTab === 'video' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* LECTEUR VIDÉO AU CENTRE */}
          <div className="bg-[#10172c] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            
            {/* En-tête du lecteur vidéo */}
            <div className="px-6 py-4 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                  {currentLesson?.title ? `Module ${currentLessonIndex + 1} / ${course.lessons.length}` : 'Lecteur Vidéo'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  100% Français
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {currentLesson?.duration || ''}
                </span>
              </div>
            </div>

            {/* Cadre vidéo 16:9 */}
            <div className="relative aspect-video w-full bg-black">
              {currentLesson ? (
                <iframe
                  key={currentLesson.id}
                  src={`${currentLesson.video_url}${currentLesson.video_url.includes('?') ? '&' : '?'}rel=0&modestbranding=1&autoplay=0`}
                  title={currentLesson.title}
                  className="absolute inset-0 w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                  Sélectionnez un module pour commencer
                </div>
              )}
            </div>

            {/* BARRE D'ACTIONS VIDÉO AVEC VALIDATION CHRONOMÉTRÉE */}
            <div className="p-4 sm:p-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={goToPreviousLesson}
                disabled={currentLessonIndex <= 0}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-all text-slate-300"
              >
                ← Précédent
              </button>

              {/* BOUTON DE VALIDATION CONDITIONNÉ AU VISIONNAGE DU COURS */}
              {currentLesson && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      if (canMarkAsCompleted) {
                        toggleLessonCompletion(currentLesson.id);
                      }
                    }}
                    disabled={!canMarkAsCompleted}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isCurrentLessonCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : canMarkAsCompleted
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 animate-bounce'
                        : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span>{isCurrentLessonCompleted ? '✓' : canMarkAsCompleted ? '○' : '🔒'}</span>
                    <span>
                      {isCurrentLessonCompleted
                        ? 'Module validé ✓'
                        : canMarkAsCompleted
                        ? 'Marquer le cours comme terminé'
                        : `Visionnage en cours (${remainingSeconds}s)...`}
                    </span>
                  </button>

                  {!canMarkAsCompleted && !isCurrentLessonCompleted && (
                    <span className="text-[10px] text-amber-400 font-semibold mt-1.5 flex items-center gap-1">
                      <span>⏳</span> Suivez la vidéo pour activer la validation dans {remainingSeconds}s
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={markCurrentLessonCompleteAndNext}
                disabled={currentLessonIndex >= course.lessons.length - 1}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-all text-slate-300"
              >
                Suivant →
              </button>
            </div>
          </div>

          {/* BANNIÈRE DE FIN DE FORMATION & CERTIFICAT (DYNAMIQUE) */}
          <div className={`p-6 md:p-8 rounded-[2rem] border-2 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${
            isCourseFullyCompleted
              ? 'bg-gradient-to-r from-amber-500/20 via-blue-600/20 to-emerald-500/20 border-amber-500/40'
              : 'bg-white/[0.03] border-white/10'
          }`}>
            <div className="space-y-1 text-center sm:text-left">
              <span className={`text-[10px] font-black uppercase tracking-[0.25em] block ${
                isCourseFullyCompleted ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {isCourseFullyCompleted ? '🎉 Cursus 100% validé !' : '🎓 Progression vers la Certification'}
              </span>
              <h3 className="text-xl font-black text-white">
                {isCourseFullyCompleted ? 'Votre Certificat Professionnel est Prêt' : 'Obtenir votre Certificat Certifié'}
              </h3>
              <p className="text-xs text-slate-300 max-w-md">
                {isCourseFullyCompleted
                  ? 'Félicitations, vous avez validé toutes les leçons ! Vous pouvez maintenant commander et imprimer votre certificat officiel.'
                  : `Terminez l'ensemble des modules (${completedLessonIds.length}/${course.lessons.length} complétés) pour débloquer votre attestation d'accomplissement.`}
              </p>
            </div>

            <button
              onClick={() => {
                if (isCourseFullyCompleted) {
                  setIsCertModalOpen(true);
                } else {
                  alert(`Attention : Vous devez valider l'ensemble des ${course.lessons.length} modules avant de réclamer votre certificat officiel.`);
                }
              }}
              disabled={!isCourseFullyCompleted}
              className={`px-8 py-4 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all transform shrink-0 ${
                isCourseFullyCompleted
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5 opacity-50'
              }`}
            >
              {isCourseFullyCompleted ? '🎓 Commander mon Certificat (10 000 FCFA)' : '🔒 Certificat verrouillé'}
            </button>
          </div>

          {/* DÉTAILS DU MODULE EN COURS */}
          {currentLesson && (
            <div className="bg-[#10172c] border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider">
                  Description pédagogique
                </span>
                <span className="text-xs text-slate-400">
                  {currentLesson.duration} • Cours dispensé en français
                </span>
              </div>

              <h2 className="text-2xl font-black text-white">
                {currentLesson.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {currentLesson.description}
              </p>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Objectifs professionnels du module
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Comprendre en profondeur les principes clés expliqués par le formateur.</li>
                  <li>Télécharger et mettre en pratique les fiches PDF associées à droite.</li>
                  <li>Suivre l'intégralité du module pour marquer la leçon comme complétée.</li>
                </ul>
              </div>
            </div>
          )}
        </main>

        {/* ========================================================================= */}
        {/* COLONNE DROITE (FENÊTRE DES COURS EN FORMAT PDF À TÉLÉCHARGER)            */}
        {/* ========================================================================= */}
        <aside
          className={`lg:col-span-3 flex flex-col ${
            mobileTab === 'pdfs' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="bg-[#10172c] border border-white/10 rounded-[2rem] p-5 shadow-2xl flex flex-col h-full sticky top-24">
            
            {/* En-tête Supports PDF */}
            <div className="pb-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <span>📥</span> Supports PDF officiels
                </span>
                <span className="text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  {course.pdfs.length} Fiches
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Fiches pratiques numérotées de 1 à {course.pdfs.length} à télécharger pour réviser :
              </p>
            </div>

            {/* LISTE DES PDFS NUMÉROTÉS 1, 2, 3... JUSQU'À LA FIN */}
            <div className="my-4 space-y-3 overflow-y-auto max-h-[calc(100vh-320px)] pr-1 custom-scrollbar">
              {course.pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-all group flex flex-col space-y-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Numéro du PDF (1, 2, 3...) */}
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {pdf.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors leading-snug">
                        {pdf.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {pdf.description}
                      </p>
                    </div>
                  </div>

                  {/* Métadonnées & Boutons d'action */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-medium">
                      📄 {pdf.file_size} • {pdf.pages}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPreviewPdf(pdf)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-slate-300 transition-colors"
                      >
                        Consulter
                      </button>

                      <a
                        href={pdf.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                      >
                        <span>📥</span> Télécharger
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Assistance Étudiants WhatsApp */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assistance étudiants</span>
                  <span className="text-xs font-bold text-slate-200">Support 7j/7</span>
                </div>
                <a
                  href="https://wa.me/221774532255?text=Bonjour,%20j%27ai%20une%20question%20concernant%20mes%20cours%20sur%20Digital%20Skills%20Academy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  WhatsApp
                </a>
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* MODALE POUR LE CERTIFICAT PAYANT (10 000 FCFA) */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        courseTitle={course.title}
        defaultStudentName={studentName}
        certificatePrice={course.certificate_price || 10000}
      />

      {/* MODALE DE PRÉVISUALISATION DU PDF */}
      <PdfPreviewModal
        pdf={previewPdf}
        onClose={() => setPreviewPdf(null)}
      />

      {/* STYLE PERSONNALISÉ POUR LA SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
}