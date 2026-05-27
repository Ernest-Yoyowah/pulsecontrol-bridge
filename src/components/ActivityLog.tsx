import React, { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ActivityEntry, useServerStore } from "../store/useServerStore";

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function typeColor(type: string): string {
  switch (type) {
    case "midi_cc":
      return "#00d4ff";
    case "transport":
      return "#f59e0b";
    case "hello":
      return "#22c55e";
    case "connect":
    case "disconnect":
      return "#9e9e9e";
    default:
      return "#555555";
  }
}

interface Props {
  entries: ActivityEntry[];
}

export const ActivityLog: React.FC<Props> = ({ entries }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const clearStore = useServerStore((s) => s.clearActivityLog);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const handleClear = async () => {
    await invoke("clear_activity_log");
    clearStore();
  };

  return (
    <div className="flex flex-col mx-5 gap-2 flex-1 min-h-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted uppercase tracking-widest">
          Activity
        </span>
        <button
          onClick={handleClear}
          className="text-[10px] text-muted uppercase tracking-widest hover:text-secondary transition-colors px-1"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl bg-surface border border-border min-h-0">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-muted">Waiting for messages…</span>
          </div>
        ) : (
          <div className="py-1">
            {entries.map((entry, i) => (
              <div
                key={i}
                className="flex items-baseline gap-2 px-3 py-1 hover:bg-surface-alt transition-colors"
              >
                <span className="text-[10px] text-muted font-mono shrink-0 w-16">
                  {formatTime(entry.timestamp)}
                </span>
                <span
                  className="text-[10px] font-mono shrink-0 w-14 uppercase"
                  style={{ color: typeColor(entry.message_type) }}
                >
                  {entry.message_type}
                </span>
                <span className="text-xs text-secondary truncate">
                  {entry.detail}
                </span>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>
    </div>
  );
};
