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
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Call Control Button Component
const ControlButton = ({
  icon,
  isActive = false,
  activeColor = Colors.danger,
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
        onPressIn={() => { scale.value = withTiming(0.9, { duration: 100 }); }}
        onPressOut={() => { scale.value = withTiming(1, { duration: 100 }); }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isActive ? activeColor : "rgba(255,255,255,0.2)",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Pulsing Dot Component
const PulsingDot = ({ delay = 0 }: { delay?: number }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.3, { duration: 400 })
      ),
      -1,
      false
    );
  }, [opacity]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        dotStyle,
        {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: Colors.primary,
          marginHorizontal: 4,
        },
      ]}
    />
  );
};

export default function VideoCallScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const friendId = params.id as string;
  const { friends, showToast } = useApp();

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const friend = friends.find((f) => f.id === friendId);

  // Animation for self-view position
  const selfViewPosition = useSharedValue({ x: width - 120, y: 100 });

  // Simulate call connection
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      showToast("Video call connected", "success");
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

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;

    const hideTimer = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => clearTimeout(hideTimer);
  }, [showControls]);

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
    setShowControls((prev) => !prev);
  };

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
    <TouchableOpacity
      activeOpacity={1}
      onPress={toggleControls}
      style={{ flex: 1, backgroundColor: "#000" }}
    >
      <StatusBar style="light" />

      {/* Remote Video (Friend's video - simulated with image) */}
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: friend.avatar }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          blurRadius={isCameraOff ? 30 : 0}
        />

        {/* Overlay gradient */}
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "transparent", "transparent", "rgba(0,0,0,0.6)"]}
          locations={[0, 0.2, 0.6, 1]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Connecting Overlay */}
        {!isConnected && (
          <Animated.View
            entering={FadeIn}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Animated.View
              entering={FadeInUp.delay(200)}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  overflow: "hidden",
                  borderWidth: 3,
                  borderColor: Colors.primary,
                  marginBottom: 24,
                }}
              >
                <Image
                  source={{ uri: friend.avatar }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
              <Text style={{ color: "white", fontSize: 24, fontWeight: "700", marginBottom: 8 }}>
                {friend.name}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
                Connecting video call...
              </Text>

              {/* Pulsing Dots */}
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                {[0, 1, 2].map((index) => (
                  <PulsingDot key={index} delay={index * 200} />
                ))}
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </View>

      {/* Self Video (Picture-in-Picture) */}
      <Animated.View
        entering={FadeInDown.delay(500)}
        style={{
          position: "absolute",
          top: 100,
          right: 20,
          width: 100,
          height: 140,
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 2,
          borderColor: "rgba(255,255,255,0.3)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {isCameraOff ? (
          <View style={{ flex: 1, backgroundColor: "#1e293b", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="videocam-off" size={32} color="rgba(255,255,255,0.5)" />
          </View>
        ) : (
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        )}
      </Animated.View>

      {/* Top Controls */}
      {showControls && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(0,0,0,0.5)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="chevron-down" size={24} color="white" />
          </TouchableOpacity>

          {/* Call Info */}
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              {friend.name}
            </Text>
            {isConnected && (
              <Text style={{ color: Colors.success, fontSize: 13, marginTop: 2 }}>
                {formatDuration(callDuration)}
              </Text>
            )}
          </View>

          {/* Switch Camera */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsFrontCamera(!isFrontCamera);
              showToast(isFrontCamera ? "Back camera" : "Front camera", "info");
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(0,0,0,0.5)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="camera-reverse" size={22} color="white" />
          </TouchableOpacity>
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
            paddingTop: 30,
          }}
        >
          <BlurView intensity={30} tint="dark" style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
            >
              {/* Mute */}
              <ControlButton
                icon={isMuted ? "mic-off" : "mic"}
                isActive={isMuted}
                activeColor={Colors.danger}
                onPress={() => setIsMuted(!isMuted)}
              />

              {/* Camera Toggle */}
              <ControlButton
                icon={isCameraOff ? "videocam-off" : "videocam"}
                isActive={isCameraOff}
                activeColor={Colors.danger}
                onPress={() => setIsCameraOff(!isCameraOff)}
              />

              {/* End Call */}
              <TouchableOpacity
                onPress={handleEndCall}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  backgroundColor: Colors.danger,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: Colors.danger,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Ionicons name="call" size={28} color="white" style={{ transform: [{ rotate: "135deg" }] }} />
              </TouchableOpacity>

              {/* Flip Camera */}
              <ControlButton
                icon="camera-reverse-outline"
                onPress={() => {
                  setIsFrontCamera(!isFrontCamera);
                  showToast(isFrontCamera ? "Back camera" : "Front camera", "info");
                }}
              />

              {/* Chat */}
              <ControlButton
                icon="chatbubble-outline"
                onPress={() => {
                  router.back();
                  showToast("Returning to chat", "info");
                }}
              />
            </View>
          </BlurView>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}
