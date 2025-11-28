import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
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

import { Colors, LIVE_EVENTS } from "@/constants/data";
import { useTheme } from "@/context";

const { height } = Dimensions.get("window");

// Schedule data
const SCHEDULE = [
  { id: 1, time: "Now", title: "Movie Premiere Live", isLive: true },
  { id: 2, time: "8:00 PM", title: "Behind the Scenes Special", isLive: false },
  { id: 3, time: "9:00 PM", title: "Celebrity Interview", isLive: false },
  { id: 4, time: "10:00 PM", title: "Film Festival Coverage", isLive: false },
  { id: 5, time: "11:00 PM", title: "Late Night Movie Talk", isLive: false },
];

// Related events
const RELATED_EVENTS = LIVE_EVENTS.slice(0, 3);

export default function LiveDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = Number(params.id) || 301;

  const [isPlaying, setIsPlaying] = useState(false);
  const [viewerCount, setViewerCount] = useState(245000);
  const pulseScale = useSharedValue(1);

  // Find the event
  const event = LIVE_EVENTS.find((e) => e.id === eventId) || LIVE_EVENTS[0];

  // Pulse animation for live badge
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 100) - 50);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const liveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const formatViewers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Video Section */}
        <View style={{ height: height * 0.35, position: "relative" }}>
          <Image
            source={{ uri: event.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", theme.background]}
            locations={[0, 0.6, 1]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Header Buttons */}
          <View
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
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
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Live Badge */}
            {event.isLive && (
              <Animated.View style={liveStyle}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: Colors.danger,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    gap: 6,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "white",
                    }}
                  />
                  <Text style={{ color: "white", fontWeight: "900", fontSize: 12 }}>LIVE</Text>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Play Button */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              setIsPlaying(!isPlaying);
            }}
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              marginLeft: -40,
              marginTop: -40,
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "rgba(139, 92, 246, 0.9)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={36}
              color="white"
              style={{ marginLeft: isPlaying ? 0 : 4 }}
            />
          </TouchableOpacity>

          {/* Viewer Count */}
          <View
            style={{
              position: "absolute",
              bottom: 40,
              left: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.6)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                gap: 6,
              }}
            >
              <Ionicons name="eye" size={16} color="white" />
              <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
                {formatViewers(viewerCount)} watching
              </Text>
            </View>
          </View>
        </View>

        {/* Event Info */}
        <View style={{ paddingHorizontal: 20, marginTop: -20 }}>
          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <View
              style={{
                backgroundColor: theme.primary,
                alignSelf: "flex-start",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>
                {event.category}
              </Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: "900", color: theme.text, marginBottom: 8 }}>
              {event.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Ionicons name="tv" size={16} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{event.channel}</Text>
              </View>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: theme.textMuted,
                }}
              />
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                {event.isLive ? "Live Now" : event.startTime}
              </Text>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInUp.delay(150).springify()}
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setIsPlaying(true);
              }}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 16,
                  borderRadius: 16,
                  gap: 8,
                }}
              >
                <Ionicons name="play" size={20} color="white" />
                <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>
                  Watch Now
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: isDark ? theme.backgroundTertiary : theme.card,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <Ionicons name="notifications-outline" size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: isDark ? theme.backgroundTertiary : theme.card,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <Ionicons name="share-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 12 }}>
              About
            </Text>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 15,
                lineHeight: 24,
                marginBottom: 32,
              }}
            >
              Join us for an exclusive live event featuring the biggest names in entertainment. 
              Get behind-the-scenes access, celebrity interviews, and be part of the excitement 
              as it happens. Don't miss this unforgettable experience!
            </Text>
          </Animated.View>

          {/* Schedule */}
          <Animated.View entering={FadeInUp.delay(250).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 16 }}>
              Today's Schedule
            </Text>
            <View
              style={{
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                borderRadius: 20,
                overflow: "hidden",
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              {SCHEDULE.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 16,
                    borderBottomWidth: index < SCHEDULE.length - 1 ? 1 : 0,
                    borderBottomColor: theme.border,
                    backgroundColor: item.isLive
                      ? isDark
                        ? "rgba(139, 92, 246, 0.15)"
                        : "rgba(139, 92, 246, 0.1)"
                      : "transparent",
                  }}
                >
                  <Text
                    style={{
                      width: 70,
                      color: item.isLive ? theme.primary : theme.textSecondary,
                      fontSize: 13,
                      fontWeight: item.isLive ? "700" : "500",
                    }}
                  >
                    {item.time}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: item.isLive ? theme.text : theme.textSecondary,
                      fontSize: 14,
                      fontWeight: item.isLive ? "700" : "500",
                    }}
                  >
                    {item.title}
                  </Text>
                  {item.isLive && (
                    <View
                      style={{
                        backgroundColor: Colors.danger,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>LIVE</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Related Events */}
          <Animated.View entering={FadeIn.delay(300)} style={{ marginTop: 32 }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 16 }}>
              Related Events
            </Text>
            {RELATED_EVENTS.map((relatedEvent, index) => (
              <TouchableOpacity
                key={relatedEvent.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/live/${relatedEvent.id}`);
                }}
                style={{ marginBottom: 16 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: isDark ? 0 : 1,
                    borderColor: theme.border,
                  }}
                >
                  <View style={{ width: 120, height: 80, position: "relative" }}>
                    <Image
                      source={{ uri: relatedEvent.image }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                    {relatedEvent.isLive && (
                      <View
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          backgroundColor: Colors.danger,
                          paddingHorizontal: 6,
                          paddingVertical: 3,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 9, fontWeight: "800" }}>LIVE</Text>
                      </View>
                    )}
                  </View>
                  <View style={{ flex: 1, padding: 12, justifyContent: "center" }}>
                    <Text
                      style={{ color: theme.text, fontWeight: "700", fontSize: 14 }}
                      numberOfLines={2}
                    >
                      {relatedEvent.title}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                      {relatedEvent.channel}
                    </Text>
                  </View>
                  <View style={{ alignItems: "center", justifyContent: "center", paddingRight: 12 }}>
                    <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
