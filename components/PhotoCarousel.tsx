import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { FriendMemory } from "../types";

interface Props {
  memories: FriendMemory[];
  onSelect: (memory: FriendMemory) => void;
}

const AUTOPLAY_MS = 3000;
const SWIPE_THRESHOLD = 50;

const mod = (n: number, m: number) => ((n % m) + m) % m;

async function preloadAndDecode(url: string) {
  if (!url) return;
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.src = url;

  // decode() giúp tránh khựng lúc ảnh được đưa lên màn hình
  // fallback cho browser không hỗ trợ
  try {
    if ("decode" in img) await (img as any).decode();
  } catch {
    // ignore decode error (có thể do CORS / cache)
  }
}

const PhotoCarousel: React.FC<Props> = ({ memories, onSelect }) => {
  const len = memories.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Gesture refs
  const startX = useRef<number | null>(null);
  const lastX = useRef<number | null>(null);
  const dragging = useRef(false);
  const didSwipe = useRef(false);

  // tránh preload lại cùng 1 url
  const preloadedRef = useRef<Set<string>>(new Set());

  // clamp index khi memories đổi
  useEffect(() => {
    if (len === 0) return;
    setActiveIndex((i) => mod(i, len));
  }, [len]);

  const indices = useMemo(() => {
    if (len === 0) return { prev: -1, cur: -1, next: -1 };
    return {
      prev: mod(activeIndex - 1, len),
      cur: activeIndex,
      next: mod(activeIndex + 1, len),
    };
  }, [activeIndex, len]);

  const cur = indices.cur >= 0 ? memories[indices.cur] : null;
  const prev = indices.prev >= 0 ? memories[indices.prev] : null;
  const next = indices.next >= 0 ? memories[indices.next] : null;

  // Preload + decode trước next/prev để chuyển ảnh không khựng
  useEffect(() => {
    const urls = [cur?.imageUrl, next?.imageUrl, prev?.imageUrl].filter(Boolean) as string[];

    urls.forEach((url) => {
      if (preloadedRef.current.has(url)) return;
      preloadedRef.current.add(url);
      // không await để không block UI
      preloadAndDecode(url);
    });
  }, [cur?.imageUrl, next?.imageUrl, prev?.imageUrl]);

  // Autoplay: dùng setTimeout để “5s sau mỗi lần chuyển”
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedule = useCallback(() => {
    stopTimer();
    if (isPaused || len <= 1) return;

    timerRef.current = window.setTimeout(() => {
      setActiveIndex((p) => (p + 1) % len);
    }, AUTOPLAY_MS);
  }, [isPaused, len, stopTimer]);

  useEffect(() => {
    schedule();
    return stopTimer;
  }, [schedule, stopTimer, activeIndex]);

  const setCursor = (value: string) => {
    const el = containerRef.current;
    if (el) el.style.cursor = value;
  };

  // Pointer events (mượt hơn, 1 bộ handler cho cả touch + mouse)
  const onPointerDown = (e: React.PointerEvent) => {
    if (len <= 1) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);

    dragging.current = true;
    didSwipe.current = false;
    startX.current = e.clientX;
    lastX.current = e.clientX;

    setIsPaused(true);
    setCursor("grabbing");
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    lastX.current = e.clientX;

    const dx = (startX.current ?? 0) - (lastX.current ?? 0);
    if (Math.abs(dx) > 8) didSwipe.current = true; // deadzone chống tap nhầm
  };

  const finishDrag = () => {
    if (!dragging.current) return;

    dragging.current = false;
    setIsPaused(false);
    setCursor("grab");

    if (startX.current != null && lastX.current != null) {
      const diff = startX.current - lastX.current;

      if (diff > SWIPE_THRESHOLD) setActiveIndex((p) => (p + 1) % len);
      else if (diff < -SWIPE_THRESHOLD) setActiveIndex((p) => mod(p - 1, len));
    }

    startX.current = null;
    lastX.current = null;
  };

  const onPointerUp = () => finishDrag();
  const onPointerCancel = () => finishDrag();
  const onPointerLeave = () => {
    if (dragging.current) finishDrag();
  };

  const handleClickCard = (memory: FriendMemory, isCurrent: boolean) => {
    if (!isCurrent) return;
    if (didSwipe.current) return;
    onSelect(memory);
  };

  if (len === 0) return null;

  const renderCard = (mem: FriendMemory, position: "prev" | "cur" | "next") => {
    const isCurrent = position === "cur";

    // Tránh transition-all (tốn), chỉ animate transform/opacity/filter
    let className =
      "absolute rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl " +
      "transition-[transform,opacity,filter] duration-700 ease-out will-change-transform";

    if (position === "cur") {
      className +=
        " w-[280px] h-[380px] sm:w-[350px] sm:h-[450px] z-30 opacity-100 scale-100 rotate-0 hover:scale-105";
    } else if (position === "next") {
      className +=
        " w-[240px] h-[320px] z-20 opacity-60 translate-x-[60%] scale-90 rotate-6 grayscale";
    } else {
      className +=
        " w-[240px] h-[320px] z-20 opacity-60 -translate-x-[60%] scale-90 -rotate-6 grayscale";
    }

    return (
      <div
        key={mem.id}
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          handleClickCard(mem, isCurrent);
        }}
      >
        <img
          src={mem.imageUrl}
          alt={mem.name}
          draggable={false}
          decoding="async"
          loading={isCurrent ? "eager" : "lazy"}
          // Tối ưu paint
          className="w-full h-full object-cover pointer-events-none select-none"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <p className="font-bold text-lg">{mem.name}</p>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl mx-auto h-[400px] sm:h-[500px] relative perspective-1000 group select-none touch-pan-y"
      style={{ cursor: "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerLeave}
    >
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-3xl glass-panel">
        {/* Background blur: blur-3xl rất nặng -> blur-2xl + không transition-all */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl"
          style={{
            backgroundImage: `url(${cur?.imageUrl ?? ""})`,
            willChange: "opacity, transform",
          }}
        />

        <div className="relative w-full h-full flex items-center justify-center p-8">
          {prev && renderCard(prev, "prev")}
          {cur && renderCard(cur, "cur")}
          {next && renderCard(next, "next")}
        </div>
      </div>

      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
        {memories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex ? "w-8 bg-lunar-red" : "bg-gray-400/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;