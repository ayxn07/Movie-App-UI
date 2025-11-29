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

const { width } = Dimensions.get("window");

// Call Action Button Component
const CallActionButton = ({
  icon,
  label,
  color,
  backgroundColor,
  onPress,
  size = 60,
}: {
  icon: string;
  label?: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
  size?: number;
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
        style={{ alignItems: "center" }}
      >
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={size * 0.45} color={color} />
        </View>
        {label && (
          <Text style={{ color: "white", fontSize: 12, marginTop: 8, fontWeight: "500" }}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function VoiceCallScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const friendId = params.id as string;
  const { friends } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);

  const friend = friends.find((f) => f.id === friendId);

  // Pulsing animation for connecting state
  const pulseScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.3);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      false
    );
  }, [pulseScale, ringOpacity]);

  // Simulate connection after 3 seconds
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setIsConnecting(false);
    }, 3000);

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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));

  const handleEndCall = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.back();
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
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#1e1b4b", "#312e81", "#0f172a"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Top Section */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 60,
        }}
      >
        {/* Pulsing Rings */}
        <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
          {isConnecting && (
            <>
              <Animated.View
                style={[
                  ringAnimatedStyle,
                  {
                    position: "absolute",
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: Colors.primary,
                  },
                ]}
              />
              <Animated.View
                style={[
                  pulseAnimatedStyle,
                  {
                    position: "absolute",
                    width: 160,
                    height: 160,
                    borderRadius: 80,
                    borderWidth: 2,
                    borderColor: Colors.primary,
                    opacity: 0.5,
                  },
                ]}
              />
            </>
          )}

          {/* Profile Avatar */}
          <Animated.View
            style={pulseAnimatedStyle}
            entering={FadeIn.delay(200)}
          >
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
        </View>

        {/* Name and Status */}
        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={{ alignItems: "center", marginTop: 24 }}
        >
          <Text style={{ color: "white", fontSize: 28, fontWeight: "800" }}>
            {friend.name}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginTop: 8 }}>
            {isConnecting ? "Calling..." : formatDuration(callDuration)}
          </Text>
        </Animated.View>

        {/* Connection Status */}
        {isConnecting && (
          <Animated.View
            entering={FadeIn.delay(400)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              backgroundColor: "rgba(255,255,255,0.1)",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: Colors.success,
                marginRight: 8,
              }}
            />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
              Connecting...
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Bottom Action Buttons */}
      <Animated.View
        entering={FadeInUp.delay(500).springify()}
        style={{
          paddingHorizontal: 20,
          paddingBottom: 60,
          paddingTop: 20,
        }}
      >
        {/* Action Buttons Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 40,
          }}
        >
          <CallActionButton
            icon={isMuted ? "mic-off" : "mic"}
            label={isMuted ? "Unmute" : "Mute"}
            color={isMuted ? "white" : theme.text}
            backgroundColor={isMuted ? Colors.danger : "rgba(255,255,255,0.15)"}
            onPress={() => setIsMuted(!isMuted)}
          />
          <CallActionButton
            icon={isSpeaker ? "volume-high" : "volume-medium"}
            label="Speaker"
            color={isSpeaker ? Colors.primary : "white"}
            backgroundColor={isSpeaker ? "rgba(139, 92, 246, 0.3)" : "rgba(255,255,255,0.15)"}
            onPress={() => setIsSpeaker(!isSpeaker)}
          />
          <CallActionButton
            icon="videocam"
            label="Video"
            color="white"
            backgroundColor="rgba(255,255,255,0.15)"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace(`/videocall/${friendId}`);
            }}
          />
          <CallActionButton
            icon="keypad"
            label="Keypad"
            color="white"
            backgroundColor="rgba(255,255,255,0.15)"
            onPress={() => {}}
          />
        </View>

        {/* End Call Button */}
        <View style={{ alignItems: "center" }}>
          <CallActionButton
            icon="call"
            color="white"
            backgroundColor={Colors.danger}
            onPress={handleEndCall}
            size={72}
          />
        </View>
      </Animated.View>
    </View>
  );
}
