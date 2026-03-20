/**
 * Recipe data store.
 * Default template recipes are seeded on first load.
 * All changes are persisted to localStorage so the admin's additions survive page refreshes.
 */

const STORAGE_KEY = 'nrea_recipes';

/** @typedef {{ id: string, name: string, image: string, description: string }} Recipe */

/** Default template recipes shown immediately when the app first opens */
const DEFAULT_RECIPES = [
  {
    id: 'tpl-1',
    name: 'Spaghetti Bolognese',
    image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&q=80',
    description: 'Classic Italian pasta with rich meat sauce.',
  },
  {
    id: 'tpl-2',
    name: 'Chicken Curry',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    description: 'Aromatic chicken curry with creamy sauce.',
  },
  {
    id: 'tpl-3',
    name: 'Caesar Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    description: 'Crisp romaine lettuce with Caesar dressing.',
  },
  {
    id: 'tpl-4',
    name: 'Pancakes',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    description: 'Fluffy American pancakes with maple syrup.',
  },
  {
    id: 'tpl-5',
    name: 'Grilled Salmon',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    description: 'Perfectly grilled salmon fillet with herbs.',
  },
  {
    id: 'tpl-6',
    name: 'Vegetable Stir Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
    description: 'Colourful vegetables tossed in savoury sauce.',
  },
];

/**
 * Load recipes from localStorage, falling back to the default templates.
 * @returns {Recipe[]}
 */
export function loadRecipes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return [...DEFAULT_RECIPES];
}

/**
 * Persist the recipes array to localStorage.
 * @param {Recipe[]} recipes
 */
export function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

/**
 * Add a new recipe and save.
 * @param {Recipe[]} recipes
 * @param {{ name: string, image: string, description: string }} data
 * @returns {Recipe[]} updated list
 */
export function addRecipe(recipes, data) {
  const recipe = {
    id: 'r-' + Date.now(),
    name: data.name.trim(),
    image: data.image.trim(),
    description: (data.description || '').trim(),
  };
  const updated = [...recipes, recipe];
  saveRecipes(updated);
  return updated;
}

/**
 * Delete a recipe by id and save.
 * @param {Recipe[]} recipes
 * @param {string} id
 * @returns {Recipe[]} updated list
 */
export function deleteRecipe(recipes, id) {
  const updated = recipes.filter(r => r.id !== id);
  saveRecipes(updated);
  return updated;
}

/**
 * Reset all recipes back to the built-in defaults and save.
 * @returns {Recipe[]}
 */
export function resetToDefaults() {
  const recipes = [...DEFAULT_RECIPES];
  saveRecipes(recipes);
  return recipes;
}
