import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInRight,
    Layout,
    SlideOutRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import { Colors, MovieImages } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { NotificationItem } from "@/types";

// Sample notifications data
const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "movie",
    title: "New Release",
    message: "Dune: Part Two is now available to stream in 4K",
    image: MovieImages.DUNE_PART_TWO,
    timestamp: "2 min ago",
    isRead: false,
  },
  {
    id: "2",
    type: "social",
    title: "Friend Activity",
    message: "John liked Oppenheimer and added it to their watchlist",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    timestamp: "15 min ago",
    isRead: false,
  },
  {
    id: "3",
    type: "system",
    title: "Download Complete",
    message: "The Batman has finished downloading and is ready to watch offline",
    image: MovieImages.THE_BATMAN,
    timestamp: "1 hour ago",
    isRead: false,
  },
  {
    id: "4",
    type: "movie",
    title: "Recommended for You",
    message: "Based on your viewing history, you might enjoy Interstellar",
    image: MovieImages.INTERSTELLAR,
    timestamp: "3 hours ago",
    isRead: true,
  },
  {
    id: "5",
    type: "series",
    title: "New Episode",
    message: "Breaking Bad Season 5 Episode 16 is now available",
    image: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    timestamp: "5 hours ago",
    isRead: true,
  },
  {
    id: "6",
    type: "system",
    title: "Premium Offer",
    message: "Upgrade to Premium and get 50% off your first month!",
    timestamp: "1 day ago",
    isRead: true,
  },
  {
    id: "7",
    type: "social",
    title: "New Follower",
    message: "Sarah started following you",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    timestamp: "2 days ago",
    isRead: true,
  },
  {
    id: "8",
    type: "movie",
    title: "Watchlist Reminder",
    message: "The Godfather has been on your watchlist for 7 days",
    image: MovieImages.THE_GODFATHER,
    timestamp: "3 days ago",
    isRead: true,
  },
];

// Notification Card Component
const NotificationCard = ({
  notification,
  index,
  onPress,
  onDismiss,
  theme,
  isDark,
}: {
  notification: NotificationItem;
  index: number;
  onPress: () => void;
  onDismiss: () => void;
  theme: ThemeColors;
  isDark: boolean;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const getIcon = () => {
    switch (notification.type) {
      case "movie":
        return "film";
      case "series":
        return "tv";
      case "social":
        return "people";
      case "system":
        return "settings";
      default:
        return "notifications";
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case "movie":
        return theme.primary;
      case "series":
        return theme.secondary;
      case "social":
        return theme.accent;
      case "system":
        return theme.success;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      exiting={SlideOutRight.duration(300)}
      layout={Layout.springify()}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={{
          flexDirection: "row",
          padding: 16,
          marginHorizontal: 20,
          marginBottom: 12,
          borderRadius: 20,
          backgroundColor: notification.isRead
            ? isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(241, 245, 249, 0.8)"
            : isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.1)",
          borderWidth: notification.isRead ? 0 : 1,
          borderColor: notification.isRead ? "transparent" : theme.primary + "40",
        }}
      >
        {/* Image or Icon */}
        <View style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          overflow: "hidden",
          marginRight: 14,
        }}>
          {notification.image ? (
            <Image
              source={{ uri: notification.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View style={{
              width: "100%",
              height: "100%",
              backgroundColor: getIconColor() + "20",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Ionicons name={getIcon() as any} size={24} color={getIconColor()} />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {!notification.isRead && (
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.primary,
              }} />
            )}
            <Text style={{
              fontSize: 15,
              fontWeight: "700",
              color: theme.text,
            }}>
              {notification.title}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              color: theme.textSecondary,
              marginTop: 4,
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            {notification.message}
          </Text>
          <Text style={{
            fontSize: 11,
            color: theme.textMuted,
            marginTop: 6,
          }}>
            {notification.timestamp}
          </Text>
        </View>

        {/* Dismiss Button */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onDismiss();
          }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Ionicons name="close" size={16} color={theme.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Section Header Component
const SectionHeader = ({
  title,
  count,
  theme,
}: {
  title: string;
  count: number;
  theme: ThemeColors;
}) => (
  <Animated.View
    entering={FadeInDown.springify()}
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginBottom: 16,
      marginTop: 8,
    }}
  >
    <Text style={{
      fontSize: 18,
      fontWeight: "800",
      color: theme.text,
    }}>
      {title}
    </Text>
    {count > 0 && (
      <View style={{
        backgroundColor: theme.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
      }}>
        <Text style={{
          color: "white",
          fontSize: 12,
          fontWeight: "700",
        }}>
          {count}
        </Text>
      </View>
    )}
  </Animated.View>
);

export default function NotificationsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setNotifications([]);
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    // Navigate based on notification type
    if (notification.type === "movie" && notification.image) {
      // Could navigate to movie detail
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={{
              fontSize: 28,
              fontWeight: "900",
              color: theme.text,
            }}>
              Notifications
            </Text>
            <Text style={{
              fontSize: 13,
              color: theme.textSecondary,
              marginTop: 2,
            }}>
              {unreadNotifications.length} unread messages
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleMarkAllRead}
          disabled={unreadNotifications.length === 0}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 12,
            backgroundColor: unreadNotifications.length > 0
              ? theme.primary + "20"
              : "transparent",
          }}
        >
          <Text style={{
            color: unreadNotifications.length > 0 ? theme.primary : theme.textMuted,
            fontWeight: "600",
            fontSize: 13,
          }}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {notifications.length === 0 ? (
          <Animated.View
            entering={FadeIn}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 100,
            }}
          >
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}>
              <Ionicons name="notifications-off-outline" size={48} color={theme.textMuted} />
            </View>
            <Text style={{
              fontSize: 20,
              fontWeight: "700",
              color: theme.text,
              marginBottom: 8,
            }}>
              All caught up!
            </Text>
            <Text style={{
              fontSize: 14,
              color: theme.textSecondary,
              textAlign: "center",
              paddingHorizontal: 40,
            }}>
              You have no new notifications. Check back later for updates.
            </Text>
          </Animated.View>
        ) : (
          <>
            {/* Unread Section */}
            {unreadNotifications.length > 0 && (
              <>
                <SectionHeader
                  title="New"
                  count={unreadNotifications.length}
                  theme={theme}
                />
                {unreadNotifications.map((notification, index) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    index={index}
                    onPress={() => handleNotificationPress(notification)}
                    onDismiss={() => handleDismiss(notification.id)}
                    theme={theme}
                    isDark={isDark}
                  />
                ))}
              </>
            )}

            {/* Read Section */}
            {readNotifications.length > 0 && (
              <>
                <SectionHeader
                  title="Earlier"
                  count={0}
                  theme={theme}
                />
                {readNotifications.map((notification, index) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    index={index + unreadNotifications.length}
                    onPress={() => handleNotificationPress(notification)}
                    onDismiss={() => handleDismiss(notification.id)}
                    theme={theme}
                    isDark={isDark}
                  />
                ))}
              </>
            )}

            {/* Clear All Button */}
            <Animated.View
              entering={FadeInDown.delay(300).springify()}
              style={{
                paddingHorizontal: 20,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={handleClearAll}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  paddingVertical: 14,
                  borderRadius: 16,
                  backgroundColor: Colors.danger + "15",
                }}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                <Text style={{
                  color: Colors.danger,
                  fontWeight: "700",
                  fontSize: 15,
                }}>
                  Clear All Notifications
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
