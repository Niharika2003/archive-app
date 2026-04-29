import { useState } from "react";
import { MediaItem, MediaType, MediaStatus } from "../types";
import { X, Star } from "lucide-react";

interface AddModalProps {
  onClose: () => void;
  onAdd: (item: Omit<MediaItem, "id">) => void;
}

export function AddModal({ onClose, onAdd }: AddModalProps) {
  const [form, setForm] = useState({
    title: "",
    creator: "",
    genre: "",
    type: "Movie" as MediaType,
    status: "planned" as MediaStatus,
    image: "",
    rating: null as number | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...form,
      image: form.image || "https://via.placeholder.com/300x450/27272a/525252?text=No+Image",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Add New</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            required
          />
          <input
            type="text"
            placeholder="Creator"
            value={form.creator}
            onChange={(e) => setForm({ ...form, creator: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            required
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />

          <div className="flex gap-2">
            {(["Movie", "Anime", "Book"] as MediaType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, type })}
                className={`flex-1 py-2 rounded font-medium transition-colors ${
                  form.type === type ? "bg-amber-500 text-black" : "bg-zinc-800 text-gray-400"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {(["planned", "watching", "completed"] as MediaStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setForm({ ...form, status, rating: status !== "completed" ? null : form.rating })}
                className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                  form.status === status ? "bg-amber-500 text-black" : "bg-zinc-800 text-gray-400"
                }`}
              >
                {status === "planned" ? "Plan" : status === "watching" ? "Watching" : "Done"}
              </button>
            ))}
          </div>

          {form.status === "completed" && (
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setForm({ ...form, rating })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        form.rating && rating <= form.rating
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
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 rounded transition-colors"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}