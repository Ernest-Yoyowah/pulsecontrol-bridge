import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import {
  useServerStore,
  ActivityEntry,
  ClientInfo,
} from "../store/useServerStore";

export function useTauriEvents() {
  const { appendActivity, setClientInfo } = useServerStore();

  useEffect(() => {
    const unlisten: Array<() => void> = [];

    (async () => {
      unlisten.push(
        await listen<ClientInfo>("hello-received", (e) => {
          setClientInfo(e.payload);
        }),
      );

      unlisten.push(await listen("client-connected", () => {}));

      unlisten.push(
        await listen("client-disconnected", () => {
          setClientInfo(null);
        }),
      );

      unlisten.push(
        await listen<ActivityEntry>("activity", (e) => {
          appendActivity(e.payload);
        }),
      );
    })();

    return () => {
      unlisten.forEach((fn) => fn());
    };
  }, [appendActivity, setClientInfo]);
}
