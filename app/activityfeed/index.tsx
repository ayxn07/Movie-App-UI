import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
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
  FadeInRight,
} from "react-native-reanimated";

import { Colors, MOVIES } from "@/constants/data";
import { SONGS, ARTISTS, getSongById } from "@/constants/musicData";
import { useApp, useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Activity Types
type ActivityType = "listening" | "watching" | "liked" | "followed" | "shared" | "joined_party";

interface Activity {
  id: string;
  type: ActivityType;
  user: {
    name: string;
    image: string;
  };
  content: {
    title: string;
    subtitle: string;
    image: string;
  };
  time: string;
  isOnline: boolean;
}

// Generate sample activities
const generateActivities = (): Activity[] => {
  const activities: Activity[] = [
    {
      id: "1",
      type: "listening",
      user: { name: "Sarah", image: "https://randomuser.me/api/portraits/women/44.jpg" },
      content: { title: SONGS[0].title, subtitle: SONGS[0].artist, image: SONGS[0].cover },
      time: "2 min ago",
      isOnline: true,
    },
    {
      id: "2",
      type: "watching",
      user: { name: "Mike", image: "https://randomuser.me/api/portraits/men/22.jpg" },
      content: { title: MOVIES[0].title, subtitle: MOVIES[0].genre, image: MOVIES[0].image },
      time: "5 min ago",
      isOnline: true,
    },
    {
      id: "3",
      type: "liked",
      user: { name: "Emma", image: "https://randomuser.me/api/portraits/women/33.jpg" },
      content: { title: SONGS[1].title, subtitle: SONGS[1].artist, image: SONGS[1].cover },
      time: "10 min ago",
      isOnline: false,
    },
    {
      id: "4",
      type: "joined_party",
      user: { name: "Alex", image: "https://randomuser.me/api/portraits/men/55.jpg" },
      content: { title: "Movie Night", subtitle: "Watch Party", image: MOVIES[1].image },
      time: "15 min ago",
      isOnline: true,
    },
    {
      id: "5",
      type: "followed",
      user: { name: "Lisa", image: "https://randomuser.me/api/portraits/women/66.jpg" },
      content: { title: ARTISTS[0].name, subtitle: "Artist", image: ARTISTS[0].image },
      time: "30 min ago",
      isOnline: false,
    },
    {
      id: "6",
      type: "listening",
      user: { name: "John", image: "https://randomuser.me/api/portraits/men/32.jpg" },
      content: { title: SONGS[2].title, subtitle: SONGS[2].artist, image: SONGS[2].cover },
      time: "1 hour ago",
      isOnline: true,
    },
    {
      id: "7",
      type: "watching",
      user: { name: "Amy", image: "https://randomuser.me/api/portraits/women/22.jpg" },
      content: { title: MOVIES[2].title, subtitle: MOVIES[2].genre, image: MOVIES[2].image },
      time: "2 hours ago",
      isOnline: false,
    },
    {
      id: "8",
      type: "shared",
      user: { name: "David", image: "https://randomuser.me/api/portraits/men/44.jpg" },
      content: { title: SONGS[3].title, subtitle: SONGS[3].artist, image: SONGS[3].cover },
      time: "3 hours ago",
      isOnline: false,
    },
  ];

  return activities;
};

// Activity Card Component
const ActivityCard = ({
  activity,
  index,
  onPress,
}: {
  activity: Activity;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const { showToast } = useApp();

  const getActivityIcon = () => {
    switch (activity.type) {
      case "listening":
        return "musical-note";
      case "watching":
        return "play-circle";
      case "liked":
        return "heart";
      case "followed":
        return "person-add";
      case "shared":
        return "share-social";
      case "joined_party":
        return "people";
      default:
        return "ellipse";
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case "listening":
        return Colors.secondary;
      case "watching":
        return Colors.primary;
      case "liked":
        return Colors.danger;
      case "followed":
        return Colors.info;
      case "shared":
        return Colors.success;
      case "joined_party":
        return Colors.accent;
      default:
        return theme.textSecondary;
    }
  };

  const getActivityText = () => {
    switch (activity.type) {
      case "listening":
        return "is listening to";
      case "watching":
        return "is watching";
      case "liked":
        return "liked";
      case "followed":
        return "followed";
      case "shared":
        return "shared";
      case "joined_party":
        return "joined";
      default:
        return "";
    }
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 60).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{
          flexDirection: "row",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 20,
          padding: 14,
          marginBottom: 12,
        }}
      >
        {/* User Avatar with Online Status */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: activity.user.image }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: activity.isOnline ? Colors.success : "transparent",
            }}
            contentFit="cover"
          />
          {activity.isOnline && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: Colors.success,
                borderWidth: 2,
                borderColor: isDark ? "#1e293b" : theme.card,
              }}
            />
          )}
        </View>

        {/* Activity Info */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }}>
              {activity.user.name}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginLeft: 4 }}>
              {getActivityText()}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
            <Image
              source={{ uri: activity.content.image }}
              style={{ width: 36, height: 36, borderRadius: 8 }}
              contentFit="cover"
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: "600" }} numberOfLines={1}>
                {activity.content.title}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 11 }} numberOfLines={1}>
                {activity.content.subtitle}
              </Text>
            </View>
          </View>
          <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 6 }}>
            {activity.time}
          </Text>
        </View>

        {/* Activity Type Icon */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: `${getActivityColor()}20`,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Ionicons name={getActivityIcon() as any} size={18} color={getActivityColor()} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Online Friend Component
const OnlineFriend = ({
  user,
  index,
  onPress,
}: {
  user: { name: string; image: string };
  index: number;
  onPress: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{ alignItems: "center", marginRight: 16 }}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: user.image }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 3,
              borderColor: Colors.success,
            }}
            contentFit="cover"
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: Colors.success,
              borderWidth: 2,
              borderColor: theme.background,
            }}
          />
        </View>
        <Text style={{ color: theme.text, fontSize: 11, fontWeight: "500", marginTop: 6 }}>
          {user.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ActivityFeedScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");

  const activities = generateActivities();
  const onlineFriends = [
    { name: "Sarah", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Mike", image: "https://randomuser.me/api/portraits/men/22.jpg" },
    { name: "Alex", image: "https://randomuser.me/api/portraits/men/55.jpg" },
    { name: "John", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Emma", image: "https://randomuser.me/api/portraits/women/33.jpg" },
  ];

  const filters = [
    { id: "all", name: "All" },
    { id: "listening", name: "Listening" },
    { id: "watching", name: "Watching" },
    { id: "social", name: "Social" },
  ];

  const filteredActivities = activeFilter === "all"
    ? activities
    : activeFilter === "social"
    ? activities.filter((a) => ["liked", "followed", "shared", "joined_party"].includes(a.type))
    : activities.filter((a) => a.type === activeFilter);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.springify()}
          style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
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
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Activity</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                See what friends are up to
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/friends");
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="people" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Online Friends */}
        <Animated.View entering={FadeIn.delay(100)} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: Colors.success,
                  marginRight: 8,
                }}
              />
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700" }}>
                Online Now
              </Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {onlineFriends.length} friends
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {onlineFriends.map((friend, index) => (
              <OnlineFriend
                key={friend.name}
                user={friend}
                index={index}
                onPress={() => showToast(`Message ${friend.name}`, "info")}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Filters */}
        <Animated.View entering={FadeIn.delay(150)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 10 }}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveFilter(filter.id);
                }}
                style={{
                  backgroundColor: activeFilter === filter.id
                    ? theme.primary
                    : isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: activeFilter === filter.id ? "white" : theme.text,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Activity Feed */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
            Recent Activity
          </Text>
          {filteredActivities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={index}
              onPress={() => {
                if (activity.type === "listening") {
                  const song = SONGS.find((s) => s.title === activity.content.title);
                  if (song) {
                    router.push(`/musicplayer/${song.id}`);
                  }
                } else if (activity.type === "watching") {
                  const movie = MOVIES.find((m) => m.title === activity.content.title);
                  if (movie) {
                    router.push(`/movie/${movie.id}`);
                  }
                } else if (activity.type === "joined_party") {
                  router.push("/watchparty");
                }
              }}
            />
          ))}
        </View>

        {/* Start Activity */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              router.push("/watchparty");
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#6366f1", "#8b5cf6", "#a855f7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 24,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="people" size={28} color="white" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "800" }}>
                  Start a Watch Party
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>
                  Watch movies together with friends
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
