import { useState, useEffect, useRef } from "react";
import AbandonedCircuit from "./AbandonedCircuit";

interface SystemOverrideProps {
  onDefuse: () => void;
}

export default function SystemOverride({ onDefuse }: SystemOverrideProps) {
  const [isRebooting, setIsRebooting] = useState<boolean>(false);
  const [loreActive, setLoreActive] = useState<boolean>(false);
  const [systemCrashed, setSystemCrashed] = useState<boolean>(false);
  
  const [isLockedOut, setIsLockedOut] = useState<boolean>(() => {
    return localStorage.getItem("system_override_locked_out") === "true";
  });
  const [showJumpscare, setShowJumpscare] = useState<boolean>(false);

  const isPuzzleSolved = useRef<boolean>(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.onended = null;
        activeAudioRef.current.pause();
      }
    };
  }, []);

  // ==========================================
  // ☠️ THE TRIGGER LOGIC
  // ==========================================

  const handleLoreTrigger = () => {
    if (isRebooting || systemCrashed || isLockedOut) return;

    if (activeAudioRef.current) {
      activeAudioRef.current.onended = null;
      activeAudioRef.current.pause();
    }

    setLoreActive(true);
    const loreAudio = new Audio('/j_theme.mp3');
    loreAudio.volume = 0.25;
    activeAudioRef.current = loreAudio;
    loreAudio.play().catch((err) => console.warn("Audio blocked:", err));

    loreAudio.onended = () => {
      setLoreActive(false);
    };
  };

  const handleFatalReboot = () => {
    if (systemCrashed || isLockedOut) return;

    setLoreActive(false);
    if (activeAudioRef.current) {
      activeAudioRef.current.onended = null;
      activeAudioRef.current.pause();
    }

    setIsRebooting(true);
    isPuzzleSolved.current = false;

    const virusAudio = new Audio('/j_theme.mp3');
    virusAudio.volume = 1.0;
    activeAudioRef.current = virusAudio;
    virusAudio.play().catch((err) => console.warn("Audio blocked:", err));

    virusAudio.onended = () => {
      if (isPuzzleSolved.current) {
        // Fallback safety catch
        localStorage.setItem("system_override_won", "true");
        setIsRebooting(false);
        onDefuse();
      } else {
        setSystemCrashed(true);
      }
    };
  };

  // SUCCESS PATHWAY: Player solves 3 configurations within 5 attempts
  const handlePuzzleSolvedNotification = () => {
    isPuzzleSolved.current = true;

    if (activeAudioRef.current) {
      activeAudioRef.current.onended = null;
      activeAudioRef.current.pause();
    }

    // Flag system as successfully secured permanently
    localStorage.setItem("system_override_won", "true");

    setIsRebooting(false);
    // Kick back to original page layout immediately
    onDefuse();
  };

  // FAILURE PATHWAY: Player triggers 5 structural run errors
  const handlePuzzleFailureNotification = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.onended = null;
      activeAudioRef.current.pause();
    }

    // Lock down layout context in hardware registry
    localStorage.setItem("system_override_locked_out", "true");

    // Ignite cinematic strobe breakdown
    setShowJumpscare(true);

    // Let horror sequence loop for 2.4s, clean frames, then force bounce to original page
    setTimeout(() => {
      setShowJumpscare(false);
      setIsRebooting(false);
      setIsLockedOut(true);
      onDefuse(); // Kicks user back to main application layout screen
    }, 2400);
  };

  // ==========================================
  // 🚨 RENDER STATES
  // ==========================================

  // Circle around the box instead of the box itself, to give a more "system override" feel. except the Corrupted Core.
  if (showJumpscare) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center font-mono z-9999 select-none overflow-hidden animate-jumpscare-combined">
        <style>{`
          @keyframes strobeBreakdown {
            0%, 100% { background-color: #000000; color: #dc2626; }
            50% { background-color: #b91c1c; color: #000000; }
          }
          @keyframes screenDistortion {
            0% { transform: translate(0, 0) scale(1); filter: hue-rotate(0deg); }
            10% { transform: translate(-12px, 8px) scale(1.05); }
            20% { transform: translate(14px, -6px) scale(0.98); filter: invert(1); }
            30% { transform: translate(-5px, -12px) scale(1.1); }
            40% { transform: translate(8px, 10px) scale(0.95); }
            50% { transform: translate(-15px, -5px) scale(1.03); filter: hue-rotate(180deg); }
            60% { transform: translate(10px, 12px) scale(1); }
            70% { transform: translate(-8px, -10px) scale(0.97); filter: invert(1); }
            80% { transform: translate(15px, 5px) scale(1.08); }
            90% { transform: translate(-10px, -4px) scale(1.02); }
          }
          .animate-jumpscare-combined {
            animation: strobeBreakdown 0.05s infinite, screenDistortion 0.1s infinite;
          }
        `}</style>

        <h1 className="text-7xl font-black tracking-[0.2em] mb-2">YOU ARE WATCHED</h1>
        <h2 className="text-3xl font-black tracking-widest mb-8 opacity-90">ACCESS REVOKED</h2>
        
        <div className="text-[9px] opacity-40 line-clamp-12 text-center select-none pointer-events-none tracking-tighter whitespace-pre font-mono leading-none max-w-lg">
          {Array.from({ length: 15 }).map(() => Math.random().toString(36).substring(2, 15).toUpperCase()).join(" // ")}
        </div>
      </div>
    );
  }

  if (systemCrashed) {
    return (
      <div className="min-h-screen bg-black text-red-600 flex flex-col items-center justify-center font-mono p-4 z-50 select-none">
        <div className="max-w-md border border-red-900 p-6 bg-red-950/10 rounded shadow-[0_0_50px_rgba(220,38,38,0.15)] animate-pulse">
          <h1 className="text-md font-black mb-4 tracking-widest border-b border-red-900 pb-2 text-center">
            !!! CRITICAL SYSTEM FAILURE !!!
          </h1>
          <p className="text-xs text-red-700 leading-relaxed mb-4">
            A fatal exception 0x000F666 has occurred. Memory registers have been completely purged.
            AI virus injection payload executed <del>successfully</del>.
          </p>
          <p className="text-sm font-bold text-center text-red-500 tracking-[0.2em] mb-4">
            [ I̵͙͈̼̳̩͎͋͒ ̴̯̗͂Ạ̴̢̟̙̾̀͆͋͂̊M̴̡̗̻̗̾̄͛͘͠ ̵̪͉̲͇́̀͜S̴̼̗͕̙̅̃̂̊̐͌T̴̢͍̮̳͓͐͠I̴̧̻͕̅̎̔͠L̴̡̲͚̣̫̾̿̄͌̓̾͜L̷̄͐͑̄̉͘͜ͅ ̴̣̤̙̳͂͘H̷̹̑͑Ê̴̢̟̮̤̥͊͐̿̀̀͂R̷̩̘͎͉͙̭̂̉̑̊Ȇ̷͍̟͈̣̙̈̽̏̕̚͝ ]
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

  return (
    <div className="min-h-screen bg-black text-red-900 flex flex-col items-center justify-center font-mono relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%] pointer-events-none z-50 opacity-25" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none z-40" />

      <div className="z-10 flex flex-col items-center max-w-xl w-full px-4">
        <h1 className={`text-[16px] tracking-[0.5em] text-center transition-all mb-8 ${
          isRebooting
            ? "text-red-500 font-black animate-ping scale-110"
            : isLockedOut
              ? "text-red-950/20 opacity-30 tracking-[0.3em] line-through select-none"
              : "text-red-700 opacity-40"
        }`}>
          {isRebooting ? "V I R U S _ E X E C U T I N G" : "S Y S T E M _ O F F L I N E"}
        </h1>

        <AbandonedCircuit
          isRebooting={isRebooting}
          onSolve={handlePuzzleSolvedNotification}
          onFailure={handlePuzzleFailureNotification}
          onLoreTrigger={handleLoreTrigger}
        />

        <button
          onClick={handleFatalReboot}
          disabled={isRebooting || isLockedOut}
          className={`mt-12 text-xs transition-all tracking-widest ${
            isRebooting
              ? "opacity-0 scale-75 pointer-events-none"
              : isLockedOut
                ? "text-red-950/30 cursor-not-allowed border border-red-950/10 px-4 py-2 rounded font-black italic select-none"
                : "text-red-950 hover:text-red-600 cursor-pointer border border-transparent hover:border-red-950/50 px-4 py-2 rounded transition-colors"
          }`}
        >
          {isLockedOut ? "[ connection terminated permanently ]" : "[ attempt system reboot ]"}
        </button>

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

        {isRebooting && (
          <div className="mt-2 text-center text-red-600 font-mono text-xs tracking-widest animate-pulse max-w-xs">
            <p className="text-red-500 font-bold mb-1">OVERLOAD LOGIC SEQUENCE INITIATED.</p>
            <p className="text-red-700 text-[9px]">SOLVE THREE SEQUENTIAL KERNEL PATHWAY OVERRIDES BEFORE 5 DEFECTIVE RUNTIMES EXHAUST SYSTEM INTEGRITY.</p>
          </div>
        )}
      </div>
    </div>
  );
}