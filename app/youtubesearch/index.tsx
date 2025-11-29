import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
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
  Modal,
  ActivityIndicator,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

// Sample YouTube search results (simulated API response)
interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  isMusic: boolean;
}

// Mock search results for demonstration
const MOCK_RESULTS: Record<string, YouTubeVideo[]> = {
  "trending music": [
    {
      id: "1",
      title: "Blinding Lights - The Weeknd (Official Music Video)",
      channel: "The Weeknd",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      duration: "4:22",
      views: "2.4B views",
      publishedAt: "3 years ago",
      isMusic: true,
    },
    {
      id: "2",
      title: "Levitating - Dua Lipa ft. DaBaby (Official Lyrics Video)",
      channel: "Dua Lipa",
      thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
      duration: "3:23",
      views: "1.8B views",
      publishedAt: "2 years ago",
      isMusic: true,
    },
    {
      id: "3",
      title: "Stay - The Kid LAROI with Justin Bieber (Official Video)",
      channel: "The Kid LAROI",
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
      duration: "2:21",
      views: "1.5B views",
      publishedAt: "2 years ago",
      isMusic: true,
    },
    {
      id: "4",
      title: "Save Your Tears (Remix) ft. Ariana Grande",
      channel: "The Weeknd",
      thumbnail: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
      duration: "3:35",
      views: "900M views",
      publishedAt: "2 years ago",
      isMusic: true,
    },
  ],
  "movie trailers": [
    {
      id: "5",
      title: "Dune: Part Two - Official Trailer",
      channel: "Warner Bros. Pictures",
      thumbnail: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400",
      duration: "3:05",
      views: "45M views",
      publishedAt: "8 months ago",
      isMusic: false,
    },
    {
      id: "6",
      title: "Deadpool & Wolverine - Official Trailer",
      channel: "Marvel Entertainment",
      thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
      duration: "2:32",
      views: "120M views",
      publishedAt: "5 months ago",
      isMusic: false,
    },
    {
      id: "7",
      title: "Oppenheimer - Final Trailer",
      channel: "Universal Pictures",
      thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      duration: "2:58",
      views: "80M views",
      publishedAt: "1 year ago",
      isMusic: false,
    },
  ],
  "lofi beats": [
    {
      id: "8",
      title: "lofi hip hop radio 📚 - beats to relax/study to",
      channel: "Lofi Girl",
      thumbnail: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400",
      duration: "LIVE",
      views: "1.2M watching",
      publishedAt: "Started streaming",
      isMusic: true,
    },
    {
      id: "9",
      title: "peaceful piano & soft rain - 3 hour ambient study music",
      channel: "Relaxing Music",
      thumbnail: "https://images.unsplash.com/photo-1598387180437-68e7ef823f29?w=400",
      duration: "3:00:00",
      views: "50M views",
      publishedAt: "1 year ago",
      isMusic: true,
    },
  ],
};

// Popular search suggestions
const SUGGESTIONS = [
  { icon: "musical-notes", text: "Trending music", query: "trending music" },
  { icon: "film", text: "Movie trailers", query: "movie trailers" },
  { icon: "headset", text: "Lofi beats", query: "lofi beats" },
  { icon: "mic", text: "Podcasts", query: "podcasts" },
  { icon: "sparkles", text: "Music videos", query: "music videos" },
  { icon: "flame", text: "Viral songs", query: "viral songs" },
];

// Recent searches
const RECENT_SEARCHES = [
  "The Weeknd Blinding Lights",
  "Taylor Swift Lover",
  "Ed Sheeran Perfect",
  "Post Malone Circles",
];

// Download Quality Modal
const DownloadModal = ({
  visible,
  video,
  onClose,
  onDownload,
}: {
  visible: boolean;
  video: YouTubeVideo | null;
  onClose: () => void;
  onDownload: (quality: string, format: string) => void;
}) => {
  const { theme, isDark } = useTheme();
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [selectedFormat, setSelectedFormat] = useState(video?.isMusic ? "audio" : "video");

  // Define audio and video qualities separately
  const audioQualities = [
    { id: "320kbps", label: "320 kbps", size: "~8 MB", badge: "BEST" as const },
    { id: "256kbps", label: "256 kbps", size: "~6 MB", badge: null },
    { id: "128kbps", label: "128 kbps", size: "~3 MB", badge: null },
  ];

  const videoQualities = [
    { id: "1080p", label: "Full HD (1080p)", size: "~150 MB", badge: "BEST" as const },
    { id: "720p", label: "HD (720p)", size: "~80 MB", badge: "RECOMMENDED" as const },
    { id: "480p", label: "SD (480p)", size: "~40 MB", badge: null },
    { id: "360p", label: "Low (360p)", size: "~20 MB", badge: null },
  ];

  // Select qualities based on current format
  const displayQualities = selectedFormat === "audio" ? audioQualities : videoQualities;

  if (!video) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
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

          <Text
            style={{
              color: theme.text,
              fontSize: 22,
              fontWeight: "800",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Download Options
          </Text>

          {/* Video Preview */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 16,
              padding: 12,
              marginBottom: 20,
            }}
          >
            <Image
              source={{ uri: video.thumbnail }}
              style={{ width: 80, height: 60, borderRadius: 8 }}
              contentFit="cover"
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{ color: theme.text, fontWeight: "600", fontSize: 14 }}
                numberOfLines={2}
              >
                {video.title}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                {video.channel} • {video.duration}
              </Text>
            </View>
          </View>

          {/* Format Toggle */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 16,
              padding: 4,
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedFormat("video");
                setSelectedQuality("720p");
              }}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: selectedFormat === "video" ? theme.primary : "transparent",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="videocam"
                size={20}
                color={selectedFormat === "video" ? "white" : theme.textMuted}
              />
              <Text
                style={{
                  color: selectedFormat === "video" ? "white" : theme.textMuted,
                  fontWeight: "600",
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedFormat("audio");
                setSelectedQuality("320kbps");
              }}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: selectedFormat === "audio" ? Colors.secondary : "transparent",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="musical-notes"
                size={20}
                color={selectedFormat === "audio" ? "white" : theme.textMuted}
              />
              <Text
                style={{
                  color: selectedFormat === "audio" ? "white" : theme.textMuted,
                  fontWeight: "600",
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                Audio Only
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quality Selection */}
          <Text style={{ color: theme.textSecondary, fontWeight: "600", marginBottom: 12 }}>
            Select Quality
          </Text>
          <View
            style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            {displayQualities.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedQuality(option.id);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: index < displayQualities.length - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                  backgroundColor:
                    selectedQuality === option.id ? `${theme.primary}10` : "transparent",
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor: selectedQuality === option.id ? theme.primary : theme.textMuted,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  {selectedQuality === option.id && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: theme.primary,
                      }}
                    />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15 }}>
                      {option.label}
                    </Text>
                    {option.badge && (
                      <View
                        style={{
                          backgroundColor:
                            option.badge === "BEST" ? Colors.success : theme.primary,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>
                          {option.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                    {option.size}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Download Button */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              onDownload(selectedQuality, selectedFormat);
            }}
          >
            <LinearGradient
              colors={
                selectedFormat === "audio"
                  ? [Colors.secondary, "#db2777"]
                  : [Colors.primary, Colors.primaryDark]
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 18,
                borderRadius: 16,
                gap: 10,
              }}
            >
              <Ionicons name="download" size={24} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>
                Download {selectedFormat === "audio" ? "Audio" : "Video"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).springify()}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
              {video.duration}
            </Text>
          </View>
          {/* Music Badge */}
          {video.isMusic && (
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: Colors.secondary,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons name="musical-notes" size={12} color="white" />
              <Text style={{ color: "white", fontSize: 11, fontWeight: "600" }}>MUSIC</Text>
            </View>
          )}
          {/* Play Overlay */}
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
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play" size={28} color="white" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </View>

        {/* Video Info */}
        <View style={{ padding: 14 }}>
          <Text
            style={{ color: theme.text, fontWeight: "700", fontSize: 15, lineHeight: 20 }}
            numberOfLines={2}
          >
            {video.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{video.channel}</Text>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.textMuted,
              }}
            />
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>{video.views}</Text>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.textMuted,
              }}
            />
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>{video.publishedAt}</Text>
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
                backgroundColor: theme.primary,
                paddingVertical: 10,
                borderRadius: 10,
                gap: 6,
              }}
            >
              <Ionicons name="download" size={18} color="white" />
              <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: isDark ? "rgba(51, 65, 85, 0.6)" : theme.backgroundSecondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="share-outline" size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: isDark ? "rgba(51, 65, 85, 0.6)" : theme.backgroundSecondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="bookmark-outline" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
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
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Keyboard.dismiss();
      setIsSearching(true);
      setHasSearched(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find matching mock results
      const normalizedQuery = query.toLowerCase();
      let results: YouTubeVideo[] = [];

      for (const [key, videos] of Object.entries(MOCK_RESULTS)) {
        if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
          results = [...results, ...videos];
        }
      }

      // If no specific match, return trending music as default
      if (results.length === 0) {
        results = MOCK_RESULTS["trending music"];
      }

      setSearchResults(results);
      setIsSearching(false);
    },
    []
  );

  const handleDownload = useCallback(
    (quality: string, format: string) => {
      setShowDownloadModal(false);
      setIsDownloading(true);

      // Simulate download
      setTimeout(() => {
        setIsDownloading(false);
        showToast(
          `${format === "audio" ? "Audio" : "Video"} download started! (${quality})`,
          "success"
        );
      }, 1500);
    },
    [showToast]
  );

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

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
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
              Search and download videos & music
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
            borderWidth: 2,
            borderColor: searchQuery ? theme.primary : "transparent",
          }}
        >
          <Ionicons
            name="search"
            size={22}
            color={searchQuery ? theme.primary : theme.textMuted}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            placeholder="Search YouTube videos, music..."
            placeholderTextColor={theme.textMuted}
            returnKeyType="search"
            style={{
              flex: 1,
              paddingVertical: 16,
              paddingHorizontal: 12,
              color: theme.text,
              fontSize: 16,
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={{ padding: 4 }}
            >
              <Ionicons name="close-circle" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => handleSearch(searchQuery)}
            disabled={!searchQuery.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: searchQuery.trim() ? theme.primary : theme.textMuted,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 8,
            }}
          >
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loading State */}
        {isSearching && (
          <Animated.View
            entering={FadeIn}
            style={{
              alignItems: "center",
              paddingVertical: 60,
            }}
          >
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={{ color: theme.textSecondary, marginTop: 16, fontSize: 15 }}>
              Searching YouTube...
            </Text>
          </Animated.View>
        )}

        {/* Download Progress */}
        {isDownloading && (
          <Animated.View
            entering={FadeIn}
            style={{
              marginHorizontal: 20,
              marginBottom: 16,
              backgroundColor: `${Colors.success}20`,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="small" color={Colors.success} />
            <Text style={{ color: Colors.success, marginLeft: 12, fontWeight: "600" }}>
              Starting download...
            </Text>
          </Animated.View>
        )}

        {/* Search Results */}
        {!isSearching && hasSearched && searchResults.length > 0 && (
          <Animated.View entering={FadeInUp.delay(100)} style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                color: theme.text,
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 16,
              }}
            >
              Results for &quot;{searchQuery}&quot;
            </Text>
            {searchResults.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  showToast("Video preview coming soon!", "info");
                }}
                onDownload={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSelectedVideo(video);
                  setShowDownloadModal(true);
                }}
              />
            ))}
          </Animated.View>
        )}

        {/* No Results */}
        {!isSearching && hasSearched && searchResults.length === 0 && (
          <Animated.View
            entering={FadeIn}
            style={{
              alignItems: "center",
              paddingVertical: 60,
              paddingHorizontal: 40,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: `${theme.textMuted}20`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Ionicons name="search" size={40} color={theme.textMuted} />
            </View>
            <Text
              style={{
                color: theme.text,
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              No results found
            </Text>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Try searching for something else
            </Text>
          </Animated.View>
        )}

        {/* Initial State - Suggestions */}
        {!isSearching && !hasSearched && (
          <>
            {/* Quick Suggestions */}
            <Animated.View entering={FadeIn.delay(100)} style={{ paddingHorizontal: 20 }}>
              <Text
                style={{
                  color: theme.text,
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 16,
                }}
              >
                Quick Search
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {SUGGESTIONS.map((suggestion, index) => (
                  <Animated.View
                    key={suggestion.text}
                    entering={FadeInRight.delay(index * 50)}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setSearchQuery(suggestion.query);
                        handleSearch(suggestion.query);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 20,
                        gap: 8,
                        borderWidth: isDark ? 0 : 1,
                        borderColor: theme.border,
                      }}
                    >
                      <Ionicons
                        name={suggestion.icon as keyof typeof Ionicons.glyphMap}
                        size={18}
                        color={theme.primary}
                      />
                      <Text style={{ color: theme.text, fontWeight: "500" }}>
                        {suggestion.text}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Recent Searches */}
            <Animated.View
              entering={FadeInUp.delay(200)}
              style={{ paddingHorizontal: 20, marginTop: 32 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700" }}>
                  Recent Searches
                </Text>
                <TouchableOpacity>
                  <Text style={{ color: theme.primary, fontWeight: "600" }}>Clear All</Text>
                </TouchableOpacity>
              </View>
              {RECENT_SEARCHES.map((search, index) => (
                <Animated.View key={search} entering={FadeInRight.delay(index * 50)}>
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery(search);
                      handleSearch(search);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 14,
                      borderBottomWidth: index < RECENT_SEARCHES.length - 1 ? 1 : 0,
                      borderBottomColor: theme.border,
                    }}
                  >
                    <Ionicons name="time-outline" size={20} color={theme.textMuted} />
                    <Text
                      style={{
                        flex: 1,
                        color: theme.text,
                        marginLeft: 14,
                        fontSize: 15,
                      }}
                    >
                      {search}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </Animated.View>

            {/* Info Card */}
            <Animated.View
              entering={FadeInUp.delay(300)}
              style={{ paddingHorizontal: 20, marginTop: 32 }}
            >
              <LinearGradient
                colors={[`${theme.primary}20`, `${Colors.secondary}20`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: `${theme.primary}30`,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: theme.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="information" size={24} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>
                      Download Feature
                    </Text>
                    <Text
                      style={{
                        color: theme.textSecondary,
                        fontSize: 13,
                        marginTop: 4,
                        lineHeight: 18,
                      }}
                    >
                      Search for any video or music on YouTube and download it in your preferred
                      quality for offline viewing.
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          </>
        )}
      </ScrollView>

      {/* Download Modal */}
      <DownloadModal
        visible={showDownloadModal}
        video={selectedVideo}
        onClose={() => setShowDownloadModal(false)}
        onDownload={handleDownload}
      />
    </View>
  );
}
