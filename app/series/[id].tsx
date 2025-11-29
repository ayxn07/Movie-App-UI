import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors, SERIES } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";

const { height } = Dimensions.get("window");

// Episode type
interface Episode {
  id: number;
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  isWatched: boolean;
}

// Generate episodes for a season
const generateEpisodes = (seriesId: number, season: number): Episode[] => {
  const episodeTitles = [
    "Pilot",
    "The Beginning",
    "Rising Action",
    "Turning Point",
    "The Revelation",
    "Breaking Point",
    "The Chase",
    "Consequences",
    "The Plan",
    "Finale",
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: seriesId * 100 + season * 10 + i,
    number: i + 1,
    title: episodeTitles[i] || `Episode ${i + 1}`,
    duration: `${45 + Math.floor(Math.random() * 20)}m`,
    thumbnail: `https://picsum.photos/seed/${seriesId}${season}${i}/400/225`,
    description: `An intense episode that pushes the narrative forward with unexpected twists and character development.`,
    isWatched: i < 3 && season === 1,
  }));
};

// Episode Card Component
const EpisodeCard = ({
  episode,
  index,
  theme,
  isDark,
  onPlay,
}: {
  episode: Episode;
  index: number;
  theme: ThemeColors;
  isDark: boolean;
  onPlay: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={SlideInRight.delay(index * 80).springify()}
      style={{ marginBottom: 16 }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPlay();
        }}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
      >
        <Animated.View style={animatedStyle}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            {/* Thumbnail */}
            <View style={{ width: 140, height: 90, position: "relative" }}>
              <Image
                source={{ uri: episode.thumbnail }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "rgba(139, 92, 246, 0.9)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play" size={16} color="white" style={{ marginLeft: 2 }} />
                </View>
              </View>
              {episode.isWatched && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: Colors.primary,
                  }}
                />
              )}
            </View>

            {/* Info */}
            <View style={{ flex: 1, padding: 12, justifyContent: "space-between" }}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    E{episode.number}
                  </Text>
                  {episode.isWatched && (
                    <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                  )}
                </View>
                <Text
                  style={{ color: theme.text, fontWeight: "700", fontSize: 14, marginTop: 4 }}
                  numberOfLines={1}
                >
                  {episode.title}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="time-outline" size={14} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{episode.duration}</Text>
              </View>
            </View>

            {/* Download Button */}
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                width: 44,
                alignItems: "center",
                justifyContent: "center",
                borderLeftWidth: 1,
                borderLeftColor: theme.border,
              }}
            >
              <Ionicons name="download-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Season Tab Component
const SeasonTab = ({
  season,
  isActive,
  onPress,
  theme,
}: {
  season: number;
  isActive: boolean;
  onPress: () => void;
  theme: ThemeColors;
}) => (
  <TouchableOpacity
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }}
    style={{ marginRight: 12 }}
  >
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: isActive ? theme.primary : theme.card,
      }}
    >
      <Text
        style={{
          color: isActive ? "white" : theme.textSecondary,
          fontWeight: "700",
          fontSize: 14,
        }}
      >
        Season {season}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function SeriesDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const seriesId = Number(params.id) || 201;

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [liked, setLiked] = useState(false);

  // Find the series
  const series = SERIES.find((s) => s.id === seriesId) || SERIES[0];
  const episodes = generateEpisodes(seriesId, selectedSeason);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Image Section */}
        <View style={{ height: height * 0.45, position: "relative" }}>
          <Image
            source={{ uri: series.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)", theme.background]}
            locations={[0, 0.5, 1]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Header Buttons */}
          <View
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setLiked(!liked);
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={24}
                  color={liked ? Colors.danger : "white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="share-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Series Info Section */}
        <View style={{ paddingHorizontal: 20, marginTop: -40 }}>
          {/* Title and Rating */}
          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <Text style={{ fontSize: 32, fontWeight: "900", color: theme.text, marginBottom: 12 }}>
              {series.title}
            </Text>

            {/* Badges Row */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(251, 191, 36, 0.2)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Ionicons name="star" size={16} color={Colors.star} />
                <Text style={{ color: Colors.star, fontWeight: "700", marginLeft: 6 }}>
                  {series.rating}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: theme.text, fontWeight: "600" }}>{series.year}</Text>
              </View>
              <View
                style={{
                  backgroundColor: Colors.secondary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>
                  {series.seasons} Seasons
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: theme.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>{series.genre}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View
            entering={FadeInUp.delay(150).springify()}
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 24,
              paddingVertical: 16,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.9)",
              borderRadius: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="add" size={24} color={theme.primary} />
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "500" }}>
                My List
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: isDark ? "rgba(236, 72, 153, 0.2)" : "rgba(236, 72, 153, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="download-outline" size={24} color={theme.secondary} />
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "500" }}>
                Download
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="share-social-outline" size={24} color={theme.success} />
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "500" }}>
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(`/reviews/${seriesId}`)}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: isDark ? "rgba(245, 158, 11, 0.2)" : "rgba(245, 158, 11, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="chatbubble-outline" size={24} color={theme.accent} />
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "500" }}>
                Reviews
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 12 }}>
              About
            </Text>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 15,
                lineHeight: 24,
                marginBottom: 24,
              }}
            >
              {series.description}
            </Text>
          </Animated.View>

          {/* Season Tabs */}
          <Animated.View entering={FadeInUp.delay(250).springify()} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 16 }}>
              Episodes
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {Array.from({ length: series.seasons }, (_, i) => i + 1).map((season) => (
                <SeasonTab
                  key={season}
                  season={season}
                  isActive={selectedSeason === season}
                  onPress={() => setSelectedSeason(season)}
                  theme={theme}
                />
              ))}
            </ScrollView>
          </Animated.View>

          {/* Episodes List */}
          <Animated.View entering={FadeIn.delay(300)}>
            {episodes.map((episode, index) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                index={index}
                theme={theme}
                isDark={isDark}
                onPlay={() => router.push(`/player/${seriesId}`)}
              />
            ))}
          </Animated.View>

          {/* Series Info */}
          <Animated.View
            entering={FadeInUp.delay(350).springify()}
            style={{ marginTop: 16 }}
          >
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 16 }}>
              Series Info
            </Text>
            <View
              style={{
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                borderRadius: 20,
                padding: 20,
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <View style={{ flexDirection: "row", marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>
                    Total Episodes
                  </Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>
                    {series.episodes}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>
                    Seasons
                  </Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>
                    {series.seasons}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>
                    First Aired
                  </Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>
                    {series.year}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>
                    Genre
                  </Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>
                    {series.genre}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View
        entering={FadeInUp.delay(400)}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingVertical: 16,
          paddingBottom: 32,
          backgroundColor: isDark ? "rgba(2, 6, 23, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            router.push(`/player/${seriesId}`);
          }}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 16,
              borderRadius: 16,
            }}
          >
            <Ionicons name="play" size={24} color="white" />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>
              Play S{selectedSeason} E1
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
