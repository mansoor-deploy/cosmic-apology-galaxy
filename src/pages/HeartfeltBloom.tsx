
import React, { useState, useEffect, useRef } from 'react';
import { Video, MapPin, Calendar, Heart } from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from '@/components/ui/use-toast';

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
  const [petals, setPetals] = useState<Array<{id: number, delay: number, size: number, color: string}>>([]);
  const [heartAnimationPlaying, setHeartAnimationPlaying] = useState(false);
  const [showApologyAccepted, setShowApologyAccepted] = useState(false);
  const [animatedMessage, setAnimatedMessage] = useState("");
  const [messageComplete, setMessageComplete] = useState(false);
  const messageRef = useRef(defaultMessage.message);
  const heartsContainerRef = useRef<HTMLDivElement>(null);
  
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
    
    // Animate the message typing
    let index = 0;
    const interval = setInterval(() => {
      if (index <= messageRef.current.length) {
        setAnimatedMessage(messageRef.current.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
        setMessageComplete(true);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  const createHeartAnimation = () => {
    if (!heartsContainerRef.current || heartAnimationPlaying) return;
    
    setHeartAnimationPlaying(true);
    
    // Create 15 hearts
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        if (!heartsContainerRef.current) return;
        
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'floating-heart';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDuration = `${2 + Math.random() * 3}s`;
        heart.style.fontSize = `${20 + Math.random() * 20}px`;
        heart.style.opacity = `${0.4 + Math.random() * 0.6}`;
        
        heartsContainerRef.current.appendChild(heart);
        
        // Remove the heart after animation
        setTimeout(() => {
          if (heartsContainerRef.current && heartsContainerRef.current.contains(heart)) {
            heartsContainerRef.current.removeChild(heart);
          }
        }, 5000);
      }, i * 300);
    }
    
    // Show apology accepted dialog after hearts animation
    setTimeout(() => {
      setShowApologyAccepted(true);
      setHeartAnimationPlaying(false);
      toast({
        title: "Apology Accepted",
        description: `${defaultMessage.sender} has been notified of your forgiveness.`,
      });
    }, 5000);
  };

  const handleInPersonAccept = () => {
    toast({
      title: "Meeting Accepted",
      description: `${defaultMessage.sender} has been notified that you accepted the meeting.`,
    });
  };

  const handleInPersonReject = () => {
    toast({
      title: "Meeting Declined",
      description: `${defaultMessage.sender} has been notified that you declined the meeting.`,
    });
  };

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6 bg-bloom-gradient">
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
      
      {/* Hearts animation container */}
      <div 
        ref={heartsContainerRef}
        className="fixed inset-0 overflow-hidden pointer-events-none"
      ></div>
      
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
          <div className="animate-message-container">
            <p className="font-serif text-lg text-bloom-text/80 leading-relaxed italic min-h-[120px]">
              {animatedMessage}
              {!messageComplete && <span className="typing-cursor">|</span>}
            </p>
          </div>
          
          <div className="text-right">
            <p className="font-handwriting text-2xl text-bloom-text">
              {defaultMessage.sender}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button
              className="flex-1 py-3 px-6 bg-bloom-primary hover:bg-bloom-primary/80 text-bloom-text rounded-full font-medium transition-all duration-300"
              onClick={createHeartAnimation}
              disabled={heartAnimationPlaying}
            >
              <Heart className="mr-2 h-4 w-4" />
              Please Forgive Me
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-full border-bloom-primary/30"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Meet In Person
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-lg">
                <div className="space-y-4">
                  <h4 className="font-medium">In-person Apology</h4>
                  <p className="text-sm text-muted-foreground">
                    {defaultMessage.sender} would like to meet you at:
                  </p>
                  <div className="bg-bloom-accent/10 p-3 rounded-md text-sm space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-bloom-primary" />
                      <span>Bloom Gardens, 321 Flower Avenue</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-bloom-primary" />
                      <span>Tomorrow, 2:00 PM</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 bg-bloom-primary rounded-full" 
                      onClick={handleInPersonAccept}
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-full" 
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
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>Apology Accepted!</DialogTitle>
            <DialogDescription>
              {defaultMessage.sender} has been notified that you've accepted their apology.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <div className="rounded-full bg-bloom-accent/20 p-4">
              <Heart className="h-8 w-8 text-bloom-primary fill-bloom-primary/30" />
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            Thank you for your kindness and understanding.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeartfeltBloom;
