'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getQuizForCourse, CourseQuiz } from '@/lib/quiz-data';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  studentName?: string;
  onQuizPassed: (score: number) => void;
}

export default function QuizModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  courseCategory,
  studentName,
  onQuizPassed,
}: QuizModalProps) {
  const [quiz, setQuiz] = useState<CourseQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isOpen && courseId) {
      const q = getQuizForCourse(courseId, courseTitle, courseCategory);
      setQuiz(q);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setScore(0);
    }
  }, [isOpen, courseId, courseTitle, courseCategory]);

  if (!isOpen || !quiz) return null;

  const currentQ = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isPassed = score >= 7; // 70% pour réussir

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);

    if (calculatedScore >= 7) {
      onQuizPassed(calculatedScore);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c1222] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* EN-TÊTE MODALE */}
        <div className="px-6 py-5 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-lg">
              ✍️
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                Examen de Certification
              </span>
              <h3 className="text-sm font-bold text-white line-clamp-1">
                {quiz.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">

          {!isSubmitted ? (
            <div>
              {/* PROGRESSION */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
                  <span>Question {currentQuestionIndex + 1} sur {totalQuestions}</span>
                  <span className="text-blue-400">{answeredCount}/{totalQuestions} répondues</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* ÉNONCÉ DE LA QUESTION */}
              <div className="mb-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 mb-2">
                  Question #{currentQuestionIndex + 1}
                </span>
                <h4 className="text-base font-bold text-white leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* OPTIONS DE RÉPONSES */}
              <div className="space-y-3 mb-8">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      className={`w-full p-4 rounded-2xl text-left text-xs font-medium transition-all border flex items-center gap-3.5 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                          : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-blue-400 bg-blue-500 text-white text-[10px]'
                          : 'border-white/20 bg-black/20'
                      }`}>
                        {isSelected && '✓'}
                      </div>
                      <span className="flex-1 leading-relaxed">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* BARRE DE NAVIGATION INFÉRIEURE */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    currentQuestionIndex === 0
                      ? 'opacity-30 cursor-not-allowed text-slate-500'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer'
                  }`}
                >
                  ← Précédente
                </button>

                {isLastQuestion ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={answeredCount < totalQuestions}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg ${
                      answeredCount === totalQuestions
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 cursor-pointer animate-pulse'
                        : 'bg-white/10 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Valider le Test ({answeredCount}/{totalQuestions})
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-all shadow-md shadow-blue-500/20"
                  >
                    Suivante →
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ÉCRAN DE RÉSULTAT DU QUIZ */
            <div className="text-center py-4 space-y-6">
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl shadow-xl border ${isPassed ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10' : 'bg-red-500/20 border-red-500/40 text-red-400 shadow-red-500/10'}">
                {isPassed ? '🏆' : '⚠️'}
              </div>

              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border mb-3 ${
                  isPassed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  {isPassed ? 'Examen Validé avec Succès !' : 'Score Insuffisant'}
                </span>

                <h3 className="text-2xl font-black text-white">
                  Votre note : <span className={isPassed ? 'text-emerald-400' : 'text-amber-400'}>{score} / {totalQuestions}</span> ({score * 10}%)
                </h3>

                <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  {isPassed
                    ? `Félicitations ${studentName || ''} ! Vous avez validé l'évaluation de certification (minimum requis : 70%). Votre attestation de compétences est désormais débloquée.`
                    : `Vous devez obtenir au moins 7 réponses correctes sur 10 (70%) pour valider l'examen et débloquer votre certificat officiel.`}
                </p>
              </div>

              {/* DÉTAIL DES QUESTIONS / RÉPONSES */}
              <div className="text-left space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1">
                  Corrigé de l'évaluation :
                </h5>
                {quiz.questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-xl border text-xs ${
                        isCorrect
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                          : 'bg-red-500/5 border-red-500/20 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold">{isCorrect ? '✅' : '❌'}</span>
                        <div className="flex-1">
                          <p className="font-bold text-white">
                            {idx + 1}. {q.question}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Réponse correcte : <span className="text-emerald-400 font-semibold">{q.options[q.correctAnswer]}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-[10px] text-slate-500 mt-0.5 italic">
                              💡 {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BOUTONS D'ACTION */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                {isPassed ? (
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
                  >
                    Obtenir mon Certificat Officiel 🎓
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🔄</span> Recommencer l'Examen
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
