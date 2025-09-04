import { User } from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ user: AuthUser | null; error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: string | null }>;
  logout: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

export interface AuthFormData {
  email: string;
  password: string;
  displayName?: string;
  confirmPassword?: string;
}
