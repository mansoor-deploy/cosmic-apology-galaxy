
import React, { useState, useEffect, useRef } from 'react';
import { Video } from 'lucide-react';
import BackToHome from '@/components/BackToHome';
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';

// This would be a prop in production
const defaultMessage = {
  recipient: "Alex",
  sender: "Jamie",
  message: "I wish I could turn back time. The moment our paths diverted, I knew I had made a terrible mistake. Some things cannot be undone, but I hope that our constellations can realign again. I am truly sorry.",
  videoUrl: "/cosmic-video.mp4", // This would be a real video in production
  audioUrl: "/cosmic-audio.mp3" // This would be a real audio in production
};

const CosmicSorry = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([]);
  const [constellationVisible, setConstellationVisible] = useState(false);
  const [fadeInText, setFadeInText] = useState(false);

  // Reference to get access to the stopAudio method
  const stopAudio = () => {
    const audioElement = document.querySelector('audio');
    if (audioElement && (audioElement as any).stop) {
      (audioElement as any).stop();
    }
  };

  // Create stars for the background
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.8
    }));
    
    setStars(newStars);
    
    // Show the fade-in text after a delay
    const timer = setTimeout(() => {
      setFadeInText(true);
    }, 800);
    
    // Show constellation lines after text appears
    const constellationTimer = setTimeout(() => {
      setConstellationVisible(true);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(constellationTimer);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6 bg-cosmic-primary">
      <BackToHome />
      <AudioPlayer src={defaultMessage.audioUrl} />
      
      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse-soft"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${3 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Background with slow breathing animation */}
      <div className="fixed inset-0 bg-cosmic-gradient opacity-30 animate-breathe" />
      
      <div className="cosmic-card w-full max-w-md z-10 animate-fade-in">
        {/* Fade-in text */}
        {fadeInText && (
          <div className="text-cosmic-secondary/80 text-center mb-8 animate-fade-in-slow">
            I wish I could turn back time...
          </div>
        )}
        
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-xs bg-cosmic-secondary/20 text-cosmic-text/80 rounded-full mb-2">
            A cosmic apology for
          </span>
          <h1 className="text-4xl font-serif text-cosmic-text mb-2">
            {defaultMessage.recipient}
          </h1>
          <div className="w-16 h-0.5 bg-cosmic-secondary/40 mx-auto rounded-full" />
        </div>
        
        <div className="space-y-6">
          <p className="font-sans text-cosmic-text/90 leading-relaxed">
            {defaultMessage.message}
          </p>
          
          {/* Constellation visualization */}
          <div className="relative h-32 my-8">
            {stars.slice(0, 7).map((star, index) => (
              <div
                key={`constellation-${star.id}`}
                className="absolute bg-white rounded-full animate-pulse-soft"
                style={{
                  left: `${index * 15 + 5}%`,
                  top: `${20 + (index % 3) * 20}%`,
                  width: `${2 + Math.random() * 4}px`,
                  height: `${2 + Math.random() * 4}px`,
                  animationDuration: `${3 + Math.random() * 3}s`
                }}
              />
            ))}
            
            {/* Constellation lines */}
            {constellationVisible && (
              <svg className="absolute inset-0 w-full h-full animate-fade-in-slow" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M30,30 L60,50 L100,40 L150,60 L190,30 L220,70 L270,50" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeWidth="1" 
                  fill="none" 
                />
              </svg>
            )}
          </div>
          
          <div className="text-right">
            <p className="font-serif text-xl text-cosmic-text/90">
              {defaultMessage.sender}
            </p>
          </div>
          
          <button
            className="w-full py-3 px-6 bg-cosmic-secondary hover:bg-cosmic-secondary/80 text-white rounded-md font-medium transition-all duration-300"
          >
            Realign Our Stars
          </button>
        </div>
      </div>
      
      {/* Video trigger */}
      <button
        onClick={() => setIsVideoOpen(true)}
        className="video-trigger"
        aria-label="Play video message"
      >
        <Video className="h-6 w-6 text-white" />
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

export default CosmicSorry;
