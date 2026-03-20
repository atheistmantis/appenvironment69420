import { loadRecipes, addRecipe, deleteRecipe, resetToDefaults } from './recipes.js';
import { RecipeCard } from './RecipeCard.js';
import { AdminPanel } from './AdminPanel.js';

/** @type {import('./recipes.js').Recipe[]} */
let recipes = loadRecipes();
let adminMode = false;

const root = document.getElementById('app');

// ── Build shell ──────────────────────────────────────────────────────────────

root.innerHTML = `
  <header class="app-header" role="banner">
    <div class="app-header__inner">
      <span class="app-header__logo" aria-hidden="true">🍽</span>
      <h1 class="app-header__title">Easy Recipes</h1>
      <button
        type="button"
        id="admin-toggle"
        class="app-header__admin-btn"
        aria-pressed="false"
        title="Toggle admin mode"
      >
        ⚙
      </button>
    </div>
  </header>

  <main id="main" class="container" role="main">
    <div id="recipe-grid" class="recipe-grid" aria-label="Recipe collection"></div>
  </main>

  <div id="admin-area"></div>
`;

// ── Admin mode toggle ────────────────────────────────────────────────────────

const adminToggle = document.getElementById('admin-toggle');
adminToggle.addEventListener('click', () => {
  adminMode = !adminMode;
  adminToggle.setAttribute('aria-pressed', String(adminMode));
  adminToggle.classList.toggle('app-header__admin-btn--active', adminMode);
  renderGrid();
  renderAdmin();
});

// ── Admin panel ──────────────────────────────────────────────────────────────

const adminArea = document.getElementById('admin-area');

function renderAdmin() {
  adminArea.innerHTML = '';
  if (!adminMode) return;

  const panel = AdminPanel(
    (data) => {
      recipes = addRecipe(recipes, data);
      renderGrid();
    },
    () => {
      recipes = resetToDefaults();
      renderGrid();
    }
  );
  adminArea.appendChild(panel);
}

// ── Recipe grid ───────────────────────────────────────────────────────────────

const grid = document.getElementById('recipe-grid');

function renderGrid() {
  grid.innerHTML = '';

  if (recipes.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'recipe-grid__empty';
    empty.textContent = 'No recipes yet. Use the admin panel to add some!';
    grid.appendChild(empty);
    return;
  }

  recipes.forEach((recipe) => {
    const card = RecipeCard(recipe, handleDelete, adminMode);
    grid.appendChild(card);
  });
}

function handleDelete(id) {
  recipes = deleteRecipe(recipes, id);
  renderGrid();
}

// ── Initial render ────────────────────────────────────────────────────────────

renderGrid();
renderAdmin();

// ── Service worker ────────────────────────────────────────────────────────────

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(import.meta.env.BASE_URL + 'service-worker.js');
}
