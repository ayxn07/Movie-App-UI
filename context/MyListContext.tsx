import React, { createContext, useContext, useState } from "react";

import { ALL_MOVIES, MOVIES, TRENDING } from "@/constants/data";
import { Movie, MyListItem } from "@/types";

// Initial my list items
const INITIAL_MY_LIST: MyListItem[] = [
  ...MOVIES.slice(0, 3).map(m => ({ ...m, addedAt: new Date().toISOString() })),
  ...TRENDING.slice(0, 2).map(m => ({ ...m, addedAt: new Date().toISOString() })),
];

interface MyListContextType {
  myList: MyListItem[];
  addToMyList: (movie: Movie) => void;
  removeFromMyList: (movieId: number) => void;
  isInMyList: (movieId: number) => boolean;
  clearMyList: () => void;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export const MyListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<MyListItem[]>(INITIAL_MY_LIST);

  const addToMyList = (movie: Movie) => {
    if (!isInMyList(movie.id)) {
      setMyList(prev => [{ ...movie, addedAt: new Date().toISOString() }, ...prev]);
    }
  };

  const removeFromMyList = (movieId: number) => {
    setMyList(prev => prev.filter(m => m.id !== movieId));
  };

  const isInMyList = (movieId: number) => {
    return myList.some(m => m.id === movieId);
  };

  const clearMyList = () => {
    setMyList([]);
  };

  return (
    <MyListContext.Provider value={{ myList, addToMyList, removeFromMyList, isInMyList, clearMyList }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList must be used within a MyListProvider");
  }
  return context;
};
