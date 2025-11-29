import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors, MOVIES, TRENDING, ALL_MOVIES } from "@/constants/data";
import { SONGS, PLAYLISTS, ARTISTS, PODCASTS } from "@/constants/musicData";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Story Circle Component
const StoryCircle = ({
  item,
  index,
  onPress,
}: {
  item: { id: string; name: string; image: string; hasNew: boolean };
  index: number;
  onPress: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{ alignItems: "center", marginRight: 16 }}
      >
        <LinearGradient
          colors={item.hasNew ? [Colors.secondary, Colors.primary, "#f59e0b"] : ["transparent", "transparent"]}
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            padding: 3,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 33,
              backgroundColor: theme.background,
              padding: 2,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: "100%", height: "100%", borderRadius: 31 }}
              contentFit="cover"
            />
          </View>
        </LinearGradient>
        <Text style={{ color: theme.text, fontSize: 11, marginTop: 6, fontWeight: "500" }} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Feed Card Types
type FeedItem = {
  id: string;
  type: "movie_clip" | "song" | "podcast" | "artist" | "playlist" | "mixed";
  title: string;
  subtitle: string;
  image: string;
  likes: string;
  comments: string;
  shares: string;
  itemId?: string | number;
};

// Generate feed items
const generateFeedItems = (): FeedItem[] => {
  const items: FeedItem[] = [];
  
  // Add movie clips
  MOVIES.slice(0, 3).forEach((movie, i) => {
    items.push({
      id: `movie-${movie.id}`,
      type: "movie_clip",
      title: `${movie.title} - Official Clip`,
      subtitle: `${movie.genre} • ${movie.year}`,
      image: movie.image,
      likes: `${Math.floor(Math.random() * 100) + 10}K`,
      comments: `${Math.floor(Math.random() * 50) + 5}K`,
      shares: `${Math.floor(Math.random() * 20) + 1}K`,
      itemId: movie.id,
    });
  });

  // Add songs
  SONGS.slice(0, 4).forEach((song) => {
    items.push({
      id: `song-${song.id}`,
      type: "song",
      title: song.title,
      subtitle: `${song.artist} • ${song.album}`,
      image: song.cover,
      likes: song.plays,
      comments: `${Math.floor(Math.random() * 30) + 5}K`,
      shares: `${Math.floor(Math.random() * 10) + 1}K`,
      itemId: song.id,
    });
  });

  // Add podcasts
  PODCASTS.slice(0, 2).forEach((podcast) => {
    items.push({
      id: `podcast-${podcast.id}`,
      type: "podcast",
      title: podcast.title,
      subtitle: `${podcast.host} • ${podcast.category}`,
      image: podcast.cover,
      likes: podcast.followers,
      comments: `${Math.floor(Math.random() * 10) + 1}K`,
      shares: `${Math.floor(Math.random() * 5)}K`,
      itemId: podcast.id,
    });
  });

  // Shuffle and return
  return items.sort(() => Math.random() - 0.5);
};

// Feed Card Component
const FeedCard = ({
  item,
  index,
  onPress,
}: {
  item: FeedItem;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const { showToast } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getTypeIcon = () => {
    switch (item.type) {
      case "movie_clip":
        return "film";
      case "song":
        return "musical-note";
      case "podcast":
        return "mic";
      case "artist":
        return "person";
      case "playlist":
        return "list";
      default:
        return "sparkles";
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case "movie_clip":
        return Colors.primary;
      case "song":
        return Colors.secondary;
      case "podcast":
        return Colors.accent;
      case "artist":
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100).springify()}
      style={[{ marginBottom: 20, marginHorizontal: 20 }, animatedStyle]}
    >
      <TouchableOpacity
        onPress={() => {
          scale.value = withSpring(0.98);
          setTimeout(() => {
            scale.value = withSpring(1);
          }, 100);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={0.95}
      >
        <View
          style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          {/* Image */}
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: item.image }}
              style={{ width: "100%", aspectRatio: 16 / 10 }}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
              }}
            />
            {/* Type Badge */}
            <View
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: `${getTypeColor()}dd`,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Ionicons name={getTypeIcon() as any} size={14} color="white" />
              <Text style={{ color: "white", fontSize: 11, fontWeight: "700", marginLeft: 6, textTransform: "uppercase" }}>
                {item.type.replace("_", " ")}
              </Text>
            </View>
            {/* Play Button */}
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                onPress();
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginLeft: -28,
                marginTop: -28,
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.95)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play" size={28} color={getTypeColor()} style={{ marginLeft: 3 }} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={{ padding: 16 }}>
            <Text style={{ color: theme.text, fontSize: 17, fontWeight: "700" }} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
              {item.subtitle}
            </Text>

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: theme.border,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setIsLiked(!isLiked);
                }}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={22}
                  color={isLiked ? Colors.danger : theme.textSecondary}
                />
                <Text style={{ color: theme.textSecondary, marginLeft: 6, fontSize: 13 }}>{item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  showToast("Comments", "info");
                }}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons name="chatbubble-outline" size={20} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary, marginLeft: 6, fontSize: 13 }}>{item.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  showToast("Share link copied!", "success");
                }}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons name="share-outline" size={20} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary, marginLeft: 6, fontSize: 13 }}>{item.shares}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsSaved(!isSaved);
                  showToast(isSaved ? "Removed from saved" : "Saved", "success");
                }}
              >
                <Ionicons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isSaved ? theme.primary : theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Quick Access Card
const QuickAccessCard = ({
  icon,
  title,
  subtitle,
  color,
  index,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{
          width: 140,
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 20,
          padding: 16,
          marginRight: 12,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: `${color}20`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <Text style={{ color: theme.text, fontSize: 14, fontWeight: "700" }}>{title}</Text>
        <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}>{subtitle}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function DiscoverScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");

  const feedItems = generateFeedItems();

  // Stories data
  const stories = [
    { id: "1", name: "Your Story", image: "https://randomuser.me/api/portraits/men/32.jpg", hasNew: false },
    ...ARTISTS.slice(0, 5).map((artist) => ({
      id: artist.id,
      name: artist.name.split(" ")[0],
      image: artist.image,
      hasNew: Math.random() > 0.5,
    })),
  ];

  const filters = [
    { id: "all", name: "For You" },
    { id: "movies", name: "Movies" },
    { id: "music", name: "Music" },
    { id: "podcasts", name: "Podcasts" },
    { id: "live", name: "Live" },
  ];

  const quickAccess = [
    { icon: "sparkles", title: "AI Mix", subtitle: "Personalized", color: Colors.primary },
    { icon: "flame", title: "Trending", subtitle: "Hot right now", color: Colors.danger },
    { icon: "musical-notes", title: "New Music", subtitle: "Fresh releases", color: Colors.secondary },
    { icon: "film", title: "New Movies", subtitle: "Just added", color: Colors.accent },
  ];

  const handleFeedItemPress = (item: FeedItem) => {
    switch (item.type) {
      case "movie_clip":
        router.push(`/movie/${item.itemId}`);
        break;
      case "song":
        router.push(`/musicplayer/${item.itemId}`);
        break;
      case "podcast":
        router.push(`/podcasts/${item.itemId}`);
        break;
      default:
        showToast("Opening content...", "info");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.springify()}
          style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 14, fontWeight: "500" }}>
                Discover
              </Text>
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900", marginTop: 4 }}>
                Explore
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/notifications");
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="notifications-outline" size={22} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/story");
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="layers-outline" size={22} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Stories */}
        <Animated.View entering={FadeIn.delay(100)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          >
            {stories.map((story, index) => (
              <StoryCircle
                key={story.id}
                item={story}
                index={index}
                onPress={() => router.push("/story")}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Filters */}
        <Animated.View entering={FadeIn.delay(150)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 10 }}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveFilter(filter.id);
                }}
                style={{
                  backgroundColor: activeFilter === filter.id
                    ? theme.primary
                    : isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: activeFilter === filter.id ? "white" : theme.text,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Access */}
        <Animated.View entering={FadeIn.delay(200)} style={{ marginBottom: 24 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {quickAccess.map((item, index) => (
              <QuickAccessCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                color={item.color}
                index={index}
                onPress={() => {
                  if (item.title === "AI Mix") {
                    router.push("/recommendations");
                  } else {
                    showToast(`Opening ${item.title}`, "info");
                  }
                }}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Banner */}
        <Animated.View entering={FadeInDown.delay(250).springify()} style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/watchparty");
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#8b5cf6", "#6366f1", "#4f46e5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 24,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <Ionicons name="people" size={18} color="white" />
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "700", marginLeft: 6 }}>
                    WATCH PARTY
                  </Text>
                </View>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "800" }}>
                  Watch Together
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>
                  Invite friends to watch movies in sync
                </Text>
              </View>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="arrow-forward" size={28} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Feed */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 }}>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>
              Your Feed
            </Text>
            <TouchableOpacity>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>Refresh</Text>
            </TouchableOpacity>
          </View>
          {feedItems.map((item, index) => (
            <FeedCard
              key={item.id}
              item={item}
              index={index}
              onPress={() => handleFeedItemPress(item)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
