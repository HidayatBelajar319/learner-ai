export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  profile: UserProfile;
  preferences: UserPreferences;
  role: 'student' | 'teacher' | 'admin';
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  school?: string;
  grade?: string;
  birth_date?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  learning_style?: string;
  notifications: boolean;
}

export interface AuthPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Omit<User, 'password_hash'>;
    token: string;
  };
  errors?: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface LearningSession {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  level: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  started_at: string;
  ended_at?: string;
}

export interface Content {
  id: string;
  title: string;
  subject: string;
  topic: string;
  level: string;
  type: 'theory' | 'exercise' | 'quiz' | 'project';
  format: 'markdown' | 'html' | 'json';
  data?: string;
  metadata: ContentMetadata;
  created_at: string;
  updated_at: string;
}

export interface ContentMetadata {
  duration?: string;
  difficulty?: string;
  prerequisites?: string[];
  learning_objectives?: string[];
  tags?: string[];
}

export interface UserXP {
  id: string;
  user_id: string;
  total_xp: number;
  level: number;
  last_updated: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_login: string;
}

export interface Env {
  LEARNER_DB: D1Database;
  LEARNER_STORAGE: R2Bucket;
  LEARNER_SESSION: KVNamespace;
  LEARNER_CACHE: KVNamespace;
  JWT_SECRET: string;
  MISTRAL_API_KEY: string;
  OPENAI_API_KEY?: string;
  APP_ENV: string;
  APP_URL: string;
}
