<script setup>

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value)

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

</script>

<template>
  <div class="language-switcher">
    <button 
      class="language-btn"
      :class="{ 'active': currentLocale === 'en' }"
      @click="changeLanguage('en')"
    >
      🇺🇸 EN
    </button>
    <button 
      class="language-btn"
      :class="{ 'active': currentLocale === 'uz' }"
      @click="changeLanguage('uz')"
    >
      🇺🇿 UZ
    </button>
  </div>
</template>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.language-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.language-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.language-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.language-btn.active:hover {
  background: #5a67d8;
  border-color: #5a67d8;
}

@media (max-width: 768px) {
  .language-switcher {
    gap: 0.25rem;
  }
  
  .language-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>