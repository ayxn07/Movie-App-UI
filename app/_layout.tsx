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

// Suppress deprecation warnings emitted by libraries that are still being migrated
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
  "Please use 'react-native-safe-area-context' instead",
  "[expo-av]: Expo AV has been deprecated",
  "Due to changes in Androids permission requirements",
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
              animation: "slide_from_bottom",
              animationDuration: 200,
              contentStyle: { backgroundColor: "#0f172a" },
            }} 
          />
          <Stack.Screen 
            name="videocall/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "fullScreenModal",
              animation: "slide_from_bottom",
              animationDuration: 200,
              contentStyle: { backgroundColor: "#000000" },
            }} 
          />
          <Stack.Screen 
            name="profile/language" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="profile/subscription" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="profile/privacy" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="profile/help" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="profile/about" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="download/[id]" 
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
            name="addfriend/index" 
            options={{ 
              headerShown: false, 
              presentation: "card",
              animation: "slide_from_right",
              animationDuration: 200,
              contentStyle: { backgroundColor: theme.background },
            }} 
          />
          <Stack.Screen 
            name="musicplayer/[id]" 
            options={{ 
              headerShown: false, 
              presentation: "fullScreenModal",
              animation: "slide_from_bottom",
              animationDuration: 250,
              contentStyle: { backgroundColor: "#0a0a0a" },
            }} 
          />
          <Stack.Screen 
            name="localmedia/index" 
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
      <AppProvider>
        <RootLayoutContent />
      </AppProvider>
    </ThemeProvider>
  );
}
