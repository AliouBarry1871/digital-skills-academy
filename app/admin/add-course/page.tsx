'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddCoursePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Développement');
  const [videoUrl, setVideoUrl] = useState('');
  const [price, setPrice] = useState('35000'); // Prix par défaut pour ton cours Python
  
  // J'ai inséré ton lien Stripe ici par défaut
  const [paymentLink, setPaymentLink] = useState('https://buy.stripe.com/test_6oU9AV78S8TlaKcfPg6EU00'); 
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('courses').insert([
      { 
        title, 
        description, 
        category, 
        video_url: videoUrl,
        price: parseFloat(price), 
        payment_link: paymentLink 
      },
    ]);

    if (error) {
      alert("Erreur : " + error.message + " (Vérifiez que la colonne payment_link existe dans Supabase)");
    } else {
      alert("Cours ajouté avec succès !");
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-10 shadow-xl">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Ajouter un nouveau cours</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITRE */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Titre du cours</label>
            <input 
              type="text" required
              placeholder="Ex: Python pour Débutants"
              className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* CATÉGORIE */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Catégorie</label>
              <select 
                className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600"
                value={category} onChange={(e) => setCategory(e.target.value)}
              >
                <option>Développement</option>
                <option>Cyber-sécurité</option>
                <option>Bureautique</option>
                <option>Marketing Digital</option>
                <option>Python</option>
              </select>
            </div>

            {/* PRIX */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Prix (FCFA / €)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600"
                value={price} onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* LIEN DE PAIEMENT (STRIPE) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Lien de paiement Stripe</label>
            <input 
              type="url" required
              className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 text-blue-600 text-sm"
              value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)}
            />
          </div>

          {/* URL VIDÉO */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">URL Embed Vidéo (YouTube)</label>
            <input 
              type="text" required
              placeholder="https://www.youtube.com/embed/..."
              className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600"
              value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea 
              rows={4} required
              className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600"
              value={description} onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            {loading ? 'Publication...' : 'PUBLIER LE COURS'}
          </button>
        </form>
      </div>
    </div>
  );
}