import type { ReactNode } from "react";

interface BooleanFormulaProps {
  gateType: "AND" | "OR" | "NOT" | "MUX" | "NAND" | "NOR";
  inputA: boolean;
  inputB: boolean;
  selectLine?: boolean;
}

// Renders its children with a true horizontal overbar, the standard notation
// for Boolean complement (e.g. the bar over "A • B" in "(A • B)‾"). Using
// `overline` instead of a trailing prime/apostrophe matches textbook algebra.
function Bar({ children }: { children: ReactNode }) {
  return <span className="[text-decoration:overline] decoration-2 pt-0.5">{children}</span>;
}

const bit = (v: boolean) => (v ? "1" : "0");

export default function BooleanFormula({ gateType, inputA, inputB, selectLine = false }: BooleanFormulaProps) {
  const valA = bit(inputA);
  const valB = bit(inputB);
  const valS = bit(selectLine);

  let expression: ReactNode = "";
  let evaluation: ReactNode = "";
  let engineeringNote: ReactNode = "";

  if (gateType === "AND") {
    const out = inputA && inputB;
    expression = "Y = A • B";
    evaluation = `Y = ${valA} • ${valB} = ${bit(out)}`;
    engineeringNote = !out
      ? "Annihilation Law: Any variable multiplied by 0 is forced to 0."
      : "Identity Law: Output is 1 only when all inputs are 1.";
  } else if (gateType === "OR") {
    const out = inputA || inputB;
    expression = "Y = A + B";
    evaluation = `Y = ${valA} + ${valB} = ${bit(out)}`;
    engineeringNote = out
      ? "Dominance Law: Any variable added to 1 forces the output to 1."
      : "Identity Law: Output remains 0 because no signal is present.";
  } else if (gateType === "NOT") {
    const out = !inputA;
    expression = <>Y = <Bar>A</Bar></>;
    evaluation = <>Y = <Bar>{valA}</Bar> = {bit(out)}</>;
    engineeringNote = "Inversion Law: The output state is completely out of phase with the input.";
  } else if (gateType === "MUX") {
    const out = selectLine ? inputB : inputA;
    expression = <>Y = <Bar>A•S</Bar> + B•S</>;
    evaluation = `Y = (${valA}•${selectLine ? "0" : "1"}) + (${valB}•${valS}) = ${bit(out)}`;
    engineeringNote = selectLine
      ? `Data Select: S = 1 isolates Channel B. Output mirrors Input B (${valB}), completely disregarding Input A.`
      : `Data Select: S = 0 isolates Channel A. Output mirrors Input A (${valA}), completely disregarding Input B.`;
  } else if (gateType === "NAND") {
    const out = !(inputA && inputB);
    expression = <>Y = <Bar>(A • B)</Bar></>;
    evaluation = <>Y = <Bar>({valA} • {valB})</Bar> = {bit(out)}</>;
    engineeringNote = !out
      ? "Universal Logic: Both inputs are high, driving the internal silicon channels straight to ground (0)."
      : "Universal Logic: At least one input is open, preventing ground termination and keeping the output pulled HIGH (1).";
  } else if (gateType === "NOR") {
    const out = !(inputA || inputB);
    expression = <>Y = <Bar>(A + B)</Bar></>;
    evaluation = <>Y = <Bar>({valA} + {valB})</Bar> = {bit(out)}</>;
    engineeringNote = !out
      ? "Universal Logic: A high signal on either line instantly clamps the inverted output structure to 0."
      : "Universal Logic: Absolute quiet state (all inputs 0) allows the voltage rail to safely express a 1 at the output.";
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-inner flex flex-col gap-4">
      <div>
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-1">
          Algebraic Expression
        </span>
        <div className="text-2xl font-mono font-bold text-amber-500 tracking-wide">
          {expression}
        </div>
      </div>
      <div className="border-t border-gray-800/60 pt-3">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-1">
          Live Evaluation
        </span>
        <div className="text-xl font-mono font-bold text-blue-400 tracking-wide">
          {evaluation}
        </div>
      </div>
      <div className="text-xs text-gray-400 font-sans italic bg-gray-950/40 p-3 rounded-lg border border-gray-800/40 mt-1">
        <span className="text-amber-500/80 font-semibold not-italic block mb-0.5">
          Theory Insight:
        </span>
        {engineeringNote}
      </div>
    </div>
  );
}