// Movie Types
export interface Movie {
  id: number;
  title: string;
  rating: number;
  image: string;
  genre: string;
  year: string;
  duration: string;
  description?: string;
}

// Series Types
export interface Series {
  id: number;
  title: string;
  rating: number;
  image: string;
  genre: string;
  year: string;
  seasons: number;
  episodes: number;
  description?: string;
}

// Live Event Types
export interface LiveEvent {
  id: number;
  title: string;
  channel: string;
  image: string;
  category: string;
  isLive: boolean;
  viewers: number;
  startTime: string;
}

// Download Types
export interface Download {
  id: number;
  title: string;
  image: string;
  type: "movie" | "series" | "episode";
  progress: number;
  size: string;
  status: "downloading" | "completed" | "paused";
}

// Genre Type
export interface Genre {
  name: string;
  icon: string;
  colors: [string, string];
}

// Tab Type
export interface TabItem {
  name: string;
  icon: string;
  activeIcon: string;
}

// Content Type
export type ContentType = "movies" | "series" | "live" | "downloads";
