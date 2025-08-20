# Grammar API Integration

This document describes the integration of grammar-related APIs with the frontend application.

## API Endpoints Integrated

### 1. GET `/api/grammar/levels`
- **Purpose**: Get all grammar levels available
- **Response**: Array of level objects with `id` and `level` properties
- **Usage**: Used in Grammar page to display available levels and in admin page for lesson creation

### 2. GET `/api/grammar/lessons`
- **Purpose**: Get all grammar lessons available
- **Response**: Array of lesson objects with complete lesson data
- **Usage**: Used in Grammar page to display lessons and in LessonDetail page to load specific lesson data

### 3. GET `/api/grammar/my-lessons`
- **Purpose**: Get all grammar lessons of a user
- **Parameters**: 
  - `userId` (required): User ID
  - `levelId` (required): Level ID
- **Response**: Array of user's lesson objects with completion status
- **Usage**: Used to track user progress and display completed lessons

### 4. POST `/api/grammar/end-lesson`
- **Purpose**: Mark a lesson as completed for a user
- **Parameters**:
  - `userId` (required): User ID
  - `topicId` (required): Lesson ID
- **Response**: Success message
- **Usage**: Called when user completes a lesson

### 5. POST `/api/grammar/add-list`
- **Purpose**: Add new grammar lessons (admin functionality)
- **Request Body**: Array of lesson objects
- **Response**: Success message
- **Usage**: Used in admin page to create new lessons

### 6. GET `/api/grammar/topic-list`
- **Purpose**: Get list of grammar topics
- **Response**: Array of topic objects with `id` and `title`
- **Usage**: Used in admin page to display available topics

## Frontend Implementation

### 1. API Service (`src/services/api.js`)
Updated the `grammarAPI` object to include all endpoints:

```javascript
export const grammarAPI = {
  getLevels: () => apiClient().get('/api/grammar/levels'),
  getLessons: () => apiClient().get('/api/grammar/lessons'),
  getMyLessons: (userId, levelId) => apiClient().get(`/api/grammar/my-lessons?userId=${userId}&levelId=${levelId}`),
  endLesson: (userId, topicId) => apiClient().post(`/api/grammar/end-lesson?userId=${userId}&topicId=${topicId}`),
  addList: (lessons) => apiClient().post('/api/grammar/add-list', lessons),
  getTopicList: () => apiClient().get('/api/grammar/topic-list')
}
```

### 2. Grammar Composable (`src/composables/useGrammar.js`)
Created a composable to manage grammar state and API calls:

- **State Management**: Manages grammar levels, lessons, user lessons, and loading states
- **Computed Properties**: Provides calculated values like progress percentages and completed lessons
- **API Methods**: Wraps all grammar API calls with error handling
- **Helper Methods**: Provides utility functions for lesson management

### 3. Updated Components

#### Grammar Page (`src/pages/Grammar.vue`)
- Uses the grammar composable for state management
- Displays grammar levels and lessons
- Shows user progress and completion status
- Filters lessons by selected category

#### Lesson Detail Page (`src/pages/Learning/LessonDetail.vue`)
- Loads lesson data from API
- Displays lesson content including video, rules, and examples
- Integrates with lesson completion API

#### Grammar Admin Page (`src/pages/Grammar/GrammarAdmin.vue`)
- New admin interface for managing grammar lessons
- Form for adding new lessons with all required fields
- Displays existing lessons and topic list
- Uses the add-list API for lesson creation

### 4. Routing
Added route for grammar admin page:
```javascript
{
  path: '/grammar/admin',
  name: 'GrammarAdmin',
  component: GrammarAdmin,
  meta: {
    requiresAuth: true,
    title: 'Grammar Admin - LearnEnglish'
  }
}
```

## Data Flow

1. **Page Load**: Components call `loadAllData()` from the composable
2. **API Calls**: Composable makes parallel API calls to load levels, lessons, and user data
3. **State Updates**: API responses update reactive state in the composable
4. **UI Updates**: Components reactively update based on state changes
5. **User Actions**: User interactions trigger API calls (e.g., completing lessons)

## Error Handling

- All API calls include try-catch blocks
- Error states are managed in the composable
- User-friendly error messages are displayed
- Failed API calls are logged for debugging

## Features Implemented

### For Users:
- View all grammar levels and lessons
- Track progress and completion status
- Complete lessons and earn scores
- Filter lessons by level

### For Admins:
- Add new grammar lessons
- View existing lessons and topics
- Manage lesson content and metadata

## Future Enhancements

1. **Edit/Delete Lessons**: Add functionality to edit and delete existing lessons
2. **Bulk Operations**: Support for bulk lesson creation
3. **Advanced Filtering**: More sophisticated lesson filtering options
4. **Progress Analytics**: Detailed progress tracking and analytics
5. **Offline Support**: Cache lesson data for offline access

## Testing

To test the integration:

1. **User Flow**:
   - Navigate to `/grammar`
   - Select a level and view lessons
   - Click on a lesson to view details
   - Complete the lesson

2. **Admin Flow**:
   - Navigate to `/grammar/admin`
   - Fill out the lesson creation form
   - Submit to create a new lesson
   - Verify the lesson appears in the main grammar page

3. **API Testing**:
   - Check browser network tab for API calls
   - Verify correct request/response formats
   - Test error scenarios (network issues, invalid data)
