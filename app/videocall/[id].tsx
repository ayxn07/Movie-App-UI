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
  ZoomIn,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Call Control Button
const VideoCallControlButton = ({
  icon,
  onPress,
  isActive,
  activeColor,
  isDanger,
  size = 56,
}: {
  icon: string;
  onPress: () => void;
  isActive?: boolean;
  activeColor?: string;
  isDanger?: boolean;
  size?: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDanger
            ? Colors.danger
            : isActive
            ? activeColor || theme.primary
            : "rgba(255, 255, 255, 0.2)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={size === 56 ? 24 : 32}
          color="white"
        />
      </View>
    </TouchableOpacity>
  );
};

export default function VideoCallScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const friendId = params.id as string;
  const { friends } = useApp();

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const friend = friends.find((f) => f.id === friendId);

  // Simulate call connection after 2 seconds
  useEffect(() => {
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);

    return () => clearTimeout(connectionTimer);
  }, []);

  // Update call duration when connected
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Auto-hide controls after 5 seconds
  useEffect(() => {
    if (isConnected && showControls) {
      const hideTimer = setTimeout(() => {
        setShowControls(false);
      }, 5000);
      return () => clearTimeout(hideTimer);
    }
  }, [isConnected, showControls]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.back();
  };

  const toggleControls = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowControls(!showControls);
  };

  if (!friend) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusBar style="light" />
        <Text style={{ color: theme.text }}>Friend not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />

      {/* Remote Video (Full Screen Background) */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={toggleControls}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, backgroundColor: "#1a1a2e" }}>
          {/* Simulated remote video with gradient and avatar */}
          <LinearGradient
            colors={["#1e1b4b", "#0f172a", "#020617"]}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {isConnected ? (
              <Animated.View
                entering={FadeIn.duration(500)}
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: friend.avatar }}
                  style={{
                    width: width,
                    height: height,
                    opacity: 0.8,
                  }}
                  contentFit="cover"
                />
                {/* Overlay Gradient */}
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              </Animated.View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 80,
                    borderWidth: 4,
                    borderColor: Colors.primary,
                    overflow: "hidden",
                    marginBottom: 24,
                  }}
                >
                  <Image
                    source={{ uri: friend.avatar }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 24,
                    fontWeight: "700",
                    marginBottom: 8,
                  }}
                >
                  {friend.name}
                </Text>
                <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 16 }}>
                  Connecting video...
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>
      </TouchableOpacity>

      {/* Local Video Preview (Picture-in-Picture) */}
      {isCameraOn && (
        <Animated.View
          entering={ZoomIn.delay(500)}
          style={{
            position: "absolute",
            top: 100,
            right: 20,
            width: 120,
            height: 160,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: "rgba(255, 255, 255, 0.3)",
            backgroundColor: "#1a1a2e",
          }}
        >
          <LinearGradient
            colors={["#4f46e5", "#7c3aed", "#8b5cf6"]}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="person" size={48} color="rgba(255, 255, 255, 0.5)" />
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12, marginTop: 8 }}>
              You
            </Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Top Controls - Always Visible */}
      {showControls && (
        <Animated.View
          entering={FadeInDown.duration(200)}
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
            colors={["rgba(0,0,0,0.8)", "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 150,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="chevron-down" size={24} color="white" />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                {friend.name}
              </Text>
              <Text
                style={{
                  color: isConnected ? Colors.success : "rgba(255, 255, 255, 0.6)",
                  fontSize: 14,
                }}
              >
                {isConnected ? formatDuration(callDuration) : "Connecting..."}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsFullScreen(!isFullScreen);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={isFullScreen ? "contract" : "expand"}
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Call Quality */}
          {isConnected && (
            <Animated.View
              entering={FadeIn.delay(300)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(16, 185, 129, 0.3)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Ionicons name="wifi" size={14} color={Colors.success} />
                <Text
                  style={{
                    color: Colors.success,
                    fontSize: 12,
                    fontWeight: "600",
                    marginLeft: 6,
                  }}
                >
                  HD Quality
                </Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      )}

      {/* Bottom Controls */}
      {showControls && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: 50,
            paddingHorizontal: 30,
          }}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 200,
            }}
          />
          
          {/* Main Controls */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <VideoCallControlButton
              icon={isCameraOn ? "videocam" : "videocam-off"}
              onPress={() => setIsCameraOn(!isCameraOn)}
              isActive={!isCameraOn}
              activeColor="rgba(255, 255, 255, 0.3)"
            />

            <VideoCallControlButton
              icon={isMuted ? "mic-off" : "mic"}
              onPress={() => setIsMuted(!isMuted)}
              isActive={isMuted}
              activeColor="rgba(255, 255, 255, 0.3)"
            />

            <VideoCallControlButton
              icon="call"
              onPress={handleEndCall}
              isDanger
              size={72}
            />

            <VideoCallControlButton
              icon="camera-reverse"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />

            <VideoCallControlButton
              icon={isSpeakerOn ? "volume-high" : "volume-mute"}
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
              isActive={!isSpeakerOn}
              activeColor="rgba(255, 255, 255, 0.3)"
            />
          </View>

          {/* Additional Controls */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 24,
              gap: 32,
            }}
          >
            <TouchableOpacity
              onPress={() => {}}
              style={{ alignItems: "center" }}
            >
              <Ionicons name="chatbubble" size={24} color="rgba(255, 255, 255, 0.7)" />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {}}
              style={{ alignItems: "center" }}
            >
              <Ionicons name="people" size={24} color="rgba(255, 255, 255, 0.7)" />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Add
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {}}
              style={{ alignItems: "center" }}
            >
              <Ionicons name="share" size={24} color="rgba(255, 255, 255, 0.7)" />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
