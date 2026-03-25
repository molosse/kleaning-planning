# Audit de Sécurité — planning.kleaning.ma
**Date :** 25 mars 2026

## Résultat global : FORT ✅

Les points critiques sont tous correctement implémentés. Les problèmes identifiés sont des améliorations, pas des vulnérabilités critiques.

---

## ✅ Points validés

| Domaine | Statut |
|---------|--------|
| HTTPS / SSL valide | ✅ |
| HSTS activé (1 an, includeSubDomains) | ✅ |
| X-Frame-Options: DENY (anti-clickjacking) | ✅ |
| X-Content-Type-Options: nosniff | ✅ |
| Referrer-Policy: no-referrer | ✅ |
| Version serveur non divulguée (pas de Server ni X-Powered-By) | ✅ |
| Routes API protégées — retournent 401 sans token | ✅ |
| Brute-force login bloqué (5 tentatives / 15 min) | ✅ |
| Messages d'erreur génériques (pas d'énumération utilisateurs) | ✅ |
| Rate limiting général (200 req/min) | ✅ |
| object-src: none, frame-src: none | ✅ |

---

## ⚠️ Points à corriger

### 1. `unsafe-inline` dans script-src — Priorité MOYENNE

**Problème :** Le CSP actuel dans `api/server.js` autorise le JavaScript inline :
```
script-src 'self' 'unsafe-inline'
```
Cela affaiblit significativement la protection XSS — un attaquant pouvant injecter du contenu peut exécuter du JavaScript arbitraire.

**Solution :** Supprimer `unsafe-inline` et utiliser un hash ou un nonce.
Puisque Vite bundle tout le JS en fichiers externes, `unsafe-inline` n'est pas nécessaire.

**Fichier à modifier :** `api/server.js` — directive `scriptSrc` dans la config Helmet.

```js
// Avant
scriptSrc: ["'self'", "'unsafe-inline'"],

// Après
scriptSrc: ["'self'"],
```

> ⚠️ Tester après modification que l'app React charge correctement.

---

### 2. Mismatch CSP / Google Fonts — Priorité FAIBLE

**Problème :** Le HTML charge des polices depuis `fonts.googleapis.com` et `fonts.gstatic.com`, mais le CSP déclare `font-src 'self'` — les polices sont bloquées silencieusement.

**Solution :** Soit autoriser les domaines Google Fonts dans le CSP, soit auto-héberger les polices.

**Option A — Autoriser dans le CSP (`api/server.js`) :**
```js
fontSrc: ["'self'", "https://fonts.gstatic.com"],
styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
```

**Option B — Auto-héberger les polices (recommandé) :**
Télécharger les polices et les servir depuis `/public/fonts/`.

---

### 3. `Permissions-Policy` manquant — Priorité FAIBLE

**Problème :** Aucun header `Permissions-Policy` n'est envoyé — pas de restriction explicite sur l'accès à la caméra, au micro ou à la géolocalisation.

**Solution :** Ajouter dans `api/server.js` après la config Helmet :
```js
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
```

---

## Plan d'action

| # | Problème | Priorité | Effort | Fichier |
|---|----------|----------|--------|---------|
| 1 | Supprimer `unsafe-inline` du CSP | Moyenne | Faible | `api/server.js` |
| 2 | Corriger font-src / Google Fonts | Faible | Faible | `api/server.js` ou `public/` |
| 3 | Ajouter Permissions-Policy | Faible | Très faible | `api/server.js` |
