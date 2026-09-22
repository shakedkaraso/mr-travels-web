import { getMatchingSelectors, countMatches } from '../css-match.js';
import { showModal } from './modal.js';

let scopedClassCounter = 0;

function generateScopedClassName(el) {
  const base = (el.className && String(el.className).trim().split(/\s+/)[0]) || el.tagName.toLowerCase();
  const slug = base.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 24) || 'el';
  let name;
  do {
    name = `${slug}-ve-${Math.random().toString(16).slice(2, 6)}${scopedClassCounter++ ? scopedClassCounter : ''}`;
  } while (document.getElementsByClassName(name).length > 0);
  return name;
}

function parseNumberUnit(raw) {
  const m = /^(-?[\d.]+)\s*([a-z%]*)$/i.exec(String(raw).trim());
  return m ? { num: m[1], unit: m[2] } : { num: '', unit: '' };
}

export class PropertySchemaRenderer {
  /**
   * @param {HTMLElement} container
   * @param {ShadowRoot} shadowRoot for modals
   * @param {import('../changeset.js').ChangeSet} changeset
   * @param {{page:string}} pageInfo
   */
  constructor(container, shadowRoot, changeset, pageInfo) {
    this.container = container;
    this.shadowRoot = shadowRoot;
    this.changeset = changeset;
    this.pageInfo = pageInfo;
  }

  render(tab, el) {
    this.container.innerHTML = '';
    const fields = tab.fields(el);
    if (fields.length === 0) {
      this.container.innerHTML = '<p class="ve-empty">No properties for this element in this tab.</p>';
      return;
    }
    for (const field of fields) {
      this.container.appendChild(this._renderField(field, el));
    }
  }

  _renderField(field, el) {
    const row = document.createElement('label');
    row.className = 've-field';
    const labelEl = document.createElement('span');
    labelEl.className = 've-field-label';
    labelEl.textContent = field.label;
    row.appendChild(labelEl);

    const current = this._readCurrentValue(field, el);
    let input;

    if (field.type === 'text' || field.type === 'textarea') {
      input = document.createElement(field.type === 'textarea' ? 'textarea' : 'input');
      if (field.type !== 'textarea') input.type = 'text';
      input.value = current;
      input.addEventListener('change', () => this._commit(field, el, input.value, current));
    } else if (field.type === 'select') {
      input = document.createElement('select');
      for (const opt of field.options) {
        const o = document.createElement('option');
        o.value = opt; o.textContent = opt;
        if (opt === current) o.selected = true;
        input.appendChild(o);
      }
      input.addEventListener('change', () => this._commit(field, el, input.value, current));
    } else if (field.type === 'color') {
      input = document.createElement('input');
      input.type = 'color';
      input.value = toHexColor(current);
      input.addEventListener('input', () => { el.style.setProperty(field.cssProp, input.value); });
      input.addEventListener('change', () => this._commit(field, el, input.value, current));
    } else if (field.type === 'number-unit') {
      const wrap = document.createElement('div');
      wrap.className = 've-field-numunit';
      const { num, unit } = parseNumberUnit(current);
      const numInput = document.createElement('input');
      numInput.type = 'number';
      if (field.step) numInput.step = field.step;
      if (field.min !== undefined) numInput.min = field.min;
      if (field.max !== undefined) numInput.max = field.max;
      numInput.value = num;
      const unitSelect = document.createElement('select');
      for (const u of field.units) {
        const o = document.createElement('option');
        o.value = u; o.textContent = u || '(none)';
        if (u === unit || (!unit && u === field.units[0])) o.selected = true;
        unitSelect.appendChild(o);
      }
      const preview = () => {
        const val = numInput.value === '' ? '' : numInput.value + unitSelect.value;
        el.style.setProperty(field.cssProp, val);
      };
      const commit = () => {
        const val = numInput.value === '' ? '' : numInput.value + unitSelect.value;
        this._commit(field, el, val, current);
      };
      numInput.addEventListener('input', preview);
      numInput.addEventListener('change', commit);
      unitSelect.addEventListener('change', commit);
      wrap.appendChild(numInput);
      wrap.appendChild(unitSelect);
      input = wrap;
    }

    row.appendChild(input);
    return row;
  }

  _readCurrentValue(field, el) {
    if (field.kind === 'attr') return el.getAttribute(field.attrName) || '';
    if (field.kind === 'text') return el.textContent || '';
    if (field.kind === 'style') return window.getComputedStyle(el).getPropertyValue(field.cssProp).trim();
    return '';
  }

  async _commit(field, el, newValue, beforeValue) {
    if (newValue === beforeValue) return;
    const veId = el.getAttribute('data-ve-id');
    const file = this.pageInfo.page;

    if (field.kind === 'attr') {
      el.setAttribute(field.attrName, newValue);
      this.changeset.push({
        label: `${field.label} changed`,
        ops: [{ type: 'attr', targetId: veId, file, attrName: field.attrName, newValue }],
        preview: () => el.setAttribute(field.attrName, newValue),
        revert: () => el.setAttribute(field.attrName, beforeValue),
      });
      return;
    }

    if (field.kind === 'text') {
      el.textContent = newValue;
      this.changeset.push({
        label: 'Text changed',
        ops: [{ type: 'text', targetId: veId, file, newText: newValue }],
        preview: () => { el.textContent = newValue; },
        revert: () => { el.textContent = beforeValue; },
      });
      return;
    }

    // style
    el.style.setProperty(field.cssProp, newValue);
    const matched = getMatchingSelectors(el);
    const maxMatches = matched.reduce((m, sel) => Math.max(m, countMatches(sel)), 0);

    let scope = 'global';
    let selector = null;

    if (matched.length === 0) {
      scope = 'new-rule';
    } else if (maxMatches > 1) {
      const choice = await showModal(this.shadowRoot, {
        title: 'Shared style',
        message: `This element's current style comes from a class used by ${maxMatches} elements on this page. Apply the change everywhere, or only to this element?`,
        buttons: [
          { label: 'Cancel', value: null },
          { label: 'Only this element', value: 'instance' },
          { label: `Apply to all ${maxMatches}`, value: 'global', primary: true },
        ],
      });
      if (!choice) {
        el.style.setProperty(field.cssProp, beforeValue); // revert live preview
        return;
      }
      scope = choice === 'global' ? 'global' : 'new-rule';
    }

    const ops = [];
    if (scope === 'new-rule') {
      const className = generateScopedClassName(el);
      selector = '.' + className;
      ops.push({ type: 'attr', targetId: veId, file, attrName: 'class', newValue: className, mode: 'append-class' });
      ops.push({ type: 'style', targetId: veId, prop: field.cssProp, value: newValue, scope: 'new-rule', selector });
      el.classList.add(className);
    } else {
      ops.push({ type: 'style', targetId: veId, prop: field.cssProp, value: newValue, scope: 'global', matchedSelectors: matched });
    }

    this.changeset.push({
      label: `${field.label} changed`,
      ops,
      preview: () => { el.style.setProperty(field.cssProp, newValue); if (scope === 'new-rule') el.classList.add(ops[0].newValue); },
      revert: () => { el.style.setProperty(field.cssProp, beforeValue); if (scope === 'new-rule') el.classList.remove(ops[0].newValue); },
    });
  }
}

function toHexColor(cssColor) {
  if (!cssColor) return '#000000';
  if (/^#/.test(cssColor)) return cssColor.length === 4 ? expandHex(cssColor) : cssColor.slice(0, 7);
  const m = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i.exec(cssColor);
  if (!m) return '#000000';
  return '#' + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('');
}

function expandHex(hex) {
  return '#' + hex.slice(1).split('').map((c) => c + c).join('');
}
