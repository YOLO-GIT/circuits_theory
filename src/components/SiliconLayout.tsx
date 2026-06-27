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
  // PMOS transistors get a distinct warm color so they read as a different device type than NMOS
  const pmosOn = "fill-rose-500/20 stroke-rose-400";
  const pmosOff = "fill-gray-950 stroke-gray-700";

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
          <text x="100" y="48" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[9px] font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            A:{inputA ? "CLOSED" : "OPEN"}
          </text>

          {/* Inter-transistor Link Wire */}
          <path d="M 100,62 L 100,88" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerReachesMiddle ? powerOn : powerOff} />

          {/* Transistor B (Bottom Switch) */}
          <rect x="70" y="90" width="60" height="30" rx="4" className={inputB ? gateOn : gateOff} strokeWidth="2" />
          <text x="100" y="108" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[9px] font-bold ${inputB ? "fill-blue-400" : "fill-gray-600"}`}>
            B:{inputB ? "CLOSED" : "OPEN"}
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
            A
          </text>

          {/* Transistor B (Right Path) */}
          <rect x="160" y="45" width="60" height="30" rx="4" className={inputB ? gateOn : gateOff} strokeWidth="2" />
          <text x="190" y="63" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[10px] font-bold ${inputB ? "fill-blue-400" : "fill-gray-600"}`}>
            B
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
    const pmosConducts = !inputA; // PMOS conducts when gate input is LOW

    return (
      <div className="bg-gray-950/50 p-6 rounded-xl border border-gray-800/60 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Transistor Layout: CMOS Inverter (PMOS + NMOS)
        </span>

        <svg viewBox="0 0 200 230" className="w-full max-w-xs overflow-visible">
          {/* VCC Power Rail Line */}
          <path d="M 100,10 L 100,28" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOn} />
          <text x="112" y="18" fill="#fbbf24" className="font-mono text-[9px] font-black">VCC (+5V)</text>

          {/* PMOS Pull-Up Transistor */}
          <rect x="70" y="30" width="60" height="30" rx="4" className={pmosConducts ? pmosOn : pmosOff} strokeWidth="2" />
          <text x="100" y="48" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[9px] font-bold ${pmosConducts ? "fill-rose-400" : "fill-gray-600"}`}>
            PMOS: {pmosConducts ? "ON" : "OFF"}
          </text>
          <text x="138" y="48" fill="#6b7280" className="font-mono text-[8px] font-bold">P</text>

          {/* Output Node Splitting Point */}
          <path d="M 100,62 L 100,93" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <path d="M 100,77 L 145,77" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <circle cx="101" cy="77" r="3" className={output ? "fill-amber-400" : "fill-gray-800"} />
          <text x="154" y="81" fill="#6b7280" className="font-mono text-[11px] font-bold">OUT</text>

          {/* NMOS Pull-Down Transistor */}
          <rect x="70" y="95" width="60" height="30" rx="4" className={inputA ? gateOn : gateOff} strokeWidth="2" />
          <text x="100" y="113" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[9px] font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            NMOS: {inputA ? "ON" : "OFF"}
          </text>
          <text x="138" y="113" fill="#6b7280" className="font-mono text-[8px] font-bold">N</text>

          {/* Ground Rail Return Wire */}
          <path d="M 100,127 L 100,145" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOff} />
          <path d="M 85,145 L 115,145 M 90,150 L 110,150 M 95,155 L 105,155" fill="none" strokeWidth="3" className={powerOff} />
          <text x="122" y="151" fill="#6b7280" className="font-mono text-[9px] font-bold">GND</text>
        </svg>
        <p className="text-[11px] text-gray-500 text-center italic px-2">
          <strong>PMOS</strong> conducts when A is LOW, pulling OUT to VCC. <strong>NMOS</strong> conducts when A is HIGH, pulling OUT to GND. Only one is ever on.
        </p>
      </div>
    );
  }

  // === NAND GATE INVERTED SERIES MATRIX ===
  if (gateType === "NAND") {
    const output = !(inputA && inputB);
    const pmosAConducts = !inputA; // PMOS conducts when its gate input is LOW
    const pmosBConducts = !inputB;
    const middleSegmentHigh = output && inputA; // NMOS series node: high only if node is high and top NMOS closes

    return (
      <div className="bg-gray-950/50 p-6 rounded-xl border border-gray-800/60 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Transistor Layout: CMOS NAND (PMOS Parallel / NMOS Series)
        </span>

        <svg viewBox="0 0 240 280" className="w-full max-w-sm overflow-visible">
          {/* VCC Top Voltage Bus */}
          <path d="M 120,10 L 120,25 M 70,25 L 170,25 M 70,25 L 70,43 M 170,25 L 170,43" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOn} />
          <text x="132" y="16" fill="#fbbf24" className="font-mono text-[9px] font-black">VCC</text>

          {/* PMOS A (Left, parallel pull-up) */}
          <rect x="40" y="45" width="60" height="30" rx="4" className={pmosAConducts ? pmosOn : pmosOff} strokeWidth="2" />
          <text x="70" y="63" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[10px] font-bold ${pmosAConducts ? "fill-rose-400" : "fill-gray-600"}`}>
            A
          </text>

          {/* PMOS B (Right, parallel pull-up) */}
          <rect x="140" y="45" width="60" height="30" rx="4" className={pmosBConducts ? pmosOn : pmosOff} strokeWidth="2" />
          <text x="170" y="63" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[10px] font-bold ${pmosBConducts ? "fill-rose-400" : "fill-gray-600"}`}>
            B
          </text>

          {/* PMOS outputs re-converge to the OUT node (either conducting pulls high) */}
          <path d="M 70,77 L 70,95" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={pmosAConducts ? powerOn : powerOff} />
          <path d="M 170,77 L 170,95" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={pmosBConducts ? powerOn : powerOff} />
          <path d="M 70,95 L 170,95 M 120,95 L 120,108" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />

          {/* OUT tap */}
          <path d="M 120,108 L 120,135" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <path d="M 120,120 L 165,120" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <circle cx="121" cy="120" r="3" className={output ? "fill-amber-400" : "fill-gray-800"} />
          <text x="174" y="124" fill="#6b7280" className="font-mono text-[11px] font-bold">OUT</text>

          {/* NMOS A (Top series pull-down) */}
          <rect x="90" y="137" width="60" height="30" rx="4" className={inputA ? gateOn : gateOff} strokeWidth="2" />
          <text x="120" y="155" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-xs font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            A
          </text>

          {/* Mid-transistor Wire Segment */}
          <path d="M 120,169 L 120,190" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={middleSegmentHigh ? powerOn : powerOff} />

          {/* NMOS B (Bottom series pull-down) */}
          <rect x="90" y="192" width="60" height="30" rx="4" className={inputB ? gateOn : gateOff} strokeWidth="2" />
          <text x="120" y="210" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-xs font-bold ${inputB ? "fill-blue-400" : "fill-gray-600"}`}>
            B
          </text>

          {/* Ground Termination Core */}
          <path d="M 120,224 L 120,242" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOff} />
          <path d="M 105,242 L 135,242 M 110,247 L 130,247 M 115,252 L 125,252" fill="none" strokeWidth="3" className={powerOff} />
          <text x="142" y="248" fill="#6b7280" className="font-mono text-[9px] font-bold">GND</text>
        </svg>
        <p className="text-[11px] text-gray-500 text-center italic px-2">
          Either <strong>PMOS</strong> conducting pulls OUT high. Only when <strong>both NMOS</strong> close does the series path to ground discharge OUT.
        </p>
      </div>
    );
  }

  // === NOR GATE INVERTED PARALLEL MATRIX ===
  if (gateType === "NOR") {
    const output = !(inputA || inputB);
    const pmosAConducts = !inputA;
    const pmosBConducts = !inputB;
    const pmosSeriesHigh = pmosAConducts && pmosBConducts; // both PMOS in series must conduct

    return (
      <div className="bg-gray-950/50 p-6 rounded-xl border border-gray-800/60 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Transistor Layout: CMOS NOR (PMOS Series / NMOS Parallel)
        </span>

        <svg viewBox="0 0 240 280" className="w-full max-w-sm overflow-visible">
          {/* VCC Top Voltage Line */}
          <path d="M 120,10 L 120,28" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOn} />
          <text x="132" y="18" fill="#fbbf24" className="font-mono text-[9px] font-black">VCC</text>

          {/* PMOS A (Top series pull-up) */}
          <rect x="90" y="30" width="60" height="30" rx="4" className={pmosAConducts ? pmosOn : pmosOff} strokeWidth="2" />
          <text x="120" y="48" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-xs font-bold ${pmosAConducts ? "fill-rose-400" : "fill-gray-600"}`}>
            A
          </text>

          {/* Mid PMOS Wire Segment */}
          <path d="M 120,62 L 120,83" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={pmosSeriesHigh ? powerOn : powerOff} />

          {/* PMOS B (Bottom series pull-up) */}
          <rect x="90" y="85" width="60" height="30" rx="4" className={pmosBConducts ? pmosOn : pmosOff} strokeWidth="2" />
          <text x="120" y="103" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-xs font-bold ${pmosBConducts ? "fill-rose-400" : "fill-gray-600"}`}>
            B
          </text>

          {/* OUT tap below PMOS series stack */}
          <path d="M 120,117 L 120,140" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <path d="M 120,128 L 195,128" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />
          <circle cx="121" cy="128" r="3" className={output ? "fill-amber-400" : "fill-gray-800"} />
          <text x="204" y="132" fill="#6b7280" className="font-mono text-[11px] font-bold">OUT</text>

          {/* Parallel Splitting Branch to NMOS Switches */}
          <path d="M 120,140 L 120,150 M 50,150 L 190,150 M 50,150 L 50,163 M 190,150 L 190,163" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={output ? powerOn : powerOff} />

          {/* NMOS Switch A (Left branch, parallel pull-down) */}
          <rect x="20" y="165" width="60" height="30" rx="4" className={inputA ? gateOn : gateOff} strokeWidth="2" />
          <text x="50" y="183" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[10px] font-bold ${inputA ? "fill-blue-400" : "fill-gray-600"}`}>
            A
          </text>

          {/* NMOS Switch B (Right branch, parallel pull-down) */}
          <rect x="160" y="165" width="60" height="30" rx="4" className={inputB ? gateOn : gateOff} strokeWidth="2" />
          <text x="190" y="183" textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[10px] font-bold ${inputB ? "fill-blue-400" : "fill-gray-600"}`}>
            B
          </text>

          {/* Ground Convergence Lines */}
          <path d="M 50,197 L 50,215 M 190,197 L 190,215 M 50,215 L 190,215 M 120,215 L 120,233" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={powerOff} />

          {/* Ground Connection Symbol */}
          <path d="M 105,233 L 135,233 M 110,238 L 130,238 M 115,243 L 125,243" fill="none" strokeWidth="3" className={powerOff} />
          <text x="142" y="239" fill="#6b7280" className="font-mono text-[9px] font-bold">GND</text>
        </svg>
        <p className="text-[11px] text-gray-500 text-center italic px-2">
          Only when <strong>both PMOS</strong> conduct in series does OUT pull high. Either <strong>NMOS</strong> conducting shorts OUT to ground.
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