import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox, Platform } from "react-native";

import { ThemeProvider, useTheme } from "@/context";
import "./global.css";

// Suppress SafeAreaView deprecation warnings emitted by some libraries
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
  "Please use 'react-native-safe-area-context' instead",
]);

function RootLayoutContent() {
  const { isDark, theme } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: "ios_from_right",
          animationDuration: 250,
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "none" }} />
        <Stack.Screen 
          name="movie/[id]" 
          options={{ 
            headerShown: false, 
            presentation: "card",
            animation: "ios_from_right",
            animationDuration: 250,
            contentStyle: { backgroundColor: theme.background },
          }} 
        />
        <Stack.Screen 
          name="player/[id]" 
          options={{ 
            headerShown: false, 
            presentation: "fullScreenModal",
            animation: "fade",
            animationDuration: 200,
            contentStyle: { backgroundColor: "#000000" },
          }} 
        />
        <Stack.Screen 
          name="notifications/index" 
          options={{ 
            headerShown: false, 
            presentation: "card",
            animation: "ios_from_right",
            animationDuration: 250,
            contentStyle: { backgroundColor: theme.background },
          }} 
        />
        <Stack.Screen 
          name="cast/[id]" 
          options={{ 
            headerShown: false, 
            presentation: "card",
            animation: "ios_from_right",
            animationDuration: 250,
            contentStyle: { backgroundColor: theme.background },
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
