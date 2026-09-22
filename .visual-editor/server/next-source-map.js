'use strict';
/**
 * Next.js/React adapter — source mapping half of the contract.
 *
 * Unlike the static-html adapter, `data-ve-id` is never injected into served
 * HTML text here: the Babel plugin (`../babel-plugin-ve-source.js`) stamps
 * it at compile time, so it's a real prop present in React's own render
 * output on both server and client. This module's only job is: given the
 * `relFile:line:col` encoded in a `data-ve-id`, re-parse that file's
 * *current* on-disk text (never a stale snapshot) and locate the exact
 * JSXOpeningElement it refers to, then answer narrow, certain questions
 * about it ("does it have exactly one plain text child?", "is its
 * className a plain string literal?") — never a guess.
 */
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function parseId(id) {
  const m = /^(.*):(\d+):(\d+)$/.exec(String(id || ''));
  if (!m) return null;
  return { file: m[1], line: Number(m[2]), col: Number(m[3]) };
}

function parseSource(text, filename) {
  const isTs = /\.tsx?$/.test(filename);
  return parser.parse(text, {
    sourceType: 'module',
    sourceFilename: filename,
    plugins: isTs ? ['typescript', 'jsx'] : ['jsx'],
  });
}

/** Finds the JSXOpeningElement whose own `loc.start` matches {line, col}
 * exactly (0-based column, 1-based line — same convention the Babel plugin
 * used when it computed the id). Returns null if none matches: the file may
 * have changed shape since the page loaded, which the caller must treat as
 * "reload and try again," never as license to guess the nearest element. */
function findOpeningElementAt(ast, line, col) {
  let found = null;
  traverse(ast, {
    JSXOpeningElement(path) {
      const loc = path.node.loc;
      if (loc && loc.start.line === line && loc.start.column === col) {
        found = path;
      }
    },
  });
  return found;
}

/** A JSXElement is text-editable only if it has exactly one child and that
 * child is a plain JSXText node (not an expression, not multiple children,
 * not another element) — mirrors the static-html adapter's rule exactly. */
function getTextChildSpan(openingElPath) {
  const el = openingElPath.parentPath; // JSXElement
  const children = (el.node.children || []).filter(
    (c) => !(c.type === 'JSXText' && c.value.trim() === '')
  );
  if (children.length !== 1 || children[0].type !== 'JSXText') return null;
  const child = children[0];
  return { start: child.start, end: child.end, raw: child.value };
}

/** className is only a safe rewrite target when it's a plain string literal
 * — a template literal, a `clsx(...)`/`cn(...)` call, or a conditional
 * expression has no single unambiguous span to splice into, so those are
 * refused rather than approximated. */
function getClassNameAttr(openingElPath) {
  const attrs = openingElPath.node.attributes || [];
  const attr = attrs.find(
    (a) => a.type === 'JSXAttribute' && a.name && a.name.name === 'className'
  );
  if (!attr) return { attr: null, value: '', quote: '"' };
  if (!attr.value || attr.value.type !== 'StringLiteral') return null; // refuse: not a plain string
  const raw = attr.value.extra && attr.value.extra.raw;
  const quote = raw && (raw[0] === "'" || raw[0] === '"') ? raw[0] : '"';
  return { attr, value: attr.value.value, quote, valueStart: attr.value.start + 1, valueEnd: attr.value.end - 1 };
}

/** Generic JSX attribute (src, alt, href, title, ...). Same plain-string-
 * literal-only rule as className; also reports where to insert a brand new
 * attribute (right after the tag name) when it doesn't exist yet. */
function getAttr(openingElPath, attrName) {
  const attrs = openingElPath.node.attributes || [];
  const attr = attrs.find(
    (a) => a.type === 'JSXAttribute' && a.name && a.name.name === attrName
  );
  if (!attr) {
    const insertAt = openingElPath.node.name.end;
    return { attr: null, insertAt };
  }
  if (!attr.value || attr.value.type !== 'StringLiteral') return null; // refuse
  const raw = attr.value.extra && attr.value.extra.raw;
  const quote = raw && (raw[0] === "'" || raw[0] === '"') ? raw[0] : '"';
  return { attr, quote, valueStart: attr.value.start + 1, valueEnd: attr.value.end - 1 };
}

module.exports = { parseId, parseSource, findOpeningElementAt, getTextChildSpan, getClassNameAttr, getAttr };
