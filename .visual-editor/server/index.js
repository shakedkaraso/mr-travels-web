'use strict';
/**
 * Visual Editor bridge — Next.js adapter. Unlike the static-html bridge,
 * there is no `instrumentHtml`: `data-ve-id` is stamped at compile time by
 * ../babel-plugin-ve-source.js, so it's already part of React's real render
 * output by the time a page reaches the browser. This module only needs to
 * implement the transport-agnostic parts of the /__ve/* contract; a thin
 * Next.js Route Handler (src/app/api/__ve/[...ve]/route.ts) adapts these
 * plain functions to Web Request/Response.
 */
const fs = require('fs');
const path = require('path');

const { planEdits } = require('./write-back');
const { sha1, applySpans, createBackup, restoreBackup, atomicWrite } = require('./backup');
const { verifyClean } = require('./verify-next');

function createBridge(projectRoot) {
  function safeResolve(relPath) {
    const abs = path.resolve(projectRoot, relPath);
    if (!abs.startsWith(projectRoot)) throw httpError(400, 'Path escapes project root: ' + relPath);
    return abs;
  }

  function httpError(status, message, details) {
    const err = new Error(message);
    err.status = status;
    err.details = details;
    return err;
  }

  /** GET /__ve/locate — the targetId already *is* `relFile:line:col` (that's
   * what the Babel plugin encoded), so this is a straight parse, not a
   * source-map lookup like the static adapter needs. */
  function handleLocate({ targetId }) {
    const m = /^(.*):(\d+):(\d+)$/.exec(String(targetId || ''));
    if (!m) throw httpError(400, 'Malformed targetId.');
    return { file: m[1], line: Number(m[2]), col: Number(m[3]) };
  }

  function handleVerify() {
    return verifyClean(projectRoot);
  }

  function handleSave(body) {
    const changes = Array.isArray(body.changes) ? body.changes : [];
    if (changes.length === 0) return { ok: true, changedFiles: [], backupId: null };

    const relFiles = new Set();
    for (const op of changes) {
      const m = /^(.*):(\d+):(\d+)$/.exec(String(op.targetId || ''));
      if (m) relFiles.add(m[1]);
    }

    const filesText = new Map();
    for (const relFile of relFiles) {
      const abs = safeResolve(relFile);
      if (!fs.existsSync(abs)) throw httpError(400, `File not found: ${relFile}`);
      const text = fs.readFileSync(abs, 'utf8');
      const claimedHash = (body.fileHashes || {})[relFile];
      if (claimedHash && claimedHash !== sha1(text)) {
        throw httpError(409, `"${relFile}" changed on disk since you started editing. Reload the page and redo your changes.`);
      }
      filesText.set(relFile, text);
    }

    const { spansByFile, errors } = planEdits(filesText, changes);
    if (errors.length > 0) {
      throw httpError(422, 'Save refused — one or more changes could not be safely mapped to source.', errors);
    }

    const writes = [];
    for (const [relFile, spans] of spansByFile) {
      const abs = safeResolve(relFile);
      writes.push({ abs, rel: relFile, text: applySpans(filesText.get(relFile), spans) });
    }
    if (writes.length === 0) return { ok: true, changedFiles: [], backupId: null };

    const backupId = createBackup(projectRoot, writes.map((w) => w.abs));
    try {
      for (const w of writes) atomicWrite(w.abs, w.text);
    } catch (err) {
      restoreBackup(projectRoot, backupId);
      throw httpError(500, `Write failed for one or more files (rolled back automatically): ${err.message}`);
    }
    return { ok: true, changedFiles: writes.map((w) => w.rel), backupId };
  }

  function handleRollback(body) {
    const files = restoreBackup(projectRoot, body.backupId);
    return { ok: true, restoredFiles: files };
  }

  return { handleLocate, handleVerify, handleSave, handleRollback, httpError };
}

module.exports = { createBridge };
