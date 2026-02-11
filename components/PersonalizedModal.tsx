// import React, { useState } from 'react';
// import { FriendMemory } from '../types';
// import { X, ArrowRight, Heart, Mail } from 'lucide-react';

// interface Props {
//   memory: FriendMemory;
//   onClose: () => void;
//   onComplete: () => void;
// }

// const PersonalizedModal: React.FC<Props> = ({ memory, onClose, onComplete }) => {
//   const [step, setStep] = useState<0 | 1 | 2>(0); // 0: Photo, 1: Letter, 2: Greeting

//   const handleNext = () => {
//     if (step < 2) {
//       setStep((prev) => (prev + 1) as 0 | 1 | 2);
//     } else {
//       onComplete();
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

//       <div className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
//         <button 
//           onClick={onClose}
//           className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
//         >
//           <X size={20} />
//         </button>

//         <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">

//           {/* STEP 0: PHOTO */}
//           {step === 0 && (
//             <div className="animate-fade-in flex flex-col items-center gap-6">
//                 <h3 className="text-2xl font-bold text-lunar-red dark:text-lunar-gold mb-2">A Moment With {memory.name}</h3>
//                 <div className="relative group">
//                     <div className="absolute -inset-1 bg-gradient-to-r from-lunar-red to-lunar-gold rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
//                     <img 
//                         src={memory.personalizedPhotoUrl} 
//                         alt="Memory" 
//                         className="relative rounded-2xl w-full max-w-sm shadow-xl border-2 border-white/20 object-cover aspect-square"
//                     />
//                 </div>
//                 <p className="text-sm opacity-70 mt-4 italic">Click next to read a message.</p>
//             </div>
//           )}

//           {/* STEP 1: LETTER */}
//           {step === 1 && (
//             <div className="animate-fade-in w-full max-w-lg">
//                 <div className="flex justify-center mb-6">
//                     <Mail size={48} className="text-lunar-gold" />
//                 </div>
//                 <div className="glass-panel p-8 rounded-xl bg-white/40 dark:bg-black/40 text-left relative overflow-hidden">
//                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lunar-red to-lunar-gold" />
//                     <p className="font-handwriting text-3xl leading-loose text-gray-800 dark:text-gray-100">
//                         {memory.letter}
//                     </p>
//                     <p className="text-right mt-6 font-bold text-lunar-red font-sans">- From Your Friend</p>
//                 </div>
//             </div>
//           )}

//           {/* STEP 2: GREETING */}
//           {step === 2 && (
//             <div className="animate-fade-in flex flex-col items-center">
//                  <div className="flex justify-center mb-6 animate-pulse-glow">
//                     <Heart size={64} className="text-lunar-red fill-current" />
//                 </div>
//                 <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lunar-red to-yellow-500 mb-6 py-2">
//                     Warmest Wishes
//                 </h2>
//                 <p className="text-xl font-medium max-w-md leading-relaxed">
//                     {memory.greeting}
//                 </p>
//             </div>
//           )}

//         </div>

//         {/* Footer Navigation */}
//         <div className="p-6 border-t border-white/10 flex justify-end">
//             <button 
//                 onClick={handleNext}
//                 className="flex items-center gap-2 px-6 py-3 bg-lunar-red hover:bg-red-700 text-white rounded-full font-bold transition-all hover:gap-4 shadow-lg"
//             >
//                 {step === 2 ? 'Collect Gift' : 'Next'} <ArrowRight size={18} />
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PersonalizedModal;
import React, { useMemo, useState } from 'react';
import { FriendMemory } from '../types';
import { X, ArrowRight, Mail } from 'lucide-react';

interface Props {
  memory: FriendMemory;
  onClose: () => void;
  onComplete: () => void;
}

const PersonalizedModal: React.FC<Props> = ({ memory, onClose, onComplete }) => {
  const [step, setStep] = useState<0 | 1>(0);

  const handleNext = () => {
    if (step < 1) {
      setStep((prev) => (prev + 1) as 0 | 1);
    } else {
      onComplete();
      onClose();
    }
  };

  // ✅ Auto scale letter text on small screens
  const letterTextClass = useMemo(() => {
    const t = (memory.letter || "").trim();

    // rough heuristic by length (works well on mobile)
    if (t.length > 520) return "text-lg sm:text-2xl leading-relaxed sm:leading-loose";
    if (t.length > 360) return "text-xl sm:text-3xl leading-relaxed sm:leading-loose";
    if (t.length > 220) return "text-2xl sm:text-3xl leading-relaxed sm:leading-loose";
    return "text-3xl sm:text-3xl leading-loose";
  }, [memory.letter]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
          type="button"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center">
          {/* STEP 0: PHOTO */}
          {step === 0 && (
            <div className="animate-fade-in flex flex-col items-center gap-6">
              <h3 className="text-2xl font-bold text-lunar-red dark:text-lunar-gold mb-2">
                A Moment Of {memory.name}
              </h3>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-lunar-red to-lunar-gold rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={memory.personalizedPhotoUrl}
                  alt="Memory"
                  className="relative rounded-2xl w-full max-w-sm shadow-xl border-2 border-white/20 object-cover aspect-square"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="text-sm opacity-70 mt-4 italic">Bấm tiếp tục để đọc thư.</p>
            </div>
          )}

          {/* STEP 1: LETTER */}
          {step === 1 && (
            <div className="animate-fade-in w-full max-w-lg">
              <div className="flex justify-center mb-5 sm:mb-6">
                <Mail size={48} className="text-lunar-gold" />
              </div>

              <div className="glass-panel p-5 sm:p-8 rounded-xl bg-white/40 dark:bg-black/40 text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lunar-red to-lunar-gold" />

                {/* ✅ main fix: scale text + prevent overflow */}
                <p
                  className={[
                    "font-handwriting text-gray-800 dark:text-gray-100",
                    "whitespace-pre-line break-words",
                    letterTextClass,
                  ].join(" ")}
                >
                  {memory.letter}
                </p>

                <p className="text-right mt-5 sm:mt-6 font-bold text-lunar-red font-sans">
                  - From Huy -
                </p>
              </div>
            </div>
          )}


        </div>

        {/* Footer Navigation */}
        <div className="p-5 sm:p-6 border-t border-white/10 flex justify-end">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-lunar-red hover:bg-red-700 text-white rounded-full font-bold transition-all hover:gap-4 shadow-lg active:scale-[0.98]"
            type="button"
          >
            {step === 1 ? 'Nhận quà' : 'Tiếp tục'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedModal;
