
import React, { useState, useEffect, useRef } from 'react';
import { Video, MapPin, Calendar, Flower, Heart, Send } from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import AudioPlayer from '@/components/AudioPlayer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from '@/components/ui/use-toast';

// This would be a prop in production
const defaultMessage = {
  recipient: "Robin",
  sender: "Casey",
  message: "Some mistakes leave marks like raindrops on a window. I'm deeply sorry for the pain I've caused. I hope that, like rain washing away the dust, time will help clean the hurt between us. Please accept my sincere apology.",
  videoUrl: "/rainy-video.mp4", // This would be a real video in production
  audioUrl: "/rainy-audio.mp3" // This would be a real audio in production
};

// Flower options
const flowers = [
  { id: "daisy", name: "Daisy", meaning: "Innocence and new beginnings", level: 1 },
  { id: "tulip", name: "Tulip", meaning: "Perfect love and forgiveness", level: 2 },
  { id: "lily", name: "Lily", meaning: "Devotion and humility", level: 3 },
  { id: "rose", name: "Rose", meaning: "Deep love and respect", level: 4 },
  { id: "orchid", name: "Orchid", meaning: "Rare and delicate connection", level: 5 },
];

const RainyDay = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [raindrops, setRaindrops] = useState<Array<{id: number, x: number, delay: number, opacity: number}>>([]);
  const [showFlower, setShowFlower] = useState(false);
  const [showFlowerMenu, setShowFlowerMenu] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(flowers[0].id);
  const [flowerSent, setFlowerSent] = useState(false);
  const [showInPersonApology, setShowInPersonApology] = useState(false);
  
  // Reference to get access to the stopAudio method
  const stopAudio = () => {
    const audioElement = document.querySelector('audio');
    if (audioElement && (audioElement as any).stop) {
      (audioElement as any).stop();
    }
  };

  // Create raindrops for animation
  useEffect(() => {
    const newRaindrops = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.5
    }));
    
    setRaindrops(newRaindrops);
  }, []);

  // Add new ripple effect when clicked
  const addRipple = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 3000);
  };

  const handleSendFlower = () => {
    const flower = flowers.find(f => f.id === selectedFlower);
    setFlowerSent(true);
    setShowFlowerMenu(false);
    
    toast({
      title: "Flower Delivered",
      description: `Your ${flower?.name} has been delivered to ${defaultMessage.recipient}.`,
    });
    
    // Show the flower
    setShowFlower(true);
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

  // Get the selected flower details
  const selectedFlowerDetails = flowers.find(f => f.id === selectedFlower);

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-6 bg-rainy-gradient">
      <AudioPlayer src={defaultMessage.audioUrl} />
      
      {/* Raindrops animation */}
      <div className="fixed inset-0 overflow-hidden">
        {raindrops.map(drop => (
          <div
            key={drop.id}
            className="absolute bg-rainy-secondary"
            style={{
              left: `${drop.x}%`,
              top: '-10px',
              width: '1px',
              height: '20px',
              opacity: drop.opacity,
              animation: `petal-fall ${1 + Math.random()}s linear infinite`,
              animationDelay: `${drop.delay}s`
            }}
          />
        ))}
      </div>
      
      <div 
        ref={containerRef}
        className="rainy-card w-full max-w-md z-10 animate-fade-in ripple-container"
        onClick={addRipple}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple-effect"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '10px',
              height: '10px',
            }}
          />
        ))}
        
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-sm bg-rainy-secondary/10 text-rainy-text/70 rounded-full mb-2">
            Reflections for
          </span>
          <h1 className="text-4xl font-serif text-rainy-text mb-2">
            {defaultMessage.recipient}
          </h1>
          <div className="w-16 h-0.5 bg-rainy-secondary/30 mx-auto rounded-full" />
        </div>
        
        <div className="space-y-6">
          <p className="font-serif italic text-lg text-rainy-text/80 leading-relaxed">
            {defaultMessage.message}
          </p>
          
          <div className="text-right">
            <p className="font-serif text-xl text-rainy-text">
              {defaultMessage.sender}
            </p>
          </div>
          
          {showFlower ? (
            <div className="text-center py-4 animate-fade-in">
              <div className="inline-block p-3 bg-white/40 backdrop-blur-sm rounded-full mb-2">
                {selectedFlowerDetails?.id === "rose" && (
                  <div className="text-rose-500">
                    <Heart className="h-12 w-12" />
                  </div>
                )}
                {selectedFlowerDetails?.id === "daisy" && (
                  <div className="text-yellow-400">
                    <Flower className="h-12 w-12" />
                  </div>
                )}
                {selectedFlowerDetails?.id === "tulip" && (
                  <div className="text-pink-400">
                    <Flower className="h-12 w-12" />
                  </div>
                )}
                {selectedFlowerDetails?.id === "lily" && (
                  <div className="text-white">
                    <Flower className="h-12 w-12" />
                  </div>
                )}
                {selectedFlowerDetails?.id === "orchid" && (
                  <div className="text-purple-400">
                    <Flower className="h-12 w-12" />
                  </div>
                )}
              </div>
              <p className="text-sm text-rainy-text/80">
                A {selectedFlowerDetails?.name} of forgiveness
              </p>
              <p className="text-xs text-rainy-text/60 mt-1 italic">
                "{selectedFlowerDetails?.meaning}"
              </p>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFlowerMenu(true);
                }}
                className="flex-1 bg-rainy-secondary hover:bg-rainy-secondary/80 text-white"
              >
                <Flower className="mr-2 h-4 w-4" />
                Send a Flower
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Meet In Person
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
                  <div className="space-y-4">
                    <h4 className="font-medium">In-person Apology</h4>
                    <p className="text-sm text-muted-foreground">
                      {defaultMessage.sender} would like to meet you at:
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-rainy-secondary" />
                        <span>Rainy Day Café, 456 Water Street</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-rainy-secondary" />
                        <span>This Sunday, 11:00 AM</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="flex-1 bg-rainy-secondary" 
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
          )}
        </div>
      </div>
      
      {/* Video trigger */}
      <button
        onClick={() => setIsVideoOpen(true)}
        className="video-trigger"
        aria-label="Play video message"
      >
        <Video className="h-6 w-6 text-rainy-text" />
      </button>
      
      {/* Video modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoSrc={defaultMessage.videoUrl}
        stopAudio={stopAudio}
      />
      
      {/* Flower selection dialog */}
      <Dialog open={showFlowerMenu} onOpenChange={setShowFlowerMenu}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Choose a Flower</DialogTitle>
            <DialogDescription>
              Select a flower to send with your level of forgiveness.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup 
              value={selectedFlower} 
              onValueChange={setSelectedFlower}
              className="flex flex-col space-y-3"
            >
              {flowers.map((flower) => (
                <label
                  key={flower.id}
                  className={`
                    flex items-center space-x-3 rounded-md border p-3 cursor-pointer
                    ${selectedFlower === flower.id ? 'border-rainy-secondary/70 bg-rainy-secondary/10' : 'border-muted'}
                  `}
                >
                  <RadioGroupItem value={flower.id} id={flower.id} />
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <div className="font-medium">{flower.name}</div>
                      <div className="text-sm text-muted-foreground">{flower.meaning}</div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(flower.level)].map((_, i) => (
                        <Heart key={i} className="h-3 w-3 text-rainy-secondary/70 fill-rainy-secondary/70 ml-0.5" />
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowFlowerMenu(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-rainy-secondary hover:bg-rainy-secondary/80 text-white"
              onClick={handleSendFlower}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Flower
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Flower sent dialog */}
      <Dialog open={flowerSent} onOpenChange={setFlowerSent}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Flower Delivered!</DialogTitle>
            <DialogDescription>
              Your {selectedFlowerDetails?.name} has been delivered to {defaultMessage.recipient}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <div className="rounded-full bg-rainy-secondary/20 p-4">
              <Flower className="h-8 w-8 text-rainy-secondary" />
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            They will appreciate your gesture of forgiveness.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RainyDay;
