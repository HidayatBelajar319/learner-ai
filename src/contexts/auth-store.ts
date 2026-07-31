import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserData {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
  profile: Record<string, unknown>;
  preferences: Record<string, unknown>;
  created_at: string;
  xp?: { total_xp: number; level: number };
  streak?: { current: number; longest: number };
}

interface AuthState {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: UserData, token: string) => void;
  setUser: (user: UserData) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setAuth: (user, token) => set({ user, token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ user: null, token: null }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'learner-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
