
import React from 'react';
import { Phone, Code2, TrendingUp, Users, Database, Shield } from 'lucide-react';

const services = [
    {
        icon: <Phone className="w-8 h-8 text-boraine-blue" />,
        title: "AI Voice Receptionists",
        description: "Replace missed calls with revenue. Our voice agents handle 1,000+ simultaneous calls, book appointments directly into your calendar, and answer FAQs with human-level fluency.",
        benefit: "Never miss a lead again. 24/7 availability."
    },
    {
        icon: <Code2 className="w-8 h-8 text-boraine-yellow" />,
        title: "Custom AI Software",
        description: "We build bespoke software solutions wrapped in AI. From intelligent CRMs to automated inventory management, our systems learn and adapt to your business needs.",
        benefit: "End-to-end automation of manual workflows."
    },
    {
        icon: <TrendingUp className="w-8 h-8 text-green-500" />,
        title: "Sales & Revenue Agents",
        description: "Deploy autonomous sales agents that qualify leads, follow up on cold outreach, and nurture prospects until they are ready to buy. Your sales team only talks to closable deals.",
        benefit: "Reduce customer acquisition costs by 40%."
    },
    {
        icon: <Users className="w-8 h-8 text-purple-500" />,
        title: "Staff Augmentation",
        description: "Scale your workforce instantly. Our digital workers handle data entry, compliance checking, and customer support at a fraction of the cost of human staff.",
        benefit: "Scale operations without headcount headaches."
    },
    {
        icon: <Database className="w-8 h-8 text-pink-500" />,
        title: "Data Intelligence",
        description: "Turn your raw data into actionable insights. We build dashboards that predict market trends, liquidity shifts, and customer churn before it happens.",
        benefit: "Make decisions based on future data, not past."
    },
    {
        icon: <Shield className="w-8 h-8 text-cyan-500" />,
        title: "Enterprise Security",
        description: "Bank-grade encryption and compliance come standard. We ensure your AI systems are GDPR/POPIA compliant and secure against modern cyber threats.",
        benefit: "Innovation without risk."
    }
];

const AgencyServices: React.FC<{ onBook: () => void }> = ({ onBook }) => {
    return (
        <section id="services" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-20">
                    <span className="text-boraine-blue text-[10px] font-bold uppercase tracking-[0.3em] font-mono">Our Expertise</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-4 mb-6">Engineered for Dominance</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        We don't just build websites. We build <span className="text-white font-medium">autonomous profit centers</span> that work while you sleep.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, idx) => (
                        <div key={idx} className="group p-8 bg-white/[0.03] border border-white/10 hover:border-boraine-blue/40 hover:bg-white/[0.06] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-500 rounded-2xl relative flex flex-col backdrop-blur-sm">
                            <div className="mb-6 p-4 bg-boraine-blue/10 rounded-xl inline-block border border-boraine-blue/20 group-hover:scale-110 transition-transform duration-500">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 font-display">{service.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                {service.description}
                            </p>

                            <div className="mt-auto space-y-6">
                                <div className="pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-gray-500 group-hover:text-boraine-blue transition-colors">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    {service.benefit}
                                </div>
                                <button
                                    onClick={onBook}
                                    className="w-full py-3 bg-white/5 hover:bg-boraine-blue border border-white/10 hover:border-boraine-blue rounded-lg text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                                >
                                    Book Strategy <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default AgencyServices;
