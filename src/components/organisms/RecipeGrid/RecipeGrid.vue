<template>
  <div class="recipe-grid">
    <RecipeCard 
      v-for="recipe in recipes" 
      :key="recipe.id" 
      :recipe="recipe" 
      class="recipe-grid__item"
    />
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
/* BEM styling for Recipe Grid Organism */
.recipe-grid {
  display: grid;
  // Responsive grid: 2, 3, or 4 columns based on screen size
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 25px;
  padding: 20px 0;

  &__item {
    // Ensures the card fills the grid cell
    width: 100%; 
  }
}
</style>