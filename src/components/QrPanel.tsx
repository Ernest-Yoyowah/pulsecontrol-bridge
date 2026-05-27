import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  wsUrl: string;
}

export const QrPanel: React.FC<Props> = ({ wsUrl }) => {
  return (
    <div className="flex flex-col items-center gap-3 py-5 px-5">
      <div className="p-3 rounded-xl bg-surface border border-border">
        <QRCodeSVG
          value={wsUrl}
          size={200}
          bgColor="#0f0f0f"
          fgColor="#00d4ff"
          level="M"
        />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-mono text-sm text-accent tracking-tight select-all">
          {wsUrl}
        </span>
        <span className="text-xs text-muted">
          Scan with PulseControl Mobile
        </span>
      </div>
    </div>
  );
};
