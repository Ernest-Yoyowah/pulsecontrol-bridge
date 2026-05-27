import React from "react";

interface Props {
  status: string;
  clientConnected: boolean;
}

function statusColor(status: string, clientConnected: boolean): string {
  if (status === "error") return "#ef4444";
  if (status === "running" && clientConnected) return "#22c55e";
  if (status === "running") return "#555555";
  if (status === "starting") return "#f59e0b";
  return "#ef4444";
}

export const Header: React.FC<Props> = ({ status, clientConnected }) => {
  const color = statusColor(status, clientConnected);
  const pulsing = status === "starting";

  return (
    <header className="flex items-center justify-between px-4 h-11 border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 20 20"
          width="18"
          height="18"
          fill="none"
          aria-hidden="true"
        >
          <polyline
            points="1,10 4,10 5.5,5 7,15 8.5,7 10,12 11.5,6 13,14 14.5,10 19,10"
            stroke="#00d4ff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-bold tracking-tight text-sm select-none leading-none">
          <span style={{ color: "#00d4ff" }}>PULSE</span>
          <span className="text-primary">CONTROL</span>
          <span className="text-muted font-normal"> BRIDGE</span>
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] text-muted border border-border rounded px-1.5 py-0.5 tracking-widest select-none">
          v1.0.0
        </span>
        <div
          className={`w-2 h-2 rounded-full shrink-0 ${pulsing ? "animate-pulse-dot" : ""}`}
          style={{ background: color }}
          title={status}
        />
      </div>
    </header>
  );
};
