<template>
  <div class="favorites-page">
    <header class="favorites-page__header">
      <h1>❤️ Your Favorite Recipes</h1>
      <p>A collection of recipes you've saved.</p>
    </header>

    <div v-if="loading" class="favorites-page__status">Loading favorites...</div>
    <div v-else-if="favoriteRecipes.length === 0" class="favorites-page__status">
      You haven't saved any recipes yet. Start searching and add your favorites!
      <router-link to="/" class="favorites-page__link">Go to Search</router-link>
    </div>
    <div v-else class="favorites-page__content">
      <RecipeGrid :recipes="favoriteRecipes" />
      
      <div class="favorites-page__clear-actions">
        <button @click="clearFavorites" class="favorites-page__clear-btn">Clear All Favorites</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFavoritesStore } from '../stores/favorites';
import RecipeGrid from '../components/organisms/RecipeGrid/RecipeGrid.vue';

const favoritesStore = useFavoritesStore();

// Computed: Get the list of favorites directly from the store
const favoriteRecipes = computed(() => favoritesStore.favorites);
const loading = ref(false); // No API calls here, so loading is simple/false

/**
 * Action to clear all items from the favorites store (and localStorage).
 */
const clearFavorites = () => {
  if (confirm("Are you sure you want to clear all your saved favorites?")) {
    // Replace the favorites array with an empty one
    favoritesStore.$patch({ favorites: [] }); 
    alert("All favorites cleared!");
  }
};
</script>

<style lang="scss" scoped>
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  &__header {
    text-align: center;
    margin-bottom: 30px;
    h1 { color: #ff6347; }
  }

  &__status {
    text-align: center;
    padding: 50px;
    font-size: 1.2em;
    color: #666;
  }

  &__link {
    color: #4a90e2;
    text-decoration: none;
    font-weight: bold;
    margin-left: 10px;
    &:hover { text-decoration: underline; }
  }
  
  &__clear-actions {
    text-align: center;
    margin-top: 40px;
  }

  &__clear-btn {
    padding: 10px 20px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: darken(#e74c3c, 10%);
    }
  }
}
</style>