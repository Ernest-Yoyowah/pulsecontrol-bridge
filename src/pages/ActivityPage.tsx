import React from "react";
import { ActivityEntry } from "../store/useServerStore";
import { ActivityLog } from "../components/ActivityLog";

interface Props {
  entries: ActivityEntry[];
}

export const ActivityPage: React.FC<Props> = ({ entries }) => (
  <div className="flex flex-col h-full py-4">
    <ActivityLog entries={entries} />
  </div>
);
