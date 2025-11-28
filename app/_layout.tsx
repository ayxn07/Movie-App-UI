import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox, View } from "react-native";

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
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
          name="movie/player/[id]" 
          options={{ 
            headerShown: false, 
            presentation: "fullScreenModal",
            animation: "slide_from_bottom",
            animationDuration: 300,
          }} 
        />
        <Stack.Screen 
          name="notifications/index" 
          options={{ 
            headerShown: false, 
            presentation: "card",
            animation: "slide_from_right",
            animationDuration: 250,
          }} 
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
