import { useState } from "react";
import AndGate from "./components/AndGate";

// Define the available modules
type ModuleType = "AND" | "OR" | "NOT" | "MUX" | "D-FF";

export default function App() {
  // State to track which module the user is looking at
  const [activeModule, setActiveModule] = useState<ModuleType>("AND");

  const modules: ModuleType[] = ["AND", "OR", "NOT", "MUX", "D-FF"];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* --- TOP NAVIGATION BAR --- */}
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

      {/* --- MAIN SPLIT-SCREEN CONTENT --- */}
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

            {/* RENDER THE CORRESPONDING LOGIC ENGINE */}
            {activeModule === "AND" && <AndGate />}

            {activeModule !== "AND" && (
              <p className="text-gray-500 italic max-w-md mx-auto">
                {activeModule} logic engine wrapper is ready. Waiting for
                implementation!
              </p>
            )}
          </div>
        </section>

        {/* ZONE 2: THE DATA & THEORY PANEL (RIGHT) */}
        <section className="p-8 bg-gray-900/30 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-blue-400/70 tracking-widest uppercase block mb-2">
              Analysis & Documentation
            </span>
            <h2 className="text-2xl font-bold mb-6 text-gray-200">
              How the {activeModule} Circuit Works
            </h2>

            {/* Placeholder for Truth Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Truth Table
              </h3>
              <p className="text-gray-500 text-sm italic">
                Truth table matrix for {activeModule} logic coming next...
              </p>
            </div>
          </div>

          {/* Quick Footer inside the panel */}
          <div className="text-xs text-gray-600 font-mono border-t border-gray-800/60 pt-4">
            Current Module State: activeModule = "{activeModule}"
          </div>
        </section>
      </main>
    </div>
  );
}
