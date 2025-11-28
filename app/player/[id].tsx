import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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

  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isMuted, setIsMuted] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get("window"));

  const playPulse = useSharedValue(1);

  // Handle screen orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenDimensions(window);
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

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const newProgress = prev + 0.1;
          const totalSeconds = Math.floor(newProgress * 1.66 * 60); // Simulated 166 min movie
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          setCurrentTime(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

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
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isPlaying ? 1 : playPulse.value }],
  }));

  const handlePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const handleSkipForward = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setProgress((prev) => Math.min(100, prev + 5));
    setShowControls(true);
  };

  const handleSkipBackward = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setProgress((prev) => Math.max(0, prev - 5));
    setShowControls(true);
  };

  const handleToggleMute = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

      {/* Video Background (Simulated) */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTapScreen}
        style={{ flex: 1 }}
      >
        <Image
          source={{ uri: movie.image }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.6)"]}
          locations={[0, 0.5, 1]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

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
                totalTime={movie.duration.replace("h ", ":").replace("m", "")}
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

        {/* Loading/Buffering Indicator (shown briefly when video loads) */}
        {progress === 0 && (
          <View style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -25,
            marginLeft: -25,
          }}>
            <Animated.View
              style={[{
                width: 50,
                height: 50,
                borderRadius: 25,
                borderWidth: 3,
                borderColor: "transparent",
                borderTopColor: Colors.primary,
              }]}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
