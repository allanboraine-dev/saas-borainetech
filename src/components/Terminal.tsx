
import React, { useState, useEffect, useRef } from 'react';
import { Send, Activity, Search, FileDown, FileText, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from "jspdf";
import { Message, MessageType, ScoutState } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { URL_SCAN_LOGS, INDUSTRY_SCAN_LOGS } from '../constants';

const Terminal: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      type: MessageType.AI,
      content: "Boraine Intelligence Node Online. \n\nEnter a **Target URL** for digital infrastructure audit.\nOR\nEnter an **Industry Sector** (e.g., 'Mining Logistics') for competitor reconnaissance.",
      timestamp: Date.now()
    }
  ]);
  const messagesRef = useRef(messages);

  const [input, setInput] = useState('');
  const [scoutState, setScoutState] = useState<ScoutState>({
    isScanning: false,
    scanProgress: 0,
    targetUrl: null
  });
  const [reportReady, setReportReady] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, scoutState.scanProgress, isTyping, reportReady]);

  const generatePDF = () => {
    // PDF Logic remains largely the same, just updated colors
    try {
      if (!lastAnalysis || !scoutState.targetUrl) {
        alert("Report data incomplete. Please wait for analysis to finish.");
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxLineWidth = pageWidth - margin * 2;
      const lineHeight = 6; 

      // Cover Page
      doc.setFillColor(2, 6, 23); // Dark Blue/Black
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      doc.setTextColor(59, 130, 246); // Tech Blue
      doc.setFont("helvetica", "bold");
      doc.setFontSize(40);
      doc.text("BORAINE", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("courier", "normal");
      doc.setFontSize(12);
      doc.text("INTELLIGENCE SYSTEMS", pageWidth / 2, pageHeight / 2 - 5, { align: "center" });

      doc.setDrawColor(59, 130, 246);
      doc.line(pageWidth / 2 - 30, pageHeight / 2 + 5, pageWidth / 2 + 30, pageHeight / 2 + 5);

      doc.setFontSize(16);
      doc.setTextColor(200, 200, 200);
      doc.text(scoutState.targetUrl.includes('.') ? "DIGITAL INFRASTRUCTURE AUDIT" : "SECTOR INTELLIGENCE REPORT", pageWidth / 2, pageHeight / 2 + 30, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text(`TARGET: ${scoutState.targetUrl.toUpperCase()}`, pageWidth / 2, pageHeight / 2 + 45, { align: "center" });
      
      doc.addPage();
      
      // Header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 30, 'F');
      doc.setTextColor(59, 130, 246); 
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(`BORAINE // EXEC SUMMARY`, margin, 20);

      doc.setTextColor(0, 0, 0);
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      
      const cleanText = lastAnalysis.replace(/\*\*/g, "").replace(/###/g, "").replace(/##/g, "").replace(/>/g, "");
      const lines = doc.splitTextToSize(cleanText, maxLineWidth);
      let cursorY = 45;

      lines.forEach((line: string) => {
          if (cursorY + lineHeight > pageHeight - 20) {
              doc.addPage();
              cursorY = 30;
          }
          doc.text(line, margin, cursorY);
          cursorY += lineHeight;
      });

      doc.save(`Boraine_Report_${scoutState.targetUrl?.replace(/[^a-z0-9]/gi, '_') || 'Analysis'}.pdf`);
    } catch (e) {
      console.error(e);
      alert("System Error: Could not generate PDF.");
    }
  };

  const handleScanSimulation = async (inputStr: string) => {
    setScoutState(prev => ({ ...prev, isScanning: true, targetUrl: inputStr }));
    setReportReady(false);
    setLastAnalysis('');
    
    const isUrl = inputStr.includes('.') && !inputStr.includes(' ');
    const LOGS = isUrl ? URL_SCAN_LOGS : INDUSTRY_SCAN_LOGS;
    
    for (let i = 0; i < LOGS.length; i++) {
      // PRODUCTION POLISH: Reduced delay from 300 to 150 for faster UX
      await new Promise(r => setTimeout(r, 150));
      setMessages(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          type: MessageType.SYSTEM,
          content: `> ${LOGS[i]}`,
          timestamp: Date.now()
        }
      ]);
      setScoutState(prev => ({ ...prev, scanProgress: ((i + 1) / LOGS.length) * 100 }));
    }

    setScoutState(prev => ({ ...prev, isScanning: false }));
    const promptPrefix = isUrl 
      ? `Conduct a deep forensic audit of the digital footprint for URL: ${inputStr}.` 
      : `Search for '${inputStr}' businesses in South Africa. Conduct a sector-wide gap analysis.`;

    await processGeminiResponse(`${promptPrefix} IDENTIFY LOST REVENUE DUE TO HUMAN LIMITATIONS. AGGRESSIVELY SELL THE 'GROWTH TIER' (AI VOICE AGENT). STRUCTURE AS A FORMAL REPORT: 1. EXECUTIVE SUMMARY, 2. THREAT DETECTION, 3. BORAINE SOLUTION.`, inputStr);
  };

  const processGeminiResponse = async (userMsg: string, specificTarget?: string) => {
    setIsTyping(true);
    const response = await sendMessageToGemini(messagesRef.current, userMsg);
    setIsTyping(false);

    const effectiveTarget = specificTarget || scoutState.targetUrl;
    if (!reportReady && effectiveTarget) {
        setLastAnalysis(response);
        setReportReady(true);
        if (specificTarget && !scoutState.targetUrl) {
            setScoutState(prev => ({ ...prev, targetUrl: specificTarget }));
        }
    }

    setMessages(prev => [
      ...prev,
      {
        id: `ai-${Date.now()}`,
        type: MessageType.AI,
        content: response,
        timestamp: Date.now()
      }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsgText = input;
    setInput('');

    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        type: MessageType.USER,
        content: userMsgText,
        timestamp: Date.now()
      }
    ]);

    if (!scoutState.targetUrl) {
      await handleScanSimulation(userMsgText);
    } else {
      await processGeminiResponse(userMsgText);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] glass-panel rounded-lg shadow-[0_0_50px_rgba(59,130,246,0.1)] flex flex-col overflow-hidden relative font-sans transition-all duration-500">
      
      {/* Terminal Header */}
      <div className="bg-boraine-panel px-6 py-4 flex items-center justify-between border-b border-boraine-blue/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-boraine-blue" />
          <span className="text-xs font-bold text-gray-400 tracking-widest uppercase font-mono">Boraine Intelligence Node v5.0</span>
        </div>
        <div className="flex items-center gap-4">
            {reportReady && (
              <button 
                onClick={generatePDF}
                className="flex items-center gap-2 bg-boraine-blue text-white px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase hover:bg-white hover:text-black transition-all animate-fade-up shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                <Download className="w-3 h-3" />
                Download Report
              </button>
            )}
            {!reportReady && (
                <span className="text-[10px] text-boraine-yellow uppercase tracking-widest font-bold flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-boraine-yellow animate-pulse"></span>
                    Secure Uplink
                </span>
            )}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-hide cursor-text bg-boraine-bg/90"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.type === MessageType.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-4 text-sm ${
                msg.type === MessageType.USER 
                  ? 'bg-boraine-blue/10 border border-boraine-blue/30 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                  : msg.type === MessageType.SYSTEM
                  ? 'text-boraine-blue/80 font-xs font-mono py-1'
                  : 'text-gray-300 border-l-2 border-boraine-yellow pl-4'
              }`}
            >
              {msg.type === MessageType.AI && (
                <span className="block text-[10px] text-boraine-yellow mb-2 tracking-wider uppercase font-bold font-mono">Consultant AI</span>
              )}
              {msg.type === MessageType.AI ? (
                <ReactMarkdown 
                  className="prose prose-invert prose-sm max-w-none prose-p:text-gray-300 prose-p:font-light prose-headings:text-white prose-strong:text-white prose-a:text-boraine-blue"
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        
        {reportReady && !isTyping && (
          <div className="flex justify-start pb-6 pt-2 animate-fade-up">
             <div className="w-full sm:w-auto bg-gradient-to-r from-boraine-panel to-black border border-boraine-blue/30 rounded p-6 flex flex-col sm:flex-row items-center gap-6 shadow-2xl cursor-pointer group hover:border-boraine-blue/60 transition-colors" onClick={generatePDF}>
                <div className="bg-boraine-blue/10 p-4 rounded-full border border-boraine-blue/20 group-hover:bg-boraine-blue group-hover:text-white transition-colors duration-300">
                  <FileText className="w-6 h-6 text-boraine-blue group-hover:text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-white font-display text-lg tracking-wide group-hover:text-boraine-blue transition-colors">Analysis Complete</h4>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1 group-hover:text-gray-300">
                    Intelligence Dossier: <span className="text-boraine-yellow">{scoutState.targetUrl?.toUpperCase()}</span>
                  </p>
                </div>
                <button 
                  className="mt-2 sm:mt-0 flex items-center gap-2 bg-boraine-blue text-white px-8 py-3 rounded-sm font-bold uppercase hover:bg-white hover:text-black transition-all shadow-lg text-xs tracking-widest hover:scale-105"
                >
                  <FileDown className="w-4 h-4" />
                  Download PDF
                </button>
             </div>
          </div>
        )}

        {isTyping && (
           <div className="flex justify-start">
             <div className="flex items-center gap-2 text-boraine-blue text-xs uppercase tracking-widest font-mono">
                <span className="w-1 h-1 bg-boraine-blue rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-boraine-blue rounded-full animate-bounce delay-100"></span>
                <span className="w-1 h-1 bg-boraine-blue rounded-full animate-bounce delay-200"></span>
                Processing Neural Stream
             </div>
           </div>
        )}

        {!scoutState.targetUrl && messages.length === 1 && (
          <div 
            className="mt-12 border border-dashed border-gray-700 p-8 rounded text-center opacity-40 hover:opacity-100 hover:border-boraine-blue hover:text-boraine-blue cursor-pointer transition-all duration-500"
          >
            <Search className="w-6 h-6 mx-auto mb-4" />
            <p className="text-sm font-light tracking-wide font-mono">Enter Business URL or Sector to begin audit.</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-boraine-panel border-t border-boraine-blue/20">
        <div className="flex items-center gap-4">
          <span className="text-boraine-blue text-xl font-mono">›</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={scoutState.targetUrl ? "Command the agent..." : "Initialize audit (e.g., 'Logistics Sector' or 'company.co.za')..."}
            className="flex-1 w-full bg-transparent border-none outline-none text-gray-200 placeholder-gray-600 font-mono text-sm focus:ring-0 tracking-wide"
            autoFocus
            disabled={scoutState.isScanning}
          />
          <button 
            onClick={handleSend}
            disabled={scoutState.isScanning || !input.trim()}
            className="p-3 bg-white/5 rounded-full text-boraine-blue hover:bg-boraine-blue hover:text-white transition-all disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {scoutState.isScanning && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 backdrop-blur-md">
          <Activity className="w-12 h-12 text-boraine-blue animate-pulse mb-6" />
          <h3 className="text-white font-display text-2xl mb-2">Analyzing Digital Footprint</h3>
          <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-8 font-mono">Please Wait</p>
          
          <div className="w-64 h-[1px] bg-gray-800 overflow-hidden relative">
            <div 
              className="absolute top-0 bottom-0 left-0 bg-boraine-blue transition-all duration-300 ease-out"
              style={{ width: `${scoutState.scanProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terminal;
