import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Sample songs data (same as in index.tsx)
const ALL_SONGS = [
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
];

// Control Button Component
const ControlButton = ({
  icon,
  size = 24,
  color,
  onPress,
  style,
}: {
  icon: string;
  size?: number;
  color: string;
  onPress: () => void;
  style?: object;
}) => (
  <TouchableOpacity
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }}
    style={[{ padding: 12 }, style]}
  >
    <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={size} color={color} />
  </TouchableOpacity>
);

export default function MusicPlayerScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const songId = params.id as string;

  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");

  const song = ALL_SONGS.find((s) => s.id === songId) || ALL_SONGS[0];

  // Artwork rotation animation
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  // Progress animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 0.5;
        });
        setCurrentTime((prev) => {
          const [mins, secs] = prev.split(":").map(Number);
          let newSecs = secs + 1;
          let newMins = mins;
          if (newSecs >= 60) {
            newSecs = 0;
            newMins += 1;
          }
          return `${newMins}:${newSecs.toString().padStart(2, "0")}`;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Artwork pulsing animation
  useEffect(() => {
    if (isPlaying) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
    }
  }, [isPlaying]);

  const artworkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const toggleRepeat = () => {
    if (repeatMode === "off") setRepeatMode("all");
    else if (repeatMode === "all") setRepeatMode("one");
    else setRepeatMode("off");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar style="light" />

      {/* Blurred Background */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <Image
          source={{ uri: song.artwork }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          blurRadius={50}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        />
      </View>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
            backgroundColor: "rgba(255,255,255,0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-down" size={24} color="white" />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "500" }}>
            PLAYING FROM
          </Text>
          <Text style={{ color: "white", fontSize: 14, fontWeight: "700", marginTop: 2 }}>
            {song.album}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "rgba(255,255,255,0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Artwork */}
      <Animated.View
        entering={FadeIn.delay(200)}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 40,
        }}
      >
        <Animated.View
          style={[
            artworkStyle,
            {
              width: width - 80,
              height: width - 80,
              borderRadius: 24,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 10,
            },
          ]}
        >
          <Image
            source={{ uri: song.artwork }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </Animated.View>
      </Animated.View>

      {/* Song Info & Controls */}
      <Animated.View
        entering={FadeInUp.delay(300)}
        style={{
          paddingHorizontal: 30,
          paddingBottom: 50,
        }}
      >
        {/* Song Info */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "800" }}>
              {song.title}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginTop: 4 }}>
              {song.artist}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setIsLiked(!isLiked);
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={28}
              color={isLiked ? Colors.danger : "white"}
            />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              height: 4,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "white",
                borderRadius: 2,
              }}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{currentTime}</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{song.duration}</Text>
          </View>
        </View>

        {/* Playback Controls */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <ControlButton
            icon={isShuffle ? "shuffle" : "shuffle-outline"}
            color={isShuffle ? Colors.primary : "rgba(255,255,255,0.7)"}
            onPress={() => setIsShuffle(!isShuffle)}
          />
          <ControlButton
            icon="play-skip-back"
            size={32}
            color="white"
            onPress={() => {}}
          />
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setIsPlaying(!isPlaying);
            }}
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={32}
              color="#020617"
              style={{ marginLeft: isPlaying ? 0 : 4 }}
            />
          </TouchableOpacity>
          <ControlButton
            icon="play-skip-forward"
            size={32}
            color="white"
            onPress={() => {}}
          />
          <ControlButton
            icon={repeatMode === "one" ? "repeat" : repeatMode === "all" ? "repeat" : "repeat-outline"}
            color={repeatMode !== "off" ? Colors.primary : "rgba(255,255,255,0.7)"}
            onPress={toggleRepeat}
          />
        </View>

        {/* Bottom Actions */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Ionicons name="share-outline" size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Ionicons name="radio-outline" size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Ionicons name="list-outline" size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Ionicons name="airplay-outline" size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
