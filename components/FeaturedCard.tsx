import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { Movie } from "@/types";

interface FeaturedCardProps {
  movie: Movie;
  onPress?: () => void;
  onPlayPress?: () => void;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({ movie, onPress, onPlayPress }) => {
  const router = useRouter();
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

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/movie/${movie.id}`);
    }
  };

  const handlePlayPress = () => {
    if (onPlayPress) {
      onPlayPress();
    } else {
      router.push(`/movie/${movie.id}`);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(200).springify().damping(15)} className="px-5 mb-8">
      <TouchableOpacity activeOpacity={0.95} onPress={handlePress}>
        <View className="w-full h-[420px] rounded-[32px] overflow-hidden">
          <View className="w-full h-full relative">
            <Image
              source={{ uri: movie.image }}
              style={{ width: "100%", height: "100%", position: "absolute" }}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.95)"]}
              locations={[0, 0.5, 1]}
              className="absolute inset-0"
            />
            {/* Top Bar */}
            <View className="flex-row justify-between items-center p-4">
              <Animated.View style={badgeStyle}>
                <LinearGradient
                  colors={[Colors.danger, "#dc2626"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="px-4 py-2 rounded-full flex-row items-center"
                >
                  <Ionicons name="flame" size={14} color="white" />
                  <Text className="text-white text-xs font-black ml-1">NOW PLAYING</Text>
                </LinearGradient>
              </Animated.View>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                <Ionicons name="bookmark-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Bottom Content */}
            <View className="absolute bottom-0 left-0 right-0 p-6">
              <View className="flex-row items-center gap-3 mb-3">
                <View className="flex-row items-center bg-yellow-500/30 px-3 py-1.5 rounded-full">
                  <Ionicons name="star" size={14} color={Colors.star} />
                  <Text className="text-yellow-400 font-bold ml-1">{movie.rating}</Text>
                </View>
                <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full">
                  <Ionicons name="time-outline" size={14} color="white" />
                  <Text className="text-white font-medium ml-1">{movie.duration}</Text>
                </View>
                <View className="bg-white/20 px-3 py-1.5 rounded-full">
                  <Text className="text-white font-medium">HD</Text>
                </View>
              </View>

              <Text className="text-white text-4xl font-black mb-2">{movie.title}</Text>
              <Text className="text-gray-300 text-sm mb-4">
                {movie.genre} • Adventure • Sci-Fi • {movie.year}
              </Text>

              <Text className="text-gray-400 text-sm mb-5" numberOfLines={2}>
                {movie.description}
              </Text>

              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1" activeOpacity={0.8} onPress={handlePlayPress}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 rounded-2xl flex-row items-center justify-center"
                  >
                    <Ionicons name="play" size={20} color="white" />
                    <Text className="text-white font-bold text-base ml-2">Watch Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center"
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
