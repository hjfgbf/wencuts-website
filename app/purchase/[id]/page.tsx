'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/authStore';
import { useCourseStore } from '@/stores/courseStore';
import { paymentApi } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Shield, Award, Clock, Users, Star, CheckCircle } from 'lucide-react';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PurchasePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { isAuthenticated, user } = useAuthStore();
  const { courses } = useCourseStore();
  
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const course = courses.find(c => c.id == courseId);
  const isPurchased = user?.purchasedCourses?.includes(courseId);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment system is loading. Please try again.');
      return;
    }

    if (!user || !course) {
      toast.error('Missing user or course information');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderData = {
        user_id: user.id,
        course_id: courseId,
        mobile_number: user.mobile_number
      };

      const response = await paymentApi.createOrder(orderData);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_live_WNy5ZVVsSIU91E',
        amount: response.razorpay_order.amount,
        currency: 'INR',
        name: 'Wencut\'s Master Class',
        description: `${courseId} ${user.mobile_number} ${user.email} ${user.name}`,
        image: 'https://api.wencuts.com/media/wencuts-logo.png',
        order_id: response.razorpay_order.id,
        prefill: {
          email: user.email,
          name: user.name,
          contact: user.mobile_number,
        },
        handler: function (response: any) {
          console.log('Payment successful:', response);
          setShowSuccessDialog(true);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    router.push('/my-courses');
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-4xl font-bold mb-4">Authentication Required</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Please log in to purchase this course
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

  if (!course) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <Link href="/courses">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Browse Courses
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (isPurchased) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold mb-4">Already Enrolled!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            You already have access to this course
          </p>
          <Link href={`/learn/${courseId}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Learning
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
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/course/${courseId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Complete Purchase</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-muted-foreground mb-2">by Instructor</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Video Course
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {parseInt(course.total_students).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {parseFloat(course.rating) || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Course Price</span>
                    <span>₹{parseInt(course.price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-₹0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{parseInt(course.price).toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handlePayment}
                  disabled={loading || !razorpayLoaded}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* What's Included */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm">Lifetime access</span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm">Certificate of completion</span>
                </div> */}
                {/* <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm">Downloadable resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm">30-day money-back guarantee</span>
                </div> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Secure Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">256-bit SSL encryption</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your payment information is secure and encrypted
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Payment Successful!
            </DialogTitle>
            <DialogDescription className="pt-4">
              Congratulations! You have successfully enrolled in <strong>{course?.title}</strong>.
              You can now access all course materials and start learning.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={handleSuccessDialogClose}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Go to My Courses
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/learn/${courseId}`)}
            >
              Start Learning Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}