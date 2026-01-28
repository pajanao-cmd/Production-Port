
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MediaItem, Project } from '../types';
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Info } from 'lucide-react';

interface PresentationModeProps {
  project: Project;
  mediaItems: MediaItem[];
  onClose: () => void;
}

const PresentationMode: React.FC<PresentationModeProps> = ({ project, mediaItems, onClose }) => {
  // States: 'intro' | 'content'
  const [viewState, setViewState] = useState<'intro' | 'content'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHud, setShowHud] = useState(false);
  const hudTimeoutRef = useRef<number | null>(null);
  
  const currentItem = mediaItems[currentIndex];

  const triggerHud = () => {
    setShowHud(true);
    if (hudTimeoutRef.current) window.clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = window.setTimeout(() => setShowHud(false), 3000);
  };

  const next = useCallback(() => {
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      triggerHud();
    } else {
      onClose(); // End of presentation
    }
  }, [currentIndex, mediaItems.length, onClose]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      triggerHud();
    }
  }, [currentIndex]);

  // Handle Intro Auto-advance
  useEffect(() => {
    if (viewState === 'intro') {
      const timer = setTimeout(() => setViewState('content'), 3500);
      return () => clearTimeout(timer);
    }
  }, [viewState]);

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onClose();
      if (e.key === 'm') setIsMuted(m => !m);
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [next, prev, onClose]);

  if (viewState === 'intro') {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-12 animate-in fade-in duration-1000">
        <div className="text-center space-y-6">
          <p className="text-zinc-500 tracking-[0.4em] uppercase text-sm font-medium animate-in slide-in-from-bottom-4 duration-700">
            {project.client?.name || 'Production Pitch'} • {project.year}
          </p>
          <h1 className="text-6xl md:text-8xl font-bold serif text-white leading-tight animate-in fade-in zoom-in duration-1000">
            {project.title}
          </h1>
          <div className="h-px w-24 bg-zinc-800 mx-auto mt-8" />
          <p className="text-zinc-400 italic font-light serif text-xl max-w-xl mx-auto opacity-70">
            {project.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center select-none overflow-hidden cursor-none"
      onMouseMove={triggerHud}
      onClick={triggerHud}
    >
      {/* Ghost HUD Header */}
      <div className={`absolute top-0 inset-x-0 p-8 flex justify-between items-start transition-opacity duration-700 pointer-events-none ${showHud ? 'opacity-100' : 'opacity-0'}`}>
        <div className="pointer-events-auto">
          <h2 className="text-2xl font-bold serif text-white drop-shadow-lg">{project.title}</h2>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
            {currentItem.subtype} • {currentIndex + 1} of {mediaItems.length}
          </p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="p-4 rounded-full bg-black/40 hover:bg-white text-white hover:text-black transition-all backdrop-blur-xl border border-white/10 pointer-events-auto"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {currentItem.type === 'video' ? (
          <video
            key={currentItem.url}
            src={currentItem.url}
            autoPlay={isPlaying}
            muted={isMuted}
            playsInline
            onEnded={next}
            className="w-full h-full object-contain"
            onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
          />
        ) : (
          <img 
            src={currentItem.url} 
            alt={currentItem.title || project.title}
            className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-1000"
          />
        )}

        {/* Navigation Overlays (Transparent Touch Zones) */}
        <div 
          className="absolute left-0 inset-y-0 w-1/4 cursor-w-resize"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        />
        <div 
          className="absolute right-0 inset-y-0 w-1/4 cursor-e-resize"
          onClick={(e) => { e.stopPropagation(); next(); }}
        />
      </div>

      {/* Director's Pulse (Progress Line) */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/5">
        <div 
          className="h-full bg-white/40 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / mediaItems.length) * 100}%` }}
        />
      </div>

      {/* Ghost HUD Bottom */}
      <div className={`absolute bottom-8 flex items-center gap-8 transition-opacity duration-700 pointer-events-none ${showHud ? 'opacity-100' : 'opacity-0'}`}>
         <button 
           onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} 
           className="p-3 bg-black/40 text-white rounded-full backdrop-blur-xl border border-white/10 pointer-events-auto hover:bg-white/20"
         >
           {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
         </button>
         
         <div className="flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10">
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="text-white/60 hover:text-white transition-colors pointer-events-auto">
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} 
              className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full pointer-events-auto hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="text-white/60 hover:text-white transition-colors pointer-events-auto">
              <ChevronRight size={24} />
            </button>
         </div>

         <button 
           className="p-3 bg-black/40 text-white rounded-full backdrop-blur-xl border border-white/10 pointer-events-auto hover:bg-white/20"
         >
           <Info size={20} />
         </button>
      </div>
    </div>
  );
};

export default PresentationMode;
