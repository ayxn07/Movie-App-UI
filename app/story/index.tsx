import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useCallback } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import { Colors, MOVIES, TRENDING, TOP_RATED } from "@/constants/data";
import { SONGS, ARTISTS, PLAYLISTS } from "@/constants/musicData";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");
const STORY_HEIGHT = height;

// Story Item Type
interface StoryItem {
  id: string;
  type: "movie" | "song" | "artist" | "promo";
  title: string;
  subtitle: string;
  image: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  username: string;
  userImage: string;
  isVerified: boolean;
  itemId?: string | number;
  duration?: string;
}

// Generate story items
const generateStories = (): StoryItem[] => {
  const stories: StoryItem[] = [];

  // Add movie stories
  [...MOVIES, ...TRENDING, ...TOP_RATED].slice(0, 5).forEach((movie) => {
    stories.push({
      id: `movie-${movie.id}`,
      type: "movie",
      title: movie.title,
      subtitle: `${movie.genre} • ${movie.year}`,
      image: movie.image,
      description: movie.description || "Experience the magic of cinema",
      likes: Math.floor(Math.random() * 500000) + 50000,
      comments: Math.floor(Math.random() * 10000) + 1000,
      shares: Math.floor(Math.random() * 5000) + 500,
      username: "MoviesHub",
      userImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100",
      isVerified: true,
      itemId: movie.id,
      duration: movie.duration,
    });
  });

  // Add song stories
  SONGS.slice(0, 4).forEach((song) => {
    stories.push({
      id: `song-${song.id}`,
      type: "song",
      title: song.title,
      subtitle: song.artist,
      image: song.cover,
      description: `Now playing • ${song.album}`,
      likes: parseInt(song.plays.replace(/[^0-9]/g, "")) * 1000 || 100000,
      comments: Math.floor(Math.random() * 5000) + 500,
      shares: Math.floor(Math.random() * 2000) + 200,
      username: song.artist,
      userImage: ARTISTS.find((a) => a.id === song.artistId)?.image || song.cover,
      isVerified: true,
      itemId: song.id,
    });
  });

  // Shuffle stories
  return stories.sort(() => Math.random() - 0.5);
};

// Story Card Component
const StoryCard = ({
  item,
  isActive,
  onLike,
  onComment,
  onShare,
  onPress,
}: {
  item: StoryItem;
  isActive: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onPress: () => void;
}) => {
  const { theme } = useTheme();
  const { showToast } = useApp();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const likeScale = useSharedValue(1);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLiked(!isLiked);
    likeScale.value = withSpring(1.3, {}, () => {
      likeScale.value = withSpring(1);
    });
    onLike();
  };

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const handleOpenContent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (item.type === "movie" && item.itemId) {
      router.push(`/movie/${item.itemId}`);
    } else if (item.type === "song" && item.itemId) {
      router.push(`/musicplayer/${item.itemId}`);
    }
  };

  return (
    <View style={{ width, height: STORY_HEIGHT, backgroundColor: "#000" }}>
      {/* Background Image */}
      <Image
        source={{ uri: item.image }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        contentFit="cover"
      />

      {/* Gradient Overlays */}
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 150,
        }}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 400,
        }}
      />

      {/* Progress Bar */}
      {isActive && (
        <View style={{ position: "absolute", top: 50, left: 10, right: 10 }}>
          <View
            style={{
              height: 3,
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Animated.View
              entering={FadeIn}
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "white",
              }}
            />
          </View>
        </View>
      )}

      {/* Header */}
      <View
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Image
            source={{ uri: item.userImage }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "white",
            }}
            contentFit="cover"
          />
          <View style={{ marginLeft: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "white", fontWeight: "700", fontSize: 14 }}>
                {item.username}
              </Text>
              {item.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color="#1d9bf0" style={{ marginLeft: 4 }} />
              )}
            </View>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
              {item.subtitle}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content Type Badge */}
      <View
        style={{
          position: "absolute",
          top: 130,
          left: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: item.type === "movie" ? `${Colors.primary}dd` : `${Colors.secondary}dd`,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Ionicons
            name={item.type === "movie" ? "film" : "musical-note"}
            size={14}
            color="white"
          />
          <Text style={{ color: "white", fontSize: 11, fontWeight: "700", marginLeft: 6, textTransform: "uppercase" }}>
            {item.type}
          </Text>
          {item.duration && (
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, marginLeft: 8 }}>
              {item.duration}
            </Text>
          )}
        </View>
      </View>

      {/* Center Play Button */}
      <TouchableOpacity
        onPress={handleOpenContent}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: -35,
          marginTop: -35,
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: "rgba(255,255,255,0.2)",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: "rgba(255,255,255,0.5)",
        }}
      >
        <Ionicons name="play" size={35} color="white" style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      {/* Right Actions */}
      <View
        style={{
          position: "absolute",
          right: 16,
          bottom: 200,
          alignItems: "center",
        }}
      >
        {/* Like */}
        <TouchableOpacity onPress={handleLike} style={{ alignItems: "center", marginBottom: 20 }}>
          <Animated.View style={likeAnimatedStyle}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={32}
              color={isLiked ? Colors.danger : "white"}
            />
          </Animated.View>
          <Text style={{ color: "white", fontSize: 12, marginTop: 4 }}>
            {formatNumber(item.likes + (isLiked ? 1 : 0))}
          </Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onComment();
          }}
          style={{ alignItems: "center", marginBottom: 20 }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={30} color="white" />
          <Text style={{ color: "white", fontSize: 12, marginTop: 4 }}>
            {formatNumber(item.comments)}
          </Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onShare();
          }}
          style={{ alignItems: "center", marginBottom: 20 }}
        >
          <Ionicons name="paper-plane-outline" size={28} color="white" />
          <Text style={{ color: "white", fontSize: 12, marginTop: 4 }}>
            {formatNumber(item.shares)}
          </Text>
        </TouchableOpacity>

        {/* Save */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsSaved(!isSaved);
            showToast(isSaved ? "Removed from saved" : "Saved", "success");
          }}
          style={{ alignItems: "center" }}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={28}
            color={isSaved ? Colors.accent : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Content */}
      <View
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 70,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: "white", fontSize: 22, fontWeight: "900", marginBottom: 8 }}>
          {item.title}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 20 }} numberOfLines={3}>
          {item.description}
        </Text>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleOpenContent}
          style={{ marginTop: 16 }}
        >
          <LinearGradient
            colors={item.type === "movie" ? [Colors.primary, Colors.primaryDark] : [Colors.secondary, "#db2777"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 30,
              alignSelf: "flex-start",
            }}
          >
            <Ionicons name={item.type === "movie" ? "play" : "musical-note"} size={18} color="white" />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 14, marginLeft: 8 }}>
              {item.type === "movie" ? "Watch Now" : "Play Song"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function StoryModeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const stories = generateStories();

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderItem = ({ item, index }: { item: StoryItem; index: number }) => (
    <StoryCard
      item={item}
      isActive={index === activeIndex}
      onLike={() => {}}
      onComment={() => showToast("Comments", "info")}
      onShare={() => showToast("Share link copied!", "success")}
      onPress={() => {}}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />

      {/* Close Button */}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.back();
        }}
        style={{
          position: "absolute",
          top: 56,
          left: 16,
          zIndex: 100,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="close" size={26} color="white" />
      </TouchableOpacity>

      {/* Stories List */}
      <FlatList
        ref={flatListRef}
        data={stories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={STORY_HEIGHT}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: STORY_HEIGHT,
          offset: STORY_HEIGHT * index,
          index,
        })}
      />

      {/* Indicator */}
      <View
        style={{
          position: "absolute",
          top: 56,
          right: 16,
          backgroundColor: "rgba(0,0,0,0.5)",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
          {activeIndex + 1} / {stories.length}
        </Text>
      </View>
    </View>
  );
}
