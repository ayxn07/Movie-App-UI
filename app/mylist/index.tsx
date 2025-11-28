import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  Layout,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors, MOVIES, TRENDING, TOP_RATED } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Movie } from "@/types";

const { width } = Dimensions.get("window");
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Initial saved movies from different categories
const INITIAL_SAVED = [
  ...MOVIES.slice(0, 3),
  ...TRENDING.slice(0, 2),
  ...TOP_RATED.slice(0, 2),
];

// Filter options
const FILTER_OPTIONS = [
  { value: "all", label: "All", icon: "grid" },
  { value: "recent", label: "Recent", icon: "time" },
  { value: "topRated", label: "Top Rated", icon: "star" },
];

// Sort options
const SORT_OPTIONS = [
  { value: "added", label: "Date Added" },
  { value: "rating", label: "Rating" },
  { value: "title", label: "Title" },
];

// Saved Movie Card with swipe delete animation
const SavedMovieCard = ({
  movie,
  index,
  onRemove,
  onPlay,
  onPress,
  theme,
  isDark,
}: {
  movie: Movie;
  index: number;
  onRemove: () => void;
  onPlay: () => void;
  onPress: () => void;
  theme: ThemeColors;
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

  const handleRemove = () => {
    Alert.alert(
      "Remove from My List",
      `Are you sure you want to remove "${movie.title}" from your list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onRemove();
          },
        },
      ]
    );
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).springify()}
      exiting={SlideOutRight.duration(300)}
      layout={Layout.springify()}
      style={{ marginBottom: 16 }}
    >
      <AnimatedTouchable
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={1}
      >
        <View
          style={{
            flexDirection: "row",
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          {/* Movie Poster */}
          <View style={{ width: 112, height: 160, position: "relative" }}>
            <Image
              source={{ uri: movie.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                onPlay();
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -20,
                marginLeft: -20,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(139, 92, 246, 0.9)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play" size={18} color="white" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>

          {/* Movie Info */}
          <View style={{ flex: 1, padding: 16, justifyContent: "space-between" }}>
            <View>
              <Text
                style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}
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
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.genre}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
                <Ionicons name="time-outline" size={14} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.duration}</Text>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.textMuted,
                  }}
                />
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.year}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  onPlay();
                }}
                style={{ flex: 1 }}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={{
                    paddingVertical: 10,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play" size={16} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "700",
                      fontSize: 13,
                      marginLeft: 6,
                    }}
                  >
                    Play
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: isDark ? theme.backgroundTertiary : theme.backgroundSecondary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="download-outline" size={18} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRemove}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

export default function MyListScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [savedMovies, setSavedMovies] = useState<Movie[]>(INITIAL_SAVED);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("added");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleRemove = (movieId: number) => {
    setSavedMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  // Get filtered and sorted movies
  const filteredMovies = React.useMemo(() => {
    let movies = [...savedMovies];

    // Apply filter
    if (activeFilter === "topRated") {
      movies = movies.filter((m) => m.rating >= 8.5);
    }

    // Apply sort
    movies.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0; // "added" keeps original order
    });

    return movies;
  }, [savedMovies, activeFilter, sortBy]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <View>
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>My List</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                {savedMovies.length} saved movies
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowSortOptions(!showSortOptions);
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="options" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Filter Chips */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 20 }}
          contentContainerStyle={{ paddingRight: 20, gap: 12 }}
        >
          {FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveFilter(option.value);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor:
                    activeFilter === option.value ? theme.primary : theme.card,
                }}
              >
                <Ionicons
                  name={option.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={activeFilter === option.value ? "white" : theme.textSecondary}
                />
                <Text
                  style={{
                    color: activeFilter === option.value ? "white" : theme.textSecondary,
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Sort Options Dropdown */}
      {showSortOptions && (
        <Animated.View
          entering={FadeIn}
          style={{
            marginHorizontal: 20,
            marginBottom: 16,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.95)" : theme.card,
            borderRadius: 16,
            padding: 8,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSortBy(option.value);
                setShowSortOptions(false);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor:
                  sortBy === option.value
                    ? isDark
                      ? "rgba(139, 92, 246, 0.2)"
                      : "rgba(139, 92, 246, 0.1)"
                    : "transparent",
              }}
            >
              <Text
                style={{
                  color: sortBy === option.value ? theme.primary : theme.text,
                  fontWeight: sortBy === option.value ? "700" : "500",
                  fontSize: 14,
                }}
              >
                {option.label}
              </Text>
              {sortBy === option.value && (
                <Ionicons name="checkmark" size={20} color={theme.primary} />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {/* Saved Movies List */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {filteredMovies.length > 0 ? (
          <FlashList
            data={filteredMovies}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <SavedMovieCard
                movie={item}
                index={index}
                onRemove={() => handleRemove(item.id)}
                onPlay={() => router.push(`/player/${item.id}`)}
                onPress={() => router.push(`/movie/${item.id}`)}
                theme={theme}
                isDark={isDark}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={176}
          />
        ) : (
          <Animated.View
            entering={FadeIn}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: theme.card,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Ionicons name="bookmark-outline" size={48} color={theme.textMuted} />
            </View>
            <Text
              style={{
                color: theme.text,
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              No saved movies
            </Text>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 14,
                textAlign: "center",
                paddingHorizontal: 40,
                marginBottom: 24,
              }}
            >
              Start adding movies to your list by tapping the bookmark icon
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/");
              }}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={{
                  paddingHorizontal: 32,
                  paddingVertical: 14,
                  borderRadius: 16,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>
                  Explore Movies
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
