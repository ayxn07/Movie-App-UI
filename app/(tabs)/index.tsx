import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo, useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
    Extrapolation,
    FadeIn,
    FadeInDown,
    FadeInUp,
    FadeOut,
    interpolate,
    Layout,
    SlideInDown,
    SlideOutDown,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import {
    FeaturedCard,
    GenreButton,
    MovieCard,
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
import { Movie } from "@/types";

// Search Result Item Component
const SearchResultItem = ({
  movie,
  index,
  onPress,
}: {
  movie: Movie;
  index: number;
  onPress: () => void;
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      layout={Layout.springify()}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <Image
          source={{ uri: movie.image }}
          style={{ width: 60, height: 80, borderRadius: 12 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }} numberOfLines={1}>
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
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>{movie.year}</Text>
          </View>
          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
            {movie.duration}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Search Modal Component
const SearchModal = ({
  visible,
  onClose,
  onSelectMovie,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectMovie: (movieId: number) => void;
}) => {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredMovies = useMemo(() => {
    return ALL_MOVIES.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

  const handleSelectMovie = useCallback((movieId: number) => {
    onSelectMovie(movieId);
    setSearchQuery("");
    setSelectedGenre(null);
  }, [onSelectMovie]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={onClose}
      >
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Animated.View
            entering={SlideInDown.springify().damping(15)}
            exiting={SlideOutDown.duration(200)}
            style={{
              flex: 1,
              marginTop: 100,
              backgroundColor: theme.background,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              overflow: "hidden",
            }}
          >
            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
              {/* Handle Bar */}
              <View style={{ alignItems: "center", paddingVertical: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.border,
                  }}
                />
              </View>

              {/* Search Header */}
              <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: isDark ? 0 : 1,
                    borderColor: theme.border,
                  }}
                >
                  <Ionicons name="search" size={20} color={theme.textSecondary} />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search movies, series..."
                    placeholderTextColor={theme.textMuted}
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      color: theme.text,
                    }}
                    autoFocus
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Genre Filters */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ maxHeight: 50, paddingLeft: 20 }}
                contentContainerStyle={{ paddingRight: 20, alignItems: "center" }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedGenre(null)}
                  style={{ marginRight: 8 }}
                >
                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 16,
                      backgroundColor: selectedGenre === null ? theme.primary : theme.card,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 13,
                        color: selectedGenre === null ? "#ffffff" : theme.textSecondary,
                      }}
                    >
                      All
                    </Text>
                  </View>
                </TouchableOpacity>
                {GENRES.map((genre) => (
                  <TouchableOpacity
                    key={genre.name}
                    onPress={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
                    style={{ marginRight: 8 }}
                  >
                    <View
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 16,
                        backgroundColor: selectedGenre === genre.name ? theme.primary : theme.card,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "600",
                          fontSize: 13,
                          color: selectedGenre === genre.name ? "#ffffff" : theme.textSecondary,
                        }}
                      >
                        {genre.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Results Count */}
              <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                  {filteredMovies.length} results found
                </Text>
              </View>

              {/* Search Results */}
              <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              >
                {filteredMovies.length > 0 ? (
                  filteredMovies.map((movie, index) => (
                    <SearchResultItem
                      key={movie.id}
                      movie={movie}
                      index={index}
                      onPress={() => handleSelectMovie(movie.id)}
                    />
                  ))
                ) : (
                  <Animated.View
                    entering={FadeIn}
                    style={{ alignItems: "center", paddingVertical: 60 }}
                  >
                    <Ionicons name="search-outline" size={48} color={theme.textMuted} />
                    <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16 }}>
                      No results found
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 14, marginTop: 8 }}>
                      Try a different search term
                    </Text>
                  </Animated.View>
                )}
              </ScrollView>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [showSearchModal, setShowSearchModal] = useState(false);

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

  // Quick Actions Data with navigation routes
  const quickActions = [
    { icon: "film-outline", label: "Movies", color: theme.primary, route: "/category/movies" },
    { icon: "tv-outline", label: "Series", color: theme.secondary, route: "/category/series" },
    { icon: "videocam-outline", label: "Live", color: theme.accent, route: "/category/live" },
    { icon: "download-outline", label: "Downloads", color: theme.success, route: "/category/downloads" },
  ];

  const handleQuickAction = useCallback((route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  }, [router]);

  const handleSearchPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSearchModal(true);
  }, []);

  const handleSelectMovie = useCallback((movieId: number) => {
    setShowSearchModal(false);
    router.push(`/movie/${movieId}`);
  }, [router]);

  const handleGenrePress = useCallback((genreName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/category/movies",
      params: { genre: genreName },
    } as any);
  }, [router]);

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

          {/* Search Bar - Now Functional */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <TouchableOpacity 
              onPress={handleSearchPress}
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

        {/* Quick Actions - Now Navigates to Category Screens */}
        <Animated.View
          entering={FadeInDown.delay(150).springify()}
          style={{ flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 20, marginBottom: 32 }}
        >
          {quickActions.map((item, index) => (
            <Animated.View key={item.label} entering={FadeInUp.delay(200 + index * 50)}>
              <TouchableOpacity 
                onPress={() => handleQuickAction(item.route)}
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
          <SectionHeader 
            title="Popular This Week" 
            icon="trending-up" 
            delay={300} 
            onSeeAllPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/category/movies" as any);
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
              router.push("/category/movies" as any);
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
              router.push("/category/series" as any);
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

        {/* Categories - Now Functional */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Ionicons name="grid" size={22} color={theme.primary} />
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "900" }}>Browse by Genre</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {GENRES.map((genre, index) => (
              <GenreButton 
                key={genre.name} 
                genre={genre} 
                index={index} 
                onPress={() => handleGenrePress(genre.name)}
              />
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
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/movie/1");
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

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectMovie={handleSelectMovie}
      />
    </View>
  );
}
