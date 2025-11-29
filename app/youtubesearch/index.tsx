import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  SlideInDown,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

// YouTube video interface
interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
  description: string;
}

// Sample trending videos (in production, these would come from YouTube API)
const TRENDING_VIDEOS: YouTubeVideo[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up",
    channelTitle: "Rick Astley",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    duration: "3:33",
    viewCount: "1.4B views",
    publishedAt: "14 years ago",
    description: "Official music video for Rick Astley's Never Gonna Give You Up",
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    channelTitle: "Luis Fonsi",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    duration: "4:41",
    viewCount: "8.2B views",
    publishedAt: "7 years ago",
    description: "Despacito official music video",
  },
  {
    id: "RgKAFK5djSk",
    title: "Wiz Khalifa - See You Again ft. Charlie Puth",
    channelTitle: "Wiz Khalifa",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    duration: "3:58",
    viewCount: "5.9B views",
    publishedAt: "9 years ago",
    description: "See You Again official music video",
  },
  {
    id: "JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You",
    channelTitle: "Ed Sheeran",
    thumbnail: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
    duration: "4:23",
    viewCount: "6.0B views",
    publishedAt: "7 years ago",
    description: "Shape of You official music video",
  },
  {
    id: "09R8_2nJtjg",
    title: "Maroon 5 - Sugar",
    channelTitle: "Maroon 5",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    duration: "5:01",
    viewCount: "3.7B views",
    publishedAt: "9 years ago",
    description: "Sugar official music video",
  },
];

// Search categories
const SEARCH_CATEGORIES = [
  { id: "music", label: "Music", icon: "musical-notes", color: "#ec4899" },
  { id: "videos", label: "Videos", icon: "videocam", color: "#8b5cf6" },
  { id: "podcasts", label: "Podcasts", icon: "mic", color: "#06b6d4" },
  { id: "live", label: "Live", icon: "radio", color: "#ef4444" },
];

// Recent searches
const RECENT_SEARCHES = [
  "lofi hip hop beats",
  "workout motivation music",
  "jazz relaxing music",
  "movie soundtracks 2024",
  "study music concentration",
];

// Video Item Component
const VideoItem = ({
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
          flexDirection: "row",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 16,
          padding: 12,
          marginBottom: 12,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}
      >
        {/* Thumbnail */}
        <View
          style={{
            width: 140,
            height: 80,
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
          }}
        >
          <Image
            source={{ uri: video.thumbnail }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          {/* Duration badge */}
          <View
            style={{
              position: "absolute",
              bottom: 6,
              right: 6,
              backgroundColor: "rgba(0,0,0,0.8)",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "white", fontSize: 11, fontWeight: "600" }}>{video.duration}</Text>
          </View>
          {/* Play icon overlay */}
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
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play" size={18} color="white" />
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={{ flex: 1, marginLeft: 12, justifyContent: "space-between" }}>
          <View>
            <Text
              style={{ color: theme.text, fontWeight: "600", fontSize: 14, lineHeight: 18 }}
              numberOfLines={2}
            >
              {video.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }} numberOfLines={1}>
              {video.channelTitle}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ color: theme.textMuted, fontSize: 11 }}>
              {video.viewCount} • {video.publishedAt}
            </Text>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onDownload();
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: `${Colors.primary}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="download-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Large Video Card Component
const LargeVideoCard = ({
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
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          marginBottom: 20,
        }}
      >
        {/* Thumbnail */}
        <View
          style={{
            width: "100%",
            aspectRatio: 16 / 9,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
          }}
        >
          <Image
            source={{ uri: video.thumbnail }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          {/* Duration badge */}
          <View
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              backgroundColor: "rgba(0,0,0,0.8)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>{video.duration}</Text>
          </View>
          {/* Play icon overlay */}
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
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play" size={28} color="white" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          {/* Channel Avatar */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${Colors.primary}30`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="person" size={20} color={Colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 15 }} numberOfLines={2}>
              {video.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
              {video.channelTitle} • {video.viewCount} • {video.publishedAt}
            </Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onDownload();
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${Colors.primary}20`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="download-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Download Info Modal
const DownloadInfoModal = ({
  visible,
  video,
  onClose,
}: {
  visible: boolean;
  video: YouTubeVideo | null;
  onClose: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const { showToast } = useApp();

  const handleOpenInYouTube = () => {
    if (video) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`);
    }
  };

  const handleCopyLink = () => {
    if (video) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      showToast("Link copied to clipboard!", "success");
    }
  };

  if (!video) return null;

  return (
    <View
      style={{
        display: visible ? "flex" : "none",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 100,
      }}
    >
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      <Animated.View
        entering={SlideInDown.springify().damping(20)}
        style={{
          backgroundColor: theme.background,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingTop: 20,
          paddingBottom: 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Handle Bar */}
        <View
          style={{
            alignSelf: "center",
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.textMuted,
            marginBottom: 24,
          }}
        />

        {/* Video Preview */}
        <View style={{ flexDirection: "row", marginBottom: 24 }}>
          <Image
            source={{ uri: video.thumbnail }}
            style={{ width: 120, height: 68, borderRadius: 12 }}
            contentFit="cover"
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 15 }} numberOfLines={2}>
              {video.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
              {video.channelTitle}
            </Text>
          </View>
        </View>

        {/* Info Message */}
        <View
          style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : "#fef3c7",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <Ionicons
            name="information-circle"
            size={24}
            color={isDark ? Colors.primary : "#d97706"}
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14, marginBottom: 4 }}>
              About Downloading
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18 }}>
              Due to YouTube{"'"}s terms of service, direct downloads are not supported in-app.
              You can use external tools like y2mate.com, savefrom.net, or the official YouTube
              Premium for offline viewing.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          onPress={handleOpenInYouTube}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FF0000",
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <Ionicons name="logo-youtube" size={24} color="white" />
          <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 12, flex: 1 }}>
            Open in YouTube
          </Text>
          <Ionicons name="open-outline" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCopyLink}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <Ionicons name="link" size={24} color={theme.text} />
          <Text style={{ color: theme.text, fontWeight: "600", fontSize: 16, marginLeft: 12, flex: 1 }}>
            Copy Video Link
          </Text>
          <Ionicons name="copy-outline" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Linking.openURL("https://y2mate.com");
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <Ionicons name="download" size={24} color={Colors.primary} />
          <Text style={{ color: theme.text, fontWeight: "600", fontSize: 16, marginLeft: 12, flex: 1 }}>
            Open Download Tool (y2mate)
          </Text>
          <Ionicons name="open-outline" size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default function YouTubeSearchScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  useApp(); // Used for toast context in DownloadInfoModal

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSearching(true);
    setHasSearched(true);

    // Simulate search (in production, use YouTube Data API)
    setTimeout(() => {
      // Filter trending videos based on search query (demo)
      const results = TRENDING_VIDEOS.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // If no exact matches, show all trending as "related"
      setSearchResults(results.length > 0 ? results : TRENDING_VIDEOS);
      setIsSearching(false);
    }, 800);
  }, [searchQuery]);

  const handleVideoPress = (video: YouTubeVideo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`);
  };

  const handleDownload = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setShowDownloadModal(true);
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      setSearchResults(TRENDING_VIDEOS);
      setIsSearching(false);
    }, 500);
  };

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
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>
                YouTube Search
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                Search and discover music & videos
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
              borderRadius: 16,
              paddingHorizontal: 16,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <Ionicons name="search" size={22} color={theme.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              placeholder="Search songs, videos, artists..."
              placeholderTextColor={theme.textMuted}
              returnKeyType="search"
              style={{
                flex: 1,
                color: theme.text,
                fontSize: 16,
                paddingVertical: 14,
                paddingHorizontal: 12,
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setHasSearched(false);
                  setSearchResults([]);
                }}
              >
                <Ionicons name="close-circle" size={22} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeIn.delay(100)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, gap: 10 }}
          >
            {SEARCH_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveCategory(activeCategory === category.id ? null : category.id);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor:
                    activeCategory === category.id
                      ? category.color
                      : isDark
                      ? "rgba(30, 41, 59, 0.6)"
                      : theme.card,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  gap: 6,
                }}
              >
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={activeCategory === category.id ? "white" : category.color}
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

        {/* Content */}
        {!hasSearched ? (
          // Initial State - Recent Searches & Trending
          <>
            {/* Recent Searches */}
            <Animated.View entering={FadeInUp.delay(200)} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800", marginBottom: 12 }}>
                Recent Searches
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {RECENT_SEARCHES.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRecentSearch(search)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 20,
                      gap: 6,
                    }}
                  >
                    <Ionicons name="time-outline" size={14} color={theme.textMuted} />
                    <Text style={{ color: theme.text, fontSize: 13 }}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

            {/* Trending Now */}
            <Animated.View entering={FadeInUp.delay(300)}>
              <View
                style={{
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Ionicons name="trending-up" size={22} color={Colors.primary} />
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800", marginLeft: 8 }}>
                  Trending Now
                </Text>
              </View>

              <View style={{ paddingHorizontal: 20 }}>
                {TRENDING_VIDEOS.slice(0, 3).map((video, index) => (
                  <LargeVideoCard
                    key={video.id}
                    video={video}
                    index={index}
                    onPress={() => handleVideoPress(video)}
                    onDownload={() => handleDownload(video)}
                  />
                ))}
              </View>
            </Animated.View>
          </>
        ) : (
          // Search Results
          <View style={{ paddingHorizontal: 20 }}>
            {isSearching ? (
              // Loading State
              <View style={{ alignItems: "center", paddingVertical: 60 }}>
                <Ionicons name="search" size={48} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16 }}>
                  Searching...
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              // Results
              <>
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 16 }}>
                  {searchResults.length} results for {"\""}{searchQuery}{"\""}
                </Text>
                {searchResults.map((video, index) => (
                  <VideoItem
                    key={video.id}
                    video={video}
                    index={index}
                    onPress={() => handleVideoPress(video)}
                    onDownload={() => handleDownload(video)}
                  />
                ))}
              </>
            ) : (
              // No Results
              <View style={{ alignItems: "center", paddingVertical: 60 }}>
                <Ionicons name="search-outline" size={64} color={theme.textMuted} />
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginTop: 16 }}>
                  No results found
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8, textAlign: "center" }}>
                  Try different keywords or check your spelling
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Download Info Modal */}
      <DownloadInfoModal
        visible={showDownloadModal}
        video={selectedVideo}
        onClose={() => {
          setShowDownloadModal(false);
          setSelectedVideo(null);
        }}
      />
    </View>
  );
}
