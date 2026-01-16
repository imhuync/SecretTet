import React, { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import GreetingPopup from './components/GreetingPopup';
import MusicPlayer from './components/MusicPlayer';
import PhotoCarousel from './components/PhotoCarousel';
import PersonalizedModal from './components/PersonalizedModal';
import LuckyMoneyGame from './components/LuckyMoneyGame';
import CountdownTimer from './components/CountdownTimer';
import EffectsLayer from './components/EffectsLayer';
import FortuneSticks from './components/FortuneSticks';
import { MEMORIES } from './constants';
import { FriendMemory } from './types';
import { Clover, Flower2, Wind } from 'lucide-react';

const App: React.FC = () => {
  const [selectedMemory, setSelectedMemory] = useState<FriendMemory | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isEffectOn, setIsEffectOn] = useState(true);

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
      {/* Falling Blossoms Layer */}
      <EffectsLayer enabled={isEffectOn} />

      {/* Unified Header with Liquid Glass Style encompassing both Logo and Controls */}
      <header className="fixed top-0 left-0 w-full z-50 p-4 sm:p-6 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-7xl mx-auto flex justify-between items-center glass-panel rounded-full px-5 py-2 sm:py-3 shadow-2xl bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/20 transition-all duration-300">
            
            {/* Logo Section */}
            <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => window.location.reload()}
            >
                <div className="bg-gradient-to-tr from-lunar-red to-orange-500 p-2 rounded-full text-white shadow-lg group-hover:rotate-12 transition-transform">
                   <img style={{ width: '25px', height: '25px' }} src="https://i.ibb.co/mV1fPszT/logoheader.png" alt="Tết" />
                   {/* <Clover size={20} /> */}
                </div>
                <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-800 dark:text-white font-serif group-hover:text-lunar-red transition-colors">Xuân Bính Ngọ</span>
            </div>

            {/* Controls Section (Buttons) */}
            <div className="flex items-center gap-1 sm:gap-2">
                <button 
                    onClick={() => setIsEffectOn(!isEffectOn)}
                    className={`p-2.5 rounded-full transition-all hover:scale-110 active:scale-95 ${isEffectOn ? 'text-pink-500 bg-pink-500/10' : 'text-gray-400 hover:bg-black/5 dark:hover:bg-white/10'}`}
                    title={isEffectOn ? "Disable Blossoms" : "Enable Blossoms"}
                >
                    {isEffectOn ? <Flower2 size={20} className="animate-spin-slow" /> : <Wind size={20} />}
                </button>
                <ThemeToggle />
            </div>
        </div>
      </header>
      <GreetingPopup />
      <MusicPlayer />

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

        {/* Fortune Sticks (Gieo Quẻ) Section */}
        <section className="w-full animate-fade-in-up delay-300">
             <FortuneSticks />
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