import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/context";
import { Movie } from "@/types";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface MovieCardProps {
  movie: Movie;
  index: number;
  onPress?: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index, onPress }) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const scale = useSharedValue(1);
  const [liked, setLiked] = useState(false);

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

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLiked(!liked);
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).springify().damping(15)}>
      <AnimatedTouchable
        style={[animatedStyle, { marginRight: 16 }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
      >
        <View style={{ 
          width: 176, borderRadius: 24, overflow: "hidden", 
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, 
          shadowOpacity: isDark ? 0.3 : 0.1, shadowRadius: 8, elevation: 5,
        }}>
          <View style={{ height: 240, position: "relative" }}>
            <Image
              source={{ uri: movie.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
            {/* Like Button */}
            <TouchableOpacity
              onPress={handleLike}
              style={{ 
                position: "absolute", top: 12, right: 12, 
                width: 36, height: 36, borderRadius: 18, 
                alignItems: "center", justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={20}
                color={liked ? theme.danger : "white"}
              />
            </TouchableOpacity>
            {/* Rating Badge */}
            <View style={{ 
              position: "absolute", top: 12, left: 12, 
              flexDirection: "row", alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
            }}>
              <Ionicons name="star" size={12} color={theme.star} />
              <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700", marginLeft: 4 }}>{movie.rating}</Text>
            </View>
          </View>
          <View style={{ padding: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }} numberOfLines={1}>
              {movie.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 }}>
              <View style={{ backgroundColor: isDark ? "#334155" : "#e2e8f0", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.genre}</Text>
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>{movie.year}</Text>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};
