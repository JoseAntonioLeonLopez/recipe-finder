<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Page navigation">
    <button 
      @click="changePage(currentPage - 1)" 
      :disabled="currentPage === 1 || loading"
      class="pagination__button pagination__button--prev"
      aria-label="Previous page"
    >
      &laquo; Previous
    </button>
    
    <div class="pagination__pages">
      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="page === '...'"
          class="pagination__ellipsis"
          disabled
        >
          ...
        </button>
        <button
          v-else
          @click="changePage(page as number)"
          :class="['pagination__page-number', { 'pagination__page-number--active': page === currentPage }]"
          :disabled="loading"
          :aria-current="page === currentPage ? 'page' : undefined"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <button 
      @click="changePage(currentPage + 1)" 
      :disabled="currentPage === totalPages || loading"
      class="pagination__button pagination__button--next"
      aria-label="Next page"
    >
      Next &raquo;
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRecipeSearchStore } from '../../../stores/recipeSearch';

const store = useRecipeSearchStore();

// Destructure state from store for reactivity
const currentPage = computed(() => store.currentPage);
const totalPages = computed(() => store.totalPages);
const loading = computed(() => store.loading);

/**
 * Calculates the array of visible page numbers, including ellipses (...).
 * Implements a common pattern to show surrounding pages (e.g., 1, 2, ..., 8, 9, 10).
 */
const visiblePages = computed((): (number | string)[] => {
  const pages: (number | string)[] = [];
  const maxVisible = 7; 
  const current = currentPage.value;
  const total = totalPages.value;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  // Show pages around the current page
  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);

  if (current <= 3) end = 3;
  if (current >= total - 2) start = total - 2;

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }
  
  // Always show last page if not already shown
  if (!pages.includes(total)) {
    pages.push(total);
  }

  return pages;
});


/**
 * Triggers the page change action in the Pinia store.
 */
const changePage = (page: number | string) => {
  if (typeof page === 'number') {
    console.log('PAGINATION CLICK EVENT REGISTERED FOR PAGE:', page);
    store.goToPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' }); 
  }
};
</script>

<style lang="scss" scoped>
/* BEM styles for Pagination Molecule */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 30px 0;
  
  &__button {
    padding: 8px 15px;
    border: 1px solid #ccc;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover:not(:disabled) {
      background-color: #f0f0f0;
    }
    
    &:disabled {
      color: #aaa;
      cursor: not-allowed;
    }
  }

  &__pages {
    display: flex;
    gap: 5px;
  }

  &__page-number {
    padding: 8px 12px;
    border: 1px solid #ccc;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
    min-width: 40px;
    text-align: center;
    transition: background-color 0.2s, border-color 0.2s, color 0.2s;

    &:hover:not(&--active) {
      background-color: #f5f5f5;
    }

    &--active {
      background-color: #ff6347;
      color: white;
      border-color: #ff6347;
      font-weight: bold;
      cursor: default;
    }
  }

  &__ellipsis {
    padding: 8px 5px;
    border: none;
    background: none;
    color: #888;
    cursor: default;
  }
}
</style>