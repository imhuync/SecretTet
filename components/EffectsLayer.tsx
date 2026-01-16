import React, { useEffect, useRef } from "react";

interface Props {
  enabled: boolean;
}

type Petal = {
  x: number;
  y: number;

  // depth 0..1 (0 xa, 1 gần)
  z: number;

  // kích thước base (px)
  size: number;

  // vận tốc
  vy: number;
  vx: number;

  // góc + tốc độ xoay
  rot: number;
  rotSpeed: number;

  // flip (3D)
  flip: number;
  flipSpeed: number;

  // sway (lượn)
  sway: number;
  swaySpeed: number;
  swayAmp: number;

  // render
  colorA: string;
  colorB: string;
  alpha: number;
  blur: number;
};

const EffectsLayer: React.FC<Props> = ({ enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const petalsRef = useRef<Petal[]>([]);
  const windRef = useRef({ t: 0, base: 0.25 });

  // gần giống ảnh: hồng nhạt -> hồng neon
  const COLOR_PAIRS: Array<[string, string]> = [
    ["rgba(255, 170, 200, 1)", "rgba(255, 85, 170, 1)"],
    ["rgba(255, 190, 215, 1)", "rgba(255, 120, 190, 1)"],
    ["rgba(255, 205, 225, 1)", "rgba(255, 150, 205, 1)"],
    ["rgba(255, 150, 200, 1)", "rgba(255, 70, 160, 1)"],
  ];

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createPetal = (initialY?: number): Petal => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // depth phân bố lệch: nhiều petal xa (nhỏ), ít petal gần (to)
      const z = Math.pow(Math.random(), 1.8); // 0..1, thiên về 0

      const baseSize = lerp(3.5, 10.5, z) * rand(0.85, 1.15);

      // petal xa: chậm + mờ hơn, petal gần: nhanh + rõ hơn (giống ảnh)
      const vy = lerp(0.55, 2.25, z) * rand(0.85, 1.2);
      const vx = lerp(-0.25, 0.35, z) * rand(0.6, 1.2);

      const [colorA, colorB] = COLOR_PAIRS[(Math.random() * COLOR_PAIRS.length) | 0];

      return {
        x: Math.random() * w,
        y: initialY ?? rand(-h * 0.2, -20),

        z,
        size: baseSize,

        vy,
        vx,

        rot: rand(0, Math.PI * 2),
        rotSpeed: rand(-0.02, 0.02) * lerp(0.5, 1.2, z),

        flip: rand(0, Math.PI * 2),
        flipSpeed: rand(0.02, 0.06) * lerp(0.6, 1.25, z),

        sway: rand(0, Math.PI * 2),
        swaySpeed: rand(0.008, 0.02) * lerp(0.7, 1.4, z),
        swayAmp: lerp(4, 18, z) * rand(0.7, 1.2),

        alpha: lerp(0.25, 0.95, z) * rand(0.85, 1.0),
        blur: lerp(5.5, 1.2, z) * rand(0.8, 1.25),

        colorA,
        colorB,
      };
    };

    const init = () => {
      const area = window.innerWidth * window.innerHeight;
      // density giống ảnh: nhiều điểm nhỏ lấp lánh
      const count = clamp(Math.floor(area / 26000), 40, 120);
      petalsRef.current = Array.from({ length: count }, () => createPetal(Math.random() * window.innerHeight));
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);

      // flip 3D (mượt): scaleX dao động 0.15..1.0
      const flipX = Math.abs(Math.cos(p.flip));
      const sx = lerp(0.15, 1.0, flipX);

      ctx.rotate(p.rot);

      // độ “dẹt” theo flip tạo cảm giác lật cạnh
      ctx.scale(sx, 1);

      // blur + glow nhẹ kiểu ảnh
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = p.blur;
      ctx.shadowColor = p.colorB;

      // gradient fill (hồng nhạt -> hồng đậm)
      const g = ctx.createLinearGradient(-p.size * 0.2, -p.size, p.size * 0.6, p.size);
      g.addColorStop(0, p.colorA);
      g.addColorStop(1, p.colorB);
      ctx.fillStyle = g;

      // hình cánh: teardrop + notch mềm, cân đối hơn
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, s);

      ctx.bezierCurveTo(s * 0.75, s * 0.55, s * 0.9, -s * 0.05, s * 0.25, -s * 0.75);
      ctx.bezierCurveTo(s * 0.08, -s * 0.95, -s * 0.08, -s * 0.95, -s * 0.25, -s * 0.75);
      ctx.bezierCurveTo(-s * 0.9, -s * 0.05, -s * 0.75, s * 0.55, 0, s);

      ctx.closePath();
      ctx.fill();

      // highlight nhỏ (giống điểm sáng trong ảnh)
      ctx.shadowBlur = 0;
      ctx.globalAlpha = p.alpha * 0.45;
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = Math.max(0.6, s * 0.08);
      ctx.beginPath();
      ctx.moveTo(-s * 0.05, -s * 0.45);
      ctx.quadraticCurveTo(s * 0.25, -s * 0.25, s * 0.08, s * 0.15);
      ctx.stroke();

      ctx.restore();
    };

    const tick = () => {
      if (!enabled) return;

      // nền trong ảnh là đen sâu, không cần fill đen nếu canvas ở layer trên
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // wind “chậm” thay đổi theo thời gian (giúp lượn tự nhiên)
      windRef.current.t += 0.008;
      const wind = Math.sin(windRef.current.t) * 0.45 + Math.sin(windRef.current.t * 0.37) * 0.25;

      const w = window.innerWidth;
      const h = window.innerHeight;

      // blend hơi “lấp lánh” như ảnh
      ctx.globalCompositeOperation = "lighter";

      const arr = petalsRef.current;
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];

        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.flip += p.flipSpeed;

        p.sway += p.swaySpeed;

        // lượn ngang: wind + sway + drift nhỏ
        p.x += p.vx + wind * lerp(0.6, 2.2, p.z) + Math.sin(p.sway) * (p.swayAmp * 0.07);

        // “flutter” nhẹ: petal gần sẽ dao động rõ hơn
        p.y += Math.sin(p.sway * 1.6) * lerp(0.05, 0.25, p.z);

        // respawn
        if (p.y > h + 40) {
          arr[i] = createPetal();
          continue;
        }

        // wrap X
        if (p.x > w + 40) p.x = -40;
        else if (p.x < -40) p.x = w + 40;

        drawPetal(p);
      }

      ctx.globalCompositeOperation = "source-over";
      animationRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(animationRef.current);
      init();
      tick();
    };

    const stop = () => {
      cancelAnimationFrame(animationRef.current);
      petalsRef.current = [];
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resize);
    resize();

    if (enabled) start();
    else stop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${
        enabled ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

export default EffectsLayer;
