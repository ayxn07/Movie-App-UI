import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, Share, Text, TouchableOpacity, View } from "react-native";
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
import Toast from "react-native-toast-message";

import { Colors } from "@/constants/data";
import { ThemeColors, useMyList, useTheme } from "@/context";
import { MyListItem } from "@/types";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// My List Movie Card
const MyListCard = ({
  movie,
  index,
  onRemove,
  onPress,
  theme,
  isDark,
}: {
  movie: MyListItem;
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

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        title: movie.title,
        message: `Check out "${movie.title}" on MoviesHub!\n\n${movie.description || "An amazing movie you should watch!"}\n\n⭐ Rating: ${movie.rating}/10\n🎬 ${movie.genre} • ${movie.year}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      "Remove from My List",
      `Are you sure you want to remove "${movie.title}" from your list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            onRemove();
            Toast.show({
              type: "success",
              text1: "Removed from My List",
              text2: `${movie.title} has been removed`,
              visibilityTime: 2000,
            });
          },
        },
      ]
    );
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).springify()}
      exiting={SlideOutRight.duration(300)}
      layout={Layout.springify()}
      style={{ marginBottom: 16, paddingHorizontal: 20 }}
    >
      <AnimatedTouchable
        style={animatedStyle}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
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
          <View style={{ width: 112, height: 160 }}>
            <Image
              source={{ uri: movie.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.3)"]}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
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
                  backgroundColor: Colors.star + "30",
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
                <Ionicons name="time-outline" size={14} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{movie.duration}</Text>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textMuted }} />
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{movie.year}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push(`/player/${movie.id}`)}>
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
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 13, marginLeft: 4 }}>Play</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : theme.primary + "15",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="share-outline" size={18} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRemove}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: Colors.danger + "20",
                  alignItems: "center",
                  justifyContent: "center",
                }}
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

// Sort Options
type SortOption = "recent" | "rating" | "title";

export default function MyListScreen() {
  const { theme, isDark } = useTheme();
  const { myList, removeFromMyList, clearMyList } = useMyList();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // Sort the list
  const sortedList = [...myList].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "title":
        return a.title.localeCompare(b.title);
      case "recent":
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
  });

  const handleClearAll = () => {
    if (myList.length === 0) return;
    
    Alert.alert(
      "Clear My List",
      "Are you sure you want to remove all movies from your list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            clearMyList();
            Toast.show({
              type: "success",
              text1: "My List Cleared",
              text2: "All movies have been removed from your list",
              visibilityTime: 2000,
            });
          },
        },
      ]
    );
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
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
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
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                {myList.length} {myList.length === 1 ? "movie" : "movies"} saved
              </Text>
            </View>
          </View>
          {myList.length > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: Colors.danger + "20",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.danger} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Options */}
        {myList.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {([
                { value: "recent", label: "Recently Added" },
                { value: "rating", label: "Highest Rated" },
                { value: "title", label: "A-Z" },
              ] as { value: SortOption; label: string }[]).map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSortBy(option.value);
                  }}
                  style={{ marginRight: 12 }}
                >
                  <View style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: sortBy === option.value ? theme.primary : theme.card,
                  }}>
                    <Text style={{
                      fontWeight: "700",
                      fontSize: 13,
                      color: sortBy === option.value ? "#ffffff" : theme.textSecondary,
                    }}>
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.ScrollView>
          </Animated.View>
        )}
      </Animated.View>

      {/* List */}
      {myList.length > 0 ? (
        <FlashList
          data={sortedList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <MyListCard
              movie={item}
              index={index}
              onRemove={() => removeFromMyList(item.id)}
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
          style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}
        >
          <View style={{
            width: 96, height: 96, borderRadius: 48,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            alignItems: "center", justifyContent: "center", marginBottom: 24,
          }}>
            <Ionicons name="bookmark-outline" size={48} color={theme.textMuted} />
          </View>
          <Text style={{ color: theme.text, fontSize: 22, fontWeight: "800", marginBottom: 8 }}>
            No saved movies
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 15, textAlign: "center", lineHeight: 22 }}>
            Start adding movies to your list by tapping the bookmark icon on any movie
          </Text>
          <TouchableOpacity
            style={{ marginTop: 24 }}
            onPress={() => router.push("/")}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={{ paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16 }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>Explore Movies</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
