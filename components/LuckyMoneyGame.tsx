import React, { useState, useEffect } from 'react';
import { GameState, Envelope } from '../types';
import { Lock, Clock, Gift, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isVisible: boolean;
}

const LuckyMoneyGame: React.FC<Props> = ({ isVisible }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOCKED);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [shuffling, setShuffling] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Target Date: Jan 1st, 2026 (Lunar Calendar). 
  // Lunar New Year 2026 falls on February 17, 2026 (Gregorian).
  const TARGET_DATE = new Date('2026-02-17T00:00:00');

  useEffect(() => {
    // Check Date logic
    const now = new Date();
    if (now >= TARGET_DATE) {
        setGameState(GameState.UNLOCKED);
        initializeGame();
    } else {
        setGameState(GameState.LOCKED);
    }
  }, []);

  const initializeGame = () => {
    const newEnvelopes: Envelope[] = [
        { id: 1, amount: 100, isWinner: true },
        { id: 2, amount: 200, isWinner: true },
        { id: 3, amount: 500, isWinner: true }, // All are winners essentially, just different luck
    ];
    setEnvelopes(newEnvelopes);
  };

  const handleStartGame = () => {
    setGameState(GameState.PLAYING);
    setShuffling(true);
    
    // Stop shuffling after animation
    setTimeout(() => {
        setShuffling(false);
    }, 1500); // 1.5s shuffle
  };

  const handleSelect = (id: number) => {
    if (shuffling || selectedId !== null) return;
    
    setSelectedId(id);
    setGameState(GameState.WON);
    
    // Confetti Effect
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D92525', '#FFD700', '#FFFFFF']
    });

    // Redirect delay
    setTimeout(() => {
        // Placeholder for redirect
        window.location.href = "https://www.google.com/search?q=happy+lunar+new+year+2026"; 
    }, 4000);
  };

  if (!isVisible && gameState !== GameState.UNLOCKED) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 p-8 glass-panel rounded-3xl text-center transition-all duration-700">
      
      {/* LOCKED STATE */}
      {gameState === GameState.LOCKED && (
        <div className="flex flex-col items-center gap-6 py-8">
            <div className="p-6 bg-white/10 rounded-full border border-white/20">
                <Lock size={48} className="text-gray-400" />
            </div>
            <div>
                <h3 className="text-2xl font-bold mb-2">Đây là món quà tâm huyết của tớ, hãy giữ kĩ món quà này mãi mãi nhé!</h3>
                <p className="opacity-70 max-w-md mx-auto">
                    Quay lại vào ngày 01 tháng 01 năm 2026 (Âm lịch) để nhận lì xì từ Huyydeptrai nhaaa😎
                </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono opacity-50 bg-black/20 px-4 py-2 rounded-lg">
                <Clock size={12} />
                <span>Target: 17/02/2026 • 01/01/2026</span>
            </div>
            
            {/* HIDDEN DEV TOGGLE FOR DEMO PURPOSES ONLY - Can be removed in production */}
            {/* Uncomment below to test unlock in dev */}
            {/* <button onClick={() => { setGameState(GameState.UNLOCKED); initializeGame(); }} className="opacity-0 hover:opacity-100 text-xs text-red-500">Dev Unlock</button> */}
        </div>
      )}

      {/* UNLOCKED / PRE-GAME STATE */}
      {gameState === GameState.UNLOCKED && (
        <div className="animate-fade-in py-8">
            <h3 className="text-3xl font-bold text-lunar-gold mb-6">Thời gian đã điểm!</h3>
            <p className="mb-8">Chúc mừng năm mới Bính Ngọ🥳. Nhận lì xì đêeeeee🧧</p>
            <button 
                onClick={handleStartGame}
                className="px-8 py-4 bg-lunar-gold text-lunar-red font-bold rounded-xl text-xl shadow-lg hover:scale-105 transition-transform"
            >
                Nhận Lì Xì
            </button>
        </div>
      )}

      {/* PLAYING STATE */}
      {(gameState === GameState.PLAYING || gameState === GameState.WON) && (
        <div className="py-8">
            <h3 className="text-2xl font-bold mb-8">
                {gameState === GameState.WON ? "Gọi tôi là gì?" : "Chọn lì xì"}
            </h3>
            
            <div className="flex flex-wrap justify-center gap-6 sm:gap-12 min-h-[200px] items-center">
                {envelopes.map((env, index) => {
                    const isSelected = selectedId === env.id;
                    const isOther = selectedId !== null && !isSelected;
                    
                    return (
                        <div 
                            key={env.id}
                            onClick={() => handleSelect(env.id)}
                            className={`
                                relative w-32 h-48 sm:w-40 sm:h-56 cursor-pointer transition-all duration-500
                                ${shuffling ? 'animate-shuffle' : ''}
                                ${isSelected ? 'scale-110 -translate-y-4 z-20' : ''}
                                ${isOther ? 'opacity-50 blur-sm scale-90' : ''}
                                ${!shuffling && !selectedId ? 'hover:scale-105 hover:-translate-y-2' : ''}
                            `}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Envelope Front (Red Packet) */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-br from-red-600 to-lunar-red rounded-lg border-2 border-lunar-gold shadow-xl flex items-center justify-center overflow-hidden
                                ${isSelected ? 'rotate-y-180 opacity-0' : 'opacity-100'} transition-opacity duration-700
                            `}>
                                <div className="border-2 border-lunar-gold/50 w-full h-full m-2 rounded flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-lunar-gold flex items-center justify-center text-lunar-red font-bold text-2xl">
                                        福
                                    </div>
                                </div>
                            </div>

                            {/* Inside Content (Revealed upon selection) */}
                            <div className={`
                                absolute inset-0 bg-white rounded-lg border-2 border-lunar-gold shadow-[0_0_30px_rgba(255,215,0,0.6)] flex flex-col items-center justify-center text-lunar-red
                                ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-700 delay-100
                            `}>
                                <Award size={40} className="mb-2 text-lunar-gold" />
                                <span className="font-bold text-2xl">${env.amount}</span>
                                <span className="text-xs uppercase tracking-widest mt-1">Cung hỷ phát tài</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {gameState === GameState.WON && (
                <div className="mt-8 animate-fade-in delay-500">
                    <p className="text-lg">Chuẩn bị nhận lì xì nè...</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default LuckyMoneyGame;
