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
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
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

// Audio Player Modal Component - Enhanced UI with visualizer and more controls
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
  const [isLiked, setIsLiked] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one">("off");
  const [volume, setVolume] = useState(1.0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Animated values for visualizer
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 300 });
    }
  }, [isPlaying, pulseAnim]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      
      // Handle repeat
      if (status.didJustFinish && repeatMode === "one") {
        sound?.setPositionAsync(0);
        sound?.playAsync();
      }
    }
  }, [repeatMode, sound]);

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
          { shouldPlay: true, volume: volume },
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
  }, [visible, media?.uri, onPlaybackStatusUpdate, volume]);

  const handlePlayPause = async () => {
    if (!sound) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleProgressTouch = async (touchX: number, trackWidth: number) => {
    if (!sound || duration === 0) return;
    const progress = Math.max(0, Math.min(1, touchX / trackWidth));
    const newPosition = progress * duration;
    await sound.setPositionAsync(newPosition);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleVolumeChange = async (newVolume: number) => {
    if (!sound) return;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    await sound.setVolumeAsync(clampedVolume);
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

  const handleSkipBack = async () => {
    if (!sound) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPosition = Math.max(0, position - 15000); // 15 seconds back
    await sound.setPositionAsync(newPosition);
  };

  const handleSkipForward = async () => {
    if (!sound) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPosition = Math.min(duration, position + 15000); // 15 seconds forward
    await sound.setPositionAsync(newPosition);
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
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.98)" }}>
        <LinearGradient
          colors={["#1e1b4b", "#0f172a", "#020617"]}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(300)}
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
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.05)",
              }}
            >
              <Ionicons name="chevron-down" size={26} color="white" />
            </TouchableOpacity>
            
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "500" }}>
                NOW PLAYING
              </Text>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginTop: 2 }}>
                Local Audio
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
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.05)",
              }}
            >
              <Ionicons 
                name={volume === 0 ? "volume-mute" : volume < 0.5 ? "volume-low" : "volume-high"} 
                size={22} 
                color="white" 
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Volume Slider (conditionally shown) */}
          {showVolumeSlider && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={{
                paddingHorizontal: 40,
                paddingVertical: 16,
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                marginHorizontal: 20,
                borderRadius: 16,
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Ionicons name="volume-low" size={20} color="rgba(255,255,255,0.6)" />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={(e) => {
                    const { locationX } = e.nativeEvent;
                    handleVolumeChange(locationX / (screenWidth - 140));
                  }}
                  style={{ flex: 1, height: 40, justifyContent: "center" }}
                >
                  <View style={{ height: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
                    <View 
                      style={{ 
                        height: "100%", 
                        width: `${volume * 100}%`, 
                        backgroundColor: Colors.primary,
                        borderRadius: 2,
                      }} 
                    />
                  </View>
                </TouchableOpacity>
                <Ionicons name="volume-high" size={20} color="rgba(255,255,255,0.6)" />
              </View>
            </Animated.View>
          )}

          {/* Album Art with animated glow */}
          <Animated.View 
            entering={FadeInUp.delay(100).duration(400)}
            style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 }}
          >
            {/* Glow effect behind album art */}
            <View
              style={{
                position: "absolute",
                width: screenWidth * 0.7,
                height: screenWidth * 0.7,
                borderRadius: screenWidth * 0.35,
                backgroundColor: Colors.primary,
                opacity: isPlaying ? 0.15 : 0.05,
              }}
            />
            
            <Animated.View style={pulseStyle}>
              <View
                style={{
                  width: screenWidth * 0.75,
                  height: screenWidth * 0.75,
                  borderRadius: 24,
                  backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: Colors.primary,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: isPlaying ? 0.4 : 0.2,
                  shadowRadius: 30,
                  elevation: 15,
                  overflow: "hidden",
                }}
              >
                {media.thumbnail ? (
                  <Image
                    source={{ uri: media.thumbnail }}
                    style={{ width: "100%", height: "100%", borderRadius: 24 }}
                    contentFit="cover"
                  />
                ) : (
                  <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <View
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        backgroundColor: `${Colors.primary}20`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="musical-notes" size={64} color={Colors.primary} />
                    </View>
                    
                    {/* Animated bars for visualizer effect */}
                    {isPlaying && (
                      <View style={{ flexDirection: "row", marginTop: 20, gap: 4 }}>
                        {[...Array(7)].map((_, i) => (
                          <Animated.View
                            key={i}
                            style={{
                              width: 6,
                              height: 30 + Math.random() * 20,
                              backgroundColor: Colors.primary,
                              borderRadius: 3,
                              opacity: 0.7,
                            }}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </Animated.View>
          </Animated.View>

          {/* Song Info */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(400)}
            style={{ paddingHorizontal: 30 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1, marginRight: 16 }}>
                <Text
                  style={{ color: "white", fontSize: 24, fontWeight: "800" }}
                  numberOfLines={2}
                >
                  {media.name.replace(/\.[^/.]+$/, "")}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginTop: 6 }}>
                  {media.size} • {media.duration || "Local File"}
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
                  color={isLiked ? Colors.secondary : "rgba(255,255,255,0.6)"}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Progress Bar - Enhanced */}
          <Animated.View 
            entering={FadeInUp.delay(300).duration(400)}
            style={{ paddingHorizontal: 30, marginTop: 32 }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => {
                const { locationX } = e.nativeEvent;
                handleProgressTouch(locationX, screenWidth - 60);
              }}
              style={{ height: 40, justifyContent: "center" }}
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
                {/* Thumb */}
                <View
                  style={{
                    position: "absolute",
                    left: `${progress * 100}%`,
                    top: -6,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: "white",
                    marginLeft: -9,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                />
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "500" }}>
                {formatTime(position)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "500" }}>
                -{formatTime(duration - position)}
              </Text>
            </View>
          </Animated.View>

          {/* Main Controls */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(400)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 24,
              gap: 20,
            }}
          >
            {/* Repeat Button */}
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setRepeatMode(repeatMode === "off" ? "one" : "off");
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: repeatMode === "one" ? `${Colors.primary}30` : "rgba(255,255,255,0.08)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons 
                name={repeatMode === "one" ? "repeat" : "repeat-outline"} 
                size={22} 
                color={repeatMode === "one" ? Colors.primary : "rgba(255,255,255,0.6)"} 
              />
            </TouchableOpacity>

            {/* Skip Back 15s */}
            <TouchableOpacity
              onPress={handleSkipBack}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.05)",
              }}
            >
              <Ionicons name="play-back" size={24} color="white" />
              <Text style={{ color: "white", fontSize: 9, fontWeight: "600", marginTop: -2 }}>15</Text>
            </TouchableOpacity>

            {/* Play/Pause Button */}
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
                <Ionicons name="reload" size={36} color="white" />
              ) : (
                <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="white" />
              )}
            </TouchableOpacity>

            {/* Skip Forward 15s */}
            <TouchableOpacity
              onPress={handleSkipForward}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.05)",
              }}
            >
              <Ionicons name="play-forward" size={24} color="white" />
              <Text style={{ color: "white", fontSize: 9, fontWeight: "600", marginTop: -2 }}>15</Text>
            </TouchableOpacity>

            {/* Shuffle placeholder */}
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.08)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="shuffle-outline" size={22} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom Actions */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(400)}
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
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ alignItems: "center" }}
            >
              <Ionicons name="share-outline" size={22} color="rgba(255,255,255,0.6)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ alignItems: "center" }}
            >
              <Ionicons name="add-circle-outline" size={22} color="rgba(255,255,255,0.6)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>Playlist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ alignItems: "center" }}
            >
              <Ionicons name="information-circle-outline" size={22} color="rgba(255,255,255,0.6)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>Info</Text>
            </TouchableOpacity>
          </Animated.View>
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
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (showControls && isPlaying && !showSpeedOptions) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying, showSpeedOptions]);

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

  const handleProgressSeek = async (touchX: number, trackWidth: number) => {
    if (!videoRef.current || duration === 0) return;
    const progress = Math.max(0, Math.min(1, touchX / trackWidth));
    const newPosition = progress * duration;
    await videoRef.current.setPositionAsync(newPosition);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleMuteToggle = async () => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = async (speed: number) => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await videoRef.current.setRateAsync(speed, true);
    setPlaybackSpeed(speed);
    setShowSpeedOptions(false);
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

  if (!media) return null;

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar style="light" hidden />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setShowControls(!showControls);
            setShowSpeedOptions(false);
          }}
          style={{ flex: 1 }}
        >
          <Video
            ref={videoRef}
            source={{ uri: media.uri }}
            style={{ flex: 1 }}
            resizeMode={isFullscreen ? ResizeMode.CONTAIN : ResizeMode.COVER}
            shouldPlay={true}
            isLooping={false}
            isMuted={isMuted}
            rate={playbackSpeed}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />

          {/* Loading Indicator with spinner animation */}
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
                  backgroundColor: "rgba(139, 92, 246, 0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="reload" size={40} color={Colors.primary} />
              </View>
              <Text style={{ color: "white", marginTop: 16, fontSize: 14, fontWeight: "500" }}>
                Loading video...
              </Text>
            </View>
          )}

          {/* Controls Overlay */}
          {showControls && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              {/* Top Bar with gradient */}
              <LinearGradient
                colors={["rgba(0,0,0,0.9)", "rgba(0,0,0,0.6)", "transparent"]}
                style={{
                  paddingHorizontal: 16,
                  paddingTop: 50,
                  paddingBottom: 40,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={onClose}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Ionicons name="chevron-down" size={26} color="white" />
                  </TouchableOpacity>
                  
                  <View style={{ flex: 1, marginHorizontal: 16 }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "700",
                      }}
                      numberOfLines={1}
                    >
                      {media.name}
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}>
                      {media.type === "video" ? "Video" : "Audio"} • {media.size}
                    </Text>
                  </View>

                  {/* Top Right Actions */}
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => setShowSpeedOptions(!showSpeedOptions)}
                      style={{
                        height: 36,
                        paddingHorizontal: 12,
                        borderRadius: 18,
                        backgroundColor: playbackSpeed !== 1.0 ? Colors.primary : "rgba(255,255,255,0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
                        {playbackSpeed}x
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setIsFullscreen(!isFullscreen);
                      }}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <Ionicons
                        name={isFullscreen ? "contract" : "expand"}
                        size={22}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Speed Options Dropdown */}
                {showSpeedOptions && (
                  <Animated.View
                    entering={FadeInDown.duration(200)}
                    style={{
                      position: "absolute",
                      top: 100,
                      right: 60,
                      backgroundColor: "rgba(30, 41, 59, 0.98)",
                      borderRadius: 16,
                      padding: 8,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.1)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.4,
                      shadowRadius: 16,
                      elevation: 10,
                    }}
                  >
                    {speedOptions.map((speed) => (
                      <TouchableOpacity
                        key={speed}
                        onPress={() => handleSpeedChange(speed)}
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 20,
                          backgroundColor: playbackSpeed === speed ? Colors.primary : "transparent",
                          borderRadius: 10,
                          marginVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: playbackSpeed === speed ? "700" : "500",
                            fontSize: 15,
                            textAlign: "center",
                          }}
                        >
                          {speed}x {speed === 1.0 ? "(Normal)" : ""}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                )}
              </LinearGradient>

              {/* Center Controls */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 50,
                }}
              >
                {/* Rewind 10s */}
                <TouchableOpacity
                  onPress={() => handleSeek(false)}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Ionicons name="play-back" size={28} color="white" />
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "600", marginTop: -2 }}>
                    10s
                  </Text>
                </TouchableOpacity>

                {/* Play/Pause Button */}
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
                  <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="white" />
                </TouchableOpacity>

                {/* Forward 10s */}
                <TouchableOpacity
                  onPress={() => handleSeek(true)}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Ionicons name="play-forward" size={28} color="white" />
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "600", marginTop: -2 }}>
                    10s
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Controls with gradient */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)"]}
                style={{ paddingHorizontal: 20, paddingBottom: 50, paddingTop: 40 }}
              >
                {/* Progress Bar - Enhanced */}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={(e) => {
                    const { locationX } = e.nativeEvent;
                    handleProgressSeek(locationX, screenWidth - 40);
                  }}
                  style={{
                    height: 32,
                    justifyContent: "center",
                    marginBottom: 4,
                  }}
                >
                  <View
                    style={{
                      height: 6,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: 3,
                      overflow: "visible",
                    }}
                  >
                    {/* Buffer indicator (simulated) */}
                    <View
                      style={{
                        position: "absolute",
                        height: "100%",
                        width: `${Math.min(progress * 100 + 10, 100)}%`,
                        backgroundColor: "rgba(255,255,255,0.3)",
                        borderRadius: 3,
                      }}
                    />
                    {/* Progress */}
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
                        backgroundColor: Colors.primary,
                        marginLeft: -8,
                        shadowColor: Colors.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    />
                  </View>
                </TouchableOpacity>

                {/* Time and Controls Row */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: "white", fontSize: 13, fontWeight: "600" }}>
                      {formatTime(position)}
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginHorizontal: 4 }}>
                      /
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                      {formatTime(duration)}
                    </Text>
                  </View>

                  {/* Bottom Right Actions */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                    <TouchableOpacity onPress={handleMuteToggle} style={{ padding: 4 }}>
                      <Ionicons
                        name={isMuted ? "volume-mute" : "volume-high"}
                        size={24}
                        color={isMuted ? Colors.secondary : "white"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
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

          {/* YouTube Search Option - NEW */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onYouTubeSearch();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(239, 68, 68, 0.3)",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="logo-youtube" size={28} color="#ef4444" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 17 }}>
                Search YouTube
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
                Find songs & videos to download
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#ef4444" />
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
        onYouTubeSearch={() => {
          setShowUploadModal(false);
          router.push("/youtubesearch");
        }}
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
