import { Ionicons } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  PanResponder,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp } from "@/context";

const { width } = Dimensions.get("window");

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
          width: 6,
          backgroundColor: Colors.primary,
          borderRadius: 3,
          marginHorizontal: 2,
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
        height: 80,
        paddingHorizontal: 16,
      }}
    >
      {[0, 30, 60, 90, 120, 150, 180, 150, 120, 90, 60, 30, 0].map((delay, index) => (
        <EqualizerBar key={index} isPlaying={isPlaying} delay={delay} />
      ))}
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
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);

  useEffect(() => {
    if (!isDragging) {
      setLocalProgress(progress);
    }
  }, [progress, isDragging]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
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
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={size} color="white" />
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
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={size} color={isActive ? Colors.primary : "white"} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function LocalAudioPlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const audioUri = decodeURIComponent(params.uri as string);
  const audioName = params.name as string || "Unknown Audio";
  const { showToast } = useApp();

  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one">("off");
  const [isLiked, setIsLiked] = useState(false);
  const volume = 1; // Fixed volume for now

  // Playback status callback
  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
      
      if (status.durationMillis) {
        setTotalTime(status.durationMillis);
        setProgress((status.positionMillis || 0) / status.durationMillis);
      }

      // Handle playback completion
      if (status.didJustFinish) {
        if (repeatMode === "one") {
          soundRef.current?.replayAsync();
        } else {
          setIsPlaying(false);
          setProgress(0);
          setCurrentTime(0);
        }
      }
    }
  }, [repeatMode]);

  // Load and play audio
  useEffect(() => {
    let isMounted = true;

    const loadAudio = async () => {
      try {
        // Set audio mode for playback
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        const { sound, status } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true, volume: 1.0 },
          onPlaybackStatusUpdate
        );

        if (isMounted) {
          soundRef.current = sound;
          setIsLoading(false);
          setIsPlaying(true);
          
          if (status.isLoaded && status.durationMillis) {
            setTotalTime(status.durationMillis);
          }
        }
      } catch (error) {
        console.error("Error loading audio:", error);
        if (isMounted) {
          setIsLoading(false);
          showToast("Failed to load audio file", "error");
        }
      }
    };

    loadAudio();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [audioUri, showToast, onPlaybackStatusUpdate]);

  const handlePlayPause = async () => {
    if (!soundRef.current) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const handleSeek = async (value: number) => {
    if (!soundRef.current || totalTime === 0) return;
    
    const newPosition = value * totalTime;
    await soundRef.current.setPositionAsync(newPosition);
  };

  const handleSkipForward = async () => {
    if (!soundRef.current) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPosition = Math.min(currentTime + 15000, totalTime);
    await soundRef.current.setPositionAsync(newPosition);
  };

  const handleSkipBackward = async () => {
    if (!soundRef.current) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPosition = Math.max(currentTime - 15000, 0);
    await soundRef.current.setPositionAsync(newPosition);
  };

  const handleShuffle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsShuffled(!isShuffled);
    showToast(isShuffled ? "Shuffle off" : "Shuffle on", "info");
  };

  const handleRepeat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (repeatMode === "off") {
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

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <StatusBar style="light" />

      {/* Dynamic Background Gradient */}
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
            if (soundRef.current) {
              soundRef.current.unloadAsync();
            }
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

        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "600" }}>
            NOW PLAYING
          </Text>
          <Text style={{ color: "white", fontSize: 14, fontWeight: "700", marginTop: 2 }}>
            Local Audio
          </Text>
        </View>

        <TouchableOpacity
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

      {/* Main Content */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
        {/* Album Art Placeholder with Equalizer */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={{
            width: width * 0.75,
            height: width * 0.75,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.05)",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.5,
            shadowRadius: 30,
            elevation: 20,
          }}
        >
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: `${Colors.primary}30`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}>
            <Ionicons name="musical-notes" size={60} color={Colors.primary} />
          </View>
          <Equalizer isPlaying={isPlaying} />
        </Animated.View>

        {/* Loading indicator */}
        {isLoading && (
          <View style={{
            position: "absolute",
            top: "50%",
            alignItems: "center",
          }}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Loading audio...</Text>
          </View>
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
            <Text style={{ color: "white", fontSize: 22, fontWeight: "900" }} numberOfLines={2}>
              {audioName}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 }}>
              Local Audio File
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
        totalTime={totalTime}
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
        <ControlButton icon="play-back" onPress={handleSkipBackward} size={32} />
        <ControlButton
          icon={isPlaying ? "pause" : "play"}
          onPress={handlePlayPause}
          isPrimary
          size={36}
        />
        <ControlButton icon="play-forward" onPress={handleSkipForward} size={32} />
        <ControlButton
          icon="repeat"
          onPress={handleRepeat}
          isActive={repeatMode !== "off"}
          size={24}
        />
      </Animated.View>

      {/* Bottom Actions - Volume */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(400)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 40,
          paddingVertical: 20,
          paddingBottom: 50,
          gap: 16,
        }}
      >
        <Ionicons name="volume-low" size={20} color="rgba(255,255,255,0.6)" />
        <View style={{ flex: 1, height: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
          <View
            style={{
              width: `${volume * 100}%`,
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.6)",
              borderRadius: 2,
            }}
          />
        </View>
        <Ionicons name="volume-high" size={20} color="rgba(255,255,255,0.6)" />
      </Animated.View>
    </View>
  );
}
