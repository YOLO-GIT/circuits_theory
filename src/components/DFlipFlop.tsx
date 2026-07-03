import { useState, useEffect } from "react";
import type { ReactNode } from "react";

function Bar({ children }: { children: ReactNode }) {
  return <span className="[text-decoration:overline] decoration-2 pt-0.5">{children}</span>;
}

interface DFlipFlopProps {
  onNightmareMode?: () => void;
}

export default function DFlipFlop({ onNightmareMode }: DFlipFlopProps) {
  const [d, setD] = useState<boolean>(false);
  const [q, setQ] = useState<boolean>(false);
  const [isClockActive, setIsClockActive] = useState<boolean>(false);

  const [anomalyClicks, setAnomalyClicks] = useState<number>(0);
  const [isNightmareMode, setIsNightmareMode] = useState<boolean>(false);

  // Read Hardware Persistent States
  const [isSystemBricked, setIsSystemBricked] = useState<boolean>(() => {
    return localStorage.getItem("system_override_locked_out") === "true";
  });
  const [isSystemSecured, setIsSystemSecured] = useState<boolean>(() => {
    return localStorage.getItem("system_override_won") === "true";
  });

  const notQ = !q;

  // Check if either terminal status blocks access to the secret doorway
  const isSecretDisabled = isSystemBricked || isSystemSecured;

  const systemTitle = isSystemBricked
    ? "ELEMENT_OFFLINE // HARDWARE_DEGRADED"
    : isSystemSecured
      ? "Sequential Element: D Flip-Flop [ SECURED ]"
      : isNightmareMode
        ? "F A T A L   L O G I C   E R R O R"
        : "Sequential Element: D Flip-Flop";

  const triggerClockPulse = () => {
    if (isNightmareMode || isSystemBricked) return;

    setIsClockActive(true);
    setQ(d);

    setTimeout(() => {
      setIsClockActive(false);
    }, 200);
  };

  const handleSecretClick = () => {
    // Hard break if user already completed or failed the sequence once
    if (isSecretDisabled) return; 

    if (anomalyClicks === 4) {
      setIsNightmareMode(true);
      onNightmareMode?.(); 
    } else {
      setAnomalyClicks(prev => prev + 1);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isNightmareMode && !isSystemBricked) {
      interval = setInterval(() => {
        setIsClockActive(prev => !prev);
        setD(Math.random() > 0.5);
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isNightmareMode, isSystemBricked]);

  // Sync state registers if local storage alters down the pipeline tree execution
  useEffect(() => {
    const checkStateRegisters = () => {
      if (localStorage.getItem("system_override_locked_out") === "true") setIsSystemBricked(true);
      if (localStorage.getItem("system_override_won") === "true") setIsSystemSecured(true);
    };
    const checkInterval = setInterval(checkStateRegisters, 1000);
    return () => clearInterval(checkInterval);
  }, []);

  useEffect(() => {
    if (isSystemSecured) {
      console.log("Extermination Log: System Secured. No trace of anomaly detected. High risk of it ę̶̡̻͇̘̣̺̗̠̣͕̥̭͖̾̒s̸͙̮̥̲̻͍͓̤̤͕̭̱͚̼̅̑̕c̷̢̡͈̙̭̰̏̋́̍̂̈́̑̎̕a̸̪͔̣͔̤̝͂̃͜p̸̡̱̻̭̪͎͇͚̞̮̭̙̯͑͊i̸̢̳͇̝̓̔̽̈́̔͑̓͆̎̈́̽̂ņ̴̡͖͔̝͔͍͚̮͕̘̳̆̿̋͂̃͒͗̏̋̉̏̒͒͌͘g̵͇̞̣͇̼̪̪̜̽̊̏̐̍͌͆́̌̄̿͆̿̐͝");
    }
  }, [isSystemSecured]);

  return (
    <div className={`p-8 rounded-2xl border flex flex-col items-center gap-8 w-full max-w-lg transition-all duration-1000 select-none ${
      isSystemBricked
        ? "bg-stone-950/20 border-stone-900 opacity-20 pointer-events-none grayscale"
        : isSystemSecured
          ? "bg-gray-950/60 border-emerald-950/50 shadow-[0_0_30px_rgba(16,185,129,0.03)]"
          : isNightmareMode
            ? "bg-red-950/80 border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-pulse"
            : "bg-gray-900/40 border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]"
    }`}>

      {/* Dynamic Header Titles based on permanent outcome states */}
      <h3 className={`text-sm font-mono uppercase tracking-widest transition-colors duration-500 ${
        isSystemBricked 
          ? "text-stone-700 line-through font-normal tracking-normal italic" 
          : isSystemSecured
            ? "text-emerald-600 font-bold tracking-wide"
            : isNightmareMode 
              ? "text-red-500 font-black animate-bounce" 
              : "text-gray-400"
      }`}>
        {systemTitle}
      </h3>

      <svg viewBox="0 0 300 160" className="w-full max-w-70 overflow-visible relative">
        {/* Input Wires */}
        <path d="M 10,45 L 80,45" fill="none" stroke={isSystemBricked ? "#1c1917" : isNightmareMode ? "#dc2626" : d ? "#3b82f6" : "#4b5563"} strokeWidth="3" />
        <path d="M 10,115 L 80,115" fill="none" stroke={isSystemBricked ? "#1c1917" : isNightmareMode ? "#991b1b" : isClockActive ? "#10b981" : "#4b5563"} strokeWidth="3" />

        {/* Output Wires */}
        <path d="M 200,45 L 270,45" fill="none" stroke={isSystemBricked ? "#1c1917" : isNightmareMode ? "#dc2626" : q ? "#f59e0b" : "#4b5563"} strokeWidth="3" />
        <path d="M 200,115 L 270,115" fill="none" stroke={isSystemBricked ? "#1c1917" : isNightmareMode ? "#dc2626" : notQ ? "#f59e0b" : "#4b5563"} strokeWidth="3" />

        {/* Flip-Flop Block Body */}
        <rect x="80" y="20" width="120" height="120" fill={isSystemBricked ? "#0c0a09" : isNightmareMode ? "#450a0a" : "#111827"} stroke={isSystemBricked ? "#292524" : isNightmareMode ? "#dc2626" : "#4b5563"} strokeWidth="3" rx="8" />

        {/* Internal Dynamic Clock Triangle */}
        <path d="M 80,105 L 95,115 L 80,125" fill={isSystemBricked ? "none" : isNightmareMode ? "#dc2626" : "none"} stroke={isSystemBricked ? "#292524" : isNightmareMode ? "#dc2626" : "#4b5563"} strokeWidth="2" />

        {/* Signal Pin Text Labels */}
        <text x="95" y="52" fill={isSystemBricked ? "#44403c" : isNightmareMode ? "#f87171" : "#9ca3af"} className="font-mono text-xs font-bold">D</text>
        <text x="102" y="120" fill={isSystemBricked ? "#44403c" : isNightmareMode ? "#f87171" : "#9ca3af"} className="font-mono text-2xs font-bold">CLK</text>
        <text x="175" y="52" fill={isSystemBricked ? "#44403c" : isNightmareMode ? "#f87171" : "#9ca3af"} className="font-mono text-xs font-bold">Q</text>
        <text x="175" y="120" fill={isSystemBricked ? "#44403c" : isNightmareMode ? "#f87171" : "#9ca3af"} className="font-mono text-xs font-bold [text-decoration:overline] decoration-2">Q</text>

        {/* 👻 GHOST CODE: ONLY mount hitbox if user HAS NOT won or failed yet */}
        {!isSecretDisabled && (
          <rect
            x="70" y="90" width="60" height="40"
            fill="transparent"
            className="cursor-pointer"
            onClick={handleSecretClick}
            aria-label="Hidden trigger location"
          />
        )}
      </svg>

      <div className="flex items-end gap-4 w-full justify-center">

        {/* Data Input Toggle */}
        <div className="flex flex-col items-center gap-2">
          <span className={`text-2xs font-mono uppercase tracking-wider whitespace-nowrap ${isSystemBricked ? "text-stone-700" : isNightmareMode ? "text-red-700 font-bold" : "text-gray-500"}`}>
            Data Input
          </span>
          <button
            onClick={() => { if (!isNightmareMode && !isSystemBricked) setD(!d); }}
            disabled={isNightmareMode || isSystemBricked}
            className={`w-14 h-11 rounded-lg font-mono font-bold border transition-all ${
              isSystemBricked ? "bg-stone-950 text-stone-800 border-stone-900 cursor-not-allowed" :
              isNightmareMode ? "bg-red-900 text-red-300 border-red-700 pointer-events-none" :
              d ? "bg-blue-500 text-gray-950 border-blue-400 cursor-pointer" : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600 cursor-pointer"
            }`}
          >
            D: {isSystemBricked ? "×" : isNightmareMode ? "6" : d ? "1" : "0"}
          </button>
        </div>

        {/* Clock Manual Pulse Button */}
        <div className="flex flex-col items-center gap-2">
          <span className={`text-2xs font-mono uppercase tracking-wider whitespace-nowrap ${isSystemBricked ? "text-stone-700" : isNightmareMode ? "text-red-700 font-bold" : "text-gray-500"}`}>
            Trigger Edge
          </span>
          <button
            onClick={triggerClockPulse}
            disabled={isNightmareMode || isSystemBricked}
            className={`px-4 h-11 min-w-27.5 rounded-lg font-mono text-xs font-bold tracking-wide border transition-all whitespace-nowrap ${
              isSystemBricked ? "bg-stone-950 text-stone-800 border-stone-900 cursor-not-allowed" :
              isNightmareMode ? "bg-black text-red-600 border-red-800 shadow-xl shadow-red-900/50" :
              isClockActive
                ? "bg-emerald-500 text-gray-950 border-emerald-400 shadow-lg shadow-emerald-500/20 cursor-pointer"
                : "bg-gray-800 text-emerald-400 border-gray-700 hover:bg-gray-700 cursor-pointer"
            }`}
          >
            {isSystemBricked ? "[ INERT ]" : isNightmareMode ? "☠ OVERRIDE ☠" : isClockActive ? "⚡ RISING" : "CLK PULSE"}
          </button>
        </div>

        {/* System Register Outputs */}
        <div className="flex flex-col items-center gap-2">
          <span className={`text-2xs font-mono uppercase tracking-wider whitespace-nowrap ${isSystemBricked ? "text-stone-700" : isNightmareMode ? "text-red-700 font-bold" : "text-gray-500"}`}>
            State Out
          </span>
          <div className={`flex gap-4 px-4 h-11 items-center rounded-xl border font-mono text-sm transition-colors ${
            isSystemBricked ? "bg-stone-950/20 border-stone-900 text-stone-800" :
            isNightmareMode ? "bg-red-950/90 border-red-700 text-red-500" : "bg-gray-950/60 border-gray-800/80"
          }`}>
            <div>
              <span className={isSystemBricked ? "text-stone-700" : isNightmareMode ? "text-red-700 font-bold" : "text-gray-500 font-bold"}>Q:</span>{" "}
              <span className={isSystemBricked ? "text-stone-800 font-bold" : isNightmareMode ? "text-red-500 font-black animate-pulse" : q ? "text-amber-400 font-black" : "text-gray-600"}>
                {isSystemBricked ? "Ø" : isNightmareMode ? "6" : q ? "1" : "0"}
              </span>
            </div>
            <div className={`w-px h-4 ${isSystemBricked ? "bg-stone-900" : isNightmareMode ? "bg-red-900" : "bg-gray-800"}`} />
            <div>
              <span className={isSystemBricked ? "text-stone-700" : isNightmareMode ? "text-red-700 font-bold" : "text-gray-500 font-bold"}><Bar>Q</Bar>:</span>{" "}
              <span className={isSystemBricked ? "text-stone-800 font-bold" : isNightmareMode ? "text-red-500 font-black animate-pulse" : notQ ? "text-amber-400 font-black" : "text-gray-600"}>
                {isSystemBricked ? "Ø" : isNightmareMode ? "6" : notQ ? "1" : "0"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}