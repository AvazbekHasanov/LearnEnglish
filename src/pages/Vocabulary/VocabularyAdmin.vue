<template>
  <DefaultLayout>
    <section class="admin-section">
      <div class="container">
        <h1 class="page-title">Vocabulary Admin</h1>

        <div class="grid">
          <!-- Categories -->
          <div class="card">
            <h2 class="card-title">Add Categories</h2>
            <p class="card-subtitle">Create one or more vocabulary categories</p>

            <div class="form-group" v-for="(c, idx) in newCategories" :key="idx">
              <label>Title</label>
              <input v-model="c.title" type="text" placeholder="e.g., Animals" />
            </div>
            <div class="actions">
              <button class="btn" @click="addCategoryField">+ Add another</button>
              <button class="btn btn-primary" :disabled="isLoading" @click="submitCategories">
                {{ isLoading ? 'Saving...' : 'Save Categories' }}
              </button>
            </div>

            <div class="divider"></div>

            <h3 class="list-title">Existing Categories</h3>
            <ul class="list">
              <li v-for="cat in categories" :key="cat.id">{{ cat.title }}</li>
            </ul>
          </div>

          <!-- Words -->
          <div class="card">
            <h2 class="card-title">Add Words</h2>
            <p class="card-subtitle">Add words to a selected category</p>

            <div class="form-group">
              <label>Category</label>
              <select v-model="selectedCategoryId">
                <option disabled value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.title }}
                </option>
              </select>
            </div>

            <div class="form-group" v-for="(w, idx) in newWords" :key="idx">
              <div class="grid-two">
                <div>
                  <label>Word</label>
                  <input v-model="w.word" type="text" placeholder="e.g., Cat" />
                </div>
                <div>
                  <label>Translation</label>
                  <input v-model="w.translation" type="text" placeholder="e.g., Кот" />
                </div>
              </div>
              <div class="grid-two">
                <div>
                  <label>Level</label>
                  <input v-model="w.level" type="text" placeholder="e.g., beginner" />
                </div>
                <div>
                  <label>Score</label>
                  <input v-model.number="w.score" type="number" min="0" />
                </div>
              </div>
              <div class="grid-two">
                <div>
                  <label>Definition</label>
                  <input v-model="w.definition" type="text" placeholder="Short meaning" />
                </div>
                <div>
                  <label>Example</label>
                  <input v-model="w.example" type="text" placeholder="Use in a sentence" />
                </div>
              </div>
              <div class="form-group">
                <label>Audio URL</label>
                <input v-model="w.audioUrl" type="text" placeholder="https://..." />
              </div>
              <div class="row-end">
                <button class="btn btn-danger" @click="removeWordField(idx)">Remove</button>
              </div>
              <div class="small-divider"></div>
            </div>

            <div class="actions">
              <button class="btn" @click="addWordField">+ Add another word</button>
              <button class="btn btn-primary" :disabled="isLoading || !selectedCategoryId" @click="submitWords">
                {{ isLoading ? 'Saving...' : 'Save Words' }}
              </button>
            </div>

            <div class="divider"></div>

            <h3 class="list-title">Words in Selected Category</h3>
            <div class="row-start gap">
              <button class="btn" :disabled="!selectedCategoryId" @click="reloadWords">Reload</button>
            </div>
            <ul class="list">
              <li v-for="w in words" :key="w.id">{{ w.word }} - {{ w.translation }} ({{ w.level }})</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import { useVocabulary } from '@/composables/useVocabulary.js'

const {
  categories,
  words,
  isLoading,
  loadCategories,
  loadWords,
  addCategories,
  addWords
} = useVocabulary()

const newCategories = ref([{ title: '' }])
const selectedCategoryId = ref('')
const newWords = ref([
  { word: '', translation: '', definition: '', level: '', example: '', audioUrl: '', score: 0 }
])

const addCategoryField = () => newCategories.value.push({ title: '' })
const addWordField = () => newWords.value.push({ word: '', translation: '', definition: '', level: '', example: '', audioUrl: '', score: 0 })
const removeWordField = (idx) => newWords.value.splice(idx, 1)

const submitCategories = async () => {
  const payload = newCategories.value.filter(c => c.title && c.title.trim())
  if (payload.length === 0) return
  await addCategories(payload)
  newCategories.value = [{ title: '' }]
}

const submitWords = async () => {
  const categoryId = Number(selectedCategoryId.value)
  if (!categoryId) return
  const payload = newWords.value.filter(w => w.word && w.translation)
  if (payload.length === 0) return
  await addWords(categoryId, payload)
  newWords.value = [{ word: '', translation: '', definition: '', level: '', example: '', audioUrl: '', score: 0 }]
}

const reloadWords = async () => {
  const categoryId = Number(selectedCategoryId.value)
  if (!categoryId) return
  await loadWords(categoryId)
}

onMounted(async () => {
  await loadCategories()
})
</script>

<style scoped>
.admin-section {
  padding: 2rem 0;
}
.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
}
.card-subtitle {
  color: #64748b;
  margin-bottom: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}
input, select {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
}
.grid-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  background: #fff;
  cursor: pointer;
}
.btn-primary {
  background: #667eea;
  color: #fff;
  border-color: #667eea;
}
.btn-danger {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}
.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 1rem 0;
}
.small-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 0.75rem 0;
}
.list-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.list {
  margin: 0;
  padding-left: 1rem;
}
.row-end {
  display: flex;
  justify-content: flex-end;
}
.row-start {
  display: flex;
  justify-content: flex-start;
}
.gap { gap: 0.5rem; }
</style>


