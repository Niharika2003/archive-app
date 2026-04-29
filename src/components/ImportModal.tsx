import { useState, useRef } from "react";
import { X, Upload, BookOpen, Tv, Film } from "lucide-react";
import { MediaItem, ThemeMode } from "../types";

interface ImportModalProps {
  onClose: () => void;
  onImport: (items: MediaItem[]) => void;
  theme: ThemeMode;
}

type ImportType = "mal" | "goodreads" | "imdb";

export function ImportModal({ onClose, onImport, theme }: ImportModalProps) {
  const [importType, setImportType] = useState<ImportType>("goodreads");
  const [importText, setImportText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === "dark";

  const handleImport = () => {
    setError(null);
    
    try {
      let items: MediaItem[] = [];
      
      switch (importType) {
        case "goodreads":
          items = parseGoodreadsCSV(importText);
          break;
        case "mal":
          items = parseMALXML(importText);
          break;
        case "imdb":
          items = parseIMDbCSV(importText);
          break;
      }
      
      if (items.length === 0) {
        throw new Error("No valid entries found in the imported file");
      }
      
      onImport(items);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener("loadend", () => {
      const text = reader.result;
      if (typeof text === "string") {
        setImportText(text);
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "xml") {
          setImportType("mal");
        } else if (file.name.toLowerCase().includes("imdb")) {
          setImportType("imdb");
        } else {
          setImportType("goodreads");
        }
      }
    });
  };

  const importTypes: { id: ImportType; label: string; icon: React.ReactNode }[] = [
    { id: "goodreads", label: "Goodreads", icon: <BookOpen className="w-4 h-4" /> },
    { id: "mal", label: "MAL", icon: <Tv className="w-4 h-4" /> },
    { id: "imdb", label: "IMDb", icon: <Film className="w-4 h-4" /> },
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? "bg-black/80" : "bg-white/80"}`} onClick={onClose}>
      <div className={`rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl ${isDark ? "bg-slate-900" : "bg-white"}`} onClick={(e) => e.stopPropagation()}>
        <div className={`flex items-center justify-between p-5 ${isDark ? "border-b border-slate-800" : "border-b border-slate-100"}`}>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Import</h2>
          <button onClick={onClose} className={isDark ? "text-gray-400 hover:text-white" : "text-slate-400 hover:text-slate-800"}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-2">
            {importTypes.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setImportType(id)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1 transition-all ${
                  importType === id 
                    ? "bg-rose-400 text-white shadow-md" 
                    : isDark 
                    ? "bg-slate-800 text-gray-400" 
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {importType === "goodreads" && (
            <div className={`rounded-xl p-3 text-xs space-y-1 ${isDark ? "bg-slate-800/50 text-gray-400" : "bg-slate-100 text-slate-500"}`}>
              <p className={`font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>Goodreads CSV:</p>
              <p>• Go to Goodreads → My Books → Import/Export</p>
              <p>• Click "Export Library" to download CSV</p>
            </div>
          )}

          {importType === "mal" && (
            <div className={`rounded-xl p-3 text-xs space-y-1 ${isDark ? "bg-slate-800/50 text-gray-400" : "bg-slate-100 text-slate-500"}`}>
              <p className={`font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>MyAnimeList XML:</p>
              <p>• Go to MAL → Profile → Settings → Privacy</p>
              <p>• Click "Export My Anime Data"</p>
            </div>
          )}

          {importType === "imdb" && (
            <div className={`rounded-xl p-3 text-xs space-y-1 ${isDark ? "bg-slate-800/50 text-gray-400" : "bg-slate-100 text-slate-500"}`}>
              <p className={`font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>IMDb CSV:</p>
              <p>• Go to IMDb → Your Watchlist / Ratings</p>
              <p>• Click "Export" to download CSV</p>
            </div>
          )}

          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.xml" className="hidden" />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full py-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all ${
              isDark 
                ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-gray-300" 
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500"
            }`}
          >
            <Upload className="w-5 h-5" />
            Upload File
          </button>

          <div>
            <label className={`block text-sm mb-2 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Or paste content:</label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 resize-none font-mono text-xs focus:outline-none ${
                isDark 
                  ? "bg-slate-800 border-slate-700 text-white focus:border-rose-400" 
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400"
              }`}
              rows={6}
              placeholder={
                importType === "goodreads" ? "Paste Goodreads CSV..." :
                importType === "mal" ? "Paste MAL XML..." :
                "Paste IMDb CSV..."
              }
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={!importText.trim()}
            className="w-full bg-rose-400 hover:bg-rose-500 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-all shadow-md"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseGoodreadsCSV(csvString: string): MediaItem[] {
  const lines = csvString.split("\n");
  if (lines.length < 2) throw new Error("CSV file is empty");

  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());
  const titleIdx = headers.findIndex(h => h.includes("title") && !h.includes("original"));
  const authorIdx = headers.findIndex(h => h.includes("author"));
  const ratingIdx = headers.findIndex(h => h.includes("rating") && !h.includes("average"));
  const shelfIdx = headers.findIndex(h => h.includes("exclusive shelf") || h.includes("bookshelves") || h.includes("shelf"));

  if (titleIdx === -1) throw new Error("No Title column found");

  const books: MediaItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const title = values[titleIdx]?.replace(/^"|"$/g, "").trim();
    if (!title) continue;

    const author = authorIdx !== -1 ? values[authorIdx]?.replace(/^"|"$/g, "").trim() : "Unknown";
    const ratingStr = ratingIdx !== -1 ? values[ratingIdx]?.trim() : "0";
    const shelf = shelfIdx !== -1 ? (values[shelfIdx]?.toLowerCase() || "") : "";

    let status: "planned" | "watching" | "completed" = "planned";
    
    if (shelf.includes("to-read") || shelf.includes("to read") || shelf.includes("want")) {
      status = "planned";
    } else if (shelf.includes("reading") || shelf.includes("currently")) {
      status = "watching";
    } else if (shelf.includes("read") && !shelf.includes("to")) {
      status = "completed";
    }

    const rating = ratingStr ? parseInt(ratingStr) : 0;

    books.push({
      id: `goodreads-${Date.now()}-${i}`,
      title,
      creator: author || "Unknown",
      type: "Book",
      genre: "Imported",
      status,
      rating: rating > 0 ? rating : undefined,
      image: ""
    });
  }

  return books;
}

function parseMALXML(xmlString: string): MediaItem[] {
  const items: MediaItem[] = [];
  
  const animeMatches = xmlString.match(/<anime>[\s\S]*?<\/anime>/gi) || [];
  
  for (let i = 0; i < animeMatches.length; i++) {
    const animeBlock = animeMatches[i];
    
    const titleMatch = animeBlock.match(/<series_title><!\[CDATA\[(.*?)\]\]><\/series_title>/i);
    const titleAltMatch = animeBlock.match(/<series_title>(.*?)<\/series_title>/i);
    const title = (titleMatch?.[1] || titleAltMatch?.[1] || "Unknown").trim();
    
    const scoreMatch = animeBlock.match(/<my_score>(\d+)<\/my_score>/i);
    const rating = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    
    const statusMatch = animeBlock.match(/<my_status>(.*?)<\/my_status>/i);
    const statusText = statusMatch?.[1]?.toLowerCase() || "";
    
    let status: "planned" | "watching" | "completed" = "planned";
    if (statusText.includes("watching") || statusText.includes("reading")) {
      status = "watching";
    } else if (statusText.includes("completed") || statusText.includes("finished")) {
      status = "completed";
    } else if (statusText.includes("plan") || statusText.includes("want")) {
      status = "planned";
    }
    
    const genreMatches = animeBlock.match(/<genre><!\[CDATA\[(.*?)\]\]><\/genre>/gi);
    const genres = genreMatches?.map(g => {
      const m = g.match(/<genre><!\[CDATA\[(.*?)\]\]><\/genre>/i);
      return m?.[1] || "";
    }).filter(Boolean).slice(0, 3).join(" / ") || "Anime";
    
    items.push({
      id: `mal-${Date.now()}-${i}`,
      title,
      creator: "Unknown",
      type: "Anime",
      genre: genres,
      status,
      rating: rating > 0 ? rating : undefined,
      image: ""
    });
  }
  
  return items;
}

function parseIMDbCSV(csvString: string): MediaItem[] {
  const lines = csvString.split("\n");
  if (lines.length < 2) throw new Error("CSV file is empty");
  
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());
  
  const titleIdx = headers.findIndex(h => h.includes("title") || h.includes("name") || h === "const");
  const typeIdx = headers.findIndex(h => h.includes("titletype") || h.includes("type"));
  const ratingIdx = headers.findIndex(h => h.includes("yourrating") || h.includes("your rating"));
  const yearIdx = headers.findIndex(h => h.includes("year") || h.includes("startyear"));
  const directorsIdx = headers.findIndex(h => h.includes("director"));
  const genreIdx = headers.findIndex(h => h.includes("genre"));
  
  if (titleIdx === -1) throw new Error("No Title column found");
  
  const items: MediaItem[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    const title = values[titleIdx]?.replace(/^"|"$/g, "").trim();
    if (!title) continue;
    
    const typeValue = typeIdx !== -1 ? values[typeIdx]?.toLowerCase() : "";
    let type: "Movie" | "Anime" | "Book" = "Movie";
    if (typeValue.includes("tvseries") || typeValue.includes("tv mini")) {
      type = "Movie";
    }
    
    const year = yearIdx !== -1 ? values[yearIdx]?.trim() : "";
    const creator = directorsIdx !== -1 ? values[directorsIdx]?.replace(/^"|"$/g, "").trim() : "Unknown";
    const ratingStr = ratingIdx !== -1 ? values[ratingIdx]?.trim() : "0";
    const rating = ratingStr ? parseInt(ratingStr) : 0;
    const genre = genreIdx !== -1 ? values[genreIdx]?.replace(/^"|"$/g, "").trim() : "Unknown";
    
    items.push({
      id: `imdb-${Date.now()}-${i}`,
      title: year ? `${title} (${year})` : title,
      creator: creator || "Unknown",
      type,
      genre: genre || "Imported",
      status: "completed",
      rating: rating > 0 ? rating : undefined,
      image: ""
    });
  }
  
  return items;
}