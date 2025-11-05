<template>
  <form @submit.prevent="submitSearch" class="search-form">

    <!-- Main Search Input -->
    <div class="search-form__main">
      <SearchInput id="query-input" label="What are you craving today?" v-model="searchState.query"
        placeholder="Search recipes, ingredients, or dishes..." type="text" />
    </div>

    <!-- Advanced Filters Toggle -->
    <button type="button" @click="showFilters = !showFilters" class="search-form__toggle">
      <svg class="search-form__toggle-icon" :class="{ 'search-form__toggle-icon--open': showFilters }"
        viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
      <span>{{ showFilters ? 'Hide' : 'Show' }} Advanced Filters</span>
      <svg class="search-form__toggle-chevron" :class="{ 'search-form__toggle-chevron--open': showFilters }"
        viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Advanced Filters -->
    <Transition name="slide-fade">
      <div v-if="showFilters" class="search-form__filters">
        <div class="search-form__filters-grid">
          <SearchInput id="cuisine-input" label="Cuisine" v-model="searchState.cuisine"
            placeholder="e.g., Italian, Asian, Mexican">
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </SearchInput>

          <SearchInput id="diet-input" label="Diet" v-model="searchState.diet"
            placeholder="e.g., Vegetarian, Vegan, Keto">
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </SearchInput>

          <SearchInput id="intolerances-input" label="Allergies & Intolerances" v-model="searchState.intolerances"
            placeholder="e.g., Gluten, Dairy, Nuts">
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </template>
          </SearchInput>

          <SearchInput id="type-input" label="Meal Type" v-model="searchState.type"
            placeholder="e.g., Breakfast, Main Course">
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </SearchInput>

          <SearchInput id="max-time-input" label="Max Cooking Time" v-model.number="searchState.maxReadyTime"
            type="number" placeholder="Minutes (e.g., 30)">
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </SearchInput>
        </div>

        <!-- Clear Filters Button -->
        <button v-if="hasActiveFilters" type="button" @click="clearFilters" class="search-form__clear">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All Filters
        </button>
      </div>
    </Transition>

    <!-- Submit Button -->
    <button type="submit" class="search-form__button" :disabled="loading">
      <svg v-if="!loading" class="search-form__button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <div v-else class="search-form__button-spinner"></div>
      <span>{{ loading ? 'Searching...' : 'Search Recipes' }}</span>
    </button>

    <!-- Error Message -->
    <Transition name="fade">
      <div v-if="formError" class="search-form__error">
        <svg class="search-form__error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{{ formError }}</p>
      </div>
    </Transition>

  </form>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, computed } from 'vue';
import SearchInput from '../../atoms/SearchInput/SearchInput.vue';
import { useRecipeSearchStore } from '../../../stores/recipeSearch';
import type { SearchParams } from '../../../services/api';
import { sanitizeString } from '../../../utils/sanitizer';

const emit = defineEmits(['search']);
const searchStore = useRecipeSearchStore();

const showFilters = ref(false);

const searchState = reactive<SearchParams>({
  query: '',
  cuisine: '',
  diet: '',
  intolerances: '',
  type: '',
  maxReadyTime: 0,
  offset: 0,
  number: 12,
});

const loading = ref(searchStore.loading);
const formError = ref<string | null>(null);

const hasActiveFilters = computed(() => {
  return !!(searchState.cuisine || searchState.diet ||
    searchState.intolerances || searchState.type ||
    searchState.maxReadyTime);
});

const validateForm = (): boolean => {
  formError.value = null;

  const queryValue = sanitizeString(searchState.query?.toString().trim() || '');
  if (queryValue.length > 200) {
    formError.value = 'Search query is too long. Maximum 200 characters allowed.';
    return false;
  }

  if (!queryValue &&
    !searchState.cuisine &&
    !searchState.diet &&
    !searchState.intolerances &&
    !searchState.type &&
    !searchState.maxReadyTime) {
    formError.value = 'Please enter a search term or select at least one filter.';
    return false;
  }

  if (queryValue && !/^[a-zA-Z, ]+$/.test(queryValue)) {
    formError.value = 'Search query should only contain letters, commas, and spaces.';
    return false;
  }

  if (searchState.maxReadyTime) {
    const maxReadyTimeNum = Number(searchState.maxReadyTime);
    if (isNaN(maxReadyTimeNum) || maxReadyTimeNum < 1 || maxReadyTimeNum > 500) {
      formError.value = 'Cooking time must be a number between 1 and 500 minutes.';
      return false;
    }
  }

  if (searchState.cuisine) {
    if (searchState.cuisine.length > 200) {
      formError.value = 'Cuisine is too long. Maximum 200 characters allowed.';
      return false;
    }
    if (!/^[a-zA-Z, ]+$/.test(searchState.cuisine)) {
      formError.value = 'Cuisine should only contain letters, commas, and spaces.';
      return false;
    }
  }

  if (searchState.diet) {
    if (searchState.diet.length > 200) {
      formError.value = 'Diet is too long. Maximum 200 characters allowed.';
      return false;
    }
    if (!/^[a-zA-Z, ]+$/.test(searchState.diet)) {
      formError.value = 'Diet should only contain letters, commas, and spaces.';
      return false;
    }
  }

  if (searchState.intolerances) {
    if (searchState.intolerances.length > 200) {
      formError.value = 'Intolerances is too long. Maximum 200 characters allowed.';
      return false;
    }
    if (!/^[a-zA-Z, ]+$/.test(searchState.intolerances)) {
      formError.value = 'Intolerances should only contain letters, commas, and spaces.';
      return false;
    }
  }

  if (searchState.type) {
    if (searchState.type.length > 200) {
      formError.value = 'Type is too long. Maximum 200 characters allowed.';
      return false;
    }
    if (!/^[a-zA-Z ]+$/.test(searchState.type)) {
      formError.value = 'Type should only contain letters and spaces.';
      return false;
    }
  }

  return true;
};

const clearFilters = () => {
  searchState.cuisine = '';
  searchState.diet = '';
  searchState.intolerances = '';
  searchState.type = '';
  searchState.maxReadyTime = 0;
};

const submitSearch = () => {
  if (!validateForm()) {
    return;
  }

  const cleanParams: SearchParams = {
    ...searchState,
    maxReadyTime: searchState.maxReadyTime || undefined,
  };

  searchStore.search(cleanParams, 1);
  emit('search', cleanParams);
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/global.scss' as *;

.search-form {
  background: white;
  border-radius: $radius-xl;
  padding: 2rem;
  box-shadow: $shadow-lg;
  border: 1px solid $slate-200;

  @media (max-width: $breakpoint-md) {
    padding: 1.5rem;
    border-radius: $radius-lg;
  }
}

// Main Search Input
.search-form__main {
  margin-bottom: 1.5rem;
}

// Toggle Button
.search-form__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: $slate-50;
  border: 1px solid $slate-200;
  border-radius: $radius-lg;
  font-size: $text-sm;
  font-weight: $font-medium;
  color: $slate-700;
  transition: all $transition-base;
  margin-bottom: 1rem;

  &:hover {
    background: $slate-100;
    border-color: $slate-300;
  }

  &:active {
    transform: scale(0.98);
  }
}

.search-form__toggle-icon {
  width: 18px;
  height: 18px;
  color: $slate-500;
  transition: transform $transition-base;

  &--open {
    color: $primary-500;
  }
}

.search-form__toggle-chevron {
  width: 16px;
  height: 16px;
  color: $slate-400;
  transition: transform $transition-base;

  &--open {
    transform: rotate(180deg);
  }
}

// Filters Section
.search-form__filters {
  margin-bottom: 1.5rem;
}

.search-form__filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1rem;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

// Clear Filters Button
.search-form__clear {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid $slate-300;
  border-radius: $radius-md;
  font-size: $text-sm;
  font-weight: $font-medium;
  color: $slate-600;
  transition: all $transition-base;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: $error;
    border-color: $error;
    color: white;
  }
}

// Submit Button
.search-form__button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, $primary-600 0%, $primary-500 100%);
  color: white;
  border: none;
  border-radius: $radius-lg;
  font-size: $text-base;
  font-weight: $font-semibold;
  cursor: pointer;
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

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;

    &::before {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: $slate-300;
    cursor: not-allowed;
    box-shadow: none;

    &:hover {
      transform: none;
    }
  }

  span {
    position: relative;
    z-index: 1;
  }
}

.search-form__button-icon {
  width: 20px;
  height: 20px;
  position: relative;
  z-index: 1;
}

.search-form__button-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  position: relative;
  z-index: 1;
}

// Error Message
.search-form__error {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba($error, 0.1);
  border: 1px solid rgba($error, 0.3);
  border-radius: $radius-md;
  color: $error;

  p {
    margin: 0;
    font-size: $text-sm;
    font-weight: $font-medium;
    color: $error;
  }
}

.search-form__error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

// Transitions
.slide-fade-enter-active {
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    max-height: 1000px;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    max-height: 1000px;
  }

  to {
    opacity: 0;
    max-height: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>