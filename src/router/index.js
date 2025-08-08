import { createRouter, createWebHistory } from 'vue-router'
import Auth from '@/pages/Auth/Login.vue'

import AdminPanel from '../pages/AdminPanel/index.vue'
import ApplicationForm from '../pages/AdminPanel/AppilcationForm.vue'
import NotFound from '@/pages/NotFound.vue'
import Home from '@/pages/AdminPanel/Home.vue'
import LawSchoolApplication from '@/pages/AdminPanel/LawSchoolApplication.vue'
import MainPage from '@/pages/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
          {
        path: '/',
        name: 'MainPage',
        component: MainPage,
        meta: {
          requiresAuth: false, // Means user should not be logged in
          title: 'Main Page',  // Could be used to set document.title
          layout: 'default'    // If you use different layouts (e.g. default/auth/admin)
        },
      },
    {

      path: '/pages',
      name: 'AdminPanel',
      component: AdminPanel,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home
        },
        {
          path: 'application', // catch-all inside /pages
          name: 'application',
          component: ApplicationForm
        },
        {
          path: 'law-schools-application', // catch-all inside /pages
          name: 'law-schools-application',
          component: LawSchoolApplication
        },
        {
          path: ':catchAll(.*)*', // catch-all inside /pages
          name: 'PagesNotFound',
          component: NotFound
        }
      ]
    },
    {
      path: '/auth-login',
      name: 'AuthLogin',
      component: Auth,
      meta: {
        requiresAuth: false,         // Means user should not be logged in
        title: 'Login Page',         // Could be used to set document.title
        layout: 'auth'               // If you use different layouts (e.g. default/auth/admin)
      }
    }
  ],
})


router.beforeEach((to, from, next) => {
  // if (to.path === '/') {
  //   return next({ name: 'AuthLogin' });
  // }

  const isAuthenticated = localStorage.getItem('accessToken');
  let userData = isAuthenticated ? safeDecode(isAuthenticated) : null;
  const isTokenValid = userData && userData.exp > Date.now() / 1000;
  if (isAuthenticated) {
    return next();
  }

  if (!to.meta.requiresAuth) {
    // if (to.name === 'AuthLogin' && isAuthenticated && isTokenValid) {
    //   return next({ name: 'AdminPanel' });
    // }
    return next();
  }

  if (!isAuthenticated || !isTokenValid) {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("accessToken");
    return next({
      name: 'AuthLogin',
      query: { next: encodeURIComponent(to.fullPath) }
    });
  }

  // Default: allow navigation
  return next();
});


function safeDecode(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3)
      throw new Error('Invalid token format');


    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch (error) {
    console.error('Token decoding failed:', error);
    return null;
  }
}

export default router
