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
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Video Call Action Button Component
const VideoCallActionButton = ({
  icon,
  isActive = false,
  activeColor,
  onPress,
}: {
  icon: string;
  isActive?: boolean;
  activeColor?: string;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          scale.value = withSequence(
            withTiming(0.9, { duration: 100 }),
            withTiming(1, { duration: 100 })
          );
          onPress();
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: isActive ? (activeColor || Colors.danger) : "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color="white"
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function VideoCallScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const friendId = params.id as string;
  const { friends } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const friend = friends.find((f) => f.id === friendId);

  // Animation for connecting state
  const pulseScale = useSharedValue(1);
  const smallVideoScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
  }, [pulseScale]);

  // Simulate connection after 2 seconds
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setIsConnecting(false);
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, []);

  // Call duration timer
  useEffect(() => {
    if (!isConnecting) {
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isConnecting]);

  // Hide controls after 5 seconds
  useEffect(() => {
    if (!isConnecting && showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isConnecting, showControls]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const smallVideoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: smallVideoScale.value }],
  }));

  const handleEndCall = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.back();
  };

  const handleToggleControls = () => {
    setShowControls(!showControls);
  };

  if (!friend) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center" }}>
        <StatusBar style="light" />
        <Text style={{ color: "white", fontSize: 18 }}>User not found</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleToggleControls}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar style="light" />

        {/* Remote Video (Full Screen) - Simulated with gradient and avatar */}
        <View style={{ flex: 1, position: "relative" }}>
          {isConnecting ? (
            <LinearGradient
              colors={["#1e1b4b", "#312e81", "#0f172a"]}
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <Animated.View style={pulseAnimatedStyle}>
                <View
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    borderWidth: 4,
                    borderColor: Colors.primary,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: friend.avatar }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
              </Animated.View>
              <Text style={{ color: "white", fontSize: 24, fontWeight: "700", marginTop: 24 }}>
                {friend.name}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginTop: 8 }}>
                Connecting video...
              </Text>
            </LinearGradient>
          ) : (
            <View style={{ flex: 1 }}>
              {/* Simulated remote video with a dark gradient and centered avatar */}
              <LinearGradient
                colors={["#1e293b", "#0f172a", "#020617"]}
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
              >
                <View
                  style={{
                    width: width * 0.7,
                    height: width * 0.7 * 1.2,
                    borderRadius: 20,
                    overflow: "hidden",
                    backgroundColor: "#1e293b",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: friend.avatar }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
              </LinearGradient>
            </View>
          )}
        </View>

        {/* Top Overlay */}
        {showControls && (
          <Animated.View
            entering={FadeInDown}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              paddingTop: 60,
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.7)", "transparent"]}
              style={{ position: "absolute", top: 0, left: 0, right: 0, height: 150 }}
            />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    overflow: "hidden",
                    borderWidth: 2,
                    borderColor: Colors.primary,
                    marginRight: 12,
                  }}
                >
                  <Image
                    source={{ uri: friend.avatar }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
                <View>
                  <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
                    {friend.name}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {!isConnecting && (
                      <>
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: Colors.success,
                            marginRight: 6,
                          }}
                        />
                        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                          {formatDuration(callDuration)}
                        </Text>
                      </>
                    )}
                    {isConnecting && (
                      <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                        Connecting...
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsFrontCamera(!isFrontCamera);
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
                <Ionicons name="camera-reverse" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Local Video (Small Preview) */}
        {!isVideoOff && (
          <Animated.View
            entering={FadeIn.delay(500)}
            style={[
              smallVideoAnimatedStyle,
              {
                position: "absolute",
                top: showControls ? 140 : 60,
                right: 20,
                width: 100,
                height: 140,
                borderRadius: 16,
                overflow: "hidden",
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.3)",
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={() => {
                smallVideoScale.value = withSpring(0.95);
              }}
              onPressOut={() => {
                smallVideoScale.value = withSpring(1);
              }}
            >
              {/* Current user's video preview - same avatar used in profile */}
              <Image
                source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Bottom Controls */}
        {showControls && (
          <Animated.View
            entering={FadeInUp}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: 50,
              paddingTop: 30,
            }}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200 }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                paddingHorizontal: 20,
              }}
            >
              <VideoCallActionButton
                icon={isMuted ? "mic-off" : "mic"}
                isActive={isMuted}
                onPress={() => setIsMuted(!isMuted)}
              />
              <VideoCallActionButton
                icon={isVideoOff ? "videocam-off" : "videocam"}
                isActive={isVideoOff}
                onPress={() => setIsVideoOff(!isVideoOff)}
              />
              <TouchableOpacity
                onPress={handleEndCall}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: Colors.danger,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="call" size={28} color="white" style={{ transform: [{ rotate: "135deg" }] }} />
              </TouchableOpacity>
              <VideoCallActionButton
                icon="chatbubble-ellipses"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.back();
                }}
              />
              <VideoCallActionButton
                icon="ellipsis-horizontal"
                onPress={() => {}}
              />
            </View>
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
}
