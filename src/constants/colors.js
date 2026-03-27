// ═══════════════════════════════════════════════════════════════
// DESIGN SYSTEM TOKENS - Intervention & Travaux v1.0
// ═══════════════════════════════════════════════════════════════
// Palette de couleurs centralisée pour l'application Kleaning
// NOTE: Pour changer la couleur primaire (marque) → Modifier DS.brand
// Tous les changements de couleur doivent se faire ici pour cohérence globale

export const DS = {
  // ── NEUTRES : Teintes pour texte et fond ──
  ink:      "#0f1117",  // Texte primaire (très sombre)
  ink2:     "#3d4155",  // Texte secondaire (gris moyen)
  ink3:     "#7c829a",  // Texte tertiaire (gris clair)
  ink4:     "#b0b5c8",  // Texte quaternaire (très léger)

  // ── ARRIÈRE-PLANS ──
  paper:    "#f8f7f4",  // Fond principal (beige clair)
  paper2:   "#f1f0ec",  // Fond secondaire (beige plus foncé)
  paper3:   "#e8e6e0",  // Fond tertiaire (beige encore plus foncé)
  line:     "#e2e0da",  // Bordures et séparateurs

  // ── MARQUE : Couleur primaire (Orange/Brique) ──
  // IMPORTANT: C'est la couleur d'identité visuelle principale
  // Si changement brand color requis → Modifier ici impactera tous les CTA, accents
  brand:    "#c84b1f",  // Couleur primaire (boutons, accents, logo)
  brand2:   "#e06235",  // Variante plus claire pour hover/états
  brandSoft:"#fdf1ec",  // Arrière-plan très léger (badges, highlights)
  brandMid: "#f5c5b0",  // Arrière-plan moyen

  // ── STATUTS : Couleurs sémantiques ──
  sage:     "#3a6b54",  // Succès, complété, validé (vert)
  sageSoft: "#edf4f0",  // Arrière-plan succès
  sageMid:  "#9ec4b0",  // Variante moyenne

  amber:    "#b5620a",  // Alerte, en attente, hésitant (orange)
  amberSoft:"#fdf3e7",  // Arrière-plan alerte

  cobalt:   "#1e4fa8",  // Information, actif, en cours (bleu)
  cobaltSoft:"#edf1fb", // Arrière-plan info

  ruby:     "#b5172d",  // Danger, litige, erreur (rouge)
  rubySoft: "#fdeef0",  // Arrière-plan danger

  // ── ARRONDI : Rayons des coins ──
  radiusSm: "6px",      // Très petit (petits chips, inputs)
  radiusMd: "12px",     // Moyen (boutons, petites cartes)
  radiusLg: "20px",     // Grand (cartes principales)
  radiusXl: "28px",     // Très grand (modals, drawers)
};

// ── PALETTE LOGIN : Thème Marrakech spécifique ──
// Couleurs réservées à la page de connexion pour identité visuelle distincte
// NOTE: Si branding login à changer → Modifier DS_LOGIN
export const DS_LOGIN = {
  darkNavy: "#0D1B2A",  // Fond sombre principal (minaret, bâtiments)
  navyMid: "#1A3550",   // Fond plus clair (dégradé)
  gold: "#C9A84C",      // Accent doré (marroquain, étoiles)
  cream: "#F5ECD7",     // Texte clair (sur fond sombre)
  beige: "#F5E6C8",     // Lune et détails (silhouette Marrakech)
};

// ── COULEURS CHAÎNES : Identification visuelle des paires d'interventions ──
// Chaque chaîne (2 interventions liées) reçoit une couleur unique
// 8 variations pour cycling à travers de multiples chaînes
// NOTE: Modifier pour changer l'apparence visuelle des associations
export const CHAINE_COLORS = [
  {bg:"#fef9c3",border:"#fbbf24",label:"#92400e"},  // 1. Jaune
  {bg:"#d1fae5",border:"#34d399",label:"#065f46"},  // 2. Vert
  {bg:"#dbeafe",border:"#60a5fa",label:"#1e40af"},  // 3. Bleu
  {bg:"#ede9fe",border:"#a78bfa",label:"#5b21b6"},  // 4. Violet
  {bg:"#ffedd5",border:"#fb923c",label:"#9a3412"},  // 5. Orange
  {bg:"#fce7f3",border:"#f472b6",label:"#9d174d"},  // 6. Rose
  {bg:"#e0f2fe",border:"#38bdf8",label:"#075985"},  // 7. Cyan
  {bg:"#dcfce7",border:"#4ade80",label:"#14532d"},  // 8. Citron vert
];
