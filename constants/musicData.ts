// ============================================================================
// COMPREHENSIVE MUSIC DATA - Albums, Artists, Playlists, Podcasts, Lyrics
// ============================================================================

// ============================================================================
// SONG INTERFACE WITH FULL LYRICS
// ============================================================================
export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number; // in seconds
  cover: string;
  plays: string;
  colors: [string, string, string];
  isExplicit?: boolean;
  lyrics: LyricLine[];
  movieSoundtrack?: string; // If from a movie
}

export interface LyricLine {
  time: number; // in seconds
  text: string;
  translation?: string;
}

// ============================================================================
// ARTIST INTERFACE
// ============================================================================
export interface Artist {
  id: string;
  name: string;
  image: string;
  coverImage: string;
  followers: string;
  monthlyListeners: string;
  verified: boolean;
  genres: string[];
  bio: string;
  topSongs: string[]; // song IDs
  albums: string[]; // album IDs
  socialLinks: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
  };
}

// ============================================================================
// ALBUM INTERFACE
// ============================================================================
export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string;
  year: string;
  genre: string;
  songs: string[]; // song IDs
  type: "album" | "single" | "ep";
  totalDuration: string;
  colors: [string, string, string];
}

// ============================================================================
// PLAYLIST INTERFACE
// ============================================================================
export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  creator: string;
  followers: string;
  songs: string[]; // song IDs
  isPublic: boolean;
  colors: [string, string, string];
  mood?: string;
  aiGenerated?: boolean;
}

// ============================================================================
// PODCAST INTERFACE
// ============================================================================
export interface Podcast {
  id: string;
  title: string;
  host: string;
  cover: string;
  description: string;
  category: string;
  episodes: PodcastEpisode[];
  followers: string;
  rating: number;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  isPlayed: boolean;
  progress?: number;
}

// ============================================================================
// MOOD TYPE FOR AI RECOMMENDATIONS
// ============================================================================
export interface MoodCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradient: [string, string];
  description: string;
  suggestedPlaylists: string[];
  suggestedMovies: number[];
}

// ============================================================================
// SONGS DATA WITH COMPREHENSIVE LYRICS
// ============================================================================
export const SONGS: Song[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    artistId: "artist1",
    album: "After Hours",
    albumId: "album1",
    duration: 200,
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    plays: "2.4B",
    colors: ["#1a1a2e", "#16213e", "#0f3460"],
    lyrics: [
      { time: 0, text: "♪ Instrumental ♪" },
      { time: 8, text: "I've been tryna call" },
      { time: 11, text: "I've been on my own for long enough" },
      { time: 15, text: "Maybe you can show me how to love, maybe" },
      { time: 20, text: "I'm going through withdrawals" },
      { time: 24, text: "You don't even have to do too much" },
      { time: 28, text: "You can turn me on with just a touch, baby" },
      { time: 33, text: "I look around and" },
      { time: 35, text: "Sin City's cold and empty" },
      { time: 39, text: "No one's around to judge me" },
      { time: 43, text: "I can't see clearly when you're gone" },
      { time: 48, text: "I said, ooh, I'm blinded by the lights" },
      { time: 55, text: "No, I can't sleep until I feel your touch" },
      { time: 62, text: "I said, ooh, I'm drowning in the night" },
      { time: 69, text: "Oh, when I'm like this, you're the one I trust" },
      { time: 76, text: "Hey, hey, hey" },
      { time: 80, text: "I'm running out of time" },
      { time: 84, text: "'Cause I can see the sun light up the sky" },
      { time: 88, text: "So I hit the road in overdrive, baby" },
      { time: 95, text: "Oh, the city's cold and empty" },
      { time: 99, text: "No one's around to judge me" },
      { time: 103, text: "I can't see clearly when you're gone" },
      { time: 110, text: "I said, ooh, I'm blinded by the lights" },
      { time: 117, text: "No, I can't sleep until I feel your touch" },
      { time: 125, text: "♪ Instrumental Outro ♪" },
    ],
  },
  {
    id: "2",
    title: "Levitating",
    artist: "Dua Lipa",
    artistId: "artist2",
    album: "Future Nostalgia",
    albumId: "album2",
    duration: 203,
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    plays: "1.8B",
    colors: ["#2d1b69", "#5a189a", "#9d4edd"],
    lyrics: [
      { time: 0, text: "♪ Intro ♪" },
      { time: 6, text: "If you wanna run away with me" },
      { time: 10, text: "I know a galaxy and I can take you for a ride" },
      { time: 14, text: "I had a premonition that we fell into a rhythm" },
      { time: 18, text: "Where the music don't stop for life" },
      { time: 22, text: "Glitter in the sky, glitter in my eyes" },
      { time: 26, text: "Shining just the way I like" },
      { time: 30, text: "If you're feeling like you need a little bit of company" },
      { time: 34, text: "You met me at the perfect time" },
      { time: 38, text: "You want me, I want you, baby" },
      { time: 42, text: "My sugarboo, I'm levitating" },
      { time: 46, text: "The Milky Way, we're renegading" },
      { time: 50, text: "Yeah, yeah, yeah, yeah, yeah" },
      { time: 54, text: "I got you, moonlight, you're my starlight" },
      { time: 58, text: "I need you all night, come on, dance with me" },
      { time: 62, text: "I'm levitating" },
      { time: 66, text: "You, moonlight, you're my starlight" },
      { time: 70, text: "I need you all night, come on, dance with me" },
      { time: 74, text: "I'm levitating" },
    ],
  },
  {
    id: "3",
    title: "Save Your Tears",
    artist: "The Weeknd",
    artistId: "artist1",
    album: "After Hours",
    albumId: "album1",
    duration: 215,
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    plays: "1.6B",
    colors: ["#0d1b2a", "#1b263b", "#415a77"],
    lyrics: [
      { time: 0, text: "♪ Intro ♪" },
      { time: 10, text: "I saw you dancing in a crowded room" },
      { time: 16, text: "You look so happy when I'm not with you" },
      { time: 22, text: "But then you saw me, caught you by surprise" },
      { time: 28, text: "A single teardrop falling from your eye" },
      { time: 34, text: "I don't know why I run away" },
      { time: 38, text: "I'll make you cry when I run away" },
      { time: 42, text: "You could've asked me why I broke your heart" },
      { time: 46, text: "You could've told me that you fell apart" },
      { time: 50, text: "But you walked past me like I wasn't there" },
      { time: 54, text: "And just pretended like you didn't care" },
      { time: 58, text: "I don't know why I run away" },
      { time: 62, text: "I'll make you cry when I run away" },
      { time: 66, text: "Take me back 'cause I wanna stay" },
      { time: 70, text: "Save your tears for another..." },
      { time: 74, text: "Save your tears for another day" },
      { time: 78, text: "Save your tears for another day" },
      { time: 82, text: "So I made you think that I would always stay" },
      { time: 86, text: "I said some things that I should never say" },
      { time: 90, text: "Yeah, I broke your heart like someone did to mine" },
      { time: 94, text: "And now you won't love me for a second time" },
    ],
  },
  {
    id: "4",
    title: "Stay",
    artist: "Kid Laroi & Justin Bieber",
    artistId: "artist3",
    album: "F*ck Love 3",
    albumId: "album3",
    duration: 141,
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
    plays: "1.5B",
    colors: ["#1e3a5f", "#2d5986", "#3d78ad"],
    isExplicit: true,
    lyrics: [
      { time: 0, text: "♪ Intro ♪" },
      { time: 5, text: "I do the same thing I told you that I never would" },
      { time: 9, text: "I told you I'd change, even when I knew I never could" },
      { time: 13, text: "I know that I can't find nobody else as good as you" },
      { time: 17, text: "I need you to stay, need you to stay, hey" },
      { time: 21, text: "I get drunk, wake up, I'm wasted still" },
      { time: 25, text: "I realize the time that I wasted here" },
      { time: 29, text: "I feel like you can't feel the way I feel" },
      { time: 33, text: "Oh, I'll be here waiting" },
      { time: 37, text: "Ooh-ooh, ooh-ooh" },
      { time: 41, text: "I need you to stay" },
      { time: 45, text: "Ooh-ooh, ooh-ooh" },
      { time: 49, text: "I need you to stay" },
    ],
  },
  {
    id: "5",
    title: "Peaches",
    artist: "Justin Bieber",
    artistId: "artist4",
    album: "Justice",
    albumId: "album4",
    duration: 198,
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    plays: "1.4B",
    colors: ["#ff6b6b", "#ee5a5a", "#d04949"],
    lyrics: [
      { time: 0, text: "♪ Intro ♪" },
      { time: 8, text: "I got my peaches out in Georgia" },
      { time: 12, text: "I get my weed from California" },
      { time: 16, text: "That's that shit" },
      { time: 18, text: "I get my peaches out in Georgia" },
      { time: 22, text: "I get my weed from California" },
      { time: 26, text: "That's that shit" },
      { time: 30, text: "And I see you, the way I breathe you in" },
      { time: 34, text: "It's the texture of your skin" },
      { time: 38, text: "I wanna wrap my arms around you, baby" },
      { time: 42, text: "Never let you go, oh" },
      { time: 46, text: "And I say, oh" },
      { time: 50, text: "There's nothing like your touch" },
      { time: 54, text: "It's the way you lift me up, yeah" },
      { time: 58, text: "And I'll be right here with you 'til the end" },
    ],
  },
  {
    id: "6",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    artistId: "artist5",
    album: "Midnights",
    albumId: "album5",
    duration: 200,
    cover: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=400",
    plays: "1.2B",
    colors: ["#1e1b4b", "#312e81", "#4338ca"],
    lyrics: [
      { time: 0, text: "♪ Intro ♪" },
      { time: 8, text: "I have this thing where I get older but just never wiser" },
      { time: 14, text: "Midnights become my afternoons" },
      { time: 18, text: "When my depression works the graveyard shift" },
      { time: 22, text: "All of the people I've ghosted stand there in the room" },
      { time: 28, text: "I should not be left to my own devices" },
      { time: 32, text: "They come with prices and vices" },
      { time: 36, text: "I end up in crisis" },
      { time: 38, text: "Tale as old as time" },
      { time: 42, text: "It's me, hi, I'm the problem, it's me" },
      { time: 48, text: "At tea time, everybody agrees" },
      { time: 52, text: "I'll stare directly at the sun but never in the mirror" },
      { time: 58, text: "It must be exhausting always rooting for the anti-hero" },
    ],
  },
  {
    id: "7",
    title: "As It Was",
    artist: "Harry Styles",
    artistId: "artist6",
    album: "Harry's House",
    albumId: "album6",
    duration: 167,
    cover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400",
    plays: "1.9B",
    colors: ["#fef3c7", "#fde68a", "#fcd34d"],
    lyrics: [
      { time: 0, text: "♪ Intro ♪" },
      { time: 6, text: "Holdin' me back, gravity's holdin' me back" },
      { time: 10, text: "I want you to hold out the palm of your hand" },
      { time: 14, text: "Why don't we leave it at that?" },
      { time: 18, text: "Nothin' to say when everything gets in the way" },
      { time: 22, text: "Seems you cannot be replaced" },
      { time: 26, text: "And I'm the one who will stay" },
      { time: 30, text: "Oh-oh-oh" },
      { time: 34, text: "In this world, it's just us" },
      { time: 38, text: "You know it's not the same as it was" },
      { time: 42, text: "In this world, it's just us" },
      { time: 46, text: "You know it's not the same as it was" },
      { time: 50, text: "As it was, as it was" },
      { time: 54, text: "You know it's not the same" },
    ],
  },
  {
    id: "8",
    title: "Bad Habit",
    artist: "Steve Lacy",
    artistId: "artist7",
    album: "Gemini Rights",
    albumId: "album7",
    duration: 232,
    cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400",
    plays: "800M",
    colors: ["#065f46", "#059669", "#10b981"],
    lyrics: [
      { time: 0, text: "♪ Intro ♪" },
      { time: 8, text: "I wish I knew, I wish I knew you wanted me" },
      { time: 14, text: "I wish I knew, I wish I knew you wanted me" },
      { time: 20, text: "My baaaad habit" },
      { time: 26, text: "I wish I knew, I wish I knew you wanted me" },
      { time: 32, text: "I can't help the way I feel about you, yeah" },
      { time: 38, text: "I got a bad habit of feelin' distant from you" },
      { time: 44, text: "It's the way you've been treatin' me, yeah" },
    ],
  },
  {
    id: "9",
    title: "Time (Inception)",
    artist: "Hans Zimmer",
    artistId: "artist8",
    album: "Inception Soundtrack",
    albumId: "album8",
    duration: 288,
    cover: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    plays: "500M",
    colors: ["#0c0a09", "#1c1917", "#292524"],
    movieSoundtrack: "Inception",
    lyrics: [
      { time: 0, text: "♪ Instrumental ♪" },
      { time: 30, text: "♪ The Dream Begins ♪" },
      { time: 60, text: "♪ Building Momentum ♪" },
      { time: 90, text: "♪ Rising Tension ♪" },
      { time: 120, text: "♪ Emotional Peak ♪" },
      { time: 150, text: "♪ The Awakening ♪" },
      { time: 180, text: "♪ Resolution ♪" },
      { time: 210, text: "♪ Time Stands Still ♪" },
      { time: 240, text: "♪ Final Notes ♪" },
      { time: 270, text: "♪ Fade Out ♪" },
    ],
  },
  {
    id: "10",
    title: "Interstellar Main Theme",
    artist: "Hans Zimmer",
    artistId: "artist8",
    album: "Interstellar Soundtrack",
    albumId: "album9",
    duration: 245,
    cover: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800",
    plays: "300M",
    colors: ["#1e1b4b", "#312e81", "#4c1d95"],
    movieSoundtrack: "Interstellar",
    lyrics: [
      { time: 0, text: "♪ Organ Introduction ♪" },
      { time: 30, text: "♪ Cosmic Exploration ♪" },
      { time: 60, text: "♪ Through the Wormhole ♪" },
      { time: 90, text: "♪ Love Transcends ♪" },
      { time: 120, text: "♪ Time Dilation ♪" },
      { time: 150, text: "♪ The Tesseract ♪" },
      { time: 180, text: "♪ Return Home ♪" },
      { time: 210, text: "♪ Final Resolution ♪" },
    ],
  },
];

// ============================================================================
// ARTISTS DATA
// ============================================================================
export const ARTISTS: Artist[] = [
  {
    id: "artist1",
    name: "The Weeknd",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    coverImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200",
    followers: "85.2M",
    monthlyListeners: "112.5M",
    verified: true,
    genres: ["R&B", "Pop", "Synth-pop"],
    bio: "Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer.",
    topSongs: ["1", "3"],
    albums: ["album1"],
    socialLinks: {
      instagram: "@theweeknd",
      twitter: "@theweeknd",
      spotify: "theweeknd",
    },
  },
  {
    id: "artist2",
    name: "Dua Lipa",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200",
    followers: "72.8M",
    monthlyListeners: "78.3M",
    verified: true,
    genres: ["Pop", "Dance", "Disco"],
    bio: "Dua Lipa is an English and Albanian singer and songwriter. After working as a model, she signed with Warner Bros. Records in 2014.",
    topSongs: ["2"],
    albums: ["album2"],
    socialLinks: {
      instagram: "@dualipa",
      twitter: "@dikidfromalbania",
      spotify: "dualipa",
    },
  },
  {
    id: "artist3",
    name: "The Kid LAROI",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
    coverImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200",
    followers: "32.5M",
    monthlyListeners: "45.2M",
    verified: true,
    genres: ["Hip Hop", "Pop Rap", "Emo Rap"],
    bio: "Charlton Kenneth Jeffrey Howard, known professionally as the Kid Laroi, is an Australian rapper, singer, and songwriter.",
    topSongs: ["4"],
    albums: ["album3"],
    socialLinks: {
      instagram: "@thekidlaroi",
      twitter: "@thekidlaroi",
    },
  },
  {
    id: "artist4",
    name: "Justin Bieber",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
    coverImage: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200",
    followers: "92.1M",
    monthlyListeners: "65.8M",
    verified: true,
    genres: ["Pop", "R&B", "Dance-pop"],
    bio: "Justin Drew Bieber is a Canadian singer and one of the most famous pop stars in the world.",
    topSongs: ["4", "5"],
    albums: ["album4"],
    socialLinks: {
      instagram: "@justinbieber",
      twitter: "@justinbieber",
    },
  },
  {
    id: "artist5",
    name: "Taylor Swift",
    image: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=400",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
    followers: "95.5M",
    monthlyListeners: "88.7M",
    verified: true,
    genres: ["Pop", "Country", "Indie Folk"],
    bio: "Taylor Alison Swift is an American singer-songwriter. Her narrative songwriting is often inspired by her personal life.",
    topSongs: ["6"],
    albums: ["album5"],
    socialLinks: {
      instagram: "@taylorswift",
      twitter: "@taylorswift13",
    },
  },
  {
    id: "artist6",
    name: "Harry Styles",
    image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
    followers: "68.3M",
    monthlyListeners: "72.1M",
    verified: true,
    genres: ["Pop", "Rock", "Brit Pop"],
    bio: "Harry Edward Styles is an English singer, songwriter, and actor. His musical career began in 2010 as a member of One Direction.",
    topSongs: ["7"],
    albums: ["album6"],
    socialLinks: {
      instagram: "@harrystyles",
      twitter: "@harry_styles",
    },
  },
  {
    id: "artist7",
    name: "Steve Lacy",
    image: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400",
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200",
    followers: "25.8M",
    monthlyListeners: "42.3M",
    verified: true,
    genres: ["R&B", "Neo-Soul", "Funk"],
    bio: "Steve Thomas Lacy-Moya is an American singer, songwriter, record producer, and guitarist, who rose to prominence as the guitarist of The Internet.",
    topSongs: ["8"],
    albums: ["album7"],
    socialLinks: {
      instagram: "@stevelacy",
      twitter: "@stikiesteve",
    },
  },
  {
    id: "artist8",
    name: "Hans Zimmer",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    coverImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200",
    followers: "15.2M",
    monthlyListeners: "22.8M",
    verified: true,
    genres: ["Soundtrack", "Orchestral", "Electronic"],
    bio: "Hans Florian Zimmer is a German film score composer and record producer. He has composed music for over 150 films.",
    topSongs: ["9", "10"],
    albums: ["album8", "album9"],
    socialLinks: {
      instagram: "@hanszimmer",
      twitter: "@realhanszimmer",
    },
  },
];

// ============================================================================
// ALBUMS DATA
// ============================================================================
export const ALBUMS: Album[] = [
  {
    id: "album1",
    title: "After Hours",
    artist: "The Weeknd",
    artistId: "artist1",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    year: "2020",
    genre: "R&B",
    songs: ["1", "3"],
    type: "album",
    totalDuration: "56:16",
    colors: ["#1a1a2e", "#16213e", "#0f3460"],
  },
  {
    id: "album2",
    title: "Future Nostalgia",
    artist: "Dua Lipa",
    artistId: "artist2",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    year: "2020",
    genre: "Pop",
    songs: ["2"],
    type: "album",
    totalDuration: "43:16",
    colors: ["#2d1b69", "#5a189a", "#9d4edd"],
  },
  {
    id: "album3",
    title: "F*ck Love 3",
    artist: "The Kid LAROI",
    artistId: "artist3",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
    year: "2021",
    genre: "Hip Hop",
    songs: ["4"],
    type: "album",
    totalDuration: "52:33",
    colors: ["#1e3a5f", "#2d5986", "#3d78ad"],
  },
  {
    id: "album4",
    title: "Justice",
    artist: "Justin Bieber",
    artistId: "artist4",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    year: "2021",
    genre: "Pop",
    songs: ["5"],
    type: "album",
    totalDuration: "52:06",
    colors: ["#ff6b6b", "#ee5a5a", "#d04949"],
  },
  {
    id: "album5",
    title: "Midnights",
    artist: "Taylor Swift",
    artistId: "artist5",
    cover: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=800",
    year: "2022",
    genre: "Pop",
    songs: ["6"],
    type: "album",
    totalDuration: "44:14",
    colors: ["#1e1b4b", "#312e81", "#4338ca"],
  },
  {
    id: "album6",
    title: "Harry's House",
    artist: "Harry Styles",
    artistId: "artist6",
    cover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=800",
    year: "2022",
    genre: "Pop",
    songs: ["7"],
    type: "album",
    totalDuration: "42:05",
    colors: ["#fef3c7", "#fde68a", "#fcd34d"],
  },
  {
    id: "album7",
    title: "Gemini Rights",
    artist: "Steve Lacy",
    artistId: "artist7",
    cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800",
    year: "2022",
    genre: "R&B",
    songs: ["8"],
    type: "album",
    totalDuration: "35:43",
    colors: ["#065f46", "#059669", "#10b981"],
  },
  {
    id: "album8",
    title: "Inception (Soundtrack)",
    artist: "Hans Zimmer",
    artistId: "artist8",
    cover: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    year: "2010",
    genre: "Soundtrack",
    songs: ["9"],
    type: "album",
    totalDuration: "50:02",
    colors: ["#0c0a09", "#1c1917", "#292524"],
  },
  {
    id: "album9",
    title: "Interstellar (Soundtrack)",
    artist: "Hans Zimmer",
    artistId: "artist8",
    cover: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800",
    year: "2014",
    genre: "Soundtrack",
    songs: ["10"],
    type: "album",
    totalDuration: "1:11:44",
    colors: ["#1e1b4b", "#312e81", "#4c1d95"],
  },
];

// ============================================================================
// PLAYLISTS DATA
// ============================================================================
export const PLAYLISTS: Playlist[] = [
  {
    id: "playlist1",
    name: "Today's Top Hits",
    description: "The hottest songs right now - updated daily",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    creator: "MoviesHub",
    followers: "32.5M",
    songs: ["1", "2", "3", "4", "5", "6", "7", "8"],
    isPublic: true,
    colors: ["#ec4899", "#8b5cf6", "#6366f1"],
  },
  {
    id: "playlist2",
    name: "Chill Vibes",
    description: "Kick back with these relaxing tunes",
    cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800",
    creator: "MoviesHub",
    followers: "18.2M",
    songs: ["3", "7", "8"],
    isPublic: true,
    colors: ["#06b6d4", "#0891b2", "#0e7490"],
    mood: "Relaxed",
  },
  {
    id: "playlist3",
    name: "Movie Soundtracks",
    description: "Epic scores from your favorite films",
    cover: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    creator: "MoviesHub",
    followers: "8.7M",
    songs: ["9", "10"],
    isPublic: true,
    colors: ["#1e1b4b", "#312e81", "#4c1d95"],
    mood: "Epic",
  },
  {
    id: "playlist4",
    name: "Workout Energy",
    description: "High-energy tracks to fuel your workout",
    cover: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800",
    creator: "MoviesHub",
    followers: "25.1M",
    songs: ["1", "2", "4", "6"],
    isPublic: true,
    colors: ["#ef4444", "#dc2626", "#b91c1c"],
    mood: "Energetic",
  },
  {
    id: "playlist5",
    name: "Late Night Feels",
    description: "For those midnight thoughts",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
    creator: "MoviesHub",
    followers: "12.3M",
    songs: ["1", "3", "6", "7"],
    isPublic: true,
    colors: ["#1e3a5f", "#0f172a", "#020617"],
    mood: "Melancholic",
  },
  {
    id: "playlist6",
    name: "AI Mix: Happy Vibes",
    description: "Personalized playlist based on your mood",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    creator: "AI DJ",
    followers: "0",
    songs: ["2", "5", "7"],
    isPublic: false,
    colors: ["#fbbf24", "#f59e0b", "#d97706"],
    mood: "Happy",
    aiGenerated: true,
  },
];

// ============================================================================
// PODCASTS DATA
// ============================================================================
export const PODCASTS: Podcast[] = [
  {
    id: "podcast1",
    title: "The Movie Podcast",
    host: "Film Critics Weekly",
    cover: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
    description: "Weekly discussions about the latest films, classic cinema, and everything in between.",
    category: "Movies & TV",
    followers: "2.5M",
    rating: 4.8,
    episodes: [
      {
        id: "ep1",
        title: "Dune: Part Two Review",
        description: "Our deep dive into Denis Villeneuve's epic sequel",
        duration: "1:23:45",
        date: "Mar 15, 2024",
        isPlayed: true,
        progress: 100,
      },
      {
        id: "ep2",
        title: "Best Picture Predictions",
        description: "Who will win at the Oscars this year?",
        duration: "58:30",
        date: "Mar 8, 2024",
        isPlayed: true,
        progress: 45,
      },
      {
        id: "ep3",
        title: "The Streaming Wars Update",
        description: "How Netflix, Disney+, and others are changing cinema",
        duration: "1:05:12",
        date: "Mar 1, 2024",
        isPlayed: false,
      },
    ],
  },
  {
    id: "podcast2",
    title: "Behind the Score",
    host: "Soundtrack Stories",
    cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800",
    description: "Exploring the art of film music with composers, musicians, and film historians.",
    category: "Music",
    followers: "1.8M",
    rating: 4.9,
    episodes: [
      {
        id: "ep4",
        title: "Hans Zimmer: The Legacy",
        description: "A journey through the iconic composer's greatest works",
        duration: "1:45:00",
        date: "Mar 12, 2024",
        isPlayed: false,
      },
      {
        id: "ep5",
        title: "The Art of the Leitmotif",
        description: "How musical themes tell stories",
        duration: "52:18",
        date: "Mar 5, 2024",
        isPlayed: false,
      },
    ],
  },
  {
    id: "podcast3",
    title: "Director's Chair",
    host: "Cinema Masters",
    cover: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
    description: "Interviews with the world's greatest filmmakers about their craft.",
    category: "Movies & TV",
    followers: "3.2M",
    rating: 4.7,
    episodes: [
      {
        id: "ep6",
        title: "Christopher Nolan Special",
        description: "The mind behind Inception, Interstellar, and Oppenheimer",
        duration: "2:10:30",
        date: "Mar 10, 2024",
        isPlayed: false,
      },
      {
        id: "ep7",
        title: "Martin Scorsese on Cinema",
        description: "A conversation with the legendary director",
        duration: "1:35:45",
        date: "Mar 3, 2024",
        isPlayed: false,
      },
    ],
  },
];

// ============================================================================
// MOOD CATEGORIES FOR AI RECOMMENDATIONS
// ============================================================================
export const MOOD_CATEGORIES: MoodCategory[] = [
  {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    color: "#fbbf24",
    gradient: ["#fbbf24", "#f59e0b"],
    description: "Upbeat and cheerful tunes to brighten your day",
    suggestedPlaylists: ["playlist4", "playlist6"],
    suggestedMovies: [7, 8, 100], // Spider-Man, Top Gun, Deadpool
  },
  {
    id: "sad",
    name: "Sad",
    emoji: "😢",
    color: "#6366f1",
    gradient: ["#6366f1", "#4f46e5"],
    description: "Music for when you need to feel your feelings",
    suggestedPlaylists: ["playlist5"],
    suggestedMovies: [5, 11], // Interstellar, Shawshank Redemption
  },
  {
    id: "energetic",
    name: "Energetic",
    emoji: "⚡",
    color: "#ef4444",
    gradient: ["#ef4444", "#dc2626"],
    description: "High-energy tracks to get you pumped",
    suggestedPlaylists: ["playlist4"],
    suggestedMovies: [6, 8, 10], // John Wick, Top Gun, Dark Knight
  },
  {
    id: "relaxed",
    name: "Relaxed",
    emoji: "😌",
    color: "#10b981",
    gradient: ["#10b981", "#059669"],
    description: "Calm and soothing sounds for relaxation",
    suggestedPlaylists: ["playlist2"],
    suggestedMovies: [4, 5], // Avatar, Interstellar
  },
  {
    id: "focused",
    name: "Focused",
    emoji: "🎯",
    color: "#8b5cf6",
    gradient: ["#8b5cf6", "#7c3aed"],
    description: "Music to help you concentrate",
    suggestedPlaylists: ["playlist3"],
    suggestedMovies: [2, 9], // Oppenheimer, Inception
  },
  {
    id: "romantic",
    name: "Romantic",
    emoji: "💕",
    color: "#ec4899",
    gradient: ["#ec4899", "#db2777"],
    description: "Love songs and romantic melodies",
    suggestedPlaylists: ["playlist5"],
    suggestedMovies: [11, 12], // Shawshank, Godfather
  },
];

// ============================================================================
// RECENTLY PLAYED DATA
// ============================================================================
export interface RecentlyPlayedItem {
  id: string;
  type: "song" | "album" | "playlist" | "podcast" | "movie";
  itemId: string;
  playedAt: string;
  progress?: number;
}

export const RECENTLY_PLAYED: RecentlyPlayedItem[] = [
  { id: "rp1", type: "song", itemId: "1", playedAt: "2 min ago" },
  { id: "rp2", type: "playlist", itemId: "playlist1", playedAt: "1 hour ago" },
  { id: "rp3", type: "album", itemId: "album1", playedAt: "3 hours ago" },
  { id: "rp4", type: "podcast", itemId: "podcast1", playedAt: "Yesterday" },
  { id: "rp5", type: "song", itemId: "2", playedAt: "Yesterday" },
  { id: "rp6", type: "movie", itemId: "1", playedAt: "2 days ago", progress: 65 },
];

// ============================================================================
// LIKED SONGS (User's favorites)
// ============================================================================
export const LIKED_SONGS: string[] = ["1", "2", "6", "7", "9"];

// ============================================================================
// DOWNLOADED SONGS FOR OFFLINE
// ============================================================================
export const DOWNLOADED_SONGS: string[] = ["1", "3", "9", "10"];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getSongById = (id: string): Song | undefined => {
  return SONGS.find((song) => song.id === id);
};

export const getArtistById = (id: string): Artist | undefined => {
  return ARTISTS.find((artist) => artist.id === id);
};

export const getAlbumById = (id: string): Album | undefined => {
  return ALBUMS.find((album) => album.id === id);
};

export const getPlaylistById = (id: string): Playlist | undefined => {
  return PLAYLISTS.find((playlist) => playlist.id === id);
};

export const getPodcastById = (id: string): Podcast | undefined => {
  return PODCASTS.find((podcast) => podcast.id === id);
};

export const getSongsByArtist = (artistId: string): Song[] => {
  return SONGS.filter((song) => song.artistId === artistId);
};

export const getSongsByAlbum = (albumId: string): Song[] => {
  return SONGS.filter((song) => song.albumId === albumId);
};

export const getAlbumsByArtist = (artistId: string): Album[] => {
  return ALBUMS.filter((album) => album.artistId === artistId);
};

export const getMovieSoundtracks = (): Song[] => {
  return SONGS.filter((song) => song.movieSoundtrack);
};

export const getLikedSongs = (): Song[] => {
  return SONGS.filter((song) => LIKED_SONGS.includes(song.id));
};

export const getDownloadedSongs = (): Song[] => {
  return SONGS.filter((song) => DOWNLOADED_SONGS.includes(song.id));
};
