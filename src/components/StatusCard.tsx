import React from "react";
import { ServerInfo, ClientInfo } from "../store/useServerStore";

interface Props {
  serverInfo: ServerInfo;
  clientInfo: ClientInfo | null;
}

interface RowProps {
  label: string;
  value: string;
  dotColor?: string;
  pulse?: boolean;
}

const Row: React.FC<RowProps> = ({ label, value, dotColor, pulse }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-xs text-muted uppercase tracking-wider w-24 shrink-0">
      {label}
    </span>
    <div className="flex items-center gap-2 min-w-0">
      {dotColor && (
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${pulse ? "animate-pulse-dot" : ""}`}
          style={{ background: dotColor }}
        />
      )}
      <span className="text-sm text-primary truncate">{value}</span>
    </div>
  </div>
);

function wsStatusDot(status: string) {
  if (status === "running") return "#22c55e";
  if (status === "starting") return "#f59e0b";
  return "#ef4444";
}

export const StatusCard: React.FC<Props> = ({ serverInfo, clientInfo }) => {
  const dotColor = wsStatusDot(serverInfo.status);
  const pulse = serverInfo.status === "starting";

  return (
    <div className="mx-5 rounded-xl bg-surface border border-border px-4 py-2">
      <p className="text-[10px] text-muted uppercase tracking-widest mb-1 pt-1">
        Status
      </p>
      <Row
        label="WebSocket"
        value={serverInfo.status === "running" ? "Running" : serverInfo.status}
        dotColor={dotColor}
        pulse={pulse}
      />
      <Row
        label="MIDI Port"
        value={serverInfo.midi_port_name || "—"}
        dotColor={serverInfo.midi_port_name ? "#22c55e" : "#ef4444"}
      />
      <div className="flex items-center justify-between py-1.5">
        <span className="text-xs text-muted uppercase tracking-wider w-24 shrink-0">
          Client
        </span>
        {clientInfo ? (
          <div className="flex flex-col items-end min-w-0">
            <span className="text-sm text-primary truncate">
              {clientInfo.client}
            </span>
            <span className="text-xs text-muted">v{clientInfo.version}</span>
          </div>
        ) : (
          <span className="text-sm text-muted">Not connected</span>
        )}
      </div>
    </div>
  );
};
