// Normalise les jours off en tableau d'index 0..6 (dimanche..samedi).
export function normalizeWeekdays(joursOff) {
  if (Array.isArray(joursOff)) {
    return [...new Set(
      joursOff
        .map((day) => Number(day))
        .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    )].sort((a, b) => a - b);
  }

  if (joursOff && typeof joursOff === "object" && Array.isArray(joursOff.recurringWeekdays)) {
    return [...new Set(
      joursOff.recurringWeekdays
        .map((day) => Number(day))
        .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    )].sort((a, b) => a - b);
  }

  return [];
}

export function isEmployeeOffForDay(emp, weekday) {
  if (!emp || !Number.isInteger(weekday) || weekday < 0 || weekday > 6) return false;
  return normalizeWeekdays(emp.joursOff).includes(weekday);
}

export function normalizeEmployeeRecord(emp) {
  if (!emp) return emp;
  return {
    ...emp,
    actif: emp.actif !== false,
    joursOff: normalizeWeekdays(emp.joursOff),
  };
}

export function createDefaultEquipe() {
  return [
    { id: "emp_1", nom: "Majda", emoji: "👩‍🦱", coul: "#2563eb", bg: "#dbeafe", actif: true, joursOff: [] },
    { id: "emp_2", nom: "Amina", emoji: "👩", coul: "#059669", bg: "#d1fae5", actif: true, joursOff: [] },
    { id: "emp_3", nom: "Touria", emoji: "👩‍🦳", coul: "#7c3aed", bg: "#ede9fe", actif: true, joursOff: [] },
    { id: "emp_4", nom: "Imane", emoji: "👩‍🦰", coul: "#d97706", bg: "#fef3c7", actif: true, joursOff: [] },
  ].map(normalizeEmployeeRecord);
}
