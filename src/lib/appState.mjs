export function getInitialDateQ() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

export function getSelectedWeekday(dateQ) {
  const [day, month, year] = dateQ.split("/");
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  return Number.isNaN(date.getTime()) ? new Date().getDay() : date.getDay();
}

export function countUnassignedInterventions(chaines) {
  return chaines.flatMap((chaine) => chaine.inters).filter((inter) => !(inter.employes || []).length).length;
}

export function countUnderstaffedVillas(chaines) {
  return chaines
    .flatMap((chaine) => chaine.inters)
    .filter((inter) => inter.type === "Villa" && (inter.employes || []).length < 2)
    .length;
}

export function buildTabs(role) {
  return [
    ["planning", "📋", "Planning"],
    ...(role === "admin" ? [["historique", "📅", "Historique"]] : []),
    ["lieux", "🏠", "Logements"],
    ["extras", "👤", "Extras"],
    ["equipe", "👥", "Équipe"],
    ...(role === "admin" ? [["users", "⚙️", "Comptes"], ["params", "🔧", "Paramètres"]] : []),
  ];
}
