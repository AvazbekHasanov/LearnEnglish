<template>
  <div class="layout">
    <!-- Header -->
    <header class="header" :class="{ 'scrolled': scrollY > 50 }">
      <nav class="nav-container">
        <div class="nav-left">
          <router-link to="/" class="logo">
            <span class="logo-text">{{ $t('app_name') }}</span>
            <div class="logo-accent"></div>
          </router-link>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="nav-center desktop-only">
          <router-link to="/" class="nav-link">{{ $t('navigation.home') }}</router-link>
          <router-link to="/grammar" class="nav-link">{{ $t('navigation.grammar') }}</router-link>
          <router-link to="/vocabulary" class="nav-link">{{ $t('navigation.vocabulary') }}</router-link>
          <router-link to="/games" class="nav-link">{{ $t('navigation.games') }}</router-link>
          <router-link to="/leaderboard" class="nav-link">{{ $t('navigation.leaderboard') }}</router-link>
        </div>
        
        <div class="nav-right">
          <!-- Language Switcher -->
          <Language class="language-switcher-nav" />
          
          <!-- User Menu (if authenticated) -->
          <div v-if="userStore.isAuthenticated" class="user-menu">
            <div class="user-info">
              <span class="user-points">{{ userStore.totalPoints }} {{ $t('user_menu.points') }}</span>
              <div class="user-avatar" @click="toggleUserDropdown">
                {{ userStore.user.fullName?.charAt(0) || 'U' }}
              </div>
            </div>
            
            <!-- User Dropdown -->
            <div class="user-dropdown" :class="{ 'active': isUserDropdownOpen }">
              <router-link to="/profile" class="dropdown-item">
                <i class="fas fa-user"></i>
                {{ $t('user_menu.my_profile') }}
              </router-link>
              <router-link to="/progress" class="dropdown-item">
                <i class="fas fa-chart-line"></i>
                {{ $t('user_menu.my_progress') }}
              </router-link>
              <router-link to="/achievements" class="dropdown-item">
                <i class="fas fa-trophy"></i>
                {{ $t('user_menu.achievements') }}
              </router-link>
              <router-link to="/planner" class="dropdown-item">
                <i class="fas fa-calendar"></i>
                {{ $t('user_menu.study_planner') }}
              </router-link>
              <div class="dropdown-divider"></div>
              <button @click="logout" class="dropdown-item logout">
                <i class="fas fa-sign-out-alt"></i>
                {{ $t('user_menu.logout') }}
              </button>
            </div>
          </div>
          
          <!-- Auth Buttons (if not authenticated) -->
          <div v-else class="auth-buttons">
            <router-link to="/auth/login" class="btn btn-secondary">{{ $t('login_text') }}</router-link>
            <router-link to="/auth/signup" class="btn btn-primary">{{ $t('auth.sign_up') }}</router-link>
          </div>
          
          <!-- Mobile Menu Toggle -->
          <button 
            class="mobile-menu-toggle"
            @click="toggleMobileMenu"
          >
            <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
        </div>
      </nav>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
        <div class="mobile-menu-content">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">{{ $t('navigation.home') }}</router-link>
          <router-link to="/grammar" class="mobile-nav-link" @click="closeMobileMenu">{{ $t('navigation.grammar') }}</router-link>
          <router-link to="/vocabulary" class="mobile-nav-link" @click="closeMobileMenu">{{ $t('navigation.vocabulary') }}</router-link>
          <router-link to="/games" class="mobile-nav-link" @click="closeMobileMenu">{{ $t('navigation.games') }}</router-link>
          <router-link to="/leaderboard" class="mobile-nav-link" @click="closeMobileMenu">{{ $t('navigation.leaderboard') }}</router-link>
          
          <div class="mobile-divider"></div>
          
          <!-- Mobile User Menu -->
          <div v-if="userStore.isAuthenticated" class="mobile-user-menu">
            <router-link to="/profile" class="mobile-nav-link" @click="closeMobileMenu">{{ $t('user_menu.my_profile') }}</router-link>
            <router-link to="/progress" class="mobile-nav-link" @click="closeMobileMenu">{{ $t('user_menu.my_progress') }}</router-link>
            <router-link to="/achievements" class="mobile-nav-link" @click="closeMobileMenu">{{ $t('user_menu.achievements') }}</router-link>
            <router-link to="/planner" class="mobile-nav-link" @click="closeMobileMenu">{{ $t('user_menu.study_planner') }}</router-link>
            <button @click="logout" class="mobile-nav-link logout" >{{ $t('user_menu.logout') }}</button>
          </div>
          
          <!-- Mobile Auth Buttons -->
          <div v-else class="mobile-auth-buttons">
            <router-link to="/auth/login" class="btn btn-secondary mobile-btn" @click="closeMobileMenu">{{ $t('login_text') }}</router-link>
            <router-link to="/auth/signup" class="btn btn-primary mobile-btn" @click="closeMobileMenu">{{ $t('auth.sign_up') }}</router-link>
          </div>
          
          <!-- Mobile Language Switcher -->
          <div class="mobile-language-switcher">
            <Language />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">{{ $t('app_name') }}</h3>
            <p class="footer-description">
              {{ $t('footer.description') }}
            </p>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">{{ $t('footer.learning') }}</h4>
            <router-link to="/grammar" class="footer-link">{{ $t('navigation.grammar') }}</router-link>
            <router-link to="/vocabulary" class="footer-link">{{ $t('navigation.vocabulary') }}</router-link>
            <router-link to="/games" class="footer-link">{{ $t('navigation.games') }}</router-link>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">{{ $t('footer.community') }}</h4>
            <router-link to="/leaderboard" class="footer-link">{{ $t('navigation.leaderboard') }}</router-link>
            <router-link to="/achievements" class="footer-link">{{ $t('user_menu.achievements') }}</router-link>
            <router-link to="/contact" class="footer-link">{{ $t('navigation.contact') }}</router-link>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">{{ $t('footer.support') }}</h4>
            <router-link to="/contact" class="footer-link">{{ $t('footer.help_center') }}</router-link>
            <a href="#" class="footer-link">{{ $t('footer.privacy_policy') }}</a>
            <a href="#" class="footer-link">{{ $t('footer.terms_of_service') }}</a>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>{{ $t('footer.copyright') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import Language from '@/components/Language.vue'

const router = useRouter()
const userStore = useUserStore()

const scrollY = ref(0)
const isMobileMenuOpen = ref(false)
const isUserDropdownOpen = ref(false)

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    isUserDropdownOpen.value = false
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
}

const logout = () => {
  userStore.logOut()
  router.push('/')
  closeMobileMenu()
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu')) {
    isUserDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  transition: all 0.3s ease;
}

.header.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left,
.nav-center,
.nav-right {
  display: flex;
  align-items: center;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  position: relative;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-accent {
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
}

.nav-center {
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #667eea;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

/* User Menu */
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-points {
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.user-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #64748b;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #667eea;
}

.dropdown-item.logout {
  color: #ef4444;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

/* Auth Buttons */
.auth-buttons {
  display: flex;
  gap: 1rem;
}

.language-switcher-nav {
  margin-right: 1rem;
}

/* Mobile Menu */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.mobile-menu.active {
  max-height: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.mobile-menu-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
  transition: color 0.3s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: #667eea;
}

.mobile-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 1rem 0;
}

.mobile-user-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-btn {
  justify-content: center;
}

.mobile-language-switcher {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-top: 80px; /* Header height */
  min-height: calc(100vh - 80px - 300px); /* Viewport - header - footer */
}

/* Footer */
.footer {
  background: #1e293b;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.footer-description {
  color: #94a3b8;
  line-height: 1.6;
}

.footer-subtitle {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.footer-link {
  display: block;
  color: #94a3b8;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #667eea;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #334155;
  color: #94a3b8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }
  
  .nav-center {
    display: none;
  }
  
  .auth-buttons {
    display: none;
  }
  
  .language-switcher-nav {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .user-points {
    display: none;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0.75rem;
  }
  
  .mobile-menu-content {
    padding: 1.5rem;
  }
  
  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 0.875rem;
  }
}

/* Utility classes */
.desktop-only {
  display: flex;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
}
</style>
