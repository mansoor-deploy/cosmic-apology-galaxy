
import React, { useState, useEffect } from 'react';
import { Video, Puzzle } from 'lucide-react';
import BackToHome from '@/components/BackToHome';
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';
import { toast } from '@/components/ui/use-toast';

// This would be a prop in production
const defaultMessage = {
  recipient: "Taylor",
  sender: "Jordan",
  message: "I'm truly sorry for what happened. Sometimes I don't think before I act, but I'm learning to be better. Your friendship means everything to me, and I hope we can put the pieces back together.",
  videoUrl: "/puzzle-video.mp4", // This would be a real video in production
  audioUrl: "/puzzle-audio.mp3" // This would be a real audio in production
};

const PuzzleOfUs = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [pieces, setPieces] = useState<Array<{id: number, solved: boolean}>>([]);
  
  // Reference to get access to the stopAudio method
  const stopAudio = () => {
    const audioElement = document.querySelector('audio');
    if (audioElement && (audioElement as any).stop) {
      (audioElement as any).stop();
    }
  };

  // Initialize puzzle pieces
  useEffect(() => {
    const newPieces = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      solved: false
    }));
    
    setPieces(newPieces);
  }, []);

  const handlePieceClick = (id: number) => {
    const newPieces = [...pieces];
    newPieces[id].solved = true;
    setPieces(newPieces);
    
    // Check if all pieces are solved
    if (newPieces.every(piece => piece.solved)) {
      setTimeout(() => {
        setPuzzleSolved(true);
        toast({
          title: "Puzzle Completed!",
          description: "You've revealed the apology message.",
        });
      }, 500);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6 bg-puzzle-gradient">
      <BackToHome />
      <AudioPlayer src={defaultMessage.audioUrl} />
      
      <div className="puzzle-card w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-sm bg-puzzle-primary/20 text-puzzle-text/70 rounded-full mb-2">
            A puzzle for
          </span>
          <h1 className="text-4xl font-montserrat font-bold text-puzzle-text mb-2">
            {defaultMessage.recipient}
          </h1>
          <div className="w-16 h-0.5 bg-puzzle-primary mx-auto rounded-full" />
        </div>
        
        {!puzzleSolved ? (
          <div className="space-y-6">
            <p className="text-center text-puzzle-text/80 mb-8">
              To see my apology, please complete the puzzle below
            </p>
            
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {pieces.map(piece => (
                <div 
                  key={piece.id} 
                  className={`
                    aspect-square rounded-lg puzzle-piece
                    ${piece.solved 
                      ? 'bg-puzzle-primary text-white' 
                      : 'bg-puzzle-secondary/50 text-puzzle-text/60'}
                  `}
                  onClick={() => !piece.solved && handlePieceClick(piece.id)}
                >
                  <div className="h-full flex items-center justify-center">
                    <Puzzle className={`h-12 w-12 ${piece.solved ? 'text-white' : 'text-puzzle-primary/50'}`} />
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center text-sm text-puzzle-text/60 italic">
              Click each piece to complete the puzzle
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 border border-puzzle-primary/20 rounded-lg bg-white/70">
              <p className="font-lato text-puzzle-text/90 leading-relaxed">
                {defaultMessage.message}
              </p>
            </div>
            
            <div className="text-right">
              <p className="font-montserrat font-bold text-xl text-puzzle-text">
                {defaultMessage.sender}
              </p>
            </div>
            
            <button
              className="w-full py-3 px-6 bg-puzzle-primary hover:bg-puzzle-primary/80 text-white rounded-lg font-medium transition-all duration-300"
            >
              I Forgive You
            </button>
          </div>
        )}
      </div>
      
      {/* Video trigger */}
      <button
        onClick={() => setIsVideoOpen(true)}
        className="video-trigger"
        aria-label="Play video message"
      >
        <Video className="h-6 w-6 text-puzzle-text" />
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

export default PuzzleOfUs;
