import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target: Feb 17, 2026 00:00:00 GMT+7 (Asia/Hanoi)
    // 01/01/2026 Lunar Calendar
    const targetDate = new Date('2026-02-17T00:00:00+07:00');

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 glass-panel rounded-[2rem] text-center relative overflow-hidden group hover:shadow-[0_0_40px_rgba(255,215,0,0.1)] transition-shadow duration-500">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-lunar-red/20 rounded-full blur-3xl -z-10 animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-lunar-gold/20 rounded-full blur-3xl -z-10 animate-pulse-glow" style={{animationDelay: '1s'}}></div>

        <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-800 dark:text-lunar-gold mb-8 tracking-widest uppercase">
            Đếm ngược tới Tết Nguyên Đán 2026
        </h3>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 items-center">
            {/* Days */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-24 md:w-28 md:h-32 glass-panel bg-white/40 dark:bg-black/40 rounded-2xl flex items-center justify-center border border-white/30 shadow-lg backdrop-blur-md transform hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 font-sans">
                        {String(timeLeft.days).padStart(2, '0')}
                    </span>
                </div>
                <span className="mt-3 text-xs md:text-sm font-bold text-lunar-red dark:text-lunar-gold uppercase tracking-widest">Days</span>
            </div>

            <div className="text-4xl md:text-6xl font-thin text-lunar-red/30 dark:text-white/10 pb-8 hidden md:block">:</div>

            {/* Hours */}
            <div className="flex flex-col items-center">
                 <div className="w-20 h-24 md:w-28 md:h-32 glass-panel bg-white/40 dark:bg-black/40 rounded-2xl flex items-center justify-center border border-white/30 shadow-lg backdrop-blur-md transform hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 font-sans">
                        {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                </div>
                 <span className="mt-3 text-xs md:text-sm font-bold text-lunar-red dark:text-lunar-gold uppercase tracking-widest">Hours</span>
            </div>

            <div className="text-4xl md:text-6xl font-thin text-lunar-red/30 dark:text-white/10 pb-8 hidden md:block">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
                 <div className="w-20 h-24 md:w-28 md:h-32 glass-panel bg-white/40 dark:bg-black/40 rounded-2xl flex items-center justify-center border border-white/30 shadow-lg backdrop-blur-md transform hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 font-sans">
                        {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                </div>
                 <span className="mt-3 text-xs md:text-sm font-bold text-lunar-red dark:text-lunar-gold uppercase tracking-widest">Mins</span>
            </div>

            <div className="text-4xl md:text-6xl font-thin text-lunar-red/30 dark:text-white/10 pb-8 hidden md:block">:</div>

            {/* Seconds */}
            <div className="flex flex-col items-center">
                 <div className="w-20 h-24 md:w-28 md:h-32 glass-panel bg-white/40 dark:bg-black/40 rounded-2xl flex items-center justify-center border border-white/30 shadow-lg backdrop-blur-md transform hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 font-sans w-[2ch] text-center">
                        {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                </div>
                 <span className="mt-3 text-xs md:text-sm font-bold text-lunar-red dark:text-lunar-gold uppercase tracking-widest">Secs</span>
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-sm text-gray-500 dark:text-gray-400 font-medium">
            17 tháng 2 năm 2026 • 01/01 Âm lịch • GMT+7
        </div>
    </div>
  );
};

export default CountdownTimer;