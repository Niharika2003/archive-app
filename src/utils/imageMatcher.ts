import { MediaItem } from "../types";

// Google Books API - excellent for book covers
export async function getGoogleBooksCover(title: string, author?: string): Promise<string | null> {
  try {
    const query = author ? `${title} ${author}` : title;
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5&fields=items(volumeInfo/title,imageLinks/thumbnail,imageLinks/small,imageLinks/medium)`
    );
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      // Find best match by title similarity
      for (const item of data.items) {
        const bookTitle = item.volumeInfo?.title?.toLowerCase() || "";
        const searchTitle = title.toLowerCase();
        
        // Check if titles match closely
        if (bookTitle.includes(searchTitle) || searchTitle.includes(bookTitle) || 
            levenshteinSimilarity(bookTitle, searchTitle) > 0.7) {
          const images = item.volumeInfo?.imageLinks;
          if (images) {
            // Return the highest quality available
            return (images.medium || images.small || images.thumbnail || "")
              .replace("http:", "https:")
              .replace("&edge=curl", "");
          }
        }
      }
      
      // Fallback to first result
      const first = data.items[0].volumeInfo?.imageLinks;
      if (first) {
        return (first.medium || first.small || first.thumbnail || "")
          .replace("http:", "https:")
          .replace("&edge=curl", "");
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Open Library API - another great source for book covers
export async function getOpenLibraryCover(title: string, author?: string): Promise<string | null> {
  try {
    // Search by title
    const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}${author ? `&author=${encodeURIComponent(author)}` : ""}&limit=5`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.docs && data.docs.length > 0) {
      // Find best match
      for (const doc of data.docs) {
        const docTitle = (doc.title || "").toLowerCase();
        const searchTitle = title.toLowerCase();
        
        if (levenshteinSimilarity(docTitle, searchTitle) > 0.6) {
          // Get cover ID
          const coverId = doc.cover_i;
          if (coverId) {
            return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
          }
        }
      }
      
      // Fallback to first result with cover
      const firstCover = data.docs.find((d: any) => d.cover_i);
      if (firstCover?.cover_i) {
        return `https://covers.openlibrary.org/b/id/${firstCover.cover_i}-L.jpg`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// AniList GraphQL API - excellent for anime, uses same covers as MAL
export async function getAniListCover(title: string): Promise<string | null> {
  try {
    const query = `
      query ($search: String) {
        Media (search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
        }
      }
    `;
    
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { search: title } })
    });
    
    const data = await response.json();
    const media = data.data?.Media;
    
    if (media?.coverImage) {
      // Verify title match
      const titles = [
        media.title?.romaji,
        media.title?.english,
        media.title?.native
      ].filter(Boolean).map(t => t.toLowerCase());
      
      const searchTitle = title.toLowerCase();
      const isMatch = titles.some(t => 
        t.includes(searchTitle) || searchTitle.includes(t) || 
        levenshteinSimilarity(t, searchTitle) > 0.6
      );
      
      if (isMatch || titles.length === 0) {
        return media.coverImage.extraLarge || media.coverImage.large || null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Kitsu API - another anime database
export async function getKitsuCover(title: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(title)}&page[limit]=5`
    );
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      for (const anime of data.data) {
        const titles = [
          anime.attributes?.titles?.en,
          anime.attributes?.titles?.en_jp,
          anime.attributes?.titles?.ja_jp
        ].filter(Boolean).map(t => t.toLowerCase());
        
        const searchTitle = title.toLowerCase();
        const isMatch = titles.some(t => 
          t.includes(searchTitle) || searchTitle.includes(t) ||
          levenshteinSimilarity(t, searchTitle) > 0.6
        );
        
        if (isMatch) {
          return anime.attributes?.posterImage?.large || anime.attributes?.posterImage?.original || null;
        }
      }
      
      // Fallback to first
      const first = data.data[0];
      return first?.attributes?.posterImage?.large || first?.attributes?.posterImage?.original || null;
    }
    return null;
  } catch {
    return null;
  }
}

// OMDb API - uses official IMDb posters
export async function getOMDbPoster(title: string, year?: string): Promise<string | null> {
  try {
    // Extract year from title if present
    const yearMatch = title.match(/\((\d{4})\)/);
    const extractedYear = yearMatch?.[1] || year || "";
    const cleanTitle = title.replace(/\s*\(\d{4}\)\s*/, "").trim();
    
    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(cleanTitle)}&y=${extractedYear}&apikey=trilogy`
    );
    const data = await response.json();
    
    if (data.Response === "True" && data.Poster && data.Poster !== "N/A") {
      // Verify title match
      const apiTitle = (data.Title || "").toLowerCase();
      const searchTitle = cleanTitle.toLowerCase();
      
      if (apiTitle.includes(searchTitle) || searchTitle.includes(apiTitle) ||
          levenshteinSimilarity(apiTitle, searchTitle) > 0.7) {
        return data.Poster.replace("http:", "https:");
      }
    }
    return null;
  } catch {
    return null;
  }
}

// TMDB API - movie/TV database with high quality posters
export async function getTMDBPoster(title: string, year?: string): Promise<string | null> {
  try {
    const yearMatch = title.match(/\((\d{4})\)/);
    const extractedYear = yearMatch?.[1] || year || "";
    const cleanTitle = title.replace(/\s*\(\d{4}\)\s*/, "").trim();
    
    // TMDB requires API key, using their public search endpoint workaround
    // Note: In production, you'd use your own API key
    const searchUrl = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(cleanTitle)}${extractedYear ? `&year=${extractedYear}` : ""}&api_key=YOUR_API_KEY`;
    
    // For now, return null - users can add their own TMDB API key
    return null;
  } catch {
    return null;
  }
}

// Helper: Calculate string similarity using Levenshtein distance
function levenshteinSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  
  const matrix: number[][] = [];
  const aLen = a.length;
  const bLen = b.length;
  
  for (let i = 0; i <= aLen; i++) matrix[i] = [i];
  for (let j = 0; j <= bLen; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const maxLen = Math.max(aLen, bLen);
  return maxLen === 0 ? 1 : (maxLen - matrix[aLen][bLen]) / maxLen;
}

// Main function: Get image for any media item
export async function fetchMediaImage(item: MediaItem): Promise<string> {
  let imageUrl = "";
  
  switch (item.type) {
    case "Book":
      // Try Google Books first (better quality)
      imageUrl = await getGoogleBooksCover(item.title, item.creator) || "";
      
      if (!imageUrl) {
        // Try Open Library
        imageUrl = await getOpenLibraryCover(item.title, item.creator) || "";
      }
      
      if (!imageUrl) {
        // Last resort: try without author
        imageUrl = await getGoogleBooksCover(item.title) || "";
      }
      break;
      
    case "Anime":
      // Try AniList first (same covers as MAL)
      imageUrl = await getAniListCover(item.title) || "";
      
      if (!imageUrl) {
        // Try Kitsu as fallback
        imageUrl = await getKitsuCover(item.title) || "";
      }
      break;
      
    case "Movie":
      // Try OMDb (IMDb posters)
      imageUrl = await getOMDbPoster(item.title) || "";
      
      if (!imageUrl) {
        // Try with cleaned title
        const cleanTitle = item.title.replace(/\s*\(\d{4}\)\s*/, "");
        imageUrl = await getOMDbPoster(cleanTitle) || "";
      }
      break;
  }
  
  // Generate placeholder if no image found
  if (!imageUrl) {
    const seed = item.title.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const hue = item.type === "Book" ? 340 : item.type === "Anime" ? 280 : 260;
    imageUrl = `https://picsum.photos/seed/${seed}/300/450`;
  }
  
  return imageUrl;
}

// Batch fetch with progress callback
export async function batchFetchImages(
  items: MediaItem[],
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.image) {
      const imageUrl = await fetchMediaImage(item);
      results.set(item.id, imageUrl);
    }
    
    onProgress?.(i + 1, items.length);
    
    // Small delay to avoid rate limiting
    if (i < items.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 150));
    }
  }
  
  return results;
}