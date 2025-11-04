<template>
  <div class="search-page">
    <header class="search-page__header">
      <h1>🍽️ Recipe Finder</h1>
      <p>Search over thousands of recipes with advanced filters.</p>
    </header>

    <SearchForm @search="handleSearch" class="search-page__form" /> 

    <div v-if="loading" class="search-page__status">Loading recipes...</div>
    <div v-else-if="error" class="search-page__status search-page__status--error">{{ error }}</div>
    <div v-else-if="recipes.length > 0" class="search-page__results">
      <h2>Found {{ totalResults }} Recipes</h2>
      
      <RecipeGrid :recipes="recipes" /> 

      <Pagination 
        :currentPage="currentPage" 
        :totalPages="totalPages" 
        @page-change="handlePageChange" 
      />
    </div>
    <div v-else class="search-page__status">
      Start by searching for a recipe!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RecipeService, type SearchParams } from '../services/api';
// Assuming you've created these components
import SearchForm from '../components/organisms/SearchForm/SearchForm.vue';
import RecipeGrid from '../components/organisms/RecipeGrid/RecipeGrid.vue'; 
import Pagination from '../components/molecules/Pagination/Pagination.vue'; 

import { storeToRefs } from 'pinia'; // Ensure this is imported
import { useRecipeSearchStore } from '@/stores/recipeSearch';

const store = useRecipeSearchStore();
const { recipes, loading, totalResults, currentPage } = storeToRefs(store);

// State
const error = ref<string | null>(null);
const recipesPerPage = 12; // Matches number in RecipeService
let lastSearchParams: SearchParams = { query: '' }; // Store last successful search parameters

// Pagination Logic
const totalPages = computed(() => Math.ceil(totalResults.value / recipesPerPage));

// Search Handler
async function performSearch(params: SearchParams) {
  loading.value = true;
  error.value = null;
  recipes.value = [];
  lastSearchParams = params;

  try {
    const offset = (currentPage.value - 1) * recipesPerPage;
    
    const result = await RecipeService.searchRecipes({
      ...params,
      offset,
      number: recipesPerPage,
    });
    
    recipes.value = result.results;
    totalResults.value = result.totalResults;
    
  } catch (err: unknown) {
    error.value = err.message || 'An unknown error occurred during the search.';
    totalResults.value = 0;
  } finally {
    loading.value = false;
  }
}

// Initial search call from the form
const handleSearch = (params: SearchParams) => {
  currentPage.value = 1; // Reset to first page for a new search
  performSearch(params);
};

// Pagnation change call
const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    // Re-run the search with the same parameters, but new offset
    performSearch(lastSearchParams); 
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }
};
</script>

<style lang="scss" scoped>
.search-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  &__header {
    text-align: center;
    margin-bottom: 30px;
    h1 { color: #ff6347; } /* Coherent color palette */
  }

  &__status {
    text-align: center;
    padding: 30px;
    font-size: 1.2em;
    color: #666;
    &--error {
      color: #e74c3c;
      font-weight: bold;
    }
  }

  &__results {
    margin-top: 40px;
    h2 { 
      text-align: center;
      margin-bottom: 20px;
      color: #333;
    }
  }
}
</style>