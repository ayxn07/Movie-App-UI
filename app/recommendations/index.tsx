import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors, ALL_MOVIES, MOVIES, TRENDING } from "@/constants/data";
import { MOOD_CATEGORIES, PLAYLISTS, SONGS, getSongById } from "@/constants/musicData";
import { useApp, useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Mood Card Component
const MoodCard = ({
  mood,
  index,
  isSelected,
  onSelect,
}: {
  mood: typeof MOOD_CATEGORIES[0];
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onSelect();
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).springify()}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{ marginRight: 12 }}
      >
        <LinearGradient
          colors={mood.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 20,
            padding: 16,
            justifyContent: "space-between",
            borderWidth: isSelected ? 3 : 0,
            borderColor: "white",
          }}
        >
          <Text style={{ fontSize: 36 }}>{mood.emoji}</Text>
          <Text style={{ color: "white", fontSize: 14, fontWeight: "700" }}>
            {mood.name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Recommended Movie Card
const RecommendedMovieCard = ({
  movie,
  index,
  onPress,
}: {
  movie: typeof ALL_MOVIES[0];
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{
          flexDirection: "row",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <Image
          source={{ uri: movie.image }}
          style={{ width: 100, height: 140 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, padding: 14 }}>
          <View
            style={{
              backgroundColor: `${Colors.primary}20`,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
              alignSelf: "flex-start",
              marginBottom: 8,
            }}
          >
            <Text style={{ color: Colors.primary, fontSize: 10, fontWeight: "700" }}>
              AI PICK
            </Text>
          </View>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700" }} numberOfLines={2}>
            {movie.title}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
            {movie.genre} • {movie.year} • {movie.duration}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
            <Ionicons name="star" size={14} color={Colors.star} />
            <Text style={{ color: Colors.star, fontSize: 13, fontWeight: "600", marginLeft: 4 }}>
              {movie.rating}
            </Text>
          </View>
          <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 6 }} numberOfLines={2}>
            {movie.description}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Recommended Song Card
const RecommendedSongCard = ({
  songId,
  index,
  onPress,
}: {
  songId: string;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const song = getSongById(songId);

  if (!song) return null;

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{ marginRight: 16, width: 160 }}
      >
        <Image
          source={{ uri: song.cover }}
          style={{ width: 160, height: 160, borderRadius: 16 }}
          contentFit="cover"
        />
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: `${Colors.secondary}dd`,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>
            AI PICK
          </Text>
        </View>
        <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600", marginTop: 10 }} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
          {song.artist}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// AI Insight Card
const AIInsightCard = ({
  title,
  description,
  icon,
  color,
  delay,
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  delay: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={{
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: color,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: `${color}20`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={icon as any} size={22} color={color} />
        </View>
        <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700", marginLeft: 12 }}>
          {title}
        </Text>
      </View>
      <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20 }}>
        {description}
      </Text>
    </Animated.View>
  );
};

export default function RecommendationsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const selectedMoodData = MOOD_CATEGORIES.find((m) => m.id === selectedMood);

  // Get recommendations based on selected mood
  const recommendedMovies = selectedMoodData
    ? ALL_MOVIES.filter((m) => selectedMoodData.suggestedMovies.includes(m.id)).slice(0, 5)
    : [...MOVIES, ...TRENDING].slice(0, 5);

  const recommendedPlaylists = selectedMoodData
    ? PLAYLISTS.filter((p) => selectedMoodData.suggestedPlaylists.includes(p.id))
    : PLAYLISTS.slice(0, 3);

  const recommendedSongs = selectedMoodData
    ? recommendedPlaylists.flatMap((p) => p.songs).slice(0, 5)
    : SONGS.slice(0, 5).map((s) => s.id);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.springify()}
          style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="sparkles" size={24} color={Colors.primary} />
                <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900", marginLeft: 8 }}>
                  AI Recommendations
                </Text>
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>
                Personalized picks just for you
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Mood Selection */}
        <Animated.View entering={FadeIn.delay(100)} style={{ marginBottom: 24 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>
              How are you feeling?
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>
              Select your mood for personalized recommendations
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {MOOD_CATEGORIES.map((mood, index) => (
              <MoodCard
                key={mood.id}
                mood={mood}
                index={index}
                isSelected={selectedMood === mood.id}
                onSelect={() => {
                  setSelectedMood(selectedMood === mood.id ? null : mood.id);
                  if (selectedMood !== mood.id) {
                    showToast(`${mood.name} mood selected`, "success");
                  }
                }}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Selected Mood Description */}
        {selectedMoodData && (
          <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <LinearGradient
              colors={selectedMoodData.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Text style={{ fontSize: 28, marginRight: 10 }}>{selectedMoodData.emoji}</Text>
                <Text style={{ color: "white", fontSize: 22, fontWeight: "800" }}>
                  {selectedMoodData.name} Vibes
                </Text>
              </View>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 20 }}>
                {selectedMoodData.description}
              </Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* AI Insights */}
        <Animated.View entering={FadeIn.delay(200)} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
            AI Insights
          </Text>
          <AIInsightCard
            title="Your Top Genre"
            description="Based on your viewing history, you love Action and Sci-Fi movies. We've curated recommendations that match your taste!"
            icon="analytics"
            color={Colors.primary}
            delay={250}
          />
          <AIInsightCard
            title="Music Pattern"
            description="You tend to listen to upbeat music in the mornings and relaxing tunes at night. Your personalized playlists reflect this pattern."
            icon="musical-notes"
            color={Colors.secondary}
            delay={300}
          />
        </Animated.View>

        {/* Recommended Movies */}
        <Animated.View entering={FadeIn.delay(350)} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>
              Movies For You
            </Text>
            <TouchableOpacity onPress={() => router.push("/category/movies")}>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          {recommendedMovies.map((movie, index) => (
            <RecommendedMovieCard
              key={movie.id}
              movie={movie}
              index={index}
              onPress={() => router.push(`/movie/${movie.id}`)}
            />
          ))}
        </Animated.View>

        {/* Recommended Songs */}
        <Animated.View entering={FadeIn.delay(400)} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 16 }}>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>
              Songs For You
            </Text>
            <TouchableOpacity onPress={() => router.push("/songs")}>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {recommendedSongs.map((songId, index) => (
              <RecommendedSongCard
                key={songId}
                songId={songId}
                index={index}
                onPress={() => router.push(`/musicplayer/${songId}`)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Smart Shuffle */}
        <Animated.View entering={FadeInDown.delay(450).springify()} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              showToast("Smart AI Shuffle activated!", "success");
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
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="shuffle" size={32} color="white" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <Ionicons name="sparkles" size={16} color="white" />
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "700", marginLeft: 6 }}>
                    POWERED BY AI
                  </Text>
                </View>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "800" }}>
                  Smart Shuffle
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>
                  Let AI create the perfect mix based on your mood
                </Text>
              </View>
              <Ionicons name="play-circle" size={48} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
