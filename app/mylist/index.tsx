import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  Layout,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { ThemeColors, useApp, useTheme } from "@/context";
import { Movie } from "@/types";

const { width } = Dimensions.get("window");
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// My List Movie Card with swipe delete animation
const MyListCard = ({
  movie,
  index,
  onRemove,
  onPress,
  theme,
  isDark,
}: {
  movie: Movie;
  index: number;
  onRemove: () => void;
  onPress: () => void;
  theme: ThemeColors;
  isDark: boolean;
}) => {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).springify()}
      exiting={SlideOutRight.duration(300)}
      layout={Layout.springify()}
      style={{ marginBottom: 16 }}
    >
      <AnimatedTouchable
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={1}
      >
        <View style={{
          flexDirection: "row",
          borderRadius: 24,
          overflow: "hidden",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}>
          {/* Movie Poster */}
          <View style={{ width: 110, height: 160 }}>
            <Image
              source={{ uri: movie.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
          </View>

          {/* Movie Info */}
          <View style={{ flex: 1, padding: 16, justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 17 }} numberOfLines={2}>
                {movie.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: `${Colors.star}20`,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}>
                  <Ionicons name="star" size={12} color={Colors.star} />
                  <Text style={{ color: Colors.star, fontSize: 12, fontWeight: "700", marginLeft: 4 }}>
                    {movie.rating}
                  </Text>
                </View>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{movie.genre}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="time-outline" size={14} color={theme.textMuted} />
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginLeft: 4 }}>{movie.duration}</Text>
                </View>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textMuted }} />
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.year}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  router.push(`/player/${movie.id}`);
                }}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={{
                    paddingVertical: 10,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play" size={16} color="white" />
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 14, marginLeft: 6 }}>Play</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onRemove();
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: `${Colors.danger}20`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

export default function MyListScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { myList, removeFromMyList, showToast } = useApp();

  const handleRemove = (movieId: number, movieTitle: string) => {
    removeFromMyList(movieId);
    showToast(`Removed "${movieTitle}" from My List`, "info");
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
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
            <View>
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>My List</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                {myList.length} saved movies
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons name="filter" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* My List */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {myList.length > 0 ? (
          <FlashList
            data={myList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <MyListCard
                movie={item}
                index={index}
                onRemove={() => handleRemove(item.id, item.title)}
                onPress={() => router.push(`/movie/${item.id}`)}
                theme={theme}
                isDark={isDark}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={180}
          />
        ) : (
          <Animated.View
            entering={FadeIn}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View style={{
              width: 100, height: 100, borderRadius: 50,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              alignItems: "center", justifyContent: "center", marginBottom: 24,
            }}>
              <Ionicons name="bookmark-outline" size={48} color={theme.textMuted} />
            </View>
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: "800", marginBottom: 8 }}>
              No saved movies
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 15, textAlign: "center", paddingHorizontal: 40, marginBottom: 24 }}>
              Start adding movies to your list by tapping the bookmark icon
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(tabs)");
              }}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={{ paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16 }}
              >
                <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Explore Movies</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
