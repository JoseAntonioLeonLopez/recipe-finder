<template>
  <article class="recipe-card" @click="goToDetails" :class="{ 'recipe-card--favorite': isFav }">
    <div class="recipe-card__image-wrapper">
      <img :src="finalImageSrc" :alt="recipe.title" class="recipe-card__image" loading="lazy"
        @error="handleImageError" />
      <div class="recipe-card__overlay"></div>

      <!-- Favorite Button Floating -->
      <button @click.stop="toggleFavorite" class="recipe-card__favorite-btn"
        :class="{ 'recipe-card__favorite-btn--active': isFav }"
        :aria-label="isFav ? 'Remove from favorites' : 'Add to favorites'">
        <svg class="recipe-card__favorite-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <div class="recipe-card__content">
      <h3 class="recipe-card__title">{{ recipe.title }}</h3>

      <!-- Additional Info Badge -->
      <div class="recipe-card__badge" v-if="recipe.readyInMinutes">
        <svg class="recipe-card__badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ recipe.readyInMinutes }} min</span>
      </div>

      <!-- Hover Indicator -->
      <div class="recipe-card__arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </div>
  </article>
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

const isFav = computed(() => favoritesStore.isFavorite(props.recipe.id));

const finalImageSrc = computed(() => {
  if (imageFailed.value || !props.recipe.image) {
    return DefaultRecipeImage;
  }
  return props.recipe.image;
});

const handleImageError = () => {
  imageFailed.value = true;
};

const goToDetails = () => {
  router.push({ name: 'RecipeDetail', params: { id: props.recipe.id } });
};

const toggleFavorite = () => {
  if (isFav.value) {
    favoritesStore.removeFavorite(props.recipe.id);
  } else {
    favoritesStore.addFavorite(props.recipe);
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/global.scss' as *;

.recipe-card {
  position: relative;
  background: white;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: $shadow-sm;
  border: 1px solid $slate-200;
  cursor: pointer;
  transition: all $transition-slow;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-xl;
    border-color: $primary-200;

    .recipe-card__image {
      transform: scale(1.1);
    }

    .recipe-card__overlay {
      opacity: 1;
    }

    .recipe-card__arrow {
      opacity: 1;
      transform: translateX(0);
    }

    .recipe-card__title {
      color: $primary-600;
    }
  }

  &:active {
    transform: translateY(-4px);
  }

  &--favorite {
    border-color: rgba($error, 0.3);

    &:hover {
      border-color: $error;
    }
  }
}

// Image Section
.recipe-card__image-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, $slate-100 0%, $slate-200 100%);

  @media (max-width: $breakpoint-md) {
    height: 200px;
  }
}

.recipe-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform $transition-slow;
}

.recipe-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top,
      rgba($slate-900, 0.4) 0%,
      transparent 60%);
  opacity: 0;
  transition: opacity $transition-base;
  pointer-events: none;
}

// Favorite Button
.recipe-card__favorite-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: $radius-full;
  cursor: pointer;
  transition: all $transition-base;
  box-shadow: $shadow-md;
  z-index: 2;

  &:hover {
    transform: scale(1.15);
    background: white;
    box-shadow: $shadow-lg;
  }

  &:active {
    transform: scale(1.05);
  }

  &--active {
    background: $error;

    .recipe-card__favorite-icon {
      color: white;
      fill: white;
    }
  }
}

.recipe-card__favorite-icon {
  width: 20px;
  height: 20px;
  color: $slate-700;
  transition: all $transition-base;

  .recipe-card__favorite-btn:hover & {
    color: $error;
    fill: $error;
  }

  .recipe-card__favorite-btn--active & {
    animation: heartbeat 0.3s ease;
  }
}

// Content Section
.recipe-card__content {
  position: relative;
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recipe-card__title {
  font-size: $text-lg;
  font-weight: $font-semibold;
  color: $slate-900;
  line-height: 1.4;
  margin: 0;
  transition: color $transition-base;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// Time Badge
.recipe-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: $slate-50;
  border: 1px solid $slate-200;
  border-radius: $radius-md;
  font-size: $text-sm;
  font-weight: $font-medium;
  color: $slate-600;
  width: fit-content;
  transition: all $transition-base;

  .recipe-card:hover & {
    background: $primary-50;
    border-color: $primary-200;
    color: $primary-700;
  }
}

.recipe-card__badge-icon {
  width: 14px;
  height: 14px;
}

// Arrow Indicator
.recipe-card__arrow {
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary-500;
  border-radius: $radius-full;
  opacity: 0;
  transform: translateX(-10px);
  transition: all $transition-base;

  svg {
    width: 18px;
    height: 18px;
    color: white;
  }
}

// Animations
@keyframes heartbeat {

  0%,
  100% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.3);
  }

  50% {
    transform: scale(1.1);
  }
}
</style>