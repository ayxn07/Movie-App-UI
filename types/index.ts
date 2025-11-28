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

// Category Type with filters
export type CategoryType = "popular" | "top10" | "trending" | "genre";

// My List Item Type
export interface MyListItem extends Movie {
  addedAt: string;
}

// Review Type
export interface Review {
  id: string;
  movieId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
}

// Friend Type
export interface Friend {
  id: string;
  name: string;
  avatar: string;
  username: string;
  isOnline: boolean;
  lastActive?: string;
  favoriteMovies: number[];
  watchedCount: number;
}

// Chat Message Type
export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  image?: string;
  timestamp: string;
  isRead: boolean;
}

// Chat Type
export interface Chat {
  id: string;
  friendId: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Continue Watching Type
export interface ContinueWatchingItem {
  id: number;
  title: string;
  image: string;
  progress: number;
  remainingTime: string;
  type: "movie" | "series";
  episode?: string;
}
