'use strict';
/**
 * Dev-only Babel plugin: stamps a real `data-ve-id="relFile:line:col"` prop
 * onto JSX elements at compile time, so the value is part of React's actual
 * render output on both server and client (no hydration mismatch) and the
 * Visual Editor's inspector can find it in the live DOM exactly like it
 * would a plain `data-ve-id` attribute in the static-html adapter.
 *
 * Deliberately skipped (no id, not selectable, not "best effort"):
 *  - elements inside a `.map()`/`.flatMap()` callback — one source location
 *    would be shared by every rendered instance, which the write-back side
 *    cannot safely disambiguate yet. See references/adapters.md.
 *  - elements already carrying a `data-ve-id` (defensive no-op).
 *  - non-DOM JSX (identifier starting with an uppercase letter, i.e. a
 *    custom component) — only real DOM tags are ever editable.
 */
const path = require('path');

const NON_EDITABLE_TAGS = new Set(['script', 'style', 'html', 'head', 'body', 'meta', 'link', 'title']);

function isMapCallback(nodePath) {
  return Boolean(
    nodePath.findParent((p) => {
      if (!p.isCallExpression()) return false;
      const callee = p.node.callee;
      return (
        callee &&
        callee.type === 'MemberExpression' &&
        callee.property &&
        (callee.property.name === 'map' || callee.property.name === 'flatMap')
      );
    })
  );
}

module.exports = function veSourcePlugin({ types: t }) {
  // Belt-and-suspenders: even though .babelrc.json only wires this plugin
  // in for development, refuse to stamp anything if NODE_ENV ever says
  // otherwise (e.g. a `next build` that inherited a dev env by mistake).
  // The visual editor must never leave a trace in a production build.
  if (process.env.NODE_ENV === 'production') {
    return { name: 've-source', visitor: {} };
  }
  return {
    name: 've-source',
    visitor: {
      JSXOpeningElement(nodePath, state) {
        const nameNode = nodePath.node.name;
        if (nameNode.type !== 'JSXIdentifier') return; // skip <Foo.Bar>, namespaced, etc.
        const tag = nameNode.name;
        if (tag[0] === tag[0].toUpperCase()) return; // custom component, not a DOM tag
        if (NON_EDITABLE_TAGS.has(tag)) return;

        const already = nodePath.node.attributes.some(
          (a) => a.type === 'JSXAttribute' && a.name && a.name.name === 'data-ve-id'
        );
        if (already) return;

        if (isMapCallback(nodePath)) return;

        const loc = nodePath.node.loc;
        if (!loc) return;

        const filename = state.filename || state.file.opts.filename;
        if (!filename) return;
        const rel = path
          .relative(state.cwd || process.cwd(), filename)
          .split(path.sep)
          .join('/');

        const id = `${rel}:${loc.start.line}:${loc.start.column}`;
        nodePath.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('data-ve-id'), t.stringLiteral(id))
        );
      },
    },
  };
};
