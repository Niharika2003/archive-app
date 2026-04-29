import { MediaItem } from "../types";
import { StatusColumn } from "./StatusColumn";

interface TypeRowProps {
  title: string;
  subtitle: string;
  items: MediaItem[];
  accentColor: string;
  onItemClick: (item: MediaItem) => void;
}

export function TypeRow({ title, subtitle, items, accentColor, onItemClick }: TypeRowProps) {
  const toRead = items.filter((i) => i.status === "planned");
  const completed = items.filter((i) => i.status === "completed");
  const inProgress = items.filter((i) => i.status === "watching");

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className={`text-2xl font-bold ${accentColor}`}>{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusColumn
          title="To Read"
          items={toRead}
          accentColor="text-violet-400"
          onItemClick={onItemClick}
        />
        <StatusColumn
          title="Read"
          items={completed}
          accentColor="text-emerald-400"
          onItemClick={onItemClick}
        />
        <StatusColumn
          title="In Progress"
          items={inProgress}
          accentColor="text-amber-400"
          onItemClick={onItemClick}
        />
      </div>
    </div>
  );
}