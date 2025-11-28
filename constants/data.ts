import { CastMember, Genre, Movie } from "@/types";

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
// ACTOR IMAGES - Real celebrity headshots
// ============================================================================

export const ActorImages = {
  // Dune Cast
  TIMOTHEE_CHALAMET: "https://m.media-amazon.com/images/M/MV5BOWU1Nzg0M2ItYjEzMi00ODliLThkODAtNGEyYzRkZDIzNmE2XkEyXkFqcGdeQXVyNDk2Mzk2NDg@._V1_UY317_CR20,0,214,317_AL_.jpg",
  ZENDAYA: "https://m.media-amazon.com/images/M/MV5BMjAxZTk4NDAtYjI3Mi00OTk3LTg0NDEtNWFlNzE5NDM5MWM1XkEyXkFqcGdeQXVyOTI3MjYwOQ@@._V1_UY317_CR12,0,214,317_AL_.jpg",
  REBECCA_FERGUSON: "https://m.media-amazon.com/images/M/MV5BOTk4MTgzMTctZGZhMS00NjU5LWI2ZjctZDY2NWE2YThhNmVmXkEyXkFqcGdeQXVyNTQwNTQ3MTQ@._V1_UX214_CR0,0,214,317_AL_.jpg",
  AUSTIN_BUTLER: "https://m.media-amazon.com/images/M/MV5BYmZlOGE3NWItZWJiNS00NzU0LWIyMjctY2U3ZGNhZGI1NzM2XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_UY317_CR23,0,214,317_AL_.jpg",
  JAVIER_BARDEM: "https://m.media-amazon.com/images/M/MV5BMTc1ODE4ODAyNl5BMl5BanBnXkFtZTgwOTg1MjkyMjE@._V1_UY317_CR3,0,214,317_AL_.jpg",
  
  // Oppenheimer Cast
  CILLIAN_MURPHY: "https://m.media-amazon.com/images/M/MV5BMTUyNjY4ODA0MF5BMl5BanBnXkFtZTcwMzMyMzc5Mg@@._V1_UY317_CR12,0,214,317_AL_.jpg",
  EMILY_BLUNT: "https://m.media-amazon.com/images/M/MV5BMTUxNDY4MTMwM15BMl5BanBnXkFtZTgwMDc1MjQ2NTE@._V1_UY317_CR3,0,214,317_AL_.jpg",
  MATT_DAMON: "https://m.media-amazon.com/images/M/MV5BMTM0NzYzNDgxMl5BMl5BanBnXkFtZTcwMDg2MTMyMw@@._V1_UY317_CR7,0,214,317_AL_.jpg",
  ROBERT_DOWNEY_JR: "https://m.media-amazon.com/images/M/MV5BNzg1MTUyNDYxOF5BMl5BanBnXkFtZTgwNTQ4MTE2MjE@._V1_UY317_CR0,0,214,317_AL_.jpg",
  FLORENCE_PUGH: "https://m.media-amazon.com/images/M/MV5BZjcyNjEyODgtYmI2NS00ZjNmLWI5NTgtYmYxOGI2MmM0ZjZhXkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY317_CR5,0,214,317_AL_.jpg",
  
  // The Batman Cast
  ROBERT_PATTINSON: "https://m.media-amazon.com/images/M/MV5BNzk0MDQ5OTUxMV5BMl5BanBnXkFtZTcwMDM5ODk5Mg@@._V1_UY317_CR12,0,214,317_AL_.jpg",
  ZOE_KRAVITZ: "https://m.media-amazon.com/images/M/MV5BNTczMTk4ODAtMjA2Yy00ZWE0LWI4NzYtY2VhYTMxN2I2NDlkXkEyXkFqcGdeQXVyMjM0NTExNA@@._V1_UY317_CR0,0,214,317_AL_.jpg",
  PAUL_DANO: "https://m.media-amazon.com/images/M/MV5BMjE3MjY3OTg3OV5BMl5BanBnXkFtZTgwMzQxMDE0NjE@._V1_UY317_CR7,0,214,317_AL_.jpg",
  COLIN_FARRELL: "https://m.media-amazon.com/images/M/MV5BMTc2OTk0NDc0Ml5BMl5BanBnXkFtZTcwMTQzMzU0Mw@@._V1_UY317_CR2,0,214,317_AL_.jpg",
  ANDY_SERKIS: "https://m.media-amazon.com/images/M/MV5BMjA4MzgxNjM2N15BMl5BanBnXkFtZTcwMDk1NDM1OQ@@._V1_UY317_CR12,0,214,317_AL_.jpg",
  
  // Avatar Cast
  SAM_WORTHINGTON: "https://m.media-amazon.com/images/M/MV5BNDkwMzY4NWQtNTU4Yi00MDcyLWI4YTAtOGY5NjU2MzM2YjdkXkEyXkFqcGdeQXVyMTY2NzQ5NTY@._V1_UY317_CR134,0,214,317_AL_.jpg",
  ZOE_SALDANA: "https://m.media-amazon.com/images/M/MV5BMTM1NDcyNDUyNl5BMl5BanBnXkFtZTcwMDc5NzE5Nw@@._V1_UY317_CR12,0,214,317_AL_.jpg",
  SIGOURNEY_WEAVER: "https://m.media-amazon.com/images/M/MV5BMTk1MTcyNTE3OV5BMl5BanBnXkFtZTcwMTA0MTMyMw@@._V1_UY317_CR12,0,214,317_AL_.jpg",
  KATE_WINSLET: "https://m.media-amazon.com/images/M/MV5BODgzMzM2NTE0Ml5BMl5BanBnXkFtZTcwMTcyMjQ0Nw@@._V1_UY317_CR3,0,214,317_AL_.jpg",
  STEPHEN_LANG: "https://m.media-amazon.com/images/M/MV5BMzIwNzA3MjkzMF5BMl5BanBnXkFtZTcwNTIyOTY4Mg@@._V1_UY317_CR5,0,214,317_AL_.jpg",
  
  // Interstellar Cast
  MATTHEW_MCCONAUGHEY: "https://m.media-amazon.com/images/M/MV5BMTg0MDc3ODUwOV5BMl5BanBnXkFtZTcwMTk2NjY4Nw@@._V1_UY317_CR6,0,214,317_AL_.jpg",
  ANNE_HATHAWAY: "https://m.media-amazon.com/images/M/MV5BNjQ5MTAxMDc5OF5BMl5BanBnXkFtZTcwOTI0OTE4OA@@._V1_UY317_CR3,0,214,317_AL_.jpg",
  JESSICA_CHASTAIN: "https://m.media-amazon.com/images/M/MV5BMTU1MDM5NjczOF5BMl5BanBnXkFtZTcwOTY2MDE4OA@@._V1_UY317_CR3,0,214,317_AL_.jpg",
  MICHAEL_CAINE: "https://m.media-amazon.com/images/M/MV5BMjAwNzIwNTQ4Ml5BMl5BanBnXkFtZTYwMzE1MTUz._V1_UX214_CR0,0,214,317_AL_.jpg",
  CASEY_AFFLECK: "https://m.media-amazon.com/images/M/MV5BMTg3MzM4NjA4N15BMl5BanBnXkFtZTYwMDkzNzk0._V1_UY317_CR7,0,214,317_AL_.jpg",
  
  // John Wick Cast
  KEANU_REEVES: "https://m.media-amazon.com/images/M/MV5BNGJmMWEzOGQtMWZkNS00MGNiLTk5NGEtYzg1YzAyZTgzZTZmXkEyXkFqcGdeQXVyMTE1MTYxNDAw._V1_UY317_CR4,0,214,317_AL_.jpg",
  DONNIE_YEN: "https://m.media-amazon.com/images/M/MV5BMjAwMzgyMDE4OF5BMl5BanBnXkFtZTcwMjE1OTYyMQ@@._V1_UY317_CR8,0,214,317_AL_.jpg",
  IAN_MCSHANE: "https://m.media-amazon.com/images/M/MV5BMTQyMTMzMTQxN15BMl5BanBnXkFtZTcwOTYwNTQ2Mg@@._V1_UY317_CR4,0,214,317_AL_.jpg",
  BILL_SKARSGARD: "https://m.media-amazon.com/images/M/MV5BMTg5NTg4MjI0M15BMl5BanBnXkFtZTgwNzE1ODE0NzE@._V1_UY317_CR15,0,214,317_AL_.jpg",
  LAURENCE_FISHBURNE: "https://m.media-amazon.com/images/M/MV5BMTc0NjczNDE4Ml5BMl5BanBnXkFtZTYwMDU0Mjg1._V1_UY317_CR12,0,214,317_AL_.jpg",
  
  // Spider-Man Cast
  TOM_HOLLAND: "https://m.media-amazon.com/images/M/MV5BNzZiNTEyNTItYjNhMS00YjI2LWIwMWQtZmYwYTRlNjMyZTJjXkEyXkFqcGdeQXVyMTExNzQzMDE0._V1_UY317_CR12,0,214,317_AL_.jpg",
  TOBEY_MAGUIRE: "https://m.media-amazon.com/images/M/MV5BMTYxMjk0NDg4Ml5BMl5BanBnXkFtZTcwNjk4Mjk1Mw@@._V1_UY317_CR7,0,214,317_AL_.jpg",
  ANDREW_GARFIELD: "https://m.media-amazon.com/images/M/MV5BMTY5OTU0OTc2NV5BMl5BanBnXkFtZTcwMzk1MjY1Nw@@._V1_UY317_CR12,0,214,317_AL_.jpg",
  BENEDICT_CUMBERBATCH: "https://m.media-amazon.com/images/M/MV5BMjE0MDkzMDQwOF5BMl5BanBnXkFtZTgwOTE1Mjg1MzE@._V1_UY317_CR3,0,214,317_AL_.jpg",
  MARISA_TOMEI: "https://m.media-amazon.com/images/M/MV5BMTUxNjc0OTI4NV5BMl5BanBnXkFtZTcwMTA0NjYzNA@@._V1_UY317_CR12,0,214,317_AL_.jpg",
  
  // Top Gun Cast
  TOM_CRUISE: "https://m.media-amazon.com/images/M/MV5BMTk1MjM3NTU5M15BMl5BanBnXkFtZTcwMTMyMjAyMg@@._V1_UY317_CR7,0,214,317_AL_.jpg",
  MILES_TELLER: "https://m.media-amazon.com/images/M/MV5BMjM2MTE1NDE1Nl5BMl5BanBnXkFtZTgwNTg0NTM4MDI@._V1_UY317_CR15,0,214,317_AL_.jpg",
  JENNIFER_CONNELLY: "https://m.media-amazon.com/images/M/MV5BOTczNTgzODYyMF5BMl5BanBnXkFtZTcwNjk4ODk4Mw@@._V1_UY317_CR3,0,214,317_AL_.jpg",
  GLEN_POWELL: "https://m.media-amazon.com/images/M/MV5BMTU5NDEyMzY1NF5BMl5BanBnXkFtZTgwNTg2NDg3MjI@._V1_UY317_CR12,0,214,317_AL_.jpg",
  ED_HARRIS: "https://m.media-amazon.com/images/M/MV5BMTc1OTExOTg2NV5BMl5BanBnXkFtZTYwOTI3MzI2._V1_UY317_CR2,0,214,317_AL_.jpg",
  
  // Inception Cast
  LEONARDO_DICAPRIO: "https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_UY317_CR10,0,214,317_AL_.jpg",
  JOSEPH_GORDON_LEVITT: "https://m.media-amazon.com/images/M/MV5BMTY3NTk0NDI3Ml5BMl5BanBnXkFtZTgwNDA3NjY0MjE@._V1_UY317_CR12,0,214,317_AL_.jpg",
  ELLIOT_PAGE: "https://m.media-amazon.com/images/M/MV5BMTU0MTg4NTkzMl5BMl5BanBnXkFtZTgwODk0ODcxMTI@._V1_UY317_CR14,0,214,317_AL_.jpg",
  TOM_HARDY: "https://m.media-amazon.com/images/M/MV5BMTQ3ODEyNjA4Nl5BMl5BanBnXkFtZTgwMTE4ODMyMjE@._V1_UY317_CR6,0,214,317_AL_.jpg",
  KEN_WATANABE: "https://m.media-amazon.com/images/M/MV5BMTQzMTUzNjc4Nl5BMl5BanBnXkFtZTcwMTUyODU2Mw@@._V1_UY317_CR1,0,214,317_AL_.jpg",
  
  // The Dark Knight Cast
  CHRISTIAN_BALE: "https://m.media-amazon.com/images/M/MV5BMTkxMzk4MjQ4MF5BMl5BanBnXkFtZTcwMzExODQxOA@@._V1_UY317_CR7,0,214,317_AL_.jpg",
  HEATH_LEDGER: "https://m.media-amazon.com/images/M/MV5BMTI2NTY0NzA4MF5BMl5BanBnXkFtZTYwMjE1MDE0._V1_UY317_CR0,0,214,317_AL_.jpg",
  AARON_ECKHART: "https://m.media-amazon.com/images/M/MV5BMTc4MTAyNzMzNF5BMl5BanBnXkFtZTcwMzQ5MzQzMg@@._V1_UY317_CR7,0,214,317_AL_.jpg",
  GARY_OLDMAN: "https://m.media-amazon.com/images/M/MV5BMTc3NTM4MzQ5MV5BMl5BanBnXkFtZTcwOTE4MDczNw@@._V1_UY317_CR4,0,214,317_AL_.jpg",
  MAGGIE_GYLLENHAAL: "https://m.media-amazon.com/images/M/MV5BMjM2NDM1ODU4OV5BMl5BanBnXkFtZTgwNTQxNjA0MDE@._V1_UY317_CR12,0,214,317_AL_.jpg",
  
  // Shawshank Cast
  TIM_ROBBINS: "https://m.media-amazon.com/images/M/MV5BMTI1OTYxNzAxOF5BMl5BanBnXkFtZTYwNTE5ODI4._V1_UY317_CR4,0,214,317_AL_.jpg",
  MORGAN_FREEMAN: "https://m.media-amazon.com/images/M/MV5BMTc0MDMyMzI2OF5BMl5BanBnXkFtZTcwMzM2OTk1MQ@@._V1_UY317_CR3,0,214,317_AL_.jpg",
  CLANCY_BROWN: "https://m.media-amazon.com/images/M/MV5BMTc1MTkxNjQ2MF5BMl5BanBnXkFtZTcwNDQyMTczMQ@@._V1_UY317_CR12,0,214,317_AL_.jpg",
  BOB_GUNTON: "https://m.media-amazon.com/images/M/MV5BMTQwNjAxMzIzMF5BMl5BanBnXkFtZTcwNTMyMjM1Mw@@._V1_UY317_CR32,0,214,317_AL_.jpg",
  WILLIAM_SADLER: "https://m.media-amazon.com/images/M/MV5BMTY0MTY2NTM2MV5BMl5BanBnXkFtZTgwOTA1NjI3MDE@._V1_UY317_CR4,0,214,317_AL_.jpg",
  
  // Godfather Cast
  MARLON_BRANDO: "https://m.media-amazon.com/images/M/MV5BMTg3MDYyMDE5OF5BMl5BanBnXkFtZTcwNjgyNTEzNA@@._V1_UY317_CR7,0,214,317_AL_.jpg",
  AL_PACINO: "https://m.media-amazon.com/images/M/MV5BMTQzMzg1ODAyNl5BMl5BanBnXkFtZTYwMjAxODQ1._V1_UY317_CR8,0,214,317_AL_.jpg",
  JAMES_CAAN: "https://m.media-amazon.com/images/M/MV5BMTI5NjkyNDQ3NV5BMl5BanBnXkFtZTcwNjY5NTQ0Mw@@._V1_UY317_CR7,0,214,317_AL_.jpg",
  ROBERT_DUVALL: "https://m.media-amazon.com/images/M/MV5BMjk1MjA2MTc1MF5BMl5BanBnXkFtZTcwOTE4MTUwMg@@._V1_UY317_CR7,0,214,317_AL_.jpg",
  DIANE_KEATON: "https://m.media-amazon.com/images/M/MV5BMTI1MjA0MDU4NV5BMl5BanBnXkFtZTcwNjg1ODM1MQ@@._V1_UY317_CR7,0,214,317_AL_.jpg",
  
  // Deadpool & Wolverine Cast
  RYAN_REYNOLDS: "https://m.media-amazon.com/images/M/MV5BOTI3ODk1MTMyNV5BMl5BanBnXkFtZTcwNDEyNTE2Mg@@._V1_UY317_CR6,0,214,317_AL_.jpg",
  HUGH_JACKMAN: "https://m.media-amazon.com/images/M/MV5BNDExMzIzNjk3Nl5BMl5BanBnXkFtZTcwOTE4NDU5OA@@._V1_UY317_CR3,0,214,317_AL_.jpg",
  EMMA_CORRIN: "https://m.media-amazon.com/images/M/MV5BODE3YWI5MTQtMjNlZi00MTU0LWI1ZDItNGM1YmZkYzI2NzRkXkEyXkFqcGdeQXVyMTI2NzY0Nw@@._V1_UX214_CR0,0,214,317_AL_.jpg",
  MATTHEW_MACFADYEN: "https://m.media-amazon.com/images/M/MV5BMTY5ODkxMTE4OF5BMl5BanBnXkFtZTcwMDM4MTU1Mw@@._V1_UY317_CR2,0,214,317_AL_.jpg",
  MORENA_BACCARIN: "https://m.media-amazon.com/images/M/MV5BMjE1NTY0MjU3N15BMl5BanBnXkFtZTcwNDIwNjcyMQ@@._V1_UY317_CR12,0,214,317_AL_.jpg",
};

// ============================================================================
// MOVIE CAST DATA - Real cast members for each movie
// ============================================================================

export const MovieCast: Record<number, CastMember[]> = {
  // Dune: Part Two
  1: [
    { name: "Timothée Chalamet", role: "Paul Atreides", image: ActorImages.TIMOTHEE_CHALAMET },
    { name: "Zendaya", role: "Chani", image: ActorImages.ZENDAYA },
    { name: "Rebecca Ferguson", role: "Lady Jessica", image: ActorImages.REBECCA_FERGUSON },
    { name: "Austin Butler", role: "Feyd-Rautha", image: ActorImages.AUSTIN_BUTLER },
    { name: "Javier Bardem", role: "Stilgar", image: ActorImages.JAVIER_BARDEM },
  ],
  // Oppenheimer
  2: [
    { name: "Cillian Murphy", role: "J. Robert Oppenheimer", image: ActorImages.CILLIAN_MURPHY },
    { name: "Emily Blunt", role: "Kitty Oppenheimer", image: ActorImages.EMILY_BLUNT },
    { name: "Matt Damon", role: "Leslie Groves", image: ActorImages.MATT_DAMON },
    { name: "Robert Downey Jr.", role: "Lewis Strauss", image: ActorImages.ROBERT_DOWNEY_JR },
    { name: "Florence Pugh", role: "Jean Tatlock", image: ActorImages.FLORENCE_PUGH },
  ],
  // The Batman
  3: [
    { name: "Robert Pattinson", role: "Bruce Wayne / Batman", image: ActorImages.ROBERT_PATTINSON },
    { name: "Zoë Kravitz", role: "Selina Kyle / Catwoman", image: ActorImages.ZOE_KRAVITZ },
    { name: "Paul Dano", role: "The Riddler", image: ActorImages.PAUL_DANO },
    { name: "Colin Farrell", role: "The Penguin", image: ActorImages.COLIN_FARRELL },
    { name: "Andy Serkis", role: "Alfred Pennyworth", image: ActorImages.ANDY_SERKIS },
  ],
  // Avatar: The Way of Water
  4: [
    { name: "Sam Worthington", role: "Jake Sully", image: ActorImages.SAM_WORTHINGTON },
    { name: "Zoe Saldaña", role: "Neytiri", image: ActorImages.ZOE_SALDANA },
    { name: "Sigourney Weaver", role: "Kiri", image: ActorImages.SIGOURNEY_WEAVER },
    { name: "Kate Winslet", role: "Ronal", image: ActorImages.KATE_WINSLET },
    { name: "Stephen Lang", role: "Quaritch", image: ActorImages.STEPHEN_LANG },
  ],
  // Interstellar
  5: [
    { name: "Matthew McConaughey", role: "Cooper", image: ActorImages.MATTHEW_MCCONAUGHEY },
    { name: "Anne Hathaway", role: "Dr. Amelia Brand", image: ActorImages.ANNE_HATHAWAY },
    { name: "Jessica Chastain", role: "Murphy Cooper", image: ActorImages.JESSICA_CHASTAIN },
    { name: "Michael Caine", role: "Professor Brand", image: ActorImages.MICHAEL_CAINE },
    { name: "Casey Affleck", role: "Tom Cooper", image: ActorImages.CASEY_AFFLECK },
  ],
  // John Wick: Chapter 4
  6: [
    { name: "Keanu Reeves", role: "John Wick", image: ActorImages.KEANU_REEVES },
    { name: "Donnie Yen", role: "Caine", image: ActorImages.DONNIE_YEN },
    { name: "Ian McShane", role: "Winston", image: ActorImages.IAN_MCSHANE },
    { name: "Bill Skarsgård", role: "Marquis", image: ActorImages.BILL_SKARSGARD },
    { name: "Laurence Fishburne", role: "Bowery King", image: ActorImages.LAURENCE_FISHBURNE },
  ],
  // Spider-Man: No Way Home
  7: [
    { name: "Tom Holland", role: "Peter Parker", image: ActorImages.TOM_HOLLAND },
    { name: "Tobey Maguire", role: "Peter Parker", image: ActorImages.TOBEY_MAGUIRE },
    { name: "Andrew Garfield", role: "Peter Parker", image: ActorImages.ANDREW_GARFIELD },
    { name: "Benedict Cumberbatch", role: "Doctor Strange", image: ActorImages.BENEDICT_CUMBERBATCH },
    { name: "Marisa Tomei", role: "May Parker", image: ActorImages.MARISA_TOMEI },
  ],
  // Top Gun: Maverick
  8: [
    { name: "Tom Cruise", role: "Pete 'Maverick' Mitchell", image: ActorImages.TOM_CRUISE },
    { name: "Miles Teller", role: "Bradley 'Rooster' Bradshaw", image: ActorImages.MILES_TELLER },
    { name: "Jennifer Connelly", role: "Penny Benjamin", image: ActorImages.JENNIFER_CONNELLY },
    { name: "Glen Powell", role: "Jake 'Hangman' Seresin", image: ActorImages.GLEN_POWELL },
    { name: "Ed Harris", role: "Rear Admiral", image: ActorImages.ED_HARRIS },
  ],
  // Inception
  9: [
    { name: "Leonardo DiCaprio", role: "Dom Cobb", image: ActorImages.LEONARDO_DICAPRIO },
    { name: "Joseph Gordon-Levitt", role: "Arthur", image: ActorImages.JOSEPH_GORDON_LEVITT },
    { name: "Elliot Page", role: "Ariadne", image: ActorImages.ELLIOT_PAGE },
    { name: "Tom Hardy", role: "Eames", image: ActorImages.TOM_HARDY },
    { name: "Ken Watanabe", role: "Saito", image: ActorImages.KEN_WATANABE },
  ],
  // The Dark Knight
  10: [
    { name: "Christian Bale", role: "Bruce Wayne / Batman", image: ActorImages.CHRISTIAN_BALE },
    { name: "Heath Ledger", role: "The Joker", image: ActorImages.HEATH_LEDGER },
    { name: "Aaron Eckhart", role: "Harvey Dent", image: ActorImages.AARON_ECKHART },
    { name: "Gary Oldman", role: "James Gordon", image: ActorImages.GARY_OLDMAN },
    { name: "Maggie Gyllenhaal", role: "Rachel Dawes", image: ActorImages.MAGGIE_GYLLENHAAL },
  ],
  // The Shawshank Redemption
  11: [
    { name: "Tim Robbins", role: "Andy Dufresne", image: ActorImages.TIM_ROBBINS },
    { name: "Morgan Freeman", role: "Ellis 'Red' Redding", image: ActorImages.MORGAN_FREEMAN },
    { name: "Clancy Brown", role: "Captain Hadley", image: ActorImages.CLANCY_BROWN },
    { name: "Bob Gunton", role: "Warden Norton", image: ActorImages.BOB_GUNTON },
    { name: "William Sadler", role: "Heywood", image: ActorImages.WILLIAM_SADLER },
  ],
  // The Godfather
  12: [
    { name: "Marlon Brando", role: "Don Vito Corleone", image: ActorImages.MARLON_BRANDO },
    { name: "Al Pacino", role: "Michael Corleone", image: ActorImages.AL_PACINO },
    { name: "James Caan", role: "Sonny Corleone", image: ActorImages.JAMES_CAAN },
    { name: "Robert Duvall", role: "Tom Hagen", image: ActorImages.ROBERT_DUVALL },
    { name: "Diane Keaton", role: "Kay Adams", image: ActorImages.DIANE_KEATON },
  ],
  // Deadpool & Wolverine (Featured)
  100: [
    { name: "Ryan Reynolds", role: "Wade Wilson / Deadpool", image: ActorImages.RYAN_REYNOLDS },
    { name: "Hugh Jackman", role: "Logan / Wolverine", image: ActorImages.HUGH_JACKMAN },
    { name: "Emma Corrin", role: "Cassandra Nova", image: ActorImages.EMMA_CORRIN },
    { name: "Matthew Macfadyen", role: "Mr. Paradox", image: ActorImages.MATTHEW_MACFADYEN },
    { name: "Morena Baccarin", role: "Vanessa", image: ActorImages.MORENA_BACCARIN },
  ],
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
