import { useState } from "react";
import { X, Star, ExternalLink, Edit, Check } from "lucide-react";
import { MediaItem, MediaStatus, ThemeMode } from "../types";

interface MediaCardProps {
  item: MediaItem;
  onClose: () => void;
  onStatusChange: (id: string, status: MediaStatus) => void;
  onEdit?: (id: string, updates: Partial<MediaItem>) => void;
  theme: ThemeMode;
}

export function MediaCard({ item, onClose, onStatusChange, onEdit, theme }: MediaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editCreator, setEditCreator] = useState(item.creator);
  const [editGenre, setEditGenre] = useState(item.genre);
  const [editImage, setEditImage] = useState(item.image || "");
  const [editRating, setEditRating] = useState(item.rating || 0);

  const isDark = theme === "dark";

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(item.id, {
        title: editTitle.trim() || item.title,
        creator: editCreator.trim() || item.creator,
        genre: editGenre.trim() || item.genre,
        image: editImage.trim(),
        rating: editRating > 0 ? editRating : undefined,
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(item.title);
    setEditCreator(item.creator);
    setEditGenre(item.genre);
    setEditImage(item.image || "");
    setEditRating(item.rating || 0);
    setIsEditing(false);
  };

  const typeColors = {
    Book: isDark ? "bg-rose-400" : "bg-rose-500",
    Anime: isDark ? "bg-fuchsia-400" : "bg-fuchsia-500",
    Movie: isDark ? "bg-violet-400" : "bg-violet-500",
  };

  const statusLabels = {
    planned: "The Waiting Room",
    watching: "In the Glow",
    completed: "The Eternal Shelf",
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? "bg-black/80" : "bg-white/80"}`} onClick={onClose}>
      <div className={`rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl ${isDark ? "bg-slate-900" : "bg-white"}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 ${isDark ? "border-b border-slate-800" : "border-b border-slate-100"}`}>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${typeColors[item.type]}`}>
              {item.type}
            </span>
            <span className={`text-xs ${isDark ? "text-gray-500" : "text-slate-400"}`}>
              {statusLabels[item.status]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className={`p-2 rounded-lg transition-all ${isDark ? "text-gray-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"}`}
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className={isDark ? "text-gray-400 hover:text-white" : "text-slate-400 hover:text-slate-800"}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Image */}
          <div className="flex justify-center">
            {isEditing ? (
              <div className="w-full">
                <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Image URL</label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none ${
                    isDark 
                      ? "bg-slate-800 border-slate-700 text-white focus:border-rose-400" 
                      : "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400"
                  }`}
                  placeholder="https://... (paste image link)"
                />
                {editImage && (
                  <div className="mt-3 flex justify-center">
                    <img 
                      src={editImage} 
                      alt="Preview" 
                      className="w-32 h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='192' viewBox='0 0 128 192'%3E%3Crect fill='%23334155' width='128' height='192'/%3E%3Ctext fill='%2394a3b8' x='64' y='100' text-anchor='middle' font-size='12'%3EInvalid URL%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className={`w-40 h-60 rounded-xl overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='240' viewBox='0 0 160 240'%3E%3Crect fill='%23334155' width='160' height='240'/%3E%3Ctext fill='%2394a3b8' x='80' y='125' text-anchor='middle' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <span className={`text-sm ${isDark ? "text-gray-500" : "text-slate-400"}`}>No Image</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title & Creator */}
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2 focus:outline-none ${
                    isDark 
                      ? "bg-slate-800 border-slate-700 text-white focus:border-rose-400" 
                      : "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Creator / Director</label>
                <input
                  type="text"
                  value={editCreator}
                  onChange={(e) => setEditCreator(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2 focus:outline-none ${
                    isDark 
                      ? "bg-slate-800 border-slate-700 text-white focus:border-rose-400" 
                      : "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Genre</label>
                <input
                  type="text"
                  value={editGenre}
                  onChange={(e) => setEditGenre(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2 focus:outline-none ${
                    isDark 
                      ? "bg-slate-800 border-slate-700 text-white focus:border-rose-400" 
                      : "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400"
                  }`}
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className={`text-2xl font-bold text-center ${isDark ? "text-white" : "text-slate-800"}`}>
                {item.title}
              </h2>
              <p className={`text-center ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                by {item.creator}
              </p>
              <p className={`text-center text-sm ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                {item.genre}
              </p>
            </>
          )}

          {/* Rating */}
          {isEditing ? (
            <div>
              <label className={`block text-sm mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Rating</label>
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    className={`text-2xl transition-all ${editRating >= star ? "text-amber-400" : isDark ? "text-slate-700" : "text-slate-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ) : (
            item.rating && item.rating > 0 && (
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= item.rating! ? "text-amber-400 fill-amber-400" : isDark ? "text-slate-700" : "text-slate-300"}`}
                  />
                ))}
              </div>
            )
          )}

          {/* Status Buttons */}
          {!isEditing && (
            <div className="space-y-2">
              <label className={`block text-sm text-center ${isDark ? "text-gray-400" : "text-slate-500"}`}>Status</label>
              <div className="flex gap-2">
                {([
                  { value: "planned", label: "Planned" },
                  { value: "watching", label: "In Progress" },
                  { value: "completed", label: "Completed" },
                ] as const).map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onStatusChange(item.id, s.value)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      item.status === s.value
                        ? "bg-amber-400 text-white"
                        : isDark
                        ? "bg-slate-800 text-gray-400 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                  isDark 
                    ? "bg-slate-800 text-gray-400 hover:bg-slate-700" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-rose-400 hover:bg-rose-500 text-white font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}