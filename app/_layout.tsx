import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

import { MyListProvider, ThemeProvider, useTheme } from "@/context";
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
        </Stack>
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MyListProvider>
        <RootLayoutContent />
        <Toast />
      </MyListProvider>
    </ThemeProvider>
  );
}
