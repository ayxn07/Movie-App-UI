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
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors, MOVIES, TOP_RATED, TRENDING } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Movie } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Configuration for different see all types
const SEEALL_CONFIG: Record<string, { title: string; icon: string; data: Movie[] }> = {
  popular: { title: "Popular This Week", icon: "trending-up", data: MOVIES },
  top10: { title: "Top 10 This Week", icon: "trophy", data: TOP_RATED },
  trending: { title: "Trending Now", icon: "flame", data: TRENDING },
};

// Movie Grid Card Component
const MovieGridCard = ({
  movie,
  index,
  theme,
  isDark,
  showRank,
  onPress,
}: {
  movie: Movie;
  index: number;
  theme: ThemeColors;
  isDark: boolean;
  showRank: boolean;
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
            {/* Rank Badge */}
            {showRank && (
              <View style={{
                position: "absolute", bottom: 12, left: 12,
                backgroundColor: theme.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
              }}>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "900" }}>#{index + 1}</Text>
              </View>
            )}
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

export default function SeeAllScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type as string;

  const config = SEEALL_CONFIG[type] || SEEALL_CONFIG.popular;
  const showRank = type === "top10";

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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: `${theme.primary}20`, alignItems: "center", justifyContent: "center",
              }}>
                <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.primary} />
              </View>
              <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900" }}>{config.title}</Text>
            </View>
          </View>
        </View>
        <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 12, marginLeft: 60 }}>
          {config.data.length} movies
        </Text>
      </Animated.View>

      {/* Movies Grid */}
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <FlashList
          data={config.data}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <MovieGridCard
              movie={item}
              index={index}
              theme={theme}
              isDark={isDark}
              showRank={showRank}
              onPress={() => router.push(`/movie/${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={270}
        />
      </View>
    </View>
  );
}
