import { useState } from "react";
import { MediaItem, MediaStatus, ThemeMode } from "./types";
import { LoadPrompt } from "./components/LoadPrompt";
import { TypeSection } from "./components/TypeSection";
import { MediaCard } from "./components/MediaCard";
import { AddMediaModal } from "./components/AddMediaModal";
import { ImportModal } from "./components/ImportModal";
import { Plus, Upload, Download, Sun, Moon } from "lucide-react";

export default function App() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const books = items.filter((item) => item.type === "Book");
  const anime = items.filter((item) => item.type === "Anime");
  const movies = items.filter((item) => item.type === "Movie");

  const handleStatusChange = (id: string, status: MediaStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, status });
    }
  };

  const handleEdit = (id: string, updates: Partial<MediaItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, ...updates });
    }
  };

  const handleAddItem = (newItem: Omit<MediaItem, "id">) => {
    const item: MediaItem = { ...newItem, id: Date.now().toString() };
    setItems((prev) => [...prev, item]);
  };

  const handleImport = (importedItems: MediaItem[]) => {
    setItems((prev) => [...prev, ...importedItems]);
    setIsLoaded(true);
  };

  const handleStartFresh = () => {
    setItems([]);
    setIsLoaded(true);
  };

  const handleExport = () => {
    const json = JSON.stringify(items, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nihas-archive-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  if (!isLoaded) {
    return (
      <>
        <LoadPrompt 
          onStartFresh={handleStartFresh} 
          onImport={() => setShowImportModal(true)} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        {showImportModal && (
          <ImportModal onClose={() => setShowImportModal(false)} onImport={handleImport} theme={theme} />
        )}
      </>
    );
  }

  return (
    <div className={`min-h-screen pb-8 ${isDark ? "bg-slate-950" : "bg-rose-50"}`}>
      <div className={`sticky top-0 z-20 backdrop-blur border-b ${isDark ? "bg-slate-950/95 border-slate-800" : "bg-rose-50/95 border-rose-200"}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setShowAddModal(true)} className={`p-2 rounded-xl transition-all ${isDark ? "text-gray-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-800 hover:bg-white"}`}>
            <Plus className="w-6 h-6" />
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
            Niha's Archive
          </h1>
          
          <div className="flex gap-2">
            <button onClick={toggleTheme} className={`p-2 rounded-xl transition-all ${isDark ? "text-gray-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-800 hover:bg-white"}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setShowImportModal(true)} className={`p-2 rounded-xl transition-all ${isDark ? "text-gray-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-800 hover:bg-white"}`}>
              <Upload className="w-5 h-5" />
            </button>
            <button onClick={handleExport} className={`p-2 rounded-xl transition-all ${isDark ? "text-gray-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-800 hover:bg-white"}`}>
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6">
        <TypeSection
          title="Books"
          items={books}
          accentDark="text-rose-400"
          accentLight="text-rose-500"
          onItemClick={setSelectedItem}
          theme={theme}
        />

        <TypeSection
          title="Anime"
          items={anime}
          accentDark="text-fuchsia-400"
          accentLight="text-fuchsia-500"
          onItemClick={setSelectedItem}
          theme={theme}
        />

        <TypeSection
          title="Movies & TV"
          items={movies}
          accentDark="text-violet-400"
          accentLight="text-violet-500"
          onItemClick={setSelectedItem}
          theme={theme}
        />
      </div>

      {showAddModal && (
        <AddMediaModal onClose={() => setShowAddModal(false)} onAdd={handleAddItem} theme={theme} />
      )}

      {showImportModal && (
        <ImportModal onClose={() => setShowImportModal(false)} onImport={handleImport} theme={theme} />
      )}

      {selectedItem && (
        <MediaCard
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          theme={theme}
        />
      )}
    </div>
  );
}