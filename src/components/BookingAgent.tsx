
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ChevronRight, CheckCircle, Calendar, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'agent' | 'user';
    options?: string[];
    type?: 'text' | 'options' | 'input' | 'calendar';
}

interface BookingAgentProps {
    isOpen: boolean;
    onClose: () => void;
}

const BookingAgent: React.FC<BookingAgentProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState<any>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const steps = [
        {
            id: 'welcome',
            text: "Greetings. I am Nexus, the intake coordinator for Boraine Tech. I'll help you secure a consultation with our senior architects. First, what is your name?",
            type: 'input',
            field: 'name'
        },
        {
            id: 'company',
            text: "Pleasure to meet you, {name}. Which organization do you represent?",
            type: 'input',
            field: 'company'
        },
        {
            id: 'revenue',
            text: "To ensure we are the right fit, what is your organization's estimated annual revenue bracket?",
            type: 'options',
            options: ['< R5M', 'R5M - R50M', 'R50M - R250M', 'R250M+'],
            field: 'revenue'
        },
        {
            id: 'goal',
            text: "Understood. What is your primary objective for deploying AI?",
            type: 'options',
            options: ['Profit Automation', 'Workflow Efficiency', 'Customer Experience', 'New Product Dev'],
            field: 'goal'
        },
        {
            id: 'calendar',
            text: "Excellent. Our team specializes in {goal}. Please select a preferred time for a 30-minute strategic audit.",
            type: 'calendar',
            field: 'slot'
        },
        {
            id: 'email',
            text: "Final step: Please provide your business email address for the calendar invite.",
            type: 'input',
            field: 'email'
        },
        {
            id: 'finish',
            text: "Protocol initialized. You will receive a confirmation shortly. We look forward to engineering your profit.",
            type: 'text',
            field: 'done'
        }
    ];

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Start conversation
            pushMessage(steps[0]);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const pushMessage = (stepConfig: any, replacements?: any) => {
        let text = stepConfig.text;
        if (replacements) {
            Object.keys(replacements).forEach(key => {
                text = text.replace(`{${key}}`, replacements[key]);
            });
        }

        const newMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'agent',
            options: stepConfig.options,
            type: stepConfig.type
        };
        setMessages(prev => [...prev, newMsg]);
    };

    const handleInput = (value: string) => {
        if (!value.trim()) return;

        // Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            text: value,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Save Data
        const currentStepConfig = steps[step];
        const updatedData = { ...userData, [currentStepConfig.field!]: value };
        setUserData(updatedData);

        // Advance
        const nextStepIdx = step + 1;
        if (nextStepIdx < steps.length) {
            setStep(nextStepIdx);
            setTimeout(() => {
                pushMessage(steps[nextStepIdx], updatedData);
            }, 600);
        } else {
            setTimeout(onClose, 3000);
        }
    };

    const handleOptionClick = (option: string) => {
        handleInput(option);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-[#050505] border border-boraine-blue/30 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col h-[85vh] max-h-[600px] relative">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-boraine-blue/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                            <h3 className="text-white font-display font-bold tracking-wide">INTAKE PROTOCOL</h3>
                            <p className="text-[10px] text-boraine-blue uppercase tracking-widest">Secure Line</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${msg.sender === 'user'
                                ? 'bg-boraine-blue text-white rounded-br-none'
                                : 'bg-white/5 text-gray-300 border border-white/10 rounded-bl-none'
                                }`}>
                                {msg.text}
                            </div>

                            {msg.sender === 'agent' && msg.type === 'options' && (
                                <div className="mt-3 grid grid-cols-1 gap-2 w-full max-w-[85%]">
                                    {msg.options?.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleOptionClick(opt)}
                                            className="px-4 py-3 text-xs bg-white/5 hover:bg-boraine-blue/20 hover:border-boraine-blue/50 border border-white/10 rounded-lg text-left text-gray-400 hover:text-white transition-all flex items-center justify-between group"
                                        >
                                            {opt}
                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Mock Calendar */}
                            {msg.sender === 'agent' && msg.type === 'calendar' && (
                                <div className="mt-3 w-full max-w-[85%] bg-white/5 border border-white/10 rounded-xl p-4">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> Available Slots
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Tomorrow, 10:00 AM', 'Tomorrow, 02:00 PM', 'Wed, 09:00 AM', 'Wed, 11:30 AM'].map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => handleOptionClick(slot)}
                                                className="p-2 text-xs bg-black border border-white/10 rounded hover:border-boraine-blue hover:text-boraine-blue transition-colors text-center"
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-black/50">
                    {steps[step]?.type === 'input' && (
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleInput(inputValue)}
                                placeholder="Type your response..."
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-4 text-sm text-white focus:outline-none focus:border-boraine-blue/50 transition-colors relative z-[2001] pointer-events-auto shadow-inner"
                                autoFocus
                            />
                            <button
                                onClick={() => handleInput(inputValue)}
                                disabled={!inputValue.trim()}
                                className="absolute right-2 top-2 p-2 bg-boraine-blue rounded-full text-white hover:bg-white hover:text-boraine-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {steps[step]?.type !== 'input' && step < steps.length - 1 && (
                        <div className="text-center text-xs text-gray-600 font-mono py-3 flex items-center justify-center gap-2">
                            <Sparkles className="w-3 h-3 text-boraine-yellow" /> Waiting for selection...
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default BookingAgent;
