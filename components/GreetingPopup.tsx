import React, { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';

const GreetingPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a slight delay for effect
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsVisible(false)} />
      
      {/* Card */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 text-center animate-bounce-slow transform transition-all duration-700 hover:scale-105">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-lunar-red transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-6 flex justify-center">
            <div className="p-4 bg-lunar-red/10 rounded-full">
                <Sparkles className="text-lunar-red dark:text-lunar-gold w-12 h-12" />
            </div>
        </div>

        <h2 className="text-3xl font-bold mb-4 font-sans text-lunar-red dark:text-lunar-gold">
          Chúc mừng năm mới Bính Ngọ 2026!
        </h2>
        
        <p className="text-lg mb-6 leading-relaxed font-handwriting text-2xl">
          Năm mới vui vẻ, Gōngxǐ Fācái.
        </p>

        <p className="text-sm opacity-70 mb-8 font-sans">
          Hãy khám phá món quà tâm huyết của tớ nhíe^^
        </p>

        <button 
          onClick={() => setIsVisible(false)}
          className="px-8 py-3 bg-gradient-to-r from-lunar-red to-orange-500 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-500/50 transition-all hover:-translate-y-1 active:translate-y-0"
        >
          Mở quà🧧
        </button>
      </div>
    </div>
  );
};

export default GreetingPopup;