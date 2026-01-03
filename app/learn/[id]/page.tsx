'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { HLSPlayer } from '@/components/video/HLSPlayer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/stores/authStore';
import { useCourseStore } from '@/stores/courseStore';
import Link from 'next/link';
import { Play, CheckCircle, Lock, ArrowLeft, ArrowRight, BookOpen, Menu, X } from 'lucide-react';
import { Course } from '@/lib/types';

export default function LearnCoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const { isAuthenticated, user } = useAuthStore();
  const {  currentLessons, fetchCourseLessons, setCurrentCourseById, loading } = useCourseStore();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { enrolledCourses } = useCourseStore();
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseLessons(courseId);
      setCurrentCourseById(courseId);
    }

    setCurrentCourse(enrolledCourses.find(c => c.id === courseId) || null);

  }, [courseId, fetchCourseLessons]);



  const isPurchased = enrolledCourses?.map(course => course.id.split('_')[1]).includes(courseId.split('_')[1]);

  if (!isAuthenticated || !isPurchased) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-4xl font-bold mb-4">Course Access Required</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Please purchase this course to access the lessons
          </p>
          <Link href={`/course/${courseId}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              View Course Details
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading course content...</p>
          </div>
        </div>
      </main>
    );
  }

  if (currentLessons.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">No Lessons Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            This course doesn't have any lessons yet.
          </p>
          <Link href="/my-courses">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Back to My Courses
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const currentLesson = currentLessons[currentLessonIndex];
  const completedLessons = currentLessons.filter((_, index) => index < currentLessonIndex).length;
  const progressPercentage = (completedLessons / currentLessons.length) * 100;

  const formatDuration = (seconds: string) => {
    const totalSeconds = parseInt(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getVideoUrl = (lessonId: string) => {
    // Select resolution based on user's bandwidth
    const getBandwidth = () => {
      console.log('Checking bandwidth...');
      if (typeof window !== 'undefined' && (navigator as any).connection) {
        const bandwidthMbps = (navigator as any).connection.downlink;
        console.log('Detected bandwidth (Mbps):', bandwidthMbps);
        if (bandwidthMbps >= 5) return '1080p';
        if (bandwidthMbps >= 2.5) return '720p';
        return '480p';
      }
      return '480p';
    };

    const resolution = getBandwidth();
    return `https://hls-video-streaming.wencuts.com/videos/${currentCourse?.language}/${lessonId}/${resolution}.m3u8`;
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/my-courses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="font-bold truncate">{currentCourse?.title || 'Course'}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedLessons} of {currentLessons.length} lessons completed
          </p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-80 bg-card border-r border-border overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/my-courses">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h2 className="font-bold truncate">{currentCourse?.title || 'Course'}</h2>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedLessons} of {currentLessons.length} lessons completed
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {currentLessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentLessonIndex(index)}
                className={`lesson-item w-full text-left ${
                  index === currentLessonIndex ? 'bg-primary/20 border-r-2 border-primary' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {index < currentLessonIndex ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : index === currentLessonIndex ? (
                    <Play className="h-4 w-4 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{lesson.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(lesson.duration)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-80 h-full bg-card border-r border-border overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold truncate">{currentCourse?.title || 'Course'}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {completedLessons} of {currentLessons.length} lessons completed
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {currentLessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setCurrentLessonIndex(index);
                      setIsSidebarOpen(false);
                    }}
                    className={`lesson-item w-full text-left ${
                      index === currentLessonIndex ? 'bg-primary/20 border-r-2 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {index < currentLessonIndex ? (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      ) : index === currentLessonIndex ? (
                        <Play className="h-4 w-4 text-primary" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{lesson.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDuration(lesson.duration)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center">
            <HLSPlayer
              src={getVideoUrl(currentLesson.id)}
              title={currentLesson.title}
              className="w-full h-full"
            />
          </div>

          {/* Lesson Info - Mobile Responsive */}
          <div className="bg-card border-t border-border p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl font-bold mb-2">{currentLesson.title}</h1>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Lesson {currentLessonIndex + 1} of {currentLessons.length} • {formatDuration(currentLesson.duration)}
                </p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {currentLesson.description}
                </p>
              </div>
              
              {/* Navigation Buttons - Mobile Responsive */}
              <div className="flex gap-2 w-full lg:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                  disabled={currentLessonIndex === 0}
                  className="flex-1 lg:flex-none"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                <Button
                  onClick={() => setCurrentLessonIndex(Math.min(currentLessons.length - 1, currentLessonIndex + 1))}
                  disabled={currentLessonIndex === currentLessons.length - 1}
                  className="flex-1 lg:flex-none bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Mark Complete Button */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-1 sm:flex-none"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
               */}
              {/* Mobile Lesson List Toggle */}
              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden flex-1 sm:flex-none"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Lessons ({currentLessonIndex + 1}/{currentLessons.length})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}