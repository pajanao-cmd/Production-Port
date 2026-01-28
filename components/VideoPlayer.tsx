
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { storageService } from '../services/storage';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  poster, 
  autoPlay = false, 
  loop = false,
  muted: initialMuted = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState(src);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isWaiting, setIsWaiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if we have a local blob version for smooth offline playback
    const loadLocalSrc = async () => {
      const localUrl = await storageService.getBlobUrl(src);
      if (localUrl) {
        setVideoSrc(localUrl);
      } else {
        setVideoSrc(src);
      }
    };
    loadLocalSrc();
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const p = (video.currentTime / video.duration) * 100;
      setProgress(p);
    };

    const handleWaiting = () => setIsWaiting(true);
    const handlePlaying = () => setIsWaiting(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if ((videoRef.current as any)?.webkitEnterFullscreen) {
      // Support for iPad/iOS Safari native video fullscreen
      (videoRef.current as any).webkitEnterFullscreen();
    }
  };

  return (
    <div className="relative group w-full aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={initialMuted}
        playsInline
        webkit-playsinline="true"
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />
      
      {/* Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={togglePlay} className="text-white hover:text-zinc-300 transition-colors">
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          
          <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-zinc-100 transition-all duration-100" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          <button onClick={toggleMute} className="text-white hover:text-zinc-300 transition-colors">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <button onClick={handleFullscreen} className="text-white hover:text-zinc-300 transition-colors">
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isWaiting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <Loader2 size={48} className="text-white animate-spin opacity-50" />
        </div>
      )}

      {/* Play State Indicator */}
      {!isPlaying && !isWaiting && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
            <Play size={32} className="text-white ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
