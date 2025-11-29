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
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Animated Ring Component
const AnimatedRing = ({ delay, size }: { delay: number; size: number }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(1.5, { duration: 2000 }),
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 0 }),
        withTiming(0, { duration: 2000 }),
      ),
      -1,
      false
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: Colors.primary,
        },
        animatedStyle,
      ]}
    />
  );
};

// Call Control Button
const CallControlButton = ({
  icon,
  label,
  onPress,
  isActive,
  activeColor,
  isDanger,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  isActive?: boolean;
  activeColor?: string;
  isDanger?: boolean;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={{ alignItems: "center" }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: isDanger
            ? Colors.danger
            : isActive
            ? activeColor || theme.primary
            : isDark
            ? "rgba(30, 41, 59, 0.8)"
            : "rgba(241, 245, 249, 0.9)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={28}
          color={isDanger || isActive ? "white" : theme.text}
        />
      </View>
      <Text
        style={{
          color: theme.textSecondary,
          fontSize: 12,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default function VoiceCallScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const friendId = params.id as string;
  const { friends } = useApp();

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.back();
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
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <StatusBar style="light" />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#1e1b4b", "#0f172a", "#020617"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{
          paddingTop: 60,
          paddingHorizontal: 20,
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
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-down" size={24} color="white" />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 14 }}>
            Voice Call
          </Text>
        </View>

        <View style={{ width: 44 }} />
      </Animated.View>

      {/* Main Content */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 100,
        }}
      >
        {/* Animated Rings */}
        {!isConnected && (
          <>
            <AnimatedRing delay={0} size={200} />
            <AnimatedRing delay={500} size={250} />
            <AnimatedRing delay={1000} size={300} />
          </>
        )}

        {/* Avatar */}
        <Animated.View
          entering={FadeIn.duration(500)}
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            borderWidth: 4,
            borderColor: isConnected ? Colors.success : Colors.primary,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <Image
            source={{ uri: friend.avatar }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </Animated.View>

        {/* Name and Status */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={{ alignItems: "center" }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            {friend.name}
          </Text>
          <Text
            style={{
              color: isConnected ? Colors.success : "rgba(255, 255, 255, 0.6)",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            {isConnected ? formatDuration(callDuration) : "Calling..."}
          </Text>
        </Animated.View>

        {/* Call Quality Indicator */}
        {isConnected && (
          <Animated.View
            entering={FadeIn.delay(300)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <Ionicons name="wifi" size={16} color={Colors.success} />
            <Text
              style={{
                color: Colors.success,
                fontSize: 12,
                fontWeight: "600",
                marginLeft: 6,
              }}
            >
              Excellent Quality
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Bottom Controls */}
      <Animated.View
        entering={FadeInUp.delay(400).springify()}
        style={{
          paddingHorizontal: 40,
          paddingBottom: 50,
        }}
      >
        {/* Control Buttons Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 40,
          }}
        >
          <CallControlButton
            icon={isMuted ? "mic-off" : "mic"}
            label={isMuted ? "Unmute" : "Mute"}
            onPress={() => setIsMuted(!isMuted)}
            isActive={isMuted}
            activeColor={Colors.danger}
          />
          <CallControlButton
            icon={isSpeakerOn ? "volume-high" : "volume-medium"}
            label="Speaker"
            onPress={() => setIsSpeakerOn(!isSpeakerOn)}
            isActive={isSpeakerOn}
            activeColor={Colors.primary}
          />
          <CallControlButton
            icon="keypad"
            label="Keypad"
            onPress={() => {}}
          />
        </View>

        {/* End Call Button */}
        <TouchableOpacity
          onPress={handleEndCall}
          style={{ alignItems: "center" }}
        >
          <LinearGradient
            colors={[Colors.danger, "#dc2626"]}
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="call" size={32} color="white" style={{ transform: [{ rotate: "135deg" }] }} />
          </LinearGradient>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 14,
              fontWeight: "500",
              marginTop: 12,
            }}
          >
            End Call
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
