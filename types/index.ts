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
