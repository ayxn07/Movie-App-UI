import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
import { Genre, Movie } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

// Movie Grid Card with enhanced animations
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

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLiked(!liked);
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
                onPress={handleLike}
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

// Genre Filter Chip with enhanced animations
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
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, 100);
    onPress();
  };

  return (
    <Animated.View style={[animatedStyle, { marginRight: 12 }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
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
    </Animated.View>
  );
};

export default function ExploreScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredMovies = useMemo(() => {
    return ALL_MOVIES.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

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
        <Text style={{ fontSize: 30, fontWeight: "900", marginBottom: 20, color: theme.text }}>
          Explore
        </Text>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
          }}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search movies, series..."
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
          <Animated.View style={{ marginRight: 12 }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedGenre(null);
              }}
              activeOpacity={0.9}
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
          </Animated.View>
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
        <Text style={{ fontSize: 14, color: theme.textSecondary }}>
          {filteredMovies.length} movies found
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
            <Animated.View
              entering={FadeIn}
              style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}
            >
              <Ionicons name="film-outline" size={48} color={theme.textMuted} />
              <Text style={{ fontSize: 16, marginTop: 16, color: theme.textSecondary }}>
                No movies found
              </Text>
              <Text style={{ fontSize: 14, marginTop: 8, color: theme.textMuted }}>
                Try a different search term
              </Text>
            </Animated.View>
          }
        />
      </View>
    </View>
  );
}
