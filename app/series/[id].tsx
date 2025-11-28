import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors, SERIES } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const { height } = Dimensions.get("window");

// Episode type
interface Episode {
  id: number;
  number: number;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
}

// Sample episodes data
const SAMPLE_EPISODES: Episode[] = [
  { id: 1, number: 1, title: "Pilot", duration: "58m", description: "A high school chemistry teacher is diagnosed with terminal cancer.", thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400" },
  { id: 2, number: 2, title: "Cat's in the Bag...", duration: "48m", description: "Walt and Jesse clean up after the failed drug deal.", thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400" },
  { id: 3, number: 3, title: "...And the Bag's in the River", duration: "48m", description: "Walt must make a difficult decision.", thumbnail: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400" },
  { id: 4, number: 4, title: "Cancer Man", duration: "48m", description: "Walt tells his family about his cancer diagnosis.", thumbnail: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400" },
  { id: 5, number: 5, title: "Gray Matter", duration: "48m", description: "Walt's former business partner offers to help.", thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400" },
];

// Episode Card Component
const EpisodeCard = ({
  episode,
  index,
  isSelected,
  onPress,
}: {
  episode: Episode;
  index: number;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify()}
      style={{ marginBottom: 16 }}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            animatedStyle,
            {
              flexDirection: "row",
              backgroundColor: isSelected
                ? isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)"
                : isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: isSelected ? 2 : isDark ? 0 : 1,
              borderColor: isSelected ? theme.primary : theme.border,
            },
          ]}
        >
          {/* Thumbnail */}
          <View style={{ width: 130, height: 90, position: "relative" }}>
            <Image
              source={{ uri: episode.thumbnail }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
            <View style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: theme.primary,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Ionicons name="play" size={18} color="white" style={{ marginLeft: 2 }} />
              </View>
            </View>
            {/* Episode Number Badge */}
            <View style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              backgroundColor: "rgba(0,0,0,0.7)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}>
              <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>EP {episode.number}</Text>
            </View>
          </View>
          {/* Info */}
          <View style={{ flex: 1, padding: 12, justifyContent: "center" }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }} numberOfLines={1}>
              {episode.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }} numberOfLines={2}>
              {episode.description}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <Ionicons name="time-outline" size={12} color={theme.textMuted} />
              <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 4 }}>{episode.duration}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Season Selector Component
const SeasonSelector = ({
  seasons,
  selectedSeason,
  onSelect,
}: {
  seasons: number;
  selectedSeason: number;
  onSelect: (season: number) => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
    >
      {Array.from({ length: seasons }).map((_, index) => {
        const season = index + 1;
        const isSelected = selectedSeason === season;
        return (
          <TouchableOpacity
            key={season}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(season);
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: isSelected
                ? theme.primary
                : isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            }}
          >
            <Text style={{
              color: isSelected ? "white" : theme.textSecondary,
              fontWeight: "700",
              fontSize: 14,
            }}>
              Season {season}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default function SeriesDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const seriesId = Number(params.id);
  const { isInMyList, addToMyList, removeFromMyList, showToast } = useApp();

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);

  // Find the series from our data
  const series = SERIES.find((s) => s.id === seriesId);

  // Handle series not found
  if (!series) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Ionicons name="tv-outline" size={64} color={theme.textMuted} />
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700", marginTop: 16 }}>Series Not Found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 24, backgroundColor: theme.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast("Sharing options coming soon!", "info");
  };

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
          <View style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center", justifyContent: "center",
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
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={24}
                  color={liked ? Colors.danger : "white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  alignItems: "center", justifyContent: "center",
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
              <View style={{
                flexDirection: "row", alignItems: "center",
                backgroundColor: `${Colors.star}20`,
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
              }}>
                <Ionicons name="star" size={16} color={Colors.star} />
                <Text style={{ color: Colors.star, fontWeight: "700", marginLeft: 6 }}>{series.rating}</Text>
              </View>
              <View style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
              }}>
                <Text style={{ color: theme.text, fontWeight: "600" }}>{series.year}</Text>
              </View>
              <View style={{
                backgroundColor: theme.secondary,
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
              }}>
                <Text style={{ color: "white", fontWeight: "700" }}>{series.seasons} Seasons</Text>
              </View>
              <View style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
              }}>
                <Text style={{ color: "white", fontWeight: "700" }}>{series.genre}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInUp.delay(150).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 12 }}>
              About
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 15, lineHeight: 24, marginBottom: 24 }}>
              {series.description || "No description available."}
            </Text>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInUp.delay(200).springify()} style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.9}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 16,
                  borderRadius: 16,
                }}
              >
                <Ionicons name="play" size={22} color="white" />
                <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>Play S1 E1</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // Handle add to list
              }}
              style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                alignItems: "center", justifyContent: "center",
                borderWidth: isDark ? 0 : 1, borderColor: theme.border,
              }}
            >
              <Ionicons name="add" size={28} color={theme.text} />
            </TouchableOpacity>
          </Animated.View>

          {/* Season Selector */}
          <Animated.View entering={FadeInUp.delay(250).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 16, paddingHorizontal: 0 }}>
              Episodes
            </Text>
          </Animated.View>
        </View>

        {/* Season Tabs */}
        <Animated.View entering={FadeIn.delay(300)} style={{ marginBottom: 20 }}>
          <SeasonSelector
            seasons={series.seasons}
            selectedSeason={selectedSeason}
            onSelect={setSelectedSeason}
          />
        </Animated.View>

        {/* Episodes List */}
        <View style={{ paddingHorizontal: 20 }}>
          {SAMPLE_EPISODES.map((episode, index) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              index={index}
              isSelected={selectedEpisode === episode.id}
              onPress={() => setSelectedEpisode(episode.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
