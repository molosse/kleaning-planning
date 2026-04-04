// Property and location data
export const TYPE_IC = {
  "Bureau":"🔷",
  "Appartement GH":"🟢",
  "Villa":"🟠",
  "Riad":"⭕",
  "Appartement MM":"🔵",
  "Appartement":"🟡"
};

// Client-specific icon overrides — emoji distinct par client pour WhatsApp
// Chaque client a son propre emoji pour identifier visuellement ses interventions
export const CLIENT_IC = {
  "Cabinet médical":"🔴",
  "GetHost":"🟢",
  "Maison Madeleines":"🔵",
  "Alami Ecom":"🔷",
  "CasaMichka":"⭕",
  "Particulier":"🟡",
};

// Couleurs SVG par client — utilisées dans les cartes intervention du planning
// Chaque client a sa propre couleur d'icône + fond pour distinction visuelle
export const CLIENT_COLORS = {
  "GetHost":        { color: "#059669", bg: "#d1fae5" },
  "Maison Madeleines": { color: "#2563eb", bg: "#dbeafe" },
  "Alami Ecom":     { color: "#6366f1", bg: "#e0e7ff" },
  "Cabinet médical":{ color: "#b5172d", bg: "#fdeef0" },
  "CasaMichka":     { color: "#c84b1f", bg: "#fdf1ec" },
  "Particulier":    { color: "#d97706", bg: "#fef3c7" },
};

// Available property types for wizard and filters
export const TYPES = ["Appartement GH","Appartement MM","Appartement","Villa","Riad","Bureau"];

// Marrakech city center coordinates (fallback GPS for properties without explicit location)
export const CENTRE = {lat:31.635,lng:-8.010};
