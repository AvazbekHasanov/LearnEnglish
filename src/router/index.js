import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'

// Authentication Pages
import Login from '@/pages/Auth/Login.vue'
import Signup from '@/pages/Auth/Signup.vue'
import PasswordReset from '@/pages/Auth/PasswordReset.vue'

// Main Pages
import Home from '@/pages/Home.vue'
import Grammar from '@/pages/Grammar.vue'
import Vocabulary from '@/pages/Vocabulary.vue'
import Games from '@/pages/Games.vue'

// Learning Pages
import LessonDetail from '@/pages/Learning/LessonDetail.vue'
import Practice from '@/pages/Learning/Practice.vue'

// User Pages
import Profile from '@/pages/User/Profile.vue'
import Progress from '@/pages/User/Progress.vue'
import Achievements from '@/pages/User/Achievements.vue'
import Leaderboard from '@/pages/User/Leaderboard.vue'

// Optional Pages
import Planner from '@/pages/Planner.vue'
import Contact from '@/pages/Contact.vue'

// Error Pages
import NotFound from '@/pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Authentication Routes
    {
      path: '/auth/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false,
        title: 'Login - LearnEnglish'
      }
    },
    {
      path: '/auth/signup',
      name: 'Signup',
      component: Signup,
      meta: {
        requiresAuth: false,
        title: 'Sign Up - LearnEnglish'
      }
    },
    {
      path: '/auth/password-reset',
      name: 'PasswordReset',
      component: PasswordReset,
      meta: {
        requiresAuth: false,
        title: 'Password Reset - LearnEnglish'
      }
    },

    // Main Site Routes
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: false,
        title: 'LearnEnglish - Master English Online'
      }
    },
    {
      path: '/grammar',
      name: 'Grammar',
      component: Grammar,
      meta: {
        requiresAuth: true,
        title: 'Grammar Lessons - LearnEnglish'
      }
    },
    {
      path: '/vocabulary',
      name: 'Vocabulary',
      component: Vocabulary,
      meta: {
        requiresAuth: true,
        title: 'Vocabulary - LearnEnglish'
      }
    },
    {
      path: '/games',
      name: 'Games',
      component: Games,
      meta: {
        requiresAuth: true,
        title: 'Learning Games - LearnEnglish'
      }
    },

    // Learning Routes
    {
      path: '/lesson/:id',
      name: 'LessonDetail',
      component: LessonDetail,
      meta: {
        requiresAuth: true,
        title: 'Lesson - LearnEnglish'
      }
    },
    {
      path: '/practice/:lessonId',
      name: 'Practice',
      component: Practice,
      meta: {
        requiresAuth: true,
        title: 'Practice - LearnEnglish'
      }
    },

    // User Routes (require authentication)
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true,
        title: 'My Profile - LearnEnglish'
      }
    },
    {
      path: '/progress',
      name: 'Progress',
      component: Progress,
      meta: {
        requiresAuth: true,
        title: 'My Progress - LearnEnglish'
      }
    },
    {
      path: '/achievements',
      name: 'Achievements',
      component: Achievements,
      meta: {
        requiresAuth: true,
        title: 'Achievements - LearnEnglish'
      }
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard,
      meta: {
        requiresAuth: false,
        title: 'Leaderboard - LearnEnglish'
      }
    },

    // Optional Routes
    {
      path: '/planner',
      name: 'Planner',
      component: Planner,
      meta: {
        requiresAuth: true,
        title: 'Study Planner - LearnEnglish'
      }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
      meta: {
        requiresAuth: false,
        title: 'Contact Us - LearnEnglish'
      }
    },

    // 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        requiresAuth: false,
        title: 'Page Not Found - LearnEnglish'
      }
    }
  ]
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  const userStore = useUserStore()
  
  // Load user data from localStorage on app start
  if ( localStorage.getItem('accessToken')) {
    userStore.loadFromLocalStorage()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Redirect to login with return URL
    return next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (userStore.isAuthenticated && (to.name === 'Login' || to.name === 'Signup')) {
    return next({ name: 'Home' })
  }

  next()
})

export default router
