'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddCoursePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('Développement'); // Nouvelle catégorie par défaut
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // On ajoute 'category' dans l'objet envoyé à Supabase
    const { error } = await supabase
      .from('courses')
      .insert([{ 
        title, 
        description, 
        video_url: videoUrl, 
        category: category 
      }]);

    if (error) {
      setMessage(`Erreur : ${error.message}`);
    } else {
      setMessage('✅ Cours ajouté avec succès !');
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setCategory('Développement');
      
      // Rediriger vers l'accueil après 2 secondes
      setTimeout(() => router.push('/'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter uppercase">
          Ajouter un nouveau cours
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITRE */}
          <div>
            <label className="block text-xs font-black uppercase text-blue-600 mb-2 tracking-widest">Titre du cours</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium"
              placeholder="Ex: Maîtriser Python pour la Data"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* CATÉGORIE (Nouveau champ) */}
          <div>
            <label className="block text-xs font-black uppercase text-blue-600 mb-2 tracking-widest">Catégorie</label>
            <select 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Développement">Développement</option>
              <option value="Cyber-sécurité">Cyber-sécurité</option>
              <option value="Bureautique">Bureautique</option>
              <option value="Marketing Digital">Marketing Digital</option>
              <option value="Python">Python</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-black uppercase text-blue-600 mb-2 tracking-widest">Description</label>
            <textarea 
              required
              rows={4}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium"
              placeholder="Décrivez ce que les étudiants vont apprendre..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* URL VIDÉO */}
          <div>
            <label className="block text-xs font-black uppercase text-blue-600 mb-2 tracking-widest">URL de la vidéo (Embed)</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium"
              placeholder="https://www.youtube.com/embed/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          {/* BOUTON DE SOUMISSION */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-lg"
          >
            {loading ? 'Publication...' : 'PUBLIER LE COURS'}
          </button>

          {message && (
            <p className={`text-center font-bold mt-4 ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}