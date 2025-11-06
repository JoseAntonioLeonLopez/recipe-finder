import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  RecipeService,
  type SearchParams,
  type RecipeSummary,
  type SearchResult,
} from '../services/api'

// Initial state for search parameters
const INITIAL_SEARCH_PARAMS: SearchParams = {
  query: '',
  cuisine: '',
  diet: '',
  intolerances: '',
  type: '',
  maxReadyTime: 0,
  offset: 0,
  number: 12, // Number of results per page
}

export const useRecipeSearchStore = defineStore('recipeSearch', () => {
  // State
  const recipes = ref<RecipeSummary[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalResults = ref(0)
  const currentPage = ref(1)
  const recipesPerPage = INITIAL_SEARCH_PARAMS.number || 12

  // Use a reactive object to hold and persist the current search params
  const currentParams = ref<SearchParams>({ ...INITIAL_SEARCH_PARAMS })

  // Getters (for computed values)
  const totalPages = ref(0)

  // Actions
  /**
   * Performs the recipe search, updating the store's state.
   * @param newParams - The search parameters from the form.
   * @param page - The page number to fetch (defaults to currentPage).
   */
  async function search(newParams: SearchParams, page: number = 1) {
    loading.value = true
    error.value = null
    currentPage.value = page

    // 1. Update the stored parameters for subsequent page navigation
    // Note: The sanitization is handled in the service layer, but we store the sanitized values.
    currentParams.value = { ...newParams }

    try {
      const offset = (currentPage.value - 1) * recipesPerPage

      const paramsToSend: SearchParams = {
        ...currentParams.value,
        offset,
        number: recipesPerPage,
      }

      const result: SearchResult = await RecipeService.searchRecipes(paramsToSend)

      recipes.value = result.results
      totalResults.value = result.totalResults
      totalPages.value = Math.ceil(result.totalResults / recipesPerPage)

      // If the page is outside bounds after a new search, reset
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = 1
      }
    } catch (err: unknown) {
      error.value = err.message || 'An unknown error occurred during the search.'
      recipes.value = []
      totalResults.value = 0
      totalPages.value = 0
    } finally {
      loading.value = false
    }
  }

  /**
   * Handles page change by reusing the last search parameters.
   */
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      search(currentParams.value, page)
    }
  }

  function clearResults() {
    recipes.value = []
    totalResults.value = 0
    totalPages.value = 0
    currentPage.value = 1
    error.value = null
    currentParams.value = { ...INITIAL_SEARCH_PARAMS }
  }

  return {
    // State
    recipes,
    loading,
    error,
    totalResults,
    currentPage,
    recipesPerPage,
    currentParams,

    // Getters
    totalPages,

    // Actions
    search,
    goToPage,
    clearResults,
  }
})
