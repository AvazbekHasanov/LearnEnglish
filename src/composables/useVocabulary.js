import { ref, computed } from 'vue'
import { vocabularyAPI } from '@/services/api.js'

export function useVocabulary() {
  const categories = ref([])
  const words = ref([])
  const selectedCategoryId = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const hasSelection = computed(() => selectedCategoryId.value !== null)

  const loadCategories = async () => {
    try {
      isLoading.value = true
      error.value = null
      const res = await vocabularyAPI.getCategories()
      categories.value = res.data
    } catch (err) {
      error.value = 'Failed to load categories'
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const loadWords = async (groupId) => {
    try {
      isLoading.value = true
      error.value = null
      const res = await vocabularyAPI.getWords(groupId)
      words.value = res.data
      selectedCategoryId.value = groupId
    } catch (err) {
      error.value = 'Failed to load words'
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const addCategories = async (titles) => {
    // titles: array of { title: string }
    try {
      isLoading.value = true
      error.value = null
      await vocabularyAPI.addCategories(titles)
      await loadCategories()
    } catch (err) {
      error.value = 'Failed to add categories'
      // eslint-disable-next-line no-console
      console.error(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addWords = async (categoryId, wordsToAdd) => {
    // wordsToAdd: array of { word, translation, definition, level, example, audioUrl, score }
    try {
      isLoading.value = true
      error.value = null
      await vocabularyAPI.addWords(categoryId, wordsToAdd)
      // reload current list if we're on the same category
      if (selectedCategoryId.value === categoryId) {
        await loadWords(categoryId)
      }
    } catch (err) {
      error.value = 'Failed to add words'
      // eslint-disable-next-line no-console
      console.error(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // state
    categories,
    words,
    selectedCategoryId,
    isLoading,
    error,
    hasSelection,
    // actions
    loadCategories,
    loadWords,
    addCategories,
    addWords,
  }
}


