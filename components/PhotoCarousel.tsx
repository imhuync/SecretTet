import React, { useState, useEffect, useRef } from 'react';
import { FriendMemory } from '../types';

interface Props {
  memories: FriendMemory[];
  onSelect: (memory: FriendMemory) => void;
}

const PhotoCarousel: React.FC<Props> = ({ memories, onSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Swipe State
  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % memories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [memories.length, isPaused, activeIndex]);

  const handleDragStart = (clientX: number) => {
    startX.current = clientX;
    isDragging.current = true;
    setIsPaused(true);
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current) return;
    currentX.current = clientX;
  };

  const handleDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsPaused(false);
    if (containerRef.current) containerRef.current.style.cursor = 'grab';

    if (startX.current !== null && currentX.current !== null) {
      const diff = startX.current - currentX.current;
      const threshold = 50;

      if (diff > threshold) {
        // Swiped Left -> Next
        setActiveIndex((prev) => (prev + 1) % memories.length);
      } else if (diff < -threshold) {
        // Swiped Right -> Prev
        setActiveIndex((prev) => (prev - 1 + memories.length) % memories.length);
      }
    }
    
    startX.current = null;
    currentX.current = null;
  };

  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  // Mouse Events
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => {
    if (isDragging.current) handleDragEnd();
  };

  const handleClick = (memory: FriendMemory, isCurrent: boolean) => {
    // Only allow click if we didn't just swipe significantly
    // Logic: if startX and currentX are null (reset by dragEnd), it's safe.
    // Ideally check if a drag happened. 
    // For now, if user clicks without dragging, it fires.
    if (isCurrent) onSelect(memory);
  };

  return (
    <div 
        ref={containerRef}
        className="w-full max-w-5xl mx-auto h-[400px] sm:h-[500px] relative perspective-1000 group select-none touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
    >
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-3xl glass-panel cursor-grab active:cursor-grabbing transition-transform">
        
        {/* Background Blur Image */}
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl transition-all duration-1000"
            style={{ backgroundImage: `url(${memories[activeIndex].imageUrl})` }}
        />

        <div className="relative w-full h-full flex items-center justify-center p-8">
            {memories.map((mem, index) => {
                const isCurrent = index === activeIndex;
                const isNext = index === (activeIndex + 1) % memories.length;
                const isPrev = index === (activeIndex - 1 + memories.length) % memories.length;
                
                let className = "absolute transition-all duration-700 ease-out shadow-2xl rounded-2xl overflow-hidden border-4 border-white/30 ";
                
                if (isCurrent) {
                    className += "w-[280px] h-[380px] sm:w-[350px] sm:h-[450px] z-30 opacity-100 scale-100 rotate-0 hover:scale-105";
                } else if (isNext) {
                    className += "w-[240px] h-[320px] z-20 opacity-60 translate-x-[60%] scale-90 rotate-6 grayscale";
                } else if (isPrev) {
                    className += "w-[240px] h-[320px] z-20 opacity-60 -translate-x-[60%] scale-90 -rotate-6 grayscale";
                } else {
                    className += "w-[200px] h-[280px] z-10 opacity-0 scale-75 pointer-events-none";
                }

                return (
                    <div 
                        key={mem.id}
                        className={className}
                        onClick={(e) => {
                            e.stopPropagation(); 
                            handleClick(mem, isCurrent);
                        }}
                    >
                        <img 
                            src={mem.imageUrl} 
                            alt={mem.name} 
                            className="w-full h-full object-cover pointer-events-none"
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