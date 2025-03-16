
import React, { useState, useEffect, useRef } from 'react';
import { Video, Star, MapPin, Calendar, Image } from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from '@/components/ui/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// This would be a prop in production
const defaultMessage = {
  recipient: "Taylor",
  sender: "Morgan",
  message: "In the vast universe of our connection, I created a moment of darkness. I deeply regret the pain I caused, and like a dying star, I hope my sincere apology can lead to a new beginning between us.",
  videoUrl: "/cosmic-video.mp4", // This would be a real video in production
  audioUrl: "/cosmic-audio.mp3" // This would be a real audio in production
};

// Shared moments images
const sharedMoments = [
  { id: 1, title: "Stargazing night", url: "https://images.unsplash.com/photo-1439886183900-e79ec0057170" },
  { id: 2, title: "Meteor shower", url: "https://images.unsplash.com/photo-1438565434616-3ef039228b15" },
  { id: 3, title: "Planetarium date", url: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d" },
  { id: 4, title: "Northern lights trip", url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
];

const CosmicSorry = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number, blinking: boolean}>>([]);
  const [constellationStars, setConstellationStars] = useState<Array<{id: number, x: number, y: number, connected: boolean}>>([]);
  const [connectingLine, setConnectingLine] = useState<{fromStar: number | null, toX: number, toY: number}>({
    fromStar: null,
    toX: 0,
    toY: 0
  });
  const [starAlignment, setStarAlignment] = useState(false);
  const [starsRealigned, setStarsRealigned] = useState(false);
  const constellationRef = useRef<HTMLDivElement>(null);
  const [showInPersonApology, setShowInPersonApology] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  
  // Reference to get access to the stopAudio method
  const stopAudio = () => {
    const audioElement = document.querySelector('audio');
    if (audioElement && (audioElement as any).stop) {
      (audioElement as any).stop();
    }
  };

  // Create background stars
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.5 + Math.random() * 0.5,
      blinking: Math.random() > 0.7
    }));
    
    setStars(newStars);
  }, []);
  
  // Create constellation stars
  useEffect(() => {
    if (constellationRef.current) {
      const width = constellationRef.current.clientWidth;
      const height = constellationRef.current.clientHeight;
      
      // Define 7 stars in a pattern
      const newConstellationStars = [
        { id: 1, x: width * 0.2, y: height * 0.2, connected: false },
        { id: 2, x: width * 0.4, y: height * 0.3, connected: false },
        { id: 3, x: width * 0.6, y: height * 0.2, connected: false },
        { id: 4, x: width * 0.8, y: height * 0.3, connected: false },
        { id: 5, x: width * 0.7, y: height * 0.6, connected: false },
        { id: 6, x: width * 0.5, y: height * 0.8, connected: false },
        { id: 7, x: width * 0.3, y: height * 0.7, connected: false }
      ];
      
      setConstellationStars(newConstellationStars);
    }
  }, [constellationRef.current]);
  
  const handleStarClick = (starId: number, x: number, y: number) => {
    if (connectingLine.fromStar === null) {
      // Start connecting from this star
      setConnectingLine({
        fromStar: starId,
        toX: x,
        toY: y
      });
    } else if (connectingLine.fromStar !== starId) {
      // Connect to this star
      setConstellationStars(prev => prev.map(star => 
        star.id === starId || star.id === connectingLine.fromStar
          ? { ...star, connected: true }
          : star
      ));
      
      // Reset connecting line
      setConnectingLine({
        fromStar: null,
        toX: 0,
        toY: 0
      });
      
      // Check if all stars are connected
      const allConnected = constellationStars.every(star => star.connected);
      if (allConnected) {
        setStarAlignment(true);
      }
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (connectingLine.fromStar !== null && constellationRef.current) {
      const rect = constellationRef.current.getBoundingClientRect();
      setConnectingLine(prev => ({
        ...prev,
        toX: e.clientX - rect.left,
        toY: e.clientY - rect.top
      }));
    }
  };
  
  const realignStars = () => {
    setStarsRealigned(true);
    
    toast({
      title: "Stars Realigned",
      description: `${defaultMessage.recipient} has been notified of your acceptance.`,
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
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-cosmic-gradient overflow-hidden">
      <AudioPlayer src={defaultMessage.audioUrl} />
      
      {/* Background stars */}
      <div className="fixed inset-0 overflow-hidden">
        {stars.map(star => (
          <div
            key={star.id}
            className={`absolute rounded-full bg-white ${star.blinking ? 'animate-pulse-soft' : ''}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity
            }}
          />
        ))}
      </div>
      
      {/* Breathing animation */}
      <div className="fixed inset-0 bg-purple-500/5 backdrop-blur-[100px] animate-breathe" />
      
      <div className="cosmic-card w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Star className="h-4 w-4 text-purple-400" fill="currentColor" />
            <h2 className="text-sm font-light tracking-widest text-purple-300 uppercase">
              Cosmic Apology
            </h2>
            <Star className="h-4 w-4 text-purple-400" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-light tracking-wide text-cosmic-text mb-2">
            {defaultMessage.recipient}
          </h1>
          <div className="w-16 h-0.5 bg-purple-500/30 mx-auto rounded-full" />
        </div>
        
        <div className="space-y-6">
          <p className="text-lg font-light leading-relaxed text-cosmic-text/90">
            {defaultMessage.message}
          </p>
          
          <div className="text-right">
            <p className="text-lg font-light text-purple-400">
              {defaultMessage.sender}
            </p>
          </div>
          
          {!starsRealigned ? (
            <div 
              ref={constellationRef} 
              className="w-full h-56 bg-black/50 rounded-lg my-8 relative cursor-pointer"
              onMouseMove={handleMouseMove}
            >
              {constellationStars.map(star => (
                <div
                  key={star.id}
                  className={`absolute w-3 h-3 rounded-full ${star.connected ? 'bg-purple-300' : 'bg-white/70'} hover:bg-purple-400 transition-colors`}
                  style={{
                    left: star.x - 6,
                    top: star.y - 6
                  }}
                  onClick={() => handleStarClick(star.id, star.x, star.y)}
                />
              ))}
              
              {/* Connection lines between stars */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Draw lines between connected stars */}
                {constellationStars.map((star, index) => {
                  if (index === 0 || !star.connected) return null;
                  const prevStar = constellationStars.find(s => s.id === star.id - 1);
                  if (!prevStar) return null;
                  
                  return (
                    <line
                      key={`line-${star.id}`}
                      x1={prevStar.x}
                      y1={prevStar.y}
                      x2={star.x}
                      y2={star.y}
                      stroke="rgba(167, 139, 250, 0.5)"
                      strokeWidth="2"
                    />
                  );
                })}
                
                {/* Active connecting line */}
                {connectingLine.fromStar !== null && (
                  <line
                    x1={constellationStars.find(s => s.id === connectingLine.fromStar)?.x || 0}
                    y1={constellationStars.find(s => s.id === connectingLine.fromStar)?.y || 0}
                    x2={connectingLine.toX}
                    y2={connectingLine.toY}
                    stroke="rgba(167, 139, 250, 0.7)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                )}
              </svg>
              
              {!starAlignment ? (
                <div className="absolute inset-0 flex items-center justify-center text-white/70 pointer-events-none">
                  <p className="text-sm font-light tracking-wide">Connect the stars to realign our constellation</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in rounded-lg">
                  <Button
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                    onClick={realignStars}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Realign Our Stars
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full bg-black/30 rounded-lg p-6 text-center animate-fade-in">
              <Star className="h-8 w-8 text-purple-300 mx-auto mb-3" fill="currentColor" />
              <p className="text-cosmic-text text-lg">Our stars have realigned</p>
              <p className="text-purple-300/70 text-sm mt-1">The universe brings us back together</p>
            </div>
          )}
          
          <div className="flex flex-col gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 text-cosmic-text hover:bg-purple-950/20"
                >
                  <MapPin className="mr-2 h-4 w-4 text-purple-400" />
                  Meet In Person
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-cosmic-primary/90 border border-purple-500/20 text-cosmic-text backdrop-blur-md">
                <div className="space-y-4">
                  <h4 className="font-medium">In-person Apology</h4>
                  <p className="text-sm text-cosmic-text/70">
                    {defaultMessage.sender} would like to meet you at:
                  </p>
                  <div className="bg-black/30 p-3 rounded-md text-sm space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                      <span>Celestial Observatory, 789 Cosmos Drive</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                      <span>Next Friday, 9:00 PM</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white" 
                      onClick={handleInPersonAccept}
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-purple-500/30" 
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
              className="bg-transparent hover:bg-purple-950/20 text-cosmic-text border border-purple-500/30"
            >
              <Image className="mr-2 h-4 w-4 text-purple-400" />
              Moments Spent Together
            </Button>
          </div>
          
          {showMemories && (
            <div className="py-4 animate-fade-in bg-black/30 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-center text-purple-300 mb-4">Our Cosmic Journey Together</h3>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {sharedMoments.map((moment) => (
                    <CarouselItem key={moment.id}>
                      <div className="p-1">
                        <div className="overflow-hidden rounded-lg border border-purple-500/20">
                          <img 
                            src={moment.url} 
                            alt={moment.title} 
                            className="w-full h-48 object-cover hover:scale-105 transition-all duration-500"
                          />
                        </div>
                        <p className="text-center mt-2 text-sm text-purple-300/80">
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
        <Video className="h-6 w-6 text-cosmic-text" />
      </button>
      
      {/* Video modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoSrc={defaultMessage.videoUrl}
        stopAudio={stopAudio}
      />
      
      {/* Star realignment dialog */}
      <Dialog open={starsRealigned && !showMemories} onOpenChange={setStarsRealigned}>
        <DialogContent className="sm:max-w-md bg-cosmic-primary/90 border border-purple-500/20 text-cosmic-text backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Stars Realigned!</DialogTitle>
            <DialogDescription className="text-cosmic-text/70">
              You've accepted the apology and restored balance to your connection.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4 space-x-2">
            {[1, 2, 3].map(i => (
              <Star key={i} className={`h-6 w-6 text-purple-400 fill-purple-400 animate-pulse-soft`} style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
          <p className="text-center text-purple-300/70">
            A new chapter begins in your cosmic journey together.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CosmicSorry;
