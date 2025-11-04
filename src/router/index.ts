import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Search',
      // Lazy-load the Search Page
      component: () => import('../pages/SearchPage.vue') 
    },
    {
      path: '/recipe/:id',
      name: 'RecipeDetail',
      // Lazy-load the Detail Page
      component: () => import('../pages/DetailPage.vue'), 
      props: true
    },
    {
      path: '/favorites',
      name: 'Favorites',
      // Lazy-load the Favorites Page
      component: () => import('../pages/FavoritesPage.vue') 
    },
    // Add a catch-all route for 404
    // {
    //   path: '/:pathMatch(.*)*', 
    //   name: 'NotFound', 
    //   component: () => import('../pages/NotFoundPage.vue')
    // }
  ]
})

export default router