import { MediaItem, MediaStatus } from "../types";
import { X, Star, Trash2 } from "lucide-react";

interface DetailModalProps {
  item: MediaItem;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<MediaItem>) => void;
  onDelete: (id: string) => void;
}

const typeColors = {
  Book: "bg-rose-600",
  Movie: "bg-sky-600",
  Anime: "bg-fuchsia-600",
};

export function DetailModal({ item, onClose, onUpdate, onDelete }: DetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
      <div className="bg-zinc-900 rounded-lg w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-64">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <span className={`${typeColors[item.type]} text-white text-xs px-2 py-1 rounded mb-2 inline-block`}>
              {item.type}
            </span>
            <h2 className="text-2xl font-bold text-white">{item.title}</h2>
            <p className="text-gray-400">{item.creator}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">Status</p>
            <div className="flex gap-2">
              {(["planned", "watching", "completed"] as MediaStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdate(item.id, { status, rating: status !== "completed" ? undefined : item.rating })}
                  className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                    item.status === status ? "bg-amber-500 text-black" : "bg-zinc-800 text-gray-400"
                  }`}
                >
                  {status === "planned" ? "Plan" : status === "watching" ? "Watching" : "Done"}
                </button>
              ))}
            </div>
          </div>

          {item.status === "completed" && (
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => onUpdate(item.id, { rating })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        item.rating && rating <= item.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => onDelete(item.id)}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}