import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ContinueWatchingItem, useTheme } from "@/context";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
  index: number;
}

export const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({ item, index }) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/movie/${item.movie.id}`);
  };

  const handlePlayPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(`/player/${item.movie.id}`);
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
      <AnimatedTouchable
        style={[
          animatedStyle,
          {
            width: 280,
            marginRight: 16,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            overflow: "hidden",
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
      >
        <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
          <View style={{ width: 100, height: 60, borderRadius: 12, overflow: "hidden", position: "relative" }}>
            <Image
              source={{ uri: item.movie.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
            <TouchableOpacity
              onPress={handlePlayPress}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: theme.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="play" size={16} color="white" style={{ marginLeft: 2 }} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }} numberOfLines={1}>
              {item.movie.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
              {item.remainingTime} remaining
            </Text>
            <View style={{ marginTop: 8 }}>
              <View
                style={{
                  height: 4,
                  backgroundColor: isDark ? "#334155" : "#e2e8f0",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${item.progress}%`,
                    backgroundColor: theme.primary,
                    borderRadius: 2,
                  }}
                />
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </View>
      </AnimatedTouchable>
    </Animated.View>
  );
};
