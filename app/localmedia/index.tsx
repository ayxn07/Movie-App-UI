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
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");
  const [isFavorite, setIsFavorite] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

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
      } catch (err) {
        console.error("Error loading audio:", err);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const seekPosition = value * duration;
    await sound.setPositionAsync(seekPosition);
  };

  const handleSkip = async (forward: boolean) => {
    if (!sound || duration === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const skipAmount = 15000; // 15 seconds
    const newPosition = forward ? position + skipAmount : position - skipAmount;
    await sound.setPositionAsync(Math.max(0, Math.min(duration, newPosition)));
  };

  const handleSpeedChange = async () => {
    if (!sound) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    await sound.setRateAsync(nextSpeed, true);
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
          colors={["#1e1b4b", "#312e81", "#4c1d95", "#020617"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 60,
              paddingBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={handleClose}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="chevron-down" size={26} color="white" />
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "500" }}>
                NOW PLAYING
              </Text>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginTop: 2 }}>
                Local Audio
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={22} color="white" />
            </TouchableOpacity>
          </Animated.View>

          {/* Album Art with Animated Glow */}
          <Animated.View 
            entering={FadeIn.delay(200).duration(600)}
            style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 }}
          >
            <View
              style={{
                width: screenWidth * 0.78,
                height: screenWidth * 0.78,
                borderRadius: 24,
                backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isPlaying ? 0.6 : 0.3,
                shadowRadius: isPlaying ? 40 : 20,
                elevation: 20,
              }}
            >
              {media.thumbnail ? (
                <Image
                  source={{ uri: media.thumbnail }}
                  style={{ width: "100%", height: "100%", borderRadius: 24 }}
                  contentFit="cover"
                />
              ) : (
                <LinearGradient
                  colors={["#6366f1", "#8b5cf6", "#a855f7"]}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 24,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="musical-notes" size={60} color="white" />
                  </View>
                </LinearGradient>
              )}
              {/* Vinyl groove effect overlay */}
              {isPlaying && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 24,
                    borderWidth: 2,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />
              )}
            </View>
          </Animated.View>

          {/* Song Info */}
          <Animated.View 
            entering={FadeInUp.delay(300).duration(400)}
            style={{ paddingHorizontal: 30 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1, marginRight: 16 }}>
                <Text
                  style={{ color: "white", fontSize: 22, fontWeight: "800" }}
                  numberOfLines={1}
                >
                  {media.name.replace(/\.(mp3|wav|m4a|aac|ogg|flac)$/i, "")}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginTop: 4 }}>
                  {media.size} • {media.duration || "Unknown duration"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setIsFavorite(!isFavorite);
                }}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={28}
                  color={isFavorite ? "#ec4899" : "white"}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Progress Bar with Touch Seek */}
          <View style={{ paddingHorizontal: 30, marginTop: 32 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={(e) => {
                const touchX = e.nativeEvent.locationX;
                const progressWidth = screenWidth - 60;
                const newProgress = touchX / progressWidth;
                handleSeek(Math.max(0, Math.min(1, newProgress)));
              }}
              style={{
                height: 8,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  backgroundColor: Colors.primary,
                  borderRadius: 4,
                }}
              />
              {/* Thumb indicator */}
              <View
                style={{
                  position: "absolute",
                  left: `${progress * 100}%`,
                  top: -4,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "white",
                  marginLeft: -8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "500" }}>
                {formatTime(position)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "500" }}>
                -{formatTime(duration - position)}
              </Text>
            </View>
          </View>

          {/* Main Controls */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 24,
              gap: 24,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsShuffled(!isShuffled);
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="shuffle"
                size={24}
                color={isShuffled ? Colors.primary : "rgba(255,255,255,0.6)"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSkip(false)}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play-back" size={28} color="white" />
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
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              {isLoading ? (
                <Ionicons name="hourglass" size={36} color="white" />
              ) : (
                <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="white" style={{ marginLeft: isPlaying ? 0 : 4 }} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSkip(true)}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play-forward" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                const modes: ("off" | "one" | "all")[] = ["off", "one", "all"];
                const currentIndex = modes.indexOf(repeatMode);
                setRepeatMode(modes[(currentIndex + 1) % modes.length]);
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={repeatMode === "off" ? "repeat-outline" : "repeat"}
                size={24}
                color={repeatMode !== "off" ? Colors.primary : "rgba(255,255,255,0.6)"}
              />
              {repeatMode === "one" && (
                <Text style={{ position: "absolute", fontSize: 8, color: Colors.primary, fontWeight: "700" }}>1</Text>
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
              paddingBottom: 50,
              paddingTop: 8,
            }}
          >
            <TouchableOpacity
              onPress={handleSpeedChange}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
                  {playbackSpeed}x
                </Text>
              </View>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Speed</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: "center" }}>
              <Ionicons name="share-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: "center" }}>
              <Ionicons name="list" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Queue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: "center" }}>
              <Ionicons name="volume-high" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Volume</Text>
            </TouchableOpacity>
          </View>
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
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLocked, setIsLocked] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (showControls && isPlaying && !showSpeedMenu) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying, showSpeedMenu]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      setIsLoading(false);
    }
  };

  const handlePlayPause = async () => {
    if (!videoRef.current || isLocked) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const handleSeek = async (forward: boolean) => {
    if (!videoRef.current || isLocked) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const seekAmount = 10000; // 10 seconds
    const newPosition = forward ? position + seekAmount : position - seekAmount;
    await videoRef.current.setPositionAsync(Math.max(0, Math.min(duration, newPosition)));
  };

  const handleProgressSeek = async (touchX: number, progressWidth: number) => {
    if (!videoRef.current || isLocked || duration === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newProgress = touchX / progressWidth;
    const newPosition = Math.max(0, Math.min(duration, newProgress * duration));
    await videoRef.current.setPositionAsync(newPosition);
  };

  const handleToggleMute = async () => {
    if (!videoRef.current || isLocked) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = async (speed: number) => {
    if (!videoRef.current || isLocked) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPlaybackSpeed(speed);
    await videoRef.current.setRateAsync(speed, true);
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
  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  if (!media) return null;

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar style="light" hidden />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => !isLocked && setShowControls(!showControls)}
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
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "rgba(139, 92, 246, 0.3)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="hourglass" size={40} color={Colors.primary} />
              </View>
              <Text style={{ color: "white", marginTop: 16, fontSize: 14 }}>Loading video...</Text>
            </View>
          )}

          {/* Lock Screen Indicator */}
          {isLocked && !showControls && (
            <View
              style={{
                position: "absolute",
                top: 60,
                left: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setIsLocked(false);
                  setShowControls(true);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  gap: 8,
                }}
              >
                <Ionicons name="lock-closed" size={18} color="white" />
                <Text style={{ color: "white", fontSize: 13, fontWeight: "600" }}>Tap to unlock</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Controls Overlay */}
          {showControls && !isLocked && (
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
                colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.4)", "transparent"]}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                  paddingTop: 50,
                  paddingBottom: 40,
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
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                    numberOfLines={1}
                  >
                    {media.name.replace(/\.(mp4|mov|avi|mkv|webm|m4v)$/i, "")}
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 }}>
                    {media.size} • {media.duration || "Unknown duration"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
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
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setIsLocked(true);
                      setShowControls(false);
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="lock-open" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>

              {/* Center Controls */}
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
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play-back" size={32} color="white" />
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "600", marginTop: 2 }}>10s</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 44,
                    backgroundColor: Colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.5,
                    shadowRadius: 16,
                    elevation: 10,
                  }}
                >
                  <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="white" style={{ marginLeft: isPlaying ? 0 : 4 }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSeek(true)}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play-forward" size={32} color="white" />
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "600", marginTop: 2 }}>10s</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Controls */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.85)"]}
                style={{ paddingHorizontal: 20, paddingBottom: 50, paddingTop: 40 }}
              >
                {/* Progress Bar with Touch Seek */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={(e) => {
                    handleProgressSeek(e.nativeEvent.locationX, screenWidth - 40);
                  }}
                  style={{
                    height: 6,
                    backgroundColor: "rgba(255,255,255,0.25)",
                    borderRadius: 3,
                    overflow: "visible",
                    marginBottom: 12,
                  }}
                >
                  {/* Buffered progress (simulated) */}
                  <View
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: `${Math.min(100, progress * 100 + 15)}%`,
                      backgroundColor: "rgba(255,255,255,0.3)",
                      borderRadius: 3,
                    }}
                  />
                  {/* Played progress */}
                  <View
                    style={{
                      height: "100%",
                      width: `${progress * 100}%`,
                      backgroundColor: Colors.primary,
                      borderRadius: 3,
                    }}
                  />
                  {/* Thumb indicator */}
                  <View
                    style={{
                      position: "absolute",
                      left: `${progress * 100}%`,
                      top: -5,
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: "white",
                      marginLeft: -8,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }}
                  />
                </TouchableOpacity>

                {/* Time and Controls Row */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: "white", fontSize: 13, fontWeight: "600" }}>{formatTime(position)}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>/</Text>
                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{formatTime(duration)}</Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                    {/* Speed Button */}
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowSpeedMenu(!showSpeedMenu);
                      }}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 8,
                        backgroundColor: "rgba(255,255,255,0.15)",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>{playbackSpeed}x</Text>
                    </TouchableOpacity>

                    {/* Subtitles */}
                    <TouchableOpacity
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="text" size={18} color="white" />
                    </TouchableOpacity>

                    {/* Picture in Picture */}
                    <TouchableOpacity
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="tablet-landscape-outline" size={18} color="white" />
                    </TouchableOpacity>

                    {/* Fullscreen */}
                    <TouchableOpacity
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="expand" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>

              {/* Speed Menu */}
              {showSpeedMenu && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 120,
                    right: 20,
                    backgroundColor: "rgba(0,0,0,0.9)",
                    borderRadius: 16,
                    padding: 8,
                    minWidth: 100,
                  }}
                >
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600", paddingHorizontal: 12, paddingVertical: 8 }}>
                    SPEED
                  </Text>
                  {speeds.map((speed) => (
                    <TouchableOpacity
                      key={speed}
                      onPress={() => handleSpeedChange(speed)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        backgroundColor: playbackSpeed === speed ? "rgba(139, 92, 246, 0.3)" : "transparent",
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: playbackSpeed === speed ? Colors.primary : "white",
                          fontSize: 14,
                          fontWeight: playbackSpeed === speed ? "700" : "500",
                        }}
                      >
                        {speed === 1 ? "Normal" : `${speed}x`}
                      </Text>
                      {playbackSpeed === speed && (
                        <Ionicons name="checkmark" size={18} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
      await MediaLibrary.requestPermissionsAsync();
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
          size: formatFileSize(assetInfo.fileSize || 0),
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
          size: formatFileSize(assetInfo.fileSize || 0),
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

          {/* YouTube Search Card */}
          <Animated.View
            entering={FadeInUp.delay(200)}
            style={{ marginBottom: 20 }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/youtubesearch");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FF0000",
                borderRadius: 16,
                padding: 16,
                shadowColor: "#FF0000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="logo-youtube" size={28} color="white" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: "white", fontSize: 17, fontWeight: "800" }}>
                  YouTube Search
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 }}>
                  Search & download songs/videos
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>

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
