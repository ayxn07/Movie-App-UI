import { Ionicons } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  PanResponder,
  Animated as RNAnimated,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Sample song data with lyrics and audio URLs
// Using free sample audio from the internet for demo purposes
const SONGS = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200, // seconds
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    colors: ["#1a1a2e", "#16213e", "#0f3460"],
    // Sample audio URL - in production, this would be the actual audio file
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    lyrics: [
      { time: 0, text: "♪ Instrumental ♪" },
      { time: 15, text: "Verse 1 begins..." },
      { time: 30, text: "The rhythm flows..." },
      { time: 45, text: "Emotions rise..." },
      { time: 60, text: "♪ Chorus ♪" },
      { time: 75, text: "The beat drops..." },
      { time: 90, text: "Feel the music..." },
      { time: 105, text: "♪ Bridge ♪" },
      { time: 120, text: "Intensity builds..." },
      { time: 135, text: "Final verse..." },
      { time: 150, text: "♪ Outro ♪" },
    ],
  },
  {
    id: "2",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 203,
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    colors: ["#2d1b69", "#5a189a", "#9d4edd"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    lyrics: [
      { time: 0, text: "♪ Intro ♪" },
      { time: 15, text: "The journey starts..." },
      { time: 30, text: "Rising higher..." },
      { time: 45, text: "♪ Chorus ♪" },
    ],
  },
  {
    id: "3",
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 215,
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    colors: ["#0d1b2a", "#1b263b", "#415a77"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    lyrics: [
      { time: 0, text: "♪ Intro ♪" },
      { time: 20, text: "Memories fade..." },
      { time: 40, text: "Emotions swell..." },
    ],
  },
];

// Equalizer Bar Component
const EqualizerBar = ({ isPlaying, delay }: { isPlaying: boolean; delay: number }) => {
  const height = useSharedValue(0.3);

  useEffect(() => {
    if (isPlaying) {
      height.value = withRepeat(
        withSequence(
          withTiming(Math.random() * 0.7 + 0.3, { duration: 150 + delay }),
          withTiming(Math.random() * 0.5 + 0.2, { duration: 150 + delay })
        ),
        -1,
        true
      );
    } else {
      height.value = withTiming(0.15, { duration: 300 });
    }
  }, [isPlaying, delay, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${height.value * 100}%`,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 4,
          backgroundColor: Colors.primary,
          borderRadius: 2,
          marginHorizontal: 1,
        },
        animatedStyle,
      ]}
    />
  );
};

// Equalizer Component
const Equalizer = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        height: 40,
        paddingHorizontal: 8,
      }}
    >
      {[0, 30, 60, 90, 120, 150, 120, 90, 60, 30, 0].map((delay, index) => (
        <EqualizerBar key={index} isPlaying={isPlaying} delay={delay} />
      ))}
    </View>
  );
};

// Vinyl Record Component (spins when playing)
const VinylRecord = ({ isPlaying, coverImage }: { isPlaying: boolean; coverImage: string }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      // Reset rotation when it gets too large to prevent overflow
      if (rotation.value > 3600) {
        rotation.value = rotation.value % 360;
      }
      rotation.value = withRepeat(
        withTiming(rotation.value + 360, { duration: 10000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [isPlaying, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Vinyl Disc */}
      <Animated.View
        style={[
          {
            width: width * 0.85,
            height: width * 0.85,
            borderRadius: width * 0.425,
            backgroundColor: "#1a1a1a",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 15,
          },
          animatedStyle,
        ]}
      >
        {/* Vinyl grooves */}
        {[0.35, 0.45, 0.55, 0.65, 0.75].map((size, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              width: width * 0.85 * size,
              height: width * 0.85 * size,
              borderRadius: (width * 0.85 * size) / 2,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          />
        ))}
        {/* Album art center */}
        <View
          style={{
            width: width * 0.35,
            height: width * 0.35,
            borderRadius: width * 0.175,
            overflow: "hidden",
            borderWidth: 3,
            borderColor: "#333",
          }}
        >
          <Image
            source={{ uri: coverImage }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>
        {/* Center hole */}
        <View
          style={{
            position: "absolute",
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#0a0a0a",
          }}
        />
      </Animated.View>
    </View>
  );
};

// Progress Slider Component
const ProgressSlider = ({
  progress,
  currentTime,
  totalTime,
  onSeek,
}: {
  progress: number;
  currentTime: number;
  totalTime: number;
  onSeek: (value: number) => void;
}) => {
  const { theme } = useTheme();
  const sliderWidth = useRef(new RNAnimated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);

  useEffect(() => {
    if (!isDragging) {
      setLocalProgress(progress);
    }
  }, [progress, isDragging]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onPanResponderMove: (_, gestureState) => {
      const newProgress = Math.max(0, Math.min(1, gestureState.moveX / (width - 40)));
      setLocalProgress(newProgress);
    },
    onPanResponderRelease: (_, gestureState) => {
      const newProgress = Math.max(0, Math.min(1, gestureState.moveX / (width - 40)));
      onSeek(newProgress);
      setIsDragging(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
  });

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
      {/* Progress Bar */}
      <View
        style={{
          height: 6,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 3,
          overflow: "visible",
        }}
        {...panResponder.panHandlers}
      >
        <View
          style={{
            height: "100%",
            width: `${localProgress * 100}%`,
            backgroundColor: Colors.primary,
            borderRadius: 3,
          }}
        />
        {/* Thumb */}
        <View
          style={{
            position: "absolute",
            left: `${localProgress * 100}%`,
            top: -7,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: Colors.primary,
            marginLeft: -10,
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 5,
          }}
        />
      </View>
      {/* Time Labels */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
        <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600" }}>
          {formatTime(currentTime)}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600" }}>
          {formatTime(totalTime)}
        </Text>
      </View>
    </View>
  );
};

// Control Button Component
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
            backgroundColor: Colors.primary,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Ionicons name={icon as any} size={size} color="white" />
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

// Lyrics Line Component
const LyricLine = ({
  text,
  isActive,
  isPast,
}: {
  text: string;
  isActive: boolean;
  isPast: boolean;
}) => {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: isActive ? 24 : 18,
          fontWeight: isActive ? "800" : "600",
          color: isActive ? "white" : isPast ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.5)",
          textAlign: "center",
          lineHeight: isActive ? 32 : 26,
        }}
      >
        {text}
      </Text>
    </Animated.View>
  );
};

// Queue Item Component
const QueueItem = ({
  song,
  index,
  isPlaying,
  onPlay,
}: {
  song: (typeof SONGS)[0];
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
}) => {
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={onPlay}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 20,
          backgroundColor: isPlaying ? "rgba(139, 92, 246, 0.2)" : "transparent",
          borderRadius: 12,
          marginHorizontal: 12,
          marginBottom: 8,
        }}
      >
        <Image
          source={{ uri: song.cover }}
          style={{ width: 50, height: 50, borderRadius: 8 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text
            style={{
              color: isPlaying ? Colors.primary : "white",
              fontWeight: "700",
              fontSize: 15,
            }}
            numberOfLines={1}
          >
            {song.title}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}>
            {song.artist}
          </Text>
        </View>
        {isPlaying ? (
          <Equalizer isPlaying={true} />
        ) : (
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function MusicPlayerScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const songId = params.id as string;
  const { showToast } = useApp();

  const [currentSongIndex, setCurrentSongIndex] = useState(
    SONGS.findIndex((s) => s.id === songId) || 0
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showVinyl, setShowVinyl] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentSong = SONGS[currentSongIndex];
  const lyricsScrollRef = useRef<ScrollView>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Load and play audio when song changes
  useEffect(() => {
    let isMounted = true;

    const loadAndPlayAudio = async () => {
      try {
        setIsLoading(true);

        // Unload previous sound if exists
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // Set audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
        });

        // Load new sound
        const { sound } = await Audio.Sound.createAsync(
          { uri: currentSong.audioUrl },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );

        if (isMounted) {
          soundRef.current = sound;
          setIsPlaying(true);
          setIsLoading(false);
        } else {
          // Component unmounted, clean up
          await sound.unloadAsync();
        }
      } catch (error) {
        console.error("Error loading audio:", error);
        if (isMounted) {
          setIsLoading(false);
          showToast("Failed to load audio", "error");
        }
      }
    };

    loadAndPlayAudio();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [currentSongIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const positionSeconds = (status.positionMillis || 0) / 1000;
      const durationSeconds = (status.durationMillis || 1) / 1000;
      setCurrentTime(positionSeconds);
      setProgress(durationSeconds > 0 ? positionSeconds / durationSeconds : 0);
      setIsPlaying(status.isPlaying);

      // Handle song completion
      if (status.didJustFinish && !status.isLooping) {
        handleNext();
      }
    }
  }, [repeatMode, isShuffled]);

  // Auto scroll lyrics
  useEffect(() => {
    if (showLyrics && lyricsScrollRef.current) {
      const activeLyricIndex = currentSong.lyrics.findIndex(
        (lyric, index) =>
          lyric.time <= currentTime &&
          (index === currentSong.lyrics.length - 1 ||
            currentSong.lyrics[index + 1].time > currentTime)
      );
      if (activeLyricIndex > 0) {
        lyricsScrollRef.current.scrollTo({
          y: activeLyricIndex * 50,
          animated: true,
        });
      }
    }
  }, [currentTime, showLyrics, currentSong.lyrics]);

  const handlePlayPause = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const handleNext = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (repeatMode === "one") {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      }
    } else if (isShuffled) {
      setCurrentSongIndex(Math.floor(Math.random() * SONGS.length));
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    }
    setCurrentTime(0);
    setProgress(0);
  }, [repeatMode, isShuffled]);

  const handlePrevious = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentTime > 3) {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
      }
      setCurrentTime(0);
      setProgress(0);
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
      setCurrentTime(0);
      setProgress(0);
    }
  };

  const handleSeek = async (value: number) => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded && status.durationMillis) {
      const newPosition = value * status.durationMillis;
      await soundRef.current.setPositionAsync(newPosition);
    }
  };

  const handleShuffle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsShuffled(!isShuffled);
    showToast(isShuffled ? "Shuffle off" : "Shuffle on", "info");
  };

  const handleRepeat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (repeatMode === "off") {
      setRepeatMode("all");
      showToast("Repeat all", "info");
    } else if (repeatMode === "all") {
      setRepeatMode("one");
      showToast("Repeat one", "info");
    } else {
      setRepeatMode("off");
      showToast("Repeat off", "info");
    }
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLiked(!isLiked);
    showToast(isLiked ? "Removed from favorites" : "Added to favorites", "success");
  };

  const getActiveLyricIndex = () => {
    return currentSong.lyrics.findIndex(
      (lyric, index) =>
        lyric.time <= currentTime &&
        (index === currentSong.lyrics.length - 1 ||
          currentSong.lyrics[index + 1].time > currentTime)
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <StatusBar style="light" />

      {/* Dynamic Background Gradient */}
      <LinearGradient
        colors={currentSong.colors as [string, string, string]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Animated Overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 20,
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
            backgroundColor: "rgba(255,255,255,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-down" size={26} color="white" />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "600" }}>
            PLAYING FROM
          </Text>
          <Text style={{ color: "white", fontSize: 14, fontWeight: "700", marginTop: 2 }}>
            {currentSong.album}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // Options menu
          }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "rgba(255,255,255,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content - Swappable between Album Art, Lyrics, Queue */}
      <View style={{ flex: 1 }}>
        {showQueue ? (
          // Queue View
          <Animated.View entering={SlideInUp.springify()} style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "white", fontSize: 22, fontWeight: "800" }}>Up Next</Text>
              <TouchableOpacity onPress={() => setShowQueue(false)}>
                <Text style={{ color: Colors.primary, fontWeight: "600" }}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {SONGS.map((song, index) => (
                <QueueItem
                  key={song.id}
                  song={song}
                  index={index}
                  isPlaying={index === currentSongIndex}
                  onPlay={() => {
                    setCurrentSongIndex(index);
                    setCurrentTime(0);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                />
              ))}
            </ScrollView>
          </Animated.View>
        ) : showLyrics ? (
          // Lyrics View
          <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>Lyrics</Text>
              <TouchableOpacity onPress={() => setShowLyrics(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView
              ref={lyricsScrollRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 40 }}
            >
              {currentSong.lyrics.map((lyric, index) => (
                <LyricLine
                  key={index}
                  text={lyric.text}
                  isActive={index === getActiveLyricIndex()}
                  isPast={lyric.time < currentTime && index !== getActiveLyricIndex()}
                />
              ))}
            </ScrollView>
          </Animated.View>
        ) : (
          // Album Art / Vinyl View
          <Animated.View
            entering={FadeIn.duration(400)}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {showVinyl ? (
              <VinylRecord isPlaying={isPlaying} coverImage={currentSong.cover} />
            ) : (
              <TouchableOpacity
                onPress={() => setShowVinyl(true)}
                activeOpacity={0.95}
              >
                <View
                  style={{
                    width: width * 0.85,
                    height: width * 0.85,
                    borderRadius: 20,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 20 },
                    shadowOpacity: 0.5,
                    shadowRadius: 30,
                    elevation: 20,
                  }}
                >
                  <Image
                    source={{ uri: currentSong.cover }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                  {/* Equalizer overlay when playing */}
                  {isPlaying && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 20,
                        left: 0,
                        right: 0,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "rgba(0,0,0,0.6)",
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderRadius: 20,
                        }}
                      >
                        <Equalizer isPlaying={isPlaying} />
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
            {showVinyl && (
              <TouchableOpacity
                onPress={() => setShowVinyl(false)}
                style={{ marginTop: 20 }}
              >
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                  Tap to see album art
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}
      </View>

      {/* Song Info */}
      <Animated.View entering={FadeInUp.delay(200).duration(400)} style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "900" }} numberOfLines={1}>
              {currentSong.title}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginTop: 4 }}>
              {currentSong.artist}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLike} style={{ padding: 8 }}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={28}
              color={isLiked ? Colors.secondary : "white"}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Progress Slider */}
      <ProgressSlider
        progress={progress}
        currentTime={currentTime}
        totalTime={currentSong.duration}
        onSeek={handleSeek}
      />

      {/* Main Controls */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(400)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 30,
          marginTop: 20,
        }}
      >
        <ControlButton
          icon="shuffle"
          onPress={handleShuffle}
          isActive={isShuffled}
          size={24}
        />
        <ControlButton icon="play-skip-back" onPress={handlePrevious} size={32} />
        <ControlButton
          icon={isPlaying ? "pause" : "play"}
          onPress={handlePlayPause}
          isPrimary
          size={36}
        />
        <ControlButton icon="play-skip-forward" onPress={handleNext} size={32} />
        <ControlButton
          icon={repeatMode === "one" ? "repeat-outline" : "repeat"}
          onPress={handleRepeat}
          isActive={repeatMode !== "off"}
          size={24}
        />
      </Animated.View>

      {/* Bottom Actions */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(400)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingHorizontal: 40,
          paddingVertical: 20,
          paddingBottom: 50,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // Cast to device
            showToast("Searching for devices...", "info");
          }}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="tv-outline" size={22} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>
            Devices
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowLyrics(true);
          }}
          style={{ alignItems: "center" }}
        >
          <Ionicons
            name="text"
            size={22}
            color={showLyrics ? Colors.primary : "rgba(255,255,255,0.7)"}
          />
          <Text
            style={{
              color: showLyrics ? Colors.primary : "rgba(255,255,255,0.5)",
              fontSize: 10,
              marginTop: 4,
            }}
          >
            Lyrics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowQueue(true);
          }}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="list" size={22} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Queue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // Share song
            showToast("Share link copied!", "success");
          }}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="share-outline" size={22} color="rgba(255,255,255,0.7)" />
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>Share</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
