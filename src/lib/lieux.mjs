export const LINGE_MODE_NONE = "";
export const LINGE_MODE_PROPRIETAIRE = "proprietaire";
export const LINGE_MODE_KLEANING = "kleaning";

export function normalizeLingeMode(mode, legacyLingeProprio) {
  const hasExplicitMode = typeof mode === "string";
  const rawMode = hasExplicitMode ? mode.trim().toLowerCase() : "";

  if (rawMode === LINGE_MODE_PROPRIETAIRE) return LINGE_MODE_PROPRIETAIRE;
  if (rawMode === LINGE_MODE_KLEANING) return LINGE_MODE_KLEANING;
  if (hasExplicitMode && (rawMode === "" || rawMode === "none" || rawMode === "aucun")) return LINGE_MODE_NONE;

  if (legacyLingeProprio === true) return LINGE_MODE_PROPRIETAIRE;
  return LINGE_MODE_NONE;
}

export function normalizeLieuRecord(lieu = {}) {
  const lingeMode = normalizeLingeMode(lieu.lingeMode, lieu.lingeProprio);

  return {
    ...lieu,
    cli: typeof lieu.cli === "string" ? lieu.cli.trim() : "",
    proprietaire: typeof lieu.proprietaire === "string" ? lieu.proprietaire.trim() : "",
    lingeMode,
    lingeProprio: lingeMode === LINGE_MODE_PROPRIETAIRE,
  };
}

export function prepareLieuPayload(lieu = {}) {
  const normalized = normalizeLieuRecord(lieu);
  return {
    ...lieu,
    cli: normalized.cli,
    proprietaire: normalized.proprietaire,
    lingeMode: normalized.lingeMode,
    lingeProprio: normalized.lingeProprio,
  };
}

export function getLingeModeMeta(mode, legacyLingeProprio) {
  const normalizedMode = normalizeLingeMode(mode, legacyLingeProprio);

  if (normalizedMode === LINGE_MODE_PROPRIETAIRE) {
    return {
      mode: normalizedMode,
      icon: "👕",
      label: "Linge propriétaire",
      shortLabel: "Propriétaire",
      color: "#6d28d9",
      bg: "#ede9fe",
      border: "#c4b5fd",
    };
  }

  if (normalizedMode === LINGE_MODE_KLEANING) {
    return {
      mode: normalizedMode,
      icon: "🧺",
      label: "Linge Kleaning",
      shortLabel: "Kleaning",
      color: "#c84b1f",
      bg: "#FFF7ED",
      border: "#fed7aa",
    };
  }

  return null;
}
