import { Ionicons } from "@expo/vector-icons";
import { Audio, Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Linking,
  ActivityIndicator,
  Animated as RNAnimated,
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

const { width: screenWidth } = Dimensions.get("window");

// YouTube Search Result interface
interface YouTubeSearchResult {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
}

// Mock YouTube search results for UI demonstration
const MOCK_YOUTUBE_RESULTS: YouTubeSearchResult[] = [
  {
    id: "1",
    title: "Summer Vibes - Chill Lo-Fi Hip Hop Mix",
    channel: "Chillhop Music",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    duration: "3:45",
    viewCount: "2.5M",
    publishedAt: "2 weeks ago",
  },
  {
    id: "2",
    title: "Ambient Study Music - Focus & Concentration",
    channel: "Study Beats",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    duration: "1:02:34",
    viewCount: "5.1M",
    publishedAt: "1 month ago",
  },
  {
    id: "3",
    title: "Epic Cinematic Orchestra - Movie Soundtrack",
    channel: "Epic Music World",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
    duration: "4:28",
    viewCount: "890K",
    publishedAt: "3 days ago",
  },
  {
    id: "4",
    title: "Relaxing Piano Music - Peaceful Melodies",
    channel: "Piano Dreams",
    thumbnail: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
    duration: "2:15:00",
    viewCount: "12M",
    publishedAt: "6 months ago",
  },
  {
    id: "5",
    title: "Electronic Dance Mix 2024 - Top EDM Hits",
    channel: "EDM Central",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
    duration: "58:22",
    viewCount: "1.8M",
    publishedAt: "1 week ago",
  },
];

// YouTube Search Modal Component
const YouTubeSearchModal = ({
  visible,
  onClose,
  showToast,
}: {
  visible: boolean;
  onClose: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}) => {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "music" | "video">("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // Filter mock results based on query (case-insensitive)
      const filteredResults = MOCK_YOUTUBE_RESULTS.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.channel.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // If no matches, show all results as "suggested"
      setSearchResults(filteredResults.length > 0 ? filteredResults : MOCK_YOUTUBE_RESULTS);
      setIsSearching(false);
    }, 800);
  }, [searchQuery]);

  const handleDownload = useCallback((result: YouTubeSearchResult) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDownloadingId(result.id);
    
    // Simulate download process
    setTimeout(() => {
      setDownloadingId(null);
      showToast(`"${result.title}" - Download feature requires external service integration`, "info");
      
      // Open browser with a YouTube to MP3 converter (example - in production use proper API)
      Alert.alert(
        "Download Options",
        "To download this content, you can:\n\n1. Use a YouTube Premium subscription\n2. Use third-party converter services\n3. Use command-line tools like yt-dlp",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Learn More",
            onPress: () => Linking.openURL("https://github.com/yt-dlp/yt-dlp"),
          },
        ]
      );
    }, 1500);
  }, [showToast]);

  const handlePlayInYouTube = useCallback((result: YouTubeSearchResult) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // In production, this would use the actual YouTube video ID
    Linking.openURL("https://www.youtube.com").catch(() => {
      showToast("Could not open YouTube", "error");
    });
  }, [showToast]);

  const categories = [
    { id: "all", label: "All", icon: "apps" },
    { id: "music", label: "Music", icon: "musical-notes" },
    { id: "video", label: "Video", icon: "videocam" },
  ] as const;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: isDark ? "rgba(0,0,0,0.98)" : "rgba(255,255,255,0.98)" }}>
        <LinearGradient
          colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 56,
              paddingBottom: 16,
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: "800" }}>
                YouTube Search
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                Search for songs and videos
              </Text>
            </View>
            <View style={{
              backgroundColor: "#FF0000",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
            }}>
              <Ionicons name="logo-youtube" size={20} color="white" />
            </View>
          </View>

          {/* Search Input */}
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                borderRadius: 16,
                paddingHorizontal: 16,
                borderWidth: 2,
                borderColor: "transparent",
              }}
            >
              <Ionicons name="search" size={22} color={theme.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                placeholder="Search for music, videos..."
                placeholderTextColor={theme.textMuted}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  paddingHorizontal: 12,
                  fontSize: 16,
                  color: theme.text,
                }}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color={theme.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Category Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginTop: 12, gap: 8 }}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedCategory(category.id);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor:
                      selectedCategory === category.id
                        ? Colors.primary
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
                    color={selectedCategory === category.id ? "white" : theme.text}
                  />
                  <Text
                    style={{
                      color: selectedCategory === category.id ? "white" : theme.text,
                      fontWeight: "600",
                      fontSize: 14,
                    }}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Search Results */}
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          >
            {isSearching ? (
              <View style={{ alignItems: "center", paddingVertical: 60 }}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ color: theme.textSecondary, marginTop: 16 }}>Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <>
                <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 16 }}>
                  {searchResults.length} results found
                </Text>
                {searchResults.map((result, index) => (
                  <Animated.View
                    key={result.id}
                    entering={FadeInUp.delay(index * 80).springify()}
                  >
                    <View
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
                          source={{ uri: result.thumbnail }}
                          style={{ width: 120, height: 68, borderRadius: 10 }}
                          contentFit="cover"
                        />
                        <View
                          style={{
                            position: "absolute",
                            bottom: 4,
                            right: 4,
                            backgroundColor: "rgba(0,0,0,0.8)",
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}
                        >
                          <Text style={{ color: "white", fontSize: 10, fontWeight: "600" }}>
                            {result.duration}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handlePlayInYouTube(result)}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderRadius: 10,
                          }}
                        >
                          <Ionicons name="play-circle" size={36} color="white" />
                        </TouchableOpacity>
                      </View>

                      {/* Info */}
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text
                          style={{ color: theme.text, fontWeight: "600", fontSize: 14 }}
                          numberOfLines={2}
                        >
                          {result.title}
                        </Text>
                        <Text
                          style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}
                          numberOfLines={1}
                        >
                          {result.channel}
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 }}>
                          <Text style={{ color: theme.textMuted, fontSize: 11 }}>
                            {result.viewCount} views
                          </Text>
                          <Text style={{ color: theme.textMuted, fontSize: 11 }}>•</Text>
                          <Text style={{ color: theme.textMuted, fontSize: 11 }}>
                            {result.publishedAt}
                          </Text>
                        </View>
                      </View>

                      {/* Download Button */}
                      <TouchableOpacity
                        onPress={() => handleDownload(result)}
                        disabled={downloadingId === result.id}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: downloadingId === result.id ? `${Colors.primary}40` : `${Colors.primary}20`,
                          alignItems: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      >
                        {downloadingId === result.id ? (
                          <ActivityIndicator size="small" color={Colors.primary} />
                        ) : (
                          <Ionicons name="download-outline" size={22} color={Colors.primary} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                ))}
              </>
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 60 }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: `${Colors.primary}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Ionicons name="search" size={36} color={Colors.primary} />
                </View>
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
                  Search YouTube
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 40 }}>
                  Find your favorite songs and videos to add to your library
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Info Banner */}
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
            marginHorizontal: 20,
            marginBottom: 30,
            padding: 16,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
          }}>
            <Ionicons name="information-circle" size={24} color={Colors.primary} />
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginLeft: 12, flex: 1 }}>
              Download functionality requires external converter services. Use responsibly and respect copyright.
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

// Helper function to format duration
const formatDuration = (durationInSeconds: number | null | undefined): string => {
  if (!durationInSeconds || durationInSeconds <= 0) return "Unknown";
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Helper function to format file size with dynamic units
const formatFileSize = (sizeInBytes: number | null | undefined): string => {
  if (!sizeInBytes || sizeInBytes <= 0) return "Unknown";
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${Math.round(sizeInBytes / 1024)} KB`;
  if (sizeInBytes < 1024 * 1024 * 1024) return `${Math.round(sizeInBytes / 1024 / 1024)} MB`;
  return `${(sizeInBytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
};

// Local media types
interface LocalMedia {
  id: string;
  name: string;
  type: "video" | "audio";
  uri: string;
  size: string;
  duration?: string;
  thumbnail?: string;
  addedAt: Date;
}

// Audio Player Modal Component - Enhanced UI
const AudioPlayerModal = ({
  visible,
  media,
  onClose,
}: {
  visible: boolean;
  media: LocalMedia | null;
  onClose: () => void;
}) => {
  const { isDark } = useTheme();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");
  const [isLiked, setIsLiked] = useState(false);
  const [volume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Animated vinyl rotation
  const rotation = React.useRef(new RNAnimated.Value(0)).current;
  const rotationAnimation = React.useRef<ReturnType<typeof RNAnimated.loop> | null>(null);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let loadedSound: Audio.Sound | null = null;

    const loadAudio = async () => {
      if (!visible || !media) return;

      try {
        setIsLoading(true);
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
        });

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: media.uri },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );

        loadedSound = newSound;

        if (isMounted) {
          setSound(newSound);
          setIsPlaying(true);
          setIsLoading(false);
        } else {
          await newSound.unloadAsync();
        }
      } catch (error) {
        console.error("Error loading audio:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAudio();

    return () => {
      isMounted = false;
      if (loadedSound) {
        loadedSound.unloadAsync();
      }
    };
  }, [visible, media, onPlaybackStatusUpdate]);

  // Vinyl rotation effect
  useEffect(() => {
    if (isPlaying) {
      rotationAnimation.current = RNAnimated.loop(
        RNAnimated.timing(rotation, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      );
      rotationAnimation.current.start();
    } else {
      if (rotationAnimation.current) {
        rotationAnimation.current.stop();
      }
    }
    return () => {
      if (rotationAnimation.current) {
        rotationAnimation.current.stop();
      }
    };
  }, [isPlaying, rotation]);

  const handlePlayPause = async () => {
    if (!sound) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSeek = async (value: number) => {
    if (!sound || duration === 0) return;
    const seekPosition = value * duration;
    await sound.setPositionAsync(seekPosition);
  };

  const handleSkipBack = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!sound || duration === 0) return;
    const newPosition = Math.max(0, position - 15000); // Skip back 15 seconds
    await sound.setPositionAsync(newPosition);
  };

  const handleSkipForward = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!sound || duration === 0) return;
    const newPosition = Math.min(duration, position + 15000); // Skip forward 15 seconds
    await sound.setPositionAsync(newPosition);
  };

  const handleClose = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    onClose();
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? position / duration : 0;
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!media) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.98)" }}>
        <LinearGradient
          colors={["#1a1a2e", "#16213e", "#0f0f23"]}
          style={{ flex: 1 }}
        >
          {/* Animated Background Circles */}
          <View style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: `${Colors.primary}15`,
          }} />
          <View style={{
            position: "absolute",
            bottom: -150,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: 200,
            backgroundColor: `${Colors.secondary}10`,
          }} />

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 56,
              paddingBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={handleClose}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="chevron-down" size={26} color="white" />
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "500" }}>
                NOW PLAYING
              </Text>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "700", marginTop: 2 }}>
                Local Music
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowVolumeSlider(!showVolumeSlider);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Album Art / Vinyl */}
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
            <RNAnimated.View
              style={{
                width: screenWidth * 0.75,
                height: screenWidth * 0.75,
                borderRadius: screenWidth * 0.375,
                backgroundColor: "#1a1a1a",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.4,
                shadowRadius: 30,
                elevation: 15,
                transform: [{ rotate: spin }],
              }}
            >
              {/* Vinyl grooves */}
              {[0.35, 0.45, 0.55, 0.65, 0.75, 0.85].map((size, index) => (
                <View
                  key={index}
                  style={{
                    position: "absolute",
                    width: screenWidth * 0.75 * size,
                    height: screenWidth * 0.75 * size,
                    borderRadius: (screenWidth * 0.75 * size) / 2,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.05)",
                  }}
                />
              ))}
              {/* Center image */}
              <View
                style={{
                  width: screenWidth * 0.35,
                  height: screenWidth * 0.35,
                  borderRadius: screenWidth * 0.175,
                  overflow: "hidden",
                  borderWidth: 3,
                  borderColor: "rgba(255,255,255,0.1)",
                  backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {media.thumbnail ? (
                  <Image
                    source={{ uri: media.thumbnail }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={{
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="musical-notes" size={50} color="white" />
                  </LinearGradient>
                )}
              </View>
              {/* Center hole */}
              <View
                style={{
                  position: "absolute",
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "#0a0a0a",
                }}
              />
            </RNAnimated.View>

            {/* Playing indicator */}
            {isPlaying && (
              <View style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "center",
                height: 32,
                marginTop: 24,
                gap: 3,
              }}>
                {[0, 100, 200, 300, 400, 300, 200, 100, 0].map((delay, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeIn.delay(delay)}
                    style={{
                      width: 4,
                      height: 8 + Math.random() * 20,
                      backgroundColor: Colors.primary,
                      borderRadius: 2,
                    }}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Song Info */}
          <View style={{ paddingHorizontal: 30, marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: "white", fontSize: 22, fontWeight: "900" }}
                  numberOfLines={1}
                >
                  {media.name.replace(/\.[^/.]+$/, "")}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginTop: 6 }}>
                  {media.size} • Local File
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setIsLiked(!isLiked);
                }}
                style={{ padding: 8 }}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={28}
                  color={isLiked ? Colors.secondary : "white"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={{ paddingHorizontal: 30, marginBottom: 16 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={(e) => {
                const touchX = e.nativeEvent.locationX;
                const barWidth = screenWidth - 60;
                const newProgress = touchX / barWidth;
                handleSeek(Math.max(0, Math.min(1, newProgress)));
              }}
            >
              <View
                style={{
                  height: 6,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 3,
                  overflow: "visible",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    backgroundColor: Colors.primary,
                    borderRadius: 3,
                  }}
                />
                {/* Progress Thumb */}
                <View
                  style={{
                    position: "absolute",
                    left: `${progress * 100}%`,
                    top: -7,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: Colors.primary,
                    marginLeft: -10,
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                />
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600" }}>
                {formatTime(position)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600" }}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>

          {/* Main Controls */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 30,
              paddingBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsShuffle(!isShuffle);
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isShuffle ? `${Colors.primary}30` : "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="shuffle" size={22} color={isShuffle ? Colors.primary : "white"} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkipBack}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play-back" size={26} color="white" />
              <Text style={{ position: "absolute", bottom: 6, color: "rgba(255,255,255,0.5)", fontSize: 8 }}>15</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePlayPause}
              disabled={isLoading}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.primary,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.5,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {isLoading ? (
                <Ionicons name="hourglass" size={36} color="white" />
              ) : (
                <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkipForward}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play-forward" size={26} color="white" />
              <Text style={{ position: "absolute", bottom: 6, color: "rgba(255,255,255,0.5)", fontSize: 8 }}>15</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setRepeatMode(repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off");
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: repeatMode !== "off" ? `${Colors.primary}30` : "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={repeatMode === "one" ? "repeat" : "repeat"}
                size={22}
                color={repeatMode !== "off" ? Colors.primary : "white"}
              />
              {repeatMode === "one" && (
                <Text style={{
                  position: "absolute",
                  color: Colors.primary,
                  fontSize: 10,
                  fontWeight: "bold",
                }}>1</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Actions */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              paddingHorizontal: 40,
              paddingVertical: 16,
              paddingBottom: 50,
            }}
          >
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ alignItems: "center" }}
            >
              <Ionicons name="tv-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Cast</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowVolumeSlider(!showVolumeSlider);
              }}
              style={{ alignItems: "center" }}
            >
              <Ionicons
                name={volume === 0 ? "volume-mute" : volume < 0.5 ? "volume-low" : "volume-high"}
                size={22}
                color="rgba(255,255,255,0.7)"
              />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Volume</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ alignItems: "center" }}
            >
              <Ionicons name="list" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Queue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ alignItems: "center" }}
            >
              <Ionicons name="share-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Volume Slider Modal */}
          {showVolumeSlider && (
            <Animated.View
              entering={SlideInDown.springify()}
              style={{
                position: "absolute",
                bottom: 150,
                left: 30,
                right: 30,
                backgroundColor: "rgba(30, 41, 59, 0.95)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Ionicons name="volume-low" size={20} color="white" />
                <View style={{ flex: 1, height: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
                  <View style={{ width: `${volume * 100}%`, height: "100%", backgroundColor: Colors.primary, borderRadius: 2 }} />
                </View>
                <Ionicons name="volume-high" size={20} color="white" />
              </View>
              <TouchableOpacity
                onPress={() => setShowVolumeSlider(false)}
                style={{ alignItems: "center", marginTop: 12 }}
              >
                <Text style={{ color: Colors.primary, fontWeight: "600" }}>Done</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </LinearGradient>
      </View>
    </Modal>
  );
};

// Video Player Modal Component - Enhanced UI
const VideoPlayerModal = ({
  visible,
  media,
  onClose,
}: {
  visible: boolean;
  media: LocalMedia | null;
  onClose: () => void;
}) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bufferedProgress, setBufferedProgress] = useState(0);

  const controlsOpacity = useRef(new RNAnimated.Value(1)).current;
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showControls && isPlaying) {
      controlsTimeout.current = setTimeout(() => {
        RNAnimated.timing(controlsOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowControls(false));
      }, 4000);
    }
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [showControls, isPlaying, controlsOpacity]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      setIsLoading(false);
      if (status.playableDurationMillis && status.durationMillis) {
        setBufferedProgress((status.playableDurationMillis / status.durationMillis) * 100);
      }
    }
  };

  const showControlsWithReset = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsOpacity.setValue(1);
    setShowControls(true);
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showControlsWithReset();

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const handleSeek = async (forward: boolean) => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showControlsWithReset();
    const seekAmount = 10000; // 10 seconds
    const newPosition = forward ? position + seekAmount : position - seekAmount;
    await videoRef.current.setPositionAsync(Math.max(0, Math.min(duration, newPosition)));
  };

  const handleSeekToPosition = async (positionPercent: number) => {
    if (!videoRef.current || duration === 0) return;
    const newPosition = positionPercent * duration;
    await videoRef.current.setPositionAsync(newPosition);
  };

  const handleToggleMute = async () => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = async (speed: number) => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await videoRef.current.setRateAsync(speed, true);
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? position / duration : 0;
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (!media) return null;

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar style="light" hidden />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (showControls) {
              setShowControls(false);
            } else {
              showControlsWithReset();
            }
          }}
          style={{ flex: 1 }}
        >
          <Video
            ref={videoRef}
            source={{ uri: media.uri }}
            style={{ flex: 1 }}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
            isLooping={false}
            isMuted={isMuted}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.6)",
              }}
            >
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(139, 92, 246, 0.3)",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Ionicons name="hourglass" size={40} color={Colors.primary} />
              </View>
              <Text style={{ color: "white", marginTop: 16, fontWeight: "600" }}>Loading video...</Text>
            </View>
          )}

          {/* Controls Overlay */}
          {showControls && (
            <RNAnimated.View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: controlsOpacity,
              }}
            >
              {/* Top Gradient */}
              <LinearGradient
                colors={["rgba(0,0,0,0.85)", "transparent"]}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 140,
                }}
              />

              {/* Bottom Gradient */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.85)"]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 180,
                }}
              />

              {/* Top Bar */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingTop: 50,
                  paddingBottom: 16,
                }}
              >
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginHorizontal: 16 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 17,
                      fontWeight: "700",
                    }}
                    numberOfLines={1}
                  >
                    {media.name.replace(/\.[^/.]+$/, "")}
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}>
                    {media.size} • {media.duration || "Local Video"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {/* Speed Button */}
                  <TouchableOpacity
                    onPress={() => setShowSpeedMenu(!showSpeedMenu)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: playbackSpeed !== 1 ? `${Colors.primary}40` : "rgba(255,255,255,0.15)",
                    }}
                  >
                    <Text style={{ color: playbackSpeed !== 1 ? Colors.primary : "white", fontSize: 13, fontWeight: "700" }}>
                      {playbackSpeed}x
                    </Text>
                  </TouchableOpacity>
                  {/* Mute Button */}
                  <TouchableOpacity
                    onPress={handleToggleMute}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Speed Menu */}
              {showSpeedMenu && (
                <View
                  style={{
                    position: "absolute",
                    top: 100,
                    right: 20,
                    backgroundColor: "rgba(30, 41, 59, 0.98)",
                    borderRadius: 12,
                    padding: 8,
                    minWidth: 100,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  {speedOptions.map((speed) => (
                    <TouchableOpacity
                      key={speed}
                      onPress={() => handleSpeedChange(speed)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        backgroundColor: playbackSpeed === speed ? `${Colors.primary}30` : "transparent",
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{
                        color: playbackSpeed === speed ? Colors.primary : "white",
                        fontSize: 14,
                        fontWeight: playbackSpeed === speed ? "700" : "500",
                      }}>
                        {speed}x {speed === 1 && "(Normal)"}
                      </Text>
                      {playbackSpeed === speed && (
                        <Ionicons name="checkmark" size={18} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Center Play/Pause Controls */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 48,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleSeek(false)}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play-back" size={28} color="white" />
                  <Text style={{ position: "absolute", bottom: 4, color: "rgba(255,255,255,0.7)", fontSize: 9, fontWeight: "600" }}>10</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: Colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.5,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSeek(true)}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play-forward" size={28} color="white" />
                  <Text style={{ position: "absolute", bottom: 4, color: "rgba(255,255,255,0.7)", fontSize: 9, fontWeight: "600" }}>10</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Controls */}
              <View style={{ paddingHorizontal: 20, paddingBottom: 50 }}>
                {/* Progress Bar */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={(e) => {
                    const touchX = e.nativeEvent.locationX;
                    const barWidth = Dimensions.get("window").width - 40;
                    const newProgress = touchX / barWidth;
                    handleSeekToPosition(Math.max(0, Math.min(1, newProgress)));
                  }}
                  style={{ marginBottom: 12 }}
                >
                  <View
                    style={{
                      height: 5,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: 2.5,
                      overflow: "visible",
                    }}
                  >
                    {/* Buffered Progress */}
                    <View
                      style={{
                        position: "absolute",
                        height: "100%",
                        width: `${bufferedProgress}%`,
                        backgroundColor: "rgba(255,255,255,0.3)",
                        borderRadius: 2.5,
                      }}
                    />
                    {/* Played Progress */}
                    <View
                      style={{
                        height: "100%",
                        width: `${progress * 100}%`,
                        backgroundColor: Colors.primary,
                        borderRadius: 2.5,
                      }}
                    />
                    {/* Progress Thumb */}
                    <View
                      style={{
                        position: "absolute",
                        left: `${progress * 100}%`,
                        top: -6,
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: Colors.primary,
                        marginLeft: -8,
                        shadowColor: Colors.primary,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6,
                        shadowRadius: 6,
                        elevation: 5,
                      }}
                    />
                  </View>
                </TouchableOpacity>

                {/* Time and Controls Row */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: "white", fontSize: 13, fontWeight: "600" }}>{formatTime(position)}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>/</Text>
                    <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{formatTime(duration)}</Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 16 }}>
                    <TouchableOpacity
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                    >
                      <Ionicons name="text" size={18} color="rgba(255,255,255,0.8)" />
                      <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" }}>Subtitles</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setIsFullscreen(!isFullscreen);
                      }}
                    >
                      <Ionicons name={isFullscreen ? "contract" : "expand"} size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </RNAnimated.View>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Media Item Component
const MediaItem = ({
  media,
  index,
  onPress,
  onDelete,
}: {
  media: LocalMedia;
  index: number;
  onPress: () => void;
  onDelete: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Alert.alert(
            "Delete Media",
            `Are you sure you want to delete "${media.name}"?`,
            [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: onDelete },
            ]
          );
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
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
            width: 70,
            height: 70,
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
          }}
        >
          {media.thumbnail ? (
            <Image
              source={{ uri: media.thumbnail }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={media.type === "video" ? "videocam" : "musical-notes"}
                size={28}
                color={theme.textMuted}
              />
            </View>
          )}
          {/* Play icon overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="play-circle" size={32} color="white" />
          </View>
        </View>

        {/* Info */}
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text
            style={{ color: theme.text, fontWeight: "700", fontSize: 15 }}
            numberOfLines={1}
          >
            {media.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 6,
              gap: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor:
                  media.type === "video"
                    ? `${Colors.primary}20`
                    : `${Colors.secondary}20`,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Ionicons
                name={media.type === "video" ? "videocam" : "musical-notes"}
                size={12}
                color={media.type === "video" ? Colors.primary : Colors.secondary}
              />
              <Text
                style={{
                  color: media.type === "video" ? Colors.primary : Colors.secondary,
                  fontSize: 11,
                  fontWeight: "600",
                  marginLeft: 4,
                }}
              >
                {media.type.toUpperCase()}
              </Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
              {media.duration}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>{media.size}</Text>
          </View>
        </View>

        {/* More options */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={{ padding: 8 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Empty State Component
const EmptyState = ({ onUpload }: { onUpload: () => void }) => {
  const { theme } = useTheme();

  return (
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
        <Ionicons name="cloud-upload-outline" size={48} color={Colors.primary} />
      </View>
      <Text
        style={{
          color: theme.text,
          fontSize: 22,
          fontWeight: "800",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        No Local Media
      </Text>
      <Text
        style={{
          color: theme.textSecondary,
          fontSize: 15,
          textAlign: "center",
          lineHeight: 22,
          marginBottom: 24,
        }}
      >
        Upload videos and music from your device to watch and listen offline
      </Text>
      <TouchableOpacity onPress={onUpload}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={{
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Ionicons name="add" size={22} color="white" />
          <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
            Upload Media
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Upload Modal Component
const UploadModal = ({
  visible,
  onClose,
  onUploadVideo,
  onUploadAudio,
  onScanDownloads,
  onYouTubeSearch,
}: {
  visible: boolean;
  onClose: () => void;
  onUploadVideo: () => void;
  onUploadAudio: () => void;
  onScanDownloads: () => void;
  onYouTubeSearch: () => void;
}) => {
  const { theme, isDark } = useTheme();

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

          <Text
            style={{
              color: theme.text,
              fontSize: 22,
              fontWeight: "800",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Add Media
          </Text>

          {/* Scan Downloads Option */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onScanDownloads();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 12,
              borderWidth: 2,
              borderColor: Colors.primary,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: `${Colors.primary}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="folder-open" size={28} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 17 }}>
                Scan Downloads Folder
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
                Find media files from your Downloads
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
          </TouchableOpacity>

          {/* Video Upload Option */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onUploadVideo();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 12,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: `${Colors.primary}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="videocam" size={28} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 17 }}>
                Upload Video
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
                MP4, MOV, AVI formats supported
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.textMuted} />
          </TouchableOpacity>

          {/* Audio Upload Option */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onUploadAudio();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 12,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: `${Colors.secondary}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="musical-notes" size={28} color={Colors.secondary} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 17 }}>
                Upload Audio
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
                MP3, WAV, AAC formats supported
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.textMuted} />
          </TouchableOpacity>

          {/* YouTube Search Option */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onYouTubeSearch();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 12,
              borderWidth: 2,
              borderColor: "#FF0000",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: "rgba(255, 0, 0, 0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="logo-youtube" size={28} color="#FF0000" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 17 }}>
                Search YouTube
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
                Find and download songs & videos
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#FF0000" />
          </TouchableOpacity>

          {/* From Gallery Option */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onUploadVideo();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 16,
              padding: 20,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: `${Colors.accent}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="images" size={28} color={Colors.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 17 }}>
                From Gallery
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
                Select from your photo library
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.textMuted} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function LocalMediaScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();

  const [localMedia, setLocalMedia] = useState<LocalMedia[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "video" | "audio">("all");
  const [selectedMedia, setSelectedMedia] = useState<LocalMedia | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false);

  // Request media library permissions on mount
  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  const filteredMedia = localMedia.filter((media) => {
    if (activeFilter === "all") return true;
    return media.type === activeFilter;
  });

  const handleOpenYouTubeSearch = useCallback(() => {
    setShowUploadModal(false);
    setShowYouTubeSearch(true);
  }, []);

  const scanDownloadsFolder = useCallback(async () => {
    setShowUploadModal(false);

    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant access to your media library to scan for media files.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: () => {} },
          ]
        );
        return;
      }

      showToast("Scanning for media files...", "info");

      // Get video files
      const videoAssets = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.video,
        first: 100,
        sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
      });

      // Get audio files
      const audioAssets = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 100,
        sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
      });

      const newMediaItems: LocalMedia[] = [];

      // Process video files
      for (const asset of videoAssets.assets) {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
        newMediaItems.push({
          id: asset.id,
          name: asset.filename,
          type: "video",
          uri: assetInfo.localUri || asset.uri,
          size: formatFileSize((assetInfo as unknown as { fileSize?: number }).fileSize || 0),
          duration: formatDuration(asset.duration),
          thumbnail: asset.uri,
          addedAt: new Date(asset.modificationTime),
        });
      }

      // Process audio files
      for (const asset of audioAssets.assets) {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
        newMediaItems.push({
          id: asset.id,
          name: asset.filename,
          type: "audio",
          uri: assetInfo.localUri || asset.uri,
          size: formatFileSize((assetInfo as unknown as { fileSize?: number }).fileSize || 0),
          duration: formatDuration(asset.duration),
          addedAt: new Date(asset.modificationTime),
        });
      }

      if (newMediaItems.length > 0) {
        setLocalMedia(newMediaItems);
        showToast(`Found ${newMediaItems.length} media files!`, "success");
      } else {
        showToast("No media files found in your library", "info");
      }
    } catch (error) {
      console.error("Error scanning downloads:", error);
      showToast("Failed to scan media files", "error");
    }
  }, [showToast]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await scanDownloadsFolder();
    setRefreshing(false);
  }, [scanDownloadsFolder]);

  const handleUploadVideo = async () => {
    setShowUploadModal(false);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newMedia: LocalMedia = {
          id: `local_${Date.now()}`,
          name: asset.fileName || "Video.mp4",
          type: "video",
          uri: asset.uri,
          size: formatFileSize(asset.fileSize),
          duration: formatDuration(asset.duration),
          thumbnail: asset.uri,
          addedAt: new Date(),
        };
        setLocalMedia((prev) => [newMedia, ...prev]);
        showToast("Video added successfully!", "success");
      }
    } catch {
      showToast("Failed to upload video", "error");
    }
  };

  const handleUploadAudio = async () => {
    setShowUploadModal(false);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newMedia: LocalMedia = {
          id: `local_${Date.now()}`,
          name: asset.name || "Audio.mp3",
          type: "audio",
          uri: asset.uri,
          size: formatFileSize(asset.size),
          addedAt: new Date(),
        };
        setLocalMedia((prev) => [newMedia, ...prev]);
        showToast("Audio added successfully!", "success");
      }
    } catch {
      showToast("Failed to upload audio", "error");
    }
  };

  const handleDeleteMedia = (mediaId: string) => {
    setLocalMedia((prev) => prev.filter((m) => m.id !== mediaId));
    showToast("Media deleted", "info");
  };

  const handlePlayMedia = (media: LocalMedia) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMedia(media);
    if (media.type === "video") {
      setShowVideoPlayer(true);
    } else {
      setShowAudioPlayer(true);
    }
  };

  const videoCount = localMedia.filter((m) => m.type === "video").length;
  const audioCount = localMedia.filter((m) => m.type === "audio").length;

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.springify()}
          style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
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
                My Library
              </Text>
              <Text
                style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}
              >
                Your local media collection
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowUploadModal(true);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: Colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="add" size={26} color="white" />
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            <Animated.View
              entering={FadeInUp.delay(100)}
              style={{
                flex: 1,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                borderRadius: 16,
                padding: 16,
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: `${Colors.primary}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="videocam" size={22} color={Colors.primary} />
              </View>
              <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900" }}>
                {videoCount}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                Videos
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(150)}
              style={{
                flex: 1,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                borderRadius: 16,
                padding: 16,
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: `${Colors.secondary}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="musical-notes" size={22} color={Colors.secondary} />
              </View>
              <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900" }}>
                {audioCount}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                Audio Files
              </Text>
            </Animated.View>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {(["all", "video", "audio"] as const).map((filter) => (
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
                  {filter === "all"
                    ? "All Media"
                    : filter === "video"
                    ? "Videos"
                    : "Audio"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Media List */}
        <View style={{ paddingHorizontal: 20 }}>
          {filteredMedia.length === 0 ? (
            <EmptyState onUpload={() => setShowUploadModal(true)} />
          ) : (
            filteredMedia.map((media, index) => (
              <MediaItem
                key={media.id}
                media={media}
                index={index}
                onPress={() => handlePlayMedia(media)}
                onDelete={() => handleDeleteMedia(media.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Upload Modal */}
      <UploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadVideo={handleUploadVideo}
        onUploadAudio={handleUploadAudio}
        onScanDownloads={scanDownloadsFolder}
        onYouTubeSearch={handleOpenYouTubeSearch}
      />

      {/* YouTube Search Modal */}
      <YouTubeSearchModal
        visible={showYouTubeSearch}
        onClose={() => setShowYouTubeSearch(false)}
        showToast={showToast}
      />

      {/* Audio Player Modal */}
      <AudioPlayerModal
        visible={showAudioPlayer}
        media={selectedMedia}
        onClose={() => {
          setShowAudioPlayer(false);
          setSelectedMedia(null);
        }}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        visible={showVideoPlayer}
        media={selectedMedia}
        onClose={() => {
          setShowVideoPlayer(false);
          setSelectedMedia(null);
        }}
      />
    </View>
  );
}
