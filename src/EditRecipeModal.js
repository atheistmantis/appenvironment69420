/**
 * EditRecipeModal – a <dialog>-based modal for editing an existing recipe.
 *
 * @param {(id: string, data: {name:string, image:string, description:string}) => Promise<void>} onSave
 * @returns {{ dialog: HTMLDialogElement, open: (recipe: import('./recipes.js').Recipe) => void }}
 */
export function EditRecipeModal(onSave) {
  const dialog = document.createElement('dialog');
  dialog.className = 'edit-modal';
  dialog.setAttribute('aria-labelledby', 'edit-title');
  dialog.setAttribute('aria-modal', 'true');

  dialog.innerHTML = `
    <form class="edit-modal__form" novalidate>
      <h2 id="edit-title" class="edit-modal__title">Edit Recipe</h2>

      <div class="edit-modal__field">
        <label for="edit-name" class="edit-modal__label">Dish Name <span aria-hidden="true">*</span></label>
        <input
          id="edit-name"
          name="name"
          type="text"
          class="edit-modal__input"
          required
          autocomplete="off"
        />
      </div>

      <div class="edit-modal__field">
        <label for="edit-image" class="edit-modal__label">Image URL <span aria-hidden="true">*</span></label>
        <input
          id="edit-image"
          name="image"
          type="url"
          class="edit-modal__input"
          required
          autocomplete="off"
        />
        <p class="edit-modal__hint">Link to a photo of the dish (must start with http:// or https://)</p>
      </div>

      <div class="edit-modal__field">
        <label for="edit-desc" class="edit-modal__label">Short Description</label>
        <textarea
          id="edit-desc"
          name="description"
          class="edit-modal__input edit-modal__textarea"
          rows="3"
        ></textarea>
      </div>

      <p id="edit-error" class="edit-modal__error" role="alert" aria-live="polite"></p>

      <div class="edit-modal__actions">
        <button type="submit" class="big-btn edit-modal__save">Save Changes</button>
        <button type="button" class="edit-modal__cancel">Cancel</button>
      </div>
    </form>
  `;

  document.body.appendChild(dialog);

  const form = dialog.querySelector('.edit-modal__form');
  const nameInput = dialog.querySelector('#edit-name');
  const imageInput = dialog.querySelector('#edit-image');
  const descInput = dialog.querySelector('#edit-desc');
  const errorEl = dialog.querySelector('#edit-error');
  const cancelBtn = dialog.querySelector('.edit-modal__cancel');
  const saveBtn = dialog.querySelector('.edit-modal__save');

  let currentId = null;

  function setError(msg) {
    errorEl.textContent = msg;
  }

  function setLoading(loading) {
    saveBtn.disabled = loading;
    saveBtn.textContent = loading ? 'Saving…' : 'Save Changes';
  }

  function showFieldError(input, message) {
    input.focus();
    input.setCustomValidity(message);
    input.reportValidity();
    input.addEventListener('input', () => input.setCustomValidity(''), { once: true });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setError('');

    const name = nameInput.value.trim();
    const image = imageInput.value.trim();
    const description = descInput.value.trim();

    if (!name) {
      showFieldError(nameInput, 'Please enter a dish name.');
      return;
    }
    if (!image) {
      showFieldError(imageInput, 'Please enter an image URL.');
      return;
    }

    setLoading(true);
    try {
      await onSave(currentId, { name, image, description });
      dialog.close();
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  });

  cancelBtn.addEventListener('click', () => {
    setError('');
    dialog.close();
  });

  // Close on backdrop click
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      setError('');
      dialog.close();
    }
  });

  return {
    dialog,
    open(recipe) {
      currentId = recipe.id;
      nameInput.value = recipe.name;
      imageInput.value = recipe.image;
      descInput.value = recipe.description || '';
      setError('');
      dialog.showModal();
      nameInput.focus();
    },
  };
}
