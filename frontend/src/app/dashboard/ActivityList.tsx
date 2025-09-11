"use client";

import React from "react";

interface Activity {
  id: string | number;
  message: string;
  file: string;
  when: string;
}

interface ActivityListProps {
  activity: Activity[];
}

export default function ActivityList({ activity }: ActivityListProps) {
  return (
    <aside className="bg-gray-800/90 rounded-xl shadow-xl p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Recent Activity</h2>
      {activity.length === 0 ? (
        <p className="text-gray-400 mb-2">No recent activity yet.</p>
      ) : (
        <ul>
          {activity.map((act) => (
            <li key={act.id} className="mb-4">
              <span className="text-gray-300">
                {act.message}{" "}
                <span className="font-semibold text-gray-100">{act.file}</span>{" "}
                <span className="text-xs text-gray-400">({act.when})</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
