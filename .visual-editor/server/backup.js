'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha1(text) {
  return crypto.createHash('sha1').update(text, 'utf8').digest('hex');
}

/** Applies non-overlapping spans (each {start,end,replacement}) to `text`,
 * splicing in descending-start order so earlier offsets stay valid. */
function applySpans(text, spans) {
  const sorted = spans.slice().sort((a, b) => b.start - a.start);
  let out = text;
  let lastStart = Infinity;
  for (const span of sorted) {
    if (span.end > lastStart) {
      throw new Error(`Overlapping edit spans detected (end=${span.end} >= previous start=${lastStart}); refusing to write a corrupted file.`);
    }
    out = out.slice(0, span.start) + span.replacement + out.slice(span.end);
    lastStart = span.start;
  }
  return out;
}

function backupsDir(projectRoot) {
  return path.join(projectRoot, '.visual-editor', '.backups');
}

/** Copies the current on-disk contents of each file into a single
 * timestamped backup folder before any writes happen, so a failed
 * multi-file save can be rolled back completely. */
function createBackup(projectRoot, filesAbs) {
  const id = new Date().toISOString().replace(/[:.]/g, '-') + '-' + crypto.randomBytes(3).toString('hex');
  const dir = path.join(backupsDir(projectRoot), id);
  fs.mkdirSync(dir, { recursive: true });
  const manifest = {};
  for (const abs of filesAbs) {
    const rel = path.relative(projectRoot, abs).replace(/\\/g, '/');
    const dest = path.join(dir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(abs, dest);
    manifest[rel] = true;
  }
  fs.writeFileSync(path.join(dir, '__manifest.json'), JSON.stringify({ files: Object.keys(manifest), createdAt: new Date().toISOString() }, null, 2));
  return id;
}

function restoreBackup(projectRoot, id) {
  const dir = path.join(backupsDir(projectRoot), id);
  const manifestPath = path.join(dir, '__manifest.json');
  if (!fs.existsSync(manifestPath)) throw new Error(`Unknown backup id: ${id}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const rel of manifest.files) {
    const src = path.join(dir, rel);
    const dest = path.join(projectRoot, rel);
    fs.copyFileSync(src, dest);
  }
  return manifest.files;
}

/** Atomic same-volume write via temp file + rename, retrying briefly on
 * Windows file-lock errors (EBUSY/EPERM from an AV scanner or open handle). */
function atomicWrite(absPath, content, retries) {
  const attempts = retries === undefined ? 5 : retries;
  const tmpPath = absPath + '.tmp-' + crypto.randomBytes(4).toString('hex');
  fs.writeFileSync(tmpPath, content, 'utf8');
  for (let i = 0; i < attempts; i++) {
    try {
      fs.renameSync(tmpPath, absPath);
      return;
    } catch (err) {
      if ((err.code === 'EBUSY' || err.code === 'EPERM') && i < attempts - 1) {
        const waitMs = 50 * Math.pow(2, i);
        const until = Date.now() + waitMs;
        while (Date.now() < until) { /* brief synchronous backoff */ }
        continue;
      }
      try { fs.unlinkSync(tmpPath); } catch (_) { /* best effort cleanup */ }
      throw err;
    }
  }
}

module.exports = { sha1, applySpans, createBackup, restoreBackup, atomicWrite, backupsDir };
