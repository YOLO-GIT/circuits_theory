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
    <span className="font-black tracking-widest text-red-500 font-mono">{name}</span>
  );
}

function BitBadge({ value, dim = false }: { value: number; dim?: boolean }) {
  return (
    <span className={`font-mono font-black text-sm px-1.5 py-0.5 rounded border ${
      dim
        ? "text-neutral-600 border-neutral-800 bg-black"
        : value === 1
          ? "text-red-400 border-red-900 bg-red-950/40"
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
        // Master Goal Reached
        setGlitchText("S Y S T E M _ O N L I N E");
        setTimeout(() => {
          onSolve();
        }, 600);
      } else {
        // Stage completed successfully -> advance puzzle
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
        // Trigger catastrophic jumpscare
        setTimeout(() => {
          onFailure();
        }, 300);
      } else {
        setTimeout(() => {
          setWrongFlash(false);
          setPuzzle(generatePuzzle()); // Anti-bruteforce rotation
          setLocked(false);
        }, 800);
      }
    }
  }, [puzzle, locked, isSolved, isRebooting, solvesStreak, wrongAttempts, onSolve, onFailure]);

  // ── Pre-reboot input toggle (the "trap" mode from before) ─────────────────
  const handleTrapClick = () => {
    if (isRebooting || isComplete) return;
    setDrawProgress((prev) => Math.min(prev + 15, 100));
    const nightmares = ["V O I D", "N U L L", "E X C E P T I O N", "W A K E  U P", "6 6 6"];
    setGlitchText(nightmares[Math.floor(Math.random() * nightmares.length)]);
  };

  return (
    <div className={`p-8 rounded-2xl border flex flex-col items-center gap-8 w-full max-w-lg transition-all duration-500 ${
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
        <div className="w-full flex flex-col gap-6">

          {/* Chain diagram */}
          <div className="flex items-center justify-center gap-2 flex-wrap font-mono text-xs">
            <div className="flex flex-col gap-1 items-end">
              <div className="flex items-center gap-1">
                <span className="text-neutral-600">A =</span>
                <BitBadge value={puzzle.inputA} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-neutral-600">B =</span>
                <BitBadge value={puzzle.inputB} />
              </div>
            </div>

            <span className="text-neutral-700">──▶</span>

            <div className="border border-red-900 bg-red-950/20 rounded px-3 py-2 text-center">
              <GateLabel name={puzzle.gate1} />
            </div>

            <span className="text-neutral-700">──▶</span>

            <div className="flex flex-col gap-1 items-start">
              <div className="border border-red-900 bg-red-950/20 rounded px-3 py-2 text-center">
                <GateLabel name={puzzle.gate2} />
              </div>
              <div className="flex items-center gap-1 text-2xs mt-0.5">
                <span className="text-neutral-600">C =</span>
                <BitBadge value={puzzle.inputC} />
              </div>
            </div>

            <span className="text-neutral-700">──▶</span>

            <div className={`border rounded px-3 py-2 font-black text-lg transition-colors ${
              isSolved 
                ? "border-emerald-700 bg-emerald-950/30 text-emerald-400" 
                : "border-red-900 bg-black text-red-800 animate-pulse"
            }`}>
              {isSolved ? puzzle.answer : "?"}
            </div>
          </div>

          {/* Truth Tables */}
          <div className="grid grid-cols-5 gap-1 text-[9px] font-mono text-neutral-700 border border-neutral-900 rounded p-2 bg-neutral-950/60">
            {(["AND","OR","NAND","NOR","XOR"] as GateType[]).map((g) => (
              <div key={g} className={`text-center ${g === puzzle.gate1 || g === puzzle.gate2 ? "text-red-800" : ""}`}>
                <div className="font-bold mb-0.5">{g}</div>
                <div>0·0={computeGate(g,0,0)}</div>
                <div>0·1={computeGate(g,0,1)}</div>
                <div>1·0={computeGate(g,1,0)}</div>
                <div>1·1={computeGate(g,1,1)}</div>
              </div>
            ))}
          </div>

          {/* Controls / Info indicators */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-8 text-2xs font-mono tracking-wider uppercase text-neutral-500">
              <div>PROGRESS: <span className="text-red-500 font-bold">{solvesStreak}/3 SOLVED</span></div>
              <div>ATTEMPTS: <span className="text-red-600 font-bold">{wrongAttempts}/5 FAILED</span></div>
            </div>
            <div className="flex gap-6">
              {([0, 1] as const).map((bit) => (
                <button
                  key={bit}
                  onClick={() => handleAnswer(bit)}
                  disabled={locked || isSolved}
                  className={`w-20 h-14 rounded-lg font-mono font-black text-2xl border transition-all ${
                    locked || isSolved
                      ? "opacity-30 cursor-not-allowed border-neutral-900 text-neutral-800 bg-neutral-950"
                      : bit === puzzle.answer && isSolved
                        ? "border-emerald-500 text-emerald-400 bg-emerald-950/40"
                        : "border-red-900 text-red-600 bg-black hover:bg-red-950/40 hover:text-red-400 hover:border-red-600 cursor-pointer"
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