// In-memory pending-change model + linear undo/redo. Nothing here ever
// touches the network except the explicit save() call the panel triggers.
//
// A "change op" (sent to the server on Save) has this shape:
//   { type:'text', targetId, file, newText }
//   { type:'attr', targetId, file, attrName, newValue, mode?:'append-class' }
//   { type:'delete', targetId, file }
//   { type:'duplicate', targetId, file }
//   { type:'style', targetId, prop, value, important?,
//     scope:'global'|'new-rule', matchedSelectors?, selector? }
//
// An "action" groups 1+ ops that should undo/redo together as one user
// gesture (e.g. an instance-scoped style edit = an append-class attr op +
// a new-rule style op).

let nextActionId = 1;

export class ChangeSet {
  constructor() {
    this.past = []; // committed actions, oldest first
    this.future = []; // undone actions, available for redo
    this._listeners = new Set();
  }

  get ops() {
    const all = [];
    for (const action of this.past) all.push(...action.ops);
    return all;
  }

  get pendingCount() {
    return this.past.length;
  }

  /** @param {{label:string, ops:Array, preview:()=>void, revert:()=>void}} action
   * `preview`/`revert` apply/undo the live-DOM visual effect; the op data
   * itself is what eventually gets sent to the server. */
  push(action) {
    action.id = 'act_' + nextActionId++;
    action.timestamp = Date.now();
    this.past.push(action);
    this.future = [];
    this._emit();
  }

  canUndo() { return this.past.length > 0; }
  canRedo() { return this.future.length > 0; }

  undo() {
    if (!this.canUndo()) return;
    const action = this.past.pop();
    try { action.revert && action.revert(); } catch (e) { console.error('[visual-editor] undo failed', e); }
    this.future.push(action);
    this._emit();
  }

  redo() {
    if (!this.canRedo()) return;
    const action = this.future.pop();
    try { action.preview && action.preview(); } catch (e) { console.error('[visual-editor] redo failed', e); }
    this.past.push(action);
    this._emit();
  }

  clear() {
    this.past = [];
    this.future = [];
    this._emit();
  }

  /** Collapses pending ops for Save: last write per (targetId, key) wins,
   * and a pending delete drops every other op queued for that element. */
  compactForSave() {
    const all = this.ops;
    const deleted = new Set(all.filter((o) => o.type === 'delete').map((o) => o.targetId));
    const byKey = new Map();
    for (const op of all) {
      if (op.type !== 'delete' && deleted.has(op.targetId)) continue;
      const key = op.type === 'style'
        ? `style:${op.targetId}:${op.prop}:${op.scope}:${op.selector || ''}`
        : op.type === 'attr'
          ? `attr:${op.targetId}:${op.attrName}:${op.mode || 'set'}`
          : `${op.type}:${op.targetId}`;
      byKey.set(key, op);
    }
    return Array.from(byKey.values());
  }

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _emit() {
    for (const fn of this._listeners) fn(this);
  }
}
