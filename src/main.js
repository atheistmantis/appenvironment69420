import { loadRecipes, addRecipe, updateRecipe, deleteRecipe, resetToDefaults } from './recipes.js';
import { RecipeCard } from './RecipeCard.js';
import { AdminPanel } from './AdminPanel.js';
import { LoginModal } from './LoginModal.js';
import { EditRecipeModal } from './EditRecipeModal.js';
import { getSession, signOut, onAuthStateChange } from './auth.js';
import { isSupabaseConfigured } from './supabase.js';

/** @type {import('./recipes.js').Recipe[]} */
let recipes = [];
let adminMode = false;
let isAuthenticated = false;

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

// ── Edit recipe modal ────────────────────────────────────────────────────────

const editModal = EditRecipeModal(async (id, data) => {
  recipes = await updateRecipe(id, data);
  renderGrid();
});

// ── Login modal (only when Supabase is configured) ───────────────────────────

let loginModal = null;
if (isSupabaseConfigured) {
  loginModal = LoginModal(() => {
    // Auth state change listener handles the rest
  });
}

// ── Admin mode toggle ────────────────────────────────────────────────────────

const adminToggle = document.getElementById('admin-toggle');
adminToggle.addEventListener('click', () => {
  if (isSupabaseConfigured && !isAuthenticated) {
    // Open login modal instead of toggling admin mode
    loginModal.open();
    return;
  }
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
    async (data) => {
      recipes = await addRecipe(data);
      renderGrid();
    },
    async () => {
      recipes = await resetToDefaults();
      renderGrid();
    },
    async () => {
      await signOut();
      // auth state change listener handles UI reset
    },
    isAuthenticated,
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
    const card = RecipeCard(
      recipe,
      async (id) => {
        recipes = await deleteRecipe(id);
        renderGrid();
      },
      adminMode,
      (r) => editModal.open(r),
    );
    grid.appendChild(card);
  });
}

// ── Loading state ─────────────────────────────────────────────────────────────

function showLoading() {
  grid.innerHTML = '<p class="recipe-grid__loading" aria-live="polite">Loading recipes…</p>';
}

// ── Auth state management ─────────────────────────────────────────────────────

function setAuth(session) {
  isAuthenticated = Boolean(session);
  if (isAuthenticated) {
    adminMode = true;
  } else {
    adminMode = false;
  }
  adminToggle.setAttribute('aria-pressed', String(adminMode));
  adminToggle.classList.toggle('app-header__admin-btn--active', adminMode);
  renderGrid();
  renderAdmin();
}

// ── Initialise ────────────────────────────────────────────────────────────────

async function init() {
  showLoading();

  let initialSession = null;
  if (isSupabaseConfigured) {
    initialSession = await getSession();

    // Subscribe to future auth changes (login / logout)
    onAuthStateChange((_event, session) => {
      setAuth(session);
    });
  }

  recipes = await loadRecipes();

  if (isSupabaseConfigured) {
    // setAuth updates isAuthenticated, adminMode, toggle button, grid, and panel
    setAuth(initialSession);
  } else {
    renderGrid();
    renderAdmin();
  }
}

init();

// ── Service worker ────────────────────────────────────────────────────────────

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(import.meta.env.BASE_URL + 'service-worker.js');
}
