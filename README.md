# Kleaning Planning

*Kleaning Planning - Système de gestion de planification pour Casoar Services Marrakech*

## 📋 Description

Kleaning Planning est une application web full-stack pour la gestion de la planification et des services de nettoyage. Elle permet de:
- Gérer les équipes et les membres
- Planifier les services et les lieux
- Authentifier les utilisateurs avec JWT
- Intégrer les calendriers Google
- Tracker les services extra

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** v18.0.0 ou supérieur
- **npm** v8.0.0 ou supérieur
- Un compte GitHub (pour le déploiement)
- Identifiants Google APIs (optionnel)

### Installation

1. **Cloner le dépôt**
```bash
git clone git@github.com:molosse/kleaning-planning.git
cd kleaning-planning
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Remplissez les variables dans `.env`:
```env
# Variables serveur
NODE_ENV=development
PORT=3001

# JWT Secret (générez une clé sécurisée)
JWT_SECRET=your_jwt_secret_key_here

# Google APIs (optionnel)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
```

## 📖 Utilisation

### Développement

Démarrer le serveur backend et le client frontend en développement:

```bash
# Terminal 1: Serveur backend (Express)
npm run dev

# Terminal 2: Frontend (Vite) - dans la racine du projet
npm run build  # ou ouvrir http://localhost:5173
```

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173
- Le proxy Vite redirige `/api` vers le backend

### Production

Construire pour la production:
```bash
npm run build   # Compile le frontend avec Vite
npm start       # Démarre le serveur en production
```

### Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur en développement |
| `npm start` | Démarre le serveur en production |
| `npm run build` | Compile le frontend avec Vite |
| `npm run setup` | Script de configuration initial |

## 📁 Structure du projet

```
kleaning-planning/
├── api/
│   └── server.js           # Serveur Express principal
├── src/
│   ├── App.jsx             # Composant React principal
│   ├── Login.jsx           # Page de connexion
│   └── main.jsx            # Point d'entrée React
├── data/
│   ├── equipe.json         # Données des équipes
│   ├── extras.json         # Services extra
│   ├── lieux.json          # Lieux de service
│   └── users.json          # Utilisateurs
├── scripts/
│   └── setup.js            # Script de configuration
├── public/                 # Fichiers statiques
├── logs/                   # Logs de l'application
├── index.html              # HTML principal
├── vite.config.js          # Configuration Vite
├── package.json            # Dépendances et scripts
└── README.md              # Ce fichier
```

## 🛠️ Technologies utilisées

### Backend
- **Express.js** 4.18.2 - Framework serveur web
- **jsonwebtoken** 9.0.2 - Authentification JWT
- **bcryptjs** 2.4.3 - Hachage des mots de passe
- **helmet** 7.1.0 - Sécurité HTTP
- **express-rate-limit** 7.1.5 - Limitation de débit
- **googleapis** 140.0.0 - Intégration Google APIs
- **dotenv** 16.3.1 - Variables d'environnement

### Frontend
- **React** 18.2.0 - Bibliothèque UI
- **React DOM** 18.2.0 - Rendu React
- **Vite** 5.0.8 - Bundler et serveur dev
- **@vitejs/plugin-react** 4.2.1 - Plugin React pour Vite

## 🔐 Sécurité

- Authentification par JWT
- Mots de passe hachés avec bcryptjs
- Limitation de débit des requêtes
- En-têtes de sécurité HTTP (Helmet)
- Variables d'environnement sécurisées

## ⚠️ Notes importantes

### Version Node.js
- Version actuelle requise: **v18+ ou v20+**
- Vite, Express Rate Limit et Helmet nécessitent Node.js 16+
- Vérifiez votre version: `node --version`

### Vulnérabilités de sécurité
Exécutez régulièrement:
```bash
npm audit
npm audit fix
```

## 📦 Dépendances

Voir [package.json](package.json) pour la liste complète des dépendances et versions.

Total: 173 packages installés

## 🚀 Déploiement sur Infomaniak

### Première installation

1. **Se connecter à la console Infomaniak** (Tableau de bord → Consoles)

2. **Cloner le dépôt**
```bash
cd ~/sites/planning.kleaning.ma
rm -rf * .*  2>/dev/null
git clone https://github.com/molosse/kleaning-planning.git .
```

3. **Installer les dépendances**
```bash
npm install --omit=dev
```

4. **Créer le dossier data**
```bash
mkdir -p data
```

5. **Créer le fichier `.env`** avec toutes les variables (JWT_SECRET, GOOGLE_*, NODE_ENV=production)

6. **Créer le compte admin**
```bash
node scripts/setup.js
```

7. **Paramètres avancés Node.js** (Infomaniak → Avancé → Node.js) :
   - Commande d'exécution : `node api/server.js`
   - Port d'écoute : `3001`

8. **Redémarrer** depuis le tableau de bord

### Mises à jour

```bash
cd ~/sites/planning.kleaning.ma && git pull origin main
```

Puis **Redémarrer** depuis le tableau de bord Infomaniak.

---

## 🤝 Contribuer

1. Fork le dépôt
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📜 License

Ce projet est propriétaire de Casoar Services Marrakech.

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement:

📧 **Email:** [Administrateur@kleaning.ma](mailto:Administrateur@kleaning.ma)

---

**Dernière mise à jour**: 24 mars 2026
