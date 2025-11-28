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
} from "react-native-reanimated";

import { Colors, MOVIES, TRENDING } from "@/constants/data";
import { useTheme } from "@/context";

// Notification types
type NotificationType = "new_release" | "recommendation" | "update" | "promo" | "reminder" | "social";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  image?: string;
  time: string;
  read: boolean;
  movieId?: number;
}

// Sample notifications data
const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "new_release",
    title: "New Release: Dune Part Two",
    message: "The epic sequel is now available to stream. Watch the continuation of Paul Atreides' journey.",
    image: MOVIES[0].image,
    time: "2 min ago",
    read: false,
    movieId: 1,
  },
  {
    id: "2",
    type: "recommendation",
    title: "Recommended for You",
    message: "Based on your watchlist, we think you'll love 'Oppenheimer'. Add it to your list now!",
    image: MOVIES[1].image,
    time: "1 hour ago",
    read: false,
    movieId: 2,
  },
  {
    id: "3",
    type: "promo",
    title: "🎉 Premium Sale - 50% Off!",
    message: "Upgrade to Premium and enjoy unlimited access to all movies and exclusive content. Limited time offer!",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "reminder",
    title: "Continue Watching",
    message: "You're 60% through 'The Batman'. Pick up where you left off!",
    image: MOVIES[2].image,
    time: "5 hours ago",
    read: true,
    movieId: 3,
  },
  {
    id: "5",
    type: "social",
    title: "Friend Activity",
    message: "John Doe added 'John Wick: Chapter 4' to their watchlist. Check it out!",
    image: TRENDING[0].image,
    time: "Yesterday",
    read: true,
    movieId: 6,
  },
  {
    id: "6",
    type: "update",
    title: "App Update Available",
    message: "Version 2.0 is here with new features, improved performance, and bug fixes.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "7",
    type: "new_release",
    title: "Spider-Man: No Way Home",
    message: "The multiverse awaits! Watch the web-slinger's most ambitious adventure yet.",
    image: TRENDING[1].image,
    time: "3 days ago",
    read: true,
    movieId: 7,
  },
  {
    id: "8",
    type: "recommendation",
    title: "Top Pick This Week",
    message: "Interstellar is trending! Don't miss Christopher Nolan's space epic.",
    image: MOVIES[4].image,
    time: "1 week ago",
    read: true,
    movieId: 5,
  },
];

// Notification Icon Component
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  const iconMap: Record<NotificationType, { icon: string; color: string; bg: string }> = {
    new_release: { icon: "film", color: Colors.primary, bg: "rgba(139, 92, 246, 0.2)" },
    recommendation: { icon: "sparkles", color: Colors.accent, bg: "rgba(245, 158, 11, 0.2)" },
    update: { icon: "refresh-circle", color: Colors.success, bg: "rgba(16, 185, 129, 0.2)" },
    promo: { icon: "pricetag", color: Colors.secondary, bg: "rgba(236, 72, 153, 0.2)" },
    reminder: { icon: "time", color: Colors.primary, bg: "rgba(139, 92, 246, 0.2)" },
    social: { icon: "people", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.2)" },
  };

  const config = iconMap[type];

  return (
    <View style={{
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: config.bg,
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Ionicons name={config.icon as any} size={22} color={config.color} />
    </View>
  );
};

// Notification Item Component
const NotificationItem = ({
  notification,
  index,
  onPress,
  onDismiss,
}: {
  notification: Notification;
  index: number;
  onPress: () => void;
  onDismiss: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      exiting={SlideOutRight.duration(300)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          padding: 16,
          marginBottom: 12,
          backgroundColor: notification.read
            ? isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(241, 245, 249, 0.6)"
            : isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
          borderRadius: 20,
          borderWidth: notification.read ? 0 : 1,
          borderColor: isDark ? theme.primary + "30" : theme.primary + "20",
        }}
      >
        {/* Left - Icon or Image */}
        {notification.image ? (
          <View style={{ marginRight: 14 }}>
            <Image
              source={{ uri: notification.image }}
              style={{ width: 56, height: 80, borderRadius: 12 }}
              contentFit="cover"
            />
            {!notification.read && (
              <View style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: theme.primary,
                borderWidth: 2,
                borderColor: isDark ? theme.background : theme.card,
              }} />
            )}
          </View>
        ) : (
          <View style={{ marginRight: 14 }}>
            <NotificationIcon type={notification.type} />
            {!notification.read && (
              <View style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: theme.primary,
                borderWidth: 2,
                borderColor: isDark ? theme.background : theme.card,
              }} />
            )}
          </View>
        )}

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text style={{
            color: theme.text,
            fontSize: 15,
            fontWeight: notification.read ? "600" : "700",
            marginBottom: 4,
          }} numberOfLines={2}>
            {notification.title}
          </Text>
          <Text style={{
            color: theme.textSecondary,
            fontSize: 13,
            lineHeight: 18,
            marginBottom: 6,
          }} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 11 }}>
            {notification.time}
          </Text>
        </View>

        {/* Dismiss Button */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onDismiss();
          }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
          }}
        >
          <Ionicons name="close" size={18} color={theme.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Filter Chip Component
const FilterChip = ({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: isSelected
          ? theme.primary
          : isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
        marginRight: 10,
      }}
    >
      <Text style={{
        color: isSelected ? "white" : theme.textSecondary,
        fontSize: 14,
        fontWeight: "600",
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Navigate if there's a movie
    if (notification.movieId) {
      router.push(`/movie/${notification.movieId}`);
    }
  };

  const handleDismiss = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleMarkAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setNotifications([]);
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
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <View>
              <Text style={{ color: theme.text, fontSize: 26, fontWeight: "900" }}>
                Notifications
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </Text>
            </View>
          </View>

          {notifications.length > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllRead}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)",
              }}
            >
              <Text style={{ color: theme.primary, fontSize: 12, fontWeight: "700" }}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <View style={{ flexDirection: "row" }}>
          <FilterChip
            label="All"
            isSelected={filter === "all"}
            onPress={() => setFilter("all")}
          />
          <FilterChip
            label={`Unread (${unreadCount})`}
            isSelected={filter === "unread"}
            onPress={() => setFilter("unread")}
          />
        </View>
      </Animated.View>

      {/* Notifications List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              index={index}
              onPress={() => handleNotificationPress(notification)}
              onDismiss={() => handleDismiss(notification.id)}
            />
          ))
        ) : (
          <Animated.View
            entering={FadeIn.delay(200)}
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
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}>
              <Ionicons name="notifications-off-outline" size={48} color={theme.textMuted} />
            </View>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 40 }}>
              {filter === "unread"
                ? "You've read all your notifications. Good job!"
                : "We'll notify you when there's something new."}
            </Text>
          </Animated.View>
        )}

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <Animated.View entering={FadeIn.delay(400)} style={{ marginTop: 20, alignItems: "center" }}>
            <TouchableOpacity
              onPress={handleClearAll}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              }}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              <Text style={{ color: Colors.danger, fontSize: 14, fontWeight: "600" }}>
                Clear All Notifications
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
