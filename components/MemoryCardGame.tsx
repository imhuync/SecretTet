import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Trophy, BrainCircuit } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  color: string;
}

const CARD_ITEMS = [
  { emoji: '🧧', color: 'text-red-500' },      // Red Envelope
  { emoji: '🏮', color: 'text-orange-500' },   // Lantern
  { emoji: '🐴', color: 'text-yellow-600' },   // Horse
  { emoji: '🌸', color: 'text-pink-400' },     // Blossom
  { emoji: '🍬', color: 'text-orange-400' },   // Tangerine
  { emoji: '💰', color: 'text-yellow-500' },   // Gold Bag
  { emoji: '🪭', color: 'text-purple-500' },   // Fan
  { emoji: '🧨', color: 'text-red-600' },      // Firecracker
];

const MemoryCardGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize Game
  useEffect(() => {
    shuffleCards();
  }, []);
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("win") === "1") {
    setGameWon(true);
    handleWin();
  }
}, []);

  const shuffleCards = () => {
    // Duplicate items to make pairs
    const pairs = [...CARD_ITEMS, ...CARD_ITEMS];
    
    // Fisher-Yates shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    setCards(pairs.map((item, index) => ({
      id: index,
      emoji: item.emoji,
      color: item.color,
      isFlipped: false,
      isMatched: false
    })));

    setFlippedIds([]);
    setMatchedCount(0);
    setMoves(0);
    setGameWon(false);
    setIsProcessing(false);
  };

  const handleCardClick = (id: number) => {
    // Block interaction conditions
    if (isProcessing || cards[id].isMatched || cards[id].isFlipped) return;

    // Flip the clicked card
    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlippedIds = [...flippedIds, id];
    setFlippedIds(newFlippedIds);

    // Check match if 2 cards are flipped
    if (newFlippedIds.length === 2) {
      setIsProcessing(true);
      setMoves(prev => prev + 1);
      checkForMatch(newFlippedIds, newCards);
    }
  };

  const checkForMatch = (currentFlippedIds: number[], currentCards: Card[]) => {
    const [id1, id2] = currentFlippedIds;
    const card1 = currentCards[id1];
    const card2 = currentCards[id2];

    if (card1.emoji === card2.emoji) {
      // Match Found
      setTimeout(() => {
        const matchedCards = [...currentCards];
        matchedCards[id1].isMatched = true;
        matchedCards[id2].isMatched = true;
        setCards(matchedCards);
        setFlippedIds([]);
        setIsProcessing(false);
        setMatchedCount(prev => prev + 1);

        // Check Win Condition
        if (matchedCount + 1 === CARD_ITEMS.length) {
          handleWin();
        }
      }, 500);
    } else {
      // No Match
      setTimeout(() => {
        const resetCards = [...currentCards];
        resetCards[id1].isFlipped = false;
        resetCards[id2].isFlipped = false;
        setCards(resetCards);
        setFlippedIds([]);
        setIsProcessing(false);
      }, 600);
    }
  };

  const handleWin = () => {
    setGameWon(true);
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D92525', '#FFD700', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D92525', '#FFD700', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8">
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden transition-all duration-500 hover:shadow-[0_15px_50px_rgba(217,37,37,0.15)] border border-white/30 dark:border-white/10">
        
        {/* Background Decor */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-lunar-gold/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-lunar-red/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 z-10 relative">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 transform rotate-3">
                <img style={{ width: '40px', height: '40px' }} src="https://i.ibb.co/ZpkKRmDt/logolatthe.png" alt="Lật thẻ Tết" />
                {/* <BrainCircuit size={24} strokeWidth={2.5} /> */}
            </div>
            <div>
                <h2 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg leading-none tracking-tight">Lật Thẻ 2026</h2>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mt-1">Luyện não lấy học bổng:D</p>
                {/* <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white font-serif">Lật Thẻ 2026</h2>
                <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Luyện não lấy học bổng:D</p> */}
            </div>
          </div>

          <div className="flex items-center gap-6 bg-white/40 dark:bg-black/20 p-2 px-6 rounded-full border border-white/20 backdrop-blur-md">
             <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-gray-400">Bước</span>
                <span className="text-xl font-bold text-gray-800 dark:text-white font-mono leading-none">{moves}</span>
             </div>
             <div className="w-px h-8 bg-gray-300 dark:bg-white/10"></div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-gray-400">Cặp</span>
                <span className="text-xl font-bold text-lunar-red dark:text-lunar-gold font-mono leading-none">{matchedCount}/{CARD_ITEMS.length}</span>
             </div>
             <button 
                onClick={shuffleCards}
                className="ml-2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-300 active:rotate-180 transition-transform duration-500"
                title="Restart Game"
             >
                <RefreshCw size={18} />
             </button>
          </div>
        </div>

        {/* Game Grid */}
        <div className="relative">
             {/* Win Overlay */}
             {gameWon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
                    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md rounded-3xl" />
                    <div className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black p-8 rounded-3xl shadow-2xl border border-white/20 text-center transform max-w-sm mx-4">
                        <div className="w-20 h-20 bg-lunar-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/50">
                            <Trophy size={40} className="text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-lunar-red mb-2">Trí nhớ tốt đấy😃</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Thắng trong <span className="font-bold">{moves}</span> bước.</p>
                        <button 
                            onClick={shuffleCards}
                            className="px-8 py-3 bg-lunar-red text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all hover:-translate-y-1"
                        >
                            Chơi Lại
                        </button>
                    </div>
                </div>
             )}

             <div className="grid grid-cols-4 gap-3 md:gap-4 lg:gap-6 mx-auto max-w-lg aspect-square">
                {cards.map((card) => (
                    <div 
                        key={card.id}
                        className="relative w-full h-full group perspective-1000 cursor-pointer"
                        onClick={() => handleCardClick(card.id)}
                    >
                        <div className={`
                            relative w-full h-full duration-500 transform-style-3d transition-transform
                            ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
                        `}>
                            {/* Front (Hidden initially - Face Down) */}
                            {/* Using a red festive pattern for the back */}
                            <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl md:rounded-2xl shadow-sm bg-gradient-to-br from-[#D92525] to-[#8B0000] border-2 border-[#FFD700]/30 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#FFD700 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                <div className="w-8 h-8 md:w-12 md:h-12 border-2 border-[#FFD700]/50 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                    <span className="text-[#FFD700] font-serif font-bold text-xs md:text-lg">Tết</span>
                                </div>
                            </div>

                            {/* Back (Visible on Flip - Face Up) */}
                            <div className={`
                                absolute inset-0 w-full h-full backface-hidden rounded-xl md:rounded-2xl shadow-md rotate-y-180 
                                bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-white/50 flex items-center justify-center
                                ${card.isMatched ? 'ring-2 ring-lunar-gold shadow-[0_0_15px_rgba(255,215,0,0.5)]' : ''}
                            `}>
                                <span className={`text-3xl md:text-5xl select-none transform transition-transform ${card.isMatched ? 'scale-125' : ''}`}>
                                    {card.emoji}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
        
      </div>

      <style>{`
        .rotate-y-180 {
            transform: rotateY(180deg);
        }
        .transform-style-3d {
            transform-style: preserve-3d;
        }
        .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }
        .perspective-1000 {
            perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default MemoryCardGame;