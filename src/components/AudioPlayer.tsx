
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  autoplay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, autoplay = true }) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Audio play error:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    // To expose stop method for the VideoModal component
    if (audioRef.current) {
      (audioRef.current as any).stop = () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlaying(false);
        }
      };
    }
  }, []);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <audio ref={audioRef} src={src} loop />
      <button 
        onClick={togglePlayback}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-md hover:bg-white/40 transition-colors"
        aria-label={isPlaying ? "Mute background music" : "Play background music"}
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5 text-gray-800" />
        ) : (
          <VolumeX className="h-5 w-5 text-gray-800" />
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
