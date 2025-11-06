<template>
  <div class="favorites-page">

    <!-- Hero Header -->
    <header class="favorites-page__hero">
      <div class="favorites-page__hero-content">
        <div class="favorites-page__icon-wrapper">
          <svg class="favorites-page__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 class="favorites-page__title">Your Favorite Recipes</h1>
        <p class="favorites-page__subtitle">
          {{ favoriteRecipes.length }} {{ favoriteRecipes.length === 1 ? 'recipe' : 'recipes' }} saved for later
        </p>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="favorites-page__state">
      <div class="favorites-page__loader">
        <div class="favorites-page__loader-spinner"></div>
        <p>Loading your favorites...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="favoriteRecipes.length === 0" class="favorites-page__state">
      <div class="favorites-page__empty">
        <div class="favorites-page__empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="favorites-page__empty-title">No Favorites Yet</h3>
        <p class="favorites-page__empty-message">
          Start exploring recipes and save your favorites by clicking the heart icon
        </p>
        <router-link to="/" class="favorites-page__empty-button">
          <svg class="favorites-page__empty-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Discover Recipes
        </router-link>
      </div>
    </div>

    <!-- Content with Favorites -->
    <div v-else class="favorites-page__content">

      <!-- Stats Bar -->
      <div class="favorites-page__stats">
        <div class="favorites-page__stat">
          <svg class="favorites-page__stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <div class="favorites-page__stat-content">
            <span class="favorites-page__stat-label">Total Recipes</span>
            <span class="favorites-page__stat-value">{{ favoriteRecipes.length }}</span>
          </div>
        </div>

        <button @click="clearFavorites" class="favorites-page__clear-btn">
          <svg class="favorites-page__clear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
      </div>

      <!-- Recipe Grid -->
      <RecipeGrid :recipes="favoriteRecipes" />
    </div>

    <!-- Confirmation Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="favorites-page__modal-overlay" @click="showModal = false">
        <div class="favorites-page__modal" @click.stop>
          <div class="favorites-page__modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="favorites-page__modal-title">Clear All Favorites?</h3>
          <p class="favorites-page__modal-message">
            This will remove all {{ favoriteRecipes.length }} saved {{ favoriteRecipes.length === 1 ? 'recipe' :
              'recipes' }}. This action cannot be undone.
          </p>
          <div class="favorites-page__modal-actions">
            <button @click="showModal = false" class="favorites-page__modal-btn favorites-page__modal-btn--cancel">
              Cancel
            </button>
            <button @click="confirmClear" class="favorites-page__modal-btn favorites-page__modal-btn--confirm">
              Clear All
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFavoritesStore } from '../stores/favorites';
import RecipeGrid from '../components/organisms/RecipeGrid/RecipeGrid.vue';

const favoritesStore = useFavoritesStore();

const favoriteRecipes = computed(() => favoritesStore.favorites);
const loading = ref(false);
const showModal = ref(false);

const clearFavorites = () => {
  showModal.value = true;
};

const confirmClear = () => {
  favoritesStore.$patch({ favorites: [] });
  showModal.value = false;
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/global.scss' as *;

.favorites-page {
  min-height: calc(100vh - 200px);
}

// Hero Section
.favorites-page__hero {
  padding: 3rem 2rem 2.5rem;
  margin-bottom: 2rem;

  @media (max-width: $breakpoint-md) {
    padding: 2.5rem 1.5rem 2rem;
  }
}

.favorites-page__hero-content {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}

.favorites-page__icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, $error 0%, #ff6b9d 100%);
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  animation: pulse 2s ease-in-out infinite;

  @media (max-width: $breakpoint-md) {
    width: 64px;
    height: 64px;
    padding: 1.25rem;
  }
}

.favorites-page__icon {
  width: 100%;
  height: 100%;
  color: white;
  fill: white;
}

.favorites-page__title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: $slate-900;
  margin-bottom: 0.75rem;
  line-height: 1.1;
}

.favorites-page__subtitle {
  font-size: $text-lg;
  color: $slate-600;
  font-weight: $font-medium;
  margin: 0;
}

// State Container
.favorites-page__state {
  max-width: 600px;
  margin: 4rem auto;
  padding: 0 2rem;

  @media (max-width: $breakpoint-md) {
    margin: 3rem auto;
    padding: 0 1.5rem;
  }
}

// Loading State
.favorites-page__loader {
  text-align: center;

  p {
    margin-top: 1.5rem;
    font-size: $text-lg;
    color: $slate-600;
    font-weight: $font-medium;
  }
}

.favorites-page__loader-spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto;
  border: 4px solid $slate-200;
  border-top-color: $error;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

// Empty State
.favorites-page__empty {
  background: white;
  border-radius: $radius-xl;
  padding: 4rem 2rem;
  text-align: center;
  border: 2px dashed $slate-200;
}

.favorites-page__empty-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba($error, 0.1) 0%, rgba($purple-500, 0.1) 100%);
  border-radius: $radius-xl;

  svg {
    width: 100%;
    height: 100%;
    color: $error;
    opacity: 0.4;
  }
}

.favorites-page__empty-title {
  font-size: $text-2xl;
  color: $slate-900;
  margin-bottom: 0.75rem;
}

.favorites-page__empty-message {
  color: $slate-600;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.favorites-page__empty-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, $primary-600 0%, $primary-500 100%);
  color: white;
  border-radius: $radius-lg;
  font-weight: $font-semibold;
  text-decoration: none;
  transition: all $transition-base;
  box-shadow: $shadow-md;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, $primary-500 0%, $purple-600 100%);
    opacity: 0;
    transition: opacity $transition-base;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }
}

.favorites-page__empty-button-icon {
  width: 20px;
  height: 20px;
  position: relative;
  z-index: 1;
}

// Content Section
.favorites-page__content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem 4rem;

  @media (max-width: $breakpoint-md) {
    padding: 0 1.5rem 3rem;
  }
}

// Stats Bar
.favorites-page__stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  border: 1px solid $slate-200;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    text-align: center;
  }
}

.favorites-page__stat {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.favorites-page__stat-icon {
  width: 40px;
  height: 40px;
  padding: 0.625rem;
  background: linear-gradient(135deg, $primary-50 0%, $purple-500 100%);
  border-radius: $radius-lg;
  color: $primary-600;
  flex-shrink: 0;
}

.favorites-page__stat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.favorites-page__stat-label {
  font-size: $text-sm;
  color: $slate-500;
  font-weight: $font-medium;
}

.favorites-page__stat-value {
  font-size: $text-2xl;
  color: $slate-900;
  font-weight: $font-bold;
  line-height: 1;
}

// Clear Button
.favorites-page__clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid $slate-300;
  border-radius: $radius-lg;
  font-size: $text-sm;
  font-weight: $font-semibold;
  color: $slate-700;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    background: $error;
    border-color: $error;
    color: white;
    transform: translateY(-2px);
    box-shadow: $shadow-md;

    .favorites-page__clear-icon {
      color: white;
    }
  }

  &:active {
    transform: translateY(0);
  }
}

.favorites-page__clear-icon {
  width: 18px;
  height: 18px;
  color: $slate-500;
  transition: color $transition-base;
}

// Modal
.favorites-page__modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba($slate-900, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.favorites-page__modal {
  background: white;
  border-radius: $radius-xl;
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  box-shadow: $shadow-xl;
  animation: modalBounce 0.3s ease;
}

.favorites-page__modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  padding: 1.25rem;
  background: rgba($warning, 0.1);
  border-radius: $radius-xl;

  svg {
    width: 100%;
    height: 100%;
    color: $warning;
  }
}

.favorites-page__modal-title {
  font-size: $text-xl;
  color: $slate-900;
  margin-bottom: 0.75rem;
  text-align: center;
}

.favorites-page__modal-message {
  color: $slate-600;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.favorites-page__modal-actions {
  display: flex;
  gap: 0.75rem;
}

.favorites-page__modal-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: $radius-lg;
  font-size: $text-base;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: all $transition-base;

  &--cancel {
    background: $slate-100;
    color: $slate-700;

    &:hover {
      background: $slate-200;
    }
  }

  &--confirm {
    background: $error;
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-md;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// Animations
@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    box-shadow: $shadow-lg;
  }

  50% {
    transform: scale(1.05);
    box-shadow: $shadow-xl;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes modalBounce {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }

  50% {
    transform: scale(1.02);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// Modal Transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition-slow;

  .favorites-page__modal {
    transition: transform $transition-slow;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .favorites-page__modal {
    transform: scale(0.9);
  }
}
</style>