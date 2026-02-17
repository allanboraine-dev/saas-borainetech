
import React from 'react';
import { Quote, BrainCircuit, CheckCircle, TrendingUp } from 'lucide-react';

const CEOProfile: React.FC = () => {
  return (
    <section className="py-32 px-4 relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-boraine-bg to-black">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-boraine-blue/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Image Column */}
        <div className="relative group order-2 md:order-1 flex justify-center md:justify-end">

          <div className="relative w-full max-w-[400px] z-10 transition-all duration-700">
            {/* Abstract Digital Architect Image */}
            <img
              src="https://images.unsplash.com/photo-1535378437327-b7102a743217?q=80&w=800&auto=format&fit=crop"
              alt="Boraine Tech Architecture"
              className="w-full h-auto rounded-2xl grayscale group-hover:grayscale-0 brightness-75 contrast-125 group-hover:brightness-100 transition-all duration-1000 shadow-2xl"
            />

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-boraine-blue/20 via-transparent to-indigo-500/10 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

            {/* AI Scanning Effect Overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-boraine-blue/10 to-transparent w-full h-[30%] animate-scan pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>

            <div className="absolute bottom-0 left-0 right-0 pt-20 pb-8 px-8 z-20">
              <h3 className="text-3xl font-display font-bold text-white mb-1 drop-shadow-md">Allan Boraine</h3>
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-boraine-blue"></div>
                <p className="text-boraine-blue text-xs uppercase tracking-[0.2em] font-bold drop-shadow-md font-mono">Chief Technical Architect</p>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#0a0a0a]/90 backdrop-blur-xl border border-boraine-blue/30 rounded-xl flex flex-col items-center justify-center z-20 shadow-2xl animate-fade-up group-hover:-translate-y-2 transition-transform duration-500">
              <BrainCircuit className="w-8 h-8 text-boraine-yellow mb-2" />
              <span className="text-[10px] text-gray-400 uppercase tracking-widest text-center font-mono">AI Visionary</span>
            </div>
          </div>

        </div>

        {/* Text Column */}
        <div className="space-y-10 order-1 md:order-2">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-boraine-blue/5 rounded-full border border-boraine-blue/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-boraine-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-boraine-blue"></span>
            </span>
            <span className="text-[10px] text-boraine-blue uppercase tracking-[0.25em] font-bold font-mono">From the Founder</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-[1.15]">
            "We don't just write code. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 italic font-serif">We engineer profit.</span>"
          </h2>

          <div className="relative pl-8 border-l border-boraine-blue/30">
            <Quote className="absolute top-0 left-0 w-6 h-6 text-boraine-blue -translate-x-[calc(100%+16px)]" />
            <p className="text-gray-400 font-light leading-relaxed text-lg mb-6">
              My mission is to establish Boraine Tech as the <strong>AI Profit Centre</strong>—the definitive, go-to hub for automated revenue generation services in South Africa.
            </p>
            <p className="text-gray-400 font-light leading-relaxed text-lg">
              With deep-rooted experience in artificial intelligence architecture, I recognized that most businesses use technology passively. We are changing that paradigm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded border border-white/5 hover:border-boraine-blue/30 transition-colors group">
              <div className="p-2 bg-black rounded text-boraine-blue group-hover:text-white transition-colors">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-300 font-medium">Strategic AI Architecture</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded border border-white/5 hover:border-boraine-blue/30 transition-colors group">
              <div className="p-2 bg-black rounded text-boraine-blue group-hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-300 font-medium">Revenue Automation</span>
            </div>
          </div>

          <div className="pt-8 opacity-70">
            <p className="font-serif text-2xl text-white italic">Allan Boraine</p>
            <p className="text-xs text-boraine-blue/70 uppercase tracking-widest mt-1 font-mono">CEO & Founder</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CEOProfile;
