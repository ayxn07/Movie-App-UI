import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  ALL_MOVIES,
  Colors,
  FRIENDS,
  SAMPLE_CHATS,
  SUGGESTED_FRIENDS,
} from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Friend } from "@/types";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Friend Card Component
const FriendCard = ({
  friend,
  index,
  theme,
  isDark,
  onPress,
}: {
  friend: Friend;
  index: number;
  theme: ThemeColors;
  isDark: boolean;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const chat = SAMPLE_CHATS.find((c) => c.friendId === friend.id);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Get favorite movies
  const favoriteMovies = friend.favoriteMovies
    .map((id) => ALL_MOVIES.find((m) => m.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify()}
      style={{ marginBottom: 12, paddingHorizontal: 20 }}
    >
      <AnimatedTouchable
        style={animatedStyle}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
        activeOpacity={1}
      >
        <View style={{
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 20,
          padding: 16,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Avatar with Online Status */}
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: friend.avatar }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
                contentFit="cover"
              />
              {friend.isOnline && (
                <View style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: Colors.success,
                  borderWidth: 2,
                  borderColor: isDark ? "#1e293b" : "#ffffff",
                }} />
              )}
            </View>

            {/* Friend Info */}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>
                  {friend.name}
                </Text>
                {chat && chat.unreadCount > 0 && (
                  <View style={{
                    backgroundColor: Colors.primary,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}>
                    <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>
                      {chat.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                {friend.username}
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
                {friend.isOnline ? "Online" : friend.lastActive}
              </Text>
            </View>

            {/* Watch Count */}
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: theme.primary, fontSize: 20, fontWeight: "800" }}>
                {friend.watchedCount}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 11 }}>Watched</Text>
            </View>
          </View>

          {/* Favorite Movies Preview */}
          {favoriteMovies.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8 }}>
                Likes
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {favoriteMovies.map((movie, idx) => (
                  <View
                    key={movie?.id}
                    style={{
                      width: 48,
                      height: 72,
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
              </View>
            </View>
          )}
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
}: {
  friend: Friend;
  index: number;
  theme: ThemeColors;
  isDark: boolean;
}) => {
  const [isAdded, setIsAdded] = useState(false);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 60).springify()}
      style={{
        width: 140,
        marginRight: 12,
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
        borderWidth: isDark ? 0 : 1,
        borderColor: theme.border,
      }}
    >
      <Image
        source={{ uri: friend.avatar }}
        style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 12 }}
        contentFit="cover"
      />
      <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14, textAlign: "center" }} numberOfLines={1}>
        {friend.name}
      </Text>
      <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
        {friend.watchedCount} movies
      </Text>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setIsAdded(!isAdded);
        }}
        style={{ marginTop: 12, width: "100%" }}
      >
        {isAdded ? (
          <View style={{
            backgroundColor: Colors.success + "20",
            paddingVertical: 8,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}>
            <Ionicons name="checkmark" size={16} color={Colors.success} />
            <Text style={{ color: Colors.success, fontWeight: "700", fontSize: 12 }}>Added</Text>
          </View>
        ) : (
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={{
              paddingVertical: 8,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Ionicons name="person-add" size={14} color="white" />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>Add</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

type TabType = "friends" | "discover";

export default function FriendsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("friends");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter friends based on search
  const filteredFriends = FRIENDS.filter((friend) =>
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
      <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
              alignItems: "center", justifyContent: "center", marginRight: 16,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Friends</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
              {FRIENDS.length} friends • {FRIENDS.filter((f) => f.isOnline).length} online
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.9)",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
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

        {/* Tabs */}
        <Animated.View entering={FadeInDown.delay(150).springify()} style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          {([
            { value: "friends", label: "My Friends" },
            { value: "discover", label: "Discover" },
          ] as { value: TabType; label: string }[]).map((tab) => (
            <TouchableOpacity
              key={tab.value}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab.value);
              }}
              style={{ flex: 1 }}
            >
              <View style={{
                paddingVertical: 12,
                borderRadius: 16,
                backgroundColor: activeTab === tab.value ? theme.primary : theme.card,
                alignItems: "center",
              }}>
                <Text style={{
                  fontWeight: "700",
                  fontSize: 14,
                  color: activeTab === tab.value ? "#ffffff" : theme.textSecondary,
                }}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </Animated.View>

      {activeTab === "friends" ? (
        <>
          {/* Friends List */}
          <FlashList
            data={filteredFriends}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <FriendCard
                friend={item}
                index={index}
                theme={theme}
                isDark={isDark}
                onPress={() => router.push(`/chat/${item.id}`)}
              />
            )}
            keyExtractor={(item) => item.id}
            estimatedItemSize={180}
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
                <Ionicons name="people-outline" size={48} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16 }}>No friends found</Text>
              </View>
            }
          />
        </>
      ) : (
        <Animated.ScrollView
          entering={FadeIn}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Suggested Friends */}
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800", marginBottom: 16 }}>
              People You May Know
            </Text>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {SUGGESTED_FRIENDS.map((friend, index) => (
                <SuggestedFriendCard
                  key={friend.id}
                  friend={friend}
                  index={index}
                  theme={theme}
                  isDark={isDark}
                />
              ))}
            </Animated.ScrollView>
          </View>

          {/* Find Friends */}
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800", marginBottom: 16 }}>
              Find Friends
            </Text>
            <View style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 20,
              padding: 20,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <View style={{
                  width: 48, height: 48, borderRadius: 24,
                  backgroundColor: theme.primary + "20",
                  alignItems: "center", justifyContent: "center",
                  marginRight: 16,
                }}>
                  <Ionicons name="person-add" size={24} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>
                    Invite Friends
                  </Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                    Share MoviesHub with your friends
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={{
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 14 }}>Send Invite</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Connect Social Media */}
            <View style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 20,
              padding: 20,
              marginTop: 16,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16, marginBottom: 16 }}>
                Connect Accounts
              </Text>
              {[
                { name: "Facebook", icon: "logo-facebook", color: "#1877F2" },
                { name: "Twitter", icon: "logo-twitter", color: "#1DA1F2" },
                { name: "Instagram", icon: "logo-instagram", color: "#E4405F" },
              ].map((social, index) => (
                <TouchableOpacity
                  key={social.name}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderTopWidth: index > 0 ? 1 : 0,
                    borderTopColor: theme.border,
                  }}
                >
                  <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: social.color + "20",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Ionicons name={social.icon as any} size={20} color={social.color} />
                  </View>
                  <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15, flex: 1, marginLeft: 12 }}>
                    {social.name}
                  </Text>
                  <Text style={{ color: theme.primary, fontWeight: "600", fontSize: 13 }}>Connect</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.ScrollView>
      )}
    </View>
  );
}
