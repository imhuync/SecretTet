// // import React, { useState } from 'react';
// // import { Disc, Maximize2, Minimize2 } from 'lucide-react';

// // const MusicPlayer: React.FC = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const PLAYLIST_ID = "PLF46C498263920958"; // Lofi / LNY Vibe Playlist

// //   return (
// //     <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px] transition-all duration-500">
      
// //       {/* Expanded Player Content (Iframe) */}
// //       <div 
// //         className={`glass-panel rounded-2xl overflow-hidden mb-3 transition-all duration-500 ease-out origin-bottom shadow-2xl ${
// //           isOpen ? 'h-48 opacity-100 scale-100' : 'h-0 opacity-0 scale-95 pointer-events-none'
// //         }`}
// //       >
// //         <iframe 
// //             width="100%" 
// //             height="100%" 
// //             src={`https://www.youtube.com/embed/videoseries?list=PLBXyApvooRGws5tP7-oByqT9Dsk4v50G-&si=ySfC8BFMIBPVzJ85&autoplay=1&loop=1`} 
// //             title="YouTube video player" 
// //             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
// //             className="w-full h-full"
// //         ></iframe>
// //       </div>

// //       {/* Bar Player */}
// //       <div className="glass-panel rounded-full p-2 pl-3 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20 dark:border-white/10 bg-white/20 dark:bg-black/40 backdrop-blur-xl">
        
// //         {/* Album Art / Spinner */}
// //         <div className="relative w-10 h-10 flex-shrink-0">
// //             <div className="w-full h-full rounded-full bg-gradient-to-br from-lunar-red to-orange-500 flex items-center justify-center animate-spin-slow border border-white/20 shadow-md">
// //                 <Disc size={16} className="text-white opacity-90" />
// //             </div>
// //             {/* Center hole for vinyl look */}
// //             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black/50 rounded-full backdrop-blur-sm border border-white/10"></div>
// //         </div>

// //         {/* Info */}
// //         <div className="flex-1 flex flex-col justify-center min-w-0">
// //             <span className="text-xs font-bold text-gray-900 dark:text-white truncate tracking-wide">Happy New Year</span>
// //             <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate uppercase tracking-wider font-medium">Year of the Horse</span>
// //         </div>

// //         {/* Visualizer */}
// //         <div className="flex gap-[3px] h-4 items-end mx-2 pb-1">
// //             <div className="w-1 bg-lunar-red rounded-full animate-music-bar-1"></div>
// //             <div className="w-1 bg-lunar-gold rounded-full animate-music-bar-2"></div>
// //             <div className="w-1 bg-orange-500 rounded-full animate-music-bar-3"></div>
// //             <div className="w-1 bg-lunar-red rounded-full animate-music-bar-1" style={{animationDelay: '0.2s'}}></div>
// //         </div>

// //         {/* Toggle Button */}
// //         <button 
// //             onClick={() => setIsOpen(!isOpen)}
// //             className="w-9 h-9 flex items-center justify-center rounded-full bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 text-gray-800 dark:text-white transition-all active:scale-95"
// //             aria-label={isOpen ? "Minimize player" : "Maximize player"}
// //         >
// //             {isOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
// //         </button>

// //       </div>
// //     </div>
// //   );
// // };

// // export default MusicPlayer;
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { Disc, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';

// const MusicPlayer: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(true);

//   // Autoplay policy: start muted
//   const [isMuted, setIsMuted] = useState(true);

//   // Track if we've already "unlocked" audio via first user gesture
//   const hasUnlockedAudioRef = useRef(false);

//   const PLAYLIST_ID = "PLBXyApvooRGws5tP7-oByqT9Dsk4v50G-";

//   const iframeSrc = useMemo(() => {
//     const params = new URLSearchParams({
//       list: PLAYLIST_ID,
//       autoplay: '1',
//       playsinline: '1',
//       mute: isMuted ? '1' : '0',
//       controls: '1',
//       rel: '0',
//       modestbranding: '1',
//     });
//     return `https://www.youtube.com/embed/playlist?${params.toString()}`;
//   }, [PLAYLIST_ID, isMuted]);

//   // On mount: open + muted autoplay, and set up "first click anywhere" to unmute
//   useEffect(() => {
//     setIsOpen(true);
//     setIsMuted(true);

//     const unlockAudio = () => {
//       if (hasUnlockedAudioRef.current) return;
//       hasUnlockedAudioRef.current = true;

//       // User gesture happened => allow audio
//       setIsMuted(false);

//       // Remove listeners after first unlock
//       window.removeEventListener('pointerdown', unlockAudio, true);
//       window.removeEventListener('keydown', unlockAudio, true);
//       window.removeEventListener('touchstart', unlockAudio, true);
//     };

//     // Capture phase so it triggers even if some element stops propagation
//     window.addEventListener('pointerdown', unlockAudio, true);
//     // Also allow keyboard users (Space/Enter etc.)
//     window.addEventListener('keydown', unlockAudio, true);
//     window.addEventListener('touchstart', unlockAudio, true);

//     return () => {
//       window.removeEventListener('pointerdown', unlockAudio, true);
//       window.removeEventListener('keydown', unlockAudio, true);
//       window.removeEventListener('touchstart', unlockAudio, true);
//     };
//   }, []);

//   const toggleMute = () => {
//     // After user manually toggles, we consider audio "unlocked"
//     hasUnlockedAudioRef.current = true;
//     setIsMuted((v) => !v);
//   };

//   return (
//     <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px] transition-all duration-500">
//       {/* Expanded Player Content (Iframe) */}
//       <div
//         className={`glass-panel rounded-2xl overflow-hidden mb-3 transition-all duration-500 ease-out origin-bottom shadow-2xl ${
//           isOpen ? 'h-48 opacity-100 scale-100' : 'h-0 opacity-0 scale-95 pointer-events-none'
//         }`}
//       >
//         <iframe
//           key={iframeSrc} // reload iframe when mute state changes
//           width="100%"
//           height="100%"
//           src={iframeSrc}
//           title="YouTube music player"
//           allow="autoplay; encrypted-media; picture-in-picture"
//           className="w-full h-full"
//         />
//       </div>

//       {/* Bar Player */}
//       <div className="glass-panel rounded-full p-2 pl-3 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20 dark:border-white/10 bg-white/20 dark:bg-black/40 backdrop-blur-xl">
//         {/* Album Art / Spinner */}
//         <div className="relative w-10 h-10 flex-shrink-0">
//           <div className="w-full h-full rounded-full bg-gradient-to-br from-lunar-red to-orange-500 flex items-center justify-center animate-spin-slow border border-white/20 shadow-md">
//             <Disc size={16} className="text-white opacity-90" />
//           </div>
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black/50 rounded-full backdrop-blur-sm border border-white/10" />
//         </div>

//         {/* Info */}
//         <div className="flex-1 flex flex-col justify-center min-w-0">
//           <span className="text-xs font-bold text-gray-900 dark:text-white truncate tracking-wide">
//             Happy New Year
//           </span>
//           <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate uppercase tracking-wider font-medium">
//             Year of the Horse
//           </span>
//         </div>

//         {/* Mute toggle */}
//         <button
//           onClick={toggleMute}
//           className="w-9 h-9 flex items-center justify-center rounded-full bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 text-gray-800 dark:text-white transition-all active:scale-95"
//           aria-label={isMuted ? "Unmute" : "Mute"}
//           title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
//         >
//           {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//         </button>

//         {/* Toggle open/close */}
//         <button
//           onClick={() => setIsOpen((v) => !v)}
//           className="w-9 h-9 flex items-center justify-center rounded-full bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 text-gray-800 dark:text-white transition-all active:scale-95"
//           aria-label={isOpen ? "Minimize player" : "Maximize player"}
//         >
//           {isOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//         </button>
//       </div>

//       {/* Optional tiny hint when muted (genz-friendly) */}
//       {isMuted && (
//         <div className="mt-2 text-center text-[11px] text-gray-700 dark:text-gray-200 opacity-80">
//           Chạm bất kỳ để bật nhạc 🔊
//         </div>
//       )}
//     </div>
//   );
// };

// export default MusicPlayer;
import React, { useEffect, useRef, useState } from "react";
import { Disc, Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const MusicPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Dynamic info
  const [trackTitle, setTrackTitle] = useState("Happy New Year");
  const [trackArtist, setTrackArtist] = useState("Lofi / Tết vibe");

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const hasUnlockedAudioRef = useRef(false);
  const scriptLoadedRef = useRef(false);

  const lastVideoIdRef = useRef<string | null>(null);
  const infoTimerRef = useRef<number | null>(null);

  const PLAYLIST_ID = "PLBXyApvooRGws5tP7-oByqT9Dsk4v50G-";

  const safeUpdateTrackInfo = () => {
    const p = playerRef.current;
    if (!p || typeof p.getVideoData !== "function") return;

    try {
      const data = p.getVideoData?.() || {};
      const vid = (data.video_id || data.videoId || null) as string | null;

      // Chỉ update khi đổi bài để tránh re-render liên tục
      if (vid && vid === lastVideoIdRef.current) return;
      lastVideoIdRef.current = vid;

      // title/author là metadata YouTube (author thường là tên kênh upload)
      const title = (data.title || "").trim();
      const author = (data.author || "").trim();

      if (title) setTrackTitle(title);
      if (author) setTrackArtist(author);
    } catch {
      // ignore
    }
  };

  const startInfoPolling = () => {
    if (infoTimerRef.current) return;
    infoTimerRef.current = window.setInterval(() => {
      safeUpdateTrackInfo();
    }, 800);
  };

  const stopInfoPolling = () => {
    if (infoTimerRef.current) {
      window.clearInterval(infoTimerRef.current);
      infoTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const initPlayer = () => {
      if (!containerRef.current) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 1,
          controls: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,

          listType: "playlist",
          list: PLAYLIST_ID,

          // Start muted for autoplay policy
          mute: 1,
        },
        events: {
          onReady: (event: any) => {
            try {
              event.target.mute();
              event.target.playVideo();
              setIsMuted(true);

              // Bắt đầu theo dõi info ngay khi sẵn sàng
              safeUpdateTrackInfo();
              startInfoPolling();
            } catch {}
          },
          onStateChange: () => {
            // Mỗi lần state đổi, thử update info (đổi bài thường sẽ kéo theo state change)
            safeUpdateTrackInfo();
          },
        },
      });
    };

    // If API already present
    if (window.YT && window.YT.Player) {
      scriptLoadedRef.current = true;
      initPlayer();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    const hookReady = () => {
      scriptLoadedRef.current = true;
      initPlayer();
    };

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      hookReady();
    };

    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    return () => {
      // cleanup polling if component unmounts before player created
      stopInfoPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // First click anywhere => unmute + play
  useEffect(() => {
    const unlock = () => {
      if (hasUnlockedAudioRef.current) return;
      hasUnlockedAudioRef.current = true;

      const p = playerRef.current;
      if (p) {
        try {
          p.unMute?.();
          p.setVolume?.(60);
          p.playVideo?.();
          setIsMuted(false);
        } catch {}
      }

      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };

    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("touchstart", unlock, true);
    window.addEventListener("keydown", unlock, true);

    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };
  }, []);

  const toggleMute = () => {
    hasUnlockedAudioRef.current = true;
    const p = playerRef.current;
    if (!p) return;

    try {
      if (isMuted) {
        p.unMute?.();
        p.setVolume?.(60);
        p.playVideo?.();
        setIsMuted(false);
      } else {
        p.mute?.();
        setIsMuted(true);
      }
    } catch {}
  };

  const toggleOpen = () => setIsOpen((v) => !v);

  // Cleanup player
  useEffect(() => {
    return () => {
      stopInfoPolling();
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px] transition-all duration-500">
      {/* Expanded Player Content */}
      <div
        className={`glass-panel rounded-2xl overflow-hidden mb-3 transition-all duration-500 ease-out origin-bottom shadow-2xl ${
          isOpen
            ? "h-48 opacity-100 scale-100"
            : "h-0 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Bar Player */}
      <div className="glass-panel rounded-full p-2 pl-3 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20 dark:border-white/10 bg-white/20 dark:bg-black/40 backdrop-blur-xl">
        {/* Album Art / Spinner */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-lunar-red to-orange-500 flex items-center justify-center animate-spin-slow border border-white/20 shadow-md">
            <Disc size={16} className="text-white opacity-90" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black/50 rounded-full backdrop-blur-sm border border-white/10" />
        </div>

        {/* Info (dynamic) */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <span className="text-xs font-bold text-gray-900 dark:text-white truncate tracking-wide">
            {trackTitle}
          </span>
          <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate uppercase tracking-wider font-medium">
            {trackArtist}
          </span>
        </div>

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 text-gray-800 dark:text-white transition-all active:scale-95"
          aria-label={isMuted ? "Unmute" : "Mute"}
          title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Expand/Collapse */}
        <button
          onClick={toggleOpen}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 text-gray-800 dark:text-white transition-all active:scale-95"
          aria-label={isOpen ? "Minimize player" : "Maximize player"}
        >
          {isOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {isMuted && (
        <div className="mt-2 text-center text-[11px] text-gray-700 dark:text-gray-200 opacity-80">
          Chạm bất kỳ để bật nhạc 🔊
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
