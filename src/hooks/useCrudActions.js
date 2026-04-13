import {
  authApi,
  configApi,
  equipeApi,
  extrasApi,
  lieuxApi,
  usersApi,
} from "../lib/api.mjs";
import { normalizeLieuRecord, prepareLieuPayload } from "../lib/lieux.mjs";
import { normalizeEmployeeRecord } from "../lib/team.mjs";
import {
  formatUserLogin,
  isValidLoginIdentifier,
  normalizeUserLogin,
} from "../lib/users.mjs";

export default function useCrudActions({
  equipe,
  setEquipe,
  newEmp,
  setNewEmp,
  setEmpMsg,
  setDaysOffEmpId,
  extras,
  setExtras,
  newExtra,
  setNewExtra,
  lieux,
  setLieux,
  setWizard,
  setMsg,
  setEditLieu,
  users,
  setUsers,
  newUser,
  setNewUser,
  setUserMsg,
  editUserForm,
  setEditUserForm,
  setEditUserId,
  pwdValue,
  setPwdValue,
  setPwdUserId,
  typesLogement,
  setTypesLogement,
  newType,
  setNewType,
  setConfirmDialog,
  setUser,
}) {
  const ajouterEmp = async () => {
    const { nom, emoji } = newEmp;
    if (!nom.trim()) return;
    const data = await equipeApi.create({ nom: nom.trim(), emoji: emoji || "👤" });
    if (data.employe) {
      setEquipe((prev) => [...prev, normalizeEmployeeRecord(data.employe)]);
      setNewEmp({ nom: "", emoji: "👤" });
      setEmpMsg(`✅ "${data.employe.nom}" ajoutée`);
      return;
    }
    setEmpMsg(data.message || "Erreur");
  };

  const supprimerEmp = async (id) => {
    const employee = equipe.find((current) => current.id === id);
    setConfirmDialog({
      visible: true,
      title: `Retirer ${employee?.nom}?`,
      message: `L'employée "${employee?.nom}" sera retirée de l'équipe. Cette action ne peut pas être annulée.`,
      onConfirm: async () => {
        const data = await equipeApi.remove(id);
        if (data.message) {
          setEquipe((prev) => prev.filter((current) => current.id !== id));
          setEmpMsg(`🗑 "${employee?.nom}" retirée`);
        }
        setConfirmDialog({ visible: false, title: "", message: "", onConfirm: null });
      },
    });
  };

  const toggleEmpActif = async (id, actif) => {
    const data = await equipeApi.update(id, { actif });
    if (data.employe) {
      setEquipe((prev) => prev.map((current) => (current.id === id ? normalizeEmployeeRecord(data.employe) : current)));
    }
  };

  const saveEmpDaysOff = async (id, weekdays) => {
    const data = await equipeApi.update(id, { joursOff: weekdays });
    if (data.employe) {
      setEquipe((prev) => prev.map((current) => (current.id === id ? normalizeEmployeeRecord(data.employe) : current)));
      setEmpMsg(`✅ Jours off mis a jour pour "${data.employe.nom}"`);
      setTimeout(() => setEmpMsg(""), 3000);
      setDaysOffEmpId(null);
      return;
    }
    setEmpMsg(data.message || "Erreur");
  };

  const ajouterExtra = async () => {
    const trimmed = newExtra.trim();
    if (!trimmed) return;
    const data = await extrasApi.create(trimmed);
    if (data.extra) {
      setExtras((prev) => [...prev, data.extra]);
      setNewExtra("");
    }
  };

  const supprimerExtra = async (id) => {
    await extrasApi.remove(id);
    setExtras((prev) => prev.filter((extra) => extra.id !== id));
  };

  const ajouterLieu = async (lieu) => {
    const data = await lieuxApi.create(prepareLieuPayload(lieu));
    if (data.logement) {
      setLieux((prev) => [...prev, normalizeLieuRecord(data.logement)]);
      setWizard(false);
      setMsg(`✅ "${data.logement.nom}" ajouté`);
    }
  };

  const supprimerLieu = async (id) => {
    const lieu = lieux.find((current) => current.id === id);
    setConfirmDialog({
      visible: true,
      title: `Supprimer ${lieu?.nom}?`,
      message: `Le logement "${lieu?.nom}" sera supprimé définitivement. Cette action ne peut pas être annulée.`,
      onConfirm: async () => {
        await lieuxApi.remove(id);
        setLieux((prev) => prev.filter((current) => current.id !== id));
        setMsg(`🗑 "${lieu?.nom}" supprimé`);
        setConfirmDialog({ visible: false, title: "", message: "", onConfirm: null });
      },
    });
  };

  const modifierLieu = async (id, data) => {
    const res = await lieuxApi.update(id, prepareLieuPayload(data));
    if (res.logement) {
      setLieux((prev) => prev.map((lieu) => (lieu.id === id ? normalizeLieuRecord(res.logement) : lieu)));
      setEditLieu(null);
      setMsg("✅ Mis à jour");
    }
  };

  const creerUser = async () => {
    const payload = {
      ...newUser,
      username: normalizeUserLogin(newUser.username),
      displayName: newUser.displayName.trim(),
    };

    if (!payload.username) {
      setUserMsg(payload.role === "user" ? "Email de connexion requis" : "Identifiant admin requis");
      return;
    }

    if (!isValidLoginIdentifier(payload.username, payload.role)) {
      setUserMsg(payload.role === "user" ? "Email invalide pour ce compte utilisateur" : "Identifiant admin invalide");
      return;
    }

    const data = await usersApi.create(payload);
    if (data.user) {
      setUsers((prev) => [...prev, data.user]);
      setNewUser({ username: "", password: "", displayName: "", role: "user" });
      setUserMsg(`✅ "${data.user.displayName}" créé`);
      return;
    }
    setUserMsg(data.message || "Erreur");
  };

  const updateNewUser = (field, value) => setNewUser((prev) => ({ ...prev, [field]: value }));

  const ouvrirEditionUser = (user) => {
    setEditUserId(user.id);
    setEditUserForm({ username: user.username || "", displayName: user.displayName || "" });
  };

  const updateEditUserForm = (field, value) => setEditUserForm((prev) => ({ ...prev, [field]: value }));

  const annulerEditionUser = () => {
    setEditUserId(null);
    setEditUserForm({ username: "", displayName: "" });
  };

  const sauverEditionUser = async (id) => {
    const currentUser = users.find((current) => current.id === id);
    const nextUsername = normalizeUserLogin(editUserForm.username);
    const nextDisplayName = editUserForm.displayName.trim();
    const payload = {};

    if (nextUsername && nextUsername !== currentUser?.username) {
      payload.username = nextUsername;
    }

    if (nextDisplayName && nextDisplayName !== currentUser?.displayName) {
      payload.displayName = nextDisplayName;
    }

    if (payload.username && !isValidLoginIdentifier(payload.username, "user")) {
      setUserMsg("Email invalide pour ce compte utilisateur");
      return;
    }

    if (!payload.username && !payload.displayName) {
      setUserMsg("Aucune modification à enregistrer");
      return;
    }

    const data = await usersApi.update(id, payload);
    if (data.user) {
      setUsers((prev) => prev.map((current) => (current.id === id ? data.user : current)));
      setUserMsg(data.message || "✅ Profil utilisateur mis à jour");
      annulerEditionUser();
      return;
    }
    setUserMsg(data.message || "Erreur");
  };

  const ouvrirPasswordUser = (id) => {
    setPwdUserId(id);
    setPwdValue("");
  };

  const annulerPasswordUser = () => {
    setPwdUserId(null);
    setPwdValue("");
  };

  const changerPasswordUser = async (id) => {
    const password = pwdValue.trim();
    if (!password) {
      setUserMsg("Mot de passe requis");
      return;
    }
    const data = await usersApi.updatePassword(id, password);
    if (data.message) {
      setUserMsg(`✅ ${data.message}`);
      annulerPasswordUser();
      return;
    }
    setUserMsg(data.message || "Erreur");
  };

  const supprimerUser = async (id) => {
    const user = users.find((current) => current.id === id);
    setConfirmDialog({
      visible: true,
      title: `Supprimer ${user?.displayName}?`,
      message: `L'utilisateur "${user?.displayName}" (${formatUserLogin(user?.username)}) sera supprimé définitivement. Cette action ne peut pas être annulée.`,
      onConfirm: async () => {
        const data = await usersApi.remove(id);
        if (data.message) {
          setUsers((prev) => prev.filter((current) => current.id !== id));
          setUserMsg(data.message);
        }
        setConfirmDialog({ visible: false, title: "", message: "", onConfirm: null });
      },
    });
  };

  const supprimerTypeLogement = async (type) => {
    const next = typesLogement.filter((current) => current !== type);
    if (next.length === 0) return;
    const res = await configApi.saveTypes(next);
    if (res.types) setTypesLogement(res.types);
  };

  const ajouterTypeLogement = async () => {
    const trimmed = newType.trim();
    if (!trimmed) return;
    const next = [...typesLogement, trimmed];
    const res = await configApi.saveTypes(next);
    if (res.types) {
      setTypesLogement(res.types);
      setNewType("");
    }
  };

  const logout = () => {
    authApi.clearSession();
    setUser(null);
  };

  return {
    ajouterEmp,
    supprimerEmp,
    toggleEmpActif,
    saveEmpDaysOff,
    ajouterExtra,
    supprimerExtra,
    ajouterLieu,
    supprimerLieu,
    modifierLieu,
    creerUser,
    updateNewUser,
    ouvrirEditionUser,
    updateEditUserForm,
    annulerEditionUser,
    ouvrirPasswordUser,
    annulerPasswordUser,
    changerPasswordUser,
    sauverEditionUser,
    supprimerUser,
    supprimerTypeLogement,
    ajouterTypeLogement,
    logout,
  };
}
