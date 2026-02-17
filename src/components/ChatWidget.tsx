
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Calendar, CheckCircle } from 'lucide-react';
import { sendSupportMessage, ChatMessage } from '../services/supportAgent';
import ReactMarkdown from 'react-markdown';

interface ChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
  initialContext?: string | null;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen: externalIsOpen, onToggle, initialContext }) => {
  // Internal state fallback if not controlled (backward compatibility)
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const toggleOpen = () => {
    if (onToggle) onToggle();
    else setInternalIsOpen(!isOpen);
  };

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Greetings. I am Nexus, Boraine Tech's automated architect. How can I assist you with your revenue infrastructure today?" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle Initial Context (e.g., "Book Strategy" button clicked)
  useEffect(() => {
    if (initialContext && isOpen) {
      // Send the context as a user message automatically
      handleSend(initialContext);
    }
  }, [initialContext, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    if (!textOverride) setInput('');

    // Add user message
    const newHistory = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newHistory);
    setIsTyping(true);

    // Get AI response
    const responseText = await sendSupportMessage(messages, textToSend);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // Render Tool Logic
  const renderMessageContent = (text: string) => {
    // Check for [ACTION:CALENDAR]
    if (text.includes('[ACTION:CALENDAR]')) {
      const cleanText = text.replace('[ACTION:CALENDAR]', '').trim();
      return (
        <div>
          <ReactMarkdown className="prose prose-invert prose-sm max-w-none prose-p:leading-tight mb-4">
            {cleanText}
          </ReactMarkdown>
          {/* TOOL: Calendar Widget */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2">
            <div className="text-xs text-boraine-yellow uppercase tracking-widest mb-3 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Secure Slot Selection
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Tomorrow, 10:00 AM', 'Tomorrow, 02:00 PM', 'Thu, 09:00 AM', 'Thu, 04:30 PM'].map(slot => (
                <button
                  key={slot}
                  onClick={() => handleSend(`I confirm the slot: ${slot}`)}
                  className="p-2 text-[10px] bg-black border border-white/10 rounded hover:border-boraine-blue hover:text-boraine-blue transition-colors text-center"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <ReactMarkdown className="prose prose-invert prose-sm max-w-none prose-p:leading-tight">
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end">

      {/* Chat Window */}
      <div
        className={`mb-4 w-[350px] md:w-[400px] h-[600px] bg-[#020617]/95 backdrop-blur-xl border border-boraine-blue/30 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
          }`}
      >
        {/* Header */}
        <div className="p-4 bg-boraine-blue/10 border-b border-boraine-blue/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-boraine-blue/20 flex items-center justify-center border border-boraine-blue/50">
                <Bot className="w-5 h-5 text-boraine-blue" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
            </div>
            <div>
              <h3 className="text-white font-display font-bold text-sm">Nexus Agent</h3>
              <p className="text-[10px] text-boraine-blue uppercase tracking-wider">Growth Architect</p>
            </div>
          </div>
          <button onClick={toggleOpen} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 text-sm rounded-lg ${msg.role === 'user'
                      ? 'bg-boraine-blue text-white rounded-br-none'
                      : 'bg-white/10 text-gray-200 border border-white/5 rounded-bl-none'
                    }`}
                >
                  {msg.role === 'model' ? renderMessageContent(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-3 rounded-lg rounded-bl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-boraine-blue rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-boraine-blue rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-boraine-blue rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-black/40 relative z-50 pointer-events-auto">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your requirements..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-boraine-blue/50 transition-colors placeholder:text-gray-500 relative z-[1001] pointer-events-auto"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="absolute right-2 top-2 p-1.5 bg-boraine-blue rounded-full text-white hover:bg-white hover:text-boraine-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[9px] text-gray-600 font-mono flex items-center justify-center gap-1">
              <Sparkles className="w-2 h-2" /> Powered by Gemini Neural Engine
            </span>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleOpen}
        className={`group relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-boraine-blue'
          }`}
      >
        {/* Ping Animation */}
        {!isOpen && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-boraine-blue opacity-75 animate-ping"></span>
        )}

        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 text-white" />
        )}
      </button>

    </div>
  );
};

export default ChatWidget;
