
import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Settings, Award, Check, Lock, ChevronRight, 
  Share2, Scale, Stethoscope, Wrench, HardHat, Home, Leaf, Zap, PlayCircle, Sparkles,
  Upload, Image as ImageIcon, X, User
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PaymentModal from './PaymentModal';
import AuthModal from './AuthModal';
import { generateSaaSContent } from '../services/saasAiService'; // Updated Import
import { supabase } from '../services/supabaseClient';
import { getUserAccess, recordTrialUsage } from '../services/dbService';

// Configuration for the SaaS Tools
const SAAS_TOOLS = [
  {
    id: 'tender',
    name: 'TenderFlow',
    icon: FileText,
    price: 'R499',
    desc: 'Government Tender Sniper & Compliance.',
    longDesc: 'Don\'t just apply—WIN. TenderFlow scans Government Gazettes, auto-completes complex SBD 4, 8, & 9 forms, and flags disqualification risks. Designed for maximum win-rate in the RSA public sector.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-close-up-1731-large.mp4',
    inputLabel1: 'Company Name',
    inputLabel2: 'Target Tender Sector',
    placeholder1: 'Boraine Holdings',
    placeholder2: 'Security Services / Civil Works'
  },
  {
    id: 'social',
    name: 'SocialStrike',
    icon: Share2,
    price: 'R350',
    desc: 'Viral Content & Hook Generator.',
    longDesc: 'Stop guessing. SocialStrike analyzes local trends to generate high-conversion scripts for TikTok, LinkedIn, and Instagram. Get 30 days of viral hooks and captions in 30 seconds. The fastest way to new leads.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-smartphone-40967-large.mp4',
    inputLabel1: 'Niche / Industry',
    inputLabel2: 'Target Platform',
    placeholder1: 'Solar Installation',
    placeholder2: 'TikTok / Facebook Community Groups'
  },
  {
    id: 'legal',
    name: 'LexAutomata',
    icon: Scale,
    price: 'R1,500',
    desc: 'Case summary & precedent search.',
    longDesc: 'A para-legal AI designed for South African High Court jurisdiction. LexAutomata drafts contracts, summarizes case files in seconds, and cross-references Jutastat for binding precedents. Reduce billable research hours by 70%.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-law-student-reading-a-book-in-the-library-40957-large.mp4',
    inputLabel1: 'Case Reference / Title',
    inputLabel2: 'Case Details / Facts',
    placeholder1: 'Smith v. State',
    placeholder2: 'Defendant claims self-defense...'
  },
  {
    id: 'trade',
    name: 'TradeOps',
    icon: Wrench,
    price: 'R499',
    desc: 'Instant Invoicing for Tradesmen.',
    longDesc: 'Turn a site photo into a professional invoice in 30 seconds. TradeOps links to local supplier pricing (Plumblink, Voltex) to calculate markup instantly. Close the deal before you leave the site.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mechanic-checking-a-car-engine-40984-large.mp4',
    inputLabel1: 'Job Title',
    inputLabel2: 'Material/Fault Description',
    placeholder1: 'Geyser Replacement',
    placeholder2: '150L Kwikot, burst valve, ceiling damage...'
  },
  {
    id: 'medical',
    name: 'MediCore',
    icon: Stethoscope,
    price: 'R950',
    desc: 'Clinical transcription & ICD-10 coding.',
    longDesc: 'Focus on the patient, not the paperwork. MediCore listens to consultations, generates SOAP notes automatically, and assigns the correct ICD-10 billing codes to maximize medical aid claim success rates.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-medical-personnel-working-on-a-laptop-40974-large.mp4',
    inputLabel1: 'Diagnosis / Condition',
    inputLabel2: 'Patient Symptoms & Notes',
    placeholder1: 'Acute Sinusitis',
    placeholder2: 'Patient complains of frontal headache...'
  },
  {
    id: 'construct',
    name: 'ConstructOS',
    icon: HardHat,
    price: 'R850',
    desc: 'BOQ calculator & timeline generator.',
    longDesc: 'From blueprint to Bill of Quantities (BOQ). ConstructOS analyzes project scope to predict cement, brick, and labor requirements. It also generates Gantt charts for client project management.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-engineer-looking-at-blueprints-on-a-construction-site-41261-large.mp4',
    inputLabel1: 'Project Name',
    inputLabel2: 'Scope of Work',
    placeholder1: 'Kimberley Mall Extension',
    placeholder2: 'Foundation and brickwork for 200sqm...'
  },
  {
    id: 'estate',
    name: 'PropLogic',
    icon: Home,
    price: 'R650',
    desc: 'Listing copywriter & valuation AI.',
    longDesc: 'Dominate Property24. PropLogic writes emotional, high-converting listing descriptions and performs comparative market analysis (CMA) based on recent deed office transfers in the specific suburb.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-interior-5026-large.mp4',
    inputLabel1: 'Property Address',
    inputLabel2: 'Key Features',
    placeholder1: '12 Diamond Park, Kimberley',
    placeholder2: '3 Bed, 2 Bath, Pool, Solar installed...'
  },
  {
    id: 'landscape',
    name: 'TerraForm',
    icon: Leaf,
    price: 'R450',
    desc: 'AI Landscaping Visualizer.',
    longDesc: 'Upload an image of any site. TerraForm uses computer vision to analyze soil conditions and sun exposure, then generates 3 distinct landscaping options complete with indigenous flower recommendations.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-watering-plants-in-a-greenhouse-42354-large.mp4',
    inputLabel1: 'Site Name',
    inputLabel2: 'Environment/Soil Type',
    placeholder1: 'Casino Garden B',
    placeholder2: 'Full sun, sandy soil, water restrictions...'
  }
];

const SaaSModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tools'>('tools');
  const [activeToolId, setActiveToolId] = useState('tender');
  
  // Modals
  const [showPayment, setShowPayment] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  
  // Supabase State
  const [user, setUser] = useState<any>(null);
  const [unlockedTools, setUnlockedTools] = useState<string[]>([]);
  const [trialsUsed, setTrialsUsed] = useState<string[]>([]);
  
  // Inputs
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generatedDoc, setGeneratedDoc] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize Supabase Listener & Fetch Data
  useEffect(() => {
    let mounted = true;

    // Check active session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.warn("Session check warning:", error.message);
            return;
        }
        if (mounted && data.session?.user) {
          setUser(data.session.user);
          fetchUserData(data.session.user.id);
        }
      } catch (e) {
        console.warn("Supabase connection issue:", e);
      }
    };

    checkSession();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          setUnlockedTools([]);
          setTrialsUsed([]);
        }
      }
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    const accessData = await getUserAccess(userId);
    // Parse the DB rows into our state arrays
    const paid = accessData.filter(x => x.access_type === 'PAID').map(x => x.tool_id);
    const trials = accessData.filter(x => x.access_type === 'TRIAL').map(x => x.tool_id);
    
    setUnlockedTools(paid);
    setTrialsUsed(trials);
  };

  // Get current tool config
  const activeTool = SAAS_TOOLS.find(t => t.id === activeToolId) || SAAS_TOOLS[0];
  const isPro = unlockedTools.includes(activeTool.id);
  const isTrialUsed = trialsUsed.includes(activeTool.id);
  const canGenerate = isPro || !isTrialUsed;
  const isLandscapeTool = activeToolId === 'landscape';

  const handleToolChange = (id: string) => {
    setActiveToolId(id);
    setGeneratedDoc('');
    setInput1('');
    setInput2('');
    setSelectedImage(null);
  };

  const handleUpgrade = () => {
    if (!user) {
        setShowAuth(true);
        return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (user) fetchUserData(user.id);
  };

  const handleAuthSuccess = () => {
    // User is set via the useEffect listener automatically
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    // 1. Check Auth
    if (!user) {
        setShowAuth(true);
        return;
    }

    // 2. Check Permissions
    if (!canGenerate) {
        handleUpgrade();
        return;
    }

    // 3. Validate Inputs
    if (isLandscapeTool && !selectedImage) {
        alert("Please upload a site image for analysis.");
        return;
    }
    if (!isLandscapeTool && (!input1 || !input2)) {
        alert("Please provide required input parameters.");
        return;
    }

    setLoading(true);
    
    // 4. Generate Content (REAL AI)
    const payload = isLandscapeTool 
      ? { title: input1 || "Uploaded Site", details: input2 || "Visual Analysis", image: selectedImage } 
      : { title: input1, details: input2 };

    try {
        const result = await generateSaaSContent(activeToolId, payload);
        setGeneratedDoc(result);
        
        // 5. Record Trial Usage if not Pro
        if (!isPro && !isTrialUsed) {
            await recordTrialUsage(user.id, activeToolId);
            fetchUserData(user.id); // Refresh state
        }
    } catch (e) {
        setGeneratedDoc("Error connecting to neural engine. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-20">
      
      {/* Modals */}
      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        amount={`${activeTool.price}.00`}
        productName={`${activeTool.name} Pro License`}
        toolId={activeTool.id}
        onSuccess={handlePaymentSuccess}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Header for SaaS Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 px-4">
        <div>
           <h2 className="text-white font-display font-bold text-3xl mb-2">Boraine Industry Solutions</h2>
           <p className="text-gray-400 text-sm max-w-md">Proprietary AI engines tailored for high-performance sectors.</p>
        </div>
        <div className="flex flex-col items-end gap-4 mt-4 md:mt-0">
            {/* User Profile Status */}
            {user ? (
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {user.email}
                    <button onClick={() => supabase.auth.signOut()} className="ml-2 text-red-400 hover:text-white">LOGOUT</button>
                </div>
            ) : (
                <button onClick={() => setShowAuth(true)} className="flex items-center gap-2 text-xs font-bold text-boraine-blue hover:text-white transition-colors uppercase tracking-widest">
                    <User className="w-4 h-4" /> Agent Login
                </button>
            )}

            <div className="flex gap-4">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 rounded text-sm transition-colors font-mono ${activeTab === 'dashboard' ? 'bg-boraine-blue text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                    Analytics
                </button>
                <button 
                    onClick={() => setActiveTab('tools')}
                    className={`px-4 py-2 rounded text-sm transition-colors font-mono ${activeTab === 'tools' ? 'bg-boraine-blue text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                    Tool Suite
                </button>
            </div>
        </div>
      </div>

      {/* Main SaaS Interface */}
      <div className="glass-panel rounded-xl overflow-hidden min-h-[700px] flex flex-col md:flex-row shadow-2xl">
        
        {/* Sidebar - Tool Selector */}
        <div className="w-full md:w-72 bg-[#080808] border-r border-boraine-border flex flex-col">
           <div className="p-6 border-b border-white/5">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gradient-to-br from-boraine-blue to-blue-900 rounded-sm flex items-center justify-center">
                 <Zap className="w-5 h-5 text-white fill-current" />
               </div>
               <span className="font-bold text-white tracking-wide text-sm font-display">PROFIT ENGINE</span>
             </div>
           </div>
           
           <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
             {SAAS_TOOLS.map((tool) => {
                const toolIsPro = unlockedTools.includes(tool.id);
                const toolTrialUsed = trialsUsed.includes(tool.id);
                const isLocked = !toolIsPro && toolTrialUsed;

                return (
                    <button 
                        key={tool.id}
                        onClick={() => handleToolChange(tool.id)}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 text-xs transition-all relative ${
                            activeToolId === tool.id 
                            ? 'bg-boraine-blue/10 text-boraine-blue border border-boraine-blue/20' 
                            : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                        }`}
                    >
                        <tool.icon className={`w-4 h-4 ${activeToolId === tool.id ? 'text-boraine-blue' : 'text-gray-600'}`} />
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div className="font-bold">{tool.name}</div>
                                {isLocked && <Lock className="w-3 h-3 text-gray-600" />}
                                {!isLocked && !toolIsPro && activeToolId !== tool.id && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                            </div>
                            <div className="text-[9px] opacity-70 truncate">{tool.desc}</div>
                        </div>
                        {activeToolId === tool.id && <ChevronRight className="w-3 h-3" />}
                    </button>
                );
             })}
           </nav>

           {!isPro && (
             <div className="p-4 bg-gradient-to-t from-black to-transparent">
                <div className="p-4 bg-boraine-blue/10 border border-boraine-blue/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-boraine-blue">
                        <Lock className="w-3 h-3" />
                        <span className="font-bold text-[10px] uppercase">Enterprise Access</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-3">Subscribe to {activeTool.name} for unlimited generation.</p>
                    <button 
                        onClick={handleUpgrade}
                        className="w-full bg-boraine-blue text-white text-[10px] py-2 rounded font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-wider"
                    >
                        Unlock ({activeTool.price}/mo)
                    </button>
                </div>
             </div>
           )}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-boraine-carbon p-0 relative flex flex-col">
            
            {activeTab === 'dashboard' ? (
                <div className="animate-fade-up flex flex-col justify-center items-center h-full text-center p-8">
                     <Award className="w-16 h-16 text-boraine-blue mb-6 opacity-50" />
                     <h3 className="text-2xl font-serif text-white mb-2">Global Usage Statistics</h3>
                     <p className="text-gray-500 text-sm max-w-md">Select a tool from the sidebar to view specific performance metrics and history.</p>
                     
                     <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-2xl">
                        <div className="p-4 bg-white/5 rounded border border-white/5">
                            <div className="text-2xl text-white font-mono">8.4k</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Documents Generated</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded border border-white/5">
                            <div className="text-2xl text-boraine-blue font-mono">1.2s</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Avg Latency</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded border border-white/5">
                            <div className="text-2xl text-white font-mono">99.9%</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Uptime</div>
                        </div>
                     </div>
                </div>
            ) : (
                <div className="animate-fade-up h-full flex flex-col w-full relative">
                    {/* Tool Header Video Banner */}
                    <div className="relative w-full h-48 overflow-hidden group">
                        <video 
                            key={activeTool.videoUrl} // Key forces reload on change
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
                        >
                            <source src={activeTool.videoUrl} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-boraine-carbon via-boraine-carbon/50 to-transparent"></div>
                        <div className="absolute bottom-6 left-8 z-10">
                             <div className="flex items-center gap-3 mb-1">
                                <activeTool.icon className="w-6 h-6 text-boraine-blue drop-shadow-lg" />
                                <h3 className="text-3xl font-display font-bold text-white drop-shadow-md">{activeTool.name}</h3>
                             </div>
                             <p className="text-gray-300 text-sm max-w-xl font-light">{activeTool.desc}</p>
                        </div>
                        <div className="absolute top-6 right-8 z-10 hidden md:block">
                            <div className="text-right">
                                <div className="text-2xl text-boraine-blue font-bold drop-shadow-md">{activeTool.price}<span className="text-xs text-white/70 font-normal">/mo</span></div>
                                <div className="text-[10px] text-white/60 uppercase tracking-widest">Enterprise License</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 relative">
                        {/* Long Description Section - Always Visible */}
                        <div className="mb-8 p-4 bg-white/5 border-l-2 border-boraine-blue rounded-r-md">
                            <h4 className="text-xs text-boraine-blue font-bold uppercase tracking-widest mb-2">Capabilities</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{activeTool.longDesc}</p>
                        </div>

                        {/* Interactive Area with Conditional Lock */}
                        <div className="relative">
                            
                            <div className={`${!canGenerate ? 'filter blur-sm select-none pointer-events-none opacity-40 transition-all duration-700' : ''}`}>
                                
                                {/* DYNAMIC INPUT SECTION */}
                                {isLandscapeTool ? (
                                    <div className="mb-6">
                                        <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Site Visual Data</div>
                                        <div 
                                            className="w-full h-48 border-2 border-dashed border-white/20 rounded-lg bg-black/50 flex flex-col items-center justify-center cursor-pointer hover:border-boraine-blue hover:bg-boraine-blue/5 transition-all relative overflow-hidden group"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                            
                                            {selectedImage ? (
                                                <>
                                                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                         <div className="bg-black/80 p-3 rounded-full border border-white/20 backdrop-blur-md">
                                                            <ImageIcon className="w-6 h-6 text-boraine-blue" />
                                                         </div>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                                                        className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-red-500 text-white transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="text-center p-4">
                                                    <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3 group-hover:text-boraine-blue transition-colors" />
                                                    <p className="text-gray-400 text-sm font-bold group-hover:text-white">Upload Site Photo</p>
                                                    <p className="text-gray-600 text-xs mt-1">Supports JPG, PNG (Max 10MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* STANDARD TEXT INPUTS */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">{activeTool.inputLabel1}</label>
                                            <input 
                                                type="text" 
                                                placeholder={activeTool.placeholder1}
                                                className="w-full bg-black/50 border border-white/10 p-4 rounded text-white text-sm focus:border-boraine-blue outline-none transition-colors"
                                                value={input1}
                                                onChange={(e) => setInput1(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">{activeTool.inputLabel2}</label>
                                            <input 
                                                type="text" 
                                                placeholder={activeTool.placeholder2}
                                                className="w-full bg-black/50 border border-white/10 p-4 rounded text-white text-sm focus:border-boraine-blue outline-none transition-colors"
                                                value={input2}
                                                onChange={(e) => setInput2(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Output Terminal */}
                                <div className="bg-black/40 rounded-lg p-6 mb-6 border border-white/5 font-mono text-xs text-gray-400 min-h-[150px] whitespace-pre-wrap shadow-inner relative">
                                    {loading && (
                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                                            <div className="flex items-center gap-3 text-boraine-blue">
                                                <div className="w-2 h-2 bg-boraine-blue rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-boraine-blue rounded-full animate-bounce delay-100"></div>
                                                <div className="w-2 h-2 bg-boraine-blue rounded-full animate-bounce delay-200"></div>
                                                <span className="uppercase tracking-widest font-bold">
                                                    {isLandscapeTool ? 'Analyzing Terrain & Flora...' : 'Processing Neural Task...'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {generatedDoc ? (
                                       <ReactMarkdown 
                                          className="prose prose-invert prose-sm max-w-none prose-p:text-gray-400 prose-headings:text-boraine-blue prose-strong:text-white"
                                       >
                                          {generatedDoc}
                                       </ReactMarkdown>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center opacity-30 pt-4">
                                            <PlayCircle className="w-8 h-8 mb-2" />
                                            <p>Ready to Execute</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center gap-4">
                                    {/* Usage Indicator */}
                                    <div className="text-xs font-medium">
                                        {isPro ? (
                                             <span className="text-boraine-blue flex items-center gap-2">
                                                 <Award className="w-4 h-4" /> Pro License Active
                                             </span>
                                        ) : (
                                            <span className="text-green-400 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" /> 
                                                {user ? '1 Free Trial Available' : 'Login to Claim Trial'}
                                            </span>
                                        )}
                                    </div>

                                    <button 
                                        onClick={handleGenerate}
                                        className={`px-10 py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-lg ${canGenerate ? 'bg-white text-black hover:bg-boraine-blue hover:text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        {loading ? 'Processing...' : (isPro ? 'Execute Protocol' : 'Run Free Trial')}
                                    </button>
                                </div>
                            </div>

                            {/* Lock Overlay - Only appears if NOT Pro and Trial USED */}
                            {!canGenerate && (
                                <div className="absolute inset-0 z-10 flex items-start justify-center pt-10">
                                    <div className="text-center p-8 border border-boraine-blue/30 bg-black/90 rounded-xl shadow-2xl max-w-sm">
                                        <div className="w-16 h-16 bg-boraine-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Lock className="w-8 h-8 text-boraine-blue" />
                                        </div>
                                        <h4 className="text-xl text-white font-serif mb-2">Free Trial Consumed</h4>
                                        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                            You have exhausted the trial credits for <strong>{activeTool.name}</strong>. Purchase a commercial license to continue generating revenue.
                                        </p>
                                        <button onClick={handleUpgrade} className="w-full bg-boraine-blue text-white px-6 py-4 rounded-sm font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs">
                                            Purchase License ({activeTool.price})
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default SaaSModule;
