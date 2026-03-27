import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Login from "./Login.jsx";
import { LocationIcon, TimeIcon, PropertyIcon, TeamIcon, DeleteIcon } from "./icons/index.jsx";
import {
  CalendarDays, UserPlus, Settings,
  RefreshCw, Send, Copy, Check,  ChevronRight,
  Plus, X, Edit2, AlertTriangle,
  Building2, Castle, Briefcase, Star,
  LogOut, Menu, Zap, CheckCircle2, ShirtIcon,
} from "lucide-react";
import {
  DS, DS_LOGIN, CHAINE_COLORS,
  EQUIPE, EQUIPE_FALLBACK,
  TYPE_IC, CLIENT_IC, TYPES, CENTRE,
  QUARTIERS,
} from "./constants";

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

// ── CSS GLOBAL ────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap");

  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { margin: 0; font-family: 'Bricolage Grotesque', 'Segoe UI', system-ui, -apple-system, sans-serif; background: ${DS.paper}; color: ${DS.ink}; }
  input, select, button, textarea { font-family: inherit; }
  button { cursor: pointer; }

  /* Scrollbar élégante */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${DS.paper3}; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: ${DS.line}; }

  /* Animations */
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .5; } }
  .fade-in { animation: fadeIn 0.25s ease-out; }

  /* Boutons interactifs — hover/active */
  .btn-primary {
    background: ${DS.brand};
    color: white;
    transition: transform .15s, box-shadow .15s;
    border: none;
    border-radius: ${DS.radiusMd};
    padding: 10px 20px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(200,75,31,.3);
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(200,75,31,.35);
    background: #b03f16;
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    background: ${DS.paper2};
    color: ${DS.ink};
    border: 1px solid ${DS.line};
    border-radius: ${DS.radiusMd};
    padding: 10px 20px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: background .15s;
  }
  .btn-secondary:hover { background: ${DS.paper3}; }

  .btn-ghost:hover { background: rgba(200,75,31,0.08) !important; }
  .btn-danger:hover { background: ${DS.rubySoft} !important; color: ${DS.ruby} !important; }

  /* Inputs focus */
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: ${DS.brand} !important;
    background: #fffbf7 !important;
  }

  /* Navigation bottom mobile */
  .nav-bottom { display: none; }
  @media (max-width: 640px) {
    .nav-top-tabs { display: none !important; }
    .nav-bottom { display: flex !important; }
    .layout-2col { grid-template-columns: 1fr !important; }
    .panel-right { position: static !important; }
    .desktop-only { display: none !important; }
    .mobile-only { display: flex !important; }
  }
  @media (min-width: 641px) {
    .mobile-only { display: none !important; }
  }

  /* Touch targets minimum 44px */
  .tap-target { min-height: 44px; min-width: 44px; }

  /* Scroll smooth */
  .scroll-x { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .scroll-x::-webkit-scrollbar { display: none; }

  /* Typography */
  .display {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 1.05;
    letter-spacing: -0.02em;
    font-weight: 400;
  }
  .h2 {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${DS.ink};
    margin: 0 0 8px 0;
  }
  .h3 {
    font-size: 18px;
    font-weight: 600;
    color: ${DS.ink};
    margin: 0 0 6px 0;
  }
  .body {
    font-size: 15px;
    color: ${DS.ink2};
    line-height: 1.65;
  }
  .mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  }

  /* Cards */
  .card {
    background: white;
    border-radius: ${DS.radiusLg};
    border: 1px solid ${DS.line};
    box-shadow: 0 1px 3px rgba(15,17,23,.06), 0 1px 2px rgba(15,17,23,.04);
  }

  /* Badge chips */
  .chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 100px;
    font-size: 12px; font-weight: 600;
    border: 1px solid transparent;
  }

  /* Status badges */
  .badge-wait { background: ${DS.amberSoft}; color: ${DS.amber}; }
  .badge-active { background: ${DS.cobaltSoft}; color: ${DS.cobalt}; }
  .badge-done { background: ${DS.sageSoft}; color: ${DS.sage}; }
  .badge-urgent { background: ${DS.brandSoft}; color: ${DS.brand}; }
  .badge-litige { background: ${DS.rubySoft}; color: ${DS.ruby}; }

  /* Séparateur */
  .divider { height: 1px; background: ${DS.line}; margin: 12px 0; }

  /* Section label */
  .section-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: ${DS.ink3};
  }
`;


// ── UTILITAIRES ───────────────────────────────────────────────

// Calcul de la distance à vol d'oiseau entre deux points GPS (formule Haversine)
// Retourne la distance en km. Si les coords manquent, on suppose 5 km par défaut.
function distKm(a,b){if(!a||!b)return 5;const R=6371,dlat=Math.PI/180*(b.lat-a.lat),dlng=Math.PI/180*(b.lng-a.lng);const x=Math.sin(dlat/2)**2+Math.cos(Math.PI/180*a.lat)*Math.cos(Math.PI/180*b.lat)*Math.sin(dlng/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
// Vitesse scooter en milieu urbain Marrakech : ~35 km/h + 3 min arrêt/stationnement
// Utilisé pour estimer les temps de trajet entre deux interventions chaînées
function trajetMin(a,b){return Math.round(distKm(a,b)/35*60)+3;}
// Arrondir une durée (en minutes) au prochain multiple de 5
// Ex : 133 → 135, 130 → 130. Appliqué aux heures de début des 2èmes tâches chainées.
function arrondir5(m){return Math.ceil(m/5)*5;}
// Convertit un nombre de minutes en chaîne "HH:MM" (ex : 750 → "12:30")
function minToH(m){return `${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;}
// Convertit une chaîne "HH:MM" en minutes depuis minuit (ex : "12:30" → 750)
function hToMin(h){const[a,b]=(h||"12:00").split(":").map(Number);return a*60+b;}
// Formate l'heure pour WhatsApp : "12:30" → "12h30"
function toWA(h){return(h||"").replace(":","h");}

// Retourne l'heure de début par défaut (en minutes) selon le nom de l'intervention
// Certains clients ont des créneaux fixes connus (Cabinet médical à 8h00, Alami à 10h30, etc.)
// defaultH est l'heure par défaut (12h00) si aucune règle fixe ne s'applique
function hDefaut(nom,defaultH=12*60){
  if(/cabinet.m[eé]d/i.test(nom))return 8*60;
  if(/alami/i.test(nom))return 10*60+30;
  if(/zoraida/i.test(nom))return 11*60+30;
  if(/coralia/i.test(nom))return 11*60;
  if(/escales/i.test(nom))return 9*60+30;
  return defaultH;
}
// Retourne l'heure de fin (en minutes). Certains clients ont une fin fixe (ex: Zoraida = 16h00).
// Par défaut : heure de début + durée de l'intervention.
function hFin(nom,d,defaultH=12*60){
  if(/cabinet.m[eé]d/i.test(nom))return 10*60;
  if(/alami/i.test(nom))return 12*60;
  if(/zoraida/i.test(nom))return 16*60;
  if(/escales/i.test(nom))return 17*60+30;
  return hDefaut(nom,defaultH)+d;
}

// Recherche floue d'un lieu dans la liste en comparant les 7 premiers caractères du nom nettoyé
// Nettoie les préfixes communs ("Appartement GH ", "Villa ", "GH ", "Airbnb ") avant comparaison
// Utilisé pour faire correspondre les titres Google Calendar avec les lieux enregistrés
function matchLieu(s,lieux){
  if(!s||!lieux?.length)return null;
  const n=s.toLowerCase();
  return lieux.find(l=>{
    const ln=l.nom.toLowerCase().replace("appartement gh ","").replace("appartement ","").replace("villa ","").replace("gh ","");
    return n.includes(ln.slice(0,7))||ln.includes(n.replace(/gh\s+/g,"").replace(/airbnb\s+/g,"").replace(/apt\s+/g,"").trim().slice(0,7));
  });
}

// Transforme un événement Google Calendar brut en objet intervention structuré
// Détermine le type (Villa, Appartement GH…), associe le lieu GPS, calcule début/fin
// defaultH = heure de départ configurable transmise depuis l'état App
function parseEv(ev,lieux,defaultH=12*60){
  const s=ev.summary||"";const nom=ev.nom||s;
  const lieu=matchLieu(nom,lieux)||matchLieu(s,lieux);
  // Détection Villa : priorité au lieu trouvé, sinon par le nom de l'événement
  const typeParNom=/\bvilla\b/i.test(nom)||/\bvilla\b/i.test(s)?"Villa":null;
  const t=lieu?.type||typeParNom||ev.type||"Appartement GH";
  // Si type Villa mais lieu non trouvé (ou lieu non-villa), chercher parmi les villas uniquement
  const villaLieux=lieux.filter(l=>l.type==="Villa");
  const lieuVilla=t==="Villa"&&lieu?.type!=="Villa"
    ?(matchLieu(nom,villaLieux)||matchLieu(s,villaLieux))
    :null;
  const lieuFinal=lieuVilla||lieu;
  const d=lieuFinal?.d||(t==="Villa"?240:90);const debut=hDefaut(nom,defaultH);const fin=hFin(nom,d,defaultH);
  return{id:ev.id,nom,type:t,cli:ev.cli||"GetHost",lieu:lieuFinal,d,debut,fin,employes:[],bla_linge:false,heureDebut:minToH(debut),heureFin:minToH(fin)};
}

// Algorithme d'optimisation du planning : groupe les interventions en chaînes de 2 maximum
// Règles de chaînage :
//   - Les Villas ne sont JAMAIS chaînées (elles nécessitent une équipe dédiée)
//   - Deux interventions Bureau ne peuvent être chaînées qu'entre elles
//   - Le trajet entre les deux lieux doit être ≤ 20 min en scooter
//   - La différence d'heure de début doit être ≤ 30 min
// Tri initial : Bureaux en premier, puis MM, puis Riads, puis le reste (par durée décroissante)
// Retourne un tableau de chaînes triées par heure de début, avec temps de trajet recalculés
function optimiser(interventions){
  if(!interventions.length)return[];
  const sorted=[...interventions].sort((a,b)=>{
    const p=i=>{if(i.type==="Bureau")return 0;if(i.type==="Appartement MM")return 1;if(i.type==="Riad")return 2;return 3;};
    return p(a)-p(b)||b.d-a.d;
  });
  const assigned=new Set();const chaines=[];
  const GL=i=>sorted[i].lieu||CENTRE;
  for(const inter of sorted){
    if(assigned.has(inter.id))continue;
    const idx=sorted.findIndex(x=>x.id===inter.id);
    const chaine=[idx];assigned.add(inter.id);
    // Les Villas ne sont jamais chaînées — vérification sur type ET nom
    const isVilla=i=>sorted[i].type==="Villa"||/\bvilla\b/i.test(sorted[i].nom);
    if(chaine.length<2&&!isVilla(idx)){
      let best=null,bestT=Infinity;
      for(let j=0;j<sorted.length;j++){
        if(assigned.has(sorted[j].id))continue;
        if(isVilla(j))continue; // jamais de Villa en chaîne
        if(sorted[idx].type==="Bureau"&&sorted[j].type!=="Bureau")continue;
        if(sorted[idx].type!=="Bureau"&&sorted[j].type==="Bureau")continue;
        if(Math.abs(sorted[j].debut-sorted[idx].debut)>30)continue;
        const t=trajetMin(GL(idx),GL(j));
        if(t<=20&&t<bestT){bestT=t;best=j;}
      }
      if(best!==null){chaine.push(best);assigned.add(sorted[best].id);}
    }
    chaines.push(chaine);
  }
  const result=chaines.map(chaine=>{
    const lieux=chaine.map(i=>sorted[i]);let h=lieux[0].debut;
    const inters=lieux.map((l,i)=>{const debut=h,fin=debut+l.d;if(i<lieux.length-1)h=arrondir5(fin+trajetMin(lieux[i].lieu||CENTRE,lieux[i+1].lieu||CENTRE));return{...l,debut,fin,heureDebut:minToH(debut),heureFin:minToH(fin)};});
    const tT=lieux.reduce((s,_,i)=>i<lieux.length-1?s+trajetMin(lieux[i].lieu||CENTRE,lieux[i+1].lieu||CENTRE):s,0);
    return{inters,trajetTotal:tT,dureeTotal:inters[inters.length-1].fin-inters[0].debut};
  });
  return result.sort((a,b)=>a.inters[0].debut-b.inters[0].debut);
}

// Wrapper fetch authentifié — lit le JWT dans sessionStorage et l'envoie dans le header
// Utilisé pour tous les appels API internes (lieux, extras, equipe, planning, calendar…)
function apiCall(path,method="GET",body=null){
  const token=sessionStorage.getItem("kleaning_token");
  return fetch(path,{method,headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},...(body?{body:JSON.stringify(body)}:{})}).then(r=>r.json());
}

// ── BOTTOM SHEET (mobile) — drawer qui monte du bas ──────────
// Composant générique : fond semi-transparent + panel blanc animé depuis le bas
// Utilisé pour afficher la charge du jour et le planning WhatsApp sur mobile
function BottomSheet({visible,onClose,title,children}){
  if(!visible)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:2000}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:"white",borderRadius:"20px 20px 0 0",
        padding:"0 0 env(safe-area-inset-bottom,16px)",animation:"slideUp .25s ease-out",maxHeight:"90vh",overflowY:"auto"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"#e2e8f0",borderRadius:4,margin:"12px auto 0"}}/>
        <div style={{padding:"12px 20px 4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{title}</div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:"50%",background:"#f1f5f9",border:"none",fontSize:16,color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:"4px 20px 20px"}}>{children}</div>
      </div>
    </div>
  );
}

// ── SÉLECTEUR EMPLOYÉ — dropdown porté dans document.body ────
// Utilise createPortal pour éviter le clipping par overflow:hidden des cartes parentes
// La position (top/left) est calculée depuis getBoundingClientRect() du bouton déclencheur
// Affiche : les membres de l'équipe disponibles (actifs non encore assignés) + les extras mémorisés
// Affiche aussi une section "Retirer" pour désassigner quelqu'un
function SelEmp({employes,extras,equipe:equipeS,onAdd,onRemove,onClose,anchorRef}){
  const allE=extras.map(e=>({nom:e.nom,coul:"#64748b",bg:"#f1f5f9",emoji:"👤"}));
  const dispo=[...(equipeS||EQUIPE_FALLBACK).filter(e=>!employes.includes(e.nom)&&e.actif!==false),...allE.filter(e=>!employes.includes(e.nom))];

  // Position fixe calculée depuis l'ancre pour éviter le clipping (overflow:hidden des parents)
  const[pos,setPos]=useState({top:0,left:0});
  useEffect(()=>{
    if(anchorRef?.current){
      const r=anchorRef.current.getBoundingClientRect();
      const spaceBelow=window.innerHeight-r.bottom;
      const top=spaceBelow>240?r.bottom+6:r.top-242;
      const dropW=Math.min(210,window.innerWidth-16);
      setPos({top,left:Math.max(8,Math.min(r.left,window.innerWidth-dropW-8)),width:dropW});
    }
  },[]);

  const content=(
    <>
    <div style={{position:"fixed",inset:0,zIndex:9998}} onClick={onClose}/>
    <div style={{position:"fixed",top:pos.top,left:pos.left,zIndex:9999,
      width:pos.width||200,
      background:"white",borderRadius:12,border:"1px solid #e2e8f0",
      boxShadow:"0 12px 32px rgba(0,0,0,0.2)",padding:10}}>
      {dispo.length===0
        ?<p style={{fontSize:13,color:"#94a3b8",margin:0,padding:"4px 0"}}>Toutes assignées</p>
        :<>
          <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",marginBottom:6,letterSpacing:"0.05em"}}>Ajouter</div>
          {dispo.map(e=>(
            <button key={e.nom} onClick={()=>{onAdd(e.nom);onClose();}}
              style={{width:"100%",padding:"10px 10px",borderRadius:8,border:"none",cursor:"pointer",
                textAlign:"left",fontSize:14,fontWeight:600,marginBottom:3,
                background:e.bg,color:e.coul,display:"flex",alignItems:"center",gap:8,minHeight:44}}>
              <span style={{fontSize:18}}>{e.emoji}</span> {e.nom}
            </button>
          ))}
        </>
      }
      {employes.length>0&&<>
        <div style={{height:1,background:"#f1f5f9",margin:"8px 0"}}/>
        <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",marginBottom:6,letterSpacing:"0.05em"}}>Retirer</div>
        {employes.map(nom=>{const e=EQUIPE.find(x=>x.nom===nom)||{nom,coul:"#64748b",bg:"#f1f5f9",emoji:"👤"};return(
          <button key={nom} onClick={()=>{onRemove(nom);onClose();}}
            style={{width:"100%",padding:"10px 10px",borderRadius:8,border:"1px solid #fca5a5",cursor:"pointer",
              textAlign:"left",fontSize:14,fontWeight:600,marginBottom:3,
              background:"#fef2f2",color:"#dc2626",display:"flex",alignItems:"center",gap:8,minHeight:44}}>
            ✕ {nom}
          </button>
        );})}
      </>}
    </div>
  </>
  );
  return createPortal(content,document.body);
}

// ── CARTE INTERVENTION ────────────────────────────────────────
// Affiche une intervention individuelle dans une chaîne
// Permet : modifier l'heure (début/fin pour Bureaux), toggler "bla linge", assigner/retirer des employées
// Props : interv = données de l'intervention, onChange = callback (field, value)
// chaineBg/chaineBorder = couleurs héritées de la chaîne parente pour cohérence visuelle
function Carte({interv,extras,equipe:equipeP,onChange,chaineBg,chaineBorder}){
  const[openSel,setOpenSel]=useState(false);
  const[editHr,setEditHr]=useState(false);
  const ep=(equipeP||EQUIPE_FALLBACK).find(e=>e.nom===(interv.employes||[])[0]);
  const isBureau=interv.type==="Bureau"||interv.cli==="Cabinet médical";
  const isVilla=interv.type==="Villa";
  const villaManque=isVilla&&(interv.employes||[]).length<2;
  const ic=CLIENT_IC[interv.cli]||TYPE_IC[interv.type]||"🔵";
  const HEURES=["07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00"];
  const btnRef=useRef();

  return(
    <div style={{padding:"13px 15px",background:chaineBg||"white",borderLeft:`3px solid ${ep?ep.coul:chaineBorder||DS.line}`}}>

      {/* Ligne 1 : heure + nom */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>

        {/* Heure — grand bouton tactile */}
        {editHr?(
          <div style={{display:"flex",alignItems:"center",gap:4,background:"white",borderRadius:8,
            padding:"6px 10px",border:"2px solid #3b82f6",flexShrink:0}}>
            <select value={interv.heureDebut} onChange={e=>onChange("heureDebut",e.target.value)}
              style={{border:"none",background:"transparent",fontSize:14,fontWeight:700,color:"#3b82f6",outline:"none",cursor:"pointer"}}>
              {HEURES.map(h=><option key={h}>{h}</option>)}
            </select>
            {isBureau&&<>
              <span style={{fontSize:11,color:"#94a3b8"}}>→</span>
              <select value={interv.heureFin} onChange={e=>onChange("heureFin",e.target.value)}
                style={{border:"none",background:"transparent",fontSize:14,fontWeight:700,color:"#3b82f6",outline:"none",cursor:"pointer"}}>
                {HEURES.map(h=><option key={h}>{h}</option>)}
              </select>
            </>}
            <button onClick={()=>setEditHr(false)}
              style={{background:"#3b82f6",color:"white",border:"none",borderRadius:6,padding:"4px 10px",fontSize:13,fontWeight:700,minHeight:32}}>✓</button>
          </div>
        ):(
          <button onClick={()=>setEditHr(true)}
            style={{background:"rgba(255,255,255,0.85)",borderRadius:8,padding:"6px 12px",fontSize:13,fontWeight:700,
              color:"#374151",border:"1.5px solid rgba(0,0,0,0.1)",flexShrink:0,whiteSpace:"nowrap",minHeight:40,
              display:"flex",alignItems:"center",gap:5}}>
            ✏️ {isBureau?`${toWA(interv.heureDebut)}→${toWA(interv.heureFin)}`:toWA(interv.heureDebut)}
          </button>
        )}

        {/* Icône + Nom */}
        <div style={{minWidth:0,flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <span style={{fontSize:16,flexShrink:0}}>{ic}</span>
            <div style={{fontWeight:700,fontSize:14,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.2}}>{interv.nom}</div>
          </div>
          <div style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span>{interv.d}min</span>
            {interv.lieu?.q&&<span>· {interv.lieu.q}</span>}
            {!interv.lieu&&<span style={{color:"#f59e0b",fontWeight:600}}>⚠️ GPS manquant</span>}
            {isVilla&&<span style={{color:"#ea580c",fontWeight:700,background:"rgba(255,255,255,0.7)",
              padding:"1px 7px",borderRadius:10,border:"1px solid #fed7aa",fontSize:10}}>🏠 min 2 personnes</span>}
          </div>
        </div>
      </div>

      {/* Ligne 2 : badges */}
      <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
        <button onClick={()=>onChange("bla_linge",!interv.bla_linge)}
          style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,minHeight:44,
            background:interv.bla_linge?"#fef9c3":"rgba(255,255,255,0.7)",
            color:interv.bla_linge?"#92400e":"#94a3b8",
            border:`1.5px solid ${interv.bla_linge?"#fde68a":"rgba(0,0,0,0.1)"}`}}>
          🧺 {interv.bla_linge?"bla linge ✓":"bla linge"}
        </button>
      </div>

      {/* Ligne 3 : assignation */}
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",flexShrink:0}}>Assignées</span>

        {(interv.employes||[]).map(nom=>{
          const e=EQUIPE.find(x=>x.nom===nom)||{nom,coul:"#64748b",bg:"#f1f5f9",emoji:"👤"};
          return(
            <span key={nom} style={{padding:"5px 10px",borderRadius:20,fontSize:13,fontWeight:700,
              background:e.bg,color:e.coul,border:`1.5px solid ${e.coul}40`,
              display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:16}}>{e.emoji}</span> {e.nom}
              <button onClick={()=>onChange("employes",(interv.employes||[]).filter(x=>x!==nom))}
                style={{background:"none",border:"none",color:e.coul,fontSize:14,padding:"0 0 0 2px",
                  opacity:.5,lineHeight:1,minWidth:20,minHeight:20,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            </span>
          );
        })}

        {villaManque&&(interv.employes||[]).length===1&&(
          <span style={{fontSize:11,color:"#ea580c",background:"rgba(255,255,255,0.8)",
            padding:"3px 8px",borderRadius:10,border:"1px solid #fed7aa",fontWeight:600}}>
            ⚠️ + 1 personne requise
          </span>
        )}

        {/* Bouton + */}
        <div>
          {!(interv.employes||[]).length
            ?<button ref={btnRef} onClick={()=>setOpenSel(p=>!p)}
              style={{padding:"6px 14px",borderRadius:20,fontSize:13,fontWeight:700,minHeight:44,
                background:"rgba(255,255,255,0.9)",color:"#dc2626",border:"2px solid #fca5a5",
                display:"flex",alignItems:"center",gap:6}}>
              ⚠️ À assigner
              <span style={{width:22,height:22,borderRadius:"50%",background:"#dc2626",color:"white",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,lineHeight:1,fontWeight:700}}>+</span>
            </button>
            :<button ref={btnRef} onClick={()=>setOpenSel(p=>!p)}
              style={{width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.8)",
                color:"#475569",border:"1.5px solid rgba(0,0,0,0.15)",fontSize:20,fontWeight:700,
                display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>+</button>
          }
          {openSel&&(
            <SelEmp employes={interv.employes||[]} extras={extras} equipe={equipeP||EQUIPE_FALLBACK}
              anchorRef={btnRef}
              onAdd={n=>{if(!(interv.employes||[]).includes(n))onChange("employes",[...(interv.employes||[]),n]);}}
              onRemove={n=>onChange("employes",(interv.employes||[]).filter(x=>x!==n))}
              onClose={()=>setOpenSel(false)}/>
          )}
        </div>
      </div>
    </div>
  );
}

// ── WIZARD LOGEMENT ───────────────────────────────────────────
// Formulaire multi-étapes pour ajouter un nouveau logement
// Chaque étape correspond à un champ (WQ = Wizard Questions)
// Navigation avant/arrière, validation des champs requis, raccourcis clavier (Entrée)
const WQ=[
  {id:"nom",     label:"Nom du logement",          placeholder:"ex: Appartement GH Lotus",req:true},
  {id:"type",    label:"Type de logement",          placeholder:"",                        req:true,opts:TYPES},
  {id:"cli",     label:"Client / Propriétaire",     placeholder:"ex: GetHost, Atlas",      req:false},
  {id:"q",       label:"Quartier / Zone",           placeholder:"ex: Guéliz, Targa",       req:true,datalist:QUARTIERS},
  {id:"adresse", label:"Adresse / Lien Google Maps",placeholder:"ex: 12 Rue Ibn Khaldoun ou https://maps.google.com/?q=...",req:false},
  {id:"lat",     label:"Latitude GPS",              placeholder:"ex: 31.639675",           req:true},
  {id:"lng",     label:"Longitude GPS",             placeholder:"ex: -8.018080",           req:true},
  {id:"d",       label:"Durée intervention (min)",  placeholder:"ex: 90",                  req:true},
  {id:"heureFin",label:"Heure limite du jour (opt)",placeholder:"ex: 16h00 ou 17h00",      req:false,opts:["16h00","17h00","18h00","19h00","20h00"]},
  {id:"code",    label:"Code d'accès",              placeholder:"ex: 262626#",             req:false},
  {id:"notes",   label:"Notes accès",               placeholder:"ex: 5ème étage",          req:false},
];
function Wizard({onSave,onClose}){
  const[step,setStep]=useState(0);const[data,setData]=useState({});const[err,setErr]=useState("");
  const q=WQ[step];
  const next=()=>{
    if(q.req&&!data[q.id]){setErr("Champ obligatoire");return;}setErr("");
    if(step<WQ.length-1)setStep(s=>s+1);
    else {
      const heureFin = data.heureFin ? parseInt(data.heureFin)*60 : null;
      onSave({nom:data.nom,type:data.type||"Appartement GH",cli:data.cli||"Particulier",
        q:data.q||"Guéliz",adresse:data.adresse||"",lat:parseFloat(data.lat)||31.635,lng:parseFloat(data.lng)||-8.010,
        d:parseInt(data.d)||90,heureFin:heureFin,code:data.code||"",notes:data.notes||""});
    }
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:3000,
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"white",borderRadius:"20px 20px 0 0",
        padding:`0 20px calc(32px + env(safe-area-inset-bottom, 0px))`,
        width:"100%",maxWidth:500,animation:"slideUp .25s ease-out"}}>
        <div style={{width:40,height:4,background:"#e2e8f0",borderRadius:4,margin:"14px auto 0"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0 12px"}}>
          <div>
            <h2 style={{margin:0,fontSize:17,fontWeight:700,color:"#0f172a"}}>🏠 Nouveau logement</h2>
            <p style={{margin:"2px 0 0",fontSize:12,color:"#94a3b8"}}>Étape {step+1} sur {WQ.length}</p>
          </div>
          <button onClick={onClose} style={{width:36,height:36,borderRadius:"50%",background:"#f1f5f9",
            border:"none",fontSize:17,color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        {/* Progress bar */}
        <div style={{height:4,background:"#f1f5f9",borderRadius:4,marginBottom:20}}>
          <div style={{height:"100%",borderRadius:4,background:"#3b82f6",
            width:`${((step+1)/WQ.length)*100}%`,transition:"width .3s"}}/>
        </div>

        <label style={{fontSize:13,fontWeight:700,color:"#374151",display:"block",marginBottom:8}}>
          {q.label}{q.req&&<span style={{color:"#dc2626",marginLeft:4}}>*</span>}
        </label>

        {q.opts
          ?<select value={data[q.id]||""} onChange={e=>setData(p=>({...p,[q.id]:e.target.value}))}
            style={{width:"100%",padding:"13px 14px",border:`2px solid ${err?"#dc2626":"#e2e8f0"}`,
              borderRadius:10,fontSize:15,outline:"none",background:"white",minHeight:50}}>
            <option value="">Sélectionner...</option>
            {q.opts.map(o=><option key={o}>{o}</option>)}
          </select>
          :q.datalist
          ?<>
            <input list={`list-${q.id}`} value={data[q.id]||""} onChange={e=>setData(p=>({...p,[q.id]:e.target.value}))}
              placeholder={q.placeholder} autoFocus onKeyDown={e=>e.key==="Enter"&&next()}
              style={{width:"100%",padding:"13px 14px",border:`2px solid ${err?"#dc2626":"#e2e8f0"}`,
                borderRadius:10,fontSize:15,outline:"none",minHeight:50}}/>
            <datalist id={`list-${q.id}`}>
              {q.datalist.map(item=><option key={item}>{item}</option>)}
            </datalist>
          </>
          :<input value={data[q.id]||""} onChange={e=>setData(p=>({...p,[q.id]:e.target.value}))}
            placeholder={q.placeholder} autoFocus onKeyDown={e=>e.key==="Enter"&&next()}
            style={{width:"100%",padding:"13px 14px",border:`2px solid ${err?"#dc2626":"#e2e8f0"}`,
              borderRadius:10,fontSize:15,outline:"none",minHeight:50}}/>
        }

        {err&&<p style={{margin:"6px 0 0",fontSize:12,color:"#dc2626",fontWeight:600}}>{err}</p>}
        {q.id==="lat"&&<p style={{margin:"6px 0 0",fontSize:12,color:"#64748b"}}>💡 Google Maps → clic droit → Copier les coordonnées</p>}
        {q.id==="d"&&(
          <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6}}>
            {[60,90,120,180,240,270].map(v=>(
              <button key={v} onClick={()=>setData(p=>({...p,d:String(v)}))}
                style={{padding:"8px 14px",borderRadius:8,border:`2px solid ${data.d===String(v)?"#3b82f6":"#e2e8f0"}`,
                  fontSize:13,fontWeight:600,background:data.d===String(v)?"#eff6ff":"white",
                  color:data.d===String(v)?"#3b82f6":"#64748b",minHeight:44}}>
                {v}min
              </button>
            ))}
          </div>
        )}

        <div style={{display:"flex",gap:8,marginTop:20}}>
          {step>0&&<button onClick={()=>{setStep(s=>s-1);setErr("");}}
            style={{flex:1,padding:14,background:"#f8fafc",color:"#475569",border:"1px solid #e2e8f0",
              borderRadius:12,fontSize:14,fontWeight:600,minHeight:50}}>← Retour</button>}
          <button onClick={next}
            style={{flex:2,padding:14,background:`linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,color:"white",border:"none",
              borderRadius:12,fontSize:15,fontWeight:600,minHeight:50,cursor:"pointer",fontFamily:"inherit"}}>
            {step===WQ.length-1?"✅ Enregistrer":"Suivant →"}
          </button>
        </div>
        {!q.req&&<button onClick={()=>{setErr("");setStep(s=>s+1);}}
          style={{width:"100%",marginTop:10,padding:10,background:"none",border:"none",
            color:"#94a3b8",fontSize:13}}>Passer cette étape →</button>}
      </div>
    </div>
  );
}

// ── CONFIRMATION DIALOG ──────────────────────────────────────
// Modal de confirmation pour suppression de données
// Prévient les suppressions accidentelles avec "Êtes-vous sûr?"
function ConfirmDialog({visible,title,message,confirmText,onConfirm,onCancel}){
  if(!visible)return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:3500,
      display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"white",borderRadius:16,padding:24,maxWidth:380,
        boxShadow:"0 20px 60px rgba(0,0,0,0.3)",animation:"fadeIn .25s ease-out"}}>
        <h3 style={{margin:"0 0 8px",fontSize:18,fontWeight:700,color:"#0f172a"}}>{title}</h3>
        <p style={{margin:"0 0 20px",fontSize:14,color:"#64748b",lineHeight:1.5}}>{message}</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel}
            style={{flex:1,padding:12,background:"#f1f5f9",border:"1px solid #e2e8f0",
              borderRadius:10,fontSize:13,fontWeight:600,color:"#475569",cursor:"pointer"}}>
            Annuler
          </button>
          <button onClick={onConfirm}
            style={{flex:1,padding:12,background:"#dc2626",border:"none",
              borderRadius:10,fontSize:13,fontWeight:600,color:"white",cursor:"pointer"}}>
            {confirmText||"Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DAYS OFF MODAL ────────────────────────────────────────────
// Modal pour gérer les jours off des employées
// Permet sélection de plage de dates (du/au) qui s'expanse en dates individuelles
function DaysOffModal({visible,empId,empName,initialDates,onSave,onCancel}){
  const[startDate,setStartDate]=useState("");
  const[endDate,setEndDate]=useState("");
  const[datesList,setDatesList]=useState(initialDates||[]);

  // Initialise la modale avec les dates existantes
  useEffect(()=>{setDatesList(initialDates||[]);setStartDate("");setEndDate("");},[visible,initialDates]);

  if(!visible)return null;

  // Ajoute une date individuelle
  const addDate=()=>{if(!startDate)return;if(!datesList.includes(startDate)){setDatesList(p=>[...p,startDate].sort());setStartDate("");}};

  // Supprime une date
  const removeDate=(d)=>{setDatesList(p=>p.filter(x=>x!==d));};

  // Expanse une plage de dates (du/au)
  const expandDateRange=()=>{
    if(!startDate||!endDate)return;
    const start=new Date(startDate);
    const end=new Date(endDate);
    const expanded=[];
    for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){
      const dateStr=d.toISOString().split("T")[0];
      if(!datesList.includes(dateStr))expanded.push(dateStr);
    }
    if(expanded.length>0){setDatesList(p=>[...p,...expanded].sort());setStartDate("");setEndDate("");}
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:3500,
      display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"white",borderRadius:16,padding:24,maxWidth:420,
        boxShadow:"0 20px 60px rgba(0,0,0,0.3)",animation:"fadeIn .25s ease-out",maxHeight:"80vh",overflow:"auto"}}>
        <h3 style={{margin:"0 0 12px",fontSize:18,fontWeight:700,color:"#0f172a"}}>📅 Jours off - {empName}</h3>
        <p style={{margin:"0 0 16px",fontSize:13,color:"#64748b"}}>Indiquez les dates où l'employée sera absente</p>

        {/* Ajouter plage de dates */}
        <div style={{marginBottom:14,padding:"12px",background:"#f0fdf4",borderRadius:10,border:"1px solid #86efac"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#166534",marginBottom:8}}>Plage de dates (du/au)</div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
              style={{flex:1,padding:"8px 10px",border:"1px solid #dcfce7",borderRadius:6,fontSize:12}}/>
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}
              style={{flex:1,padding:"8px 10px",border:"1px solid #dcfce7",borderRadius:6,fontSize:12}}/>
          </div>
          <button onClick={expandDateRange}
            style={{width:"100%",padding:"8px",background:"#059669",color:"white",border:"none",borderRadius:6,
              fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
            + Ajouter plage
          </button>
        </div>

        {/* Ajouter date individuelle */}
        <div style={{marginBottom:14,padding:"12px",background:"#eff6ff",borderRadius:10,border:"1px solid #bfdbfe"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#1e40af",marginBottom:8}}>Ou ajouter une date</div>
          <div style={{display:"flex",gap:8}}>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
              style={{flex:1,padding:"8px 10px",border:"1px solid #93c5fd",borderRadius:6,fontSize:12}}/>
            <button onClick={addDate}
              style={{padding:"8px 12px",background:"#3b82f6",color:"white",border:"none",borderRadius:6,
                fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
              Ajouter
            </button>
          </div>
        </div>

        {/* Liste des dates */}
        {datesList.length>0&&(
          <div style={{marginBottom:14,padding:"12px",background:"#fafaf8",borderRadius:10,border:"1px solid #e7e5e4"}}>
            <div style={{fontSize:12,fontWeight:600,color:"#274c5b",marginBottom:8}}>Dates sélectionnées ({datesList.length})</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,maxHeight:150,overflow:"auto"}}>
              {datesList.map(d=>(
                <div key={d} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",background:"white",
                  borderRadius:6,border:"1px solid #d1d5db",fontSize:12,color:"#374151"}}>
                  {d}
                  <button onClick={()=>removeDate(d)}
                    style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer",fontSize:11,fontWeight:700}}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Boutons */}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel}
            style={{flex:1,padding:12,background:"#f1f5f9",border:"1px solid #e2e8f0",
              borderRadius:10,fontSize:13,fontWeight:600,color:"#475569",cursor:"pointer",transition:"all .15s"}}>
            Annuler
          </button>
          <button onClick={()=>onSave(datesList)}
            style={{flex:1,padding:12,background:"#059669",border:"none",
              borderRadius:10,fontSize:13,fontWeight:600,color:"white",cursor:"pointer",transition:"all .15s"}}>
            Enregistrer ({datesList.length})
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const[dateQ,setDateQ]=useState(()=>{const d=new Date();d.setDate(d.getDate()+1);return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;}); // Initialisé à J+1
  const[loading,setLoading]=useState(false);            // Indicateur de chargement agenda
  const[msg,setMsg]=useState("");                       // Message de statut (succès / erreur / info)
  const[syncTime,setSyncTime]=useState("—");            // Horodatage du dernier chargement
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
  const[newUser,setNewUser]=useState({username:"",password:"",displayName:""}); // Formulaire création compte
  const[userMsg,setUserMsg]=useState("");               // Retour création/suppression utilisateur
  const[editLieu,setEditLieu]=useState(null);           // Logement en cours d'édition inline (null = aucun)
  const[showWA,setShowWA]=useState(false);              // BottomSheet WhatsApp sur mobile
  const[showCharge,setShowCharge]=useState(false);      // BottomSheet charge du jour sur mobile
  // ── Confirmation Dialog pour suppressions ──────────────
  const[confirmDialog,setConfirmDialog]=useState({visible:false,title:"",message:"",onConfirm:null});
  // ── Équipe fixe (chargée depuis API, avec fallback) ────────
  const[equipe,setEquipe]=useState([
    {id:"emp_1",nom:"Majda", emoji:"👩‍🦱",coul:"#2563eb",bg:"#dbeafe",actif:true},
    {id:"emp_2",nom:"Amina", emoji:"👩",  coul:"#059669",bg:"#d1fae5",actif:true},
    {id:"emp_3",nom:"Touria",emoji:"👩‍🦳",coul:"#7c3aed",bg:"#ede9fe",actif:true},
    {id:"emp_4",nom:"Imane", emoji:"👩‍🦰",coul:"#d97706",bg:"#fef3c7",actif:true},
  ]);
  const[newEmp,setNewEmp]=useState({nom:"",emoji:"👤"});// Formulaire ajout employée
  const[empMsg,setEmpMsg]=useState("");                 // Retour ajout/suppression employée
  // ── Jours off des employées ────────────────────────────────
  const[empJoursOff,setEmpJoursOff]=useState({});       // Format: {emp_1: ["2026-03-28", "2026-03-29"]}
  const[daysOffModal,setDaysOffModal]=useState(null);   // Format: {empId, startDate, endDate}

  // Vérification du token JWT au montage : si valide, reconnecte l'utilisateur sans re-login
  useEffect(()=>{
    const token=sessionStorage.getItem("kleaning_token");
    if(token){fetch("/api/auth/me",{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()).then(d=>{if(d.username)setUser(d);}).catch(()=>{});}
  },[]);

  // Chargement initial des données dès que l'utilisateur est authentifié
  useEffect(()=>{if(user){chargerExtras();chargerLieux();chargerEquipe();chargerHistorique();if(user.role==="admin")chargerUsers();}},[user]);
  // Rafraîchit l'historique à chaque visite de l'onglet Historique
  useEffect(()=>{if(onglet==="historique")chargerHistorique();},[onglet]);

  // Initialise les jours off à partir des données de l'équipe
  useEffect(()=>{
    const jours={};
    equipe.forEach(emp=>{if(emp.joursOff&&emp.joursOff.length>0)jours[emp.id]=emp.joursOff;});
    setEmpJoursOff(jours);
  },[equipe]);


  // Chargement des données persistées depuis l'API (fichiers JSON côté serveur)
  const chargerExtras=()=>apiCall("/api/extras").then(d=>{if(d.extras)setExtras(d.extras);});
  const chargerLieux=()=>apiCall("/api/lieux").then(d=>{if(d.lieux)setLieux(d.lieux);});
  const chargerUsers=()=>apiCall("/api/users").then(d=>{if(d.users)setUsers(d.users);}); // Admin seulement
  const chargerEquipe=()=>apiCall("/api/equipe").then(d=>{if(d.equipe&&d.equipe.length)setEquipe(d.equipe);});

  // Charge le planning du jour depuis Google Calendar via l'API
  // 1. Convertit la date DD/MM/YYYY en YYYY-MM-DD pour l'API
  // 2. Parse les événements en interventions (parseEv)
  // 3. Optimise les chaînes (optimiser)
  // 4. Sauvegarde automatiquement le planning dans l'historique (POST /api/planning)
  const chargerAgenda=async()=>{
    setLoading(true);setMsg("");setWaText("");
    const[d,m,y]=dateQ.split("/");
    const date=`${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`;
    const data=await apiCall(`/api/calendar?date=${date}`);
    if(data.events?.length>0){
      const parsed=data.events.map(e=>parseEv(e,lieux,12*60));
      const c=optimiser(parsed);setChaines(c);
      setSyncTime(`${dateQ} ${new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}`);
      setMsg(`✅ ${parsed.length} interventions · ${c.length} chaînes`);
    }else{setMsg(`ℹ️ Aucun événement — ${dateQ}`);}
    setLoading(false);
  };


  // Modifie un champ d'une intervention spécifique (ci=index chaîne, ii=index intervention)
  // Cas spéciaux :
  //   - "employes" → synchronise les 2 tâches si chaîne pairée (même équipe)
  //   - "heureDebut"/"heureFin" → TOUJOURS indépendants, pas de sync même en chaîne pairée
  //   - "heureDebut" sur non-Bureau → recalcule heureFin = heureDebut + durée
  //   - "heureDebut" sur Bureau → met à jour uniquement heureDebut (heureFin reste libre)
  // NOTE: Liberté totale sur les horaires - aucune contrainte inter-chaîne
  const changeInChaine=(ci,ii,f,v)=>{
    setChaines(p=>{
      const upd=[...p];
      const c={...upd[ci],inters:[...upd[ci].inters]};
      const inter=c.inters[ii];
      const isBureau=inter.type==="Bureau"||inter.cli==="Cabinet médical";
      if(f==="employes"){
        const newEmps=v;
        c.inters=c.inters.length===2
          ?c.inters.map(x=>({...x,employes:newEmps}))
          :[...c.inters.slice(0,ii),{...inter,employes:newEmps},...c.inters.slice(ii+1)];
      } else if(f==="heureDebut"){
        const debut=hToMin(v);
        if(isBureau){
          // Bureau : heureDebut libre, heureFin reste inchangée
          c.inters=[...c.inters.slice(0,ii),{...inter,debut,heureDebut:minToH(debut)},...c.inters.slice(ii+1)];
        } else {
          // Appartement/Villa/Riad : heureFin = heureDebut + durée
          const fin=debut+inter.d;
          c.inters=[...c.inters.slice(0,ii),{...inter,debut,fin,heureDebut:minToH(debut),heureFin:minToH(fin)},...c.inters.slice(ii+1)];
        }
      } else if(f==="heureFin"){
        // Mise à jour libre de heureFin (Bureaux) + synchronise fin numérique
        const fin=hToMin(v);
        c.inters=[...c.inters.slice(0,ii),{...inter,fin,heureFin:minToH(fin)},...c.inters.slice(ii+1)];
      } else {
        c.inters=[...c.inters.slice(0,ii),{...inter,[f]:v},...c.inters.slice(ii+1)];
      }
      c.dureeTotal=c.inters[c.inters.length-1].fin-c.inters[0].debut;
      upd[ci]=c;
      return upd;
    });
    setWaText("");
  };

  // Supprime une chaîne du planning courant (icône poubelle)
  // Demande confirmation avant suppression
  const supprimerChaine=ci=>{
    setConfirmDialog({
      visible:true,
      title:"Supprimer la chaîne?",
      message:"Cette chaîne sera retirée du planning. L'action ne peut pas être annulée.",
      onConfirm:()=>{
        setChaines(p=>p.filter((_,i)=>i!==ci));
        setWaText("");
        setConfirmDialog({visible:false,title:"",message:"",onConfirm:null});
      }
    });
  };

  // Fusionne deux chaînes solo en une chaîne pairée
  // - Trie par heure de début pour mettre la plus tôt en première position
  // - Calcule le temps de trajet scooter entre les deux lieux
  // - Fusionne les employés des deux tâches (union, sans doublon)
  // - Recalcule les heures avec arrondi à 5 minutes
  // - Supprime les deux solos et les remplace par la chaîne pairée
  const associerChaines=(ci1,ci2)=>{
    setChaines(p=>{
      const upd=[...p];
      const a=upd[ci1].inters[0];
      const b=upd[ci2].inters[0];
      // Trier par heure de début : la plus tôt en premier
      const[first,second]=a.debut<=b.debut?[a,b]:[b,a];
      // Recalculer les heures avec trajet scooter
      const trajet=trajetMin(first.lieu||CENTRE,second.lieu||CENTRE);
      const d1=first.debut, f1=d1+first.d;
      const d2=arrondir5(f1+trajet), f2=d2+second.d;
      // Fusionner les employés des deux tâches — même équipe pour les 2
      const employes=[...new Set([...(first.employes||[]),...(second.employes||[])])];
      const i1={...first, debut:d1,fin:f1,heureDebut:minToH(d1),heureFin:minToH(f1),employes};
      const i2={...second,debut:d2,fin:f2,heureDebut:minToH(d2),heureFin:minToH(f2),employes};
      const newChaine={inters:[i1,i2],trajetTotal:trajet,dureeTotal:f2-d1};
      // Supprimer les deux solos (index décroissant pour éviter le décalage)
      const[hi,lo]=ci1>ci2?[ci1,ci2]:[ci2,ci1];
      upd.splice(hi,1);
      upd.splice(lo,1,newChaine);
      return upd;
    });
    setAssocierMode(null);
    setWaText("");
  };

  // Sépare une chaîne pairée en deux chaînes solo indépendantes
  // Les employés sont conservés sur chaque tâche séparée
  const separerChaine=ci=>{
    setChaines(p=>{
      const upd=[...p];
      const c=upd[ci];
      if(c.inters.length<2)return p;
      // Créer deux chaînes solo à partir des deux interventions
      const solos=c.inters.map(inter=>({
        inters:[inter],
        trajetTotal:0,
        dureeTotal:inter.d,
      }));
      upd.splice(ci,1,...solos);
      return upd;
    });
    setWaText("");
  };

  // Génère le texte WhatsApp formaté du planning du jour
  // Structure : une ligne par employée, avec ses interventions dans l'ordre chronologique
  // Format : "🟢 _Nom apt_ 12h30 : *Amina*, \n\n🟢 _Nom apt 2_ 14h00 : *Majda*, \n\n"
  // Les interventions non assignées sont regroupées sous "**" (à assigner)
  // Chaque intervention sur sa propre ligne pour meilleure lisibilité
  const genWA=()=>{
    const[d,m,y]=dateQ.split("/");
    const label=new Date(`${y}-${m}-${d}`).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    let txt="`Planning du jour - "+label.charAt(0).toUpperCase()+label.slice(1)+"` :\n\n";
    const all=chaines.flatMap(c=>c.inters);const parEmp={};
    all.forEach(inter=>{const emps=inter.employes||[];if(!emps.length){if(!parEmp["__none__"])parEmp["__none__"]=[];parEmp["__none__"].push(inter);}else emps.forEach(e=>{if(!parEmp[e])parEmp[e]=[];parEmp[e].push(inter);});});
    Object.entries(parEmp).sort(([,a],[,b])=>hToMin(a[0].heureDebut)-hToMin(b[0].heureDebut)).forEach(([emp,inters])=>{
      const sorted=[...inters].sort((a,b)=>hToMin(a.heureDebut)-hToMin(b.heureDebut));
      const isBur=t=>t==="Bureau"||t==="Cabinet médical";
      const taches=sorted.map(i=>`${CLIENT_IC[i.cli]||TYPE_IC[i.type]||"🔵"} _${i.nom}_ ${isBur(i.type)||isBur(i.cli)?`${toWA(i.heureDebut)}->${toWA(i.heureFin)}`:toWA(i.heureDebut)}${i.bla_linge?" (linge)":""}`).join(",\n");
      txt+=`${taches} : ${emp==="__none__"?"**":`*${emp}*`},\n\n`;
    });
    txt=txt.trimEnd().replace(/,$/,"");setWaText(txt);setCopied(false);setWaSent(false);setShowWA(true);
    // Sauvegarde du planning avec les agents assignés
    const[dd,mm,yy]=dateQ.split("/");
    const date=`${yy}-${mm.padStart(2,"0")}-${dd.padStart(2,"0")}`;
    const dateLabel=new Date(date).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
    apiCall("/api/planning","POST",{date,dateLabel,chaines}).catch(()=>{});
  };

  // Copie le texte WhatsApp dans le presse-papier (technique textarea pour compatibilité iOS)
  const copier=()=>{if(!waText)return;const ta=document.createElement("textarea");ta.value=waText;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,99999);try{document.execCommand("copy");setCopied(true);setTimeout(()=>setCopied(false),3000);}catch{}document.body.removeChild(ta);};

  // ── ÉQUIPE ────────────────────────────────────────────────
  // CRUD employées : données persistées dans data/equipe.json via l'API
  // ajouterEmp : POST /api/equipe — ajoute une nouvelle employée
  // supprimerEmp : DELETE /api/equipe/:id — retire définitivement une employée
  // toggleEmpActif : PUT /api/equipe/:id — active/désactive (utile pour absences prolongées)
  const ajouterEmp=async()=>{
    const {nom,emoji}=newEmp;
    if(!nom.trim())return;
    const data=await apiCall("/api/equipe","POST",{nom:nom.trim(),emoji:emoji||"👤"});
    if(data.employe){setEquipe(p=>[...p,data.employe]);setNewEmp({nom:"",emoji:"👤"});setEmpMsg(`✅ "${data.employe.nom}" ajoutée`);}
    else setEmpMsg(data.message||"Erreur");
  };
  const supprimerEmp=async(id)=>{
    const e=equipe.find(x=>x.id===id);
    setConfirmDialog({
      visible:true,
      title:`Retirer ${e?.nom}?`,
      message:`L'employée "${e?.nom}" sera retirée de l'équipe. Cette action ne peut pas être annulée.`,
      onConfirm:async()=>{
        const data=await apiCall(`/api/equipe/${id}`,"DELETE");
        if(data.message){setEquipe(p=>p.filter(x=>x.id!==id));setEmpMsg(`🗑 "${e?.nom}" retirée`);}
        setConfirmDialog({visible:false,title:"",message:"",onConfirm:null});
      }
    });
  };
  const toggleEmpActif=async(id,actif)=>{
    const data=await apiCall(`/api/equipe/${id}`,"PUT",{actif});
    if(data.employe)setEquipe(p=>p.map(x=>x.id===id?data.employe:x));
  };

  // Sauvegarde les jours off d'une employée
  // Envoie au backend : PUT /api/equipe/:id avec {joursOff: [...dates]}
  const saveDaysOff=async(empId,dates)=>{
    const data=await apiCall(`/api/equipe/${empId}`,"PUT",{joursOff:dates});
    if(data.employe){
      setEquipe(p=>p.map(x=>x.id===empId?data.employe:x));
      setEmpJoursOff(p=>({...p,[empId]:dates}));
      setDaysOffModal(null);
      setEmpMsg(`✅ Jours off mis à jour pour`,setTimeout(()=>setEmpMsg(""),3000));
    }
  };

  // ── EXTRAS ─────────────────────────────────────────────────
  // Les extras sont des agents ponctuels mémorisés (data/extras.json)
  // Ils apparaissent dans le sélecteur d'assignation de toutes les interventions
  const ajouterExtra=async()=>{const n=newExtra.trim();if(!n)return;const data=await apiCall("/api/extras","POST",{nom:n});if(data.extra){setExtras(p=>[...p,data.extra]);setNewExtra("");}};
  const supprimerExtra=async(id)=>{await apiCall(`/api/extras/${id}`,"DELETE");setExtras(p=>p.filter(e=>e.id!==id));};
  // ── LIEUX ──────────────────────────────────────────────────
  // CRUD logements : données persistées dans data/lieux.json
  // ajouterLieu : appelé depuis le Wizard après validation du formulaire multi-étapes
  // modifierLieu : met à jour un logement existant (édition inline dans l'onglet Logements)
  const ajouterLieu=async(lieu)=>{const data=await apiCall("/api/lieux","POST",lieu);if(data.logement){setLieux(p=>[...p,data.logement]);setWizard(false);setMsg(`✅ "${data.logement.nom}" ajouté`);}};
  const supprimerLieu=async(id)=>{
    const l=lieux.find(x=>x.id===id);
    setConfirmDialog({
      visible:true,
      title:`Supprimer ${l?.nom}?`,
      message:`Le logement "${l?.nom}" sera supprimé définitivement. Cette action ne peut pas être annulée.`,
      onConfirm:async()=>{
        await apiCall(`/api/lieux/${id}`,"DELETE");
        setLieux(p=>p.filter(x=>x.id!==id));
        setMsg(`🗑 "${l?.nom}" supprimé`);
        setConfirmDialog({visible:false,title:"",message:"",onConfirm:null});
      }
    });
  };
  const modifierLieu=async(id,data)=>{const res=await apiCall(`/api/lieux/${id}`,"PUT",data);if(res.logement){setLieux(p=>p.map(l=>l.id===id?res.logement:l));setEditLieu(null);setMsg("✅ Mis à jour");}};
  // ── UTILISATEURS (admin seulement) ─────────────────────────
  // Gestion des comptes d'accès à l'application (data/users.json)
  // Seul l'admin peut créer ou supprimer des accès — l'onglet "Comptes" est masqué pour les non-admins
  const creerUser=async()=>{const data=await apiCall("/api/users","POST",newUser);if(data.user){setUsers(p=>[...p,data.user]);setNewUser({username:"",password:"",displayName:""});setUserMsg(`✅ "${data.user.displayName}" créé`);}else setUserMsg(data.message||"Erreur");};
  const supprimerUser=async(id)=>{
    const u=users.find(x=>x.id===id);
    setConfirmDialog({
      visible:true,
      title:`Supprimer ${u?.displayName}?`,
      message:`L'utilisateur "${u?.displayName}" (@${u?.username}) sera supprimé définitivement. Cette action ne peut pas être annulée.`,
      onConfirm:async()=>{
        const data=await apiCall(`/api/users/${id}`,"DELETE");
        if(data.message){setUsers(p=>p.filter(x=>x.id!==id));setUserMsg(data.message);}
        setConfirmDialog({visible:false,title:"",message:"",onConfirm:null});
      }
    });
  };
  // Déconnexion : supprime le JWT du sessionStorage et réinitialise l'état user
  const logout=()=>{sessionStorage.removeItem("kleaning_token");setUser(null);};

  // ── HISTORIQUE ─────────────────────────────────────────────
  // chargerHistorique : GET /api/planning — liste des métadonnées (date, dateLabel, nbChaines, savedAt)
  // chargerDetailHistorique : GET /api/planning/:date — charge les chaînes complètes pour expansion
  const chargerHistorique=()=>apiCall("/api/planning").then(d=>{if(d.historique)setHistorique(d.historique);});
  // Charge le détail d'un jour dans l'historique (pour l'expansion, sans naviguer)
  const chargerDetailHistorique=async(date)=>{
    const data=await apiCall(`/api/planning/${date}`);
    if(data.chaines)setHistorique(p=>p.map(h=>h.date===date?{...h,chaines:data.chaines}:h));
  };

  // ── CALCULS DÉRIVÉS ────────────────────────────────────────
  // Détecte les villas (par type ou par nom, pour les interventions parsées depuis Google Calendar)
  const isVillaInter=inter=>inter.type==="Villa"||/\bvilla\b/i.test(inter.nom);
  // Compteurs d'alertes affichés dans la barre de statut après chargement
  const nbSans=chaines.flatMap(c=>c.inters).filter(i=>!(i.employes||[]).length).length;  // Interventions sans employée
  const nbVilla=chaines.flatMap(c=>c.inters).filter(i=>i.type==="Villa"&&(i.employes||[]).length<2).length; // Villas avec moins de 2 personnes
  // Charge du jour : dictionnaire {nomEmployée: [interventions]} pour le panneau latéral
  const charge=()=>{const c={};chaines.flatMap(x=>x.inters).forEach(i=>(i.employes||[]).forEach(n=>{if(!c[n])c[n]=[];c[n].push(i);}));return c;};
  // Détection des conflits : si heureFin[i] > heureDebut[i+1] pour la même employée → conflit
  const conflits=equipe.filter(e=>e.actif!==false).flatMap(e=>{const all=chaines.flatMap(c=>c.inters.filter(i=>(i.employes||[]).includes(e.nom))).sort((a,b)=>hToMin(a.heureDebut)-hToMin(b.heureDebut));const cfls=[];for(let i=0;i<all.length-1;i++)if(hToMin(all[i].heureFin)>hToMin(all[i+1].heureDebut))cfls.push(`${e.nom}: ${all[i].nom.split(" ").pop()} → ${all[i+1].nom.split(" ").pop()}`);return cfls;});
  const ch=charge();
  // Onglets de navigation — l'onglet "Comptes" n'est visible que pour l'administrateur
  const TABS=[["planning","📋","Planning"],["historique","📅","Historique"],["lieux","🏠","Logements"],["extras","👤","Extras"],["equipe","👥","Équipe"],...(user?.role==="admin"?[["users","⚙️","Comptes"]]:[] )];

  if(!user)return<Login onLogin={u=>{setUser(u);}}/>;

  return(
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",background:DS.paper,minHeight:"100vh",paddingBottom:"calc(70px + env(safe-area-inset-bottom, 0px))"}}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div style={{
          background:`linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
          padding:"0 16px",
          position:"sticky",top:0,zIndex:100,
          boxShadow:"0 2px 12px rgba(13,27,42,0.3)",
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:1080,margin:"0 auto",height:58}}>

            {/* Logo & App Title */}
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <img src="/logo.png" alt="KleanBnB"
                style={{height:36,width:"auto",objectFit:"contain",filter:"brightness(0) invert(1)",opacity:0.92}}/>
              <div style={{display:"flex",flexDirection:"column",fontSize:10,lineHeight:1.2,fontWeight:500,whiteSpace:"nowrap"}}>
                <div style={{color:"rgba(201,168,76,0.9)",fontSize:11,fontWeight:700}}>planning Kleaning</div>
                <div style={{color:"rgba(201,168,76,0.6)",fontSize:9}}>{user.displayName}</div>
              </div>
            </div>

            {/* ── NAVIGATION DESKTOP — onglets horizontaux ──────────────
                Masqué sur mobile (<640px), affiché sur tablet/desktop
                Utilise DS_LOGIN.gold (#C9A84C) pour l'accent actif (thème Marrakech) */}
            <div className="nav-top-tabs" style={{display:"flex",gap:2,alignItems:"center"}}>
              {TABS.map(([k,ic,l])=>{
                const active=onglet===k;
                return(
                  <button key={k} onClick={()=>setOnglet(k)}
                    style={{
                      padding:"7px 13px",borderRadius:9,border:"none",fontSize:12,fontWeight:600,
                      background:active?"rgba(201,168,76,0.18)":"transparent",
                      color:active?"#C9A84C":"rgba(255,255,255,0.55)",
                      borderBottom:active?"2px solid #C9A84C":"2px solid transparent",
                      transition:"all .15s",
                    }}>
                    {l}
                  </button>
                );
              })}
              <button onClick={logout} className="btn-ghost"
                style={{
                  marginLeft:8,padding:"6px 12px",
                  background:"rgba(255,255,255,0.06)",
                  color:"rgba(255,255,255,0.45)",
                  border:"1px solid rgba(255,255,255,0.12)",
                  borderRadius:9,fontSize:11,fontWeight:600,
                  display:"flex",alignItems:"center",gap:5,
                  transition:"all .15s",
                }}>
                <LogOut size={12}/> Déco
              </button>
            </div>
          </div>
        </div>

        {/* ── CONTENU PRINCIPAL —————────────────────────────────
            Layout responsive : 100% wide sur mobile, max-width sur desktop
            Tous les changements de couleur utilisent DS tokens (marque/statuts)
            ────────────────────────────────────────────────────── */}
        <div style={{maxWidth:1080,margin:"0 auto",padding:"14px 14px"}}>

          {/* ═══ PLANNING ═══════════════════════════════════ */}
          {onglet==="planning"&&(
            <>
              {/* Barre chargement */}
              <div className="card" style={{padding:"16px",marginBottom:14}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap"}}>
                  <div style={{flex:"1 1 120px"}}>
                    <label className="section-label" style={{display:"block",marginBottom:6}}>Date</label>
                    <input value={dateQ} readOnly
                      style={{padding:"10px 13px",border:`1.5px solid ${DS.line}`,borderRadius:10,fontSize:14,
                        width:"100%",fontFamily:"inherit",minHeight:46,background:"#F0EDE8",color:DS.ink2,cursor:"default"}}/>
                  </div>
                  <button onClick={chargerAgenda} disabled={loading} className="btn-primary"
                    style={{
                      flex:"1 1 160px",minWidth:0,padding:"12px 18px",
                      background:loading?DS.ink3:`linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
                      color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:600,minHeight:46,
                      display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                      boxShadow:loading?"none":"0 4px 14px rgba(13,27,42,0.25)",
                      cursor:loading?"not-allowed":"pointer",
                    }}>
                    <RefreshCw size={15} style={{animation:loading?"spin .8s linear infinite":"none"}}/>
                    {loading?"Chargement…":"Charger l'agenda Kleaning"}
                  </button>
                </div>

                {msg&&(
                  <div style={{marginTop:12,padding:"10px 14px",borderRadius:10,fontSize:13,fontWeight:500,
                    background:msg.startsWith("✅")?DS.sageSoft:msg.startsWith("ℹ️")?"#EFF6FF":DS.rubySoft,
                    color:msg.startsWith("✅")?DS.sage:msg.startsWith("ℹ️")?"#1E40AF":DS.ruby,
                    border:`1px solid ${msg.startsWith("✅")?"#A7F3D0":msg.startsWith("ℹ️")?"#BFDBFE":"#FECACA"}`,
                    display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    {msg.startsWith("✅")?<CheckCircle2 size={14}/>:msg.startsWith("ℹ️")?<Zap size={14}/>:<AlertTriangle size={14}/>}
                    <span style={{flex:1}}>{msg.replace("✅ ","").replace("ℹ️ ","")}</span>
                    {nbSans>0&&<span style={{background:DS.rubySoft,color:DS.ruby,padding:"3px 9px",borderRadius:8,fontSize:11,border:"1px solid #FECACA",fontWeight:700,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}><AlertTriangle size={10}/>{nbSans} sans assignation</span>}
                    {nbVilla>0&&<span style={{background:DS.amberSoft,color:DS.amber,padding:"3px 9px",borderRadius:8,fontSize:11,border:`1px solid ${DS.amber}`,fontWeight:700,whiteSpace:"nowrap"}}>Villa &lt; 2</span>}
                  </div>
                )}
              </div>

              {chaines.length===0?(
                <div className="card" style={{padding:"52px 24px",textAlign:"center"}}>
                  <div style={{
                    width:64,height:64,borderRadius:18,
                    background:`linear-gradient(135deg, ${DS.ink}14 0%, ${DS.brand}18 100%)`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    margin:"0 auto 18px",
                    border:`1px solid ${DS.line}`,
                  }}>
                    <CalendarDays size={28} color={DS.brand}/>
                  </div>
                  <div style={{fontSize:16,fontWeight:600,color:DS.ink,marginBottom:6}}>Aucun planning chargé</div>
                  <div style={{fontSize:13,color:DS.ink3}}>Saisissez une date et appuyez sur "Charger l'agenda Kleaning"</div>
                </div>
              ):(
                // Layout responsive : 2 colonnes sur desktop, 1 colonne sur mobile
                <div className="layout-2col" style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:14,alignItems:"start"}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:DS.ink3,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.07em",display:"flex",alignItems:"center",gap:6}}>
                      <Zap size={11} color={DS.brand}/> {chaines.length} chaîne{chaines.length>1?"s":""} · même couleur = assigner ensemble
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      {chaines.map((chaine,ci)=>{
                        const estPaire=chaine.inters.length===2;
                        const estSolo=chaine.inters.length===1;
                        const inter0=chaine.inters[0];
                        const estVilla=isVillaInter(inter0);
                        // En mode association : cette chaîne est la source
                        const estSource=associerMode===ci;
                        // En mode association : cette chaîne est une cible eligible
                        const estCible=associerMode!==null&&associerMode!==ci&&estSolo&&!estVilla;
                        const colorIdx=estPaire?chaines.filter((c,i)=>i<ci&&c.inters.length===2).length%CHAINE_COLORS.length:-1;
                        const couleur=estPaire?CHAINE_COLORS[colorIdx]:null;
                        const chaineBg=estSource?"#FFFBEB":estCible?`${DS.ink}08`:couleur?couleur.bg:"white";
                        const chaineBorder=estSource?DS.amber:estCible?DS.ink:couleur?couleur.border:DS.line;
                        return(
                          <div key={ci} style={{borderRadius:16,overflow:"hidden",
                            border:`${estSource||estCible?"2px":"1.5px"} solid ${chaineBorder}`,
                            boxShadow:estCible?`0 0 0 3px ${DS.ink}18`:"0 2px 10px rgba(13,27,42,0.06)",
                            transition:"all .2s"}}>
                            {/* En-tête chaîne */}
                            <div style={{background:chaineBg,padding:"10px 14px",
                              display:"flex",justifyContent:"space-between",alignItems:"center",
                              flexWrap:"wrap",gap:8,
                              borderBottom:`1px solid ${chaineBorder}`}}>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{fontSize:12,fontWeight:700,color:couleur?couleur.label:DS.ink2}}>
                                  {estPaire?`✦ Chaîne ${ci+1}`:`· Solo ${ci+1}`}
                                </span>
                                <span style={{fontSize:11,color:DS.ink3,display:"flex",alignItems:"center",gap:4}}>
                                  <TimeIcon size={10}/>{chaine.dureeTotal}min
                                  {chaine.trajetTotal>0&&<><LocationIcon size={9}/>{chaine.trajetTotal}min</>}
                                </span>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                                {/* Bouton Séparer — chaînes paires uniquement */}
                                {estPaire&&(
                                  <button onClick={()=>separerChaine(ci)}
                                    title="Séparer en 2 tâches indépendantes"
                                    style={{minHeight:44,padding:"0 10px",borderRadius:8,
                                      background:"rgba(255,255,255,0.85)",
                                      border:`1px solid ${chaineBorder}`,color:couleur?couleur.label:DS.ink2,
                                      display:"flex",alignItems:"center",gap:5,cursor:"pointer",
                                      fontSize:11,fontWeight:600,whiteSpace:"nowrap",transition:"all .15s"}}>
                                    <X size={11}/> Séparer
                                  </button>
                                )}
                                {/* Bouton Associer / Annuler / Choisir */}
                                {estSolo&&!estVilla&&!estCible&&(
                                  estSource?(
                                    <button onClick={()=>setAssocierMode(null)}
                                      style={{minHeight:44,padding:"0 10px",borderRadius:8,
                                        background:DS.amberSoft,border:`1px solid ${DS.amber}`,
                                        color:DS.amber,display:"flex",alignItems:"center",gap:5,
                                        cursor:"pointer",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>
                                      <X size={11}/> Annuler
                                    </button>
                                  ):(
                                    associerMode===null&&(
                                      <button onClick={()=>setAssocierMode(ci)}
                                        title="Associer à une autre tâche"
                                        style={{minHeight:44,padding:"0 10px",borderRadius:8,
                                          background:"rgba(255,255,255,0.85)",
                                          border:`1px solid ${DS.line}`,color:DS.ink2,
                                          display:"flex",alignItems:"center",gap:5,cursor:"pointer",
                                          fontSize:11,fontWeight:600,whiteSpace:"nowrap",transition:"all .15s"}}>
                                        🔗 Associer
                                      </button>
                                    )
                                  )
                                )}
                                {/* Bouton Choisir — cible en mode association */}
                                {estCible&&(
                                  <button onClick={()=>associerChaines(associerMode,ci)}
                                    style={{minHeight:44,padding:"0 12px",borderRadius:8,
                                      background:DS.ink,color:"white",border:"none",
                                      display:"flex",alignItems:"center",gap:5,cursor:"pointer",
                                      fontSize:11,fontWeight:700,whiteSpace:"nowrap",
                                      boxShadow:"0 2px 8px rgba(13,27,42,0.3)"}}>
                                    ✓ Choisir
                                  </button>
                                )}
                                <button onClick={()=>supprimerChaine(ci)} className="btn-danger"
                                  style={{minWidth:44,minHeight:44,borderRadius:8,background:"rgba(255,255,255,0.8)",
                                    border:`1px solid ${DS.line}`,color:DS.ink3,
                                    display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .15s"}}>
                                  <DeleteIcon size={13}/>
                                </button>
                              </div>
                            </div>
                            {/* Interventions */}
                            {chaine.inters.map((inter,ii)=>(
                              <div key={inter.id}>
                                <Carte interv={inter} extras={extras} equipe={equipe} onChange={(f,v)=>changeInChaine(ci,ii,f,v)} chaineBg={chaineBg} chaineBorder={chaineBorder}/>
                                {ii<chaine.inters.length-1&&(
                                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",
                                    background:chaineBg,borderTop:`1px solid ${chaineBorder}`,borderBottom:`1px solid ${chaineBorder}`}}>
                                    <div style={{flex:1,height:1,background:chaineBorder}}/>
                                    <span style={{fontSize:10,color:DS.ink3,fontWeight:600,display:"flex",alignItems:"center",gap:4,
                                      overflow:"hidden",maxWidth:"70%",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                                      <LocationIcon size={9} style={{flexShrink:0}}/>{trajetMin(inter.lieu||CENTRE,chaine.inters[ii+1].lieu||CENTRE)}min › {chaine.inters[ii+1].nom.replace("Appartement GH ","").replace("Appartement ","")}
                                    </span>
                                    <div style={{flex:1,height:1,background:chaineBorder}}/>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>

                    {/* Boutons actions — mobile uniquement */}
                    <div className="mobile-only" style={{display:"none",gap:10,marginTop:14,flexDirection:"column"}}>
                      <button onClick={()=>setShowCharge(true)} className="card"
                        style={{width:"100%",padding:"14px 16px",border:`1px solid ${DS.line}`,
                          borderRadius:12,fontSize:14,fontWeight:600,color:DS.ink,
                          display:"flex",alignItems:"center",justifyContent:"center",gap:8,minHeight:50,cursor:"pointer",background:"white"}}>
                        <TeamIcon size={16} color={DS.brand}/>
                        Charge du jour
                        {conflits.length>0&&<span style={{background:DS.rubySoft,color:DS.ruby,padding:"2px 8px",borderRadius:8,fontSize:12,border:"1px solid #FECACA",fontWeight:700}}>{conflits.length} conflit{conflits.length>1?"s":""}</span>}
                      </button>
                      <button onClick={genWA} className="btn-primary"
                        style={{width:"100%",padding:"14px 16px",
                          background:`linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
                          color:"white",border:"none",
                          borderRadius:12,fontSize:14,fontWeight:600,minHeight:50,
                          display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                          boxShadow:"0 4px 14px rgba(13,27,42,0.25)"}}>
                        <Send size={15}/> Générer le planning WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Panneau droit — desktop only */}
                  <div className="panel-right desktop-only" style={{display:"flex",flexDirection:"column",gap:12,position:"sticky",top:72}}>

                    {/* Charge du jour */}
                    <div className="card" style={{padding:16}}>
                      <div style={{fontSize:11,fontWeight:700,color:DS.ink3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                        <TeamIcon size={12} color={DS.brand}/> Charge du jour
                      </div>
                      {equipe.filter(e=>e.actif!==false).map(e=>{const t=ch[e.nom]||[];return(
                        <div key={e.nom} style={{marginBottom:8}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",borderRadius:10,background:e.bg,border:`1px solid ${e.coul}20`}}>
                            <span style={{fontWeight:600,fontSize:12,color:e.coul}}>{e.emoji} {e.nom}</span>
                            <span style={{fontSize:11,fontWeight:700,
                              color:t.length>=3?"#DC2626":t.length>=2?"#D97706":t.length>=1?DS.sage:DS.ink3}}>
                              {t.length>0?`${t.length} mission${t.length>1?"s":""}`:"—"}
                            </span>
                          </div>
                          {t.length>0&&<div style={{paddingLeft:10,marginTop:3}}>{t.map((x,i)=>(
                            <div key={i} style={{fontSize:10,color:DS.ink3,display:"flex",alignItems:"center",gap:4,paddingBottom:1}}>
                              <ChevronRight size={9} color={e.coul}/>{toWA(x.heureDebut)} {x.nom.replace("Appartement GH ","").replace("Appartement ","")}
                            </div>
                          ))}</div>}
                        </div>
                      );})}
                    </div>

                    {/* Conflits */}
                    {conflits.length>0
                      ?<div style={{background:DS.rubySoft,borderRadius:12,padding:"12px 14px",border:"1px solid #FECACA"}}>
                        <div style={{fontSize:11,fontWeight:700,color:DS.ruby,marginBottom:6,display:"flex",alignItems:"center",gap:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                          <AlertTriangle size={12}/> Conflits ({conflits.length})
                        </div>
                        {conflits.map((cf,i)=><div key={i} style={{fontSize:11,color:DS.ruby,paddingBottom:2}}>{cf}</div>)}
                      </div>
                      :<div className="card" style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:8,background:DS.sageSoft,border:`1px solid #A7F3D0`}}>
                        <CheckCircle2 size={14} color={DS.sage}/>
                        <span style={{fontSize:12,fontWeight:600,color:DS.sage}}>Aucun conflit</span>
                      </div>
                    }

                    {/* WhatsApp */}
                    <div className="card" style={{padding:16}}>
                      <div style={{fontSize:11,fontWeight:700,color:DS.ink3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                        <Send size={12} color={DS.brand}/> WhatsApp
                      </div>
                      <button onClick={genWA} className="btn-primary"
                        style={{width:"100%",padding:11,border:"none",borderRadius:10,fontSize:13,fontWeight:600,
                          background:`linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
                          color:"white",marginBottom:8,minHeight:44,cursor:"pointer",
                          display:"flex",alignItems:"center",justifyContent:"center",gap:7,
                          boxShadow:"0 4px 12px rgba(13,27,42,0.2)"}}>
                        <Zap size={14}/> Générer le planning
                      </button>
                      {waText&&<>
                        <textarea readOnly value={waText} onClick={e=>{e.target.select();e.target.setSelectionRange(0,99999);}}
                          style={{width:"100%",background:"#FAFAF8",borderRadius:9,padding:10,fontFamily:"monospace",fontSize:10,lineHeight:1.7,border:`1px solid ${DS.line}`,height:140,resize:"none",boxSizing:"border-box",color:DS.ink,outline:"none",marginBottom:8}}/>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          <button onClick={copier}
                            style={{padding:"10px",borderRadius:9,fontSize:12,fontWeight:600,cursor:"pointer",
                              background:copied?DS.sageSoft:"#F4F2EE",color:copied?DS.sage:DS.ink2,
                              border:`1px solid ${copied?"#A7F3D0":DS.line}`,minHeight:42,
                              display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                            {copied?<Check size={14}/>:<Copy size={14}/>} {copied?"Copié !":"Copier"}
                          </button>
                          <button onClick={()=>{window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`,"_blank");setWaSent(true);}}
                            style={{padding:"10px",border:"none",borderRadius:9,fontSize:12,fontWeight:600,cursor:"pointer",
                              background:waSent?"#128C7E":"#25D366",color:"white",minHeight:42,
                              display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                            {waSent?<Check size={14}/>:<Send size={14}/>} {waSent?"Envoyé !":"WhatsApp"}
                          </button>
                        </div>
                      </>}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══ HISTORIQUE ═══════════════════════════════ */}
          {onglet==="historique"&&(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <TimeIcon size={16} color={DS.brand}/>
                <span style={{fontSize:15,fontWeight:700,color:DS.ink}}>Historique des plannings</span>
              </div>
              <div style={{fontSize:12,color:DS.ink3,marginBottom:16}}>Plannings générés et sauvegardés automatiquement. Cliquez sur un jour pour le consulter ou le restaurer.</div>

              {historique.length===0?(
                <div className="card" style={{padding:"48px 24px",textAlign:"center"}}>
                  <div style={{fontSize:40,marginBottom:12}}>📅</div>
                  <div style={{fontSize:15,fontWeight:600,color:DS.ink,marginBottom:6}}>Aucun historique</div>
                  <div style={{fontSize:13,color:DS.ink3}}>Les plannings générés apparaîtront ici automatiquement</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {historique.slice(0,histVisible).map(h=>{
                    const isOpen=histExpanded===h.date;
                    const nbInters=h.nbChaines; // on a le nb de chaînes dans les métadonnées
                    return(
                      <div key={h.date} className="card" style={{overflow:"hidden",transition:"all .2s"}}>
                        {/* En-tête du jour */}
                        <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}
                          onClick={()=>{
                            if(isOpen){setHistExpanded(null);return;}
                            setHistExpanded(h.date);
                            // Charger le détail si pas encore chargé
                            if(!h.chaines) chargerDetailHistorique(h.date).catch(()=>{});
                          }}>
                          {/* Indicateur jour */}
                          <div style={{width:46,height:46,borderRadius:12,flexShrink:0,
                            background:`linear-gradient(135deg, ${DS.ink}12 0%, ${DS.brand}18 100%)`,
                            border:`1px solid ${DS.line}`,
                            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                            <span style={{fontSize:16,fontWeight:800,color:DS.ink,lineHeight:1}}>
                              {new Date(h.date).getDate()}
                            </span>
                            <span style={{fontSize:9,fontWeight:600,color:DS.ink3,textTransform:"uppercase",letterSpacing:"0.04em"}}>
                              {new Date(h.date).toLocaleDateString("fr-FR",{month:"short"})}
                            </span>
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:700,fontSize:14,color:DS.ink,marginBottom:2,textTransform:"capitalize",
                              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                              {h.dateLabel||h.date}
                            </div>
                            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                              <span style={{fontSize:11,color:DS.ink3,display:"flex",alignItems:"center",gap:4}}>
                                <Zap size={10} color={DS.brand}/>{h.nbChaines} chaîne{h.nbChaines>1?"s":""}
                              </span>
                              <span style={{fontSize:11,color:DS.ink3}}>
                                · {new Date(h.savedAt).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}
                              </span>
                            </div>
                            {h.agents?.length>0&&(
                              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
                                {h.agents.map(a=>{
                                  const emp=EQUIPE.find(e=>e.nom===a);
                                  return(
                                    <span key={a} style={{fontSize:10,fontWeight:600,padding:"1px 7px",borderRadius:20,
                                      background:emp?.bg||"#f1f5f9",color:emp?.coul||DS.ink2,border:`1px solid ${emp?.coul||DS.line}22`}}>
                                      {emp?.emoji||"👤"} {a}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                            <ChevronRight size={16} color={DS.ink3}
                              style={{transform:isOpen?"rotate(90deg)":"rotate(0deg)",transition:"transform .2s"}}/>
                          </div>
                        </div>

                        {/* Détail développé */}
                        {isOpen&&h.chaines&&(
                          <div style={{borderTop:`1px solid ${DS.line}`,padding:"12px 16px",
                            background:DS.paper,display:"flex",flexDirection:"column",gap:8}}>
                            {h.chaines.map((chaine,ci)=>(
                              <div key={ci} style={{background:"white",borderRadius:10,border:`1px solid ${DS.line}`,overflow:"hidden"}}>
                                <div style={{padding:"8px 12px",background:`${DS.ink}06`,
                                  borderBottom:`1px solid ${DS.line}`,
                                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                  <span style={{fontSize:12,fontWeight:700,color:DS.ink2}}>
                                    {chaine.inters.length===2?`✦ Chaîne ${ci+1}`:`· Solo ${ci+1}`}
                                  </span>
                                  <span style={{fontSize:11,color:DS.ink3,display:"flex",alignItems:"center",gap:4}}>
                                    <TimeIcon size={9}/>{chaine.inters[0]?.heureDebut||""}
                                    {chaine.inters.length>1&&<> → {chaine.inters[chaine.inters.length-1]?.heureFin}</>}
                                  </span>
                                </div>
                                {chaine.inters.map((inter,ii)=>(
                                  <div key={ii} style={{padding:"8px 12px",borderBottom:ii<chaine.inters.length-1?`1px solid #f1f5f9`:"none"}}>
                                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                                      <div style={{flex:1,minWidth:0}}>
                                        <div style={{fontWeight:600,fontSize:13,color:DS.ink,
                                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                                          {TYPE_IC[inter.type]||"🔵"} {inter.nom}
                                        </div>
                                        <div style={{fontSize:11,color:DS.ink3,marginTop:2}}>
                                          {inter.heureDebut} · {inter.d}min{inter.lieu?.q&&` · ${inter.lieu.q}`}
                                        </div>
                                      </div>
                                      {(inter.employes||[]).length>0&&(
                                        <div style={{fontSize:11,fontWeight:600,color:DS.ink2,flexShrink:0,marginLeft:8}}>
                                          {(inter.employes||[]).join(", ")}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Voir plus */}
                  {historique.length>histVisible&&(
                    <button onClick={()=>setHistVisible(p=>p+15)}
                      style={{padding:"13px",border:`1.5px dashed ${DS.line}`,borderRadius:12,
                        background:"transparent",color:DS.ink2,fontSize:13,fontWeight:600,
                        cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,minHeight:48}}
                      className="btn-ghost">
                      <ChevronRight size={14} style={{transform:"rotate(90deg)"}}/>
                      Voir {Math.min(15,historique.length-histVisible)} plannings de plus
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ═══ LOGEMENTS ════════════════════════════════ */}
          {onglet==="lieux"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <PropertyIcon size={16} color={DS.brand}/>
                  <span style={{fontSize:15,fontWeight:700,color:DS.ink}}>{lieux.length} logements</span>
                </div>
                <button onClick={()=>setWizard(true)} className="btn-primary"
                  style={{padding:"10px 18px",
                    background:`linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
                    color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:600,minHeight:42,
                    display:"flex",alignItems:"center",gap:6,cursor:"pointer",
                    boxShadow:"0 3px 10px rgba(13,27,42,0.2)"}}>
                  <Plus size={14}/> Ajouter
                </button>
              </div>
              {/* Barre de recherche */}
              <div style={{position:"relative",marginBottom:14}}>
                <input value={searchLieux} onChange={e=>setSearchLieux(e.target.value)}
                  placeholder="Rechercher par nom, quartier, client, type…"
                  style={{width:"100%",padding:"11px 14px 11px 40px",border:`1.5px solid ${DS.line}`,borderRadius:10,
                    fontSize:14,outline:"none",background:"white",color:DS.ink,fontFamily:"inherit",
                    boxSizing:"border-box",minHeight:46}}/>
                <LocationIcon size={15} color={DS.ink3} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                {searchLieux&&<button onClick={()=>setSearchLieux("")}
                  style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",color:DS.ink3,cursor:"pointer",fontSize:16,padding:4,lineHeight:1}}>✕</button>}
              </div>
              {msg&&<div style={{marginBottom:12,padding:"10px 14px",borderRadius:10,fontSize:13,fontWeight:500,background:DS.sageSoft,color:DS.sage,border:"1px solid #A7F3D0",display:"flex",alignItems:"center",gap:7}}><CheckCircle2 size={14}/>{msg.replace("✅ ","").replace("🗑 ","")}</div>}
              {searchLieux&&<div style={{fontSize:12,color:DS.ink3,marginBottom:10}}>{lieux.filter(l=>{const q=searchLieux.toLowerCase();return l.nom.toLowerCase().includes(q)||l.q?.toLowerCase().includes(q)||l.cli?.toLowerCase().includes(q)||l.type.toLowerCase().includes(q);}).length} résultat{lieux.filter(l=>{const q=searchLieux.toLowerCase();return l.nom.toLowerCase().includes(q)||l.q?.toLowerCase().includes(q)||l.cli?.toLowerCase().includes(q)||l.type.toLowerCase().includes(q);}).length>1?"s":""}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {lieux.filter(l=>{if(!searchLieux)return true;const q=searchLieux.toLowerCase();return l.nom.toLowerCase().includes(q)||l.q?.toLowerCase().includes(q)||l.cli?.toLowerCase().includes(q)||l.type.toLowerCase().includes(q);}).map(l=>{
                  const isEdit=editLieu?.id===l.id;
                  const bC=l.type==="Villa"?"#d97706":l.type==="Riad"?"#dc2626":l.type==="Bureau"?"#2563eb":"#059669";
                  return(
                    <div key={l.id} style={{background:"white",borderRadius:12,border:`1px solid #e2e8f0`,
                      borderLeft:`4px solid ${bC}`,overflow:"hidden"}}>
                      <div style={{padding:"12px 14px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                          <div style={{flex:1,minWidth:0,marginRight:10}}>
                            {isEdit
                              ?<input value={editLieu.nom} onChange={e=>setEditLieu(p=>({...p,nom:e.target.value}))}
                                style={{width:"100%",padding:"8px 10px",border:"2px solid #3b82f6",borderRadius:8,fontSize:14,fontWeight:600,outline:"none",boxSizing:"border-box",minHeight:44}}/>
                              :<div style={{fontWeight:700,fontSize:14,color:"#0f172a",lineHeight:1.3}}>
                                {TYPE_IC[l.type]||"🔵"} {l.nom}
                              </div>
                            }
                            <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                              {isEdit
                                ?<select value={editLieu.type} onChange={e=>setEditLieu(p=>({...p,type:e.target.value}))}
                                  style={{padding:"5px 8px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,minHeight:36}}>
                                  {TYPES.map(t=><option key={t}>{t}</option>)}
                                </select>
                                :<span style={{fontSize:11,color:"#64748b",background:"#f8fafc",padding:"3px 8px",borderRadius:8,border:"1px solid #e2e8f0"}}>{l.type}</span>
                              }
                              {isEdit
                                ?<input value={editLieu.q} onChange={e=>setEditLieu(p=>({...p,q:e.target.value}))}
                                  style={{padding:"5px 8px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:12,width:100,outline:"none",minHeight:36}}/>
                                :<span style={{fontSize:11,color:"#94a3b8"}}>📍 {l.q}</span>
                              }
                            </div>
                          </div>
                          <div style={{display:"flex",gap:6,flexShrink:0}}>
                            {!isEdit
                              ?<><button onClick={()=>setEditLieu({...l})}
                                  style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",
                                    background:"#f8fafc",color:"#475569",fontSize:13,minHeight:44}}>✏️</button>
                                <button onClick={()=>supprimerLieu(l.id)}
                                  style={{padding:"8px 12px",borderRadius:8,border:"1px solid #fca5a5",
                                    background:"#fef2f2",color:"#dc2626",fontSize:13,minHeight:44}}>🗑</button></>
                              :<><button onClick={()=>modifierLieu(l.id,editLieu)}
                                  style={{padding:"8px 12px",borderRadius:8,border:"none",background:"#059669",
                                    color:"white",fontSize:13,fontWeight:700,minHeight:44}}>✓</button>
                                <button onClick={()=>setEditLieu(null)}
                                  style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",
                                    background:"#f8fafc",color:"#64748b",fontSize:13,minHeight:44}}>✕</button></>
                            }
                          </div>
                        </div>

                        {/* Durée + Code + Notes */}
                        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-start"}}>
                          <div>
                            <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Durée</div>
                            {isEdit
                              ?<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                                <input value={editLieu.d} onChange={e=>setEditLieu(p=>({...p,d:parseInt(e.target.value)||90}))} type="number"
                                  style={{width:60,padding:"6px 8px",border:"2px solid #3b82f6",borderRadius:7,fontSize:13,fontWeight:700,color:"#3b82f6",outline:"none",textAlign:"center",minHeight:44}}/>
                                {[60,90,120,180,240].map(v=><button key={v} onClick={()=>setEditLieu(p=>({...p,d:v}))}
                                  style={{padding:"5px 10px",borderRadius:7,border:`1.5px solid ${editLieu.d===v?"#3b82f6":"#e2e8f0"}`,fontSize:11,
                                    background:editLieu.d===v?"#eff6ff":"white",color:editLieu.d===v?"#3b82f6":"#64748b",
                                    fontWeight:editLieu.d===v?700:400,minHeight:36}}>{v}</button>)}
                              </div>
                              :<span style={{fontSize:18,fontWeight:800,color:"#0f172a"}}>{l.d}<span style={{fontSize:11,color:"#94a3b8",fontWeight:400,marginLeft:3}}>min</span></span>
                            }
                          </div>
                          {(isEdit||l.code)&&<div>
                            <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Code</div>
                            {isEdit
                              ?<input value={editLieu.code||""} onChange={e=>setEditLieu(p=>({...p,code:e.target.value}))}
                                style={{padding:"6px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:13,width:100,outline:"none",minHeight:44}}/>
                              :<span style={{fontSize:13,color:"#475569",fontWeight:600}}>🔑 {l.code}</span>
                            }
                          </div>}
                          {(isEdit||l.notes)&&<div style={{flex:1,minWidth:120}}>
                            <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Notes</div>
                            {isEdit
                              ?<input value={editLieu.notes||""} onChange={e=>setEditLieu(p=>({...p,notes:e.target.value}))}
                                style={{width:"100%",padding:"6px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:13,outline:"none",boxSizing:"border-box",minHeight:44}}/>
                              :<span style={{fontSize:12,color:"#64748b"}}>{l.notes}</span>
                            }
                          </div>}
                        </div>

                        {/* Adresse */}
                        {(isEdit||l.adresse)&&(()=>{
                          const isMap=l.adresse&&/maps\.google|goo\.gl\/maps|maps\.app\.goo/i.test(l.adresse);
                          return(
                            <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${DS.line}`}}>
                              <div className="section-label" style={{marginBottom:5}}>Adresse</div>
                              {isEdit
                                ?<input value={editLieu.adresse||""} onChange={e=>setEditLieu(p=>({...p,adresse:e.target.value}))}
                                  placeholder="Adresse texte ou lien Google Maps"
                                  style={{width:"100%",padding:"7px 10px",border:`1px solid ${DS.line}`,borderRadius:8,
                                    fontSize:13,outline:"none",boxSizing:"border-box",minHeight:40,
                                    background:"#FAFAF8",fontFamily:"inherit",color:DS.ink}}/>
                                :(isMap
                                  ?<a href={l.adresse} target="_blank" rel="noopener noreferrer"
                                    style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,
                                      color:DS.ink2,fontWeight:500,textDecoration:"none",
                                      padding:"5px 10px",borderRadius:8,background:`${DS.ink}08`,
                                      border:`1px solid ${DS.ink}18`}}>
                                    <LocationIcon size={13} color={DS.brand}/> Voir sur Google Maps
                                  </a>
                                  :<span style={{fontSize:13,color:DS.ink2,display:"flex",alignItems:"center",gap:5}}>
                                    <LocationIcon size={13} color={DS.brand}/>{l.adresse}
                                  </span>
                                )
                              }
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ EXTRAS ═══════════════════════════════════ */}
          {onglet==="extras"&&(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <UserPlus size={16} color={DS.brand}/>
                <span style={{fontSize:15,fontWeight:700,color:DS.ink}}>Extras mémorisés</span>
              </div>
              <div style={{fontSize:12,color:DS.ink3,marginBottom:16}}>Restent en mémoire jusqu'à suppression. Disponibles dans tous les plannings.</div>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                <input value={newExtra} onChange={e=>setNewExtra(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ajouterExtra()}
                  placeholder="Prénom de l'extra"
                  style={{flex:1,padding:"12px 14px",border:`1.5px solid ${DS.line}`,borderRadius:10,fontSize:14,outline:"none",minHeight:48,background:"#FAFAF8",color:DS.ink,fontFamily:"inherit"}}/>
                <button onClick={ajouterExtra} className="btn-primary"
                  style={{padding:"12px 18px",
                    background:`linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
                    color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:600,minHeight:48,
                    display:"flex",alignItems:"center",gap:6,cursor:"pointer",
                    boxShadow:"0 3px 10px rgba(13,27,42,0.2)"}}>
                  <Plus size={15}/> Ajouter
                </button>
              </div>
              {extras.length===0
                ?<div className="card" style={{padding:"32px",textAlign:"center",color:DS.ink3,border:`1px dashed ${DS.line}`}}>
                  Tapez un prénom et appuyez sur Entrée ou + Ajouter
                </div>
                :<div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {extras.map(ex=>(
                    <div key={ex.id} className="card" style={{padding:"12px 16px",
                      display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:36,height:36,borderRadius:"50%",background:`${DS.ink}12`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <UserPlus size={15} color={DS.ink2}/>
                        </div>
                        <div>
                          <div style={{fontWeight:600,fontSize:14,color:DS.ink}}>{ex.nom}</div>
                          <div style={{fontSize:11,color:DS.ink3,marginTop:1}}>Enregistré le {new Date(ex.createdAt).toLocaleDateString("fr-FR")}</div>
                        </div>
                      </div>
                      <button onClick={()=>supprimerExtra(ex.id)} className="btn-danger"
                        style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${DS.line}`,background:"white",
                          color:DS.ink3,fontSize:13,fontWeight:500,minHeight:38,display:"flex",alignItems:"center",gap:5,cursor:"pointer",transition:"all .15s"}}>
                        <DeleteIcon size={13}/> Retirer
                      </button>
                    </div>
                  ))}
                </div>
              }
            </div>
          )}


          {/* ═══ ÉQUIPE FIXE ══════════════════════════ */}
          {onglet==="equipe"&&(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <TeamIcon size={16} color={DS.brand}/>
                <span style={{fontSize:15,fontWeight:700,color:DS.ink}}>Équipe fixe</span>
              </div>
              <div style={{fontSize:12,color:DS.ink3,marginBottom:16}}>
                Les employées listées ici apparaissent dans les assignations de chaque intervention.
                {user.role!=="admin"&&<span style={{color:DS.ink3}}> Seul l'admin peut ajouter ou supprimer.</span>}
              </div>

              {/* Ajouter employée — admin seulement */}
              {user.role==="admin"&&(
                <div className="card" style={{padding:"16px",marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:600,color:DS.ink,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                    <Plus size={14} color={DS.brand}/> Ajouter une employée
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                    <div>
                      <label className="section-label" style={{display:"block",marginBottom:6}}>Emoji</label>
                      <select value={newEmp.emoji} onChange={e=>setNewEmp(p=>({...p,emoji:e.target.value}))}
                        style={{padding:"10px 12px",border:`1.5px solid ${DS.line}`,borderRadius:9,fontSize:18,minHeight:48,minWidth:70,background:"#FAFAF8"}}>
                        {["👩","👩‍🦱","👩‍🦳","👩‍🦰","👨","👨‍🦱","👨‍🦳","👨‍🦰","🧑","👤"].map(em=><option key={em} value={em}>{em}</option>)}
                      </select>
                    </div>
                    <div style={{flex:1,minWidth:140}}>
                      <label className="section-label" style={{display:"block",marginBottom:6}}>Prénom</label>
                      <input value={newEmp.nom} onChange={e=>setNewEmp(p=>({...p,nom:e.target.value}))}
                        onKeyDown={e=>e.key==="Enter"&&ajouterEmp()}
                        placeholder="ex: Rachida"
                        style={{width:"100%",padding:"12px 14px",border:`1.5px solid ${DS.line}`,borderRadius:9,fontSize:14,outline:"none",boxSizing:"border-box",minHeight:48,background:"#FAFAF8",color:DS.ink,fontFamily:"inherit"}}/>
                    </div>
                    <div style={{paddingTop:24}}>
                      <button onClick={ajouterEmp} className="btn-primary"
                        style={{padding:"12px 18px",
                          background:`linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,
                          color:"white",border:"none",
                          borderRadius:9,fontSize:14,fontWeight:600,minHeight:48,whiteSpace:"nowrap",
                          cursor:"pointer",display:"flex",alignItems:"center",gap:6,
                          boxShadow:"0 3px 10px rgba(13,27,42,0.2)"}}>
                        <Plus size={15}/> Ajouter
                      </button>
                    </div>
                  </div>
                  {empMsg&&<div style={{padding:"9px 12px",borderRadius:9,fontSize:12,fontWeight:500,
                    background:empMsg.startsWith("✅")?DS.sageSoft:DS.rubySoft,
                    color:empMsg.startsWith("✅")?DS.sage:DS.ruby,
                    border:`1px solid ${empMsg.startsWith("✅")?"#A7F3D0":"#FECACA"}`,
                    display:"flex",alignItems:"center",gap:6}}>
                    {empMsg.startsWith("✅")?<CheckCircle2 size={13}/>:<AlertTriangle size={13}/>}
                    {empMsg.replace("✅ ","").replace("🗑 ","")}
                  </div>}
                </div>
              )}

              {/* Liste des employées */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {equipe.map(emp=>(
                  <div key={emp.id} className="card" style={{
                    padding:"12px 16px",
                    borderLeft:`3px solid ${emp.actif!==false?emp.coul:DS.line}`,
                    opacity:emp.actif===false?.5:1,transition:"opacity .2s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:44,height:44,borderRadius:"50%",background:emp.bg,
                          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,
                          border:`2px solid ${emp.coul}30`}}>
                          {emp.emoji}
                        </div>
                        <div>
                          <div style={{fontWeight:700,fontSize:15,color:emp.actif!==false?emp.coul:DS.ink3,display:"flex",alignItems:"center",gap:8}}>
                            {emp.nom}
                            {empJoursOff[emp.id]&&empJoursOff[emp.id].length>0&&(
                              <span style={{fontSize:11,background:"#fef3c7",color:"#92400e",padding:"2px 8px",borderRadius:6,fontWeight:600}}>
                                📅 {empJoursOff[emp.id].length}
                              </span>
                            )}
                          </div>
                          <div style={{fontSize:11,color:DS.ink3,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                            {emp.actif===false
                              ?<><X size={10}/>Inactive</>
                              :<><CheckCircle2 size={10} color={DS.sage}/>Active</>}
                          </div>
                        </div>
                      </div>

                      {user.role==="admin"&&(
                        <div style={{display:"flex",gap:6,flexShrink:0}}>
                          <button onClick={()=>setDaysOffModal({empId:emp.id,startDate:"",endDate:"",datesList:[]})}
                            style={{padding:"7px 11px",borderRadius:8,fontSize:11,fontWeight:600,minHeight:38,cursor:"pointer",
                              border:`1px solid ${DS.line}`,
                              background:"white",color:DS.ink3,transition:"all .15s",display:"flex",alignItems:"center",gap:4}}>
                            📅 Jours
                          </button>
                          <button onClick={()=>toggleEmpActif(emp.id,emp.actif===false)}
                            style={{padding:"7px 11px",borderRadius:8,fontSize:11,fontWeight:600,minHeight:38,cursor:"pointer",
                              border:`1px solid ${emp.actif!==false?DS.line:"#A7F3D0"}`,
                              background:emp.actif!==false?"#FAFAF8":DS.sageSoft,
                              color:emp.actif!==false?DS.ink2:DS.sage,transition:"all .15s"}}>
                            {emp.actif!==false?"Désactiver":"Activer"}
                          </button>
                          <button onClick={()=>supprimerEmp(emp.id)} className="btn-danger"
                            style={{padding:"7px 11px",borderRadius:8,border:`1px solid ${DS.line}`,
                              background:"white",color:DS.ink3,fontSize:13,minHeight:38,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center"}}>
                            <DeleteIcon size={13}/>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {equipe.length===0&&(
                  <div style={{background:"white",borderRadius:10,padding:"28px",textAlign:"center",color:"#94a3b8",border:"1px dashed #e2e8f0"}}>
                    Aucune employée dans l'équipe
                  </div>
                )}
              </div>

              {/* Légende */}
              <div style={{marginTop:14,padding:"10px 13px",background:"#eff6ff",borderRadius:9,border:"1px solid #bfdbfe",fontSize:11,color:"#1e40af"}}>
                💡 <strong>Désactiver</strong> masque l'employée des assignations sans la supprimer — utile en cas d'absence prolongée.
                <strong> Supprimer</strong> la retire définitivement de l'équipe.
              </div>
            </div>
          )}

          {/* ═══ UTILISATEURS ════════════════════════════ */}
          {onglet==="users"&&user.role==="admin"&&(
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:12}}>⚙️ Gestion des accès</div>
              {userMsg&&<div style={{marginBottom:12,padding:"9px 12px",borderRadius:9,fontSize:12,fontWeight:600,
                background:userMsg.startsWith("✅")?"#f0fdf4":"#fef2f2",
                color:userMsg.startsWith("✅")?"#166534":"#dc2626",
                border:`1px solid ${userMsg.startsWith("✅")?"#86efac":"#fca5a5"}`}}>{userMsg}</div>}
              <div style={{background:"white",borderRadius:12,padding:"14px 16px",border:"1px solid #e2e8f0",marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:12}}>+ Créer un accès</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[["Identifiant","username","ex: amina",false],["Mot de passe","password","ex: Kleaning2024",true],["Prénom affiché","displayName","ex: Amina",false]].map(([label,key,ph,isPwd])=>(
                    <div key={key}>
                      <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>{label}</label>
                      <input type={isPwd?"password":"text"} value={newUser[key]} onChange={e=>setNewUser(p=>({...p,[key]:e.target.value}))}
                        placeholder={ph} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #e2e8f0",borderRadius:9,fontSize:14,outline:"none",boxSizing:"border-box",minHeight:48}}/>
                    </div>
                  ))}
                  <button onClick={creerUser} className="btn-primary"
                    style={{padding:"14px",background:`linear-gradient(135deg, ${DS.ink} 0%, ${DS.ink2} 100%)`,color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:600,minHeight:50,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 3px 10px rgba(13,27,42,0.2)"}}>
                    Créer l'accès
                  </button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {users.map(u=>(
                  <div key={u.id} style={{background:"white",borderRadius:10,padding:"12px 14px",border:"1px solid #e2e8f0",
                    display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:14,color:"#0f172a",display:"flex",alignItems:"center",gap:6}}>
                        {u.displayName}
                        {u.role==="admin"&&<span style={{fontSize:10,background:"#fef3c7",color:"#92400e",padding:"1px 7px",borderRadius:8,fontWeight:700}}>ADMIN</span>}
                      </div>
                      <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>@{u.username} · {new Date(u.createdAt).toLocaleDateString("fr-FR")}</div>
                    </div>
                    {u.id!==user.id&&u.role!=="admin"&&<button onClick={()=>supprimerUser(u.id)}
                      style={{padding:"8px 12px",borderRadius:8,border:"1px solid #fca5a5",background:"#fef2f2",color:"#dc2626",fontSize:13,minHeight:44}}>🗑</button>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── NAVIGATION BAS — Interface mobile (<640px) ──────
            Navigation fixe en bas : 5 onglets + bouton déconnexion
            - Affichée UNIQUEMENT sur mobile via media query (@media max-width:640px)
            - minHeight:56px pour touch target accessible (44px min + padding)
            - borderTop utilise DS.brand (#c84b1f) pour l'onglet actif
            - Safe-area-inset-bottom pour notches iOS en bas
            - Position:fixed pour rester visible au scroll
            ──────────────────────────────────────────────────── */}
        <nav className="nav-bottom" style={{
          position:"fixed",bottom:0,left:0,right:0,zIndex:100,
          background:DS.ink,
          borderTop:"1px solid rgba(201,168,76,0.2)",
          display:"flex",alignItems:"stretch",
          paddingBottom:"env(safe-area-inset-bottom,0px)",
          boxShadow:"0 -4px 20px rgba(13,27,42,0.25)",
        }}>
          {TABS.map(([k,,l])=>{
            const active=onglet===k;
            const NavIcons={planning:<CalendarDays size={20}/>,historique:<TimeIcon size={20}/>,lieux:<PropertyIcon size={20}/>,extras:<UserPlus size={20}/>,equipe:<TeamIcon size={20}/>,users:<Settings size={20}/>};
            return(
              <button key={k} onClick={()=>setOnglet(k)}
                style={{
                  flex:1,padding:"10px 4px 8px",background:"none",border:"none",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                  color:active?DS.brand:"rgba(255,255,255,0.38)",
                  cursor:"pointer",minHeight:56,
                  borderTop:active?`2px solid ${DS.brand}`:"2px solid transparent",
                  transition:"all .15s",
                }}>
                {NavIcons[k]||<Star size={20}/>}
                <span style={{fontSize:9,fontWeight:active?700:500,letterSpacing:"0.04em",
                  maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l}</span>
              </button>
            );
          })}
          <button onClick={logout}
            style={{
              flex:1,padding:"10px 4px 8px",background:"none",border:"none",
              display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              color:"rgba(255,255,255,0.3)",cursor:"pointer",minHeight:56,
              borderTop:"2px solid transparent",
            }}>
            <LogOut size={20}/>
            <span style={{fontSize:9,fontWeight:500}}>Sortir</span>
          </button>
        </nav>

        {/* ── BOTTOM SHEETS MOBILES ═══════════════════════════
            Composants drawer mobiles : montent du bas avec animation slideUp
            Utilisés pour afficher des infos détaillées sur petit écran
            - Masqués sur desktop via showCharge/showWA
            - Padding: safe-area-inset pour notches iOS en bas
            - Animation slideUp (.25s) et fond semi-transparent
            ──────────────────────────────────────────────────── */}

        {/* Charge du jour */}
        <BottomSheet visible={showCharge} onClose={()=>setShowCharge(false)} title="👥 Charge du jour">
          {EQUIPE.map(e=>{const t=ch[e.nom]||[];return(
            <div key={e.nom} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",borderRadius:10,background:e.bg}}>
                <span style={{fontWeight:700,fontSize:14,color:e.coul}}>{e.emoji} {e.nom}</span>
                <span style={{fontSize:13,fontWeight:700,color:t.length>=3?"#ef4444":t.length>=2?"#f97316":t.length>=1?"#059669":"#94a3b8"}}>{t.length>0?`${t.length} mission${t.length>1?"s":""}`:"—"}</span>
              </div>
              {t.length>0&&<div style={{paddingLeft:12,marginTop:4}}>{t.map((x,i)=><div key={i} style={{fontSize:12,color:"#94a3b8",paddingBottom:2}}>{toWA(x.heureDebut)} · {x.nom.replace("Appartement GH ","").replace("Appartement ","")}</div>)}</div>}
            </div>
          );})}
          {conflits.length>0&&(
            <div style={{marginTop:6,padding:"10px 12px",background:"#fef2f2",borderRadius:10,border:"1px solid #fca5a5"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#dc2626",marginBottom:4}}>⚠️ Conflits</div>
              {conflits.map((c,i)=><div key={i} style={{fontSize:12,color:"#dc2626"}}>{c}</div>)}
            </div>
          )}
        </BottomSheet>

        {/* WhatsApp — bottom sheet mobile */}
        <BottomSheet visible={showWA} onClose={()=>setShowWA(false)} title="💬 Planning WhatsApp">
          {waText&&<>
            <textarea readOnly value={waText} onClick={e=>{e.target.select();e.target.setSelectionRange(0,99999);}}
              style={{width:"100%",background:"#f8fafc",borderRadius:10,padding:12,fontFamily:"monospace",fontSize:11,
                lineHeight:1.7,border:"1px solid #e2e8f0",height:200,resize:"none",boxSizing:"border-box",
                color:"#1e293b",outline:"none",marginBottom:12}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button onClick={copier}
                style={{padding:"14px",border:"none",borderRadius:12,fontSize:14,fontWeight:700,
                  background:copied?"#059669":"#475569",color:"white",minHeight:50,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                {copied?"✅":"📋"} {copied?"Copié !":"Copier"}
              </button>
              <button onClick={()=>{window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`,"_blank");setWaSent(true);}}
                style={{padding:"14px",border:"none",borderRadius:12,fontSize:14,fontWeight:700,
                  background:waSent?"#128C7E":"#25D366",color:"white",minHeight:50,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                {waSent?"✅":"📤"} {waSent?"Ouvert !":"WhatsApp"}
              </button>
            </div>
          </>}
        </BottomSheet>

        {/* Confirmation Dialog pour aux suppressions */}
        <ConfirmDialog
          visible={confirmDialog.visible}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={()=>setConfirmDialog({visible:false,title:"",message:"",onConfirm:null})}
        />

        {/* Modal Jours Off */}
        {daysOffModal&&<DaysOffModal
          visible={true}
          empId={daysOffModal.empId}
          empName={equipe.find(e=>e.id===daysOffModal.empId)?.nom||""}
          initialDates={empJoursOff[daysOffModal.empId]||[]}
          onSave={(dates)=>saveDaysOff(daysOffModal.empId,dates)}
          onCancel={()=>setDaysOffModal(null)}
        />}

      </div>
    </>
  );
}
