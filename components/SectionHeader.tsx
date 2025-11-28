import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "@/context";

interface SectionHeaderProps {
  title: string;
  icon: string;
  delay?: number;
  onSeeAllPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  delay = 0,
  onSeeAllPress,
}) => {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={{ paddingHorizontal: 20, marginBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons name={icon as any} size={22} color={theme.primary} />
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "900" }}>{title}</Text>
      </View>
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }} onPress={onSeeAllPress}>
        <Text style={{ color: theme.primary, fontSize: 14, fontWeight: "700" }}>See All</Text>
        <Ionicons name="chevron-forward" size={16} color={theme.primary} />
      </TouchableOpacity>
    </Animated.View>
  );
};
