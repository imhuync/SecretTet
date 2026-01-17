import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
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
      return "bg-red-500/20 text-red-700 dark:text-red-100 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.25)]";
    case "Thượng Cát":
      return "bg-orange-500/20 text-orange-700 dark:text-orange-100 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.25)]";
    case "Trung Cát":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-100 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]";
    case "Tiểu Cát":
      return "bg-pink-500/20 text-pink-700 dark:text-pink-100 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]";
  }
}

// --- Confetti Effect (lighter) ---
function ConfettiBurst({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 240,
        y: -(Math.random() * 180 + 40),
        rot: Math.random() * 360,
        delay: Math.random() * 0.16,
        color: ["#FFD700", "#FFFFFF", "#FF512F"][Math.floor(Math.random() * 3)],
      })),
    []
  );

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
            animation: `confetti 0.85s ease-out forwards`,
            animationDelay: `${p.delay}s`,
            // @ts-ignore
            "--tx": `${p.x}px`,
            // @ts-ignore
            "--ty": `${p.y}px`,
            // @ts-ignore
            "--tr": `${p.rot}deg`,
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

  // Audio refs (placeholder)
  const audioRattle = useRef<HTMLAudioElement | null>(null);
  const audioChime = useRef<HTMLAudioElement | null>(null);

  // Fix "close modal jumps to top" — store & restore scroll
  const scrollYRef = useRef(0);

  useEffect(() => {
    audioRattle.current = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
    audioChime.current = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
  }, []);

  // Body scroll lock (correct restore)
  useEffect(() => {
    if (!open) return;

    scrollYRef.current = window.scrollY || window.pageYOffset || 0;

    const body = document.body;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.top = `-${scrollYRef.current}px`;

    return () => {
      const y = scrollYRef.current;
      const b = document.body;
      b.style.overflow = "";
      b.style.position = "";
      b.style.width = "";
      b.style.top = "";
      window.scrollTo(0, y);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const playSound = useCallback(
    (type: "rattle" | "chime") => {
      if (!soundOn) return;
      // Nếu bạn muốn phát thật:
      // if (type === "rattle") audioRattle.current?.play().catch(()=>{});
      // else audioChime.current?.play().catch(()=>{});
    },
    [soundOn]
  );

  // Performance: fewer sticks & stable random with useMemo
  const sticks = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        i,
        height: 64 + Math.random() * 24,
        angle: (i - 6) * 3.2 + (Math.random() * 3 - 1.5),
        color: i % 2 === 0 ? "from-yellow-200 via-yellow-400 to-yellow-600" : "from-amber-200 via-amber-400 to-amber-600",
      })),
    []
  );

  const closeModal = useCallback(() => setOpen(false), []);

  const handleShake = useCallback(() => {
    if (isShaking) return;

    setIsShaking(true);
    setResult(null);
    setOpen(false);
    playSound("rattle");

    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      const pick = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      setResult(pick);
      setIsShaking(false);

      window.setTimeout(() => {
        setOpen(true);
        playSound("chime");
      }, 220);
    }, 1200); // faster => feels snappier
  }, [isShaking, playSound]);

  const renderModal = () => {
    if (!open || !result) return null;

    const showConfetti = result.type === "Đại Cát" || result.type === "Thượng Cát";

    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden" style={{ overscrollBehavior: "contain" }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md animate-fade-in" onClick={closeModal} />

        {/* Modal Card (short + fit) */}
        <div className="relative w-full max-w-sm sm:max-w-md max-h-[86vh] animate-pop-up flex flex-col items-center z-10">
          {/* Ambient Glows (cheap) */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-red-500/25 rounded-full blur-[80px] -z-10" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-amber-500/25 rounded-full blur-[80px] -z-10" />

          <div className="w-full relative overflow-hidden rounded-[2rem] glass-panel p-1.5 flex flex-col">
            <div className="relative w-full rounded-[1.8rem] p-5 sm:p-7 flex flex-col items-center text-center">
              <ConfettiBurst show={showConfetti} />

              <button
                onClick={closeModal}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/40 hover:bg-white/60 dark:bg-black/20 dark:hover:bg-white/10 text-gray-600 dark:text-gray-200 transition-colors backdrop-blur-md border border-white/30 z-50 shadow-sm"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="mb-2 sm:mb-3 z-10 shrink-0">
                <span className={`inline-block px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold border uppercase tracking-widest backdrop-blur-md ${typeBadge(result.type)}`}>
                  {result.type}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 font-serif bg-clip-text text-transparent bg-gradient-to-br from-red-600 via-orange-500 to-red-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 leading-tight z-10">
                {result.title}
              </h2>

              {/* Poem: keep compact + no over-height */}
              <div className="w-full relative mb-3 p-4 sm:p-5 rounded-2xl bg-white/35 dark:bg-white/5 border border-white/30 dark:border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.25)] z-10">
                <p className="font-handwriting text-lg sm:text-2xl text-gray-800 dark:text-white leading-relaxed whitespace-pre-line drop-shadow-sm">
                  {result.poem}
                </p>
              </div>

              <div className="w-full flex flex-col items-center gap-3 shrink-0 z-10">
                <p className="text-xs sm:text-sm font-medium text-gray-700/90 dark:text-gray-200/80 leading-snug max-w-xs mx-auto line-clamp-3">
                  {result.meaning}
                </p>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/45 dark:bg-black/25 border border-white/35 dark:border-white/10 shadow-sm backdrop-blur-sm">
                  <Sparkles size={14} className="text-red-500 dark:text-amber-400" />
                  <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                    Con số may mắn:
                    <span className="text-lg sm:text-xl text-red-600 dark:text-amber-400 ml-2 font-serif">{result.luckyNumber}</span>
                  </span>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-red-600 dark:from-amber-200 dark:via-yellow-500 dark:to-amber-200 text-white dark:text-red-950 font-extrabold text-xs sm:text-sm tracking-widest uppercase shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] transition-all"
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
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-[110px] -z-10" />

      {/* Main Glass Panel (shorter on mobile) */}
      <div className="glass-panel rounded-[1.75rem] md:rounded-[2.5rem] p-5 sm:p-7 md:p-10 relative overflow-hidden">
        {/* Top bar (not absolute on mobile to avoid extra height quirks) */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF512F] to-[#DD2476] flex items-center justify-center text-white shadow-lg shadow-red-500/20 -rotate-3">
              <Scroll size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h2 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg leading-none tracking-tight">Gieo Quẻ 2026</h2>
              <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mt-1">Xuân Bính Ngọ</span>
            </div>
          </div>

          <button
            onClick={() => setSoundOn(!soundOn)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100/80 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-gray-600 dark:text-gray-200 transition-all active:scale-95"
            aria-label="Toggle sound"
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>

        {/* Compact layout: on mobile stack tighter */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-12">
          {/* LEFT: Cylinder (smaller on mobile) */}
          <div className="relative group perspective-[1000px] z-10 scale-[0.78] sm:scale-[0.88] md:scale-100 origin-center">
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-36 h-7 bg-black/20 dark:bg-black/40 blur-xl rounded-[100%]" />

            <div
              onClick={handleShake}
              className={`relative w-44 h-56 md:w-48 md:h-64 cursor-pointer select-none transition-transform duration-300 ${
                isShaking ? "animate-shake" : "hover:-translate-y-2"
              }`}
              style={{ transformStyle: "preserve-3d" }}
              role="button"
              aria-label="Gieo quẻ"
            >
              {/* back rim */}
              <div className="absolute top-0 left-0 w-full h-11 bg-[#5d0e0e] rounded-[50%] z-0 border border-white/5" />

              {/* sticks (reduced pb to keep compact) */}
              <div className={`absolute -top-10 left-0 w-full h-full flex justify-center items-end pb-40 z-0 transition-transform duration-300 ${isShaking ? "translate-y-4" : ""}`}>
                {sticks.map((stick) => (
                  <div
                    key={stick.i}
                    className={`
                      absolute w-2.5 rounded-t-sm border-x border-yellow-700/10 shadow-sm origin-bottom
                      bg-gradient-to-r ${stick.color}
                      ${isShaking ? "animate-rattle" : ""}
                    `}
                    style={{
                      height: `${stick.height}px`,
                      transform: `rotate(${stick.angle}deg)`,
                      animationDelay: `${stick.i * 0.04}s`,
                      willChange: isShaking ? "transform" : undefined,
                    }}
                  />
                ))}
              </div>

              {/* body */}
              <div className="absolute top-5 left-0 w-full h-[calc(100%-1.25rem)] bg-gradient-to-r from-[#8B0000] via-[#D92525] to-[#700505] rounded-b-[2.35rem] shadow-[inset_0_0_18px_rgba(0,0,0,0.4)] z-10 overflow-hidden">
                <div className="absolute top-0 left-[20%] w-1/4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-[3px] border-[#FFD700]/45 bg-[#700505] shadow-inner flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-[#FFD700]/25 flex items-center justify-center">
                    <span className="font-serif text-3xl font-bold text-[#FFD700] drop-shadow-md pt-1">Lộc</span>
                  </div>
                </div>
              </div>

              {/* front rim lip */}
              <div
                className="absolute top-0 left-0 w-full h-11 bg-gradient-to-r from-[#8B0000] via-[#D92525] to-[#700505] rounded-[50%] z-20"
                style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
              >
                <div className="absolute top-0 left-[20%] w-1/4 h-full bg-gradient-to-r from-transparent via-white/18 to-transparent blur-sm" />
              </div>
            </div>
          </div>

          {/* RIGHT: Copy + button (tight on mobile) */}
          <div className="max-w-md text-center md:text-left space-y-3 md:space-y-4 z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a1c29] dark:text-white tracking-tight leading-tight">
              Xin quẻ đầu năm
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Lắc nhẹ ống xăm để nhận thông điệp vũ trụ gửi đến bạn.
            </p>
            <p className="text-red-600/80 dark:text-red-400 font-handwriting text-base sm:text-lg">
              "Thành tâm tất linh ứng"
            </p>

            <div className="pt-1 md:pt-2">
              <button
                onClick={handleShake}
                disabled={isShaking}
                className="
                  group relative overflow-hidden px-7 py-3 md:px-8 md:py-3.5
                  bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A]
                  rounded-2xl font-extrabold text-base
                  flex items-center justify-center gap-3 shadow-xl transition-all duration-300
                  hover:-translate-y-0.5 active:scale-95 mx-auto md:mx-0
                  disabled:opacity-80 disabled:cursor-not-allowed
                "
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isShaking ? <RefreshCcw className="animate-spin" size={20} /> : <Flame size={20} className="text-[#FFD36E]" fill="currentColor" />}
                  {isShaking ? "Đang Gieo..." : "Gieo Quẻ Ngay"}
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

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
          50% { transform: translateY(-9px) rotate(2deg); }
        }
        @keyframes pop-up {
          0% { opacity: 0; transform: scale(0.94) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes confetti {
          0% { opacity: 1; transform: translate(-50%, -50%) rotate(0deg); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) rotate(var(--tr)); }
        }
        .animate-shake { animation: shake 0.55s cubic-bezier(.36,.07,.19,.97) infinite; }
        .animate-rattle { animation: rattle 0.18s ease-in-out infinite; }
        .animate-pop-up { animation: pop-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.22s ease-out forwards; }
      `}</style>
    </section>
  );
};

export default FortuneSticks;
