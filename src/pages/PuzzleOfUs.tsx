
import React, { useState, useEffect } from 'react';
import { Video, Puzzle, MapPin, Calendar } from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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
  const [showApologyAccepted, setShowApologyAccepted] = useState(false);
  const [showInPersonApology, setShowInPersonApology] = useState(false);
  
  // For the number matching puzzle
  const [puzzleNumbers, setPuzzleNumbers] = useState<Array<{id: number, value: number, flipped: boolean, matched: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [canFlip, setCanFlip] = useState(true);
  
  // Reference to get access to the stopAudio method
  const stopAudio = () => {
    const audioElement = document.querySelector('audio');
    if (audioElement && (audioElement as any).stop) {
      (audioElement as any).stop();
    }
  };

  // Initialize puzzle numbers
  useEffect(() => {
    // Create pairs of numbers 1-6
    const numbers = [...Array(6).keys()].map(i => i + 1);
    const pairs = [...numbers, ...numbers];
    
    // Shuffle the array
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    
    const newPuzzleNumbers = shuffled.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false
    }));
    
    setPuzzleNumbers(newPuzzleNumbers);
  }, []);

  const handleCardFlip = (id: number) => {
    if (!canFlip) return;
    
    // Don't allow flipping already matched or flipped cards
    if (puzzleNumbers[id].matched || puzzleNumbers[id].flipped) return;
    
    // Flip the card
    const newPuzzleNumbers = [...puzzleNumbers];
    newPuzzleNumbers[id].flipped = true;
    setPuzzleNumbers(newPuzzleNumbers);
    
    // Add to flipped cards array
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // If we have flipped 2 cards
    if (newFlippedCards.length === 2) {
      setCanFlip(false);
      
      // Check if they match
      const [first, second] = newFlippedCards;
      if (puzzleNumbers[first].value === puzzleNumbers[second].value) {
        // Mark as matched
        setTimeout(() => {
          const updatedPuzzleNumbers = [...newPuzzleNumbers];
          updatedPuzzleNumbers[first].matched = true;
          updatedPuzzleNumbers[second].matched = true;
          setPuzzleNumbers(updatedPuzzleNumbers);
          setFlippedCards([]);
          setCanFlip(true);
          
          // Check if all are matched
          if (updatedPuzzleNumbers.every(card => card.matched)) {
            setTimeout(() => {
              setPuzzleSolved(true);
              toast({
                title: "Puzzle Completed!",
                description: "You've revealed the apology message.",
              });
            }, 500);
          }
        }, 800);
      } else {
        // Flip back if no match
        setTimeout(() => {
          const updatedPuzzleNumbers = [...newPuzzleNumbers];
          updatedPuzzleNumbers[first].flipped = false;
          updatedPuzzleNumbers[second].flipped = false;
          setPuzzleNumbers(updatedPuzzleNumbers);
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  };

  const handleApologyAccept = () => {
    setShowApologyAccepted(true);
    toast({
      title: "Apology Accepted",
      description: `${defaultMessage.sender} has been notified of your forgiveness.`,
    });
  };

  const handleInPersonAccept = () => {
    toast({
      title: "Meeting Accepted",
      description: `${defaultMessage.sender} has been notified that you accepted the meeting.`,
    });
    setShowInPersonApology(false);
  };

  const handleInPersonReject = () => {
    toast({
      title: "Meeting Declined",
      description: `${defaultMessage.sender} has been notified that you declined the meeting.`,
    });
    setShowInPersonApology(false);
  };

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6 bg-puzzle-gradient">
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
              To see my apology, please solve the matching puzzle below
            </p>
            
            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
              {puzzleNumbers.map(card => (
                <div 
                  key={card.id} 
                  className={`
                    aspect-square rounded-lg puzzle-card
                    ${card.flipped || card.matched 
                      ? 'bg-puzzle-primary text-white' 
                      : 'bg-puzzle-secondary/50 text-puzzle-text/60'}
                    cursor-pointer transition-all duration-300
                  `}
                  onClick={() => handleCardFlip(card.id)}
                >
                  <div className="h-full flex items-center justify-center">
                    {(card.flipped || card.matched) && (
                      <span className="text-2xl font-bold">{card.value}</span>
                    )}
                    {!card.flipped && !card.matched && (
                      <Puzzle className="h-8 w-8 text-puzzle-primary/50" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center text-sm text-puzzle-text/60 italic">
              Find matching pairs to complete the puzzle
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
            
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-puzzle-primary hover:bg-puzzle-primary/80 text-white"
                onClick={handleApologyAccept}
              >
                I Forgive You
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <MapPin className="mr-2 h-4 w-4" />
                    Meet In Person
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">In-person Apology</h4>
                    <p className="text-sm text-muted-foreground">
                      {defaultMessage.sender} would like to meet you at:
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-puzzle-primary" />
                        <span>The Local Café, 123 Main Street</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-puzzle-primary" />
                        <span>This Saturday, 3:00 PM</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="flex-1 bg-puzzle-primary" 
                        onClick={handleInPersonAccept}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={handleInPersonReject}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
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
      
      {/* Apology accepted dialog */}
      <Dialog open={showApologyAccepted} onOpenChange={setShowApologyAccepted}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apology Accepted!</DialogTitle>
            <DialogDescription>
              {defaultMessage.sender} has been notified that you've accepted their apology.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <div className="rounded-full bg-green-100 p-4">
              <Puzzle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            Thank you for rebuilding your connection.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PuzzleOfUs;
