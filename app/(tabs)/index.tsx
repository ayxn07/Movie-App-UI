import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    Extrapolation,
    FadeInDown,
    FadeInUp,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

import {
    FeaturedCard,
    GenreButton,
    MovieCard,
    SectionHeader,
    TopRatedCard,
} from "@/components";
import {
    FEATURED_MOVIE,
    GENRES,
    MOVIES,
    TOP_RATED,
    TRENDING,
} from "@/constants/data";
import { useTheme } from "@/context";

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 100], [1, 0.9], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, 100], [0, -10], Extrapolation.CLAMP),
      },
    ],
  }));

  // Quick Actions Data
  const quickActions = [
    { icon: "film-outline", label: "Movies", color: theme.primary },
    { icon: "tv-outline", label: "Series", color: theme.secondary },
    { icon: "videocam-outline", label: "Live", color: theme.accent },
    { icon: "download-outline", label: "Downloads", color: theme.success },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <Animated.View style={[headerStyle, { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }]}>
          <Animated.View
            entering={FadeInDown.delay(50).springify()}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 14, fontWeight: "500" }}>Welcome back 👋</Text>
              <Text style={{ color: theme.text, fontSize: 30, fontWeight: "900", marginTop: 4 }}>MoviesHub</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <TouchableOpacity 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/notifications");
                }}
                style={{ 
                  width: 44, height: 44, borderRadius: 22, 
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                  alignItems: "center", justifyContent: "center" 
                }}
              >
                <Ionicons name="notifications-outline" size={22} color={theme.text} />
                <View style={{ position: "absolute", top: 8, right: 8, width: 10, height: 10, backgroundColor: theme.danger, borderRadius: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={{ width: 44, height: 44, borderRadius: 22, overflow: "hidden", borderWidth: 2, borderColor: theme.primary }}
              >
                <Image
                  source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
                  style={{ width: "100%", height: "100%" }}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Search Bar */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <TouchableOpacity 
              style={{ 
                marginTop: 20, flexDirection: "row", alignItems: "center",
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.9)",
                borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16,
                borderWidth: isDark ? 0 : 1, borderColor: theme.border,
              }}
            >
              <Ionicons name="search" size={20} color={theme.textSecondary} />
              <Text style={{ color: theme.textMuted, marginLeft: 12, flex: 1 }}>Search movies, series...</Text>
              <View style={{ backgroundColor: theme.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                <Ionicons name="options" size={16} color="white" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(150).springify()}
          style={{ flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 20, marginBottom: 32 }}
        >
          {quickActions.map((item, index) => (
            <Animated.View key={item.label} entering={FadeInUp.delay(200 + index * 50)}>
              <TouchableOpacity 
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={{ alignItems: "center" }}
              >
                <View
                  style={{ 
                    width: 64, height: 64, borderRadius: 16, 
                    alignItems: "center", justifyContent: "center", marginBottom: 8,
                    backgroundColor: `${item.color}20`,
                  }}
                >
                  <Ionicons name={item.icon as any} size={28} color={item.color} />
                </View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "500" }}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Featured Movie */}
        <FeaturedCard movie={FEATURED_MOVIE} />

        {/* Popular This Week */}
        <View style={{ marginBottom: 32 }}>
          <SectionHeader title="Popular This Week" icon="trending-up" delay={300} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingLeft: 20 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {MOVIES.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </ScrollView>
        </View>

        {/* Top 10 */}
        <View style={{ marginBottom: 32 }}>
          <SectionHeader title="Top 10 This Week" icon="trophy" delay={350} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingLeft: 20 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {TOP_RATED.map((movie, index) => (
              <TopRatedCard key={movie.id} movie={movie} index={index} />
            ))}
          </ScrollView>
        </View>

        {/* Trending Now */}
        <View style={{ marginBottom: 32 }}>
          <SectionHeader title="Trending Now" icon="flame" delay={400} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingLeft: 20 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {TRENDING.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Ionicons name="grid" size={22} color={theme.primary} />
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "900" }}>Browse by Genre</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {GENRES.map((genre, index) => (
              <GenreButton key={genre.name} genre={genre} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* Continue Watching */}
        <Animated.View entering={FadeInDown.delay(550).springify()} style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Ionicons name="play-circle" size={22} color={theme.primary} />
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "900" }}>Continue Watching</Text>
          </View>
          <TouchableOpacity 
            style={{ 
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 24, overflow: "hidden",
              borderWidth: isDark ? 0 : 1, borderColor: theme.border,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
              <View style={{ width: 112, height: 64, borderRadius: 12, overflow: "hidden" }}>
                <Image
                  source={{ uri: "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg" }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" }}>
                  <Ionicons name="play-circle" size={32} color="white" />
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>Dune: Part Two</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>1h 20m remaining</Text>
                <View style={{ height: 6, backgroundColor: isDark ? "#334155" : "#e2e8f0", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: "60%", backgroundColor: theme.primary, borderRadius: 3 }} />
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.textMuted} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}
