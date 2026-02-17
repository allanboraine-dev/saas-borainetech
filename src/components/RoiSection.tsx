
import React from 'react';
import { ArrowUpRight, DollarSign, Clock } from 'lucide-react';

const RoiSection: React.FC = () => {
    return (
        <section className="py-24 bg-boraine-panel border-y border-white/5 relative">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Text Content */}
                <div>
                    <span className="text-boraine-yellow text-[10px] font-bold uppercase tracking-[0.3em] font-mono mb-4 block">The Profit Protocol</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 leading-tight">
                        Stop Renting Talent.<br />
                        <span className="text-boraine-blue">Deploy It.</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                        Traditional employees are expensive, require training, and sleep 8 hours a day.
                        Boraine Tech agents operate 24/7/365 with zero downtime, instant scalability, and perfect recall.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-green-500/10 rounded-lg text-green-500">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Slash Operational Costs</h4>
                                <p className="text-sm text-gray-500">Reduce reception and support overhead by up to 70% within the first quarter of deployment.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-boraine-blue/10 rounded-lg text-boraine-blue">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Explode Revenue Velocity</h4>
                                <p className="text-sm text-gray-500">Our sales agents engage leads within 5 seconds. Speed to lead is the #1 factor in conversion.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Infinite Scalability</h4>
                                <p className="text-sm text-gray-500">Launch 1 agent or 1,000 instantly. Handle seasonal spikes without hiring or firing.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Visual/Stats */}
                <div className="relative">
                    <div className="absolute inset-0 bg-boraine-blue/20 blur-[100px] rounded-full"></div>
                    <div className="relative z-10 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-8">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Average Client ROI</p>
                                <h3 className="text-6xl font-display font-bold text-white tracking-tight">342%</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-green-500 font-mono text-sm flex items-center gap-1">
                                    <ArrowUpRight className="w-4 h-4" /> Year One
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Response Time</span>
                                <span className="text-white font-mono font-bold"><span className="text-red-500 line-through text-xs mr-2">2h</span> 0.2s</span>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Cost Per Interaction</span>
                                <span className="text-white font-mono font-bold"><span className="text-red-500 line-through text-xs mr-2">R45.00</span> R0.50</span>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Uptime</span>
                                <span className="text-boraine-blue font-mono font-bold">100%</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default RoiSection;
