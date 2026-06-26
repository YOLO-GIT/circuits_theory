interface SiliconLayoutProps {
  gateType: "AND" | "OR" | "NOT" | "MUX" | "D-FF";
  inputA: boolean;
  inputB: boolean;
}

export default function SiliconLayout({ gateType, inputA, inputB }: SiliconLayoutProps) {
  // Define wire coloring styles
  const powerOn = "stroke-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]";
  const powerOff = "stroke-gray-800";
  const gateOn = "fill-blue-500/20 stroke-blue-400";
  const gateOff = "fill-gray-950 stroke-gray-700";

  // Render layouts depending on selected gate
  if (gateType === "AND") {
    const powerReachesMiddle = inputA;
    const powerReachesOutput = inputA && inputB;

    return (
      <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800/60 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Transistor Array: 2-Channel NMOS Series
        </span>
        
        <svg viewBox="0 0 200 180" className="w-full max-w-40 overflow-visible">
          {/* VCC Power Input Link Line */}
          <path d="M 100,10 L 100,30" fill="none" strokeWidth="4" className={powerOn} />
          <text x="112" y="18" fill="#fbbf24" className="font-mono text-[9px] font-black">VCC (+5V)</text>

          {/* Transistor A (Top Switch) */}
          <rect x="70" y="30" width="60" height="30" rx="4" className={inputA ? gateOn : gateOff} strokeWidth="2" />
          <text x="100" y="48" textAnchor="middle" className={`font-mono text-xs font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_A: {inputA ? "CLOSED" : "OPEN"}
          </text>

          {/* Inter-transistor Link Wire */}
          <path d="M 100,60 L 100,90" fill="none" strokeWidth="4" className={powerReachesMiddle ? powerOn : powerOff} />

          {/* Transistor B (Bottom Switch) */}
          <rect x="70" y="90" width="60" height="30" rx="4" className={inputB ? gateOn : gateOff} strokeWidth="2" />
          <text x="100" y="108" textAnchor="middle" className={`font-mono text-xs font-bold ${inputB ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_B: {inputB ? "CLOSED" : "OPEN"}
          </text>

          {/* Output Link Wire */}
          <path d="M 100,120 L 100,150" fill="none" strokeWidth="4" className={powerReachesOutput ? powerOn : powerOff} />
          
          {/* GND Ground Termination Link */}
          <path d="M 85,150 L 115,150 M 90,155 L 110,155 M 95,160 L 105,160" fill="none" strokeWidth="3" className={powerReachesOutput ? powerOn : powerOff} />
          <text x="122" y="160" fill="#6b7280" className="font-mono text-[9px] font-bold">OUT</text>
        </svg>
        <p className="text-[11px] text-gray-500 text-center italic px-2">
          Current flows from VCC to OUT only if <strong>both internal switches</strong> are forced into a closed state.
        </p>
      </div>
    );
  }

  if (gateType === "OR") {
    const powerReachesOutput = inputA || inputB;

    return (
      <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800/60 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Transistor Array: 2-Channel NMOS Parallel
        </span>

        <svg viewBox="0 0 240 160" className="w-full max-w-50 overflow-visible">
          {/* Incoming Power Bus Splitting Line */}
          <path d="M 120,10 L 120,25 M 50,25 L 190,25 M 50,25 L 50,45 M 190,25 L 190,45" fill="none" strokeWidth="4" className={powerOn} />
          <text x="132" y="16" fill="#fbbf24" className="font-mono text-[9px] font-black">VCC</text>

          {/* Transistor A (Left Path) */}
          <rect x="20" y="45" width="60" height="30" rx="4" className={inputA ? gateOn : gateOff} strokeWidth="2" />
          <text x="50" y="63" textAnchor="middle" className={`font-mono text-[10px] font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_A
          </text>

          {/* Transistor B (Right Path) */}
          <rect x="160" y="45" width="60" height="30" rx="4" className={inputB ? gateOn : gateOff} strokeWidth="2" />
          <text x="190" y="63" textAnchor="middle" className={`font-mono text-[10px] font-bold ${inputB ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_B
          </text>

          {/* Outgoing Junction Re-combining Lines */}
          <path d="M 50,75 L 50,105" fill="none" strokeWidth="4" className={inputA ? powerOn : powerOff} />
          <path d="M 190,75 L 190,105" fill="none" strokeWidth="4" className={inputB ? powerOn : powerOff} />
          
          <path d="M 50,105 L 190,105 M 120,105 L 120,135" fill="none" strokeWidth="4" className={powerReachesOutput ? powerOn : powerOff} />
          
          {/* Output Terminal Base */}
          <circle cx="120" cy="135" r="4" className={powerReachesOutput ? "fill-amber-400" : "fill-gray-800"} />
          <text x="132" y="139" fill="#6b7280" className="font-mono text-[11px] font-bold">OUT</text>
        </svg>
        <p className="text-[11px] text-gray-500 text-center italic px-2">
          Current can route around an open path by traveling down <strong>either channel alternative</strong> layout successfully.
        </p>
      </div>
    );
  }

  // Fallback safe message container wrapper for MUX / Complex DFF registers
  return (
    <div className="p-4 bg-gray-950/20 text-center rounded-lg border border-gray-800/40 text-xs text-gray-500 italic">
      Silicon structures for complex {gateType} logic blocks are composed of stacked complex logic gate arrays.
    </div>
  );
}