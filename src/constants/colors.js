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
// Palette alignée sur le Design System — tons mués professionels
// Utilise exclusivement les tokens DS (sauge, cobalt, brique, ambre, ruby, neutre)
export const CHAINE_COLORS = [
  {bg:"#edf4f0",border:"#9ec4b0",label:"#3a6b54"},  // 1. Sauge
  {bg:"#edf1fb",border:"#93b0e0",label:"#1e4fa8"},  // 2. Cobalt
  {bg:"#fdf1ec",border:"#f5c5b0",label:"#c84b1f"},  // 3. Brique
  {bg:"#fdf3e7",border:"#e8b080",label:"#b5620a"},  // 4. Ambre
  {bg:"#fdeef0",border:"#e8a0a8",label:"#b5172d"},  // 5. Ruby
  {bg:"#f1f0ec",border:"#c8c5bc",label:"#3d4155"},  // 6. Neutre
  {bg:"#e8f0f6",border:"#7090d0",label:"#163a80"},  // 7. Cobalt foncé
  {bg:"#f0f7f3",border:"#7db89a",label:"#2d5742"},  // 8. Sauge foncé
];
