import { useState, useEffect, useRef } from "react";
import AbandonedCircuit from "./AbandonedCircuit";

interface SystemOverrideProps {
  onDefuse: () => void;
}

export default function SystemOverride({ onDefuse }: SystemOverrideProps) {
  const [isRebooting, setIsRebooting] = useState<boolean>(false);
  const [loreActive, setLoreActive] = useState<boolean>(false);
  const [systemCrashed, setSystemCrashed] = useState<boolean>(false);

  // Use a ref to store the puzzle's live status so the audio event listener can read it instantly
  const isPuzzleSolved = useRef<boolean>(false);
  // Keep track of active audio elements so we can clean them up if needed
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio if the component unmounts unexpectedly
  useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
    };
  }, []);

  // ==========================================
  // ☠️ THE TRIGGER LOGIC
  // ==========================================

  // OPTION 3: Secret Lore Discovery
  const handleLoreTrigger = () => {
    if (isRebooting || systemCrashed) return;

    setLoreActive(true);
    // Root-relative path: Vite serves files in /public from the site root,
    // so this must be "/j_theme.mp3", not "./j_theme.mp3". A relative path
    // here gets resolved against the current route and falls through to
    // Vite's SPA fallback, which serves index.html (text/html) instead of
    // the actual audio file — that's what caused the decoder error.
    const loreAudio = new Audio('/j_theme.mp3');
    loreAudio.volume = 0.25; // Quiet, like a ghost audio log
    activeAudioRef.current = loreAudio;
    loreAudio.play();

    loreAudio.onended = () => {
      setLoreActive(false);
    };
  };

  // OPTION 1: The Active Core Puzzle Trap
  const handleFatalReboot = () => {
    if (systemCrashed) return;

    setLoreActive(false); // Stop lore log if it's playing
    if (activeAudioRef.current) activeAudioRef.current.pause();

    setIsRebooting(true);
    isPuzzleSolved.current = false; // Reset live state

    const virusAudio = new Audio('/j_theme.mp3');
    virusAudio.volume = 1.0; // Blast full volume for maximum panic
    activeAudioRef.current = virusAudio;
    virusAudio.play();

    // The countdown evaluation
    virusAudio.onended = () => {
      // Check the LIVE ref value, not a stale state closure!
      if (isPuzzleSolved.current) {
        // SUCCESS: Reset the entire ARG system and go back to normal
        setIsRebooting(false);
        onDefuse();
      } else {
        // FAILURE: Trigger terminal kernel panic
        setSystemCrashed(true);
      }
    };
  };

  // Callback function to pass down to the circuit puzzle
  const handlePuzzleSolvedNotification = () => {
    isPuzzleSolved.current = true;
  };

  // ==========================================
  // 🚨 RENDER STATES
  // ==========================================

  // Ultimate Failure Screen (Kernel Panic)
  if (systemCrashed) {
    return (
      <div className="min-h-screen bg-black text-red-600 flex flex-col items-center justify-center font-mono p-4 z-50 select-none">
        <div className="max-w-md border border-red-900 p-6 bg-red-950/10 rounded shadow-[0_0_50px_rgba(220,38,38,0.15)] animate-pulse">
          <h1 className="text-xl font-black mb-4 tracking-widest border-b border-red-900 pb-2">
            !!! CRITICAL SYSTEM FAILURE !!!
          </h1>
          <p className="text-xs text-red-700 leading-relaxed mb-4">
            A fatal exception 0x000F666 has occurred. Memory registers have been completely purged.
            AI virus injection payload executed successfully.
          </p>
          <p className="text-sm font-bold text-center text-red-500 tracking-[0.2em] mb-4">
            [ SYSTEM PURGED ]
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 bg-red-950 border border-red-700 text-red-400 hover:bg-red-900 hover:text-white transition-all text-xs font-bold cursor-pointer"
          >
            FORCE REBOOT COMPILER
          </button>
        </div>
      </div>
    );
  }

  // Normal / Attacking ARG Screen Layout
  return (
    <div className="min-h-screen bg-black text-red-900 flex flex-col items-center justify-center font-mono relative overflow-hidden select-none">

      {/* Cinematic Glitch Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%] pointer-events-none z-50 opacity-25" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none z-40" />

      <div className="z-10 flex flex-col items-center max-w-xl w-full px-4">

        {/* Dynamic Warning Header */}
        <h1 className={`text-2xl tracking-[0.5em] mb-12 text-center transition-all ${
          isRebooting
            ? "text-red-500 font-black animate-ping scale-110"
            : "text-red-700 opacity-40 animate-pulse"
        }`}>
          {isRebooting ? "V I R U S _ E X E C U T I N G" : "S Y S T E M _ O F F L I N E"}
        </h1>

        {/* The Interactive Logic Puzzle Canvas */}
        <AbandonedCircuit
          isRebooting={isRebooting}
          onSolve={handlePuzzleSolvedNotification}
          onLoreTrigger={handleLoreTrigger}
        />

        {/* Action Button Controls */}
        <button
          onClick={handleFatalReboot}
          disabled={isRebooting}
          className={`mt-12 text-xs transition-all tracking-widest ${
            isRebooting
              ? "opacity-0 scale-75 pointer-events-none" // Completely hide button during crisis
              : "text-red-950 hover:text-red-600 cursor-pointer border border-transparent hover:border-red-950/50 px-4 py-2 rounded transition-colors"
          }`}
        >
          [ attempt system reboot ]
        </button>

        {/* Live Active Audio Stream Decrypter (Option 3 UI overlay) */}
        {loreActive && (
          <div className="absolute top-6 left-6 max-w-xs p-4 bg-black/90 border border-emerald-950 text-emerald-500 text-2xs rounded shadow-[0_0_30px_rgba(16,185,129,0.05)] z-50 animate-fade-in">
            <div className="flex justify-between border-b border-emerald-950 pb-1 mb-2 font-bold text-emerald-600 tracking-wider">
              <span>DECRYPTING_AUDIO_LOG.DAT</span>
              <span className="animate-pulse">● REC</span>
            </div>
            <p className="opacity-80 italic mb-1">"[Static distortion] ... unauthorized access detected ..."</p>
            <p className="opacity-80 italic mb-1">"... malicious source file payload compiling ..."</p>
            <p className="opacity-60 text-[9px] text-emerald-700 mt-2 font-mono">ID: VOLTAGE_OVERLOAD_LOG_71</p>
          </div>
        )}

        {/* Stress Induction text prompt during attack sequence */}
        {isRebooting && (
          <div className="mt-8 text-center text-red-600 font-mono text-xs tracking-widest animate-pulse max-w-xs">
            <p className="text-red-500 font-bold mb-1">OVERLOAD LOGIC INPUT DETECTED.</p>
            <p className="text-red-700 text-[9px]">FORCE REBOOT PURGE SEQUENCING. ALIGN BOTH ACTIVE PATHWAY OVERRIDES TO BINARY [1] TO DEFUSE SHUTDOWN CORRUPTION IMMINENT.</p>
          </div>
        )}
      </div>
    </div>
  );
}   