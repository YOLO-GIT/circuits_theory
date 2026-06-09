import { useState } from 'react';

export default function AndGate() {
  // 1. Core State: The user inputs (True/1 or False/0)
  const [inputA, setInputA] = useState<boolean>(false);
  const [inputB, setInputB] = useState<boolean>(false);

  // 2. Pure Logic Engine: Calculate the output instantly on every render
  const output = inputA && inputB;

  // Color constants for our wires based on logic state
  const activeColor = 'stroke-amber-500 shadow-lg';
  const inactiveColor = 'stroke-gray-700';

  return (
    <div className="flex flex-col items-center gap-8 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 w-full max-w-lg">
      
      {/* INTERACTIVE SIMULATION AREA */}
      <div className="flex items-center justify-center gap-4 w-full h-48 relative">
        
        {/* INPUT BUTTONS (LEFT) */}
        <div className="flex flex-col gap-12 justify-center h-full">
          <button
            onClick={() => setInputA(!inputA)}
            className={`w-12 h-12 rounded-lg font-mono font-bold transition-all border ${
              inputA 
                ? 'bg-amber-500 text-gray-950 border-amber-400 shadow-md shadow-amber-500/20' 
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
            }`}
          >
            A: {inputA ? '1' : '0'}
          </button>
          
          <button
            onClick={() => setInputB(!inputB)}
            className={`w-12 h-12 rounded-lg font-mono font-bold transition-all border ${
              inputB 
                ? 'bg-amber-500 text-gray-950 border-amber-400 shadow-md shadow-amber-500/20' 
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
            }`}
          >
            B: {inputB ? '1' : '0'}
          </button>
        </div>

        {/* INLINE SVG CIRCUIT GRAPHIC (CENTER) */}
        <div className="flex-1 max-w-60">
          <svg viewBox="0 0 200 100" className="w-full h-auto overflow-visible">
            {/* Wire A */}
            <path 
              d="M 10,25 L 70,25" 
              fill="none" 
              strokeWidth="4" 
              className={`transition-colors duration-200 ${inputA ? activeColor : inactiveColor}`}
            />
            {/* Wire B */}
            <path 
              d="M 10,75 L 70,75" 
              fill="none" 
              strokeWidth="4" 
              className={`transition-colors duration-200 ${inputB ? activeColor : inactiveColor}`}
            />
            {/* Output Wire */}
            <path 
              d="M 140,50 L 190,50" 
              fill="none" 
              strokeWidth="4" 
              className={`transition-colors duration-200 ${output ? activeColor : inactiveColor}`}
            />

            {/* The Distinctive AND Gate Body (D-Shape) */}
            <path 
              d="M 70,15 L 105,15 A 35,35 0 0,1 105,85 L 70,85 Z" 
              fill="#111827" 
              stroke="#4b5563" 
              strokeWidth="3" 
            />
            <text x="90" y="56" fill="#4b5563" className="font-sans font-bold text-lg pointer-events-none select-none">
              &
            </text>
          </svg>
        </div>

        {/* OUTPUT INDICATOR LIGHT (RIGHT) */}
        <div className="flex justify-center items-center w-16">
          <div className="flex flex-col items-center gap-2">
            <div 
              className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                output 
                  ? 'bg-amber-500 border-amber-300 shadow-xl shadow-amber-500/50 scale-110 text-gray-950' 
                  : 'bg-gray-900 border-gray-700 text-gray-600'
              }`}
            >
              💡
            </div>
            <span className="font-mono text-xs font-bold text-gray-400">
              OUT: {output ? '1' : '0'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}