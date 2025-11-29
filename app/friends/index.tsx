import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Mock friends data
const FRIENDS_DATA = [
  {
    id: 1,
    name: "Emma Wilson",
    username: "@emmawilson",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    isOnline: true,
    favoriteMovies: [1, 3, 7],
    mutualFriends: 12,
  },
  {
    id: 2,
    name: "James Rodriguez",
    username: "@jamesrod",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    isOnline: true,
    favoriteMovies: [2, 5, 9],
    mutualFriends: 8,
  },
  {
    id: 3,
    name: "Sophia Chen",
    username: "@sophiachen",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    isOnline: false,
    favoriteMovies: [4, 6, 10],
    mutualFriends: 5,
  },
  {
    id: 4,
    name: "Michael Brown",
    username: "@mikebrown",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    isOnline: true,
    favoriteMovies: [1, 8, 11],
    mutualFriends: 15,
  },
  {
    id: 5,
    name: "Olivia Taylor",
    username: "@oliviataylor",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    isOnline: false,
    favoriteMovies: [3, 7, 12],
    mutualFriends: 3,
  },
];

// Suggested friends
const SUGGESTED_FRIENDS = [
  {
    id: 6,
    name: "Alex Johnson",
    username: "@alexj",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    isOnline: false,
    favoriteMovies: [2, 4, 8],
    mutualFriends: 7,
  },
  {
    id: 7,
    name: "Isabella Martinez",
    username: "@isabellamart",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    isOnline: true,
    favoriteMovies: [5, 9, 10],
    mutualFriends: 4,
  },
  {
    id: 8,
    name: "Daniel Lee",
    username: "@daniellee",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    isOnline: true,
    favoriteMovies: [1, 6, 11],
    mutualFriends: 9,
  },
];

// Friend Card Component
const FriendCard = ({
  friend,
  index,
  theme,
  isDark,
  onPress,
  onChat,
}: {
  friend: (typeof FRIENDS_DATA)[0];
  index: number;
  theme: ThemeColors;
  isDark: boolean;
  onPress: () => void;
  onChat: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const favoriteMovies = friend.favoriteMovies
    .map((id) => ALL_MOVIES.find((m) => m.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).springify()}
      style={{ marginBottom: 16 }}
    >
      <AnimatedTouchable
        style={animatedStyle}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={1}
      >
        <View
          style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
            borderRadius: 20,
            padding: 16,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          {/* User Info */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: friend.avatar }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
                contentFit="cover"
              />
              {friend.isOnline && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: Colors.success,
                    borderWidth: 3,
                    borderColor: isDark ? theme.card : "white",
                  }}
                />
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>
                {friend.name}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                {friend.username}
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                {friend.mutualFriends} mutual friends
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onChat();
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: theme.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="chatbubble" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Favorite Movies */}
          <View>
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8 }}>
              Favorite Movies
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {favoriteMovies.map((movie, idx) => (
                <View
                  key={movie?.id || idx}
                  style={{
                    width: 50,
                    height: 70,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: movie?.image }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
              ))}
              <View
                style={{
                  width: 50,
                  height: 70,
                  borderRadius: 8,
                  backgroundColor: theme.backgroundTertiary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "600" }}>
                  +{friend.favoriteMovies.length - 3}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

// Suggested Friend Card
const SuggestedFriendCard = ({
  friend,
  index,
  theme,
  isDark,
  onAdd,
}: {
  friend: (typeof SUGGESTED_FRIENDS)[0];
  index: number;
  theme: ThemeColors;
  isDark: boolean;
  onAdd: () => void;
}) => {
  const [added, setAdded] = useState(false);

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={{
        width: 160,
        marginRight: 16,
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
        borderWidth: isDark ? 0 : 1,
        borderColor: theme.border,
      }}
    >
      <View style={{ position: "relative", marginBottom: 12 }}>
        <Image
          source={{ uri: friend.avatar }}
          style={{ width: 64, height: 64, borderRadius: 32 }}
          contentFit="cover"
        />
        {friend.isOnline && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: Colors.success,
              borderWidth: 3,
              borderColor: isDark ? theme.card : "white",
            }}
          />
        )}
      </View>
      <Text
        style={{ color: theme.text, fontWeight: "700", fontSize: 14, textAlign: "center" }}
        numberOfLines={1}
      >
        {friend.name}
      </Text>
      <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
        {friend.mutualFriends} mutual
      </Text>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setAdded(!added);
          onAdd();
        }}
        style={{ marginTop: 12, width: "100%" }}
      >
        {added ? (
          <View
            style={{
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: theme.backgroundTertiary,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 13 }}>
              Requested
            </Text>
          </View>
        ) : (
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={{
              paddingVertical: 10,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>Add Friend</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function FriendsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter friends based on search
  const filteredFriends = FRIENDS_DATA.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Friends</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              {FRIENDS_DATA.length} friends
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: theme.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="person-add" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.9)",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search friends..."
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, marginLeft: 12, fontSize: 15, color: theme.text }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Suggested Friends */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800" }}>
              Suggested for You
            </Text>
            <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingLeft: 20 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {SUGGESTED_FRIENDS.map((friend, index) => (
              <SuggestedFriendCard
                key={friend.id}
                friend={friend}
                index={index}
                theme={theme}
                isDark={isDark}
                onAdd={() => {}}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Friends List */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Animated.View
            entering={FadeIn.delay(200)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800" }}>
              Your Friends
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: Colors.success,
                }}
              />
              <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                {FRIENDS_DATA.filter((f) => f.isOnline).length} online
              </Text>
            </View>
          </Animated.View>

          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend, index) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                index={index}
                theme={theme}
                isDark={isDark}
                onPress={() => {}}
                onChat={() => router.push(`/chat/${friend.id}`)}
              />
            ))
          ) : (
            <Animated.View
              entering={FadeIn}
              style={{ alignItems: "center", paddingVertical: 40 }}
            >
              <Ionicons name="people-outline" size={48} color={theme.textMuted} />
              <Text
                style={{
                  color: theme.text,
                  fontSize: 18,
                  fontWeight: "700",
                  marginTop: 16,
                }}
              >
                No friends found
              </Text>
              <Text
                style={{
                  color: theme.textSecondary,
                  fontSize: 14,
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Try searching with a different name
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
