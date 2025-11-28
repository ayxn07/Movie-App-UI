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

// Cast Member Type
export interface CastMember {
  name: string;
  role: string;
  image: string;
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

// Notification Type
export interface NotificationItem {
  id: string;
  type: "movie" | "series" | "system" | "social";
  title: string;
  message: string;
  image?: string;
  timestamp: string;
  isRead: boolean;
}
