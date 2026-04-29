import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem, ThemeMode } from "../types";

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
  theme: ThemeMode;
}

export function MediaRow({ title, items, onItemClick, theme }: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (items.length === 0) return null;

  const isDark = theme === "dark";

  return (
    <div className="mb-6">
      <h3 className={`text-lg font-bold mb-2 px-4 ${isDark ? "text-white" : "text-slate-700"}`}>{title}</h3>
      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-0 bottom-0 z-10 px-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center ${isDark ? "bg-black/50" : "bg-white/70"}`}
        >
          <ChevronLeft className={`w-6 h-6 ${isDark ? "text-white" : "text-slate-700"}`} />
        </button>
        
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className="flex-shrink-0 w-36 cursor-pointer transition-transform hover:scale-105 hover:z-10"
            >
              <div className={`aspect-[2/3] rounded-lg overflow-hidden mb-2 shadow-md ${isDark ? "bg-slate-800" : "bg-rose-100"}`}>
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? "bg-gradient-to-br from-slate-700 to-slate-800" : "bg-gradient-to-br from-rose-100 to-rose-200"}`}>
                    <span className={`text-4xl font-bold ${isDark ? "text-slate-600" : "text-rose-400"}`}>{item.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              <p className={`text-sm font-medium truncate ${isDark ? "text-gray-200" : "text-slate-700"}`}>{item.title}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-0 bottom-0 z-10 px-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center ${isDark ? "bg-black/50" : "bg-white/70"}`}
        >
          <ChevronRight className={`w-6 h-6 ${isDark ? "text-white" : "text-slate-700"}`} />
        </button>
      </div>
    </div>
  );
}