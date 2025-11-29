import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
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
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Sample song data
const GENRES = [
  { id: "pop", name: "Pop", color: "#ec4899", icon: "musical-notes" },
  { id: "rock", name: "Rock", color: "#ef4444", icon: "flash" },
  { id: "hiphop", name: "Hip Hop", color: "#8b5cf6", icon: "headset" },
  { id: "jazz", name: "Jazz", color: "#f59e0b", icon: "cafe" },
  { id: "classical", name: "Classical", color: "#06b6d4", icon: "sparkles" },
  { id: "electronic", name: "Electronic", color: "#10b981", icon: "pulse" },
];

const TRENDING_SONGS = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    plays: "2.4B",
  },
  {
    id: "2",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    plays: "1.8B",
  },
  {
    id: "3",
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:35",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
    plays: "1.6B",
  },
  {
    id: "4",
    title: "Stay",
    artist: "Kid Laroi & Justin Bieber",
    album: "F*ck Love",
    duration: "2:21",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
    plays: "1.5B",
  },
  {
    id: "5",
    title: "Peaches",
    artist: "Justin Bieber",
    album: "Justice",
    duration: "3:18",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
    plays: "1.4B",
  },
];

const UPCOMING_SONGS = [
  {
    id: "u1",
    title: "Midnight Dreams",
    artist: "Aurora",
    duration: "4:12",
    cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400",
  },
  {
    id: "u2",
    title: "Electric Hearts",
    artist: "Neon Pulse",
    duration: "3:45",
    cover: "https://images.unsplash.com/photo-1598387180437-68e7ef823f29?w=400",
  },
  {
    id: "u3",
    title: "Summer Nights",
    artist: "Beach Waves",
    duration: "3:28",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400",
  },
  {
    id: "u4",
    title: "City Lights",
    artist: "Urban Beat",
    duration: "3:55",
    cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400",
  },
];

const RECENTLY_PLAYED = [
  {
    id: "r1",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    cover: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=400",
  },
  {
    id: "r2",
    title: "As It Was",
    artist: "Harry Styles",
    cover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400",
  },
  {
    id: "r3",
    title: "Bad Habit",
    artist: "Steve Lacy",
    cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400",
  },
  {
    id: "r4",
    title: "About Damn Time",
    artist: "Lizzo",
    cover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400",
  },
];

// Now Playing Card Component (Apple Music style)
const NowPlayingMini = ({
  song,
  isPlaying,
  onPlayPause,
  onNext,
  onOpenPlayer,
}: {
  song: (typeof TRENDING_SONGS)[0];
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onOpenPlayer: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      progress.value = withRepeat(
        withTiming(1, { duration: 180000 }),
        -1,
        false
      );
    } else {
      progress.value = withTiming(progress.value, { duration: 0 });
    }
  }, [isPlaying, progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <Animated.View
      entering={FadeInUp.springify()}
      style={{
        position: "absolute",
        bottom: 100,
        left: 20,
        right: 20,
      }}
    >
      <TouchableOpacity
        onPress={onOpenPlayer}
        activeOpacity={0.95}
      >
        <View style={{
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.98)" : "rgba(255, 255, 255, 0.98)",
          borderRadius: 20,
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        }}>
          <Image
            source={{ uri: song.cover }}
            style={{ width: 48, height: 48, borderRadius: 12 }}
            contentFit="cover"
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14 }} numberOfLines={1}>
              {song.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }} numberOfLines={1}>
              {song.artist}
            </Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onPlayPause();
            }}
            style={{ marginRight: 8 }}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={28}
              color={theme.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={(e) => {
            e.stopPropagation();
            onNext();
          }}>
            <Ionicons name="play-forward" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {/* Progress Bar */}
      <View style={{
        height: 3,
        backgroundColor: isDark ? "#334155" : "#e2e8f0",
        marginTop: -3,
        marginHorizontal: 12,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: "hidden",
      }}>
        <Animated.View style={[{
          height: "100%",
          backgroundColor: theme.primary,
        }, progressStyle]} />
      </View>
    </Animated.View>
  );
};

// Song Item Component
const SongItem = ({
  song,
  index,
  onPlay,
  isPlaying,
  onOpenPlayer,
}: {
  song: (typeof TRENDING_SONGS)[0];
  index: number;
  onPlay: () => void;
  isPlaying: boolean;
  onOpenPlayer: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPlay();
        }}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onOpenPlayer();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isPlaying ? `${theme.primary}10` : "transparent",
          borderRadius: 16,
        }}
      >
        <Text style={{
          color: isPlaying ? theme.primary : theme.textMuted,
          fontWeight: "700",
          fontSize: 14,
          width: 24,
        }}>
          {index + 1}
        </Text>
        <Image
          source={{ uri: song.cover }}
          style={{ width: 52, height: 52, borderRadius: 10, marginLeft: 8 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={{
            color: isPlaying ? theme.primary : theme.text,
            fontWeight: "600",
            fontSize: 15,
          }} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }} numberOfLines={1}>
            {song.artist} • {song.album}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: theme.textMuted, fontSize: 12 }}>{song.duration}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Ionicons name="play" size={10} color={theme.textMuted} />
            <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 4 }}>{song.plays}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Upcoming Song Card (Apple Music style)
const UpcomingSongCard = ({
  song,
  index,
}: {
  song: (typeof UPCOMING_SONGS)[0];
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.5)" : theme.card,
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        borderWidth: isDark ? 0 : 1,
        borderColor: theme.border,
      }}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: song.cover }}
          style={{ width: 56, height: 56, borderRadius: 12 }}
          contentFit="cover"
        />
        <View style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Ionicons name="time" size={20} color="white" />
        </View>
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15 }} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
          {song.artist}
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: theme.textMuted, fontSize: 12 }}>{song.duration}</Text>
        <View style={{
          backgroundColor: `${theme.primary}20`,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 6,
          marginTop: 4,
        }}>
          <Text style={{ color: theme.primary, fontSize: 10, fontWeight: "600" }}>UP NEXT</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function SongsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const currentSong = TRENDING_SONGS[currentSongIndex];

  const handlePlaySong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast(`Now playing: ${TRENDING_SONGS[index].title}`, "info");
  };

  const handleOpenMusicPlayer = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/musicplayer/${TRENDING_SONGS[index].id}`);
  };

  const handlePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentSongIndex((prev) => (prev + 1) % TRENDING_SONGS.length);
    setIsPlaying(true);
  };

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
        contentContainerStyle={{ paddingBottom: 180 }}
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
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center", justifyContent: "center", marginRight: 16,
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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/youtubesearch");
              }}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="logo-youtube" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* YouTube Search Banner */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/youtubesearch");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
              borderRadius: 16,
              padding: 14,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "rgba(239, 68, 68, 0.2)",
            }}
          >
            <View
              style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="logo-youtube" size={24} color="#ef4444" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 15 }}>
                Search YouTube
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                Find and download songs & soundtracks
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#ef4444" />
          </TouchableOpacity>
        </Animated.View>

        {/* Genre Pills */}
        <Animated.View entering={FadeIn.delay(100)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 10 }}
          >
            {GENRES.map((genre, index) => (
              <TouchableOpacity
                key={genre.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveGenre(activeGenre === genre.id ? null : genre.id);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: activeGenre === genre.id ? genre.color : isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  gap: 6,
                }}
              >
                <Ionicons
                  name={genre.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={activeGenre === genre.id ? "white" : genre.color}
                />
                <Text style={{
                  color: activeGenre === genre.id ? "white" : theme.text,
                  fontWeight: "600",
                  fontSize: 14,
                }}>
                  {genre.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Recently Played */}
        <Animated.View entering={FadeIn.delay(200)} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
            Recently Played
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {RECENTLY_PLAYED.map((song, index) => (
              <TouchableOpacity
                key={song.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  showToast(`Playing ${song.title}`, "info");
                }}
              >
                <View style={{
                  width: 140,
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                  borderRadius: 16,
                  overflow: "hidden",
                }}>
                  <Image
                    source={{ uri: song.cover }}
                    style={{ width: 140, height: 140 }}
                    contentFit="cover"
                  />
                  <View style={{ padding: 12 }}>
                    <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14 }} numberOfLines={1}>
                      {song.title}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                      {song.artist}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Trending Songs */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <View style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="trending-up" size={22} color={theme.primary} />
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>
                Trending Now
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : theme.card,
            marginHorizontal: 20,
            borderRadius: 20,
            paddingVertical: 8,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            {TRENDING_SONGS.map((song, index) => (
              <SongItem
                key={song.id}
                song={song}
                index={index}
                onPlay={() => handlePlaySong(index)}
                isPlaying={currentSongIndex === index && isPlaying}
                onOpenPlayer={() => handleOpenMusicPlayer(index)}
              />
            ))}
          </View>
        </Animated.View>

        {/* Up Next / Playlist Queue (Apple Music style) */}
        <Animated.View entering={FadeInUp.delay(400)} style={{ marginTop: 24 }}>
          <View style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}>
            <View style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: `${theme.secondary}20`,
              alignItems: "center", justifyContent: "center", marginRight: 12,
            }}>
              <Ionicons name="list" size={22} color={theme.secondary} />
            </View>
            <View>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>
                Up Next
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                In your queue
              </Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {UPCOMING_SONGS.map((song, index) => (
              <UpcomingSongCard key={song.id} song={song} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* Shuffle & Repeat Section */}
        <Animated.View
          entering={FadeIn.delay(500)}
          style={{ paddingHorizontal: 20, marginTop: 24 }}
        >
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-around",
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            <TouchableOpacity style={{ alignItems: "center" }}>
              <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: `${theme.primary}20`,
                alignItems: "center", justifyContent: "center", marginBottom: 8,
              }}>
                <Ionicons name="shuffle" size={28} color={theme.primary} />
              </View>
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 13 }}>Shuffle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }}>
              <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: `${theme.secondary}20`,
                alignItems: "center", justifyContent: "center", marginBottom: 8,
              }}>
                <Ionicons name="repeat" size={28} color={theme.secondary} />
              </View>
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 13 }}>Repeat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }}>
              <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: `${Colors.success}20`,
                alignItems: "center", justifyContent: "center", marginBottom: 8,
              }}>
                <Ionicons name="radio" size={28} color={Colors.success} />
              </View>
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 13 }}>Radio</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Mini Player */}
      {currentSong && (
        <NowPlayingMini
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onOpenPlayer={() => handleOpenMusicPlayer(currentSongIndex)}
        />
      )}
    </View>
  );
}
