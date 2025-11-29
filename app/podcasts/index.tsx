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
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { PODCASTS, Podcast, PodcastEpisode } from "@/constants/musicData";
import { useApp, useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Podcast Card Component
const PodcastCard = ({
  podcast,
  index,
  onPress,
}: {
  podcast: Podcast;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();

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
          source={{ uri: podcast.cover }}
          style={{ width: 160, height: 160, borderRadius: 16 }}
          contentFit="cover"
        />
        <Text style={{ color: theme.text, fontSize: 14, fontWeight: "700", marginTop: 10 }} numberOfLines={1}>
          {podcast.title}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
          {podcast.host}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Ionicons name="star" size={12} color={Colors.star} />
          <Text style={{ color: Colors.star, fontSize: 11, marginLeft: 4 }}>{podcast.rating}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Episode Row Component
const EpisodeRow = ({
  episode,
  podcast,
  index,
  onPlay,
}: {
  episode: PodcastEpisode;
  podcast: Podcast;
  index: number;
  onPlay: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const { showToast } = useApp();

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPlay();
        }}
        style={{
          flexDirection: "row",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 16,
          padding: 14,
          marginBottom: 12,
        }}
      >
        <Image
          source={{ uri: podcast.cover }}
          style={{ width: 70, height: 70, borderRadius: 12 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 11 }}>
              {podcast.title}
            </Text>
          </View>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "700" }} numberOfLines={2}>
            {episode.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
            <Text style={{ color: theme.textMuted, fontSize: 11 }}>
              {episode.date} • {episode.duration}
            </Text>
            {episode.isPlayed && episode.progress !== undefined && episode.progress < 100 && (
              <View
                style={{
                  height: 3,
                  width: 50,
                  backgroundColor: theme.border,
                  borderRadius: 2,
                  marginLeft: 10,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${episode.progress}%`,
                    backgroundColor: theme.primary,
                  }}
                />
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPlay();
          }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.primary,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Ionicons name="play" size={20} color="white" style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Category Pill
const CategoryPill = ({
  name,
  isActive,
  onPress,
}: {
  name: string;
  isActive: boolean;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={{
        backgroundColor: isActive ? theme.primary : isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
      }}
    >
      <Text
        style={{
          color: isActive ? "white" : theme.text,
          fontWeight: "600",
          fontSize: 13,
        }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default function PodcastsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Movies & TV", "Music", "Comedy", "News", "True Crime"];

  const filteredPodcasts = selectedCategory === "All"
    ? PODCASTS
    : PODCASTS.filter((p) => p.category === selectedCategory);

  // Get all episodes for "Your Episodes"
  const allEpisodes = PODCASTS.flatMap((podcast) =>
    podcast.episodes.map((episode) => ({ ...episode, podcast }))
  ).slice(0, 5);

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
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Podcasts</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                Listen to your favorites
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="search" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeIn.delay(100)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          >
            {categories.map((category) => (
              <CategoryPill
                key={category}
                name={category}
                isActive={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Podcast */}
        {filteredPodcasts.length > 0 && (
          <Animated.View entering={FadeInDown.delay(150).springify()} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/podcasts/${filteredPodcasts[0].id}`);
              }}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[Colors.accent, "#f59e0b", "#d97706"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 24, overflow: "hidden" }}
              >
                <View style={{ flexDirection: "row", padding: 20 }}>
                  <Image
                    source={{ uri: filteredPodcasts[0].cover }}
                    style={{ width: 120, height: 120, borderRadius: 16 }}
                    contentFit="cover"
                  />
                  <View style={{ flex: 1, marginLeft: 16, justifyContent: "center" }}>
                    <View
                      style={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 20,
                        alignSelf: "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>
                        FEATURED
                      </Text>
                    </View>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "800" }} numberOfLines={2}>
                      {filteredPodcasts[0].title}
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>
                      {filteredPodcasts[0].host}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                      <Ionicons name="people" size={14} color="rgba(255,255,255,0.8)" />
                      <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginLeft: 6 }}>
                        {filteredPodcasts[0].followers} followers
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Shows You Might Like */}
        <Animated.View entering={FadeIn.delay(200)} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 16 }}>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>
              Shows For You
            </Text>
            <TouchableOpacity>
              <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {filteredPodcasts.map((podcast, index) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                index={index}
                onPress={() => router.push(`/podcasts/${podcast.id}`)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Your Episodes */}
        <Animated.View entering={FadeIn.delay(250)} style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
            Latest Episodes
          </Text>
          {allEpisodes.map((item, index) => (
            <EpisodeRow
              key={`${item.podcast.id}-${item.id}`}
              episode={item}
              podcast={item.podcast}
              index={index}
              onPlay={() => {
                showToast(`Playing: ${item.title}`, "info");
              }}
            />
          ))}
        </Animated.View>

        {/* Categories Grid */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
            Browse Categories
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {[
              { name: "Movies & TV", color: Colors.primary, icon: "film" },
              { name: "Music", color: Colors.secondary, icon: "musical-notes" },
              { name: "Comedy", color: Colors.accent, icon: "happy" },
              { name: "True Crime", color: Colors.danger, icon: "alert-circle" },
              { name: "News", color: Colors.info, icon: "newspaper" },
              { name: "Sports", color: Colors.success, icon: "football" },
            ].map((category, index) => (
              <TouchableOpacity
                key={category.name}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(category.name);
                }}
                style={{
                  width: (width - 52) / 2,
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: `${category.color}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={category.icon as any} size={20} color={category.color} />
                </View>
                <Text style={{ color: theme.text, fontSize: 13, fontWeight: "600", marginLeft: 12 }}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
