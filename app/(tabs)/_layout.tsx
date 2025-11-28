import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

import { CustomTabBar } from "@/components/CustomTabBar";
import { useTheme } from "@/context";

export default function TabLayout() {
  const { isDark, theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="explore" />
        <Tabs.Screen name="saved" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}