import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'user' | 'admin' | 'superadmin';
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user: User, token: string) => {
        localStorage.setItem('access_token', token);
        set({ user, isAuthenticated: true });
        // Load user's cart after login
        if (typeof window !== 'undefined') {
          import('../lib/api').then(({ api }) => {
            api.getCart().then((cartData) => {
              import('./cartStore').then(({ useCartStore }) => {
                useCartStore.getState().setItems(cartData.items || []);
              });
            }).catch(() => {});
          });
        }
      },
      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false });
        // Clear cart on logout
        if (typeof window !== 'undefined') {
          import('./cartStore').then(({ useCartStore }) => {
            useCartStore.getState().clearCart();
          });
        }
      },
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);