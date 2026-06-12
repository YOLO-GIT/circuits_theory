import { motion } from "framer-motion";

interface NotGateProps {
  inputA: boolean;
  setInputA: (val: boolean) => void;
}

export default function NotGate({ inputA, setInputA }: NotGateProps) {
  // Pure logic calculation for an Inverter
  const output = !inputA;
  
  const activeColor = 'stroke-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]';
  const inactiveColor = 'stroke-gray-700';

  return (
    <div className="flex flex-col items-center gap-8 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 w-full max-w-lg">
      <div className="flex items-center justify-center gap-4 w-full h-48 relative">
        
        {/* SINGLE INPUT SWITCH */}
        <div className="flex flex-col justify-center h-full">
          <button
            onClick={() => setInputA(!inputA)}
            className={`w-12 h-12 rounded-lg font-mono font-bold transition-all border ${
              inputA ? 'bg-amber-500 text-gray-950 border-amber-400 shadow-md shadow-amber-500/20' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
            }`}
          >
            A: {inputA ? '1' : '0'}
          </button>
        </div>

        {/* SVG GRAPHIC (NOT Gate Triangle & Bubble) */}
        <div className="flex-1 max-w-60">
          <svg viewBox="0 0 200 100" className="w-full h-auto overflow-visible">
            {/* Input wire */}
            <path d="M 10,50 L 70,50" fill="none" strokeWidth="4" className={`transition-colors duration-200 ${inputA ? activeColor : inactiveColor}`} />
            
            {/* Output wire (Carries inverted logic state) */}
            <path d="M 124,50 L 190,50" fill="none" strokeWidth="4" className={`transition-colors duration-200 ${output ? activeColor : inactiveColor}`} />
            
            {/* The Triangle Body */}
            <path 
              d="M 70,25 L 112,50 L 70,75 Z" 
              fill="#111827" 
              stroke="#4b5563" 
              strokeWidth="3" 
              strokeLinejoin="round"
            />
            
            {/* The Inversion Bubble */}
            <circle 
              cx="118" 
              cy="50" 
              r="6" 
              fill="#111827" 
              stroke="#4b5563" 
              strokeWidth="3" 
            />
          </svg>
        </div>

        {/* OUTPUT INDICATOR WITH ANIMATED GLOW */}
        <div className="flex justify-center items-center w-16 mt-7">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{
                scale: output ? 1.1 : 1,
                boxShadow: output
                  ? "0px 0px 25px rgba(245, 158, 11, 0.6)"
                  : "0px 0px 0px rgba(0,0,0,0)",
              }}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl select-none transition-colors duration-200 ${
                output
                  ? "bg-amber-500 border-amber-300 text-gray-950"
                  : "bg-gray-900 border-gray-700 text-gray-500"
              }`}
            >
              💡
            </motion.div>
            <span className="font-mono text-xs font-bold text-gray-400">OUT: {output ? '1' : '0'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}