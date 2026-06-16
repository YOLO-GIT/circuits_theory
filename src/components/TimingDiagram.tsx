import { useEffect, useState } from "react";

interface TimingDiagramProps {
  inputA: boolean;
  inputB: boolean;
  output: boolean;
  gateType: string;
}

interface SignalSnapshot {
  a: boolean;
  b: boolean;
  out: boolean;
}

export default function TimingDiagram({
  inputA,
  inputB,
  output,
  gateType,
}: TimingDiagramProps) {
  const [history, setHistory] = useState<SignalSnapshot[]>([]);
  const MAX_HISTORY = 12; // Number of timeline steps visible on screen

  // 1. Capture snapshots whenever any logical state changes
  useEffect(() => {
    setHistory((prev) => {
      const next = [...prev, { a: inputA, b: inputB, out: output }];
      if (next.length > MAX_HISTORY) next.shift(); // Evict oldest step to scroll forward
      return next;
    });
  }, [inputA, inputB, output, gateType]);

  // Reset history if the user swaps gates entirely
  useEffect(() => {
    setHistory([{ a: inputA, b: inputB, out: output }]);
  }, [gateType]);

  // 2. Helper function to generate clean SVG square-wave path coordinates
  const generateWavePath = (key: keyof SignalSnapshot, rowYOffset: number) => {
    if (history.length === 0) return "";

    const stepWidth = 40; // Horizontal pixel spacing per tick
    const highY = rowYOffset + 5; // Logic 1 line placement
    const lowY = rowYOffset + 35; // Logic 0 line placement

    let path = `M 0 ${history[0][key] ? highY : lowY}`;

    for (let i = 0; i < history.length; i++) {
      const currState = history[i][key];
      const startX = i * stepWidth;
      const endX = (i + 1) * stepWidth;
      const targetY = currState ? highY : lowY;

      // Draw vertical transition line if state flipped, then horizontal trace line
      path += ` L ${startX} ${targetY} L ${endX} ${targetY}`;
    }
    return path;
  };

  const isSingleInput = gateType === "NOT";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-inner w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Live Logic Timing Diagram
        </h3>
        <span className="text-[10px] bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest animate-pulse">
          Live Waveform Trace
        </span>
      </div>

      {/* SVG Timeline Graph */}
      <div className="overflow-x-auto overflow-y-hidden bg-gray-950/80 p-4 rounded-lg border border-gray-800/60 relative">
        <svg
          viewBox="0 0 500 130"
          className="w-full h-auto min-w-115 overflow-visible"
        >
          {/* BACKGROUND TIMELINE GRID LINES */}
          {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480].map(
            (x, idx) => (
              <line
                key={idx}
                x1={x}
                y1="0"
                x2={x}
                y2="130"
                stroke="#1f2937"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ),
          )}

          {/* ROW 1: INPUT A TRACE */}
          <text
            x="5"
            y="28"
            className="font-mono text-[9px] font-bold fill-gray-500"
          >
            SIG A
          </text>
          <path
            d={generateWavePath("a", 0)}
            fill="none"
            strokeWidth="2.5"
            className="stroke-blue-500 transition-all duration-300 ease-out"
          />

          {/* ROW 2: INPUT B TRACE (Hidden for single-input NOT gates) */}
          {!isSingleInput && (
            <>
              <text
                x="5"
                y="68"
                className="font-mono text-[9px] font-bold fill-gray-500"
              >
                SIG B
              </text>
              <path
                d={generateWavePath("b", 40)}
                fill="none"
                strokeWidth="2.5"
                className="stroke-purple-500 transition-all duration-300 ease-out"
              />
            </>
          )}

          {/* ROW 3: OUTPUT TRACE */}
          <text
            x="5"
            y="108"
            className="font-mono text-[9px] font-bold fill-amber-500/70"
          >
            OUTPUT
          </text>
          <path
            d={generateWavePath("out", 80)}
            fill="none"
            strokeWidth="3"
            className="stroke-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)] transition-all duration-300 ease-out"
          />
        </svg>
      </div>

      <p className="text-[11px] text-gray-500 font-mono mt-3 text-right">
        Toggle input switches above to scroll waveform right-to-left →
      </p>
    </div>
  );
}
