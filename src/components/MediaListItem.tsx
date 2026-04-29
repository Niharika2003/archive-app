import { Star } from "lucide-react";
import { MediaItem } from "../types";

interface MediaListItemProps {
  item: MediaItem;
  onClick: () => void;
}

const typeColors = {
  Book: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Anime: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
  Movie: "bg-sky-500/20 text-sky-400 border-sky-500/30",
};

const statusColors = {
  planned: "bg-violet-500",
  watching: "bg-amber-500",
  completed: "bg-emerald-500",
};

export function MediaListItem({ item, onClick }: MediaListItemProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-zinc-800/50 hover:bg-zinc-800 rounded-lg p-3 cursor-pointer transition-all duration-200 border border-transparent hover:border-zinc-700"
    >
      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-12 h-16 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-12 h-16 bg-zinc-700 rounded flex items-center justify-center text-gray-500 text-xs text-center p-1">
              {item.type}
            </div>
          )}
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusColors[item.status]} border-2 border-zinc-900`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">{item.title}</h3>
          <p className="text-gray-500 text-xs truncate">{item.creator}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-1.5 py-0.5 rounded border ${typeColors[item.type]}`}>
              {item.type}
            </span>
            {item.rating ? (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-yellow-400">{item.rating}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}