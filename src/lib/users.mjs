const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const LEGACY_LOGIN_RE = /^[a-zA-Z0-9._-]+$/;

export function normalizeLoginIdentifier(value = "") {
  return String(value ?? "").trim();
}

export function normalizeUserLogin(value = "") {
  const normalized = normalizeLoginIdentifier(value);
  return normalized.includes("@") ? normalized.toLowerCase() : normalized;
}

export function isValidEmail(value = "") {
  return EMAIL_RE.test(normalizeLoginIdentifier(value));
}

export function isValidLoginIdentifier(value = "", role = "user") {
  const normalized = normalizeUserLogin(value);
  if (!normalized) return false;
  if (role === "user") return isValidEmail(normalized);
  return isValidEmail(normalized) || LEGACY_LOGIN_RE.test(normalized);
}

export function formatUserLogin(value = "") {
  const normalized = normalizeUserLogin(value);
  if (!normalized) return "";
  return normalized.includes("@") ? normalized : `@${normalized}`;
}
