import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
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

export default function GenreScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const genreName = params.name as string;

  // Find genre config
  const genreConfig = GENRES.find((g) => g.name.toLowerCase() === genreName?.toLowerCase());

  // Filter movies by genre
  const filteredMovies = useMemo(() => {
    return ALL_MOVIES.filter((movie) => 
      movie.genre.toLowerCase() === genreName?.toLowerCase()
    );
  }, [genreName]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              {genreConfig && (
                <LinearGradient
                  colors={genreConfig.colors}
                  style={{
                    width: 44, height: 44, borderRadius: 14,
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Ionicons name={genreConfig.icon as keyof typeof Ionicons.glyphMap} size={24} color="white" />
                </LinearGradient>
              )}
              <View>
                <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>{genreName}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                  {filteredMovies.length} movies
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Movies Grid */}
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
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
                onPress={() => router.push(`/movie/${item.id}`)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={270}
          />
        ) : (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View style={{
              width: 100, height: 100, borderRadius: 50,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              alignItems: "center", justifyContent: "center", marginBottom: 20,
            }}>
              <Ionicons name="film-outline" size={48} color={theme.textMuted} />
            </View>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
              No movies found
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 40 }}>
              We couldn't find any movies in this genre. Check back later!
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
