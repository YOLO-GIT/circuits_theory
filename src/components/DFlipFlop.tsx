import { useState } from "react";

export default function DFlipFlop() {
  const [d, setD] = useState<boolean>(false);
  const [q, setQ] = useState<boolean>(false);
  const [isClockActive, setIsClockActive] = useState<boolean>(false);

  const notQ = !q;

  // Simulate a clock pulse edge (0 -> 1 transition)
  const triggerClockPulse = () => {
    setIsClockActive(true);
    setQ(d); // Capture the state of D at the rising edge

    // Release the visual pulse state after a brief delay
    setTimeout(() => {
      setIsClockActive(false);
    }, 200);
  };

  return (
    <div className="bg-gray-900/40 p-8 rounded-2xl border border-gray-800 flex flex-col items-center gap-8 w-full max-w-lg">
      <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest">
        Sequential Element: D Flip-Flop
      </h3>

      {/* SVG D-FF Schematic Representation */}
      <svg viewBox="0 0 300 160" className="w-full max-w-70 overflow-visible">
        {/* Input Wires */}
        <path d="M 10,45 L 80,45" fill="none" stroke={d ? "#3b82f6" : "#4b5563"} strokeWidth="3" />
        <path d="M 10,115 L 80,115" fill="none" stroke={isClockActive ? "#10b981" : "#4b5563"} strokeWidth="3" />

        {/* Output Wires */}
        <path d="M 200,45 L 270,45" fill="none" stroke={q ? "#f59e0b" : "#4b5563"} strokeWidth="3" />
        <path d="M 200,115 L 270,115" fill="none" stroke={notQ ? "#f59e0b" : "#4b5563"} strokeWidth="3" />

        {/* Flip-Flop Block Body */}
        <rect x="80" y="20" width="120" height="120" fill="#111827" stroke="#4b5563" strokeWidth="3" rx="8" />

        {/* Internal Dynamic Clock Triangle (Standard IEC Flip-Flop Indicator) */}
        <path d="M 80,105 L 95,115 L 80,125" fill="none" stroke="#4b5563" strokeWidth="2" />

        {/* Signal Pin Text Labels */}
        <text x="95" y="52" fill="#9ca3af" className="font-mono text-xs font-bold">D</text>
        <text x="102" y="120" fill="#9ca3af" className="font-mono text-[10px] font-bold">CLK</text>
        <text x="175" y="52" fill="#9ca3af" className="font-mono text-xs font-bold">Q</text>
        <text x="175" y="120" fill="#9ca3af" className="font-mono text-xs font-bold">Q'</text>
      </svg>

      {/* INTERACTIVE CONTROLS */}
      <div className="flex items-center gap-6 w-full justify-center">
        {/* Data Input Toggle */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Data Input</span>
          <button
            onClick={() => setD(!d)}
            className={`w-14 h-11 rounded-lg font-mono font-bold border transition-all ${
              d ? "bg-blue-500 text-gray-950 border-blue-400" : "bg-gray-800 text-gray-400 border-gray-700"
            }`}
          >
            D: {d ? "1" : "0"}
          </button>
        </div>

        {/* Clock Manual Pulse Button */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Trigger Edge</span>
          <button
            onClick={triggerClockPulse}
            className={`px-5 h-11 rounded-lg font-mono text-xs font-bold tracking-wide border transition-all ${
              isClockActive
                ? "bg-emerald-500 text-gray-950 border-emerald-400 shadow-lg shadow-emerald-500/20"
                : "bg-gray-800 text-emerald-400 border-gray-700 hover:bg-gray-700"
              }`}
          >
            {isClockActive ? "⚡ RISING EDGE" : "CLK PULSE"}
          </button>
        </div>

        {/* System Register Outputs */}
        <div className="flex gap-4 bg-gray-950/60 px-4 h-11 items-center rounded-xl border border-gray-800/80 font-mono text-sm">
          <div>
            <span className="text-gray-500 font-bold">Q:</span>{" "}
            <span className={q ? "text-amber-400 font-black" : "text-gray-600"}>{q ? "1" : "0"}</span>
          </div>
          <div className="w-px h-4 bg-gray-800" />
          <div>
            <span className="text-gray-500 font-bold">Q':</span>{" "}
            <span className={notQ ? "text-amber-400 font-black" : "text-gray-600"}>{notQ ? "1" : "0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}