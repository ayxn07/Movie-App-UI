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
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Music Genre Data
const MUSIC_GENRES = [
  { name: "Pop", icon: "musical-notes", color: "#ec4899", gradient: ["#ec4899", "#f472b6"] },
  { name: "Rock", icon: "flame", color: "#f97316", gradient: ["#f97316", "#fb923c"] },
  { name: "Hip-Hop", icon: "mic", color: "#8b5cf6", gradient: ["#8b5cf6", "#a78bfa"] },
  { name: "Jazz", icon: "musical-note", color: "#f59e0b", gradient: ["#f59e0b", "#fbbf24"] },
  { name: "Classical", icon: "book", color: "#10b981", gradient: ["#10b981", "#34d399"] },
  { name: "Electronic", icon: "pulse", color: "#3b82f6", gradient: ["#3b82f6", "#60a5fa"] },
];

// Song Data
const TRENDING_SONGS = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Star",
    album: "Starlight",
    duration: "3:45",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200",
    plays: "12.5M",
  },
  {
    id: "2",
    title: "Electric Soul",
    artist: "The Neons",
    album: "Voltage",
    duration: "4:12",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200",
    plays: "8.2M",
  },
  {
    id: "3",
    title: "Summer Vibes",
    artist: "Ocean Breeze",
    album: "Tropical",
    duration: "3:28",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200",
    plays: "15.1M",
  },
  {
    id: "4",
    title: "City Lights",
    artist: "Urban Echo",
    album: "Metropolitan",
    duration: "3:56",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200",
    plays: "6.8M",
  },
  {
    id: "5",
    title: "Cosmic Journey",
    artist: "Stellar Band",
    album: "Galaxy",
    duration: "5:01",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200",
    plays: "4.3M",
  },
];

const UPCOMING_SONGS = [
  {
    id: "u1",
    title: "New Horizons",
    artist: "Dawn Collective",
    releaseDate: "Dec 15, 2024",
    cover: "https://images.unsplash.com/photo-1445375011782-2384686778a0?w=200",
  },
  {
    id: "u2",
    title: "Winter Tales",
    artist: "Frost Symphony",
    releaseDate: "Dec 20, 2024",
    cover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=200",
  },
  {
    id: "u3",
    title: "Neon Dreams",
    artist: "Cyber Wave",
    releaseDate: "Jan 5, 2025",
    cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=200",
  },
];

const PLAYLIST_QUEUE = [
  {
    id: "q1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200",
    isPlaying: true,
  },
  {
    id: "q2",
    title: "Save Your Tears",
    artist: "The Weeknd",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200",
    isPlaying: false,
  },
  {
    id: "q3",
    title: "Take My Breath",
    artist: "The Weeknd",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200",
    isPlaying: false,
  },
  {
    id: "q4",
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200",
    isPlaying: false,
  },
];

// Genre Button Component
const GenreButton = ({ genre, index }: { genre: (typeof MUSIC_GENRES)[0]; index: number }) => {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(index * 80).springify()}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPressIn={() => {
            scale.value = withSpring(0.95);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          style={{ marginRight: 12, alignItems: "center" }}
        >
          <LinearGradient
            colors={genre.gradient as [string, string]}
            style={{
              width: 70,
              height: 70,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <Ionicons name={genre.icon as keyof typeof Ionicons.glyphMap} size={28} color="white" />
          </LinearGradient>
          <Text style={{ color: theme.text, fontSize: 12, fontWeight: "600" }}>{genre.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// Song Card Component
const SongCard = ({
  song,
  index,
  onPress,
}: {
  song: (typeof TRENDING_SONGS)[0];
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPressIn={() => {
            scale.value = withSpring(0.98);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          style={{
            width: 160,
            marginRight: 16,
          }}
        >
          <View
            style={{
              width: 160,
              height: 160,
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <Image
              source={{ uri: song.cover }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
            <View
              style={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(0,0,0,0.6)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontSize: 11, fontWeight: "600" }}>{song.duration}</Text>
            </View>
          </View>
          <Text
            style={{ color: theme.text, fontSize: 15, fontWeight: "700" }}
            numberOfLines={1}
          >
            {song.title}
          </Text>
          <Text
            style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}
            numberOfLines={1}
          >
            {song.artist}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Ionicons name="play" size={12} color={theme.textMuted} />
            <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 4 }}>{song.plays}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// Upcoming Song Card Component
const UpcomingSongCard = ({
  song,
  index,
}: {
  song: (typeof UPCOMING_SONGS)[0];
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={{
          width: 200,
          marginRight: 16,
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}
      >
        <Image
          source={{ uri: song.cover }}
          style={{ width: "100%", height: 120 }}
          contentFit="cover"
        />
        <View style={{ padding: 12 }}>
          <View
            style={{
              backgroundColor: `${Colors.primary}20`,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              alignSelf: "flex-start",
              marginBottom: 8,
            }}
          >
            <Text style={{ color: theme.primary, fontSize: 10, fontWeight: "700" }}>UPCOMING</Text>
          </View>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "700" }} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }} numberOfLines={1}>
            {song.artist}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
            <Ionicons name="calendar-outline" size={12} color={theme.textMuted} />
            <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 4 }}>
              {song.releaseDate}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Queue Song Item Component
const QueueSongItem = ({
  song,
  index,
}: {
  song: (typeof PLAYLIST_QUEUE)[0];
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 60).springify()}>
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 16,
          backgroundColor: song.isPlaying
            ? isDark ? `${theme.primary}20` : `${theme.primary}10`
            : "transparent",
          borderRadius: song.isPlaying ? 12 : 0,
          marginHorizontal: song.isPlaying ? 4 : 0,
        }}
      >
        <Text
          style={{
            color: song.isPlaying ? theme.primary : theme.textMuted,
            fontSize: 14,
            fontWeight: "600",
            width: 24,
          }}
        >
          {song.isPlaying ? "▶" : index + 1}
        </Text>
        <Image
          source={{ uri: song.cover }}
          style={{ width: 44, height: 44, borderRadius: 8, marginLeft: 8 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              color: song.isPlaying ? theme.primary : theme.text,
              fontSize: 15,
              fontWeight: song.isPlaying ? "700" : "600",
            }}
            numberOfLines={1}
          >
            {song.title}
          </Text>
          <Text
            style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}
            numberOfLines={1}
          >
            {song.artist}
          </Text>
        </View>
        <TouchableOpacity style={{ padding: 8 }}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Mini Player Component
const MiniPlayer = ({ onPress }: { onPress: () => void }) => {
  const { theme, isDark } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const progress = useSharedValue(0.3);

  // Animated progress bar
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <Animated.View entering={FadeInUp.delay(300).springify()}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={{
          marginHorizontal: 20,
          marginBottom: 90,
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={isDark ? ["#1e293b", "#0f172a"] : ["#ffffff", "#f1f5f9"]}
          style={{ padding: 12 }}
        >
          {/* Progress Bar */}
          <View
            style={{
              height: 3,
              backgroundColor: isDark ? "#334155" : "#e2e8f0",
              borderRadius: 2,
              marginBottom: 12,
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={[
                progressStyle,
                {
                  height: "100%",
                  backgroundColor: theme.primary,
                  borderRadius: 2,
                },
              ]}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Album Art */}
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                overflow: "hidden",
                marginRight: 12,
              }}
            >
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200" }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>

            {/* Song Info */}
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: "700" }}>
                Blinding Lights
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                The Weeknd
              </Text>
            </View>

            {/* Controls */}
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ padding: 8 }}
            >
              <Ionicons name="play-skip-back" size={22} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsPlaying(!isPlaying);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: theme.primary,
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 8,
              }}
            >
              <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ padding: 8 }}
            >
              <Ionicons name="play-skip-forward" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function SongsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.springify()}
          style={{
            paddingHorizontal: 20,
            paddingTop: 56,
            paddingBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Discover</Text>
                <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Music</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="search" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Genres */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 28 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {MUSIC_GENRES.map((genre, index) => (
              <GenreButton key={genre.name} genre={genre} index={index} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Trending Songs */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginBottom: 28 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="flame" size={22} color={Colors.primary} />
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginLeft: 8 }}>
                Trending Now
              </Text>
            </View>
            <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {TRENDING_SONGS.map((song, index) => (
              <SongCard
                key={song.id}
                song={song}
                index={index}
                onPress={() => setShowPlayer(true)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Upcoming Releases */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ marginBottom: 28 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="calendar" size={22} color={Colors.secondary} />
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginLeft: 8 }}>
                Coming Soon
              </Text>
            </View>
            <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {UPCOMING_SONGS.map((song, index) => (
              <UpcomingSongCard key={song.id} song={song} index={index} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Playlist Queue (Apple Music Style) */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={{ marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="list" size={22} color={Colors.success} />
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginLeft: 8 }}>
                Up Next
              </Text>
            </View>
            <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>Shuffle</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
              paddingVertical: 8,
            }}
          >
            {PLAYLIST_QUEUE.map((song, index) => (
              <QueueSongItem key={song.id} song={song} index={index} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Mini Player */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <MiniPlayer onPress={() => setShowPlayer(true)} />
      </View>
    </View>
  );
}
