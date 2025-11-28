import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors, GENRES } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Genre, Movie } from "@/types";

// Route constants for navigation
const ROUTES = {
  EXPLORE: "/(tabs)/explore" as const,
} as const;

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

// Search Result Item
const SearchResultItem = ({
  movie,
  index,
  theme,
  onPress,
}: {
  movie: Movie;
  index: number;
  theme: ThemeColors;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={{ marginBottom: 12 }}
    >
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View
            style={{
              flexDirection: "row",
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: theme.card,
            }}
          >
            <View style={{ width: 100, height: 140 }}>
              <Image
                source={{ uri: movie.image }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={200}
              />
            </View>
            <View style={{ flex: 1, padding: 12, justifyContent: "space-between" }}>
              <View>
                <Text
                  style={{ fontWeight: "700", fontSize: 16, color: theme.text }}
                  numberOfLines={2}
                >
                  {movie.title}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
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
                      style={{ color: Colors.star, fontSize: 12, fontWeight: "700", marginLeft: 4 }}
                    >
                      {movie.rating}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: theme.textSecondary }}>{movie.genre}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <Ionicons name="time-outline" size={14} color={theme.textMuted} />
                  <Text style={{ fontSize: 12, color: theme.textSecondary }}>{movie.duration}</Text>
                  <View
                    style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textMuted }}
                  />
                  <Text style={{ fontSize: 12, color: theme.textSecondary }}>{movie.year}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onPress}
                style={{ alignSelf: "flex-start" }}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Ionicons name="play" size={14} color="white" />
                  <Text style={{ color: "white", fontWeight: "600", fontSize: 12 }}>Watch</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// Genre Filter Chip for Search
const GenreFilterChip = ({
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
    style={{ marginRight: 10, marginBottom: 10 }}
  >
    {isSelected ? (
      <LinearGradient
        colors={genre.colors}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Ionicons name={genre.icon as any} size={14} color="white" />
        <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>{genre.name}</Text>
      </LinearGradient>
    ) : (
      <View
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: theme.card,
        }}
      >
        <Ionicons name={genre.icon as any} size={14} color={theme.textSecondary} />
        <Text style={{ fontWeight: "500", fontSize: 13, color: theme.textSecondary }}>
          {genre.name}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

// Recent Searches
const RECENT_SEARCHES = ["Dune", "Batman", "Interstellar", "Marvel"];

export const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Focus input when modal opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      setSearchQuery("");
      setSelectedGenres([]);
      setShowFilters(false);
    }
  }, [visible]);

  // Filter movies
  const filteredMovies = useMemo(() => {
    if (!searchQuery && selectedGenres.length === 0) return [];

    return ALL_MOVIES.filter((movie) => {
      const matchesSearch =
        !searchQuery || movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenres.length === 0 || selectedGenres.includes(movie.genre);
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenres]);

  const toggleGenre = useCallback((genreName: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreName)
        ? prev.filter((g) => g !== genreName)
        : [...prev, genreName]
    );
  }, []);

  const handleMoviePress = useCallback(
    (movieId: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Keyboard.dismiss();
      onClose();
      setTimeout(() => {
        router.push(`/movie/${movieId}`);
      }, 200);
    },
    [onClose, router]
  );

  const handleRecentSearch = useCallback((term: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery(term);
  }, []);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <TouchableOpacity
          style={{ height: 60 }}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
        />
        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          exiting={SlideOutDown.springify().damping(20)}
          style={{
            flex: 1,
            backgroundColor: theme.background,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
        >
          {/* Header with Search */}
          <View style={{ padding: 20 }}>
            {/* Handle Bar */}
            <View
              style={{
                alignSelf: "center",
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.textMuted,
                marginBottom: 16,
              }}
            />

            {/* Search Input */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
              }}
            >
              <Ionicons name="search" size={20} color={theme.textSecondary} />
              <TextInput
                ref={inputRef}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search movies, series, actors..."
                placeholderTextColor={theme.textMuted}
                style={{ flex: 1, marginLeft: 12, fontSize: 16, color: theme.text }}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={{ marginRight: 8 }}
                >
                  <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowFilters(!showFilters);
                }}
                style={{
                  backgroundColor: showFilters ? theme.primary : "transparent",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}
              >
                <Ionicons
                  name="options"
                  size={18}
                  color={showFilters ? "white" : theme.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Genre Filters */}
            {showFilters && (
              <Animated.View entering={FadeInDown.springify()} style={{ marginTop: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: theme.textSecondary,
                    marginBottom: 12,
                  }}
                >
                  Filter by Genre
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {GENRES.map((genre) => (
                    <GenreFilterChip
                      key={genre.name}
                      genre={genre}
                      isSelected={selectedGenres.includes(genre.name)}
                      onPress={() => toggleGenre(genre.name)}
                      theme={theme}
                    />
                  ))}
                </View>
                {selectedGenres.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedGenres([]);
                    }}
                    style={{ marginTop: 8 }}
                  >
                    <Text style={{ color: theme.primary, fontWeight: "600", fontSize: 13 }}>
                      Clear filters
                    </Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            )}
          </View>

          {/* Content */}
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Recent Searches (when no query) */}
            {!searchQuery && selectedGenres.length === 0 && (
              <Animated.View entering={FadeIn}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: theme.text,
                    marginBottom: 16,
                  }}
                >
                  Recent Searches
                </Text>
                {RECENT_SEARCHES.map((term, index) => (
                  <Animated.View
                    key={term}
                    entering={FadeInRight.delay(index * 50)}
                  >
                    <TouchableOpacity
                      onPress={() => handleRecentSearch(term)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.border,
                      }}
                    >
                      <Ionicons name="time-outline" size={20} color={theme.textMuted} />
                      <Text style={{ flex: 1, marginLeft: 12, fontSize: 15, color: theme.text }}>
                        {term}
                      </Text>
                      <Ionicons name="arrow-forward" size={18} color={theme.textMuted} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: theme.text,
                    marginTop: 24,
                    marginBottom: 16,
                  }}
                >
                  Popular Genres
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {GENRES.map((genre, index) => (
                    <Animated.View
                      key={genre.name}
                      entering={FadeInDown.delay(index * 50)}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          onClose();
                          router.push({
                            pathname: ROUTES.EXPLORE,
                          });
                        }}
                        style={{ marginRight: 10, marginBottom: 10 }}
                      >
                        <LinearGradient
                          colors={genre.colors}
                          style={{
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Ionicons name={genre.icon as any} size={16} color="white" />
                          <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
                            {genre.name}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Search Results */}
            {(searchQuery || selectedGenres.length > 0) && (
              <>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
                  <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                    {filteredMovies.length} results found
                  </Text>
                </View>
                <FlashList
                  data={filteredMovies}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 100 }}
                  renderItem={({ item, index }) => (
                    <SearchResultItem
                      movie={item}
                      index={index}
                      theme={theme}
                      onPress={() => handleMoviePress(item.id)}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  estimatedItemSize={152}
                  ListEmptyComponent={
                    <View style={{ alignItems: "center", paddingVertical: 60 }}>
                      <Ionicons name="search-outline" size={48} color={theme.textMuted} />
                      <Text
                        style={{ fontSize: 16, marginTop: 16, color: theme.textSecondary }}
                      >
                        No results found
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          marginTop: 8,
                          color: theme.textMuted,
                          textAlign: "center",
                        }}
                      >
                        Try a different search term or filter
                      </Text>
                    </View>
                  }
                />
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
