export const API_ENDPOINTS = {
  // Base URL
  BASE_URL: 'http://16.170.158.74:8081',
  
  // Auth endpoints
  AUTH: {
    SIGN_UP: '/api/auth/sign-up',
    SIGN_IN: '/api/auth/sign-in',
    VERIFY_OTP: '/api/auth/verify',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    RESEND_OTP: '/api/auth/resend-code'
  },
  
  // User endpoints
  USER: {
    PROFILE: '/api/user/profile',
    PROGRESS: '/api/user/progress',
    UPLOAD_IMAGE: '/api/user/upload-image',
    PROFILE_IMAGE: '/api/user/profile-image'
  },
  
  // Level endpoints
  LEVEL: {
    GET_LEVELS: '/api/level',
    ADD_LEVEL: '/api/level/add',
    LEVEL_UP: '/api/level/up'
  },
  
  // Grammar endpoints
  GRAMMAR: {
    LEVELS: '/api/grammar/levels',
    LESSONS: '/api/grammar/lessons',
    MY_LESSONS: '/api/grammar/my-lessons',
    END_LESSON: '/api/grammar/end-lesson'
  },
  
  // Vocabulary endpoints
  VOCABULARY: {
    CATEGORIES: '/api/vocabulary/category',
    WORDS: '/api/vocabulary/words'
  },
  
  // Quiz endpoints
  QUIZ: {
    GRAMMAR_QUIZZES: '/api/quiz/grammar',
    VOCABULARY_QUIZZES: '/api/quiz/vocabulary',
    GRAMMAR_RESULT: '/api/quiz/grammar-result'
  },
  
  // Legacy endpoints
  TICKETS: '/arkhiv-kursov-valyut/json',
  USERS: '/users',
  LOGIN: '/auth/login'
};

// API Response schemas based on the OpenAPI documentation
export const API_SCHEMAS = {
  // Auth schemas
  SignUpRequest: {
    firstname: 'string',
    lastname: 'string',
    email: 'string',
    password: 'string',
    levelId: 'number'
  },
  
  SignInRequest: {
    email: 'string',
    password: 'string'
  },
  
  Token: {
    accessToken: 'string'
  },
  
  Response: {
    message: 'string',
    success: 'boolean'
  },
  
  // User schemas
  UserProfileRes: {
    fullName: 'string',
    email: 'string',
    langLevel: 'string',
    imageUrl: 'string'
  },
  
  UserProgressRes: {
    id: 'number',
    sectionType: 'string', // GRAMMAR, VOCABULARY, GAME, VIDEO, GRAMMAR_AND_QUIZ
    score: 'number',
    completedAt: 'string'
  },
  
  // Grammar schemas
  GrammarRes: {
    id: 'number',
    title: 'string',
    description: 'string',
    videoUrl: 'string',
    rules: 'string',
    example: 'string',
    ended: 'boolean',
    levels: 'Levels',
    assignment: 'string',
    score: 'number',
    createdAt: 'string'
  },
  
  // Vocabulary schemas
  VocabularyGroupsRes: {
    id: 'number',
    title: 'string',
    createdAt: 'string'
  },
  
  VocabularyWordsRes: {
    id: 'number',
    group: 'string',
    word: 'string',
    translation: 'string',
    definition: 'string',
    example: 'string',
    levels: 'string',
    audioUrl: 'string',
    score: 'number',
    createdAt: 'string'
  },
  
  // Quiz schemas
  Quizzes: {
    id: 'number',
    sectionId: 'number',
    sectionType: 'string',
    question: 'string',
    type: 'string', // MULTIPLE_CHOICE, FILL_BLANK, ORDER_WORDS, TRANSLATION
    correctAnswers: 'string[]',
    otherAnswers: 'string[]'
  },
  
  AnswerQuizReq: {
    quizId: 'number',
    userId: 'number',
    selectedAnswers: 'string[]'
  },
  
  GrammarQuizeRes: {
    topicId: 'number',
    topicName: 'string',
    firstname: 'string',
    lastname: 'string',
    correctCount: 'number',
    gainedScore: 'number'
  },
  
  // Level schemas
  Levels: {
    id: 'number',
    level: 'string'
  }
};
