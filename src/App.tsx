import { useEffect, useRef, useState } from "react";
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
import SystemOverride from "./SystemOverride";

type ModuleType = "AND" | "OR" | "NOT" | "MUX" | "D-FF" | "NAND" | "NOR";

const SILICON_CAPABLE: ModuleType[] = ["AND", "OR", "NOT", "NAND", "NOR"];
const ARG_PASSWORD = "042171";
const PASSWORD_LENGTH = 6;

export default function App() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleType>("AND");

  const modules: ModuleType[] = ["AND", "OR", "NOT", "NAND", "NOR", "MUX", "D-FF"];

  const [gateInputA, setGateInputA] = useState<boolean>(false);
  const [gateInputB, setGateInputB] = useState<boolean>(false);
  const [selectLine, setSelectLine] = useState(false);

  const [showSiliconLayer, setShowSiliconLayer] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  // ARG GATE STATES
  // Step 1: D-FF nightmare mode unlocks the header as a clickable trigger
  const [isHeaderUnlocked, setIsHeaderUnlocked] = useState<boolean>(false);
  // Step 2: clicking the unlocked header shows the password modal
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  // Step 3: correct password flips isAbandoned → ARG screen
  const [isAbandoned, setIsAbandoned] = useState<boolean>(false);

  // 👻 MUX TRAP: once MUX is selected, all other nav buttons vanish permanently
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(false);

  // Password input state: array of 6 single-digit strings
  const [digits, setDigits] = useState<string[]>(Array(PASSWORD_LENGTH).fill(""));
  const [passwordShake, setPasswordShake] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const digitRefs = useRef<Array<HTMLInputElement | null>>(Array(PASSWORD_LENGTH).fill(null));

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

  // Close About modal on Escape
  useEffect(() => {
    if (!showAbout) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAbout(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showAbout]);

  // Close password modal on Escape and reset its state cleanly
  useEffect(() => {
    if (!showPasswordModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClosePassword();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPasswordModal]);

  const handleClosePassword = () => {
    setShowPasswordModal(false);
    setDigits(Array(PASSWORD_LENGTH).fill(""));
    setPasswordError(false);
  };

  // Called by DFlipFlop when nightmare mode activates (5th secret CLK click)
  const handleNightmareMode = () => {
    setIsHeaderUnlocked(true);
    setIsNavCollapsed(true);  // Collapse nav to D-FF only the moment nightmare fires
  };

  // Called when the user clicks the title — only works after nightmare mode
  const handleTitleClick = () => {
    if (!isHeaderUnlocked) return;
    setDigits(Array(PASSWORD_LENGTH).fill(""));
    setPasswordError(false);
    setShowPasswordModal(true);
    // Focus the first digit input after the modal animates in
    setTimeout(() => digitRefs.current[0]?.focus(), 150);
  };

  // Handle typing into each digit box
  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digits 0-9
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setPasswordError(false);

    // Auto-advance focus to the next box when a digit is entered
    if (char && index < PASSWORD_LENGTH - 1) {
      digitRefs.current[index + 1]?.focus();
    }

    // Auto-submit once all 6 digits are filled
    if (char && index === PASSWORD_LENGTH - 1) {
      const full = [...next].join("");
      if (full.length === PASSWORD_LENGTH) validatePassword(full);
    }
  };

  // Handle backspace — clear current box and move focus back
  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        digitRefs.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      }
    }
  };

  const validatePassword = (attempt: string) => {
    if (attempt === ARG_PASSWORD) {
      setShowPasswordModal(false);
      setIsAbandoned(true);
    } else {
      // Wrong: shake the modal and highlight the boxes red, then clear
      setPasswordShake(true);
      setPasswordError(true);
      setTimeout(() => {
        setPasswordShake(false);
        setDigits(Array(PASSWORD_LENGTH).fill(""));
        setPasswordError(false);
        digitRefs.current[0]?.focus();
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans antialiased pt-33 lg:pt-18.25">
      {isAbandoned ? (
        <SystemOverride onDefuse={() => setIsAbandoned(false)} />
      ) : (
        <>
          <motion.header
            className="bg-gray-900/90 border-b border-gray-800 px-4 py-4 flex flex-col lg:flex-row gap-4 justify-between items-center fixed top-0 left-0 right-0 z-40 backdrop-blur-md"
            animate={{
              y: headerHidden ? "-100%" : "0%",
              opacity: headerHidden ? 0 : 1,
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
              <h1
                onClick={handleTitleClick}
                className={`text-base md:text-xl font-bold tracking-wider whitespace-nowrap transition-all ${
                  isHeaderUnlocked
                    // Nightmare mode active: red glow + pulse to hint it's now a portal
                    ? "text-red-500 cursor-pointer animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    : "text-amber-500"
                }`}
              >
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
                {isNavCollapsed ? (
                  // Once nightmare mode fires, collapse to a static D-FF-only label
                  <div className="w-full inline-flex items-center text-amber-500 bg-gray-800 border border-gray-700 font-medium rounded-lg text-sm px-4 py-2.5">
                    Active Workspace: D-FF
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <nav className="hidden lg:flex gap-2">
                {modules
                  .filter((mod) => !isNavCollapsed || mod === "D-FF")
                  .map((mod) => (
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
                  {activeModule === "D-FF" && (
                    <DFlipFlop onNightmareMode={handleNightmareMode} />
                  )}
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
                          <SiliconLayout gateType={activeModule} inputA={gateInputA} inputB={gateInputB} />
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
                      <li>• <span className="text-blue-400">Isolated Lane:</span> Changing data input <span className="text-blue-400">(D)</span> alone has zero effect on the system output.</li>
                      <li>• <span className="text-emerald-400">Clock Sync (0 → 1):</span> State variables are locked in to output <span className="text-amber-500">Q</span> ONLY during a microsecond clock transition step.</li>
                      <li>• <span className="text-purple-400">Steady Capture:</span> Once the edge pass completes, the values are frozen safely in memory.</li>
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
          {activeModule !== "D-FF" && activeModule !== "MUX" && (
            <section className="bg-gray-950 border-t border-gray-800 p-4 md:p-6 w-full">
              <div className="max-w-7xl mx-auto overflow-hidden">
                <TimingDiagram
                  inputA={gateInputA}
                  inputB={gateInputB}
                  output={
                    activeModule === "AND" ? gateInputA && gateInputB :
                    activeModule === "OR" ? gateInputA || gateInputB :
                    activeModule === "NOT" ? !gateInputA :
                    activeModule === "NAND" ? !(gateInputA && gateInputB) :
                    activeModule === "NOR" ? !(gateInputA || gateInputB) :
                    selectLine ? gateInputB : gateInputA
                  }
                  gateType={activeModule}
                />
              </div>
            </section>
          )}

          {/* ABOUT MODAL */}
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
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 md:p-6 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-base md:text-lg font-bold text-amber-500 tracking-wide">About</h2>
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

          {/* ARG PASSWORD MODAL */}
          <AnimatePresence>
            {showPasswordModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                onClick={handleClosePassword}
              >
                <motion.div
                  // Shake animation on wrong password
                  animate={passwordShake ? {
                    x: [-8, 8, -8, 8, -4, 4, 0],
                    transition: { duration: 0.5 }
                  } : {}}
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-black border border-red-900 rounded-xl p-6 max-w-sm w-full shadow-[0_0_60px_rgba(220,38,38,0.2)] font-mono"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-2xs text-red-900 tracking-[0.3em] uppercase mb-0.5">
                        Authorization Required
                      </p>
                      <h2 className="text-sm font-black text-red-600 tracking-widest uppercase">
                        ACCESS TERMINAL
                      </h2>
                    </div>
                    <button
                      onClick={handleClosePassword}
                      className="p-1 text-red-900 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 6 digit boxes */}
                  <div className="flex gap-2 justify-center mb-4">
                    {digits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { digitRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(i, e)}
                        className={`w-10 h-12 text-center text-lg font-black rounded border bg-black transition-all outline-none focus:ring-1 ${
                          passwordError
                            ? "border-red-500 text-red-500 focus:ring-red-500"
                            : digit
                              ? "border-red-700 text-red-400 focus:ring-red-700"
                              : "border-red-950 text-red-800 focus:ring-red-900"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {passwordError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-2xs text-red-600 text-center tracking-widest uppercase mb-4"
                      >
                        Access Denied — Invalid Credentials
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    onClick={() => validatePassword(digits.join(""))}
                    disabled={digits.some((d) => d === "")}
                    className="w-full py-2 bg-red-950 border border-red-800 text-red-400 hover:bg-red-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-bold tracking-widest uppercase"
                  >
                    Authenticate
                  </button>

                  <p className="text-[9px] text-red-950 text-center mt-3 tracking-wider">
                    UNAUTHORIZED ACCESS WILL BE LOGGED
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}