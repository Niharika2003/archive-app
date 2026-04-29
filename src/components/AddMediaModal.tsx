import { useState } from "react";
import { X } from "lucide-react";
import { MediaItem, MediaStatus, ThemeMode } from "../types";

interface AddMediaModalProps {
  onClose: () => void;
  onAdd: (item: Omit<MediaItem, "id">) => void;
  theme: ThemeMode;
}

export function AddMediaModal({ onClose, onAdd, theme }: AddMediaModalProps) {
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [type, setType] = useState<"Book" | "Anime" | "Movie">("Book");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState<MediaStatus>("planned");
  const [rating, setRating] = useState<number>(0);
  const [image, setImage] = useState("");

  const isDark = theme === "dark";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      creator: creator.trim() || "Unknown",
      type,
      genre: genre.trim() || "Unknown",
      status,
      rating: rating > 0 ? rating : undefined,
      image: image.trim() || "",
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? "bg-black/80" : "bg-white/80"}`} onClick={onClose}>
      <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl ${isDark ? "bg-slate-900" : "bg-white"}`} onClick={(e) => e.stopPropagation()}>
        <div className={`flex items-center justify-between p-5 ${isDark ? "border-b border-slate-800" : "border-b border-slate-100"}`}>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Add New Entry</h2>
          <button onClick={onClose} className={isDark ? "text-gray-400 hover:text-white" : "text-slate-400 hover:text-slate-800"}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none ${
                isDark 
                  ? "bg-slate-800 border-slate-700 text-white focus:border-rose-400" 
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400"
              }`}
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Creator / Director</label>
            <input
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none ${
                isDark 
                  ? "bg-slate-800 border-slate-700 text-white focus:border-rose-400" 
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400"
              }`}
              placeholder="Author, Director, or Studio"
            />
          </div>

          <div>
            <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Type</label>
            <div className="flex gap-2">
              {(["Book", "Anime", "Movie"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    type === t
                      ? t === "Book"
                        ? "bg-rose-400 text-white"
                        : t === "Anime"
                        ? "bg-fuchsia-400 text-white"
                        : "bg-violet-400 text-white"
                      : isDark
                      ? "bg-slate-800 text-gray-400"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none ${
                isDark 
                  ? "bg-slate-800 border-slate-700 text-white focus:border-rose-400" 
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400"
              }`}
              placeholder="e.g., Fantasy, Sci-Fi, Drama"
            />
          </div>

          <div>
            <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Status</label>
            <div className="flex gap-2">
              {([
                { value: "planned", label: "Planned" },
                { value: "watching", label: "In Progress" },
                { value: "completed", label: "Completed" },
              ] as const).map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    status === s.value
                      ? "bg-amber-400 text-white"
                      : isDark
                      ? "bg-slate-800 text-gray-400"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {status === "completed" && (
            <div>
              <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-all ${rating >= star ? "text-amber-400" : isDark ? "text-slate-700" : "text-slate-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none ${
                isDark 
                  ? "bg-slate-800 border-slate-700 text-white focus:border-rose-400" 
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400"
              }`}
              placeholder="https://... (paste any image link)"
            />
            <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-slate-400"}`}>
              Paste a direct image URL from Goodreads, IMDb, MAL, or any site
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-md"
          >
            Add to Archive
          </button>
        </form>
      </div>
    </div>
  );
}