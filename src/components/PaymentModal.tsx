
import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { recordPurchase } from '../services/dbService';

// Augment Window interface for Yoco
declare global {
  interface Window {
    YocoSDK: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string; // e.g. "R499"
  productName: string;
  toolId: string;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, productName, toolId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  // Yoco State
  const [yocoInstance, setYocoInstance] = useState<any>(null);
  const [sdkError, setSdkError] = useState('');

  // 1. YOCO CONFIGURATION
  // Safely check for Environment Variable, fall back to Test Key if missing
  const getYocoKey = () => {
    try {
      // Check for various prefix standards (Vite, CRA, Node)
      return process.env.REACT_APP_YOCO_PUBLIC_KEY || 
             process.env.VITE_YOCO_PUBLIC_KEY || 
             'pk_test_ed3c54a6gOol69QA7f45';
    } catch {
      return 'pk_test_ed3c54a6gOol69QA7f45';
    }
  };
  
  const YOCO_PUBLIC_KEY = getYocoKey();

  // 2. Fetch User Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setEmail(session.user.email || '');
        setUserId(session.user.id);
      }
    });
  }, [isOpen]);

  // 3. Initialize Yoco SDK when modal opens
  useEffect(() => {
    if (isOpen && step === 'details' && !yocoInstance) {
      if (window.YocoSDK) {
        try {
          const yoco = new window.YocoSDK({
            publicKey: YOCO_PUBLIC_KEY
          });
          
          // Calculate cents from string (e.g., "R499" -> 49900)
          const amountInCents = parseFloat(amount.replace(/[^0-9.]/g, '')) * 100;

          // Render the Inline Form
          const inline = yoco.inline({
            layout: 'basic',
            amountInCents: amountInCents,
            currency: 'ZAR'
          });
          
          // Mount to the ID defined in the JSX below
          inline.mount('#yoco-container');
          setYocoInstance(inline);

        } catch (err) {
          console.error("Yoco Init Error:", err);
          setSdkError("Could not initialize payment gateway.");
        }
      } else {
        setSdkError("Yoco SDK not loaded. Check internet connection.");
      }
    }
  }, [isOpen, step, amount]); // Re-run if modal opens/closes or amount changes

  // Reset instance on close to prevent duplication issues
  useEffect(() => {
    if (!isOpen) {
       setYocoInstance(null);
       setStep('details');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
        alert("Session expired. Please login again.");
        return;
    }
    if (!yocoInstance) return;

    setLoading(true);
    setStep('processing');
    
    // 4. Tokenize Card via Yoco
    yocoInstance.charge((result: any) => {
      
      if (result.error) {
        setLoading(false);
        setStep('details');
        alert("Payment Failed: " + result.error.message);
      } else {
        // Success! We have a token: result.token
        // In a real production app, you would send `result.token` to your backend 
        // (Supabase Edge Function) to perform the actual charge.
        
        console.log("Yoco Token Received:", result.token);
        finalizePurchase(result.token);
      }
    });
  };

  const finalizePurchase = async (token: string) => {
     // Simulate Backend Verification Delay
     setTimeout(async () => {
        try {
            if (userId) {
                // Record the "Paid" status in Supabase
                await recordPurchase(userId, toolId);
            }
            setLoading(false);
            setStep('success');
            
            // Close after 2 seconds
            setTimeout(() => {
                onSuccess();
                setTimeout(onClose, 2000);
            }, 1500);
        } catch (e) {
            alert("Payment authorized, but database update failed. Please contact support.");
            setStep('details');
            setLoading(false);
        }
     }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white text-black rounded-lg shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="https://www.yoco.com/assets/images/logo/yoco-logo-blue.svg" alt="Yoco" className="h-5" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-l pl-2 ml-2">Secure Checkout</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'details' && (
            <form onSubmit={handlePay} className="space-y-6">
               <div className="text-center mb-6">
                 <h3 className="text-xl font-serif font-bold mb-1">Boraine Tech</h3>
                 <p className="text-sm text-gray-500">Purchasing: <span className="font-bold">{productName}</span></p>
                 <div className="mt-4 text-3xl font-bold text-boraine-blue">{amount}</div>
               </div>

               {sdkError && (
                 <div className="bg-red-50 text-red-600 p-3 rounded text-sm flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4" /> {sdkError}
                 </div>
               )}

               <div className="space-y-4">
                 {/* Email Display */}
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Receipt Email</label>
                   <input 
                    type="email" 
                    value={email}
                    readOnly
                    className="w-full bg-gray-100 border border-transparent rounded p-3 text-sm text-gray-600 outline-none cursor-not-allowed"
                   />
                 </div>

                 {/* YOCO CARD INPUT CONTAINER */}
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Card Details</label>
                   {/* The SDK mounts the secure iframe here */}
                   <div id="yoco-container" className="min-h-[40px] border border-gray-200 rounded p-1"></div>
                   <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                     <Lock className="w-3 h-3" /> Encrypted by Yoco Payments
                   </div>
                 </div>
               </div>

               <button 
                type="submit"
                className="w-full bg-boraine-blue hover:bg-blue-600 text-white font-bold py-4 rounded shadow-lg transition-colors flex items-center justify-center gap-2"
                disabled={!!sdkError || loading}
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : `Pay ${amount}`}
               </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-boraine-blue animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-bold">Processing Transaction...</h3>
              <p className="text-gray-500 text-sm mt-2">Connecting to Yoco Gateway</p>
            </div>
          )}

          {step === 'success' && (
             <div className="text-center py-12">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-xl font-bold text-gray-900">Payment Successful</h3>
               <p className="text-gray-500 text-sm mt-2">Your license key has been generated.</p>
             </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center border-t flex justify-center items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 grayscale opacity-50" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-3 grayscale opacity-50" alt="Visa" />
            <p className="text-[10px] text-gray-400">Trusted by 200k+ Businesses</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
