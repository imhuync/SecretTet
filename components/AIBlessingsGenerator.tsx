import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Send, Loader2, Wand2 } from 'lucide-react';

const AIBlessingsGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Bestie');
  const [blessing, setBlessing] = useState('');
  const [loading, setLoading] = useState(false);

  const generateBlessing = async () => {
    if (!process.env.API_KEY) {
      setBlessing("API Key not found. Please configure it.");
      return;
    }
    if (!name) return;

    setLoading(true);
    setBlessing('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a short, witty, Gen-Z style Lunar New Year 2026 (Year of the Horse) blessing for my ${relationship} named ${name}. Keep it under 280 chars. Use emojis.`,
      });
      setBlessing(response.text || "May your year be filled with luck!");
    } catch (error) {
      console.error(error);
      setBlessing("The spirits are busy. Try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel p-8 rounded-[2rem] border border-white/20 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-lunar-gold/10 rounded-full blur-3xl -z-10 group-hover:bg-lunar-gold/20 transition-colors duration-700"></div>
      
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-lunar-gold w-6 h-6 animate-pulse-glow" />
            <h3 className="font-serif text-2xl font-bold text-gray-800 dark:text-white">AI Blessings Generator</h3>
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">Powered by Gemini 3 Flash</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-3 p-1">
            <input 
                type="text" 
                placeholder="Name (e.g., Alex)" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-white/60 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-lunar-red/50 transition-all placeholder:text-gray-400 font-medium"
            />
            <div className="flex gap-2">
                <select 
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="bg-white/60 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-lunar-red/50 transition-all font-medium appearance-none cursor-pointer hover:bg-white/80 dark:hover:bg-black/40"
                >
                    <option value="Bestie">Bestie</option>
                    <option value="Family">Family</option>
                    <option value="Partner">Partner</option>
                    <option value="Coworker">Coworker</option>
                </select>
                <button 
                    onClick={generateBlessing}
                    disabled={loading || !name}
                    className="bg-gradient-to-r from-lunar-red to-orange-500 hover:to-orange-600 text-white font-bold rounded-2xl px-8 py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 min-w-[140px]"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <> <Wand2 size={20} /> Manifest </>}
                </button>
            </div>
        </div>

        {/* Result Area */}
        <div className={`transition-all duration-500 ease-out overflow-hidden ${blessing ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent border border-white/20 rounded-2xl text-center relative">
                <div className="absolute top-2 left-2 text-4xl opacity-10">❝</div>
                <p className="font-handwriting text-3xl text-gray-800 dark:text-lunar-gold leading-relaxed px-4">
                    {blessing}
                </p>
                <div className="absolute bottom-2 right-2 text-4xl opacity-10">❞</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIBlessingsGenerator;