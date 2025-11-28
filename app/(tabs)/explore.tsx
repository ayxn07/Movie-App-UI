import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Dimensions, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { ALL_MOVIES, Colors, GENRES } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Genre, Movie } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

// Movie Grid Card
const MovieGridCard = ({ movie, index, theme }: { movie: Movie; index: number; theme: ThemeColors }) => {
  const [liked, setLiked] = useState(false);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify()}
      className="mb-4"
      style={{ width: CARD_WIDTH, marginRight: index % 2 === 0 ? 16 : 0 }}
    >
      <TouchableOpacity activeOpacity={0.9}>
        <View className="rounded-3xl overflow-hidden" style={{ backgroundColor: theme.card }}>
          <View className="h-52 relative">
            <Image
              source={{ uri: movie.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              className="absolute inset-0"
            />
            {/* Like Button */}
            <TouchableOpacity
              onPress={() => setLiked(!liked)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full items-center justify-center bg-black/50"
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={18}
                color={liked ? Colors.danger : "white"}
              />
            </TouchableOpacity>
            {/* Rating Badge */}
            <View className="absolute top-3 left-3 flex-row items-center bg-black/60 px-2 py-1 rounded-lg">
              <Ionicons name="star" size={10} color={Colors.star} />
              <Text className="text-yellow-400 text-xs font-bold ml-1">{movie.rating}</Text>
            </View>
          </View>
          <View className="p-3">
            <Text className="font-bold text-sm" numberOfLines={1} style={{ color: theme.text }}>
              {movie.title}
            </Text>
            <View className="flex-row items-center mt-1.5 gap-2">
              <Text className="text-xs" style={{ color: theme.textSecondary }}>{movie.genre}</Text>
              <View className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.textMuted }} />
              <Text className="text-xs" style={{ color: theme.textSecondary }}>{movie.year}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
  <TouchableOpacity onPress={onPress} className="mr-3">
    {isSelected ? (
      <LinearGradient
        colors={genre.colors}
        className="px-4 py-2.5 rounded-full flex-row items-center gap-1.5"
      >
        <Ionicons name={genre.icon as any} size={16} color="white" />
        <Text className="text-white font-bold text-sm">{genre.name}</Text>
      </LinearGradient>
    ) : (
      <View className="px-4 py-2.5 rounded-full flex-row items-center gap-1.5" style={{ backgroundColor: theme.card }}>
        <Ionicons name={genre.icon as any} size={16} color={theme.textSecondary} />
        <Text className="font-medium text-sm" style={{ color: theme.textSecondary }}>{genre.name}</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function ExploreScreen() {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredMovies = ALL_MOVIES.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        className="absolute inset-0"
      />

      {/* Header */}
      <Animated.View entering={FadeInDown.springify()} className="px-5 pt-14 pb-4">
        <Text className="text-3xl font-black mb-5" style={{ color: theme.text }}>Explore</Text>

        {/* Search Bar */}
        <View className="flex-row items-center rounded-2xl px-4 py-3" style={{ backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)" }}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search movies, series..."
            placeholderTextColor={theme.textMuted}
            className="flex-1 ml-3 text-base"
            style={{ color: theme.text }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Genre Filters */}
      <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-4">
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pl-5"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedGenre(null)}
            className="mr-3"
          >
            <View
              className="px-4 py-2.5 rounded-full"
              style={{ backgroundColor: selectedGenre === null ? theme.primary : theme.card }}
            >
              <Text
                className="font-bold text-sm"
                style={{ color: selectedGenre === null ? "#ffffff" : theme.textSecondary }}
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

      {/* Results Count */}
      <Animated.View entering={FadeIn.delay(200)} className="px-5 mb-4">
        <Text className="text-sm" style={{ color: theme.textSecondary }}>
          {filteredMovies.length} movies found
        </Text>
      </Animated.View>

      {/* Movies Grid */}
      <View className="flex-1 px-5">
        <FlashList
          data={filteredMovies}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <MovieGridCard movie={item} index={index} theme={theme} />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="film-outline" size={48} color={theme.textMuted} />
              <Text className="text-base mt-4" style={{ color: theme.textSecondary }}>No movies found</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
