import React, { createContext, useContext, useEffect, useState } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// ============================================================================
// THEME COLORS - Light and Dark Mode
// ============================================================================

export const LightTheme = {
  // Backgrounds
  background: "#f8fafc",
  backgroundSecondary: "#f1f5f9",
  backgroundTertiary: "#e2e8f0",
  card: "#ffffff",
  cardHover: "#f1f5f9",

  // Text
  text: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#94a3b8",

  // Accents
  primary: "#8b5cf6",
  primaryDark: "#7c3aed",
  secondary: "#ec4899",
  accent: "#f59e0b",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",

  // UI Elements
  border: "#e2e8f0",
  star: "#fbbf24",
  overlay: "rgba(0, 0, 0, 0.5)",
  cardOverlay: "rgba(255, 255, 255, 0.9)",

  // Gradients
  headerGradient: ["#f8fafc", "#f1f5f9", "#e2e8f0"] as const,
  cardGradient: ["transparent", "rgba(255,255,255,0.95)"] as const,
  featuredGradient: ["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.85)"] as const,

  // Tab Bar
  tabBar: "rgba(255, 255, 255, 0.95)",
  tabBarBorder: "#e2e8f0",
};

export const DarkTheme = {
  // Backgrounds
  background: "#020617",
  backgroundSecondary: "#0f172a",
  backgroundTertiary: "#1e293b",
  card: "#1e293b",
  cardHover: "#334155",

  // Text
  text: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",

  // Accents
  primary: "#8b5cf6",
  primaryDark: "#6366f1",
  secondary: "#ec4899",
  accent: "#f59e0b",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",

  // UI Elements
  border: "#334155",
  star: "#fbbf24",
  overlay: "rgba(0, 0, 0, 0.7)",
  cardOverlay: "rgba(0, 0, 0, 0.6)",

  // Gradients
  headerGradient: ["#1e1b4b", "#0f172a", "#020617"] as const,
  cardGradient: ["transparent", "rgba(0,0,0,0.8)"] as const,
  featuredGradient: ["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.95)"] as const,

  // Tab Bar
  tabBar: "rgba(15, 23, 42, 0.95)",
  tabBarBorder: "rgba(51, 65, 85, 0.5)",
};

export type ThemeColors = {
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  card: string;
  cardHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  success: string;
  danger: string;
  warning: string;
  border: string;
  star: string;
  overlay: string;
  cardOverlay: string;
  headerGradient: readonly string[];
  cardGradient: readonly string[];
  featuredGradient: readonly string[];
  tabBar: string;
  tabBarBorder: string;
};
export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeColors;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("dark");

  const isDark = mode === "system" 
    ? systemColorScheme === "dark" 
    : mode === "dark";

  const theme = isDark ? DarkTheme : LightTheme;

  const toggleTheme = () => {
    setMode((prev) => {
      if (prev === "dark") return "light";
      if (prev === "light") return "dark";
      return systemColorScheme === "dark" ? "light" : "dark";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, isDark, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Animated Theme Toggle Component
export const ThemeToggle: React.FC<{
  size?: number;
  style?: any;
}> = ({ size = 60, style }) => {
  const { isDark, toggleTheme } = useTheme();
  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, { duration: 300 });
  }, [isDark]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#fbbf24", "#6366f1"]
    ),
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(isDark ? size - 32 : 4, { duration: 300 }) },
      { rotate: `${progress.value * 360}deg` },
    ],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleTheme}
      style={[{ width: size, height: 32, borderRadius: 16 }, style]}
      accessibilityRole="button"
      accessibilityLabel="Toggle dark mode"
    >
      <Animated.View
        style={[{
          flex: 1,
          borderRadius: 16,
          justifyContent: "center",
          padding: 2,
        }, containerStyle]}
      >
        <Animated.View
          style={[{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
          }, iconContainerStyle]}
        >
          {/* Sun/Moon icon */}
          <Animated.Text style={{ fontSize: 18 }}>
            {isDark ? "🌙" : "☀️"}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};
