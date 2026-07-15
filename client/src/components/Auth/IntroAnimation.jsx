import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Lock } from 'lucide-react';

export default function IntroAnimation({ onComplete }) {
  const [stage, setStage] = useState('initial'); // 'initial' | 'entering' | 'text' | 'expanding'

  useEffect(() => {
    // Sequence of animation
    const t1 = setTimeout(() => setStage('entering'), 100);
    const t2 = setTimeout(() => setStage('text'), 800);
    const t3 = setTimeout(() => setStage('expanding'), 2200);
    const t4 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-all duration-700 ease-in-out
      ${stage === 'expanding' ? 'bg-transparent' : 'bg-[#020712]'}
    `}>
      <div 
        className={`relative flex flex-col items-center justify-center transition-all duration-700 ease-in-out
          ${stage === 'initial' ? 'opacity-0 scale-50' : ''}
          ${stage === 'entering' ? 'opacity-100 scale-100' : ''}
          ${stage === 'text' ? 'opacity-100 scale-110' : ''}
          ${stage === 'expanding' ? 'opacity-0 scale-[40] blur-xl' : ''}
        `}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--color-primary)] blur-[50px] opacity-20 rounded-full animate-pulse" />
          <Shield 
            className="text-[var(--color-primary)] relative z-10 filter drop-shadow-[0_0_20px_var(--color-primary)] transition-all duration-700 ease-in-out"
            size={220}
            strokeWidth={0.5}
          />
          <Lock 
            className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-primary)] z-20 filter drop-shadow-[0_0_15px_var(--color-primary)] transition-all duration-700 ease-in-out"
            size={110}
            strokeWidth={0.8}
          />
        </div>
        
        <div 
          className={`absolute top-[calc(50%+130px)] transition-all duration-700 flex flex-col items-center w-[300px]
            ${stage === 'text' || stage === 'expanding' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          <h1 className="text-6xl font-black text-[var(--color-primary)] tracking-[0.4em] ml-4 text-center drop-shadow-[0_0_20px_var(--color-primary)] font-mono uppercase">
            KSP
          </h1>
          
          <div className="mt-5 flex items-center space-x-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(212,168,83,0.2)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" />
            <p className="text-[11px] text-[var(--color-primary)] uppercase tracking-[0.2em] font-mono font-semibold">
              Logged In Securely
            </p>
          </div>
        </div>
      </div>
      
      {/* Expanding background overlay for transition */}
      <div 
        className={`absolute inset-0 bg-[var(--color-primary)] transition-opacity duration-700 ease-in-out pointer-events-none mix-blend-screen
          ${stage === 'expanding' ? 'opacity-0' : 'opacity-0'}
        `}
      />
    </div>
  );
}
