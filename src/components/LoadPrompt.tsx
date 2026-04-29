import { ThemeMode } from "../types";
import { BookOpen, Sparkles } from "lucide-react";

interface LoadPromptProps {
  onStartFresh: () => void;
  onImport: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function LoadPrompt({ onStartFresh, onImport, theme, onToggleTheme }: LoadPromptProps) {
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDark ? "bg-slate-950" : "bg-rose-50"}`}>
      <button
        onClick={onToggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-xl transition-all ${isDark ? "text-gray-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-800 hover:bg-white"}`}
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      <div className="text-center max-w-md">
        <div className="mb-6">
          <Sparkles className={`w-16 h-16 mx-auto ${isDark ? "text-rose-400" : "text-rose-500"}`} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent mb-4">
          Niha's Archive
        </h1>
        
        <p className={`text-lg mb-8 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
          Your personal library of books, anime, and movies
        </p>

        <div className="space-y-3">
          <button
            onClick={onStartFresh}
            className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Start Fresh
          </button>
          
          <button
            onClick={onImport}
            className={`w-full py-4 rounded-xl font-medium transition-all ${
              isDark 
                ? "bg-slate-800 hover:bg-slate-700 text-gray-300" 
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            Import from File
          </button>
        </div>
      </div>
    </div>
  );
}