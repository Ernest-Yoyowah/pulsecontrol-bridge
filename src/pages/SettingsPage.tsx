import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface Props {
  currentPortName: string;
  onApplied: (name: string) => void;
}

export const SettingsPage: React.FC<Props> = ({
  currentPortName,
  onApplied,
}) => {
  const [portName, setPortName] = useState(currentPortName);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleApply = async () => {
    const trimmed = portName.trim();
    if (!trimmed) return;
    setApplying(true);
    setError(null);
    setSaved(false);
    try {
      await invoke("set_midi_port", { name: trimmed });
      onApplied(trimmed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(String(e));
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 py-5 gap-6">
      <div>
        <p className="text-[10px] text-muted uppercase tracking-widest mb-3">
          MIDI Configuration
        </p>
        <div className="rounded-xl bg-surface border border-border px-4 py-4 flex flex-col gap-3">
          <div>
            <label className="text-xs text-secondary block mb-1.5">
              Virtual Port Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={portName}
                onChange={(e) => setPortName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                className="flex-1 bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm text-primary font-mono outline-none focus:border-accent transition-colors min-w-0"
                spellCheck={false}
                placeholder="PulseControl Bridge"
              />
              <button
                onClick={handleApply}
                disabled={applying || !portName.trim()}
                className="px-4 py-2 rounded-lg bg-accent-dim text-primary text-xs font-semibold uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-40 shrink-0"
              >
                {applying ? "…" : saved ? "Saved" : "Apply"}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-xs" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}
          <p className="text-xs text-muted leading-relaxed">
            The CoreMIDI virtual port name visible to DAWs and MIDI-aware apps
            on this Mac. Changes take effect immediately.
          </p>
        </div>
      </div>

      <div>
        <p className="text-[10px] text-muted uppercase tracking-widest mb-3">
          Network
        </p>
        <div className="rounded-xl bg-surface border border-border px-4 py-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">WebSocket Port</span>
            <span className="text-sm text-primary font-mono">8765</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">mDNS Service</span>
            <span className="text-sm text-primary font-mono">
              _pulsecontrol._tcp
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Hostname</span>
            <span className="text-sm text-primary font-mono">
              pulsecontrol-bridge.local
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
