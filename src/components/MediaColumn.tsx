import { MediaItem } from "../types";
import { MediaListItem } from "./MediaListItem";

interface MediaColumnProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
  onStatusChange: (id: string, status: "planned" | "watching" | "completed") => void;
}

const statusLabels = {
  planned: { label: "Planned", emoji: "📋" },
  watching: { label: "In Progress", emoji: "📖" },
  completed: { label: "Completed", emoji: "✅" },
};

export function MediaColumn({ title, icon, iconBg, items, onItemClick, onStatusChange }: MediaColumnProps) {
  const groupedItems = {
    watching: items.filter((item) => item.status === "watching"),
    planned: items.filter((item) => item.status === "planned"),
    completed: items.filter((item) => item.status === "completed"),
  };

  const statusOrder: ("watching" | "planned" | "completed")[] = ["watching", "planned", "completed"];

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${iconBg} p-2 rounded-lg`}>
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-xs text-gray-500">{items.length} items</p>
        </div>
      </div>

      <div className="space-y-4">
        {statusOrder.map((status) => {
          const statusItems = groupedItems[status];
          if (statusItems.length === 0) return null;

          return (
            <div key={status}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-sm">{statusLabels[status].emoji}</span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {statusLabels[status].label}
                </span>
                <span className="text-xs text-gray-600">({statusItems.length})</span>
              </div>

              <div className="space-y-2">
                {statusItems.map((item) => (
                  <MediaListItem
                    key={item.id}
                    item={item}
                    onClick={() => onItemClick(item)}
                    onStatusChange={(newStatus) => onStatusChange(item.id, newStatus)}
                    compact
                  />
                ))}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-600 text-sm">
            No {title.toLowerCase()} yet
          </div>
        )}
      </div>
    </div>
  );
}