
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { X, Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        // If session exists, they are logged in. If null, they need to verify email.
        if (data.session) {
          onSuccess();
          onClose();
        } else {
          alert('Registration Successful!\n\nPlease check your email inbox to confirm your account before logging in.');
          setIsSignUp(false); // Switch to login mode
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || 'Authentication failed. Check your connection and credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-sm glass-panel bg-[#0a0a0a] rounded-xl shadow-2xl overflow-hidden relative border border-boraine-blue/20">

        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h3 className="text-white font-display font-bold text-lg">
            {isSignUp ? 'Initialize Identity' : 'System Access'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-boraine-blue uppercase tracking-widest mb-2">Email Command</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded p-2.5 pl-10 text-sm text-white focus:border-boraine-blue outline-none transition-colors"
                  placeholder="agent@boraine.tech"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-boraine-blue uppercase tracking-widest mb-2">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded p-2.5 pl-10 text-sm text-white focus:border-boraine-blue outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-boraine-blue text-white font-bold py-3 rounded shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              {loading ? 'Handshaking...' : (isSignUp ? <><UserPlus className="w-4 h-4" /> Register Node</> : <><LogIn className="w-4 h-4" /> Authenticate</>)}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-gray-500 text-xs hover:text-white underline underline-offset-4"
            >
              {isSignUp ? "Already possess clearance? Login" : "Need access? Initialize ID"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
