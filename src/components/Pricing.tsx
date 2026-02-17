
import React from 'react';
import { BORAINE_PRICING } from '../constants';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const scrollToTerminal = () => {
    const terminal = document.getElementById('terminal-section');
    if (terminal) {
      terminal.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = document.getElementById('terminal-input');
        if (input) {
          input.focus();
        }
      }, 800);
    }
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Investment Strategy</h2>
        <p className="text-gray-500 max-w-2xl mx-auto font-light">
          We do not sell costs. We sell compounded returns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BORAINE_PRICING.map((tier) => (
          <div 
            key={tier.name}
            className={`relative p-10 flex flex-col ${
              tier.recommended 
                ? 'bg-gradient-to-b from-boraine-blue/10 to-transparent border border-boraine-blue/40 shadow-2xl shadow-boraine-blue/10' 
                : 'bg-transparent border border-white/10 hover:border-white/20'
            } transition-all duration-300 group`}
          >
            {tier.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-boraine-blue text-white text-[10px] font-bold px-4 py-1 uppercase tracking-[0.2em] shadow-lg font-mono">
                Recommended
              </div>
            )}
            
            <h3 className="text-2xl font-display font-bold text-white mb-2">{tier.name}</h3>
            <p className="text-gray-500 text-sm mb-8 h-10 leading-relaxed font-light">{tier.description}</p>
            
            <div className="mb-6 pb-6 border-b border-white/10">
              <div className="text-3xl font-display font-bold text-white">{tier.setupFee}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-mono">Initial Deployment</div>
            </div>
            
            <div className="mb-8">
              <div className="text-xl font-medium text-boraine-blue">{tier.retainer}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-mono">Monthly Management</div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-boraine-yellow shrink-0 mt-0.5" />
                  <span className="font-light">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={scrollToTerminal}
              className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 font-mono ${
                  tier.recommended 
                  ? 'bg-boraine-blue text-white hover:bg-white hover:text-black' 
                  : 'bg-white/5 text-white hover:bg-white hover:text-black'
              }`}
            >
              Initiate
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
