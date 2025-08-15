# API Integration Documentation

This document outlines the complete API integration for the LearnEnglish Vue.js application with the LingMaster backend API.

## API Base URL
```
http://16.170.158.74:8081
```

## Authentication Flow

### 1. User Registration (Sign Up)
- **Endpoint**: `POST /api/auth/sign-up`
- **Request Body**:
  ```json
  {
    "firstname": "string",
    "lastname": "string", 
    "email": "string",
    "password": "string",
    "levelId": "number"
  }
  ```
- **Response**: `{ "message": "string", "success": "boolean" }`
- **Flow**: User fills signup form → OTP sent to email → User verifies OTP → Account activated

### 2. User Login (Sign In)
- **Endpoint**: `POST /api/auth/sign-in`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: `{ "accessToken": "string" }`
- **Flow**: User enters credentials → JWT token returned → Token stored in localStorage

### 3. OTP Verification
- **Endpoint**: `POST /api/auth/verify`
- **Parameters**: `email` and `code`
- **Response**: `{ "message": "string", "success": "boolean" }`

### 4. Password Reset
- **Forgot Password**: `POST /api/auth/forgot-password?email={email}`
- **Reset Password**: `POST /api/auth/reset-password?email={email}&newPassword={password}`

## User Management

### 1. User Profile
- **Get Profile**: `GET /api/user/profile?userId={userId}`
- **Response**:
  ```json
  {
    "fullName": "string",
    "email": "string", 
    "langLevel": "string",
    "imageUrl": "string"
  }
  ```

### 2. User Progress
- **Get Progress**: `GET /api/user/progress?userId={userId}`
- **Response**: Array of progress items
  ```json
  [
    {
      "id": "number",
      "sectionType": "string", // GRAMMAR, VOCABULARY, GAME, VIDEO, GRAMMAR_AND_QUIZ
      "score": "number",
      "completedAt": "string"
    }
  ]
  ```

### 3. Profile Image
- **Upload Image**: `POST /api/user/upload-image?userId={userId}`
- **Get Image**: `GET /api/user/profile-image/{userId}`

## Learning Content

### 1. Grammar Lessons
- **Get Levels**: `GET /api/grammar/levels`
- **Get All Lessons**: `GET /api/grammar/lessons`
- **Get User Lessons**: `GET /api/grammar/my-lessons?userId={userId}`
- **End Lesson**: `POST /api/grammar/end-lesson?userId={userId}&topicId={topicId}`

### 2. Vocabulary
- **Get Categories**: `GET /api/vocabulary/category`
- **Get Words**: `GET /api/vocabulary/words?groupId={groupId}`

### 3. Quizzes
- **Grammar Quizzes**: `GET /api/quiz/grammar?topicId={topicId}`
- **Vocabulary Quizzes**: `GET /api/quiz/vocabulary?topicId={topicId}`
- **Answer Quiz**: `POST /api/quiz/grammar`
- **Get Quiz Result**: `GET /api/quiz/grammar-result?userId={userId}&grammarTopiId={topicId}`

## Level Management

### 1. Levels
- **Get Levels**: `GET /api/level`
- **Add Level**: `POST /api/level/add?level={level}`
- **Level Up**: `PUT /api/level/up?userId={userId}&nextLevel={level}`

## Implementation Details

### 1. API Service (`src/services/api.js`)
- Centralized API client with axios
- Automatic token management
- Error handling and interceptors
- Organized by feature (auth, user, grammar, vocabulary, quiz, level)

### 2. User Store (`src/stores/userStore.js`)
- Pinia store for user state management
- API integration for all user operations
- Local storage persistence
- Achievement system integration

### 3. Updated Pages

#### Profile Page (`src/pages/User/Profile.vue`)
- ✅ Real user data loading from API
- ✅ Profile image upload functionality
- ✅ Profile information updates
- ✅ Settings management
- ✅ Password change functionality

#### Progress Page (`src/pages/User/Progress.vue`)
- ✅ Real progress data from API
- ✅ Dynamic statistics calculation
- ✅ Study history tracking
- ✅ Weekly activity visualization
- ✅ Level progress tracking

#### Achievements Page (`src/pages/User/Achievements.vue`)
- ✅ Achievement progress calculation
- ✅ Real-time progress updates
- ✅ Category filtering
- ✅ Achievement unlocking system

#### Leaderboard Page (`src/pages/User/Leaderboard.vue`)
- ✅ Current user integration
- ✅ Rank calculation
- ✅ User statistics display
- ✅ Period filtering (weekly, monthly, all-time)

### 4. Authentication Pages
- ✅ Signup with OTP verification
- ✅ Login with JWT token
- ✅ Password reset functionality
- ✅ Form validation and error handling

## Error Handling

### 1. API Error Interceptors
- Automatic 401 handling (redirect to login)
- Token expiration management
- Network error handling

### 2. User Feedback
- Loading states for all API calls
- Success/error messages using Element Plus
- Form validation with real-time feedback

## Security Features

### 1. JWT Token Management
- Automatic token inclusion in requests
- Token storage in localStorage
- Automatic logout on token expiration

### 2. Form Validation
- Client-side validation for all forms
- Server-side error handling
- Secure password requirements

## Data Flow

### 1. User Authentication
```
User Input → Form Validation → API Call → Token Storage → Redirect
```

### 2. Data Loading
```
Page Load → Check Authentication → Load User Data → Update UI
```

### 3. Data Updates
```
User Action → API Call → Update Store → Update UI → Save to LocalStorage
```

## Testing the Integration

### 1. Registration Flow
1. Navigate to `/auth/signup`
2. Fill in registration form
3. Verify OTP sent to email
4. Complete registration

### 2. Login Flow
1. Navigate to `/auth/login`
2. Enter credentials
3. Verify successful login and token storage

### 3. Profile Management
1. Navigate to `/user/profile`
2. Verify user data loads correctly
3. Test profile image upload
4. Test profile information updates

### 4. Progress Tracking
1. Navigate to `/user/progress`
2. Verify progress data displays
3. Check statistics calculations

## Future Enhancements

### 1. Real-time Features
- WebSocket integration for live leaderboard updates
- Real-time notifications
- Live chat support

### 2. Advanced Analytics
- Detailed learning analytics
- Performance tracking
- Personalized recommendations

### 3. Social Features
- Friend system
- Study groups
- Social sharing

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from frontend domain
2. **Token Issues**: Check localStorage for valid token
3. **API Errors**: Verify API endpoints are correct and server is running
4. **Data Loading**: Check network tab for failed requests

### Debug Tools

1. **Browser DevTools**: Network tab for API calls
2. **Vue DevTools**: Component state inspection
3. **Console Logs**: Error tracking and debugging

## API Documentation Reference

The complete API documentation is available at:
```
http://16.170.158.74:8081/v3/api-docs
```

This integration provides a complete, production-ready connection between the Vue.js frontend and the LingMaster backend API, with proper error handling, user feedback, and data persistence.
