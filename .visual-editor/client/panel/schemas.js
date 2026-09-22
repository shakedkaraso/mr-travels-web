// Declarative per-tab field lists fed to PropertySchemaRenderer — one
// generic control renderer, contextual schemas, per section 35/9 of the
// brief ("show properties relevant to what's selected, not everything").

const IMG_TAGS = new Set(['img']);
const LINK_TAGS = new Set(['a']);
const TEXTY_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'li', 'label']);

export const TABS = [
  {
    id: 'content', label: 'Content',
    appliesTo: () => true,
    fields: (el) => {
      const f = [];
      if (IMG_TAGS.has(el.tagName.toLowerCase())) {
        f.push({ key: 'src', kind: 'attr', attrName: 'src', label: 'Image source', type: 'text' });
        f.push({ key: 'alt', kind: 'attr', attrName: 'alt', label: 'Alt text', type: 'text' });
      } else {
        f.push({ key: 'text', kind: 'text', label: TEXTY_TAGS.has(el.tagName.toLowerCase()) ? 'Text' : 'Text content', type: 'textarea' });
      }
      if (LINK_TAGS.has(el.tagName.toLowerCase())) {
        f.push({ key: 'href', kind: 'attr', attrName: 'href', label: 'Link (href)', type: 'text' });
      }
      f.push({ key: 'title', kind: 'attr', attrName: 'title', label: 'Title (tooltip)', type: 'text' });
      return f;
    },
  },
  {
    id: 'typography', label: 'Typography',
    appliesTo: (el) => window.getComputedStyle(el).display !== 'none',
    fields: () => [
      { key: 'font-size', kind: 'style', cssProp: 'font-size', label: 'Size', type: 'number-unit', units: ['px', 'rem', 'em', '%'] },
      { key: 'font-weight', kind: 'style', cssProp: 'font-weight', label: 'Weight', type: 'select', options: ['400', '500', '600', '700', '800', 'normal', 'bold'] },
      { key: 'line-height', kind: 'style', cssProp: 'line-height', label: 'Line height', type: 'number-unit', units: ['', 'px', '%'] },
      { key: 'letter-spacing', kind: 'style', cssProp: 'letter-spacing', label: 'Letter spacing', type: 'number-unit', units: ['px', 'em'] },
      { key: 'text-align', kind: 'style', cssProp: 'text-align', label: 'Alignment', type: 'select', options: ['start', 'center', 'end', 'justify'] },
      { key: 'text-decoration', kind: 'style', cssProp: 'text-decoration-line', label: 'Decoration', type: 'select', options: ['none', 'underline', 'line-through'] },
      { key: 'text-transform', kind: 'style', cssProp: 'text-transform', label: 'Transform', type: 'select', options: ['none', 'uppercase', 'lowercase', 'capitalize'] },
    ],
  },
  {
    id: 'colors', label: 'Colors',
    appliesTo: () => true,
    fields: () => [
      { key: 'color', kind: 'style', cssProp: 'color', label: 'Text color', type: 'color' },
      { key: 'background-color', kind: 'style', cssProp: 'background-color', label: 'Background', type: 'color' },
      { key: 'opacity', kind: 'style', cssProp: 'opacity', label: 'Opacity', type: 'number-unit', units: [''], step: 0.05, min: 0, max: 1 },
    ],
  },
  {
    id: 'spacing', label: 'Spacing',
    appliesTo: () => true,
    fields: () => [
      { key: 'margin-block-start', kind: 'style', cssProp: 'margin-block-start', label: 'Margin — block start (top)', type: 'number-unit', units: ['px', 'rem', '%'] },
      { key: 'margin-block-end', kind: 'style', cssProp: 'margin-block-end', label: 'Margin — block end (bottom)', type: 'number-unit', units: ['px', 'rem', '%'] },
      { key: 'margin-inline-start', kind: 'style', cssProp: 'margin-inline-start', label: 'Margin — inline start', type: 'number-unit', units: ['px', 'rem', '%'] },
      { key: 'margin-inline-end', kind: 'style', cssProp: 'margin-inline-end', label: 'Margin — inline end', type: 'number-unit', units: ['px', 'rem', '%'] },
      { key: 'padding-block-start', kind: 'style', cssProp: 'padding-block-start', label: 'Padding — block start (top)', type: 'number-unit', units: ['px', 'rem', '%'] },
      { key: 'padding-block-end', kind: 'style', cssProp: 'padding-block-end', label: 'Padding — block end (bottom)', type: 'number-unit', units: ['px', 'rem', '%'] },
      { key: 'padding-inline-start', kind: 'style', cssProp: 'padding-inline-start', label: 'Padding — inline start', type: 'number-unit', units: ['px', 'rem', '%'] },
      { key: 'padding-inline-end', kind: 'style', cssProp: 'padding-inline-end', label: 'Padding — inline end', type: 'number-unit', units: ['px', 'rem', '%'] },
    ],
  },
  {
    id: 'size', label: 'Size',
    appliesTo: () => true,
    fields: () => [
      { key: 'width', kind: 'style', cssProp: 'width', label: 'Width', type: 'number-unit', units: ['px', '%', 'rem', 'auto'] },
      { key: 'min-width', kind: 'style', cssProp: 'min-width', label: 'Min width', type: 'number-unit', units: ['px', '%', 'rem'] },
      { key: 'max-width', kind: 'style', cssProp: 'max-width', label: 'Max width', type: 'number-unit', units: ['px', '%', 'rem', 'none'] },
      { key: 'height', kind: 'style', cssProp: 'height', label: 'Height', type: 'number-unit', units: ['px', '%', 'rem', 'auto'] },
      { key: 'min-height', kind: 'style', cssProp: 'min-height', label: 'Min height', type: 'number-unit', units: ['px', '%', 'rem'] },
      { key: 'max-height', kind: 'style', cssProp: 'max-height', label: 'Max height', type: 'number-unit', units: ['px', '%', 'rem', 'none'] },
    ],
  },
  {
    id: 'border', label: 'Border',
    appliesTo: () => true,
    fields: () => [
      { key: 'border-width', kind: 'style', cssProp: 'border-width', label: 'Width', type: 'number-unit', units: ['px'] },
      { key: 'border-style', kind: 'style', cssProp: 'border-style', label: 'Style', type: 'select', options: ['none', 'solid', 'dashed', 'dotted'] },
      { key: 'border-color', kind: 'style', cssProp: 'border-color', label: 'Color', type: 'color' },
      { key: 'border-radius', kind: 'style', cssProp: 'border-radius', label: 'Radius', type: 'number-unit', units: ['px', '%'] },
    ],
  },
  {
    id: 'layout', label: 'Layout',
    appliesTo: () => true,
    fields: () => [
      { key: 'display', kind: 'style', cssProp: 'display', label: 'Display', type: 'select', options: ['block', 'inline-block', 'inline', 'flex', 'grid', 'none'] },
      { key: 'flex-direction', kind: 'style', cssProp: 'flex-direction', label: 'Direction', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
      { key: 'justify-content', kind: 'style', cssProp: 'justify-content', label: 'Justify content', type: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] },
      { key: 'align-items', kind: 'style', cssProp: 'align-items', label: 'Align items', type: 'select', options: ['stretch', 'flex-start', 'center', 'flex-end'] },
      { key: 'flex-wrap', kind: 'style', cssProp: 'flex-wrap', label: 'Wrap', type: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'] },
      { key: 'gap', kind: 'style', cssProp: 'gap', label: 'Gap', type: 'number-unit', units: ['px', 'rem'] },
    ],
  },
  {
    id: 'position', label: 'Position',
    appliesTo: () => true,
    fields: () => [
      { key: 'position', kind: 'style', cssProp: 'position', label: 'Position', type: 'select', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'] },
      { key: 'top', kind: 'style', cssProp: 'top', label: 'Top', type: 'number-unit', units: ['px', '%', 'auto'] },
      { key: 'inset-inline-end', kind: 'style', cssProp: 'inset-inline-end', label: 'Inline end', type: 'number-unit', units: ['px', '%', 'auto'] },
      { key: 'bottom', kind: 'style', cssProp: 'bottom', label: 'Bottom', type: 'number-unit', units: ['px', '%', 'auto'] },
      { key: 'inset-inline-start', kind: 'style', cssProp: 'inset-inline-start', label: 'Inline start', type: 'number-unit', units: ['px', '%', 'auto'] },
      { key: 'z-index', kind: 'style', cssProp: 'z-index', label: 'Z-index', type: 'number-unit', units: [''] },
    ],
  },
  {
    id: 'effects', label: 'Effects',
    appliesTo: () => true,
    fields: () => [
      { key: 'box-shadow', kind: 'style', cssProp: 'box-shadow', label: 'Box shadow', type: 'text' },
      { key: 'transform', kind: 'style', cssProp: 'transform', label: 'Transform', type: 'text' },
      { key: 'filter', kind: 'style', cssProp: 'filter', label: 'Filter', type: 'text' },
    ],
  },
];
