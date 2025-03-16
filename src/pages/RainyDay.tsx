
import React, { useState, useEffect, useRef } from 'react';
import { Video } from 'lucide-react';
import BackToHome from '@/components/BackToHome';
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';

// This would be a prop in production
const defaultMessage = {
  recipient: "Robin",
  sender: "Casey",
  message: "Some mistakes leave marks like raindrops on a window. I'm deeply sorry for the pain I've caused. I hope that, like rain washing away the dust, time will help clean the hurt between us. Please accept my sincere apology.",
  videoUrl: "/rainy-video.mp4", // This would be a real video in production
  audioUrl: "/rainy-audio.mp3" // This would be a real audio in production
};

const RainyDay = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [raindrops, setRaindrops] = useState<Array<{id: number, x: number, delay: number, opacity: number}>>([]);
  const [showFlower, setShowFlower] = useState(false);
  
  // Reference to get access to the stopAudio method
  const stopAudio = () => {
    const audioElement = document.querySelector('audio');
    if (audioElement && (audioElement as any).stop) {
      (audioElement as any).stop();
    }
  };

  // Create raindrops for animation
  useEffect(() => {
    const newRaindrops = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.5
    }));
    
    setRaindrops(newRaindrops);
  }, []);

  // Add new ripple effect when clicked
  const addRipple = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 3000);
  };

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6 bg-rainy-gradient">
      <BackToHome />
      <AudioPlayer src={defaultMessage.audioUrl} />
      
      {/* Raindrops animation */}
      <div className="fixed inset-0 overflow-hidden">
        {raindrops.map(drop => (
          <div
            key={drop.id}
            className="absolute bg-rainy-secondary"
            style={{
              left: `${drop.x}%`,
              top: '-10px',
              width: '1px',
              height: '20px',
              opacity: drop.opacity,
              animation: `petal-fall ${1 + Math.random()}s linear infinite`,
              animationDelay: `${drop.delay}s`
            }}
          />
        ))}
      </div>
      
      <div 
        ref={containerRef}
        className="rainy-card w-full max-w-md z-10 animate-fade-in ripple-container"
        onClick={addRipple}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple-effect"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '10px',
              height: '10px',
            }}
          />
        ))}
        
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-sm bg-rainy-secondary/10 text-rainy-text/70 rounded-full mb-2">
            Reflections for
          </span>
          <h1 className="text-4xl font-serif text-rainy-text mb-2">
            {defaultMessage.recipient}
          </h1>
          <div className="w-16 h-0.5 bg-rainy-secondary/30 mx-auto rounded-full" />
        </div>
        
        <div className="space-y-6">
          <p className="font-serif italic text-lg text-rainy-text/80 leading-relaxed">
            {defaultMessage.message}
          </p>
          
          <div className="text-right">
            <p className="font-serif text-xl text-rainy-text">
              {defaultMessage.sender}
            </p>
          </div>
          
          {showFlower ? (
            <div className="text-center py-4 animate-fade-in">
              <div className="inline-block p-3 bg-white/40 backdrop-blur-sm rounded-full mb-2">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="#0EA5E9" fillOpacity="0.2" stroke="#0EA5E9" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" fill="#0EA5E9" />
                </svg>
              </div>
              <p className="text-sm text-rainy-text/80">A blue flower of forgiveness</p>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFlower(true);
              }}
              className="w-full py-3 px-6 bg-rainy-secondary hover:bg-rainy-secondary/80 text-white rounded-md font-medium transition-all duration-300"
            >
              Send a Virtual Flower
            </button>
          )}
        </div>
      </div>
      
      {/* Video trigger */}
      <button
        onClick={() => setIsVideoOpen(true)}
        className="video-trigger"
        aria-label="Play video message"
      >
        <Video className="h-6 w-6 text-rainy-text" />
      </button>
      
      {/* Video modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoSrc={defaultMessage.videoUrl}
        stopAudio={stopAudio}
      />
    </div>
  );
};

export default RainyDay;
