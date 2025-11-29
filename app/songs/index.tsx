import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
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
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Song type
interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  artwork: string;
  isLiked?: boolean;
}

// Genre type
interface Genre {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// Sample songs data
const TRENDING_SONGS: Song[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300",
  },
  {
    id: "2",
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: "2:47",
    artwork: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300",
  },
  {
    id: "3",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    album: "Midnights",
    duration: "3:21",
    artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300",
  },
  {
    id: "4",
    title: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    duration: "3:21",
    artwork: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300",
  },
  {
    id: "5",
    title: "Cruel Summer",
    artist: "Taylor Swift",
    album: "Lover",
    duration: "2:58",
    artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300",
  },
];

const MOVIE_SOUNDTRACKS: Song[] = [
  {
    id: "6",
    title: "A Sky Full of Stars",
    artist: "Coldplay",
    album: "The Fault in Our Stars OST",
    duration: "4:28",
    artwork: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300",
  },
  {
    id: "7",
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth",
    album: "Furious 7 OST",
    duration: "3:49",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300",
  },
  {
    id: "8",
    title: "I'm Still Standing",
    artist: "Elton John",
    album: "Rocketman OST",
    duration: "3:02",
    artwork: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300",
  },
];

const UPCOMING_SONGS: Song[] = [
  {
    id: "9",
    title: "Midnight Rain",
    artist: "Taylor Swift",
    album: "Midnights (Deluxe)",
    duration: "2:54",
    artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300",
  },
  {
    id: "10",
    title: "Vampire",
    artist: "Olivia Rodrigo",
    album: "GUTS",
    duration: "3:40",
    artwork: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300",
  },
  {
    id: "11",
    title: "Paint The Town Red",
    artist: "Doja Cat",
    album: "Scarlet",
    duration: "3:51",
    artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300",
  },
];

const GENRES: Genre[] = [
  { id: "1", name: "Pop", color: "#ec4899", icon: "musical-notes" },
  { id: "2", name: "Rock", color: "#ef4444", icon: "flash" },
  { id: "3", name: "Hip Hop", color: "#f59e0b", icon: "headset" },
  { id: "4", name: "Electronic", color: "#8b5cf6", icon: "pulse" },
  { id: "5", name: "Jazz", color: "#06b6d4", icon: "musical-note" },
  { id: "6", name: "Classical", color: "#10b981", icon: "leaf" },
];

// Song Card Component
const SongCard = ({
  song,
  index,
  onPlay,
  isPlaying,
}: {
  song: Song;
  index: number;
  onPlay: () => void;
  isPlaying: boolean;
}) => {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).springify()}
      style={[animatedStyle, { marginRight: 16 }]}
    >
      <TouchableOpacity
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPlay();
        }}
        style={{ width: 160 }}
      >
        <View style={{
          width: 160,
          height: 160,
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 12,
        }}>
          <Image
            source={{ uri: song.artwork }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          {isPlaying && (
            <View style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: Colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Ionicons name="pause" size={24} color="white" />
              </View>
            </View>
          )}
        </View>
        <Text
          style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}
          numberOfLines={1}
        >
          {song.title}
        </Text>
        <Text
          style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}
          numberOfLines={1}
        >
          {song.artist}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Song List Item Component
const SongListItem = ({
  song,
  index,
  onPlay,
  isPlaying,
}: {
  song: Song;
  index: number;
  onPlay: () => void;
  isPlaying: boolean;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 60).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPlay();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isPlaying
            ? isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)"
            : "transparent",
          borderRadius: 12,
          marginBottom: 8,
        }}
      >
        <View style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          overflow: "hidden",
          marginRight: 12,
        }}>
          <Image
            source={{ uri: song.artwork }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          {isPlaying && (
            <View style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(139, 92, 246, 0.7)",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Ionicons name="musical-notes" size={20} color="white" />
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: isPlaying ? theme.primary : theme.text,
              fontSize: 15,
              fontWeight: "600",
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
        <Text style={{ color: theme.textMuted, fontSize: 12, marginRight: 12 }}>
          {song.duration}
        </Text>
        <TouchableOpacity style={{ padding: 4 }}>
          <Ionicons
            name={song.isLiked ? "heart" : "heart-outline"}
            size={20}
            color={song.isLiked ? Colors.danger : theme.textMuted}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Genre Chip Component
const GenreChip = ({
  genre,
  index,
}: {
  genre: Genre;
  index: number;
}) => {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
          backgroundColor: `${genre.color}20`,
          marginRight: 12,
        }}
      >
        <Ionicons name={genre.icon as keyof typeof Ionicons.glyphMap} size={16} color={genre.color} />
        <Text style={{ color: genre.color, fontSize: 14, fontWeight: "600", marginLeft: 6 }}>
          {genre.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Mini Player Component
const MiniPlayer = ({
  song,
  isPlaying,
  onPlayPause,
  onExpand,
}: {
  song: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onExpand: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const progress = useSharedValue(0);

  // Simulate progress
  React.useEffect(() => {
    if (isPlaying) {
      progress.value = withTiming(100, { duration: 180000 }); // 3 minutes
    }
  }, [isPlaying]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  if (!song) return null;

  return (
    <Animated.View
      entering={FadeInUp.springify()}
      style={{
        position: "absolute",
        bottom: 100,
        left: 16,
        right: 16,
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.95)",
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {/* Progress Bar */}
      <View style={{ height: 3, backgroundColor: theme.border }}>
        <Animated.View
          style={[progressStyle, { height: "100%", backgroundColor: theme.primary }]}
        />
      </View>

      <TouchableOpacity
        onPress={onExpand}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
        }}
      >
        <Image
          source={{ uri: song.artwork }}
          style={{ width: 48, height: 48, borderRadius: 10 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600" }} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
        <TouchableOpacity style={{ padding: 8 }}>
          <Ionicons name="heart-outline" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPlayPause();
          }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.primary,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
          }}
        >
          <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function SongsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

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
            paddingTop: 56,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }}
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
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Music</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                Movie soundtracks & more
              </Text>
            </View>
            <TouchableOpacity
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
        <Animated.View entering={FadeIn.delay(100)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 8, marginBottom: 24 }}
          >
            {GENRES.map((genre, index) => (
              <GenreChip key={genre.id} genre={genre} index={index} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Trending Songs */}
        <Animated.View entering={FadeIn.delay(200)}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="trending-up" size={22} color={theme.primary} />
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginLeft: 8 }}>
                Trending Now
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
          >
            {TRENDING_SONGS.map((song, index) => (
              <SongCard
                key={song.id}
                song={song}
                index={index}
                onPlay={() => handlePlaySong(song)}
                isPlaying={currentSong?.id === song.id && isPlaying}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Movie Soundtracks */}
        <Animated.View entering={FadeIn.delay(300)} style={{ marginTop: 32 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="film" size={22} color={theme.secondary} />
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginLeft: 8 }}>
                Movie Soundtracks
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
          >
            {MOVIE_SOUNDTRACKS.map((song, index) => (
              <SongCard
                key={song.id}
                song={song}
                index={index}
                onPlay={() => handlePlaySong(song)}
                isPlaying={currentSong?.id === song.id && isPlaying}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Up Next in Playlist */}
        <Animated.View entering={FadeIn.delay(400)} style={{ marginTop: 32, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <Ionicons name="list" size={22} color={theme.accent} />
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginLeft: 8 }}>
              Up Next
            </Text>
          </View>
          <View
            style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            {UPCOMING_SONGS.map((song, index) => (
              <SongListItem
                key={song.id}
                song={song}
                index={index}
                onPlay={() => handlePlaySong(song)}
                isPlaying={currentSong?.id === song.id && isPlaying}
              />
            ))}
          </View>
        </Animated.View>

        {/* Recently Played */}
        <Animated.View entering={FadeIn.delay(500)} style={{ marginTop: 32, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <Ionicons name="time" size={22} color={Colors.success} />
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginLeft: 8 }}>
              Recently Played
            </Text>
          </View>
          <View
            style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            {TRENDING_SONGS.slice(0, 3).map((song, index) => (
              <SongListItem
                key={song.id}
                song={song}
                index={index}
                onPlay={() => handlePlaySong(song)}
                isPlaying={currentSong?.id === song.id && isPlaying}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Mini Player */}
      <MiniPlayer
        song={currentSong}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onExpand={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (currentSong) {
            router.push(`/songs/player/${currentSong.id}`);
          }
        }}
      />
    </View>
  );
}
