import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useServerStore, ServerInfo } from "./store/useServerStore";
import { useTauriEvents } from "./hooks/useTauriEvents";
import { Header } from "./components/Header";
import { QrPanel } from "./components/QrPanel";
import { StatusCard } from "./components/StatusCard";
import { ActivityLog } from "./components/ActivityLog";
import { Footer } from "./components/Footer";

function App() {
  const { serverInfo, activityLog, clientInfo, setServerInfo, setActivityLog } =
    useServerStore();

  useTauriEvents();

  // Poll server info every 2 s
  useEffect(() => {
    const poll = async () => {
      try {
        const info = await invoke<ServerInfo>("get_server_info");
        setServerInfo(info);
      } catch (e) {
        console.error("get_server_info error:", e);
      }
    };

    poll();
    const id = setInterval(poll, 2000);
    return () => clearInterval(id);
  }, [setServerInfo]);

  // Load initial activity log once
  useEffect(() => {
    invoke<typeof activityLog>("get_activity_log")
      .then(setActivityLog)
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePortApplied = (name: string) => {
    setServerInfo({ ...serverInfo, midi_port_name: name });
  };

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Header
        status={serverInfo.status}
        clientConnected={clientInfo !== null}
      />

      <QrPanel wsUrl={serverInfo.ws_url} />

      <StatusCard serverInfo={serverInfo} clientInfo={clientInfo} />

      <div className="h-3 shrink-0" />

      <ActivityLog entries={activityLog} />

      <Footer
        currentPortName={serverInfo.midi_port_name}
        onApplied={handlePortApplied}
      />
    </div>
  );
}

export default App;
