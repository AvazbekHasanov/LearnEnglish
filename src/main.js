import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from './i18n';

import ru from 'element-plus/es/locale/lang/ru'
import uz from '@/i18n/locales/element-plus/uz.js' // you can create this if needed, or fallback to `en`
import en from 'element-plus/es/locale/lang/en'

// Determine which locale to use
const lang = localStorage.getItem('locale') || 'uz'

const localeMap = {
  ru,
  uz,
  en,
}

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.devtools = false
app.config.performance = false
if ( window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  for (const key in window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__[key] = typeof window.__VUE_DEVTOOLS_GLOBAL_HOOK__[key] === 'function'
      ? () => {}
      : null;
  }
}

app.use(ElementPlus, {
  locale: localeMap[lang] || uz,
})
app.use(createPinia())
app.use(router)





app.use(i18n)

app.mount('#app')
