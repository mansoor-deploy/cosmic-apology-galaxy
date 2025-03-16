
import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  stopAudio: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoSrc, stopAudio }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      stopAudio();
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, stopAudio]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden max-w-3xl w-full animate-scale-in"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
          aria-label="Close video"
        >
          <X className="h-6 w-6 text-white" />
        </button>
        
        <div className="aspect-video w-full">
          <video 
            className="w-full h-full object-cover" 
            src={videoSrc} 
            controls 
            autoPlay
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
