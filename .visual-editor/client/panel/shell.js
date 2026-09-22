import { TABS } from './schemas.js';
import { PropertySchemaRenderer } from './PropertySchemaRenderer.js';
import { runSaveFlow } from './save-flow.js';
import { showModal } from './modal.js';

export class PanelShell {
  constructor(shadowRoot, { changeset, inspector, bootInfo }) {
    this.shadowRoot = shadowRoot;
    this.changeset = changeset;
    this.inspector = inspector;
    this.bootInfo = bootInfo;
    this.activeTabId = 'content';
    this.selectedEl = null;
    this.selectedVeId = null;

    this._buildToggleButton();
    this._buildPanel();
    this.renderer = new PropertySchemaRenderer(this.contentEl, shadowRoot, changeset, bootInfo);

    this.changeset.subscribe(() => this._updateFooter());
    this._updateFooter();

    document.addEventListener('keydown', (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); this.changeset.undo(); this._refreshSelectedPanelValues(); }
      if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') { e.preventDefault(); this.changeset.redo(); this._refreshSelectedPanelValues(); }
    });
  }

  onSelect(veId, el) {
    this.selectedVeId = veId;
    this.selectedEl = el;
    this.open();
    this._renderSelection();
  }

  onDeselect() {
    this.selectedEl = null;
    this.selectedVeId = null;
    this.selectionInfoEl.textContent = 'No element selected — click something on the page.';
    this.toolbarEl.hidden = true;
    this.tabsEl.hidden = true;
    this.contentEl.innerHTML = '';
  }

  open() {
    this.panel.hidden = false;
    this.toggleBtn.setAttribute('aria-pressed', 'true');
  }

  close() {
    this.panel.hidden = true;
    this.toggleBtn.setAttribute('aria-pressed', 'false');
    this.inspector.clearSelection();
    this.onDeselect();
  }

  _buildToggleButton() {
    const btn = document.createElement('button');
    btn.className = 've-toggle-btn';
    btn.type = 'button';
    btn.title = 'Visual Editor';
    btn.textContent = '✏️';
    btn.addEventListener('click', () => { this.panel.hidden ? this.open() : this.close(); });
    this.shadowRoot.appendChild(btn);
    this.toggleBtn = btn;
  }

  _buildPanel() {
    const panel = document.createElement('div');
    panel.className = 've-panel';
    panel.hidden = true;
    panel.innerHTML = `
      <div class="ve-panel-header">
        <span class="ve-drag-handle" title="Drag to move">⠿</span>
        <span class="ve-panel-title">Visual Editor</span>
        <span class="ve-header-spacer"></span>
        <button class="ve-icon-btn" data-action="mode" title="Toggle Select / Preview mode">🖱️</button>
        <button class="ve-icon-btn" data-action="dock" title="Dock left/right">⇄</button>
        <button class="ve-icon-btn" data-action="collapse" title="Collapse">–</button>
        <button class="ve-icon-btn" data-action="close" title="Close">✕</button>
      </div>
      <div class="ve-panel-body">
        <div class="ve-selection-info">No element selected — click something on the page.</div>
        <div class="ve-toolbar" hidden></div>
        <div class="ve-tabs" hidden></div>
        <div class="ve-tab-content"></div>
        <div class="ve-footer">
          <button class="ve-icon-btn" data-action="undo" title="Undo (Ctrl+Z)">↶</button>
          <button class="ve-icon-btn" data-action="redo" title="Redo (Ctrl+Shift+Z)">↷</button>
          <span class="ve-pending-count">0 unsaved changes</span>
          <button class="ve-btn ve-btn-primary ve-save-btn">Save</button>
        </div>
      </div>`;
    this.shadowRoot.appendChild(panel);
    this.panel = panel;
    this.selectionInfoEl = panel.querySelector('.ve-selection-info');
    this.toolbarEl = panel.querySelector('.ve-toolbar');
    this.tabsEl = panel.querySelector('.ve-tabs');
    this.contentEl = panel.querySelector('.ve-tab-content');
    this.pendingCountEl = panel.querySelector('.ve-pending-count');
    this.undoBtn = panel.querySelector('[data-action="undo"]');
    this.redoBtn = panel.querySelector('[data-action="redo"]');

    panel.querySelector('[data-action="close"]').addEventListener('click', () => this.close());
    panel.querySelector('[data-action="collapse"]').addEventListener('click', () => panel.classList.toggle('ve-collapsed'));
    panel.querySelector('[data-action="dock"]').addEventListener('click', () => this._toggleDock());
    panel.querySelector('[data-action="mode"]').addEventListener('click', (e) => this._toggleMode(e.currentTarget));
    panel.querySelector('[data-action="undo"]').addEventListener('click', () => { this.changeset.undo(); this._refreshSelectedPanelValues(); });
    panel.querySelector('[data-action="redo"]').addEventListener('click', () => { this.changeset.redo(); this._refreshSelectedPanelValues(); });
    panel.querySelector('.ve-save-btn').addEventListener('click', () => runSaveFlow(this.shadowRoot, this.changeset, this.bootInfo));

    this._makeDraggable(panel, panel.querySelector('.ve-drag-handle'));
    this._dockSide = 'right';
    this._applyDockPosition();
  }

  _toggleMode(btn) {
    const nowSelect = !this.inspector.selectMode;
    this.inspector.setSelectMode(nowSelect);
    btn.classList.toggle('ve-active', nowSelect);
    btn.title = nowSelect ? 'Select mode active — click to switch to Preview/Interact' : 'Preview/Interact mode — click to select elements again';
  }

  _toggleDock() {
    this._dockSide = this._dockSide === 'right' ? 'left' : 'right';
    this.panel.style.left = '';
    this.panel.style.right = '';
    this._applyDockPosition();
  }

  _applyDockPosition() {
    if (this._dockSide === 'right') {
      this.panel.style.right = '16px';
      this.panel.style.left = 'auto';
    } else {
      this.panel.style.left = '16px';
      this.panel.style.right = 'auto';
    }
    this.panel.style.top = this.panel.style.top || '16px';
  }

  _makeDraggable(panel, handle) {
    let dragging = false, startX = 0, startY = 0, startTop = 0, startLeft = 0;
    handle.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      startTop = rect.top; startLeft = rect.left;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      panel.style.left = Math.max(0, startLeft + dx) + 'px';
      panel.style.top = Math.max(0, startTop + dy) + 'px';
      panel.style.right = 'auto';
    });
    handle.addEventListener('pointerup', (e) => { dragging = false; handle.releasePointerCapture(e.pointerId); });
  }

  _renderSelection() {
    const el = this.selectedEl;
    const cls = el.classList.length ? '.' + Array.from(el.classList).filter((c) => !c.startsWith('ve-')).join('.') : '';
    this.selectionInfoEl.innerHTML = `<strong>&lt;${el.tagName.toLowerCase()}${cls}&gt;</strong><br><span class="ve-source-loc">resolving source…</span>`;
    this._fetchLocation(this.selectedVeId);

    this._renderToolbar(el);

    const applicable = TABS.filter((t) => t.appliesTo(el));
    this.tabsEl.hidden = false;
    this.tabsEl.innerHTML = '';
    for (const tab of applicable) {
      const b = document.createElement('button');
      b.className = 've-tab-btn' + (tab.id === this.activeTabId ? ' ve-active' : '');
      b.textContent = tab.label;
      b.addEventListener('click', () => { this.activeTabId = tab.id; this._renderSelection(); });
      this.tabsEl.appendChild(b);
    }
    const activeTab = applicable.find((t) => t.id === this.activeTabId) || applicable[0];
    if (activeTab) this.renderer.render(activeTab, el);
  }

  _refreshSelectedPanelValues() {
    if (this.selectedEl) this._renderSelection();
  }

  async _fetchLocation(veId) {
    try {
      const res = await fetch(`/__ve/locate?page=${encodeURIComponent(this.bootInfo.page)}&targetId=${encodeURIComponent(veId)}`);
      const body = await res.json();
      const el = this.selectionInfoEl.querySelector('.ve-source-loc');
      if (el) el.textContent = res.ok ? `${body.file}:${body.line}` : 'source not resolvable — refusing to guess';
    } catch (e) {
      const el = this.selectionInfoEl.querySelector('.ve-source-loc');
      if (el) el.textContent = 'source lookup failed';
    }
  }

  _renderToolbar(el) {
    this.toolbarEl.hidden = false;
    this.toolbarEl.innerHTML = '';
    const veId = this.selectedVeId;
    const file = this.bootInfo.page;

    const mkBtn = (label, title, onClick, disabled) => {
      const b = document.createElement('button');
      b.className = 've-btn';
      b.textContent = label;
      b.title = title;
      if (disabled) { b.disabled = true; b.title += ' (coming in a future update)'; }
      else b.addEventListener('click', onClick);
      return b;
    };

    this.toolbarEl.appendChild(mkBtn('⠿ Move', 'Drag & drop reordering', null, true));
    this.toolbarEl.appendChild(mkBtn('✎ Edit', 'Edit text', () => { this.activeTabId = 'content'; this._renderSelection(); }));
    this.toolbarEl.appendChild(mkBtn('⧉ Duplicate', 'Duplicate this element', () => {
      const makeClone = () => {
        const c = el.cloneNode(true);
        c.removeAttribute('data-ve-id'); // not source-mapped until after Save + reload
        c.classList.add('ve-pending-duplicate');
        return c;
      };
      el.after(makeClone());
      this.changeset.push({
        label: 'Duplicate element',
        ops: [{ type: 'duplicate', targetId: veId, file }],
        preview: () => el.after(makeClone()),
        revert: () => { const dup = el.nextElementSibling; if (dup && dup.classList.contains('ve-pending-duplicate')) dup.remove(); },
      });
    }));
    this.toolbarEl.appendChild(mkBtn('🗑 Delete', 'Delete this element (pending until Save)', async () => {
      const choice = await showModal(this.shadowRoot, {
        title: 'Delete element?',
        message: `<${el.tagName.toLowerCase()}> will be marked for deletion. It stays removable/undoable until you Save.`,
        buttons: [{ label: 'Cancel', value: null }, { label: 'Delete', value: 'delete', primary: true }],
      });
      if (choice !== 'delete') return;
      el.classList.add('ve-pending-delete');
      this.changeset.push({
        label: 'Delete element',
        ops: [{ type: 'delete', targetId: veId, file }],
        preview: () => el.classList.add('ve-pending-delete'),
        revert: () => el.classList.remove('ve-pending-delete'),
      });
      this.onDeselect();
      this.inspector.clearSelection();
    }));
  }

  _updateFooter() {
    const n = this.changeset.pendingCount;
    this.pendingCountEl.textContent = `${n} unsaved change${n === 1 ? '' : 's'}`;
    this.undoBtn.disabled = !this.changeset.canUndo();
    this.redoBtn.disabled = !this.changeset.canRedo();
  }
}
