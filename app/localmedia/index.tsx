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

// Audio Player Modal Component
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
          // Component was unmounted during loading, clean up
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
  }, [visible, media?.uri, onPlaybackStatusUpdate]);

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

  if (!media) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)" }}>
        <LinearGradient
          colors={["#1e1b4b", "#0f172a", "#020617"]}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 60,
              paddingBottom: 20,
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
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Now Playing
            </Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Album Art Placeholder */}
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View
              style={{
                width: screenWidth * 0.75,
                height: screenWidth * 0.75,
                borderRadius: 20,
                backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              {media.thumbnail ? (
                <Image
                  source={{ uri: media.thumbnail }}
                  style={{ width: "100%", height: "100%", borderRadius: 20 }}
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="musical-notes" size={80} color={Colors.primary} />
              )}
            </View>
          </View>

          {/* Song Info */}
          <View style={{ paddingHorizontal: 30 }}>
            <Text
              style={{ color: "white", fontSize: 24, fontWeight: "800", textAlign: "center" }}
              numberOfLines={2}
            >
              {media.name}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginTop: 8, textAlign: "center" }}>
              Local File
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={{ paddingHorizontal: 30, marginTop: 40 }}>
            <View
              style={{
                height: 6,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  backgroundColor: Colors.primary,
                }}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                {formatTime(position)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 40,
              paddingBottom: 80,
              gap: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => handleSeek(Math.max(0, progress - 0.1))}
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
              }}
            >
              {isLoading ? (
                <Ionicons name="hourglass" size={36} color="white" />
              ) : (
                <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSeek(Math.min(1, progress + 0.1))}
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
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

// Video Player Modal Component
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

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      setIsLoading(false);
    }
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const handleSeek = async (forward: boolean) => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const seekAmount = 10000; // 10 seconds
    const newPosition = forward ? position + seekAmount : position - seekAmount;
    await videoRef.current.setPositionAsync(Math.max(0, Math.min(duration, newPosition)));
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  if (!media) return null;

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar style="light" hidden />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowControls(!showControls)}
          style={{ flex: 1 }}
        >
          <Video
            ref={videoRef}
            source={{ uri: media.uri }}
            style={{ flex: 1 }}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
            isLooping={false}
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
              }}
            >
              <Ionicons name="hourglass" size={48} color={Colors.primary} />
            </View>
          )}

          {/* Controls Overlay */}
          {showControls && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              {/* Top Bar */}
              <LinearGradient
                colors={["rgba(0,0,0,0.8)", "transparent"]}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingTop: 50,
                  paddingBottom: 30,
                }}
              >
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 1,
                    color: "white",
                    fontSize: 16,
                    fontWeight: "600",
                    marginLeft: 16,
                  }}
                  numberOfLines={1}
                >
                  {media.name}
                </Text>
              </LinearGradient>

              {/* Center Controls */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 40,
                }}
              >
                <TouchableOpacity onPress={() => handleSeek(false)}>
                  <Ionicons name="play-back" size={36} color="white" />
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
                  }}
                >
                  <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSeek(true)}>
                  <Ionicons name="play-forward" size={36} color="white" />
                </TouchableOpacity>
              </View>

              {/* Bottom Controls */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 30 }}
              >
                {/* Progress Bar */}
                <View
                  style={{
                    height: 4,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: 2,
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${progress * 100}%`,
                      backgroundColor: Colors.primary,
                    }}
                  />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: "white", fontSize: 12 }}>{formatTime(position)}</Text>
                  <Text style={{ color: "white", fontSize: 12 }}>{formatTime(duration)}</Text>
                </View>
              </LinearGradient>
            </View>
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
}: {
  visible: boolean;
  onClose: () => void;
  onUploadVideo: () => void;
  onUploadAudio: () => void;
  onScanDownloads: () => void;
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

  // Request media library permissions on mount
  useEffect(() => {
    (async () => {
      try {
        // Request permissions without specifying media type to avoid the AUDIO permission issue
        // This will request standard media library access
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("Media library permission not granted");
        }
      } catch (error) {
        // Handle permission request errors gracefully
        console.warn("Error requesting media library permissions:", error);
      }
    })();
  }, []);

  const filteredMedia = localMedia.filter((media) => {
    if (activeFilter === "all") return true;
    return media.type === activeFilter;
  });

  const scanDownloadsFolder = useCallback(async () => {
    setShowUploadModal(false);

    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant access to your media library to scan for media files. You may need to enable permissions in your device settings or create a development build for full functionality.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => {} },
          ]
        );
        return;
      }

      showToast("Scanning for media files...", "info");

      const newMediaItems: LocalMedia[] = [];

      // Get video files - wrapped in try/catch for granular error handling
      try {
        const videoAssets = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.video,
          first: 100,
          sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
        });

        // Process video files
        for (const asset of videoAssets.assets) {
          try {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
            newMediaItems.push({
              id: asset.id,
              name: asset.filename,
              type: "video",
              uri: assetInfo.localUri || asset.uri,
              size: formatFileSize(assetInfo.fileSize || 0),
              duration: formatDuration(asset.duration),
              thumbnail: asset.uri,
              addedAt: new Date(asset.modificationTime),
            });
          } catch (assetError) {
            console.warn("Error getting video asset info:", assetError);
          }
        }
      } catch (videoError) {
        console.warn("Error getting video assets:", videoError);
      }

      // Get audio files - wrapped in try/catch for granular error handling
      try {
        const audioAssets = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
          first: 100,
          sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
        });

        // Process audio files
        for (const asset of audioAssets.assets) {
          try {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
            newMediaItems.push({
              id: asset.id,
              name: asset.filename,
              type: "audio",
              uri: assetInfo.localUri || asset.uri,
              size: formatFileSize(assetInfo.fileSize || 0),
              duration: formatDuration(asset.duration),
              addedAt: new Date(asset.modificationTime),
            });
          } catch (assetError) {
            console.warn("Error getting audio asset info:", assetError);
          }
        }
      } catch (audioError) {
        console.warn("Error getting audio assets:", audioError);
        // Note: This is expected in Expo Go due to limited media library access
      }

      if (newMediaItems.length > 0) {
        setLocalMedia(newMediaItems);
        showToast(`Found ${newMediaItems.length} media files!`, "success");
      } else {
        showToast("No media files found. Note: Full access requires a development build.", "info");
      }
    } catch (error) {
      console.error("Error scanning downloads:", error);
      showToast("Failed to scan media files. Try using a development build for full access.", "error");
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
    } catch (error) {
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
    } catch (error) {
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
