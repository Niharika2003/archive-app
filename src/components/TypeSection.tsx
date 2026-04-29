import { MediaItem, ThemeMode } from "../types";
import { MediaRow } from "./MediaRow";

interface TypeSectionProps {
  title: string;
  items: MediaItem[];
  accentDark: string;
  accentLight: string;
  onItemClick: (item: MediaItem) => void;
  theme: ThemeMode;
}

export function TypeSection({ title, items, accentDark, accentLight, onItemClick, theme }: TypeSectionProps) {
  const planned = items.filter((i) => i.status === "planned");
  const watching = items.filter((i) => i.status === "watching");
  const completed = items.filter((i) => i.status === "completed");

  if (items.length === 0) return null;

  const plannedLabel = "Planning";
  const watchingLabel = "In Progress";
  const completedLabel = "Completed";

  const isDark = theme === "dark";

  return (
    <div className="mb-10">
      <h2 className={`text-2xl font-bold mb-4 px-4 ${isDark ? accentDark : accentLight}`}>{title}</h2>
      <MediaRow title={plannedLabel} items={planned} onItemClick={onItemClick} theme={theme} />
      <MediaRow title={watchingLabel} items={watching} onItemClick={onItemClick} theme={theme} />
      <MediaRow title={completedLabel} items={completed} onItemClick={onItemClick} theme={theme} />
    </div>
  );
}