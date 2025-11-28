import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors, MOVIES, TOP_RATED, TRENDING } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Movie } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

// Category type definitions
type CategoryType = "movies" | "series" | "live" | "downloads";

interface CategoryConfig {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  movies: Movie[];
  emptyMessage: string;
}

// Category configurations
const getCategoryConfig = (type: CategoryType, theme: ThemeColors): CategoryConfig => {
  const configs: Record<CategoryType, CategoryConfig> = {
    movies: {
      title: "Movies",
      subtitle: "Browse all movies",
      icon: "film-outline",
      color: theme.primary,
      movies: [...ALL_MOVIES],
      emptyMessage: "No movies available",
    },
    series: {
      title: "TV Series",
      subtitle: "Popular shows and series",
      icon: "tv-outline",
      color: theme.secondary,
      movies: [...TRENDING, ...TOP_RATED], // Simulate series
      emptyMessage: "No series available",
    },
    live: {
      title: "Live TV",
      subtitle: "Watch live events",
      icon: "videocam-outline",
      color: theme.accent,
      movies: MOVIES.slice(0, 4), // Simulate live content
      emptyMessage: "No live content available",
    },
    downloads: {
      title: "Downloads",
      subtitle: "Your offline content",
      icon: "download-outline",
      color: theme.success,
      movies: [], // Initially empty
      emptyMessage: "No downloads yet. Download movies to watch offline!",
    },
  };
  return configs[type] || configs.movies;
};

// Movie Grid Card
const MovieGridCard = ({
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
  const [liked, setLiked] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 40).springify()}
      style={{ width: CARD_WIDTH, marginRight: index % 2 === 0 ? 16 : 0, marginBottom: 16 }}
    >
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View
            style={{
              borderRadius: 24,
              overflow: "hidden",
              backgroundColor: theme.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View style={{ height: 200, position: "relative" }}>
              <Image
                source={{ uri: movie.image }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={300}
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
              />
              {/* Like Button */}
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setLiked(!liked);
                }}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={18}
                  color={liked ? Colors.danger : "white"}
                />
              </TouchableOpacity>
              {/* Rating Badge */}
              <View
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Ionicons name="star" size={10} color={Colors.star} />
                <Text
                  style={{
                    color: "#fbbf24",
                    fontSize: 12,
                    fontWeight: "700",
                    marginLeft: 4,
                  }}
                >
                  {movie.rating}
                </Text>
              </View>
            </View>
            <View style={{ padding: 12 }}>
              <Text
                style={{ color: theme.text, fontWeight: "700", fontSize: 14 }}
                numberOfLines={1}
              >
                {movie.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 6,
                  gap: 6,
                }}
              >
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  {movie.genre}
                </Text>
                <View
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: theme.textMuted,
                  }}
                />
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  {movie.year}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default function CategoryScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryType = (params.type as CategoryType) || "movies";

  const config = getCategoryConfig(categoryType, theme);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = config.movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDark
            ? ["#1e1b4b", "#0f172a", "#020617"]
            : ["#f8fafc", "#f1f5f9", "#e2e8f0"]
        }
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
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
              marginRight: 16,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: `${config.color}20`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={config.icon} size={20} color={config.color} />
              </View>
              <Text
                style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}
              >
                {config.title}
              </Text>
            </View>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 14,
                marginTop: 4,
                marginLeft: 44,
              }}
            >
              {config.subtitle}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: isDark
              ? "rgba(30, 41, 59, 0.8)"
              : "rgba(241, 245, 249, 0.9)",
          }}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search ${config.title.toLowerCase()}...`}
            placeholderTextColor={theme.textMuted}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: theme.text,
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Results Count */}
      <Animated.View
        entering={FadeIn.delay(200)}
        style={{ paddingHorizontal: 20, marginBottom: 16 }}
      >
        <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
          {filteredMovies.length}{" "}
          {categoryType === "series"
            ? "series"
            : categoryType === "live"
              ? "live events"
              : "items"}{" "}
          found
        </Text>
      </Animated.View>

      {/* Movies Grid */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {filteredMovies.length > 0 ? (
          <FlashList
            data={filteredMovies}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <MovieGridCard
                movie={item}
                index={index}
                theme={theme}
                isDark={isDark}
                onPress={() => router.push(`/movie/${item.id}`)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={280}
          />
        ) : (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 100,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: `${config.color}20`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Ionicons name={config.icon} size={48} color={config.color} />
            </View>
            <Text
              style={{
                color: theme.text,
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              {searchQuery ? "No results found" : "Nothing here yet"}
            </Text>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 14,
                textAlign: "center",
                paddingHorizontal: 40,
              }}
            >
              {searchQuery
                ? "Try searching for something else"
                : config.emptyMessage}
            </Text>
            {categoryType === "downloads" && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push("/(tabs)/explore");
                }}
                style={{ marginTop: 24 }}
              >
                <LinearGradient
                  colors={[theme.primary, theme.primaryDark]}
                  style={{
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Ionicons name="compass-outline" size={20} color="white" />
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                    Browse Movies
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}
