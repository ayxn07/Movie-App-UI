import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Dimensions,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors, GENRES, TRENDING, SERIES } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Genre, Movie } from "@/types";

const { width } = Dimensions.get("window");

// Route constants for navigation
const ROUTES = {
  EXPLORE: "/(tabs)/explore" as const,
} as const;

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

// Voice Search Animation Component
const VoiceSearchIndicator = ({ isListening }: { isListening: boolean }) => {
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);

  useEffect(() => {
    if (isListening) {
      scale1.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        false
      );
      scale2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 150 }),
          withTiming(1.4, { duration: 300 }),
          withTiming(1, { duration: 150 })
        ),
        -1,
        false
      );
      scale3.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(1.5, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        false
      );
    } else {
      scale1.value = withTiming(1, { duration: 200 });
      scale2.value = withTiming(1, { duration: 200 });
      scale3.value = withTiming(1, { duration: 200 });
    }
  }, [isListening, scale1, scale2, scale3]);

  const style1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: 0.6 / scale1.value,
  }));
  const style2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: 0.4 / scale2.value,
  }));
  const style3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
    opacity: 0.2 / scale3.value,
  }));

  return (
    <View style={{ alignItems: "center", justifyContent: "center", height: 200 }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: Colors.primary,
          },
          style3,
        ]}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: Colors.primary,
          },
          style2,
        ]}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: Colors.primary,
          },
          style1,
        ]}
      />
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: Colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="mic" size={32} color="white" />
      </View>
    </View>
  );
};

// Trending Search Card Component
const TrendingSearchCard = ({
  movie,
  index,
  onPress,
}: {
  movie: Movie;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 60).springify()}
      style={{ marginRight: 12 }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{ width: 140 }}
      >
        <View
          style={{
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          }}
        >
          <Image
            source={{ uri: movie.image }}
            style={{ width: 140, height: 100 }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: Colors.primary,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Ionicons name="trending-up" size={12} color="white" />
            <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>
              #{index + 1}
            </Text>
          </View>
          <View style={{ padding: 10 }}>
            <Text
              style={{
                color: theme.text,
                fontWeight: "700",
                fontSize: 13,
              }}
              numberOfLines={1}
            >
              {movie.title}
            </Text>
            <Text
              style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}
            >
              {movie.genre} • {movie.year}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Quick Category Card Component
const QuickCategoryCard = ({
  icon,
  title,
  color,
  index,
  onPress,
}: {
  icon: string;
  title: string;
  color: string;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify()}
      style={{ width: (width - 60) / 2, marginBottom: 12 }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 16,
          padding: 14,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: `${color}20`,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name={icon as any} size={22} color={color} />
        </View>
        <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14 }}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Search Result Item
const SearchResultItem = ({
  movie,
  index,
  theme,
  onPress,
  isDark,
}: {
  movie: Movie;
  index: number;
  theme: ThemeColors;
  onPress: () => void;
  isDark: boolean;
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
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
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
const RECENT_SEARCHES = ["Dune", "Batman", "Interstellar", "Marvel", "Thriller"];

// Quick categories
const QUICK_CATEGORIES = [
  { icon: "flame", title: "Trending", color: Colors.primary },
  { icon: "star", title: "Top Rated", color: Colors.star },
  { icon: "tv", title: "TV Series", color: Colors.secondary },
  { icon: "musical-notes", title: "Music", color: Colors.accent },
];

export const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);

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
      setIsVoiceSearching(false);
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

  const clearRecentSearch = useCallback((term: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRecentSearches((prev) => prev.filter((t) => t !== term));
  }, []);

  const handleVoiceSearch = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsVoiceSearching(true);
    // Simulate voice search
    setTimeout(() => {
      setIsVoiceSearching(false);
      setSearchQuery("Batman");
    }, 3000);
  }, []);

  const handleCategoryPress = useCallback(
    (category: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Keyboard.dismiss();
      onClose();
      if (category === "Trending") {
        router.push("/seeall/trending");
      } else if (category === "Top Rated") {
        router.push("/seeall/top10");
      } else if (category === "TV Series") {
        router.push("/category/series");
      } else if (category === "Music") {
        router.push("/songs");
      }
    },
    [onClose, router]
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
        <TouchableOpacity
          style={{ height: 50 }}
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
          {/* Background Gradient */}
          <LinearGradient
            colors={
              isDark
                ? ["rgba(30, 27, 75, 0.3)", "transparent"]
                : ["rgba(139, 92, 246, 0.05)", "transparent"]
            }
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 200,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
            }}
          />

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
                marginBottom: 20,
              }}
            />

            {/* Title */}
            <Animated.View entering={FadeInDown.delay(100)}>
              <Text
                style={{
                  color: theme.text,
                  fontSize: 26,
                  fontWeight: "900",
                  marginBottom: 16,
                }}
              >
                Discover
              </Text>
            </Animated.View>

            {/* Search Input */}
            <Animated.View entering={FadeInDown.delay(150)}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 20,
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  backgroundColor: isDark
                    ? "rgba(30, 41, 59, 0.9)"
                    : "rgba(241, 245, 249, 0.95)",
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(139, 92, 246, 0.3)"
                    : "rgba(139, 92, 246, 0.15)",
                  shadowColor: Colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: `${Colors.primary}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="search" size={20} color={Colors.primary} />
                </View>
                <TextInput
                  ref={inputRef}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search movies, series, actors..."
                  placeholderTextColor={theme.textMuted}
                  style={{
                    flex: 1,
                    marginLeft: 14,
                    fontSize: 16,
                    color: theme.text,
                    fontWeight: "500",
                  }}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    style={{ marginRight: 12 }}
                  >
                    <Ionicons name="close-circle" size={22} color={theme.textSecondary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleVoiceSearch}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: `${Colors.secondary}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                >
                  <Ionicons name="mic" size={18} color={Colors.secondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowFilters(!showFilters);
                  }}
                >
                  <LinearGradient
                    colors={
                      showFilters
                        ? [Colors.primary, Colors.primaryDark]
                        : ["transparent", "transparent"]
                    }
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: showFilters ? undefined : `${Colors.primary}10`,
                    }}
                  >
                    <Ionicons
                      name="options"
                      size={18}
                      color={showFilters ? "white" : Colors.primary}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Genre Filters */}
            {showFilters && (
              <Animated.View entering={FadeInDown.springify()} style={{ marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: theme.text,
                    }}
                  >
                    Filter by Genre
                  </Text>
                  {selectedGenres.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedGenres([]);
                      }}
                    >
                      <Text style={{ color: Colors.primary, fontWeight: "600", fontSize: 13 }}>
                        Clear all
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {GENRES.map((genre) => (
                    <GenreFilterChip
                      key={genre.name}
                      genre={genre}
                      isSelected={selectedGenres.includes(genre.name)}
                      onPress={() => toggleGenre(genre.name)}
                      theme={theme}
                    />
                  ))}
                </ScrollView>
              </Animated.View>
            )}
          </View>

          {/* Content */}
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Voice Search Animation */}
            {isVoiceSearching ? (
              <Animated.View entering={FadeIn} style={{ paddingHorizontal: 20 }}>
                <VoiceSearchIndicator isListening={isVoiceSearching} />
                <Text
                  style={{
                    color: theme.text,
                    fontSize: 18,
                    fontWeight: "700",
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  Listening...
                </Text>
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  Say the name of a movie or series
                </Text>
              </Animated.View>
            ) : !searchQuery && selectedGenres.length === 0 ? (
              /* Default Content when no search */
              <View style={{ paddingHorizontal: 20 }}>
                {/* Quick Categories */}
                <Animated.View entering={FadeInUp.delay(200)}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: theme.text,
                      marginBottom: 16,
                    }}
                  >
                    Quick Access
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    {QUICK_CATEGORIES.map((cat, index) => (
                      <QuickCategoryCard
                        key={cat.title}
                        icon={cat.icon}
                        title={cat.title}
                        color={cat.color}
                        index={index}
                        onPress={() => handleCategoryPress(cat.title)}
                      />
                    ))}
                  </View>
                </Animated.View>

                {/* Trending Now Section */}
                <Animated.View entering={FadeInUp.delay(300)} style={{ marginTop: 24 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Ionicons name="trending-up" size={20} color={Colors.primary} />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "800",
                          color: theme.text,
                        }}
                      >
                        Trending Now
                      </Text>
                    </View>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 20 }}
                  >
                    {TRENDING.slice(0, 5).map((movie, index) => (
                      <TrendingSearchCard
                        key={movie.id}
                        movie={movie}
                        index={index}
                        onPress={() => handleMoviePress(movie.id)}
                      />
                    ))}
                  </ScrollView>
                </Animated.View>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <Animated.View entering={FadeInUp.delay(400)} style={{ marginTop: 28 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "800",
                          color: theme.text,
                        }}
                      >
                        Recent Searches
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setRecentSearches([]);
                        }}
                      >
                        <Text style={{ color: Colors.primary, fontWeight: "600", fontSize: 13 }}>
                          Clear all
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {recentSearches.map((term, index) => (
                      <Animated.View key={term} entering={FadeInRight.delay(index * 50)}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 14,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.border,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => handleRecentSearch(term)}
                            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
                          >
                            <View
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                backgroundColor: isDark
                                  ? "rgba(30, 41, 59, 0.6)"
                                  : theme.card,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Ionicons name="time-outline" size={18} color={theme.textMuted} />
                            </View>
                            <Text
                              style={{
                                flex: 1,
                                marginLeft: 14,
                                fontSize: 15,
                                color: theme.text,
                                fontWeight: "500",
                              }}
                            >
                              {term}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => clearRecentSearch(term)}
                            style={{ padding: 8 }}
                          >
                            <Ionicons name="close" size={18} color={theme.textMuted} />
                          </TouchableOpacity>
                        </View>
                      </Animated.View>
                    ))}
                  </Animated.View>
                )}

                {/* Browse by Genre */}
                <Animated.View entering={FadeInUp.delay(500)} style={{ marginTop: 28 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: theme.text,
                      marginBottom: 16,
                    }}
                  >
                    Browse by Genre
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {GENRES.map((genre, index) => (
                      <Animated.View key={genre.name} entering={FadeInDown.delay(index * 40)}>
                        <TouchableOpacity
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            onClose();
                            router.push(`/genre/${genre.name}`);
                          }}
                          style={{ marginRight: 10, marginBottom: 10 }}
                        >
                          <LinearGradient
                            colors={genre.colors}
                            style={{
                              paddingHorizontal: 18,
                              paddingVertical: 12,
                              borderRadius: 16,
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Ionicons name={genre.icon as any} size={16} color="white" />
                            <Text style={{ color: "white", fontWeight: "700", fontSize: 14 }}>
                              {genre.name}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </Animated.View>
                    ))}
                  </View>
                </Animated.View>
              </View>
            ) : (
              /* Search Results */
              <View style={{ paddingHorizontal: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontSize: 15, color: theme.textSecondary, fontWeight: "600" }}>
                    {filteredMovies.length} results found
                  </Text>
                  {selectedGenres.length > 0 && (
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      {selectedGenres.map((genre) => (
                        <View
                          key={genre}
                          style={{
                            backgroundColor: `${Colors.primary}20`,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: Colors.primary,
                              fontSize: 11,
                              fontWeight: "600",
                            }}
                          >
                            {genre}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                {filteredMovies.length > 0 ? (
                  <FlashList
                    data={filteredMovies}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                      <SearchResultItem
                        movie={item}
                        index={index}
                        theme={theme}
                        onPress={() => handleMoviePress(item.id)}
                        isDark={isDark}
                      />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    estimatedItemSize={152}
                  />
                ) : (
                  <Animated.View
                    entering={FadeIn}
                    style={{ alignItems: "center", paddingVertical: 60 }}
                  >
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: `${Colors.primary}20`,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 20,
                      }}
                    >
                      <Ionicons name="search-outline" size={40} color={Colors.primary} />
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: theme.text,
                        marginBottom: 8,
                      }}
                    >
                      No results found
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: theme.textSecondary,
                        textAlign: "center",
                        paddingHorizontal: 40,
                        lineHeight: 20,
                      }}
                    >
                      Try a different search term or adjust your filters
                    </Text>
                  </Animated.View>
                )}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};
