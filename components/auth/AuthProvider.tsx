'use client';

import { ReactNode } from 'react';

// This is now just a wrapper since we're using Zustand for state management
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Re-export the hook from the store
export { useAuthStore as useAuth } from '@/stores/authStore';