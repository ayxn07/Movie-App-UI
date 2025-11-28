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

import { ALL_MOVIES, Colors, GENRES, MOVIES, TRENDING } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Genre, Movie } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

// Category configurations
const CATEGORY_CONFIG: Record<string, {
  title: string;
  icon: string;
  description: string;
  gradient: [string, string];
}> = {
  movies: {
    title: "Movies",
    icon: "film",
    description: "Browse our collection of movies",
    gradient: ["#8b5cf6", "#6366f1"],
  },
  series: {
    title: "TV Series",
    icon: "tv",
    description: "Watch popular TV series",
    gradient: ["#ec4899", "#db2777"],
  },
  live: {
    title: "Live",
    icon: "videocam",
    description: "Watch live events and streams",
    gradient: ["#f59e0b", "#d97706"],
  },
  downloads: {
    title: "Downloads",
    icon: "download",
    description: "Your downloaded content",
    gradient: ["#10b981", "#059669"],
  },
};

// Simulated series data (reusing movie structure for demo)
const SERIES_DATA: Movie[] = [
  {
    id: 201,
    title: "Breaking Bad",
    rating: 9.5,
    image: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    genre: "Drama",
    year: "2008",
    duration: "5 Seasons",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
  },
  {
    id: 202,
    title: "Stranger Things",
    rating: 8.7,
    image: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    genre: "Sci-Fi",
    year: "2016",
    duration: "4 Seasons",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
  },
  {
    id: 203,
    title: "Game of Thrones",
    rating: 9.2,
    image: "https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    genre: "Fantasy",
    year: "2011",
    duration: "8 Seasons",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
  },
  {
    id: 204,
    title: "The Witcher",
    rating: 8.2,
    image: "https://m.media-amazon.com/images/M/MV5BN2FiOWU4YzYtMzZiOS00MzcyLTlkOGEtOTgwZmEwMzAxMzA3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    genre: "Fantasy",
    year: "2019",
    duration: "3 Seasons",
    description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
  },
  {
    id: 205,
    title: "The Last of Us",
    rating: 8.8,
    image: "https://m.media-amazon.com/images/M/MV5BZGUzYTI3M2EtZmM0Yy00NGUyLWI4ODEtN2Q3ZGJlYzhhZjU3XkEyXkFqcGdeQXVyNTM0OTY1OQ@@._V1_.jpg",
    genre: "Drama",
    year: "2023",
    duration: "2 Seasons",
    description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl.",
  },
];

// Live data
const LIVE_DATA: Movie[] = [
  {
    id: 301,
    title: "Live Sports Event",
    rating: 9.0,
    image: "https://images.unsplash.com/photo-1461896836934- voices-echoes",
    genre: "Sports",
    year: "2024",
    duration: "Live",
    description: "Watch the latest sports events live.",
  },
  {
    id: 302,
    title: "News Channel",
    rating: 8.5,
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400",
    genre: "News",
    year: "2024",
    duration: "24/7",
    description: "Stay updated with the latest news.",
  },
];

// Movie Grid Card
const MovieGridCard = ({ 
  movie, 
  index, 
  theme, 
  onPress,
  showDownloadBadge,
}: { 
  movie: Movie; 
  index: number; 
  theme: ThemeColors; 
  onPress: () => void;
  showDownloadBadge?: boolean;
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

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify()}
      style={{ width: CARD_WIDTH, marginRight: index % 2 === 0 ? 16 : 0, marginBottom: 16 }}
    >
      <Animated.View style={animatedStyle}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
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
              <View style={{
                position: "absolute",
                top: 12,
                left: 12,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.6)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}>
                <Ionicons name="star" size={10} color={Colors.star} />
                <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700", marginLeft: 4 }}>{movie.rating}</Text>
              </View>
              {/* Download Badge */}
              {showDownloadBadge && (
                <View style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.success,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}>
                  <Ionicons name="checkmark-circle" size={12} color="white" />
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "700", marginLeft: 4 }}>Downloaded</Text>
                </View>
              )}
            </View>
            <View style={{ padding: 12 }}>
              <Text style={{ fontWeight: "700", fontSize: 14, color: theme.text }} numberOfLines={1}>
                {movie.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 }}>
                <Text style={{ fontSize: 12, color: theme.textSecondary }}>{movie.genre}</Text>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textMuted }} />
                <Text style={{ fontSize: 12, color: theme.textSecondary }}>{movie.duration}</Text>
              </View>
            </View>
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
    style={{ marginRight: 12 }}
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
        <Ionicons name={genre.icon as any} size={16} color="white" />
        <Text style={{ color: "white", fontWeight: "700", fontSize: 14 }}>{genre.name}</Text>
      </LinearGradient>
    ) : (
      <View style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: theme.card,
      }}>
        <Ionicons name={genre.icon as any} size={16} color={theme.textSecondary} />
        <Text style={{ fontWeight: "500", fontSize: 14, color: theme.textSecondary }}>{genre.name}</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function CategoryScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryType = params.type as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const config = CATEGORY_CONFIG[categoryType] || CATEGORY_CONFIG.movies;

  // Get data based on category type
  const categoryData = useMemo(() => {
    switch (categoryType) {
      case "movies":
        return ALL_MOVIES;
      case "series":
        return SERIES_DATA;
      case "live":
        return LIVE_DATA;
      case "downloads":
        // Simulating downloaded content (random subset)
        return [...MOVIES.slice(0, 2), ...TRENDING.slice(0, 2)];
      default:
        return ALL_MOVIES;
    }
  }, [categoryType]);

  // Filter content
  const filteredContent = useMemo(() => {
    return categoryData.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !selectedGenre || item.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [categoryData, searchQuery, selectedGenre]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
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
                <Ionicons name={config.icon as any} size={20} color="white" />
              </LinearGradient>
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>{config.title}</Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4, marginLeft: 44 }}>{config.description}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
        }}>
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

      {/* Genre Filters - Only for Movies and Series */}
      {(categoryType === "movies" || categoryType === "series") && (
        <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 16 }}>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingLeft: 20 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedGenre(null);
              }}
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
      )}

      {/* Results Count */}
      <Animated.View entering={FadeIn.delay(200)} style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <Text style={{ fontSize: 14, color: theme.textSecondary }}>
          {filteredContent.length} {filteredContent.length === 1 ? "item" : "items"} found
        </Text>
      </Animated.View>

      {/* Content Grid */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <FlashList
          data={filteredContent}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <MovieGridCard
              movie={item}
              index={index}
              theme={theme}
              onPress={() => router.push(`/movie/${item.id}`)}
              showDownloadBadge={categoryType === "downloads"}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={280}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
              <Ionicons name={config.icon as any} size={48} color={theme.textMuted} />
              <Text style={{ fontSize: 16, marginTop: 16, color: theme.textSecondary }}>
                {categoryType === "downloads" ? "No downloaded content" : "No content found"}
              </Text>
              {categoryType === "downloads" && (
                <TouchableOpacity
                  style={{ marginTop: 20 }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/category/movies");
                  }}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 }}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>Browse Movies</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
    </View>
  );
}
