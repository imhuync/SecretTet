import React, { useState } from 'react';
import { Sparkles, RefreshCcw, Scroll, Star } from 'lucide-react';

interface Fortune {
  id: number;
  title: string;
  type: 'Đại Cát' | 'Thượng Cát' | 'Trung Cát' | 'Tiểu Cát';
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
    meaning: "Năm nay làm gì cũng thuận lợi. Tiền bạc rủng rỉnh, tình duyên nở rộ. Cứ tự tin mà 'slay' nhé!",
    luckyNumber: 88
  },
  {
    id: 2,
    title: "Phúc Lộc Song Toàn",
    type: "Thượng Cát",
    poem: "Ngựa phi đường xa không mỏi gối\nChí lớn vươn cao ắt thành công",
    meaning: "Năng lượng năm Ngọ giúp bạn bứt phá. Đừng ngại thay đổi, cơ hội lớn đang chờ phía trước.",
    luckyNumber: 68
  },
  {
    id: 3,
    title: "Bình An Vô Sự",
    type: "Trung Cát",
    poem: "Gió xuân nhè nhẹ thổi qua song\nTâm an vạn sự ắt hanh thông",
    meaning: "Một năm chữa lành (healing). Tập trung vào bản thân, sức khỏe tinh thần là ưu tiên hàng đầu.",
    luckyNumber: 22
  },
  {
    id: 4,
    title: "Quý Nhân Phù Trợ",
    type: "Thượng Cát",
    poem: "Ra đường gặp bạn hiền nâng đỡ\nVề nhà gia đạo ấm êm vui",
    meaning: "Có người giúp đỡ trong công việc. Networking là chìa khóa của năm nay. Kết giao thêm bạn mới nhé.",
    luckyNumber: 9
  },
  {
    id: 5,
    title: "Tình Duyên Rực Rỡ",
    type: "Tiểu Cát",
    poem: "Hoa đào nở rộ đón xuân sang\nNgười thương chung lối, mộng huy hoàng",
    meaning: "Nếu đang độc thân, tín hiệu vũ trụ bảo bạn sắp thoát ế. Nếu có đôi, tình cảm càng thêm gắn bó.",
    luckyNumber: 14
  }
];

const FortuneSticks: React.FC = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<Fortune | null>(null);

  const handleShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);

    // Shake animation
    setTimeout(() => {
      setIsShaking(false);
      const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      setResult(randomFortune);
    }, 2000); // Increased shake duration for better effect
  };

  return (
    <div className="w-full max-w-5xl mx-auto glass-panel p-8 rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12 min-h-[500px]">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-lunar-red/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-lunar-gold/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

      {/* Left Side: Cylinder & Interaction */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
                <Scroll className="text-lunar-red dark:text-lunar-gold" /> Gieo Quẻ Đầu Năm
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Lắng nghe thông điệp từ vũ trụ
            </p>
        </div>

        {/* The Cylinder */}
        <div className="relative group cursor-pointer" onClick={handleShake}>
            <div className={`
                w-48 h-64 bg-gradient-to-b from-red-800 to-red-900 rounded-3xl border-4 border-lunar-gold/50 
                shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center relative overflow-hidden
                ${isShaking ? 'animate-shake-hard' : 'hover:-translate-y-2 transition-transform duration-300'}
            `}>
                {/* Texture */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500 to-transparent"></div>
                
                {/* Label */}
                <div className="w-24 h-24 bg-lunar-red border-2 border-lunar-gold rounded-full flex items-center justify-center shadow-inner relative z-10">
                    <span className="font-serif text-3xl text-lunar-gold font-bold">Lộc</span>
                </div>

                {/* Sticks showing at top */}
                <div className={`
                    absolute top-0 left-1/2 -translate-x-1/2 flex gap-1 
                    ${isShaking ? 'animate-rattle top-4' : '-top-12 transition-transform duration-300 group-hover:-translate-y-4'}
                `}>
                     {[...Array(5)].map((_, i) => (
                         <div key={i} className="w-3 h-20 bg-yellow-200 rounded-t-full border border-yellow-600 transform origin-bottom" style={{ transform: `rotate(${(i-2)*10}deg)` }}></div>
                     ))}
                </div>
            </div>
        </div>

        <button 
            onClick={handleShake}
            disabled={isShaking}
            className="mt-8 px-8 py-3 bg-lunar-gold hover:bg-yellow-400 text-red-900 font-bold rounded-full flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <RefreshCcw className={isShaking ? 'animate-spin' : ''} size={20} />
            {isShaking ? 'Đang Lắc...' : 'Xin Quẻ Ngay'}
        </button>
      </div>

      {/* Right Side: The Result Card */}
      <div className="flex-1 w-full flex items-center justify-center min-h-[300px]">
        {result ? (
            <div className="relative w-full max-w-sm animate-fade-in-up">
                {/* Card Effect */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-1 shadow-2xl border border-lunar-gold/30">
                    <div className="border border-lunar-red/20 rounded-xl p-6 md:p-8 flex flex-col items-center text-center h-full relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                        
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lunar-red to-lunar-gold"></div>

                        <div className="mb-4">
                            <span className="px-3 py-1 bg-lunar-red text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                {result.type}
                            </span>
                        </div>

                        <h3 className="text-3xl font-bold text-gray-800 dark:text-lunar-gold mb-2 font-serif">
                            {result.title}
                        </h3>

                        <div className="my-6 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

                        <div className="mb-6 relative">
                            <p className="font-handwriting text-2xl text-gray-700 dark:text-gray-200 leading-loose whitespace-pre-line">
                                {result.poem}
                            </p>
                        </div>

                        <div className="bg-lunar-red/5 dark:bg-white/5 rounded-xl p-4 w-full mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                "{result.meaning}"
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-lunar-gold font-bold">
                            <Star size={16} fill="currentColor" />
                            <span>Số may mắn: {result.luckyNumber}</span>
                            <Star size={16} fill="currentColor" />
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center opacity-30 select-none">
                <div className="w-40 h-56 mx-auto border-2 border-dashed border-gray-400 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-6xl">?</span>
                </div>
                <p className="text-lg font-medium">Thẻ xăm của bạn sẽ xuất hiện ở đây</p>
            </div>
        )}
      </div>

    </div>
  );
};

export default FortuneSticks;