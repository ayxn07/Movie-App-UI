import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ThemeProvider, AppProvider, useTheme } from "@/context";
import "./global.css";

// Suppress SafeAreaView deprecation warnings emitted by some libraries
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
  "Please use 'react-native-safe-area-context' instead",
]);

function RootLayoutContent() {
  const { isDark, theme } = useTheme();
  const bgOpacity = useSharedValue(1);

  useEffect(() => {
    bgOpacity.value = withTiming(1, { duration: 200 });
  }, [isDark, bgOpacity]);

  const animatedBgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Animated.View 
        style={[{ flex: 1 }, animatedBgStyle]}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
            animation: "slide_from_right",
            animationDuration: 200,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            freezeOnBlur: true,
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false, 
              animation: "none",
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="movie/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="player/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "fullScreenModal",
              animation: "fade",
              animationDuration: 150,
              contentStyle: { backgroundColor: "#000000" },
            }} 
          />
          <Stack.Screen 
            name="notifications/index" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="cast/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="category/[type]" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="seeall/[section]" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="genre/[name]" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="reviews/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="mylist/index" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="friends/index" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="chat/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="series/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="live/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="voicecall/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "fullScreenModal",
              animation: "fade",
              animationDuration: 200,
              contentStyle: { backgroundColor: "#020617" },
            }} 
          />
          <Stack.Screen 
            name="videocall/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "fullScreenModal",
              animation: "fade",
              animationDuration: 200,
              contentStyle: { backgroundColor: "#000000" },
            }} 
          />
          <Stack.Screen 
            name="settings/language" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="settings/subscription" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="settings/privacy" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="settings/help" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="settings/about" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="songs/index" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="songs/player/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "fullScreenModal",
              animation: "slide_from_bottom",
              animationDuration: 300,
              contentStyle: { backgroundColor: "#020617" },
            }} 
          />
        </Stack>
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RootLayoutContent />
      </AppProvider>
    </ThemeProvider>
  );
}
