import React from "react";
import { ServerInfo, ClientInfo } from "../store/useServerStore";
import { QrPanel } from "../components/QrPanel";
import { StatusCard } from "../components/StatusCard";

interface Props {
  serverInfo: ServerInfo;
  clientInfo: ClientInfo | null;
}

export const DashboardPage: React.FC<Props> = ({ serverInfo, clientInfo }) => (
  <div className="flex flex-col overflow-y-auto h-full">
    <QrPanel wsUrl={serverInfo.ws_url} />
    <div className="px-5 pb-5">
      <StatusCard serverInfo={serverInfo} clientInfo={clientInfo} />
    </div>
  </div>
);
