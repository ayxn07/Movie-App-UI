import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import * as Haptics from "expo-haptics";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp } from "@/context";

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
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={size} color="white" />
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
  onSeek?: (progress: number) => void;
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
        </View>
        <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>{totalTime}</Text>
      </View>
    </View>
  );
};

export default function LocalVideoPlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const videoUri = decodeURIComponent(params.uri as string);
  const videoName = params.name as string || "Unknown Video";
  const { showToast } = useApp();

  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [totalTime, setTotalTime] = useState("00:00");
  const [isMuted, setIsMuted] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Auto-hide controls
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      
      if (status.durationMillis) {
        setTotalTime(formatTime(status.durationMillis));
        const progressPercent = ((status.positionMillis || 0) / status.durationMillis) * 100;
        setProgress(progressPercent);
      }
      
      setCurrentTime(formatTime(status.positionMillis || 0));

      if (status.didJustFinish) {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime("00:00");
      }
    } else {
      if (status.error) {
        showToast(`Error: ${status.error}`, "error");
      }
    }
  }, [showToast]);

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

  const handlePlayPause = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
    setShowControls(true);
  };

  const handleSkipForward = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded && status.positionMillis !== undefined) {
        const newPosition = Math.min(status.positionMillis + 10000, status.durationMillis || 0);
        await videoRef.current.setPositionAsync(newPosition);
      }
    }
    setShowControls(true);
  };

  const handleSkipBackward = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded && status.positionMillis !== undefined) {
        const newPosition = Math.max(status.positionMillis - 10000, 0);
        await videoRef.current.setPositionAsync(newPosition);
      }
    }
    setShowControls(true);
  };

  const handleToggleMute = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleBack = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    if (videoRef.current) {
      await videoRef.current.unloadAsync();
    }
    router.back();
  };

  const handleTapScreen = () => {
    setShowControls(!showControls);
  };

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
          source={{ uri: videoUri }}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "#000" }
          ]}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          isMuted={isMuted}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onError={(error) => {
            console.error("Video error:", error);
            showToast("Failed to load video", "error");
          }}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}>
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 3,
              borderColor: "transparent",
              borderTopColor: Colors.primary,
            }} />
            <Text style={{ color: "white", marginTop: 16 }}>Loading video...</Text>
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
              backgroundColor: "rgba(0,0,0,0.4)",
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
                paddingTop: isLandscape ? 20 : 50,
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
                  {videoName}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>
                  Local Video
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
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
              <ControlButton
                icon="play-forward"
                onPress={handleSkipForward}
              />
            </View>

            {/* Bottom Controls */}
            <Animated.View
              entering={FadeInUp.duration(300)}
              style={{ paddingBottom: isLandscape ? 20 : 40 }}
            >
              <ProgressBar
                progress={progress}
                currentTime={currentTime}
                totalTime={totalTime}
              />

              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingHorizontal: 20,
                marginTop: 12,
              }}>
                <TouchableOpacity
                  onPress={toggleLandscape}
                >
                  <Ionicons name={isLandscape ? "phone-portrait" : "phone-landscape"} size={22} color="white" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </View>
  );
}
