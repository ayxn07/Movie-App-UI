import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from "react-native-reanimated";

import { useTheme } from "@/context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TabBarButtonProps {
  icon: string;
  activeIcon: string;
  label: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  theme: any;
}

export const TabBarButton: React.FC<TabBarButtonProps> = ({
  icon,
  activeIcon,
  label,
  isFocused,
  onPress,
  onLongPress,
  theme,
}) => {
  const scale = useSharedValue(1);
  const backgroundOpacity = useSharedValue(isFocused ? 1 : 0);
  const iconScale = useSharedValue(isFocused ? 1 : 0.9);

  useEffect(() => {
    backgroundOpacity.value = withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
    iconScale.value = withSpring(isFocused ? 1 : 0.85, {
      damping: 12,
      stiffness: 200,
    });
  }, [isFocused]);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
    transform: [
      { scale: interpolate(backgroundOpacity.value, [0, 1], [0.5, 1]) },
    ],
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={containerStyle}
      className="flex-1 items-center justify-center py-2"
    >
      <View className="relative w-14 h-14 items-center justify-center">
        {/* Animated Background */}
        <Animated.View
          style={backgroundStyle}
          className="absolute w-12 h-12 rounded-2xl bg-violet-600"
        />
        {/* Icon */}
        <Animated.View style={iconContainerStyle}>
          <Ionicons
            name={(isFocused ? activeIcon : icon) as any}
            size={26}
            color={isFocused ? "white" : theme.textMuted}
          />
        </Animated.View>
      </View>
      <Text
        style={{
          fontSize: 11,
          marginTop: 4,
          fontWeight: "600",
          color: isFocused ? theme.primary : theme.textMuted,
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TAB_CONFIG = [
  { icon: "home-outline", activeIcon: "home", label: "Home" },
  { icon: "compass-outline", activeIcon: "compass", label: "Explore" },
  { icon: "bookmark-outline", activeIcon: "bookmark", label: "Saved" },
  { icon: "person-outline", activeIcon: "person", label: "Profile" },
];

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        backgroundColor: theme.tabBar,
        borderTopWidth: 1,
        borderTopColor: theme.tabBarBorder,
        paddingBottom: 30,
        paddingTop: 8,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const config = TAB_CONFIG[index];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.key}
            icon={config.icon}
            activeIcon={config.activeIcon}
            label={config.label}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            theme={theme}
          />
        );
      })}
    </View>
  );
};
