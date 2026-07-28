import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

function Bar({ children }: { children: ReactNode }) {
  return (
    <span className="[text-decoration:overline] decoration-2 pt-0.5">
      {children}
    </span>
  );
}

interface DFlipFlopProps {
  onNightmareMode?: () => void;
}

interface WaveformPoint {
  d: number;
  clk: number;
  q: number;
  qBar: number;
}

export default function DFlipFlop({ onNightmareMode }: DFlipFlopProps) {
  const [d, setD] = useState<boolean>(false);
  const [q, setQ] = useState<boolean>(false);
  const [isClockActive, setIsClockActive] = useState<boolean>(false);

  // Auto-Clock Generator State
  const [autoClockSpeed, setAutoClockSpeed] = useState<number>(0); // 0 = Off, 1 = 1Hz, 2 = 2Hz

  // Secret Easter Egg & Hard State Registers
  const [anomalyClicks, setAnomalyClicks] = useState<number>(0);
  const [isNightmareMode, setIsNightmareMode] = useState<boolean>(false);

  const [isSystemBricked, setIsSystemBricked] = useState<boolean>(() => {
    return localStorage.getItem("system_override_locked_out") === "true";
  });
  const [isSystemSecured, setIsSystemSecured] = useState<boolean>(() => {
    return localStorage.getItem("system_override_won") === "true";
  });

  const notQ = !q;
  const isSecretDisabled = isSystemBricked || isSystemSecured;

  // Waveform History Buffer (25 samples max)
  const MAX_SAMPLES = 24;
  const [history, setHistory] = useState<WaveformPoint[]>(() =>
    Array(MAX_SAMPLES).fill({ d: 0, clk: 0, q: 0, qBar: 1 }),
  );

  // Helper to append points to history
  const pushWaveformSample = useCallback(
    (sampleD: boolean, sampleClk: boolean, sampleQ: boolean) => {
      setHistory((prev) => {
        const next = [...prev.slice(1)];
        next.push({
          d: sampleD ? 1 : 0,
          clk: sampleClk ? 1 : 0,
          q: sampleQ ? 1 : 0,
          qBar: sampleQ ? 0 : 1,
        });
        return next;
      });
    },
    [],
  );

  const systemTitle = isSystemBricked
    ? "ELEMENT_OFFLINE // HARDWARE_DEGRADED"
    : isSystemSecured
      ? "Sequential Element: D Flip-Flop [ SECURED ]"
      : isNightmareMode
        ? "F A T A L   L O G I C   E R R O R"
        : "Sequential Element: D Flip-Flop";

  // Clock Pulse Trigger
  const triggerClockPulse = useCallback(() => {
    if (isNightmareMode || isSystemBricked) return;

    setIsClockActive(true);
    setQ(d);
    pushWaveformSample(d, true, d);

    setTimeout(() => {
      setIsClockActive(false);
      pushWaveformSample(d, false, d);
    }, 200);
  }, [d, isNightmareMode, isSystemBricked, pushWaveformSample]);

  // Handle Input D Toggle
  const toggleD = () => {
    if (isNightmareMode || isSystemBricked) return;
    const newD = !d;
    setD(newD);
    pushWaveformSample(newD, isClockActive, q);
  };

  // Auto Clock Generator Interval
  useEffect(() => {
    if (autoClockSpeed === 0 || isNightmareMode || isSystemBricked) return;

    const intervalMs = autoClockSpeed === 1 ? 1000 : 500;
    const autoInterval = setInterval(() => {
      triggerClockPulse();
    }, intervalMs);

    return () => clearInterval(autoInterval);
  }, [autoClockSpeed, isNightmareMode, isSystemBricked, triggerClockPulse]);

  // Secret Click Easter Egg
  const handleSecretClick = () => {
    if (isSecretDisabled) return;

    if (anomalyClicks === 4) {
      setIsNightmareMode(true);
      onNightmareMode?.();
    } else {
      setAnomalyClicks((prev) => prev + 1);
    }
  };

  // Nightmare Glitch Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isNightmareMode && !isSystemBricked) {
      interval = setInterval(() => {
        setIsClockActive((prev) => !prev);
        const randomD = Math.random() > 0.5;
        const randomQ = Math.random() > 0.5;
        setD(randomD);
        setQ(randomQ);
        pushWaveformSample(randomD, Math.random() > 0.5, randomQ);
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isNightmareMode, isSystemBricked, pushWaveformSample]);

  // Sync state registers from local storage
  useEffect(() => {
    const checkStateRegisters = () => {
      if (localStorage.getItem("system_override_locked_out") === "true")
        setIsSystemBricked(true);
      if (localStorage.getItem("system_override_won") === "true")
        setIsSystemSecured(true);
    };
    const checkInterval = setInterval(checkStateRegisters, 1000);
    return () => clearInterval(checkInterval);
  }, []);

  // Helper to render SVG Waveform Step Lines
  const renderWaveformPath = (
    key: keyof WaveformPoint,
    yHigh: number,
    yLow: number,
  ) => {
    const stepWidth = 280 / (MAX_SAMPLES - 1);
    let pathD = `M 0,${history[0][key] ? yHigh : yLow}`;

    for (let i = 1; i < history.length; i++) {
      const prevVal = history[i - 1][key];
      const currVal = history[i][key];
      const x = i * stepWidth;
      const currY = currVal ? yHigh : yLow;

      if (prevVal !== currVal) {
        pathD += ` H ${x} V ${currY}`;
      } else {
        pathD += ` H ${x}`;
      }
    }
    return pathD;
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 select-none">
      {/* UPPER CONTAINER: MAIN INTERACTIVE SIMULATION & WAVEFORM ANALYZER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: DFF SIMULATOR CARD */}
        <div
          className={`lg:col-span-6 p-6 sm:p-8 rounded-2xl border flex flex-col items-center justify-between gap-6 transition-all duration-1000 ${
            isSystemBricked
              ? "bg-stone-950/20 border-stone-900 opacity-20 pointer-events-none grayscale"
              : isSystemSecured
                ? "bg-gray-950/60 border-emerald-950/50 shadow-[0_0_30px_rgba(16,185,129,0.03)]"
                : isNightmareMode
                  ? "bg-red-950/80 border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-pulse"
                  : "bg-gray-900/40 border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]"
          }`}
        >
          {/* Dynamic Header Titles */}
          <h3
            className={`text-xs sm:text-sm font-mono uppercase tracking-widest text-center transition-colors duration-500 ${
              isSystemBricked
                ? "text-stone-700 line-through font-normal tracking-normal italic"
                : isSystemSecured
                  ? "text-emerald-600 font-bold tracking-wide"
                  : isNightmareMode
                    ? "text-red-500 font-black animate-bounce"
                    : "text-gray-400"
            }`}
          >
            {systemTitle}
          </h3>

          {/* D Flip-Flop Circuit Diagram */}
          <svg
            viewBox="0 0 300 160"
            className="w-full max-w-xs overflow-visible relative"
          >
            {/* Input Wires */}
            <path
              d="M 10,45 L 80,45"
              fill="none"
              stroke={
                isSystemBricked
                  ? "#1c1917"
                  : isNightmareMode
                    ? "#dc2626"
                    : d
                      ? "#3b82f6"
                      : "#4b5563"
              }
              strokeWidth="3"
            />
            <path
              d="M 10,115 L 80,115"
              fill="none"
              stroke={
                isSystemBricked
                  ? "#1c1917"
                  : isNightmareMode
                    ? "#991b1b"
                    : isClockActive
                      ? "#10b981"
                      : "#4b5563"
              }
              strokeWidth="3"
            />

            {/* Output Wires */}
            <path
              d="M 200,45 L 270,45"
              fill="none"
              stroke={
                isSystemBricked
                  ? "#1c1917"
                  : isNightmareMode
                    ? "#dc2626"
                    : q
                      ? "#f59e0b"
                      : "#4b5563"
              }
              strokeWidth="3"
            />
            <path
              d="M 200,115 L 270,115"
              fill="none"
              stroke={
                isSystemBricked
                  ? "#1c1917"
                  : isNightmareMode
                    ? "#dc2626"
                    : notQ
                      ? "#f59e0b"
                      : "#4b5563"
              }
              strokeWidth="3"
            />

            {/* Flip-Flop Block Body */}
            <rect
              x="80"
              y="20"
              width="120"
              height="120"
              fill={
                isSystemBricked
                  ? "#0c0a09"
                  : isNightmareMode
                    ? "#450a0a"
                    : "#111827"
              }
              stroke={
                isSystemBricked
                  ? "#292524"
                  : isNightmareMode
                    ? "#dc2626"
                    : "#4b5563"
              }
              strokeWidth="3"
              rx="8"
            />

            {/* Internal Dynamic Clock Triangle */}
            <path
              d="M 80,105 L 95,115 L 80,125"
              fill={
                isSystemBricked ? "none" : isNightmareMode ? "#dc2626" : "none"
              }
              stroke={
                isSystemBricked
                  ? "#292524"
                  : isNightmareMode
                    ? "#dc2626"
                    : "#4b5563"
              }
              strokeWidth="2"
            />

            {/* Signal Pin Text Labels */}
            <text
              x="95"
              y="52"
              fill={
                isSystemBricked
                  ? "#44403c"
                  : isNightmareMode
                    ? "#f87171"
                    : "#9ca3af"
              }
              className="font-mono text-xs font-bold"
            >
              D
            </text>
            <text
              x="102"
              y="120"
              fill={
                isSystemBricked
                  ? "#44403c"
                  : isNightmareMode
                    ? "#f87171"
                    : "#9ca3af"
              }
              className="font-mono text-2xs font-bold"
            >
              CLK
            </text>
            <text
              x="175"
              y="52"
              fill={
                isSystemBricked
                  ? "#44403c"
                  : isNightmareMode
                    ? "#f87171"
                    : "#9ca3af"
              }
              className="font-mono text-xs font-bold"
            >
              Q
            </text>
            <text
              x="175"
              y="120"
              fill={
                isSystemBricked
                  ? "#44403c"
                  : isNightmareMode
                    ? "#f87171"
                    : "#9ca3af"
              }
              className="font-mono text-xs font-bold [text-decoration:overline] decoration-2"
            >
              Q
            </text>

            {/* Secret Hitbox */}
            {!isSecretDisabled && (
              <rect
                x="70"
                y="90"
                width="60"
                height="40"
                fill="transparent"
                className="cursor-pointer"
                onClick={handleSecretClick}
                aria-label="Hidden trigger location"
              />
            )}
          </svg>

          {/* Interactive Control Buttons */}
          <div className="flex flex-wrap items-end gap-3 sm:gap-4 w-full justify-center">
            {/* Data Input Toggle */}
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`text-2xs font-mono uppercase tracking-wider whitespace-nowrap ${isSystemBricked ? "text-stone-700" : isNightmareMode ? "text-red-700 font-bold" : "text-gray-500"}`}
              >
                Data Input
              </span>
              <button
                onClick={toggleD}
                disabled={isNightmareMode || isSystemBricked}
                className={`w-12 sm:w-14 h-10 rounded-lg font-mono font-bold border transition-all ${
                  isSystemBricked
                    ? "bg-stone-950 text-stone-800 border-stone-900 cursor-not-allowed"
                    : isNightmareMode
                      ? "bg-red-900 text-red-300 border-red-700 pointer-events-none"
                      : d
                        ? "bg-blue-500 text-gray-950 border-blue-400 cursor-pointer shadow-md shadow-blue-500/20"
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600 cursor-pointer"
                }`}
              >
                D:{" "}
                {isSystemBricked ? "×" : isNightmareMode ? "6" : d ? "1" : "0"}
              </button>
            </div>

            {/* Manual Pulse Trigger */}
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`text-2xs font-mono uppercase tracking-wider whitespace-nowrap ${isSystemBricked ? "text-stone-700" : isNightmareMode ? "text-red-700 font-bold" : "text-gray-500"}`}
              >
                Trigger Edge
              </span>
              <button
                onClick={triggerClockPulse}
                disabled={isNightmareMode || isSystemBricked}
                className={`px-3 sm:px-4 h-10 min-w-25 rounded-lg font-mono text-xs font-bold tracking-wide border transition-all whitespace-nowrap ${
                  isSystemBricked
                    ? "bg-stone-950 text-stone-800 border-stone-900 cursor-not-allowed"
                    : isNightmareMode
                      ? "bg-black text-red-600 border-red-800 shadow-xl shadow-red-900/50"
                      : isClockActive
                        ? "bg-emerald-500 text-gray-950 border-emerald-400 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        : "bg-gray-800 text-emerald-400 border-gray-700 hover:bg-gray-700 cursor-pointer"
                }`}
              >
                {isSystemBricked
                  ? "[ INERT ]"
                  : isNightmareMode
                    ? "☠ OVERRIDE ☠"
                    : isClockActive
                      ? "⚡ RISING"
                      : "CLK PULSE"}
              </button>
            </div>

            {/* Auto Clock Generator Toggle */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xs font-mono uppercase tracking-wider text-gray-500 whitespace-nowrap">
                Oscillator
              </span>
              <button
                onClick={() => setAutoClockSpeed((prev) => (prev + 1) % 3)}
                disabled={isNightmareMode || isSystemBricked}
                className={`px-2.5 h-10 rounded-lg font-mono text-[11px] font-bold border transition-all ${
                  autoClockSpeed > 0
                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-600 animate-pulse"
                    : "bg-gray-800/80 text-gray-400 border-gray-700 hover:border-gray-600"
                }`}
              >
                {autoClockSpeed === 0
                  ? "AUTO: OFF"
                  : autoClockSpeed === 1
                    ? "AUTO: 1Hz"
                    : "AUTO: 2Hz"}
              </button>
            </div>

            {/* State Out Box */}
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`text-2xs font-mono uppercase tracking-wider whitespace-nowrap ${isSystemBricked ? "text-stone-700" : isNightmareMode ? "text-red-700 font-bold" : "text-gray-500"}`}
              >
                State Out
              </span>
              <div
                className={`flex gap-3 px-3 h-10 items-center rounded-xl border font-mono text-xs sm:text-sm transition-colors ${
                  isSystemBricked
                    ? "bg-stone-950/20 border-stone-900 text-stone-800"
                    : isNightmareMode
                      ? "bg-red-950/90 border-red-700 text-red-500"
                      : "bg-gray-950/60 border-gray-800/80"
                }`}
              >
                <div>
                  <span
                    className={
                      isSystemBricked
                        ? "text-stone-700"
                        : isNightmareMode
                          ? "text-red-700 font-bold"
                          : "text-gray-500 font-bold"
                    }
                  >
                    Q:
                  </span>{" "}
                  <span
                    className={
                      isSystemBricked
                        ? "text-stone-800 font-bold"
                        : isNightmareMode
                          ? "text-red-500 font-black animate-pulse"
                          : q
                            ? "text-amber-400 font-black"
                            : "text-gray-600"
                    }
                  >
                    {isSystemBricked
                      ? "Ø"
                      : isNightmareMode
                        ? "6"
                        : q
                          ? "1"
                          : "0"}
                  </span>
                </div>
                <div
                  className={`w-px h-3.5 ${isSystemBricked ? "bg-stone-900" : isNightmareMode ? "bg-red-900" : "bg-gray-800"}`}
                />
                <div>
                  <span
                    className={
                      isSystemBricked
                        ? "text-stone-700"
                        : isNightmareMode
                          ? "text-red-700 font-bold"
                          : "text-gray-500 font-bold"
                    }
                  >
                    <Bar>Q</Bar>:
                  </span>{" "}
                  <span
                    className={
                      isSystemBricked
                        ? "text-stone-800 font-bold"
                        : isNightmareMode
                          ? "text-red-500 font-black animate-pulse"
                          : notQ
                            ? "text-amber-400 font-black"
                            : "text-gray-600"
                    }
                  >
                    {isSystemBricked
                      ? "Ø"
                      : isNightmareMode
                        ? "6"
                        : notQ
                          ? "1"
                          : "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME LOGIC ANALYZER / OSCILLOSCOPE */}
        <div className="lg:col-span-6 p-6 rounded-2xl border border-gray-800 bg-gray-900/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                Digital Logic Analyzer
              </h4>
            </div>
            <span className="text-2xs font-mono text-gray-500">
              SAMPLE RATE: REAL-TIME
            </span>
          </div>

          {/* SVG Waveform Visualizer */}
          <div className="relative w-full bg-gray-950/80 rounded-xl p-4 border border-gray-800/80 overflow-hidden">
            <svg
              viewBox="0 0 280 180"
              className="w-full h-auto overflow-visible"
            >
              {/* Background Horizontal Grid Lines */}
              <line
                x1="0"
                y1="20"
                x2="280"
                y2="20"
                stroke="#1f2937"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="65"
                x2="280"
                y2="65"
                stroke="#1f2937"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="110"
                x2="280"
                y2="110"
                stroke="#1f2937"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="155"
                x2="280"
                y2="155"
                stroke="#1f2937"
                strokeDasharray="3 3"
              />

              {/* Lane Labels */}
              <text
                x="5"
                y="15"
                fill="#3b82f6"
                className="font-mono text-[9px] font-bold"
              >
                D (Data Input)
              </text>
              <text
                x="5"
                y="60"
                fill="#10b981"
                className="font-mono text-[9px] font-bold"
              >
                CLK (Trigger Edge)
              </text>
              <text
                x="5"
                y="105"
                fill="#f59e0b"
                className="font-mono text-[9px] font-bold"
              >
                Q (Stored State)
              </text>
              <text
                x="5"
                y="150"
                fill="#d97706"
                className="font-mono text-[9px] font-bold"
              >
                Q̄ (Inverted State)
              </text>

              {/* Channel 1: D Signal */}
              <path
                d={renderWaveformPath("d", 22, 38)}
                fill="none"
                stroke={isNightmareMode ? "#dc2626" : "#3b82f6"}
                strokeWidth="2"
              />

              {/* Channel 2: CLK Signal */}
              <path
                d={renderWaveformPath("clk", 67, 83)}
                fill="none"
                stroke={isNightmareMode ? "#dc2626" : "#10b981"}
                strokeWidth="2"
              />

              {/* Channel 3: Q Signal */}
              <path
                d={renderWaveformPath("q", 112, 128)}
                fill="none"
                stroke={isNightmareMode ? "#dc2626" : "#f59e0b"}
                strokeWidth="2"
              />

              {/* Channel 4: QBar Signal */}
              <path
                d={renderWaveformPath("qBar", 157, 173)}
                fill="none"
                stroke={isNightmareMode ? "#dc2626" : "#d97706"}
                strokeWidth="2"
              />
            </svg>
          </div>

          <p className="text-[11px] font-mono text-gray-500 leading-relaxed">
            <span className="text-gray-400 font-semibold">
              Waveform Behavior:
            </span>{" "}
            Logic outputs (<span className="text-amber-400 font-bold">Q</span>)
            update on the rising clock edge (
            <span className="text-emerald-400 font-bold">CLK 0→1</span>).
            Changing data (<span className="text-blue-400 font-bold">D</span>)
            while clock is steady will have no immediate output effect.
          </p>
        </div>
      </div>

      {/* LOWER CONTAINER: DYNAMIC STATE TRANSITION MATRIX */}
      <div className="p-3 sm:p-6 rounded-2xl border border-gray-800 bg-gray-900/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-3 sm:mb-4 flex items-center gap-2">
          <span>State Transition & Mode Matrix</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-2xs sm:text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-[9px] sm:text-[11px] whitespace-nowrap">
                <th className="pb-2 pr-1 sm:pr-2">
                  <span className="hidden sm:inline">CLOCK TRANSITION</span>
                  <span className="sm:hidden">CLK</span>
                </th>
                <th className="pb-2 px-1 sm:px-2">
                  <span className="hidden sm:inline">INPUT (D)</span>
                  <span className="sm:hidden">D</span>
                </th>
                <th className="pb-2 px-1 sm:px-2">
                  <span className="hidden sm:inline">PREVIOUS Q(t)</span>
                  <span className="sm:hidden">Q(t)</span>
                </th>
                <th className="pb-2 px-1 sm:px-2">
                  <span className="hidden sm:inline">NEXT OUTPUT Q(t+1)</span>
                  <span className="sm:hidden">Q(t+1)</span>
                </th>
                <th className="pb-2 pl-1 sm:pl-2">
                  <span className="hidden sm:inline">SYSTEM MODE</span>
                  <span className="sm:hidden">MODE</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {/* Row 1: Hold Mode */}
              <tr
                className={`transition-colors ${!isClockActive ? "bg-blue-950/30 text-blue-300 font-bold" : "text-gray-500"}`}
              >
                <td className="py-2 pr-1 sm:py-2.5 sm:pr-2 whitespace-nowrap">
                  <span className="px-1.5 sm:px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-[9px] sm:text-xs">
                    <span className="hidden sm:inline">
                      Low / High (Steady)
                    </span>
                    <span className="sm:hidden">Steady</span>
                  </span>
                </td>
                <td className="py-2 px-1 sm:py-2.5 sm:px-2">X</td>
                <td className="py-2 px-1 sm:py-2.5 sm:px-2">{q ? "1" : "0"}</td>
                <td className="py-2 px-1 sm:py-2.5 sm:px-2">{q ? "1" : "0"}</td>
                <td className="py-2 pl-1 sm:py-2.5 sm:pl-2 whitespace-nowrap">
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-2xs ${!isClockActive ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-gray-500"}`}
                  >
                    <span className="hidden sm:inline">
                      MEM_HOLD (No Change)
                    </span>
                    <span className="sm:hidden">HOLD</span>
                  </span>
                </td>
              </tr>

              {/* Row 2: Reset Mode */}
              <tr
                className={`transition-colors ${isClockActive && !d ? "bg-emerald-950/40 text-emerald-300 font-bold" : "text-gray-500"}`}
              >
                <td className="py-2 pr-1 sm:py-2.5 sm:pr-2 whitespace-nowrap">
                  <span className="px-1.5 sm:px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] sm:text-2xs">
                    <span className="hidden sm:inline">↑ Rising Edge</span>
                    <span className="sm:hidden">↑ Edge</span>
                  </span>
                </td>
                <td className="py-2 px-1 sm:py-2.5 sm:px-2 text-blue-400">0</td>
                <td className="py-2 px-1 sm:py-2.5 sm:px-2">X</td>
                <td className="py-2 px-1 sm:py-2.5 sm:px-2 text-amber-400">
                  0
                </td>
                <td className="py-2 pl-1 sm:py-2.5 sm:pl-2 whitespace-nowrap">
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-2xs ${isClockActive && !d ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-gray-500"}`}
                  >
                    <span className="hidden sm:inline">
                      CLEAR / RESET (Store 0)
                    </span>
                    <span className="sm:hidden">RESET</span>
                  </span>
                </td>
              </tr>

              {/* Row 3: Set Mode */}
              <tr
                className={`transition-colors ${isClockActive && d ? "bg-amber-950/40 text-amber-300 font-bold" : "text-gray-500"}`}
              >
                <td className="py-2 pr-1 sm:py-2.5 sm:pr-2 whitespace-nowrap">
                  <span className="px-1.5 sm:px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] sm:text-2xs">
                    <span className="hidden sm:inline">↑ Rising Edge</span>
                    <span className="sm:hidden">↑ Edge</span>
                  </span>
                </td>
                <td className="py-2 px-1 sm:py-2.5 sm:px-2 text-blue-400">1</td>
                <td className="py-2 px-1 sm:py-2.5 sm:px-2">X</td>
                <td className="py-2 px-1 sm:py-2.5 sm:px-2 text-amber-400">
                  1
                </td>
                <td className="py-2 pl-1 sm:py-2.5 sm:pl-2 whitespace-nowrap">
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-2xs ${isClockActive && d ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-gray-500"}`}
                  >
                    <span className="hidden sm:inline">
                      SET MEMORY (Store 1)
                    </span>
                    <span className="sm:hidden">SET</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
