import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
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
import { Friend, useApp, useTheme } from "@/context";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Friend Card Component
const FriendCard = ({
  friend,
  index,
  onPress,
}: {
  friend: Friend;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Get friend's liked movies
  const likedMovies = ALL_MOVIES.filter((m) => friend.likedMovies.includes(m.id)).slice(0, 4);

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <AnimatedTouchable
        style={[
          animatedStyle,
          {
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            padding: 16,
            marginBottom: 16,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          },
        ]}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={1}
      >
        {/* Friend Info */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: friend.avatar }}
              style={{ width: 56, height: 56, borderRadius: 28 }}
              contentFit="cover"
            />
            {/* Online indicator */}
            <View style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: friend.isOnline ? Colors.success : theme.textMuted,
              borderWidth: 2,
              borderColor: isDark ? theme.background : theme.card,
            }} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>{friend.name}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
              {friend.isOnline ? "Online" : friend.lastSeen}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onPress();
            }}
            style={{
              backgroundColor: `${theme.primary}20`,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: theme.primary, fontWeight: "700", fontSize: 13 }}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Liked Movies */}
        <View>
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 10 }}>
            Movies they liked
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {likedMovies.map((movie, i) => (
              <View key={movie.id} style={{ width: 50, height: 75, borderRadius: 8, overflow: "hidden" }}>
                <Image
                  source={{ uri: movie.image }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
            ))}
            {friend.likedMovies.length > 4 && (
              <View style={{
                width: 50,
                height: 75,
                borderRadius: 8,
                backgroundColor: isDark ? "#334155" : "#e2e8f0",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "600" }}>
                  +{friend.likedMovies.length - 4}
                </Text>
              </View>
            )}
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};

export default function FriendsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { friends, searchFriends } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = searchFriends(searchQuery);
  const onlineFriends = filteredFriends.filter((f) => f.isOnline);
  const offlineFriends = filteredFriends.filter((f) => !f.isOnline);

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
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              {onlineFriends.length} online • {friends.length} total
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <Ionicons name="person-add" size={18} color="white" />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 14, marginLeft: 6 }}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
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

      {/* Friends List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {filteredFriends.length > 0 ? (
          <>
            {/* Online Friends */}
            {onlineFriends.length > 0 && (
              <Animated.View entering={FadeIn.delay(100)}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                  <View style={{
                    width: 10, height: 10, borderRadius: 5,
                    backgroundColor: Colors.success, marginRight: 8,
                  }} />
                  <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>Online Now</Text>
                </View>
                {onlineFriends.map((friend, index) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    index={index}
                    onPress={() => router.push(`/chat/${friend.id}`)}
                  />
                ))}
              </Animated.View>
            )}

            {/* Offline Friends */}
            {offlineFriends.length > 0 && (
              <Animated.View entering={FadeIn.delay(200)}>
                <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 16, marginTop: 8 }}>
                  Offline
                </Text>
                {offlineFriends.map((friend, index) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    index={index + onlineFriends.length}
                    onPress={() => router.push(`/chat/${friend.id}`)}
                  />
                ))}
              </Animated.View>
            )}
          </>
        ) : (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={{ alignItems: "center", paddingTop: 60 }}
          >
            <View style={{
              width: 100, height: 100, borderRadius: 50,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              alignItems: "center", justifyContent: "center", marginBottom: 20,
            }}>
              <Ionicons name="people-outline" size={48} color={theme.textMuted} />
            </View>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
              No friends found
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 40 }}>
              {searchQuery ? "Try a different search term" : "Add friends to see what movies they like!"}
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
