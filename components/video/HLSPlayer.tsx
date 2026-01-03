'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, Maximize, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HLSPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
}

export function HLSPlayer({ src, poster, title, className }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src]);

  return (
    <div className={`relative group ${className}`}>
      <video
        ref={videoRef}
        controls
        poster={poster}
        className="w-full h-full bg-black "
        preload="metadata"
      >
        <source src={src} type="application/vnd.apple.mpegurl" />
        Your browser does not support HLS video playback.
      </video>
      
      {title && (
        <div className="absolute top-0 left-0 right-0  p-4 ">
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
      )}
    </div>
  );
}