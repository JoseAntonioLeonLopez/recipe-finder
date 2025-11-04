import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { RecipeSummary } from '../services/api';

// Local Storage Key
const LOCAL_STORAGE_KEY = 'recipe_favorites';

export const useFavoritesStore = defineStore('favorites', () => {
  // Retrieve initial state from localStorage
  const initialFavorites = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  const favorites = ref<RecipeSummary[]>(initialFavorites);

  // Watch the favorites state and update localStorage on change
  watch(favorites, (newFavorites) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newFavorites));
  }, { deep: true });

  /**
   * Adds a recipe to favorites.
   */
  function addFavorite(recipe: RecipeSummary): void {
    if (!isFavorite(recipe.id)) {
      favorites.value.push(recipe);
    }
  }

  /**
   * Removes a recipe from favorites by ID.
   */
  function removeFavorite(recipeId: number): void {
    favorites.value = favorites.value.filter(r => r.id !== recipeId);
  }

  /**
   * Checks if a recipe is already in favorites.
   */
  function isFavorite(recipeId: number): boolean {
    return favorites.value.some(r => r.id === recipeId);
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
});