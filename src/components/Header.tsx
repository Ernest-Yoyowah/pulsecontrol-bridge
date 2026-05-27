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

function isPulsing(status: string): boolean {
  return status === "starting";
}

export const Header: React.FC<Props> = ({ status, clientConnected }) => {
  const color = statusColor(status, clientConnected);
  const pulsing = isPulsing(status);

  return (
    <header className="flex items-center justify-between px-5 h-12 border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-accent font-bold tracking-widest text-xs uppercase select-none">
          PulseControl Bridge
        </span>
      </div>
      <div
        className={`w-2.5 h-2.5 rounded-full ${pulsing ? "animate-pulse-dot" : ""}`}
        style={{ background: color }}
        title={status}
      />
    </header>
  );
};
