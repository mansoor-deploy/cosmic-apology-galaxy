
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const BackToHome: React.FC = () => {
  return (
    <Link 
      to="/"
      className="fixed top-6 left-6 z-40 flex items-center gap-1 py-2 px-4 bg-white/20 backdrop-blur-md rounded-full shadow-md hover:bg-white/40 transition-colors"
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="text-sm">Back</span>
    </Link>
  );
};

export default BackToHome;
