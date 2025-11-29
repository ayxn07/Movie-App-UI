import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
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

import { Colors, LIVE_EVENTS } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const { height, width } = Dimensions.get("window");

// Upcoming Event type
interface UpcomingEvent {
  id: number;
  title: string;
  time: string;
  channel: string;
}

// Sample upcoming events
const UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: 1, title: "Behind the Scenes: Marvel Phase 5", time: "10:00 PM", channel: "Disney+" },
  { id: 2, title: "Live Q&A with Christopher Nolan", time: "11:30 PM", channel: "HBO Max" },
  { id: 3, title: "Movie Trivia Night", time: "Tomorrow 8:00 PM", channel: "Entertainment TV" },
];

// Live Indicator Component with pulsing animation
const LiveIndicator = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: Colors.danger,
            marginRight: 8,
          },
        ]}
      />
      <Text style={{ color: Colors.danger, fontWeight: "800", fontSize: 14 }}>LIVE</Text>
    </View>
  );
};

// Upcoming Event Card
const UpcomingEventCard = ({
  event,
  index,
}: {
  event: UpcomingEvent;
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: isDark ? 0 : 1,
        borderColor: theme.border,
      }}
    >
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: `${theme.primary}20`,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
      }}>
        <Ionicons name="time-outline" size={24} color={theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }} numberOfLines={1}>
          {event.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{event.time}</Text>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textMuted, marginHorizontal: 8 }} />
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{event.channel}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={{
          backgroundColor: `${theme.primary}20`,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: theme.primary, fontWeight: "700", fontSize: 12 }}>Remind</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Viewer Count Component with animated number
const ViewerCount = ({ count }: { count: number }) => {
  const { theme } = useTheme();
  const [displayCount, setDisplayCount] = useState(count);

  // Simulate viewer count changing
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCount((prev) => prev + Math.floor(Math.random() * 100) - 50);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Ionicons name="eye" size={16} color={theme.textSecondary} />
      <Text style={{ color: theme.textSecondary, fontSize: 14, fontWeight: "600", marginLeft: 6 }}>
        {displayCount.toLocaleString()} watching
      </Text>
    </View>
  );
};

export default function LiveDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = Number(params.id);
  const { showToast } = useApp();

  // Find the event from our data
  const event = LIVE_EVENTS.find((e) => e.id === eventId);

  // Handle event not found
  if (!event) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Ionicons name="videocam-outline" size={64} color={theme.textMuted} />
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700", marginTop: 16 }}>Event Not Found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 24, backgroundColor: theme.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast("Sharing options coming soon!", "info");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Image Section */}
        <View style={{ height: height * 0.4, position: "relative" }}>
          <Image
            source={{ uri: event.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.7)", theme.background]}
            locations={[0, 0.3, 0.7, 1]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Header Buttons */}
          <View style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Live Badge */}
          {event.isLive && (
            <Animated.View
              entering={FadeIn.delay(200)}
              style={{
                position: "absolute",
                top: 100,
                left: 20,
                backgroundColor: "rgba(0,0,0,0.7)",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <LiveIndicator />
            </Animated.View>
          )}

          {/* Play Button */}
          <Animated.View
            entering={FadeIn.delay(300)}
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              marginLeft: -40,
              marginTop: -40,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                showToast("Starting live stream...", "info");
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
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
              <Ionicons name="play" size={36} color="white" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Event Info Section */}
        <View style={{ paddingHorizontal: 20, marginTop: -20 }}>
          {/* Title */}
          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <View style={{
              backgroundColor: theme.accent,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              alignSelf: "flex-start",
              marginBottom: 12,
            }}>
              <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>{event.category}</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: "900", color: theme.text, marginBottom: 8 }}>
              {event.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="tv-outline" size={16} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginLeft: 6 }}>{event.channel}</Text>
              </View>
              {event.isLive && event.viewers > 0 && (
                <ViewerCount count={event.viewers} />
              )}
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInUp.delay(150).springify()} style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.9}>
              <LinearGradient
                colors={event.isLive ? [Colors.danger, "#dc2626"] : [Colors.primary, Colors.primaryDark]}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 16,
                  borderRadius: 16,
                }}
              >
                <Ionicons name={event.isLive ? "play" : "notifications"} size={22} color="white" />
                <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>
                  {event.isLive ? "Watch Live" : "Set Reminder"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                alignItems: "center", justifyContent: "center",
                borderWidth: isDark ? 0 : 1, borderColor: theme.border,
              }}
            >
              <Ionicons name="heart-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          </Animated.View>

          {/* About Section */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 12 }}>
              About This Event
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 15, lineHeight: 24, marginBottom: 24 }}>
              Join us for an exclusive live event featuring {event.title.toLowerCase()}. 
              Don't miss this exciting opportunity to be part of something special. 
              Tune in to {event.channel} for the best entertainment experience.
            </Text>
          </Animated.View>

          {/* Stats */}
          <Animated.View
            entering={FadeInUp.delay(250).springify()}
            style={{
              flexDirection: "row",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 20,
              padding: 20,
              marginBottom: 32,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <View style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: `${theme.primary}20`,
                alignItems: "center", justifyContent: "center", marginBottom: 8,
              }}>
                <Ionicons name="eye" size={24} color={theme.primary} />
              </View>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800" }}>
                {event.isLive ? event.viewers.toLocaleString() : "0"}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>Viewers</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center", borderLeftWidth: 1, borderLeftColor: theme.border }}>
              <View style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: `${Colors.danger}20`,
                alignItems: "center", justifyContent: "center", marginBottom: 8,
              }}>
                <Ionicons name="heart" size={24} color={Colors.danger} />
              </View>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800" }}>12.5K</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>Likes</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center", borderLeftWidth: 1, borderLeftColor: theme.border }}>
              <View style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: `${Colors.accent}20`,
                alignItems: "center", justifyContent: "center", marginBottom: 8,
              }}>
                <Ionicons name="chatbubble" size={24} color={Colors.accent} />
              </View>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800" }}>2.3K</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>Comments</Text>
            </View>
          </Animated.View>

          {/* Upcoming Events */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 16 }}>
              Coming Up Next
            </Text>
            {UPCOMING_EVENTS.map((upcomingEvent, index) => (
              <UpcomingEventCard key={upcomingEvent.id} event={upcomingEvent} index={index} />
            ))}
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
