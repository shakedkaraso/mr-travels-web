'use strict';
/**
 * Converts pending change-set ops (already grouped per source file) into a
 * flat list of {start, end, replacement} spans over that file's ORIGINAL
 * text. Pure — no filesystem access. Mirrors write-html.js's contract for
 * the static adapter, but targets JSX source via next-source-map.js.
 *
 * Scope for this first version of the Next.js adapter: `text`, `attr`
 * (plain string attributes) and `style` (as Tailwind arbitrary-property
 * classes on `className`) are supported. `delete` and `duplicate` are
 * refused — they'd mean splicing JSXElement boundaries, which is more
 * structurally risky and hasn't been proven safe yet; better to refuse than
 * to guess. Elements the Babel plugin didn't stamp (anything inside a
 * `.map()`) never reach here at all — the client won't have a `data-ve-id`
 * to select them by in the first place.
 */
const { findOpeningElementAt, getTextChildSpan, getClassNameAttr, getAttr } = require('./next-source-map');

function escapeJsxText(str) {
  // JSXText has no entity requirement for a plain string the way HTML does,
  // but literal `{` / `}` would be parsed as a new expression container, and
  // `<` would start a new tag — both must be neutralized to stay valid JSX.
  return String(str).replace(/[{}<>]/g, (c) => ({ '{': '&#123;', '}': '&#125;', '<': '&lt;', '>': '&gt;' }[c]));
}

function escapeJsAttrString(str, quote) {
  const other = quote === '"' ? "'" : '"';
  // Prefer swapping the quote style over escaping when the value itself
  // contains the current quote char, to keep the source readable; fall back
  // to a backslash escape only if it contains both.
  if (str.includes(quote) && !str.includes(other)) return { quote: other, text: str };
  return { quote, text: str.replace(new RegExp(quote, 'g'), '\\' + quote) };
}

function tailwindArbitraryToken(prop, value) {
  const sanitized = String(value).trim().replace(/\s+/g, '_');
  return `[${prop}:${sanitized}]`;
}

// Fixed-scale Tailwind utilities (h-4, w-full, min-w-screen, ...) set the
// same CSS property as our arbitrary-value token but have equal selector
// specificity — whichever rule Tailwind happens to emit later in the
// stylesheet wins, not whichever class is newer in the element's class
// list. Left in place, they silently make a size/spacing edit look like it
// "did nothing". Stripping the known utility family for an edited property
// avoids that; anything not in this table falls back to the old
// same-prop-arbitrary-token-only behavior.
const CONFLICTING_UTILITY_PATTERNS = {
  width: /^w-\S+$/,
  height: /^h-\S+$/,
  'min-width': /^min-w-\S+$/,
  'min-height': /^min-h-\S+$/,
  'max-width': /^max-w-\S+$/,
  'max-height': /^max-h-\S+$/,
};

function applyStyleOpsToClassName(currentClassValue, styleOps) {
  let classes = currentClassValue.split(/\s+/).filter(Boolean);
  for (const op of styleOps) {
    const prefix = `[${op.prop}:`;
    const conflicting = CONFLICTING_UTILITY_PATTERNS[op.prop];
    classes = classes.filter((c) => !c.startsWith(prefix) && !(conflicting && conflicting.test(c)));
    if (op.value !== '' && op.value !== null && op.value !== undefined) {
      classes.push(tailwindArbitraryToken(op.prop, op.value));
    }
  }
  return classes.join(' ');
}

/**
 * @param {Map<string,string>} filesText relFile -> current on-disk text (already hash-verified by the caller)
 * @param {Array} ops pending ops, each carrying a `data-ve-id`-shaped `targetId` of `relFile:line:col`
 * @returns {{ spansByFile: Map<string, Array>, errors: Array }}
 */
function planEdits(filesText, ops) {
  const errors = [];
  const spansByFile = new Map();
  const astCache = new Map(); // relFile -> parsed AST (re-parsed fresh per save call)

  function pushSpan(relFile, span) {
    if (!spansByFile.has(relFile)) spansByFile.set(relFile, []);
    spansByFile.get(relFile).push(span);
  }

  function locate(op) {
    const idMatch = /^(.*):(\d+):(\d+)$/.exec(String(op.targetId || ''));
    if (!idMatch) {
      errors.push({ op, reason: `Malformed targetId "${op.targetId}".` });
      return null;
    }
    const relFile = idMatch[1];
    const line = Number(idMatch[2]);
    const col = Number(idMatch[3]);
    const text = filesText.get(relFile);
    if (text === undefined) {
      errors.push({ op, reason: `File "${relFile}" was not supplied for this save.` });
      return null;
    }
    let ast = astCache.get(relFile);
    if (!ast) {
      const { parseSource } = require('./next-source-map');
      try {
        ast = parseSource(text, relFile);
      } catch (err) {
        errors.push({ op, reason: `"${relFile}" no longer parses as valid TSX (${err.message}); refusing to guess.` });
        return null;
      }
      astCache.set(relFile, ast);
    }
    const openingElPath = findOpeningElementAt(ast, line, col);
    if (!openingElPath) {
      errors.push({ op, reason: `Element at ${relFile}:${line}:${col} no longer matches the current source (file changed shape — reload and retry).` });
      return null;
    }
    return { relFile, text, openingElPath };
  }

  // Group style ops and "class" attr ops per element: Core emits a style
  // new-rule edit as a *pair* — an attr op (attrName:'class', mode:
  // 'append-class') plus a style op — that both target the same className
  // attribute. Handling them in independent loops would compute two spans
  // over the same attribute value and applySpans would reject them as
  // overlapping, so both are merged into a single className rewrite here.
  const styleOpsByTarget = new Map();
  const classAppendsByTarget = new Map();
  const otherOps = [];
  for (const op of ops) {
    if (op.type === 'style') {
      if (!styleOpsByTarget.has(op.targetId)) styleOpsByTarget.set(op.targetId, []);
      styleOpsByTarget.get(op.targetId).push(op);
    } else if (op.type === 'attr' && op.attrName === 'class') {
      if (!classAppendsByTarget.has(op.targetId)) classAppendsByTarget.set(op.targetId, []);
      classAppendsByTarget.get(op.targetId).push(op);
    } else {
      otherOps.push(op);
    }
  }

  for (const op of otherOps) {
    if (op.type === 'delete' || op.type === 'duplicate') {
      errors.push({ op, reason: `"${op.type}" is not supported yet for React/Next.js source — only text, attributes and styling can be edited safely so far.` });
      continue;
    }
    const loc = locate(op);
    if (!loc) continue;
    const { relFile, openingElPath } = loc;

    if (op.type === 'text') {
      const span = getTextChildSpan(openingElPath);
      if (!span) {
        errors.push({ op, reason: `Element ${op.targetId} doesn't have a single plain text child in source (its text may come from a variable/expression) — refusing to edit.` });
        continue;
      }
      pushSpan(relFile, { start: span.start, end: span.end, replacement: escapeJsxText(op.newText) });
    } else if (op.type === 'attr') {
      const info = getAttr(openingElPath, op.attrName);
      if (info === null) {
        errors.push({ op, reason: `Attribute "${op.attrName}" on ${op.targetId} isn't a plain string literal (looks computed) — refusing to edit.` });
        continue;
      }
      if (info.attr) {
        const { quote, text: valueText } = escapeJsAttrString(op.newValue, info.quote);
        pushSpan(relFile, {
          start: info.attr.value.start,
          end: info.attr.value.end,
          replacement: `${quote}${valueText}${quote}`,
        });
      } else {
        const { quote, text: valueText } = escapeJsAttrString(op.newValue, '"');
        pushSpan(relFile, { start: info.insertAt, end: info.insertAt, replacement: ` ${op.attrName}=${quote}${valueText}${quote}` });
      }
    } else {
      errors.push({ op, reason: `Unsupported op type: ${op.type}` });
    }
  }

  const classTargetIds = new Set([...styleOpsByTarget.keys(), ...classAppendsByTarget.keys()]);
  for (const targetId of classTargetIds) {
    const styleOps = styleOpsByTarget.get(targetId) || [];
    const classAppends = classAppendsByTarget.get(targetId) || [];
    const anchorOp = styleOps[0] || classAppends[0];
    const loc = locate(anchorOp);
    if (!loc) continue;
    const { relFile, openingElPath } = loc;
    // Core (framework-agnostic) always names the class attribute "class",
    // the HTML spelling — JSX/React source only ever has "className".
    const info = getClassNameAttr(openingElPath);
    if (info === null) {
      errors.push({ op: anchorOp, reason: `className on ${targetId} isn't a plain string literal (looks computed, e.g. clsx()/template literal) — refusing to edit styles here.` });
      continue;
    }
    let nextClassValue = styleOps.length > 0 ? applyStyleOpsToClassName(info.value, styleOps) : info.value;
    for (const appendOp of classAppends) {
      const existing = nextClassValue.split(/\s+/).filter(Boolean);
      if (!existing.includes(appendOp.newValue)) {
        nextClassValue = nextClassValue ? `${nextClassValue} ${appendOp.newValue}` : appendOp.newValue;
      }
    }
    if (info.attr) {
      pushSpan(relFile, { start: info.valueStart, end: info.valueEnd, replacement: nextClassValue });
    } else {
      // No className attribute existed yet — add one.
      const insertAt = openingElPath.node.name.end;
      pushSpan(relFile, { start: insertAt, end: insertAt, replacement: ` className="${nextClassValue}"` });
    }
  }

  return { spansByFile, errors };
}

module.exports = { planEdits };
