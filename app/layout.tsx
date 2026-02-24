import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Importation du nouveau composant Footer

export const metadata = {
  title: 'Digital Skills Academy',
  description: 'Apprenez les compétences numériques de demain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {/* La Navbar est visible sur toutes les pages */}
        <Navbar /> 

        {/* Le 'flex-grow' permet au contenu de prendre toute la place disponible 
            pour pousser le Footer vers le bas */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Le Footer est visible sur toutes les pages */}
        <Footer />
      </body>
    </html>
  );
}