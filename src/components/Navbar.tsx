import { Plus, Upload } from "lucide-react";

export function Navbar({ onAddClick, onImportClick }: { onAddClick: () => void; onImportClick: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black to-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-500 tracking-wide">
            LUMINA
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onImportClick}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}