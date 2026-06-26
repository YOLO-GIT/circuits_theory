import { motion } from "framer-motion";

interface TruthTableProps {
  currentA: boolean;
  currentB: boolean;
  currentSelect?: boolean; // Optional parameter for MUX line mapping
  gateType: "AND" | "OR" | "NOT" | "MUX"| "NAND" | "NOR";
}

export default function TruthTable({ currentA, currentB, currentSelect = false, gateType }: TruthTableProps) {
  const isSingleInput = gateType === "NOT";
  const isMux = gateType === "MUX";

  // 1. Build appropriate base matrix array
  let baseRows: Array<{ a: boolean; b: boolean; s?: boolean }> = [];

  if (isSingleInput) {
    baseRows = [{ a: false, b: false }, { a: true, b: false }];
  } else if (isMux) {
    // Generate full 3-variable logic spectrum (8 rows)
    baseRows = [
      { a: false, b: false, s: false }, { a: false, b: false, s: true },
      { a: false, b: true, s: false },  { a: false, b: true, s: true },
      { a: true, b: false, s: false },  { a: true, b: false, s: true },
      { a: true, b: true, s: false },   { a: true, b: true, s: true },
    ];
  } else {
    // NAND and NOR fall back here perfectly to get their standard 4-row layouts!
    baseRows = [{ a: false, b: false }, { a: false, b: true }, { a: true, b: false }, { a: true, b: true }];
  }

  // 2. Compute dynamic outputs and match active selector rows
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
      output = !row.a;
      isRowActive = row.a === currentA;
    } else if (gateType === "MUX") {
      output = row.s ? row.b : row.a;
      isRowActive = row.a === currentA && row.b === currentB && row.s === currentSelect;
    
    // === NEW: NAND ROW CALCULATION ===
    } else if (gateType === "NAND") {
      output = !(row.a && row.b);
      isRowActive = row.a === currentA && row.b === currentB;

    // === NEW: NOR ROW CALCULATION ===
    } else if (gateType === "NOR") {
      output = !(row.a || row.b);
      isRowActive = row.a === currentA && row.b === currentB;
    }

    return { ...row, output, isRowActive };
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-inner font-mono text-sm">
      
      {/* Responsive Grid Column Header */}
      <div className={`grid text-gray-500 border-b border-gray-800/80 uppercase text-xs tracking-wider text-center pb-3 mb-2 ${
        isMux ? "grid-cols-4" : isSingleInput ? "grid-cols-2" : "grid-cols-3"
      }`}>
        <div>Input A</div>
        {!isSingleInput && <div>Input B</div>}
        {isMux && <div>Select S</div>}
        <div className="text-amber-500 font-bold">Output</div>
      </div>

      {/* Row Mapping Interface */}
      <div className="flex flex-col gap-0.5 max-h-65 overflow-y-auto pr-1 mux_part">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className={`grid text-center py-2 relative items-center rounded-lg transition-colors ${
              isMux ? "grid-cols-4" : isSingleInput ? "grid-cols-2" : "grid-cols-3"
            } ${row.isRowActive ? "bg-gray-800/30" : ""}`}
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
            {isMux && <div className={`z-10 relative ${row.s ? "text-pink-400" : "text-gray-400"}`}>{row.s ? "1" : "0"}</div>}
            
            <div className={`z-10 relative ${row.isRowActive ? "text-amber-400 font-bold" : "text-gray-500"}`}>
              {row.output ? "1" : "0"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}