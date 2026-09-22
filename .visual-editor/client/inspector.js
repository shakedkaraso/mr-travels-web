// Hover/select overlay. Uses one delegated listener per event type on the
// real document (not the shadow root) and rAF-batches pointermove work so
// hovering a page with many DOM nodes stays cheap.

export class Inspector {
  /**
   * @param {ShadowRoot} shadowRoot where overlay elements are appended
   * @param {{onSelect:(veId:string, el:Element)=>void, onDeselect:()=>void}} handlers
   */
  constructor(shadowRoot, handlers) {
    this.shadowRoot = shadowRoot;
    this.handlers = handlers;
    this.selectMode = true; // false = "Preview / Interact" mode
    this._hoveredEl = null;
    this._selectedEl = null;
    this._rafPending = false;
    this._pendingClientX = 0;
    this._pendingClientY = 0;

    this.hoverBox = this._makeBox('ve-hover-box');
    this.selectBox = this._makeBox('ve-select-box');
    this.hoverLabel = this._makeLabel('ve-hover-label');
    this.selectLabel = this._makeLabel('ve-select-label');

    this._onPointerMove = this._onPointerMove.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onScrollOrResize = this._onScrollOrResize.bind(this);

    document.addEventListener('pointermove', this._onPointerMove, true);
    document.addEventListener('click', this._onClick, true);
    window.addEventListener('scroll', this._onScrollOrResize, true);
    window.addEventListener('resize', this._onScrollOrResize);
  }

  setSelectMode(on) {
    this.selectMode = on;
    this.hoverBox.hidden = !on;
    if (!on) this._setHover(null);
  }

  destroy() {
    document.removeEventListener('pointermove', this._onPointerMove, true);
    document.removeEventListener('click', this._onClick, true);
    window.removeEventListener('scroll', this._onScrollOrResize, true);
    window.removeEventListener('resize', this._onScrollOrResize);
  }

  selectById(veId) {
    const el = document.querySelector(`[data-ve-id="${cssEscape(veId)}"]`);
    if (el) this._select(el);
  }

  clearSelection() {
    this._selectedEl = null;
    this.selectBox.hidden = true;
    this.selectLabel.hidden = true;
  }

  _makeBox(cls) {
    const el = document.createElement('div');
    el.className = cls;
    el.hidden = true;
    this.shadowRoot.appendChild(el);
    return el;
  }

  _makeLabel(cls) {
    const el = document.createElement('div');
    el.className = cls;
    el.hidden = true;
    this.shadowRoot.appendChild(el);
    return el;
  }

  _isEditable(el) {
    return el && el.nodeType === 1 && el.hasAttribute('data-ve-id') && !this._isEditorOwnElement(el);
  }

  _isEditorOwnElement(el) {
    return !!el.closest && !!el.closest('#visual-editor-host');
  }

  _onPointerMove(e) {
    if (!this.selectMode) return;
    this._pendingClientX = e.clientX;
    this._pendingClientY = e.clientY;
    if (this._rafPending) return;
    this._rafPending = true;
    requestAnimationFrame(() => {
      this._rafPending = false;
      const el = document.elementFromPoint(this._pendingClientX, this._pendingClientY);
      const target = el && el.closest && el.closest('[data-ve-id]');
      this._setHover(this._isEditable(target) ? target : null);
    });
  }

  _onClick(e) {
    if (!this.selectMode) return;
    const target = e.target.closest && e.target.closest('[data-ve-id]');
    if (!this._isEditable(target)) return;
    // Block navigation/submit/etc. while the user is only trying to select.
    e.preventDefault();
    e.stopPropagation();
    this._select(target);
  }

  _onScrollOrResize() {
    if (this._hoveredEl) this._positionBox(this.hoverBox, this._hoveredEl);
    if (this._selectedEl) this._positionBox(this.selectBox, this._selectedEl);
    this._positionLabel();
  }

  _setHover(el) {
    if (el === this._hoveredEl) return;
    this._hoveredEl = el;
    if (!el || el === this._selectedEl) {
      this.hoverBox.hidden = true;
      this.hoverLabel.hidden = true;
      return;
    }
    this.hoverBox.hidden = false;
    this._positionBox(this.hoverBox, el);
    this._showLabel(this.hoverLabel, el);
  }

  _select(el) {
    this._selectedEl = el;
    this.selectBox.hidden = false;
    this._positionBox(this.selectBox, el);
    this._showLabel(this.selectLabel, el);
    this._setHover(null);
    this.handlers.onSelect(el.getAttribute('data-ve-id'), el);
  }

  _positionBox(box, el) {
    const r = el.getBoundingClientRect();
    box.style.transform = `translate(${r.left}px, ${r.top}px)`;
    box.style.width = r.width + 'px';
    box.style.height = r.height + 'px';
  }

  _showLabel(label, el) {
    const r = el.getBoundingClientRect();
    const cls = el.classList.length ? '.' + Array.from(el.classList).join('.') : '';
    label.textContent = el.tagName.toLowerCase() + cls;
    label.hidden = false;
    const top = r.top > 20 ? r.top - 20 : r.bottom;
    label.style.transform = `translate(${r.left}px, ${top}px)`;
  }

  _positionLabel() {
    if (this._hoveredEl) this._showLabel(this.hoverLabel, this._hoveredEl);
    if (this._selectedEl) this._showLabel(this.selectLabel, this._selectedEl);
  }
}

function cssEscape(str) {
  return window.CSS && CSS.escape ? CSS.escape(str) : str.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}
