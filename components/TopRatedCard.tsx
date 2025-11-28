import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";
import { Movie } from "@/types";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface TopRatedCardProps {
  movie: Movie;
  index: number;
  onPress?: () => void;
}

export const TopRatedCard: React.FC<TopRatedCardProps> = ({ movie, index, onPress }) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    } else {
      router.push(`/movie/${movie.id}`);
    }
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 120).springify()}>
      <AnimatedTouchable
        className="mr-4 flex-row items-end"
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
      >
        {/* Large Rank Number */}
        <Text
          className="font-black mr-[-20px] z-10"
          style={{ fontSize: 100, lineHeight: 100, color: isDark ? "#334155" : "#cbd5e1" }}
        >
          {index + 1}
        </Text>
        <View className="w-32 h-48 rounded-2xl overflow-hidden" style={{ backgroundColor: theme.card }}>
          <Image
            source={{ uri: movie.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.9)"]}
            className="absolute inset-0"
          />
          <View className="absolute bottom-0 left-0 right-0 p-2">
            <Text className="text-white font-bold text-sm" numberOfLines={1}>
              {movie.title}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="star" size={10} color={Colors.star} />
              <Text className="text-yellow-400 text-xs font-bold ml-1">{movie.rating}</Text>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};
