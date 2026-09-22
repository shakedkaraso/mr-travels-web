'use strict';
/**
 * Proves the on-disk source files carry zero Visual Editor traces. Used by
 * GET /__ve/verify and by the Skill's verify-installation / remove scripts.
 * Everything the editor injects (data-ve-id, the boot script tag) only ever
 * exists in the dev server's in-memory HTTP responses — this script checks
 * the actual files on disk, never a served response.
 */
const fs = require('fs');
const path = require('path');

const MARKERS = [
  { name: 'data-ve-id attribute', re: /data-ve-id=/ },
  { name: 'injected editor boot script', re: /__ve\/client\/boot\.js/ },
  { name: 'injected VE boot payload', re: /__VE_BOOT/ },
  { name: 'injected live marker styles', re: /ve-live-markers|ve-pending-delete|ve-pending-duplicate/ },
];

function listProjectFiles(projectRoot, config) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.visual-editor' || entry.name === 'node_modules' || entry.name === '.git') continue;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
      } else if (config.editableHtmlExtensions.includes(path.extname(entry.name)) || abs.endsWith('.css')) {
        files.push(abs);
      }
    }
  }
  walk(projectRoot);
  return files;
}

function verifyClean(projectRoot, config) {
  const files = listProjectFiles(projectRoot, config);
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
