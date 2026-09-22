// Minimal reusable confirm/choice modal rendered inside the editor's shadow
// root. Returns a Promise resolving to the clicked button's value, or null
// if dismissed (Escape / backdrop click).

export function showModal(shadowRoot, { title, message, buttons }) {
  return new Promise((resolve) => {
    const backdrop = document.createElement('div');
    backdrop.className = 've-modal-backdrop';
    const box = document.createElement('div');
    box.className = 've-modal';
    box.innerHTML = `<h3></h3><p></p><div class="ve-modal-actions"></div>`;
    box.querySelector('h3').textContent = title;
    box.querySelector('p').textContent = message;
    const actions = box.querySelector('.ve-modal-actions');

    function close(value) {
      backdrop.remove();
      resolve(value);
    }

    for (const btn of buttons) {
      const b = document.createElement('button');
      b.textContent = btn.label;
      b.className = 've-btn' + (btn.primary ? ' ve-btn-primary' : '');
      b.addEventListener('click', () => close(btn.value));
      actions.appendChild(b);
    }

    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(null); });
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { document.removeEventListener('keydown', onKey); close(null); }
    });

    backdrop.appendChild(box);
    shadowRoot.appendChild(backdrop);
  });
}
