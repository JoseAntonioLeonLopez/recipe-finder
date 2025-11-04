<template>
  <div class="recipe-card" @click="goToDetails" :class="{'recipe-card--favorite': isFav}">
    <div class="recipe-card__image-wrapper">
      <img 
        :src="finalImageSrc" 
        :alt="recipe.title" 
        class="recipe-card__image" 
        loading="lazy"
        @error="handleImageError"  />
    </div>
    <div class="recipe-card__content">
      <h3 class="recipe-card__title">{{ recipe.title }}</h3>
      <button 
        @click.stop="toggleFavorite" 
        class="recipe-card__favorite-btn"
        :aria-label="isFav ? 'Remove from favorites' : 'Add to favorites'"
      >
        <span class="icon">{{ isFav ? '❤️' : '🤍' }}</span> 
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoritesStore } from '../../../stores/favorites';
import type { RecipeSummary } from '../../../services/api';
import DefaultRecipeImage from '@/assets/images/default-recipe.png';

const props = defineProps<{
  recipe: RecipeSummary
}>();

const router = useRouter();
const favoritesStore = useFavoritesStore();

const imageFailed = ref(false);

// Check if the recipe is a favorite
const isFav = computed(() => favoritesStore.isFavorite(props.recipe.id));

const finalImageSrc = computed(() => {
  // 1. If the image has failed, use the default.
  // 2. If the API didn't provide an image initially, use the default.
  if (imageFailed.value || !props.recipe.image) {
    return DefaultRecipeImage;
  }
  // 3. Otherwise, use the URL from the API.
  return props.recipe.image;
});

const handleImageError = () => {
  // Set the failure flag, which will automatically trigger the finalImageSrc computed
  // property to switch the source to DefaultRecipeImage.
  imageFailed.value = true;
};

// Router navigation
const goToDetails = () => {
  router.push({ name: 'RecipeDetail', params: { id: props.recipe.id } });
};

// Toggle favorite state
const toggleFavorite = () => {
  if (isFav.value) {
    favoritesStore.removeFavorite(props.recipe.id);
  } else {
    favoritesStore.addFavorite(props.recipe);
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/global.scss' as *; // Import SCSS styles
</style>