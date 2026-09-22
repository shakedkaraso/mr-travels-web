// Reads the page's REAL CSSOM to answer "which selectors match this
// element" and "how many elements does this selector match" — the browser
// is the authority on cascade matching, so the client never reimplements a
// selector engine; the server independently re-derives the same rules from
// source text when it writes the file (see server/css-source-map.js).

function topLevelStyleRules() {
  const rules = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let cssRules;
    try {
      cssRules = sheet.cssRules;
    } catch (e) {
      continue; // cross-origin stylesheet (e.g. Google Fonts) — inaccessible, skip
    }
    if (!cssRules) continue;
    for (const rule of Array.from(cssRules)) {
      if (rule.type === CSSRule.STYLE_RULE) rules.push(rule);
      // Rules inside @media/@supports are intentionally excluded — the
      // server's write path treats them as non-editable for the same
      // reason (never guess which conditional context to edit).
    }
  }
  return rules;
}

// The universal selector (and other zero-specificity resets) matches every
// element on the page but is never a meaningful edit target for a specific
// property — including it would both over-trigger the "shared style"
// safety prompt on every single edit and risk the server's cascade
// resolution falling back to writing into a global reset rule. Real
// cascade RESOLUTION for a property that IS declared there is unaffected,
// since a genuine match on that selector is still reachable via
// countMatches/resolveWinningRule when it actually matters.
const NON_TARGETABLE_SELECTORS = new Set(['*']);

export function getMatchingSelectors(el) {
  const out = [];
  for (const rule of topLevelStyleRules()) {
    if (NON_TARGETABLE_SELECTORS.has(rule.selectorText.trim())) continue;
    try {
      if (el.matches(rule.selectorText)) out.push(rule.selectorText);
    } catch (e) { /* invalid/unsupported selector text — skip */ }
  }
  return out;
}

export function countMatches(selector) {
  try {
    return document.querySelectorAll(selector).length;
  } catch (e) {
    return 0;
  }
}
