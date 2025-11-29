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

// Equalizer Bar Animation Component for Audio Player
const AudioEqualizerBar = ({ isPlaying, delay }: { isPlaying: boolean; delay: number }) => {
  const barHeight = React.useRef(new Animated.Value(0.2)).current;
  
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        Animated.sequence([
          Animated.timing(barHeight, {
            toValue: Math.random() * 0.8 + 0.2,
            duration: 150 + delay,
            useNativeDriver: false,
          }),
          Animated.timing(barHeight, {
            toValue: Math.random() * 0.5 + 0.1,
            duration: 150 + delay,
            useNativeDriver: false,
          }),
        ]).start(() => animate());
      };
      animate();
    } else {
      Animated.timing(barHeight, {
        toValue: 0.15,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isPlaying, delay, barHeight]);

  return (
    <View
      style={{
        width: 4,
        height: 40,
        marginHorizontal: 2,
        borderRadius: 2,
        backgroundColor: Colors.primary,
        opacity: 0.8,
      }}
    />
  );
};

// Audio Player Modal Component - Enhanced Premium UI
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
  const [volume, setVolume] = useState(1.0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

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

  const handleSkip = async (seconds: number) => {
    if (!sound || duration === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPosition = Math.max(0, Math.min(duration, position + seconds * 1000));
    await sound.setPositionAsync(newPosition);
  };

  const handleVolumeChange = async (newVolume: number) => {
    if (!sound) return;
    setVolume(newVolume);
    await sound.setVolumeAsync(newVolume);
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
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.98)" }}>
        <LinearGradient
          colors={["#1a1a2e", "#16213e", "#0f3460", "#1a1a2e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {/* Animated Background Circles */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
            <Animated.View
              entering={FadeIn.duration(1000)}
              style={{
                position: "absolute",
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: 150,
                backgroundColor: `${Colors.primary}15`,
              }}
            />
            <Animated.View
              entering={FadeIn.delay(200).duration(1000)}
              style={{
                position: "absolute",
                bottom: 100,
                left: -80,
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: `${Colors.secondary}10`,
              }}
            />
          </View>

          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
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
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Ionicons name="chevron-down" size={28} color="white" />
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600", letterSpacing: 1 }}>
                NOW PLAYING
              </Text>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "700", marginTop: 2 }}>
                Local Audio
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowVolumeSlider(!showVolumeSlider);
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>

          {/* Volume Slider (Collapsible) */}
          {showVolumeSlider && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={{
                paddingHorizontal: 40,
                paddingVertical: 16,
                backgroundColor: "rgba(0,0,0,0.3)",
                marginHorizontal: 20,
                borderRadius: 16,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="volume-low" size={20} color="rgba(255,255,255,0.6)" />
                <View style={{ flex: 1, height: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2, marginHorizontal: 12 }}>
                  <View style={{ width: `${volume * 100}%`, height: "100%", backgroundColor: Colors.primary, borderRadius: 2 }} />
                </View>
                <Ionicons name="volume-high" size={20} color="rgba(255,255,255,0.6)" />
              </View>
            </Animated.View>
          )}

          {/* Album Art with Glow Effect */}
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
          >
            <View
              style={{
                width: screenWidth * 0.8,
                height: screenWidth * 0.8,
                borderRadius: 30,
                backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 40,
                elevation: 20,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              {media.thumbnail ? (
                <Image
                  source={{ uri: media.thumbnail }}
                  style={{ width: "100%", height: "100%", borderRadius: 30 }}
                  contentFit="cover"
                />
              ) : (
                <LinearGradient
                  colors={[Colors.primary, Colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 30,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="musical-notes" size={100} color="white" />
                  {/* Animated Equalizer */}
                  {isPlaying && (
                    <View style={{ flexDirection: "row", marginTop: 20, height: 50, alignItems: "flex-end" }}>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <View
                          key={i}
                          style={{
                            width: 6,
                            height: 15 + Math.random() * 30,
                            backgroundColor: "rgba(255,255,255,0.8)",
                            marginHorizontal: 2,
                            borderRadius: 3,
                          }}
                        />
                      ))}
                    </View>
                  )}
                </LinearGradient>
              )}
              {/* Vinyl Record Effect Overlay */}
              <View
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#1a1a1a",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: "#333",
                }}
              >
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary }} />
              </View>
            </View>
          </Animated.View>

          {/* Song Info */}
          <Animated.View entering={FadeInUp.delay(300).springify()} style={{ paddingHorizontal: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1, marginRight: 16 }}>
                <Text
                  style={{ color: "white", fontSize: 26, fontWeight: "900", letterSpacing: -0.5 }}
                  numberOfLines={2}
                >
                  {media.name.replace(/\.[^/.]+$/, "")}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginTop: 6, fontWeight: "500" }}>
                  {media.size} • Local File
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setIsLiked(!isLiked);
                }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: isLiked ? `${Colors.secondary}30` : "rgba(255,255,255,0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={28}
                  color={isLiked ? Colors.secondary : "white"}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Progress Bar */}
          <Animated.View entering={FadeInUp.delay(400).springify()} style={{ paddingHorizontal: 30, marginTop: 32 }}>
            <View
              style={{
                height: 6,
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  borderRadius: 3,
                }}
              />
              {/* Progress Thumb */}
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
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600" }}>
                {formatTime(position)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600" }}>
                -{formatTime(duration - position)}
              </Text>
            </View>
          </Animated.View>

          {/* Main Controls */}
          <Animated.View
            entering={FadeInUp.delay(500).springify()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 24,
              gap: 20,
            }}
          >
            {/* Shuffle */}
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="shuffle" size={24} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            {/* Previous / Skip Back */}
            <TouchableOpacity
              onPress={() => handleSkip(-15)}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Ionicons name="play-back" size={28} color="white" />
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, position: "absolute", bottom: 8 }}>15</Text>
            </TouchableOpacity>

            {/* Play/Pause */}
            <TouchableOpacity
              onPress={handlePlayPause}
              disabled={isLoading}
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isLoading ? (
                  <Ionicons name="hourglass" size={40} color="white" />
                ) : (
                  <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="white" style={{ marginLeft: isPlaying ? 0 : 4 }} />
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Next / Skip Forward */}
            <TouchableOpacity
              onPress={() => handleSkip(15)}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Ionicons name="play-forward" size={28} color="white" />
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, position: "absolute", bottom: 8 }}>15</Text>
            </TouchableOpacity>

            {/* Repeat */}
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="repeat" size={24} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom Actions */}
          <Animated.View
            entering={FadeInUp.delay(600).springify()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              paddingHorizontal: 40,
              paddingBottom: 50,
              paddingTop: 8,
            }}
          >
            <TouchableOpacity style={{ alignItems: "center" }}>
              <Ionicons name="share-outline" size={24} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowVolumeSlider(!showVolumeSlider)}
              style={{ alignItems: "center" }}
            >
              <Ionicons name="volume-medium" size={24} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>Volume</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }}>
              <Ionicons name="list" size={24} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>Queue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }}>
              <Ionicons name="tv-outline" size={24} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>Cast</Text>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

// Video Player Modal Component - Enhanced Premium UI
const VideoPlayerModal = ({
  visible,
  media,
  onClose,
}: {
  visible: boolean;
  media: LocalMedia | null;
  onClose: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (showControls && isPlaying && !isLocked) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying, isLocked]);

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

  const handleSeek = async (seconds: number) => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const seekAmount = seconds * 1000;
    const newPosition = position + seekAmount;
    await videoRef.current.setPositionAsync(Math.max(0, Math.min(duration, newPosition)));
  };

  const handleMute = async () => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  const handlePlaybackRate = async (rate: number) => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await videoRef.current.setRateAsync(rate, true);
    setPlaybackRate(rate);
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

  if (!media) return null;

  const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
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
            rate={playbackRate}
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
                  backgroundColor: "rgba(0,0,0,0.7)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="hourglass" size={40} color={Colors.primary} />
              </View>
              <Text style={{ color: "white", marginTop: 12, fontSize: 14, fontWeight: "600" }}>Loading...</Text>
            </View>
          )}

          {/* Lock Screen Indicator */}
          {isLocked && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsLocked(false);
                setShowControls(true);
              }}
              style={{
                position: "absolute",
                top: 60,
                left: 20,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.6)",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
              }}
            >
              <Ionicons name="lock-closed" size={18} color="white" />
              <Text style={{ color: "white", fontSize: 13, marginLeft: 8, fontWeight: "600" }}>Tap to unlock</Text>
            </TouchableOpacity>
          )}

          {/* Controls Overlay */}
          {showControls && !isLocked && (
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
              {/* Top Bar */}
              <LinearGradient
                colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.4)", "transparent"]}
                style={{
                  paddingHorizontal: 20,
                  paddingTop: 56,
                  paddingBottom: 40,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <TouchableOpacity
                    onPress={onClose}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Ionicons name="arrow-back" size={26} color="white" />
                  </TouchableOpacity>
                  
                  <View style={{ flex: 1, marginHorizontal: 16 }}>
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }} numberOfLines={1}>
                      {media.name.replace(/\.[^/.]+$/, "")}
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}>
                      {media.size} • {media.duration || "Local Video"}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    {/* Speed Button */}
                    <TouchableOpacity
                      onPress={() => setShowSpeedMenu(!showSpeedMenu)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 13, fontWeight: "700" }}>{playbackRate}x</Text>
                    </TouchableOpacity>

                    {/* Lock Button */}
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setIsLocked(true);
                        setShowControls(false);
                      }}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <Ionicons name="lock-open" size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Speed Menu */}
                {showSpeedMenu && (
                  <Animated.View
                    entering={FadeIn.duration(150)}
                    style={{
                      position: "absolute",
                      top: 110,
                      right: 80,
                      backgroundColor: "rgba(0,0,0,0.95)",
                      borderRadius: 16,
                      padding: 8,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    {playbackRates.map((rate) => (
                      <TouchableOpacity
                        key={rate}
                        onPress={() => handlePlaybackRate(rate)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingVertical: 12,
                          paddingHorizontal: 20,
                          backgroundColor: playbackRate === rate ? `${Colors.primary}30` : "transparent",
                          borderRadius: 10,
                          minWidth: 120,
                        }}
                      >
                        <Text
                          style={{
                            color: playbackRate === rate ? Colors.primary : "white",
                            fontSize: 15,
                            fontWeight: playbackRate === rate ? "700" : "500",
                          }}
                        >
                          {rate}x
                        </Text>
                        {playbackRate === rate && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
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
                {/* Skip Back 10s */}
                <TouchableOpacity
                  onPress={() => handleSeek(-10)}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Ionicons name="play-back" size={32} color="white" />
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, position: "absolute", bottom: 8, fontWeight: "600" }}>10</Text>
                </TouchableOpacity>

                {/* Play/Pause */}
                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 44,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.5,
                    shadowRadius: 16,
                    elevation: 10,
                  }}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={isPlaying ? "pause" : "play"}
                      size={44}
                      color="white"
                      style={{ marginLeft: isPlaying ? 0 : 5 }}
                    />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Skip Forward 10s */}
                <TouchableOpacity
                  onPress={() => handleSeek(10)}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Ionicons name="play-forward" size={32} color="white" />
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, position: "absolute", bottom: 8, fontWeight: "600" }}>10</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Controls */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.85)"]}
                style={{ paddingHorizontal: 20, paddingBottom: 50, paddingTop: 40 }}
              >
                {/* Progress Bar */}
                <View style={{ marginBottom: 16 }}>
                  <View
                    style={{
                      height: 5,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: 3,
                      overflow: "visible",
                    }}
                  >
                    {/* Buffer indicator */}
                    <View
                      style={{
                        position: "absolute",
                        left: `${progress * 100}%`,
                        width: `${Math.min(10, 100 - progress * 100)}%`,
                        height: "100%",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        borderRadius: 3,
                      }}
                    />
                    {/* Progress */}
                    <LinearGradient
                      colors={[Colors.primary, Colors.secondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        height: "100%",
                        width: `${progress * 100}%`,
                        borderRadius: 3,
                      }}
                    />
                    {/* Thumb */}
                    <View
                      style={{
                        position: "absolute",
                        left: `${progress * 100}%`,
                        top: -6,
                        width: 17,
                        height: 17,
                        borderRadius: 9,
                        backgroundColor: "white",
                        marginLeft: -8,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
                    <Text style={{ color: "white", fontSize: 13, fontWeight: "600" }}>{formatTime(position)}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600" }}>-{formatTime(duration - position)}</Text>
                  </View>
                </View>

                {/* Bottom Actions */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", gap: 24 }}>
                    {/* Mute Toggle */}
                    <TouchableOpacity onPress={handleMute} style={{ alignItems: "center" }}>
                      <Ionicons
                        name={isMuted ? "volume-mute" : "volume-high"}
                        size={24}
                        color={isMuted ? Colors.secondary : "white"}
                      />
                    </TouchableOpacity>
                    
                    {/* Subtitles */}
                    <TouchableOpacity style={{ alignItems: "center" }}>
                      <Ionicons name="text" size={24} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: "row", gap: 24 }}>
                    {/* Cast */}
                    <TouchableOpacity style={{ alignItems: "center" }}>
                      <Ionicons name="tv-outline" size={24} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                    
                    {/* Fullscreen */}
                    <TouchableOpacity style={{ alignItems: "center" }}>
                      <Ionicons name="expand" size={24} color="rgba(255,255,255,0.7)" />
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
