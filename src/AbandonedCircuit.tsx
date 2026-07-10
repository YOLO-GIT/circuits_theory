import { useState, useEffect, useCallback } from "react";

interface AbandonedCircuitProps {
  isRebooting: boolean;
  onSolve: () => void;
  onFailure: () => void;
  onLoreTrigger: () => void;
}

// ─── Gate logic ──────────────────────────────────────────────────────────────
type GateType = "AND" | "OR" | "NAND" | "NOR" | "XOR";
const GATE_POOL: GateType[] = ["AND", "OR", "NAND", "NOR", "XOR"];

function computeGate(gate: GateType, a: number, b: number): number {
  switch (gate) {
    case "AND":  return a & b;
    case "OR":   return a | b;
    case "NAND": return (a & b) ? 0 : 1;
    case "NOR":  return (a | b) ? 0 : 1;
    case "XOR":  return a ^ b;
  }
}

function randomBit(): number { return Math.random() < 0.5 ? 0 : 1; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

interface PuzzleState {
  gate1: GateType;
  gate2: GateType;
  inputA: number;
  inputB: number;
  inputC: number;
  mid: number;
  answer: number;
}

function generatePuzzle(): PuzzleState {
  const gate1 = pick(GATE_POOL);
  const gate2 = pick(GATE_POOL.filter((g) => g !== gate1));
  const inputA = randomBit();
  const inputB = randomBit();
  const inputC = randomBit();
  const mid    = computeGate(gate1, inputA, inputB);
  const answer = computeGate(gate2, mid, inputC);
  return { gate1, gate2, inputA, inputB, inputC, mid, answer };
}

// ─── Tiny sub-components ─────────────────────────────────────────────────────
function GateLabel({ name }: { name: GateType }) {
  return (
    <span className="font-black tracking-widest text-red-500 font-mono text-xs">{name}</span>
  );
}

function BitBadge({ value, dim = false }: { value: number; dim?: boolean }) {
  return (
    <span className={`font-mono font-black text-xs px-2 py-0.5 rounded border min-w-5 text-center inline-block ${
      dim
        ? "text-neutral-600 border-neutral-800 bg-black"
        : value === 1
          ? "text-red-400 border-red-900 bg-red-950/40 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
          : "text-neutral-400 border-neutral-800 bg-neutral-950"
    }`}>
      {value}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AbandonedCircuit({
  isRebooting,
  onSolve,
  onFailure,
  onLoreTrigger,
}: AbandonedCircuitProps) {
  const [drawProgress, setDrawProgress] = useState<number>(0);
  const [glitchText, setGlitchText] = useState<string>("AWAITING_INPUT");

  // Multi-tier progression tracking states
  const [puzzle, setPuzzle] = useState<PuzzleState | null>(null);
  const [wrongFlash, setWrongFlash] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [locked, setLocked]         = useState<boolean>(false);
  
  const [solvesStreak, setSolvesStreak] = useState<number>(0);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);

  // ── Autonomous drawing timer (always running) ─────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setDrawProgress((prev) => {
        if (prev >= 100) { clearInterval(timer); return 100; }
        return prev + 0.2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const isComplete = drawProgress >= 100;
  useEffect(() => {
    if (isComplete && !isRebooting && !isSolved) setGlitchText("S Y S T E M _ O V E R R I D E");
  }, [isComplete, isRebooting, isSolved]);

  // ── Generate puzzle when reboot starts ────────────────────────────────────
  useEffect(() => {
    if (isRebooting) {
      setPuzzle(generatePuzzle());
      setSolvesStreak(0);
      setWrongAttempts(0);
      setLocked(false);
      setWrongFlash(false);
      setIsSolved(false);
      setGlitchText("STAGE 1/3: COMPUTE_OR_DIE");
    }
  }, [isRebooting]);

  // ── Answer submission ─────────────────────────────────────────────────────
  const handleAnswer = useCallback((bit: 0 | 1) => {
    if (!puzzle || locked || isSolved || !isRebooting) return;

    if (bit === puzzle.answer) {
      const nextStreak = solvesStreak + 1;
      setSolvesStreak(nextStreak);
      setIsSolved(true);

      if (nextStreak >= 3) {
        setGlitchText("S Y S T E M _ O N L I N E");
        setTimeout(() => {
          onSolve();
        }, 600);
      } else {
        setGlitchText(`STAGE ${nextStreak}/3 COMPLETE`);
        setTimeout(() => {
          setPuzzle(generatePuzzle());
          setIsSolved(false);
          setGlitchText(`STAGE ${nextStreak + 1}/3: PARSING_CORE`);
        }, 800);
      }
    } else {
      const nextFailures = wrongAttempts + 1;
      setWrongAttempts(nextFailures);
      setWrongFlash(true);
      setLocked(true);

      if (nextFailures >= 5) {
        setTimeout(() => {
          onFailure();
        }, 300);
      } else {
        setTimeout(() => {
          setWrongFlash(false);
          setPuzzle(generatePuzzle()); 
          setLocked(false);
        }, 800);
      }
    }
  }, [puzzle, locked, isSolved, isRebooting, solvesStreak, wrongAttempts, onSolve, onFailure]);

  const handleTrapClick = () => {
    if (isRebooting || isComplete) return;
    setDrawProgress((prev) => Math.min(prev + 15, 100));
    const nightmares = ["V O I D", "N U L L", "E X C E P T I O N", "W A K E  U P", "6 6 6"];
    setGlitchText(nightmares[Math.floor(Math.random() * nightmares.length)]);
  };

  return (
    <div className={`p-8 rounded-2xl border flex flex-col items-center gap-6 w-full max-w-lg transition-all duration-500 ${
      wrongFlash
        ? "bg-red-900/60 border-red-500 shadow-[0_0_120px_rgba(220,38,38,0.6)]"
        : isSolved
          ? "bg-emerald-950/60 border-emerald-500 shadow-[0_0_120px_rgba(16,185,129,0.6)]"
          : isComplete
            ? "bg-red-950/40 border-red-900 shadow-[0_0_100px_rgba(220,38,38,0.3)] animate-pulse"
            : "bg-black border-neutral-900"
    }`}>

      {/* Status header */}
      <h3 className={`text-sm font-mono tracking-[0.3em] uppercase transition-colors duration-300 ${
        wrongFlash ? "text-red-300 font-black animate-bounce" :
        isSolved ? "text-emerald-400 font-black animate-pulse" :
        isRebooting ? "text-red-500 font-black animate-pulse" :
        isComplete  ? "text-red-600 font-black" : "text-neutral-700"
      }`}>
        {wrongFlash ? `SECURITY COMPROMISED — CORRUPTING` : glitchText}
      </h3>

      {/* ── PUZZLE DISPLAY ── */}
      {isRebooting && puzzle ? (
        <div className="w-full flex flex-col gap-6 animate-fade-in">

          {/* Clean Flowchart Circuit Diagram */}
          <div className="flex items-center justify-center gap-3 font-mono text-xs border border-neutral-900 bg-neutral-950/40 p-4 rounded-xl">
            
            {/* Stage 1: Inputs A & B */}
            <div className="flex flex-col gap-2 bg-black/40 p-2 border border-neutral-900/60 rounded-md">
              <div className="flex items-center gap-1.5 justify-between">
                <span className="text-neutral-500 text-2xs font-bold">IN_A</span>
                <BitBadge value={puzzle.inputA} />
              </div>
              <div className="flex items-center gap-1.5 justify-between">
                <span className="text-neutral-500 text-2xs font-bold">IN_B</span>
                <BitBadge value={puzzle.inputB} />
              </div>
            </div>

            <span className="text-red-900 font-bold select-none">▶</span>

            {/* Stage 2: Gate 1 node */}
            <div className="border border-red-950 bg-black min-w-17.5 py-3 text-center rounded-lg shadow-sm">
              <GateLabel name={puzzle.gate1} />
            </div>

            <span className="text-red-900 font-bold select-none">▶</span>

            {/* Stage 3: Gate 2 node paired with Input C */}
            <div className="flex flex-col gap-2">
              <div className="border border-red-950 bg-black min-w-17.5 py-2 text-center rounded-lg shadow-sm">
                <GateLabel name={puzzle.gate2} />
              </div>
              <div className="flex items-center gap-1.5 justify-between bg-black/40 p-1.5 border border-neutral-900/60 rounded-md">
                <span className="text-neutral-500 text-2xs font-bold">IN_C</span>
                <BitBadge value={puzzle.inputC} />
              </div>
            </div>

            <span className="text-red-900 font-bold select-none">▶</span>

            {/* Stage 4: Output Core Terminal */}
            <div className={`border rounded-xl w-12 h-12 flex items-center justify-center font-black text-xl transition-all duration-300 ${
              isSolved 
                ? "border-emerald-500 bg-emerald-950/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                : "border-red-900 bg-black text-red-600 animate-pulse shadow-[inset_0_0_10px_rgba(220,38,38,0.1)]"
            }`}>
              {isSolved ? puzzle.answer : "?"}
            </div>
          </div>

          {/* Balanced, Segmented Truth Tables Reference Matrix */}
          <div className="grid grid-cols-5 gap-0 text-[9px] font-mono border border-neutral-900 rounded-xl overflow-hidden bg-neutral-950/60">
            {(["AND","OR","NAND","NOR","XOR"] as GateType[]).map((g) => {
              const isActiveGate = g === puzzle.gate1 || g === puzzle.gate2;
              return (
                <div 
                  key={g} 
                  className={`text-center py-2 px-1 border-r last:border-r-0 border-neutral-900/50 transition-colors ${
                    isActiveGate ? "bg-red-950/20 text-red-400 font-bold" : "text-neutral-600 opacity-60"
                  }`}
                >
                  <div className={`font-black mb-1 border-b pb-0.5 border-neutral-900/40 tracking-wider ${isActiveGate ? "text-red-500" : ""}`}>
                    {g}
                  </div>
                  <div className="space-y-0.5 text-[8px]">
                    <div>0·0={computeGate(g,0,0)}</div>
                    <div>0·1={computeGate(g,0,1)}</div>
                    <div>1·0={computeGate(g,1,0)}</div>
                    <div>1·1={computeGate(g,1,1)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clean Control Frame & Indicators Layout */}
          <div className="flex flex-col items-center gap-4 border-t border-neutral-900/40 pt-4">
            <div className="flex gap-12 text-2xs font-mono tracking-widest uppercase text-neutral-500">
              <div>CORE_STREAK: <span className="text-red-400 font-bold">{solvesStreak} / 3</span></div>
              <div>MALFUNCTIONS: <span className="text-red-700 font-bold">{wrongAttempts} / 5</span></div>
            </div>
            
            <div className="flex gap-6">
              {([0, 1] as const).map((bit) => (
                <button
                  key={bit}
                  onClick={() => handleAnswer(bit)}
                  disabled={locked || isSolved}
                  className={`w-24 h-12 rounded-xl font-mono font-black text-xl border transition-all duration-200 ${
                    locked || isSolved
                      ? "opacity-20 cursor-not-allowed border-neutral-900 text-neutral-800 bg-neutral-950"
                      : bit === puzzle.answer && isSolved
                        ? "border-emerald-500 text-emerald-400 bg-emerald-950/40"
                        : "border-red-900 text-red-500 bg-black hover:bg-red-950/30 hover:text-red-400 hover:border-red-600 active:scale-95 cursor-pointer"
                  }`}
                >
                  {bit}
                </button>
              ))}
            </div>
          </div>
        </div>

      ) : (
        /* ── PRE-REBOOT: Cryptic drawing canvas ── */
        <>
          <svg viewBox="0 0 300 200" className="w-full max-w-70 overflow-visible">

            <circle
              cx="150" cy="100" r="15"
              fill="transparent"
              className="cursor-help hover:fill-red-500/10 transition-colors"
              onClick={onLoreTrigger}
            />

            <g
              fill="none"
              stroke={isComplete ? "#dc2626" : "#7f1d1d"}
              strokeWidth={isComplete ? "3" : "2"}
              className="transition-all duration-300"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 100 - drawProgress,
                filter: isComplete ? "drop-shadow(0 0 8px rgba(220,38,38,0.8))" : "none",
              }}
            >
              <path pathLength="100" d="M 150,20 L 230,150 L 70,150 Z" />
              <path pathLength="100" d="M 150,180 L 70,50 L 230,50 Z" />
              <circle pathLength="100" cx="150" cy="100" r="35" />
              <circle pathLength="100" cx="150" cy="100" r="10" fill={isComplete ? "#dc2626" : "none"} />
              <path pathLength="100" d="M 150,20 V 180" />
              <path pathLength="100" d="M 70,50 L 230,150" />
              <path pathLength="100" d="M 70,150 L 230,50" />
            </g>
          </svg>

          <div className="flex items-end gap-6 w-full justify-center opacity-80">
            {(["A", "B"] as const).map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="text-2xs font-mono text-neutral-600 uppercase tracking-widest">
                  Input {i}
                </span>
                <button
                  onClick={handleTrapClick}
                  className={`w-16 h-11 rounded font-mono font-bold border transition-all ${
                    isComplete
                      ? "bg-red-950 text-red-700 border-red-900 pointer-events-none"
                      : "bg-black text-neutral-400 border-neutral-800 hover:border-red-900 hover:text-red-500 cursor-pointer"
                  }`}
                >
                  {isComplete ? "Ø" : `${label}: 0`}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}