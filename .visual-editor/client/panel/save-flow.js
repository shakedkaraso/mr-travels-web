import { showModal } from './modal.js';

const TYPE_LABELS = { text: 'Text edit', attr: 'Attribute/content change', style: 'Style change', delete: 'Delete element', duplicate: 'Duplicate element' };

function summarize(ops) {
  const counts = {};
  for (const op of ops) counts[op.type] = (counts[op.type] || 0) + 1;
  return Object.keys(counts).map((t) => `${counts[t]}x ${TYPE_LABELS[t] || t}`).join(', ');
}

/** Shows the pre-save confirm dialog, then POSTs to /__ve/save if the user
 * confirms. Returns {saved:boolean, result?, error?}. */
export async function runSaveFlow(shadowRoot, changeset, bootInfo) {
  const ops = changeset.compactForSave();
  if (ops.length === 0) return { saved: false };

  const choice = await showModal(shadowRoot, {
    title: `${ops.length} change${ops.length === 1 ? '' : 's'} will be saved`,
    message: summarize(ops) + '. This writes directly to your project source files.',
    buttons: [
      { label: 'Cancel', value: null },
      { label: 'Save changes', value: 'save', primary: true },
    ],
  });
  if (choice !== 'save') return { saved: false };

  try {
    const res = await fetch('/__ve/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: bootInfo.page, changes: ops, fileHashes: bootInfo.fileHashes }),
    });
    const body = await res.json();
    if (!res.ok) {
      await showModal(shadowRoot, {
        title: 'Save failed',
        message: body.error + (body.details ? '\n\n' + body.details.map((d) => `• ${d.reason || JSON.stringify(d)}`).join('\n') : ''),
        buttons: [{ label: 'OK', value: 'ok', primary: true }],
      });
      return { saved: false, error: body.error };
    }
    changeset.clear();
    await showModal(shadowRoot, {
      title: 'Saved',
      message: body.changedFiles.length > 0 ? `Updated: ${body.changedFiles.join(', ')}` : 'No file changes were needed.',
      buttons: [{ label: 'OK', value: 'ok', primary: true }],
    });
    return { saved: true, result: body };
  } catch (err) {
    await showModal(shadowRoot, {
      title: 'Save failed',
      message: 'Could not reach the Visual Editor dev server: ' + err.message,
      buttons: [{ label: 'OK', value: 'ok', primary: true }],
    });
    return { saved: false, error: err.message };
  }
}
