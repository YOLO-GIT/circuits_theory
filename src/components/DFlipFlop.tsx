import { useState, useEffect } from "react";
import type { ReactNode } from "react";

function Bar({ children }: { children: ReactNode }) {
  return <span className="[text-decoration:overline] decoration-2 pt-0.5">{children}</span>;
}

export default function DFlipFlop() {
  const [d, setD] = useState<boolean>(false);
  const [q, setQ] = useState<boolean>(false);
  const [isClockActive, setIsClockActive] = useState<boolean>(false);

  // 👻 GHOST CODE: Secret state variables
  const [anomalyClicks, setAnomalyClicks] = useState<number>(0);
  const [isNightmareMode, setIsNightmareMode] = useState<boolean>(false);

  const notQ = !q;

  // Simulate a clock pulse edge
  const triggerClockPulse = () => {
    // 👻 GHOST CODE: Disable normal clock if the circuit is possessed
    if (isNightmareMode) return; 

    setIsClockActive(true);
    setQ(d);

    setTimeout(() => {
      setIsClockActive(false);
    }, 200);
  };

  // 👻 GHOST CODE: Trigger nightmare mode on 5th secret click
  const handleSecretClick = () => {
    if (anomalyClicks === 4) {
      setIsNightmareMode(true);
    } else {
      setAnomalyClicks(prev => prev + 1);
    }
  };

  // 👻 GHOST CODE: Auto-flicker the clock when possessed
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isNightmareMode) {
      interval = setInterval(() => {
        setIsClockActive(prev => !prev);
        setD(Math.random() > 0.5);
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isNightmareMode]);

  return (
    // 👻 GHOST CODE: Dynamic background wrapper that turns dark red and pulses
    <div className={`p-8 rounded-2xl border flex flex-col items-center gap-8 w-full max-w-lg transition-colors duration-1000 ${
      isNightmareMode 
        ? "bg-red-950/80 border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-pulse" 
        : "bg-gray-900/40 border-gray-800"
    }`}>
      
      {/* 👻 GHOST CODE: Corrupted Title */}
      <h3 className={`text-sm font-mono uppercase tracking-widest ${isNightmareMode ? "text-red-500 font-black animate-bounce" : "text-gray-400"}`}>
        {isNightmareMode ? "F A T A L  L O G I C  E R R O R" : "Sequential Element: D Flip-Flop"}
      </h3>

      <svg viewBox="0 0 300 160" className="w-full max-w-70 overflow-visible relative">
        {/* Input Wires */}
        <path d="M 10,45 L 80,45" fill="none" stroke={isNightmareMode ? "#dc2626" : d ? "#3b82f6" : "#4b5563"} strokeWidth="3" />
        <path d="M 10,115 L 80,115" fill="none" stroke={isNightmareMode ? "#991b1b" : isClockActive ? "#10b981" : "#4b5563"} strokeWidth="3" />

        {/* Output Wires */}
        <path d="M 200,45 L 270,45" fill="none" stroke={isNightmareMode ? "#dc2626" : q ? "#f59e0b" : "#4b5563"} strokeWidth="3" />
        <path d="M 200,115 L 270,115" fill="none" stroke={isNightmareMode ? "#dc2626" : notQ ? "#f59e0b" : "#4b5563"} strokeWidth="3" />

        {/* Flip-Flop Block Body */}
        <rect x="80" y="20" width="120" height="120" fill={isNightmareMode ? "#450a0a" : "#111827"} stroke={isNightmareMode ? "#dc2626" : "#4b5563"} strokeWidth="3" rx="8" />

        {/* Internal Dynamic Clock Triangle */}
        <path d="M 80,105 L 95,115 L 80,125" fill={isNightmareMode ? "#dc2626" : "none"} stroke={isNightmareMode ? "#dc2626" : "#4b5563"} strokeWidth="2" />

        {/* Signal Pin Text Labels */}
        <text x="95" y="52" fill={isNightmareMode ? "#f87171" : "#9ca3af"} className="font-mono text-xs font-bold">D</text>
        <text x="102" y="120" fill={isNightmareMode ? "#f87171" : "#9ca3af"} className="font-mono text-2xs font-bold">CLK</text>
        <text x="175" y="52" fill={isNightmareMode ? "#f87171" : "#9ca3af"} className="font-mono text-xs font-bold">Q</text>
        <text x="175" y="120" fill={isNightmareMode ? "#f87171" : "#9ca3af"} className="font-mono text-xs font-bold [text-decoration:overline] decoration-2">Q</text>

        {/* 👻 GHOST CODE: The Invisible Trigger Area over the CLK text/triangle */}
        <rect 
          x="70" y="90" width="60" height="40" 
          fill="transparent" 
          className="cursor-pointer" 
          onClick={handleSecretClick}
          aria-label="Hidden trigger"
        />
      </svg>

      <div className="flex items-end gap-4 w-full justify-center">
        
        {/* Data Input Toggle */}
        <div className="flex flex-col items-center gap-2">
          <span className={`text-2xs font-mono uppercase tracking-wider whitespace-nowrap ${isNightmareMode ? "text-red-700 font-bold" : "text-gray-500"}`}>
            Data Input
          </span>
          <button
            onClick={() => { if(!isNightmareMode) setD(!d) }}
            className={`w-14 h-11 rounded-lg font-mono font-bold border transition-all ${
              isNightmareMode ? "bg-red-900 text-red-300 border-red-700 pointer-events-none" : 
              d ? "bg-blue-500 text-gray-950 border-blue-400" : "bg-gray-800 text-gray-400 border-gray-700"
            }`}
          >
            {/* 👻 GHOST CODE: Shows weird data when possessed */}
            D: {isNightmareMode ? "∅" : d ? "1" : "0"}
          </button>
        </div>

        {/* Clock Manual Pulse Button */}
        <div className="flex flex-col items-center gap-2">
          <span className={`text-2xs font-mono uppercase tracking-wider whitespace-nowrap ${isNightmareMode ? "text-red-700 font-bold" : "text-gray-500"}`}>
            Trigger Edge
          </span>
          <button
            onClick={triggerClockPulse}
            className={`px-4 h-11 min-w-27.5 rounded-lg font-mono text-xs font-bold tracking-wide border transition-all whitespace-nowrap ${
              isNightmareMode ? "bg-black text-red-600 border-red-800 shadow-xl shadow-red-900/50" :
              isClockActive
                ? "bg-emerald-500 text-gray-950 border-emerald-400 shadow-lg shadow-emerald-500/20"
                : "bg-gray-800 text-emerald-400 border-gray-700 hover:bg-gray-700"
            }`}
          >
            {isNightmareMode ? "☠ OVERRIDE ☠" : isClockActive ? "⚡ RISING" : "CLK PULSE"}
          </button>
        </div>

        {/* System Register Outputs */}
        <div className="flex flex-col items-center gap-2">
          <span className={`text-2xs font-mono uppercase tracking-wider whitespace-nowrap ${isNightmareMode ? "text-red-700 font-bold" : "text-gray-500"}`}>
            State Out
          </span>
          <div className={`flex gap-4 px-4 h-11 items-center rounded-xl border font-mono text-sm ${
            isNightmareMode ? "bg-red-950/90 border-red-700 text-red-500" : "bg-gray-950/60 border-gray-800/80"
          }`}>
            <div>
              <span className={isNightmareMode ? "text-red-700 font-bold" : "text-gray-500 font-bold"}>Q:</span>{" "}
              {/* 👻 GHOST CODE: Breaking boolean logic by making both outputs '6' */}
              <span className={isNightmareMode ? "text-red-500 font-black" : q ? "text-amber-400 font-black" : "text-gray-600"}>
                {isNightmareMode ? "6" : q ? "1" : "0"}
              </span>
            </div>
            <div className={`w-px h-4 ${isNightmareMode ? "bg-red-900" : "bg-gray-800"}`} />
            <div>
              <span className={isNightmareMode ? "text-red-700 font-bold" : "text-gray-500 font-bold"}><Bar>Q</Bar>:</span>{" "}
              <span className={isNightmareMode ? "text-red-500 font-black" : notQ ? "text-amber-400 font-black" : "text-gray-600"}>
                {isNightmareMode ? "6" : notQ ? "1" : "0"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}