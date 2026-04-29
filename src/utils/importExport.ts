import { MediaItem } from "../types";
import { fetchMediaImage, batchFetchImages } from "./imageMatcher";

export function exportToJSON(items: MediaItem[]): string {
  return JSON.stringify(items, null, 2);
}

export function importFromJSON(jsonString: string): MediaItem[] {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed)) throw new Error("Expected an array");
  
  return parsed.map((item, index) => ({
    id: item.id || `imported-${Date.now()}-${index}`,
    title: item.title || "Unknown Title",
    creator: item.creator || "Unknown",
    type: ["Book", "Anime", "Movie"].includes(item.type) ? item.type : "Book",
    genre: item.genre || "Unknown",
    status: ["planned", "watching", "completed"].includes(item.status) ? item.status : "planned",
    rating: typeof item.rating === "number" ? item.rating : undefined,
    image: item.image || ""
  }));
}

export function parseGoodreadsCSV(csvString: string): MediaItem[] {
  const lines = csvString.split("\n");
  if (lines.length < 2) throw new Error("CSV file is empty");

  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());
  const titleIdx = headers.findIndex(h => h.includes("title") && !h.includes("original"));
  const authorIdx = headers.findIndex(h => h.includes("author"));
  const ratingIdx = headers.findIndex(h => h.includes("rating") && !h.includes("average"));
  const shelfIdx = headers.findIndex(h => h.includes("exclusive shelf") || h.includes("bookshelves") || h.includes("shelf"));
  const isbn13Idx = headers.findIndex(h => h.includes("isbn13"));
  const isbnIdx = headers.findIndex(h => h === "isbn" || h === "isbn10");

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

export function parseMALXML(xmlString: string): MediaItem[] {
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

export function parseIMDbCSV(csvString: string): MediaItem[] {
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

// Enrich imported items with images using exact title matching
export async function enrichWithImages(
  items: MediaItem[],
  onProgress?: (current: number, total: number) => void
): Promise<MediaItem[]> {
  const imageMap = await batchFetchImages(items, onProgress);
  
  return items.map(item => ({
    ...item,
    image: imageMap.get(item.id) || item.image || ""
  }));
}