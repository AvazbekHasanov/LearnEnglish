# Grammar Quiz API Integration

This document describes the integration of the grammar quiz API into the Practice.vue component.

## API Endpoints

### GET /api/quiz/grammar
Fetches grammar quizzes for a specific topic and user.

**Parameters:**
- `topicId` (integer, required): The ID of the grammar topic
- `userId` (integer, required): The ID of the user

**Response:**
```json
[
  {
    "quizId": 0,
    "sectionId": 0,
    "sectionType": "GRAMMAR",
    "question": "string",
    "type": "MULTIPLE_CHOICE",
    "score": 0,
    "correctAnswers": ["string"],
    "otherAnswers": ["string"],
    "userAnswers": ["string"]
  }
]
```

### POST /api/quiz/grammar
Submits a user's answer to a grammar quiz question.

**Request Body:**
```json
{
  "quizId": 0,
  "userId": 0,
  "selectedAnswers": ["string"]
}
```

## Question Types Supported

The Practice component now supports all four question types from the API:

1. **MULTIPLE_CHOICE** - Single choice from multiple options
2. **FILL_BLANK** - Text input for completing sentences
3. **ORDER_WORDS** - Drag and drop or click to order words
4. **TRANSLATION** - Multiple choice for translation questions

## Implementation Details

### Practice.vue Component Updates

1. **API Integration**: Added `quizAPI` import and updated `loadPracticeData()` to fetch quizzes from the API
2. **Question Type Handling**: Added support for all four question types with appropriate UI components
3. **Answer Submission**: Implemented `submitAnswer()` function that sends answers to the API after each question
4. **Error Handling**: Added error states and retry functionality
5. **Timer**: Added countdown timer with automatic submission when time runs out

### Key Functions

- `loadPracticeData()`: Fetches quiz data from API using topicId and userId
- `submitAnswer()`: Submits current answer to API before moving to next question
- `selectMultipleAnswers()`: Handles multiple answer selection for ORDER_WORDS and TRANSLATION types
- `calculateResults()`: Calculates final score and determines pass/fail status

### Navigation Updates

Updated `LessonDetail.vue` to pass `topicId` parameter when navigating to practice:

```javascript
const startPractice = () => {
  router.push(`/practice/${lessonId.value}?topicId=${lesson.value.id}`)
}
```

## Usage

1. Navigate to a lesson detail page
2. Click "Start Practice" button
3. The practice component will:
   - Fetch quiz questions for the lesson's topic
   - Display questions one by one with appropriate UI for each type
   - Submit answers to the API after each question
   - Show results and calculate final score
   - Award points if passing score is achieved

## Error Handling

- Network errors are caught and displayed to user with retry option
- Empty answers are not submitted to avoid API errors
- Timer automatically submits quiz when time runs out
- Fallback to local data if API is unavailable

## Future Enhancements

- Add progress persistence across browser sessions
- Implement question randomization
- Add detailed answer explanations
- Support for adaptive difficulty based on user performance
