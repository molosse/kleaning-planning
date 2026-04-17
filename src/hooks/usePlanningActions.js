import { CLIENT_IC, TYPE_IC } from "../constants";
import { planningApi } from "../lib/api.mjs";
import {
  autoAssigner,
  buildWhatsAppText,
  construireChainesSolo,
  mergeChainesAtIndexes,
  optimiser,
  parseEv,
  removeChaineAtIndex,
  splitChaineAtIndex,
  updateInterventionInChaines,
} from "../lib/planning.mjs";

export default function usePlanningActions({
  dateQ,
  lieux,
  equipe,
  extras,
  autoAssocierLogements,
  chaines,
  waText,
  setLoading,
  setMsg,
  setWaText,
  setChaines,
  setAssocierMode,
  setConfirmDialog,
  setCopied,
  setWaSent,
  setShowWA,
}) {
  const chargerAgenda = async () => {
    setLoading(true);
    setMsg("");
    setWaText("");
    const [day, month, year] = dateQ.split("/");
    const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const data = await planningApi.calendar(date);

    if (data?.message && !data?.events) {
      setChaines([]);
      setMsg(`❌ ${data.message}`);
    } else if (data.events?.length > 0) {
      const parsed = data.events.map((event) => parseEv(event, lieux, 12 * 60));
      const optimised = autoAssocierLogements ? optimiser(parsed) : construireChainesSolo(parsed);
      const nextChaines = autoAssigner(optimised, equipe || [], extras || [], date);
      setChaines(nextChaines);
      setMsg(`✅ ${parsed.length} interventions · ${nextChaines.length} chaînes · employées assignées`);
    } else {
      setChaines([]);
      setMsg(`ℹ️ Aucun événement — ${dateQ}`);
    }

    setLoading(false);
  };

  const relancerAssignation = () => {
    const [day, month, year] = dateQ.split("/");
    const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    setChaines((prev) => autoAssigner(prev, equipe || [], extras || [], date));
    setWaText("");
  };

  const changeInChaine = (ci, ii, field, value) => {
    setChaines((prev) => updateInterventionInChaines(prev, ci, ii, field, value));
    setWaText("");
  };

  const supprimerChaine = (ci) => {
    setConfirmDialog({
      visible: true,
      title: "Supprimer la chaîne?",
      message: "Cette chaîne sera retirée du planning. L'action ne peut pas être annulée.",
      onConfirm: () => {
        setChaines((prev) => removeChaineAtIndex(prev, ci));
        setWaText("");
        setConfirmDialog({ visible: false, title: "", message: "", onConfirm: null });
      },
    });
  };

  const associerChaines = (ci1, ci2) => {
    setChaines((prev) => mergeChainesAtIndexes(prev, ci1, ci2));
    setAssocierMode(null);
    setWaText("");
  };

  const separerChaine = (ci) => {
    setChaines((prev) => splitChaineAtIndex(prev, ci));
    setWaText("");
  };

  const genWA = () => {
    const text = buildWhatsAppText(dateQ, chaines, CLIENT_IC, TYPE_IC);
    setWaText(text);
    setCopied(false);
    setWaSent(false);
    setShowWA(true);

    const [day, month, year] = dateQ.split("/");
    const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const dateLabel = new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    planningApi.save({ date, dateLabel, chaines }).catch(() => {});
  };

  const copier = () => {
    if (!waText) return;
    const textarea = document.createElement("textarea");
    textarea.value = waText;
    textarea.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {}
    document.body.removeChild(textarea);
  };

  return {
    chargerAgenda,
    relancerAssignation,
    changeInChaine,
    supprimerChaine,
    associerChaines,
    separerChaine,
    genWA,
    copier,
  };
}
