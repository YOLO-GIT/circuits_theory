interface SiliconLayoutProps {
  gateType: "AND" | "OR" | "NOT" | "MUX" | "D-FF" | "NAND" | "NOR";
  inputA: boolean;
  inputB: boolean;
}

export default function SiliconLayout({ gateType, inputA, inputB }: SiliconLayoutProps) {
  // Define wire coloring styles
  const powerOn = "stroke-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]";
  const powerOff = "stroke-gray-800";
  const gateOn = "fill-blue-500/20 stroke-blue-400";
  const gateOff = "fill-gray-950 stroke-gray-700";

  // === AND GATE MATRIX ===
  if (gateType === "AND") {
    const powerReachesMiddle = inputA;
    const powerReachesOutput = inputA && inputB;

    return (
      <div className="bg-gray-950/50 p-6 rounded-xl border border-gray-800/60 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Transistor Array: 2-Channel NMOS Series
        </span>

        <svg viewBox="0 0 200 180" className="w-full max-w-xs overflow-visible">
          {/* VCC Power Input Link Line */}
          <path d="M 100,10 L 100,28" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOn} />
          <text x="112" y="18" fill="#fbbf24" className="font-mono text-[9px] font-black">VCC (+5V)</text>

          {/* Transistor A (Top Switch) */}
          <rect x="70" y="30" width="60" height="30" rx="4" className={inputA ? gateOn : gateOff} strokeWidth="2" />
          <text x="100" y="48" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-xs font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_A: {inputA ? "CLOSED" : "OPEN"}
          </text>

          {/* Inter-transistor Link Wire */}
          <path d="M 100,62 L 100,88" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerReachesMiddle ? powerOn : powerOff} />

          {/* Transistor B (Bottom Switch) */}
          <rect x="70" y="90" width="60" height="30" rx="4" className={inputB ? gateOn : gateOff} strokeWidth="2" />
          <text x="100" y="108" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-xs font-bold ${inputB ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_B: {inputB ? "CLOSED" : "OPEN"}
          </text>

          {/* Output Link Wire */}
          <path d="M 100,122 L 100,150" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerReachesOutput ? powerOn : powerOff} />

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

  // === OR GATE MATRIX ===
  if (gateType === "OR") {
    const powerReachesOutput = inputA || inputB;

    return (
      <div className="bg-gray-950/50 p-6 rounded-xl border border-gray-800/60 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Transistor Array: 2-Channel NMOS Parallel
        </span>

        <svg viewBox="0 0 240 160" className="w-full max-w-sm overflow-visible">
          {/* Incoming Power Bus Splitting Line */}
          <path d="M 120,10 L 120,25 M 50,25 L 190,25 M 50,25 L 50,43 M 190,25 L 190,43" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOn} />
          <text x="132" y="16" fill="#fbbf24" className="font-mono text-[9px] font-black">VCC</text>

          {/* Transistor A (Left Path) */}
          <rect x="20" y="45" width="60" height="30" rx="4" className={inputA ? gateOn : gateOff} strokeWidth="2" />
          <text x="50" y="63" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[10px] font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_A
          </text>

          {/* Transistor B (Right Path) */}
          <rect x="160" y="45" width="60" height="30" rx="4" className={inputB ? gateOn : gateOff} strokeWidth="2" />
          <text x="190" y="63" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[10px] font-bold ${inputB ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_B
          </text>

          {/* Outgoing Junction Re-combining Lines */}
          <path d="M 50,77 L 50,105" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={inputA ? powerOn : powerOff} />
          <path d="M 190,77 L 190,105" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={inputB ? powerOn : powerOff} />

          <path d="M 50,105 L 190,105 M 120,105 L 120,135" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerReachesOutput ? powerOn : powerOff} />

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

  // === NOT GATE INVERTER MATRIX ===
  if (gateType === "NOT") {
    const output = !inputA;

    return (
      <div className="bg-gray-950/50 p-6 rounded-xl border border-gray-800/60 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Transistor Layout: NMOS Inverter with Pull-Up
        </span>

        <svg viewBox="0 0 200 170" className="w-full max-w-xs overflow-visible">
          {/* VCC Power Rail Line */}
          <path d="M 100,10 L 100,28" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOn} />
          <text x="112" y="18" fill="#fbbf24" className="font-mono text-[9px] font-black">VCC (+5V)</text>

          {/* Pull-Up Resistor Block */}
          <rect x="88" y="30" width="24" height="20" rx="2" fill="none" stroke="#4b5563" strokeWidth="2" strokeDasharray="4,2" />
          <text x="118" y="43" fill="#6b7280" className="font-mono text-[8px] font-bold">R_PULLUP</text>

          {/* Output Node Splitting Point */}
          <path d="M 100,52 L 100,83" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <path d="M 100,65 L 145,65" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <circle cx="100" cy="65" r="3" className={output ? "fill-amber-400" : "fill-gray-800"} />
          <text x="154" y="69" fill="#6b7280" className="font-mono text-[11px] font-bold">OUT</text>

          {/* Transistor Switch A */}
          <rect x="70" y="85" width="60" height="30" rx="4" className={inputA ? gateOn : gateOff} strokeWidth="2" />
          <text x="100" y="103" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-xs font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_A: {inputA ? "CLOSED" : "OPEN"}
          </text>

          {/* Ground Rail Return Wire */}
          <path d="M 100,117 L 100,135" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOff} />
          <path d="M 85,135 L 115,135 M 90,140 L 110,140 M 95,145 L 105,145" fill="none" strokeWidth="3" className={powerOff} />
          <text x="122" y="141" fill="#6b7280" className="font-mono text-[9px] font-bold">GND</text>
        </svg>
        <p className="text-[11px] text-gray-500 text-center italic px-2">
          An open control line allows VCC to charge the terminal, while closing <strong>SW_A</strong> instantly drains the node to Ground (0).
        </p>
      </div>
    );
  }

  // === NAND GATE INVERTED SERIES MATRIX ===
  if (gateType === "NAND") {
    const output = !(inputA && inputB);
    const middleSegmentHigh = output && inputA; // High only if node is high and top switch closes

    return (
      <div className="bg-gray-950/50 p-6 rounded-xl border border-gray-800/60 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Transistor Layout: NMOS Inverted Series
        </span>

        <svg viewBox="0 0 200 220" className="w-full max-w-xs overflow-visible">
          {/* VCC Top Voltage Line */}
          <path d="M 100,10 L 100,28" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOn} />
          <text x="112" y="18" fill="#fbbf24" className="font-mono text-[9px] font-black">VCC</text>

          {/* Pull-Up Resistor Element */}
          <rect x="88" y="30" width="24" height="20" rx="2" fill="none" stroke="#4b5563" strokeWidth="2" strokeDasharray="4,2" />
          <text x="118" y="43" fill="#6b7280" className="font-mono text-[8px] font-bold">R_PULLUP</text>

          {/* Dynamic Node Split Wire */}
          <path d="M 100,50 L 100,83" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <path d="M 100,65 L 145,65" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <circle cx="100" cy="65" r="3" className={output ? "fill-amber-400" : "fill-gray-800"} />
          <text x="154" y="69" fill="#6b7280" className="font-mono text-[11px] font-bold">OUT</text>

          {/* Transistor A (Top Series Pull-Down) */}
          <rect x="70" y="85" width="60" height="30" rx="4" className={inputA ? gateOn : gateOff} strokeWidth="2" />
          <text x="100" y="103" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-xs font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_A
          </text>

          {/* Mid-transistor Wire Segment */}
          <path d="M 100,117 L 100,138" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={middleSegmentHigh ? powerOn : powerOff} />

          {/* Transistor B (Bottom Series Pull-Down) */}
          <rect x="70" y="140" width="60" height="30" rx="4" className={inputB ? gateOn : gateOff} strokeWidth="2" />
          <text x="100" y="158" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-xs font-bold ${inputB ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_B
          </text>

          {/* Ground Termination Core */}
          <path d="M 100,172 L 100,190" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOff} />
          <path d="M 85,190 L 115,190 M 90,195 L 110,195 M 95,200 L 105,200" fill="none" strokeWidth="3" className={powerOff} />
          <text x="122" y="196" fill="#6b7280" className="font-mono text-[9px] font-bold">GND</text>
        </svg>
        <p className="text-[11px] text-gray-500 text-center italic px-2">
          Current is safely pulled HIGH by VCC unless <strong>both series switches close</strong>, completing the path to ground and discharging the output.
        </p>
      </div>
    );
  }

  // === NOR GATE INVERTED PARALLEL MATRIX ===
  if (gateType === "NOR") {
    const output = !(inputA || inputB);

    return (
      <div className="bg-gray-950/50 p-6 rounded-xl border border-gray-800/60 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Transistor Layout: NMOS Inverted Parallel
        </span>

        <svg viewBox="0 0 240 190" className="w-full max-w-sm overflow-visible">
          {/* Top Voltage Feed Rail */}
          <path d="M 120,10 L 120,23" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOn} />
          <text x="132" y="16" fill="#fbbf24" className="font-mono text-[9px] font-black">VCC</text>

          {/* Pull-Up Inversion Resistor Box */}
          <rect x="108" y="25" width="24" height="20" rx="2" fill="none" stroke="#4b5563" strokeWidth="2" strokeDasharray="4,2" />

          {/* Output Tap Junction */}
          <path d="M 120,47 L 120,60" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <path d="M 120,60 L 195,60" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <circle cx="120" cy="60" r="3" className={output ? "fill-amber-400" : "fill-gray-800"} />
          <text x="204" y="64" fill="#6b7280" className="font-mono text-[11px] font-bold">OUT</text>

          {/* Parallel Splitting Branch to Switches */}
          <path d="M 120,60 L 120,70 M 50,70 L 190,70 M 50,70 L 50,83 M 190,70 L 190,83" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />

          {/* Transistor Switch A (Left branch) */}
          <rect x="20" y="85" width="60" height="30" rx="4" className={inputA ? gateOn : gateOff} strokeWidth="2" />
          <text x="50" y="103" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[10px] font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_A
          </text>

          {/* Transistor Switch B (Right branch) */}
          <rect x="160" y="85" width="60" height="30" rx="4" className={inputB ? gateOn : gateOff} strokeWidth="2" />
          <text x="190" y="103" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[10px] font-bold ${inputB ? "fill-blue-400" : "fill-gray-600"}`}>
            SW_B
          </text>

          {/* Ground Convergence Lines */}
          <path d="M 50,117 L 50,135 M 190,117 L 190,135 M 50,135 L 190,135 M 120,135 L 120,155" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOff} />

          {/* Ground Connection Symbol */}
          <path d="M 105,155 L 135,155 M 110,160 L 130,160 M 115,165 L 125,165" fill="none" strokeWidth="3" className={powerOff} />
          <text x="142" y="161" fill="#6b7280" className="font-mono text-[9px] font-bold">GND</text>
        </svg>
        <p className="text-[11px] text-gray-500 text-center italic px-2">
          The output node remains floating at HIGH potential until <strong>any parallel switch</strong> completes a direct short circuit drain path to Ground.
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