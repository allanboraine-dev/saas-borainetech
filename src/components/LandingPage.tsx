
import React, { useState, useEffect } from 'react';
import { ArrowRight, Cpu, Activity, Globe } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  // Pre-load voices if possible
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleEnter = () => {
    // Voice Activation
    if ('speechSynthesis' in window) {
      // Updated text to be more welcoming and enthusiastic
      const utterance = new SpeechSynthesisUtterance("Welcome to Boraine Tech. We are thrilled to have you here.");
      
      // Adjusted parameters for a deep, slower male voice
      utterance.pitch = 0.9; // Lower pitch for a more masculine tone
      utterance.rate = 0.85; // Slower speed for gravitas
      utterance.volume = 1;
      
      // Try to find a high-quality male voice
      const voices = window.speechSynthesis.getVoices();
      
      // Prioritize known male voices or those explicitly marked as "Male"
      const preferredVoice = voices.find(v => 
        v.name.includes('Google UK English Male') || 
        v.name.includes('Daniel') ||           // macOS High Quality Male
        v.name.includes('Microsoft David') ||  // Windows Male
        (v.name.toLowerCase().includes('male') && v.lang.startsWith('en'))
      ) || voices.find(v => v.lang.startsWith('en')); // Fallback to any English

      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
    }

    setIsExiting(true);
    setTimeout(onEnter, 800); // Wait for exit animation
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Cinematic Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute w-full h-full object-cover opacity-60"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-white-lines-2856-large.mp4" type="video/mp4" />
      </video>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"></div>

      {/* Content Container */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        
        {/* Status Indicators */}
        <div className="flex justify-center gap-8 mb-12 text-[10px] font-mono text-boraine-blue/70 uppercase tracking-[0.3em] animate-fade-up">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-boraine-yellow rounded-full animate-pulse"></div> System Nominal</span>
            <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Secure Connection</span>
            <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Neural Engine Ready</span>
        </div>

        {/* Main Logo Block */}
        <div className="mb-16 transform transition-all duration-1000 hover:scale-105">
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-4 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                BOR<span className="text-boraine-yellow inline-block animate-pulse drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]">AI</span>NE
            </h1>
            <div className="flex items-center justify-center gap-4">
                <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-boraine-blue"></div>
                <span className="text-2xl md:text-3xl font-display font-bold text-boraine-blue tracking-[0.5em] ml-2">TECH</span>
                <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-boraine-blue"></div>
            </div>
        </div>

        {/* Mission Statement */}
        <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto mb-16 leading-relaxed">
            We don't just predict the future. We code it. <br/>
            <span className="text-white font-medium">Advanced Revenue Intelligence & Autonomous Agents.</span>
        </p>

        {/* Enter Button */}
        <button 
            onClick={handleEnter}
            className="group relative inline-flex items-center gap-4 px-12 py-6 bg-transparent overflow-hidden rounded-none transition-all duration-300 hover:tracking-widest cursor-pointer"
        >
            {/* Button Borders */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-boraine-blue to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-boraine-blue to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Button Background Glow */}
            <div className="absolute inset-0 bg-boraine-blue/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>

            <span className="relative font-mono text-sm font-bold text-white uppercase tracking-[0.3em] group-hover:text-boraine-yellow transition-colors">
                Initialize System
            </span>
            <ArrowRight className="w-4 h-4 text-boraine-blue group-hover:text-boraine-yellow transition-colors" />
        </button>

        {/* Footer Code */}
        <div className="absolute bottom-[-100px] left-0 right-0 text-center">
            <p className="font-mono text-[9px] text-gray-700">
                LOADING MODULES: [X] REVENUE_OPS [X] VOICE_GATEWAY [X] MARKET_PREDICTION
            </p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
