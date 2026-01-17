import React, { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { RefreshCcw, Scroll, Sparkles, X, Volume2, VolumeX, Flame } from "lucide-react";

// --- Dữ liệu Quẻ ---
interface Fortune {
  id: number;
  title: string;
  type: "Đại Cát" | "Thượng Cát" | "Trung Cát" | "Tiểu Cát";
  poem: string;
  meaning: string;
  luckyNumber: number;
}

const FORTUNES: Fortune[] = [
  {
    id: 1,
    title: "Vạn Sự Như Ý",
    type: "Đại Cát",
    poem: "Xuân sang lộc biếc trổ cành\nCông danh rạng rỡ, tình thành duyên tơ",
    meaning: "Năm nay làm gì cũng thuận lợi. Tiền bạc rủng rỉnh, tình duyên nở rộ. Cứ tự tin mà tỏa sáng nhé!",
    luckyNumber: 88,
  },
  {
    id: 2,
    title: "Phúc Lộc Song Toàn",
    type: "Thượng Cát",
    poem: "Ngựa phi đường xa không mỏi gối\nChí lớn vươn cao ắt thành công",
    meaning: "Năng lượng dồi dào giúp bạn bứt phá. Đừng ngại thay đổi, cơ hội lớn đang chờ phía trước.",
    luckyNumber: 68,
  },
  {
    id: 3,
    title: "Bình An Vô Sự",
    type: "Trung Cát",
    poem: "Gió xuân nhè nhẹ thổi qua song\nTâm an vạn sự ắt hanh thông",
    meaning: "Một năm chữa lành (healing). Tập trung vào bản thân, sức khỏe tinh thần là ưu tiên hàng đầu.",
    luckyNumber: 22,
  },
  {
    id: 4,
    title: "Quý Nhân Phù Trợ",
    type: "Thượng Cát",
    poem: "Ra đường gặp bạn hiền nâng đỡ\nVề nhà gia đạo ấm êm vui",
    meaning: "Có người giúp đỡ trong công việc. Networking là chìa khóa của năm nay.",
    luckyNumber: 9,
  },
  {
    id: 5,
    title: "Tình Duyên Rực Rỡ",
    type: "Tiểu Cát",
    poem: "Hoa đào nở rộ đón xuân sang\nNgười thương chung lối, mộng huy hoàng",
    meaning: "Nếu đang độc thân, tín hiệu vũ trụ bảo bạn sắp thoát ế. Nếu có đôi, tình cảm càng thêm gắn bó.",
    luckyNumber: 14,
  },
];

// --- Helper UI ---
function typeBadge(type: Fortune["type"]) {
  switch (type) {
    case "Đại Cát":
      return "bg-red-500/20 text-red-700 dark:text-red-100 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
    case "Thượng Cát":
      return "bg-orange-500/20 text-orange-700 dark:text-orange-100 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]";
    case "Trung Cát":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-100 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]";
    case "Tiểu Cát":
      return "bg-pink-500/20 text-pink-700 dark:text-pink-100 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.3)]";
  }
}

// --- Confetti Effect ---
function ConfettiBurst({ show }: { show: boolean }) {
  const pieces = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: -(Math.random() * 200 + 50),
    rot: Math.random() * 360,
    scale: 0.5 + Math.random(),
    delay: Math.random() * 0.2,
    color: ["#D92525", "#FFD700", "#FFFFFF", "#FF512F"][Math.floor(Math.random() * 4)]
  })), []);

  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem] z-0">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-2/3 w-2 h-2 rounded-full shadow-sm"
          style={{
            backgroundColor: p.color,
            transform: `translate(-50%, -50%)`,
            animation: `confetti 1s ease-out forwards`,
            animationDelay: `${p.delay}s`,
            // @ts-ignore
            "--tx": `${p.x}px`, "--ty": `${p.y}px`, "--tr": `${p.rot}deg`
          }}
        />
      ))}
    </div>
  );
}

// --- Main Component ---
const FortuneSticks: React.FC = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<Fortune | null>(null);
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const timerRef = useRef<number | null>(null);

  // Audio refs
  const audioRattle = useRef<HTMLAudioElement | null>(null);
  const audioChime = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRattle.current = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="); 
    audioChime.current = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Prevent touch move on body to stop bounce effect on iOS
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [open]);

  const playSound = (type: 'rattle' | 'chime') => {
    if (!soundOn) return;
    // In real app, play audio here
  };

  const sticks = useMemo(() => 
    Array.from({ length: 16 }).map((_, i) => ({
      i,
      height: 70 + Math.random() * 30,
      angle: (i - 8) * 3 + (Math.random() * 4 - 2),
      color: i % 2 === 0 ? "from-yellow-200 via-yellow-400 to-yellow-600" : "from-amber-200 via-amber-400 to-amber-600"
    })), 
  []);

  const handleShake = () => {
    if (isShaking) return;
    
    setIsShaking(true);
    setResult(null);
    setOpen(false);
    playSound('rattle');

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      const pick = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      setResult(pick);
      setIsShaking(false);
      
      setTimeout(() => {
        setOpen(true);
        playSound('chime');
      }, 300);
    }, 1500);
  };

  // Render Modal via Portal
  const renderModal = () => {
    if (!open || !result) return null;

    return createPortal(
        // Outer Container: Fixed, inset-0, touch-none to prevent scrolling behind
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 safe-area-padding overflow-hidden touch-none"
            style={{ overscrollBehavior: 'contain' }}
        >
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-md animate-fade-in" 
                onClick={() => setOpen(false)}
            />

            {/* Modal Card - Fixed constraints, Fit-to-screen approach */}
            <div className="relative w-full max-w-sm sm:max-w-md max-h-[90vh] h-auto animate-pop-up flex flex-col items-center z-10">
                {/* Ambient Glows */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-500/30 rounded-full blur-[80px] -z-10 animate-pulse-glow" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/30 rounded-full blur-[80px] -z-10 animate-pulse-glow" style={{animationDelay: '1s'}} />

                {/* Main Glass Card */}
                <div className="w-full h-full relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-black/60 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-1.5 transition-all flex flex-col">
                    
                    {/* Inner Container: Flex column, NO SCROLL, content distributes space via flex-1 */}
                    <div className="relative w-full h-full rounded-[1.8rem] bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/5 p-5 sm:p-8 flex flex-col items-center text-center">
                        
                        <ConfettiBurst show={true} />
                        
                        {/* Close Button */}
                        <button 
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/40 hover:bg-white/60 dark:bg-black/20 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300 transition-colors backdrop-blur-md border border-white/30 z-50 shadow-sm"
                        >
                            <X size={18} />
                        </button>

                        {/* Top Badge - Compact */}
                        <div className="mb-2 sm:mb-4 z-10 shrink-0">
                             <span className={`inline-block px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold border uppercase tracking-widest backdrop-blur-md ${typeBadge(result.type)}`}>
                                {result.type}
                            </span>
                        </div>

                        {/* Title - Responsive text */}
                        <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-6 font-serif bg-clip-text text-transparent bg-gradient-to-br from-red-600 via-orange-500 to-red-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 animate-shimmer bg-[length:200%_auto] leading-tight z-10 drop-shadow-sm shrink-0">
                            {result.title}
                        </h2>

                        {/* Poem Container - FLEXIBLE HEIGHT (flex-1) & min-h-0 prevents overflow */}
                        <div className="w-full flex-1 min-h-0 relative mb-3 sm:mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/20 dark:from-white/10 dark:to-transparent border border-white/40 dark:border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] group z-10 flex items-center justify-center">
                             {/* Decorative Corner accents */}
                             <div className="absolute top-0 left-0 w-5 h-5 border-t-[3px] border-l-[3px] border-red-400/30 dark:border-amber-400/30 rounded-tl-xl" />
                             <div className="absolute bottom-0 right-0 w-5 h-5 border-b-[3px] border-r-[3px] border-red-400/30 dark:border-amber-400/30 rounded-br-xl" />
                             
                             {/* Auto-scaling text for poem */}
                             <p className="font-handwriting text-xl sm:text-3xl text-gray-800 dark:text-white leading-relaxed whitespace-pre-line drop-shadow-sm relative z-10">
                                {result.poem}
                            </p>
                            
                            <div className="absolute inset-0 bg-noise opacity-[0.03] rounded-2xl pointer-events-none mix-blend-overlay"></div>
                        </div>

                        {/* Content Bottom Group - Fixed at bottom via flex */}
                        <div className="w-full flex flex-col items-center gap-2 sm:gap-4 shrink-0 z-10">
                            {/* Meaning - Compact text */}
                            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 leading-snug max-w-xs mx-auto line-clamp-3">
                                {result.meaning}
                            </p>

                            {/* Lucky Number Liquid Pill */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/10 shadow-sm backdrop-blur-sm">
                                <Sparkles size={14} className="text-red-500 dark:text-amber-400 animate-pulse" />
                                <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                                    Con số may mắn: <span className="text-lg sm:text-xl text-red-600 dark:text-amber-400 ml-1 font-serif">{result.luckyNumber}</span>
                                </span>
                            </div>

                            {/* Button */}
                            <button 
                                onClick={() => setOpen(false)}
                                className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-red-600 dark:from-amber-200 dark:via-yellow-500 dark:to-amber-200 text-white dark:text-red-950 font-bold text-xs sm:text-base tracking-widest uppercase shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all bg-[length:200%_auto] hover:bg-right"
                            >
                                Hoan Hỉ Đón Nhận
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
  };

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4">
       {/* Background Ambience */}
       <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-lunar-red/10 rounded-full blur-[100px] -z-10" />
       
       {/* Main Glass Panel */}
       <div className="glass-panel rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-16 relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(217,37,37,0.1)]">
          
          {/* Top Bar Navigation */}
          <div className="flex justify-between items-start mb-8 md:mb-0 md:absolute md:top-8 md:left-10 md:right-10 z-30 pointer-events-none">
             <div className="flex items-center gap-4 pointer-events-auto">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF512F] to-[#DD2476] flex items-center justify-center text-white shadow-lg shadow-lunar-red/30 transform -rotate-3">
                    <Scroll size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <h2 className="font-extrabold text-gray-900 dark:text-white text-lg leading-none tracking-tight">Gieo Quẻ 2026</h2>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mt-1">Xuân Ất Tỵ</span>
                </div>
             </div>

             <button 
                onClick={() => setSoundOn(!soundOn)}
                className="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-white hover:shadow-md dark:hover:bg-white/20 text-gray-500 dark:text-gray-300 transition-all active:scale-95"
            >
                {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-32 pt-4 md:pt-12">
            
            {/* LEFT: 3D Cylinder */}
            {/* Scale down on small screens to prevent overflow/too tall */}
            <div className="relative group perspective-[1000px] z-10 scale-[0.85] sm:scale-100 origin-center">
                 {/* Shadow Ground */}
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-8 bg-black/20 dark:bg-black/40 blur-xl rounded-[100%]" />
                 
                 <div 
                    onClick={handleShake}
                    className={`relative w-48 h-64 cursor-pointer select-none transition-transform duration-300 ${isShaking ? "animate-shake" : "hover:-translate-y-2"}`}
                    style={{ transformStyle: 'preserve-3d' }}
                 >
                    {/* Layer 1: Back Inner Rim (The hole) */}
                    <div className="absolute top-0 left-0 w-full h-12 bg-[#5d0e0e] rounded-[50%] z-0 border border-white/5" />

                    {/* Layer 2: Sticks (Coming out) */}
                    {/* Reduced padding-bottom from pb-56 to pb-44 to move sticks lower into the tube */}
                    <div className={`absolute -top-10 left-0 w-full h-full flex justify-center items-end pb-44 z-0 transition-transform duration-300 ${isShaking ? 'translate-y-5' : ''}`}>
                        {sticks.map((stick) => (
                             <div 
                                key={stick.i}
                                className={`
                                    absolute w-2.5 rounded-t-sm border-x border-yellow-700/10 shadow-sm origin-bottom
                                    bg-gradient-to-r ${stick.color}
                                    ${isShaking ? 'animate-rattle' : ''}
                                `}
                                style={{
                                    height: `${stick.height}px`,
                                    transform: `rotate(${stick.angle}deg)`,
                                    animationDelay: `${stick.i * 0.05}s`
                                }}
                             />
                        ))}
                    </div>

                    {/* Layer 3: Main Body */}
                    <div className="absolute top-6 left-0 w-full h-[calc(100%-1.5rem)] bg-gradient-to-r from-[#8B0000] via-[#D92525] to-[#700505] rounded-b-[2.5rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] z-10 overflow-hidden">
                        {/* Reflection Highlight */}
                        <div className="absolute top-0 left-[20%] w-1/4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md" />
                        
                        {/* Decoration Label */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-[3px] border-[#FFD700]/50 bg-[#700505] shadow-inner flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full border border-[#FFD700]/30 flex items-center justify-center">
                                <span className="font-serif text-4xl font-bold text-[#FFD700] drop-shadow-md pt-1">Lộc</span>
                            </div>
                        </div>
                    </div>

                    {/* Layer 4: Front Rim Lip (The curved top edge that covers sticks) */}
                    <div 
                        className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-[#8B0000] via-[#D92525] to-[#700505] rounded-[50%] z-20"
                        style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}
                    >
                         <div className="absolute top-0 left-[20%] w-1/4 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
                    </div>

                 </div>
            </div>

            {/* RIGHT: Content */}
            <div className="max-w-md text-center md:text-left space-y-4 md:space-y-6 z-10">
                 <h1 className="text-3xl md:text-5xl font-extrabold text-[#1a1c29] dark:text-white font-sans tracking-tight leading-tight">
                    Xin quẻ đầu năm
                 </h1>
                 <p className="text-base md:text-lg text-gray-500 dark:text-gray-300 leading-relaxed font-medium">
                    Lắc nhẹ ống xăm để nhận thông điệp vũ trụ gửi đến bạn.
                 </p>
                 <p className="text-lunar-red/80 dark:text-lunar-red font-handwriting text-lg md:text-xl">
                    "Thành tâm tất linh ứng"
                 </p>
                 
                 <div className="pt-4 md:pt-6">
                     <button 
                        onClick={handleShake}
                        disabled={isShaking}
                        className="
                            group relative overflow-hidden px-8 py-3 md:py-4 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] rounded-2xl font-bold text-lg 
                            flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 mx-auto md:mx-0 
                            disabled:opacity-80 disabled:cursor-not-allowed
                        "
                     >
                        <span className="relative z-10 flex items-center gap-3">
                            {isShaking ? <RefreshCcw className="animate-spin" size={20} /> : <Flame size={20} className="text-lunar-gold" fill="currentColor" />}
                            {isShaking ? "Đang Gieo..." : "Gieo Quẻ Ngay"}
                        </span>
                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
                     </button>
                 </div>
            </div>

          </div>
       </div>

       {/* Render Modal via Portal */}
       {renderModal()}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg) translate3d(0, 0, 0); }
          25% { transform: rotate(-3deg) translate3d(-2px, 2px, 0); }
          50% { transform: rotate(3deg) translate3d(2px, -2px, 0); }
          75% { transform: rotate(-1deg) translate3d(-1px, 1px, 0); }
        }
        @keyframes rattle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes pop-up {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes confetti {
          0% { opacity: 1; transform: translate(-50%, -50%) rotate(0deg); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) rotate(var(--tr)); }
        }
        .animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) infinite; }
        .animate-rattle { animation: rattle 0.2s ease-in-out infinite; }
        .animate-pop-up { animation: pop-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shimmer { background-size: 200% auto; animation: shimmer-text 3s linear infinite; }
        @keyframes shimmer-text {
          to { background-position: 200% center; }
        }
        /* Utility to hide scrollbar but allow scrolling */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default FortuneSticks;