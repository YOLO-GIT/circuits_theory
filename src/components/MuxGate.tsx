import { motion } from "framer-motion";

interface MuxGateProps {
  inputA: boolean;
  inputB: boolean;
  selectLine: boolean;
  setInputA: (val: boolean) => void;
  setInputB: (val: boolean) => void;
  setSelectLine: (val: boolean) => void;
}

export default function MuxGate({
  inputA,
  inputB,
  selectLine,
  setInputA,
  setInputB,
  setSelectLine,
}: MuxGateProps) {
  // MUX Routing Engine: Chooses Input B if select line is high, otherwise Input A
  const output = selectLine ? inputB : inputA;

  const activeColor = "stroke-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]";
  const inactiveColor = "stroke-gray-700";

  return (
    <div className="flex flex-col items-center gap-6 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 w-full max-w-lg relative">
      <div className="flex items-center justify-center gap-4 w-full h-56 relative">
        
        {/* DATA INPUTS (LEFT) */}
        <div className="flex flex-col gap-12 justify-center h-full">
          <button
            onClick={() => setInputA(!inputA)}
            className={`w-12 h-12 rounded-lg font-mono font-bold transition-all border ${
              inputA ? "bg-blue-500 text-gray-950 border-blue-400" : "bg-gray-800 text-gray-400 border-gray-700"
            }`}
          >
            I₀: {inputA ? "1" : "0"}
          </button>
          <button
            onClick={() => setInputB(!inputB)}
            className={`w-12 h-12 rounded-lg font-mono font-bold transition-all border ${
              inputB ? "bg-purple-500 text-gray-950 border-purple-400" : "bg-gray-800 text-gray-400 border-gray-700"
            }`}
          >
            I₁: {inputB ? "1" : "0"}
          </button>
        </div>

        {/* SVG SCHEMATIC (The Multiplexer Trapezoid) */}
        <div className="flex-1 max-w-60">
          <svg viewBox="0 0 200 120" className="w-full h-auto overflow-visible">
            {/* Input Data Wires */}
            <path d="M 10,30 L 70,30" fill="none" strokeWidth="4" className={inputA ? "stroke-blue-500" : inactiveColor} />
            <path d="M 10,90 L 70,90" fill="none" strokeWidth="4" className={inputB ? "stroke-purple-500" : inactiveColor} />
            
            {/* Select Control Line Wire coming from below */}
            <path d="M 95,115 L 95,95" fill="none" strokeWidth="4" className={selectLine ? "stroke-pink-500" : inactiveColor} />
            
            {/* Output Routed Wire */}
            <path d="M 120,60 L 190,60" fill="none" strokeWidth="4" className={output ? activeColor : inactiveColor} />

            {/* MUX Trapezoid Body */}
            <path
              d="M 70,15 L 120,35 L 120,85 L 70,105 Z"
              fill="#111827"
              stroke="#4b5563"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Label texts inside SVG */}
            <text x="76" y="35" fill="#4b5563" className="font-mono text-[10px] font-bold">0</text>
            <text x="76" y="94" fill="#4b5563" className="font-mono text-[10px] font-bold">1</text>
            <text x="88" y="65" fill="#6b7280" className="font-sans font-black text-sm tracking-wider">MUX</text>
            <text x="90" y="112" fill="#4b5563" className="font-mono text-[9px] font-bold">S</text>
          </svg>
        </div>

        {/* GLOWING OUTPUT BULB */}
        <div className="flex justify-center items-center w-16">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{
                scale: output ? 1.1 : 1,
                boxShadow: output ? "0px 0px 25px rgba(245, 158, 11, 0.6)" : "0px 0px 0px rgba(0,0,0,0)",
              }}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl select-none ${
                output ? "bg-amber-500 border-amber-300 text-gray-950" : "bg-gray-900 border-gray-700 text-gray-500"
              }`}
            >
              💡
            </motion.div>
            <span className="font-mono text-xs font-bold text-gray-400">OUT: {output ? "1" : "0"}</span>
          </div>
        </div>
      </div>

      {/* SELECT LINE CONTROL SWITCH (BOTTOM) */}
      <div className="flex items-center gap-3 bg-gray-950/60 px-4 py-2 rounded-xl border border-gray-800/80">
        <span className="text-xs font-mono text-gray-400 font-bold">Control Select Line (S):</span>
        <button
          onClick={() => setSelectLine(!selectLine)}
          className={`px-4 py-1.5 rounded-md font-mono text-xs font-black transition-all border ${
            selectLine
              ? "bg-pink-500 text-gray-950 border-pink-400 shadow-md shadow-pink-500/20"
              : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700"
          }`}
        >
          {selectLine ? "SELECT I₁ (Active)" : "SELECT I₀ (Default)"}
        </button>
      </div>
    </div>
  );
}