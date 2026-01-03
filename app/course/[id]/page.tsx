'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { HLSPlayer } from '@/components/video/HLSPlayer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuthStore } from '@/stores/authStore';
import { useCourseStore } from '@/stores/courseStore';
import Link from 'next/link';
import { Play, Clock, Users, Star, BookOpen, Award, Check, ShoppingCart } from 'lucide-react';
import { AuthDialog } from '@/components/auth/AuthDialog';

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { isAuthenticated, user } = useAuthStore();
  const { courses, currentLessons, fetchCourseLessons, loading } = useCourseStore();
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseLessons(courseId);
    }

    console.log('Course ID from params:', courseId);
    console.log('Courses in store:', courses);
  }, [courseId, fetchCourseLessons]);

  const course = courses.find(c => c.id === courseId);
  const isPurchased = user?.purchasedCourses?.includes(courseId) ?? false;

  const formatDuration = (seconds: string) => {
    const totalSeconds = parseInt(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const totalDuration = currentLessons.reduce((acc, lesson) => acc + parseInt(lesson.duration), 0);

  if (!course) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The course you're looking for doesn't exist.
          </p>
          <Link href="/courses">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Browse Courses
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
                  <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/20 text-primary">{course.category}</Badge>
                <Badge variant="outline">{course.language}</Badge>
                {course.offers_certificate && (
                  <Badge variant="outline">Certificate Included</Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              
              {/* <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(totalDuration.toString())}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {parseInt(course.total_students).toLocaleString()} students
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {parseFloat(course.rating) || 0} rating
                </div>
              </div> */}
            </div>

            {/* Demo Video */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {showDemoVideo ? (
                <HLSPlayer
                  src="https://hls-video-streaming.wencuts.com/videos/TAMIL/lesson_001/480p.m3u8"
                  title="Course Preview"
                  className="aspect-video"
                />
              ) : (
                <div 
                  className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center cursor-pointer group"
                  onClick={() => setShowDemoVideo(true)}
                >
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-100 text-primary-foreground ml-1" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Watch Course Preview</h3>
                    <p className="text-muted-foreground">Get a glimpse of what you'll learn</p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">What you'll learn</h3>
                    <div className="bg-muted/50 rounded-lg p-6">
                      <p className="text-muted-foreground">{course.description}</p>
                      {course.offers_certificate && (
                        <div className="flex items-center gap-2 mt-4">
                          <Award className="h-5 w-5 text-primary" />
                          <span>Certificate of completion included</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Course Curriculum</h3>
                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="border border-border rounded-lg p-6 animate-pulse">
                          <div className="h-4 bg-muted rounded mb-2" />
                          <div className="h-4 bg-muted rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentLessons.map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                              {index + 1}
                            </div>
                            <div>
                              <span className="font-medium">{lesson.title}</span>
                              <p className="text-xs text-muted-foreground">{lesson.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {/* <span className="text-sm text-muted-foreground">
                              {formatDuration(lesson.duration)}
                            </span> */}
                            <Badge variant="outline" className="text-xs ml-2">
                              {lesson.content_type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                      V
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Venkat</h3>
                      {/* <p className="text-muted-foreground">Senior Software Engineer</p> */}
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-primary" />
                          4.9 Instructor Rating
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          50K+ Students
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          12 Courses
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Our instructor is a passionate professional with years of experience in the field. 
                    They have worked at top companies and are dedicated to teaching practical, 
                    industry-relevant skills to help students succeed in their careers.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  ₹{parseInt(course.price).toLocaleString()}
                </div>
                <p className="text-muted-foreground">Lifetime Access</p>
              </div>

              {isPurchased ? (
                <Link href={`/learn/${course.id}`} className="block">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-4">
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </Link>
              ) : isAuthenticated ? (
                <Link href={`/purchase/${course.id}`} className="block">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-4">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Enroll Now
                  </Button>
                </Link>
              ) : (
                <Button  onClick={() => setIsAuthOpen(true)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-4">
                  Login to Enroll
                </Button>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Lifetime access</span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Certificate of completion</span>
                </div> */}
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Mobile and desktop access</span>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-4">Course Details</h3>
              <div className="space-y-3 text-sm">
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{formatDuration(totalDuration.toString())}</span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Students:</span>
                  <span>{parseInt(course.total_students).toLocaleString()}</span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span>{course.category}</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span>{course.language}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </main>

    
  );
}