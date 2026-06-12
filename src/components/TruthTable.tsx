import { motion } from "framer-motion";

interface TruthTableProps {
  currentA: boolean;
  currentB: boolean;
  gateType: "AND" | "OR" | "NOT"; // Added "NOT" here
}

export default function TruthTable({ currentA, currentB, gateType }: TruthTableProps) {
  const isSingleInput = gateType === "NOT";

  // 1. Generate rows conditionally based on input count
  const baseRows = isSingleInput 
    ? [{ a: false, b: false }, { a: true, b: false }] // Only care about A for NOT
    : [{ a: false, b: false }, { a: false, b: true }, { a: true, b: false }, { a: true, b: true }];

  const rows = baseRows.map((row) => {
    let output = false;
    let isRowActive = false;

    if (gateType === "AND") {
      output = row.a && row.b;
      isRowActive = row.a === currentA && row.b === currentB;
    } else if (gateType === "OR") {
      output = row.a || row.b;
      isRowActive = row.a === currentA && row.b === currentB;
    } else if (gateType === "NOT") {
      output = !row.a; // Logic Inversion Engine
      isRowActive = row.a === currentA;
    }

    return { ...row, output, isRowActive };
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-inner font-mono text-sm">
      
      {/* Dynamic Column Grid Header */}
      <div className={`grid text-gray-500 border-b border-gray-800/80 uppercase text-xs tracking-wider text-center pb-3 mb-2 ${
        isSingleInput ? "grid-cols-2" : "grid-cols-3"
      }`}>
        <div>Input A</div>
        {!isSingleInput && <div>Input B</div>}
        <div className="text-amber-500 font-bold">Output</div>
      </div>

      {/* Table Body Rows */}
      <div className="flex flex-col gap-1">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className={`grid text-center py-3 relative items-center rounded-lg ${
              isSingleInput ? "grid-cols-2" : "grid-cols-3"
            }`}
          >
            {row.isRowActive && (
              <motion.div
                layoutId="activeRowIndicator"
                className="absolute inset-0 bg-amber-500/10 border-l-4 border-amber-500 pointer-events-none rounded-r-lg"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            <div className="z-10 relative text-gray-300">{row.a ? "1" : "0"}</div>
            {!isSingleInput && <div className="z-10 relative text-gray-300">{row.b ? "1" : "0"}</div>}
            
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