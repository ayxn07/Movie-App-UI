import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

// YouTube search result type
interface YouTubeVideo {
  id: string;
  title: string;
  channelName: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
}

// Sample trending videos (In production, this would come from YouTube Data API)
const TRENDING_VIDEOS: YouTubeVideo[] = [
  {
    id: "1",
    title: "Top 10 Movie Soundtracks of All Time",
    channelName: "Film Music World",
    thumbnail: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400",
    duration: "15:32",
    views: "2.4M views",
    publishedAt: "2 weeks ago",
  },
  {
    id: "2",
    title: "Best Cinematic Songs 2024 Mix",
    channelName: "Epic Music Mix",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
    duration: "1:23:45",
    views: "1.8M views",
    publishedAt: "3 days ago",
  },
  {
    id: "3",
    title: "Hans Zimmer Greatest Hits Collection",
    channelName: "Soundtrack Paradise",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    duration: "2:45:00",
    views: "5.6M views",
    publishedAt: "1 month ago",
  },
  {
    id: "4",
    title: "Relaxing Piano Movie Themes",
    channelName: "Piano Dreams",
    thumbnail: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
    duration: "58:20",
    views: "890K views",
    publishedAt: "5 days ago",
  },
  {
    id: "5",
    title: "Epic Orchestra - Best of 2024",
    channelName: "Orchestra Universe",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
    duration: "1:15:00",
    views: "1.2M views",
    publishedAt: "1 week ago",
  },
];

// Categories for quick search
const CATEGORIES = [
  { id: "movies", label: "Movie Soundtracks", icon: "film" },
  { id: "gaming", label: "Gaming Music", icon: "game-controller" },
  { id: "classical", label: "Classical", icon: "musical-notes" },
  { id: "lofi", label: "Lo-Fi Beats", icon: "headset" },
  { id: "ambient", label: "Ambient", icon: "cloudy-night" },
  { id: "workout", label: "Workout", icon: "fitness" },
];

// Recent searches (stored in state for demo, in production use AsyncStorage)
const INITIAL_RECENT_SEARCHES = [
  "Interstellar soundtrack",
  "Inception dream is collapsing",
  "Hans Zimmer Time",
  "Lord of the Rings theme",
];

// Video Card Component
const VideoCard = ({
  video,
  index,
  onPress,
  onDownload,
}: {
  video: YouTubeVideo;
  index: number;
  onPress: () => void;
  onDownload: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 16,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}
      >
        {/* Thumbnail */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: video.thumbnail }}
            style={{ width: "100%", height: 180 }}
            contentFit="cover"
          />
          {/* Duration Badge */}
          <View
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.8)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
              {video.duration}
            </Text>
          </View>
          {/* Play Icon Overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.9)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play" size={28} color="#ef4444" />
            </View>
          </View>
        </View>

        {/* Video Info */}
        <View style={{ padding: 14 }}>
          <Text
            style={{ color: theme.text, fontSize: 15, fontWeight: "700" }}
            numberOfLines={2}
          >
            {video.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {video.channelName}
            </Text>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.textMuted,
                marginHorizontal: 8,
              }}
            />
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>
              {video.views}
            </Text>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.textMuted,
                marginHorizontal: 8,
              }}
            />
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>
              {video.publishedAt}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", marginTop: 12, gap: 10 }}>
            <TouchableOpacity
              onPress={onDownload}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.primary,
                paddingVertical: 10,
                borderRadius: 10,
                gap: 6,
              }}
            >
              <Ionicons name="download-outline" size={18} color="white" />
              <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
                Download
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : theme.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="share-outline" size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : theme.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Compact Video Row Component
const CompactVideoRow = ({
  video,
  index,
  onPress,
}: {
  video: YouTubeVideo;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 60).springify()}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.5)" : theme.card,
          borderRadius: 12,
          padding: 10,
          marginBottom: 10,
        }}
      >
        {/* Thumbnail */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: video.thumbnail }}
            style={{ width: 120, height: 72, borderRadius: 8 }}
            contentFit="cover"
          />
          <View
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              backgroundColor: "rgba(0,0,0,0.8)",
              paddingHorizontal: 4,
              paddingVertical: 2,
              borderRadius: 3,
            }}
          >
            <Text style={{ color: "white", fontSize: 10, fontWeight: "600" }}>
              {video.duration}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}
            numberOfLines={2}
          >
            {video.title}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
            {video.channelName}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>
            {video.views}
          </Text>
        </View>

        {/* More Button */}
        <TouchableOpacity style={{ padding: 8 }}>
          <Ionicons name="ellipsis-vertical" size={18} color={theme.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function YouTubeSearchScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSearching(true);
    
    // Add to recent searches
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)]);
    }

    // Simulate API call - In production, use YouTube Data API
    setTimeout(() => {
      // Filter/mock search results based on query
      const results = TRENDING_VIDEOS.map((video, index) => ({
        ...video,
        id: `search_${index}`,
        title: `${searchQuery} - ${video.title}`,
      }));
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  }, [searchQuery, recentSearches]);

  const handleVideoPress = useCallback((video: YouTubeVideo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showToast(`Opening: ${video.title}`, "info");
    // In production, this would open YouTube or an in-app player
    Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`);
  }, [showToast]);

  const handleDownload = useCallback((video: YouTubeVideo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast(
      "Download feature requires a backend service. Opening YouTube instead...",
      "info"
    );
    // Note: Direct downloading from YouTube violates their ToS
    // This would need a proper backend implementation with proper licensing
    Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`);
  }, [showToast]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveCategory(categoryId);
    setSearchQuery(CATEGORIES.find((c) => c.id === categoryId)?.label || "");
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setActiveCategory(null);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <LinearGradient
        colors={
          isDark
            ? ["#1e1b4b", "#0f172a", "#020617"]
            : ["#f8fafc", "#f1f5f9", "#e2e8f0"]
        }
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.springify()}
          style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 8 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="logo-youtube" size={28} color="#ef4444" />
                <Text style={{ color: theme.text, fontSize: 26, fontWeight: "900" }}>
                  YouTube Search
                </Text>
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                Find songs and videos to download
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
              borderRadius: 16,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: isDark ? "rgba(255,255,255,0.1)" : theme.border,
            }}
          >
            <Ionicons name="search" size={22} color={theme.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for songs, soundtracks..."
              placeholderTextColor={theme.textMuted}
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 12,
                fontSize: 16,
                color: theme.text,
              }}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={22} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Button */}
          <TouchableOpacity
            onPress={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            style={{
              marginTop: 12,
              backgroundColor: searchQuery.trim() ? Colors.primary : theme.textMuted,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 8,
              opacity: searchQuery.trim() ? 1 : 0.5,
            }}
          >
            {isSearching ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="search" size={20} color="white" />
                <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                  Search YouTube
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeIn.delay(100)} style={{ marginTop: 16 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor:
                    activeCategory === category.id
                      ? Colors.primary
                      : isDark
                      ? "rgba(30, 41, 59, 0.6)"
                      : theme.card,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  gap: 8,
                }}
              >
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={activeCategory === category.id ? "white" : Colors.primary}
                />
                <Text
                  style={{
                    color: activeCategory === category.id ? "white" : theme.text,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Animated.View entering={FadeInUp.delay(200)} style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", flex: 1 }}>
                Search Results
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>
                {searchResults.length} videos
              </Text>
            </View>

            {searchResults.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onPress={() => handleVideoPress(video)}
                onDownload={() => handleDownload(video)}
              />
            ))}
          </Animated.View>
        )}

        {/* Recent Searches */}
        {searchResults.length === 0 && (
          <Animated.View entering={FadeIn.delay(200)} style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
              <Text
                style={{
                  color: theme.text,
                  fontSize: 18,
                  fontWeight: "700",
                  marginLeft: 8,
                }}
              >
                Recent Searches
              </Text>
            </View>

            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSearchQuery(search);
                  handleSearch();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? "rgba(255,255,255,0.05)" : theme.border,
                }}
              >
                <Ionicons name="search-outline" size={18} color={theme.textMuted} />
                <Text style={{ color: theme.text, fontSize: 15, marginLeft: 12, flex: 1 }}>
                  {search}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setRecentSearches((prev) => prev.filter((s) => s !== search));
                  }}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="close" size={18} color={theme.textMuted} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Trending Videos */}
        {searchResults.length === 0 && (
          <Animated.View entering={FadeInUp.delay(300)} style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Ionicons name="flame" size={22} color={Colors.secondary} />
              <Text
                style={{
                  color: theme.text,
                  fontSize: 20,
                  fontWeight: "800",
                  marginLeft: 8,
                }}
              >
                Trending Music Videos
              </Text>
            </View>

            {TRENDING_VIDEOS.map((video, index) => (
              <CompactVideoRow
                key={video.id}
                video={video}
                index={index}
                onPress={() => handleVideoPress(video)}
              />
            ))}
          </Animated.View>
        )}

        {/* Info Banner */}
        <Animated.View
          entering={FadeIn.delay(400)}
          style={{
            marginHorizontal: 20,
            marginTop: 24,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: isDark ? "rgba(255,255,255,0.05)" : theme.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: `${Colors.accent}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="information-circle" size={24} color={Colors.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 15 }}>
                About Downloads
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4, lineHeight: 20 }}>
                Direct YouTube downloads require a backend service due to platform restrictions. 
                This feature will open YouTube where you can use their official tools or 
                third-party services for downloading content legally.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
