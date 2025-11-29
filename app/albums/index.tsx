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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { ALBUMS, Album } from "@/constants/musicData";
import { useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Album Card Component
const AlbumCard = ({
  album,
  index,
  onPress,
}: {
  album: Album;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const cardWidth = (width - 52) / 2;

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{
          width: cardWidth,
          marginBottom: 16,
          marginRight: index % 2 === 0 ? 12 : 0,
        }}
      >
        <View
          style={{
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          }}
        >
          <Image
            source={{ uri: album.cover }}
            style={{ width: "100%", aspectRatio: 1 }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
            }}
          />
          <View style={{ padding: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }} numberOfLines={1}>
              {album.title}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
              {album.artist}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 }}>
              <View
                style={{
                  backgroundColor: `${album.colors[0]}40`,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: theme.textSecondary, fontSize: 10, fontWeight: "600" }}>
                  {album.year}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: `${theme.primary}20`,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: theme.primary, fontSize: 10, fontWeight: "600", textTransform: "uppercase" }}>
                  {album.type}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Featured Album Card
const FeaturedAlbumCard = ({
  album,
  onPress,
}: {
  album: Album;
  onPress: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(100).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        activeOpacity={0.9}
        style={{ marginHorizontal: 20, marginBottom: 24 }}
      >
        <LinearGradient
          colors={album.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          <View style={{ flexDirection: "row", padding: 20 }}>
            <Image
              source={{ uri: album.cover }}
              style={{
                width: 140,
                height: 140,
                borderRadius: 16,
              }}
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
              <Text style={{ color: "white", fontSize: 22, fontWeight: "900" }} numberOfLines={2}>
                {album.title}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 }}>
                {album.artist}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    onPress();
                  }}
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Ionicons name="play" size={16} color={album.colors[0]} />
                  <Text style={{ color: album.colors[0], fontWeight: "700", fontSize: 14 }}>
                    Play
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function AlbumsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filters = [
    { id: "all", name: "All" },
    { id: "album", name: "Albums" },
    { id: "ep", name: "EPs" },
    { id: "single", name: "Singles" },
  ];

  const filteredAlbums = ALBUMS.filter((album) => {
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || album.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const featuredAlbum = ALBUMS[0];

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
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Albums</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                {ALBUMS.length} albums available
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Ionicons name="search" size={20} color={theme.textSecondary} />
            <TextInput
              placeholder="Search albums..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                marginLeft: 12,
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
        </Animated.View>

        {/* Filters */}
        <Animated.View entering={FadeIn.delay(100)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 10 }}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedFilter(filter.id);
                }}
                style={{
                  backgroundColor: selectedFilter === filter.id
                    ? theme.primary
                    : isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: selectedFilter === filter.id ? "white" : theme.text,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Album */}
        <FeaturedAlbumCard
          album={featuredAlbum}
          onPress={() => router.push(`/albums/${featuredAlbum.id}`)}
        />

        {/* Albums Grid */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
            All Albums
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {filteredAlbums.map((album, index) => (
              <AlbumCard
                key={album.id}
                album={album}
                index={index}
                onPress={() => router.push(`/albums/${album.id}`)}
              />
            ))}
          </View>
        </View>

        {filteredAlbums.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="disc-outline" size={64} color={theme.textMuted} />
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "600", marginTop: 16 }}>
              No albums found
            </Text>
            <Text style={{ color: theme.textSecondary, marginTop: 8 }}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
