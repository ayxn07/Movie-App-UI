import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";
import { Movie } from "@/types";

interface NowPlayingCarouselProps {
  movies: Movie[];
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 420;

const CarouselItem = ({
  movie,
  animationValue,
}: {
  movie: Movie;
  animationValue: Animated.SharedValue<number>;
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [20, 0, 20],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/movie/${movie.id}`);
  };

  const handlePlayPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(`/player/${movie.id}`);
  };

  return (
    <Animated.View style={[{ width: CARD_WIDTH, height: CARD_HEIGHT }, cardStyle]}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={handlePress}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 32,
            overflow: "hidden",
            backgroundColor: theme.card,
          }}
        >
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
            }}
          >
            <Animated.View style={badgeStyle}>
              <LinearGradient
                colors={[Colors.danger, "#dc2626"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons name="flame" size={14} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontWeight: "900",
                    marginLeft: 4,
                  }}
                >
                  NOW PLAYING
                </Text>
              </LinearGradient>
            </Animated.View>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.4)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="bookmark-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Bottom Content */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(251, 191, 36, 0.3)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Ionicons name="star" size={14} color={Colors.star} />
                <Text
                  style={{
                    color: "#fbbf24",
                    fontWeight: "700",
                    marginLeft: 6,
                  }}
                >
                  {movie.rating}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Ionicons name="time-outline" size={14} color="white" />
                <Text
                  style={{ color: "white", fontWeight: "500", marginLeft: 6 }}
                >
                  {movie.duration}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "500" }}>HD</Text>
              </View>
            </View>

            <Text
              style={{
                color: "white",
                fontSize: 32,
                fontWeight: "900",
                marginBottom: 8,
              }}
              numberOfLines={2}
            >
              {movie.title}
            </Text>
            <Text style={{ color: "#d1d5db", fontSize: 14, marginBottom: 16 }}>
              {movie.genre} • {movie.year}
            </Text>

            <Text
              style={{ color: "#9ca3af", fontSize: 14, marginBottom: 20 }}
              numberOfLines={2}
            >
              {movie.description}
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={0.8}
                onPress={handlePlayPress}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 16,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play" size={20} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "700",
                      fontSize: 16,
                      marginLeft: 8,
                    }}
                  >
                    Watch Now
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                }
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
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
}) => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: 32 }}>
      <Carousel
        ref={carouselRef}
        data={movies}
        width={SCREEN_WIDTH}
        height={CARD_HEIGHT}
        loop
        autoPlay
        autoPlayInterval={5000}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item, animationValue }) => (
          <View style={{ alignItems: "center", paddingHorizontal: 20 }}>
            <CarouselItem movie={item} animationValue={animationValue} />
          </View>
        )}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
          parallaxAdjacentItemScale: 0.8,
        }}
      />
      
      {/* Pagination Dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 16,
          gap: 8,
        }}
      >
        {movies.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              carouselRef.current?.scrollTo({ index, animated: true });
            }}
          >
            <Animated.View
              style={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentIndex === index ? theme.primary : theme.textMuted,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
