import { Inspector } from './inspector.js';
import { ChangeSet } from './changeset.js';
import { PanelShell } from './panel/shell.js';

(async function boot() {
  const bootInfo = window.__VE_BOOT;
  if (!bootInfo) return; // should never happen — this script only loads when the dev bridge injected it

  // Two tiny marker rules for pending delete/duplicate state need to affect
  // REAL page elements, which Shadow DOM styles cannot reach — injected
  // directly into the live document, never written to any file on disk.
  const markerStyle = document.createElement('style');
  markerStyle.id = 've-live-markers';
  markerStyle.textContent = `
    .ve-pending-delete { outline: 2px dashed #e2432c !important; opacity: 0.45 !important; }
    .ve-pending-duplicate { outline: 2px dashed #2ea88f !important; }
  `;
  document.head.appendChild(markerStyle);

  const host = document.createElement('div');
  host.id = 'visual-editor-host';
  document.body.appendChild(host);
  const shadowRoot = host.attachShadow({ mode: 'open' });

  try {
    const cssRes = await fetch('/__ve/client/styles/panel.css');
    const css = await cssRes.text();
    const styleTag = document.createElement('style');
    styleTag.textContent = css;
    shadowRoot.appendChild(styleTag);
  } catch (e) {
    console.error('[visual-editor] failed to load panel styles', e);
  }

  const changeset = new ChangeSet();

  window.addEventListener('beforeunload', (e) => {
    if (changeset.pendingCount > 0) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  const inspector = new Inspector(shadowRoot, {
    onSelect: (veId, el) => panel.onSelect(veId, el),
    onDeselect: () => panel.onDeselect(),
  });

  const panel = new PanelShell(shadowRoot, { changeset, inspector, bootInfo });

  console.log('[visual-editor] ready — dev only. Click the ✏️ button to open the panel.');
})();
