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
  DOWNLOADS,
  GENRES,
  LIVE_EVENTS,
  SERIES,
} from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { ContentType, Download, Genre, LiveEvent, Movie, Series } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Category configuration
const CATEGORY_CONFIG: Record<ContentType, { title: string; icon: string; color: string }> = {
  movies: { title: "Movies", icon: "film", color: Colors.primary },
  series: { title: "TV Series", icon: "tv", color: Colors.secondary },
  live: { title: "Live TV", icon: "videocam", color: Colors.accent },
  downloads: { title: "Downloads", icon: "download", color: Colors.success },
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

// Series Grid Card Component
const SeriesGridCard = ({
  series,
  index,
  theme,
  onPress,
}: {
  series: Series;
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
              source={{ uri: series.image }}
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
              <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700", marginLeft: 4 }}>{series.rating}</Text>
            </View>
            <View style={{
              position: "absolute", bottom: 12, left: 12,
              backgroundColor: Colors.secondary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
            }}>
              <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>{series.seasons} Seasons</Text>
            </View>
          </View>
          <View style={{ padding: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }} numberOfLines={1}>
              {series.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{series.genre}</Text>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textMuted }} />
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{series.episodes} Ep</Text>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

// Live Event Card Component
const LiveEventCard = ({
  event,
  index,
  theme,
}: {
  event: LiveEvent;
  index: number;
  theme: ThemeColors;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify()}
      style={{ marginBottom: 16 }}
    >
      <AnimatedTouchable
        activeOpacity={0.9}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={animatedStyle}
      >
        <View style={{
          flexDirection: "row", borderRadius: 20,
          overflow: "hidden", backgroundColor: theme.card,
        }}>
          <View style={{ width: 140, height: 100, position: "relative" }}>
            <Image
              source={{ uri: event.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
            {event.isLive && (
              <View style={{
                position: "absolute", top: 8, left: 8,
                backgroundColor: Colors.danger, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
                flexDirection: "row", alignItems: "center", gap: 4,
              }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "white" }} />
                <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>LIVE</Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1, padding: 12, justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }} numberOfLines={2}>
                {event.title}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>{event.channel}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{
                backgroundColor: theme.backgroundTertiary,
                paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
              }}>
                <Text style={{ color: theme.textSecondary, fontSize: 11 }}>{event.category}</Text>
              </View>
              {event.isLive ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="eye" size={12} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary, fontSize: 11 }}>
                    {(event.viewers / 1000).toFixed(0)}K
                  </Text>
                </View>
              ) : (
                <Text style={{ color: theme.primary, fontSize: 11, fontWeight: "600" }}>{event.startTime}</Text>
              )}
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

// Download Card Component
const DownloadCard = ({
  download,
  index,
  theme,
  isDark,
}: {
  download: Download;
  index: number;
  theme: ThemeColors;
  isDark: boolean;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const statusColor = {
    downloading: Colors.primary,
    completed: Colors.success,
    paused: Colors.warning,
  }[download.status];

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify()}
      style={{ marginBottom: 16 }}
    >
      <AnimatedTouchable
        activeOpacity={0.9}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={animatedStyle}
      >
        <View style={{
          flexDirection: "row", borderRadius: 20,
          overflow: "hidden", backgroundColor: theme.card,
        }}>
          <View style={{ width: 100, height: 130 }}>
            <Image
              source={{ uri: download.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
          </View>
          <View style={{ flex: 1, padding: 12, justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }} numberOfLines={2}>
                {download.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                <View style={{
                  backgroundColor: theme.backgroundTertiary,
                  paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
                }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 11, textTransform: "capitalize" }}>
                    {download.type}
                  </Text>
                </View>
                <Text style={{ color: theme.textSecondary, fontSize: 11 }}>{download.size}</Text>
              </View>
            </View>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ color: statusColor, fontSize: 12, fontWeight: "600", textTransform: "capitalize" }}>
                  {download.status}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{download.progress}%</Text>
              </View>
              <View style={{
                height: 4, backgroundColor: isDark ? "#334155" : "#e2e8f0",
                borderRadius: 2, overflow: "hidden",
              }}>
                <View style={{
                  height: "100%", width: `${download.progress}%`,
                  backgroundColor: statusColor, borderRadius: 2,
                }} />
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 }}>
              {download.status === "downloading" && (
                <TouchableOpacity
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="pause" size={20} color={theme.text} />
                </TouchableOpacity>
              )}
              {download.status === "paused" && (
                <TouchableOpacity
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="play" size={20} color={theme.primary} />
                </TouchableOpacity>
              )}
              {download.status === "completed" && (
                <TouchableOpacity
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="play-circle" size={20} color={Colors.success} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={{ padding: 4 }}
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

export default function CategoryScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const contentType = params.type as ContentType;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const config = CATEGORY_CONFIG[contentType] || CATEGORY_CONFIG.movies;

  // Filter data based on search and genre
  const filteredData = useMemo(() => {
    if (contentType === "movies") {
      return ALL_MOVIES.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
        return matchesSearch && matchesGenre;
      });
    }
    if (contentType === "series") {
      return SERIES.filter((series) => {
        const matchesSearch = series.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = !selectedGenre || series.genre === selectedGenre;
        return matchesSearch && matchesGenre;
      });
    }
    if (contentType === "live") {
      return LIVE_EVENTS.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (contentType === "downloads") {
      return DOWNLOADS.filter((download) =>
        download.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  }, [contentType, searchQuery, selectedGenre]);

  const renderContent = () => {
    if (contentType === "movies") {
      return (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <FlashList
            data={filteredData as Movie[]}
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
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
                <Ionicons name="film-outline" size={48} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16 }}>No movies found</Text>
              </View>
            }
          />
        </View>
      );
    }

    if (contentType === "series") {
      return (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <FlashList
            data={filteredData as Series[]}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <SeriesGridCard
                series={item}
                index={index}
                theme={theme}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
                <Ionicons name="tv-outline" size={48} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16 }}>No series found</Text>
              </View>
            }
          />
        </View>
      );
    }

    if (contentType === "live") {
      return (
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <FlashList
            data={filteredData as LiveEvent[]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <LiveEventCard event={item} index={index} theme={theme} />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
                <Ionicons name="videocam-outline" size={48} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16 }}>No live events</Text>
              </View>
            }
          />
        </View>
      );
    }

    if (contentType === "downloads") {
      return (
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <FlashList
            data={filteredData as Download[]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <DownloadCard download={item} index={index} theme={theme} isDark={isDark} />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
                <Ionicons name="download-outline" size={48} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16 }}>No downloads</Text>
              </View>
            }
          />
        </View>
      );
    }

    return null;
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
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>{config.title}</Text>
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
              placeholder={`Search ${config.title.toLowerCase()}...`}
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

      {/* Genre Filters (only for movies and series) */}
      {(contentType === "movies" || contentType === "series") && (
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
      )}

      {/* Results Count */}
      <Animated.View entering={FadeIn.delay(200)} style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
          {filteredData.length} {contentType === "live" ? "events" : contentType === "downloads" ? "items" : "titles"} found
        </Text>
      </Animated.View>

      {/* Content */}
      {renderContent()}
    </View>
  );
}
