import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
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

// Call Button Component
const CallButton = ({
  icon,
  label,
  color,
  backgroundColor,
  onPress,
  size = 64,
  isActive = false,
}: {
  icon: string;
  label: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
  size?: number;
  isActive?: boolean;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, { alignItems: "center" }]}>
      <TouchableOpacity
        onPressIn={() => { scale.value = withTiming(0.9, { duration: 100 }); }}
        onPressOut={() => { scale.value = withTiming(1, { duration: 100 }); }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          shadowColor: backgroundColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={size * 0.4}
          color={color}
        />
      </TouchableOpacity>
      <Text style={{ color: "white", fontSize: 12, fontWeight: "500" }}>{label}</Text>
    </Animated.View>
  );
};

// Audio Visualizer Bar Component
const AudioBar = ({ index }: { index: number }) => {
  const barHeight = useSharedValue(10);

  useEffect(() => {
    barHeight.value = withRepeat(
      withSequence(
        withTiming(30 + Math.random() * 20, { duration: 200 + Math.random() * 300 }),
        withTiming(10 + Math.random() * 10, { duration: 200 + Math.random() * 300 })
      ),
      -1,
      true
    );
  }, [barHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: barHeight.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: 4,
          backgroundColor: Colors.primary,
          borderRadius: 2,
        },
      ]}
    />
  );
};

// Audio Visualizer Component
const AudioVisualizer = () => {
  const bars = Array(5).fill(0);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 20 }}>
      {bars.map((_, index) => (
        <AudioBar key={index} index={index} />
      ))}
    </View>
  );
};

export default function VoiceCallScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const friendId = params.id as string;
  const { friends, showToast } = useApp();

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const friend = friends.find((f) => f.id === friendId);

  // Pulsing animation for profile image
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  // Simulate call connection
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      showToast("Call connected", "success");
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, []);

  // Call duration timer
  useEffect(() => {
    if (!isConnected) return;

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
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

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  if (!friend) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <StatusBar style="light" />
        <Text style={{ color: theme.text }}>Friend not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: theme.primary, marginTop: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar style="light" />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#1e1b4b", "#0f172a", "#020617"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Decorative Circles */}
      <View
        style={{
          position: "absolute",
          top: height * 0.1,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: "rgba(139, 92, 246, 0.1)",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: height * 0.2,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: "rgba(236, 72, 153, 0.1)",
        }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{
          paddingTop: 60,
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, fontWeight: "500" }}>
          {isConnected ? "Voice Call" : "Connecting..."}
        </Text>
        {isConnected && (
          <Animated.Text
            entering={FadeIn}
            style={{ color: Colors.success, fontSize: 14, marginTop: 4 }}
          >
            {formatDuration(callDuration)}
          </Animated.Text>
        )}
      </Animated.View>

      {/* Profile Section */}
      <Animated.View
        entering={FadeInUp.delay(200).springify()}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Profile Image with Pulse */}
        <Animated.View style={[pulseStyle, { marginBottom: 24 }]}>
          <View
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              padding: 4,
              backgroundColor: "rgba(139, 92, 246, 0.2)",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 88,
                overflow: "hidden",
                borderWidth: 3,
                borderColor: Colors.primary,
              }}
            >
              <Image
                source={{ uri: friend.avatar }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
          </View>
        </Animated.View>

        {/* Friend Name */}
        <Text style={{ color: "white", fontSize: 28, fontWeight: "800", marginBottom: 8 }}>
          {friend.name}
        </Text>

        {/* Status */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: isConnected ? Colors.success : Colors.warning,
              marginRight: 8,
            }}
          />
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
            {isConnected ? "Connected" : "Calling..."}
          </Text>
        </View>

        {/* Audio Visualizer */}
        {isConnected && <AudioVisualizer />}
      </Animated.View>

      {/* Call Controls */}
      <Animated.View
        entering={FadeInUp.delay(400).springify()}
        style={{
          paddingHorizontal: 30,
          paddingBottom: 60,
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
          <CallButton
            icon={isMuted ? "mic-off" : "mic"}
            label={isMuted ? "Unmute" : "Mute"}
            color={isMuted ? "white" : Colors.primary}
            backgroundColor={isMuted ? "rgba(239, 68, 68, 0.9)" : "rgba(255,255,255,0.15)"}
            onPress={() => setIsMuted(!isMuted)}
          />
          <CallButton
            icon={isSpeaker ? "volume-high" : "volume-medium"}
            label="Speaker"
            color={isSpeaker ? "white" : Colors.primary}
            backgroundColor={isSpeaker ? Colors.primary : "rgba(255,255,255,0.15)"}
            onPress={() => setIsSpeaker(!isSpeaker)}
          />
          <CallButton
            icon="keypad"
            label="Keypad"
            color={Colors.primary}
            backgroundColor="rgba(255,255,255,0.15)"
            onPress={() => showToast("Keypad opened", "info")}
          />
          <CallButton
            icon="add"
            label="Add Call"
            color={Colors.primary}
            backgroundColor="rgba(255,255,255,0.15)"
            onPress={() => showToast("Add another caller", "info")}
          />
        </View>

        {/* End Call Button */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleEndCall}
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: Colors.danger,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: Colors.danger,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Ionicons name="call" size={32} color="white" style={{ transform: [{ rotate: "135deg" }] }} />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 14, marginTop: 12 }}>End Call</Text>
        </View>
      </Animated.View>
    </View>
  );
}
