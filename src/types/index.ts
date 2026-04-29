export type MediaType = "Book" | "Anime" | "Movie";
export type MediaStatus = "planned" | "watching" | "completed";

export interface MediaItem {
  id: string;
  title: string;
  creator: string;
  type: MediaType;
  genre: string;
  status: MediaStatus;
  rating?: number;
  image: string;
}

export type ThemeMode = "dark" | "light";