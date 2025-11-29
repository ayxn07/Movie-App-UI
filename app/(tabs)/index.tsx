import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import {
  GenreButton,
  MovieCard,
  NowPlayingCarousel,
  SectionHeader,
  TopRatedCard,
} from "@/components";
import {
  ALL_MOVIES,
  Colors,
  FEATURED_MOVIE,
  GENRES,
  MOVIES,
  TOP_RATED,
  TRENDING,
} from "@/constants/data";
import { useTheme } from "@/context";
import { ContentType, Movie } from "@/types";

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Quick Actions Data with navigation
  const quickActions: { icon: string; label: string; color: string; type: ContentType }[] = [
    { icon: "film-outline", label: "Movies", color: theme.primary, type: "movies" },
    { icon: "tv-outline", label: "Series", color: theme.secondary, type: "series" },
    { icon: "videocam-outline", label: "Live", color: theme.accent, type: "live" },
    { icon: "download-outline", label: "Downloads", color: theme.success, type: "downloads" },
  ];

  // Filter movies based on search
  const filteredMovies = ALL_MOVIES.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle quick action navigation
  const handleQuickAction = (type: ContentType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/category/${type}`);
  };

  // Handle genre navigation
  const handleGenrePress = (genreName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/genre/${genreName}`);
  };

  // Search result card component
  const SearchResultCard = ({ movie }: { movie: Movie }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowSearchModal(false);
        setSearchQuery("");
        router.push(`/movie/${movie.id}`);
      }}
    >
      <Image
        source={{ uri: movie.image }}
        style={{ width: 50, height: 75, borderRadius: 8 }}
        contentFit="cover"
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15 }} numberOfLines={1}>
          {movie.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="star" size={12} color={Colors.star} />
            <Text style={{ color: Colors.star, fontSize: 12, fontWeight: "600", marginLeft: 4 }}>
              {movie.rating}
            </Text>
          </View>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.genre}</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.year}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
    </TouchableOpacity>
  );

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
                  router.push("/friends");
                }}
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                  alignItems: "center", justifyContent: "center"
                }}
              >
                <Ionicons name="people-outline" size={22} color={theme.text} />
              </TouchableOpacity>
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
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(tabs)/profile");
                }}
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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSearchModal(true);
              }}
              activeOpacity={0.9}
            >
              <View style={{
                marginTop: 20,
                borderRadius: 24,
                overflow: "hidden",
              }}>
                {/* Outer glow effect */}
                <View style={{
                  position: "absolute",
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: 26,
                  backgroundColor: isDark ? "rgba(139, 92, 246, 0.15)" : "transparent",
                }} />
                <LinearGradient
                  colors={isDark 
                    ? ["rgba(30, 41, 59, 0.95)", "rgba(15, 23, 42, 0.9)"]
                    : ["rgba(255, 255, 255, 0.98)", "rgba(248, 250, 252, 0.95)"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: "row", 
                    alignItems: "center",
                    borderRadius: 24, 
                    paddingHorizontal: 18, 
                    paddingVertical: 14,
                    borderWidth: 1.5, 
                    borderColor: isDark ? "rgba(139, 92, 246, 0.4)" : "rgba(139, 92, 246, 0.2)",
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: isDark ? 0.35 : 0.15,
                    shadowRadius: 16,
                    elevation: 8,
                  }}
                >
                  {/* Search Icon Container with Animated Gradient */}
                  <LinearGradient
                    colors={[`${Colors.primary}30`, `${Colors.secondary}20`]}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="search" size={22} color={theme.primary} />
                  </LinearGradient>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>Search movies, series...</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 3 }}>Discover your next favorite</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowSearchModal(true);
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: `${Colors.secondary}20`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="mic" size={18} color={Colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowSearchModal(true);
                      }}
                    >
                      <LinearGradient
                        colors={[Colors.primary, Colors.primaryDark]}
                        style={{ 
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="options" size={18} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
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
                onPress={() => handleQuickAction(item.type)}
                style={{ alignItems: "center" }}
              >
                <View
                  style={{
                    width: 64, height: 64, borderRadius: 16,
                    alignItems: "center", justifyContent: "center", marginBottom: 8,
                    backgroundColor: `${item.color}20`,
                  }}
                >
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={28} color={item.color} />
                </View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "500" }}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Now Playing Carousel */}
        <NowPlayingCarousel movies={[FEATURED_MOVIE, ...MOVIES.slice(0, 4)]} />

        {/* Popular This Week */}
        <View style={{ marginBottom: 32 }}>
          <SectionHeader
            title="Popular This Week"
            icon="trending-up"
            delay={300}
            onSeeAllPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/seeall/popular");
            }}
          />
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
          <SectionHeader
            title="Top 10 This Week"
            icon="trophy"
            delay={350}
            onSeeAllPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/seeall/top10");
            }}
          />
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
          <SectionHeader
            title="Trending Now"
            icon="flame"
            delay={400}
            onSeeAllPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/seeall/trending");
            }}
          />
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

        {/* Music Section */}
        <Animated.View entering={FadeInDown.delay(450).springify()} style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/songs");
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#ec4899", "#8b5cf6", "#6366f1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 24,
                padding: 24,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{
                width: 64, height: 64, borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                alignItems: "center", justifyContent: "center",
              }}>
                <Ionicons name="musical-notes" size={32} color="white" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "800", marginBottom: 4 }}>
                  Soundtracks & Music
                </Text>
                <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 14 }}>
                  Explore movie soundtracks, trending songs & more
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Ionicons name="grid" size={22} color={theme.primary} />
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "900" }}>Browse by Genre</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {GENRES.map((genre, index) => (
              <GenreButton key={genre.name} genre={genre} index={index} onPress={() => handleGenrePress(genre.name)} />
            ))}
          </View>
        </Animated.View>

        {/* Continue Watching */}
        <Animated.View entering={FadeInDown.delay(550).springify()} style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Ionicons name="play-circle" size={22} color={theme.primary} />
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "900" }}>Continue Watching</Text>
          </View>

          {/* First Continue Watching Item */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/movie/1");
            }}
            style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 24, overflow: "hidden",
              borderWidth: isDark ? 0 : 1, borderColor: theme.border,
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
              <View style={{ width: 112, height: 64, borderRadius: 12, overflow: "hidden" }}>
                <Image
                  source={{ uri: MOVIES[0].image }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" }}>
                  <Ionicons name="play-circle" size={32} color="white" />
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>{MOVIES[0].title}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>1h 20m remaining</Text>
                <View style={{ height: 6, backgroundColor: isDark ? "#334155" : "#e2e8f0", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: "60%", backgroundColor: theme.primary, borderRadius: 3 }} />
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.textMuted} />
            </View>
          </TouchableOpacity>

          {/* Second Continue Watching Item */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/movie/2");
            }}
            style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 24, overflow: "hidden",
              borderWidth: isDark ? 0 : 1, borderColor: theme.border,
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
              <View style={{ width: 112, height: 64, borderRadius: 12, overflow: "hidden" }}>
                <Image
                  source={{ uri: MOVIES[1].image }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" }}>
                  <Ionicons name="play-circle" size={32} color="white" />
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>{MOVIES[1].title}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>45m remaining</Text>
                <View style={{ height: 6, backgroundColor: isDark ? "#334155" : "#e2e8f0", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: "75%", backgroundColor: theme.primary, borderRadius: 3 }} />
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.textMuted} />
            </View>
          </TouchableOpacity>

          {/* Third Continue Watching Item */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/movie/6");
            }}
            style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 24, overflow: "hidden",
              borderWidth: isDark ? 0 : 1, borderColor: theme.border,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
              <View style={{ width: 112, height: 64, borderRadius: 12, overflow: "hidden" }}>
                <Image
                  source={{ uri: TRENDING[0].image }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" }}>
                  <Ionicons name="play-circle" size={32} color="white" />
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>{TRENDING[0].title}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>30m remaining</Text>
                <View style={{ height: 6, backgroundColor: isDark ? "#334155" : "#e2e8f0", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: "85%", backgroundColor: theme.primary, borderRadius: 3 }} />
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.textMuted} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="fade"
        transparent
        onRequestClose={() => {
          setShowSearchModal(false);
          setSearchQuery("");
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <Animated.View
            entering={FadeIn.duration(200)}
            style={{
              flex: 1,
              backgroundColor: theme.background,
              marginTop: 50,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            {/* Search Header */}
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: theme.border,
            }}>
              <View style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}>
                <Ionicons name="search" size={20} color={theme.textSecondary} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search movies, series..."
                  placeholderTextColor={theme.textMuted}
                  autoFocus
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    fontSize: 16,
                    color: theme.text,
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowSearchModal(false);
                  setSearchQuery("");
                }}
                style={{ marginLeft: 12 }}
              >
                <Text style={{ color: theme.primary, fontWeight: "600", fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Search Results */}
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              {searchQuery.length === 0 ? (
                <View style={{ padding: 20 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 16 }}>
                    Popular Searches
                  </Text>
                  {["Dune", "Batman", "Spider-Man", "Interstellar", "Oppenheimer"].map((term) => (
                    <TouchableOpacity
                      key={term}
                      onPress={() => setSearchQuery(term)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                      }}
                    >
                      <Ionicons name="trending-up" size={18} color={theme.textMuted} />
                      <Text style={{ color: theme.text, marginLeft: 12, fontSize: 15 }}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <SearchResultCard key={movie.id} movie={movie} />
                ))
              ) : (
                <View style={{ alignItems: "center", paddingVertical: 60 }}>
                  <Ionicons name="search-outline" size={48} color={theme.textMuted} />
                  <Text style={{ color: theme.text, fontSize: 18, fontWeight: "600", marginTop: 16 }}>
                    No results found
                  </Text>
                  <Text style={{ color: theme.textSecondary, marginTop: 8, textAlign: "center", paddingHorizontal: 40 }}>
                    Try searching for a different movie or series
                  </Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
