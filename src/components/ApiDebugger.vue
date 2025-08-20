<template>
  <div class="api-debugger">
    <h3>API Debugger</h3>
    
    <div class="debug-section">
      <h4>Test Grammar API Calls</h4>
      
      <div class="test-buttons">
        <button @click="testGetLessons" :disabled="isLoading">
          {{ isLoading ? 'Testing...' : 'Test GET /api/grammar/lessons' }}
        </button>
        
        <button @click="testGetLevels" :disabled="isLoading">
          {{ isLoading ? 'Testing...' : 'Test GET /api/grammar/levels' }}
        </button>
        
                 <button @click="testGetTopicList" :disabled="isLoading">
           {{ isLoading ? 'Testing...' : 'Test GET /api/grammar/topic-list' }}
         </button>
         
         <button @click="testGetMyLessons" :disabled="isLoading">
           {{ isLoading ? 'Testing...' : 'Test GET /api/grammar/my-lessons' }}
         </button>
      </div>
      
      <div v-if="result" class="result-section">
        <h5>Result:</h5>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
      
      <div v-if="error" class="error-section">
        <h5>Error:</h5>
        <pre>{{ error }}</pre>
      </div>
    </div>
    
         <div class="debug-section">
       <h4>Raw Axios Test</h4>
       <button @click="testRawAxios" :disabled="isLoading">
         {{ isLoading ? 'Testing...' : 'Test Raw Axios Call' }}
       </button>
     </div>
     
     <div class="debug-section">
       <h4>Configuration Tests</h4>
       <div class="test-buttons">
         <button @click="runApiConfigurationTest" :disabled="isLoading">
           {{ isLoading ? 'Testing...' : 'Test API Configuration' }}
         </button>
         <button @click="runDirectApiTest" :disabled="isLoading">
           {{ isLoading ? 'Testing...' : 'Test Direct API Call' }}
         </button>
         <button @click="runProxyTest" :disabled="isLoading">
           {{ isLoading ? 'Testing...' : 'Test Proxy Call' }}
         </button>
         
         <button @click="runMyLessonsTest" :disabled="isLoading">
           {{ isLoading ? 'Testing...' : 'Test My Lessons Endpoint' }}
         </button>
         
         <button @click="checkAuthStatus" :disabled="isLoading">
           {{ isLoading ? 'Checking...' : 'Check Auth Status' }}
         </button>
       </div>
     </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { grammarAPI } from '@/services/api.js'
import axios from 'axios'
import { testApiConfiguration, testDirectApiCall, testProxyCall, testMyLessonsEndpoint } from '@/utils/apiTest.js'

const isLoading = ref(false)
const result = ref(null)
const error = ref(null)

const clearResults = () => {
  result.value = null
  error.value = null
}

const testGetLessons = async () => {
  clearResults()
  isLoading.value = true
  
  try {
    console.log('Testing GET /api/grammar/lessons...')
    const response = await grammarAPI.getLessons()
    result.value = response.data
    console.log('Success:', response.data)
  } catch (err) {
    error.value = {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      headers: err.response?.headers
    }
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

const testGetLevels = async () => {
  clearResults()
  isLoading.value = true
  
  try {
    console.log('Testing GET /api/grammar/levels...')
    const response = await grammarAPI.getLevels()
    result.value = response.data
    console.log('Success:', response.data)
  } catch (err) {
    error.value = {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      headers: err.response?.headers
    }
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

const testGetTopicList = async () => {
  clearResults()
  isLoading.value = true
  
  try {
    console.log('Testing GET /api/grammar/topic-list...')
    const response = await grammarAPI.getTopicList()
    result.value = response.data
    console.log('Success:', response.data)
  } catch (err) {
    error.value = {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      headers: err.response?.headers
    }
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

const testGetMyLessons = async () => {
  clearResults()
  isLoading.value = true
  
  try {
    console.log('Testing GET /api/grammar/my-lessons...')
    const response = await grammarAPI.getMyLessons(2, 1)
    result.value = response.data
    console.log('Success:', response.data)
  } catch (err) {
    error.value = {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      headers: err.response?.headers
    }
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

const testRawAxios = async () => {
  clearResults()
  isLoading.value = true
  
  try {
    console.log('Testing raw axios call...')
    const response = await axios.get('/api/grammar/lessons', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    result.value = response.data
    console.log('Success:', response.data)
  } catch (err) {
    error.value = {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      headers: err.response?.headers
    }
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

const runApiConfigurationTest = async () => {
  clearResults()
  isLoading.value = true
  await testApiConfiguration()
  isLoading.value = false
}

const runDirectApiTest = async () => {
  clearResults()
  isLoading.value = true
  const data = await testDirectApiCall()
  if (data) {
    result.value = data
  }
  isLoading.value = false
}

const runProxyTest = async () => {
  clearResults()
  isLoading.value = true
  const data = await testProxyCall()
  if (data) {
    result.value = data
  }
  isLoading.value = false
}

const runMyLessonsTest = async () => {
  clearResults()
  isLoading.value = true
  const data = await testMyLessonsEndpoint()
  if (data) {
    result.value = data
  }
  isLoading.value = false
}

const checkAuthStatus = async () => {
  clearResults()
  isLoading.value = true
  
  const token = localStorage.getItem('accessToken')
  const authStatus = {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'No token',
    isAuthenticated: false
  }
  
  if (token) {
    try {
      // Try to decode the token
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
        const decoded = JSON.parse(payload)
        authStatus.isAuthenticated = decoded.exp > Date.now() / 1000
        authStatus.userId = decoded.userId
        authStatus.exp = new Date(decoded.exp * 1000).toISOString()
      }
    } catch (err) {
      console.error('Token decode error:', err)
    }
  }
  
  result.value = authStatus
  isLoading.value = false
}
</script>

<style scoped>
.api-debugger {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin: 1rem 0;
  background: #f9fafb;
}

.debug-section {
  margin-bottom: 2rem;
}

.debug-section h4 {
  margin-bottom: 1rem;
  color: #374151;
}

.test-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.test-buttons button {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.test-buttons button:hover:not(:disabled) {
  background: #5a67d8;
}

.test-buttons button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-section,
.error-section {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background: white;
  border: 1px solid #e5e7eb;
}

.result-section h5 {
  color: #059669;
  margin-bottom: 0.5rem;
}

.error-section h5 {
  color: #dc2626;
  margin-bottom: 0.5rem;
}

pre {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
