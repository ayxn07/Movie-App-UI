import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useMemo } from "react";
import { Dimensions, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors, GENRES, MOVIES, TOP_RATED, TRENDING } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Movie } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

// Category configurations
const CATEGORY_CONFIG: Record<string, {
  title: string;
  icon: string;
  description: string;
  gradient: [string, string];
  movies: Movie[];
}> = {
  movies: {
    title: "Movies",
    icon: "film",
    description: "Browse all movies in our collection",
    gradient: ["#8b5cf6", "#6366f1"],
    movies: ALL_MOVIES,
  },
  series: {
    title: "TV Series",
    icon: "tv",
    description: "Popular TV shows and series",
    gradient: ["#ec4899", "#db2777"],
    movies: TRENDING, // Using trending as mock series data
  },
  live: {
    title: "Live TV",
    icon: "videocam",
    description: "Watch live channels and events",
    gradient: ["#f59e0b", "#d97706"],
    movies: TOP_RATED, // Using top rated as mock live data
  },
  downloads: {
    title: "Downloads",
    icon: "download",
    description: "Your downloaded content",
    gradient: ["#10b981", "#059669"],
    movies: MOVIES.slice(0, 3), // Mock downloaded movies
  },
};

// Movie Grid Card
const MovieGridCard = ({
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
  const [liked, setLiked] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify()}
      style={{ width: CARD_WIDTH, marginRight: index % 2 === 0 ? 16 : 0, marginBottom: 16 }}
    >
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePress}
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
            <View style={{ height: 208, position: "relative" }}>
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
                <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700", marginLeft: 4 }}>
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
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.genre}</Text>
                <View
                  style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textMuted }}
                />
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.year}</Text>
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
  const type = (params.type as string) || "movies";

  const config = CATEGORY_CONFIG[type] || CATEGORY_CONFIG.movies;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredMovies = useMemo(() => {
    return config.movies.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [config.movies, searchQuery, selectedGenre]);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

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
        {/* Back Button and Title */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleBack}
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
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <LinearGradient
                colors={config.gradient}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={config.icon as any} size={18} color="white" />
              </LinearGradient>
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>
                {config.title}
              </Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>
              {config.description}
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
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search ${config.title.toLowerCase()}...`}
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, marginLeft: 12, fontSize: 16, color: theme.text }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Genre Filters */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 16 }}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 20 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedGenre(null)}
            style={{ marginRight: 12 }}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: selectedGenre === null ? theme.primary : theme.card,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 14,
                  color: selectedGenre === null ? "#ffffff" : theme.textSecondary,
                }}
              >
                All
              </Text>
            </View>
          </TouchableOpacity>
          {GENRES.map((genre) => (
            <TouchableOpacity
              key={genre.name}
              onPress={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
              style={{ marginRight: 12 }}
            >
              {selectedGenre === genre.name ? (
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
                  <Ionicons name={genre.icon as any} size={16} color="white" />
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 14 }}>
                    {genre.name}
                  </Text>
                </LinearGradient>
              ) : (
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: theme.card,
                  }}
                >
                  <Ionicons name={genre.icon as any} size={16} color={theme.textSecondary} />
                  <Text style={{ fontWeight: "500", fontSize: 14, color: theme.textSecondary }}>
                    {genre.name}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      </Animated.View>

      {/* Results Count */}
      <Animated.View entering={FadeIn.delay(200)} style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <Text style={{ fontSize: 14, color: theme.textSecondary }}>
          {filteredMovies.length} {filteredMovies.length === 1 ? "item" : "items"} found
        </Text>
      </Animated.View>

      {/* Movies Grid */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
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
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
              <Ionicons name="film-outline" size={48} color={theme.textMuted} />
              <Text style={{ fontSize: 16, marginTop: 16, color: theme.textSecondary }}>
                No content found
              </Text>
              <Text style={{ fontSize: 14, marginTop: 8, color: theme.textMuted, textAlign: "center" }}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
