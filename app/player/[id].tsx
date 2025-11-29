import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors, MOVIE_CAST_DATA } from "@/constants/data";

// Sample video URLs for demo purposes
const SAMPLE_VIDEO_URLS: Record<number, string> = {
  // Using Big Buck Bunny as a sample video for all movies
  1: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  2: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  3: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  5: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
};

// Control Button Component
const ControlButton = ({
  icon,
  size = 24,
  onPress,
  style,
}: {
  icon: string;
  size?: number;
  onPress: () => void;
  style?: object;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withSpring(0.8),
      withSpring(1)
    );
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        style={[{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "rgba(255,255,255,0.15)",
          alignItems: "center",
          justifyContent: "center",
        }, style]}
      >
        <Ionicons name={icon as any} size={size} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Progress Bar Component
const ProgressBar = ({
  progress,
  currentTime,
  totalTime,
}: {
  progress: number;
  currentTime: string;
  totalTime: string;
}) => {
  return (
    <View style={{ width: "100%", paddingHorizontal: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>{currentTime}</Text>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <View style={{
            height: 4,
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: 2,
            overflow: "hidden",
          }}>
            <View style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: Colors.primary,
              borderRadius: 2,
            }} />
          </View>
          {/* Buffer indicator */}
          <View style={{
            position: "absolute",
            left: `${progress}%`,
            width: `${Math.min(20, 100 - progress)}%`,
            height: 4,
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 2,
          }} />
        </View>
        <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>{totalTime}</Text>
      </View>
    </View>
  );
};

export default function PlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = Number(params.id);

  const movie = ALL_MOVIES.find((m) => m.id === movieId);
  const movieData = MOVIE_CAST_DATA[movieId];
  
  // Get video URL - use sample video or fall back to first sample
  const videoUrl = SAMPLE_VIDEO_URLS[movieId] || SAMPLE_VIDEO_URLS[1];

  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [totalDuration, setTotalDuration] = useState("00:00");
  const [isMuted, setIsMuted] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [isLoading, setIsLoading] = useState(true);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  const videoRef = useRef<Video>(null);
  const playPulse = useSharedValue(1);

  // Handle screen orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setIsLandscape(window.width > window.height);
    });

    return () => subscription?.remove();
  }, []);

  // Lock to portrait on mount, unlock on unmount
  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const toggleLandscape = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isLandscape) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setIsLandscape(false);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsLandscape(true);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setPositionMillis(status.positionMillis || 0);
      setDurationMillis(status.durationMillis || 0);
      
      if (status.durationMillis && status.durationMillis > 0) {
        setProgress((status.positionMillis || 0) / status.durationMillis * 100);
        setCurrentTime(formatTime(status.positionMillis || 0));
        setTotalDuration(formatTime(status.durationMillis));
      }
    } else {
      setIsLoading(true);
    }
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  // Pulse animation for loading
  useEffect(() => {
    playPulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [playPulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isPlaying ? 1 : playPulse.value }],
  }));

  const handlePlayPause = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!videoRef.current) return;
    
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setShowControls(true);
  };

  const handleSkipForward = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!videoRef.current) return;
    
    const newPosition = Math.min(durationMillis, positionMillis + 10000); // Skip 10 seconds
    await videoRef.current.setPositionAsync(newPosition);
    setShowControls(true);
  };

  const handleSkipBackward = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!videoRef.current) return;
    
    const newPosition = Math.max(0, positionMillis - 10000); // Back 10 seconds
    await videoRef.current.setPositionAsync(newPosition);
    setShowControls(true);
  };

  const handleToggleMute = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!videoRef.current) return;
    
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleBack = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Reset to portrait before navigating back
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    router.back();
  };

  const handleTapScreen = () => {
    setShowControls(!showControls);
  };

  if (!movie) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
        <StatusBar style="light" hidden />
        <Text style={{ color: "white" }}>Movie not found</Text>
      </View>
    );
  }

  const qualities = ["4K", "1080p", "720p", "480p"];

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" hidden />

      {/* Video Player */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTapScreen}
        style={{ flex: 1 }}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={{ flex: 1 }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          isLooping={false}
          isMuted={isMuted}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          posterSource={{ uri: movie.image }}
          usePoster={true}
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
            <Ionicons name="hourglass" size={48} color={Colors.primary} />
            <Text style={{ color: "white", marginTop: 12 }}>Loading video...</Text>
          </View>
        )}

        {/* Controls Overlay */}
        {showControls && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.7)"]}
              locations={[0, 0.5, 1]}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />

            {/* Top Controls */}
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingTop: 50,
              }}
            >
              <TouchableOpacity
                onPress={handleBack}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>

              <View style={{ flex: 1, marginHorizontal: 20 }}>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }} numberOfLines={1}>
                  {movie.title}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>
                  {movieData?.director || "Unknown Director"} • {movie.year}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setShowQualityMenu(!showQualityMenu)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>{selectedQuality}</Text>
                  <Ionicons name="chevron-down" size={14} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleToggleMute}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={20} color="white" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Quality Menu */}
            {showQualityMenu && (
              <Animated.View
                entering={FadeIn.duration(150)}
                exiting={FadeOut.duration(150)}
                style={{
                  position: "absolute",
                  top: 100,
                  right: 80,
                  backgroundColor: "rgba(0,0,0,0.9)",
                  borderRadius: 12,
                  padding: 8,
                  minWidth: 120,
                }}
              >
                {qualities.map((quality) => (
                  <TouchableOpacity
                    key={quality}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedQuality(quality);
                      setShowQualityMenu(false);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      backgroundColor: selectedQuality === quality ? "rgba(139, 92, 246, 0.3)" : "transparent",
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{
                      color: selectedQuality === quality ? Colors.primary : "white",
                      fontSize: 14,
                      fontWeight: selectedQuality === quality ? "700" : "500",
                    }}>
                      {quality}
                    </Text>
                    {selectedQuality === quality && (
                      <Ionicons name="checkmark" size={18} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}

            {/* Center Play/Pause Controls */}
            <View style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 48,
            }}>
              <ControlButton
                icon="play-back"
                onPress={handleSkipBackward}
              />
              <Animated.View style={pulseStyle}>
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
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={36}
                    color="white"
                    style={{ marginLeft: isPlaying ? 0 : 4 }}
                  />
                </TouchableOpacity>
              </Animated.View>
              <ControlButton
                icon="play-forward"
                onPress={handleSkipForward}
              />
            </View>

            {/* Bottom Controls */}
            <Animated.View
              entering={FadeInUp.duration(300)}
              style={{ paddingBottom: 40 }}
            >
              <ProgressBar
                progress={progress}
                currentTime={currentTime}
                totalTime={totalDuration}
              />

              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                marginTop: 12,
              }}>
                <View style={{ flexDirection: "row", gap: 16 }}>
                  <TouchableOpacity
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                  >
                    <Ionicons name="text" size={20} color="white" />
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>Subtitles</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                  >
                    <Ionicons name="language" size={20} color="white" />
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>Audio</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", gap: 16 }}>
                  <TouchableOpacity
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <Ionicons name="tv-outline" size={22} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={toggleLandscape}
                  >
                    <Ionicons name={isLandscape ? "phone-portrait" : "phone-landscape"} size={22} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </View>
  );
}
