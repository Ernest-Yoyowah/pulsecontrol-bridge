import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useServerStore, ServerInfo } from "./store/useServerStore";
import { useTauriEvents } from "./hooks/useTauriEvents";
import { Header } from "./components/Header";
import { NavBar, Page } from "./components/NavBar";
import { DashboardPage } from "./pages/DashboardPage";
import { ActivityPage } from "./pages/ActivityPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AboutPage } from "./pages/AboutPage";

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const { serverInfo, activityLog, clientInfo, setServerInfo, setActivityLog } =
    useServerStore();

  useTauriEvents();

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

  useEffect(() => {
    invoke<typeof activityLog>("get_activity_log")
      .then(setActivityLog)
      .catch(() => {});
  }, []);

  const handlePortApplied = (name: string) => {
    setServerInfo({ ...serverInfo, midi_port_name: name });
  };

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Header
        status={serverInfo.status}
        clientConnected={clientInfo !== null}
      />

      <main className="flex-1 min-h-0 overflow-hidden">
        {page === "dashboard" && (
          <DashboardPage serverInfo={serverInfo} clientInfo={clientInfo} />
        )}
        {page === "activity" && <ActivityPage entries={activityLog} />}
        {page === "settings" && (
          <SettingsPage
            currentPortName={serverInfo.midi_port_name}
            onApplied={handlePortApplied}
          />
        )}
        {page === "about" && <AboutPage />}
      </main>

      <NavBar current={page} onChange={setPage} />
    </div>
  );
}

export default App;
