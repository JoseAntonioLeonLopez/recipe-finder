<template>
  <div class="recipe-grid">
    <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" class="recipe-grid__item" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import RecipeCard from '../../molecules/RecipeCard/RecipeCard.vue';
import type { RecipeSummary } from '../../../services/api';

defineProps<{
  recipes: RecipeSummary[]
}>();
</script>

<style lang="scss" scoped>
@use '@/assets/styles/global.scss' as *;

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem 0;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.recipe-grid__item {
  width: 100%;
  animation: fadeInUp 0.4s ease backwards;

  @for $i from 1 through 12 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.05}s;
    }
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
</style>