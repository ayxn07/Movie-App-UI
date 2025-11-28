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
  Share,
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
import Toast from "react-native-toast-message";

import { Colors, LIVE_EVENTS } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";

const { height, width } = Dimensions.get("window");

// Live Badge Component with pulsing animation
const LiveBadge = () => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={{
      backgroundColor: Colors.danger,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    }}>
      <Animated.View style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "white",
        },
        animatedStyle,
      ]} />
      <Text style={{ color: "white", fontSize: 12, fontWeight: "800" }}>LIVE</Text>
    </View>
  );
};

// Viewer Count Component
const ViewerCount = ({ count, theme }: { count: number; theme: ThemeColors }) => {
  const formatViewers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 6,
    }}>
      <Ionicons name="eye" size={14} color="white" />
      <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
        {formatViewers(count)} watching
      </Text>
    </View>
  );
};

// Chat Message Component
const ChatMessage = ({
  username,
  message,
  index,
  theme,
}: {
  username: string;
  message: string;
  index: number;
  theme: ThemeColors;
}) => (
  <Animated.View
    entering={FadeInUp.delay(index * 50).springify()}
    style={{ marginBottom: 8 }}
  >
    <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
      <Text style={{ color: theme.primary, fontWeight: "700" }}>{username}</Text>
      {"  "}
      {message}
    </Text>
  </Animated.View>
);

export default function LiveDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = Number(params.id);

  const event = LIVE_EVENTS.find((e) => e.id === eventId);
  const [isReminded, setIsReminded] = useState(false);
  const [currentViewers, setCurrentViewers] = useState(event?.viewers || 0);

  // Simulate viewer count changes
  useEffect(() => {
    if (!event?.isLive) return;
    
    const interval = setInterval(() => {
      setCurrentViewers(prev => {
        const change = Math.floor(Math.random() * 200) - 100;
        return Math.max(0, prev + change);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [event?.isLive]);

  const handleShare = async () => {
    if (!event) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        title: event.title,
        message: `${event.isLive ? "🔴 LIVE NOW: " : "📅 Coming Up: "}${event.title} on ${event.channel}\n\nWatch on MoviesHub!`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleReminder = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsReminded(!isReminded);
    Toast.show({
      type: "success",
      text1: isReminded ? "Reminder Removed" : "Reminder Set",
      text2: isReminded ? "You won't be notified" : `We'll notify you when ${event?.title} starts`,
      visibilityTime: 2000,
    });
  };

  // Sample chat messages
  const chatMessages = [
    { username: "MovieFan123", message: "This is so exciting! 🎬" },
    { username: "CinemaLover", message: "Can't wait to see the premiere!" },
    { username: "FilmBuff99", message: "The visuals look amazing" },
    { username: "PopcornTime", message: "Who else is watching from home? 🍿" },
    { username: "RedCarpetFan", message: "The cast is incredible!" },
  ];

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

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Video/Image Section */}
        <View style={{ height: height * 0.35, position: "relative" }}>
          <Image
            source={{ uri: event.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.8)"]}
            locations={[0, 0.3, 1]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Header */}
          <View style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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

            <View style={{ flexDirection: "row", gap: 12 }}>
              {event.isLive && <LiveBadge />}
              {event.isLive && <ViewerCount count={currentViewers} theme={theme} />}
            </View>
          </View>

          {/* Play Button */}
          {event.isLive && (
            <Animated.View
              entering={FadeIn.delay(300)}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginLeft: -40,
                marginTop: -40,
              }}
            >
              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                style={{
                  width: 80, height: 80, borderRadius: 40,
                  backgroundColor: Colors.danger,
                  alignItems: "center", justifyContent: "center",
                  shadowColor: Colors.danger,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 12,
                }}
              >
                <Ionicons name="play" size={36} color="white" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Channel Info */}
          <View style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
          }}>
            <View style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              alignSelf: "flex-start",
              marginBottom: 8,
            }}>
              <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>{event.channel}</Text>
            </View>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "900" }} numberOfLines={2}>
              {event.title}
            </Text>
          </View>
        </View>

        {/* Event Info Section */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Status and Time */}
          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
              <View style={{
                backgroundColor: event.isLive ? Colors.danger + "20" : Colors.primary + "20",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}>
                <Ionicons
                  name={event.isLive ? "radio" : "time-outline"}
                  size={16}
                  color={event.isLive ? Colors.danger : theme.primary}
                />
                <Text style={{
                  color: event.isLive ? Colors.danger : theme.primary,
                  fontWeight: "700",
                  fontSize: 14,
                }}>
                  {event.isLive ? "Streaming Now" : `Starts at ${event.startTime}`}
                </Text>
              </View>
              <View style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}>
                <Text style={{ color: theme.text, fontWeight: "600" }}>{event.category}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInUp.delay(150).springify()}
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {event.isLive ? (
              <TouchableOpacity style={{ flex: 1 }} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}>
                <LinearGradient
                  colors={[Colors.danger, "#dc2626"]}
                  style={{
                    paddingVertical: 16,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Ionicons name="play" size={20} color="white" />
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Watch Live</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={{ flex: 1 }} onPress={handleReminder}>
                <LinearGradient
                  colors={isReminded ? [Colors.success, "#059669"] : [Colors.primary, Colors.primaryDark]}
                  style={{
                    paddingVertical: 16,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Ionicons name={isReminded ? "checkmark-circle" : "notifications-outline"} size={20} color="white" />
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                    {isReminded ? "Reminder Set" : "Remind Me"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleShare}
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <Ionicons name="share-outline" size={24} color={theme.primary} />
            </TouchableOpacity>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 12 }}>
              About This Event
            </Text>
            <Text style={{
              color: theme.textSecondary,
              fontSize: 15,
              lineHeight: 24,
              marginBottom: 24,
            }}>
              Join us for an exclusive {event.category.toLowerCase()} event on {event.channel}. 
              {event.isLive 
                ? " This event is currently streaming live. Don't miss out on the action!"
                : ` The event starts at ${event.startTime}. Set a reminder to be notified when it begins!`
              }
            </Text>
          </Animated.View>

          {/* Live Chat (only for live events) */}
          {event.isLive && (
            <Animated.View entering={FadeInUp.delay(250).springify()}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text }}>
                  Live Chat
                </Text>
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: Colors.success + "20",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success }} />
                  <Text style={{ color: Colors.success, fontSize: 12, fontWeight: "600" }}>Active</Text>
                </View>
              </View>

              <View style={{
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                borderRadius: 20,
                padding: 16,
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
                maxHeight: 200,
              }}>
                {chatMessages.map((chat, index) => (
                  <ChatMessage
                    key={index}
                    username={chat.username}
                    message={chat.message}
                    index={index}
                    theme={theme}
                  />
                ))}
              </View>
            </Animated.View>
          )}

          {/* Related Events */}
          <Animated.View entering={FadeInUp.delay(300).springify()} style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 16 }}>
              More From {event.channel}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {LIVE_EVENTS.filter(e => e.id !== eventId && e.channel === event.channel).slice(0, 3).map((relatedEvent, index) => (
                <TouchableOpacity
                  key={relatedEvent.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/live/${relatedEvent.id}`);
                  }}
                  style={{
                    width: 200,
                    marginRight: 12,
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: isDark ? 0 : 1,
                    borderColor: theme.border,
                  }}
                >
                  <View style={{ height: 100 }}>
                    <Image
                      source={{ uri: relatedEvent.image }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                    {relatedEvent.isLive && (
                      <View style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        backgroundColor: Colors.danger,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}>
                        <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>LIVE</Text>
                      </View>
                    )}
                  </View>
                  <View style={{ padding: 12 }}>
                    <Text style={{ color: theme.text, fontWeight: "700", fontSize: 13 }} numberOfLines={2}>
                      {relatedEvent.title}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 4 }}>
                      {relatedEvent.isLive ? "Streaming Now" : relatedEvent.startTime}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
