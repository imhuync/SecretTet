import React, { useEffect, useRef } from "react";

interface Props {
  enabled: boolean;
}

type Petal = {
  x: number;
  y: number;
  z: number;
  size: number;

  vy: number;
  vx: number;

  rot: number;
  rotSpeed: number;

  flip: number;
  flipSpeed: number;

  sway: number;
  swaySpeed: number;

  spriteIdx: number;
  alive: boolean;
};

type Sprite = {
  canvas: HTMLCanvasElement;
  w: number;
  h: number;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function createSprite(size: number, colorA: string, colorB: string, blur: number): Sprite {
  const pad = Math.ceil(blur * 2 + 2);
  const w = Math.ceil(size * 2 + pad * 2);
  const h = Math.ceil(size * 2.3 + pad * 2);

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.translate(w / 2, h / 2);

  // glow/blur chỉ 1 lần trong sprite
  ctx.shadowBlur = blur;
  ctx.shadowColor = colorB;

  // gradient fill 1 lần
  const g = ctx.createLinearGradient(-size * 0.2, -size, size * 0.6, size);
  g.addColorStop(0, colorA);
  g.addColorStop(1, colorB);
  ctx.fillStyle = g;

  // shape
  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(s * 0.75, s * 0.55, s * 0.9, -s * 0.05, s * 0.25, -s * 0.75);
  ctx.bezierCurveTo(s * 0.08, -s * 0.95, -s * 0.08, -s * 0.95, -s * 0.25, -s * 0.75);
  ctx.bezierCurveTo(-s * 0.9, -s * 0.05, -s * 0.75, s * 0.55, 0, s);
  ctx.closePath();
  ctx.fill();

  // highlight line (nhẹ)
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = Math.max(0.6, s * 0.08);
  ctx.beginPath();
  ctx.moveTo(-s * 0.05, -s * 0.45);
  ctx.quadraticCurveTo(s * 0.25, -s * 0.25, s * 0.08, s * 0.15);
  ctx.stroke();
  ctx.globalAlpha = 1;

  return { canvas: c, w, h };
}

const EffectsLayer: React.FC<Props> = ({ enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const petalsRef = useRef<Petal[]>([]);
  const spritesRef = useRef<Sprite[]>([]);
  const windRef = useRef({ t: 0 });

  // tweak nhanh:
  const USE_LIGHTER = true;         // giống ảnh hơn nhưng tốn hơn chút
  const FPS_CAP = 60;               // 30 nếu muốn nhẹ hơn nữa
  const DPR_CAP = 1.5;              // giảm tải GPU (retina)

  const COLOR_PAIRS: Array<[string, string]> = [
    ["rgba(255, 170, 200, 1)", "rgba(255, 85, 170, 1)"],
    ["rgba(255, 190, 215, 1)", "rgba(255, 120, 190, 1)"],
    ["rgba(255, 205, 225, 1)", "rgba(255, 150, 205, 1)"],
    ["rgba(255, 150, 200, 1)", "rgba(255, 70, 160, 1)"],
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    if (!ctx) return;

    let running = true;
    let lastT = 0;
    let acc = 0;
    const step = 1000 / FPS_CAP;

    const getDpr = () => clamp(window.devicePixelRatio || 1, 1, DPR_CAP);

    const resize = () => {
      const dpr = getDpr();
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const buildSprites = () => {
      // tạo ~8 sprite: size khác nhau + màu khác nhau
      const sprites: Sprite[] = [];
      for (let i = 0; i < 8; i++) {
        const z = i / 7; // 0..1
        const size = lerp(4, 11, z) * rand(0.9, 1.1);
        const [a, b] = COLOR_PAIRS[(Math.random() * COLOR_PAIRS.length) | 0];
        const blur = lerp(5.2, 1.2, z);
        sprites.push(createSprite(size, a, b, blur));
      }
      spritesRef.current = sprites;
    };

    const spawn = (p: Petal, initialY?: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const z = Math.pow(Math.random(), 1.8);
      p.x = Math.random() * w;
      p.y = initialY ?? rand(-h * 0.2, -20);
      p.z = z;

      p.size = lerp(0.7, 1.35, z);

      p.vy = lerp(0.55, 2.1, z) * rand(0.9, 1.15);
      p.vx = lerp(-0.2, 0.3, z) * rand(0.7, 1.2);

      p.rot = rand(0, Math.PI * 2);
      p.rotSpeed = rand(-0.02, 0.02) * lerp(0.5, 1.1, z);

      p.flip = rand(0, Math.PI * 2);
      p.flipSpeed = rand(0.02, 0.06) * lerp(0.6, 1.2, z);

      p.sway = rand(0, Math.PI * 2);
      p.swaySpeed = rand(0.008, 0.02) * lerp(0.7, 1.4, z);

      p.spriteIdx = (Math.random() * spritesRef.current.length) | 0;
      p.alive = true;
    };

    const initPetals = () => {
      const area = window.innerWidth * window.innerHeight;
      const count = clamp(Math.floor(area / 28000), 35, 110);
      const arr: Petal[] = new Array(count);

      for (let i = 0; i < count; i++) {
        arr[i] = {
          x: 0,
          y: 0,
          z: 0,
          size: 1,
          vy: 1,
          vx: 0,
          rot: 0,
          rotSpeed: 0,
          flip: 0,
          flipSpeed: 0,
          sway: 0,
          swaySpeed: 0,
          spriteIdx: 0,
          alive: true,
        };
        spawn(arr[i], Math.random() * window.innerHeight);
      }
      petalsRef.current = arr;
    };

    const draw = (p: Petal) => {
      const sprite = spritesRef.current[p.spriteIdx];
      if (!sprite) return;

      // culling nhanh
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (p.y < -80 || p.y > h + 80 || p.x < -120 || p.x > w + 120) return;

      ctx.save();
      ctx.translate(p.x, p.y);

      // flip 3D: scaleX 0.18..1
      const flipX = Math.abs(Math.cos(p.flip));
      const sx = lerp(0.18, 1, flipX);

      ctx.rotate(p.rot);
      ctx.scale(sx * p.size, p.size);

      // alpha theo depth (xa mờ hơn)
      ctx.globalAlpha = lerp(0.28, 0.95, p.z);

      ctx.drawImage(sprite.canvas, -sprite.w / 2, -sprite.h / 2);
      ctx.restore();
    };

    const frame = (t: number) => {
      if (!running) return;
      rafRef.current = requestAnimationFrame(frame);

      if (!lastT) lastT = t;
      const dt = t - lastT;
      lastT = t;

      // FPS cap
      acc += dt;
      if (acc < step) return;
      acc = acc % step;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (USE_LIGHTER) ctx.globalCompositeOperation = "lighter";

      windRef.current.t += 0.008;
      const wind = Math.sin(windRef.current.t) * 0.45 + Math.sin(windRef.current.t * 0.37) * 0.25;

      const w = window.innerWidth;
      const h = window.innerHeight;

      const arr = petalsRef.current;
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];

        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.flip += p.flipSpeed;
        p.sway += p.swaySpeed;

        // drift + sway
        p.x += p.vx + wind * lerp(0.6, 2.0, p.z) + Math.sin(p.sway) * lerp(0.25, 0.9, p.z);

        // respawn
        if (p.y > h + 60) {
          spawn(p);
          continue;
        }
        if (p.x > w + 80) p.x = -80;
        else if (p.x < -80) p.x = w + 80;

        draw(p);
      }

      if (USE_LIGHTER) ctx.globalCompositeOperation = "source-over";
    };

    const start = () => {
      resize();
      buildSprites();
      initPetals();
      running = true;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      petalsRef.current = [];
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resize);

    if (enabled) start();
    else stop();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${
        enabled ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

export default EffectsLayer;
