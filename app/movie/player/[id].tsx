import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { ALL_MOVIES, FEATURED_MOVIE } from "@/constants/data";
import { useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Progress Bar Component
const ProgressBar = ({
  progress,
  duration,
  currentTime,
  onSeek,
  theme,
}: {
  progress: number;
  duration: string;
  currentTime: string;
  onSeek: (value: number) => void;
  theme: any;
}) => {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Text style={{ color: "white", fontSize: 12, fontWeight: "500", minWidth: 40 }}>
          {currentTime}
        </Text>
        <TouchableOpacity
          style={{ flex: 1, height: 24, justifyContent: "center" }}
          onPress={(e) => {
            const { locationX } = e.nativeEvent;
            const percentage = locationX / (width - 120);
            onSeek(Math.max(0, Math.min(1, percentage)));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <View style={{ height: 4, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 2 }}>
            <View
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                backgroundColor: theme.primary,
                borderRadius: 2,
              }}
            />
            <View
              style={{
                position: "absolute",
                right: `${(1 - progress) * 100}%`,
                top: -6,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: theme.primary,
                marginRight: -8,
              }}
            />
          </View>
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 12, fontWeight: "500", minWidth: 40, textAlign: "right" }}>
          {duration}
        </Text>
      </View>
    </View>
  );
};

// Control Button
const ControlButton = ({
  icon,
  size = 32,
  onPress,
  disabled = false,
}: {
  icon: string;
  size?: number;
  onPress: () => void;
  disabled?: boolean;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.8);
    setTimeout(() => {
      scale.value = withSpring(1);
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={{
          width: size + 20,
          height: size + 20,
          borderRadius: (size + 20) / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Ionicons
          name={icon as any}
          size={size}
          color={disabled ? "rgba(255,255,255,0.3)" : "white"}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function MoviePlayerScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = Number(params.id);

  // Find movie
  const movie = ALL_MOVIES.find((m) => m.id === movieId) || FEATURED_MOVIE;

  // State
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0.35);
  const [isMuted, setIsMuted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const controlsOpacity = useSharedValue(1);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying && !isLocked) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying, isLocked]);

  useEffect(() => {
    controlsOpacity.value = withTiming(showControls ? 1 : 0, { duration: 300 });
  }, [showControls, controlsOpacity]);

  // Simulate progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isLocked) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 1;
          }
          return prev + 0.001;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isLocked]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Parse duration
  const durationParts = movie.duration.match(/(\d+)h\s*(\d+)m/);
  const totalSeconds = durationParts
    ? parseInt(durationParts[1]) * 3600 + parseInt(durationParts[2]) * 60
    : 7200;
  const currentSeconds = Math.floor(progress * totalSeconds);

  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  const handleTap = () => {
    if (!isLocked) {
      setShowControls(!showControls);
    }
  };

  const skipForward = () => {
    setProgress((prev) => Math.min(1, prev + 10 / totalSeconds));
  };

  const skipBackward = () => {
    setProgress((prev) => Math.max(0, prev - 10 / totalSeconds));
  };

  if (isLocked) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar hidden />
        <TouchableOpacity
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsLocked(false);
            setShowControls(true);
          }}
        >
          <Image
            source={{ uri: movie.image }}
            style={{ position: "absolute", width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }} />
          <Animated.View entering={FadeIn}>
            <View style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 24,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}>
              <Ionicons name="lock-closed" size={20} color="white" />
              <Text style={{ color: "white", fontWeight: "600" }}>Tap to unlock</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar hidden />

      {/* Video Background (Movie Poster as placeholder) */}
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={handleTap}
      >
        <Image
          source={{ uri: movie.image }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />

        {/* Dark overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "transparent", "transparent", "rgba(0,0,0,0.7)"]}
          locations={[0, 0.2, 0.8, 1]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Controls Overlay */}
        {showControls && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, controlsStyle]}
          >
            {/* Top Bar */}
            <Animated.View
              entering={FadeInDown.delay(100)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 50,
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.back();
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="chevron-down" size={24} color="white" />
              </TouchableOpacity>

              <View style={{ flex: 1, marginHorizontal: 16 }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "700", textAlign: "center" }} numberOfLines={1}>
                  {movie.title}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, textAlign: "center", marginTop: 2 }}>
                  {movie.year} • {movie.genre}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsMuted(!isMuted);
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "rgba(255,255,255,0.2)",
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
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="lock-open" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Center Controls */}
            <View style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
            }}>
              <ControlButton icon="play-back" size={28} onPress={skipBackward} />
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  setIsPlaying(!isPlaying);
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: theme.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: theme.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={40}
                  color="white"
                  style={{ marginLeft: isPlaying ? 0 : 4 }}
                />
              </TouchableOpacity>
              <ControlButton icon="play-forward" size={28} onPress={skipForward} />
            </View>

            {/* Bottom Bar */}
            <Animated.View entering={FadeInDown.delay(100)} style={{ paddingBottom: 40 }}>
              <ProgressBar
                progress={progress}
                duration={movie.duration}
                currentTime={formatTime(currentSeconds)}
                onSeek={setProgress}
                theme={theme}
              />

              {/* Bottom Actions */}
              <View style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingHorizontal: 20,
              }}>
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Ionicons name="chatbubble-outline" size={22} color="white" />
                  <Text style={{ color: "white", fontSize: 10, marginTop: 4 }}>Subtitles</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Ionicons name="language" size={22} color="white" />
                  <Text style={{ color: "white", fontSize: 10, marginTop: 4 }}>Audio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Ionicons name="settings-outline" size={22} color="white" />
                  <Text style={{ color: "white", fontSize: 10, marginTop: 4 }}>Quality</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Ionicons name="expand" size={22} color="white" />
                  <Text style={{ color: "white", fontSize: 10, marginTop: 4 }}>Fullscreen</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        )}

        {/* Loading indicator when not showing controls */}
        {!showControls && isPlaying && (
          <View style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
          }}>
            <View style={{ height: 3, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
              <View
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  backgroundColor: theme.primary,
                  borderRadius: 2,
                }}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
