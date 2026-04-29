import { Plus, Download, Upload } from "lucide-react";

interface HeaderProps {
  onAddClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
}

export function Header({ onAddClick, onImportClick, onExportClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">LUMINA</h1>
        <p className="text-gray-500 text-sm mt-1">Your atmospheric archive</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onImportClick}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg transition-colors"
          title="Import"
        >
          <Upload className="w-5 h-5" />
        </button>
        <button
          onClick={onExportClick}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg transition-colors"
          title="Export"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
    </header>
  );
}