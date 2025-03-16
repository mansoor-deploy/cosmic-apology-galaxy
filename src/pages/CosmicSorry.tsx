
import React, { useState, useEffect, useRef } from 'react';
import { Video, MapPin, Calendar } from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from '@/components/ui/use-toast';

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
  const [realigning, setRealigning] = useState(false);
  const [showApologyAccepted, setShowApologyAccepted] = useState(false);
  const [showInPersonApology, setShowInPersonApology] = useState(false);
  
  const constellationRef = useRef<SVGSVGElement>(null);

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

  const handleRealignStars = () => {
    setRealigning(true);
    
    // Animate constellation realignment
    if (constellationRef.current) {
      const path = constellationRef.current.querySelector('path');
      if (path) {
        path.classList.add('animate-pulse');
        
        // Change the path data to simulate realignment
        setTimeout(() => {
          path.setAttribute('d', 'M30,50 L70,30 L120,50 L170,40 L210,50 L250,30');
          
          setTimeout(() => {
            path.setAttribute('d', 'M30,40 L80,40 L130,40 L180,40 L230,40 L270,40');
            path.classList.remove('animate-pulse');
            
            // Show apology accepted dialog
            setTimeout(() => {
              setRealigning(false);
              setShowApologyAccepted(true);
              toast({
                title: "Stars Realigned!",
                description: `${defaultMessage.sender} has been notified of your forgiveness.`,
              });
            }, 1000);
          }, 1000);
        }, 1000);
      }
    }
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
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6 bg-cosmic-primary">
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
                className={`absolute bg-white rounded-full ${realigning ? 'animate-ping' : 'animate-pulse-soft'}`}
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
              <svg 
                ref={constellationRef}
                className="absolute inset-0 w-full h-full animate-fade-in-slow" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M30,30 L60,50 L100,40 L150,60 L190,30 L220,70 L270,50" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeWidth="1" 
                  fill="none" 
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
            )}
          </div>
          
          <div className="text-right">
            <p className="font-serif text-xl text-cosmic-text/90">
              {defaultMessage.sender}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button
              className="flex-1 bg-cosmic-secondary hover:bg-cosmic-secondary/80 text-white"
              onClick={handleRealignStars}
              disabled={realigning}
            >
              {realigning ? "Realigning..." : "Realign Our Stars"}
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 border-cosmic-secondary/30 text-cosmic-text">
                  <MapPin className="mr-2 h-4 w-4" />
                  Meet In Person
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-cosmic-primary/95 border-cosmic-secondary/30 text-cosmic-text">
                <div className="space-y-4">
                  <h4 className="font-medium">In-person Apology</h4>
                  <p className="text-sm text-cosmic-text/80">
                    {defaultMessage.sender} would like to meet you at:
                  </p>
                  <div className="bg-cosmic-secondary/10 p-3 rounded-md text-sm space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-cosmic-secondary" />
                      <span>Celestial Observatory, 789 Star Lane</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-cosmic-secondary" />
                      <span>This Friday, 8:00 PM</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 bg-cosmic-secondary hover:bg-cosmic-secondary/80" 
                      onClick={handleInPersonAccept}
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-cosmic-secondary/30" 
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
      
      {/* Apology accepted dialog */}
      <Dialog open={showApologyAccepted} onOpenChange={setShowApologyAccepted}>
        <DialogContent className="sm:max-w-md bg-cosmic-primary/95 border-cosmic-secondary text-cosmic-text">
          <DialogHeader>
            <DialogTitle className="text-cosmic-text">Stars Realigned!</DialogTitle>
            <DialogDescription className="text-cosmic-text/80">
              {defaultMessage.sender} has been notified that you've forgiven them and your cosmic paths have realigned.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <div className="rounded-full bg-cosmic-secondary/20 p-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <p className="text-center text-cosmic-text/70">
            May your connection shine brighter than before.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CosmicSorry;
