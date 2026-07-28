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
  const [showWinSequence, setShowWinSequence] = useState<boolean>(false);

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
    if (isRebooting || isLockedOut) return;

    if (activeAudioRef.current) {
      activeAudioRef.current.onended = null;
      activeAudioRef.current.pause();
    }

    setLoreActive(true);
    const loreAudio = new Audio('lore_3.mp3');
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

    const virusAudio = new Audio('time_running_out.mp3');
    virusAudio.volume = 1.0;
    activeAudioRef.current = virusAudio;
    virusAudio.play().catch((err) => console.warn("Audio blocked:", err));

    virusAudio.onended = () => {
      if (isPuzzleSolved.current) {
        localStorage.setItem("system_override_won", "true");
        setIsRebooting(false);
        onDefuse();
      } else {
        setSystemCrashed(true);
        setIsRebooting(false);
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

    localStorage.setItem("system_override_won", "true");

    const winAudio = new Audio('sfx_win.mp3');
    winAudio.volume = 1.0;
    activeAudioRef.current = winAudio;

    winAudio.onended = () => {
      setShowWinSequence(false);
      setIsRebooting(false);
      onDefuse(); 
    };

    setShowWinSequence(true);

    winAudio.play().catch((err) => {
      console.warn("Win audio playback blocked by browser:", err);
      setTimeout(() => {
        setShowWinSequence(false);
        setIsRebooting(false);
        onDefuse();
      }, 3000);
    });
  };

  // FAILURE PATHWAY: Player triggers 5 structural run errors
  const handlePuzzleFailureNotification = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.onended = null;
      activeAudioRef.current.pause();
    }

    localStorage.setItem("system_override_locked_out", "true");

    const failureAudio = new Audio('sfx_lose_edited.mp3'); 
    failureAudio.volume = 1.0;
    activeAudioRef.current = failureAudio;

    failureAudio.onended = () => {
      setShowJumpscare(false);
      setIsRebooting(false);
      setIsLockedOut(true);
      onDefuse();
    };

    setShowJumpscare(true);

    failureAudio.play().catch((err) => {
      console.warn("Audio playback was blocked by browser:", err);
      setTimeout(() => {
        setShowJumpscare(false);
        setIsRebooting(false);
        setIsLockedOut(true);
        onDefuse();
      }, 3000);
    });
  };

  // ==========================================
  // 🚨 RENDER STATES
  // ==========================================

  if (showWinSequence) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-9999 select-none overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src="win.gif" 
            alt="System Override Success" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none mix-blend-color-burn" />
        </div>
      </div>
    );
  }

  if (showJumpscare) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-9999 select-none overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src="lose.gif" 
            alt="System Failure Shock" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-red-950/10 pointer-events-none mix-blend-color-burn" />
        </div>
      </div>
    );
  }

  // 👇 SYSTEM CRASH VIEW
  if (systemCrashed) {
    return (
      <div className="min-h-screen bg-black text-red-600 flex flex-col items-center justify-center font-mono p-4 z-50 select-none relative overflow-x-hidden">
        {/* CRT Overlay Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%] pointer-events-none z-40 opacity-25" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)] pointer-events-none z-30" />

        <div className="max-w-sm sm:max-w-md w-full border border-red-900 p-4 sm:p-6 bg-red-950/10 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.15)] animate-pulse z-10">
          <h1 className="text-xs sm:text-sm font-black mb-3 sm:mb-4 tracking-wider sm:tracking-widest border-b border-red-900 pb-2 text-center">
            !!! CRITICAL SYSTEM FAILURE !!!
          </h1>
          <p className="text-[11px] sm:text-xs text-red-700 leading-relaxed mb-4">
            A fatal exception 0x000F666 has occurred. Memory registers have been completely purged.
            AI virus injection payload executed <del>successfully</del>.
          </p>
          
          {/* Hidden Clickable Secret Trigger */}
          <button
            onClick={handleLoreTrigger}
            className="w-full text-xs sm:text-sm font-bold text-center text-red-500 hover:text-emerald-400 hover:scale-[1.02] active:scale-95 transition-all duration-300 tracking-wider sm:tracking-[0.2em] mb-4 cursor-pointer focus:outline-none py-2"
            title="Decode hidden sequence..."
          >
            [ I̵͙͈̼̳̩͎͋͒ ̴̯̗͂Ạ̴̢̟̙̾̀͆͋͂̊M̴̡̗̻̗̾̄͛͘͠ ̵̪͉̲͇́̀͜S̴̼̗͕̙̅̃̂̊̐͌T̴̢͍̮̳͓͐͠I̴̧̻͕̅̎̔͠L̴̡̲͚̣̫̾̿̄͌̓̾͜L̷̄͐͑̄̉͘͜ͅ ̴̣̤̙̳͂͘H̷̹̑͑Ê̴̢̟̮̤̥͊͐̿̀̀͂R̷̩̘͎͉͙̭̂̉̑̊Ȇ̷͍̟͈̣̙̈̽̏̕̚͝ ]
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 bg-red-950 border border-red-700 text-red-400 hover:bg-red-900 hover:text-white transition-all text-xs font-bold cursor-pointer rounded-lg"
          >
            FORCE REBOOT COMPILER
          </button>
        </div>

        {/* 👇 DECRYPTION HUD OVERLAY (repositioned to fit mobile screens) */}
        {loreActive && (
          <div className="fixed top-4 left-4 right-4 sm:right-auto sm:left-6 max-w-xs p-3.5 bg-black/95 border border-emerald-950 text-emerald-500 text-2xs sm:text-2xs rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.15)] z-60 animate-fade-in">
            <div className="flex justify-between border-b border-emerald-950 pb-1 mb-2 font-bold text-emerald-600 tracking-wider">
              <span>DECRYPTING_AUDIO_LOG.DAT</span>
              <span className="animate-pulse">● REC</span>
            </div>
            <p className="opacity-80 italic mb-1">"[Static distortion] ... unauthorized access detected ..."</p>
            <p className="opacity-80 italic mb-1">"... malicious source file payload compiling ..."</p>
            <p className="opacity-60 text-[9px] text-emerald-700 mt-2 font-mono">ID: VOLTAGE_OVERLOAD_LOG_71</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-red-900 flex flex-col items-center justify-center font-mono relative overflow-x-hidden select-none py-6 sm:py-12">
      {/* Background CRT Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%] pointer-events-none z-50 opacity-25" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none z-40" />

      <div className="z-10 flex flex-col items-center max-w-xl w-full px-3 sm:px-4">
        <AbandonedCircuit
          isRebooting={isRebooting}
          onSolve={handlePuzzleSolvedNotification}
          onFailure={handlePuzzleFailureNotification}
        />

        <button
          onClick={handleFatalReboot}
          disabled={isRebooting || isLockedOut}
          className={`mt-6 sm:mt-10 text-xs transition-all tracking-wider sm:tracking-widest ${
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
          <div className="fixed top-4 left-4 right-4 sm:right-auto sm:left-6 max-w-xs p-3.5 bg-black/90 border border-emerald-950 text-emerald-500 text-2xs sm:text-2xs rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.05)] z-60 animate-fade-in">
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
          <div className="mt-4 text-center text-red-600 font-mono text-xs tracking-wider sm:tracking-widest animate-pulse max-w-xs px-2">
            <p className="text-red-500 font-bold mb-1">OVERLOAD LOGIC SEQUENCE INITIATED.</p>
            <p className="text-red-700 text-[9px]">SOLVE THREE SEQUENTIAL KERNEL PATHWAY OVERRIDES BEFORE 5 DEFECTIVE RUNTIMES EXHAUST SYSTEM INTEGRITY.</p>
          </div>
        )}
      </div>
    </div>
  );
}