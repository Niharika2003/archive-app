import { MediaItem } from "../types";
import { MediaListItem } from "./MediaListItem";

interface CategorySectionProps {
  title: string;
  subtitle: string;
  items: MediaItem[];
  accentColor: string;
  onItemClick: (item: MediaItem) => void;
}

export function CategorySection({ title, subtitle, items, accentColor, onItemClick }: CategorySectionProps) {
  const planned = items.filter((i) => i.status === "planned");
  const watching = items.filter((i) => i.status === "watching");
  const completed = items.filter((i) => i.status === "completed");

  return (
    <div className="flex-1 min-w-0">
      <div className="mb-4">
        <h2 className={`text-xl font-bold ${accentColor}`}>{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>

      <div className="space-y-6">
        {watching.length > 0 ? (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              In Progress ({watching.length})
            </h3>
            <div className="space-y-2">
              {watching.map((item) => (
                <MediaListItem key={item.id} item={item} onClick={() => onItemClick(item)} />
              ))}
            </div>
          </div>
        ) : null}

        {planned.length > 0 ? (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-violet-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              Planned ({planned.length})
            </h3>
            <div className="space-y-2">
              {planned.map((item) => (
                <MediaListItem key={item.id} item={item} onClick={() => onItemClick(item)} />
              ))}
            </div>
          </div>
        ) : null}

        {completed.length > 0 ? (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Completed ({completed.length})
            </h3>
            <div className="space-y-2">
              {completed.map((item) => (
                <MediaListItem key={item.id} item={item} onClick={() => onItemClick(item)} />
              ))}
            </div>
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No items yet</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}