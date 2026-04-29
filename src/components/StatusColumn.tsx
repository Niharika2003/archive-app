import { MediaItem } from "../types";
import { MediaListItem } from "./MediaListItem";

interface StatusColumnProps {
  title: string;
  items: MediaItem[];
  accentColor: string;
  onItemClick: (item: MediaItem) => void;
}

export function StatusColumn({ title, items, accentColor, onItemClick }: StatusColumnProps) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${accentColor}`}>
        {title} ({items.length})
      </h3>
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <MediaListItem key={item.id} item={item} onClick={() => onItemClick(item)} />
          ))
        ) : (
          <p className="text-gray-600 text-sm italic">Empty</p>
        )}
      </div>
    </div>
  );
}