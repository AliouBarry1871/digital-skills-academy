'use client';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* COLONNE 1 : LOGO & TEXTE */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm">D</span>
              </div>
              <span className="font-black text-lg tracking-tighter text-slate-900 uppercase">
                Digital<span className="text-blue-600">Skills</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              La plateforme de référence pour maîtriser les compétences numériques de demain.
            </p>
          </div>

          {/* COLONNE 2 : FORMATIONS */}
          <div>
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Formations</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Bureautique</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Développement</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Cyber-sécurité</Link></li>
            </ul>
          </div>

          {/* COLONNE 3 : LIENS UTILES */}
          <div>
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/profile" className="hover:text-blue-600 transition-colors">Mon Compte</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Tableau de Bord</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Aide & Contact</Link></li>
            </ul>
          </div>

          {/* COLONNE 4 : NEWSLETTER */}
          <div>
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* LIGNE DE FIN */}
        <div className="border-t border-slate-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © {currentYear} Digital Skills Academy. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-slate-900">Confidentialité</Link>
            <Link href="#" className="hover:text-slate-900">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}