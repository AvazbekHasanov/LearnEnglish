import { createI18n } from 'vue-i18n';
import en from 'element-plus/es/locale/lang/en'; // English locale
import ru from 'element-plus/es/locale/lang/ru'; // Russian locale
import uz from 'element-plus/es/locale/lang/uz-uz'; // Uzbek locale
import customEn from '@/i18n/locales/en.json'; // Custom English translations
import customRu from '@/i18n/locales/ru.json'; // Custom Russian translations
import customUz from '@/i18n/locales/uz.json'; // Custom Uzbek translations

// Define messages
const messages = {
  en: {
    ...customEn,
    $elementPlus: en, // Element Plus English locale
  },
  ru: {
    ...customRu,
    $elementPlus: ru,
  },
  uz: {
    ...customUz,
    $elementPlus: uz, // Element Plus Uzbek locale
  },
};

const currentLocale = localStorage.getItem('locale') ?? 'en';

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: currentLocale, // Use the locale from localStorage
  fallbackLocale: 'uz', // Fallback to 'uz' instead of null for better reliability
  messages,
});

export default i18n;