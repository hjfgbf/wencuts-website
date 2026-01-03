'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Menu, X, BookOpen, User, LogOut } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);  

  const LogoutConfirmDialog = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-black rounded-lg shadow-lg p-6 w-80 border border-white">
        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
                logout();
                // Show toast message after logout
                toast("You have been successfully logged out.");
              setShowLogoutConfirm(false);
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  if (showLogoutConfirm) {
    return <LogoutConfirmDialog />;
  }

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
              src="/wencuts-logo.png"
              alt="Wencuts Logo"
              className="h-12 w-12"
              />
              {/* <span className="text-xl font-bold gradient-gold bg-clip-text text-transparent">
              LearnPro
              </span> */}
            </Link>
            
            <div className="hidden md:ml-10 md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/courses" className="text-foreground hover:text-primary transition-colors">
                All Courses
              </Link>
              {isAuthenticated && (
                <Link href="/my-courses" className="text-foreground hover:text-primary transition-colors">
                  My Courses
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" className="text-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
                <a
                href="https://wa.me/919025159618?text=Hello%20I%20need%20help"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
                >
                Help
                </a>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-courses">My Courses</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutConfirm(true)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                  {showLogoutConfirm && (
                    <LogoutConfirmDialog />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setIsAuthOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Login
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
              <Link href="/" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                Home
              </Link>
            <Link href="/courses" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
              All Courses
            </Link>
            {isAuthenticated && (
              <Link href="/my-courses" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                My Courses
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <div className="px-3 py-2 space-y-2">
                <Link href="/profile" className="block text-foreground hover:text-primary transition-colors">
                  Profile
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                >
                  Logout
                </button>
                {showLogoutConfirm && <LogoutConfirmDialog />}
              </div>
            ) : (
              <div className="px-3 py-2">
                <Button onClick={() => setIsAuthOpen(true)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Login
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </nav>
  );
}