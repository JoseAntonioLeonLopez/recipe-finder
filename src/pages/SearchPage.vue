<template>
  <div class="search-page">
    <!-- Hero Section -->
    <header class="search-page__hero">
      <div class="search-page__hero-content">
        <div class="search-page__badge">
          <svg class="search-page__badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span>Discover Your Next Meal</span>
        </div>
        <h1 class="search-page__title">
          Find the Perfect
          <span class="search-page__title-gradient">Recipe</span>
        </h1>
        <p class="search-page__subtitle">
          Explore thousands of recipes with intelligent filters and personalized recommendations
        </p>
      </div>
    </header>

    <!-- Search Form -->
    <div class="search-page__search-container">
      <SearchForm @search="handleSearch" class="search-page__form" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="search-page__state">
      <div class="search-page__loader">
        <div class="search-page__loader-spinner"></div>
        <p class="search-page__loader-text">Searching delicious recipes...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="search-page__state">
      <div class="search-page__error">
        <svg class="search-page__error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="search-page__error-title">Oops! Something went wrong</h3>
        <p class="search-page__error-message">{{ error }}</p>
        <button @click="handleRetry" class="search-page__error-button">
          Try Again
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="recipes.length > 0" class="search-page__results">
      <div class="search-page__results-header">
        <h2 class="search-page__results-title">
          <span class="search-page__results-count">{{ totalResults.toLocaleString() }}</span>
          {{ totalResults === 1 ? 'Recipe' : 'Recipes' }} Found
        </h2>
        <p class="search-page__results-subtitle">
          Showing {{ ((currentPage - 1) * recipesPerPage) + 1 }}-{{ Math.min(currentPage * recipesPerPage, totalResults)
          }} of {{ totalResults.toLocaleString() }}
        </p>
      </div>

      <RecipeGrid :recipes="recipes" />

      <div class="search-page__pagination-wrapper">
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="handlePageChange" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="search-page__state">
      <div class="search-page__empty">
        <div class="search-page__empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="search-page__empty-title">Ready to Cook?</h3>
        <p class="search-page__empty-message">
          Use the search above to discover amazing recipes tailored to your taste
        </p>
        <div class="search-page__empty-suggestions">
          <span class="search-page__empty-label">Try searching for:</span>
          <div class="search-page__empty-tags">
            <button @click="quickSearch('burger')" class="search-page__empty-tag">Burger</button>
            <button @click="quickSearch('pizza')" class="search-page__empty-tag">Pizza</button>
            <button @click="quickSearch('pork')" class="search-page__empty-tag">Pork</button>
            <button @click="quickSearch('fish')" class="search-page__empty-tag">Fish</button>
            <button @click="quickSearch('pasta')" class="search-page__empty-tag">Pasta</button>
            <button @click="quickSearch('chicken')" class="search-page__empty-tag">Chicken</button>
            <button @click="quickSearch('salad')" class="search-page__empty-tag">Salad</button>
            <button @click="quickSearch('dessert')" class="search-page__empty-tag">Dessert</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RecipeService, type SearchParams } from '../services/api';
import SearchForm from '../components/organisms/SearchForm/SearchForm.vue';
import RecipeGrid from '../components/organisms/RecipeGrid/RecipeGrid.vue';
import Pagination from '../components/molecules/Pagination/Pagination.vue';
import { storeToRefs } from 'pinia';
import { useRecipeSearchStore } from '@/stores/recipeSearch';

const store = useRecipeSearchStore();
const { recipes, loading, totalResults, currentPage } = storeToRefs(store);

const error = ref<string | null>(null);
const recipesPerPage = 12;
let lastSearchParams: SearchParams = { query: '' };

const totalPages = computed(() => Math.ceil(totalResults.value / recipesPerPage));

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

const handleSearch = (params: SearchParams) => {
  currentPage.value = 1;
  performSearch(params);
};

const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    performSearch(lastSearchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleRetry = () => {
  if (lastSearchParams.query) {
    performSearch(lastSearchParams);
  }
};

const quickSearch = (query: string) => {
  currentPage.value = 1;
  performSearch({ query });
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/global.scss' as *;

.search-page {
  min-height: calc(100vh - 200px);
}

// Hero Section
.search-page__hero {
  padding: 4rem 2rem 3rem;
  margin-bottom: 2rem;

  @media (max-width: $breakpoint-md) {
    padding: 3rem 1.5rem 2rem;
  }
}

.search-page__hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.search-page__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: $radius-full;
  box-shadow: $shadow-sm;
  font-size: $text-sm;
  font-weight: $font-medium;
  color: $primary-600;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s ease;
}

.search-page__badge-icon {
  width: 16px;
  height: 16px;
  animation: sparkle 2s ease-in-out infinite;
}

.search-page__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: $slate-900;
  margin-bottom: 1rem;
  line-height: 1.1;
  animation: fadeInUp 0.6s ease 0.1s both;
}

.search-page__title-gradient {
  display: block;
  background: linear-gradient(135deg, $primary-600 0%, $purple-600 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-page__subtitle {
  font-size: $text-lg;
  color: $slate-600;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  animation: fadeInUp 0.6s ease 0.2s both;
}

// Search Container
.search-page__search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
  animation: fadeInUp 0.6s ease 0.3s both;

  @media (max-width: $breakpoint-md) {
    padding: 0 1.5rem 2rem;
  }
}

// State Containers
.search-page__state {
  max-width: 600px;
  margin: 4rem auto;
  padding: 0 2rem;

  @media (max-width: $breakpoint-md) {
    margin: 3rem auto;
    padding: 0 1.5rem;
  }
}

// Loading State
.search-page__loader {
  text-align: center;
}

.search-page__loader-spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto 1.5rem;
  border: 4px solid $slate-200;
  border-top-color: $primary-500;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.search-page__loader-text {
  font-size: $text-lg;
  color: $slate-600;
  font-weight: $font-medium;
}

// Error State
.search-page__error {
  background: white;
  border-radius: $radius-xl;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: $shadow-md;
  border: 1px solid $slate-200;
}

.search-page__error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  color: $error;
}

.search-page__error-title {
  font-size: $text-2xl;
  color: $slate-900;
  margin-bottom: 0.75rem;
}

.search-page__error-message {
  color: $slate-600;
  margin-bottom: 2rem;
}

.search-page__error-button {
  padding: 0.75rem 2rem;
  background: $primary-500;
  color: white;
  border-radius: $radius-lg;
  font-weight: $font-semibold;
  transition: all $transition-base;
  box-shadow: $shadow-sm;

  &:hover {
    background: $primary-600;
    transform: translateY(-1px);
    box-shadow: $shadow-md;
  }

  &:active {
    transform: translateY(0);
  }
}

// Results
.search-page__results {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  animation: fadeIn 0.4s ease;

  @media (max-width: $breakpoint-md) {
    padding: 0 1.5rem 3rem;
  }
}

.search-page__results-header {
  text-align: center;
  margin-bottom: 3rem;
}

.search-page__results-title {
  font-size: $text-3xl;
  color: $slate-900;
  margin-bottom: 0.5rem;

  @media (max-width: $breakpoint-md) {
    font-size: $text-2xl;
  }
}

.search-page__results-count {
  color: $primary-600;
  font-weight: 800;
}

.search-page__results-subtitle {
  font-size: $text-base;
  color: $slate-500;
  font-weight: $font-medium;
}

.search-page__pagination-wrapper {
  margin-top: 4rem;
}

// Empty State
.search-page__empty {
  background: white;
  border-radius: $radius-xl;
  padding: 4rem 2rem;
  text-align: center;
  border: 2px dashed $slate-200;
}

.search-page__empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, $primary-50 0%, $purple-500 100%);
  border-radius: $radius-xl;

  svg {
    width: 100%;
    height: 100%;
    color: $primary-500;
  }
}

.search-page__empty-title {
  font-size: $text-2xl;
  color: $slate-900;
  margin-bottom: 0.75rem;
}

.search-page__empty-message {
  color: $slate-600;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.search-page__empty-suggestions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.search-page__empty-label {
  font-size: $text-sm;
  font-weight: $font-medium;
  color: $slate-500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.search-page__empty-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.search-page__empty-tag {
  padding: 0.625rem 1.25rem;
  background: $slate-50;
  border: 1px solid $slate-200;
  border-radius: $radius-lg;
  font-size: $text-sm;
  font-weight: $font-medium;
  color: $slate-700;
  transition: all $transition-base;

  &:hover {
    background: $primary-50;
    border-color: $primary-200;
    color: $primary-700;
    transform: translateY(-2px);
    box-shadow: $shadow-sm;
  }

  &:active {
    transform: translateY(0);
  }
}

// Animations
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes sparkle {

  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }

  50% {
    transform: scale(1.1) rotate(180deg);
  }
}
</style>