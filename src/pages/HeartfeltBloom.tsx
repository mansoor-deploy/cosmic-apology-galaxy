
import React, { useState, useEffect, useRef } from 'react';
import { Video } from 'lucide-react';
import BackToHome from '@/components/BackToHome';
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';

// This would be a prop in production
const defaultMessage = {
  recipient: "Sarah",
  sender: "Michael",
  message: "I'm truly sorry for what happened yesterday. My words were thoughtless and I hurt you. You mean the world to me, and I promise to do better. Please forgive me.",
  videoUrl: "/heartfelt-video.mp4", // This would be a real video in production
  audioUrl: "/heartfelt-audio.mp3" // This would be a real audio in production
};

const HeartfeltBloom = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [petals, setPetals] = useState<Array<{id: number, delay: number, size: number, color: string}>>([]);

  // Reference to get access to the stopAudio method
  const stopAudio = () => {
    const audioElement = document.querySelector('audio');
    if (audioElement && (audioElement as any).stop) {
      (audioElement as any).stop();
    }
  };

  // Create petals for the animation
  useEffect(() => {
    const newPetals = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 15,
      size: 20 + Math.random() * 30,
      color: [
        '#FDE1D3', // Soft peach
        '#E5DEFF', // Lavender
        '#FFDEE2', // Blush pink
      ][Math.floor(Math.random() * 3)]
    }));
    
    setPetals(newPetals);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6 bg-bloom-gradient">
      <BackToHome />
      <AudioPlayer src={defaultMessage.audioUrl} />
      
      {/* Falling petals animation */}
      {petals.map(petal => (
        <div
          key={petal.id}
          className="petal"
          style={{
            '--random': Math.random().toString(),
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            backgroundColor: petal.color,
            animationDelay: `${petal.delay}s`,
          } as React.CSSProperties}
        />
      ))}
      
      <div className="bloom-card w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-sm bg-bloom-accent/30 text-bloom-text/70 rounded-full mb-2">
            A heartfelt apology for
          </span>
          <h1 className="text-4xl font-handwriting text-bloom-text mb-2">
            {defaultMessage.recipient}
          </h1>
          <div className="w-16 h-0.5 bg-bloom-primary mx-auto rounded-full" />
        </div>
        
        <div className="space-y-6">
          <p className="font-serif text-lg text-bloom-text/80 leading-relaxed italic">
            {defaultMessage.message}
          </p>
          
          <div className="text-right">
            <p className="font-handwriting text-2xl text-bloom-text">
              {defaultMessage.sender}
            </p>
          </div>
          
          <button
            className="w-full py-3 px-6 bg-bloom-primary hover:bg-bloom-primary/80 text-bloom-text rounded-full font-medium transition-all duration-300 animate-pulse-soft"
          >
            Please Forgive Me
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

export default HeartfeltBloom;
