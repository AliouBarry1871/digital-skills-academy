import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Digital Skills Academy',
  description: 'Apprenez les compétences numériques de demain',
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
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}