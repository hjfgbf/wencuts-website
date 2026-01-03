'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, Play, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Course } from '@/lib/types';

interface CourseCardProps {
  course: Course;
  purchased?: boolean;
}

export function CourseCard({ course, purchased = false }: CourseCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const isPurchased = user?.purchasedCourses?.includes(course.id) || purchased;

  return (
    <div className="course-card group">
      <div className="relative">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Play className="h-5 w-5 mr-2" />
            Preview
          </Button>
        </div>
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          {course.language}
        </Badge>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold line-clamp-2 mb-2">{course.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-3">{course.description}</p>
        </div>

        {/* <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Video Course
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {parseInt(course.total_students).toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {parseFloat(course.rating) || 0}
          </div>
        </div> */}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">by Instructor</span>
            <span className="text-2xl font-bold text-primary">₹{parseInt(course.price).toLocaleString()}</span>
          </div>
          
          {isPurchased ? (
            <Link href={`/learn/${course.id}`}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link href={`/course/${course.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
              {isAuthenticated && (
                <Link href={`/purchase/${course.id}`}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}