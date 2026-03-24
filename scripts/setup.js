/**
 * KLEANING — SCRIPT DE CONFIGURATION INITIALE
 * Lancer une seule fois : node scripts/setup.js
 * Crée l'admin, initialise les fichiers de données
 */
const bcrypt = require("bcryptjs");
const fs     = require("fs");
const path   = require("path");
const crypto = require("crypto");
require("dotenv").config();

const DATA_DIR = path.join(__dirname, "../data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function writeIfAbsent(file, content) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(content, null, 2));
    console.log(`✅ ${file} créé`);
  } else {
    console.log(`ℹ️  ${file} existe déjà — ignoré`);
  }
}

async function main() {
  console.log("\n🧹 KLEANING — Configuration initiale\n");

  // Vérifier .env
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "REMPLACER_PAR_CLE_64_CHARS_ALEATOIRE") {
    const secret = crypto.randomBytes(64).toString("hex");
    console.log("⚠️  JWT_SECRET non défini. Utilisez cette valeur dans votre .env :");
    console.log(`JWT_SECRET=${secret}\n`);
  }

  // Créer l'admin
  const username = process.env.ADMIN_USERNAME || "jihad";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error("❌ ADMIN_PASSWORD non défini dans .env");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  const usersPath = path.join(DATA_DIR, "users.json");

  let users = [];
  if (fs.existsSync(usersPath)) {
    users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
  }

  const existingAdmin = users.find(u => u.role === "admin");
  if (!existingAdmin) {
    users.push({
      id: `u_${Date.now()}`,
      username,
      hash,
      displayName: "Jihad",
      role: "admin",
      createdAt: new Date().toISOString()
    });
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    console.log(`✅ Admin "${username}" créé`);
  } else {
    console.log(`ℹ️  Admin existe déjà (${existingAdmin.username})`);
  }

  // Initialiser les autres fichiers
  writeIfAbsent("extras.json", []);
  writeIfAbsent("lieux.json", []);
  writeIfAbsent("equipe.json", []);

  console.log("\n✅ Configuration terminée. Lancez : npm start\n");
}

main().catch(console.error);
