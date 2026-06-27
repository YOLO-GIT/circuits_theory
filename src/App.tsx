import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Layers } from "lucide-react"; // Imported clean Lucide icons
import AndGate from "./components/AndGate";
import OrGate from "./components/OrGate";
import NotGate from "./components/NotGate";
import NandGate from "./components/NandGate";
import NorGate from "./components/NorGate";
import TruthTable from "./components/TruthTable";
import TimingDiagram from "./components/TimingDiagram";
import BooleanFormula from "./components/BooleanFormula";
import MuxGate from "./components/MuxGate";
import DFlipFlop from "./components/DFlipFlop";
import SiliconLayout from "./components/SiliconLayout";

type ModuleType = "AND" | "OR" | "NOT" | "MUX" | "D-FF" | "NAND" | "NOR";

// Modules that have both a Logic Math view and a Silicon Wafers view.
// Lives outside the component since it never changes across renders.
const SILICON_CAPABLE: ModuleType[] = ["AND", "OR", "NOT", "NAND", "NOR"];

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>("AND");

  const modules: ModuleType[] = ["AND", "OR", "NOT", "NAND", "NOR", "MUX", "D-FF"];

  // LIFTED SHARED STATE FOR INPUTS
  const [gateInputA, setGateInputA] = useState<boolean>(false);
  const [gateInputB, setGateInputB] = useState<boolean>(false);
  const [selectLine, setSelectLine] = useState(false);

  // SILICON WAFER DISPLAY STATE
  const [showSiliconLayer, setShowSiliconLayer] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* HEADER NAV */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider text-amber-500">
          ⚡ CIRCUIT THEORY ANALYZER
        </h1>
        <nav className="flex gap-2">
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => {
                setActiveModule(mod);
                setShowSiliconLayer(false); // Reset view on switch for safety
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                activeModule === mod
                  ? "bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              {mod} {mod === "D-FF" ? "" : "Gate"}
            </button>
          ))}
        </nav>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">

        {/* ZONE 1: THE INTERACTIVE CIRCUITS (LEFT) */}
        <section className="p-8 flex flex-col items-center justify-center min-h-100 bg-gray-950/50">
          <div className="text-center w-full flex flex-col items-center">
            <span className="text-xs font-mono text-amber-500/70 tracking-widest uppercase block mb-2">
              Interactive Workspace
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mb-8">
              {activeModule} Logic Simulation
            </h2>

            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
            >
              {activeModule === "AND" && (
                <AndGate inputA={gateInputA} inputB={gateInputB} setInputA={setGateInputA} setInputB={setGateInputB} />
              )}
              {activeModule === "OR" && (
                <OrGate inputA={gateInputA} inputB={gateInputB} setInputA={setGateInputA} setInputB={setGateInputB} />
              )}
              {activeModule === "NOT" && (
                <NotGate inputA={gateInputA} setInputA={setGateInputA} />
              )}
              {activeModule === "MUX" && (
                <MuxGate inputA={gateInputA} inputB={gateInputB} selectLine={selectLine} setInputA={setGateInputA} setInputB={setGateInputB} setSelectLine={setSelectLine} />
              )}
              {activeModule === "NAND" && (
                <NandGate inputA={gateInputA} inputB={gateInputB} setInputA={setGateInputA} setInputB={setGateInputB} />
              )}
              {activeModule === "NOR" && (
                <NorGate inputA={gateInputA} inputB={gateInputB} setInputA={setGateInputA} setInputB={setGateInputB} />
              )}
              {activeModule === "D-FF" && <DFlipFlop />}
            </motion.div>
          </div>
        </section>

        {/* ZONE 2: THE DATA & THEORY PANEL (RIGHT) */}
        <section className="p-8 bg-gray-900/30 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-blue-400/70 tracking-widest uppercase block mb-2">
              Analysis & Documentation
            </span>
            <h2 className="text-2xl font-bold mb-4 text-gray-200">
              How the {activeModule === "D-FF" ? "D Flip-Flop" : activeModule} Circuit Works
            </h2>

            {SILICON_CAPABLE.includes(activeModule) && (
              <div className="flex bg-gray-950/80 p-1 rounded-lg border border-gray-800/80 mb-6 gap-1 w-full max-w-xs">
                <button
                  onClick={() => setShowSiliconLayer(false)}
                  className={`flex items-center justify-center gap-2 flex-1 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                    !showSiliconLayer ? "bg-amber-500 text-gray-950 shadow-sm" : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Logic Math</span>
                </button>
                <button
                  onClick={() => setShowSiliconLayer(true)}
                  className={`flex items-center justify-center gap-2 flex-1 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                    showSiliconLayer ? "bg-blue-500 text-gray-950 shadow-sm" : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Silicon Wafers</span>
                </button>
              </div>
            )}

            {/* Every module except D-FF uses the math/truth-table panel */}
            {activeModule !== "D-FF" ? (
              <div className="flex flex-col gap-6">

                {/* showSiliconLayer can only be true for AND/OR/NOT/NAND/NOR — the toggle
                    button that sets it true only renders for those modules, and switching
                    modules always resets it to false. No need to re-check activeModule here. */}
                <AnimatePresence mode="wait">
                  {showSiliconLayer ? (
                    <motion.div
                      key="silicon"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SiliconLayout gateType={activeModule} inputA={gateInputA} inputB={gateInputB} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="logic-math"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-6"
                    >
                      {/* Dynamic Algebraic Equation Reader */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          Boolean Algebra
                        </h3>
                        <BooleanFormula
                          gateType={activeModule as any}
                          inputA={gateInputA}
                          inputB={gateInputB}
                          selectLine={selectLine}
                        />
                      </div>

                      {/* Live Truth Table Matrix */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          Live Truth Table
                        </h3>
                        <TruthTable
                          currentA={gateInputA}
                          currentB={gateInputB}
                          currentSelect={selectLine}
                          gateType={activeModule as any}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* D-FF INFOPANEL CONTAINER OVERLAY */
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">
                  Edge-Triggered Sequential Mode
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The <strong>D Flip-Flop</strong> serves as the core foundation
                  for CPU registry files and system cache memory cells.
                </p>
                <ul className="text-xs font-mono text-gray-400 space-y-2 bg-gray-950/50 p-4 rounded-lg border border-gray-800/60">
                  <li>• <span className="text-blue-400">Isolated Lane:</span> Changing data input <span className="text-blue-400">(D)</span> alone has zero effect on the system output.</li>
                  <li>• <span className="text-emerald-400">Clock Sync (0 → 1):</span> State variables are locked in to output <span className="text-amber-500">Q</span> ONLY during a microsecond clock transition step.</li>
                  <li>• <span className="text-purple-400">Steady Capture:</span> Once the edge pass completes, the values are frozen safely in memory.</li>
                </ul>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-600 font-mono border-t border-gray-800/60 pt-4">
            {activeModule === "D-FF" ? (
              <span>Sequential State Mode Active</span>
            ) : (
              <span>
                Current Input Matrix: A={gateInputA ? "1" : "0"}, B={gateInputB ? "1" : "0"}
                {activeModule === "MUX" && `, S=${selectLine ? "1" : "0"}`}
              </span>
            )}
          </div>
        </section>
      </main>

      {/* TIMELINE FOOTER COMPONENT */}
      {activeModule !== "D-FF" && (
        <section className="bg-gray-950 border-t border-gray-800 p-6 w-full">
          <div className="max-w-7xl mx-auto">
            {/* This section only renders when activeModule !== "D-FF" (see wrapping condition
                above), so every case here is reachable and the chain is exhaustive over the
                remaining module types — no fallback needed. */}
            <TimingDiagram
              inputA={gateInputA}
              inputB={gateInputB}
              output={
                activeModule === "AND" ? gateInputA && gateInputB :
                activeModule === "OR" ? gateInputA || gateInputB :
                activeModule === "NOT" ? !gateInputA :
                activeModule === "NAND" ? !(gateInputA && gateInputB) :
                activeModule === "NOR" ? !(gateInputA || gateInputB) :
                selectLine ? gateInputB : gateInputA // MUX, the only remaining case
              }
              gateType={activeModule}
            />
          </div>
        </section>
      )}
    </div>
  );
}