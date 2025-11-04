<template>
  <div id="app-container">
    
    <header class="app-header">
      <nav class="app-nav">
        <RouterLink to="/" class="app-nav__link">
          <span class="app-nav__logo">🍽️ Recipe Finder</span>
        </RouterLink>
        <div class="app-nav__links">
          <RouterLink to="/" class="app-nav__link" active-class="app-nav__link--active">Search</RouterLink>
          <RouterLink to="/favorites" class="app-nav__link" active-class="app-nav__link--active">Favorites</RouterLink>
        </div>
      </nav>
    </header>

    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <KeepAlive include="SearchPage"> 
            <component :is="Component" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </main>

    <footer class="app-footer">
      <p>&copy; 2025 Recipe App. Data provided by Spoonacular API.</p>
    </footer>

  </div>
</template>

<script setup lang="ts">
// Import the RouterLink and RouterView components globally available via Vue Router
import { RouterLink, RouterView } from 'vue-router'

// Note: No component state or logic needed here, only structural imports.
</script>

<style lang="scss">
// Global SCSS Import: Set up typography, variables, resets.
// Assuming you have a file in src/assets
@use '@/assets/styles/global.scss' as *;

// --- App.vue Specific Styles (Layout/Structure) ---

#app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #333; // Dark background for contrast
  padding: 15px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-nav__logo {
  font-size: 1.5em;
  font-weight: bold;
  color: #ff6347; /* Primary color */
}

.app-nav__links {
  display: flex;
  gap: 25px;
}

.app-nav__link {
  color: #ccc;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 10px;
  transition: color 0.3s ease, border-bottom 0.3s ease;

  &:hover {
    color: white;
  }
  
  &--active {
    color: #ff6347;
    border-bottom: 2px solid #ff6347;
  }
}

.app-main {
  flex-grow: 1; /* Ensures main content takes up remaining vertical space */
  padding: 20px 0;
}

.app-footer {
  background-color: #f4f4f4;
  color: #666;
  text-align: center;
  padding: 20px;
  margin-top: auto; /* Pushes footer to the bottom */
  border-top: 1px solid #eee;
}

/* Transition Styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>