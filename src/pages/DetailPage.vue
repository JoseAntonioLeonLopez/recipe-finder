<template>
  <div class="detail-page" v-if="recipe">
    
    <header class="detail-page__header">
      <button @click="router.back()" class="detail-page__back-button">
        &larr; Back to Search
      </button>
      <h1>{{ recipe.title }}</h1>
    </header>

    <div v-if="loading" class="detail-page__status">Loading recipe details...</div>
    <div v-else-if="error" class="detail-page__status detail-page__status--error">{{ error }}</div>
    
    <div v-else class="detail-page__content">
      
      <div class="detail-page__actions">
        <button 
          @click="toggleFavorite" 
          :class="['detail-page__favorite-btn', {'detail-page__favorite-btn--active': isFav}]"
        >
          {{ isFav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites' }}
        </button>
      </div>

      <figure class="detail-page__image-container">
        <img :src="finalImageSrc"  :alt="recipe.title" class="recipe-card__image" loading="lazy" @error="handleImageError"/>
        <figcaption v-if="recipe.sourceName">Source: {{ recipe.sourceName }}</figcaption>
      </figure>

      <section class="detail-page__info-card">
        <h2>Key Facts</h2>
        <ul class="detail-page__facts">
          <li>⏱️ **Ready in:** {{ recipe.readyInMinutes }} minutes</li>
          <li>🍽️ **Servings:** {{ recipe.servings }}</li>
          <li v-if="recipe.pricePerServing">💰 **Cost per serving:** ${{ (recipe.pricePerServing / 100).toFixed(2) }}</li>
          <li v-if="recipe.diets && recipe.diets.length">🥗 **Diets:** {{ recipe.diets.join(', ') }}</li>
        </ul>
      </section>

      <section class="detail-page__instructions">
        <h2>Preparation Instructions</h2>
        <div v-html="recipe.instructions || 'No detailed instructions available.'" class="detail-page__text-content"></div>
      </section>

      <section class="detail-page__ingredients">
        <h2>Ingredients ({{ recipe.extendedIngredients?.length || 0 }})</h2>
        <ul class="detail-page__ingredient-list">
          <li v-for="ing in recipe.extendedIngredients" :key="ing.id">
            **{{ ing.amount }} {{ ing.unit }}** of {{ ing.nameClean }}
          </li>
        </ul>
      </section>
      
      <section class="detail-page__summary">
        <h2>Summary</h2>
        <div v-html="recipe.summary" class="detail-page__text-content"></div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { RecipeService } from '../services/api';
import { useFavoritesStore } from '../stores/favorites';
import DefaultRecipeImage from '@/assets/images/default-recipe.png';

// Define props to receive the route parameter
const props = defineProps<{
  id: string // ID comes from the route param (string)
}>();

const router = useRouter();
const favoritesStore = useFavoritesStore();

const imageFailed = ref(false);

// State
const recipe = ref<unknown>(null); // Use 'any' for the full detail object structure
const loading = ref(true);
const error = ref<string | null>(null);

// Computed: Check if the current recipe is a favorite
const isFav = computed(() => {
  if (!recipe.value) return false;
  return favoritesStore.isFavorite(recipe.value.id);
});

const finalImageSrc = computed(() => {
  // 1. If the image has failed, use the default.
  // 2. If the API didn't provide an image initially, use the default.
  if (imageFailed.value || !recipe.image) {
    return DefaultRecipeImage;
  }
  // 3. Otherwise, use the URL from the API.
  return recipe.image;
});

const handleImageError = () => {
  // Set the failure flag, which will automatically trigger the finalImageSrc computed
  // property to switch the source to DefaultRecipeImage.
  imageFailed.value = true;
};

// Action: Toggle favorite status
const toggleFavorite = () => {
  if (!recipe.value) return;

  const summary = {
    id: recipe.value.id,
    title: recipe.value.title,
    image: recipe.value.image,
    imageType: 'jpg', // Defaulting type for consistency
  };

  if (isFav.value) {
    favoritesStore.removeFavorite(recipe.value.id);
  } else {
    favoritesStore.addFavorite(summary);
  }
};

// Fetch Recipe Details
const fetchRecipe = async (recipeId: number) => {
  loading.value = true;
  error.value = null;
  
  try {
    const data = await RecipeService.getRecipeDetails(recipeId);
    recipe.value = data;
  } catch (err: any) {
    error.value = 'Failed to load recipe details. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const recipeId = parseInt(props.id);
  if (isNaN(recipeId)) {
    error.value = 'Invalid recipe ID.';
    loading.value = false;
    return;
  }
  fetchRecipe(recipeId);
});
</script>

<style lang="scss" scoped>
.detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;

  &__header {
    margin-bottom: 20px;
    position: relative;
    h1 {
      text-align: center;
      color: #ff6347;
      font-size: 2.2em;
    }
  }

  &__back-button {
    background: none;
    border: none;
    color: #4a90e2;
    cursor: pointer;
    font-size: 1em;
    padding: 5px;
    margin-bottom: 15px;
    display: block;

    &:hover {
      text-decoration: underline;
    }
  }

  &__status {
    text-align: center;
    padding: 40px;
    font-size: 1.2em;
    &--error { color: #e74c3c; }
  }

  &__content {
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
  
  &__actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  &__favorite-btn {
    padding: 10px 20px;
    border: 2px solid #ff6347;
    background-color: white;
    color: #ff6347;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &--active {
      background-color: #ff6347;
      color: white;
    }
    
    &:hover {
      transform: scale(1.05);
    }
  }

  &__image-container {
    margin-bottom: 30px;
    text-align: center;
    figcaption {
      margin-top: 10px;
      font-style: italic;
      color: #666;
    }
  }

  &__image {
    width: 100%;
    max-height: 450px;
    object-fit: cover;
    border-radius: 8px;
  }

  &__info-card, 
  &__instructions, 
  &__ingredients, 
  &__summary {
    margin-bottom: 30px;
    h2 {
      border-bottom: 2px solid #eee;
      padding-bottom: 5px;
      margin-bottom: 15px;
      color: #333;
    }
  }

  &__facts {
    list-style: none;
    padding-left: 0;
    li {
      margin-bottom: 8px;
    }
  }

  &__ingredient-list {
    list-style: disc;
    padding-left: 20px;
    li {
      margin-bottom: 5px;
    }
  }
  
  &__text-content {
    // Styling for HTML content from API (summary, instructions)
    :deep(p) {
      line-height: 1.6;
      margin-bottom: 15px;
    }
  }
}
</style>