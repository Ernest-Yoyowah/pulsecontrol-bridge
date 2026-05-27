import { create } from "zustand";

export interface ActivityEntry {
  timestamp: number;
  message_type: string;
  detail: string;
}

export interface ServerInfo {
  ip: string;
  port: number;
  ws_url: string;
  status: string;
  midi_port_name: string;
}

export interface ClientInfo {
  client: string;
  version: string;
}

interface ServerStore {
  serverInfo: ServerInfo;
  activityLog: ActivityEntry[];
  clientInfo: ClientInfo | null;

  setServerInfo: (info: ServerInfo) => void;
  setActivityLog: (log: ActivityEntry[]) => void;
  appendActivity: (entry: ActivityEntry) => void;
  clearActivityLog: () => void;
  setClientInfo: (info: ClientInfo | null) => void;
}

const DEFAULT_SERVER: ServerInfo = {
  ip: "...",
  port: 8765,
  ws_url: "ws://...:8765",
  status: "starting",
  midi_port_name: "PulseControl",
};

export const useServerStore = create<ServerStore>((set) => ({
  serverInfo: DEFAULT_SERVER,
  activityLog: [],
  clientInfo: null,

  setServerInfo: (info) => set({ serverInfo: info }),

  setActivityLog: (log) => set({ activityLog: log }),

  appendActivity: (entry) =>
    set((state) => {
      const next = [...state.activityLog, entry];
      return { activityLog: next.slice(-50) };
    }),

  clearActivityLog: () => set({ activityLog: [] }),

  setClientInfo: (info) => set({ clientInfo: info }),
}));
