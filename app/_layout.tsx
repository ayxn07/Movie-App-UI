import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";

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
          animation: "fade_from_bottom",
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="movie/[id]" 
          options={{ 
            headerShown: false, 
            presentation: "card",
            animation: "fade_from_bottom",
            animationDuration: 200,
          }} 
        />
        <Stack.Screen 
          name="player/[id]" 
          options={{ 
            headerShown: false, 
            presentation: "fullScreenModal",
            animation: "fade",
            animationDuration: 150,
          }} 
        />
        <Stack.Screen 
          name="notifications/index" 
          options={{ 
            headerShown: false, 
            presentation: "card",
            animation: "slide_from_right",
            animationDuration: 200,
          }} 
        />
        <Stack.Screen 
          name="cast/[id]" 
          options={{ 
            headerShown: false, 
            presentation: "card",
            animation: "slide_from_right",
            animationDuration: 200,
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
