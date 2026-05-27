import React from "react";

export type Page = "dashboard" | "activity" | "settings" | "about";

interface Props {
  current: Page;
  onChange: (page: Page) => void;
}

const BridgeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="2,12 5,12 6.5,7 8,17 9.5,9 11,14 12.5,8 14,16 15.5,12 18,12 19.5,9 21,15 22,12" />
  </svg>
);

const ActivityIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const TABS: { id: Page; label: string; Icon: React.FC }[] = [
  { id: "dashboard", label: "Bridge", Icon: BridgeIcon },
  { id: "activity", label: "Activity", Icon: ActivityIcon },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
  { id: "about", label: "About", Icon: InfoIcon },
];

export const NavBar: React.FC<Props> = ({ current, onChange }) => (
  <nav className="flex border-t border-border bg-bg shrink-0">
    {TABS.map(({ id, label, Icon }) => {
      const active = current === id;
      return (
        <button
          key={id}
          onClick={() => onChange(id)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
          style={{ color: active ? "#00d4ff" : "#555555" }}
        >
          <Icon />
          <span className="text-[10px] tracking-widest uppercase font-medium leading-none">
            {label}
          </span>
        </button>
      );
    })}
  </nav>
);
