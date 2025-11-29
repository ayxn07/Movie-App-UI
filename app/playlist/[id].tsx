import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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

import { Colors } from "@/constants/data";
import { PLAYLISTS, SONGS, getPlaylistById, getSongById } from "@/constants/musicData";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Song Row Component
const PlaylistSongRow = ({
  songId,
  index,
  isPlaying,
  onPlay,
  onRemove,
}: {
  songId: string;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  onRemove: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const song = getSongById(songId);
  const router = useRouter();

  if (!song) return null;

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={onPlay}
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
          borderRadius: 12,
          marginBottom: 4,
        }}
      >
        <Image
          source={{ uri: song.cover }}
          style={{ width: 52, height: 52, borderRadius: 10 }}
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
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
            {song.artist}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/lyrics/${song.id}`);
            }}
          >
            <Ionicons name="text" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function PlaylistDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const playlistId = params.id as string;
  const { showToast } = useApp();

  const playlist = getPlaylistById(playlistId) || PLAYLISTS[0];
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const handlePlaySong = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentSongIndex(index);
    const song = getSongById(playlist.songs[index]);
    if (song) {
      showToast(`Now playing: ${song.title}`, "info");
    }
  };

  const handlePlayAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setCurrentSongIndex(0);
    showToast(`Playing ${playlist.name}`, "info");
  };

  const handleShuffle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsShuffled(!isShuffled);
    const randomIndex = Math.floor(Math.random() * playlist.songs.length);
    setCurrentSongIndex(randomIndex);
    showToast(isShuffled ? "Shuffle off" : "Shuffle on", "info");
  };

  // Calculate total duration
  const totalDuration = playlist.songs.reduce((acc, songId) => {
    const song = getSongById(songId);
    return acc + (song?.duration || 0);
  }, 0);

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  if (!playlist) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: theme.text, fontSize: 18 }}>Playlist not found</Text>
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
        {/* Hero Section with Gradient */}
        <LinearGradient
          colors={playlist.colors}
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
              <Ionicons name="ellipsis-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Playlist Cover */}
          <View style={{ alignItems: "center", paddingHorizontal: 20 }}>
            <View
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.5,
                shadowRadius: 30,
                elevation: 20,
              }}
            >
              <Image
                source={{ uri: playlist.cover }}
                style={{
                  width: width * 0.55,
                  height: width * 0.55,
                  borderRadius: 16,
                }}
                contentFit="cover"
              />
            </View>
            {playlist.aiGenerated && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  marginTop: 16,
                }}
              >
                <Ionicons name="sparkles" size={14} color="white" />
                <Text style={{ color: "white", fontSize: 12, fontWeight: "700", marginLeft: 6 }}>
                  AI GENERATED
                </Text>
              </View>
            )}
            <Text style={{ color: "white", fontSize: 26, fontWeight: "900", marginTop: 16, textAlign: "center" }}>
              {playlist.name}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6, textAlign: "center", paddingHorizontal: 40 }}>
              {playlist.description}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                {playlist.creator} • {playlist.songs.length} songs • {formatTotalDuration(totalDuration)}
              </Text>
            </View>
            {playlist.followers !== "0" && (
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 }}>
                {playlist.followers} followers
              </Text>
            )}
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
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setIsLiked(!isLiked);
                  showToast(isLiked ? "Removed from library" : "Added to library", "success");
                }}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={28}
                  color={isLiked ? Colors.secondary : theme.textSecondary}
                />
              </TouchableOpacity>
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
                  colors={playlist.colors.slice(0, 2) as [string, string]}
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

          {/* Mood Tag */}
          {playlist.mood && (
            <Animated.View
              entering={FadeIn.delay(150)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: `${playlist.colors[0]}30`,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <Ionicons name="heart-circle" size={18} color={playlist.colors[0]} />
                <Text style={{ color: theme.text, fontSize: 13, fontWeight: "600", marginLeft: 6 }}>
                  {playlist.mood} Mood
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Songs List */}
          <Animated.View entering={FadeIn.delay(200)}>
            <View
              style={{
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : theme.card,
                borderRadius: 20,
                paddingVertical: 8,
              }}
            >
              {playlist.songs.map((songId, index) => (
                <PlaylistSongRow
                  key={`${songId}-${index}`}
                  songId={songId}
                  index={index}
                  isPlaying={currentSongIndex === index}
                  onPlay={() => handlePlaySong(index)}
                  onRemove={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    showToast("Song options", "info");
                  }}
                />
              ))}
            </View>
          </Animated.View>

          {/* Recommended Section */}
          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            style={{ marginTop: 32 }}
          >
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
              Recommended
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 16 }}>
              Based on what's in this playlist
            </Text>
            {SONGS.filter((s) => !playlist.songs.includes(s.id)).slice(0, 3).map((song, index) => (
              <Animated.View key={song.id} entering={FadeInRight.delay(index * 60).springify()}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    showToast(`Added ${song.title} to playlist`, "success");
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : theme.card,
                    borderRadius: 12,
                    marginBottom: 10,
                  }}
                >
                  <Image
                    source={{ uri: song.cover }}
                    style={{ width: 52, height: 52, borderRadius: 10 }}
                    contentFit="cover"
                  />
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15 }} numberOfLines={1}>
                      {song.title}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                      {song.artist}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: theme.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="add" size={20} color={theme.primary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
