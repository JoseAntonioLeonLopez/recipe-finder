<template>
  <div class="detail-page" v-if="recipe">

    <!-- Header with Back Button -->
    <header class="detail-page__header">
      <button @click="router.back()" class="detail-page__back-button">
        <svg class="detail-page__back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>

      <div class="detail-page__header-content">
        <h1 class="detail-page__title">{{ recipe.title }}</h1>

        <!-- Favorite Button -->
        <button @click="toggleFavorite"
          :class="['detail-page__favorite-btn', { 'detail-page__favorite-btn--active': isFav }]">
          <svg class="detail-page__favorite-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{{ isFav ? 'Saved' : 'Save' }}</span>
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="detail-page__state">
      <div class="detail-page__loader">
        <div class="detail-page__loader-spinner"></div>
        <p>Loading recipe details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="detail-page__state">
      <div class="detail-page__error">
        <svg class="detail-page__error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3>Oops! Something went wrong</h3>
        <p>{{ error }}</p>
        <button @click="fetchRecipe(parseInt(props.id))" class="detail-page__retry-btn">
          Try Again
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="detail-page__content">

      <!-- Hero Image -->
      <figure class="detail-page__hero">
        <img :src="recipe.image" :alt="recipe.title" class="detail-page__hero-image" loading="lazy" />
        <div class="detail-page__hero-overlay"></div>
        <figcaption v-if="recipe.sourceName" class="detail-page__source">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Source: {{ recipe.sourceName }}
        </figcaption>
      </figure>

      <!-- Quick Stats Grid -->
      <div class="detail-page__stats">
        <div class="detail-page__stat">
          <div class="detail-page__stat-icon detail-page__stat-icon--time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="detail-page__stat-content">
            <span class="detail-page__stat-label">Ready in</span>
            <span class="detail-page__stat-value">{{ recipe.readyInMinutes }} min</span>
          </div>
        </div>

        <div class="detail-page__stat">
          <div class="detail-page__stat-icon detail-page__stat-icon--servings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="detail-page__stat-content">
            <span class="detail-page__stat-label">Servings</span>
            <span class="detail-page__stat-value">{{ recipe.servings }}</span>
          </div>
        </div>

        <div v-if="recipe.pricePerServing" class="detail-page__stat">
          <div class="detail-page__stat-icon detail-page__stat-icon--price">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="detail-page__stat-content">
            <span class="detail-page__stat-label">Cost per serving</span>
            <span class="detail-page__stat-value">${{ (recipe.pricePerServing / 100).toFixed(2) }}</span>
          </div>
        </div>

        <div v-if="recipe.diets && recipe.diets.length" class="detail-page__stat detail-page__stat--full">
          <div class="detail-page__stat-icon detail-page__stat-icon--diet">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="detail-page__stat-content">
            <span class="detail-page__stat-label">Dietary Info</span>
            <div class="detail-page__diet-tags">
              <span v-for="diet in recipe.diets" :key="diet" class="detail-page__diet-tag">
                {{ diet }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="detail-page__grid">

        <!-- Left Column: Ingredients -->
        <aside class="detail-page__sidebar">
          <section class="detail-page__card">
            <div class="detail-page__card-header">
              <svg class="detail-page__card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h2>Ingredients</h2>
              <span class="detail-page__card-count">{{ recipe.extendedIngredients?.length || 0 }}</span>
            </div>
            <ul class="detail-page__ingredient-list">
              <li v-for="ing in recipe.extendedIngredients" :key="ing.id" class="detail-page__ingredient-item">
                <div class="detail-page__ingredient-checkbox"></div>
                <div class="detail-page__ingredient-content">
                  <span class="detail-page__ingredient-amount">{{ ing.amount }} {{ ing.unit }}</span>
                  <span class="detail-page__ingredient-name">{{ ing.nameClean }}</span>
                </div>
              </li>
            </ul>
          </section>
        </aside>

        <!-- Right Column: Instructions & Summary -->
        <main class="detail-page__main">

          <!-- Instructions -->
          <section class="detail-page__card">
            <div class="detail-page__card-header">
              <svg class="detail-page__card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2>Instructions</h2>
            </div>
            <div v-html="recipe.instructions || 'No detailed instructions available.'"
              class="detail-page__text-content">
            </div>
          </section>

          <!-- Summary -->
          <section class="detail-page__card">
            <div class="detail-page__card-header">
              <svg class="detail-page__card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2>About This Recipe</h2>
            </div>
            <div v-html="recipe.summary" class="detail-page__text-content"></div>
          </section>

        </main>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { RecipeService } from '../services/api';
import { useFavoritesStore } from '../stores/favorites';

const props = defineProps<{
  id: string
}>();

const router = useRouter();
const favoritesStore = useFavoritesStore();

const recipe = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const isFav = computed(() => {
  if (!recipe.value) return false;
  return favoritesStore.isFavorite(recipe.value.id);
});

const toggleFavorite = () => {
  if (!recipe.value) return;

  const summary = {
    id: recipe.value.id,
    title: recipe.value.title,
    image: recipe.value.image,
    imageType: 'jpg',
  };

  if (isFav.value) {
    favoritesStore.removeFavorite(recipe.value.id);
  } else {
    favoritesStore.addFavorite(summary);
  }
};

const fetchRecipe = async (recipeId: number) => {
  loading.value = true;
  error.value = null;

  try {
    const data = await RecipeService.getRecipeDetails(recipeId);
    recipe.value = data;
  } catch (err: any) {
    error.value = 'Failed to load recipe details. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const recipeId = parseInt(props.id);
  if (isNaN(recipeId)) {
    error.value = 'Invalid recipe ID.';
    loading.value = false;
    return;
  }
  fetchRecipe(recipeId);
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/global.scss' as *;

.detail-page {
  min-height: calc(100vh - 200px);
  padding-bottom: 4rem;
}

// Header
.detail-page__header {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 2rem 1rem;

  @media (max-width: $breakpoint-md) {
    padding: 1.5rem 1.5rem 1rem;
  }
}

.detail-page__back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  border: 1px solid $slate-200;
  border-radius: $radius-lg;
  font-size: $text-sm;
  font-weight: $font-medium;
  color: $slate-700;
  cursor: pointer;
  transition: all $transition-base;
  margin-bottom: 1.5rem;

  &:hover {
    border-color: $primary-300;
    color: $primary-700;
    transform: translateX(-4px);
    box-shadow: $shadow-sm;
  }
}

.detail-page__back-icon {
  width: 18px;
  height: 18px;
}

.detail-page__header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
    gap: 1.5rem;
  }
}

.detail-page__title {
  flex: 1;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: $slate-900;
  line-height: 1.2;
  margin: 0;
}

// Favorite Button
.detail-page__favorite-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem;
  background: white;
  border: 2px solid $slate-300;
  border-radius: $radius-full;
  font-size: $text-sm;
  font-weight: $font-semibold;
  color: $slate-700;
  cursor: pointer;
  transition: all $transition-base;
  flex-shrink: 0;

  &:hover {
    border-color: $error;
    color: $error;
    transform: scale(1.05);

    .detail-page__favorite-icon {
      color: $error;
      fill: $error;
    }
  }

  &--active {
    background: $error;
    border-color: $error;
    color: white;

    .detail-page__favorite-icon {
      color: white;
      fill: white;
    }
  }
}

.detail-page__favorite-icon {
  width: 20px;
  height: 20px;
  transition: all $transition-base;
}

// State Container
.detail-page__state {
  max-width: 600px;
  margin: 4rem auto;
  padding: 0 2rem;
}

// Loading
.detail-page__loader {
  text-align: center;

  p {
    margin-top: 1.5rem;
    font-size: $text-lg;
    color: $slate-600;
    font-weight: $font-medium;
  }
}

.detail-page__loader-spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto;
  border: 4px solid $slate-200;
  border-top-color: $primary-500;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

// Error
.detail-page__error {
  background: white;
  border-radius: $radius-xl;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: $shadow-md;
  border: 1px solid $slate-200;

  h3 {
    font-size: $text-2xl;
    color: $slate-900;
    margin: 1.5rem 0 0.75rem;
  }

  p {
    color: $slate-600;
    margin-bottom: 2rem;
  }
}

.detail-page__error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto;
  color: $error;
}

.detail-page__retry-btn {
  padding: 0.75rem 2rem;
  background: $primary-500;
  color: white;
  border: none;
  border-radius: $radius-lg;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    background: $primary-600;
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }
}

// Content
.detail-page__content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: $breakpoint-md) {
    padding: 0 1.5rem;
  }
}

// Hero Image
.detail-page__hero {
  position: relative;
  width: 100%;
  height: 500px;
  margin: 0 0 3rem;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: $shadow-xl;

  @media (max-width: $breakpoint-md) {
    height: 400px;
    margin-bottom: 2rem;
  }

  @media (max-width: $breakpoint-sm) {
    height: 300px;
  }
}

.detail-page__hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  .detail-page__hero:hover & {
    transform: scale(1.05);
  }
}

.detail-page__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba($slate-900, 0.4) 0%, transparent 50%);
}

.detail-page__source {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: $radius-lg;
  font-size: $text-sm;
  font-weight: $font-medium;
  color: $slate-700;
  margin: 0;

  svg {
    width: 16px;
    height: 16px;
    color: $slate-500;
    flex-shrink: 0;
  }
}

// Stats Grid
.detail-page__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.detail-page__stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid $slate-200;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  transition: all $transition-base;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
    border-color: $primary-200;
  }

  &--full {
    grid-column: 1 / -1;
  }
}

.detail-page__stat-icon {
  width: 48px;
  height: 48px;
  padding: 0.875rem;
  border-radius: $radius-lg;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  &--time {
    background: linear-gradient(135deg, rgba($primary-500, 0.1) 0%, rgba($primary-600, 0.1) 100%);
    color: $primary-600;
  }

  &--servings {
    background: linear-gradient(135deg, rgba($purple-500, 0.1) 0%, rgba($purple-600, 0.1) 100%);
    color: $purple-600;
  }

  &--price {
    background: linear-gradient(135deg, rgba($success, 0.1) 0%, rgba($success, 0.15) 100%);
    color: $success;
  }

  &--diet {
    background: linear-gradient(135deg, rgba($warning, 0.1) 0%, rgba($warning, 0.15) 100%);
    color: $warning;
  }
}

.detail-page__stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.detail-page__stat-label {
  font-size: $text-sm;
  color: $slate-500;
  font-weight: $font-medium;
}

.detail-page__stat-value {
  font-size: $text-xl;
  color: $slate-900;
  font-weight: $font-bold;
  line-height: 1;
}

.detail-page__diet-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.detail-page__diet-tag {
  padding: 0.375rem 0.875rem;
  background: $warning;
  color: white;
  border-radius: $radius-full;
  font-size: $text-xs;
  font-weight: $font-semibold;
  text-transform: capitalize;
}

// Main Content Grid
.detail-page__grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2rem;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

// Card Component
.detail-page__card {
  background: white;
  border: 1px solid $slate-200;
  border-radius: $radius-xl;
  padding: 2rem;
  box-shadow: $shadow-sm;
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: $breakpoint-md) {
    padding: 1.5rem;
  }
}

.detail-page__card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid $slate-100;

  h2 {
    flex: 1;
    font-size: $text-xl;
    font-weight: $font-bold;
    color: $slate-900;
    margin: 0;
  }
}

.detail-page__card-icon {
  width: 24px;
  height: 24px;
  color: $primary-600;
  flex-shrink: 0;
}

.detail-page__card-count {
  padding: 0.25rem 0.75rem;
  background: $primary-50;
  color: $primary-700;
  border-radius: $radius-full;
  font-size: $text-sm;
  font-weight: $font-semibold;
}

// Ingredients List
.detail-page__ingredient-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.detail-page__ingredient-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 0.875rem;
  background: $slate-50;
  border-radius: $radius-lg;
  transition: all $transition-base;
  cursor: pointer;

  &:hover {
    background: $primary-50;
    transform: translateX(4px);
  }
}

.detail-page__ingredient-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid $slate-300;
  border-radius: 6px;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all $transition-base;

  .detail-page__ingredient-item:hover & {
    border-color: $primary-500;
  }
}

.detail-page__ingredient-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.detail-page__ingredient-amount {
  font-size: $text-sm;
  font-weight: $font-semibold;
  color: $primary-600;
}

.detail-page__ingredient-name {
  font-size: $text-base;
  color: $slate-700;
  text-transform: capitalize;
}

// Text Content (HTML from API)
.detail-page__text-content {
  color: $slate-700;
  line-height: 1.8;

  :deep(p) {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(a) {
    color: $primary-600;
    font-weight: $font-medium;

    &:hover {
      color: $primary-700;
      text-decoration: underline;
    }
  }

  :deep(b),
  :deep(strong) {
    color: $slate-900;
    font-weight: $font-semibold;
  }

  :deep(ol),
  :deep(ul) {
    margin-left: 1.5rem;
    margin-bottom: 1rem;

    li {
      margin-bottom: 0.5rem;
    }
  }
}

// Animations
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>