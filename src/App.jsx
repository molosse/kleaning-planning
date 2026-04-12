import { Suspense, lazy, useState } from "react";
import AppHeader from "./components/AppHeader.jsx";
import ChargeBottomSheet from "./components/ChargeBottomSheet.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import useAppBootstrap from "./hooks/useAppBootstrap.js";
import useCrudActions from "./hooks/useCrudActions.js";
import usePlanningActions from "./hooks/usePlanningActions.js";
import Login from "./Login.jsx";
import MobileNav from "./components/MobileNav.jsx";
import WhatsAppBottomSheet from "./components/WhatsAppBottomSheet.jsx";
import { RefreshCw } from "lucide-react";
import {
  DS,
} from "./constants";
import { createGlobalCss } from "./styles/globalCss.js";
import {
  buildTabs,
  countUnderstaffedVillas,
  countUnassignedInterventions,
  getInitialDateQ,
  getSelectedWeekday,
} from "./lib/appState.mjs";
import {
  buildChargeByEmployee,
  buildConflits,
  isVillaInter,
} from "./lib/planning.mjs";
import { createDefaultEquipe, normalizeWeekdays } from "./lib/team.mjs";

const DaysOffWeekModal = lazy(() => import("./components/DaysOffWeekModal.jsx"));
const PropertyWizard = lazy(() => import("./components/PropertyWizard.jsx"));
const ExtrasTab = lazy(() => import("./components/tabs/ExtrasTab.jsx"));
const HistoryTab = lazy(() => import("./components/tabs/HistoryTab.jsx"));
const PlanningTab = lazy(() => import("./components/tabs/PlanningTab.jsx"));
const PropertiesTab = lazy(() => import("./components/tabs/PropertiesTab.jsx"));
const SettingsTab = lazy(() => import("./components/tabs/SettingsTab.jsx"));
const TeamTab = lazy(() => import("./components/tabs/TeamTab.jsx"));
const UsersTab = lazy(() => import("./components/tabs/UsersTab.jsx"));

// ═══════════════════════════════════════════════════════════════
// KLEANING — APP MOBILE-FIRST v6
// ═══════════════════════════════════════════════════════════════
// Design : utilitarian + épuré, optimisé mobile/tactile
// Breakpoints: mobile < 640px | tablet 640-1024px | desktop > 1024px
//
// DESIGN SYSTEM:Tous les styles utilisent le design system centralisé (DS) importé
// de ./constants/colors.js. Pour modifier les couleurs → Éditer src/constants/colors.js
// - DS.brand (#c84b1f) : Couleur primaire (marque)
// - DS.ink : Texte sombre (#0f1117)
// - DS.paper : Fond clair (#f8f7f4)
// - DS.sage/amber/cobalt/ruby : Couleurs de statuts
//
// ACCESSIBILITÉ: Tous les touch targets (boutons, inputs) = min 44px pour mobile
// MOBILE-FIRST: Media queries à 640px pour responsive design
// ═══════════════════════════════════════════════════════════════

const GLOBAL_CSS = createGlobalCss(DS);


// ── APP PRINCIPALE ────────────────────────────────────────────
// Point d'entrée de l'application. Gère :
//   - L'authentification (user = null → écran Login)
//   - La navigation entre onglets (planning / historique / lieux / extras / equipe / users)
//   - Toutes les données métier : chaines, lieux, extras, equipe, historique
//   - Les actions utilisateur : charger agenda, modifier interventions, générer WhatsApp
export default function App(){
  // ── Authentification & navigation ──────────────────────────
  const[user,setUser]=useState(null);                  // Utilisateur connecté (null = non connecté)
  const[onglet,setOnglet]=useState("planning");         // Onglet actif
  // ── Planning : date & chargement ───────────────────────────
  const[dateQ,setDateQ]=useState(getInitialDateQ);      // Initialisé à J+1
  const[loading,setLoading]=useState(false);            // Indicateur de chargement agenda
  // Option case à cocher "Associer automatiquement les logements" :
  // Si true → l'algorithme `optimiser()` regroupe les interventions en chaînes de 2
  // Si false (défaut) → chaque intervention reste en chaîne solo indépendante
  const[autoAssocierLogements,setAutoAssocierLogements]=useState(false);
  const[msg,setMsg]=useState("");                       // Message de statut (succès / erreur / info)
  // ── Données métier ─────────────────────────────────────────
  const[lieux,setLieux]=useState([]);                   // Liste des logements (data/lieux.json)
  const[extras,setExtras]=useState([]);                 // Extras mémorisés (data/extras.json)
  const[users,setUsers]=useState([]);                   // Comptes utilisateurs (admin seulement)
  // ── Paramètres planning ────────────────────────────────────
  const[chaines,setChaines]=useState([]);               // Tableau de chaînes [{inters,trajetTotal,dureeTotal}]
  const[associerMode,setAssocierMode]=useState(null);   // index de la chaîne en attente d'association
  const[searchLieux,setSearchLieux]=useState("");       // Filtre texte dans l'onglet Logements
  // ── Historique des plannings ───────────────────────────────
  const[historique,setHistorique]=useState([]);         // Liste des entrées historique (métadonnées)
  const[histExpanded,setHistExpanded]=useState(null);   // Date du planning actuellement développé
  const[histVisible,setHistVisible]=useState(15);       // Nombre d'entrées affichées (charge +15 sur demande)
  // ── WhatsApp ───────────────────────────────────────────────
  const[waText,setWaText]=useState("");                 // Texte généré pour WhatsApp
  const[copied,setCopied]=useState(false);              // Feedback visuel bouton "Copier"
  const[waSent,setWaSent]=useState(false);              // Feedback visuel bouton "WhatsApp"
  // ── UI modaux / formulaires ────────────────────────────────
  const[wizard,setWizard]=useState(false);              // Afficher le wizard ajout logement
  const[newExtra,setNewExtra]=useState("");             // Champ saisie extra
  const[newUser,setNewUser]=useState({username:"",password:"",displayName:"",role:"user"}); // Formulaire création compte
  const[userMsg,setUserMsg]=useState("");               // Retour création/suppression utilisateur
  const[editUserId,setEditUserId]=useState(null);         // ID du compte utilisateur en édition (nom/identifiant)
  const[editUserForm,setEditUserForm]=useState({username:"",displayName:""}); // Formulaire édition compte utilisateur
  const[pwdUserId,setPwdUserId]=useState(null);           // ID du compte dont on modifie le mot de passe (user/admin)
  const[pwdValue,setPwdValue]=useState("");              // Nouveau mot de passe saisi
  const[editLieu,setEditLieu]=useState(null);           // Logement en cours d'édition inline (null = aucun)
  // ── Types de logements dynamiques (chargés depuis config.json via API) ──
  const[typesLogement,setTypesLogement]=useState(["Villa","Appartement","Bureau","Riad"]);
  const[newType,setNewType]=useState("");               // Champ saisie nouveau type (Paramètres)
  const[showWA,setShowWA]=useState(false);              // BottomSheet WhatsApp sur mobile
  const[showCharge,setShowCharge]=useState(false);      // BottomSheet charge du jour sur mobile
  // ── Confirmation Dialog pour suppressions ──────────────
  const[confirmDialog,setConfirmDialog]=useState({visible:false,title:"",message:"",onConfirm:null});
  // ── Équipe fixe (chargée depuis API, avec fallback) ────────
  const[equipe,setEquipe]=useState(createDefaultEquipe);
  const[newEmp,setNewEmp]=useState({nom:"",emoji:"👤"});// Formulaire ajout employée
  const[empMsg,setEmpMsg]=useState("");                 // Retour ajout/suppression employée
  const[daysOffEmpId,setDaysOffEmpId]=useState(null);    // Modale jours off hebdo {id employée}
  const selectedWeekday=getSelectedWeekday(dateQ);

  const { chargerDetailHistorique } = useAppBootstrap({
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
  });

  const {
    chargerAgenda,
    changeInChaine,
    supprimerChaine,
    associerChaines,
    separerChaine,
    genWA,
    copier,
  } = usePlanningActions({
    dateQ,
    lieux,
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
  });
  const {
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
  } = useCrudActions({
    equipe,
    setEquipe,
    newEmp,
    setNewEmp,
    setEmpMsg,
    setDaysOffEmpId,
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
  });

  // ── CALCULS DÉRIVÉS ────────────────────────────────────────
  const nbSans=countUnassignedInterventions(chaines);
  const nbVilla=countUnderstaffedVillas(chaines);
  const conflits=buildConflits(chaines,equipe);
  const ch=buildChargeByEmployee(chaines);
  const TABS=buildTabs(user?.role);

  if(!user)return<Login onLogin={u=>{setUser(u);}}/>;

  return(
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",background:DS.paper,minHeight:"100vh",paddingBottom:"calc(70px + env(safe-area-inset-bottom, 0px))"}}>

        <AppHeader
          userDisplayName={user.displayName}
          tabs={TABS}
          activeTab={onglet}
          onSelectTab={setOnglet}
          onLogout={logout}
        />

        {/* ── CONTENU PRINCIPAL —————────────────────────────────
            Layout responsive : 100% wide sur mobile, max-width sur desktop
            Tous les changements de couleur utilisent DS tokens (marque/statuts)
            ────────────────────────────────────────────────────── */}
        <div style={{maxWidth:1080,margin:"0 auto",padding:"14px 14px"}}>
          <Suspense fallback={
            <div className="card" style={{padding:"20px 18px",display:"flex",alignItems:"center",gap:10,color:DS.ink2}}>
              <RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/>
              Chargement de l'onglet…
            </div>
          }>

          {/* ═══ PLANNING ═══════════════════════════════════ */}
          {onglet==="planning"&&(
            <PlanningTab
              dateQ={dateQ}
              loading={loading}
              onLoadAgenda={chargerAgenda}
              autoAssocierLogements={autoAssocierLogements}
              onAutoAssocierChange={setAutoAssocierLogements}
              msg={msg}
              nbSans={nbSans}
              nbVilla={nbVilla}
              chaines={chaines}
              associerMode={associerMode}
              onAssocierModeChange={setAssocierMode}
              onSeparateChaine={separerChaine}
              onAssocierChaines={associerChaines}
              onDeleteChaine={supprimerChaine}
              extras={extras}
              equipe={equipe}
              selectedWeekday={selectedWeekday}
              onChangeInChaine={changeInChaine}
              isVillaInter={isVillaInter}
              chargeByEmployee={ch}
              conflits={conflits}
              onOpenCharge={()=>setShowCharge(true)}
              onGenerateWhatsApp={genWA}
              waText={waText}
              copied={copied}
              waSent={waSent}
              onCopyWhatsApp={copier}
              onOpenWhatsApp={()=>{window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`,"_blank");setWaSent(true);}}
            />
          )}

          {/* ═══ HISTORIQUE ═══════════════════════════════ */}
          {onglet==="historique"&&(
            <HistoryTab
              historique={historique}
              histVisible={histVisible}
              histExpanded={histExpanded}
              onToggleEntry={(h,isOpen)=>{
                if(isOpen){setHistExpanded(null);return;}
                setHistExpanded(h.date);
                if(!h.chaines) chargerDetailHistorique(h.date).catch(()=>{});
              }}
              onShowMore={()=>setHistVisible(p=>p+15)}
            />
          )}

          {/* ═══ LOGEMENTS ════════════════════════════════ */}
          {onglet==="lieux"&&(
            <PropertiesTab
              lieux={lieux}
              userRole={user.role}
              onOpenWizard={()=>setWizard(true)}
              searchLieux={searchLieux}
              onSearchChange={setSearchLieux}
              msg={msg}
              editLieu={editLieu}
              setEditLieu={setEditLieu}
              typesLogement={typesLogement}
              onDeleteLieu={supprimerLieu}
              onSaveLieu={modifierLieu}
            />
          )}

          {/* ═══ EXTRAS ═══════════════════════════════════ */}
          {onglet==="extras"&&(
            <ExtrasTab
              extras={extras}
              newExtra={newExtra}
              onNewExtraChange={setNewExtra}
              onAddExtra={ajouterExtra}
              onDeleteExtra={supprimerExtra}
            />
          )}


          {/* ═══ ÉQUIPE FIXE ══════════════════════════ */}
          {onglet==="equipe"&&(
            <TeamTab
              userRole={user.role}
              equipe={equipe}
              newEmp={newEmp}
              onNewEmpChange={setNewEmp}
              onAddEmp={ajouterEmp}
              onDeleteEmp={supprimerEmp}
              onToggleEmp={toggleEmpActif}
              onOpenDaysOff={setDaysOffEmpId}
              empMsg={empMsg}
              selectedWeekday={selectedWeekday}
            />
          )}

          {/* ═══ UTILISATEURS ════════════════════════════ */}
          {onglet==="users"&&user.role==="admin"&&(
            <UsersTab
              userMsg={userMsg}
              newUser={newUser}
              onNewUserChange={updateNewUser}
              onCreateUser={creerUser}
              users={users}
              editUserId={editUserId}
              editUserForm={editUserForm}
              onEditUserFormChange={updateEditUserForm}
              onOpenEditUser={ouvrirEditionUser}
              onSaveEditUser={sauverEditionUser}
              onCancelEditUser={annulerEditionUser}
              pwdUserId={pwdUserId}
              pwdValue={pwdValue}
              onPwdValueChange={setPwdValue}
              onOpenPasswordChange={ouvrirPasswordUser}
              onSavePassword={changerPasswordUser}
              onCancelPassword={annulerPasswordUser}
              currentUserId={user.id}
              onDeleteUser={supprimerUser}
            />
          )}

          {/* ═══ PARAMÈTRES (admin) ═══════════════════════ */}
          {onglet==="params"&&user.role==="admin"&&(
            <SettingsTab
              typesLogement={typesLogement}
              newType={newType}
              onNewTypeChange={setNewType}
              onAddType={ajouterTypeLogement}
              onDeleteType={supprimerTypeLogement}
            />
          )}
          </Suspense>
        </div>

        {/* ── NAVIGATION BAS — Interface mobile (<640px) ──────
            Navigation fixe en bas : 5 onglets + bouton déconnexion
            - Affichée UNIQUEMENT sur mobile via media query (@media max-width:640px)
            - minHeight:56px pour touch target accessible (44px min + padding)
            - borderTop utilise DS.brand (#c84b1f) pour l'onglet actif
            - Safe-area-inset-bottom pour notches iOS en bas
            - Position:fixed pour rester visible au scroll
            ──────────────────────────────────────────────────── */}
        <MobileNav tabs={TABS} activeTab={onglet} onSelectTab={setOnglet} onLogout={logout} />

        {/* ── BOTTOM SHEETS MOBILES ═══════════════════════════
            Composants drawer mobiles : montent du bas avec animation slideUp
            Utilisés pour afficher des infos détaillées sur petit écran
            - Masqués sur desktop via showCharge/showWA
            - Padding: safe-area-inset pour notches iOS en bas
            - Animation slideUp (.25s) et fond semi-transparent
            ──────────────────────────────────────────────────── */}

        <ChargeBottomSheet
          visible={showCharge}
          onClose={()=>setShowCharge(false)}
          equipe={equipe}
          chargeByEmployee={ch}
          conflits={conflits}
        />

        <WhatsAppBottomSheet
          visible={showWA}
          onClose={()=>setShowWA(false)}
          waText={waText}
          copied={copied}
          waSent={waSent}
          onCopy={copier}
          onOpenWhatsApp={()=>{window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`,"_blank");setWaSent(true);}}
        />

        {/* Confirmation Dialog pour aux suppressions */}
        <ConfirmDialog
          visible={confirmDialog.visible}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={()=>setConfirmDialog({visible:false,title:"",message:"",onConfirm:null})}
        />

        {/* Wizard ajout logement — modale plein écran, rendu conditionnellement */}
        {wizard&&(
          <Suspense fallback={null}>
            <PropertyWizard onSave={ajouterLieu} onClose={()=>setWizard(false)} lieux={lieux} typesLogement={typesLogement}/>
          </Suspense>
        )}

        {daysOffEmpId&&(
          <Suspense fallback={null}>
            <DaysOffWeekModal
              visible={true}
              empName={equipe.find(e=>e.id===daysOffEmpId)?.nom||""}
              initialWeekdays={normalizeWeekdays(equipe.find(e=>e.id===daysOffEmpId)?.joursOff)}
              onSave={weekdays=>saveEmpDaysOff(daysOffEmpId,weekdays)}
              onCancel={()=>setDaysOffEmpId(null)}
            />
          </Suspense>
        )}


      </div>
    </>
  );
}
