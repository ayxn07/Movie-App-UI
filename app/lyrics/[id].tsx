import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { SONGS, getSongById } from "@/constants/musicData";
import { useApp } from "@/context";

const { width, height } = Dimensions.get("window");

// Animated Lyric Line Component
const LyricLine = ({
  text,
  isActive,
  isPast,
  isFuture,
  index,
  onPress,
}: {
  text: string;
  isActive: boolean;
  isPast: boolean;
  isFuture: boolean;
  index: number;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.05, { damping: 15 });
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withSpring(1);
      glow.value = withTiming(0, { duration: 300 });
    }
  }, [isActive, scale, glow]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isActive ? 1 : isPast ? 0.4 : isFuture ? 0.6 : 0.5,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value * 0.8,
    shadowRadius: interpolate(glow.value, [0, 1], [0, 20]),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={[animatedStyle]}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            {
              paddingVertical: 16,
              paddingHorizontal: 24,
              shadowColor: isActive ? Colors.primary : "transparent",
              shadowOffset: { width: 0, height: 0 },
            },
            glowStyle,
          ]}
        >
          <Text
            style={{
              fontSize: isActive ? 28 : 20,
              fontWeight: isActive ? "900" : "600",
              color: isActive ? "white" : isPast ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.6)",
              textAlign: "center",
              lineHeight: isActive ? 38 : 30,
              letterSpacing: isActive ? 0.5 : 0,
            }}
          >
            {text}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Music Visualizer Bars
const VisualizerBar = ({ isPlaying, delay, height: barHeight }: { isPlaying: boolean; delay: number; height: number }) => {
  const animatedHeight = useSharedValue(barHeight * 0.3);

  useEffect(() => {
    if (isPlaying) {
      animatedHeight.value = withRepeat(
        withSequence(
          withTiming(barHeight * (0.3 + Math.random() * 0.7), { duration: 150 + delay }),
          withTiming(barHeight * (0.2 + Math.random() * 0.4), { duration: 150 + delay })
        ),
        -1,
        true
      );
    } else {
      animatedHeight.value = withTiming(barHeight * 0.15, { duration: 300 });
    }
  }, [isPlaying, delay, animatedHeight, barHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 4,
          backgroundColor: Colors.primary,
          borderRadius: 2,
          marginHorizontal: 2,
        },
        animatedStyle,
      ]}
    />
  );
};

// Full Visualizer Component
const MusicVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  const barCount = 20;
  const barHeight = 60;
  const delays = Array.from({ length: barCount }, () => Math.random() * 100);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        height: barHeight,
        marginVertical: 20,
      }}
    >
      {delays.map((delay, index) => (
        <VisualizerBar key={index} isPlaying={isPlaying} delay={delay} height={barHeight} />
      ))}
    </View>
  );
};

// Floating Music Note Animation
const FloatingNote = ({ delay }: { delay: number }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      translateY.value = withRepeat(
        withTiming(-200, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      );
      translateX.value = withRepeat(
        withSequence(
          withTiming(30, { duration: 2000 }),
          withTiming(-30, { duration: 2000 })
        ),
        -1,
        true
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1000 }),
          withTiming(0.6, { duration: 2000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        false
      );
      rotation.value = withRepeat(
        withTiming(360, { duration: 8000, easing: Easing.linear }),
        -1,
        false
      );
    };

    const timeout = setTimeout(startAnimation, delay);
    return () => clearTimeout(timeout);
  }, [delay, translateY, translateX, opacity, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 100,
        },
        animatedStyle,
      ]}
    >
      <Ionicons name="musical-note" size={24} color={Colors.primary} />
    </Animated.View>
  );
};

// Control Button with Animation
const ControlButton = ({
  icon,
  size = 28,
  onPress,
  isActive,
  isPrimary,
}: {
  icon: string;
  size?: number;
  onPress: () => void;
  isActive?: boolean;
  isPrimary?: boolean;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(withSpring(0.85), withSpring(1));
    onPress();
  };

  if (isPrimary) {
    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPress={handlePress}
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={icon as any} size={size} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: "rgba(255,255,255,0.1)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon as any} size={size} color={isActive ? Colors.primary : "white"} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function LyricsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const songId = params.id as string;
  const { showToast } = useApp();

  const [currentSong, setCurrentSong] = useState(getSongById(songId) || SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);

  const lyricsScrollRef = useRef<ScrollView>(null);
  const progress = useSharedValue(0);

  // Simulate playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= currentSong.duration) {
            return 0;
          }
          progress.value = newTime / currentSong.duration;
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, progress]);

  // Auto-scroll lyrics
  useEffect(() => {
    if (lyricsScrollRef.current && currentSong) {
      const activeLyricIndex = getActiveLyricIndex();
      if (activeLyricIndex >= 0) {
        lyricsScrollRef.current.scrollTo({
          y: Math.max(0, activeLyricIndex * 70 - height / 3),
          animated: true,
        });
      }
    }
  }, [currentTime, currentSong]);

  const getActiveLyricIndex = () => {
    if (!currentSong) return -1;
    return currentSong.lyrics.findIndex(
      (lyric, index) =>
        lyric.time <= currentTime &&
        (index === currentSong.lyrics.length - 1 ||
          currentSong.lyrics[index + 1].time > currentTime)
    );
  };

  const handleSeekToLyric = (index: number) => {
    if (currentSong && currentSong.lyrics[index]) {
      setCurrentTime(currentSong.lyrics[index].time);
      progress.value = currentSong.lyrics[index].time / currentSong.duration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!currentSong) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0a0a", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "white", fontSize: 18 }}>Song not found</Text>
      </View>
    );
  }

  const activeLyricIndex = getActiveLyricIndex();

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <StatusBar style="light" />

      {/* Dynamic Background */}
      <LinearGradient
        colors={currentSong.colors}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Animated Background Overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      />

      {/* Floating Music Notes */}
      <View style={{ position: "absolute", left: width * 0.1, bottom: 0 }}>
        <FloatingNote delay={0} />
      </View>
      <View style={{ position: "absolute", left: width * 0.3, bottom: 0 }}>
        <FloatingNote delay={1500} />
      </View>
      <View style={{ position: "absolute", left: width * 0.5, bottom: 0 }}>
        <FloatingNote delay={3000} />
      </View>
      <View style={{ position: "absolute", left: width * 0.7, bottom: 0 }}>
        <FloatingNote delay={4500} />
      </View>
      <View style={{ position: "absolute", left: width * 0.9, bottom: 0 }}>
        <FloatingNote delay={6000} />
      </View>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 16,
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
          <Ionicons name="chevron-down" size={26} color="white" />
        </TouchableOpacity>

        <View style={{ alignItems: "center", flex: 1, paddingHorizontal: 16 }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "600" }}>
            LYRICS
          </Text>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "800", marginTop: 2 }} numberOfLines={1}>
            {currentSong.title}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowVisualizer(!showVisualizer);
          }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: showVisualizer ? Colors.primary : "rgba(255,255,255,0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="pulse" size={22} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Album Art Mini with Glow */}
      <Animated.View
        entering={FadeIn.delay(200)}
        style={{
          alignItems: "center",
          marginVertical: 16,
        }}
      >
        <View
          style={{
            shadowColor: currentSong.colors[0],
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.6,
            shadowRadius: 30,
            elevation: 15,
          }}
        >
          <Image
            source={{ uri: currentSong.cover }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 16,
            }}
            contentFit="cover"
          />
        </View>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "800", marginTop: 16 }}>
          {currentSong.title}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 }}>
          {currentSong.artist}
        </Text>
      </Animated.View>

      {/* Visualizer */}
      {showVisualizer && <MusicVisualizer isPlaying={isPlaying} />}

      {/* Lyrics Container */}
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={lyricsScrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: height / 4,
          }}
        >
          {currentSong.lyrics.map((lyric, index) => (
            <LyricLine
              key={index}
              text={lyric.text}
              isActive={index === activeLyricIndex}
              isPast={index < activeLyricIndex}
              isFuture={index > activeLyricIndex}
              index={index}
              onPress={() => handleSeekToLyric(index)}
            />
          ))}
        </ScrollView>

        {/* Gradient Fade at Top */}
        <LinearGradient
          colors={[currentSong.colors[0], "transparent"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 80,
            pointerEvents: "none",
          }}
        />

        {/* Gradient Fade at Bottom */}
        <LinearGradient
          colors={["transparent", currentSong.colors[2]]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            pointerEvents: "none",
          }}
        />
      </View>

      {/* Progress Bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <View
          style={{
            height: 4,
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={[
              {
                height: "100%",
                backgroundColor: Colors.primary,
                borderRadius: 2,
              },
              progressAnimatedStyle,
            ]}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
            {formatTime(currentTime)}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
            {formatTime(currentSong.duration)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <Animated.View
        entering={FadeInUp.delay(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 30,
          paddingBottom: 20,
        }}
      >
        <ControlButton
          icon="shuffle"
          onPress={() => showToast("Shuffle enabled", "info")}
          size={24}
        />
        <ControlButton
          icon="play-skip-back"
          onPress={() => {
            setCurrentTime(0);
            progress.value = 0;
          }}
          size={32}
        />
        <ControlButton
          icon={isPlaying ? "pause" : "play"}
          onPress={() => setIsPlaying(!isPlaying)}
          isPrimary
          size={36}
        />
        <ControlButton
          icon="play-skip-forward"
          onPress={() => showToast("Next song", "info")}
          size={32}
        />
        <ControlButton
          icon="repeat"
          onPress={() => showToast("Repeat enabled", "info")}
          size={24}
        />
      </Animated.View>

      {/* Bottom Actions */}
      <Animated.View
        entering={FadeInUp.delay(400)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingHorizontal: 40,
          paddingBottom: Platform.OS === "ios" ? 40 : 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsLiked(!isLiked);
            showToast(isLiked ? "Removed from favorites" : "Added to favorites", "success");
          }}
          style={{ alignItems: "center" }}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? Colors.secondary : "rgba(255,255,255,0.7)"}
          />
          <Text style={{ color: isLiked ? Colors.secondary : "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>
            Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/musicplayer/${songId}`);
          }}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="disc-outline" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>
            Album Art
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // Toggle font size
            setFontSizeMultiplier((prev) => (prev >= 1.3 ? 0.8 : prev + 0.1));
            showToast("Font size changed", "info");
          }}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="text" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>
            Font
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            showToast("Share link copied!", "success");
          }}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="share-outline" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>
            Share
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
