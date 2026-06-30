import { useState, useEffect } from "react";

// Define the strict TypeScript contract for our ARG mechanics
interface AbandonedCircuitProps {
  isRebooting: boolean;
  onSolve: () => void;
  onLoreTrigger: () => void;
}

// Make sure it says exactly "export default function"
export default function AbandonedCircuit({ 
  isRebooting, 
  onSolve, 
  onLoreTrigger 
}: AbandonedCircuitProps) {
  const [drawProgress, setDrawProgress] = useState<number>(0);
  const [glitchText, setGlitchText] = useState<string>("AWAITING_INPUT");

  // States for the interactive defusal puzzle
  const [inputA, setInputA] = useState<number>(0);
  const [inputB, setInputB] = useState<number>(0);

  // 1. The creeping autonomous drawing timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDrawProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 0.2; // Slow creep crawl
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // 2. Separate side-effect handler to safely update text when complete
  const isComplete = drawProgress >= 100;
  useEffect(() => {
    if (isComplete) {
      setGlitchText("S Y S T E M _ O V E R R I D E");
    }
  }, [isComplete]);

  // 3. Puzzle validation: If user sets both inputs to 1 during execution, they win!
  useEffect(() => {
    if (isRebooting && inputA === 1 && inputB === 1) {
      onSolve();
    }
  }, [inputA, inputB, isRebooting, onSolve]);

  // 4. Action when clicking inputs before/during the attack
  const handleInputToggle = (type: "A" | "B") => {
    if (isRebooting) {
      // Puzzle mode: Let them toggle the bits to save themselves
      if (type === "A") setInputA((prev) => (prev === 0 ? 1 : 0));
      if (type === "B") setInputB((prev) => (prev === 0 ? 1 : 0));
    } else {
      // Trapped mode: System fights back, pushes progress forward, corrupts text
      setDrawProgress((prev) => Math.min(prev + 15, 100));
      const nightmares = [
        "V O I D",
        "N U L L",
        "E X C E P T I O N",
        "W A K E  U P",
        "6 6 6",
      ];
      setGlitchText(nightmares[Math.floor(Math.random() * nightmares.length)]);
    }
  };

  return (
    <div
      className={`p-8 rounded-2xl border flex flex-col items-center gap-8 w-full max-w-lg transition-all duration-1000 ${
        isComplete
          ? "bg-red-950/40 border-red-900 shadow-[0_0_100px_rgba(220,38,38,0.3)] animate-pulse"
          : "bg-black border-neutral-900"
      }`}
    >
      <h3
        className={`text-sm font-mono tracking-[0.3em] uppercase transition-colors duration-1000 ${
          isComplete ? "text-red-600 font-black" : "text-neutral-700"
        }`}
      >
        {glitchText}
      </h3>

      {/* The Cursed SVG Canvas */}
      <svg
        viewBox="0 0 300 200"
        className="w-full max-w-70 overflow-visible relative"
      >
        {/* Fake standard circuit inputs that abruptly end */}
        <path
          d="M 10,60 L 50,60"
          fill="none"
          stroke="#262626"
          strokeWidth="3"
        />
        <path
          d="M 10,140 L 50,140"
          fill="none"
          stroke="#262626"
          strokeWidth="3"
        />

        {/* OPTION 3: HIDDEN LORE OBJECT */}
        <circle
          cx="150"
          cy="100"
          r="15"
          fill="transparent"
          className="cursor-help hover:fill-red-500/10 transition-colors z-50"
          onClick={onLoreTrigger}
        />

        {/* THE CRYPTIC SYMBOL */}
        <g
          fill="none"
          stroke={isComplete ? "#dc2626" : "#7f1d1d"}
          strokeWidth={isComplete ? "3" : "2"}
          className="transition-all duration-300"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100 - drawProgress,
            filter: isComplete
              ? "drop-shadow(0 0 8px rgba(220, 38, 38, 0.8))"
              : "none",
          }}
        >
          {/* Hexagram Base */}
          <path pathLength="100" d="M 150,20 L 230,150 L 70,150 Z" />
          <path pathLength="100" d="M 150,180 L 70,50 L 230,50 Z" />

          {/* Inner Eye / Core */}
          <circle pathLength="100" cx="150" cy="100" r="35" />
          <circle
            pathLength="100"
            cx="150"
            cy="100"
            r="10"
            fill={isComplete ? "#dc2626" : "none"}
          />

          {/* Glitching intersection lines */}
          <path pathLength="100" d="M 150,20 V 180" />
          <path pathLength="100" d="M 70,50 L 230,150" />
          <path pathLength="100" d="M 70,150 L 230,50" />
        </g>
      </svg>

      {/* Corrupted Interactive Controls */}
      <div className="flex items-end gap-6 w-full justify-center opacity-80">
        {/* INPUT A */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xs font-mono text-neutral-600 uppercase tracking-widest whitespace-nowrap">
            Input 0
          </span>
          <button
            onClick={() => handleInputToggle("A")}
            className={`w-16 h-11 rounded font-mono font-bold border transition-all ${
              isComplete && !isRebooting
                ? "bg-red-950 text-red-700 border-red-900 pointer-events-none"
                : "bg-black text-neutral-400 border-neutral-800 hover:border-red-900 hover:text-red-500 cursor-pointer"
            }`}
          >
            {isComplete && !isRebooting ? "Ø" : `A: ${inputA}`}
          </button>
        </div>

        {/* INPUT B */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xs font-mono text-neutral-600 uppercase tracking-widest whitespace-nowrap">
            Input 1
          </span>
          <button
            onClick={() => handleInputToggle("B")}
            className={`w-16 h-11 rounded font-mono font-bold border transition-all ${
              isComplete && !isRebooting
                ? "bg-red-950 text-red-700 border-red-900 pointer-events-none"
                : "bg-black text-neutral-400 border-neutral-800 hover:border-red-900 hover:text-red-500 cursor-pointer"
            }`}
          >
            {isComplete && !isRebooting ? "Ø" : `B: ${inputB}`}
          </button>
        </div>
      </div>
    </div>
  );
}
