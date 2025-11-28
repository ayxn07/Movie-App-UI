import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors, GENRES } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Genre, Movie } from "@/types";

// Search Result Item
const SearchResultItem = ({
  movie,
  index,
  theme,
  isDark,
  onPress,
}: {
  movie: Movie;
  index: number;
  theme: ThemeColors;
  isDark: boolean;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInRight.delay(index * 40).springify()}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          onPressIn={() => {
            scale.value = withSpring(0.97);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
          activeOpacity={1}
          style={{
            flexDirection: "row",
            padding: 12,
            marginBottom: 12,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 16,
          }}
        >
          {/* Movie Poster */}
          <View style={{ width: 70, height: 100, borderRadius: 12, overflow: "hidden" }}>
            <Image
              source={{ uri: movie.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
            />
          </View>

          {/* Movie Info */}
          <View style={{ flex: 1, marginLeft: 14, justifyContent: "center" }}>
            <Text
              style={{ color: theme.text, fontSize: 16, fontWeight: "700" }}
              numberOfLines={2}
            >
              {movie.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
                gap: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(251, 191, 36, 0.2)",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Ionicons name="star" size={12} color={Colors.star} />
                <Text
                  style={{
                    color: Colors.star,
                    fontSize: 12,
                    fontWeight: "700",
                    marginLeft: 4,
                  }}
                >
                  {movie.rating}
                </Text>
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                {movie.year}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
                gap: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: `${theme.primary}20`,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: theme.primary, fontSize: 12, fontWeight: "600" }}>
                  {movie.genre}
                </Text>
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                {movie.duration}
              </Text>
            </View>
          </View>

          {/* Arrow */}
          <View style={{ justifyContent: "center" }}>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// Genre Filter Chip
const GenreChip = ({
  genre,
  isSelected,
  onPress,
  theme,
}: {
  genre: Genre;
  isSelected: boolean;
  onPress: () => void;
  theme: ThemeColors;
}) => (
  <TouchableOpacity
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }}
    style={{ marginRight: 10 }}
  >
    {isSelected ? (
      <LinearGradient
        colors={genre.colors}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Ionicons name={genre.icon as any} size={14} color="white" />
        <Text style={{ color: "white", fontSize: 14, fontWeight: "700" }}>
          {genre.name}
        </Text>
      </LinearGradient>
    ) : (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
          backgroundColor: theme.card,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Ionicons name={genre.icon as any} size={14} color={theme.textSecondary} />
        <Text
          style={{ color: theme.textSecondary, fontSize: 14, fontWeight: "600" }}
        >
          {genre.name}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

// Recent Search Chip
const RecentSearchChip = ({
  search,
  onPress,
  onRemove,
  theme,
  isDark,
}: {
  search: string;
  onPress: () => void;
  onRemove: () => void;
  theme: ThemeColors;
  isDark: boolean;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
      paddingLeft: 14,
      paddingRight: 8,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
      marginBottom: 10,
    }}
  >
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Ionicons name="time-outline" size={14} color={theme.textMuted} />
        <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{search}</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onRemove();
      }}
      style={{ marginLeft: 8 }}
    >
      <Ionicons name="close-circle" size={18} color={theme.textMuted} />
    </TouchableOpacity>
  </View>
);

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Dune",
    "Batman",
    "Nolan",
    "Action movies",
  ]);

  // Filter movies based on search query and genre
  const filteredMovies = ALL_MOVIES.filter((movie) => {
    const matchesSearch =
      searchQuery.length === 0 ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Focus input when modal opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      setSearchQuery("");
      setSelectedGenre(null);
    }
  }, [visible]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleMoviePress = useCallback(
    (movieId: number) => {
      Keyboard.dismiss();
      // Add to recent searches
      if (searchQuery && !recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 3)]);
      }
      onClose();
      // Small delay to allow modal to close
      setTimeout(() => {
        router.push(`/movie/${movieId}`);
      }, 200);
    },
    [searchQuery, recentSearches, onClose, router]
  );

  const handleRecentSearch = useCallback((search: string) => {
    setSearchQuery(search);
  }, []);

  const handleRemoveRecentSearch = useCallback((search: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  }, []);

  const handleClearAll = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRecentSearches([]);
  }, []);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={{
          flex: 1,
          backgroundColor: isDark ? "rgba(2, 6, 23, 0.98)" : "rgba(248, 250, 252, 0.98)",
        }}
      >
        {/* Background Gradient */}
        <LinearGradient
          colors={
            isDark
              ? ["#1e1b4b", "#0f172a", "#020617"]
              : ["#f8fafc", "#f1f5f9", "#e2e8f0"]
          }
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          exiting={SlideOutDown.duration(200)}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16 }}>
            {/* Search Bar */}
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Keyboard.dismiss();
                  onClose();
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isDark
                    ? "rgba(30, 41, 59, 0.8)"
                    : "rgba(226, 232, 240, 0.8)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="arrow-back" size={24} color={theme.text} />
              </TouchableOpacity>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark
                    ? "rgba(30, 41, 59, 0.8)"
                    : "rgba(241, 245, 249, 0.9)",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Ionicons name="search" size={20} color={theme.textSecondary} />
                <TextInput
                  ref={inputRef}
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholder="Search movies, series, genres..."
                  placeholderTextColor={theme.textMuted}
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 16,
                    color: theme.text,
                  }}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    style={{ padding: 4 }}
                  >
                    <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>

            {/* Genre Filters */}
            <Animated.View
              entering={FadeInDown.delay(150).springify()}
              style={{ marginTop: 16 }}
            >
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedGenre(null);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 20,
                      backgroundColor:
                        selectedGenre === null ? theme.primary : theme.card,
                    }}
                  >
                    <Text
                      style={{
                        color: selectedGenre === null ? "white" : theme.textSecondary,
                        fontSize: 14,
                        fontWeight: "700",
                      }}
                    >
                      All
                    </Text>
                  </View>
                </TouchableOpacity>
                {GENRES.map((genre) => (
                  <GenreChip
                    key={genre.name}
                    genre={genre}
                    isSelected={selectedGenre === genre.name}
                    onPress={() =>
                      setSelectedGenre(selectedGenre === genre.name ? null : genre.name)
                    }
                    theme={theme}
                  />
                ))}
              </Animated.ScrollView>
            </Animated.View>
          </View>

          {/* Content */}
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {searchQuery.length === 0 && !selectedGenre ? (
              // Recent Searches
              <Animated.View entering={FadeIn.delay(200)}>
                {recentSearches.length > 0 && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: theme.text,
                          fontSize: 18,
                          fontWeight: "700",
                        }}
                      >
                        Recent Searches
                      </Text>
                      <TouchableOpacity onPress={handleClearAll}>
                        <Text
                          style={{
                            color: theme.primary,
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          Clear all
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {recentSearches.map((search) => (
                        <RecentSearchChip
                          key={search}
                          search={search}
                          onPress={() => handleRecentSearch(search)}
                          onRemove={() => handleRemoveRecentSearch(search)}
                          theme={theme}
                          isDark={isDark}
                        />
                      ))}
                    </View>
                  </>
                )}

                {/* Popular Movies */}
                <Text
                  style={{
                    color: theme.text,
                    fontSize: 18,
                    fontWeight: "700",
                    marginTop: 24,
                    marginBottom: 16,
                  }}
                >
                  Popular Movies
                </Text>
                <FlashList
                  data={ALL_MOVIES.slice(0, 6)}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 100 }}
                  renderItem={({ item, index }) => (
                    <SearchResultItem
                      movie={item}
                      index={index}
                      theme={theme}
                      isDark={isDark}
                      onPress={() => handleMoviePress(item.id)}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  
                />
              </Animated.View>
            ) : (
              // Search Results
              <Animated.View entering={FadeIn} style={{ flex: 1 }}>
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: 14,
                    marginBottom: 16,
                  }}
                >
                  {filteredMovies.length} results found
                </Text>
                {filteredMovies.length > 0 ? (
                  <FlashList
                    data={filteredMovies}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item, index }) => (
                      <SearchResultItem
                        movie={item}
                        index={index}
                        theme={theme}
                        isDark={isDark}
                        onPress={() => handleMoviePress(item.id)}
                      />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingBottom: 100,
                    }}
                  >
                    <Ionicons
                      name="search-outline"
                      size={64}
                      color={theme.textMuted}
                    />
                    <Text
                      style={{
                        color: theme.text,
                        fontSize: 18,
                        fontWeight: "700",
                        marginTop: 16,
                      }}
                    >
                      No results found
                    </Text>
                    <Text
                      style={{
                        color: theme.textSecondary,
                        fontSize: 14,
                        marginTop: 8,
                        textAlign: "center",
                        paddingHorizontal: 40,
                      }}
                    >
                      Try searching for something else or adjust your filters
                    </Text>
                  </View>
                )}
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
