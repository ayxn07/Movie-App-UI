import { Genre, Movie } from "@/types";

// ============================================================================
// MOVIE POSTER IMAGES - Edit these URLs to change movie posters
// ============================================================================
// All images should be movie poster format (portrait orientation)
// Recommended size: 400x600 pixels or similar aspect ratio
// ============================================================================

export const MovieImages = {
  // ======================== POPULAR MOVIES ========================
  
  // Dune: Part Two (2024) - Sci-Fi desert epic with Paul Atreides
  DUNE_PART_TWO: "https://m.media-amazon.com/images/I/81Rrx-Bv+6L.jpg",
  
  // Oppenheimer (2023) - Christopher Nolan's atomic bomb drama
  OPPENHEIMER: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg",
  
  // The Batman (2022) - Robert Pattinson as dark detective Batman
  THE_BATMAN: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg",
  
  // Avatar: The Way of Water (2022) - James Cameron's Pandora sequel
  AVATAR_WAY_OF_WATER: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg",
  
  // Interstellar (2014) - Christopher Nolan's space exploration epic
  INTERSTELLAR: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",

  // ======================== TRENDING MOVIES ========================
  
  // John Wick: Chapter 4 (2023) - Keanu Reeves action thriller
  JOHN_WICK_4: "https://lh3.googleusercontent.com/proxy/8NNuLzyjKLZEO-oPa6gjCXpVEvEsZxqpJyuxra2buSlitLa2n-kFuKUBL-DgUYcipqoJUYHTy2ZMXdHfXLIq9IiLJ3d4cWHYvBBv9I1jyRwxmIM",
  
  // Spider-Man: No Way Home (2021) - Multiverse Spider-Man crossover
  SPIDERMAN_NO_WAY_HOME: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg",
  
  // Top Gun: Maverick (2022) - Tom Cruise fighter pilot sequel
  TOP_GUN_MAVERICK: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg",
  
  // Inception (2010) - Christopher Nolan's dream heist thriller
  INCEPTION: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",

  // ======================== TOP RATED MOVIES ========================
  
  // The Dark Knight (2008) - Heath Ledger's Joker masterpiece
  THE_DARK_KNIGHT: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
  
  // The Shawshank Redemption (1994) - Prison drama classic
  SHAWSHANK_REDEMPTION: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
  
  // The Godfather (1972) - Marlon Brando mafia classic
  THE_GODFATHER: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",

  // ======================== FEATURED MOVIE ========================
  
  // Deadpool & Wolverine (2024) - Marvel multiverse action comedy
  DEADPOOL_WOLVERINE: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFs2b42I8mdYGULACpk8zRlBMHFP_ligKNHTuYvnswpNg4rDm87RY2K74SJ-kh6Wtj9mbZiw&s=10",
};

// ============================================================================
// Color palette
// ============================================================================
export const Colors = {
  primary: "#8b5cf6",
  primaryDark: "#6366f1",
  secondary: "#ec4899",
  accent: "#f59e0b",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  background: "#020617",
  backgroundLight: "#0f172a",
  backgroundLighter: "#1e293b",
  card: "#1e293b",
  cardHover: "#334155",
  text: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  border: "#334155",
  star: "#fbbf24",
};

// ============================================================================
// MOVIE DATA - Uses images from MovieImages above
// ============================================================================

// Popular Movies
export const MOVIES: Movie[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    rating: 8.8,
    image: MovieImages.DUNE_PART_TWO,
    genre: "Sci-Fi",
    year: "2024",
    duration: "2h 46m",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
  },
  {
    id: 2,
    title: "Oppenheimer",
    rating: 8.9,
    image: MovieImages.OPPENHEIMER,
    genre: "Drama",
    year: "2023",
    duration: "3h 00m",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
  },
  {
    id: 3,
    title: "The Batman",
    rating: 8.5,
    image: MovieImages.THE_BATMAN,
    genre: "Action",
    year: "2022",
    duration: "2h 56m",
    description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
  },
  {
    id: 4,
    title: "Avatar: The Way of Water",
    rating: 8.4,
    image: MovieImages.AVATAR_WAY_OF_WATER,
    genre: "Adventure",
    year: "2022",
    duration: "3h 12m",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
  },
  {
    id: 5,
    title: "Interstellar",
    rating: 9.0,
    image: MovieImages.INTERSTELLAR,
    genre: "Sci-Fi",
    year: "2014",
    duration: "2h 49m",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
];

// Trending Movies
export const TRENDING: Movie[] = [
  {
    id: 6,
    title: "John Wick: Chapter 4",
    rating: 8.7,
    image: MovieImages.JOHN_WICK_4,
    genre: "Action",
    year: "2023",
    duration: "2h 49m",
    description: "John Wick uncovers a path to defeating The High Table, but must face a new enemy with powerful alliances.",
  },
  {
    id: 7,
    title: "Spider-Man: No Way Home",
    rating: 8.9,
    image: MovieImages.SPIDERMAN_NO_WAY_HOME,
    genre: "Action",
    year: "2021",
    duration: "2h 28m",
    description: "Peter Parker's secret identity is revealed, and he asks Doctor Strange for help to restore his secret.",
  },
  {
    id: 8,
    title: "Top Gun: Maverick",
    rating: 8.8,
    image: MovieImages.TOP_GUN_MAVERICK,
    genre: "Action",
    year: "2022",
    duration: "2h 11m",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
  },
  {
    id: 9,
    title: "Inception",
    rating: 9.0,
    image: MovieImages.INCEPTION,
    genre: "Sci-Fi",
    year: "2010",
    duration: "2h 28m",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.",
  },
];

// Top Rated Movies
export const TOP_RATED: Movie[] = [
  {
    id: 10,
    title: "The Dark Knight",
    rating: 9.5,
    image: MovieImages.THE_DARK_KNIGHT,
    genre: "Action",
    year: "2008",
    duration: "2h 32m",
    description: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.",
  },
  {
    id: 11,
    title: "The Shawshank Redemption",
    rating: 9.7,
    image: MovieImages.SHAWSHANK_REDEMPTION,
    genre: "Drama",
    year: "1994",
    duration: "2h 22m",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  },
  {
    id: 12,
    title: "The Godfather",
    rating: 9.6,
    image: MovieImages.THE_GODFATHER,
    genre: "Crime",
    year: "1972",
    duration: "2h 55m",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  },
];

// Genres
export const GENRES: Genre[] = [
  { name: "Action", icon: "flash", colors: ["#ef4444", "#dc2626"] },
  { name: "Comedy", icon: "happy", colors: ["#f59e0b", "#d97706"] },
  { name: "Drama", icon: "heart", colors: ["#ec4899", "#db2777"] },
  { name: "Horror", icon: "skull", colors: ["#6366f1", "#4f46e5"] },
  { name: "Sci-Fi", icon: "planet", colors: ["#06b6d4", "#0891b2"] },
  { name: "Crime", icon: "skull", colors: ["#f43f5e", "#e11d48"] },
];

// Featured Movie (shown in hero section)
export const FEATURED_MOVIE: Movie = {
  id: 100,
  title: "Deadpool & Wolverine",
  rating: 8.5,
  image: MovieImages.DEADPOOL_WOLVERINE,
  genre: "Action",
  year: "2024",
  duration: "2h 07m",
  description: "Deadpool is offered a place in the Marvel Cinematic Universe by the TVA, but instead recruits a variant of Wolverine to save his universe from extinction.",
};

// All movies combined for explore screen
export const ALL_MOVIES: Movie[] = [...MOVIES, ...TRENDING, ...TOP_RATED];
