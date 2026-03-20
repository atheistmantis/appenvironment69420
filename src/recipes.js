/**
 * Recipe data store.
 * Uses Supabase when configured, falls back to localStorage so the app
 * continues to work without any backend setup.
 */

import { supabase, isSupabaseConfigured } from './supabase.js';

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

// ── localStorage helpers (used as fallback) ──────────────────────────────────

function loadFromStorage() {
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

function saveToStorage(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Load all recipes from Supabase (or localStorage if not configured).
 * Returns defaults if the data store is empty.
 * @returns {Promise<Recipe[]>}
 */
export async function loadRecipes() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to load recipes from Supabase:', error);
      return loadFromStorage();
    }
    return data.length > 0 ? data : [...DEFAULT_RECIPES];
  }
  return loadFromStorage();
}

/**
 * Add a new recipe.
 * @param {{ name: string, image: string, description: string }} data
 * @returns {Promise<Recipe[]>} updated list
 */
export async function addRecipe(data) {
  const recipe = {
    id: 'r-' + Date.now(),
    name: data.name.trim(),
    image: data.image.trim(),
    description: (data.description || '').trim(),
  };

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('recipes').insert(recipe);
    if (error) throw error;
    return loadRecipes();
  }

  const recipes = loadFromStorage();
  const updated = [...recipes, recipe];
  saveToStorage(updated);
  return updated;
}

/**
 * Update an existing recipe by id.
 * @param {string} id
 * @param {{ name: string, image: string, description: string }} data
 * @returns {Promise<Recipe[]>} updated list
 */
export async function updateRecipe(id, data) {
  const updates = {
    name: data.name.trim(),
    image: data.image.trim(),
    description: (data.description || '').trim(),
  };

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('recipes').update(updates).eq('id', id);
    if (error) throw error;
    return loadRecipes();
  }

  const recipes = loadFromStorage();
  const updated = recipes.map((r) => (r.id === id ? { ...r, ...updates } : r));
  saveToStorage(updated);
  return updated;
}

/**
 * Delete a recipe by id.
 * @param {string} id
 * @returns {Promise<Recipe[]>} updated list
 */
export async function deleteRecipe(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) throw error;
    return loadRecipes();
  }

  const recipes = loadFromStorage();
  const updated = recipes.filter((r) => r.id !== id);
  saveToStorage(updated);
  return updated;
}

/**
 * Reset all recipes back to the built-in defaults.
 * @returns {Promise<Recipe[]>}
 */
export async function resetToDefaults() {
  const defaults = [...DEFAULT_RECIPES];

  if (isSupabaseConfigured) {
    // Delete all existing recipes then re-insert defaults
    const { error: delError } = await supabase.from('recipes').delete().neq('id', '');
    if (delError) throw delError;
    const { error: insError } = await supabase.from('recipes').insert(defaults);
    if (insError) throw insError;
    return loadRecipes();
  }

  saveToStorage(defaults);
  return defaults;
}
