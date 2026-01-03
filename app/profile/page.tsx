'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { User, BookOpen, Award, Settings, Edit3 } from 'lucide-react';
import { useCourseStore } from '@/stores/courseStore';

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuthStore();
    const {  enrolledCourses, fetchEnrolledCourses, loading } = useCourseStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user?.id) {
      fetchEnrolledCourses(user.id);
    }

    console.log(user);
  }, [user?.id, fetchEnrolledCourses]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Please log in to view your profile
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

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {user?.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
            <Badge className="mt-2 bg-primary/20 text-primary">
              {user?.role === 'admin' ? 'Administrator' : 'Student'}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Courses Enrolled</p>
                      <p className="text-2xl font-bold text-primary">{enrolledCourses.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Certificates</p>
                      <p className="text-2xl font-bold text-primary">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Badges</p>
                      <p className="text-2xl font-bold text-primary">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Learning Progress</h3>
              <p className="text-muted-foreground mb-6">
                Continue your courses from where you left off
              </p>
              <Link href="/my-courses">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  View My Courses
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Profile Settings
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={user?.mobile_number || ''}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Mobile number cannot be changed
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="text-2xl font-bold mb-4">Certificates</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Complete courses to earn certificates that showcase your skills and knowledge
              </p>
              <Link href="/my-courses">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Continue Learning
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}