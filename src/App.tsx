import { useState } from "react";
import { motion } from "framer-motion";
import AndGate from "./components/AndGate";
import OrGate from "./components/OrGate";
import NotGate from "./components/NotGate";
import TruthTable from "./components/TruthTable";
import TimingDiagram from "./components/TimingDiagram";
import BooleanFormula from "./components/BooleanFormula";

type ModuleType = "AND" | "OR" | "NOT" | "MUX" | "D-FF";

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>("AND");
  const modules: ModuleType[] = ["AND", "OR", "NOT", "MUX", "D-FF"];

  // LIFTED SHARED STATE FOR INPUTS
  const [gateInputA, setGateInputA] = useState<boolean>(false);
  const [gateInputB, setGateInputB] = useState<boolean>(false);

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
              onClick={() => setActiveModule(mod)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                activeModule === mod
                  ? "bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              {mod} Gate
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

            {/* Wrapping our workspace switch in App.tsx */}
            <motion.div
              key={activeModule} // Keeps track of when the module actually changes
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
            >
              {activeModule === "NOT" && (
                <NotGate inputA={gateInputA} setInputA={setGateInputA} />
              )}
              {activeModule === "AND" && (
                <AndGate
                  inputA={gateInputA}
                  inputB={gateInputB}
                  setInputA={setGateInputA}
                  setInputB={setGateInputB}
                />
              )}

              {activeModule === "OR" && (
                <OrGate
                  inputA={gateInputA}
                  inputB={gateInputB}
                  setInputA={setGateInputA}
                  setInputB={setGateInputB}
                />
              )}

              {activeModule !== "AND" &&
                activeModule !== "OR" &&
                activeModule !== "NOT" && (
                  <p className="text-gray-500 italic max-w-md mx-auto">
                    {activeModule} logic engine wrapper is ready. Waiting for
                    implementation!
                  </p>
                )}
            </motion.div>
          </div>
        </section>

        {/* ZONE 2: THE DATA & THEORY PANEL (RIGHT) */}
        {/* ZONE 2: THE DATA & THEORY PANEL (RIGHT) */}
        <section className="p-8 bg-gray-900/30 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-blue-400/70 tracking-widest uppercase block mb-2">
              Analysis & Documentation
            </span>
            <h2 className="text-2xl font-bold mb-6 text-gray-200">
              How the {activeModule} Circuit Works
            </h2>

            {/* RENDER DYNAMIC TRUTH TABLE & BOOLEAN METRICS */}
            {activeModule === "AND" ||
            activeModule === "OR" ||
            activeModule === "NOT" ? (
              <div className="flex flex-col gap-6">
                {/* NEW: Dynamic Algebraic Equation Reader */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Boolean Algebra
                  </h3>
                  <BooleanFormula
                    gateType={activeModule as "AND" | "OR" | "NOT"}
                    inputA={gateInputA}
                    inputB={gateInputB}
                  />
                </div>

                {/* Existing Live Truth Table */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Live Truth Table
                  </h3>
                  <TruthTable
                    currentA={gateInputA}
                    currentB={gateInputB}
                    gateType={activeModule as "AND" | "OR" | "NOT"}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <p className="text-gray-500 text-sm italic">
                  Analysis framework for {activeModule} coming soon...
                </p>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-600 font-mono border-t border-gray-800/60 pt-4">
            Current Input Matrix: A={gateInputA ? "1" : "0"}, B=
            {gateInputB ? "1" : "0"}
          </div>
        </section>
      </main>

      {/* NEW SECTION: TIMELINE FOOTER COMPONENT */}
      {(activeModule === 'AND' || activeModule === 'OR' || activeModule === 'NOT') && (
        <section className="bg-gray-950 border-t border-gray-800 p-6 w-full">
          <div className="max-w-7xl mx-auto">
            {/* Dynamic Output Calculation fed directly to chart telemetry */}
            <TimingDiagram 
              inputA={gateInputA} 
              inputB={gateInputB} 
              output={
                activeModule === 'AND' ? gateInputA && gateInputB :
                activeModule === 'OR' ? gateInputA || gateInputB : !gateInputA
              } 
              gateType={activeModule}
            />
          </div>
        </section>
      )}
    </div>
  );
}
