// ═══════════════════════════════════════════════════════════════
// QUARTIERS DE MARRAKECH ET ALENTOURS - Constantes Géographiques
// ═══════════════════════════════════════════════════════════════
// Structure enrichie : nom, catégorie, distance du centre, description
// Centre de référence : Guéliz (0 km)

// Simplearray d'exportation pour compatibilité arrière (datalist standard)
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
  "Riad Zitoun",
  "Azrou",

  // Quartiers Résidentiels
  "Semlalia",
  "Targa",
  "Majorelle",
  "Ennakhil",
  "Saada",

  // Routes d'Accès
  "Route de Fès",
  "Route de l'Ourika",
  "Route de Ouarzazate",
  "Route Casa/Noria",
  "Sidi Ghalem",

  // Zones Périphériques
  "Ben Guerir",
  "Oulad Hassnoun",
  "Safi Essalam",
  "Mhamid",
  "Aït Kaddour",
  "Tahanaout",
];

// Données enrichies avec catégorie et distance (pour affichage amélioré)
// Format: {name, category, kmCenter, description}
export const QUARTIERS_WITH_DETAILS = [
  // ─── QUARTIERS CENTRAUX ─────────────────────────────────────────
  { name: "Guéliz", category: "Quartiers Centraux", kmCenter: 0, desc: "Centre ville moderne" },
  { name: "Médina", category: "Quartiers Centraux", kmCenter: 2.5, desc: "Vieille ville historique" },
  { name: "Hivernage", category: "Quartiers Centraux", kmCenter: 2.0, desc: "Zone résidentielle élégante" },
  { name: "Kasbah", category: "Quartiers Centraux", kmCenter: 3.5, desc: "Forteresse historique" },

  // ─── QUARTIERS TOURISTIQUES ─────────────────────────────────────
  { name: "Palmeraie", category: "Quartiers Touristiques", kmCenter: 8.5, desc: "Palmeraie avec villas de luxe" },
  { name: "Agdal", category: "Quartiers Touristiques", kmCenter: 4.0, desc: "Jardins et propriétés" },
  { name: "Menara", category: "Quartiers Touristiques", kmCenter: 5.5, desc: "Jardins de Menara" },
  { name: "Riad Zitoun", category: "Quartiers Touristiques", kmCenter: 2.8, desc: "Riads traditionnels" },
  { name: "Azrou", category: "Quartiers Touristiques", kmCenter: 4.5, desc: "Zone touristique" },

  // ─── QUARTIERS RÉSIDENTIELS ─────────────────────────────────────
  { name: "Semlalia", category: "Quartiers Résidentiels", kmCenter: 3.5, desc: "Quartier moderne" },
  { name: "Targa", category: "Quartiers Résidentiels", kmCenter: 5.5, desc: "Zone résidentielle" },
  { name: "Majorelle", category: "Quartiers Résidentiels", kmCenter: 2.5, desc: "Quartier tranquille" },
  { name: "Ennakhil", category: "Quartiers Résidentiels", kmCenter: 4.2, desc: "Quartier résidentiel" },
  { name: "Saada", category: "Quartiers Résidentiels", kmCenter: 6.0, desc: "Zone périurbaine" },

  // ─── ROUTES D'ACCÈS ─────────────────────────────────────────────
  { name: "Route de Fès", category: "Routes d'Accès", kmCenter: 8.0, desc: "Route Nord" },
  { name: "Route de l'Ourika", category: "Routes d'Accès", kmCenter: 7.5, desc: "Route Sud-Est" },
  { name: "Route de Ouarzazate", category: "Routes d'Accès", kmCenter: 12.0, desc: "Route Sud" },
  { name: "Route Casa/Noria", category: "Routes d'Accès", kmCenter: 10.0, desc: "Route Ouest" },
  { name: "Sidi Ghalem", category: "Routes d'Accès", kmCenter: 9.5, desc: "Routes périphériques" },

  // ─── ZONES PÉRIPHÉRIQUES ────────────────────────────────────────
  { name: "Ben Guerir", category: "Zones Périphériques", kmCenter: 15.0, desc: "Banlieue sud" },
  { name: "Oulad Hassnoun", category: "Zones Périphériques", kmCenter: 14.0, desc: "Banlieue sud-est" },
  { name: "Safi Essalam", category: "Zones Périphériques", kmCenter: 12.5, desc: "Zone périphérique" },
  { name: "Mhamid", category: "Zones Périphériques", kmCenter: 13.0, desc: "Banlieue" },
  { name: "Aït Kaddour", category: "Zones Périphériques", kmCenter: 16.0, desc: "Zone rurale" },
  { name: "Tahanaout", category: "Zones Périphériques", kmCenter: 18.0, desc: "Banlieue lointaine" },
];

// Version groupée pour affichage avec catégories (optionnel)
export const QUARTIERS_CATEGORISES = {
  "Quartiers Centraux": ["Guéliz", "Médina", "Hivernage", "Kasbah"],
  "Quartiers Touristiques": ["Palmeraie", "Agdal", "Menara", "Riad Zitoun", "Azrou"],
  "Quartiers Résidentiels": ["Semlalia", "Targa", "Majorelle", "Ennakhil", "Saada"],
  "Routes d'Accès": ["Route de Fès", "Route de l'Ourika", "Route de Ouarzazate", "Route Casa/Noria", "Sidi Ghalem"],
  "Zones Périphériques": ["Ben Guerir", "Oulad Hassnoun", "Safi Essalam", "Mhamid", "Aït Kaddour", "Tahanaout"],
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
