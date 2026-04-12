import { useEffect } from "react";
import {
  authApi,
  configApi,
  equipeApi,
  extrasApi,
  lieuxApi,
  planningApi,
  usersApi,
} from "../lib/api.mjs";
import { normalizeLieuRecord } from "../lib/lieux.mjs";
import { normalizeEmployeeRecord } from "../lib/team.mjs";

export default function useAppBootstrap({
  user,
  onglet,
  setUser,
  setOnglet,
  setExtras,
  setLieux,
  setUsers,
  setEquipe,
  setTypesLogement,
  setHistorique,
}) {
  const chargerExtras = () =>
    extrasApi.list().then((data) => {
      if (data.extras) setExtras(data.extras);
    });

  const chargerLieux = () =>
    lieuxApi.list().then((data) => {
      if (data.lieux) setLieux(data.lieux.map(normalizeLieuRecord));
    });

  const chargerUsers = () =>
    usersApi.list().then((data) => {
      if (data.users) setUsers(data.users);
    });

  const chargerEquipe = () =>
    equipeApi.list().then((data) => {
      if (data.equipe?.length) {
        setEquipe(data.equipe.map(normalizeEmployeeRecord));
      }
    });

  const chargerTypes = () =>
    configApi.listTypes().then((data) => {
      if (data.types?.length) setTypesLogement(data.types);
    });

  const chargerHistorique = () =>
    planningApi.listHistory().then((data) => {
      if (data.historique) setHistorique(data.historique);
    });

  const chargerDetailHistorique = async (date) => {
    const data = await planningApi.historyDetail(date);
    if (data.chaines) {
      setHistorique((prev) =>
        prev.map((entry) => (entry.date === date ? { ...entry, chaines: data.chaines } : entry))
      );
    }
  };

  useEffect(() => {
    authApi.me().then((data) => {
      if (data.username) setUser(data);
    }).catch(() => {});
  }, [setUser]);

  useEffect(() => {
    if (!user) return;
    chargerExtras();
    chargerLieux();
    chargerEquipe();
    chargerHistorique();
    chargerTypes();
    if (user.role === "admin") chargerUsers();
  }, [user]);

  useEffect(() => {
    if (onglet === "historique") chargerHistorique();
  }, [onglet]);

  useEffect(() => {
    if (user && user.role !== "admin" && onglet === "historique") {
      setOnglet("planning");
    }
  }, [user, onglet, setOnglet]);

  return {
    chargerDetailHistorique,
  };
}
