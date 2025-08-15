# LearnEnglish - Vue.js Learning Platform

A modern English learning platform built with Vue.js and integrated with the LingMaster backend API.

## Features

- **Authentication System**: Complete sign up, sign in, and password reset functionality
- **Grammar Lessons**: Interactive grammar lessons with progress tracking
- **Vocabulary Builder**: Thematic word categories with audio pronunciation
- **User Progress**: Track learning progress and achievements
- **Responsive Design**: Modern UI that works on all devices
- **API Integration**: Fully integrated with LingMaster backend

## Backend Integration

This application is integrated with the LingMaster backend API:

- **Base URL**: `http://16.170.158.74:8081`
- **API Documentation**: [Swagger UI](http://16.170.158.74:8081/api/swagger-ui/index.html)
- **OpenAPI Spec**: [API Docs](http://16.170.158.74:8081/v3/api-docs)

### API Endpoints

#### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/verify` - OTP verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/resend-code` - Resend OTP

#### User Management
- `GET /api/user/profile` - Get user profile
- `GET /api/user/progress` - Get user progress
- `POST /api/user/upload-image` - Upload profile image
- `GET /api/user/profile-image/{userId}` - Get profile image

#### Grammar
- `GET /api/grammar/levels` - Get grammar levels
- `GET /api/grammar/lessons` - Get all grammar lessons
- `GET /api/grammar/my-lessons` - Get user's grammar lessons
- `POST /api/grammar/end-lesson` - Complete a lesson

#### Vocabulary
- `GET /api/vocabulary/category` - Get vocabulary categories
- `GET /api/vocabulary/words` - Get words by category

#### Quizzes
- `GET /api/quiz/grammar` - Get grammar quizzes
- `GET /api/quiz/vocabulary` - Get vocabulary quizzes
- `POST /api/quiz/grammar` - Submit quiz answers

## Authentication & Security

### Protected Routes
The following pages require authentication:
- `/grammar` - Grammar lessons
- `/vocabulary` - Vocabulary builder
- `/games` - Learning games
- `/lesson/:id` - Individual lessons
- `/practice/:lessonId` - Practice sessions
- `/profile` - User profile
- `/progress` - Learning progress
- `/achievements` - User achievements
- `/planner` - Study planner

### Public Routes
- `/` - Home page
- `/auth/login` - Login page
- `/auth/signup` - Registration page
- `/auth/password-reset` - Password reset
- `/leaderboard` - Public leaderboard
- `/contact` - Contact page

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LearnEnglish
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Vue components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Learning/       # Learning pages
│   └── User/           # User profile pages
├── services/           # API services
├── stores/             # Pinia stores
├── router/             # Vue Router configuration
└── assets/             # Static assets
```

## API Service Structure

The application uses a modular API service structure:

- `authAPI` - Authentication endpoints
- `userAPI` - User management endpoints
- `grammarAPI` - Grammar lesson endpoints
- `vocabularyAPI` - Vocabulary endpoints
- `quizAPI` - Quiz endpoints

## State Management

The application uses Pinia for state management with the following stores:

- `userStore` - User authentication and profile data
- `overallStore` - Global application state
- `counterStore` - Example store (can be removed)

## Technologies Used

- **Frontend**: Vue.js 3, Vite, Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **UI Components**: Custom components with Tailwind CSS
- **Authentication**: JWT tokens with localStorage

## Development

### Adding New API Endpoints

1. Add the endpoint to the appropriate API service in `src/services/api.js`
2. Create corresponding store actions if needed
3. Update components to use the new endpoints

### Adding New Protected Routes

1. Add the route to `src/router/index.js`
2. Set `requiresAuth: true` in the route meta
3. The router guard will automatically handle authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions about the API integration, please refer to the [LingMaster API documentation](http://16.170.158.74:8081/api/swagger-ui/index.html).
