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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { ALBUMS, SONGS, getAlbumById, getSongById } from "@/constants/musicData";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Song Row Component
const SongRow = ({
  songId,
  index,
  isPlaying,
  onPlay,
}: {
  songId: string;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const song = getSongById(songId);
  const router = useRouter();

  if (!song) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 60).springify()}>
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
        <Text
          style={{
            width: 28,
            color: isPlaying ? theme.primary : theme.textMuted,
            fontWeight: "700",
            fontSize: 14,
          }}
        >
          {index + 1}
        </Text>
        <View style={{ flex: 1, marginLeft: 8 }}>
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
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
            {song.isExplicit && (
              <View
                style={{
                  backgroundColor: theme.textMuted,
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 3,
                  marginRight: 6,
                }}
              >
                <Text style={{ color: theme.background, fontSize: 8, fontWeight: "700" }}>E</Text>
              </View>
            )}
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {song.artist}
            </Text>
          </View>
        </View>
        <Text style={{ color: theme.textMuted, fontSize: 12, marginRight: 12 }}>
          {formatDuration(song.duration)}
        </Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function AlbumDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const albumId = params.id as string;
  const { showToast } = useApp();

  const album = getAlbumById(albumId) || ALBUMS[0];
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isLiked, setIsLiked] = useState(false);

  const handlePlaySong = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentSongIndex(index);
    showToast(`Now playing: ${getSongById(album.songs[index])?.title}`, "info");
  };

  const handlePlayAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setCurrentSongIndex(0);
    showToast(`Playing ${album.title}`, "info");
  };

  const handleShuffle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const randomIndex = Math.floor(Math.random() * album.songs.length);
    setCurrentSongIndex(randomIndex);
    showToast("Shuffle enabled", "info");
  };

  if (!album) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: theme.text, fontSize: 18 }}>Album not found</Text>
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
        {/* Hero Section */}
        <View style={{ height: height * 0.45, position: "relative" }}>
          <Image
            source={{ uri: album.cover }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", theme.background]}
            locations={[0, 0.5, 1]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Header */}
          <View
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
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
                backgroundColor: "rgba(0,0,0,0.5)",
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
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Album Info */}
        <View style={{ paddingHorizontal: 20, marginTop: -60 }}>
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <View
                style={{
                  backgroundColor: theme.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "white", fontSize: 10, fontWeight: "700", textTransform: "uppercase" }}>
                  {album.type}
                </Text>
              </View>
              <Text style={{ color: theme.textSecondary, marginLeft: 12, fontSize: 14 }}>
                {album.year} • {album.genre}
              </Text>
            </View>
            <Text style={{ color: theme.text, fontSize: 32, fontWeight: "900", marginBottom: 8 }}>
              {album.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/artist/${album.artistId}`);
              }}
            >
              <Text style={{ color: theme.primary, fontSize: 16, fontWeight: "600" }}>
                {album.artist}
              </Text>
            </TouchableOpacity>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 8 }}>
              {album.songs.length} songs • {album.totalDuration}
            </Text>
          </Animated.View>

          {/* Actions */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 24,
              marginBottom: 20,
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
                <Ionicons name="shuffle" size={24} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePlayAll}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
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

          {/* Songs List */}
          <Animated.View entering={FadeIn.delay(300)}>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
              Tracks
            </Text>
            <View
              style={{
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : theme.card,
                borderRadius: 20,
                paddingVertical: 8,
              }}
            >
              {album.songs.map((songId, index) => (
                <SongRow
                  key={songId}
                  songId={songId}
                  index={index}
                  isPlaying={currentSongIndex === index}
                  onPlay={() => handlePlaySong(index)}
                />
              ))}
            </View>
          </Animated.View>

          {/* Album Info Card */}
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            style={{
              marginTop: 24,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 20,
              padding: 20,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
              About this album
            </Text>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Released</Text>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}>{album.year}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Genre</Text>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}>{album.genre}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Duration</Text>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}>{album.totalDuration}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Tracks</Text>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}>{album.songs.length}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
