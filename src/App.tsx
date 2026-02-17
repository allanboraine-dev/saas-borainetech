
import React, { useEffect, useState } from 'react';
import Terminal from './components/Terminal';
import CEOProfile from './components/CEOProfile';
import LandingPage from './components/LandingPage';
import ChatWidget from './components/ChatWidget';
import BookingAgent from './components/BookingAgent'; // NEW Import
import { Mic, BarChart, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

const Logo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'sm' }) => (
  // ... Logo implementation ...
  <div className={`flex flex-col select-none group cursor-default ${size === 'lg' ? 'transition-transform duration-1000 ease-out hover:scale-105 hover:-translate-y-2' : ''}`}>
    <div className={`font-display font-black tracking-tighter leading-none ${size === 'lg' ? 'text-7xl md:text-9xl' : 'text-2xl'} flex items-center relative`}>

      {/* BOR (White/Grey) */}
      <span className="text-white drop-shadow-md">
        BOR
      </span>

      {/* AI (Yellow) - Highlighted */}
      <span className={`relative ${size === 'lg' ? 'mx-1' : 'mx-px'} text-boraine-yellow drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]`}>
        AI
        {/* Inner Glow */}
        <span className="absolute inset-0 blur-sm text-yellow-200 opacity-50 select-none pointer-events-none">AI</span>
      </span>

      {/* NE (White/Grey) */}
      <span className="text-white drop-shadow-md">
        NE
      </span>

      {/* TECH (Blue) */}
      <span className={`${size === 'lg' ? 'ml-6' : 'ml-2'} text-boraine-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]`}>
        TECH
      </span>
    </div>

    <div className={`flex items-center justify-between w-full ${size === 'lg' ? 'mt-4' : 'mt-1'}`}>
      <div className={`h-[1px] bg-boraine-blue/30 flex-1 ${size === 'lg' ? 'mr-6' : 'mr-2'} transition-all duration-700 group-hover:bg-boraine-blue`}></div>
      <span className={`font-mono font-medium tracking-[0.4em] text-boraine-grey ${size === 'lg' ? 'text-sm' : 'text-[8px]'} transition-colors duration-500 group-hover:text-white`}>
        INTELLIGENCE SYSTEMS
      </span>
      <div className={`h-[1px] bg-boraine-blue/30 flex-1 ${size === 'lg' ? 'ml-6' : 'ml-2'} transition-all duration-700 group-hover:bg-boraine-blue`}></div>
    </div>
  </div>
);

function App() {
  // Production Check: Only show intro if not visited in this session
  const [showLanding, setShowLanding] = useState(() => {
    try {
      return !sessionStorage.getItem('boraine_intro_complete');
    } catch {
      return true;
    }
  });

  const [loaded, setLoaded] = useState(false);
  const [showBooking, setShowBooking] = useState(false); // New State

  useEffect(() => {
    // Simulate high-end asset loading
    if (!showLanding) {
      setTimeout(() => setLoaded(true), 100);
    }
  }, [showLanding]);

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('boraine_intro_complete', 'true');
    } catch (e) {
      // Ignore storage errors in private browsing
    }
    setShowLanding(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Landing Page Layer */}
      {showLanding && <LandingPage onEnter={handleIntroComplete} />}

      {/* Main Application Layer */}
      <div className={`min-h-screen bg-boraine-bg text-gray-200 font-sans relative overflow-x-hidden selection:bg-boraine-blue selection:text-white transition-opacity duration-1000 ${showLanding ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>

        {/* TECH BACKGROUND */}
        <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden pointer-events-none">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

          {/* Glowing Orbs/Effects */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-boraine-blue/10 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-boraine-blue/10 blur-[150px] rounded-full"></div>
        </div>

        {/* Navigation */}
        <nav className={`fixed w-full z-50 px-8 py-6 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center border-b border-white/5 pb-6 backdrop-blur-md bg-boraine-bg/80">
            <Logo size="sm" />
            <div className="hidden md:flex gap-10 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase font-mono">
              <button onClick={() => scrollToSection('capabilities')} className="hover:text-boraine-blue transition-all hover:tracking-[0.25em]">Capabilities</button>
              <button onClick={() => scrollToSection('saas')} className="hover:text-boraine-blue transition-all hover:tracking-[0.25em]">SaaS Division</button>
              <button onClick={() => scrollToSection('investment')} className="hover:text-boraine-blue transition-all hover:tracking-[0.25em]">Investment</button>
              <button onClick={() => scrollToSection('terminal-section')} className="text-boraine-blue flex items-center gap-2 group border border-boraine-blue/30 px-3 py-1 rounded hover:bg-boraine-blue/10">
                <div className="w-1.5 h-1.5 bg-boraine-yellow rounded-full group-hover:animate-pulse"></div>
                Access Portal
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 pt-40 pb-20">

          {/* The "Headlines" Main Title Block */}
          <div className={`text-center px-4 mb-24 max-w-5xl mx-auto transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 blur-sm'}`}>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-sm bg-boraine-blue/10 border border-boraine-blue/30 text-boraine-blue text-[10px] font-bold tracking-[0.3em] uppercase mb-12 backdrop-blur-md font-mono">
              <span className="w-1 h-1 rounded-full bg-boraine-blue animate-pulse"></span>
              Kimberley // Johannesburg // Cape Town
              <span className="w-1 h-1 rounded-full bg-boraine-blue animate-pulse"></span>
            </div>

            <div className="flex justify-center mb-8 transform hover:scale-[1.02] transition-transform duration-700">
              <Logo size="lg" />
            </div>

            <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12 font-light leading-relaxed tracking-wide">
              Elite AI Consultancy for Enterprise.
              <span className="text-white block mt-2 font-normal">We engineer <span className="text-boraine-yellow font-bold">autonomous profit systems</span> for industry leaders.</span>
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6">
              <button
                onClick={() => setShowBooking(true)}
                className="group relative px-10 py-5 bg-boraine-blue text-white font-bold uppercase tracking-[0.2em] text-xs overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                <div className="absolute inset-0 w-full h-full bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out mix-blend-overlay"></div>
                <span className="relative z-10 flex items-center gap-3">
                  Book Consultation <ArrowRight className="w-4 h-4" />
                </span>
              </button>
              <button onClick={() => scrollToSection('capabilities')} className="px-10 py-5 bg-transparent border border-gray-700 text-gray-400 font-bold uppercase tracking-[0.2em] text-xs hover:border-boraine-blue hover:text-white transition-all backdrop-blur-sm">
                View Case Studies
              </button>
            </div>
          </div>

          {/* The Intelligence Console (Terminal) */}
          <div className="px-4 mb-40 relative animate-fade-up scroll-mt-32" id="terminal-section">
            <div className="max-w-5xl mx-auto relative z-10">
              {/* Glass frame around terminal */}
              <div className="p-1 rounded-xl bg-gradient-to-b from-boraine-blue/30 to-transparent">
                <div className="bg-black/80 rounded-lg backdrop-blur-xl">
                  <Terminal />
                </div>
              </div>
            </div>
          </div>

          {/* Service Pillars (Capabilities) */}
          <div id="capabilities" className="scroll-mt-32 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
            {[
              {
                icon: <Mic className="w-5 h-5" />,
                title: "AI Voice Reception",
                desc: "1,000 concurrent call capacity. Natural language processing. Instant CRM synchronization."
              },
              {
                icon: <BarChart className="w-5 h-5" />,
                title: "Revenue Intelligence",
                desc: "Dynamic pricing algorithms modeled on local market liquidity and competitor scarcity."
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Process Automation",
                desc: "Autonomous workflow execution: invoicing, compliance, and logistical scheduling."
              }
            ].map((item, idx) => (
              <div key={idx} className="group p-10 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 hover:border-boraine-blue/50 transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-boraine-blue/5 rounded-full blur-2xl group-hover:bg-boraine-blue/10 transition-colors"></div>

                <div className="w-10 h-10 bg-boraine-blue/10 rounded flex items-center justify-center text-boraine-blue mb-8 group-hover:bg-boraine-blue group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>

          <div id="investment" className="mt-32 scroll-mt-20">
            {/* Pricing Component removed for Agency Rebuild */}
          </div>

          {/* CEO Profile Section */}
          <div className="mt-20">
            <CEOProfile />
          </div>

          {/* Trust Indicators */}
          <div className="py-24 text-center border-t border-white/5 mt-0 bg-black/40">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-12 font-mono">Deployed Environments</p>
            <div className="flex flex-wrap justify-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <h4 className="text-2xl font-display font-bold text-white tracking-tighter">ANGLO<span className="text-boraine-blue">AMERICAN</span></h4>
              <h4 className="text-2xl font-display font-bold text-white tracking-tighter">DE<span className="text-boraine-blue">BEERS</span></h4>
              <h4 className="text-2xl font-display font-bold text-white tracking-tighter">SASOL<span className="text-boraine-blue">ENERGY</span></h4>
              <h4 className="text-2xl font-display font-bold text-white tracking-tighter">STANDARD<span className="text-boraine-blue">BANK</span></h4>
            </div>
          </div>

        </main>

        <footer className="bg-[#010409] py-20 px-8 border-t border-white/10 text-center md:text-left relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
            <div>
              <Logo size="sm" />
              <p className="text-gray-600 text-xs max-w-xs leading-relaxed mt-6 font-mono">
                Boraine Technologies (Pty) Ltd.<br />
                Registered Financial Services Provider.<br />
                Kimberley, Northern Cape, ZA.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-20 text-xs text-gray-500 font-mono">
              <div className="flex flex-col gap-4">
                <span className="text-white font-bold uppercase tracking-widest text-[10px] mb-2">Legal</span>
                <a href="#" className="hover:text-boraine-blue">Privacy Policy</a>
                <a href="#" className="hover:text-boraine-blue">Terms of Service</a>
                <a href="#" className="hover:text-boraine-blue">PAIA Manual</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-white font-bold uppercase tracking-widest text-[10px] mb-2">Connect</span>
                <a href="#" className="hover:text-boraine-blue">LinkedIn</a>
                <a href="#" className="hover:text-boraine-blue">Twitter X</a>
                <a href="#" className="hover:text-boraine-blue">Investor Relations</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-white font-bold uppercase tracking-widest text-[10px] mb-2">Contact</span>
                <a href="mailto:allanboraine@gmail.com" className="hover:text-boraine-blue">allanboraine@gmail.com</a>
                <a href="tel:+27823646800" className="hover:text-boraine-blue">082 364 6800</a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-gray-700 text-[10px] uppercase tracking-widest flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Boraine Technologies.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0 text-boraine-blue/50">
              <ShieldCheck className="w-3 h-3" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </footer>

        {/* Floating Chat Agent */}
        <ChatWidget />

        {/* Booking Interface */}
        <BookingAgent isOpen={showBooking} onClose={() => setShowBooking(false)} />

      </div>
    </>
  );
}

export default App;
