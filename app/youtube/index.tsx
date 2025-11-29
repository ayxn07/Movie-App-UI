import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Linking,
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

// Mock YouTube search results (in a real app, this would come from YouTube Data API)
interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  type: "video" | "music";
}

// Sample search results for demonstration
const SAMPLE_RESULTS: YouTubeVideo[] = [
  {
    id: "1",
    title: "Lofi Hip Hop Radio - Beats to Relax/Study To",
    channel: "ChilledCow",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    duration: "LIVE",
    views: "15M watching",
    publishedAt: "Streaming now",
    type: "music",
  },
  {
    id: "2",
    title: "Best Motivational Speech Ever - Steve Jobs",
    channel: "MotivationHub",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    duration: "15:42",
    views: "25M views",
    publishedAt: "3 years ago",
    type: "video",
  },
  {
    id: "3",
    title: "Chill Music Mix 2024 - Best Relaxing Songs",
    channel: "ChillNation",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
    duration: "1:02:33",
    views: "8.2M views",
    publishedAt: "2 months ago",
    type: "music",
  },
  {
    id: "4",
    title: "JavaScript Full Course for Beginners 2024",
    channel: "freeCodeCamp",
    thumbnail: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
    duration: "3:45:12",
    views: "5.1M views",
    publishedAt: "6 months ago",
    type: "video",
  },
  {
    id: "5",
    title: "Acoustic Guitar Covers - Popular Songs",
    channel: "MusicCovers",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
    duration: "45:30",
    views: "3.4M views",
    publishedAt: "1 year ago",
    type: "music",
  },
];

const TRENDING_SEARCHES = [
  "lofi beats",
  "workout music",
  "study music",
  "pop hits 2024",
  "acoustic covers",
  "jazz playlist",
  "motivational videos",
  "travel vlogs",
];

// Video Result Card Component
const VideoResultCard = ({
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
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: video.thumbnail }}
            style={{ width: 140, height: 80, borderRadius: 12 }}
            contentFit="cover"
          />
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
            <Text style={{ color: "white", fontSize: 11, fontWeight: "600" }}>
              {video.duration}
            </Text>
          </View>
          {video.type === "music" && (
            <View
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                backgroundColor: Colors.secondary,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Ionicons name="musical-notes" size={12} color="white" />
            </View>
          )}
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
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
              {video.channel}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>
              {video.views} • {video.publishedAt}
            </Text>
          </View>
        </View>

        {/* Download Button */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onDownload();
          }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: `${Colors.primary}20`,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Ionicons name="download-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Download Options Modal
const DownloadOptionsModal = ({
  visible,
  video,
  onClose,
  onDownload,
}: {
  visible: boolean;
  video: YouTubeVideo | null;
  onClose: () => void;
  onDownload: (format: string, quality: string) => void;
}) => {
  const { theme, isDark } = useTheme();

  if (!video) return null;

  const videoQualities = ["1080p", "720p", "480p", "360p"];
  const audioQualities = ["320kbps", "256kbps", "192kbps", "128kbps"];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
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

          {/* Video Info */}
          <View style={{ flexDirection: "row", marginBottom: 24 }}>
            <Image
              source={{ uri: video.thumbnail }}
              style={{ width: 100, height: 60, borderRadius: 8 }}
              contentFit="cover"
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14 }} numberOfLines={2}>
                {video.title}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                {video.channel}
              </Text>
            </View>
          </View>

          {/* Download as Video */}
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700", marginBottom: 12 }}>
            Download as Video (MP4)
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {videoQualities.map((quality) => (
              <TouchableOpacity
                key={quality}
                onPress={() => onDownload("video", quality)}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <Text style={{ color: theme.text, fontWeight: "600" }}>{quality}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Download as Audio */}
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700", marginBottom: 12 }}>
            Download as Audio (MP3)
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {audioQualities.map((quality) => (
              <TouchableOpacity
                key={quality}
                onPress={() => onDownload("audio", quality)}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <Text style={{ color: theme.text, fontWeight: "600" }}>{quality}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Note */}
          <View
            style={{
              backgroundColor: `${Colors.warning}15`,
              padding: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <Ionicons name="information-circle" size={22} color={Colors.warning} />
            <Text style={{ flex: 1, color: theme.textSecondary, fontSize: 13, lineHeight: 18 }}>
              Downloads are for personal use only. Please respect copyright laws and content creators&apos; rights.
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function YouTubeSearchScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  const [activeFilter, setActiveFilter] = useState<"all" | "video" | "music">("all");

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    Keyboard.dismiss();
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Filter sample results based on query (in real app, this would be API call)
    const filtered = SAMPLE_RESULTS.filter(
      (video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channel.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // If no matches, show all results (for demo purposes)
    setSearchResults(filtered.length > 0 ? filtered : SAMPLE_RESULTS);
    setIsSearching(false);
    
    showToast(`Found ${filtered.length > 0 ? filtered.length : SAMPLE_RESULTS.length} results`, "info");
  }, [searchQuery, showToast]);

  const handleTrendingSearch = (query: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery(query);
    // Auto-search when clicking trending
    setTimeout(() => {
      setSearchResults(SAMPLE_RESULTS);
    }, 300);
  };

  const handleVideoPress = (video: YouTubeVideo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // In a real app, this would open YouTube or play the video
    Alert.alert(
      "Open Video",
      "This would open the video in YouTube. For downloading, tap the download button.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Open YouTube", 
          onPress: () => {
            // Open YouTube app or website
            Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`);
          }
        },
      ]
    );
  };

  const handleDownloadPress = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setShowDownloadModal(true);
  };

  const handleDownload = async (format: string, quality: string) => {
    setShowDownloadModal(false);
    
    if (!selectedVideo) return;

    // Request permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant access to save downloaded files.",
        [{ text: "OK" }]
      );
      return;
    }

    showToast(`Starting download: ${selectedVideo.title} (${format} - ${quality})`, "info");

    // Simulate download progress
    const videoId = selectedVideo.id;
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[videoId];
          return newProgress;
        });
        showToast(`Downloaded: ${selectedVideo.title}`, "success");
      } else {
        setDownloadProgress((prev) => ({ ...prev, [videoId]: progress }));
      }
    }, 500);

    setDownloadProgress((prev) => ({ ...prev, [videoId]: 0 }));
  };

  const filteredResults = searchResults.filter((video) => {
    if (activeFilter === "all") return true;
    return video.type === activeFilter;
  });

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
                backgroundColor: isDark
                  ? "rgba(30, 41, 59, 0.8)"
                  : "rgba(226, 232, 240, 0.8)",
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
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <Ionicons name="search" size={22} color={theme.textMuted} />
            <TextInput
              style={{
                flex: 1,
                color: theme.text,
                fontSize: 16,
                paddingVertical: 16,
                marginLeft: 12,
              }}
              placeholder="Search videos, music, channels..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={{ padding: 4 }}
              >
                <Ionicons name="close-circle" size={20} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Button */}
          <TouchableOpacity
            onPress={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            style={{ marginTop: 12 }}
          >
            <LinearGradient
              colors={
                !searchQuery.trim()
                  ? ["#64748b", "#475569"]
                  : [Colors.primary, Colors.primaryDark]
              }
              style={{
                paddingVertical: 16,
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {isSearching ? (
                <Ionicons name="hourglass" size={20} color="white" />
              ) : (
                <Ionicons name="search" size={20} color="white" />
              )}
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                {isSearching ? "Searching..." : "Search YouTube"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Trending Searches */}
        {searchResults.length === 0 && (
          <Animated.View entering={FadeIn.delay(200)} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
              Trending Searches
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {TRENDING_SEARCHES.map((query, index) => (
                <TouchableOpacity
                  key={query}
                  onPress={() => handleTrendingSearch(query)}
                  style={{
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 20,
                    borderWidth: isDark ? 0 : 1,
                    borderColor: theme.border,
                  }}
                >
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "500" }}>
                    {query}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Filter Pills */}
        {searchResults.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {(["all", "video", "music"] as const).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setActiveFilter(filter);
                  }}
                  style={{
                    backgroundColor:
                      activeFilter === filter
                        ? Colors.primary
                        : isDark
                        ? "rgba(30, 41, 59, 0.6)"
                        : theme.card,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: activeFilter === filter ? "white" : theme.text,
                      fontWeight: "600",
                      fontSize: 14,
                    }}
                  >
                    {filter === "all" ? "All Results" : filter === "video" ? "Videos" : "Music"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Animated.View entering={FadeInUp.delay(100)} style={{ paddingHorizontal: 20 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
              Search Results ({filteredResults.length})
            </Text>
            {filteredResults.map((video, index) => (
              <View key={video.id}>
                <VideoResultCard
                  video={video}
                  index={index}
                  onPress={() => handleVideoPress(video)}
                  onDownload={() => handleDownloadPress(video)}
                />
                {/* Download Progress */}
                {downloadProgress[video.id] !== undefined && (
                  <View
                    style={{
                      marginTop: -8,
                      marginBottom: 12,
                      marginHorizontal: 4,
                    }}
                  >
                    <View
                      style={{
                        height: 4,
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: `${downloadProgress[video.id]}%`,
                          backgroundColor: Colors.primary,
                        }}
                      />
                    </View>
                    <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }}>
                      Downloading... {Math.round(downloadProgress[video.id])}%
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </Animated.View>
        )}

        {/* Empty State for No Results */}
        {searchResults.length === 0 && searchQuery && !isSearching && (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={{
              alignItems: "center",
              paddingVertical: 60,
              paddingHorizontal: 40,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: `${Colors.primary}20`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Ionicons name="search-outline" size={48} color={Colors.primary} />
            </View>
            <Text
              style={{
                color: theme.text,
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              No Results Found
            </Text>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Try searching with different keywords
            </Text>
          </Animated.View>
        )}

        {/* Info Section */}
        <Animated.View entering={FadeIn.delay(300)} style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View
            style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 16,
              padding: 20,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: `${Colors.danger}20`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="logo-youtube" size={24} color={Colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700" }}>
                  YouTube Integration
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                  Search and save for offline viewing
                </Text>
              </View>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 20 }}>
              This feature allows you to search YouTube content and download videos or extract audio for offline playback. Downloads are saved to your device&apos;s media library.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Download Options Modal */}
      <DownloadOptionsModal
        visible={showDownloadModal}
        video={selectedVideo}
        onClose={() => setShowDownloadModal(false)}
        onDownload={handleDownload}
      />
    </View>
  );
}
