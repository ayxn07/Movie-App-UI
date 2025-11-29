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
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import {
  ARTISTS,
  ALBUMS,
  SONGS,
  getArtistById,
  getSongsByArtist,
  getAlbumsByArtist,
  getSongById,
} from "@/constants/musicData";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Popular Song Row
const PopularSongRow = ({
  songId,
  index,
  onPlay,
}: {
  songId: string;
  index: number;
  onPlay: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const song = getSongById(songId);

  if (!song) return null;

  return (
    <Animated.View entering={FadeInRight.delay(index * 60).springify()}>
      <TouchableOpacity
        onPress={onPlay}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : theme.card,
          borderRadius: 16,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: theme.textMuted, fontWeight: "700", fontSize: 14, width: 24 }}>
          {index + 1}
        </Text>
        <Image
          source={{ uri: song.cover }}
          style={{ width: 50, height: 50, borderRadius: 10, marginLeft: 8 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15 }} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
            {song.plays} plays
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Album Card
const ArtistAlbumCard = ({
  albumId,
  index,
  onPress,
}: {
  albumId: string;
  index: number;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const album = ALBUMS.find((a) => a.id === albumId);

  if (!album) return null;

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={onPress}
        style={{ marginRight: 16, width: 150 }}
      >
        <Image
          source={{ uri: album.cover }}
          style={{ width: 150, height: 150, borderRadius: 12 }}
          contentFit="cover"
        />
        <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14, marginTop: 10 }} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
          {album.year} • {album.type}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Stats Card
const StatsCard = ({
  label,
  value,
  icon,
  color,
  delay,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
  delay: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={{
        flex: 1,
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: `${color}20`,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>{label}</Text>
    </Animated.View>
  );
};

export default function ArtistDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const artistId = params.id as string;
  const { showToast } = useApp();

  const artist = getArtistById(artistId) || ARTISTS[0];
  const artistSongs = getSongsByArtist(artist.id);
  const artistAlbums = getAlbumsByArtist(artist.id);
  const [isFollowing, setIsFollowing] = useState(false);

  if (!artist) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: theme.text, fontSize: 18 }}>Artist not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Section */}
        <View style={{ height: height * 0.5, position: "relative" }}>
          <Image
            source={{ uri: artist.coverImage }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)", theme.background]}
            locations={[0, 0.6, 1]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Header */}
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
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Artist Info Overlay */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              {artist.verified && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#1d9bf0",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                    marginRight: 8,
                  }}
                >
                  <Ionicons name="checkmark-circle" size={14} color="white" />
                  <Text style={{ color: "white", fontSize: 11, fontWeight: "700", marginLeft: 4 }}>
                    VERIFIED ARTIST
                  </Text>
                </View>
              )}
            </View>
            <Text style={{ color: "white", fontSize: 36, fontWeight: "900" }}>
              {artist.name}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 }}>
              {artist.monthlyListeners} monthly listeners
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setIsFollowing(!isFollowing);
                  showToast(isFollowing ? "Unfollowed" : "Following", "success");
                }}
                style={{
                  borderWidth: 1,
                  borderColor: isFollowing ? theme.primary : theme.textSecondary,
                  backgroundColor: isFollowing ? `${theme.primary}20` : "transparent",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: isFollowing ? theme.primary : theme.text,
                    fontWeight: "700",
                    fontSize: 14,
                  }}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  borderWidth: 1,
                  borderColor: theme.border,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="ellipsis-horizontal" size={22} color={theme.text} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  showToast("Shuffle play", "info");
                }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="shuffle" size={24} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  showToast(`Playing ${artist.name}`, "info");
                }}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="play" size={28} color="white" style={{ marginLeft: 3 }} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Stats */}
          <Animated.View
            entering={FadeIn.delay(200)}
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <StatsCard
              label="Followers"
              value={artist.followers}
              icon="people"
              color={Colors.primary}
              delay={200}
            />
            <StatsCard
              label="Albums"
              value={artistAlbums.length.toString()}
              icon="disc"
              color={Colors.secondary}
              delay={250}
            />
            <StatsCard
              label="Songs"
              value={artistSongs.length.toString()}
              icon="musical-note"
              color={Colors.success}
              delay={300}
            />
          </Animated.View>

          {/* Popular Songs */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>
                Popular
              </Text>
              <TouchableOpacity>
                <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
              </TouchableOpacity>
            </View>
            {artistSongs.slice(0, 5).map((song, index) => (
              <PopularSongRow
                key={song.id}
                songId={song.id}
                index={index}
                onPlay={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push(`/musicplayer/${song.id}`);
                }}
              />
            ))}
          </Animated.View>

          {/* Albums */}
          {artistAlbums.length > 0 && (
            <Animated.View entering={FadeInDown.delay(400).springify()} style={{ marginTop: 24 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>
                  Albums
                </Text>
                <TouchableOpacity onPress={() => router.push("/albums")}>
                  <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {artistAlbums.map((album, index) => (
                  <ArtistAlbumCard
                    key={album.id}
                    albumId={album.id}
                    index={index}
                    onPress={() => router.push(`/albums/${album.id}`)}
                  />
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* About */}
          <Animated.View
            entering={FadeInDown.delay(500).springify()}
            style={{
              marginTop: 32,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 20,
              padding: 20,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
              About
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 22 }}>
              {artist.bio}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {artist.genres.map((genre) => (
                <View
                  key={genre}
                  style={{
                    backgroundColor: `${theme.primary}20`,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: theme.primary, fontSize: 12, fontWeight: "600" }}>
                    {genre}
                  </Text>
                </View>
              ))}
            </View>

            {/* Social Links */}
            {artist.socialLinks && (
              <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
                {artist.socialLinks.instagram && (
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      showToast("Opening Instagram", "info");
                    }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: "#E1306C",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="logo-instagram" size={22} color="white" />
                  </TouchableOpacity>
                )}
                {artist.socialLinks.twitter && (
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      showToast("Opening Twitter", "info");
                    }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: "#1DA1F2",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="logo-twitter" size={22} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
