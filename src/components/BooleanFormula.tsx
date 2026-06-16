interface BooleanFormulaProps {
  gateType: "AND" | "OR" | "NOT" | "MUX"; // Added MUX
  inputA: boolean;
  inputB: boolean;
  selectLine?: boolean; // Added select parameter
}

export default function BooleanFormula({ gateType, inputA, inputB, selectLine = false }: BooleanFormulaProps) {
  const valA = inputA ? "1" : "0";
  const valB = inputB ? "1" : "0";
  const valS = selectLine ? "1" : "0";

  let expression = "";
  let evaluation = "";
  let engineeringNote = "";

  if (gateType === "AND") {
    // ... your existing AND code ...
    expression = "Y = A • B";
    evaluation = `Y = ${valA} • ${valB} = ${inputA && inputB ? "1" : "0"}`;
    engineeringNote = !inputA || !inputB ? "Annihilation Law: Any variable multiplied by 0 is forced to 0." : "Identity Law: Output is 1 only when all inputs are 1.";
  } else if (gateType === "OR") {
    // ... your existing OR code ...
    expression = "Y = A + B";
    evaluation = `Y = ${valA} + ${valB} = ${inputA || inputB ? "1" : "0"}`;
    engineeringNote = inputA || inputB ? "Dominance Law: Any variable added to 1 forces the output to 1." : "Identity Law: Output remains 0 because no signal is present.";
  } else if (gateType === "NOT") {
    // ... your existing NOT code ...
    expression = "Y = A'";
    evaluation = `Y = ${valA}' = ${!inputA ? "1" : "0"}`;
    engineeringNote = `Inversion Law: The output state is completely out of phase with the input.`;
  } else if (gateType === "MUX") {
    expression = "Y = A•S' + B•S";
    const outVal = selectLine ? inputB : inputA;
    evaluation = `Y = (${valA}•${selectLine ? "0" : "1"}) + (${valB}•${valS}) = ${outVal ? "1" : "0"}`;
    engineeringNote = selectLine
      ? `Data Select: S = 1 isolates Channel B. Output mirrors Input B (${valB}), completely disregarding Input A.`
      : `Data Select: S = 0 isolates Channel A. Output mirrors Input A (${valA}), completely disregarding Input B.`;
  }

  // ... return code stays identical ...
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-inner flex flex-col gap-4">
      <div>
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-1">Algebraic Expression</span>
        <div className="text-2xl font-mono font-bold text-amber-500 tracking-wide">{expression}</div>
      </div>
      <div className="border-t border-gray-800/60 pt-3">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-1">Live Evaluation</span>
        <div className="text-xl font-mono font-bold text-blue-400 tracking-wide">{evaluation}</div>
      </div>
      <div className="text-xs text-gray-400 font-sans italic bg-gray-950/40 p-3 rounded-lg border border-gray-800/40 mt-1">
        <span className="text-amber-500/80 font-semibold not-italic block mb-0.5">Theory Insight:</span>
        {engineeringNote}
      </div>
    </div>
  );
}