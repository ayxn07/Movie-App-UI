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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { LIKED_SONGS, SONGS, getSongById } from "@/constants/musicData";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Song Row Component
const LikedSongRow = ({
  songId,
  index,
  isPlaying,
  onPlay,
  onUnlike,
}: {
  songId: string;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  onUnlike: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const song = getSongById(songId);
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!song) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 60).springify()}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          scale.value = withSpring(0.98, {}, () => {
            scale.value = withSpring(1);
          });
          onPlay();
        }}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push(`/lyrics/${song.id}`);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isPlaying ? `${theme.primary}15` : "transparent",
          borderRadius: 16,
          marginBottom: 4,
        }}
      >
        <Image
          source={{ uri: song.cover }}
          style={{ width: 56, height: 56, borderRadius: 12 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text
            style={{
              color: isPlaying ? theme.primary : theme.text,
              fontWeight: "600",
              fontSize: 15,
            }}
            numberOfLines={1}
          >
            {song.title}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }} numberOfLines={1}>
            {song.artist} • {song.album}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ color: theme.textMuted, fontSize: 12 }}>
            {formatDuration(song.duration)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onUnlike();
            }}
          >
            <Ionicons name="heart" size={22} color={Colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function LikedSongsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [likedSongs, setLikedSongs] = useState(LIKED_SONGS);
  const [isShuffled, setIsShuffled] = useState(false);

  const likedSongsList = likedSongs.map((id) => getSongById(id)).filter(Boolean);

  // Calculate total duration
  const totalDuration = likedSongsList.reduce((acc, song) => acc + (song?.duration || 0), 0);

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  const handlePlaySong = (index: number) => {
    setCurrentSongIndex(index);
    const song = getSongById(likedSongs[index]);
    if (song) {
      showToast(`Now playing: ${song.title}`, "info");
    }
  };

  const handlePlayAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setCurrentSongIndex(0);
    showToast("Playing Liked Songs", "info");
  };

  const handleShuffle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsShuffled(!isShuffled);
    const randomIndex = Math.floor(Math.random() * likedSongs.length);
    setCurrentSongIndex(randomIndex);
    showToast(isShuffled ? "Shuffle off" : "Shuffle on", "info");
  };

  const handleUnlike = (songId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLikedSongs((prev) => prev.filter((id) => id !== songId));
    const song = getSongById(songId);
    showToast(`Removed ${song?.title} from Liked Songs`, "info");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.secondary, "#db2777", "#be185d"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 50, paddingBottom: 40 }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 32,
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
                backgroundColor: "rgba(0,0,0,0.3)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(0,0,0,0.3)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Liked Songs Icon */}
          <View style={{ alignItems: "center", paddingHorizontal: 20 }}>
            <View
              style={{
                width: width * 0.45,
                height: width * 0.45,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.3,
                shadowRadius: 30,
                elevation: 15,
              }}
            >
              <Ionicons name="heart" size={100} color="white" />
            </View>
            <Text style={{ color: "white", fontSize: 28, fontWeight: "900", marginTop: 20 }}>
              Liked Songs
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6 }}>
              {likedSongs.length} songs • {formatTotalDuration(totalDuration)}
            </Text>
          </View>
        </LinearGradient>

        {/* Actions */}
        <View style={{ paddingHorizontal: 20, marginTop: -20 }}>
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  showToast("Download started", "success");
                }}
              >
                <Ionicons name="download-outline" size={28} color={theme.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  showToast("Share link copied!", "success");
                }}
              >
                <Ionicons name="share-outline" size={28} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <TouchableOpacity
                onPress={handleShuffle}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="shuffle" size={24} color={isShuffled ? theme.primary : theme.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePlayAll}>
                <LinearGradient
                  colors={[Colors.secondary, "#db2777"]}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play" size={28} color="white" style={{ marginLeft: 3 }} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Sort Options */}
          <Animated.View
            entering={FadeIn.delay(150)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <Ionicons name="swap-vertical" size={16} color={theme.textSecondary} />
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: "600", marginLeft: 6 }}>
                Recently Added
              </Text>
              <Ionicons name="chevron-down" size={16} color={theme.textSecondary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </Animated.View>

          {/* Songs List */}
          <Animated.View entering={FadeIn.delay(200)}>
            {likedSongs.length > 0 ? (
              <View
                style={{
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : theme.card,
                  borderRadius: 20,
                  paddingVertical: 8,
                }}
              >
                {likedSongs.map((songId, index) => (
                  <LikedSongRow
                    key={songId}
                    songId={songId}
                    index={index}
                    isPlaying={currentSongIndex === index}
                    onPlay={() => handlePlaySong(index)}
                    onUnlike={() => handleUnlike(songId)}
                  />
                ))}
              </View>
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 60 }}>
                <Ionicons name="heart-outline" size={64} color={theme.textMuted} />
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: "600", marginTop: 16 }}>
                  No liked songs yet
                </Text>
                <Text style={{ color: theme.textSecondary, marginTop: 8, textAlign: "center" }}>
                  Songs you like will appear here
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/songs")}
                  style={{ marginTop: 20 }}
                >
                  <LinearGradient
                    colors={[Colors.secondary, "#db2777"]}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 25,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      Browse Music
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

          {/* Discover More */}
          {likedSongs.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(300).springify()}
              style={{ marginTop: 32 }}
            >
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
                You might also like
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/recommendations")}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#8b5cf6", "#6366f1", "#4f46e5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 20,
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
                    <Ionicons name="sparkles" size={28} color="white" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "800" }}>
                      AI Recommendations
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>
                      Discover new music based on your likes
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
