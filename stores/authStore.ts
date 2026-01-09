import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, OTPSendResponse, OTPVerifyResponse, NewUserData } from '@/lib/types';
import { userApi, authApi } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  otpToken: string | null;

  // Actions
  login: (mobile: string, otp: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, mobile: string, otp: string) => Promise<boolean>;
  sendOTPNewUser: (mobile: string) => Promise<boolean>;
  registerNewUser: (name: string, email: string, mobile: string, otp: string, additionalData?: Partial<NewUserData>) => Promise<boolean>;
  registerUserDirect: (name: string, email: string, mobile: string, password: string, additionalData?: Partial<NewUserData>) => Promise<boolean>;
  logout: () => void;
  sendOTP: (mobile: string) => Promise<boolean>;
  sendResetOTP: (contact: { email?: string; mobile_number?: string }) => Promise<boolean>;
  resetPassword: (payload: { email?: string; mobile_number?: string; otp: string; password: string }) => Promise<boolean>;
  fetchUserByMobile: (mobile: string) => Promise<User | null>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: null,
      otpToken: null,

      sendOTP: async (mobile: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.sendOTP(mobile);
          if (response.success) {
            set({ loading: false, otpToken: response.token });
            return true;
          } else {
            set({ loading: false, error: response.message || 'Failed to send OTP' });
            return false;
          }
        } catch (error: any) {
          // Try to get error message from the API response if available
          const errorMessage = error?.response?.data?.message || 'Failed to send OTP';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      sendResetOTP: async (contact: { email?: string; mobile_number?: string }): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.sendResetOTP(contact);
          if (response.success) {
            set({ loading: false, otpToken: response.data.token });
            return true;
          } else {
            set({ loading: false, error: response.message || 'Failed to send reset OTP' });
            return false;
          }
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || 'Failed to send reset OTP';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      resetPassword: async (payload: {
        email?: string;
        mobile_number?: string;
        otp: string;
        password: string
      }): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const token = get().otpToken;
          if (!token) {
            set({ error: 'Reset session expired. Please request a new OTP', loading: false });
            return false;
          }

          const response = await authApi.resetPasswordWithOTP({ ...payload, token });
          if (response.success) {
            set({ loading: false, otpToken: null });
            return true;
          } else {
            set({ loading: false, error: response.message || 'Failed to reset password' });
            return false;
          }
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || 'Failed to reset password';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      fetchUserByMobile: async (mobile: string): Promise<User | null> => {
        try {
          const response = await userApi.getUserByMobile(mobile);
          return {
            ...response.data,
            id: response.data.id, // Use mobile as ID for now
            purchasedCourses: [], // This would come from enrollment API
          };
        } catch (error) {
          console.error('User not found:', error);
          return null;
        }
      },

      login: async (mobile: string, otp: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const token = get().otpToken;
          if (!token) {
            set({ error: 'OTP session expired. Please request a new OTP', loading: false });
            return false;
          }

          const response = await authApi.verifyOTP(token, otp);
          if (!response.success) {
            set({ error: response.message || 'Invalid OTP', loading: false });
            return false;
          }

          // User data comes directly from the verify response
          const userData = response.user;

          set({
            user: userData,
            isAuthenticated: true,
            isAdmin: userData.role === 'admin',
            loading: false,
            otpToken: null // Clear token after successful verification
          });
          return true;
        } catch (error: any) {
          // Try to get error message from the API response if available
          const errorMessage = error?.response?.data?.message || 'Login failed';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      loginWithEmail: async (email: string, password: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          // Note: Assuming there's an endpoint for email login
          // If not, this might need to be adjusted
          const response = await authApi.loginWithEmail(email, password);
          if (response.success) {
            const userData = response.data;
            set({
              user: userData,
              isAuthenticated: true,
              isAdmin: userData.role === 'admin',
              loading: false,
            });
            return true;
          } else {
            set({ error: response.message || 'Login failed', loading: false });
            return false;
          }
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || 'Login failed';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      register: async (name: string, email: string, mobile: string, otp: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const token = get().otpToken;
          if (!token) {
            set({ error: 'OTP session expired. Please request a new OTP', loading: false });
            return false;
          }

          const response = await authApi.verifyOTP(token, otp);
          if (!response.success) {
            set({ error: response.message || 'Invalid OTP', loading: false });
            return false;
          }

          // If we get here and there's a user in the response, it means the user already exists
          if (response.user) {
            set({ error: 'User already exists', loading: false });
            return false;
          }

          // Check if user already exists
          const existingUser = await get().fetchUserByMobile(mobile);
          if (existingUser) {
            set({ error: 'User already exists', loading: false });
            return false;
          }

          // Create new user
          const userData = {
            name,
            email,
            mobile_number: mobile,
            username: email.split('@')[0],
            role: 'student',
            bio: '',
            password_hash: 'otp_user', // Placeholder for legacy OTP flow
          };

          await userApi.addUser(userData);

          const newUser: User = {
            id: mobile,
            name,
            email,
            mobile_number: mobile,
            username: userData.username,
            role: 'student',
            bio: '',
            email_verified: false,
            created_by: 'self',
            updated_by: 'self',
            purchasedCourses: [],
          };

          set({
            user: newUser,
            isAuthenticated: true,
            isAdmin: false,
            loading: false
          });
          return true;
        } catch (error: any) {
          // Try to get error message from the API response if available
          const errorMessage = error?.response?.data?.message || 'Registration failed';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      sendOTPNewUser: async (mobile: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.sendOTPNewUser(mobile);
          if (response.success) {
            set({ loading: false, otpToken: response.token });
            return true;
          } else {
            set({ loading: false, error: response.message || 'Failed to send OTP' });
            return false;
          }
        } catch (error: any) {
          // Try to get error message from the API response if available
          const errorMessage = error?.response?.data?.message || 'Failed to send OTP';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      registerNewUser: async (name: string, email: string, mobile: string, otp: string, additionalData?: Partial<NewUserData>): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const token = get().otpToken;
          if (!token) {
            set({ error: 'OTP session expired. Please request a new OTP', loading: false });
            return false;
          }

          // Prepare user data
          const userData: NewUserData = {
            name,
            email,
            mobile_number: mobile,
            username: additionalData?.username || email.split('@')[0],
            role: additionalData?.role || 'student',
            bio: additionalData?.bio || '',
            Date_of_birth: additionalData?.Date_of_birth || '',
            password_hash: additionalData?.password_hash || '',
            email_verified: additionalData?.email_verified || false,
            created_by: additionalData?.created_by || 'self',
            updated_by: additionalData?.updated_by || 'self',
            ...additionalData
          };

          const response = await authApi.verifyOTPAndCreateUser(token, otp, userData);
          if (!response.success) {
            set({ error: response.message || 'Registration failed', loading: false });
            return false;
          }

          // User data comes directly from the verify response
          const user = response.user;

          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
            loading: false,
            otpToken: null // Clear token after successful verification
          });
          return true;
        } catch (error: any) {
          // Try to get error message from the API response if available
          const errorMessage = error?.response?.data?.message || 'Registration failed';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      registerUserDirect: async (name: string, email: string, mobile: string, password: string, additionalData?: Partial<NewUserData>): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          // Check if user already exists
          const existingUser = await get().fetchUserByMobile(mobile);
          if (existingUser) {
            set({ error: 'User already exists', loading: false });
            return false;
          }

          const userData = {
            name,
            email,
            mobile_number: mobile,
            username: additionalData?.username || email.split('@')[0],
            password_hash: password,
            role: additionalData?.role || 'student',
            bio: additionalData?.bio || '',
            Date_of_birth: additionalData?.Date_of_birth || '',
            email_verified: additionalData?.email_verified || false,
            created_by: additionalData?.created_by || 'self',
            updated_by: additionalData?.updated_by || 'self',
            profile_picture_url: '',
            ...additionalData
          };

          await userApi.addUser(userData);

          const newUser: User = {
            id: mobile,
            name,
            email,
            mobile_number: mobile,
            username: userData.username,
            role: userData.role as 'student' | 'admin',
            bio: userData.bio,
            email_verified: userData.email_verified,
            created_by: userData.created_by,
            updated_by: userData.updated_by,
            purchasedCourses: [],
          };

          set({
            user: newUser,
            isAuthenticated: true,
            isAdmin: newUser.role === 'admin',
            loading: false,
          });
          return true;
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || 'Registration failed';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          error: null,
          otpToken: null
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin
      }),
    }
  )
);