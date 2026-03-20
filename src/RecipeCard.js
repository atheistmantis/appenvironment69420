/**
 * RecipeCard – renders a single large recipe card.
 * The card is a big rectangle with the recipe image as a background
 * and the recipe name prominently displayed on top of the image.
 *
 * @param {import('./recipes.js').Recipe} recipe
 * @param {(id: string) => void} onDelete  – called when admin deletes this card
 * @param {boolean} adminMode              – show delete button when true
 * @returns {HTMLElement}
 */
export function RecipeCard(recipe, onDelete, adminMode = false) {
  const card = document.createElement('article');
  card.className = 'recipe-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', recipe.name);

  // Background image
  card.style.backgroundImage = `url('${sanitizeUrl(recipe.image)}')`;

  // Overlay – sits on top of the image for name/description
  const overlay = document.createElement('div');
  overlay.className = 'recipe-card__overlay';

  const name = document.createElement('h2');
  name.className = 'recipe-card__name';
  name.textContent = recipe.name;

  overlay.appendChild(name);

  if (recipe.description) {
    const desc = document.createElement('p');
    desc.className = 'recipe-card__desc';
    desc.textContent = recipe.description;
    overlay.appendChild(desc);
  }

  card.appendChild(overlay);

  // Delete button (admin mode only)
  if (adminMode) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'recipe-card__delete';
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('aria-label', `Delete ${recipe.name}`);
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete "${recipe.name}"?`)) {
        onDelete(recipe.id);
      }
    });
    card.appendChild(deleteBtn);
  }

  return card;
}

/**
 * Very simple URL sanitiser – only allows http/https/data URLs.
 * Falls back to a CSS gradient placeholder on anything else.
 * @param {string} url
 * @returns {string}
 */
function sanitizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed) || /^data:image\//i.test(trimmed)) {
    return trimmed;
  }
  return '';
}
