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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Sample suggested friends data
const SUGGESTED_FRIENDS = [
  {
    id: "suggested1",
    name: "Michael Scott",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    mutualFriends: 12,
    username: "@michaelscott",
  },
  {
    id: "suggested2",
    name: "Pam Beesly",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    mutualFriends: 8,
    username: "@pambeesly",
  },
  {
    id: "suggested3",
    name: "Jim Halpert",
    avatar: "https://randomuser.me/api/portraits/men/16.jpg",
    mutualFriends: 15,
    username: "@jimhalpert",
  },
  {
    id: "suggested4",
    name: "Dwight Schrute",
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
    mutualFriends: 5,
    username: "@dwightschrute",
  },
  {
    id: "suggested5",
    name: "Angela Martin",
    avatar: "https://randomuser.me/api/portraits/women/16.jpg",
    mutualFriends: 3,
    username: "@angelamartin",
  },
];

// Suggested Friend Card
const SuggestedFriendCard = ({
  friend,
  index,
  onAdd,
  isAdded,
}: {
  friend: (typeof SUGGESTED_FRIENDS)[0];
  index: number;
  onAdd: () => void;
  isAdded: boolean;
}) => {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <AnimatedTouchable
        style={[
          animatedStyle,
          {
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            padding: 16,
            marginBottom: 12,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          },
        ]}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        activeOpacity={1}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: friend.avatar }}
            style={{ width: 56, height: 56, borderRadius: 28 }}
            contentFit="cover"
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}
            >
              {friend.name}
            </Text>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 13,
                marginTop: 2,
              }}
            >
              {friend.username}
            </Text>
            <Text
              style={{
                color: theme.textMuted,
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {friend.mutualFriends} mutual friends
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onAdd();
            }}
            disabled={isAdded}
          >
            <LinearGradient
              colors={
                isAdded
                  ? [Colors.success, "#059669"]
                  : [Colors.primary, Colors.primaryDark]
              }
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons
                name={isAdded ? "checkmark" : "person-add"}
                size={16}
                color="white"
              />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 13 }}>
                {isAdded ? "Added" : "Add"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

export default function AddFriendScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [addedFriends, setAddedFriends] = useState<string[]>([]);

  const filteredSuggestions = SUGGESTED_FRIENDS.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = (friendId: string, friendName: string) => {
    if (!addedFriends.includes(friendId)) {
      setAddedFriends((prev) => [...prev, friendId]);
      showToast(`Friend request sent to ${friendName}!`, "success");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDark
            ? ["#1e1b4b", "#0f172a", "#020617"]
            : ["#f8fafc", "#f1f5f9", "#e2e8f0"]
        }
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
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
              backgroundColor: isDark
                ? "rgba(30, 41, 59, 0.8)"
                : "rgba(226, 232, 240, 0.8)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>
              Add Friends
            </Text>
            <Text
              style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}
            >
              Find and connect with people
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark
              ? "rgba(30, 41, 59, 0.8)"
              : "rgba(241, 245, 249, 0.9)",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name or username..."
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, marginLeft: 12, fontSize: 15, color: theme.text }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Quick Add Options */}
      <Animated.View
        entering={FadeIn.delay(200)}
        style={{ paddingHorizontal: 20, marginBottom: 16 }}
      >
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              showToast("QR Code scanner coming soon!", "info");
            }}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDark
                ? "rgba(30, 41, 59, 0.6)"
                : theme.card,
              borderRadius: 16,
              padding: 16,
              gap: 8,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <Ionicons name="qr-code" size={24} color={theme.primary} />
            <Text style={{ color: theme.text, fontWeight: "600" }}>
              Scan QR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              showToast("Contact sync coming soon!", "info");
            }}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDark
                ? "rgba(30, 41, 59, 0.6)"
                : theme.card,
              borderRadius: 16,
              padding: 16,
              gap: 8,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <Ionicons name="people" size={24} color={theme.secondary} />
            <Text style={{ color: theme.text, fontWeight: "600" }}>
              Contacts
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Suggested Friends */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Animated.View entering={FadeIn.delay(300)}>
          <Text
            style={{
              color: theme.textSecondary,
              fontWeight: "600",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Suggested Friends
          </Text>
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((friend, index) => (
              <SuggestedFriendCard
                key={friend.id}
                friend={friend}
                index={index}
                onAdd={() => handleAddFriend(friend.id, friend.name)}
                isAdded={addedFriends.includes(friend.id)}
              />
            ))
          ) : (
            <Animated.View
              entering={FadeIn}
              style={{ alignItems: "center", paddingTop: 40 }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: isDark
                    ? "rgba(30, 41, 59, 0.6)"
                    : theme.card,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={36}
                  color={theme.textMuted}
                />
              </View>
              <Text
                style={{
                  color: theme.text,
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 8,
                }}
              >
                No results found
              </Text>
              <Text
                style={{
                  color: theme.textSecondary,
                  fontSize: 14,
                  textAlign: "center",
                  paddingHorizontal: 40,
                }}
              >
                Try searching with a different name or username
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Invite Friends Section */}
        <Animated.View entering={FadeIn.delay(500)} style={{ marginTop: 24 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              showToast("Invite link copied!", "success");
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#7c3aed", "#4f46e5", "#2563eb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "800",
                      marginBottom: 4,
                    }}
                  >
                    Invite Friends
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: 14,
                    }}
                  >
                    Share your invite link and get rewards!
                  </Text>
                </View>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="share-social" size={24} color="white" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
