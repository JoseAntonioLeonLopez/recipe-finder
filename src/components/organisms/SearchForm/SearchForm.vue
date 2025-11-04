<template>
  <form @submit.prevent="submitSearch" class="search-form">
    
    <SearchInput
      id="query-input"
      label="Recipe Name or Ingredient"
      v-model="searchState.query"
      placeholder="e.g., pasta, chicken soup, vegan chili"
      type="text"
    />

    <div class="search-form__filters">
      <SearchInput
        id="cuisine-input"
        label="Cuisine (comma separated)"
        v-model="searchState.cuisine"
        placeholder="e.g., italian, asian"
      />

      <SearchInput
        id="diet-input"
        label="Diet (comma/pipe separated)"
        v-model="searchState.diet"
        placeholder="e.g., vegetarian|vegan"
      />

      <SearchInput
        id="intolerances-input"
        label="Intolerances"
        v-model="searchState.intolerances"
        placeholder="e.g., gluten, dairy"
      />

      <SearchInput
        id="type-input"
        label="Meal Type"
        v-model="searchState.type"
        placeholder="e.g., main course, dessert"
      />

      <SearchInput
        id="max-time-input"
        label="Max Prep Time (min)"
        v-model.number="searchState.maxReadyTime"
        type="number"
        placeholder="e.g., 30"
      />
    </div>

    <button type="submit" class="search-form__button" :disabled="loading">
      {{ loading ? 'Searching...' : 'Find Recipes' }}
    </button>
    
    <p v-if="formError" class="search-form__error">{{ formError }}</p>

  </form>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue';
import SearchInput from '../../atoms/SearchInput/SearchInput.vue';
import { useRecipeSearchStore } from '../../../stores/recipeSearch';
import type { SearchParams } from '../../../services/api';

const emit = defineEmits(['search']);
const searchStore = useRecipeSearchStore();

// Local state for form inputs
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


/**
 * Simple client-side validation for the form.
 */
const validateForm = (): boolean => {
  formError.value = null;
  
  const queryValue = searchState.query?.toString().trim();
  
  if (!queryValue && 
      !searchState.cuisine && 
      !searchState.diet && 
      !searchState.intolerances && 
      !searchState.type && 
      !searchState.maxReadyTime) {
    formError.value = 'Please enter a search query or select at least one filter.';
    return false;
  }
  
  if (searchState.maxReadyTime && (searchState.maxReadyTime < 1 || searchState.maxReadyTime > 500)) {
    formError.value = 'Max Prep Time must be between 1 and 500 minutes.';
    return false;
  }
  
  return true;
};

/**
 * Handles the search submission.
 * Calls the Pinia store action which, in turn, calls the sanitized service.
 */
const submitSearch = () => {
  if (!validateForm()) {
    return;
  }

  // Pass a clean copy of the parameters to the parent/store
  const cleanParams: SearchParams = {
    ...searchState,
    // Ensure 0 is treated as undefined/null for API if not relevant
    maxReadyTime: searchState.maxReadyTime || undefined, 
  };
  
  // Call the search action in the store, which will handle API call and state update
  searchStore.search(cleanParams, 1);
  
  // Emit to parent if needed for page-level concerns (like resetting)
  emit('search', cleanParams); 
};
</script>

<style lang="scss" scoped>
.search-form {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 30px;

  &__filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  &__button {
    width: 100%;
    padding: 12px;
    background-color: #ff6347; /* Primary color */
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s;

    &:hover:not(:disabled) {
      background-color: #ff6347;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  &__error {
    color: #e74c3c;
    margin-top: 10px;
    text-align: center;
    font-weight: bold;
  }
}
</style>