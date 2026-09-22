'use strict';
/** Next.js-adapter variant of verify.js: proves zero editor traces on disk
 * across the actual source tree (.ts/.tsx/.js/.jsx), not just HTML/CSS. */
const fs = require('fs');
const path = require('path');

const SKIP_DIRS = new Set(['.visual-editor', 'node_modules', '.git', '.next', 'public']);
const SOURCE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);

const MARKERS = [
  { name: 'data-ve-id attribute', re: /data-ve-id=/ },
  { name: 've-source babel plugin wired outside development env', re: /ve-source-plugin-active-in-prod/ }, // reserved, currently unused
];

function listSourceFiles(projectRoot) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        walk(path.join(dir, entry.name));
      } else if (SOURCE_EXT.has(path.extname(entry.name))) {
        files.push(path.join(dir, entry.name));
      }
    }
  }
  walk(projectRoot);
  return files;
}

function verifyClean(projectRoot) {
  const files = listSourceFiles(projectRoot);
  const findings = [];
  for (const abs of files) {
    const text = fs.readFileSync(abs, 'utf8');
    for (const marker of MARKERS) {
      if (marker.re.test(text)) {
        findings.push({ file: path.relative(projectRoot, abs).replace(/\\/g, '/'), marker: marker.name });
      }
    }
  }
  return { clean: findings.length === 0, findings, filesChecked: files.length };
}

module.exports = { verifyClean };
