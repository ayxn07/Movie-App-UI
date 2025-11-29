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

// Saved Movie Card with swipe delete animation
const SavedMovieCard = ({
  movie,
  index,
  onRemove,
  onPress,
  onPlay,
  theme,
}: {
  movie: Movie;
  index: number;
  onRemove: () => void;
  onPress: () => void;
  onPlay: () => void;
  theme: ThemeColors;
}) => {
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
      className="mb-4"
    >
      <AnimatedTouchable
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
      >
        <View className="flex-row rounded-3xl overflow-hidden" style={{ backgroundColor: theme.card }}>
          {/* Movie Poster */}
          <View className="w-28 h-40">
            <Image
              source={{ uri: movie.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
          </View>

          {/* Movie Info */}
          <View className="flex-1 p-4 justify-between">
            <View>
              <Text className="font-bold text-lg" numberOfLines={2} style={{ color: theme.text }}>
                {movie.title}
              </Text>
              <View className="flex-row items-center gap-2 mt-2">
                <View className="flex-row items-center bg-yellow-500/20 px-2 py-1 rounded-lg">
                  <Ionicons name="star" size={12} color={Colors.star} />
                  <Text className="text-yellow-400 text-xs font-bold ml-1">
                    {movie.rating}
                  </Text>
                </View>
                <Text className="text-sm" style={{ color: theme.textSecondary }}>{movie.genre}</Text>
              </View>
              <View className="flex-row items-center gap-2 mt-2">
                <Ionicons name="time-outline" size={14} color={theme.textMuted} />
                <Text className="text-sm" style={{ color: theme.textSecondary }}>{movie.duration}</Text>
                <View className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.textMuted }} />
                <Text className="text-sm" style={{ color: theme.textSecondary }}>{movie.year}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row items-center gap-3 mt-3">
              <TouchableOpacity className="flex-1" onPress={onPlay}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  className="py-2.5 rounded-xl flex-row items-center justify-center"
                >
                  <Ionicons name="play" size={16} color="white" />
                  <Text className="text-white font-bold text-sm ml-1">Play</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onRemove();
                }}
                className="w-10 h-10 rounded-xl bg-red-500/20 items-center justify-center"
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

export default function SavedScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { myList, removeFromMyList, showToast } = useApp();

  const handleRemove = (movieId: number, movieTitle: string) => {
    removeFromMyList(movieId);
    showToast(`Removed "${movieTitle}" from My List`, "info");
  };

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
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-black" style={{ color: theme.text }}>My List</Text>
            <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
              {myList.length} saved movies
            </Text>
          </View>
          <TouchableOpacity className="w-11 h-11 rounded-full items-center justify-center" style={{ backgroundColor: theme.card }}>
            <Ionicons name="filter" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Saved Movies List */}
      <View className="flex-1 px-5">
        {myList.length > 0 ? (
          <FlashList
            data={myList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <SavedMovieCard
                movie={item}
                index={index}
                onRemove={() => handleRemove(item.id, item.title)}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/movie/${item.id}`);
                }}
                onPlay={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  router.push(`/player/${item.id}`);
                }}
                theme={theme}
              />
            )}
            estimatedItemSize={180}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Animated.View
            entering={FadeIn}
            className="flex-1 items-center justify-center"
          >
            <View className="w-24 h-24 rounded-full items-center justify-center mb-6" style={{ backgroundColor: theme.card }}>
              <Ionicons name="bookmark-outline" size={48} color={theme.textMuted} />
            </View>
            <Text className="text-xl font-bold mb-2" style={{ color: theme.text }}>No saved movies</Text>
            <Text className="text-center px-10" style={{ color: theme.textSecondary }}>
              Start adding movies to your list by tapping the bookmark icon
            </Text>
            <TouchableOpacity 
              className="mt-6"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(tabs)");
              }}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                className="px-8 py-3 rounded-full"
              >
                <Text className="text-white font-bold">Explore Movies</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
