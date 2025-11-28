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

import {
  ALL_MOVIES,
  Colors,
  GENRES,
  MOVIES,
  TOP_RATED,
  TRENDING,
} from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { CategoryType, Genre, Movie } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Category configuration
const CATEGORY_CONFIG: Record<string, { title: string; icon: string; color: string; data: Movie[] }> = {
  popular: { title: "Popular This Week", icon: "trending-up", color: Colors.primary, data: MOVIES },
  top10: { title: "Top 10 This Week", icon: "trophy", color: Colors.accent, data: TOP_RATED },
  trending: { title: "Trending Now", icon: "flame", color: Colors.danger, data: TRENDING },
  all: { title: "All Movies", icon: "film", color: Colors.secondary, data: ALL_MOVIES },
};

// Movie Grid Card Component
const MovieGridCard = ({
  movie,
  index,
  theme,
  onPress,
  showRank,
}: {
  movie: Movie;
  index: number;
  theme: ThemeColors;
  onPress: () => void;
  showRank?: boolean;
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
            
            {/* Rank Badge */}
            {showRank && (
              <View style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: Colors.accent,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "900" }}>{index + 1}</Text>
              </View>
            )}
            
            {/* Rating Badge */}
            <View style={{
              position: "absolute", top: 12, left: 12,
              flexDirection: "row", alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
            }}>
              <Ionicons name="star" size={10} color={Colors.star} />
              <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700", marginLeft: 4 }}>{movie.rating}</Text>
            </View>
          </View>
          <View style={{ padding: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }} numberOfLines={1}>
              {movie.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.genre}</Text>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textMuted }} />
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.year}</Text>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

// Genre Chip Component
const GenreChip = ({
  genre,
  isSelected,
  onPress,
  theme,
}: {
  genre: Genre | { name: string; icon: string; colors: [string, string] };
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
        style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <Ionicons name={genre.icon as keyof typeof Ionicons.glyphMap} size={16} color="white" />
        <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>{genre.name}</Text>
      </LinearGradient>
    ) : (
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: theme.card }}>
        <Ionicons name={genre.icon as keyof typeof Ionicons.glyphMap} size={16} color={theme.textSecondary} />
        <Text style={{ color: theme.textSecondary, fontWeight: "500", fontSize: 13 }}>{genre.name}</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function SeeAllScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryType = (params.category as string) || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const config = CATEGORY_CONFIG[categoryType] || CATEGORY_CONFIG.all;

  // Filter data based on search and genre
  const filteredData = useMemo(() => {
    return config.data.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [config.data, searchQuery, selectedGenre]);

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
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
              alignItems: "center", justifyContent: "center", marginRight: 16,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: `${config.color}20`, alignItems: "center", justifyContent: "center",
              }}>
                <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={20} color={config.color} />
              </View>
              <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900" }}>{config.title}</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={{
            flexDirection: "row", alignItems: "center",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.9)",
            borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14,
            borderWidth: isDark ? 0 : 1, borderColor: theme.border,
          }}>
            <Ionicons name="search" size={20} color={theme.textSecondary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search movies..."
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
      </Animated.View>

      {/* Genre Filters */}
      <Animated.View entering={FadeInDown.delay(150).springify()} style={{ marginBottom: 16 }}>
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
            <View style={{
              paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
              backgroundColor: selectedGenre === null ? theme.primary : theme.card,
            }}>
              <Text style={{
                fontWeight: "700", fontSize: 13,
                color: selectedGenre === null ? "#ffffff" : theme.textSecondary,
              }}>All</Text>
            </View>
          </TouchableOpacity>
          {GENRES.map((genre) => (
            <GenreChip
              key={genre.name}
              genre={genre}
              isSelected={selectedGenre === genre.name}
              onPress={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
              theme={theme}
            />
          ))}
        </Animated.ScrollView>
      </Animated.View>

      {/* Results Count */}
      <Animated.View entering={FadeIn.delay(200)} style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
          {filteredData.length} movies found
        </Text>
      </Animated.View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <FlashList
          data={filteredData}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <MovieGridCard
              movie={item}
              index={index}
              theme={theme}
              showRank={categoryType === "top10"}
              onPress={() => router.push(`/movie/${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={270}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
              <Ionicons name="film-outline" size={48} color={theme.textMuted} />
              <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16 }}>No movies found</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
