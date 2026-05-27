import React from "react";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <p className="text-[10px] text-muted uppercase tracking-widest mb-2">
      {title}
    </p>
    {children}
  </div>
);

const Bullet: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-2 py-0.5">
    <span style={{ color: "#00d4ff" }} className="text-xs mt-0.5 shrink-0">
      •
    </span>
    <span className="text-sm text-secondary leading-snug">{text}</span>
  </div>
);

export const AboutPage: React.FC = () => (
  <div className="flex flex-col h-full overflow-y-auto px-5 py-5 gap-5">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2.5">
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="none"
          aria-hidden="true"
        >
          <polyline
            points="2,12 5,12 6.5,7 8,17 9.5,9 11,14 12.5,8 14,16 15.5,12 18,12 19.5,9 21,15 22,12"
            stroke="#00d4ff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="leading-tight">
          <span className="font-bold text-base select-none">
            <span style={{ color: "#00d4ff" }}>PULSE</span>
            <span className="text-primary">CONTROL</span>
          </span>
          <div className="text-xs text-muted font-normal tracking-widest uppercase">
            Bridge
          </div>
        </div>
      </div>
      <span className="text-[10px] text-muted border border-border rounded px-2 py-1 tracking-widest mt-1 select-none">
        v1.0.0
      </span>
    </div>

    <Section title="Created By">
      <div className="rounded-xl bg-surface border border-border px-4 py-3">
        <p className="text-sm font-semibold text-primary">
          Ernest Keyz{" "}
          <span className="text-muted font-normal">/ Ernest Keyz Studios</span>
        </p>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Real-time WebSocket-to-CoreMIDI bridge for live MIDI performance
        </p>
      </div>
    </Section>

    <Section title="Platform Support">
      <div className="rounded-xl bg-surface border border-border px-4 py-3 flex flex-col gap-0.5">
        <Bullet text="macOS 12 Monterey or later (CoreMIDI)" />
        <Bullet text="Standalone Tauri desktop app" />
        <Bullet text="Compatible with any WebSocket MIDI controller" />
      </div>
    </Section>

    <Section title="Features">
      <div className="rounded-xl bg-surface border border-border px-4 py-3 flex flex-col gap-0.5">
        <Bullet text="WebSocket server on port 8765" />
        <Bullet text="MIDI CC message bridging (channels 1–16)" />
        <Bullet text="Transport control — play, stop, record" />
        <Bullet text="Auto-discovery via mDNS" />
        <Bullet text="QR code connection sharing" />
        <Bullet text="Real-time activity feed" />
        <Bullet text="CoreMIDI virtual port output" />
      </div>
    </Section>

    <Section title="License">
      <div className="rounded-xl bg-surface border border-border px-4 py-3">
        <p className="text-xs text-muted leading-relaxed">
          © 2026 Ernest Keyz Studios — All Rights Reserved
        </p>
      </div>
    </Section>
  </div>
);
