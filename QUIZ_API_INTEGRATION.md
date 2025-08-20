# Quiz API Integration Documentation

## Overview

This document describes the integration of the quiz-controller APIs with the frontend application. The integration includes both user-facing quiz functionality and administrative tools for managing quizzes.

## API Endpoints Integrated

### GET Endpoints
- `GET /api/quiz/grammar?topicId={topicId}&userId={userId}` - Get grammar quizzes for a specific topic
- `GET /api/quiz/vocabulary?topicId={topicId}&userId={userId}` - Get vocabulary quizzes for a specific topic  
- `GET /api/quiz/grammar-result?userId={userId}&grammarTopiId={grammarTopiId}` - Get grammar quiz results

### POST Endpoints
- `POST /api/quiz/vocab` - Submit vocabulary quiz answers
- `POST /api/quiz/grammar` - Submit grammar quiz answers
- `POST /api/quiz/add-vocab/{groupId}/{score}` - Add new vocabulary quizzes (admin)
- `POST /api/quiz/add-grammar/{topicId}/{score}` - Add new grammar quizzes (admin)

## Files Created/Modified

### 1. API Service (`src/services/api.js`)
Updated the `quizAPI` object to include all required endpoints:

```javascript
export const quizAPI = {
  // Get quizzes
  getGrammarQuizzes: (topicId, userId) => apiClient().get(`/quiz/grammar?topicId=${topicId}&userId=${userId}`),
  getVocabularyQuizzes: (topicId, userId) => apiClient().get(`/quiz/vocabulary?topicId=${topicId}&userId=${userId}`),
  getGrammarResult: (userId, grammarTopicId) => apiClient().get(`/quiz/grammar-result?userId=${userId}&grammarTopiId=${grammarTopicId}`),
  
  // Submit quiz answers
  submitVocabQuiz: (quizData) => apiClient().post('/quiz/vocab', quizData),
  submitGrammarQuiz: (quizData) => apiClient().post('/quiz/grammar', quizData),
  
  // Add new quizzes (admin)
  addVocabQuiz: (groupId, score, quizData) => apiClient().post(`/quiz/add-vocab/${groupId}/${score}`, quizData),
  addGrammarQuiz: (topicId, score, quizData) => apiClient().post(`/quiz/add-grammar/${topicId}/${score}`, quizData)
}
```

### 2. Quiz Composable (`src/composables/useQuiz.js`)
Created a comprehensive composable for managing quiz state and logic:

**State Management:**
- `grammarQuizzes`, `vocabularyQuizzes` - Store loaded quizzes
- `currentQuiz`, `currentQuestionIndex` - Track current quiz progress
- `userAnswers`, `quizResults` - Store user responses and results
- `isLoading`, `error` - Handle loading and error states

**Key Methods:**
- `loadGrammarQuizzes(topicId)` - Load grammar quizzes for a topic
- `loadVocabularyQuizzes(topicId)` - Load vocabulary quizzes for a topic
- `startQuiz(quizzes, type)` - Initialize a new quiz session
- `selectAnswer(answer)` - Record user's answer selection
- `submitQuiz(type)` - Submit quiz answers to backend
- `getGrammarResult(grammarTopicId)` - Fetch quiz results
- `getShuffledAnswers(question)` - Randomize answer options
- `isAnswerCorrect(question, answer)` - Check answer correctness
- `getScore()` - Calculate quiz score percentage

### 3. Quiz Component (`src/components/QuizComponent.vue`)
Created a reusable quiz interface component with:

**Features:**
- Quiz type selection (Grammar/Vocabulary)
- Topic selection based on available data
- Interactive question interface with progress tracking
- Answer selection with visual feedback
- Results display with score calculation
- Navigation between questions
- Loading and error states

**UI States:**
- Quiz selection screen
- Question interface with progress bar
- Results screen with detailed statistics
- Loading spinner
- Error handling

### 4. Quiz Admin Page (`src/pages/Quiz/QuizAdmin.vue`)
Created administrative interface for managing quizzes:

**Features:**
- Add grammar quizzes with topic ID and score
- Add vocabulary quizzes with group ID and score
- Dynamic question form with multiple choice options
- Support for multiple correct answers
- Form validation and error handling

**Form Structure:**
```javascript
{
  topicId: number,
  score: number,
  questions: [{
    question: string,
    type: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE',
    correctAnswers: string[],
    otherAnswers: string[]
  }]
}
```

### 5. Games Page Updates (`src/pages/Games.vue`)
Enhanced the games page to integrate quiz functionality:

**Changes:**
- Added quiz games to the games list
- Integrated QuizComponent for quiz gameplay
- Added quiz wrapper with modal overlay
- Updated game selection logic to handle quiz games

### 6. Routing Updates (`src/router/index.js`)
Added new routes:
- `/quiz/admin` - Quiz administration page

### 7. Layout Updates (`src/components/DefaultLayout.vue`)
Added navigation links:
- Quiz Admin link in user dropdown menu

### 8. Internationalization (`src/i18n/locales/en.json`)
Added quiz-related translation keys:
- Quiz selection and navigation
- Results and scoring
- Error messages and loading states

## Data Flow

### User Quiz Flow
1. User navigates to Games page
2. Selects "Grammar Quiz" or "Vocabulary Quiz"
3. Chooses a topic/category
4. Quiz component loads questions from backend
5. User answers questions with navigation
6. Quiz component submits answers to backend
7. Results are displayed with score and statistics

### Admin Quiz Flow
1. Admin navigates to Quiz Admin page
2. Fills out quiz form with questions and answers
3. Submits quiz data to backend
4. Quiz becomes available for users

## API Request/Response Examples

### Get Grammar Quizzes
```javascript
// Request
GET /api/quiz/grammar?topicId=1&userId=2

// Response
[
  {
    "quizId": 1,
    "sectionId": 1,
    "sectionType": "GRAMMAR",
    "question": "What is the correct form of the verb 'to be' in present tense?",
    "type": "MULTIPLE_CHOICE",
    "score": 5,
    "correctAnswers": ["am", "is", "are"],
    "otherAnswers": ["was", "were", "been"],
    "userAnswers": []
  }
]
```

### Submit Quiz Answers
```javascript
// Request
POST /api/quiz/grammar
{
  "quizId": 1,
  "userId": 2,
  "selectedAnswers": ["am", "is", "are"]
}

// Response
{
  "message": "Quiz submitted successfully",
  "success": true
}
```

### Add Grammar Quiz (Admin)
```javascript
// Request
POST /api/quiz/add-grammar/1/10
[
  {
    "question": "What is the correct form of the verb 'to be' in present tense?",
    "type": "MULTIPLE_CHOICE",
    "correctAnswers": ["am", "is", "are"],
    "otherAnswers": ["was", "were", "been"]
  }
]

// Response
{
  "message": "Quiz added successfully",
  "success": true
}
```

## Error Handling

The integration includes comprehensive error handling:

1. **API Errors**: Network failures, server errors, and invalid responses
2. **Validation Errors**: Missing required fields, invalid data formats
3. **User Errors**: Incomplete quiz submissions, navigation issues
4. **Loading States**: Proper loading indicators during API calls

## Security Considerations

1. **Authentication**: All quiz endpoints require valid authentication tokens
2. **Authorization**: Admin endpoints should be restricted to authorized users
3. **Input Validation**: Client-side validation for quiz data
4. **Rate Limiting**: Consider implementing rate limiting for quiz submissions

## Testing

### Manual Testing Steps
1. **User Quiz Flow:**
   - Navigate to Games page
   - Select Grammar Quiz or Vocabulary Quiz
   - Choose a topic
   - Answer questions
   - Submit and view results

2. **Admin Quiz Flow:**
   - Navigate to Quiz Admin page
   - Create a new grammar quiz
   - Create a new vocabulary quiz
   - Verify quizzes appear for users

3. **Error Scenarios:**
   - Test with invalid topic IDs
   - Test with network failures
   - Test with incomplete quiz submissions

### API Testing
Use the provided API endpoints with tools like Postman or curl to verify:
- Quiz retrieval works correctly
- Quiz submission processes answers
- Admin quiz creation functions properly
- Error responses are handled appropriately

## Future Enhancements

1. **Quiz Analytics**: Track user performance and quiz statistics
2. **Adaptive Quizzes**: Adjust difficulty based on user performance
3. **Quiz Templates**: Pre-built quiz templates for common topics
4. **Bulk Operations**: Import/export quiz data
5. **Quiz Scheduling**: Schedule quizzes for specific times
6. **Offline Support**: Cache quizzes for offline usage
7. **Social Features**: Share quiz results, leaderboards
8. **Multimedia Support**: Audio/video questions and answers

## Troubleshooting

### Common Issues
1. **Quiz not loading**: Check API endpoint availability and authentication
2. **Answers not submitting**: Verify request format and required fields
3. **Admin access denied**: Ensure user has proper permissions
4. **Translation missing**: Add missing keys to i18n files

### Debug Tools
- Browser developer tools for network requests
- Console logging in composables
- API response inspection
- Vue devtools for component state

## Conclusion

The quiz API integration provides a complete solution for interactive learning through quizzes. The implementation includes both user-facing quiz functionality and administrative tools, with proper error handling, internationalization, and a responsive user interface.

The modular design allows for easy extension and maintenance, while the comprehensive documentation ensures proper usage and troubleshooting capabilities.
