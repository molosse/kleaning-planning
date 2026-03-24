import { useState, useEffect, useRef } from "react";
import Login from "./Login.jsx";

// ═══════════════════════════════════════════════════════════════
// KLEANING — APP MOBILE-FIRST v6
// Design : utilitarian + épuré, optimisé tactile
// Breakpoints : mobile < 640px, tablet 640-1024px, desktop > 1024px
// ═══════════════════════════════════════════════════════════════

const EQUIPE_FALLBACK=[
  {id:"emp_1",nom:"Majda", emoji:"👩‍🦱",coul:"#2563eb",bg:"#dbeafe",actif:true},
  {id:"emp_2",nom:"Amina", emoji:"👩",  coul:"#059669",bg:"#d1fae5",actif:true},
  {id:"emp_3",nom:"Touria",emoji:"👩‍🦳",coul:"#7c3aed",bg:"#ede9fe",actif:true},
  {id:"emp_4",nom:"Imane", emoji:"👩‍🦰",coul:"#d97706",bg:"#fef3c7",actif:true},
];
const EQUIPE=[
  {nom:"Majda",  coul:"#2563eb",bg:"#dbeafe",emoji:"👩‍🦱"},
  {nom:"Amina",  coul:"#059669",bg:"#d1fae5",emoji:"👩"},
  {nom:"Touria", coul:"#7c3aed",bg:"#ede9fe",emoji:"👩‍🦳"},
  {nom:"Imane",  coul:"#d97706",bg:"#fef3c7",emoji:"👩‍🦰"},
];

const TYPE_IC={"Bureau":"🔷","Appartement GH":"🟢","Villa":"🟠","Riad":"⭕","Appartement MM":"🔵","Appartement":"🟡"};
const CLIENT_IC={"Cabinet médical":"🔴"};
const TYPES=["Appartement GH","Appartement MM","Appartement","Villa","Riad","Bureau"];
const CENTRE={lat:31.635,lng:-8.010};
const CHAINE_COLORS=[
  {bg:"#fef9c3",border:"#fbbf24",label:"#92400e"},
  {bg:"#d1fae5",border:"#34d399",label:"#065f46"},
  {bg:"#dbeafe",border:"#60a5fa",label:"#1e40af"},
  {bg:"#ede9fe",border:"#a78bfa",label:"#5b21b6"},
  {bg:"#ffedd5",border:"#fb923c",label:"#9a3412"},
  {bg:"#fce7f3",border:"#f472b6",label:"#9d174d"},
  {bg:"#e0f2fe",border:"#38bdf8",label:"#075985"},
  {bg:"#dcfce7",border:"#4ade80",label:"#14532d"},
];

// ── CSS GLOBAL ────────────────────────────────────────────────
const GLOBAL_CSS = `
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { margin: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #f1f5f9; }
  input, select, button, textarea { font-family: inherit; }
  button { cursor: pointer; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.2s ease-out; }
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
`;

// ── UTILITAIRES ───────────────────────────────────────────────
function distKm(a,b){if(!a||!b)return 5;const R=6371,dlat=Math.PI/180*(b.lat-a.lat),dlng=Math.PI/180*(b.lng-a.lng);const x=Math.sin(dlat/2)**2+Math.cos(Math.PI/180*a.lat)*Math.cos(Math.PI/180*b.lat)*Math.sin(dlng/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
function trajetMin(a,b){return Math.round(distKm(a,b)/25*60)+5;}
function minToH(m){return `${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;}
function hToMin(h){const[a,b]=(h||"12:00").split(":").map(Number);return a*60+b;}
function toWA(h){return(h||"").replace(":","h");}

function hDefaut(nom){
  if(/cabinet.m[eé]d/i.test(nom))return 8*60;
  if(/alami/i.test(nom))return 10*60+30;
  if(/zoraida/i.test(nom))return 11*60+30;
  if(/coralia/i.test(nom))return 11*60;
  return 12*60;
}
function hFin(nom,d){
  if(/cabinet.m[eé]d/i.test(nom))return 10*60;
  if(/alami/i.test(nom))return 12*60;
  if(/zoraida/i.test(nom))return 16*60;
  return hDefaut(nom)+d;
}

function matchLieu(s,lieux){
  if(!s||!lieux?.length)return null;
  const n=s.toLowerCase();
  return lieux.find(l=>{
    const ln=l.nom.toLowerCase().replace("appartement gh ","").replace("appartement ","").replace("villa ","").replace("gh ","");
    return n.includes(ln.slice(0,7))||ln.includes(n.replace(/gh\s+/g,"").replace(/airbnb\s+/g,"").replace(/apt\s+/g,"").trim().slice(0,7));
  });
}

function parseEv(ev,lieux){
  const s=ev.summary||"";const nom=ev.nom||s;
  const lieu=matchLieu(nom,lieux)||matchLieu(s,lieux);
  const t=lieu?.type||ev.type||"Appartement GH";
  const d=lieu?.d||90;const debut=hDefaut(nom);const fin=hFin(nom,d);
  return{id:ev.id,nom,type:t,cli:ev.cli||"GetHost",lieu,d,debut,fin,employes:[],bla_linge:false,heureDebut:minToH(debut),heureFin:minToH(fin)};
}

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
    if(chaine.length<2){
      let best=null,bestT=Infinity;
      for(let j=0;j<sorted.length;j++){
        if(assigned.has(sorted[j].id))continue;
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
    const inters=lieux.map((l,i)=>{const debut=h,fin=debut+l.d;if(i<lieux.length-1)h=fin+trajetMin(lieux[i].lieu||CENTRE,lieux[i+1].lieu||CENTRE);return{...l,debut,fin,heureDebut:minToH(debut),heureFin:minToH(fin)};});
    const tT=lieux.reduce((s,_,i)=>i<lieux.length-1?s+trajetMin(lieux[i].lieu||CENTRE,lieux[i+1].lieu||CENTRE):s,0);
    return{inters,trajetTotal:tT,dureeTotal:inters[inters.length-1].fin-inters[0].debut};
  });
  return result.sort((a,b)=>a.inters[0].debut-b.inters[0].debut);
}

function apiCall(path,method="GET",body=null){
  const token=sessionStorage.getItem("kleaning_token");
  return fetch(path,{method,headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},...(body?{body:JSON.stringify(body)}:{})}).then(r=>r.json());
}

// ── BOTTOM SHEET (mobile) — drawer qui monte du bas ──────────
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

// ── SÉLECTEUR EMPLOYÉ — bottom sheet sur mobile ───────────────
function SelEmp({employes,extras,equipe:equipeS,onAdd,onRemove,onClose,anchorRef}){
  const allE=extras.map(e=>({nom:e.nom,coul:"#64748b",bg:"#f1f5f9",emoji:"👤"}));
  const dispo=[...(equipeS||EQUIPE_FALLBACK).filter(e=>!employes.includes(e.nom)&&e.actif!==false),...allE.filter(e=>!employes.includes(e.nom))];

  // Desktop : dropdown relatif à l'ancre
  // Mobile : bottom sheet géré par le parent
  return(
    <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,zIndex:999,minWidth:180,
      background:"white",borderRadius:12,border:"1px solid #e2e8f0",
      boxShadow:"0 12px 32px rgba(0,0,0,0.15)",padding:10}}>
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
  );
}

// ── CARTE INTERVENTION ────────────────────────────────────────
function Carte({interv,extras,equipe:equipeP,onChange,chaineBg,chaineBorder}){
  const[openSel,setOpenSel]=useState(false);
  const[editHr,setEditHr]=useState(false);
  const ep=(equipeP||EQUIPE_FALLBACK).find(e=>e.nom===(interv.employes||[])[0]);
  const isBureau=interv.type==="Bureau"||interv.cli==="Cabinet médical";
  const isVilla=interv.type==="Villa";
  const villaManque=isVilla&&(interv.employes||[]).length<2;
  const ic=CLIENT_IC[interv.cli]||TYPE_IC[interv.type]||"🔵";
  const HEURES=["07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","17:00"];
  const selRef=useRef();

  // Fermer le sélecteur si clic extérieur
  useEffect(()=>{
    if(!openSel)return;
    const h=e=>{if(selRef.current&&!selRef.current.contains(e.target))setOpenSel(false);};
    document.addEventListener("mousedown",h);document.addEventListener("touchstart",h);
    return()=>{document.removeEventListener("mousedown",h);document.removeEventListener("touchstart",h);};
  },[openSel]);

  return(
    <div style={{padding:"12px 14px",background:chaineBg||"white",borderLeft:`4px solid ${ep?ep.coul:chaineBorder||"#e2e8f0"}`}}>

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
          style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,minHeight:34,
            background:interv.bla_linge?"#fef9c3":"rgba(255,255,255,0.7)",
            color:interv.bla_linge?"#92400e":"#94a3b8",
            border:`1.5px solid ${interv.bla_linge?"#fde68a":"rgba(0,0,0,0.1)"}`}}>
          🧺 {interv.bla_linge?"bla linge ✓":"bla linge"}
        </button>
      </div>

      {/* Ligne 3 : assignation */}
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",position:"relative"}} ref={selRef}>
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
        <div style={{position:"relative"}}>
          {!(interv.employes||[]).length
            ?<button onClick={()=>setOpenSel(p=>!p)}
              style={{padding:"6px 14px",borderRadius:20,fontSize:13,fontWeight:700,minHeight:40,
                background:"rgba(255,255,255,0.9)",color:"#dc2626",border:"2px solid #fca5a5",
                display:"flex",alignItems:"center",gap:6}}>
              ⚠️ À assigner
              <span style={{width:22,height:22,borderRadius:"50%",background:"#dc2626",color:"white",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,lineHeight:1,fontWeight:700}}>+</span>
            </button>
            :<button onClick={()=>setOpenSel(p=>!p)}
              style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.8)",
                color:"#475569",border:"1.5px solid rgba(0,0,0,0.15)",fontSize:20,fontWeight:700,
                display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>+</button>
          }
          {openSel&&(
            <SelEmp employes={interv.employes||[]} extras={extras} equipe={equipeP||EQUIPE_FALLBACK}
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
const WQ=[
  {id:"nom",   label:"Nom du logement",          placeholder:"ex: Appartement GH Lotus",req:true},
  {id:"type",  label:"Type de logement",          placeholder:"",                        req:true,opts:TYPES},
  {id:"cli",   label:"Client / Propriétaire",     placeholder:"ex: GetHost, Atlas",      req:false},
  {id:"q",     label:"Quartier / Zone",           placeholder:"ex: Guéliz, Targa",       req:true},
  {id:"lat",   label:"Latitude GPS",              placeholder:"ex: 31.639675",           req:true},
  {id:"lng",   label:"Longitude GPS",             placeholder:"ex: -8.018080",           req:true},
  {id:"d",     label:"Durée intervention (min)",  placeholder:"ex: 90",                  req:true},
  {id:"code",  label:"Code d'accès",              placeholder:"ex: 262626#",             req:false},
  {id:"notes", label:"Notes accès",               placeholder:"ex: 5ème étage",          req:false},
];
function Wizard({onSave,onClose}){
  const[step,setStep]=useState(0);const[data,setData]=useState({});const[err,setErr]=useState("");
  const q=WQ[step];
  const next=()=>{
    if(q.req&&!data[q.id]){setErr("Champ obligatoire");return;}setErr("");
    if(step<WQ.length-1)setStep(s=>s+1);
    else onSave({nom:data.nom,type:data.type||"Appartement GH",cli:data.cli||"Particulier",
      q:data.q||"Guéliz",lat:parseFloat(data.lat)||31.635,lng:parseFloat(data.lng)||-8.010,
      d:parseInt(data.d)||90,code:data.code||"",notes:data.notes||""});
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:3000,
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"white",borderRadius:"20px 20px 0 0",padding:"0 20px 32px",
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
                  color:data.d===String(v)?"#3b82f6":"#64748b",minHeight:40}}>
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
            style={{flex:2,padding:14,background:"#0f172a",color:"white",border:"none",
              borderRadius:12,fontSize:15,fontWeight:700,minHeight:50}}>
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

// ── APP PRINCIPALE ────────────────────────────────────────────
export default function App(){
  const[user,setUser]=useState(null);
  const[onglet,setOnglet]=useState("planning");
  const[dateQ,setDateQ]=useState(()=>{const d=new Date();d.setDate(d.getDate()+1);return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;});
  const[loading,setLoading]=useState(false);
  const[msg,setMsg]=useState("");
  const[syncTime,setSyncTime]=useState("—");
  const[lieux,setLieux]=useState([]);
  const[extras,setExtras]=useState([]);
  const[users,setUsers]=useState([]);
  const[chaines,setChaines]=useState([]);
  const[waText,setWaText]=useState("");
  const[copied,setCopied]=useState(false);
  const[waSent,setWaSent]=useState(false);
  const[wizard,setWizard]=useState(false);
  const[newExtra,setNewExtra]=useState("");
  const[newUser,setNewUser]=useState({username:"",password:"",displayName:""});
  const[userMsg,setUserMsg]=useState("");
  const[editLieu,setEditLieu]=useState(null);
  const[showWA,setShowWA]=useState(false);
  const[showCharge,setShowCharge]=useState(false);
  const[equipe,setEquipe]=useState([
    {id:"emp_1",nom:"Majda", emoji:"👩‍🦱",coul:"#2563eb",bg:"#dbeafe",actif:true},
    {id:"emp_2",nom:"Amina", emoji:"👩",  coul:"#059669",bg:"#d1fae5",actif:true},
    {id:"emp_3",nom:"Touria",emoji:"👩‍🦳",coul:"#7c3aed",bg:"#ede9fe",actif:true},
    {id:"emp_4",nom:"Imane", emoji:"👩‍🦰",coul:"#d97706",bg:"#fef3c7",actif:true},
  ]);
  const[newEmp,setNewEmp]=useState({nom:"",emoji:"👤"});
  const[empMsg,setEmpMsg]=useState("");

  useEffect(()=>{
    const token=sessionStorage.getItem("kleaning_token");
    if(token){fetch("/api/auth/me",{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()).then(d=>{if(d.username)setUser(d);}).catch(()=>{});}
  },[]);

  useEffect(()=>{if(user){chargerExtras();chargerLieux();chargerEquipe();if(user.role==="admin")chargerUsers();},[user]);

  const chargerExtras=()=>apiCall("/api/extras").then(d=>{if(d.extras)setExtras(d.extras);});
  const chargerLieux=()=>apiCall("/api/lieux").then(d=>{if(d.lieux)setLieux(d.lieux);});
  const chargerUsers=()=>apiCall("/api/users").then(d=>{if(d.users)setUsers(d.users);});
  const chargerEquipe=()=>apiCall("/api/equipe").then(d=>{if(d.equipe&&d.equipe.length)setEquipe(d.equipe);});

  const chargerAgenda=async()=>{
    setLoading(true);setMsg("");setWaText("");
    const[d,m,y]=dateQ.split("/");
    const data=await apiCall(`/api/calendar?date=${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`);
    if(data.events?.length>0){
      const parsed=data.events.map(e=>parseEv(e,lieux));
      const c=optimiser(parsed);setChaines(c);
      setSyncTime(`${dateQ} ${new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}`);
      setMsg(`✅ ${parsed.length} interventions · ${c.length} chaînes`);
    }else{setMsg(`ℹ️ Aucun événement — ${dateQ}`);}
    setLoading(false);
  };

  const changeInChaine=(ci,ii,f,v)=>{
    setChaines(p=>{const upd=[...p];const c={...upd[ci],inters:[...upd[ci].inters]};c.inters[ii]={...c.inters[ii],[f]:v};
      if(f==="heureDebut"){let h=hToMin(v);c.inters=c.inters.map((inter,i)=>{const debut=h,fin=debut+inter.d;if(i<c.inters.length-1)h=fin+trajetMin(inter.lieu||CENTRE,c.inters[i+1].lieu||CENTRE);return{...inter,debut,fin,heureDebut:minToH(debut),heureFin:minToH(fin)};});c.dureeTotal=c.inters[c.inters.length-1].fin-c.inters[0].debut;}
      upd[ci]=c;return upd;});setWaText("");
  };

  const changerHeureCh=(ci,newH)=>{
    setChaines(p=>{const upd=[...p];const c={...upd[ci]};let h=hToMin(newH);
      c.inters=c.inters.map((inter,i)=>{const debut=h,fin=debut+inter.d;if(i<c.inters.length-1)h=fin+trajetMin(inter.lieu||CENTRE,c.inters[i+1].lieu||CENTRE);return{...inter,debut,fin,heureDebut:minToH(debut),heureFin:minToH(fin)};});
      c.dureeTotal=c.inters[c.inters.length-1].fin-c.inters[0].debut;upd[ci]=c;return upd;});setWaText("");
  };

  const supprimerChaine=ci=>{setChaines(p=>p.filter((_,i)=>i!==ci));setWaText("");};

  const genWA=()=>{
    const[d,m,y]=dateQ.split("/");
    const label=new Date(`${y}-${m}-${d}`).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    let txt="`Planning du jour - "+label.charAt(0).toUpperCase()+label.slice(1)+"` :\n\n";
    const all=chaines.flatMap(c=>c.inters);const parEmp={};
    all.forEach(inter=>{const emps=inter.employes||[];if(!emps.length){if(!parEmp["__none__"])parEmp["__none__"]=[];parEmp["__none__"].push(inter);}else emps.forEach(e=>{if(!parEmp[e])parEmp[e]=[];parEmp[e].push(inter);});});
    Object.entries(parEmp).sort(([,a],[,b])=>hToMin(a[0].heureDebut)-hToMin(b[0].heureDebut)).forEach(([emp,inters])=>{
      const sorted=[...inters].sort((a,b)=>hToMin(a.heureDebut)-hToMin(b.heureDebut));
      const isBur=t=>t==="Bureau"||t==="Cabinet médical";
      const taches=sorted.map(i=>`${CLIENT_IC[i.cli]||TYPE_IC[i.type]||"🔵"} _${i.nom}_ ${isBur(i.type)||isBur(i.cli)?`${toWA(i.heureDebut)}->${toWA(i.heureFin)}`:toWA(i.heureDebut)}${i.bla_linge?" (bla linge)":""}`).join(", ");
      txt+=`${taches} : ${emp==="__none__"?"**":`*${emp}*`},\n`;
    });
    txt=txt.trimEnd().replace(/,$/,"");setWaText(txt);setCopied(false);setWaSent(false);setShowWA(true);
  };

  const copier=()=>{if(!waText)return;const ta=document.createElement("textarea");ta.value=waText;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,99999);try{document.execCommand("copy");setCopied(true);setTimeout(()=>setCopied(false),3000);}catch{}document.body.removeChild(ta);};

  // ── ÉQUIPE ────────────────────────────────────────────
  const ajouterEmp=async()=>{
    const {nom,emoji}=newEmp;
    if(!nom.trim())return;
    const data=await apiCall("/api/equipe","POST",{nom:nom.trim(),emoji:emoji||"👤"});
    if(data.employe){setEquipe(p=>[...p,data.employe]);setNewEmp({nom:"",emoji:"👤"});setEmpMsg(`✅ "${data.employe.nom}" ajoutée`);}
    else setEmpMsg(data.message||"Erreur");
  };
  const supprimerEmp=async(id)=>{
    const e=equipe.find(x=>x.id===id);
    const data=await apiCall(`/api/equipe/${id}`,"DELETE");
    if(data.message){setEquipe(p=>p.filter(x=>x.id!==id));setEmpMsg(`🗑 "${e?.nom}" retirée`);}
  };
  const toggleEmpActif=async(id,actif)=>{
    const data=await apiCall(`/api/equipe/${id}`,"PUT",{actif});
    if(data.employe)setEquipe(p=>p.map(x=>x.id===id?data.employe:x));
  };

  const ajouterExtra=async()=>{const n=newExtra.trim();if(!n)return;const data=await apiCall("/api/extras","POST",{nom:n});if(data.extra){setExtras(p=>[...p,data.extra]);setNewExtra("");}};
  const supprimerExtra=async(id)=>{await apiCall(`/api/extras/${id}`,"DELETE");setExtras(p=>p.filter(e=>e.id!==id));};
  const ajouterLieu=async(lieu)=>{const data=await apiCall("/api/lieux","POST",lieu);if(data.logement){setLieux(p=>[...p,data.logement]);setWizard(false);setMsg(`✅ "${data.logement.nom}" ajouté`);}};
  const supprimerLieu=async(id)=>{const l=lieux.find(x=>x.id===id);await apiCall(`/api/lieux/${id}`,"DELETE");setLieux(p=>p.filter(x=>x.id!==id));setMsg(`🗑 "${l?.nom}" supprimé`);};
  const modifierLieu=async(id,data)=>{const res=await apiCall(`/api/lieux/${id}`,"PUT",data);if(res.logement){setLieux(p=>p.map(l=>l.id===id?res.logement:l));setEditLieu(null);setMsg("✅ Mis à jour");}};
  const creerUser=async()=>{const data=await apiCall("/api/users","POST",newUser);if(data.user){setUsers(p=>[...p,data.user]);setNewUser({username:"",password:"",displayName:""});setUserMsg(`✅ "${data.user.displayName}" créé`);}else setUserMsg(data.message||"Erreur");};
  const supprimerUser=async(id)=>{const data=await apiCall(`/api/users/${id}`,"DELETE");if(data.message){setUsers(p=>p.filter(u=>u.id!==id));setUserMsg(data.message);}};
  const logout=()=>{sessionStorage.removeItem("kleaning_token");setUser(null);};

  const nbSans=chaines.flatMap(c=>c.inters).filter(i=>!(i.employes||[]).length).length;
  const nbVilla=chaines.flatMap(c=>c.inters).filter(i=>i.type==="Villa"&&(i.employes||[]).length<2).length;
  const charge=()=>{const c={};chaines.flatMap(x=>x.inters).forEach(i=>(i.employes||[]).forEach(n=>{if(!c[n])c[n]=[];c[n].push(i);}));return c;};
  const conflits=equipe.filter(e=>e.actif!==false).flatMap(e=>{const all=chaines.flatMap(c=>c.inters.filter(i=>(i.employes||[]).includes(e.nom))).sort((a,b)=>hToMin(a.heureDebut)-hToMin(b.heureDebut));const cfls=[];for(let i=0;i<all.length-1;i++)if(hToMin(all[i].heureFin)>hToMin(all[i+1].heureDebut))cfls.push(`${e.nom}: ${all[i].nom.split(" ").pop()} → ${all[i+1].nom.split(" ").pop()}`);return cfls;});
  const ch=charge();
  const HEURES_S=["07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","17:00"];

  const TABS=[["planning","📋","Planning"],["lieux","🏠","Logements"],["extras","👤","Extras"],["equipe","👥","Équipe"],...(user?.role==="admin"?[["users","⚙️","Comptes"]]:[] )];

  if(!user)return<Login onLogin={u=>{setUser(u);}}/>;

  return(
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{fontFamily:"inherit",background:"#f1f5f9",minHeight:"100vh",paddingBottom:70}}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div style={{background:"#0f172a",padding:"12px 16px 10px",position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:1080,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>🧹</span>
              <div>
                <div style={{color:"white",fontSize:15,fontWeight:700,lineHeight:1.2}}>Kleaning</div>
                <div style={{color:"#64748b",fontSize:10,lineHeight:1.2}}>{user.displayName} · {syncTime}</div>
              </div>
            </div>

            {/* Tabs desktop */}
            <div className="nav-top-tabs" style={{display:"flex",gap:4,alignItems:"center"}}>
              {TABS.map(([k,ic,l])=>(
                <button key={k} onClick={()=>setOnglet(k)}
                  style={{padding:"6px 12px",borderRadius:8,border:"none",fontSize:11,fontWeight:600,
                    background:onglet===k?"white":"rgba(255,255,255,0.1)",
                    color:onglet===k?"#0f172a":"rgba(255,255,255,0.7)"}}>
                  {ic} {l}
                </button>
              ))}
              <button onClick={logout}
                style={{padding:"6px 10px",background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)",
                  border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,fontSize:11,marginLeft:4}}>
                Déco
              </button>
            </div>
          </div>
        </div>

        {/* ── CONTENU ─────────────────────────────────────── */}
        <div style={{maxWidth:1080,margin:"0 auto",padding:"14px 14px"}}>

          {/* ═══ PLANNING ═══════════════════════════════════ */}
          {onglet==="planning"&&(
            <>
              {/* Barre chargement */}
              <div style={{background:"white",borderRadius:12,padding:"12px 14px",marginBottom:12,
                border:"1px solid #e2e8f0",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap"}}>
                  <div style={{flex:"0 0 auto"}}>
                    <label style={{fontSize:11,color:"#94a3b8",fontWeight:700,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"}}>Date</label>
                    <input value={dateQ} onChange={e=>setDateQ(e.target.value)}
                      style={{padding:"10px 12px",border:"1.5px solid #e2e8f0",borderRadius:9,fontSize:14,
                        width:120,fontFamily:"inherit",minHeight:44}}/>
                  </div>
                  <button onClick={chargerAgenda} disabled={loading}
                    style={{flex:1,minWidth:160,padding:"12px 16px",
                      background:loading?"#e2e8f0":"#3b82f6",color:loading?"#94a3b8":"white",
                      border:"none",borderRadius:9,fontSize:14,fontWeight:700,minHeight:44,
                      display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <span style={{animation:loading?"spin .8s linear infinite":"none",display:"inline-block"}}>🔄</span>
                    {loading?"Chargement...":"Charger l'agenda Ali"}
                  </button>
                </div>

                {msg&&(
                  <div style={{marginTop:10,padding:"9px 12px",borderRadius:9,fontSize:12,fontWeight:600,
                    background:msg.startsWith("✅")?"#f0fdf4":msg.startsWith("ℹ️")?"#eff6ff":"#fef2f2",
                    color:msg.startsWith("✅")?"#166534":msg.startsWith("ℹ️")?"#1e40af":"#dc2626",
                    border:`1px solid ${msg.startsWith("✅")?"#86efac":msg.startsWith("ℹ️")?"#bfdbfe":"#fca5a5"}`,
                    display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{flex:1}}>{msg}</span>
                    {nbSans>0&&<span style={{background:"#fef2f2",color:"#dc2626",padding:"3px 9px",borderRadius:8,fontSize:11,border:"1px solid #fca5a5",fontWeight:700,whiteSpace:"nowrap"}}>⚠️ {nbSans} sans assignation</span>}
                    {nbVilla>0&&<span style={{background:"#fff7ed",color:"#ea580c",padding:"3px 9px",borderRadius:8,fontSize:11,border:"1px solid #fed7aa",fontWeight:700,whiteSpace:"nowrap"}}>🏠 {nbVilla} villa &lt; 2</span>}
                  </div>
                )}
              </div>

              {chaines.length===0?(
                <div style={{background:"white",borderRadius:12,padding:"40px 20px",textAlign:"center",
                  color:"#94a3b8",border:"1px dashed #e2e8f0",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}>
                  <div style={{fontSize:48,marginBottom:12}}>📅</div>
                  <div style={{fontSize:15,fontWeight:600,color:"#475569",marginBottom:6}}>Aucun planning chargé</div>
                  <div style={{fontSize:13}}>Saisissez une date et appuyez sur "Charger l'agenda Ali"</div>
                </div>
              ):(
                // Layout responsive : 2 colonnes sur desktop, 1 colonne sur mobile
                <div className="layout-2col" style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:14,alignItems:"start"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                      ⚡ {chaines.length} chaînes · même couleur = assigner ensemble
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      {chaines.map((chaine,ci)=>{
                        const estPaire=chaine.inters.length===2;
                        const colorIdx=estPaire?chaines.filter((c,i)=>i<ci&&c.inters.length===2).length%CHAINE_COLORS.length:-1;
                        const couleur=estPaire?CHAINE_COLORS[colorIdx]:null;
                        const chaineBg=couleur?couleur.bg:"white";
                        const chaineBorder=couleur?couleur.border:"#e2e8f0";
                        return(
                          <div key={ci} style={{borderRadius:14,overflow:"hidden",
                            border:`2px solid ${chaineBorder}`,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                            {/* En-tête chaîne */}
                            <div style={{background:chaineBg,padding:"10px 14px",
                              display:"flex",justifyContent:"space-between",alignItems:"center",
                              borderBottom:`1px solid ${chaineBorder}`}}>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{fontSize:12,fontWeight:700,color:couleur?couleur.label:"#64748b"}}>
                                  {estPaire?`🔗 Chaîne ${ci+1}`:`● Solo ${ci+1}`}
                                </span>
                                <span style={{fontSize:11,color:"#94a3b8"}}>
                                  {chaine.dureeTotal}min{chaine.trajetTotal>0?` · 🚗${chaine.trajetTotal}min`:""}
                                </span>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{fontSize:11,color:"#64748b"}}>Départ</span>
                                <select value={chaine.inters[0]?.heureDebut||"12:00"} onChange={e=>changerHeureCh(ci,e.target.value)}
                                  style={{padding:"5px 8px",border:`1.5px solid ${chaineBorder}`,borderRadius:7,
                                    fontSize:12,fontWeight:700,color:"#475569",background:"rgba(255,255,255,0.8)",
                                    minHeight:36}}>
                                  {HEURES_S.map(h=><option key={h}>{h}</option>)}
                                </select>
                                <button onClick={()=>supprimerChaine(ci)}
                                  style={{width:36,height:36,borderRadius:8,background:"rgba(255,255,255,0.8)",
                                    border:"1.5px solid #fca5a5",color:"#dc2626",fontSize:16,
                                    display:"flex",alignItems:"center",justifyContent:"center"}}>🗑</button>
                              </div>
                            </div>
                            {/* Interventions */}
                            {chaine.inters.map((inter,ii)=>(
                              <div key={inter.id}>
                                <Carte interv={inter} extras={extras} equipe={equipe} onChange={(f,v)=>changeInChaine(ci,ii,f,v)} chaineBg={chaineBg} chaineBorder={chaineBorder}/>
                                {ii<chaine.inters.length-1&&(
                                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"6px 14px",
                                    background:chaineBg,borderTop:`1px solid ${chaineBorder}`,borderBottom:`1px solid ${chaineBorder}`}}>
                                    <div style={{flex:1,height:1,background:chaineBorder}}/>
                                    <span style={{fontSize:11,color:"#64748b",fontWeight:600,whiteSpace:"nowrap"}}>
                                      🚗 {trajetMin(inter.lieu||CENTRE,chaine.inters[ii+1].lieu||CENTRE)}min → {chaine.inters[ii+1].nom.replace("Appartement GH ","").replace("Appartement ","")}
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

                    {/* Boutons actions — mobile uniquement, flottants en bas */}
                    <div className="mobile-only" style={{display:"none",gap:10,marginTop:16,flexDirection:"column"}}>
                      <button onClick={()=>setShowCharge(true)}
                        style={{width:"100%",padding:14,background:"white",border:"1px solid #e2e8f0",
                          borderRadius:12,fontSize:14,fontWeight:600,color:"#1e293b",
                          display:"flex",alignItems:"center",justifyContent:"center",gap:8,minHeight:50}}>
                        👥 Voir la charge du jour
                        {conflits.length>0&&<span style={{background:"#fef2f2",color:"#dc2626",padding:"2px 8px",borderRadius:8,fontSize:12,border:"1px solid #fca5a5"}}>⚠️ {conflits.length} conflit{conflits.length>1?"s":""}</span>}
                      </button>
                      <button onClick={genWA}
                        style={{width:"100%",padding:14,background:"#0f172a",color:"white",border:"none",
                          borderRadius:12,fontSize:15,fontWeight:700,minHeight:50,
                          display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                        💬 Générer le planning WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Panneau droit — desktop only */}
                  <div className="panel-right desktop-only" style={{display:"flex",flexDirection:"column",gap:12,position:"sticky",top:62}}>
                    {/* Charge */}
                    <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #e2e8f0"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#0f172a",marginBottom:10}}>👥 Charge du jour</div>
                      {equipe.filter(e=>e.actif!==false).map(e=>{const t=ch[e.nom]||[];return(
                        <div key={e.nom} style={{marginBottom:6}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",borderRadius:8,background:e.bg}}>
                            <span style={{fontWeight:700,fontSize:12,color:e.coul}}>{e.emoji} {e.nom}</span>
                            <span style={{fontSize:11,fontWeight:700,color:t.length>=3?"#ef4444":t.length>=2?"#f97316":t.length>=1?"#10b981":"#94a3b8"}}>{t.length>0?`${t.length}×`:"—"}</span>
                          </div>
                          {t.length>0&&<div style={{paddingLeft:8,marginTop:2}}>{t.map((x,i)=><div key={i} style={{fontSize:10,color:"#94a3b8",display:"flex",alignItems:"center",gap:3}}><span style={{color:e.coul}}>›</span>{toWA(x.heureDebut)} {x.nom.replace("Appartement GH ","").replace("Appartement ","")}</div>)}</div>}
                        </div>
                      );})}
                    </div>

                    {conflits.length>0
                      ?<div style={{background:"#fef2f2",borderRadius:10,padding:10,border:"1px solid #fca5a5"}}>
                        <div style={{fontSize:12,fontWeight:700,color:"#dc2626",marginBottom:4}}>⚠️ Conflits</div>
                        {conflits.map((c,i)=><div key={i} style={{fontSize:11,color:"#dc2626"}}>{c}</div>)}
                      </div>
                      :<div style={{background:"#f0fdf4",borderRadius:9,padding:"8px 10px",border:"1px solid #86efac",fontSize:12,fontWeight:600,color:"#16a34a"}}>✅ Aucun conflit</div>
                    }

                    {/* WhatsApp */}
                    <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #e2e8f0"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#0f172a",marginBottom:10}}>💬 WhatsApp</div>
                      <button onClick={genWA} style={{width:"100%",padding:11,border:"none",borderRadius:9,fontSize:13,fontWeight:700,background:"#0f172a",color:"white",marginBottom:8,minHeight:44}}>⚙️ Générer le planning</button>
                      {waText&&<>
                        <textarea readOnly value={waText} onClick={e=>{e.target.select();e.target.setSelectionRange(0,99999);}}
                          style={{width:"100%",background:"#f8fafc",borderRadius:8,padding:10,fontFamily:"monospace",fontSize:10,lineHeight:1.7,border:"1px solid #e2e8f0",height:140,resize:"none",boxSizing:"border-box",color:"#1e293b",outline:"none",marginBottom:8}}/>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                          <button onClick={copier} style={{padding:"10px",border:"none",borderRadius:9,fontSize:13,fontWeight:700,background:copied?"#059669":"#475569",color:"white",minHeight:44,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                            {copied?"✅":"📋"} {copied?"Copié !":"Copier"}
                          </button>
                          <button onClick={()=>{window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`,"_blank");setWaSent(true);}} style={{padding:"10px",border:"none",borderRadius:9,fontSize:13,fontWeight:700,background:waSent?"#128C7E":"#25D366",color:"white",minHeight:44,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                            {waSent?"✅":"📤"} {waSent?"Ouvert !":"WhatsApp"}
                          </button>
                        </div>
                      </>}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══ LOGEMENTS ════════════════════════════════ */}
          {onglet==="lieux"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>🏠 {lieux.length} logements</div>
                <button onClick={()=>setWizard(true)}
                  style={{padding:"10px 16px",background:"#0f172a",color:"white",border:"none",
                    borderRadius:10,fontSize:13,fontWeight:700,minHeight:44}}>
                  + Ajouter
                </button>
              </div>
              {msg&&<div style={{marginBottom:10,padding:"9px 12px",borderRadius:9,fontSize:12,fontWeight:600,background:"#f0fdf4",color:"#166534",border:"1px solid #86efac"}}>{msg}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {lieux.map(l=>{
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
                                    background:"#f8fafc",color:"#475569",fontSize:13,minHeight:40}}>✏️</button>
                                <button onClick={()=>supprimerLieu(l.id)}
                                  style={{padding:"8px 12px",borderRadius:8,border:"1px solid #fca5a5",
                                    background:"#fef2f2",color:"#dc2626",fontSize:13,minHeight:40}}>🗑</button></>
                              :<><button onClick={()=>modifierLieu(l.id,editLieu)}
                                  style={{padding:"8px 12px",borderRadius:8,border:"none",background:"#059669",
                                    color:"white",fontSize:13,fontWeight:700,minHeight:40}}>✓</button>
                                <button onClick={()=>setEditLieu(null)}
                                  style={{padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0",
                                    background:"#f8fafc",color:"#64748b",fontSize:13,minHeight:40}}>✕</button></>
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
                                  style={{width:60,padding:"6px 8px",border:"2px solid #3b82f6",borderRadius:7,fontSize:13,fontWeight:700,color:"#3b82f6",outline:"none",textAlign:"center",minHeight:40}}/>
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
                                style={{padding:"6px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:13,width:100,outline:"none",minHeight:40}}/>
                              :<span style={{fontSize:13,color:"#475569",fontWeight:600}}>🔑 {l.code}</span>
                            }
                          </div>}
                          {(isEdit||l.notes)&&<div style={{flex:1,minWidth:120}}>
                            <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Notes</div>
                            {isEdit
                              ?<input value={editLieu.notes||""} onChange={e=>setEditLieu(p=>({...p,notes:e.target.value}))}
                                style={{width:"100%",padding:"6px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:13,outline:"none",boxSizing:"border-box",minHeight:40}}/>
                              :<span style={{fontSize:12,color:"#64748b"}}>{l.notes}</span>
                            }
                          </div>}
                        </div>
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
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:4}}>👤 Extras mémorisés</div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>Restent en mémoire jusqu'à suppression manuelle. Disponibles dans tous les plannings.</div>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                <input value={newExtra} onChange={e=>setNewExtra(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ajouterExtra()}
                  placeholder="Prénom de l'extra"
                  style={{flex:1,padding:"12px 14px",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:14,outline:"none",minHeight:48}}/>
                <button onClick={ajouterExtra}
                  style={{padding:"12px 18px",background:"#0f172a",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,minHeight:48}}>
                  + Ajouter
                </button>
              </div>
              {extras.length===0
                ?<div style={{background:"white",borderRadius:12,padding:"28px",textAlign:"center",color:"#94a3b8",border:"1px dashed #e2e8f0"}}>
                  Tapez un prénom et appuyez sur Entrée ou + Ajouter
                </div>
                :<div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {extras.map(ex=>(
                    <div key={ex.id} style={{background:"white",borderRadius:10,padding:"12px 14px",border:"1px solid #e2e8f0",
                      display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontWeight:600,fontSize:14,color:"#0f172a"}}>👤 {ex.nom}</div>
                        <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>Enregistré le {new Date(ex.createdAt).toLocaleDateString("fr-FR")}</div>
                      </div>
                      <button onClick={()=>supprimerExtra(ex.id)}
                        style={{padding:"8px 14px",borderRadius:8,border:"1px solid #fca5a5",background:"#fef2f2",
                          color:"#dc2626",fontSize:13,fontWeight:600,minHeight:40}}>
                        🗑 Retirer
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
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:4}}>👥 Équipe fixe</div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>
                Les employées listées ici apparaissent dans les assignations de chaque intervention.
                {user.role!=="admin"&&<span style={{color:"#94a3b8"}}> Seul l'admin peut ajouter ou supprimer.</span>}
              </div>

              {/* Ajouter employée — admin seulement */}
              {user.role==="admin"&&(
                <div style={{background:"white",borderRadius:12,padding:"14px 16px",border:"1px solid #e2e8f0",marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:12}}>+ Ajouter une employée</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                    {/* Sélecteur emoji */}
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>Emoji</label>
                      <select value={newEmp.emoji} onChange={e=>setNewEmp(p=>({...p,emoji:e.target.value}))}
                        style={{padding:"10px 12px",border:"1.5px solid #e2e8f0",borderRadius:9,fontSize:18,minHeight:48,minWidth:70}}>
                        {["👩","👩‍🦱","👩‍🦳","👩‍🦰","👨","👨‍🦱","👨‍🦳","👨‍🦰","🧑","👤"].map(em=><option key={em} value={em}>{em}</option>)}
                      </select>
                    </div>
                    <div style={{flex:1,minWidth:140}}>
                      <label style={{fontSize:11,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>Prénom</label>
                      <input value={newEmp.nom} onChange={e=>setNewEmp(p=>({...p,nom:e.target.value}))}
                        onKeyDown={e=>e.key==="Enter"&&ajouterEmp()}
                        placeholder="ex: Rachida"
                        style={{width:"100%",padding:"12px 14px",border:"1.5px solid #e2e8f0",borderRadius:9,fontSize:14,outline:"none",boxSizing:"border-box",minHeight:48}}/>
                    </div>
                    <div style={{paddingTop:22}}>
                      <button onClick={ajouterEmp}
                        style={{padding:"12px 18px",background:"#0f172a",color:"white",border:"none",
                          borderRadius:9,fontSize:14,fontWeight:700,minHeight:48,whiteSpace:"nowrap"}}>
                        + Ajouter
                      </button>
                    </div>
                  </div>
                  {empMsg&&<div style={{padding:"8px 12px",borderRadius:8,fontSize:12,fontWeight:600,
                    background:empMsg.startsWith("✅")?"#f0fdf4":"#fef2f2",
                    color:empMsg.startsWith("✅")?"#166534":"#dc2626",
                    border:`1px solid ${empMsg.startsWith("✅")?"#86efac":"#fca5a5"}`}}>{empMsg}</div>}
                </div>
              )}

              {/* Liste des employées */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {equipe.map(emp=>(
                  <div key={emp.id} style={{background:"white",borderRadius:12,padding:"12px 14px",
                    border:"1px solid #e2e8f0",
                    borderLeft:`4px solid ${emp.actif!==false?emp.coul:"#e2e8f0"}`,
                    opacity:emp.actif===false?.55:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:42,height:42,borderRadius:"50%",background:emp.bg,
                          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                          {emp.emoji}
                        </div>
                        <div>
                          <div style={{fontWeight:700,fontSize:15,color:emp.actif!==false?emp.coul:"#94a3b8"}}>{emp.nom}</div>
                          <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>
                            {emp.actif===false?"⛔ Inactive":"✅ Active · disponible dans les plannings"}
                          </div>
                        </div>
                      </div>

                      {user.role==="admin"&&(
                        <div style={{display:"flex",gap:6,flexShrink:0}}>
                          {/* Toggle actif/inactif */}
                          <button onClick={()=>toggleEmpActif(emp.id,emp.actif===false)}
                            style={{padding:"8px 12px",borderRadius:8,fontSize:12,fontWeight:600,minHeight:40,
                              border:`1px solid ${emp.actif!==false?"#e2e8f0":"#86efac"}`,
                              background:emp.actif!==false?"#f8fafc":"#f0fdf4",
                              color:emp.actif!==false?"#64748b":"#16a34a"}}>
                            {emp.actif!==false?"⛔ Désactiver":"✅ Activer"}
                          </button>
                          {/* Supprimer */}
                          <button onClick={()=>supprimerEmp(emp.id)}
                            style={{padding:"8px 12px",borderRadius:8,border:"1px solid #fca5a5",
                              background:"#fef2f2",color:"#dc2626",fontSize:13,minHeight:40}}>🗑</button>
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
                  <button onClick={creerUser}
                    style={{padding:"14px",background:"#0f172a",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,minHeight:50}}>
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
                    {u.id!==user.id&&<button onClick={()=>supprimerUser(u.id)}
                      style={{padding:"8px 12px",borderRadius:8,border:"1px solid #fca5a5",background:"#fef2f2",color:"#dc2626",fontSize:13,minHeight:40}}>🗑</button>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── NAVIGATION BAS — mobile uniquement ─────────── */}
        <nav className="nav-bottom" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,
          background:"white",borderTop:"1px solid #e2e8f0",
          display:"flex",alignItems:"stretch",
          paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
          {TABS.map(([k,ic,l])=>(
            <button key={k} onClick={()=>setOnglet(k)}
              style={{flex:1,padding:"10px 4px 8px",background:"none",border:"none",
                display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                color:onglet===k?"#3b82f6":"#94a3b8",cursor:"pointer",minHeight:56}}>
              <span style={{fontSize:20}}>{ic}</span>
              <span style={{fontSize:10,fontWeight:onglet===k?700:500}}>{l}</span>
            </button>
          ))}
          <button onClick={logout}
            style={{flex:1,padding:"10px 4px 8px",background:"none",border:"none",
              display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              color:"#94a3b8",cursor:"pointer",minHeight:56}}>
            <span style={{fontSize:20}}>🚪</span>
            <span style={{fontSize:10}}>Sortir</span>
          </button>
        </nav>

        {/* ── BOTTOM SHEETS MOBILE ────────────────────────── */}

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

      </div>
    </>
  );
}
