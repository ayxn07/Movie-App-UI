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
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

import { Colors, SERIES } from "@/constants/data";
import { ThemeColors, useMyList, useTheme } from "@/context";
import { Series } from "@/types";

const { height, width } = Dimensions.get("window");

// Episode Card Component
const EpisodeCard = ({
  episode,
  season,
  index,
  theme,
  isDark,
  seriesImage,
}: {
  episode: number;
  season: number;
  index: number;
  theme: ThemeColors;
  isDark: boolean;
  seriesImage: string;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={SlideInRight.delay(index * 60).springify()}
      style={[animatedStyle, { marginBottom: 12 }]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <View style={{
          flexDirection: "row",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}>
          <View style={{ width: 120, height: 80, position: "relative" }}>
            <Image
              source={{ uri: seriesImage }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
            <View style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.3)",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Ionicons name="play" size={16} color="white" />
              </View>
            </View>
          </View>
          <View style={{ flex: 1, padding: 12, justifyContent: "center" }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 15 }}>
              Episode {episode}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
              S{season} E{episode} • 45 min
            </Text>
            <View style={{
              height: 4,
              backgroundColor: isDark ? "#334155" : "#e2e8f0",
              borderRadius: 2,
              marginTop: 8,
              overflow: "hidden",
            }}>
              <View style={{
                height: "100%",
                width: `${Math.random() * 100}%`,
                backgroundColor: theme.primary,
                borderRadius: 2,
              }} />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={{
              width: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="download-outline" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Action Button Component
const ActionButton = ({
  icon,
  label,
  onPress,
  theme,
  isDark,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  theme: ThemeColors;
  isDark: boolean;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => { scale.value = withSpring(0.9); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={{ alignItems: "center", padding: 12 }}
      >
        <View style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.15)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}>
          <Ionicons name={icon as any} size={24} color={theme.primary} />
        </View>
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "500" }}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function SeriesDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const seriesId = Number(params.id);
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();

  const series = SERIES.find((s) => s.id === seriesId);
  const [liked, setLiked] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);

  const inMyList = series ? isInMyList(series.id) : false;

  const handleShare = async () => {
    if (!series) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        title: series.title,
        message: `Check out "${series.title}" on MoviesHub!\n\n${series.description || "An amazing series you should watch!"}\n\n⭐ Rating: ${series.rating}/10\n🎬 ${series.genre} • ${series.seasons} Seasons`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleAddToList = () => {
    if (!series) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Convert Series to Movie format for the list
    const movieItem = {
      id: series.id,
      title: series.title,
      rating: series.rating,
      image: series.image,
      genre: series.genre,
      year: series.year,
      duration: `${series.seasons} Seasons`,
      description: series.description,
    };

    if (inMyList) {
      removeFromMyList(series.id);
      Toast.show({
        type: "success",
        text1: "Removed from My List",
        text2: `${series.title} has been removed`,
        visibilityTime: 2000,
      });
    } else {
      addToMyList(movieItem);
      Toast.show({
        type: "success",
        text1: "Added to My List",
        text2: `${series.title} has been added`,
        visibilityTime: 2000,
      });
    }
  };

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

  const episodesPerSeason = Math.ceil(series.episodes / series.seasons);

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

          {/* Play Button Overlay */}
          <Animated.View
            entering={FadeIn.delay(300)}
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              marginLeft: -40,
              marginTop: -40,
            }}
          >
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
              style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: "rgba(139, 92, 246, 0.9)",
                alignItems: "center", justifyContent: "center",
                shadowColor: "#8b5cf6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Ionicons name="play" size={36} color="white" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </Animated.View>
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
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(251, 191, 36, 0.2)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Ionicons name="star" size={16} color={Colors.star} />
                <Text style={{ color: Colors.star, fontWeight: "700", marginLeft: 6 }}>{series.rating}</Text>
              </View>
              <View style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Text style={{ color: theme.text, fontWeight: "600" }}>{series.year}</Text>
              </View>
              <View style={{
                backgroundColor: Colors.secondary,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Text style={{ color: "white", fontWeight: "700" }}>{series.seasons} Seasons</Text>
              </View>
              <View style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
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
            <ActionButton
              icon="download-outline"
              label="Download"
              onPress={() => {
                Toast.show({
                  type: "info",
                  text1: "Downloading Season 1",
                  text2: "Your download has started",
                  visibilityTime: 2000,
                });
              }}
              theme={theme}
              isDark={isDark}
            />
            <ActionButton
              icon={inMyList ? "checkmark" : "add"}
              label={inMyList ? "In List" : "My List"}
              onPress={handleAddToList}
              theme={theme}
              isDark={isDark}
            />
            <ActionButton icon="share-social-outline" label="Share" onPress={handleShare} theme={theme} isDark={isDark} />
            <ActionButton icon="chatbubble-outline" label="Reviews" onPress={() => router.push(`/reviews/${seriesId}`)} theme={theme} isDark={isDark} />
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 12 }}>
              About
            </Text>
            <Text style={{
              color: theme.textSecondary,
              fontSize: 15,
              lineHeight: 24,
              marginBottom: 24,
            }}>
              {series.description || "No description available."}
            </Text>
          </Animated.View>

          {/* Season Selector */}
          <Animated.View entering={FadeInUp.delay(250).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 16 }}>
              Episodes
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 16 }}
            >
              {[...Array(series.seasons)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedSeason(index + 1);
                  }}
                  style={{ marginRight: 12 }}
                >
                  <View style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 16,
                    backgroundColor: selectedSeason === index + 1 ? theme.primary : theme.card,
                  }}>
                    <Text style={{
                      color: selectedSeason === index + 1 ? "white" : theme.textSecondary,
                      fontWeight: "700",
                      fontSize: 14,
                    }}>
                      Season {index + 1}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Episodes List */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            {[...Array(episodesPerSeason)].map((_, index) => (
              <EpisodeCard
                key={index}
                episode={index + 1}
                season={selectedSeason}
                index={index}
                theme={theme}
                isDark={isDark}
                seriesImage={series.image}
              />
            ))}
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
          style={{ width: "100%" }}
          activeOpacity={0.9}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
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
