import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import { Genre } from "@/types";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface GenreButtonProps {
  genre: Genre;
  index: number;
  onPress?: () => void;
}

export const GenreButton: React.FC<GenreButtonProps> = ({ genre, index, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify().damping(12)}>
      <AnimatedTouchable
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
      >
        <LinearGradient
          colors={genre.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-5 py-3 rounded-2xl flex-row items-center gap-2"
        >
          <Ionicons name={genre.icon as any} size={18} color="white" />
          <Text className="text-white font-bold text-sm">{genre.name}</Text>
        </LinearGradient>
      </AnimatedTouchable>
    </Animated.View>
  );
};
