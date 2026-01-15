import React, { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import GreetingPopup from './components/GreetingPopup';
import MusicPlayer from './components/MusicPlayer';
import PhotoCarousel from './components/PhotoCarousel';
import PersonalizedModal from './components/PersonalizedModal';
import LuckyMoneyGame from './components/LuckyMoneyGame';
import CountdownTimer from './components/CountdownTimer';
import { MEMORIES } from './constants';
import { FriendMemory } from './types';
import { Clover } from 'lucide-react';

const App: React.FC = () => {
  const [selectedMemory, setSelectedMemory] = useState<FriendMemory | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleMemorySelect = (memory: FriendMemory) => {
    setSelectedMemory(memory);
  };

  const handleInteractionComplete = () => {
    setHasInteracted(true);
  };

  return (
    /*<div className="min-h-screen relative overflow-x-hidden font-sans transition-colors duration-500 bg-[#fafafa] dark:bg-[#1a0505]">*/
    <div className="min-h-screen relative overflow-x-hidden font-sans transition-colors duration-500 bg-gradient-to-br from-white via-red-50/50 to-red-100/20 dark:from-black dark:via-red-950/30 dark:to-black">
      
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-lunar-red/15 dark:bg-lunar-red/5 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-400/15 dark:bg-lunar-gold/5 rounded-full blur-[120px]" />
      </div>

      {/* Grid Overlay for Texture */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <ThemeToggle />
      <GreetingPopup />
      <MusicPlayer />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full p-6 z-40 flex justify-between items-center max-w-7xl mx-auto right-0">
         <div className="flex items-center gap-3 group cursor-pointer">
             <div className="bg-lunar-red p-2 rounded-xl text-white shadow-lg shadow-lunar-red/20 group-hover:scale-110 transition-transform duration-300">
                <Clover size={24} />
             </div>
             <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white font-serif">Xuân Bính Ngọ</span>
         </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center min-h-screen gap-16">
        
        {/* Hero Section */}
        <header className="text-center space-y-8 mb-4 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-lunar-red/5 dark:bg-white/5 border border-lunar-red/20 dark:border-white/10 backdrop-blur-md shadow-sm">
                <span className="text-xs font-bold text-lunar-red dark:text-lunar-red tracking-[0.2em] uppercase">Year of the Horse • 2026</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-gray-900 dark:text-white drop-shadow-sm font-serif leading-[0.9] tracking-tight">
                Celebrate the <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-lunar-red via-orange-500 to-lunar-gold animate-gradient-x bg-300%">New Beginning</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                Chào mừng đến với món quà to bự cho Tết Nguyên Đán 2026. Chúc chúng ta năm mới Bính Ngọ luôn vui vẻ, mạnh khoẻ, hạnh phúc, học hành thuận lợi, đạt học bổng và sinh viên xuất sắc🔥🔥🔥
            </p>
        </header>

        {/* Countdown Section */}
        <section className="w-full animate-fade-in-up flex justify-center z-20">
            <CountdownTimer />
        </section>

        {/* Carousel Section */}
        <section className="w-full animate-fade-in-up delay-200">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest opacity-80">Các bạn của tôyyy</h3>
            </div>
            <PhotoCarousel 
                memories={MEMORIES} 
                onSelect={handleMemorySelect} 
            />
        </section>

        {/* Lucky Money Section - Appears after interaction */}
        <section className={`w-full transition-all duration-1000 ${hasInteracted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
             <LuckyMoneyGame isVisible={hasInteracted} />
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400 pb-8 font-medium">
            <p>Designed with ❤️ from Huyy to you guys for the SecretTết Present!</p>
        </footer>

      </main>

      {/* Interactive Modal */}
      {selectedMemory && (
        <PersonalizedModal 
            memory={selectedMemory} 
            onClose={() => setSelectedMemory(null)}
            onComplete={handleInteractionComplete}
        />
      )}

    </div>
  );
};

export default App;