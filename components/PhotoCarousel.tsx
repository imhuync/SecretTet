import React, { useState, useEffect } from 'react';
import { FriendMemory } from '../types';

interface Props {
  memories: FriendMemory[];
  onSelect: (memory: FriendMemory) => void;
}

const PhotoCarousel: React.FC<Props> = ({ memories, onSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % memories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [memories.length]);

  return (
    <div className="w-full max-w-5xl mx-auto h-[400px] sm:h-[500px] relative perspective-1000">
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-3xl glass-panel">
        
        {/* Background Blur Image */}
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl transition-all duration-1000"
            style={{ backgroundImage: `url(${memories[activeIndex].imageUrl})` }}
        />

        <div className="relative w-full h-full flex items-center justify-center p-8">
            {memories.map((mem, index) => {
                // Calculate relative position for transition effects
                const isCurrent = index === activeIndex;
                const isNext = index === (activeIndex + 1) % memories.length;
                const isPrev = index === (activeIndex - 1 + memories.length) % memories.length;
                
                let className = "absolute transition-all duration-700 ease-out cursor-pointer shadow-2xl rounded-2xl overflow-hidden border-4 border-white/30 ";
                
                if (isCurrent) {
                    className += "w-[280px] h-[380px] sm:w-[350px] sm:h-[450px] z-30 opacity-100 scale-100 rotate-0 hover:scale-105";
                } else if (isNext) {
                    className += "w-[240px] h-[320px] z-20 opacity-60 translate-x-[60%] scale-90 rotate-6 grayscale hover:grayscale-0";
                } else if (isPrev) {
                    className += "w-[240px] h-[320px] z-20 opacity-60 -translate-x-[60%] scale-90 -rotate-6 grayscale hover:grayscale-0";
                } else {
                    className += "w-[200px] h-[280px] z-10 opacity-0 scale-75";
                }

                return (
                    <div 
                        key={mem.id}
                        className={className}
                        onClick={() => isCurrent && onSelect(mem)}
                    >
                        <img 
                            src={mem.imageUrl} 
                            alt={mem.name} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                            <p className="font-bold text-lg">{mem.name}</p>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
        {memories.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? 'w-8 bg-lunar-red' : 'bg-gray-400/50'
                }`}
            />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;