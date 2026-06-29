import { useState, useEffect } from "react";

export default function AbandonedCircuit() {
  const [drawProgress, setDrawProgress] = useState<number>(0);
  const [glitchText, setGlitchText] = useState<string>("AWAITING_INPUT");

  // The creeping timer that draws the circuit autonomously
  useEffect(() => {
    const timer = setInterval(() => {
      setDrawProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setGlitchText("S Y S T E M _ O V E R R I D E");
          return 100;
        }
        // Increase this number to draw faster, decrease for a slower, creepier crawl
        return prev + 0.2; 
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // When the user tries to click the inputs, the circuit fights back
  const handleDesperateClick = () => {
    // Jump the drawing progress forward violently
    setDrawProgress((prev) => Math.min(prev + 15, 100));
    
    // Corrupt the UI text
    const nightmares = ["V O I D", "N U L L", "E X C E P T I O N", "W A K E  U P", "6 6 6"];
    setGlitchText(nightmares[Math.floor(Math.random() * nightmares.length)]);
  };

  const isComplete = drawProgress >= 100;

  return (
    <div className={`p-8 rounded-2xl border flex flex-col items-center gap-8 w-full max-w-lg transition-all duration-1000 ${
      isComplete 
        ? "bg-red-950/40 border-red-900 shadow-[0_0_100px_rgba(220,38,38,0.3)] animate-pulse" 
        : "bg-black border-neutral-900"
    }`}>
      
      <h3 className={`text-sm font-mono tracking-[0.3em] uppercase transition-colors duration-1000 ${
        isComplete ? "text-red-600 font-black" : "text-neutral-700"
      }`}>
        {glitchText}
      </h3>

      {/* The Cursed SVG Canvas */}
      <svg viewBox="0 0 300 200" className="w-full max-w-70 overflow-visible relative">
        {/* Fake standard circuit inputs that abruptly end */}
        <path d="M 10,60 L 50,60" fill="none" stroke="#262626" strokeWidth="3" />
        <path d="M 10,140 L 50,140" fill="none" stroke="#262626" strokeWidth="3" />
        
        {/* THE CRYPTIC SYMBOL */}
        <g 
          fill="none" 
          stroke={isComplete ? "#dc2626" : "#7f1d1d"} 
          strokeWidth={isComplete ? "3" : "2"}
          className="transition-all duration-300"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100 - drawProgress,
            filter: isComplete ? "drop-shadow(0 0 8px rgba(220, 38, 38, 0.8))" : "none"
          }}
        >
          {/* Hexagram Base */}
          <path pathLength="100" d="M 150,20 L 230,150 L 70,150 Z" />
          <path pathLength="100" d="M 150,180 L 70,50 L 230,50 Z" />
          
          {/* Inner Eye / Core */}
          <circle pathLength="100" cx="150" cy="100" r="35" />
          <circle pathLength="100" cx="150" cy="100" r="10" fill={isComplete ? "#dc2626" : "none"} />

          {/* Glitching intersection lines */}
          <path pathLength="100" d="M 150,20 V 180" />
          <path pathLength="100" d="M 70,50 L 230,150" />
          <path pathLength="100" d="M 70,150 L 230,50" />
        </g>
      </svg>

      {/* Corrupted Interactive Controls */}
      <div className="flex items-end gap-6 w-full justify-center opacity-80">
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xs font-mono text-neutral-600 uppercase tracking-widest whitespace-nowrap">
            Input 0
          </span>
          <button
            onClick={handleDesperateClick}
            className={`w-16 h-11 rounded font-mono font-bold border transition-all ${
              isComplete ? "bg-red-950 text-red-700 border-red-900 pointer-events-none" : "bg-black text-neutral-600 border-neutral-800 hover:border-red-900 hover:text-red-900"
            }`}
          >
            {isComplete ? "Ø" : "A: 0"}
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-2xs font-mono text-neutral-600 uppercase tracking-widest whitespace-nowrap">
            Input 1
          </span>
          <button
            onClick={handleDesperateClick}
            className={`w-16 h-11 rounded font-mono font-bold border transition-all ${
              isComplete ? "bg-red-950 text-red-700 border-red-900 pointer-events-none" : "bg-black text-neutral-600 border-neutral-800 hover:border-red-900 hover:text-red-900"
            }`}
          >
            {isComplete ? "Ø" : "B: 0"}
          </button>
        </div>

      </div>
    </div>
  );
}