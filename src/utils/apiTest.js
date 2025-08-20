import axios from 'axios'

// Test function to verify API configuration
export const testApiConfiguration = async () => {
  console.log('=== API Configuration Test ===')
  console.log('Environment:', import.meta.env.MODE)
  console.log('Base URL in dev:', import.meta.env.DEV ? '/api' : 'http://16.170.158.74:8081/api')
  
     const testUrls = [
     '/api/grammar/lessons',
     '/api/grammar/levels',
     '/api/grammar/my-lessons?userId=2&levelId=1',
     '/api/grammar/topic-list'
   ]
  
  for (const url of testUrls) {
    try {
      console.log(`\nTesting: ${url}`)
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      })
      console.log(`✅ Success: ${response.status} - ${response.data?.length || 0} items`)
    } catch (error) {
      console.error(`❌ Error: ${error.message}`)
      console.error(`Status: ${error.response?.status}`)
      console.error(`Data:`, error.response?.data)
    }
  }
}

// Test direct API call (bypassing proxy)
export const testDirectApiCall = async () => {
  console.log('\n=== Direct API Call Test ===')
  
  try {
    const response = await axios.get('http://16.170.158.74:8081/api/grammar/lessons', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    })
    console.log(`✅ Direct call success: ${response.status} - ${response.data?.length || 0} items`)
    return response.data
  } catch (error) {
    console.error(`❌ Direct call error: ${error.message}`)
    console.error(`Status: ${error.response?.status}`)
    return null
  }
}

// Test proxy call
export const testProxyCall = async () => {
  console.log('\n=== Proxy Call Test ===')
  
  try {
    const response = await axios.get('/api/grammar/lessons', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    })
    console.log(`✅ Proxy call success: ${response.status} - ${response.data?.length || 0} items`)
    return response.data
  } catch (error) {
    console.error(`❌ Proxy call error: ${error.message}`)
    console.error(`Status: ${error.response?.status}`)
    return null
  }
}

// Test my-lessons endpoint specifically
export const testMyLessonsEndpoint = async () => {
  console.log('\n=== My Lessons Endpoint Test ===')
  
  try {
    const response = await axios.get('/api/grammar/my-lessons?userId=2&levelId=1', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    })
    console.log(`✅ My lessons call success: ${response.status} - ${response.data?.length || 0} items`)
    return response.data
  } catch (error) {
    console.error(`❌ My lessons call error: ${error.message}`)
    console.error(`Status: ${error.response?.status}`)
    console.error(`Data:`, error.response?.data)
    return null
  }
}
