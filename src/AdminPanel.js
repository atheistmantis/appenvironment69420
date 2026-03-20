/**
 * AdminPanel – collapsible form that lets admins add new recipes.
 * Recipes can also be deleted directly from the card (in admin mode).
 *
 * @param {(data: {name:string, image:string, description:string}) => void} onAdd
 * @param {() => void} onReset
 * @returns {HTMLElement}
 */
export function AdminPanel(onAdd, onReset) {
  const panel = document.createElement('section');
  panel.className = 'admin-panel';
  panel.setAttribute('aria-label', 'Admin panel – add recipes');

  // ── Toggle button ──────────────────────────────────────────────
  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'admin-panel__toggle big-btn';
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-controls', 'admin-form');
  toggleBtn.textContent = '⚙ Manage Recipes (Admin)';

  // ── Collapsible form ───────────────────────────────────────────
  const form = document.createElement('form');
  form.id = 'admin-form';
  form.className = 'admin-panel__form';
  form.setAttribute('aria-hidden', 'true');


  form.innerHTML = `
    <h2 class="admin-panel__heading">Add a New Recipe</h2>

    <div class="admin-panel__field">
      <label for="recipe-name" class="admin-panel__label">Dish Name <span aria-hidden="true">*</span></label>
      <input
        id="recipe-name"
        name="name"
        type="text"
        class="admin-panel__input"
        placeholder="e.g. Spaghetti Bolognese"
        required
        autocomplete="off"
      />
    </div>

    <div class="admin-panel__field">
      <label for="recipe-image" class="admin-panel__label">Image URL <span aria-hidden="true">*</span></label>
      <input
        id="recipe-image"
        name="image"
        type="url"
        class="admin-panel__input"
        placeholder="https://example.com/photo.jpg"
        required
        autocomplete="off"
      />
      <p class="admin-panel__hint">Paste a link to a photo of the dish (must start with http:// or https://)</p>
    </div>

    <div class="admin-panel__field">
      <label for="recipe-desc" class="admin-panel__label">Short Description</label>
      <textarea
        id="recipe-desc"
        name="description"
        class="admin-panel__input admin-panel__textarea"
        placeholder="A brief description of the dish…"
        rows="3"
      ></textarea>
    </div>

    <div class="admin-panel__actions">
      <button type="submit" class="big-btn admin-panel__submit">Add Recipe</button>
    </div>

    <div class="admin-panel__divider" role="separator"></div>

    <div class="admin-panel__actions">
      <button type="button" id="reset-btn" class="big-btn admin-panel__reset">
        Reset to Default Recipes
      </button>
    </div>
  `;

  panel.appendChild(toggleBtn);
  panel.appendChild(form);

  // ── Toggle behaviour ───────────────────────────────────────────
  let open = false;
  function setOpen(value) {
    open = value;
    toggleBtn.setAttribute('aria-expanded', String(open));
    form.setAttribute('aria-hidden', String(!open));
    form.classList.toggle('admin-panel__form--open', open);
  }

  toggleBtn.addEventListener('click', () => setOpen(!open));

  // ── Form submission ────────────────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    if (!data.name || !data.name.trim()) {
      showError(form.querySelector('#recipe-name'), 'Please enter a dish name.');
      return;
    }
    if (!data.image || !data.image.trim()) {
      showError(form.querySelector('#recipe-image'), 'Please enter an image URL.');
      return;
    }

    onAdd({ name: data.name, image: data.image, description: data.description || '' });
    form.reset();
    setOpen(false);
    announceToScreenReader('Recipe added successfully!');
  });

  // ── Reset button ───────────────────────────────────────────────
  form.querySelector('#reset-btn').addEventListener('click', () => {
    if (confirm('This will remove all custom recipes and restore the defaults. Continue?')) {
      onReset();
      setOpen(false);
      announceToScreenReader('Recipes reset to defaults.');
    }
  });

  return panel;
}

/** Show an inline validation error on an input element */
function showError(input, message) {
  input.focus();
  input.setCustomValidity(message);
  input.reportValidity();
  input.addEventListener('input', () => input.setCustomValidity(''), { once: true });
}

/** Announce a message to screen-reader users via a live region */
function announceToScreenReader(message) {
  let region = document.getElementById('sr-announce');
  if (!region) {
    region = document.createElement('div');
    region.id = 'sr-announce';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';
    document.body.appendChild(region);
  }
  region.textContent = '';
  requestAnimationFrame(() => { region.textContent = message; });
}
