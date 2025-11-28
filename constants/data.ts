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

// ============================================================================
// REAL CAST DATA - Actual actors for each movie
// ============================================================================

export interface CastMember {
  name: string;
  role: string;
  image: string;
}

export interface MovieCastData {
  movieId: number;
  cast: CastMember[];
  director: string;
  writers: string;
  studio: string;
  budget: string;
  boxOffice: string;
}

export const MOVIE_CAST_DATA: Record<number, MovieCastData> = {
  // Dune: Part Two
  1: {
    movieId: 1,
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", image: "https://bookingagentinfo.com/wp-content/uploads/2022/12/Timothee-Chalamet-1.jpg" },
      { name: "Zendaya", role: "Chani", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTLnNMvyL_jyq3g0n3pY-MveoxnSe1dWw2uWHytPmdARy43vDJ8h7nl58i6uyT-Mbx7WQ&usqp=CAU" },
      { name: "Rebecca Ferguson", role: "Lady Jessica", image: "https://cdn.britannica.com/39/247539-050-B8127C0B/Rebecca-Ferguson-actress-BAFTA-Awards-2023.jpg" },
      { name: "Austin Butler", role: "Feyd-Rautha", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSMCOsl7yKY_7Sfwe_6e8m6horninadgBRZPSY2i_AMYYT9De-daf_iX78qoCdIYjhk0ZWXI6rl71VVUtUpQk3nt8FokT5t1hoqlGRcQ&s=10" },
      { name: "Florence Pugh", role: "Princess Irulan", image: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Florence_Pugh_at_the_2024_Toronto_International_Film_Festival_13_%28cropped_2_%E2%80%93_color_adjusted%29.jpg" },
    ],
    director: "Denis Villeneuve",
    writers: "Jon Spaihts, Denis Villeneuve",
    studio: "Warner Bros. Pictures",
    budget: "$190 Million",
    boxOffice: "$711 Million",
  },
  // Oppenheimer
  2: {
    movieId: 2,
    cast: [
      { name: "Cillian Murphy", role: "J. Robert Oppenheimer", image: "https://m.media-amazon.com/images/M/MV5BMDBkZDNjMWEtOGU5NS00YjNlLTgwNjAtODM5MDNlYjIxMjhjXkEyXkFqcGdeQXVyMjMxOTE0ODA@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Emily Blunt", role: "Kitty Oppenheimer", image: "https://m.media-amazon.com/images/M/MV5BMTMzMDI0MzE1M15BMl5BanBnXkFtZTcwNDc2Mjc0NA@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Matt Damon", role: "Leslie Groves", image: "https://m.media-amazon.com/images/M/MV5BMTM0NzYzNDg0MV5BMl5BanBnXkFtZTcwMjg4MTkxNw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Robert Downey Jr.", role: "Lewis Strauss", image: "https://m.media-amazon.com/images/M/MV5BNzg1MTUyNDYxOF5BMl5BanBnXkFtZTgwNTQ4MTE2MjE@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Florence Pugh", role: "Jean Tatlock", image: "https://m.media-amazon.com/images/M/MV5BZjgyNjUzMDMtZGZiOS00MWI0LWIxZjgtYzM1NjRhOGI4ZjM4XkEyXkFqcGdeQXVyODQzNTE3ODc@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Christopher Nolan",
    writers: "Christopher Nolan",
    studio: "Universal Pictures",
    budget: "$100 Million",
    boxOffice: "$952 Million",
  },
  // The Batman
  3: {
    movieId: 3,
    cast: [
      { name: "Robert Pattinson", role: "Bruce Wayne / Batman", image: "https://m.media-amazon.com/images/M/MV5BNzk0MDQ5OTUxMV5BMl5BanBnXkFtZTcwMDM5ODk5Mg@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Zoë Kravitz", role: "Selina Kyle / Catwoman", image: "https://m.media-amazon.com/images/M/MV5BZTcyNTc5MDQtNWJmMy00MzFlLTkxYmYtOTIxZDk1YTA2MzRjXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Paul Dano", role: "The Riddler", image: "https://m.media-amazon.com/images/M/MV5BMTQ5OTUyMzI4N15BMl5BanBnXkFtZTgwMDYyODkzMzE@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Jeffrey Wright", role: "James Gordon", image: "https://m.media-amazon.com/images/M/MV5BMjI1NDEyNTg2NF5BMl5BanBnXkFtZTcwODI3ODMzMw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Colin Farrell", role: "The Penguin", image: "https://m.media-amazon.com/images/M/MV5BMTYzMzExNjMxNF5BMl5BanBnXkFtZTcwMjQ4MjMxMw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Matt Reeves",
    writers: "Matt Reeves, Peter Craig",
    studio: "Warner Bros. Pictures",
    budget: "$185 Million",
    boxOffice: "$772 Million",
  },
  // Avatar: The Way of Water
  4: {
    movieId: 4,
    cast: [
      { name: "Sam Worthington", role: "Jake Sully", image: "https://m.media-amazon.com/images/M/MV5BMTc5NTMyMjIwMV5BMl5BanBnXkFtZTcwNTMyNjkxMw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Zoe Saldana", role: "Neytiri", image: "https://m.media-amazon.com/images/M/MV5BMTM0MjkzNDE4MV5BMl5BanBnXkFtZTcwMDM5NjQwNw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Sigourney Weaver", role: "Kiri", image: "https://m.media-amazon.com/images/M/MV5BMTk1MTcyNTE3OV5BMl5BanBnXkFtZTcwMTA0MTMyMw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Kate Winslet", role: "Ronal", image: "https://m.media-amazon.com/images/M/MV5BODgzMzM2NTE0Ml5BMl5BanBnXkFtZTcwMTcyMTkyOQ@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Stephen Lang", role: "Quaritch", image: "https://m.media-amazon.com/images/M/MV5BMjExOTY3NzExM15BMl5BanBnXkFtZTcwMzY3MTE1Mw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "James Cameron",
    writers: "James Cameron, Rick Jaffa",
    studio: "20th Century Studios",
    budget: "$350 Million",
    boxOffice: "$2.3 Billion",
  },
  // Interstellar
  5: {
    movieId: 5,
    cast: [
      { name: "Matthew McConaughey", role: "Cooper", image: "https://m.media-amazon.com/images/M/MV5BMTg0MDc3ODUwOV5BMl5BanBnXkFtZTcwMTk2NjY4Nw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Anne Hathaway", role: "Brand", image: "https://m.media-amazon.com/images/M/MV5BMTRhNzQ3NGMtZmQ1Mi00ZTViLTk3OTgtOTk0YzE2YTgwMmFjXkEyXkFqcGdeQXVyNzg5MzIyOA@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Jessica Chastain", role: "Murph", image: "https://m.media-amazon.com/images/M/MV5BMTU1MDM5NjczOF5BMl5BanBnXkFtZTcwOTY2MDE4OA@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Michael Caine", role: "Professor Brand", image: "https://m.media-amazon.com/images/M/MV5BMjAwNzIwNTQ4Ml5BMl5BanBnXkFtZTYwMzE1MTUz._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Matt Damon", role: "Mann", image: "https://m.media-amazon.com/images/M/MV5BMTM0NzYzNDg0MV5BMl5BanBnXkFtZTcwMjg4MTkxNw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Christopher Nolan",
    writers: "Jonathan Nolan, Christopher Nolan",
    studio: "Paramount Pictures",
    budget: "$165 Million",
    boxOffice: "$773 Million",
  },
  // John Wick: Chapter 4
  6: {
    movieId: 6,
    cast: [
      { name: "Keanu Reeves", role: "John Wick", image: "https://m.media-amazon.com/images/M/MV5BNGJmMWEzOGQtMWZkNS00MGNiLTk5NGEtYzg1YzAyZTgzZTZmXkEyXkFqcGdeQXVyMTE1MTYxNDAw._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Donnie Yen", role: "Caine", image: "https://m.media-amazon.com/images/M/MV5BMTg0MTM0MTMwNV5BMl5BanBnXkFtZTgwODI5NzQ1MDE@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Bill Skarsgård", role: "Marquis de Gramont", image: "https://m.media-amazon.com/images/M/MV5BMjExNzA0NjkxN15BMl5BanBnXkFtZTgwODQ0ODkxMjE@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Laurence Fishburne", role: "Bowery King", image: "https://m.media-amazon.com/images/M/MV5BMTc0NjczNDc1MV5BMl5BanBnXkFtZTYwMDU0Mjg1._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Ian McShane", role: "Winston", image: "https://m.media-amazon.com/images/M/MV5BMTQzMjkxMDY3OF5BMl5BanBnXkFtZTcwNTMwNTg5Mg@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Chad Stahelski",
    writers: "Shay Hatten, Michael Finch",
    studio: "Lionsgate",
    budget: "$100 Million",
    boxOffice: "$440 Million",
  },
  // Spider-Man: No Way Home
  7: {
    movieId: 7,
    cast: [
      { name: "Tom Holland", role: "Peter Parker / Spider-Man", image: "https://m.media-amazon.com/images/M/MV5BNTAyMjQzNjY3MF5BMl5BanBnXkFtZTgwNDk2ODE1NjM@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Zendaya", role: "MJ", image: "https://m.media-amazon.com/images/M/MV5BMjAxZTk4NDAtYjI3Mi00OTk3LTg0NDEtNWFlNzE5NDM5MWM1XkEyXkFqcGdeQXVyOTI3MjYwOQ@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Benedict Cumberbatch", role: "Doctor Strange", image: "https://m.media-amazon.com/images/M/MV5BMjE0MDkzMDQwOF5BMl5BanBnXkFtZTgwOTE1Mjg1MzE@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Tobey Maguire", role: "Peter Parker", image: "https://m.media-amazon.com/images/M/MV5BMTcyNjk0NDQ5N15BMl5BanBnXkFtZTcwOTcwODA2NA@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Andrew Garfield", role: "Peter Parker", image: "https://m.media-amazon.com/images/M/MV5BMjE0NjI3MTYxOF5BMl5BanBnXkFtZTcwMTU2NjkxMw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Jon Watts",
    writers: "Chris McKenna, Erik Sommers",
    studio: "Sony Pictures / Marvel Studios",
    budget: "$200 Million",
    boxOffice: "$1.9 Billion",
  },
  // Top Gun: Maverick
  8: {
    movieId: 8,
    cast: [
      { name: "Tom Cruise", role: "Pete 'Maverick' Mitchell", image: "https://m.media-amazon.com/images/M/MV5BYTFlOTdjMjgtNmY0ZC00MDgxLThjNmEtZGIxZTQyZDdkMTRjXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Miles Teller", role: "Bradley 'Rooster' Bradshaw", image: "https://m.media-amazon.com/images/M/MV5BOTI1NTI1OTEwMV5BMl5BanBnXkFtZTgwNjA3Mjg3NjM@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Jennifer Connelly", role: "Penny Benjamin", image: "https://m.media-amazon.com/images/M/MV5BOTczNTgzODYyMF5BMl5BanBnXkFtZTcwNjk4ODk4Mw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Jon Hamm", role: "Beau Simpson", image: "https://m.media-amazon.com/images/M/MV5BMTQ3NTM2NDgxNF5BMl5BanBnXkFtZTcwMDA4NjE3Mw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Glen Powell", role: "Jake 'Hangman' Seresin", image: "https://m.media-amazon.com/images/M/MV5BMjIwNzIyNDMyNl5BMl5BanBnXkFtZTgwMTczMzM3NjM@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Joseph Kosinski",
    writers: "Ehren Kruger, Eric Warren Singer",
    studio: "Paramount Pictures",
    budget: "$170 Million",
    boxOffice: "$1.5 Billion",
  },
  // Inception
  9: {
    movieId: 9,
    cast: [
      { name: "Leonardo DiCaprio", role: "Dom Cobb", image: "https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Joseph Gordon-Levitt", role: "Arthur", image: "https://m.media-amazon.com/images/M/MV5BMTY3NTk0NDI3Ml5BMl5BanBnXkFtZTgwNDA3NjY0MjE@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Elliot Page", role: "Ariadne", image: "https://m.media-amazon.com/images/M/MV5BMTQ0OTA3Njg5N15BMl5BanBnXkFtZTcwODk0MTU2Mg@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Tom Hardy", role: "Eames", image: "https://m.media-amazon.com/images/M/MV5BMTQ3ODEyNjA4Nl5BMl5BanBnXkFtZTgwMTE4ODMyMjE@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Marion Cotillard", role: "Mal", image: "https://m.media-amazon.com/images/M/MV5BMTU2OTAyNjk1Ml5BMl5BanBnXkFtZTcwMDcxMjQyNw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Christopher Nolan",
    writers: "Christopher Nolan",
    studio: "Warner Bros. Pictures",
    budget: "$160 Million",
    boxOffice: "$836 Million",
  },
  // The Dark Knight
  10: {
    movieId: 10,
    cast: [
      { name: "Christian Bale", role: "Bruce Wayne / Batman", image: "https://m.media-amazon.com/images/M/MV5BMTkxMzk4MjQ4MF5BMl5BanBnXkFtZTcwMzExODQxOA@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Heath Ledger", role: "The Joker", image: "https://m.media-amazon.com/images/M/MV5BMTI2NTY0NzA4MF5BMl5BanBnXkFtZTYwMjE1MDE0._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Aaron Eckhart", role: "Harvey Dent", image: "https://m.media-amazon.com/images/M/MV5BMTc4MTAyNzMzNF5BMl5BanBnXkFtZTcwMzQ5MzQzMg@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Michael Caine", role: "Alfred", image: "https://m.media-amazon.com/images/M/MV5BMjAwNzIwNTQ4Ml5BMl5BanBnXkFtZTYwMzE1MTUz._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Maggie Gyllenhaal", role: "Rachel Dawes", image: "https://m.media-amazon.com/images/M/MV5BNzMzODgyNTgzNV5BMl5BanBnXkFtZTcwNjc0NjU5MQ@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Christopher Nolan",
    writers: "Jonathan Nolan, Christopher Nolan",
    studio: "Warner Bros. Pictures",
    budget: "$185 Million",
    boxOffice: "$1.0 Billion",
  },
  // The Shawshank Redemption
  11: {
    movieId: 11,
    cast: [
      { name: "Tim Robbins", role: "Andy Dufresne", image: "https://m.media-amazon.com/images/M/MV5BMTI1OTIyNTE3NF5BMl5BanBnXkFtZTYwNzU0MTI2._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Morgan Freeman", role: "Red", image: "https://m.media-amazon.com/images/M/MV5BMTc0MDMyMzI2OF5BMl5BanBnXkFtZTcwMzM2OTk1MQ@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Bob Gunton", role: "Warden Norton", image: "https://m.media-amazon.com/images/M/MV5BMjA2NzA1MzA5OF5BMl5BanBnXkFtZTgwNTY5NDYxMTE@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "William Sadler", role: "Heywood", image: "https://m.media-amazon.com/images/M/MV5BMTYzOTgxMjUyOF5BMl5BanBnXkFtZTcwMjk0OTkzMg@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Clancy Brown", role: "Captain Hadley", image: "https://m.media-amazon.com/images/M/MV5BMTUzNjc4NTI0NF5BMl5BanBnXkFtZTcwODEwMDA3Nw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Frank Darabont",
    writers: "Stephen King, Frank Darabont",
    studio: "Columbia Pictures",
    budget: "$25 Million",
    boxOffice: "$58 Million",
  },
  // The Godfather
  12: {
    movieId: 12,
    cast: [
      { name: "Marlon Brando", role: "Vito Corleone", image: "https://m.media-amazon.com/images/M/MV5BMTg3MDYyMDE5OF5BMl5BanBnXkFtZTcwNjgyNTEzMg@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Al Pacino", role: "Michael Corleone", image: "https://m.media-amazon.com/images/M/MV5BMTQzMzg1ODAyNl5BMl5BanBnXkFtZTYwMjAxODQ1._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "James Caan", role: "Sonny Corleone", image: "https://m.media-amazon.com/images/M/MV5BMTI5NjkyNDQ3NV5BMl5BanBnXkFtZTcwNjY5NTQ0Mw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Robert Duvall", role: "Tom Hagen", image: "https://m.media-amazon.com/images/M/MV5BMjk1MjA2Mjc2MF5BMl5BanBnXkFtZTcwOTE4MTUwMg@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Diane Keaton", role: "Kay Adams", image: "https://m.media-amazon.com/images/M/MV5BMTY5NDI5OTEyOF5BMl5BanBnXkFtZTgwMzU4NDI2NTE@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Francis Ford Coppola",
    writers: "Mario Puzo, Francis Ford Coppola",
    studio: "Paramount Pictures",
    budget: "$6 Million",
    boxOffice: "$250 Million",
  },
  // Deadpool & Wolverine (Featured)
  100: {
    movieId: 100,
    cast: [
      { name: "Ryan Reynolds", role: "Wade Wilson / Deadpool", image: "https://m.media-amazon.com/images/M/MV5BOTI3ODk1MTMyNV5BMl5BanBnXkFtZTcwNDEyNTE2Mg@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Hugh Jackman", role: "Logan / Wolverine", image: "https://m.media-amazon.com/images/M/MV5BNDExMzIzNjk3Nl5BMl5BanBnXkFtZTcwOTE4NDU5OA@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Emma Corrin", role: "Cassandra Nova", image: "https://m.media-amazon.com/images/M/MV5BZjg3Y2QyZmUtZjIyMS00MGNhLTg0MjUtMjAyYWQ3NzYxNjFhXkEyXkFqcGdeQXVyMTI3ODAyMzE2._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Matthew Macfadyen", role: "Paradox", image: "https://m.media-amazon.com/images/M/MV5BMTc2MjAyMTYzNl5BMl5BanBnXkFtZTcwNjM4NTU2Mw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
      { name: "Morena Baccarin", role: "Vanessa", image: "https://m.media-amazon.com/images/M/MV5BMTc3MzY3MjQ3OV5BMl5BanBnXkFtZTcwODI3ODMxMw@@._V1_UX214_CR0,0,214,317_AL_.jpg" },
    ],
    director: "Shawn Levy",
    writers: "Ryan Reynolds, Rhett Reese",
    studio: "Marvel Studios / 20th Century Studios",
    budget: "$200 Million",
    boxOffice: "$1.3 Billion",
  },
};

// Default cast for movies without specific data
export const DEFAULT_CAST: CastMember[] = [
  { name: "Lead Actor", role: "Main Character", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Supporting Actor", role: "Supporting Role", image: "https://randomuser.me/api/portraits/women/1.jpg" },
  { name: "Actor 3", role: "Character 3", image: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Actor 4", role: "Character 4", image: "https://randomuser.me/api/portraits/men/2.jpg" },
  { name: "Actor 5", role: "Character 5", image: "https://randomuser.me/api/portraits/men/3.jpg" },
];
