import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Activity, Info, Layers, X } from "lucide-react";
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

const SILICON_CAPABLE: ModuleType[] = ["AND", "OR", "NOT", "NAND", "NOR"];

export default function App() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleType>("AND");
  
  const modules: ModuleType[] = [
    "AND",
    "OR",
    "NOT",
    "NAND",
    "NOR",
    "MUX",
    "D-FF",
  ];

  // LIFTED SHARED STATE FOR INPUTS
  const [gateInputA, setGateInputA] = useState<boolean>(false);
  const [gateInputB, setGateInputB] = useState<boolean>(false);
  const [selectLine, setSelectLine] = useState(false);

  // SILICON WAFER DISPLAY STATE
  const [showSiliconLayer, setShowSiliconLayer] = useState<boolean>(false);

  // ABOUT MODAL STATE
  const [showAbout, setShowAbout] = useState<boolean>(false);

  // SCROLL-HIDE LOGIC
  const { scrollY } = useScroll();
  const [headerHidden, setHeaderHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > 150) {
      setHeaderHidden(true);
    } else {
      setHeaderHidden(false);
    }
  });

  useEffect(() => {
    if (!showAbout) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAbout(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showAbout]);

 return (
  <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans antialiased pt-33 lg:pt-18.25">
    
    <motion.header
      className="bg-gray-900/90 border-b border-gray-800 px-4 py-4 flex flex-col lg:flex-row gap-4 justify-between items-center fixed top-0 left-0 right-0 z-40 backdrop-blur-md"
      animate={{
        y: headerHidden ? "-100%" : "0%",
        opacity: headerHidden ? 0 : 1,
      }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
        <h1 className="text-base md:text-xl font-bold tracking-wider text-amber-500 whitespace-nowrap">
          ⚡ CIRCUIT THEORY ANALYZER
        </h1>
        <button
          onClick={() => setShowAbout(true)}
          aria-label="About this app"
          className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-gray-800 transition-all focus:outline-none"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full lg:w-auto relative">
        <div className="block lg:hidden w-full">
          <button
            id="dropdownDefaultButton"
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full inline-flex items-center justify-between text-gray-200 bg-gray-800 border border-gray-700 hover:bg-gray-700 focus:ring-4 focus:ring-amber-500/20 font-medium rounded-lg text-sm px-4 py-2.5 text-left focus:outline-none transition-all"
          >
            <span>
              Active Workspace: {activeModule}{" "}
              {activeModule === "D-FF" ? "" : "Gate"}
            </span>
            <svg
              className={`w-4 h-4 ms-1.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 9-7 7-7-7"
              />
            </svg>
          </button>

          {/* Flowbite Dropdown Menu Panel */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              <div className="absolute left-0 right-0 mt-2 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                <ul className="p-2 text-sm text-gray-300 font-medium space-y-1">
                  {modules.map((mod) => (
                    <li key={mod}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModule(mod);
                          setShowSiliconLayer(false);
                          setIsDropdownOpen(false);
                        }}
                        className={`inline-flex items-center w-full p-2.5 rounded-md text-left transition-all text-xs font-mono uppercase tracking-wider ${
                          activeModule === mod
                            ? "bg-amber-500 text-gray-950 font-bold"
                            : "hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {mod} {mod === "D-FF" ? "" : "Gate"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <nav className="hidden lg:flex gap-2">
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => {
                setActiveModule(mod);
                setShowSiliconLayer(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap ${
                activeModule === mod
                  ? "bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              {mod} {mod === "D-FF" ? "" : "Gate"}
            </button>
          ))}
        </nav>
      </div>
    </motion.header>

      {/* MAIN SYSTEM LAYOUT */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
        {/* ZONE 1: INTERACTIVE WORKSPACE (LEFT) */}
        <section className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-80 md:min-h-100 bg-gray-950/50">
          <div className="text-center w-full flex flex-col items-center">
            <span className="text-2xs md:text-xs font-mono text-amber-500/70 tracking-widest uppercase block mb-1">
              Interactive Workspace
            </span>
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight mb-6 md:mb-8">
              {activeModule} Logic Simulation
            </h2>

            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center items-center"
            >
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
              {activeModule === "NOT" && (
                <NotGate inputA={gateInputA} setInputA={setGateInputA} />
              )}
              {activeModule === "MUX" && (
                <MuxGate
                  inputA={gateInputA}
                  inputB={gateInputB}
                  selectLine={selectLine}
                  setInputA={setGateInputA}
                  setInputB={setGateInputB}
                  setSelectLine={setSelectLine}
                />
              )}
              {activeModule === "NAND" && (
                <NandGate
                  inputA={gateInputA}
                  inputB={gateInputB}
                  setInputA={setGateInputA}
                  setInputB={setGateInputB}
                />
              )}
              {activeModule === "NOR" && (
                <NorGate
                  inputA={gateInputA}
                  inputB={gateInputB}
                  setInputA={setGateInputA}
                  setInputB={setGateInputB}
                />
              )}
              {activeModule === "D-FF" && <DFlipFlop />}
            </motion.div>
          </div>
        </section>

        {/* ZONE 2: ANALYSIS INTERFACES (RIGHT) */}
        <section className="p-4 sm:p-6 lg:p-8 bg-gray-900/30 flex flex-col justify-between gap-6">
          <div>
            <span className="text-2xs md:text-xs font-mono text-blue-400/70 tracking-widest uppercase block mb-1">
              Analysis & Documentation
            </span>
            <h2 className="text-lg md:text-2xl font-bold mb-4 text-gray-200">
              How the {activeModule === "D-FF" ? "D Flip-Flop" : activeModule}{" "}
              Circuit Works
            </h2>

            {SILICON_CAPABLE.includes(activeModule) && (
              <div className="flex bg-gray-950/80 p-1 rounded-lg border border-gray-800/80 mb-6 gap-1 w-full max-w-xs">
                <button
                  onClick={() => setShowSiliconLayer(false)}
                  className={`flex items-center justify-center gap-2 flex-1 py-1.5 rounded text-[11px] md:text-xs font-mono font-bold transition-all ${
                    !showSiliconLayer
                      ? "bg-amber-500 text-gray-950 shadow-sm"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Logic Math</span>
                </button>
                <button
                  onClick={() => setShowSiliconLayer(true)}
                  className={`flex items-center justify-center gap-2 flex-1 py-1.5 rounded text-[11px] md:text-xs font-mono font-bold transition-all ${
                    showSiliconLayer
                      ? "bg-blue-500 text-gray-950 shadow-sm"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Silicon Wafers</span>
                </button>
              </div>
            )}

            {activeModule !== "D-FF" ? (
              <motion.div layout className="flex flex-col gap-6">
                <AnimatePresence mode="popLayout">
                  {showSiliconLayer ? (
                    <motion.div
                      key="silicon"
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SiliconLayout
                        gateType={activeModule}
                        inputA={gateInputA}
                        inputB={gateInputB}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="logic-math"
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-6"
                    >
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                          Boolean Algebra
                        </h3>
                        <BooleanFormula
                          gateType={activeModule as any}
                          inputA={gateInputA}
                          inputB={gateInputB}
                          selectLine={selectLine}
                        />
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
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
              </motion.div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6 mb-6 flex flex-col gap-4">
                <h3 className="text-xs md:text-sm font-semibold text-amber-500 uppercase tracking-wider">
                  Edge-Triggered Sequential Mode
                </h3>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                  The <strong>D Flip-Flop</strong> serves as the core foundation
                  for CPU registry files and system cache memory cells.
                </p>
                <ul className="text-[11px] md:text-xs font-mono text-gray-400 space-y-2 bg-gray-950/50 p-3 md:p-4 rounded-lg border border-gray-800/60">
                  <li>
                    • <span className="text-blue-400">Isolated Lane:</span>{" "}
                    Changing data input{" "}
                    <span className="text-blue-400">(D)</span> alone has zero
                    effect on the system output.
                  </li>
                  <li>
                    •{" "}
                    <span className="text-emerald-400">
                      Clock Sync (0 → 1):
                    </span>{" "}
                    State variables are locked in to output{" "}
                    <span className="text-amber-500">Q</span> ONLY during a
                    microsecond clock transition step.
                  </li>
                  <li>
                    • <span className="text-purple-400">Steady Capture:</span>{" "}
                    Once the edge pass completes, the values are frozen safely
                    in memory.
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="text-2xs md:text-xs text-gray-600 font-mono border-t border-gray-800/60 pt-4 mt-4">
            {activeModule === "D-FF" ? (
              <span>Sequential State Mode Active</span>
            ) : (
              <span>
                Current Input Matrix: A={gateInputA ? "1" : "0"}, B=
                {gateInputB ? "1" : "0"}
                {activeModule === "MUX" && `, S=${selectLine ? "1" : "0"}`}
              </span>
            )}
          </div>
        </section>
      </main>

      {/* TIMELINE TIMING GRAPH */}
      {(activeModule !== "D-FF" && activeModule !== "MUX") && (
        <section className="bg-gray-950 border-t border-gray-800 p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto overflow-hidden">
            <TimingDiagram
              inputA={gateInputA}
              inputB={gateInputB}
              output={
                activeModule === "AND"
                  ? gateInputA && gateInputB
                  : activeModule === "OR"
                    ? gateInputA || gateInputB
                    : activeModule === "NOT"
                      ? !gateInputA
                      : activeModule === "NAND"
                        ? !(gateInputA && gateInputB)
                        : activeModule === "NOR"
                          ? !(gateInputA || gateInputB)
                          : selectLine
                            ? gateInputB
                            : gateInputA
              }
              gateType={activeModule}
            />
          </div>
        </section>
      )}

      {/* ABOUT MODAL WINDOW */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 md:p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-base md:text-lg font-bold text-amber-500 tracking-wide">
                  About
                </h2>
                <button
                  onClick={() => setShowAbout(false)}
                  aria-label="Close"
                  className="p-1 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                Circuit Theory Analyzer is an interactive playground for
                exploring how logic gates work — from Boolean algebra down to
                the transistor level.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}