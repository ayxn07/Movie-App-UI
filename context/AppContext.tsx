import React, { createContext, useContext, useState, useCallback } from "react";
import { Movie } from "@/types";
import { MOVIES, TRENDING, TOP_RATED } from "@/constants/data";

// Continue Watching item type
export interface ContinueWatchingItem {
  movie: Movie;
  progress: number; // 0-100
  remainingTime: string;
  lastWatched: Date;
}

// Review type
export interface Review {
  id: string;
  movieId: number;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  likes: number;
  createdAt: Date;
  isLiked: boolean;
}

// Friend type
export interface Friend {
  id: string;
  name: string;
  avatar: string;
  likedMovies: number[];
  isOnline: boolean;
  lastSeen?: string;
}

// Chat Message type
export interface ChatMessage {
  id: string;
  friendId: string;
  senderId: string;
  content: string;
  type: "text" | "image";
  imageUri?: string;
  createdAt: Date;
  isRead: boolean;
}

// Initial Continue Watching Data
const INITIAL_CONTINUE_WATCHING: ContinueWatchingItem[] = [
  {
    movie: MOVIES[0], // Dune: Part Two
    progress: 60,
    remainingTime: "1h 20m",
    lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    movie: TRENDING[0], // John Wick: Chapter 4
    progress: 35,
    remainingTime: "1h 48m",
    lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    movie: TOP_RATED[0], // The Dark Knight
    progress: 75,
    remainingTime: "38m",
    lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
  {
    movie: MOVIES[4], // Interstellar
    progress: 20,
    remainingTime: "2h 14m",
    lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
  },
  {
    movie: TRENDING[2], // Top Gun: Maverick
    progress: 85,
    remainingTime: "19m",
    lastWatched: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
  },
];

// Initial My List Data
const INITIAL_MY_LIST: Movie[] = [
  MOVIES[1], // Oppenheimer
  TRENDING[1], // Spider-Man: No Way Home
  TOP_RATED[2], // The Godfather
];

// Sample Reviews Data
const SAMPLE_REVIEWS: Review[] = [
  {
    id: "1",
    movieId: 1, // Dune: Part Two
    userId: "user1",
    userName: "Christopher Wilson",
    userAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5,
    title: "A Masterpiece of Sci-Fi Cinema",
    content: "Denis Villeneuve has outdone himself with this sequel. The visuals are absolutely breathtaking, and the performances, especially from Timothée Chalamet and Zendaya, are phenomenal. This is the kind of movie that deserves to be seen on the biggest screen possible.",
    likes: 234,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    isLiked: false,
  },
  {
    id: "2",
    movieId: 1,
    userId: "user2",
    userName: "Sarah Johnson",
    userAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 4,
    title: "Epic but lengthy",
    content: "Amazing cinematography and world-building. The action sequences are incredible. My only complaint is that it feels a bit long in the middle section, but the finale more than makes up for it.",
    likes: 128,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    isLiked: true,
  },
  {
    id: "3",
    movieId: 1,
    userId: "user3",
    userName: "Michael Chen",
    userAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
    title: "Best film of 2024",
    content: "I've watched this three times already and it gets better each time. The attention to detail in every frame is incredible. Austin Butler as Feyd-Rautha steals every scene he's in.",
    likes: 89,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    isLiked: false,
  },
  {
    id: "4",
    movieId: 2, // Oppenheimer
    userId: "user4",
    userName: "Emily Davis",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    title: "Nolan's finest work",
    content: "A haunting and powerful exploration of one man's moral dilemma. Cillian Murphy delivers an Oscar-worthy performance. The practical effects and IMAX footage are stunning.",
    likes: 456,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    isLiked: true,
  },
  {
    id: "5",
    movieId: 2,
    userId: "user5",
    userName: "James Rodriguez",
    userAvatar: "https://randomuser.me/api/portraits/men/36.jpg",
    rating: 4,
    title: "Intellectually stimulating",
    content: "Complex narrative structure that rewards attention. The ensemble cast is incredible. Robert Downey Jr.'s turn as Lewis Strauss is particularly noteworthy. A film that will be studied for years.",
    likes: 201,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    isLiked: false,
  },
];

// Sample Friends Data
const SAMPLE_FRIENDS: Friend[] = [
  {
    id: "friend1",
    name: "Alex Thompson",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    likedMovies: [1, 2, 5, 9],
    isOnline: true,
  },
  {
    id: "friend2",
    name: "Emma Wilson",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    likedMovies: [3, 6, 7, 10],
    isOnline: false,
    lastSeen: "2 hours ago",
  },
  {
    id: "friend3",
    name: "David Brown",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    likedMovies: [1, 4, 8, 11],
    isOnline: true,
  },
  {
    id: "friend4",
    name: "Sophie Miller",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    likedMovies: [2, 5, 6, 12],
    isOnline: false,
    lastSeen: "Yesterday",
  },
  {
    id: "friend5",
    name: "Ryan Garcia",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    likedMovies: [1, 3, 7, 9, 100],
    isOnline: true,
  },
  {
    id: "friend6",
    name: "Olivia Martinez",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    likedMovies: [4, 8, 10, 11],
    isOnline: false,
    lastSeen: "3 days ago",
  },
];

// Sample Chat Messages
const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: "msg1",
    friendId: "friend1",
    senderId: "me",
    content: "Hey! Have you seen Dune Part Two yet?",
    type: "text",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
  },
  {
    id: "msg2",
    friendId: "friend1",
    senderId: "friend1",
    content: "Yes! It was absolutely amazing! The visuals were incredible 🤯",
    type: "text",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    isRead: true,
  },
  {
    id: "msg3",
    friendId: "friend1",
    senderId: "me",
    content: "I know right! Austin Butler was so good as Feyd-Rautha",
    type: "text",
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    isRead: true,
  },
];

interface AppContextType {
  // My List
  myList: Movie[];
  addToMyList: (movie: Movie) => void;
  removeFromMyList: (movieId: number) => void;
  isInMyList: (movieId: number) => boolean;
  
  // Continue Watching
  continueWatching: ContinueWatchingItem[];
  updateWatchProgress: (movieId: number, progress: number) => void;
  
  // Reviews
  reviews: Review[];
  getReviewsForMovie: (movieId: number) => Review[];
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  toggleReviewLike: (reviewId: string) => void;
  
  // Friends
  friends: Friend[];
  searchFriends: (query: string) => Friend[];
  
  // Chat
  messages: ChatMessage[];
  getMessagesForFriend: (friendId: string) => ChatMessage[];
  sendMessage: (friendId: string, content: string, type: "text" | "image", imageUri?: string) => void;
  
  // Toast
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  toastMessage: string | null;
  toastType: "success" | "error" | "info";
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<Movie[]>(INITIAL_MY_LIST);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>(INITIAL_CONTINUE_WATCHING);
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [friends] = useState<Friend[]>(SAMPLE_FRIENDS);
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  // My List functions
  const addToMyList = useCallback((movie: Movie) => {
    setMyList((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromMyList = useCallback((movieId: number) => {
    setMyList((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const isInMyList = useCallback((movieId: number) => {
    return myList.some((m) => m.id === movieId);
  }, [myList]);

  // Continue Watching functions
  const updateWatchProgress = useCallback((movieId: number, progress: number) => {
    setContinueWatching((prev) =>
      prev.map((item) =>
        item.movie.id === movieId
          ? { ...item, progress, lastWatched: new Date() }
          : item
      )
    );
  }, []);

  // Reviews functions
  const getReviewsForMovie = useCallback((movieId: number) => {
    return reviews.filter((r) => r.movieId === movieId);
  }, [reviews]);

  const addReview = useCallback((review: Omit<Review, "id" | "createdAt">) => {
    const newReview: Review = {
      ...review,
      id: `review_${Date.now()}`,
      createdAt: new Date(),
    };
    setReviews((prev) => [newReview, ...prev]);
  }, []);

  const toggleReviewLike = useCallback((reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
          : r
      )
    );
  }, []);

  // Friends functions
  const searchFriends = useCallback((query: string) => {
    if (!query.trim()) return friends;
    return friends.filter((f) =>
      f.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [friends]);

  // Chat functions
  const getMessagesForFriend = useCallback((friendId: string) => {
    return messages.filter((m) => m.friendId === friendId);
  }, [messages]);

  const sendMessage = useCallback((friendId: string, content: string, type: "text" | "image", imageUri?: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      friendId,
      senderId: "me",
      content,
      type,
      imageUri,
      createdAt: new Date(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  // Toast functions
  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        myList,
        addToMyList,
        removeFromMyList,
        isInMyList,
        continueWatching,
        updateWatchProgress,
        reviews,
        getReviewsForMovie,
        addReview,
        toggleReviewLike,
        friends,
        searchFriends,
        messages,
        getMessagesForFriend,
        sendMessage,
        showToast,
        toastMessage,
        toastType,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
