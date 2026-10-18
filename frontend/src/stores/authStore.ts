import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '@/types/enums';
import { UserResponse } from '@/types/api';
import { decodeJwt, isTokenExpired } from '@/lib/jwt';

interface AuthState {
  token: string | null;
  user: UserResponse | null;
  userId: number | null;
  role: Role | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user?: UserResponse | null) => void;
  setUser: (user: UserResponse) => void;
  logout: () => void;
  checkTokenValidity: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      userId: null,
      role: null,
      isAuthenticated: false,

      setAuth: (token: string, user?: UserResponse | null) => {
        const decoded = decodeJwt(token);
        if (!decoded) {
          console.error('Invalid token supplied to setAuth');
          return;
        }

        const numericUserId = Number(decoded.sub);
        const resolvedRole = decoded.role;

        // If user object isn't provided yet, construct fallback profile from JWT
        const initialUser: UserResponse = user || {
          id: numericUserId,
          fullName: resolvedRole === 'CLIENT' ? 'Client User' : 'Freelancer User',
          email: '',
          role: resolvedRole,
        };

        set({
          token,
          user: initialUser,
          userId: numericUserId,
          role: resolvedRole,
          isAuthenticated: true,
        });
      },

      setUser: (user: UserResponse) => {
        set({ user });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          userId: null,
          role: null,
          isAuthenticated: false,
        });
      },

      checkTokenValidity: () => {
        const { token } = get();
        if (!token) return false;
        if (isTokenExpired(token)) {
          get().logout();
          return false;
        }
        return true;
      },
    }),
    {
      name: 'workcraft-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        userId: state.userId,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
