import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course, Lesson } from '@/lib/types';
import { courseApi } from '@/lib/api';

interface CourseState {
  courses: Course[];
  enrolledCourses: Course[];
  currentCourse: Course | null;
  currentLessons: Lesson[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchAllCourses: () => Promise<void>;
  fetchEnrolledCourses: (userId: string) => Promise<void>;
  fetchCourseLessons: (courseId: string) => Promise<void>;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentCourseById: (courseId: string) => void;
  clearError: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],
      enrolledCourses: [],
      currentCourse: null,
      currentLessons: [],
      loading: false,
      error: null,

      fetchAllCourses: async () => {
        set({ loading: true, error: null });
        try {
          const response = await courseApi.getAllCourses();
          set({ courses: response.data, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch courses', loading: false });
          console.error('Error fetching courses:', error);
        }
      },

      fetchEnrolledCourses: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await courseApi.getEnrolledCourses(userId);
          set({ enrolledCourses: response.data.courses, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch enrolled courses', loading: false });
          console.error('Error fetching enrolled courses:', error);
        }
      },

      fetchCourseLessons: async (courseId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await courseApi.getCourseLessons(courseId.replace('course', 'playlist'));
          const sortedLessons = response.data.lessons.sort((a: Lesson, b: Lesson) => 
            parseInt(a.position) - parseInt(b.position)
          );
          set({ currentLessons: sortedLessons, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch course lessons', loading: false });
          console.error('Error fetching course lessons:', error);
        }
      },

      setCurrentCourse: (course: Course | null) => {
        set({ currentCourse: course });
      },

      setCurrentCourseById: (courseId: string) => {
        const courses = get().courses;
        const course = courses.find(c => c.id === courseId) || null;
        set({ currentCourse: course });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'course-storage',
      partialize: (state) => ({
        courses: state.courses,
        enrolledCourses: state.enrolledCourses,
        currentCourse: state.currentCourse,
        currentLessons: state.currentLessons,
      }),
    }
  )
);