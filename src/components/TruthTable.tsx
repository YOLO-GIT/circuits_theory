import { motion } from "framer-motion";

interface TruthTableProps {
  currentA: boolean;
  currentB: boolean;
  gateType: "AND" | "OR";
}

export default function TruthTable({ currentA, currentB, gateType }: TruthTableProps) {
  const rows = [
    { a: false, b: false },
    { a: false, b: true },
    { a: true, b: false },
    { a: true, b: true },
  ].map((row) => {
    const output = gateType === "AND" ? row.a && row.b : row.a || row.b;
    const isRowActive = row.a === currentA && row.b === currentB;

    return { ...row, output, isRowActive };
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-inner font-mono text-sm">
      
      {/* 1. TABLE HEADER USING GRID */}
      <div className="grid grid-cols-3 text-gray-500 border-b border-gray-800/80 uppercase text-xs tracking-wider text-center pb-3 mb-2">
        <div>Input A</div>
        <div>Input B</div>
        <div className="text-amber-500 font-bold">Output</div>
      </div>

      {/* 2. TABLE BODY ROWS */}
      <div className="flex flex-col gap-1">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 text-center py-3 relative items-center rounded-lg"
          >
            {/* The sliding background now works flawlessly without displacing content */}
            {row.isRowActive && (
              <motion.div
                layoutId="activeRowIndicator"
                className="absolute inset-0 bg-amber-500/10 border-l-4 border-amber-500 pointer-events-none rounded-r-lg"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            <div className="z-10 relative text-gray-300">{row.a ? "1" : "0"}</div>
            <div className="z-10 relative text-gray-300">{row.b ? "1" : "0"}</div>
            <div
              className={`z-10 relative ${
                row.isRowActive ? "text-amber-400 font-bold" : "text-gray-500"
              }`}
            >
              {row.output ? "1" : "0"}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}