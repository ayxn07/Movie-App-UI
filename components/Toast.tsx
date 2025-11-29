import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useApp, useTheme } from "@/context";

export const Toast: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { toastMessage, toastType, hideToast } = useApp();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (toastMessage) {
      scale.value = withSequence(
        withTiming(1.02, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }
  }, [toastMessage, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!toastMessage) return null;

  const iconMap = {
    success: { name: "checkmark-circle", color: "#10b981" },
    error: { name: "close-circle", color: "#ef4444" },
    info: { name: "information-circle", color: "#3b82f6" },
  };

  const icon = iconMap[toastType];

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(15)}
      exiting={FadeOutUp}
      style={[
        animatedStyle,
        {
          position: "absolute",
          top: 60,
          left: 20,
          right: 20,
          zIndex: 9999,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
          borderLeftWidth: 4,
          borderLeftColor: icon.color,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${icon.color}20`,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name={icon.name as keyof typeof Ionicons.glyphMap} size={24} color={icon.color} />
        </View>
        <Text style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: "600" }}>
          {toastMessage}
        </Text>
        <TouchableOpacity onPress={hideToast} style={{ padding: 4 }}>
          <Ionicons name="close" size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
