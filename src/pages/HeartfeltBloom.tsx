
import React, { useState, useEffect, useRef } from 'react';
import { Video, Calendar, MapPin, Heart, Image, Send, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';
import { toast } from '@/components/ui/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// This would be a prop in production
const defaultMessage = {
  recipient: "Alex",
  sender: "Jordan",
  message: "I apologize for my thoughtless words. I value our connection deeply and hope you can find it in your heart to forgive me.",
  videoUrl: "/heartfelt-video.mp4", // This would be a real video in production
  audioUrl: "/heartfelt-audio.mp3" // This would be a real audio in production
};

// Shared moments images
const sharedMoments = [
  { id: 1, title: "Our first date", url: "https://images.unsplash.com/photo-1469041797191-50ace28483c3" },
  { id: 2, title: "Summer festival", url: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2" },
  { id: 3, title: "Holiday together", url: "https://images.unsplash.com/photo-1493962853295-0fd70327578a" },
  { id: 4, title: "Anniversary dinner", url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
];

const HeartfeltBloom = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [petals, setPetals] = useState<Array<{id: number, x: number, scale: number, delay: number, rotation: number}>>([]);
  const [showInPersonApology, setShowInPersonApology] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<Array<{id: number, x: number, y: number, scale: number, opacity: number}>>([]);
  const [showMemories, setShowMemories] = useState(false);
  const [acceptedApology, setAcceptedApology] = useState(false);
  
  // Reference to get access to the stopAudio method
  const stopAudio = () => {
    const audioElement = document.querySelector('audio');
    if (audioElement && (audioElement as any).stop) {
      (audioElement as any).stop();
    }
  };
  
  // Create petals for animation
  useEffect(() => {
    const newPetals = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      scale: 0.3 + Math.random() * 0.7,
      delay: Math.random() * 10,
      rotation: Math.random() * 360
    }));
    
    setPetals(newPetals);
  }, []);
  
  const createFloatingHearts = () => {
    // Create 20 hearts at random positions
    const newHearts = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: 40 + (Math.random() * 20),
      y: 50 + (Math.random() * 30),
      scale: 0.5 + Math.random() * 0.5,
      opacity: 0.6 + Math.random() * 0.4
    }));
    
    setFloatingHearts([...floatingHearts, ...newHearts]);
    
    // Remove hearts after animation completes
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => !newHearts.find(newHeart => newHeart.id === heart.id)));
    }, 5000);
  };
  
  const handleAcceptApology = () => {
    setAcceptedApology(true);
    createFloatingHearts();
    
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
    setAcceptedApology(true);
    createFloatingHearts();
  };
  
  const handleInPersonReject = () => {
    toast({
      title: "Meeting Declined",
      description: `${defaultMessage.sender} has been notified that you declined the meeting.`,
    });
    setShowInPersonApology(false);
  };
  
  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6 bg-bloom-gradient">
      <AudioPlayer src={defaultMessage.audioUrl} />
      
      {/* Petal animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {petals.map(petal => (
          <div
            key={petal.id}
            className="petal"
            style={{
              left: `${petal.x}%`,
              backgroundColor: `hsl(var(--bloom-primary) / ${0.3 + Math.random() * 0.2})`,
              width: `${20 + Math.random() * 15}px`,
              height: `${20 + Math.random() * 15}px`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${petal.delay}s`,
              transform: `scale(${petal.scale}) rotate(${petal.rotation}deg)`
            }}
          />
        ))}
      </div>
      
      {/* Floating hearts animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            className="absolute pointer-events-none"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              opacity: heart.opacity,
              animation: 'float-up 5s ease-out forwards'
            }}
          >
            <Heart 
              fill="currentColor" 
              className="text-pink-400" 
              size={10 + Math.random() * 20}
            />
          </div>
        ))}
      </div>
      
      <div className="bloom-card w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="font-handwriting text-3xl text-pink-600 opacity-75 mb-1">
            For You
          </h2>
          <h1 className="text-4xl font-montserrat font-light text-bloom-text mb-2">
            {defaultMessage.recipient}
          </h1>
          <div className="w-12 h-0.5 bg-pink-200 mx-auto" />
        </div>
        
        <div className="space-y-6">
          <p className="font-handwriting text-xl text-bloom-text leading-relaxed">
            {defaultMessage.message}
          </p>
          
          <div className="text-right">
            <p className="font-handwriting text-xl text-pink-500">
              {defaultMessage.sender}
            </p>
          </div>
          
          <div className="flex flex-col gap-4 mt-8">
            <Button
              onClick={handleAcceptApology}
              className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white"
            >
              <Heart className="mr-2 h-4 w-4" />
              Accept Apology
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-pink-200 text-bloom-text hover:bg-pink-50">
                  <MapPin className="mr-2 h-4 w-4 text-pink-400" />
                  Meet In Person
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">In-person Apology</h4>
                  <p className="text-sm text-muted-foreground">
                    {defaultMessage.sender} would like to meet you at:
                  </p>
                  <div className="bg-pink-50 p-3 rounded-md text-sm space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-pink-400" />
                      <span>Blossom Gardens, 123 Petal Lane</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-pink-400" />
                      <span>This Saturday, 2:00 PM</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white" 
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
              className="bg-transparent hover:bg-pink-50 text-bloom-text border border-pink-200"
            >
              <Image className="mr-2 h-4 w-4 text-pink-400" />
              Moments Spent Together
            </Button>
          </div>
          
          {showMemories && (
            <div className="py-4 animate-fade-in bg-pink-50/50 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-handwriting text-2xl text-center text-pink-500 mb-4">Our Memories</h3>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {sharedMoments.map((moment) => (
                    <CarouselItem key={moment.id}>
                      <div className="p-1">
                        <div className="overflow-hidden rounded-lg shadow-md">
                          <img 
                            src={moment.url} 
                            alt={moment.title} 
                            className="w-full h-48 object-cover hover:scale-105 transition-all duration-500"
                          />
                        </div>
                        <p className="text-center mt-2 text-sm font-montserrat text-bloom-text">
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
        <Video className="h-6 w-6 text-bloom-text" />
      </button>
      
      {/* Video modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoSrc={defaultMessage.videoUrl}
        stopAudio={stopAudio}
      />
      
      {/* Apology accepted dialog */}
      <Dialog open={acceptedApology} onOpenChange={setAcceptedApology}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apology Accepted!</DialogTitle>
            <DialogDescription>
              You've accepted {defaultMessage.sender}'s apology.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <div className="rounded-full bg-pink-100 p-4">
              <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            This is the beginning of healing together.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeartfeltBloom;
