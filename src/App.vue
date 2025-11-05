<template>
  <div id="app-container">

    <header class="app-header">
      <nav class="app-nav">
        <RouterLink to="/" class="app-nav__brand">
          <svg class="app-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="app-nav__logo">Recipe Finder</span>
        </RouterLink>

        <div class="app-nav__links">
          <RouterLink to="/" class="app-nav__link" active-class="app-nav__link--active">
            <span>Search</span>
          </RouterLink>
          <RouterLink to="/favorites" class="app-nav__link" active-class="app-nav__link--active">
            <span>Favorites</span>
          </RouterLink>
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
      <div class="app-footer__content">
        <p class="app-footer__text">Powered by Spoonacular API</p>
        <p class="app-footer__copyright">© 2025 Recipe Finder</p>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style lang="scss">
@use '@/assets/styles/global.scss' as *;

// Variables de diseño
$primary-color: #2563eb;
$primary-hover: #1d4ed8;
$text-dark: #0f172a;
$text-muted: #64748b;
$background: #ffffff;
$background-alt: #f8fafc;
$border-color: #e2e8f0;
$shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
$shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
$shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

#app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, $slate-50 0%, $primary-50 100%);
  color: $text-dark;
}

.app-header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid $border-color;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-nav {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
}

.app-nav__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

.app-nav__icon {
  width: 28px;
  height: 28px;
  color: $primary-color;
  transition: transform 0.3s ease;

  .app-nav__brand:hover & {
    transform: rotate(-5deg) scale(1.05);
  }
}

.app-nav__logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: $text-dark;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, $primary-color 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-nav__links {
  display: flex;
  gap: 0.5rem;
}

.app-nav__link {
  position: relative;
  color: $text-muted;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  span {
    position: relative;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: $background-alt;
    border-radius: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover {
    color: $text-dark;

    &::before {
      opacity: 1;
    }
  }

  &--active {
    color: $primary-color;

    &::before {
      opacity: 1;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
    }
  }
}

.app-main {
  flex-grow: 1;
  padding: 2rem 0;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }
}

.app-footer {
  background: $background-alt;
  border-top: 1px solid $border-color;
  margin-top: auto;
}

.app-footer__content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
}

.app-footer__text,
.app-footer__copyright {
  font-size: 0.875rem;
  color: $text-muted;
  margin: 0;
}

.app-footer__text {
  font-weight: 500;
}

// Transiciones mejoradas
.fade-enter-active {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-leave-active {
  animation: fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>