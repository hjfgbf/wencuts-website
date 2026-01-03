'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCourseStore } from '@/stores/courseStore';
import { Navbar } from '@/components/layout/Navbar';
import { CourseCard } from '@/components/course/CourseCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

export default function MyCoursesPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { enrolledCourses, fetchEnrolledCourses, loading } = useCourseStore();

  useEffect(() => {
    if (user?.id) {
      fetchEnrolledCourses(user.id);
    }
  }, [user?.id, fetchEnrolledCourses]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Please log in to view your courses
          </p>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Go Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // Mock progress data since API doesn't provide it
  const coursesWithProgress = enrolledCourses.map(course => ({
    ...course,
    progress: Math.floor(Math.random() * 100) // Mock progress
  }));

  const totalProgress = coursesWithProgress.length > 0 
    ? coursesWithProgress.reduce((acc, course) => acc + course.progress, 0) / coursesWithProgress.length 
    : 0;
  const completedCourses = coursesWithProgress.filter(course => course.progress >= 100).length;
  const inProgressCourses = coursesWithProgress.filter(course => course.progress > 0 && course.progress < 100).length;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">My Courses</h1>
          <p className="text-xl text-muted-foreground">
            Continue your learning journey, {user?.name}
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                <p className="text-2xl font-bold text-primary">{enrolledCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-primary">{inProgressCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold text-primary">{Math.round(totalProgress)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                <div className="w-full h-48 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : enrolledCourses.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coursesWithProgress.map((course) => (
                <div key={course.id} className="relative">
                  <CourseCard course={course} purchased={true} />
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
                      {course.progress}% Complete
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-3xl font-bold mb-4">No Courses Yet</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your learning journey by exploring our course catalog and enrolling in courses that interest you.
            </p>
            <Link href="/courses">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Courses
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}