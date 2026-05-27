import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface Props {
  currentPortName: string;
  onApplied: (name: string) => void;
}

export const Footer: React.FC<Props> = ({ currentPortName, onApplied }) => {
  const [portName, setPortName] = useState(currentPortName);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    const trimmed = portName.trim();
    if (!trimmed) return;
    setApplying(true);
    setError(null);
    try {
      await invoke("set_midi_port", { name: trimmed });
      onApplied(trimmed);
    } catch (e) {
      setError(String(e));
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="px-5 pt-3 pb-4 border-t border-border shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted uppercase tracking-widest shrink-0">
          MIDI Port
        </span>
        <input
          type="text"
          value={portName}
          onChange={(e) => setPortName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          className="flex-1 bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-sm text-primary font-mono outline-none focus:border-accent transition-colors min-w-0"
          spellCheck={false}
        />
        <button
          onClick={handleApply}
          disabled={applying || !portName.trim()}
          className="px-3 py-1.5 rounded-lg bg-accent-dim text-primary text-xs font-semibold uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-40 shrink-0"
        >
          {applying ? "…" : "Apply"}
        </button>
      </div>
      {error && (
        <p className="text-xs mt-1.5" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
    </div>
  );
};
