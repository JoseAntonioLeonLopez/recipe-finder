<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Page navigation">

    <!-- Previous Button -->
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1 || loading"
      class="pagination__button pagination__button--prev"
      :class="{ 'pagination__button--disabled': currentPage === 1 || loading }" aria-label="Previous page">
      <svg class="pagination__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="pagination__button-text">Previous</span>
    </button>

    <!-- Page Numbers -->
    <div class="pagination__pages">
      <template v-for="page in visiblePages" :key="page">
        <button v-if="page === '...'" class="pagination__ellipsis" disabled aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="19" cy="12" r="1" fill="currentColor" />
            <circle cx="5" cy="12" r="1" fill="currentColor" />
          </svg>
        </button>
        <button v-else @click="changePage(page as number)" :class="[
          'pagination__page-number',
          { 'pagination__page-number--active': page === currentPage }
        ]" :disabled="loading" :aria-current="page === currentPage ? 'page' : undefined">
          {{ page }}
        </button>
      </template>
    </div>

    <!-- Next Button -->
    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages || loading"
      class="pagination__button pagination__button--next"
      :class="{ 'pagination__button--disabled': currentPage === totalPages || loading }" aria-label="Next page">
      <span class="pagination__button-text">Next</span>
      <svg class="pagination__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Page Info (Mobile-friendly) -->
    <div class="pagination__info">
      Page <span class="pagination__info-current">{{ currentPage }}</span> of {{ totalPages }}
    </div>
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

  if (!pages.includes(current)) {
    pages.splice(pages.indexOf('...') > -1 ? pages.indexOf('...') : pages.length, 0, current);
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
@use '@/assets/styles/global.scss' as *;

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 3rem 0;
  flex-wrap: wrap;

  @media (max-width: $breakpoint-sm) {
    gap: 0.375rem;
  }
}

// Navigation Buttons (Previous/Next)
.pagination__button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1px solid $slate-300;
  border-radius: $radius-lg;
  font-size: $text-sm;
  font-weight: $font-medium;
  color: $slate-700;
  cursor: pointer;
  transition: all $transition-base;
  box-shadow: $shadow-xs;

  &:hover:not(&--disabled) {
    background: $slate-50;
    border-color: $primary-400;
    color: $primary-700;
    transform: translateY(-2px);
    box-shadow: $shadow-md;

    .pagination__icon {
      color: $primary-600;
      transform: translateX(0);
    }
  }

  &:active:not(&--disabled) {
    transform: translateY(0);
    box-shadow: $shadow-xs;
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: $slate-50;
    color: $slate-400;
    border-color: $slate-200;

    &:hover {
      transform: none;
      box-shadow: $shadow-xs;
    }
  }

  &--prev .pagination__icon {
    transform: translateX(0);
    transition: transform $transition-base;
  }

  &--prev:hover:not(&--disabled) .pagination__icon {
    transform: translateX(-3px);
  }

  &--next .pagination__icon {
    transform: translateX(0);
    transition: transform $transition-base;
  }

  &--next:hover:not(&--disabled) .pagination__icon {
    transform: translateX(3px);
  }

  @media (max-width: $breakpoint-sm) {
    padding: 0.5rem 0.875rem;
  }
}

.pagination__icon {
  width: 18px;
  height: 18px;
  color: $slate-500;
  transition: all $transition-base;
  flex-shrink: 0;
}

.pagination__button-text {
  @media (max-width: $breakpoint-sm) {
    display: none;
  }
}

// Page Numbers Container
.pagination__pages {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

// Individual Page Number
.pagination__page-number {
  min-width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  background: white;
  border: 1px solid $slate-200;
  border-radius: $radius-md;
  font-size: $text-sm;
  font-weight: $font-medium;
  color: $slate-700;
  cursor: pointer;
  transition: all $transition-base;
  position: relative;
  overflow: hidden;

  &::before {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, $primary-500 0%, $purple-500 100%);
    opacity: 0;
    transition: opacity $transition-base;
  }

  &:hover:not(&--active) {
    border-color: $primary-300;
    color: $primary-700;
    transform: translateY(-2px);
    box-shadow: $shadow-sm;

    &::before {
      opacity: 0.1;
    }
  }

  &:active:not(&--active) {
    transform: translateY(0);
  }

  &--active {
    background: linear-gradient(135deg, $primary-600 0%, $purple-600 100%);
    color: white;
    border-color: transparent;
    font-weight: $font-semibold;
    cursor: default;
    box-shadow: $shadow-md;

    &::before {
      opacity: 1;
    }

    &:hover {
      transform: none;
    }
  }

  @media (max-width: $breakpoint-sm) {
    min-width: 36px;
    height: 36px;
    padding: 0 0.5rem;
    font-size: $text-xs;
  }
}

// Ellipsis
.pagination__ellipsis {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: $slate-400;
  cursor: default;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: $breakpoint-sm) {
    width: 32px;
    height: 36px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
}

// Page Info (Shows on all screens, but styled for mobile)
.pagination__info {
  display: none;

  @media (max-width: $breakpoint-sm) {
    display: block;
    width: 100%;
    text-align: center;
    font-size: $text-sm;
    color: $slate-600;
    margin-top: 0.5rem;
    font-weight: $font-medium;
  }
}

.pagination__info-current {
  color: $primary-600;
  font-weight: $font-semibold;
}
</style>