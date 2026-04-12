export function createGlobalCss(DS) {
  return `
  @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap");

  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { margin: 0; font-family: 'Bricolage Grotesque', 'Segoe UI', system-ui, -apple-system, sans-serif; background: ${DS.paper}; color: ${DS.ink}; }
  input, select, button, textarea { font-family: inherit; }
  button { cursor: pointer; }

  /* Scrollbar elegante */
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

  /* Boutons interactifs */
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

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: ${DS.brand} !important;
    background: #fffbf7 !important;
  }

  .nav-bottom { display: none; }
  @media (max-width: 640px) {
    .nav-top-tabs { display: none !important; }
    .nav-bottom { display: flex !important; }
    .layout-2col { grid-template-columns: 1fr !important; }
    .panel-right { position: static !important; }
    .desktop-only { display: none !important; }
    .mobile-only { display: flex !important; }
    .planning-controls { align-items: stretch !important; }
    .planning-date-field,
    .planning-load-button,
    .planning-auto-associate {
      flex: 1 1 100% !important;
      max-width: 100% !important;
      width: 100% !important;
    }
    .planning-chain-card { width: 100%; }
    .planning-chain-header {
      padding: 10px 12px !important;
      align-items: stretch !important;
    }
    .planning-chain-header-main,
    .planning-chain-header-actions {
      width: 100%;
      min-width: 0;
    }
    .planning-chain-header-main {
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .planning-chain-header-actions > button {
      flex: 1 1 92px;
      min-width: 0 !important;
    }
    .planning-chain-route {
      flex-wrap: wrap;
      justify-content: center;
    }
    .planning-chain-route-label {
      max-width: 100% !important;
      white-space: normal !important;
      text-align: center;
      justify-content: center;
    }
    .planning-intervention-card { padding: 12px !important; }
    .planning-intervention-header {
      flex-direction: column;
      align-items: stretch !important;
      gap: 8px !important;
    }
    .planning-intervention-time,
    .planning-intervention-time-edit {
      width: 100%;
      max-width: 100%;
      justify-content: center;
    }
    .planning-intervention-time-edit {
      flex-wrap: wrap;
      overflow-x: visible !important;
    }
    .planning-intervention-main { width: 100%; }
    .planning-intervention-title {
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: initial !important;
      word-break: break-word;
    }
    .planning-intervention-meta,
    .planning-intervention-flags,
    .planning-intervention-assignees {
      gap: 6px !important;
    }
    .planning-intervention-assignee {
      width: 100%;
      justify-content: flex-start;
      align-items: center;
    }
    .planning-intervention-plus {
      width: 100%;
    }
    .planning-intervention-add {
      width: 100%;
      justify-content: center;
    }
  }
  @media (min-width: 641px) {
    .mobile-only { display: none !important; }
  }

  .tap-target { min-height: 44px; min-width: 44px; }

  .scroll-x { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .scroll-x::-webkit-scrollbar { display: none; }

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

  .card {
    background: white;
    border-radius: ${DS.radiusLg};
    border: 1px solid ${DS.line};
    box-shadow: 0 1px 3px rgba(15,17,23,.06), 0 1px 2px rgba(15,17,23,.04);
  }

  .chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 100px;
    font-size: 12px; font-weight: 600;
    border: 1px solid transparent;
  }

  .badge-wait { background: ${DS.amberSoft}; color: ${DS.amber}; }
  .badge-active { background: ${DS.cobaltSoft}; color: ${DS.cobalt}; }
  .badge-done { background: ${DS.sageSoft}; color: ${DS.sage}; }
  .badge-urgent { background: ${DS.brandSoft}; color: ${DS.brand}; }
  .badge-litige { background: ${DS.rubySoft}; color: ${DS.ruby}; }

  .divider { height: 1px; background: ${DS.line}; margin: 12px 0; }

  .section-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: ${DS.ink3};
  }
`;
}
