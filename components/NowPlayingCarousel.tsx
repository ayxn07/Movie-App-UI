import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";
import { Movie } from "@/types";

const { width } = Dimensions.get("window");

interface NowPlayingCarouselProps {
  movies: Movie[];
  autoPlayInterval?: number;
}

const CarouselCard = ({ 
  movie, 
  isActive,
  onPress,
  onPlayPress,
}: { 
  movie: Movie; 
  isActive: boolean;
  onPress: () => void;
  onPlayPress: () => void;
}) => {
  const { isDark } = useTheme();
  const pulseScale = useSharedValue(1);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [isActive, pulseScale]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isActive ? pulseScale.value : 1 }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleAddToList = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <Animated.View style={[{ flex: 1, paddingHorizontal: 20 }, cardAnimatedStyle]}>
      <TouchableOpacity 
        activeOpacity={0.95} 
        onPress={onPress}
        onPressIn={() => { cardScale.value = withSpring(0.98); }}
        onPressOut={() => { cardScale.value = withSpring(1); }}
      >
        <View style={{ width: "100%", height: 420, borderRadius: 32, overflow: "hidden" }}>
          <Image
            source={{ uri: movie.image }}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.95)"]}
            locations={[0, 0.5, 1]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
          
          {/* Top Bar */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 }}>
            <Animated.View style={badgeStyle}>
              <LinearGradient
                colors={[Colors.danger, "#dc2626"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons name="flame" size={14} color="white" />
                <Text style={{ color: "white", fontSize: 12, fontWeight: "800", marginLeft: 4 }}>NOW PLAYING</Text>
              </LinearGradient>
            </Animated.View>
            <TouchableOpacity 
              onPress={handleBookmark}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name="bookmark-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Bottom Content */}
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(251, 191, 36, 0.3)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                <Ionicons name="star" size={14} color={Colors.star} />
                <Text style={{ color: "#fbbf24", fontWeight: "700", marginLeft: 4 }}>{movie.rating}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                <Ionicons name="time-outline" size={14} color="white" />
                <Text style={{ color: "white", fontWeight: "500", marginLeft: 4 }}>{movie.duration}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                <Text style={{ color: "white", fontWeight: "500" }}>HD</Text>
              </View>
            </View>

            <Text style={{ color: "white", fontSize: 32, fontWeight: "900", marginBottom: 8 }} numberOfLines={2}>
              {movie.title}
            </Text>
            <Text style={{ color: "#d1d5db", fontSize: 14, marginBottom: 16 }}>
              {movie.genre} • Adventure • Sci-Fi • {movie.year}
            </Text>

            <Text style={{ color: "#9ca3af", fontSize: 14, marginBottom: 20 }} numberOfLines={2}>
              {movie.description}
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8} onPress={onPlayPress}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ paddingVertical: 16, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                >
                  <Ionicons name="play" size={20} color="white" />
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>Watch Now</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddToList}
                style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const NowPlayingCarousel: React.FC<NowPlayingCarouselProps> = ({ 
  movies, 
  autoPlayInterval = 5000 
}) => {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const pagerRef = useRef<PagerView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const dotScale = useSharedValue(1);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % movies.length;
      pagerRef.current?.setPage(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [activeIndex, movies.length, autoPlayInterval]);

  const handlePageSelected = useCallback((e: { nativeEvent: { position: number } }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveIndex(e.nativeEvent.position);
    dotScale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
  }, [dotScale]);

  const handleMoviePress = (movieId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/movie/${movieId}`);
  };

  const handlePlayPress = (movieId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(`/player/${movieId}`);
  };

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(200).springify().damping(15)} style={{ marginBottom: 32 }}>
      <PagerView
        ref={pagerRef}
        style={{ height: 440 }}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {movies.map((movie, index) => (
          <View key={movie.id} style={{ flex: 1 }}>
            <CarouselCard
              movie={movie}
              isActive={index === activeIndex}
              onPress={() => handleMoviePress(movie.id)}
              onPlayPress={() => handlePlayPress(movie.id)}
            />
          </View>
        ))}
      </PagerView>

      {/* Pagination Dots */}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16, gap: 8 }}>
        {movies.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              pagerRef.current?.setPage(index);
            }}
          >
            <Animated.View
              style={[
                {
                  width: activeIndex === index ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: activeIndex === index ? theme.primary : isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
                },
                activeIndex === index && dotAnimatedStyle,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};
