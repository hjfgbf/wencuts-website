import axios from 'axios';
import { OTPSendResponse, OTPVerifyResponse, NewUserData, NewUserOTPVerifyResponse, PaymentOrderRequest, PaymentOrderResponse } from './types';

const API_BASE_URL = 'https://api.wencuts.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Course API
export const courseApi = {
  getAllCourses: () => api.get('/api/course/all/'),
  getCourseById: (id: string) => api.get(`/api/course/${id}/`),
  getEnrolledCourses: (userId: string) => api.get(`/enrolled_courses/${userId}/`),
  getCourseLessons: (courseId: string) => api.get(`/playlist-lesson/${courseId}/`),
};

// User API
export const userApi = {
  getUserByMobile: (mobile: string) => api.get(`/api/user/mobile/${mobile}/`),
  addUser: (userData: {
    name: string;
    email: string;
    mobile_number: string;
    username: string;
    role?: string;
    bio?: string;
  }) => api.post('/api/user/add/', userData),
};

// Auth API for SMS OTP
export const authApi = {
  // Existing user OTP functions
  sendOTP: async (mobile_number: string): Promise<OTPSendResponse> => {
    try {
      const response = await api.post('/api/send-sms-otp-user/', { mobile_number });
      return response.data;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  },
  verifyOTP: async (token: string, otp: string): Promise<OTPVerifyResponse> => {
    try {
      const response = await api.post('/api/verify-sms-otp-user/', { token, otp });
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },

  // New user registration OTP functions
  sendOTPNewUser: async (mobile_number: string): Promise<OTPSendResponse> => {
    try {
      const response = await api.post('/api/send-sms-otp-new-user/', { mobile_number });
      return response.data;
    } catch (error) {
      console.error('Error sending OTP for new user:', error);
      throw error;
    }
  },
  verifyOTPAndCreateUser: async (token: string, otp: string, userData: NewUserData): Promise<NewUserOTPVerifyResponse> => {
    try {
      const payload = {
        token,
        otp,
        ...userData
      };
      const response = await api.post('/api/verify-sms-otp-and-create-user/', payload);
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP and creating user:', error);
      throw error;
    }
  },
  loginWithEmail: async (email: string, password: string): Promise<any> => {
    try {
      const response = await api.post('/user-login-with-email/', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error logging in with email:', error);
      throw error;
    }
  },
  sendResetOTP: async (contact: { email?: string; mobile_number?: string }): Promise<any> => {
    try {
      const response = await api.post('/send-otp-to-contact-and-email-using-either/', contact);
      return response.data;
    } catch (error) {
      console.error('Error sending reset OTP:', error);
      throw error;
    }
  },
  resetPasswordWithOTP: async (payload: {
    email?: string;
    mobile_number?: string;
    otp: string;
    password: string;
    token: string
  }): Promise<any> => {
    try {
      const response = await api.post('/reset-password-with-otp/', payload);
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
};

// Payment API
export const paymentApi = {
  createOrder: async (orderData: PaymentOrderRequest): Promise<PaymentOrderResponse> => {
    try {
      const response = await api.post('/pay-now/', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  },
};