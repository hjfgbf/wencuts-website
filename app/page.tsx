'use client';

import { useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CourseCard } from '@/components/course/CourseCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCourseStore } from '@/stores/courseStore';
import Link from 'next/link';
import { BookOpen, Users, Award, Zap, Play, ArrowRight } from 'lucide-react';
import { useState } from "react";

export default function Home() {


  // Add this component to your file (e.g., below Home):
      function DemoVideoSelector() {
        const videos = [
          {
            label: "தமிழ் / Tamil",
            url: "https://video-serving-api.wencuts.com/video/lesson_001.mp4"
          },
          {
            label: "हिन्दी / Hindi",
            url: "https://video-serving-api.wencuts.com/video/lesson_027.mp4"
          },
          {
            label: "English",
            url: "https://video-serving-api.wencuts.com/video/lesson_014.mp4"
          },
          {
            label: "తెలుగు / Telugu",
            url: "https://video-serving-api.wencuts.com/video/lesson_040.mp4"
          }
        ];
        const [selectedIdx, setSelectedIdx] = useState(0);

        return (
          <div className="flex flex-col items-center">
            <div className="mb-6 flex gap-4 flex-wrap justify-center">
              {videos.map((video, idx) => (
                <button
                  key={idx}
                  className={`px-5 py-2 rounded-full font-medium shadow transition-colors ${
                    selectedIdx === idx
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-black hover:bg-primary/10"
                  }`}
                  onClick={() => setSelectedIdx(idx)}
                >
                  {video.label}
                </button>
              ))}
            </div>
            <div className="w-full max-w-2xl aspect-video mb-4 rounded-lg overflow-hidden bg-black">
              <iframe
                src={videos[selectedIdx].url}
                title={videos[selectedIdx].label}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">{videos[selectedIdx].label}</h3>
            <p className="text-muted-foreground text-center">
              Watch the demo lesson in {videos[selectedIdx].label.split("/")[0].trim()}.
            </p>
          </div>
        );
      }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-8 md:py-20 px-4 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-background to-background" />
        {/* Background image */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/hero-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center left -200px',
            opacity: 0.45,
            zIndex: 1,

          }}
        />
        <div className="relative max-w-6xl mx-auto text-center z-10">
          {/* <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
        🎉 New courses added weekly
          </Badge> */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
        Wencuts Color Grading
        <span className="gradient-gold bg-clip-text text-transparent block">
          Master class with Venkat
        </span>
          </h1>
          {/* <p className="text-xl text-muted-foreground mb-0 max-w-3xl mx-auto leading-relaxed">
            (with venkat)

          </p> */}

                    <div className="flex justify-center mb-1">
            <img
              src="/wencuts-logo.png"
              alt="Wencuts Logo"
              className="h-20 sm:h-28 md:h-40 w-auto drop-shadow-lg"
              style={{ zIndex: 2 }}
            />
          </div>
          <p className="text-white text-lg sm:text-xl md:text-2xl font-semibold mb-3 md:mb-4">Buy the course</p>
        <Link href="/courses">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 mb-3 md:mb-4">
            {/* <Play className="h-5 w-5 mr-2" /> */}
            Only at <span className="mx-1">&#8377;</span>1999
            </Button>
        </Link>

        <div className="flex justify-center mb-2">
          <p className="text-white text-lg sm:text-xl md:text-2xl text-center">
            <span className="line-through ">&#8377;8999</span>
          </p>
        </div>


          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-4 md:mb-6 max-w-3xl mx-auto leading-relaxed px-2">
        Learn from industry experts with our comprehensive video courses. 
        Master in-demand skills and advance your career with hands-on projects.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8 px-2">
            <span className="px-3 sm:px-4 md:px-5 py-1 sm:py-2 rounded-full bg-white text-black font-medium shadow text-xs sm:text-sm md:text-base">
              25+ Chapters
            </span>
            <span className="px-3 sm:px-4 md:px-5 py-1 sm:py-2 rounded-full bg-white text-black font-medium shadow text-xs sm:text-sm md:text-base">
              4 Languages
            </span>
            <span className="px-3 sm:px-4 md:px-5 py-1 sm:py-2 rounded-full bg-white text-black font-medium shadow text-xs sm:text-sm md:text-base">
              199+ mins of content
            </span>
            <span className="px-3 sm:px-4 md:px-5 py-1 sm:py-2 rounded-full bg-white text-black font-medium shadow text-xs sm:text-sm md:text-base">
              999+ Training
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
        <Link href="/courses">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 w-full sm:w-auto">
            <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Start Learning
          </Button>
        </Link>
        <Button
          variant="outline"
          size="lg"
          className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 w-full sm:w-auto"
          onClick={() => {
            const demoSection = document.querySelector('[data-demo-section]');
            if (demoSection) {
              demoSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Watch Demo
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
        </Button>
          </div>
        </div>
      </section>

      {/* Demo Videos Section */}
      <section className="py-20 px-4 bg-card/30 " data-demo-section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Here are our demo videos!</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
              Videos—the only course on the universe that gives you the technical chops and shows you how to become a successful freelance colorist...!!
            </p>
            <h3 className="text-4xl font-bold mb-4">Zero --&gt; Hero</h3>
          </div>

          <DemoVideoSelector />
        </div>
      </section>


      {/* Features of the Courses Section */}
      <section className="py-16 px-4 bg-card/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Features of the Courses</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock all these benefits when you enroll in our master class
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              "Beginner guide to professional color grading",
              "Calibrating perfect skin tone",
              "Strategies of color grading",
              "Tracking and qualifier",
              "Low light color grading"
            ].map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-5 py-2 rounded-full bg-white text-black font-medium shadow"
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 mr-2">
                  {/* Tick icon */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-black"
                  >
                    <path
                      d="M5 10.5L9 14.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* Reels Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Color Grading Wins by Me</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Check out some amazing color grading reels !
            </p>
          </div>
          <div className="overflow-x-auto scroll-smooth">
            <div className="flex gap-6 px-2 py-4" style={{ scrollbarWidth: 'none', overflowX: 'auto' }}>
              {[
                {
                  title: "Reel 1",
                  url: "/reel-1.mp4",
                  thumbnail: "/thumbnail-1.png"
                },
                {
                  title: "Reel 2",
                  url: "/reel-2.mp4",
                  thumbnail: "/thumbnail-2.png"
                },
                {
                  title: "Reel 3",
                  url: "/reel-3.mp4",
                  thumbnail: "/thumbnail-3.png"
                },
                {
                  title: "Reel 4",
                  url: "/reel-4.mp4",
                  thumbnail: "/thumbnail-4.png"
                }
              ].map((reel, idx) => {
                // Create a ref and play state for each video
                const videoEl = useRef<HTMLVideoElement>(null);
                const [isPlaying, setIsPlaying] = useState(false);

                const handlePlayPause = () => {
                  if (!videoEl.current) return;
                  if (isPlaying) {
                    videoEl.current.pause();
                  } else {
                    videoEl.current.play();
                  }
                  setIsPlaying(!isPlaying);
                };

                return (
                  <div
                    key={idx}
                    className="min-w-[320px] flex-shrink-0 rounded-xl shadow border border-border p-1 flex flex-col items-center"
                  >
                    <div className="w-full h-full aspect-[9/16] rounded-lg overflow-hidden mb-1 relative" style={{ maxHeight: 400 }}>
                      <video
                        ref={videoEl}
                        src={reel.url}
                        poster={reel.thumbnail}
                        controls={false}
                        className="w-full h-full object-cover"
                        style={{ maxHeight: 400 }}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      <button
                        type="button"
                        onClick={handlePlayPause}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 rounded-full p-2 shadow"
                        style={{ zIndex: 2 }}
                      >
                        {isPlaying ? (
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <rect x="6" y="5" width="4" height="14" rx="1" fill="#222" />
                            <rect x="14" y="5" width="4" height="14" rx="1" fill="#222" />
                          </svg>
                        ) : (
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <polygon points="7,5 19,12 7,19" fill="#222" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      
      {/* Who's This Master Class For Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">Who's This Master Class For?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Perfect for professionals and aspiring creatives looking to master color grading
        </p>
          </div>
          <div className="overflow-x-auto scroll-smooth">
        <div
          className="flex gap-6 px-2 py-4"
          style={{ scrollbarWidth: 'none', overflowX: 'auto' }}
        >
          {[
            "Video Editors",
            "Cinematographers",
            "Photographers",
            "YouTubers",
            "Film Students",
            "Wedding Filmmakers",
            "Content Creators",
            "Freelancers",
            "Directors",
            "Social Media Managers"
          ].map((role, idx) => (
            <div
              key={idx}
              className="min-w-[220px] flex-shrink-0 border border-gray-300 bg-primary text-black rounded-xl px-6 py-2 font-semibold text-lg shadow text-center"
            >
              {role}
            </div>
          ))}
        </div>
          </div>
        </div>
      </section>


      
      <section className="w-full bg-black py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h2 className="text-white text-3xl md:text-4xl font-bold underline mb-4 text-center">
            Exclusive Highlights
          </h2>
          <p className="text-white text-lg md:text-2xl font-semibold mb-4 text-center">
            A Complete System to Transform Your Career.
          </p>
          <p className="text-white/70 text-base md:text-lg mb-8 text-center">
            Go from Beginner to a Professional Colorist without Wasting Time on Random Tutorials.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="w-[300px] h-[210px] bg-gray-900 border border-white/20 rounded-xl p-6 flex flex-col items-center">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-white mb-2">
                <path d="M7 2v2M17 2v2M3 7h18M5 11v6a2 2 0 002 2h10a2 2 0 002-2v-6M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="text-white font-bold text-lg mb-2 text-center">
                LIFETIME ACCESS &amp; UPDATES
              </div>
              <div className="text-white/70 text-sm text-center">
                Go from Beginner to a Professional Colorist without Wasting Time on Random Tutorials.
              </div>
            </div>
            <div className="w-[300px] h-[210px] bg-gray-900 border border-white/20 rounded-xl p-6 flex flex-col items-center">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-white mb-2">
                <path d="M7 17v2a2 2 0 002 2h6a2 2 0 002-2v-2M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10M7 7v10M17 7v10M7 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="text-white font-bold text-lg mb-2 text-center">
                EARN CERTIFICATE
              </div>
              <div className="text-white/70 text-sm text-center">
                Showcase your expertise with an industry-recognized certificate that boosts your credibility and career prospects.
              </div>
            </div>
          </div>
          <p className="text-white/70 text-base md:text-lg text-center max-w-3xl" style={{lineHeight: 1.7}}>
            Elevate your color grading skills with 12 focused Chapters, each designed to fast-track your growth. Master core techniques, and dive into advanced workflows with Davinci resolve tricks and techniques. Discover expert strategies with 10 Tips to Grade 10x Faster and explore the latest features in Resolve advanced version. Wrap it up with Film Look Secrets to achieve a truly cinematic touch.
          </p>
        </div>
      </section>




      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-muted-foreground">
          {/* Left: Contact Us & Social */}
          <div className="flex flex-col items-start mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-2">
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
            <span className="text-xl font-bold gradient-gold bg-clip-text text-transparent">
              Wencuts
            </span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Contact Us:</span>
              <div className="text-sm">
                <div>Email: <a href="mailto:info@wencuts.com" >info@wencuts.com</a></div>
                <div>Phone: <a href="tel:+919025159618" >+91 919025 159618</a></div>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="22" height="22" fill="currentColor" className="text-primary hover:text-blue-600"><path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5zm-2 6h-1a1 1 0 0 0-1 1v2h2l-.5 2H13v6h-2v-6H9v-2h2V9a3 3 0 0 1 3-3h1v2z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="22" height="22" fill="currentColor" className="text-primary hover:text-sky-400"><path d="M22 5.92a8.19 8.19 0 0 1-2.36.65A4.13 4.13 0 0 0 21.4 4.1a8.27 8.27 0 0 1-2.61 1A4.13 4.13 0 0 0 11 8.13a11.7 11.7 0 0 1-8.5-4.3a4.13 4.13 0 0 0 1.28 5.51A4.07 4.07 0 0 1 2 8.1v.05a4.13 4.13 0 0 0 3.31 4.05a4.13 4.13 0 0 1-1.85.07a4.13 4.13 0 0 0 3.85 2.86A8.29 8.29 0 0 1 2 19.54a11.7 11.7 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68c0-.18 0-.36-.01-.54A8.36 8.36 0 0 0 22 5.92z"/></svg>
              </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                {/* Instagram SVG (original logo style) */}
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#fff"></path>
                  <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="#fff"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="#fff"></path>
                </g>
                </svg>
                </a>
            </div>
          </div>
          {/* Right: Pages Nav */}
          <div className="flex flex-col items-end">
            <nav className="mb-2">
              <ul className="flex gap-6 text-base font-medium">
                <li>
                  <a href="/" className="hover:text-primary">Home</a>
                </li>
                <li>
                  <a href="/courses" className="hover:text-primary">Courses</a>
                </li>
                <li>
                  <a href="/about" className="hover:text-primary">About</a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-primary">Contact</a>
                </li>
              </ul>
            </nav>
            <p className="text-sm">&copy; 2024 Wencuts. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.me/919025159618"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-50"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.18)' }}
      >
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 transition-colors">
          {/* WhatsApp SVG */}
          <svg width="72" height="72" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="white"/>
            <path d="M16 6C10.477 6 6 10.477 6 16c0 2.003.586 3.87 1.6 5.44L6 26l4.56-1.6A9.96 9.96 0 0 0 16 26c5.523 0 10-4.477 10-10S21.523 6 16 6zm0 18c-1.67 0-3.23-.51-4.54-1.39l-.32-.21-2.71.95.93-2.64-.21-.33A7.96 7.96 0 0 1 8 16c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8zm4.13-6.19c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.51.12-.15.23-.58.75-.71.9-.13.15-.26.17-.49.06-.23-.12-.97-.36-1.85-1.13-.68-.61-1.14-1.36-1.27-1.59-.13-.23-.01-.36.1-.48.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.08-.15.04-.29-.02-.41-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39-.13-.01-.29-.01-.45-.01-.16 0-.41.06-.63.29-.22.23-.85.83-.85 2.02s.87 2.34 1 2.5c.12.16 1.71 2.61 4.15 3.56.58.2 1.03.32 1.38.41.58.15 1.11.13 1.53.08.47-.07 1.36-.56 1.55-1.1.19-.54.19-1 .13-1.1-.06-.1-.21-.16-.44-.28z" fill="#25D366"/>
          </svg>
        </span>
      </a>

    </main>
  );
}