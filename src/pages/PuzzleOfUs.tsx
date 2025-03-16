
import React, { useState, useEffect, useRef } from 'react';
import { Video, Puzzle, Sparkles, MapPin, Calendar, Image } from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from '@/components/ui/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// This would be a prop in production
const defaultMessage = {
  recipient: "Riley",
  sender: "Jamie",
  message: "I messed up a piece of our puzzle. I'm so sorry for what I did, and I hope we can fit our pieces back together. Your friendship means the world to me.",
  videoUrl: "/puzzle-video.mp4", // This would be a real video in production
  audioUrl: "/puzzle-audio.mp3" // This would be a real audio in production
};

// Number matching puzzle
const puzzleNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

// Shared moments images
const sharedMoments = [
  { id: 1, title: "Board game night", url: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f" },
  { id: 2, title: "Weekend hike", url: "https://images.unsplash.com/photo-1438565434616-3ef039228b15" },
  { id: 3, title: "Birthday party", url: "https://images.unsplash.com/photo-1469041797191-50ace28483c3" },
  { id: 4, title: "Karaoke night", url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
];

const PuzzleOfUs = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [puzzleShown, setPuzzleShown] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<{index: number, number: number}[]>([]);
  const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);
  const [showInPersonApology, setShowInPersonApology] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [apologyAccepted, setApologyAccepted] = useState(false);
  
  // Reference to get access to the stopAudio method
  const stopAudio = () => {
    const audioElement = document.querySelector('audio');
    if (audioElement && (audioElement as any).stop) {
      (audioElement as any).stop();
    }
  };

  // Initialize puzzle
  useEffect(() => {
    // Create shuffled array with pairs
    const allNumbers = [...puzzleNumbers, ...puzzleNumbers];
    const shuffled = allNumbers.sort(() => Math.random() - 0.5);
    setShuffledNumbers(shuffled);
  }, []);
  
  const handleNumberClick = (index: number) => {
    const number = shuffledNumbers[index];
    
    // Ignore if already matched
    if (matchedPairs.includes(number)) return;
    
    // Ignore if already selected
    if (selectedItems.some(item => item.index === index)) return;
    
    // Add to selected
    const newSelected = [...selectedItems, { index, number }];
    setSelectedItems(newSelected);
    
    // If we have 2 selections
    if (newSelected.length === 2) {
      if (newSelected[0].number === newSelected[1].number) {
        // Match found!
        setMatchedPairs([...matchedPairs, number]);
        
        // Check if puzzle is complete
        if (matchedPairs.length === puzzleNumbers.length - 1) {
          setTimeout(() => {
            setPuzzleSolved(true);
          }, 500);
        }
      }
      
      // Reset selection after a delay
      setTimeout(() => {
        setSelectedItems([]);
      }, 1000);
    }
  };
  
  const handleAcceptApology = () => {
    setApologyAccepted(true);
    
    toast({
      title: "Apology Accepted",
      description: `${defaultMessage.sender} has been notified that you accepted their apology.`,
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

  // Function to determine if a card is flipped
  const isFlipped = (index: number) => {
    return selectedItems.some(item => item.index === index) || matchedPairs.includes(shuffledNumbers[index]);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-puzzle-gradient">
      <AudioPlayer src={defaultMessage.audioUrl} />
      
      <div className="puzzle-card w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 text-sm font-montserrat bg-puzzle-primary/10 text-puzzle-text/70 rounded-full mb-2">
            A puzzle piece for
          </div>
          <h1 className="text-4xl font-montserrat font-bold text-puzzle-text mb-2">
            {defaultMessage.recipient}
          </h1>
          <div className="w-16 h-1 bg-puzzle-primary/50 mx-auto rounded-full" />
        </div>
        
        <div className="space-y-6">
          <p className="font-lato text-lg text-puzzle-text/80 leading-relaxed">
            {defaultMessage.message}
          </p>
          
          <div className="text-right">
            <p className="font-montserrat text-lg font-semibold text-puzzle-primary">
              {defaultMessage.sender}
            </p>
          </div>
          
          {!puzzleShown ? (
            <Button
              onClick={() => setPuzzleShown(true)}
              className="w-full bg-puzzle-primary hover:bg-puzzle-primary/90 text-white"
            >
              <Puzzle className="mr-2 h-4 w-4" />
              Solve the Puzzle
            </Button>
          ) : (
            !puzzleSolved ? (
              <div className="w-full py-4 animate-fade-in">
                <div className="grid grid-cols-4 gap-3">
                  {shuffledNumbers.map((number, index) => (
                    <div
                      key={index}
                      onClick={() => handleNumberClick(index)}
                      className={`
                        aspect-square rounded-lg font-montserrat font-bold text-xl flex items-center justify-center transition-all cursor-pointer
                        ${isFlipped(index) 
                          ? 'bg-white rotate-y-0' 
                          : 'bg-puzzle-primary text-white rotate-y-180'}
                      `}
                      style={{
                        perspective: '1000px',
                        transform: isFlipped(index) ? 'rotateY(0deg)' : 'rotateY(180deg)',
                        transition: 'transform 0.6s',
                      }}
                    >
                      {isFlipped(index) && (
                        <span className={matchedPairs.includes(number) ? 'text-green-600' : 'text-puzzle-text'}>
                          {number}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-center mt-4 text-sm text-puzzle-text/60">
                  Match pairs of numbers to reveal the apology
                </p>
              </div>
            ) : (
              <div className="w-full py-4 animate-fade-in text-center space-y-4">
                <div className="bg-puzzle-primary/10 p-6 rounded-lg">
                  <Sparkles className="mx-auto h-8 w-8 text-puzzle-primary mb-3" />
                  <h3 className="font-montserrat font-bold text-xl text-puzzle-primary mb-2">
                    Puzzle Solved!
                  </h3>
                  <p className="text-puzzle-text">
                    You've put the pieces back together.
                  </p>
                  
                  <Button
                    onClick={handleAcceptApology}
                    className="mt-4 bg-puzzle-primary hover:bg-puzzle-primary/90 text-white"
                  >
                    Accept Apology
                  </Button>
                </div>
              </div>
            )
          )}
          
          <div className="flex flex-col gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-puzzle-primary/20 text-puzzle-text hover:bg-puzzle-primary/5"
                >
                  <MapPin className="mr-2 h-4 w-4 text-puzzle-primary" />
                  Meet In Person
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">In-person Apology</h4>
                  <p className="text-sm text-muted-foreground">
                    {defaultMessage.sender} would like to meet you at:
                  </p>
                  <div className="bg-puzzle-primary/10 p-3 rounded-md text-sm space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-puzzle-primary" />
                      <span>The Puzzle Cafe, 321 Game Street</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-puzzle-primary" />
                      <span>This Thursday, 4:00 PM</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 bg-puzzle-primary hover:bg-puzzle-primary/90 text-white" 
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
            
            <Button 
              onClick={() => setShowMemories(!showMemories)} 
              className="bg-transparent hover:bg-puzzle-primary/5 text-puzzle-text border border-puzzle-primary/20"
            >
              <Image className="mr-2 h-4 w-4 text-puzzle-primary" />
              Moments Spent Together
            </Button>
          </div>
          
          {showMemories && (
            <div className="py-4 animate-fade-in bg-puzzle-primary/5 rounded-lg p-4">
              <h3 className="font-montserrat font-semibold text-center text-puzzle-primary mb-4">Our Memories</h3>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {sharedMoments.map((moment) => (
                    <CarouselItem key={moment.id}>
                      <div className="p-1">
                        <div className="overflow-hidden rounded-lg border border-puzzle-primary/20">
                          <img 
                            src={moment.url} 
                            alt={moment.title} 
                            className="w-full h-48 object-cover hover:scale-105 transition-all duration-500"
                          />
                        </div>
                        <p className="text-center mt-2 text-sm font-montserrat text-puzzle-text">
                          {moment.title}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          )}
        </div>
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
      <Dialog open={apologyAccepted} onOpenChange={setApologyAccepted}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apology Accepted!</DialogTitle>
            <DialogDescription>
              Your acceptance has been sent to {defaultMessage.sender}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <div className="rounded-full bg-puzzle-primary/20 p-4">
              <Puzzle className="h-8 w-8 text-puzzle-primary" />
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            Together, you can rebuild what was broken.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PuzzleOfUs;
