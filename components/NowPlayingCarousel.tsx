import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";
import { Movie } from "@/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 420;
const CARD_MARGIN = 10;

interface NowPlayingCarouselProps {
  movies: Movie[];
}

const CarouselCard = ({
  movie,
  index,
  scrollX,
}: {
  movie: Movie;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const router = useRouter();
  const { isDark } = useTheme();
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
  }, [pulseScale]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const inputRange = [
    (index - 1) * (CARD_WIDTH + CARD_MARGIN * 2),
    index * (CARD_WIDTH + CARD_MARGIN * 2),
    (index + 1) * (CARD_WIDTH + CARD_MARGIN * 2),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }],
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

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: CARD_WIDTH,
          marginHorizontal: CARD_MARGIN,
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.95} onPress={handlePress}>
        <View style={{ 
          width: CARD_WIDTH, 
          height: CARD_HEIGHT, 
          borderRadius: 32, 
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 10,
        }}>
          <View style={{ width: "100%", height: "100%", position: "relative" }}>
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
                  style={{ 
                    paddingHorizontal: 16, 
                    paddingVertical: 8, 
                    borderRadius: 20, 
                    flexDirection: "row", 
                    alignItems: "center" 
                  }}
                >
                  <Ionicons name="flame" size={14} color="white" />
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "900", marginLeft: 4 }}>NOW PLAYING</Text>
                </LinearGradient>
              </Animated.View>
              <TouchableOpacity 
                onPress={handleBookmark}
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: "rgba(0,0,0,0.4)", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}
              >
                <Ionicons name="bookmark-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Bottom Content */}
            <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(251, 191, 36, 0.3)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                  <Ionicons name="star" size={14} color={Colors.star} />
                  <Text style={{ color: Colors.star, fontWeight: "700", marginLeft: 4 }}>{movie.rating}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                  <Ionicons name="time-outline" size={14} color="white" />
                  <Text style={{ color: "white", fontWeight: "500", marginLeft: 4 }}>{movie.duration}</Text>
                </View>
                <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                  <Text style={{ color: "white", fontWeight: "500" }}>HD</Text>
                </View>
              </View>

              <Text style={{ color: "white", fontSize: 32, fontWeight: "900", marginBottom: 8 }}>{movie.title}</Text>
              <Text style={{ color: "rgba(209, 213, 219, 1)", fontSize: 14, marginBottom: 16 }}>
                {movie.genre} • {movie.year}
              </Text>

              <Text style={{ color: "rgba(156, 163, 175, 1)", fontSize: 14, marginBottom: 20 }} numberOfLines={2}>
                {movie.description}
              </Text>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8} onPress={handlePlayPress}>
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
                  onPress={handleBookmark}
                  style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={28} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Pagination Dots Component
const PaginationDots = ({
  count,
  scrollX,
}: {
  count: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 }}>
      {Array.from({ length: count }).map((_, index) => {
        const inputRange = [
          (index - 1) * (CARD_WIDTH + CARD_MARGIN * 2),
          index * (CARD_WIDTH + CARD_MARGIN * 2),
          (index + 1) * (CARD_WIDTH + CARD_MARGIN * 2),
        ];

        const DotComponent = () => {
          const animatedStyle = useAnimatedStyle(() => {
            const width = interpolate(
              scrollX.value,
              inputRange,
              [8, 24, 8],
              Extrapolation.CLAMP
            );
            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.4, 1, 0.4],
              Extrapolation.CLAMP
            );
            return {
              width,
              opacity,
            };
          });

          return (
            <Animated.View
              style={[
                animatedStyle,
                {
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.primary,
                  marginHorizontal: 4,
                },
              ]}
            />
          );
        };

        return <DotComponent key={index} />;
      })}
    </View>
  );
};

export const NowPlayingCarousel: React.FC<NowPlayingCarouselProps> = ({ movies }) => {
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<Animated.FlatList<Movie>>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % movies.length;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * (CARD_WIDTH + CARD_MARGIN * 2),
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, movies.length]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
    if (viewableItems[0]?.index !== null && viewableItems[0]?.index !== undefined) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <Animated.View entering={FadeInDown.delay(200).springify().damping(15)} style={{ marginBottom: 24 }}>
      <Animated.FlatList
        ref={flatListRef}
        data={movies}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2 - CARD_MARGIN }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <CarouselCard movie={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <PaginationDots count={movies.length} scrollX={scrollX} />
    </Animated.View>
  );
};
