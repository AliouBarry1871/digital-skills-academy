/**
 * Module d'authentification et de privilèges Super Administrateur
 * pour Digital Skills Academy.
 * 
 * L'administrateur officiel bénéficie de pleins droits sur l'ensemble de la plateforme :
 * - Accès gratuit et immédiat à tous les cours (gratuits comme payants)
 * - Validation instantanée des leçons sans délai d'attente
 * - Génération et aperçu libre des certificats
 * - Gestion et suppression des cours
 */

export const ADMIN_EMAILS = [
  'mamadoualioubarry1871@gmail.com',
  'mamadouaioubarry1871@gmail.com', // Tolérance faute de frappe
  'mamadoualioubarry1871@gmail.çom',
  'alioubarry1871@gmail.com',
];

export const ADMIN_PHONES = [
  '774532255',
  '+221774532255',
  '221774532255',
  '00221774532255',
];

export function isSuperAdmin(user: any): boolean {
  // Vérification de secours via localStorage si disponible
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('dsa_user_email');
      if (stored) {
        const clean = stored.toLowerCase().trim();
        if (ADMIN_EMAILS.includes(clean) || (clean.includes('mamadou') && clean.includes('barry') && clean.includes('1871'))) {
          return true;
        }
      }
    } catch {}
  }

  if (!user) return false;

  const email = (user.email || '').toLowerCase().trim();
  if (email) {
    if (ADMIN_EMAILS.includes(email)) return true;
    if (email.includes('mamadou') && email.includes('barry') && email.includes('1871')) return true;
  }

  // Vérification par numéro de téléphone dans les métadonnées
  const rawPhone = (
    user.phone ||
    user.user_metadata?.phone ||
    user.user_metadata?.telephone ||
    ''
  ).toString().replace(/[\s\-_]/g, '');

  if (rawPhone) {
    for (const p of ADMIN_PHONES) {
      if (rawPhone.includes(p)) return true;
    }
  }

  // Flag explicite dans Supabase user_metadata
  if (user.user_metadata?.is_admin === true || user.user_metadata?.role === 'admin') {
    return true;
  }

  return false;
}

/**
 * Convertit n'importe quel format d'URL YouTube en URL embed 100% fonctionnelle dans un iframe.
 * Résout définitivement l'erreur "Vidéo indisponible / Accès non disponible".
 */
export function formatYouTubeEmbedUrl(url: string | undefined | null): string {
  if (!url) return 'https://www.youtube.com/embed/KYVN3GVhSGk';
  const trimmed = url.trim();

  // Si c'est déjà une URL embed valide
  if (trimmed.includes('youtube.com/embed/')) {
    // Nettoyer les paramètres superflus qui peuvent bloquer
    const idMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (idMatch && idMatch[1]) {
      return `https://www.youtube.com/embed/${idMatch[1]}`;
    }
    return trimmed;
  }

  // Format standard youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // Format raccourci youtu.be/ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  // Format Shorts youtube.com/shorts/ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  // Si l'utilisateur a uniquement collé l'identifiant à 11 caractères
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  return trimmed;
}
