interface OrGateProps {
  inputA: boolean;
  inputB: boolean;
  setInputA: (val: boolean) => void;
  setInputB: (val: boolean) => void;
}

export default function OrGate({ inputA, inputB, setInputA, setInputB }: OrGateProps) {
  // Pure logic calculation for an OR Gate
  const output = inputA || inputB;
  
  const activeColor = 'stroke-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]';
  const inactiveColor = 'stroke-gray-700';

  return (
    <div className="flex flex-col items-center gap-8 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 w-full max-w-lg">
      <div className="flex items-center justify-center gap-4 w-full h-48 relative">
        
        {/* INPUTS */}
        <div className="flex flex-col gap-12 justify-center h-full">
          <button
            onClick={() => setInputA(!inputA)}
            className={`w-12 h-12 rounded-lg font-mono font-bold transition-all border ${
              inputA ? 'bg-amber-500 text-gray-950 border-amber-400 shadow-md shadow-amber-500/20' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
            }`}
          >
            A: {inputA ? '1' : '0'}
          </button>
          <button
            onClick={() => setInputB(!inputB)}
            className={`w-12 h-12 rounded-lg font-mono font-bold transition-all border ${
              inputB ? 'bg-amber-500 text-gray-950 border-amber-400 shadow-md shadow-amber-500/20' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
            }`}
          >
            B: {inputB ? '1' : '0'}
          </button>
        </div>

        {/* SVG GRAPHIC (OR Gate Curved Structure) */}
        <div className="flex-1 max-w-60">
          <svg viewBox="0 0 200 100" className="w-full h-auto overflow-visible">
            {/* Input wire lines extend slightly deeper to meet the inner curve */}
            <path d="M 10,25 L 76,25" fill="none" strokeWidth="4" className={`transition-colors duration-200 ${inputA ? activeColor : inactiveColor}`} />
            <path d="M 10,75 L 76,75" fill="none" strokeWidth="4" className={`transition-colors duration-200 ${inputB ? activeColor : inactiveColor}`} />
            <path d="M 134,50 L 190,50" fill="none" strokeWidth="4" className={`transition-colors duration-200 ${output ? activeColor : inactiveColor}`} />
            
            {/* The Classic Curved OR Gate Body */}
            <path 
              d="M 65,15 C 78,35 78,65 65,85 C 92,85 118,72 135,50 C 118,28 92,15 65,15 Z" 
              fill="#111827" 
              stroke="#4b5563" 
              strokeWidth="3" 
            />
            <text x="88" y="56" fill="#4b5563" className="font-sans font-bold text-lg pointer-events-none select-none">
              ≥1
            </text>
          </svg>
        </div>

        {/* OUTPUT INDICATOR */}
        <div className="flex justify-center items-center w-16 mt-7">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${output ? 'bg-amber-500 border-amber-300 shadow-xl shadow-amber-500/50 scale-110 text-gray-950' : 'bg-gray-900 border-gray-700 text-gray-600'}`}>
              💡
            </div>
            <span className="font-mono text-xs font-bold text-gray-400">OUT: {output ? '1' : '0'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}