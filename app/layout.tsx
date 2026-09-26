import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://digital-skills-academy-nu.vercel.app'),
  title: {
    default: 'Digital Skills Academy | Institut International des Compétences Numériques',
    template: '%s | Digital Skills Academy',
  },
  description:
    "Formations professionnelles 100% en ligne et en français : Cybersécurité, Hacking Éthique, Programmation Python, Développement Web, Excel & Marketing Digital avec attestations et certificats vérifiables.",
  keywords: [
    'Digital Skills Academy',
    'formation en ligne informatique',
    'formation cybersécurité',
    'cours hacking éthique',
    'cours python français',
    'formation excel entreprise',
    'marketing digital',
    'certificat professionnel en ligne',
    'cours numérique afrique',
    'cours en ligne sénégal',
  ],
  authors: [{ name: 'Digital Skills Academy' }],
  creator: 'Digital Skills Academy',
  publisher: 'Digital Skills Academy',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Digital Skills Academy | Formations d’Élite & Certifications',
    description:
      'Rejoignez notre académie pour maîtriser la Cybersécurité, Python, le Web et les Outils Numériques. Cours pratiques avec vidéos et supports PDF certifiés.',
    url: 'https://digital-skills-academy-nu.vercel.app',
    siteName: 'Digital Skills Academy',
    locale: 'fr_FR',
    type: 'website',
  },
  verification: {
    google: 'JOKl0c_BafWPgBw1mDFubOhfUJtGcKtVnzb7t36vB9I',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}