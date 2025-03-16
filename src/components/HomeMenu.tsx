
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const HomeMenu = () => {
  const menuItems = [
    { path: '/heartfelt-bloom', name: 'Heartfelt Bloom', desc: 'Soft, warm and sincere' },
    { path: '/cosmic-sorry', name: 'Cosmic Sorry', desc: 'Deep, thoughtful and soulful' },
    { path: '/puzzle-of-us', name: 'Puzzle of Us', desc: 'Fun, interactive and playful' },
    { path: '/rainy-day', name: 'Rainy Day Reflection', desc: 'Emotional, thoughtful and reflective' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="glass-morphism max-w-md w-full p-8 space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-center font-serif">Apology Templates</h1>
        <p className="text-center text-muted-foreground mb-8">
          Choose a template to create your personalized apology
        </p>
        
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg transition-all duration-300",
                "hover:shadow-md hover:translate-x-1 group",
                "bg-white/80 backdrop-blur-sm"
              )}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all" />
            </Link>
          ))}
        </div>

        <div className="pt-6 text-center text-sm text-muted-foreground">
          <p>Create your customized apology and share it with someone special</p>
        </div>
      </div>
    </div>
  );
};

export default HomeMenu;
