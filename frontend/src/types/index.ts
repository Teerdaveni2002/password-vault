// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Password types
export interface Password {
  id: string;
  title: string;
  username: string;
  password?: string; // Encrypted, only visible after approval
  url?: string;
  notes?: string;
  category?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
}

export interface PasswordInput {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category?: string;
}

// Password Request types
export interface PasswordRequest {
  id: string;
  passwordId: string;
  requesterId: string;
  requesterUsername: string;
  passwordTitle: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface PasswordRequestInput {
  passwordId: string;
  reason: string;
}

export interface PasswordRequestApproval {
  requestId: string;
  approved: boolean;
  adminNotes?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Error types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Notification types
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

// Theme types
export type ThemeMode = 'light' | 'dark';

// Filter types
export interface PasswordFilter {
  search?: string;
  category?: string;
  isShared?: boolean;
}

export interface RequestFilter {
  status?: 'pending' | 'approved' | 'rejected';
  dateFrom?: string;
  dateTo?: string;
}
