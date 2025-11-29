import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Dimensions, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors, GENRES } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Movie } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Get genre config by name
const getGenreConfig = (genreName: string) => {
  const genre = GENRES.find((g) => g.name.toLowerCase() === genreName.toLowerCase());
  return genre || { name: genreName, icon: "film", colors: [Colors.primary, Colors.primaryDark] as [string, string] };
};

// Movie Grid Card Component
const MovieGridCard = ({
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

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify()}
      style={{ width: CARD_WIDTH, marginRight: index % 2 === 0 ? 16 : 0, marginBottom: 16 }}
    >
      <AnimatedTouchable
        activeOpacity={0.9}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={animatedStyle}
      >
        <View style={{ borderRadius: 24, overflow: "hidden", backgroundColor: theme.card }}>
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
            <View style={{
              position: "absolute", top: 12, left: 12,
              flexDirection: "row", alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
            }}>
              <Ionicons name="star" size={10} color={Colors.star} />
              <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700", marginLeft: 4 }}>{movie.rating}</Text>
            </View>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              style={{
                position: "absolute", top: 12, right: 12,
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="heart-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{ padding: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }} numberOfLines={1}>
              {movie.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.duration}</Text>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textMuted }} />
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.year}</Text>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

// Sort Options
const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "year", label: "Year" },
  { value: "title", label: "Title" },
];

export default function GenreScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const genreName = (params.name as string) || "Action";

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const genreConfig = getGenreConfig(genreName);

  // Filter and sort movies by genre
  const filteredMovies = useMemo(() => {
    let movies = ALL_MOVIES.filter((movie) => {
      const matchesGenre = movie.genre.toLowerCase() === genreName.toLowerCase();
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });

    // Sort movies
    movies = [...movies].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "year") return parseInt(b.year) - parseInt(a.year);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    return movies;
  }, [genreName, searchQuery, sortBy]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Hero Header */}
      <LinearGradient
        colors={genreConfig.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 56,
          paddingBottom: 32,
          paddingHorizontal: 20,
        }}
      >
        <Animated.View entering={FadeInDown.springify()}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center", justifyContent: "center", marginRight: 16,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name={genreConfig.icon as keyof typeof Ionicons.glyphMap} size={32} color="white" />
                <Text style={{ color: "white", fontSize: 28, fontWeight: "900" }}>{genreConfig.name}</Text>
              </View>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 }}>
                {filteredMovies.length} movies available
              </Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Content */}
      <View style={{ flex: 1, marginTop: -16 }}>
        {/* Search and Sort Bar */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            paddingHorizontal: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.9)" : "rgba(255,255,255,0.95)",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Ionicons name="search" size={20} color={theme.textSecondary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search ${genreName} movies...`}
              placeholderTextColor={theme.textMuted}
              style={{ flex: 1, marginLeft: 12, fontSize: 15, color: theme.text }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Sort Options */}
        <Animated.View entering={FadeInDown.delay(150).springify()} style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSortBy(option.value);
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 16,
                    backgroundColor: sortBy === option.value ? theme.primary : theme.card,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Ionicons
                    name={
                      option.value === "rating" ? "star" :
                      option.value === "year" ? "calendar" : "text"
                    }
                    size={14}
                    color={sortBy === option.value ? "white" : theme.textSecondary}
                  />
                  <Text
                    style={{
                      color: sortBy === option.value ? "white" : theme.textSecondary,
                      fontWeight: "600",
                      fontSize: 13,
                    }}
                  >
                    {option.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>
        </Animated.View>

        {/* Movies Grid */}
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
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
                onPress={() => router.push(`/movie/${item.id}`)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={270}
            ListEmptyComponent={
              <Animated.View
                entering={FadeIn}
                style={{ alignItems: "center", justifyContent: "center", paddingVertical: 80 }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: theme.card,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="film-outline" size={40} color={theme.textMuted} />
                </View>
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
                  No movies found
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 40 }}>
                  Try searching for a different movie in the {genreName} genre
                </Text>
              </Animated.View>
            }
          />
        </View>
      </View>
    </View>
  );
}
