// ═══════════════════════════════════════════════════════════════
// QUARTIERS DE MARRAKECH ET ALENTOURS - Constantes Géographiques
// ═══════════════════════════════════════════════════════════════

export const QUARTIERS = [
  // Quartiers Centraux
  "Guéliz",
  "Médina",
  "Hivernage",
  "Kasbah",

  // Quartiers Touristiques
  "Palmeraie",
  "Agdal",
  "Menara",

  // Quartiers Résidentiels
  "Semlalia",
  "Targa",
  "Riad Zitoun",

  // Routes d'Accès
  "Route de Fès",
  "Route de l'Ourika",
  "Route Casa/Noria",
  "Route de Ouarzazate",

  // Zones Périphériques
  "Ben Guerir",
  "Oulad Hassnoun",
  "Safi Essalam",
];

// Version groupée pour affichage avec catégories (optionnel)
export const QUARTIERS_CATEGORISES = {
  "Quartiers Centraux": ["Guéliz", "Médina", "Hivernage", "Kasbah"],
  "Quartiers Touristiques": ["Palmeraie", "Agdal", "Menara"],
  "Quartiers Résidentiels": ["Semlalia", "Targa", "Riad Zitoun"],
  "Routes d'Accès": ["Route de Fès", "Route de l'Ourika", "Route Casa/Noria", "Route de Ouarzazate"],
  "Zones Périphériques": ["Ben Guerir", "Oulad Hassnoun", "Safi Essalam"],
};

// Distance approximée en km entre quartiers (pour optimisation des chaînes)
// Format: { "Guéliz→Médina": 2.5 }
export const QUARTIER_DISTANCES = {
  "Guéliz→Médina": 2.5,
  "Médina→Hivernage": 3.0,
  "Hivernage→Guéliz": 2.0,
  "Guéliz→Palmeraie": 8.5,
  "Médina→Palmeraie": 9.5,
  "Guéliz→Agdal": 4.0,
  "Guéliz→Semlalia": 3.5,
  "Hivernage→Semlalia": 2.0,
  "Guéliz→Targa": 5.5,
  "Palmeraie→Targa": 12.0,
  "Agdal→Menara": 3.0,
};
