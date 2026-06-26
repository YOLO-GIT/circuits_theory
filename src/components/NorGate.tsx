import { motion } from "framer-motion";

interface NorGateProps {
  inputA: boolean;
  inputB: boolean;
  setInputA: (val: boolean) => void;
  setInputB: (val: boolean) => void;
}

export default function NorGate({ inputA, inputB, setInputA, setInputB }: NorGateProps) {
  const output = !(inputA || inputB); // Inverted OR operation
  const activeColor = "stroke-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]";
  const inactiveColor = "stroke-gray-700";

  return (
    <div className="flex flex-col items-center gap-8 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 w-full max-w-lg">
      <div className="flex items-center justify-center gap-4 w-full h-48 relative">
        {/* INPUT SWITCHES */}
        <div className="flex flex-col gap-12 justify-center h-full">
          <button
            onClick={() => setInputA(!inputA)}
            className={`w-12 h-12 rounded-lg font-mono font-bold transition-all border ${
              inputA
                ? "bg-amber-500 text-gray-950 border-amber-400 shadow-md shadow-amber-500/20"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700"
            }`}
          >
            A: {inputA ? "1" : "0"}
          </button>
          <button
            onClick={() => setInputB(!inputB)}
            className={`w-12 h-12 rounded-lg font-mono font-bold transition-all border ${
              inputB
                ? "bg-amber-500 text-gray-950 border-amber-400 shadow-md shadow-amber-500/20"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700"
            }`}
          >
            B: {inputB ? "1" : "0"}
          </button>
        </div>

        {/* SVG SCHEMATIC GRAPHIC */}
        <div className="flex-1 max-w-60">
          <svg viewBox="0 0 200 100" className="w-full h-auto overflow-visible">
            {/* Input Rails - Extended slightly to tap deep into the curved back wall */}
            <path
              d="M 10,25 L 72,25"
              fill="none"
              strokeWidth="4"
              className={`transition-colors duration-200 ${inputA ? activeColor : inactiveColor}`}
            />
            <path
              d="M 10,75 L 72,75"
              fill="none"
              strokeWidth="4"
              className={`transition-colors duration-200 ${inputB ? activeColor : inactiveColor}`}
            />
            {/* Output Tracer Wire */}
            <path
              d="M 148,50 L 190,50"
              fill="none"
              strokeWidth="4"
              className={`transition-colors duration-200 ${output ? activeColor : inactiveColor}`}
            />
            {/* Curved OR Body Geometry */}
            <path
              d="M 65,15 Q 78,50 65,85 Q 105,85 140,50 Q 105,15 65,15 Z"
              fill="#111827"
              stroke="#4b5563"
              strokeWidth="3"
            />
            {/* Inversion Bubble Circle */}
            <circle
              cx="144"
              cy="50"
              r="4"
              fill="#111827"
              stroke="#4b5563"
              strokeWidth="3"
            />
          </svg>
        </div>

        {/* LIVE BULB ACCELERATOR */}
        <div className="flex justify-center items-center w-16 mt-7">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{
                scale: output ? 1.1 : 1,
                boxShadow: output
                  ? "0px 0px 25px rgba(245, 158, 11, 0.6)"
                  : "0px 0px 0px rgba(0,0,0,0)",
              }}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl select-none transition-colors ${
                output
                  ? "bg-amber-500 border-amber-300 text-gray-950"
                  : "bg-gray-900 border-gray-700 text-gray-500"
              }`}
            >
              💡
            </motion.div>
            <span className="font-mono text-xs font-bold text-gray-400">
              OUT: {output ? "1" : "0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}