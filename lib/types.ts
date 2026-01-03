export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor_id: string;
  thumbnail_url: string;
  price: string;
  rating: string;
  total_students: string;
  is_public: boolean;
  language: string;
  offers_certificate: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
  deleted_by: string | null;
  delete_status: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content_type: string;
  duration: string;
  position: string;
  prerequisite_lesson_id: string | null;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
  deleted_by: string | null;
  delete_status: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  Date_of_birth?: string;
  username: string;
  password_hash?: string;
  role: 'student' | 'admin' | 'user';
  profile_picture_url?: string;
  bio?: string;
  mobile_number: string;
  email_verified: string | boolean;
  last_login?: string;
  created_at?: string;
  created_by: string;
  updated_at?: string;
  updated_by: string;
  deleted_at?: string | null;
  deleted_by?: string | null;
  delete_status?: boolean;
  purchasedCourses?: string[];
}

export interface EnrolledCoursesResponse {
  courses: Course[];
}

export interface LessonsResponse {
  lessons: Lesson[];
}

export interface OTPSendResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface NewUserData {
  name: string;
  email: string;
  Date_of_birth?: string;
  username: string;
  password_hash?: string;
  role?: string;
  bio?: string;
  mobile_number: string;
  email_verified?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface NewUserOTPVerifyResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface PaymentOrderRequest {
  user_id: string;
  course_id: string;
  mobile_number: string;
}

export interface RazorpayOrder {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[];
  offer_id: string | null;
  receipt: string | null;
  status: string;
}

export interface PaymentOrderResponse {
  message: string;
  razorpay_order: RazorpayOrder;
  transaction_result: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  prefill: {
    email: string;
    name: string;
    contact: string;
  };
  handler: (response: any) => void;
  modal: {
    ondismiss: () => void;
  };
}