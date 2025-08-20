<template>
  <DefaultLayout>
    <section class="admin-section">
      <div class="container">
        <h1 class="page-title">Quiz Admin</h1>

        <div class="grid">
          <!-- Grammar Quiz -->
          <div class="card">
            <h2 class="card-title">Add Grammar Quiz</h2>
            <p class="card-subtitle">Create grammar quizzes for specific topics</p>

            <div class="form-group">
              <label>Topic ID</label>
              <input v-model.number="grammarForm.topicId" type="number" placeholder="e.g., 1" />
            </div>

            <div class="form-group">
              <label>Score</label>
              <input v-model.number="grammarForm.score" type="number" placeholder="e.g., 10" />
            </div>

            <div class="form-group" v-for="(q, idx) in grammarForm.questions" :key="idx">
              <h4>Question {{ idx + 1 }}</h4>
              
              <div class="form-group">
                <label>Question</label>
                <textarea v-model="q.question" placeholder="Enter the question text" rows="3"></textarea>
              </div>

              <div class="form-group">
                <label>Question Type</label>
                <select v-model="q.type">
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="SINGLE_CHOICE">Single Choice</option>
                </select>
              </div>

              <div class="form-group">
                <label>Correct Answers (one per line)</label>
                <textarea v-model="q.correctAnswersText" placeholder="Enter correct answers, one per line" rows="3"></textarea>
              </div>

              <div class="form-group">
                <label>Other Answers (one per line)</label>
                <textarea v-model="q.otherAnswersText" placeholder="Enter other answer options, one per line" rows="3"></textarea>
              </div>

              <div class="row-end">
                <button class="btn btn-danger" @click="removeGrammarQuestion(idx)">Remove Question</button>
              </div>
              <div class="small-divider"></div>
            </div>

            <div class="actions">
              <button class="btn" @click="addGrammarQuestion">+ Add Question</button>
              <button class="btn btn-primary" :disabled="isLoading" @click="submitGrammarQuiz">
                {{ isLoading ? 'Saving...' : 'Save Grammar Quiz' }}
              </button>
            </div>
          </div>

          <!-- Vocabulary Quiz -->
          <div class="card">
            <h2 class="card-title">Add Vocabulary Quiz</h2>
            <p class="card-subtitle">Create vocabulary quizzes for specific groups</p>

            <div class="form-group">
              <label>Group ID</label>
              <input v-model.number="vocabForm.groupId" type="number" placeholder="e.g., 1" />
            </div>

            <div class="form-group">
              <label>Score</label>
              <input v-model.number="vocabForm.score" type="number" placeholder="e.g., 10" />
            </div>

            <div class="form-group" v-for="(q, idx) in vocabForm.questions" :key="idx">
              <h4>Question {{ idx + 1 }}</h4>
              
              <div class="form-group">
                <label>Question</label>
                <textarea v-model="q.question" placeholder="Enter the question text" rows="3"></textarea>
              </div>

              <div class="form-group">
                <label>Question Type</label>
                <select v-model="q.type">
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="SINGLE_CHOICE">Single Choice</option>
                </select>
              </div>

              <div class="form-group">
                <label>Correct Answers (one per line)</label>
                <textarea v-model="q.correctAnswersText" placeholder="Enter correct answers, one per line" rows="3"></textarea>
              </div>

              <div class="form-group">
                <label>Other Answers (one per line)</label>
                <textarea v-model="q.otherAnswersText" placeholder="Enter other answer options, one per line" rows="3"></textarea>
              </div>

              <div class="row-end">
                <button class="btn btn-danger" @click="removeVocabQuestion(idx)">Remove Question</button>
              </div>
              <div class="small-divider"></div>
            </div>

            <div class="actions">
              <button class="btn" @click="addVocabQuestion">+ Add Question</button>
              <button class="btn btn-primary" :disabled="isLoading" @click="submitVocabQuiz">
                {{ isLoading ? 'Saving...' : 'Save Vocabulary Quiz' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import { quizAPI } from '@/services/api.js'

const isLoading = ref(false)

const grammarForm = ref({
  topicId: null,
  score: 10,
  questions: [{
    question: '',
    type: 'MULTIPLE_CHOICE',
    correctAnswersText: '',
    otherAnswersText: ''
  }]
})

const vocabForm = ref({
  groupId: null,
  score: 10,
  questions: [{
    question: '',
    type: 'MULTIPLE_CHOICE',
    correctAnswersText: '',
    otherAnswersText: ''
  }]
})

const addGrammarQuestion = () => {
  grammarForm.value.questions.push({
    question: '',
    type: 'MULTIPLE_CHOICE',
    correctAnswersText: '',
    otherAnswersText: ''
  })
}

const removeGrammarQuestion = (idx) => {
  grammarForm.value.questions.splice(idx, 1)
}

const addVocabQuestion = () => {
  vocabForm.value.questions.push({
    question: '',
    type: 'MULTIPLE_CHOICE',
    correctAnswersText: '',
    otherAnswersText: ''
  })
}

const removeVocabQuestion = (idx) => {
  vocabForm.value.questions.splice(idx, 1)
}

const processQuestions = (questions) => {
  return questions.map(q => ({
    question: q.question,
    type: q.type,
    correctAnswers: q.correctAnswersText.split('\n').filter(a => a.trim()),
    otherAnswers: q.otherAnswersText.split('\n').filter(a => a.trim())
  }))
}

const submitGrammarQuiz = async () => {
  if (!grammarForm.value.topicId || !grammarForm.value.score) {
    alert('Please fill in Topic ID and Score')
    return
  }

  const questions = processQuestions(grammarForm.value.questions)
  if (questions.length === 0) {
    alert('Please add at least one question')
    return
  }

  try {
    isLoading.value = true
    await quizAPI.addGrammarQuiz(grammarForm.value.topicId, grammarForm.value.score, questions)
    alert('Grammar quiz added successfully!')
    
    // Reset form
    grammarForm.value = {
      topicId: null,
      score: 10,
      questions: [{
        question: '',
        type: 'MULTIPLE_CHOICE',
        correctAnswersText: '',
        otherAnswersText: ''
      }]
    }
  } catch (error) {
    console.error('Failed to add grammar quiz:', error)
    alert('Failed to add grammar quiz')
  } finally {
    isLoading.value = false
  }
}

const submitVocabQuiz = async () => {
  if (!vocabForm.value.groupId || !vocabForm.value.score) {
    alert('Please fill in Group ID and Score')
    return
  }

  const questions = processQuestions(vocabForm.value.questions)
  if (questions.length === 0) {
    alert('Please add at least one question')
    return
  }

  try {
    isLoading.value = true
    await quizAPI.addVocabQuiz(vocabForm.value.groupId, vocabForm.value.score, questions)
    alert('Vocabulary quiz added successfully!')
    
    // Reset form
    vocabForm.value = {
      groupId: null,
      score: 10,
      questions: [{
        question: '',
        type: 'MULTIPLE_CHOICE',
        correctAnswersText: '',
        otherAnswersText: ''
      }]
    }
  } catch (error) {
    console.error('Failed to add vocabulary quiz:', error)
    alert('Failed to add vocabulary quiz')
  } finally {
    isLoading.value = false
  }
}
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
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
label {
  font-weight: 600;
  color: #374151;
}
input, select, textarea {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}
textarea {
  resize: vertical;
  min-height: 80px;
}
.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.btn {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  background: #fff;
  cursor: pointer;
  font-size: 0.875rem;
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
.row-end {
  display: flex;
  justify-content: flex-end;
}
h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0.5rem 0;
}
</style>
